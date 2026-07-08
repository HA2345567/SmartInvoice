import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, getSupabaseClient } from '@/lib/auth-helpers';

// AI-powered proposal generation
function generateAISummary(title: string, clientName: string, items: any[], amount: number): string {
  const itemDescriptions = items.map(i => i.description || 'Item').slice(0, 3).join(', ');
  const itemsText = items.length > 3 ? `${itemDescriptions}, and ${items.length - 3} more items` : itemDescriptions;

  return `This proposal for ${clientName} covers ${itemsText}. The total investment of $${amount.toFixed(2)} includes all deliverables outlined in the scope. Recommended acceptance timeline: 14 days to ensure availability.`;
}

function generateAISuggestions(clientName: string, items: any[], amount: number, validDays: number): string[] {
  const suggestions: string[] = [];

  if (amount < 500) {
    suggestions.push('Consider adding a premium tier option to increase deal value');
  }

  if (items.length < 3) {
    suggestions.push('Add more line items or bundled services to increase perceived value');
  }

  if (validDays > 30) {
    suggestions.push('Shorter validity period (14-21 days) creates urgency and improves close rate');
  }

  if (validDays < 7) {
    suggestions.push('Extend validity period to give client adequate review time');
  }

  suggestions.push('Include case studies or testimonials relevant to ' + clientName);
  suggestions.push('Add a timeline/roadmap section to clarify delivery milestones');

  return suggestions;
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const supabase = getSupabaseClient(token);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('proposals')
      .select('*')
      .eq('userid', user.id)
      .order('createdat', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching proposals:', error);
      return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
    }

    // Calculate summary statistics
    const totalAmount = data?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
    const acceptedCount = data?.filter((p: any) => p.status === 'accepted').length || 0;
    const pendingCount = data?.filter((p: any) => ['sent', 'viewed'].includes(p.status)).length || 0;
    const winRate = data && data.length > 0
      ? (acceptedCount / (acceptedCount + (data.filter((p: any) => p.status === 'declined').length || 0))) * 100
      : 0;

    return NextResponse.json({
      proposals: (data || []).map(transformProposal),
      summary: {
        total: totalAmount,
        count: data?.length || 0,
        accepted: acceptedCount,
        pending: pendingCount,
        winRate: winRate.toFixed(1),
      },
    });
  } catch (error) {
    console.error('Get proposals error:', error);
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const supabase = getSupabaseClient(token);

    const data = await request.json();

    // Validate required fields
    if (!data.clientName || !data.clientEmail || !data.title) {
      return NextResponse.json({
        error: 'Client name, email, and title are required'
      }, { status: 400 });
    }

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({
        error: 'At least one proposal item is required'
      }, { status: 400 });
    }

    // Validate and prepare items
    const validatedItems = data.items.map((item: any, index: number) => ({
      id: item.id || `item_${index + 1}`,
      description: item.description || '',
      quantity: parseFloat(item.quantity) || 1,
      rate: parseFloat(item.rate) || 0,
      amount: parseFloat(item.amount) || (parseFloat(item.quantity) || 1) * (parseFloat(item.rate) || 0)
    }));

    // Calculate amounts
    const subtotal = validatedItems.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
    const discountRate = parseFloat(data.discountRate) || 0;
    const taxRate = parseFloat(data.taxRate) || 0;

    const discountAmount = discountRate ? (subtotal * discountRate) / 100 : 0;
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = taxRate ? (subtotalAfterDiscount * taxRate) / 100 : 0;
    const amount = subtotalAfterDiscount + taxAmount;

    // Generate proposal number
    const proposalNum = `PROP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Calculate valid until date
    const date = data.date || new Date().toISOString().split('T')[0];
    const validDays = data.validDays || 30;
    const validUntil = data.validUntil || new Date(Date.now() + validDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Generate AI summary and suggestions if requested
    let aiSummary = data.aiSummary;
    let aiSuggestions = data.aiSuggestions;
    if (data.generateAI) {
      aiSummary = generateAISummary(data.title, data.clientName, validatedItems, amount);
      aiSuggestions = generateAISuggestions(data.clientName, validatedItems, amount, validDays);
    }

    const newProposal = {
      userid: user.id,
      proposalnum: proposalNum,
      clientid: data.clientId || null,
      clientname: data.clientName,
      clientemail: data.clientEmail.toLowerCase(),
      clientcompany: data.clientCompany || null,
      title: data.title,
      description: data.description || null,
      items: validatedItems,
      subtotal,
      discountamount: discountAmount,
      taxamount: taxAmount,
      amount,
      taxrate: taxRate,
      discountrate: discountRate,
      currency: data.currency || 'USD',
      status: data.status || 'draft',
      date,
      validuntil: validUntil,
      terms: data.terms || null,
      notes: data.notes || null,
      aisummary: aiSummary,
      aisuggestions: aiSuggestions,
    };

    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert([newProposal])
      .select()
      .single();

    if (error) {
      console.error('Error creating proposal:', error);
      return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      proposal: transformProposal(proposal),
      message: 'Proposal created successfully',
    });
  } catch (error) {
    console.error('Create proposal error:', error);
    return NextResponse.json({
      error: 'Failed to create proposal',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const supabase = getSupabaseClient(token);

    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: 'Proposal ID is required' }, { status: 400 });
    }

    const updateData: Record<string, any> = {
      updatedat: new Date().toISOString(),
    };

    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === 'accepted') {
        updateData.acceptedat = new Date().toISOString();
      }
      if (data.status === 'viewed') {
        updateData.viewedat = new Date().toISOString();
      }
    }
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.items !== undefined) updateData.items = data.items;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.subtotal !== undefined) updateData.subtotal = data.subtotal;
    if (data.validuntil !== undefined) updateData.validuntil = data.validuntil;
    if (data.terms !== undefined) updateData.terms = data.terms;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.aiSummary !== undefined) updateData.aisummary = data.aiSummary;
    if (data.aiSuggestions !== undefined) updateData.aisuggestions = data.aiSuggestions;

    const { error } = await supabase
      .from('proposals')
      .update(updateData)
      .eq('id', data.id)
      .eq('userid', user.id);

    if (error) {
      console.error('Error updating proposal:', error);
      return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Proposal updated successfully' });
  } catch (error) {
    console.error('Update proposal error:', error);
    return NextResponse.json({ error: 'Failed to update proposal' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const supabase = getSupabaseClient(token);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Proposal ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id)
      .eq('userid', user.id);

    if (error) {
      console.error('Error deleting proposal:', error);
      return NextResponse.json({ error: 'Failed to delete proposal' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Proposal deleted successfully' });
  } catch (error) {
    console.error('Delete proposal error:', error);
    return NextResponse.json({ error: 'Failed to delete proposal' }, { status: 500 });
  }
}

function transformProposal(data: any): any {
  return {
    id: data.id,
    userId: data.userid,
    proposalNum: data.proposalnum,
    clientId: data.clientid,
    clientName: data.clientname,
    clientEmail: data.clientemail,
    clientCompany: data.clientcompany,
    title: data.title,
    description: data.description,
    items: data.items,
    subtotal: Number(data.subtotal),
    discountAmount: Number(data.discountamount),
    taxAmount: Number(data.taxamount),
    amount: Number(data.amount),
    taxRate: Number(data.taxrate),
    discountRate: Number(data.discountrate),
    currency: data.currency,
    status: data.status,
    date: data.date,
    validUntil: data.validuntil,
    terms: data.terms,
    notes: data.notes,
    aiSummary: data.aisummary,
    aiSuggestions: data.aisuggestions,
    acceptedAt: data.acceptedat,
    viewedAt: data.viewedat,
    createdAt: data.createdat,
    updatedAt: data.updatedat,
  };
}
