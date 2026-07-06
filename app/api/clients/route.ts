import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, getSupabaseClient } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const supabase = getSupabaseClient(token);

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('userid', user.id)
      .order('createdat', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
      return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
    }

    return NextResponse.json((data || []).map(transformClient));
  } catch (error) {
    console.error('Get clients error:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
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
    if (!data.name || !data.email) {
      return NextResponse.json({
        error: 'Name and email are required'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({
        error: 'Please enter a valid email address'
      }, { status: 400 });
    }

    // Check if client with this email already exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('userid', user.id)
      .eq('email', data.email.toLowerCase())
      .maybeSingle();

    if (existingClient) {
      return NextResponse.json({
        error: 'A client with this email already exists'
      }, { status: 409 });
    }

    const newClient = {
      userid: user.id,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      company: data.company?.trim() || null,
      address: data.address?.trim() || '',
      gstnumber: data.gstNumber?.trim() || null,
      currency: data.currency || 'USD',
      isactive: true,
    };

    const { data: client, error } = await supabase
      .from('clients')
      .insert([newClient])
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      client: transformClient(client),
      message: 'Client created successfully'
    });
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json({
      error: 'Failed to create client',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function transformClient(data: any): any {
  return {
    id: data.id,
    userId: data.userid,
    name: data.name,
    email: data.email,
    company: data.company,
    address: data.address,
    gstNumber: data.gstnumber,
    currency: data.currency,
    isActive: data.isactive,
    createdAt: data.createdat,
    updatedAt: data.updatedat,
  };
}
