import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helpers';
import { getNeonSql } from '@/lib/database-config';

function categorizeExpense(description: string, vendor?: string, amount?: number): { category: string; subcategory?: string } {
  const text = `${description} ${vendor || ''}`.toLowerCase();

  if (text.match(/flight|airline|uber|lyft|taxi|hotel|motel|airbnb|booking|travel|train|bus|metro|parking|gas|fuel|petrol|diesel/)) {
    if (text.match(/uber|lyft|taxi/)) return { category: 'Travel', subcategory: 'Ride Sharing' };
    if (text.match(/hotel|motel|airbnb/)) return { category: 'Travel', subcategory: 'Lodging' };
    if (text.match(/flight|airline/)) return { category: 'Travel', subcategory: 'Flights' };
    if (text.match(/gas|fuel|petrol|diesel/)) return { category: 'Travel', subcategory: 'Fuel' };
    if (text.match(/parking/)) return { category: 'Travel', subcategory: 'Parking' };
    return { category: 'Travel', subcategory: 'Transportation' };
  }

  if (text.match(/restaurant|cafe|coffee|starbucks|mcdonald|pizza|burger|sushi|food|lunch|dinner|breakfast|grocery|supermarket|walmart|costco|whole foods/)) {
    if (text.match(/grocery|supermarket|walmart|costco/)) return { category: 'Food', subcategory: 'Groceries' };
    if (text.match(/coffee|starbucks|cafe/)) return { category: 'Food', subcategory: 'Coffee' };
    return { category: 'Food', subcategory: 'Dining' };
  }

  if (text.match(/office|desk|chair|computer|laptop|monitor|keyboard|mouse|printer|paper|pen|supplies|ikea|staples/)) {
    if (text.match(/computer|laptop|monitor|keyboard|mouse/)) return { category: 'Equipment', subcategory: 'Hardware' };
    if (text.match(/printer|paper|pen|supplies/)) return { category: 'Office', subcategory: 'Supplies' };
    return { category: 'Office', subcategory: 'Furniture' };
  }

  if (text.match(/software|subscription|saaS|monthly|annual|license|adobe|microsoft|google|aws|azure|domain|hosting|server/)) {
    if (text.match(/domain|hosting|server|aws|azure/)) return { category: 'Software', subcategory: 'Infrastructure' };
    return { category: 'Software', subcategory: 'Subscription' };
  }

  if (text.match(/marketing|advertising|ad|facebook|google ads|instagram|linkedin|twitter|social media|seo|sem/)) {
    return { category: 'Marketing', subcategory: 'Advertising' };
  }

  if (text.match(/legal|attorney|lawyer|consultant|accountant|tax|audit|insurance/)) {
    if (text.match(/legal|attorney|lawyer/)) return { category: 'Professional', subcategory: 'Legal' };
    if (text.match(/accountant|tax|audit/)) return { category: 'Professional', subcategory: 'Accounting' };
    if (text.match(/insurance/)) return { category: 'Professional', subcategory: 'Insurance' };
    return { category: 'Professional', subcategory: 'Consulting' };
  }

  return { category: 'Other', subcategory: 'General' };
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = getNeonSql();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let expenses: any[];
    if (category) {
      expenses = await sql`SELECT * FROM expenses WHERE userid = ${user.id} AND category = ${category} ORDER BY date DESC`;
    } else {
      expenses = await sql`SELECT * FROM expenses WHERE userid = ${user.id} ORDER BY date DESC`;
    }

    return NextResponse.json((expenses || []).map(transformExpense));
  } catch (error) {
    console.error('Get expenses error:', error);
    return NextResponse.json(([]).map(transformExpense));
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

    if (!data.description || !data.amount) {
      return NextResponse.json({
        error: 'Description and amount are required'
      }, { status: 400 });
    }

    const amount = parseFloat(data.amount);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({
        error: 'Please enter a valid amount greater than 0'
      }, { status: 400 });
    }

    const autoCategory = categorizeExpense(data.description, data.vendor, amount);
    const category = data.category || autoCategory.category;
    const subcategory = data.subcategory || autoCategory.subcategory;
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const result = await sql`
      INSERT INTO expenses (
        id, userid, description, amount, date, category, subcategory, vendor, paymentmethod, receipturl, notes, isrecurring, createdat, updatedat
      ) VALUES (
        ${id}, ${user.id}, ${data.description.trim()}, ${amount}, ${data.date || now.split('T')[0]}, ${category}, ${subcategory || null}, ${data.vendor?.trim() || null}, ${data.paymentMethod || null}, ${data.receiptUrl || null}, ${data.notes?.trim() || null}, ${data.isRecurring ?? false}, ${now}, ${now}
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      expense: transformExpense(result[0]),
      message: 'Expense created successfully'
    });
  } catch (error) {
    console.error('Create expense error:', error);
    return NextResponse.json({
      error: 'Failed to create expense',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function transformExpense(data: any): any {
  if (!data) return null;
  return {
    id: data.id,
    userId: data.userid,
    description: data.description,
    amount: parseFloat(data.amount || 0),
    date: data.date,
    category: data.category,
    subcategory: data.subcategory,
    vendor: data.vendor,
    paymentMethod: data.paymentmethod,
    receiptUrl: data.receipturl,
    notes: data.notes,
    isRecurring: data.isrecurring,
    createdAt: data.createdat,
    updatedAt: data.updatedat,
  };
}
