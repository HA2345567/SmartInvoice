// Dashboard Main Page
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, DollarSign, Clock, TrendingUp, Plus, Download, Users, AlertCircle, BarChart3, Sparkles, Zap, CheckCircle, Send, Calendar, Eye } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

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

// Helper function to safely format dates
const safeFormatDate = (dateString: string | null | undefined, formatString: string = 'MMM dd, yyyy') => {
  if (!dateString) return 'Not set';
  try {
    return format(new Date(dateString), formatString);
  } catch (error) {
    return 'Invalid date';
  }
};

// Helper function to safely format currency
const safeFormatCurrency = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '0.00';
  return Number(amount).toFixed(2);
};

import { StatsGrid } from './components/StatsGrid';
import { IncomeTrend } from './components/IncomeTrend';
import { RecentInvoices } from './components/RecentInvoices';
import { PendingInvoices } from './components/PendingInvoices';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { token, user } = useAuth();

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const [analyticsResponse, invoicesResponse] = await Promise.all([
        fetch('/api/analytics', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch('/api/invoices', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
      ]);

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }

      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json();
        setRecentInvoices(invoicesData.slice(0, 5));

        // Filter pending invoices (sent + overdue)
        const pending = invoicesData.filter((inv: Invoice) =>
          inv.status === 'sent' || inv.status === 'overdue'
        ).slice(0, 10);
        setPendingInvoices(pending);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'short', year: '2-digit' });
  const currentMonthRevenue = analytics?.monthlyData.find(m => m.month === currentMonth)?.revenue || 0;

  const stats = analytics ? [
    {
      title: 'Total Revenue',
      value: `$${safeFormatCurrency(analytics.totalRevenue)}`,
      change: `${analytics.paidInvoices} paid invoices`,
      changeType: 'positive',
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Pending Invoices',
      value: (analytics.pendingInvoices || 0).toString(),
      change: `${analytics.invoiceStatusDistribution.overdue || 0} overdue`,
      changeType: (analytics.invoiceStatusDistribution.overdue || 0) > 0 ? 'negative' : 'neutral',
      icon: Clock,
      color: 'yellow',
    },
    {
      title: 'This Month',
      value: `$${safeFormatCurrency(currentMonthRevenue)}`,
      change: 'Revenue this month',
      changeType: 'positive',
      icon: Calendar,
      color: 'blue',
    },
    {
      title: 'Avg. Invoice Value',
      value: `$${safeFormatCurrency(analytics.averageInvoiceValue)}`,
      change: `Based on ${analytics.paidInvoices} paid invoices`,
      changeType: 'neutral',
      icon: TrendingUp,
      color: 'purple',
    },
  ] : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'sent': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'overdue': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'draft': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getDaysOverdue = (dueDate: string) => {
    if (!dueDate) return 0;
    try {
      const due = new Date(dueDate);
      const today = new Date();
      const diffTime = today.getTime() - due.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="spinner-dark w-12 h-12 mx-auto mb-4"></div>
          <p className="text-dark-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Dashboard</h1>
          <p className="text-dark-muted text-base sm:text-lg">
            Welcome back, {user?.name || 'User'}! Here's your business overview.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link href="/dashboard/create/select-type">
            <Button className="btn-dark-primary dark-glow w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid Component */}
      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Income Trend Component */}
        <IncomeTrend analytics={analytics} safeFormatCurrency={safeFormatCurrency} />

        {/* Quick Actions */}
        <Card className="card-dark-mist">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="w-5 h-5 mr-2 text-dark-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col space-y-3">
            <Link href="/dashboard/create/select-type">
              <Button className="w-full justify-start btn-subtle-dark">
                <Plus className="w-4 h-4 mr-2" />
                New Invoice
              </Button>
            </Link>
            <Link href="/dashboard/clients">
              <Button className="w-full justify-start btn-subtle-dark">
                <Users className="w-4 h-4 mr-2" />
                Manage Clients
              </Button>
            </Link>
            <Link href="/dashboard/reminders">
              <Button className="w-full justify-start btn-subtle-dark">
                <Clock className="w-4 h-4 mr-2" />
                Payment Reminders
              </Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button className="w-full justify-start btn-subtle-dark">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Invoices Component */}
        <RecentInvoices
          recentInvoices={recentInvoices}
          safeFormatDate={safeFormatDate}
          safeFormatCurrency={safeFormatCurrency}
          getStatusColor={getStatusColor}
        />

        {/* Pending Invoices Component */}
        <PendingInvoices
          pendingInvoices={pendingInvoices}
          safeFormatDate={safeFormatDate}
          safeFormatCurrency={safeFormatCurrency}
          getDaysOverdue={getDaysOverdue}
        />
      </div>
    </div>
  );
}
