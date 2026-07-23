import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helpers';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all invoices for analytics from Neon DB
    const invoices = await DatabaseService.getInvoices(user.id);

    // Calculate core analytics
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

    // Business Health Score (0-100)
    const businessHealth = calculateBusinessHealth(invoices, monthlyData);

    // Cash Runway (months of runway)
    const cashRunway = calculateCashRunway(monthlyData);

    // Revenue Forecast
    const forecast = calculateForecast(monthlyData);

    // AI Recommendations
    const recommendations = generateRecommendations(invoices, monthlyData, businessHealth);

    // Overdue analysis
    const overdueAnalysis = analyzeOverdue(invoices);

    return NextResponse.json({
      totalRevenue,
      totalInvoices,
      paidInvoices,
      pendingInvoices,
      averageInvoiceValue,
      monthlyData,
      topClients,
      invoiceStatusDistribution,
      businessHealth,
      cashRunway,
      forecast,
      recommendations,
      overdueAnalysis,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

function calculateMonthlyData(invoices: any[]): Array<{ month: string; revenue: number; invoices: number }> {
  const monthly: { [key: string]: { revenue: number; invoices: number } } = {};

  invoices
    .filter((i: any) => i.status === 'paid' && (i.paidDate || i.date))
    .forEach((invoice: any) => {
      const dateStr = invoice.paidDate || invoice.date;
      const date = new Date(dateStr);
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
      const clientName = invoice.clientName || 'Unknown';
      if (!clientMap[clientName]) {
        clientMap[clientName] = {
          name: clientName,
          company: invoice.clientCompany,
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

function calculateBusinessHealth(invoices: any[], monthlyData: any[]): number {
  let score = 50;

  const paidRate = invoices.length > 0
    ? invoices.filter((i: any) => i.status === 'paid').length / invoices.length
    : 0;
  score += paidRate * 20;

  if (monthlyData.length >= 2) {
    const revenues = monthlyData.slice(-3).map((m: any) => m.revenue);
    const avgRevenue = revenues.reduce((a: number, b: number) => a + b, 0) / revenues.length;
    const variance = revenues.reduce((sum: number, r: number) => sum + Math.pow(r - avgRevenue, 2), 0) / revenues.length;
    const cv = avgRevenue > 0 ? Math.sqrt(variance) / avgRevenue : 1;
    score += Math.max(0, 15 - cv * 15);
  }

  if (monthlyData.length >= 2) {
    const recentRevenue = monthlyData[monthlyData.length - 1]?.revenue || 0;
    const prevRevenue = monthlyData[monthlyData.length - 2]?.revenue || 0;
    if (prevRevenue > 0 && recentRevenue > prevRevenue) {
      const growth = (recentRevenue - prevRevenue) / prevRevenue;
      score += Math.min(15, growth * 30);
    }
  }

  const overdueRate = invoices.length > 0
    ? invoices.filter((i: any) => i.status === 'overdue').length / invoices.length
    : 0;
  score -= overdueRate * 20;

  return Math.min(100, Math.max(0, Math.round(score)));
}

function calculateCashRunway(monthlyData: any[]): number {
  if (monthlyData.length === 0) return 0;

  const avgMonthlyRevenue = monthlyData
    .slice(-3)
    .reduce((sum: number, m: any) => sum + m.revenue, 0) / Math.min(3, monthlyData.length);

  const monthlyBurn = avgMonthlyRevenue * 0.2;

  if (monthlyBurn <= 0) return 999;

  const lastMonthRevenue = monthlyData[monthlyData.length - 1]?.revenue || 0;
  return Math.round((lastMonthRevenue / monthlyBurn) * 10) / 10;
}

function calculateForecast(monthlyData: any[]): { nextMonth: number; nextQuarter: number; confidence: string } {
  if (monthlyData.length === 0) {
    return { nextMonth: 0, nextQuarter: 0, confidence: 'low' };
  }

  const revenues = monthlyData.slice(-6).map((m: any) => m.revenue);
  const avgRevenue = revenues.reduce((a: number, b: number) => a + b, 0) / revenues.length;

  let trend = 0;
  if (revenues.length >= 2) {
    const recent = revenues.slice(-3);
    const older = revenues.slice(-6, -3);
    const recentAvg = recent.reduce((a: number, b: number) => a + b, 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((a: number, b: number) => a + b, 0) / older.length : recentAvg;
    trend = olderAvg > 0 ? (recentAvg - olderAvg) / olderAvg : 0;
  }

  const nextMonth = avgRevenue * (1 + trend * 0.5);
  const nextQuarter = nextMonth * 3;

  const confidence = monthlyData.length >= 4 ? 'high' : monthlyData.length >= 2 ? 'medium' : 'low';

  return {
    nextMonth: Math.round(nextMonth),
    nextQuarter: Math.round(nextQuarter),
    confidence,
  };
}

function generateRecommendations(invoices: any[], monthlyData: any[], healthScore: number): Array<{ type: string; message: string; priority: 'high' | 'medium' | 'low'; action?: string }> {
  const recommendations: Array<{ type: string; message: string; priority: 'high' | 'medium' | 'low'; action?: string }> = [];

  const overdue = invoices.filter((i: any) => i.status === 'overdue');
  if (overdue.length > 0) {
    const totalOverdue = overdue.reduce((sum: number, i: any) => sum + (i.amount || 0), 0);
    recommendations.push({
      type: 'payment',
      message: `${overdue.length} overdue invoice${overdue.length > 1 ? 's' : ''} totaling $${totalOverdue.toFixed(2)}`,
      priority: 'high',
      action: 'Send payment reminders',
    });
  }

  const staleDrafts = invoices.filter((i: any) => {
    if (i.status !== 'draft') return false;
    const created = new Date(i.createdAt || Date.now());
    const daysOld = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
    return daysOld > 7;
  });
  if (staleDrafts.length > 0) {
    recommendations.push({
      type: 'invoice',
      message: `${staleDrafts.length} draft invoice${staleDrafts.length > 1 ? 's' : ''} waiting to be sent`,
      priority: 'medium',
      action: 'Review and send drafts',
    });
  }

  const sent = invoices.filter((i: any) => i.status === 'sent');
  if (sent.length > 0) {
    const likelyToPay = sent.filter((i: any) => {
      const dueDate = new Date(i.dueDate || Date.now());
      const daysUntilDue = (dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return daysUntilDue > 0 && daysUntilDue < 7;
    });
    if (likelyToPay.length > 0) {
      recommendations.push({
        type: 'forecast',
        message: `${likelyToPay.length} invoice${likelyToPay.length > 1 ? 's' : ''} likely to be paid within 7 days`,
        priority: 'low',
      });
    }
  }

  if (healthScore < 60) {
    recommendations.push({
      type: 'health',
      message: 'Business health score is below optimal. Focus on collecting payments.',
      priority: 'high',
      action: 'Review overdue invoices',
    });
  }

  return recommendations.slice(0, 5);
}

function analyzeOverdue(invoices: any[]): {
  total: number;
  amount: number;
  byClient: Array<{ client: string; count: number; amount: number }>;
  avgDaysOverdue: number;
} {
  const overdue = invoices.filter((i: any) => i.status === 'overdue');
  const total = overdue.length;
  const amount = overdue.reduce((sum: number, i: any) => sum + (i.amount || 0), 0);

  const clientMap: { [key: string]: { count: number; amount: number } } = {};
  overdue.forEach((i: any) => {
    const client = i.clientName || 'Unknown';
    if (!clientMap[client]) {
      clientMap[client] = { count: 0, amount: 0 };
    }
    clientMap[client].count += 1;
    clientMap[client].amount += i.amount || 0;
  });

  const byClient = Object.entries(clientMap)
    .map(([client, data]) => ({ client, ...data }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  let totalDays = 0;
  overdue.forEach((i: any) => {
    if (i.dueDate) {
      const due = new Date(i.dueDate);
      const days = Math.ceil((Date.now() - due.getTime()) / (1000 * 60 * 60 * 24));
      totalDays += Math.max(0, days);
    }
  });
  const avgDaysOverdue = total > 0 ? Math.round(totalDays / total) : 0;

  return { total, amount, byClient, avgDaysOverdue };
}
