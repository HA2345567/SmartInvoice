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
    const startDate = searchParams.get('startDate') || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];

    // Get all invoices for the period
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('userid', user.id)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error('Error fetching invoices for tax report:', error);
      return NextResponse.json({ error: 'Failed to fetch tax data' }, { status: 500 });
    }

    // Calculate tax summary
    let totalRevenue = 0;
    let totalTaxCollected = 0;
    let taxableRevenue = 0;
    let exemptRevenue = 0;
    const taxBreakdown: { [rate: string]: { taxable: number; tax: number } } = {};

    // Invoice-level breakdown
    const invoiceTaxDetails = (invoices || []).map((inv: any) => {
      const amount = Number(inv.amount) || 0;
      const taxAmount = Number(inv.taxamount) || 0;
      const taxRate = Number(inv.taxrate) || 0;
      const subtotal = Number(inv.subtotal) || 0;

      if (inv.status === 'paid') {
        totalRevenue += amount;
        totalTaxCollected += taxAmount;
        if (taxRate > 0) {
          taxableRevenue += subtotal;
          const rateKey = `${taxRate}%`;
          if (!taxBreakdown[rateKey]) {
            taxBreakdown[rateKey] = { taxable: 0, tax: 0 };
          }
          taxBreakdown[rateKey].taxable += subtotal;
          taxBreakdown[rateKey].tax += taxAmount;
        } else {
          exemptRevenue += subtotal;
        }
      }

      return {
        invoiceNumber: inv.invoicenumber,
        clientName: inv.clientname,
        date: inv.date,
        status: inv.status,
        subtotal: subtotal,
        taxRate: taxRate,
        taxAmount: taxAmount,
        total: amount,
      };
    });

    // Calculate GST/VAT summary by HSN/SAC codes (mock for now)
    const gstSummary = Object.entries(taxBreakdown).map(([rate, data]) => ({
      rate,
      taxableAmount: data.taxable,
      taxAmount: data.tax,
      taxType: rate.includes('18') ? 'IGST' : 'GST',
    }));

    // Monthly tax breakdown
    const monthlyTax: { [month: string]: { revenue: number; tax: number } } = {};
    (invoices || [])
      .filter((i: any) => i.status === 'paid')
      .forEach((inv: any) => {
        const month = new Date(inv.date).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyTax[month]) {
          monthlyTax[month] = { revenue: 0, tax: 0 };
        }
        monthlyTax[month].revenue += Number(inv.amount) || 0;
        monthlyTax[month].tax += Number(inv.taxamount) || 0;
      });

    return NextResponse.json({
      period: { startDate, endDate },
      summary: {
        totalRevenue,
        totalTaxCollected,
        taxableRevenue,
        exemptRevenue,
        taxBreakdown,
      },
      gstSummary,
      monthlyTax: Object.entries(monthlyTax).map(([month, data]) => ({
        month,
        ...data,
      })),
      invoices: invoiceTaxDetails,
    });
  } catch (error) {
    console.error('Tax report error:', error);
    return NextResponse.json({ error: 'Failed to generate tax report' }, { status: 500 });
  }
}
