import { NextRequest, NextResponse } from 'next/server';
import { getAuthUserOrGuest } from '@/lib/auth-helpers';
import { PremiumPDFGenerator } from '@/lib/pdf-generator';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUserOrGuest(request);

    const invoiceData = await request.json();

    const generator = new PremiumPDFGenerator();
    const pdfBuffer = generator.generatePDF({
      invoiceNumber: invoiceData.invoiceNumber,
      date: invoiceData.date,
      dueDate: invoiceData.dueDate,
      clientName: invoiceData.clientName,
      clientEmail: invoiceData.clientEmail,
      clientCompany: invoiceData.clientCompany,
      clientAddress: invoiceData.clientAddress,
      clientGST: invoiceData.clientGST,
      clientCurrency: invoiceData.clientCurrency,
      items: invoiceData.items,
      notes: invoiceData.notes,
      terms: invoiceData.terms,
      subtotal: invoiceData.subtotal,
      taxAmount: invoiceData.taxAmount,
      discountAmount: invoiceData.discountAmount,
      amount: invoiceData.amount,
      taxRate: invoiceData.taxRate,
      discountRate: invoiceData.discountRate,
      paymentLink: invoiceData.paymentLink,
      companyName: user.company || 'SmartInvoice',
      companyAddress: user.companyAddress || 'Your Company Address\nCity, State - PIN',
      companyGST: user.companyGST || 'Your GST Number',
      companyEmail: '',
      companyPhone: user.companyPhone || '',
      companyWebsite: user.companyWebsite || '',
      companyLogo: invoiceData.companyLogo || undefined,
      whiteLabelMode: invoiceData.whiteLabelMode || false,
      invoiceStatus: 'PENDING',
      theme: invoiceData.theme || 'professional',
      invoiceType: invoiceData.invoiceType || 'sales',
      customColors: invoiceData.customColors
    });

    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="invoice-preview-${invoiceData.invoiceNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF preview error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF preview' }, { status: 500 });
  }
}