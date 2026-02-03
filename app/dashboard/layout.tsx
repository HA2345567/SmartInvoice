'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileText, Home, Plus, Users, Settings, LogOut, Menu, X, BarChart3, Download, Sparkles, FileDown, Bell, Zap, Receipt } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { AiChatbot } from '@/components/ai/AiChatbot';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout, loading, token } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    // Only check authentication after loading is complete
    if (!loading) {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken && !user) {
        return;
      }
      if (!storedToken && !user && !token) {
        router.push('/auth/login');
      }
    }
  }, [user, loading, token, router]);

  const navigation = useMemo(() => [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Create Invoice', href: '/dashboard/create', icon: Plus },
    { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
    { name: 'Clients', href: '/dashboard/clients', icon: Users },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Expenses', href: '/dashboard/expenses', icon: Receipt, badge: 'AI' },
    { name: 'AI Payment Agent', href: '/dashboard/agent', icon: Zap, badge: 'NEW' },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ], []);

  const handleExportInvoices = useCallback(async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export/invoices', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoices-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({ title: 'Success', description: 'Invoices exported successfully' });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to export invoices', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  }, [token, toast]);

  const handleExportClients = useCallback(async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export/clients', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clients-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({ title: 'Success', description: 'Clients exported successfully' });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to export clients', variant: 'destructive' });
    } finally {
      setIsExporting(false);
    }
  }, [token, toast]);

  const isActiveRoute = useCallback((href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-dark w-12 h-12 mx-auto mb-4"></div>
          <p className="text-dark-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!loading && !user && !token) {
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (!storedToken || !storedUser) {
      return null;
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-dark w-12 h-12 mx-auto mb-4"></div>
          <p className="text-dark-muted">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar
        user={user}
        navigation={navigation}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isActiveRoute={isActiveRoute}
        handleExportInvoices={handleExportInvoices}
        handleExportClients={handleExportClients}
        isExporting={isExporting}
        logout={logout}
      />

      {/* Main content */}
      <div className="main-content-responsive">
        {/* Top Nav Component */}
        <TopNav setSidebarOpen={setSidebarOpen} />

        {/* Page content */}
        <main className="content-area-responsive mobile-safe-area">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Floating Action Button */}
      <Link href="/dashboard/create" className="mobile-fab">
        <Plus className="w-6 h-6" />
      </Link>

      <FeedbackWidget />
      <AiChatbot />
    </div>
  );
}
