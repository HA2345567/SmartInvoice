import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helpers';
import { getNeonSql } from '@/lib/database-config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

function transformProposal(data: any): any {
  if (!data) return null;
  let items = data.items;
  if (typeof items === 'string') {
    try { items = JSON.parse(items); } catch (e) { items = []; }
  }
  let aiSuggestions = data.aisuggestions;
  if (typeof aiSuggestions === 'string') {
    try { aiSuggestions = JSON.parse(aiSuggestions); } catch (e) { aiSuggestions = []; }
  }

  const validDays = parseInt(data.validuntildays) || 30;
  const createdDate = data.date ? new Date(data.date) : new Date(data.createdat || Date.now());
  const validUntilDate = new Date(createdDate.getTime() + validDays * 24 * 60 * 60 * 1000);
  const validUntil = !isNaN(validUntilDate.getTime()) ? validUntilDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

  const proposalNumber = data.proposalnumber || `PROP-${data.id?.slice(0, 6) || '001'}`;

  return {
    id: data.id,
    userId: data.userid,
    proposalNumber: proposalNumber,
    proposalNum: proposalNumber,
    title: data.title || 'Untitled Proposal',
    clientName: data.clientname || 'Valued Client',
    clientEmail: data.clientemail || '',
    clientCompany: data.clientcompany || '',
    clientAddress: data.clientaddress || '',
    amount: parseFloat(data.amount || 0),
    status: data.status || 'draft',
    date: data.date || (data.createdat ? data.createdat.split('T')[0] : new Date().toISOString().split('T')[0]),
    validUntil,
    validUntilDays: validDays,
    validDays,
    items: Array.isArray(items) ? items : [],
    scope: data.scope || '',
    terms: data.terms || '',
    aiSummary: data.aisummary || '',
    aiSuggestions: Array.isArray(aiSuggestions) ? aiSuggestions : [],
    createdAt: data.createdat,
    updatedAt: data.updatedat,
  };
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = getNeonSql();
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    let proposals: any[];
    if (statusFilter && statusFilter !== 'all') {
      proposals = await sql`SELECT * FROM proposals WHERE userid = ${user.id} AND status = ${statusFilter} ORDER BY createdat DESC`;
    } else {
      proposals = await sql`SELECT * FROM proposals WHERE userid = ${user.id} ORDER BY createdat DESC`;
    }

    const transformed = (proposals || []).map(transformProposal);
    const total = transformed.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    const count = transformed.length;
    const accepted = transformed.filter((p: any) => p.status === 'accepted').length;
    const pending = transformed.filter((p: any) => ['draft', 'sent', 'viewed'].includes(p.status)).length;
    const winRate = count > 0 ? Math.round((accepted / count) * 100).toString() : '0';

    const summary = {
      total,
      count,
      accepted,
      pending,
      winRate,
    };

    return NextResponse.json({
      proposals: transformed,
      summary,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Get proposals error:', error);
    return NextResponse.json({
      proposals: [],
      summary: { total: 0, count: 0, accepted: 0, pending: 0, winRate: '0' },
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = getNeonSql();
    const data = await request.json();

    if (!data.title || !data.clientName || !data.clientEmail) {
      return NextResponse.json({
        error: 'Title, client name, and client email are required'
      }, { status: 400 });
    }

    const validatedItems = (data.items || []).map((item: any, index: number) => ({
      id: item.id || `item_${index + 1}`,
      description: item.description || '',
      quantity: parseFloat(item.quantity) || 1,
      rate: parseFloat(item.rate) || 0,
      amount: parseFloat(item.amount) || (parseFloat(item.quantity) || 1) * (parseFloat(item.rate) || 0)
    }));

    const amount = validatedItems.reduce((sum: number, item: any) => sum + item.amount, 0);
    const validUntilDays = parseInt(data.validDays || data.validUntilDays) || 30;

    const proposalNumber = data.proposalNumber || data.proposalNum || `PROP-${Date.now().toString().slice(-6)}`;
    const aiSummary = data.aiSummary || generateAISummary(data.title, data.clientName, validatedItems, amount);
    const aiSuggestions = generateAISuggestions(data.clientName, validatedItems, amount, validUntilDays);
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const result = await sql`
      INSERT INTO proposals (
        id, userid, proposalnumber, title, clientname, clientemail, clientcompany, clientaddress, amount, status, date, validuntildays, items, scope, terms, aisummary, aisuggestions, createdat, updatedat
      ) VALUES (
        ${id}, ${user.id}, ${proposalNumber}, ${data.title}, ${data.clientName}, ${data.clientEmail.toLowerCase()}, ${data.clientCompany || null}, ${data.clientAddress || ''}, ${amount}, ${data.status || 'draft'}, ${data.date || now.split('T')[0]}, ${validUntilDays}, ${JSON.stringify(validatedItems)}, ${data.scope || null}, ${data.terms || null}, ${aiSummary}, ${JSON.stringify(aiSuggestions)}, ${now}, ${now}
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      proposal: transformProposal(result[0]),
      message: 'Proposal created successfully'
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

    const sql = getNeonSql();
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: 'Proposal ID is required' }, { status: 400 });
    }

    const existing = await sql`SELECT * FROM proposals WHERE userid = ${user.id} AND id = ${data.id} LIMIT 1`;
    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    const current = existing[0];

    const newStatus = data.status || current.status;
    const newTitle = data.title || current.title;
    const newClientName = data.clientName || current.clientname;
    const newClientEmail = data.clientEmail ? data.clientEmail.toLowerCase() : current.clientemail;
    const newCompany = data.clientCompany !== undefined ? data.clientCompany : current.clientcompany;
    const newAddress = data.clientAddress !== undefined ? data.clientAddress : current.clientaddress;
    const newScope = data.scope !== undefined ? data.scope : current.scope;
    const newTerms = data.terms !== undefined ? data.terms : current.terms;

    let newItems = current.items;
    let newAmount = current.amount;
    if (data.items) {
      const validated = (data.items || []).map((item: any, index: number) => ({
        id: item.id || `item_${index + 1}`,
        description: item.description || '',
        quantity: parseFloat(item.quantity) || 1,
        rate: parseFloat(item.rate) || 0,
        amount: parseFloat(item.amount) || (parseFloat(item.quantity) || 1) * (parseFloat(item.rate) || 0)
      }));
      newItems = JSON.stringify(validated);
      newAmount = validated.reduce((sum: number, i: any) => sum + i.amount, 0);
    }

    const updated = await sql`
      UPDATE proposals
      SET status = ${newStatus},
          title = ${newTitle},
          clientname = ${newClientName},
          clientemail = ${newClientEmail},
          clientcompany = ${newCompany},
          clientaddress = ${newAddress},
          items = ${newItems},
          amount = ${newAmount},
          scope = ${newScope},
          terms = ${newTerms},
          updatedat = ${now}
      WHERE userid = ${user.id} AND id = ${data.id}
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      proposal: transformProposal(updated[0]),
      message: 'Proposal updated successfully'
    });
  } catch (error) {
    console.error('Update proposal error:', error);
    return NextResponse.json({
      error: 'Failed to update proposal',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = getNeonSql();
    let id = request.nextUrl.searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch {}
    }

    if (!id) {
      return NextResponse.json({ error: 'Proposal ID is required' }, { status: 400 });
    }

    const deleted = await sql`
      DELETE FROM proposals
      WHERE userid = ${user.id} AND id = ${id}
      RETURNING id
    `;

    if (!deleted || deleted.length === 0) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Proposal deleted successfully'
    });
  } catch (error) {
    console.error('Delete proposal error:', error);
    return NextResponse.json({
      error: 'Failed to delete proposal',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
