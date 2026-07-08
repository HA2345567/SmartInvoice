'use client';

import { useEffect, useMemo, useCallback, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FileText, Chrome as Home, Plus, Users, Settings, LogOut, Menu, X, ChartBar as BarChart3, Download, Sparkles, FileDown, Bell, Zap, Receipt, Calculator } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { AiChatbot } from '@/components/ai/AiChatbot';
import Logo, { LogoMarkOnly } from '@/components/Logo';

// Spotify design system colors
const spotify = {
  nearBlack: '#121212',
  darkSurface: '#181818',
  midDark: '#1f1f1f',
  green: '#1ed760',
  textBase: '#ffffff',
  textMuted: '#b3b3b3',
  borderGray: '#4d4d4d',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const navigation = useMemo(() => [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Create Invoice', href: '/dashboard/create', icon: Plus },
    { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
    { name: 'Proposals', href: '/dashboard/proposals', icon: FileText, badge: 'AI' },
    { name: 'Clients', href: '/dashboard/clients', icon: Users },
    { name: 'Expenses', href: '/dashboard/expenses', icon: Receipt, badge: 'AI' },
    { name: 'Tax Center', href: '/dashboard/tax', icon: Calculator },
    { name: 'Reports', href: '/dashboard/reports', icon: BarChart3 },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'AI Payment Agent', href: '/dashboard/agent', icon: Zap, badge: 'NEW' },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ], []);

  const handleExportInvoices = useCallback(async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export/invoices');

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
  }, [toast]);

  const handleExportClients = useCallback(async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export/clients');

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
  }, [toast]);

  const isActiveRoute = useCallback((href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  }, [pathname]);

  const handleLogout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: spotify.nearBlack }}>
        <div className="text-center">
          <LogoMarkOnly size={64} className="mx-auto mb-4" />
          <p className="text-sm" style={{ color: spotify.textMuted }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: spotify.nearBlack }}>
        <div className="text-center">
          <LogoMarkOnly size={64} className="mx-auto mb-4" />
          <p className="text-sm" style={{ color: spotify.textMuted }}>Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: spotify.nearBlack }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:transform-none flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ background: spotify.darkSurface, borderRight: `1px solid ${spotify.borderGray}` }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 flex-shrink-0" style={{ borderBottom: `1px solid ${spotify.borderGray}` }}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo variant="mark" size="sm" />
            <span className="text-sm font-bold text-white">SmartInvoice</span>
          </Link>
          <button
            className="lg:hidden p-2 rounded-full hover:bg-white/5"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" style={{ color: spotify.textMuted }} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = isActiveRoute(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-bold transition-colors"
                  style={{
                    background: isActive ? spotify.midDark : 'transparent',
                    color: isActive ? spotify.textBase : spotify.textMuted
                  }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {item.badge && (
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{ background: 'rgba(30,215,96,0.15)', color: spotify.green }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Smart Features */}
          <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${spotify.borderGray}` }}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 px-3" style={{ color: spotify.textMuted }}>
              Smart Features
            </h3>
            <div className="space-y-2">
              <div className="px-3 py-2.5 rounded" style={{ background: 'rgba(30,215,96,0.1)', border: `1px solid rgba(30,215,96,0.2)` }}>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" style={{ color: spotify.green }} />
                  <span className="text-xs font-medium text-white">AI Auto-Suggestions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Export */}
          <div className="mt-6 pt-6" style={{ borderTop: `1px solid ${spotify.borderGray}` }}>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-3 px-3" style={{ color: spotify.textMuted }}>
              Export Data
            </h3>
            <div className="space-y-1">
              <button
                onClick={handleExportInvoices}
                disabled={isExporting}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-bold transition-colors hover:bg-white/5"
                style={{ color: spotify.textMuted }}
              >
                <FileDown className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export Invoices'}</span>
              </button>
              <button
                onClick={handleExportClients}
                disabled={isExporting}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-bold transition-colors hover:bg-white/5"
                style={{ color: spotify.textMuted }}
              >
                <Download className="w-4 h-4" />
                <span>{isExporting ? 'Exporting...' : 'Export Clients'}</span>
              </button>
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 flex-shrink-0" style={{ borderTop: `1px solid ${spotify.borderGray}` }}>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: spotify.green, color: '#000' }}
            >
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs truncate" style={{ color: spotify.textMuted }}>{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded text-xs font-bold transition-colors hover:bg-white/5"
            style={{ color: 'rgba(243,114,127,0.9)' }}
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Nav */}
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6" style={{ background: spotify.nearBlack, borderBottom: `1px solid ${spotify.borderGray}` }}>
          <button
            className="lg:hidden p-2 rounded-full hover:bg-white/5"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" style={{ color: spotify.textMuted }} />
          </button>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/reminders"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-colors hover:bg-white/5"
              style={{ color: spotify.textMuted, border: `1px solid ${spotify.borderGray}` }}
            >
              <Bell className="w-4 h-4" />
              <span>Reminders</span>
            </Link>
            <Link
              href="/dashboard/create"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-transform hover:scale-[1.02]"
              style={{ background: spotify.green, color: '#000', textTransform: 'uppercase', letterSpacing: '1.4px' }}
            >
              <Plus className="w-4 h-4" />
              <span>New Invoice</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile FAB */}
      <Link
        href="/dashboard/create"
        className="lg:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        style={{ background: spotify.green, boxShadow: '0 4px 12px rgba(30,215,96,0.4)' }}
      >
        <Plus className="w-6 h-6" style={{ color: '#000' }} />
      </Link>

      <FeedbackWidget />
      <AiChatbot />
    </div>
  );
}
