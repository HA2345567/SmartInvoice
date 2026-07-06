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

    // Get all invoices for analytics
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('userid', user.id);

    if (error) {
      console.error('Error fetching invoices:', error);
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }

    // Calculate analytics
    const totalRevenue = invoices
      .filter((inv: any) => inv.status === 'paid')
      .reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0);

    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter((inv: any) => inv.status === 'paid').length;
    const pendingInvoices = invoices.filter((inv: any) => inv.status === 'sent' || inv.status === 'overdue').length;

    const averageInvoiceValue = paidInvoices > 0 ? totalRevenue / paidInvoices : 0;

    // Monthly data calculation
    const monthlyData = calculateMonthlyData(invoices);

    // Top clients calculation
    const topClients = calculateTopClients(invoices);

    const invoiceStatusDistribution = {
      paid: paidInvoices,
      pending: pendingInvoices,
      draft: invoices.filter((inv: any) => inv.status === 'draft').length,
      overdue: invoices.filter((inv: any) => inv.status === 'overdue').length,
    };

    return NextResponse.json({
      totalRevenue,
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      averageInvoiceValue,
      monthlyData,
      topClients,
      invoiceStatusDistribution,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

function calculateMonthlyData(invoices: any[]): Array<{ month: string; revenue: number; invoices: number }> {
  const monthly: { [key: string]: { revenue: number; invoices: number } } = {};

  invoices
    .filter((i: any) => i.status === 'paid' && i.paiddate)
    .forEach((invoice: any) => {
      const date = new Date(invoice.paiddate);
      const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!monthly[month]) {
        monthly[month] = { revenue: 0, invoices: 0 };
      }
      monthly[month].revenue += invoice.amount || 0;
      monthly[month].invoices += 1;
    });

  return Object.entries(monthly)
    .map(([month, data]) => ({ month, ...data }))
    .slice(-6);
}

function calculateTopClients(invoices: any[]): Array<{ name: string; company?: string; totalAmount: number; totalInvoices: number }> {
  const clientMap: { [key: string]: { name: string; company?: string; totalAmount: number; totalInvoices: number } } = {};

  invoices
    .filter((i: any) => i.status === 'paid')
    .forEach((invoice: any) => {
      const clientName = invoice.clientname || 'Unknown';
      if (!clientMap[clientName]) {
        clientMap[clientName] = {
          name: clientName,
          company: invoice.clientcompany,
          totalAmount: 0,
          totalInvoices: 0,
        };
      }
      clientMap[clientName].totalAmount += invoice.amount || 0;
      clientMap[clientName].totalInvoices += 1;
    });

  return Object.values(clientMap)
    .sort((a, b) => b.totalAmount - a.totalAmount)
    .slice(0, 5);
}
