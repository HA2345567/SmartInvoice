import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helpers';
import { DatabaseService } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];

    let allInvoices = await DatabaseService.getInvoices(user.id);
    const invoices = allInvoices.filter((inv: any) => {
      const invDate = inv.date || '';
      return invDate >= startDate && invDate <= endDate;
    });

    let totalRevenue = 0;
    let totalTaxCollected = 0;
    let taxableRevenue = 0;
    let exemptRevenue = 0;
    const taxBreakdown: { [rate: string]: { taxable: number; tax: number } } = {};

    const invoiceTaxDetails = (invoices || []).map((inv: any) => {
      const amount = Number(inv.amount) || 0;
      const taxAmount = Number(inv.taxAmount) || 0;
      const taxRate = Number(inv.taxRate) || 0;
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
        invoiceNumber: inv.invoiceNumber,
        clientName: inv.clientName,
        date: inv.date,
        status: inv.status,
        subtotal: subtotal,
        taxRate: taxRate,
        taxAmount: taxAmount,
        total: amount,
      };
    });

    const gstSummary = Object.entries(taxBreakdown).map(([rate, data]) => ({
      rate,
      taxableAmount: data.taxable,
      taxAmount: data.tax,
      taxType: rate.includes('18') ? 'IGST' : 'GST',
    }));

    const monthlyTax: { [month: string]: { revenue: number; tax: number } } = {};
    (invoices || [])
      .filter((i: any) => i.status === 'paid')
      .forEach((inv: any) => {
        const month = new Date(inv.date || Date.now()).toLocaleString('default', { month: 'short', year: 'numeric' });
        if (!monthlyTax[month]) {
          monthlyTax[month] = { revenue: 0, tax: 0 };
        }
        monthlyTax[month].revenue += Number(inv.amount) || 0;
        monthlyTax[month].tax += Number(inv.taxAmount) || 0;
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
