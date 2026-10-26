'use client';

import { useState, useEffect, useCallback } from 'react';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Download, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Loader2, 
  Filter, 
  PieChart, 
  BarChart3,
  RotateCw,
  ShieldCheck,
  Percent,
  Receipt,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface TaxSummary {
  totalRevenue: number;
  totalTaxCollected: number;
  taxableRevenue: number;
  exemptRevenue: number;
  taxBreakdown: { [rate: string]: { taxable: number; tax: number } };
}

interface GstSummary {
  rate: string;
  taxableAmount: number;
  taxAmount: number;
  taxType: string;
}

interface MonthlyTax {
  month: string;
  revenue: number;
  tax: number;
}

interface InvoiceTaxDetail {
  invoiceNumber: string;
  clientName: string;
  date: string;
  status: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export default function TaxCenterPage() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<TaxSummary | null>(null);
  const [gstSummary, setGstSummary] = useState<GstSummary[]>([]);
  const [monthlyTax, setMonthlyTax] = useState<MonthlyTax[]>([]);
  const [invoices, setInvoices] = useState<InvoiceTaxDetail[]>([]);

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

  const fetchTaxReport = useCallback(async (isRefresh = false) => {
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
        `/api/tax/report?startDate=${startDate}&endDate=${endDate}`,
        {
          headers,
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);
        setGstSummary(data.gstSummary || []);
        setMonthlyTax(data.monthlyTax || []);
        setInvoices(data.invoices || []);

        if (isRefresh) {
          toast({
            title: 'Tax Ledger Updated',
            description: 'Tax liabilities recalculated from current invoices.',
          });
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to fetch tax report');
      }
    } catch (error: any) {
      console.error('Error fetching tax report:', error);
      toast({
        title: 'Tax Sync Notice',
        description: error.message || 'Failed to fetch tax liability figures.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getEffectiveToken, startDate, endDate, toast]);

  useEffect(() => {
    fetchTaxReport();
  }, [fetchTaxReport]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  const exportToCSV = () => {
    if (!invoices.length) {
      toast({
        title: 'No Data to Export',
        description: 'No tax entries found within the selected date range.',
      });
      return;
    }

    try {
      const headers = ['Invoice Number', 'Client Name', 'Invoice Date', 'Status', 'Subtotal', 'Tax Rate', 'Tax Amount', 'Total'];
      const rows = invoices.map(inv => [
        `"${inv.invoiceNumber}"`,
        `"${inv.clientName.replace(/"/g, '""')}"`,
        `"${inv.date}"`,
        `"${inv.status}"`,
        inv.subtotal,
        `"${inv.taxRate}%"`,
        inv.taxAmount,
        inv.total,
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `SmartInvoice_Tax_Audit_${startDate}_to_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'Export Complete',
        description: 'Tax audit report downloaded as CSV.',
      });
    } catch (err: any) {
      toast({
        title: 'Export Error',
        description: err.message || 'Could not export CSV.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <LuxuryLoader 
        label="Compiling GST/VAT liabilities & tax schedules..." 
        sublabel="Fiscal Ledger" 
        minHeight="min-h-[420px]" 
      />
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-block w-2 h-2 rounded-full bg-[#1ed760] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#1ed760] font-bold">Tax Compliance & Filings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Tax Center
            <Badge
              variant="outline"
              className="text-xs border-[#1ed760]/30 bg-[#1ed760]/10 text-[#1ed760] font-bold"
            >
              <Calculator className="w-3 h-3 mr-1" />
              Auto-Calculated
            </Badge>
          </h1>
          <p className="text-sm sm:text-base text-[#b3b3b3]">
            GST/VAT schedules, collected liabilities, taxable breakdowns, and audit trails
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => fetchTaxReport(true)}
            disabled={refreshing || loading}
            className="border-white/10 bg-[#181818] hover:bg-[#222222] text-white rounded-full px-4 h-10 text-xs font-semibold"
          >
            <RotateCw className={`w-3.5 h-3.5 mr-2 text-[#1ed760] ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Recalculating...' : 'Sync'}
          </Button>
          <Button
            onClick={exportToCSV}
            className="bg-[#1ed760] text-black hover:bg-[#1abe53] rounded-full px-4 h-10 text-xs font-bold uppercase tracking-wider"
          >
            <Download className="w-3.5 h-3.5 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Date Filter Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#181818] border border-white/10 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <Calendar className="w-4 h-4 text-[#1ed760]" />
          <span className="font-semibold text-white">Period:</span>
          <div className="flex flex-wrap gap-1">
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

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[#b3b3b3]">From</span>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDatePreset('all');
              }}
              className="h-8 text-xs text-white bg-[#1f1f1f] border-white/10 rounded-lg w-36"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#b3b3b3]">To</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDatePreset('all');
              }}
              className="h-8 text-xs text-white bg-[#1f1f1f] border-white/10 rounded-lg w-36"
            />
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#181818] border-white/10 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-xs uppercase tracking-wider text-[#b3b3b3]">
                <DollarSign className="w-4 h-4 mr-1.5 text-[#1ed760]" />
                Total Invoiced
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {formatCurrency(summary.totalRevenue)}
              </div>
              <p className="text-xs text-[#b3b3b3] mt-1">Gross volume for period</p>
            </CardContent>
          </Card>

          <Card className="bg-[#181818] border-white/10 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-xs uppercase tracking-wider text-[#b3b3b3]">
                <Calculator className="w-4 h-4 mr-1.5 text-[#f59e0b]" />
                Tax Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {formatCurrency(summary.totalTaxCollected)}
              </div>
              <p className="text-xs text-[#b3b3b3] mt-1">Total GST/VAT collected</p>
            </CardContent>
          </Card>

          <Card className="bg-[#181818] border-white/10 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-xs uppercase tracking-wider text-[#b3b3b3]">
                <TrendingUp className="w-4 h-4 mr-1.5 text-blue-400" />
                Taxable Base
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {formatCurrency(summary.taxableRevenue)}
              </div>
              <p className="text-xs text-[#b3b3b3] mt-1">Subject to standard rates</p>
            </CardContent>
          </Card>

          <Card className="bg-[#181818] border-white/10 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-xs uppercase tracking-wider text-[#b3b3b3]">
                <FileText className="w-4 h-4 mr-1.5 text-purple-400" />
                Exempt / Zero-Rated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {formatCurrency(summary.exemptRevenue)}
              </div>
              <p className="text-xs text-[#b3b3b3] mt-1">0% or non-taxable sales</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tax Rate Breakdown & Monthly Tax Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GST / Tax Rate Tiers */}
        <Card className="bg-[#181818] border-white/10 rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1ed760]/10 flex items-center justify-center">
                <PieChart className="w-4 h-4 text-[#1ed760]" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Tax Rate Tiers</CardTitle>
                <CardDescription className="text-xs text-[#b3b3b3]">
                  Segregated taxable value and tax collected by tax rate percentage
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {gstSummary.length === 0 ? (
              <div className="text-center py-8">
                <Percent className="w-8 h-8 text-[#b3b3b3] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[#b3b3b3]">No active tax rate tiers in this period.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gstSummary.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-[#1f1f1f] border border-white/5 space-y-2 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">{item.rate}</span>
                      <Badge className="bg-[#1ed760]/10 text-[#1ed760] border-transparent text-xs font-bold">
                        {item.taxType}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-[#b3b3b3]">Taxable Base:</span>
                        <span className="font-mono text-white">{formatCurrency(item.taxableAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#b3b3b3]">Tax Collected:</span>
                        <span className="font-mono font-bold text-[#1ed760]">{formatCurrency(item.taxAmount)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Tax Collected Trend */}
        <Card className="bg-[#181818] border-white/10 rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Monthly Tax Inflows</CardTitle>
                <CardDescription className="text-xs text-[#b3b3b3]">
                  Monthly collected GST/VAT liability trail
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {monthlyTax.length === 0 ? (
              <div className="text-center py-8">
                <BarChart3 className="w-8 h-8 text-[#b3b3b3] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[#b3b3b3]">Monthly tax collection data will appear here.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {monthlyTax.slice(-6).map((item, index) => {
                  const maxTax = Math.max(...monthlyTax.map(m => m.tax), 1);
                  const width = (item.tax / maxTax) * 100;
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-white font-semibold">{item.month}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[#b3b3b3]">Base: {formatCurrency(item.revenue)}</span>
                          <span className="font-mono font-bold text-yellow-400">{formatCurrency(item.tax)}</span>
                        </div>
                      </div>
                      <div className="w-full bg-[#282828] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(width, 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoice Tax Audit Ledger */}
      <Card className="bg-[#181818] border-white/10 rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-white/5 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1ed760]/10 flex items-center justify-center">
                <Receipt className="w-4 h-4 text-[#1ed760]" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Tax Audit Ledger</CardTitle>
                <CardDescription className="text-xs text-[#b3b3b3]">
                  Invoice-by-invoice tax computation and audit trail for filing verification
                </CardDescription>
              </div>
            </div>
            <span className="text-xs text-[#b3b3b3]">
              {invoices.length} {invoices.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calculator className="w-10 h-10 mb-3 text-[#b3b3b3] opacity-40" />
              <p className="text-sm font-bold text-white">No Tax Records Found</p>
              <p className="text-xs text-[#b3b3b3] mt-1 max-w-sm">
                Invoices with tax rates will automatically populate this audit ledger once created and sent.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#141414] border-b border-white/10 text-xs font-bold text-[#b3b3b3] uppercase tracking-wider">
                    <th className="text-left p-4">Invoice</th>
                    <th className="text-left p-4">Client</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-right p-4">Subtotal</th>
                    <th className="text-right p-4">Rate</th>
                    <th className="text-right p-4">Tax Amount</th>
                    <th className="text-right p-4">Gross Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {invoices.map((inv, index) => (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-semibold text-white">{inv.invoiceNumber}</td>
                      <td className="p-4 text-white">{inv.clientName}</td>
                      <td className="p-4 text-[#b3b3b3] font-mono text-xs">
                        {inv.date ? format(new Date(inv.date), 'MMM dd, yyyy') : 'N/A'}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className="text-xs uppercase"
                          style={{
                            background: inv.status === 'paid' ? 'rgba(30,215,96,0.15)' : 'rgba(59,130,246,0.15)',
                            color: inv.status === 'paid' ? '#1ed760' : '#3b82f6',
                            border: `1px solid ${inv.status === 'paid' ? 'rgba(30,215,96,0.3)' : 'rgba(59,130,246,0.3)'}`,
                          }}
                        >
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono text-white text-right">{formatCurrency(inv.subtotal)}</td>
                      <td className="p-4 font-mono text-[#b3b3b3] text-right">{inv.taxRate}%</td>
                      <td className="p-4 font-mono font-bold text-[#1ed760] text-right">{formatCurrency(inv.taxAmount)}</td>
                      <td className="p-4 font-mono font-bold text-white text-right">{formatCurrency(inv.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
