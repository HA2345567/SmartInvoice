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

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    let query = supabase
      .from('invoices')
      .select('*')
      .eq('userid', user.id)
      .order('createdat', { ascending: false });

    if (clientId) {
      query = query.eq('clientid', clientId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching invoices:', error);
      return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
    }

    return NextResponse.json((data || []).map(transformInvoice));
  } catch (error) {
    console.error('Get invoices error:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
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
    if (!data.clientName || !data.clientEmail) {
      return NextResponse.json({
        error: 'Client name and email are required'
      }, { status: 400 });
    }

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({
        error: 'At least one invoice item is required'
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

    // Generate invoice number
    const invoiceNumber = data.invoiceNumber || `INV-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Get or create client
    let clientId = data.clientId;
    if (!clientId && data.clientEmail) {
      const { data: existingClient } = await supabase
        .from('clients')
        .select('id')
        .eq('userid', user.id)
        .eq('email', data.clientEmail.toLowerCase())
        .maybeSingle();

      if (existingClient) {
        clientId = existingClient.id;
      } else {
        const { data: newClient } = await supabase
          .from('clients')
          .insert([{
            userid: user.id,
            name: data.clientName,
            email: data.clientEmail.toLowerCase(),
            company: data.clientCompany || null,
            address: data.clientAddress || '',
            currency: data.clientCurrency || 'USD',
          }])
          .select()
          .single();

        if (newClient) {
          clientId = newClient.id;
        }
      }
    }

    const newInvoice = {
      userid: user.id,
      invoicenumber: invoiceNumber,
      clientid: clientId,
      clientname: data.clientName,
      clientemail: data.clientEmail?.toLowerCase(),
      clientcompany: data.clientCompany || null,
      clientaddress: data.clientAddress || '',
      clientgst: data.clientGst || null,
      clientcurrency: data.clientCurrency || 'USD',
      amount,
      subtotal,
      taxamount: taxAmount,
      discountamount: discountAmount,
      status: data.status || 'draft',
      date: data.date || new Date().toISOString().split('T')[0],
      duedate: data.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: validatedItems,
      notes: data.notes || null,
      terms: data.terms || null,
      taxrate: taxRate,
      discountrate: discountRate,
      emailsent: false,
      reminderssent: 0,
    };

    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert([newInvoice])
      .select()
      .single();

    if (error) {
      console.error('Error creating invoice:', error);
      return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      invoice: transformInvoice(invoice),
      message: 'Invoice created successfully'
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json({
      error: 'Failed to create invoice',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function transformInvoice(data: any): any {
  return {
    id: data.id,
    userId: data.userid,
    invoiceNumber: data.invoicenumber,
    clientId: data.clientid,
    clientName: data.clientname,
    clientEmail: data.clientemail,
    clientCompany: data.clientcompany,
    clientAddress: data.clientaddress,
    clientGst: data.clientgst,
    clientCurrency: data.clientcurrency,
    amount: data.amount,
    subtotal: data.subtotal,
    taxAmount: data.taxamount,
    discountAmount: data.discountamount,
    status: data.status,
    date: data.date,
    dueDate: data.duedate,
    paidDate: data.paiddate,
    paymentMethod: data.paymentmethod,
    paymentNotes: data.paymentnotes,
    items: data.items,
    notes: data.notes,
    terms: data.terms,
    taxRate: data.taxrate,
    discountRate: data.discountrate,
    paymentLink: data.paymentlink,
    emailSent: data.emailsent,
    remindersSent: data.reminderssent,
    lastReminderSent: data.lastreminderssent,
    createdAt: data.createdat,
    updatedAt: data.updatedat,
  };
}
