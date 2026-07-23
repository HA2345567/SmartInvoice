import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helpers';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId');

    let invoices = await DatabaseService.getInvoices(user.id);

    if (clientId) {
      invoices = invoices.filter((inv: any) => inv.clientId === clientId);
    }

    return NextResponse.json(invoices);
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
    const invoiceNumber = data.invoiceNumber || DatabaseService.generateInvoiceNumber(user.id);

    const invoice = await DatabaseService.createInvoice(user.id, {
      ...data,
      invoiceNumber,
      items: validatedItems,
      subtotal,
      discountAmount,
      taxAmount,
      amount,
      discountRate,
      taxRate,
      status: data.status || 'draft',
      date: data.date || new Date().toISOString().split('T')[0],
      dueDate: data.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    return NextResponse.json({
      success: true,
      invoice,
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
