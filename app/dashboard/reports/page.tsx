'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartBar as FileBarChart, TrendingUp, TrendingDown, DollarSign, Building2, Wallet, ChartPie as PieChart, Download, Loader, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ProfitLossSummary {
  grossRevenue: number;
  discounts: number;
  netRevenue: number;
  taxCollected: number;
  totalRevenue: number;
  totalExpenses: number;
  grossProfit: number;
  netProfit: number;
  profitMargin: string;
}

interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface BalanceSheet {
  assets: { cash: number; receivables: number };
  liabilities: { taxPayable: number };
  equity: { retainedEarnings: number };
  totals: { totalAssets: number; totalLiabilities: number; totalEquity: number };
}

export default function ReportsPage() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profit-loss');
  const [profitLoss, setProfitLoss] = useState<{
    summary: ProfitLossSummary;
    expensesByCategory: { [key: string]: number };
    monthlyData: MonthlyData[];
    topClients: Array<{ name: string; amount: number }>;
  } | null>(null);
  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | null>(null);
  const [cashFlow, setCashFlow] = useState<any>(null);

  const currentYear = new Date().getFullYear();
  const [startDate] = useState(`${currentYear}-01-01`);
  const [endDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (session?.access_token) {
      fetchReport(activeTab);
    }
  }, [session, activeTab]);

  const fetchReport = async (type: string) => {
    if (!session?.access_token) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/accounting/report?type=${type}&startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        switch (type) {
          case 'profit-loss':
            setProfitLoss(data);
            break;
          case 'balance-sheet':
            setBalanceSheet(data);
            break;
          case 'cash-flow':
            setCashFlow(data);
            break;
        }
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch report',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const exportReport = () => {
    toast({
      title: 'Coming Soon',
      description: 'PDF export will be available soon',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            Financial Reports
            <Badge
              variant="outline"
              className="text-xs"
              style={{ background: 'rgba(30,215,96,0.15)', color: '#1ed760', border: '1px solid rgba(30,215,96,0.3)' }}
            >
              <FileBarChart className="w-3 h-3 mr-1" />
              Auto-Generated
            </Badge>
          </h1>
          <p className="text-base" style={{ color: '#b3b3b3' }}>
            Profit & Loss, Balance Sheet, Cash Flow statements
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto" style={{ background: '#181818', borderRadius: '8px' }}>
          <TabsTrigger value="profit-loss" className="data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-white text-xs sm:text-sm">
            <TrendingUp className="w-4 h-4 mr-2" />
            Profit & Loss
          </TabsTrigger>
          <TabsTrigger value="balance-sheet" className="data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-white text-xs sm:text-sm">
            <Building2 className="w-4 h-4 mr-2" />
            Balance Sheet
          </TabsTrigger>
          <TabsTrigger value="cash-flow" className="data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-white text-xs sm:text-sm">
            <Wallet className="w-4 h-4 mr-2" />
            Cash Flow
          </TabsTrigger>
        </TabsList>

        {/* Profit & Loss */}
        <TabsContent value="profit-loss" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader className="w-8 h-8 animate-spin" style={{ color: '#1ed760' }} />
            </div>
          ) : profitLoss ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center text-sm font-bold">
                      <DollarSign className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
                      Total Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{formatCurrency(profitLoss.summary.totalRevenue)}</div>
                  </CardContent>
                </Card>

                <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center text-sm font-bold">
                      <TrendingDown className="w-4 h-4 mr-2" style={{ color: '#ef4444' }} />
                      Total Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{formatCurrency(profitLoss.summary.totalExpenses)}</div>
                  </CardContent>
                </Card>

                <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center text-sm font-bold">
                      <TrendingUp className="w-4 h-4 mr-2" style={{ color: profitLoss.summary.netProfit >= 0 ? '#1ed760' : '#ef4444' }} />
                      Net Profit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{formatCurrency(profitLoss.summary.netProfit)}</div>
                    <p className="text-xs mt-1" style={{ color: '#b3b3b3' }}>{profitLoss.summary.profitMargin}% margin</p>
                  </CardContent>
                </Card>

                <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center text-sm font-bold">
                      <PieChart className="w-4 h-4 mr-2" style={{ color: '#f59e0b' }} />
                      Tax Collected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{formatCurrency(profitLoss.summary.taxCollected)}</div>
                  </CardContent>
                </Card>
              </div>

              {/* P&L Statement */}
              <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-sm font-bold">
                    <TrendingUp className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
                    Profit & Loss Statement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Revenue Section */}
                  <div className="space-y-2">
                    <div className="text-sm font-bold" style={{ color: '#1ed760' }}>REVENUE</div>
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: '#4d4d4d' }}>
                      <span style={{ color: '#b3b3b3' }}>Gross Revenue</span>
                      <span className="font-bold text-white">{formatCurrency(profitLoss.summary.grossRevenue)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: '#4d4d4d' }}>
                      <span style={{ color: '#b3b3b3' }}>Less: Discounts</span>
                      <span className="font-bold text-white">({formatCurrency(profitLoss.summary.discounts)})</span>
                    </div>
                    <div className="flex justify-between py-2 border-b" style={{ borderColor: '#4d4d4d' }}>
                      <span style={{ color: '#b3b3b3' }}>Net Revenue</span>
                      <span className="font-bold text-white">{formatCurrency(profitLoss.summary.netRevenue)}</span>
                    </div>
                  </div>

                  {/* Expenses Section */}
                  <div className="space-y-2 mt-6">
                    <div className="text-sm font-bold" style={{ color: '#ef4444' }}>EXPENSES</div>
                    {Object.entries(profitLoss.expensesByCategory).map(([category, amount]) => (
                      <div key={category} className="flex justify-between py-2" style={{ borderBottom: '1px solid #4d4d4d' }}>
                        <span style={{ color: '#b3b3b3' }}>{category}</span>
                        <span className="text-white">{formatCurrency(amount)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between py-2 font-bold" style={{ borderBottom: '2px solid #4d4d4d' }}>
                      <span className="text-white">Total Expenses</span>
                      <span className="text-white">{formatCurrency(profitLoss.summary.totalExpenses)}</span>
                    </div>
                  </div>

                  {/* Net Profit */}
                  <div className="flex justify-between py-4 mt-4 rounded-lg" style={{ background: profitLoss.summary.netProfit >= 0 ? 'rgba(30,215,96,0.1)' : 'rgba(239,68,68,0.1)' }}>
                    <span className="text-lg font-bold text-white">NET PROFIT / (LOSS)</span>
                    <span className="text-2xl font-bold" style={{ color: profitLoss.summary.netProfit >= 0 ? '#1ed760' : '#ef4444' }}>
                      {formatCurrency(profitLoss.summary.netProfit)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Top Clients */}
              {profitLoss.topClients.length > 0 && (
                <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
                  <CardHeader>
                    <CardTitle className="text-white text-sm font-bold">Revenue by Client</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {profitLoss.topClients.map((client, index) => {
                        const total = profitLoss.topClients.reduce((sum, c) => sum + c.amount, 0);
                        const percentage = total > 0 ? (client.amount / total) * 100 : 0;
                        return (
                          <div key={index} className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-white">{client.name}</span>
                                <span className="text-sm font-bold text-white">{formatCurrency(client.amount)}</span>
                              </div>
                              <div className="h-2 rounded" style={{ background: '#1f1f1f' }}>
                                <div
                                  className="h-full rounded"
                                  style={{ width: `${percentage}%`, background: '#1ed760', opacity: 0.6 + (index * 0.1) }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </TabsContent>

        {/* Balance Sheet */}
        <TabsContent value="balance-sheet" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader className="w-8 h-8 animate-spin" style={{ color: '#1ed760' }} />
            </div>
          ) : balanceSheet ? (
            <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
              <CardHeader>
                <CardTitle className="text-white flex items-center text-sm font-bold">
                  <Building2 className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
                  Balance Sheet as of {endDate}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Assets */}
                <div className="space-y-4">
                  <div className="text-lg font-bold" style={{ color: '#1ed760' }}>ASSETS</div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2" style={{ borderBottom: '1px solid #4d4d4d' }}>
                      <span style={{ color: '#b3b3b3' }}>Cash (Collected Revenue)</span>
                      <span className="text-white">{formatCurrency(balanceSheet.assets.cash)}</span>
                    </div>
                    <div className="flex justify-between py-2" style={{ borderBottom: '1px solid #4d4d4d' }}>
                      <span style={{ color: '#b3b3b3' }}>Accounts Receivable</span>
                      <span className="text-white">{formatCurrency(balanceSheet.assets.receivables)}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold" style={{ borderBottom: '2px solid #4d4d4d' }}>
                      <span className="text-white">Total Assets</span>
                      <span className="text-white">{formatCurrency(balanceSheet.totals.totalAssets)}</span>
                    </div>
                  </div>
                </div>

                {/* Liabilities & Equity */}
                <div className="space-y-4">
                  <div className="text-lg font-bold" style={{ color: '#ef4444' }}>LIABILITIES</div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2" style={{ borderBottom: '1px solid #4d4d4d' }}>
                      <span style={{ color: '#b3b3b3' }}>Tax Payable</span>
                      <span className="text-white">{formatCurrency(balanceSheet.liabilities.taxPayable)}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold" style={{ borderBottom: '2px solid #4d4d4d' }}>
                      <span className="text-white">Total Liabilities</span>
                      <span className="text-white">{formatCurrency(balanceSheet.totals.totalLiabilities)}</span>
                    </div>
                  </div>

                  <div className="text-lg font-bold mt-6" style={{ color: '#3b82f6' }}>EQUITY</div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2" style={{ borderBottom: '1px solid #4d4d4d' }}>
                      <span style={{ color: '#b3b3b3' }}>Retained Earnings</span>
                      <span className="text-white">{formatCurrency(balanceSheet.equity.retainedEarnings)}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold" style={{ borderBottom: '2px solid #4d4d4d' }}>
                      <span className="text-white">Total Equity</span>
                      <span className="text-white">{formatCurrency(balanceSheet.totals.totalEquity)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        {/* Cash Flow */}
        <TabsContent value="cash-flow" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader className="w-8 h-8 animate-spin" style={{ color: '#1ed760' }} />
            </div>
          ) : cashFlow ? (
            <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
              <CardHeader>
                <CardTitle className="text-white flex items-center text-sm font-bold">
                  <Wallet className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
                  Cash Flow Statement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Operating Activities */}
                <div className="space-y-2">
                  <div className="text-lg font-bold" style={{ color: '#1ed760' }}>OPERATING ACTIVITIES</div>
                  <div className="flex justify-between py-2" style={{ borderBottom: '1px solid #4d4d4d' }}>
                    <span style={{ color: '#b3b3b3' }}>Net Income</span>
                    <span className="text-white">{formatCurrency(cashFlow.operating.netIncome)}</span>
                  </div>
                  <div className="flex justify-between py-2" style={{ borderBottom: '1px solid #4d4d4d' }}>
                    <span style={{ color: '#b3b3b3' }}>Changes in Receivables</span>
                    <span className="text-white">{formatCurrency(cashFlow.operating.adjustments.receivablesChange)}</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold" style={{ borderBottom: '2px solid #4d4d4d' }}>
                    <span className="text-white">Cash from Operations</span>
                    <span className="text-white">{formatCurrency(cashFlow.operating.operatingCashFlow)}</span>
                  </div>
                </div>

                {/* Net Cash Flow */}
                <div className="flex justify-between py-4 rounded-lg" style={{ background: 'rgba(30,215,96,0.1)' }}>
                  <span className="text-lg font-bold text-white">NET CASH FLOW</span>
                  <span className="text-2xl font-bold" style={{ color: '#1ed760' }}>
                    {formatCurrency(cashFlow.netCashFlow)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}
