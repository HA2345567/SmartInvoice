import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helpers';
import { getNeonSql } from '@/lib/database-config';

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

    const sql = getNeonSql();
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    let proposals: any[];
    if (statusFilter) {
      proposals = await sql`SELECT * FROM proposals WHERE userid = ${user.id} AND status = ${statusFilter} ORDER BY createdat DESC`;
    } else {
      proposals = await sql`SELECT * FROM proposals WHERE userid = ${user.id} ORDER BY createdat DESC`;
    }

    return NextResponse.json((proposals || []).map(transformProposal));
  } catch (error) {
    console.error('Get proposals error:', error);
    return NextResponse.json(([]).map(transformProposal));
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
    const validUntilDays = parseInt(data.validUntilDays) || 30;

    const proposalNumber = data.proposalNumber || `PROP-${Date.now().toString().slice(-6)}`;
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
  return {
    id: data.id,
    userId: data.userid,
    proposalNumber: data.proposalnumber,
    title: data.title,
    clientName: data.clientname,
    clientEmail: data.clientemail,
    clientCompany: data.clientcompany,
    clientAddress: data.clientaddress,
    amount: parseFloat(data.amount || 0),
    status: data.status,
    date: data.date,
    validUntilDays: data.validuntildays,
    items: Array.isArray(items) ? items : [],
    scope: data.scope,
    terms: data.terms,
    aiSummary: data.aisummary,
    aiSuggestions: Array.isArray(aiSuggestions) ? aiSuggestions : [],
    createdAt: data.createdat,
    updatedAt: data.updatedat,
  };
}
