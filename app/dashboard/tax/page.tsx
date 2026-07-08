'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, Download, FileText, TrendingUp, DollarSign, Calendar, Loader as Loader2, Filter, ChartPie as PieChart, ChartBar as BarChart3 } from 'lucide-react';
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
  const [summary, setSummary] = useState<TaxSummary | null>(null);
  const [gstSummary, setGstSummary] = useState<GstSummary[]>([]);
  const [monthlyTax, setMonthlyTax] = useState<MonthlyTax[]>([]);
  const [invoices, setInvoices] = useState<InvoiceTaxDetail[]>([]);

  const currentYear = new Date().getFullYear();
  const [startDate, setStartDate] = useState(`${currentYear}-01-01`);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (session?.access_token) {
      fetchTaxReport();
    }
  }, [session, startDate, endDate]);

  const fetchTaxReport = async () => {
    if (!session?.access_token) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/tax/report?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);
        setGstSummary(data.gstSummary);
        setMonthlyTax(data.monthlyTax);
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error('Error fetching tax report:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch tax report',
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

  const exportToCSV = () => {
    if (!invoices.length) return;

    const headers = ['Invoice', 'Client', 'Date', 'Status', 'Subtotal', 'Tax Rate', 'Tax Amount', 'Total'];
    const rows = invoices.map(inv => [
      inv.invoiceNumber,
      inv.clientName,
      inv.date,
      inv.status,
      inv.subtotal,
      `${inv.taxRate}%`,
      inv.taxAmount,
      inv.total,
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax-report-${startDate}-to-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Export Complete',
      description: 'Tax report downloaded as CSV',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#1ed760' }} />
          <p style={{ color: '#b3b3b3' }}>Generating tax report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            Tax Center
            <Badge
              variant="outline"
              className="text-xs"
              style={{ background: 'rgba(30,215,96,0.15)', color: '#1ed760', border: '1px solid rgba(30,215,96,0.3)' }}
            >
              <Calculator className="w-3 h-3 mr-1" />
              Auto-Calculated
            </Badge>
          </h1>
          <p className="text-base" style={{ color: '#b3b3b3' }}>
            GST/VAT calculations and tax reports
          </p>
        </div>
        <Button
          onClick={exportToCSV}
          className="font-bold text-sm"
          style={{ background: '#1ed760', color: '#000', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '1.4px' }}
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-12 text-white"
                style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-12 text-white"
                style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={fetchTaxReport}
                className="h-12 font-bold"
                style={{ background: '#1f1f1f', color: '#b3b3b3', borderRadius: '8px', border: '1px solid #4d4d4d' }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-sm font-bold">
                <DollarSign className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatCurrency(summary.totalRevenue)}</div>
              <p className="text-xs mt-1" style={{ color: '#b3b3b3' }}>For selected period</p>
            </CardContent>
          </Card>

          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-sm font-bold">
                <Calculator className="w-4 h-4 mr-2" style={{ color: '#f59e0b' }} />
                Tax Collected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatCurrency(summary.totalTaxCollected)}</div>
              <p className="text-xs mt-1" style={{ color: '#b3b3b3' }}>GST/VAT liability</p>
            </CardContent>
          </Card>

          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-sm font-bold">
                <TrendingUp className="w-4 h-4 mr-2" style={{ color: '#3b82f6' }} />
                Taxable Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatCurrency(summary.taxableRevenue)}</div>
              <p className="text-xs mt-1" style={{ color: '#b3b3b3' }}>Subject to tax</p>
            </CardContent>
          </Card>

          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-sm font-bold">
                <FileText className="w-4 h-4 mr-2" style={{ color: '#a855f7' }} />
                Exempt Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatCurrency(summary.exemptRevenue)}</div>
              <p className="text-xs mt-1" style={{ color: '#b3b3b3' }}>Tax exempt</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* GST/VAT Breakdown */}
      {gstSummary.length > 0 && (
        <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
          <CardHeader>
            <CardTitle className="text-white flex items-center text-sm font-bold">
              <PieChart className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
              Tax Rate Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {gstSummary.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg"
                  style={{ background: '#1f1f1f', borderLeft: '3px solid #1ed760' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white">{item.rate}</span>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{ background: 'rgba(30,215,96,0.15)', color: '#1ed760', border: '1px solid rgba(30,215,96,0.3)' }}
                    >
                      {item.taxType}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: '#b3b3b3' }}>Taxable:</span>
                      <span className="text-white">{formatCurrency(item.taxableAmount)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: '#b3b3b3' }}>Tax:</span>
                      <span className="text-white font-bold">{formatCurrency(item.taxAmount)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Tax Trend */}
      {monthlyTax.length > 0 && (
        <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
          <CardHeader>
            <CardTitle className="text-white flex items-center text-sm font-bold">
              <BarChart3 className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
              Monthly Tax Collected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {monthlyTax.slice(-6).map((item, index) => {
                const maxTax = Math.max(...monthlyTax.map(m => m.tax));
                const width = maxTax > 0 ? (item.tax / maxTax) * 100 : 0;
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-24 text-sm" style={{ color: '#b3b3b3' }}>{item.month}</div>
                    <div className="flex-1 h-8 rounded" style={{ background: '#1f1f1f' }}>
                      <div
                        className="h-full rounded flex items-center px-3"
                        style={{ width: `${width}%`, background: 'linear-gradient(90deg, rgba(30,215,96,0.3), rgba(30,215,96,0.6))', minWidth: '60px' }}
                      >
                        <span className="text-xs font-bold text-white">{formatCurrency(item.tax)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice Tax Details */}
      <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
        <CardHeader>
          <CardTitle className="text-white flex items-center text-sm font-bold">
            <FileText className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
            Tax Detail Report
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calculator className="w-12 h-12 mb-4" style={{ color: '#4d4d4d' }} />
              <p className="text-lg font-bold text-white">No tax data</p>
              <p className="text-sm" style={{ color: '#b3b3b3' }}>
                Create paid invoices to see tax breakdown
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ background: '#1f1f1f' }}>
                    <th className="text-left p-4 text-xs font-bold" style={{ color: '#b3b3b3' }}>Invoice</th>
                    <th className="text-left p-4 text-xs font-bold" style={{ color: '#b3b3b3' }}>Client</th>
                    <th className="text-left p-4 text-xs font-bold" style={{ color: '#b3b3b3' }}>Date</th>
                    <th className="text-left p-4 text-xs font-bold" style={{ color: '#b3b3b3' }}>Status</th>
                    <th className="text-right p-4 text-xs font-bold" style={{ color: '#b3b3b3' }}>Subtotal</th>
                    <th className="text-right p-4 text-xs font-bold" style={{ color: '#b3b3b3' }}>Tax Rate</th>
                    <th className="text-right p-4 text-xs font-bold" style={{ color: '#b3b3b3' }}>Tax</th>
                    <th className="text-right p-4 text-xs font-bold" style={{ color: '#b3b3b3' }}>Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: '#4d4d4d' }}>
                  {invoices.map((inv, index) => (
                    <tr key={index} className="hover:bg-white/5">
                      <td className="p-4 text-sm text-white">{inv.invoiceNumber}</td>
                      <td className="p-4 text-sm text-white">{inv.clientName}</td>
                      <td className="p-4 text-sm" style={{ color: '#b3b3b3' }}>{format(new Date(inv.date), 'MMM dd, yyyy')}</td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            background: inv.status === 'paid' ? 'rgba(30,215,96,0.15)' : 'rgba(59,130,246,0.15)',
                            color: inv.status === 'paid' ? '#1ed760' : '#3b82f6',
                            border: `1px solid ${inv.status === 'paid' ? 'rgba(30,215,96,0.3)' : 'rgba(59,130,246,0.3)'}`,
                          }}
                        >
                          {inv.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm text-white text-right">{formatCurrency(inv.subtotal)}</td>
                      <td className="p-4 text-sm text-white text-right">{inv.taxRate}%</td>
                      <td className="p-4 text-sm font-bold text-white text-right">{formatCurrency(inv.taxAmount)}</td>
                      <td className="p-4 text-sm font-bold text-white text-right">{formatCurrency(inv.total)}</td>
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
