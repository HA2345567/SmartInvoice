import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, getSupabaseClient } from '@/lib/auth-helpers';

// AI-powered expense categorization
function categorizeExpense(description: string, vendor?: string, amount?: number): { category: string; subcategory?: string } {
  const text = `${description} ${vendor || ''}`.toLowerCase();

  // Travel & Transportation
  if (text.match(/flight|airline|uber|lyft|taxi|hotel|motel|airbnb|booking|travel|train|bus|metro|parking|gas|fuel|petrol|diesel/)) {
    if (text.match(/uber|lyft|taxi/)) return { category: 'Travel', subcategory: 'Ride Sharing' };
    if (text.match(/hotel|motel|airbnb/)) return { category: 'Travel', subcategory: 'Lodging' };
    if (text.match(/flight|airline/)) return { category: 'Travel', subcategory: 'Flights' };
    if (text.match(/gas|fuel|petrol|diesel/)) return { category: 'Travel', subcategory: 'Fuel' };
    if (text.match(/parking/)) return { category: 'Travel', subcategory: 'Parking' };
    return { category: 'Travel', subcategory: 'Transportation' };
  }

  // Food & Dining
  if (text.match(/restaurant|cafe|coffee|starbucks|mcdonald|pizza|burger|sushi|food|lunch|dinner|breakfast|grocery|supermarket|walmart|costco|whole foods/)) {
    if (text.match(/grocery|supermarket|walmart|costco/)) return { category: 'Food', subcategory: 'Groceries' };
    if (text.match(/coffee|starbucks|cafe/)) return { category: 'Food', subcategory: 'Coffee' };
    return { category: 'Food', subcategory: 'Dining' };
  }

  // Office & Equipment
  if (text.match(/office|desk|chair|computer|laptop|monitor|keyboard|mouse|printer|paper|pen|supplies|ikea|staples/)) {
    if (text.match(/computer|laptop|monitor|keyboard|mouse/)) return { category: 'Equipment', subcategory: 'Hardware' };
    if (text.match(/printer|paper|pen|supplies/)) return { category: 'Office', subcategory: 'Supplies' };
    return { category: 'Office', subcategory: 'Furniture' };
  }

  // Software & Subscriptions
  if (text.match(/software|subscription|saaS|monthly|annual|license|adobe|microsoft|google|aws|azure|domain|hosting|server/)) {
    if (text.match(/domain|hosting|server|aws|azure/)) return { category: 'Software', subcategory: 'Infrastructure' };
    return { category: 'Software', subcategory: 'Subscription' };
  }

  // Marketing & Advertising
  if (text.match(/marketing|advertising|ad|facebook|google ads|instagram|linkedin|twitter|social media|seo|sem/)) {
    return { category: 'Marketing', subcategory: 'Advertising' };
  }

  // Professional Services
  if (text.match(/legal|attorney|lawyer|consultant|accountant|tax|audit|insurance/)) {
    if (text.match(/legal|attorney|lawyer/)) return { category: 'Professional', subcategory: 'Legal' };
    if (text.match(/accountant|tax|audit/)) return { category: 'Professional', subcategory: 'Accounting' };
    if (text.match(/insurance/)) return { category: 'Professional', subcategory: 'Insurance' };
    return { category: 'Professional', subcategory: 'Consulting' };
  }

  // Utilities & Bills
  if (text.match(/electric|water|internet|phone|mobile|utility|bill/)) {
    return { category: 'Utilities', subcategory: 'Bills' };
  }

  // Entertainment
  if (text.match(/movie|netflix|spotify|hulu|disney|game|entertainment|event|ticket/)) {
    return { category: 'Entertainment', subcategory: 'Subscriptions' };
  }

  // Healthcare
  if (text.match(/medical|hospital|pharmacy|doctor|health|dental|vision|medicine/)) {
    return { category: 'Healthcare', subcategory: 'Medical' };
  }

  // Education
  if (text.match(/course|training|education|book|learning|udemy|coursera|lynda/)) {
    return { category: 'Education', subcategory: 'Training' };
  }

  // Freelancer/Contractor Payments
  if (amount && amount > 100 && text.match(/freelance|contractor|payment|service/)) {
    return { category: 'Contractors', subcategory: 'Services' };
  }

  // Default
  return { category: 'Other', subcategory: undefined };
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
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = supabase
      .from('expenses')
      .select('*')
      .eq('userid', user.id)
      .order('date', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching expenses:', error);
      return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
    }

    // Calculate summary statistics
    const totalAmount = data?.reduce((sum: number, exp: any) => sum + Number(exp.amount), 0) || 0;
    const categoryBreakdown: { [key: string]: number } = {};
    data?.forEach((exp: any) => {
      categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + Number(exp.amount);
    });

    return NextResponse.json({
      expenses: (data || []).map(transformExpense),
      summary: {
        total: totalAmount,
        count: data?.length || 0,
        categoryBreakdown,
      },
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
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
    if (!data.description || !data.amount || !data.date) {
      return NextResponse.json({
        error: 'Description, amount, and date are required'
      }, { status: 400 });
    }

    // AI categorization if not provided
    let category = data.category;
    let subcategory = data.subcategory;
    let aiCategorized = false;

    if (!category) {
      const categorization = categorizeExpense(data.description, data.vendor, data.amount);
      category = categorization.category;
      subcategory = categorization.subcategory;
      aiCategorized = true;
    }

    const newExpense = {
      userid: user.id,
      description: data.description.trim(),
      amount: parseFloat(data.amount),
      currency: data.currency || 'USD',
      category,
      subcategory,
      date: data.date,
      vendor: data.vendor?.trim() || null,
      receipt_url: data.receiptUrl || null,
      notes: data.notes?.trim() || null,
      is_recurring: data.isRecurring || false,
      recurring_frequency: data.recurringFrequency || null,
      tags: data.tags || [],
      aicategorized: aiCategorized,
    };

    const { data: expense, error } = await supabase
      .from('expenses')
      .insert([newExpense])
      .select()
      .single();

    if (error) {
      console.error('Error creating expense:', error);
      return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      expense: transformExpense(expense),
      aiCategorized,
      message: aiCategorized
        ? `Expense auto-categorized as "${category}"${subcategory ? ` / "${subcategory}"` : ''}`
        : 'Expense created successfully',
    });
  } catch (error) {
    console.error('Create expense error:', error);
    return NextResponse.json({
      error: 'Failed to create expense',
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
      return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
    }

    const updateData: Record<string, any> = {
      updatedat: new Date().toISOString(),
    };

    if (data.description !== undefined) updateData.description = data.description;
    if (data.amount !== undefined) updateData.amount = parseFloat(data.amount);
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.subcategory !== undefined) updateData.subcategory = data.subcategory;
    if (data.date !== undefined) updateData.date = data.date;
    if (data.vendor !== undefined) updateData.vendor = data.vendor;
    if (data.receiptUrl !== undefined) updateData.receipt_url = data.receiptUrl;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.isRecurring !== undefined) updateData.is_recurring = data.isRecurring;
    if (data.recurringFrequency !== undefined) updateData.recurring_frequency = data.recurringFrequency;
    if (data.tags !== undefined) updateData.tags = data.tags;

    const { error } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', data.id)
      .eq('userid', user.id);

    if (error) {
      console.error('Error updating expense:', error);
      return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Expense updated successfully' });
  } catch (error) {
    console.error('Update expense error:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
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
      return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('userid', user.id);

    if (error) {
      console.error('Error deleting expense:', error);
      return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}

function transformExpense(data: any): any {
  return {
    id: data.id,
    userId: data.userid,
    description: data.description,
    amount: Number(data.amount),
    currency: data.currency,
    category: data.category,
    subcategory: data.subcategory,
    date: data.date,
    vendor: data.vendor,
    receiptUrl: data.receipt_url,
    notes: data.notes,
    isRecurring: data.is_recurring,
    recurringFrequency: data.recurring_frequency,
    tags: data.tags,
    aiCategorized: data.aicategorized,
    createdAt: data.createdat,
    updatedAt: data.updatedat,
  };
}
