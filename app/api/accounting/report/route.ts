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
    const reportType = searchParams.get('type') || 'profit-loss';
    const startDate = searchParams.get('startDate') || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0];

    // Get invoices for revenue
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*')
      .eq('userid', user.id)
      .gte('date', startDate)
      .lte('date', endDate);

    // Get expenses
    const { data: expenses } = await supabase
      .from('expenses')
      .select('*')
      .eq('userid', user.id)
      .gte('date', startDate)
      .lte('date', endDate);

    // Calculate Revenue
    const paidInvoices = (invoices || []).filter((i: any) => i.status === 'paid');
    const totalRevenue = paidInvoices.reduce((sum: number, i: any) => sum + Number(i.amount) || 0, 0);
    const grossRevenue = paidInvoices.reduce((sum: number, i: any) => sum + Number(i.subtotal) || 0, 0);
    const totalTaxCollected = paidInvoices.reduce((sum: number, i: any) => sum + Number(i.taxamount) || 0, 0);
    const totalDiscounts = paidInvoices.reduce((sum: number, i: any) => sum + Number(i.discountamount) || 0, 0);

    // Calculate Expenses by Category
    const expensesByCategory: { [category: string]: number } = {};
    (expenses || []).forEach((e: any) => {
      const cat = e.category || 'Other';
      expensesByCategory[cat] = (expensesByCategory[cat] || 0) + Number(e.amount) || 0;
    });
    const totalExpenses = (expenses || []).reduce((sum: number, e: any) => sum + Number(e.amount) || 0, 0);

    // Calculate Profit/Loss
    const netProfit = totalRevenue - totalExpenses;
    const grossProfit = grossRevenue - totalExpenses;

    // Monthly breakdown
    const monthlyData: { [month: string]: { revenue: number; expenses: number; profit: number } } = {};

    paidInvoices.forEach((i: any) => {
      const month = new Date(i.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) monthlyData[month] = { revenue: 0, expenses: 0, profit: 0 };
      monthlyData[month].revenue += Number(i.amount) || 0;
    });

    (expenses || []).forEach((e: any) => {
      const month = new Date(e.date).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!monthlyData[month]) monthlyData[month] = { revenue: 0, expenses: 0, profit: 0 };
      monthlyData[month].expenses += Number(e.amount) || 0;
    });

    Object.keys(monthlyData).forEach(month => {
      monthlyData[month].profit = monthlyData[month].revenue - monthlyData[month].expenses;
    });

    // Client revenue breakdown
    const clientRevenue: { [client: string]: number } = {};
    paidInvoices.forEach((i: any) => {
      const client = i.clientname || 'Unknown';
      clientRevenue[client] = (clientRevenue[client] || 0) + Number(i.amount) || 0;
    });

    const topClients = Object.entries(clientRevenue)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    // Balance Sheet (simplified)
    const assets = {
      cash: totalRevenue, // Simplified: assumes collected revenue is cash
      receivables: (invoices || [])
        .filter((i: any) => ['sent', 'overdue'].includes(i.status))
        .reduce((sum: number, i: any) => sum + Number(i.amount) || 0, 0),
    };

    const liabilities = {
      taxPayable: totalTaxCollected,
    };

    const equity = {
      retainedEarnings: netProfit > 0 ? netProfit : 0,
    };

    const totalAssets = assets.cash + assets.receivables;
    const totalLiabilities = liabilities.taxPayable;
    const totalEquity = equity.retainedEarnings;

    switch (reportType) {
      case 'profit-loss':
        return NextResponse.json({
          period: { startDate, endDate },
          summary: {
            grossRevenue,
            discounts: totalDiscounts,
            netRevenue: grossRevenue - totalDiscounts,
            taxCollected: totalTaxCollected,
            totalRevenue,
            totalExpenses,
            grossProfit,
            netProfit,
            profitMargin: totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0',
          },
          expensesByCategory,
          monthlyData: Object.entries(monthlyData).map(([month, data]) => ({ month, ...data })),
          topClients,
        });

      case 'balance-sheet':
        return NextResponse.json({
          asOf: endDate,
          assets,
          liabilities,
          equity,
          totals: {
            totalAssets,
            totalLiabilities,
            totalEquity,
          },
          balanceCheck: totalAssets === totalLiabilities + totalEquity ? 'Balanced' : 'Check entries',
        });

      case 'cash-flow':
        return NextResponse.json({
          period: { startDate, endDate },
          operating: {
            netIncome: netProfit,
            adjustments: {
              receivablesChange: -assets.receivables,
              payablesChange: 0,
            },
            operatingCashFlow: netProfit - assets.receivables,
          },
          investing: {
            capitalExpenditure: 0,
            investments: 0,
          },
          financing: {
            loans: 0,
            equity: 0,
          },
          netCashFlow: totalRevenue - totalExpenses - assets.receivables,
          monthlyData: Object.entries(monthlyData).map(([month, data]) => ({ month, ...data })),
        });

      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Accounting report error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
