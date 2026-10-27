'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileBarChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Building2, 
  Wallet, 
  PieChart, 
  Download, 
  Loader2, 
  Calendar,
  RotateCw,
  Scale,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
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
  asOf: string;
  assets: { cash: number; receivables: number };
  liabilities: { taxPayable: number };
  equity: { retainedEarnings: number };
  totals: { totalAssets: number; totalLiabilities: number; totalEquity: number };
  balanceCheck?: string;
}

interface CashFlowData {
  period: { startDate: string; endDate: string };
  operating: {
    netIncome: number;
    adjustments: {
      receivablesChange: number;
      payablesChange: number;
    };
    operatingCashFlow: number;
  };
  investing: {
    capitalExpenditure: number;
    investments: number;
  };
  financing: {
    loans: number;
    equity: number;
  };
  netCashFlow: number;
  monthlyData?: MonthlyData[];
}

export default function ReportsPage() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('profit-loss');
  
  const [profitLoss, setProfitLoss] = useState<{
    period?: { startDate: string; endDate: string };
    summary: ProfitLossSummary;
    expensesByCategory: { [key: string]: number };
    monthlyData: MonthlyData[];
    topClients: Array<{ name: string; amount: number }>;
  } | null>(null);

  const [balanceSheet, setBalanceSheet] = useState<BalanceSheet | null>(null);
  const [cashFlow, setCashFlow] = useState<CashFlowData | null>(null);

  const currentYear = new Date().getFullYear();
  const [datePreset, setDatePreset] = useState<'ytd' | '30d' | '90d' | 'all'>('ytd');
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const handlePresetChange = (preset: 'ytd' | '30d' | '90d' | 'all') => {
    setDatePreset(preset);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    setEndDate(todayStr);

    if (preset === 'ytd') {
      setStartDate(`${today.getFullYear()}-01-01`);
    } else if (preset === '30d') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      setStartDate(d.toISOString().split('T')[0]);
    } else if (preset === '90d') {
      const d = new Date();
      d.setDate(d.getDate() - 90);
      setStartDate(d.toISOString().split('T')[0]);
    } else if (preset === 'all') {
      setStartDate('2020-01-01');
    }
  };

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

  const fetchReport = useCallback(async (type: string, isRefresh = false) => {
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

      const response = await fetch(
        `/api/accounting/report?type=${type}&startDate=${startDate}&endDate=${endDate}`,
        {
          headers,
          credentials: 'include',
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

        if (isRefresh) {
          toast({
            title: 'Report Updated',
            description: 'Financial figures synced from ledger.',
          });
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to fetch financial report');
      }
    } catch (error: any) {
      console.error('Error fetching report:', error);
      toast({
        title: 'Report Notice',
        description: error.message || 'Unable to generate statement. Please retry.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getEffectiveToken, startDate, endDate, toast]);

  useEffect(() => {
    fetchReport(activeTab);
  }, [fetchReport, activeTab]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const exportCSV = () => {
    try {
      let csvContent = 'data:text/csv;charset=utf-8,';
      let filename = `SmartInvoice_${activeTab}_${endDate}.csv`;

      if (activeTab === 'profit-loss' && profitLoss) {
        csvContent += 'Line Item,Amount (USD)\r\n';
        csvContent += `Gross Revenue,${profitLoss.summary.grossRevenue}\r\n`;
        csvContent += `Discounts,${profitLoss.summary.discounts}\r\n`;
        csvContent += `Net Revenue,${profitLoss.summary.netRevenue}\r\n`;
        csvContent += `Tax Collected,${profitLoss.summary.taxCollected}\r\n`;
        csvContent += `Total Expenses,${profitLoss.summary.totalExpenses}\r\n`;
        csvContent += `Net Profit,${profitLoss.summary.netProfit}\r\n`;
        csvContent += `Profit Margin,${profitLoss.summary.profitMargin}%\r\n\r\n`;
        csvContent += 'Expense Category,Amount (USD)\r\n';
        Object.entries(profitLoss.expensesByCategory).forEach(([cat, val]) => {
          csvContent += `"${cat}",${val}\r\n`;
        });
      } else if (activeTab === 'balance-sheet' && balanceSheet) {
        csvContent += 'Account,Amount (USD)\r\n';
        csvContent += `Cash (Collected),${balanceSheet.assets.cash}\r\n`;
        csvContent += `Accounts Receivable,${balanceSheet.assets.receivables}\r\n`;
        csvContent += `Total Assets,${balanceSheet.totals.totalAssets}\r\n`;
        csvContent += `Tax Payable,${balanceSheet.liabilities.taxPayable}\r\n`;
        csvContent += `Total Liabilities,${balanceSheet.totals.totalLiabilities}\r\n`;
        csvContent += `Retained Earnings,${balanceSheet.equity.retainedEarnings}\r\n`;
        csvContent += `Total Equity,${balanceSheet.totals.totalEquity}\r\n`;
      } else if (activeTab === 'cash-flow' && cashFlow) {
        csvContent += 'Cash Flow Activity,Amount (USD)\r\n';
        csvContent += `Net Income,${cashFlow.operating.netIncome}\r\n`;
        csvContent += `Receivables Change,${cashFlow.operating.adjustments.receivablesChange}\r\n`;
        csvContent += `Cash from Operations,${cashFlow.operating.operatingCashFlow}\r\n`;
        csvContent += `Net Cash Flow,${cashFlow.netCashFlow}\r\n`;
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Report Exported',
        description: `Exported ${filename} successfully.`,
      });
    } catch (err: any) {
      toast({
        title: 'Export Failed',
        description: err.message || 'Could not export CSV file.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[#1ed760] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#1ed760] font-bold">Accounting & Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Financial Statements
            <Badge
              variant="outline"
              className="text-xs border-[#1ed760]/30 bg-[#1ed760]/10 text-[#1ed760] font-bold"
            >
              <FileBarChart className="w-3 h-3 mr-1" />
              Automated Ledger
            </Badge>
          </h1>
          <p className="text-sm sm:text-base text-[#b3b3b3]">
            GAAP-aligned Profit & Loss, Balance Sheet, and Direct Cash Flow statements
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => fetchReport(activeTab, true)}
            disabled={refreshing || loading}
            className="border-white/10 bg-[#181818] hover:bg-[#222222] text-white rounded-full px-4 h-10 text-xs font-semibold"
          >
            <RotateCw className={`w-3.5 h-3.5 mr-2 text-[#1ed760] ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Updating...' : 'Sync'}
          </Button>
          <Button
            onClick={exportCSV}
            className="bg-[#1ed760] text-black hover:bg-[#1abe53] rounded-full px-4 h-10 text-xs font-bold uppercase tracking-wider"
          >
            <Download className="w-3.5 h-3.5 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Date Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#181818] border border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#1ed760]" />
          <span className="font-semibold text-white">Period:</span>
          <div className="flex gap-1">
            {(['ytd', '30d', '90d', 'all'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetChange(preset)}
                className={`px-3 py-1 rounded-full uppercase font-bold transition-colors ${
                  datePreset === preset
                    ? 'bg-[#1ed760] text-black'
                    : 'bg-[#1f1f1f] text-[#b3b3b3] hover:text-white'
                }`}
              >
                {preset === 'ytd' ? 'Year to Date' : preset === '30d' ? 'Last 30D' : preset === '90d' ? 'Last 90D' : 'All Time'}
              </button>
            ))}
          </div>
        </div>
        <div className="text-[#b3b3b3]">
          Scope: <span className="text-white font-mono">{startDate}</span> to <span className="text-white font-mono">{endDate}</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto bg-[#181818] p-1 rounded-xl border border-white/10">
          <TabsTrigger 
            value="profit-loss" 
            className="data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-[#1ed760] text-xs sm:text-sm py-2.5 font-bold"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Profit & Loss
          </TabsTrigger>
          <TabsTrigger 
            value="balance-sheet" 
            className="data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-[#1ed760] text-xs sm:text-sm py-2.5 font-bold"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Balance Sheet
          </TabsTrigger>
          <TabsTrigger 
            value="cash-flow" 
            className="data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-[#1ed760] text-xs sm:text-sm py-2.5 font-bold"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Cash Flow
          </TabsTrigger>
        </TabsList>

        {/* Profit & Loss Statement */}
        <TabsContent value="profit-loss" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[380px]">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#1ed760' }} />
                <p style={{ color: '#b3b3b3' }}>Calculating Profit & Loss statement...</p>
              </div>
            </div>
          ) : profitLoss ? (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-[#181818] border-white/10 rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center text-xs uppercase tracking-wider text-[#b3b3b3]">
                      <DollarSign className="w-4 h-4 mr-1.5 text-[#1ed760]" />
                      Total Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {formatCurrency(profitLoss.summary.totalRevenue)}
                    </div>
                    <p className="text-xs text-[#b3b3b3] mt-1">Accrued billings</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#181818] border-white/10 rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center text-xs uppercase tracking-wider text-[#b3b3b3]">
                      <TrendingDown className="w-4 h-4 mr-1.5 text-red-400" />
                      Total Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {formatCurrency(profitLoss.summary.totalExpenses)}
                    </div>
                    <p className="text-xs text-[#b3b3b3] mt-1">Operational overhead</p>
                  </CardContent>
                </Card>

                <Card className="bg-[#181818] border-white/10 rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center text-xs uppercase tracking-wider text-[#b3b3b3]">
                      <TrendingUp className={`w-4 h-4 mr-1.5 ${profitLoss.summary.netProfit >= 0 ? 'text-[#1ed760]' : 'text-red-400'}`} />
                      Net Profit
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {formatCurrency(profitLoss.summary.netProfit)}
                    </div>
                    <p className="text-xs text-[#b3b3b3] mt-1">
                      <span className={profitLoss.summary.netProfit >= 0 ? 'text-[#1ed760] font-bold' : 'text-red-400 font-bold'}>
                        {profitLoss.summary.profitMargin}%
                      </span> net margin
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#181818] border-white/10 rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white flex items-center text-xs uppercase tracking-wider text-[#b3b3b3]">
                      <PieChart className="w-4 h-4 mr-1.5 text-yellow-400" />
                      Tax Collected
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {formatCurrency(profitLoss.summary.taxCollected)}
                    </div>
                    <p className="text-xs text-[#b3b3b3] mt-1">GST/VAT payable</p>
                  </CardContent>
                </Card>
              </div>

              {/* P&L Detailed Ledger Table */}
              <Card className="bg-[#181818] border-white/10 rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#1ed760]" />
                        Statement of Profit & Loss
                      </CardTitle>
                      <CardDescription className="text-xs text-[#b3b3b3]">
                        Summary of income, deductions, and categorised expenditure
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="border-white/10 text-xs text-[#b3b3b3]">
                      Accrual Method
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Revenue Breakdown */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-[#1ed760] tracking-wider uppercase">Operating Revenue</div>
                    <div className="flex justify-between py-2 border-b border-white/5 text-sm">
                      <span className="text-[#b3b3b3]">Gross Invoiced Revenue</span>
                      <span className="font-mono font-bold text-white">{formatCurrency(profitLoss.summary.grossRevenue)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5 text-sm">
                      <span className="text-[#b3b3b3]">Less: Discounts Allowed</span>
                      <span className="font-mono font-bold text-red-400">({formatCurrency(profitLoss.summary.discounts)})</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/10 text-sm font-semibold">
                      <span className="text-white">Net Invoiced Revenue</span>
                      <span className="font-mono text-[#1ed760]">{formatCurrency(profitLoss.summary.netRevenue)}</span>
                    </div>
                  </div>

                  {/* Expense Breakdown */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-bold text-red-400 tracking-wider uppercase">Operating Expenses</div>
                    {Object.keys(profitLoss.expensesByCategory).length === 0 ? (
                      <p className="text-xs text-[#b3b3b3] py-2 italic">No recorded business expenses in this date range.</p>
                    ) : (
                      Object.entries(profitLoss.expensesByCategory).map(([category, amount]) => (
                        <div key={category} className="flex justify-between py-2 border-b border-white/5 text-sm">
                          <span className="text-[#b3b3b3]">{category}</span>
                          <span className="font-mono text-white">{formatCurrency(amount)}</span>
                        </div>
                      ))
                    )}
                    <div className="flex justify-between py-2 border-b border-white/10 text-sm font-semibold">
                      <span className="text-white">Total Operating Expenses</span>
                      <span className="font-mono text-red-400">{formatCurrency(profitLoss.summary.totalExpenses)}</span>
                    </div>
                  </div>

                  {/* Net Profit Banner */}
                  <div className={`flex items-center justify-between p-4 rounded-xl border ${
                    profitLoss.summary.netProfit >= 0 
                      ? 'bg-[#1ed760]/10 border-[#1ed760]/30' 
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-white">Net Income / Operating Profit</span>
                      <p className="text-xs text-[#b3b3b3]">After deductions and operational costs</p>
                    </div>
                    <span className={`text-2xl sm:text-3xl font-black font-mono ${
                      profitLoss.summary.netProfit >= 0 ? 'text-[#1ed760]' : 'text-red-400'
                    }`}>
                      {formatCurrency(profitLoss.summary.netProfit)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Revenue by Client Breakdown */}
              {profitLoss.topClients && profitLoss.topClients.length > 0 && (
                <Card className="bg-[#181818] border-white/10 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Client Revenue Contribution</CardTitle>
                    <CardDescription className="text-xs text-[#b3b3b3]">
                      Concentration of gross invoice volume by client account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {profitLoss.topClients.map((client, index) => {
                      const total = profitLoss.topClients.reduce((sum, c) => sum + c.amount, 0);
                      const percentage = total > 0 ? (client.amount / total) * 100 : 0;
                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-white">{client.name}</span>
                            <span className="font-mono font-bold text-[#1ed760]">{formatCurrency(client.amount)}</span>
                          </div>
                          <div className="w-full bg-[#282828] rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-[#1ed760] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.max(percentage, 2)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </TabsContent>

        {/* Balance Sheet */}
        <TabsContent value="balance-sheet" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[380px]">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#1ed760' }} />
                <p style={{ color: '#b3b3b3' }}>Balancing assets and liabilities...</p>
              </div>
            </div>
          ) : balanceSheet ? (
            <Card className="bg-[#181818] border-white/10 rounded-2xl">
              <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-[#1ed760]" />
                      Statement of Financial Position
                    </CardTitle>
                    <CardDescription className="text-xs text-[#b3b3b3]">
                      Balance sheet snapshot as of {balanceSheet.asOf}
                    </CardDescription>
                  </div>
                  <Badge className="bg-[#1ed760]/10 text-[#1ed760] border-transparent text-xs font-bold">
                    {balanceSheet.balanceCheck || 'BALANCED'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Assets Column */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-sm font-bold text-[#1ed760] tracking-wider uppercase">Current Assets</span>
                    <span className="text-xs text-[#b3b3b3]">Debit Normal</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-white/5 text-sm">
                      <span className="text-[#b3b3b3]">Cash & Settled Inflows</span>
                      <span className="font-mono text-white">{formatCurrency(balanceSheet.assets.cash)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5 text-sm">
                      <span className="text-[#b3b3b3]">Accounts Receivable (Uncollected)</span>
                      <span className="font-mono text-white">{formatCurrency(balanceSheet.assets.receivables)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-t border-white/10 text-sm font-bold">
                      <span className="text-white uppercase tracking-wider">Total Assets</span>
                      <span className="font-mono text-[#1ed760] text-lg">{formatCurrency(balanceSheet.totals.totalAssets)}</span>
                    </div>
                  </div>
                </div>

                {/* Liabilities & Equity Column */}
                <div className="space-y-6">
                  {/* Liabilities */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-sm font-bold text-red-400 tracking-wider uppercase">Liabilities</span>
                      <span className="text-xs text-[#b3b3b3]">Credit Normal</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5 text-sm">
                      <span className="text-[#b3b3b3]">Tax Payable (GST / VAT)</span>
                      <span className="font-mono text-white">{formatCurrency(balanceSheet.liabilities.taxPayable)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm font-semibold">
                      <span className="text-white">Total Liabilities</span>
                      <span className="font-mono text-red-400">{formatCurrency(balanceSheet.totals.totalLiabilities)}</span>
                    </div>
                  </div>

                  {/* Equity */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-sm font-bold text-blue-400 tracking-wider uppercase">Equity</span>
                      <span className="text-xs text-[#b3b3b3]">Owner Value</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-white/5 text-sm">
                      <span className="text-[#b3b3b3]">Retained Earnings</span>
                      <span className="font-mono text-white">{formatCurrency(balanceSheet.equity.retainedEarnings)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-sm font-semibold">
                      <span className="text-white">Total Equity</span>
                      <span className="font-mono text-blue-400">{formatCurrency(balanceSheet.totals.totalEquity)}</span>
                    </div>
                  </div>

                  {/* Double Entry Verification */}
                  <div className="flex justify-between py-3 border-t border-white/10 text-sm font-bold bg-[#1f1f1f] p-3 rounded-xl">
                    <span className="text-white uppercase tracking-wider">Total Liabilities & Equity</span>
                    <span className="font-mono text-white text-lg">
                      {formatCurrency(balanceSheet.totals.totalLiabilities + balanceSheet.totals.totalEquity)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>

        {/* Cash Flow */}
        <TabsContent value="cash-flow" className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[380px]">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#1ed760' }} />
                <p style={{ color: '#b3b3b3' }}>Aggregating operating cash flows...</p>
              </div>
            </div>
          ) : cashFlow ? (
            <Card className="bg-[#181818] border-white/10 rounded-2xl">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-[#1ed760]" />
                  Statement of Cash Flows
                </CardTitle>
                <CardDescription className="text-xs text-[#b3b3b3]">
                  Direct cash movements from operations, adjustments, and net capital change
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Operations */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#1ed760] tracking-wider uppercase">Operating Activities</div>
                  <div className="flex justify-between py-2 border-b border-white/5 text-sm">
                    <span className="text-[#b3b3b3]">Net Income Before Adjustments</span>
                    <span className="font-mono text-white">{formatCurrency(cashFlow.operating.netIncome)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/5 text-sm">
                    <span className="text-[#b3b3b3]">Impact of Uncollected Receivables</span>
                    <span className="font-mono text-red-400">({formatCurrency(Math.abs(cashFlow.operating.adjustments.receivablesChange))})</span>
                  </div>
                  <div className="flex justify-between py-3 border-t border-white/10 text-sm font-semibold">
                    <span className="text-white">Net Cash from Operating Activities</span>
                    <span className="font-mono text-[#1ed760]">{formatCurrency(cashFlow.operating.operatingCashFlow)}</span>
                  </div>
                </div>

                {/* Net Flow Summary */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#1ed760]/10 border border-[#1ed760]/30">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Net Cash Position</span>
                    <p className="text-xs text-[#b3b3b3]">Liquid cash surplus generated within current timeframe</p>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black font-mono text-[#1ed760]">
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
