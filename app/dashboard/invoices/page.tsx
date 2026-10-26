'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Eye, Download, Send, Trash2, Search, Filter, Plus, CircleCheck as CheckCircle, Clock, TriangleAlert as AlertTriangle, CreditCard as Edit, Calendar, DollarSign, CreditCard, FileDown, Sparkles, TrendingUp, Users, Zap, CircleAlert as AlertCircle, ChartBar as BarChart3, Loader2, RotateCw } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';

// Helper function to safely format dates
const formatDate = (dateString: string | null | undefined, formatString: string = 'MMM dd, yyyy') => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return format(date, formatString);
  } catch (error) {
    return 'Invalid Date';
  }
};

// Helper function to safely format currency amounts
const formatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '0.00';
  return Number(amount).toFixed(2);
};

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
    id: string;
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
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  date: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  createdAt: string;
}

const statusConfig = {
  draft: {
    label: 'Draft',
    color: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20',
    dotColor: '#71717a',
    icon: Edit,
    description: 'Invoice drafted, awaiting dispatch'
  },
  sent: {
    label: 'Pending',
    color: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    dotColor: '#f59e0b',
    icon: Send,
    description: 'Invoice issued, awaiting settlement'
  },
  paid: {
    label: 'Paid',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dotColor: '#1ed760',
    icon: CheckCircle,
    description: 'Payment fully settled'
  },
  overdue: {
    label: 'Overdue',
    color: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    dotColor: '#f43f5e',
    icon: AlertTriangle,
    description: 'Payment past agreed terms'
  }
};

const paymentMethods = [
  'Bank Transfer',
  'Credit Card',
  'PayPal',
  'Stripe',
  'Razorpay',
  'Cash',
  'Check',
  'Other'
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [paymentData, setPaymentData] = useState({
    paidDate: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    notes: ''
  });
  const { toast } = useToast();
  const { session, loading: authLoading } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const getEffectiveToken = useCallback(() => {
    if (session?.access_token) return session.access_token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token') || localStorage.getItem('token') || '';
    }
    return '';
  }, [session?.access_token]);

  const fetchInvoices = useCallback(async (isRefresh = false) => {
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

      const response = await fetch('/api/invoices', {
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setInvoices(Array.isArray(data) ? data : []);
        if (isRefresh) {
          toast({
            title: 'Invoices Synced',
            description: 'Latest invoices loaded from database.',
          });
        }
      } else {
        throw new Error('Failed to fetch invoices');
      }
    } catch (error) {
      console.error('Fetch invoices error:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch invoices',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getEffectiveToken, toast]);

  useEffect(() => {
    if (!authLoading) {
      fetchInvoices();
    }
  }, [authLoading, fetchInvoices]);

  const filteredInvoices = useMemo(() => {
    let filtered = invoices;

    if (searchTerm.trim()) {
      const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        invoice =>
          (invoice.invoiceNumber || '').toLowerCase().includes(lowercasedSearchTerm) ||
          (invoice.clientName || '').toLowerCase().includes(lowercasedSearchTerm) ||
          (invoice.clientEmail || '').toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    return filtered;
  }, [invoices, searchTerm, statusFilter]);

  const handleDownloadPDF = async (invoiceId: string, invoiceNumber: string) => {
    try {
      const token = getEffectiveToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/invoices/${invoiceId}/pdf`, {
        headers,
        credentials: 'include',
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: 'Success',
          description: 'Branded PDF downloaded successfully',
        });
      } else {
        throw new Error('Failed to download PDF');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download PDF',
        variant: 'destructive',
      });
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const token = getEffectiveToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/export/invoices', {
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoices-export-${formatDate(new Date().toISOString(), 'yyyy-MM-dd')}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: 'Success',
          description: 'All invoices exported to CSV successfully',
        });
      } else {
        throw new Error('Failed to export invoices');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export invoices',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleBulkDownloadPDFs = async () => {
    if (filteredInvoices.length === 0) {
      toast({
        title: 'No Invoices',
        description: 'No invoices to download',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    let successCount = 0;
    let errorCount = 0;

    for (const invoice of filteredInvoices) {
      try {
        await handleDownloadPDF(invoice.id, invoice.invoiceNumber);
        successCount++;
        // Add small delay to prevent overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        errorCount++;
      }
    }

    setIsExporting(false);
    
    if (successCount > 0) {
      toast({
        title: 'Bulk Download Complete',
        description: `${successCount} PDFs downloaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
      });
    } else {
      toast({
        title: 'Download Failed',
        description: 'Failed to download PDFs',
        variant: 'destructive',
      });
    }
  };

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      const token = getEffectiveToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/invoices/${invoiceId}/send`, {
        method: 'POST',
        headers,
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });
        
        if (result.warning) {
          toast({
            title: 'Warning',
            description: result.warning,
            variant: 'destructive',
          });
        }
        
        fetchInvoices();
      } else {
        throw new Error(result.error || 'Failed to send invoice');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send invoice',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAsPaid = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentData({
      paidDate: new Date().toISOString().split('T')[0],
      paymentMethod: '',
      notes: ''
    });
    setIsPaymentDialogOpen(true);
  };

  const handleChangeStatus = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsStatusDialogOpen(true);
  };

  const submitPayment = async () => {
    if (!selectedInvoice) return;

    if (!paymentData.paymentMethod) {
      toast({
        title: 'Validation Error',
        description: 'Please select a payment method',
        variant: 'destructive',
      });
      return;
    }

    try {
      const token = getEffectiveToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/invoices/${selectedInvoice.id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          status: 'paid',
          paidDate: paymentData.paidDate,
          paymentMethod: paymentData.paymentMethod,
          paymentNotes: paymentData.notes,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Payment recorded successfully',
        });
        setIsPaymentDialogOpen(false);
        setSelectedInvoice(null);
        fetchInvoices();
      } else {
        throw new Error(result.error || 'Failed to record payment');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to record payment',
        variant: 'destructive',
      });
    }
  };

  const submitStatusChange = async (newStatus: string) => {
    if (!selectedInvoice) return;

    try {
      const updateData: any = { status: newStatus };
      
      // If changing from paid to another status, clear payment data
      if (selectedInvoice.status === 'paid' && newStatus !== 'paid') {
        updateData.paidDate = null;
        updateData.paymentMethod = null;
        updateData.paymentNotes = null;
      }

      const token = getEffectiveToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/invoices/${selectedInvoice.id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Invoice status updated to ${statusConfig[newStatus as keyof typeof statusConfig].label}`,
        });
        setIsStatusDialogOpen(false);
        setSelectedInvoice(null);
        fetchInvoices();
      } else {
        throw new Error(result.error || 'Failed to update status');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) return;

    try {
      const token = getEffectiveToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Invoice deleted successfully',
        });
        fetchInvoices();
      } else {
        throw new Error('Failed to delete invoice');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete invoice',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) {
      return (
        <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
          Unknown
        </Badge>
      );
    }
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${config.color}`}>
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: config.dotColor }} />
        <span>{config.label}</span>
      </span>
    );
  };

  const getDaysOverdue = (dueDate: string) => {
    if (!dueDate) return 0;
    
    try {
      const due = new Date(dueDate);
      if (isNaN(due.getTime())) return 0;
      
      const today = new Date();
      const diffTime = today.getTime() - due.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      return 0;
    }
  };

  const getPaymentRiskIndicator = (dueDateStr: string, status: string) => {
    if (status === 'draft') return null;
    const days = getDaysOverdue(dueDateStr);
    
    if (days < 0) {
      const remainingDays = Math.abs(days);
      if (remainingDays > 5) {
        return (
          <span className="flex items-center text-xs text-green-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
            Low Risk
          </span>
        );
      } else {
        return (
          <span className="flex items-center text-xs text-yellow-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1.5 shadow-[0_0_8px_rgba(234,179,8,0.6)] animate-pulse" />
            Medium Risk
          </span>
        );
      }
    } else {
      return (
        <span className="flex items-center text-xs text-red-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
          High Risk
        </span>
      );
    }
  };

  const calculatePredictedPaymentDate = (createdAtStr: string, status: string) => {
    if (!createdAtStr) return 'N/A';
    try {
      const baseDate = new Date(createdAtStr);
      if (isNaN(baseDate.getTime())) return 'N/A';
      
      const daysToAdd = status === 'overdue' ? 35 : 14;
      const predictedDate = new Date(baseDate);
      predictedDate.setDate(baseDate.getDate() + daysToAdd);
      
      return formatDate(predictedDate.toISOString());
    } catch {
      return 'N/A';
    }
  };

  if (authLoading) {
    return <LuxuryLoader label="Authenticating session..." sublabel="Securing Financial Vault" />;
  }

  if (loading) {
    return <LuxuryLoader label="Loading invoices..." sublabel="Accounts Receivable" />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-light text-white tracking-tight">Invoices</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage, track, and export commercial billing records.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => fetchInvoices(true)}
            disabled={refreshing}
            className="border-white/10 hover:bg-white/5 text-zinc-300 text-xs font-medium rounded-full px-3.5 h-9"
          >
            <RotateCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? 'animate-spin text-[#1ed760]' : ''}`} />
            {refreshing ? 'Syncing...' : 'Sync'}
          </Button>
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={isExporting || invoices.length === 0}
            className="border-white/10 hover:bg-white/5 text-zinc-300 text-xs font-medium rounded-full px-3.5 h-9"
          >
            <FileDown className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
            {isExporting ? 'Exporting...' : 'CSV'}
          </Button>
          <Button
            variant="outline"
            onClick={handleBulkDownloadPDFs}
            disabled={isExporting || filteredInvoices.length === 0}
            className="border-white/10 hover:bg-white/5 text-zinc-300 text-xs font-medium rounded-full px-3.5 h-9"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
            {isExporting ? 'Downloading...' : 'All PDFs'}
          </Button>
          <Link href="/dashboard/create">
            <Button className="bg-[#1ed760] text-black font-semibold text-xs rounded-full px-5 h-9 hover:bg-[#1fdf64] transition-all active:scale-[0.98]">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Search & Pill Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
          <Input
            placeholder="Search by invoice #, client, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 text-xs bg-[#181818] border-white/10 text-white rounded-full placeholder:text-zinc-500"
          />
        </div>

        {/* Status Pill Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-black font-semibold'
                : 'bg-[#181818] text-zinc-400 border border-white/[0.08] hover:text-white'
            }`}
          >
            All ({invoices.length})
          </button>
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = invoices.filter(inv => inv.status === status).length;
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-white text-black font-semibold'
                    : 'bg-[#181818] text-zinc-400 border border-white/[0.08] hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.dotColor }} />
                <span>{config.label}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Invoices Document Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#181818] overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FileText className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-sm font-medium text-white mb-1">No invoices found</h3>
            <p className="text-xs text-zinc-500 mb-5 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all'
                ? 'No invoices match your current search or status filter.'
                : 'Create your first invoice to begin tracking billing.'}
            </p>
            <Link href="/dashboard/create">
              <Button className="bg-[#1ed760] text-black font-semibold text-xs rounded-full px-5 h-9 hover:bg-[#1fdf64]">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Create Invoice
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] bg-[#141414] text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                  <th className="py-3 px-4 sm:px-6">Invoice</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4 hidden md:table-cell">Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredInvoices.map((invoice) => (
                  <tr 
                    key={invoice.id} 
                    className="hover:bg-white/[0.02] transition-colors group text-xs"
                  >
                    {/* Invoice ID */}
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-zinc-300 font-medium whitespace-nowrap">
                      #{invoice.invoiceNumber || '---'}
                    </td>

                    {/* Client */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{invoice.clientName || 'No Client'}</div>
                      {invoice.clientEmail && (
                        <div className="text-[11px] text-zinc-500 truncate max-w-[180px]">{invoice.clientEmail}</div>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-zinc-400 hidden md:table-cell whitespace-nowrap">
                      {formatDate(invoice.createdAt || invoice.date)}
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-zinc-400">{formatDate(invoice.dueDate)}</span>
                      {invoice.status === 'overdue' && (
                        <span className="block text-[11px] text-rose-400 font-medium">
                          {getDaysOverdue(invoice.dueDate)}d overdue
                        </span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 px-4 text-right font-light text-white text-sm whitespace-nowrap">
                      ${formatCurrency(invoice.amount)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(invoice.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
                          onClick={() => handleDownloadPDF(invoice.id, invoice.invoiceNumber)}
                          title="Download PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        
                        {invoice.status === 'draft' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
                            onClick={() => handleSendInvoice(invoice.id)}
                            title="Send Invoice"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        
                        {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-zinc-400 hover:text-[#1ed760] hover:bg-white/5 rounded-lg"
                            onClick={() => handleMarkAsPaid(invoice)}
                            title="Mark as Paid"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
                          onClick={() => handleChangeStatus(invoice)}
                          title="Change Status"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-zinc-400 hover:text-rose-400 hover:bg-white/5 rounded-lg"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          title="Delete Invoice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[480px] bg-[#181818] border border-white/10 text-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-medium text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#1ed760]" />
              Record Payment
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Record settlement details for invoice #{selectedInvoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="paidDate" className="text-xs font-medium text-zinc-300">Payment Date</Label>
              <Input
                id="paidDate"
                type="date"
                value={paymentData.paidDate}
                onChange={(e) => setPaymentData(prev => ({ ...prev, paidDate: e.target.value }))}
                className="bg-[#1f1f1f] border-white/10 text-white text-xs h-9 rounded-lg"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="paymentMethod" className="text-xs font-medium text-zinc-300">Payment Method</Label>
              <Select
                value={paymentData.paymentMethod}
                onValueChange={(value) => setPaymentData(prev => ({ ...prev, paymentMethod: value }))}
              >
                <SelectTrigger className="bg-[#1f1f1f] border-white/10 text-white text-xs h-9 rounded-lg">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-[#1f1f1f] border-white/10 text-white">
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="paymentNotes" className="text-xs font-medium text-zinc-300">Notes (Optional)</Label>
              <Input
                id="paymentNotes"
                value={paymentData.notes}
                onChange={(e) => setPaymentData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Reference #, bank wire details, etc."
                className="bg-[#1f1f1f] border-white/10 text-white text-xs h-9 rounded-lg"
              />
            </div>
            
            {selectedInvoice && (
              <div className="p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.08] flex justify-between items-center text-xs">
                <span className="text-zinc-400">Total Invoice Amount:</span>
                <span className="text-white font-medium text-sm">${formatCurrency(selectedInvoice.amount)}</span>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
              className="border-white/10 hover:bg-white/5 text-zinc-300 text-xs rounded-full px-4 h-9"
            >
              Cancel
            </Button>
            <Button
              onClick={submitPayment}
              className="bg-[#1ed760] text-black font-semibold text-xs rounded-full px-5 h-9 hover:bg-[#1fdf64]"
            >
              Confirm Settlement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-[#181818] border border-white/10 text-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-medium text-white flex items-center gap-2">
              <Edit className="w-4 h-4 text-[#1ed760]" />
              Update Document Status
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Set commercial lifecycle status for invoice #{selectedInvoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2 py-3">
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon;
              const isCurrentStatus = selectedInvoice?.status === status;
              
              return (
                <button
                  key={status}
                  type="button"
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isCurrentStatus 
                      ? 'border-[#1ed760]/50 bg-[#1ed760]/10 text-white' 
                      : 'border-white/[0.08] bg-[#1f1f1f] text-zinc-300 hover:border-white/20 hover:text-white'
                  }`}
                  onClick={() => submitStatusChange(status)}
                  disabled={isCurrentStatus}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: config.dotColor }} />
                    <div>
                      <p className="text-xs font-medium">{config.label}</p>
                      <p className="text-[11px] text-zinc-500">{config.description}</p>
                    </div>
                  </div>
                  {isCurrentStatus && (
                    <CheckCircle className="w-4 h-4 text-[#1ed760]" />
                  )}
                </button>
              );
            })}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
              className="border-white/10 hover:bg-white/5 text-zinc-300 text-xs rounded-full px-4 h-9"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}