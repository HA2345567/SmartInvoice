'use client';

import { useState, useEffect, useCallback } from 'react';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Users, 
  Calendar, 
  AlertCircle, 
  Loader2, 
  RotateCw, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AiCashFlowForecast } from '@/components/ai/analytics/AiCashFlowForecast';

interface Analytics {
  totalRevenue: number;
  totalInvoices: number;
  paidInvoices: number;
  pendingInvoices: number;
  averageInvoiceValue: number;
  monthlyData: Array<{
    month: string;
    revenue: number;
    invoices: number;
  }>;
  topClients: Array<{
    id?: string;
    name: string;
    company?: string;
    totalAmount: number;
    totalInvoices: number;
  }>;
  invoiceStatusDistribution: {
    paid: number;
    pending: number;
    draft: number;
    overdue: number;
  };
  businessHealth?: number;
  cashRunway?: number;
  forecast?: {
    nextMonth: number;
    nextQuarter: number;
    confidence: string;
  };
  recommendations?: Array<{
    type: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
    action?: string;
  }>;
  overdueAnalysis?: {
    total: number;
    amount: number;
    byClient: Array<{ client: string; count: number; amount: number }>;
    avgDaysOverdue: number;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const getEffectiveToken = useCallback(() => {
    if (session?.access_token) return session.access_token;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth-token') || localStorage.getItem('token');
      if (stored && stored !== 'null' && stored !== 'undefined') {
        return stored;
      }
    }
    return null;
  }, [session]);

  const fetchAnalytics = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const token = getEffectiveToken();
      const headers: Record<string, string> = {
        'Cache-Control': 'no-cache',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/analytics', {
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data: Analytics = await response.json();
        setAnalytics(data);
        if (isRefresh) {
          toast({
            title: 'Analytics Refreshed',
            description: 'Latest metrics synchronized from Neon database.',
          });
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to fetch analytics');
      }
    } catch (error: any) {
      console.error('Analytics fetch error:', error);
      toast({
        title: 'Data Sync Notice',
        description: error.message || 'Could not load analytics. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getEffectiveToken, toast]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <LuxuryLoader 
        label="Aggregating financial metrics..." 
        sublabel="Revenue Intelligence" 
        minHeight="min-h-[450px]" 
      />
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-[450px]">
        <div className="text-center max-w-md p-8 rounded-2xl bg-[#181818] border border-white/10">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Unable to Load Analytics</h3>
          <p className="text-sm text-[#b3b3b3] mb-6">
            We were unable to aggregate invoice data. Please ensure you are logged in and try again.
          </p>
          <Button
            onClick={() => fetchAnalytics(false)}
            className="bg-[#1ed760] text-black hover:bg-[#1abe53] rounded-full font-bold px-6"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  const now = new Date();
  const currentMonth = `${now.toLocaleString('en-US', { month: 'short' })} ${now.getFullYear().toString().slice(-2)}`;
  const currentMonthRevenue = analytics.monthlyData?.find(m => m.month === currentMonth)?.revenue || 0;

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${analytics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `$${currentMonthRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} this month`,
      isPositive: true,
      icon: DollarSign,
      iconBg: 'bg-[#1ed760]/10',
      iconColor: 'text-[#1ed760]',
    },
    {
      title: 'Pending Invoices',
      value: analytics.pendingInvoices.toString(),
      subtitle: `${analytics.invoiceStatusDistribution?.overdue || 0} overdue actions`,
      isPositive: (analytics.invoiceStatusDistribution?.overdue || 0) === 0,
      icon: AlertCircle,
      iconBg: (analytics.invoiceStatusDistribution?.overdue || 0) > 0 ? 'bg-red-500/10' : 'bg-yellow-500/10',
      iconColor: (analytics.invoiceStatusDistribution?.overdue || 0) > 0 ? 'text-red-400' : 'text-yellow-400',
    },
    {
      title: 'Total Invoices',
      value: analytics.totalInvoices.toString(),
      subtitle: `${analytics.paidInvoices} paid • ${analytics.invoiceStatusDistribution?.draft || 0} drafts`,
      isPositive: true,
      icon: FileText,
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-400',
    },
    {
      title: 'Average Invoice Value',
      value: `$${analytics.averageInvoiceValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: 'Average collected per paid invoice',
      isPositive: true,
      icon: TrendingUp,
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-400',
    },
  ];

  const maxMonthlyRevenue = Math.max(...(analytics.monthlyData || []).map(m => m.revenue), 1);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[#1ed760] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#1ed760] font-bold">Business Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Analytics & Cash Flow</h1>
          <p className="text-sm sm:text-base text-[#b3b3b3]">
            Comprehensive financial performance, client valuation, and predictive projections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="border-white/10 bg-[#181818] hover:bg-[#222222] text-white rounded-full px-4 h-10 text-xs font-semibold"
          >
            <RotateCw className={`w-3.5 h-3.5 mr-2 text-[#1ed760] ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-[#181818] border-white/10 rounded-2xl hover:border-white/20 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-semibold text-[#b3b3b3] uppercase tracking-wider">
                {stat.title}
              </span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {stat.value}
              </div>
              <p className="text-xs mt-1 text-[#b3b3b3]">
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Executive Health & Forecast Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Business Health Score */}
        <Card className="bg-[#181818] border-white/10 rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#b3b3b3] uppercase tracking-wider">Business Health</span>
              <ShieldCheck className="w-4 h-4 text-[#1ed760]" />
            </div>
            <CardTitle className="text-white text-lg">Health Index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">
                {analytics.businessHealth ?? 85}
              </span>
              <span className="text-xs text-[#b3b3b3]">/ 100</span>
              <Badge className="ml-auto bg-[#1ed760]/10 text-[#1ed760] border-transparent text-xs font-bold">
                {(analytics.businessHealth ?? 85) >= 70 ? 'OPTIMAL' : 'MONITOR'}
              </Badge>
            </div>
            <div className="w-full bg-[#282828] rounded-full h-2 mt-4 overflow-hidden">
              <div 
                className="bg-[#1ed760] h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, analytics.businessHealth ?? 85)}%` }} 
              />
            </div>
            <p className="text-xs text-[#b3b3b3] mt-3">
              Calculated from collection rates, revenue consistency, and payment velocity.
            </p>
          </CardContent>
        </Card>

        {/* Cash Runway */}
        <Card className="bg-[#181818] border-white/10 rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#b3b3b3] uppercase tracking-wider">Runway Projection</span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <CardTitle className="text-white text-lg">Cash Runway</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">
                {analytics.cashRunway ?? 12}
              </span>
              <span className="text-xs text-[#b3b3b3]">Months</span>
              <Badge className="ml-auto bg-blue-500/10 text-blue-400 border-transparent text-xs font-bold">
                STABLE
              </Badge>
            </div>
            <p className="text-xs text-[#b3b3b3] mt-4">
              Estimated operational runway based on 3-month trailing inflows and estimated overhead.
            </p>
          </CardContent>
        </Card>

        {/* Predictive AI Forecast */}
        <Card className="bg-[#181818] border-white/10 rounded-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#b3b3b3] uppercase tracking-wider">AI Forecast</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <CardTitle className="text-white text-lg">Next Quarter Est.</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-white">
                ${(analytics.forecast?.nextQuarter ?? (analytics.totalRevenue * 0.3)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <Badge className="ml-auto bg-purple-500/10 text-purple-400 border-transparent text-xs font-bold">
                {analytics.forecast?.confidence?.toUpperCase() || 'MEDIUM'} CONFIDENCE
              </Badge>
            </div>
            <p className="text-xs text-[#b3b3b3] mt-4">
              Predicted Next Month: <strong className="text-white">${(analytics.forecast?.nextMonth ?? (analytics.totalRevenue * 0.1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* AI Cash Flow Forecast Chart */}
      <div className="w-full">
        <AiCashFlowForecast monthlyData={analytics.monthlyData || []} />
      </div>

      {/* Performance Split: Monthly Revenue Velocity & Top Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Velocity */}
        <Card className="bg-[#181818] border-white/10 rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1ed760]/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-[#1ed760]" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Monthly Revenue Velocity</CardTitle>
                <CardDescription className="text-xs text-[#b3b3b3]">
                  Paid invoice revenues across the last 6 calendar periods
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!analytics.monthlyData || analytics.monthlyData.length === 0 ? (
              <div className="text-center py-10">
                <BarChart3 className="w-8 h-8 text-[#b3b3b3] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[#b3b3b3]">No revenue data recorded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analytics.monthlyData.map((item, index) => {
                  const percentage = maxMonthlyRevenue > 0 ? (item.revenue / maxMonthlyRevenue) * 100 : 0;
                  return (
                    <div key={index} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">{item.month}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[#b3b3b3]">{item.invoices} {item.invoices === 1 ? 'inv' : 'invs'}</span>
                          <span className="font-mono font-bold text-[#1ed760] min-w-[70px] text-right">
                            ${item.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-[#282828] rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-[#1ed760] h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(percentage, 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Clients Ranking */}
        <Card className="bg-[#181818] border-white/10 rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Top Client Accounts</CardTitle>
                <CardDescription className="text-xs text-[#b3b3b3]">
                  Ranked by cumulative settled billing volume
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!analytics.topClients || analytics.topClients.length === 0 ? (
              <div className="text-center py-10">
                <Users className="w-8 h-8 text-[#b3b3b3] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[#b3b3b3]">Paid client accounts will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {analytics.topClients.map((client, index) => (
                  <div 
                    key={client.id || index}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#1f1f1f] border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#181818] border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                        {(client.name || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{client.name}</p>
                        <p className="text-xs text-[#b3b3b3]">
                          {client.company ? `${client.company} • ` : ''}{client.totalInvoices} {client.totalInvoices === 1 ? 'invoice' : 'invoices'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#1ed760]">
                        ${client.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <Badge variant="outline" className="border-white/10 text-[10px] text-[#b3b3b3]">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment Status Distribution & Overdue Exposure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Status Distribution */}
        <Card className="bg-[#181818] border-white/10 rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-[#1ed760]" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Portfolio Distribution</CardTitle>
                <CardDescription className="text-xs text-[#b3b3b3]">
                  Status breakdown across all recorded ledger entries
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-[#1f1f1f] border border-[#1ed760]/20 text-center">
                <div className="text-2xl font-black text-[#1ed760]">
                  {analytics.invoiceStatusDistribution?.paid || 0}
                </div>
                <div className="text-xs font-bold text-[#b3b3b3] mt-1 uppercase tracking-wider">Paid</div>
              </div>

              <div className="p-4 rounded-xl bg-[#1f1f1f] border border-blue-500/20 text-center">
                <div className="text-2xl font-black text-blue-400">
                  {analytics.invoiceStatusDistribution?.pending || 0}
                </div>
                <div className="text-xs font-bold text-[#b3b3b3] mt-1 uppercase tracking-wider">Pending</div>
              </div>

              <div className="p-4 rounded-xl bg-[#1f1f1f] border border-red-500/20 text-center">
                <div className="text-2xl font-black text-red-400">
                  {analytics.invoiceStatusDistribution?.overdue || 0}
                </div>
                <div className="text-xs font-bold text-[#b3b3b3] mt-1 uppercase tracking-wider">Overdue</div>
              </div>

              <div className="p-4 rounded-xl bg-[#1f1f1f] border border-white/5 text-center">
                <div className="text-2xl font-black text-gray-400">
                  {analytics.invoiceStatusDistribution?.draft || 0}
                </div>
                <div className="text-xs font-bold text-[#b3b3b3] mt-1 uppercase tracking-wider">Drafts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overdue Exposure Analysis */}
        <Card className="bg-[#181818] border-white/10 rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Overdue Risk Exposure</CardTitle>
                <CardDescription className="text-xs text-[#b3b3b3]">
                  Outstanding collections requiring automated follow-up
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {analytics.overdueAnalysis && analytics.overdueAnalysis.total > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                  <div>
                    <span className="text-xs text-red-400 font-bold uppercase tracking-wider">Total Overdue Capital</span>
                    <p className="text-2xl font-black text-white mt-0.5">
                      ${analytics.overdueAnalysis.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#b3b3b3]">Aging Average</span>
                    <p className="text-sm font-bold text-red-400">
                      ~{analytics.overdueAnalysis.avgDaysOverdue} days
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-[#b3b3b3]">Accounts with Overdue Balances:</span>
                  {analytics.overdueAnalysis.byClient.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-[#1f1f1f]">
                      <span className="font-medium text-white">{item.client}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#b3b3b3]">{item.count} overdue</span>
                        <span className="font-bold text-red-400">${item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-10 h-10 rounded-full bg-[#1ed760]/10 border border-[#1ed760]/20 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-5 h-5 text-[#1ed760]" />
                </div>
                <p className="text-sm font-bold text-white">Zero Overdue Invoices</p>
                <p className="text-xs text-[#b3b3b3] mt-1">All issued invoices are either fully settled or within due dates.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}