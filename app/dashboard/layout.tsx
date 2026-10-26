'use client';

import { useEffect, useMemo, useCallback, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard,
  FilePlus2,
  ReceiptText,
  ScrollText,
  Building2,
  WalletCards,
  Landmark,
  LineChart,
  BarChart3,
  Crown,
  SlidersHorizontal,
  LogOut, 
  Menu, 
  X, 
  Download, 
  FileDown, 
  Bell, 
  Loader2,
  Gem,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import Logo, { LogoMarkOnly } from '@/components/Logo';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';

// SmartInvoice 2.0 Editorial System Colors & Tokens
const brandTokens = {
  nearBlack: '#121212',
  darkSurface: '#181818',
  midDark: '#1f1f1f',
  green: '#1ed760',
  textBase: '#ffffff',
  textMuted: '#a1a1aa',
  borderHairline: 'rgba(255, 255, 255, 0.08)',
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

  // Protect all dashboard routes except /dashboard/create (Guest allowed)
  useEffect(() => {
    if (!loading && !user && !pathname.startsWith('/dashboard/create')) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, pathname, router]);

  const navigation = useMemo(() => [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Invoice', href: '/dashboard/create', icon: FilePlus2 },
    { name: 'Invoices', href: '/dashboard/invoices', icon: ReceiptText },
    { name: 'Proposals', href: '/dashboard/proposals', icon: ScrollText, badge: 'PRO' },
    { name: 'Clients', href: '/dashboard/clients', icon: Building2 },
    { name: 'Expenses', href: '/dashboard/expenses', icon: WalletCards, badge: 'PRO' },
    { name: 'Tax Center', href: '/dashboard/tax', icon: Landmark },
    { name: 'Reports', href: '/dashboard/reports', icon: LineChart },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Payment Concierge', href: '/dashboard/agent', icon: Crown, badge: 'PREMIUM' },
    { name: 'Settings', href: '/dashboard/settings', icon: SlidersHorizontal },
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
    return <LuxuryLoader label="Loading SmartInvoice..." sublabel="Securing Session" fullScreen />;
  }

  // Not authenticated & on protected route
  if (!user && !pathname.startsWith('/dashboard/create')) {
    return <LuxuryLoader label="Redirecting to sign in..." sublabel="Authentication Required" fullScreen />;
  }

  return (
    <div className="min-h-screen flex" style={{ background: brandTokens.nearBlack }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:transform-none flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ 
          background: brandTokens.darkSurface, 
          borderRight: `1px solid ${brandTokens.borderHairline}` 
        }}
      >
        {/* Sidebar Header */}
        <div 
          className="flex items-center justify-between h-16 px-5 flex-shrink-0" 
          style={{ borderBottom: `1px solid ${brandTokens.borderHairline}` }}
        >
          <Link href="/dashboard" className="flex items-center">
            <Logo variant="full" size="md" />
          </Link>
          <button
            className="lg:hidden p-2 rounded-full hover:bg-white/5"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" style={{ color: brandTokens.textMuted }} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          {navigation.map((item) => {
            const isActive = isActiveRoute(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive 
                    ? 'text-white bg-[#1f1f1f] shadow-sm border border-white/[0.08]' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1ed760]' : 'text-zinc-400'}`} />
                <span className="flex-1 tracking-wide">{item.name}</span>
                {item.badge && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide"
                    style={{ background: 'rgba(30,215,96,0.12)', color: brandTokens.green, border: '1px solid rgba(30,215,96,0.2)' }}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Quick Export Actions */}
          <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${brandTokens.borderHairline}` }}>
            <h3 className="text-[10px] font-medium uppercase tracking-widest mb-2 px-3 text-zinc-500">
              Data Management
            </h3>
            <div className="space-y-0.5">
              <button
                onClick={handleExportInvoices}
                disabled={isExporting}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 transition-colors hover:text-white hover:bg-white/[0.03]"
              >
                <FileDown className="w-4 h-4 text-zinc-500" />
                <span>{isExporting ? 'Exporting...' : 'Export Invoices (CSV)'}</span>
              </button>
              <button
                onClick={handleExportClients}
                disabled={isExporting}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-zinc-400 transition-colors hover:text-white hover:bg-white/[0.03]"
              >
                <Download className="w-4 h-4 text-zinc-500" />
                <span>{isExporting ? 'Exporting...' : 'Export Clients (CSV)'}</span>
              </button>
            </div>
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 flex-shrink-0" style={{ borderTop: `1px solid ${brandTokens.borderHairline}` }}>
          {user ? (
            <>
              <div className="flex items-center gap-3 mb-3 px-1">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: brandTokens.green, color: '#000' }}
                >
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{user.name || 'User'}</p>
                  <p className="text-[11px] text-zinc-500 truncate">{user.email || ''}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-white/5 text-rose-400/80 hover:text-rose-400"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="text-xs font-medium text-amber-400">Guest Studio</span>
              </div>
              <p className="text-[11px] text-zinc-500 mb-3">Create and export invoices. Sign in to store records.</p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  className="px-3 py-2 rounded-full text-center text-xs font-medium transition-colors border border-white/10 hover:bg-white/5 text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-3 py-2 rounded-full text-center text-xs font-semibold transition-colors bg-[#1ed760] text-black hover:bg-[#1fdf64]"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Nav */}
        <header 
          className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 bg-[#121212]/90 backdrop-blur-md" 
          style={{ borderBottom: `1px solid ${brandTokens.borderHairline}` }}
        >
          <button
            className="lg:hidden p-2 rounded-full hover:bg-white/5"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-zinc-400" />
          </button>

          {!user && (
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
              <span>Guest Session — Download invoices freely!</span>
              <Link href="/auth/signup" className="underline font-semibold ml-1 text-white hover:text-amber-300">
                Create account
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 ml-auto">
            <Link
              href="/dashboard/reminders"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium text-zinc-300 border border-white/10 hover:bg-white/5 transition-colors"
            >
              <Bell className="w-3.5 h-3.5 text-zinc-400" />
              <span>Reminders</span>
            </Link>
            <Link
              href="/dashboard/create"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all bg-[#1ed760] text-black hover:bg-[#1fdf64] active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Invoice</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-10">
          <div className="max-w-[1280px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile FAB */}
      <Link
        href="/dashboard/create"
        className="lg:hidden fixed bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 bg-[#1ed760] text-black"
        style={{ boxShadow: '0 4px 16px rgba(30,215,96,0.3)' }}
      >
        <Plus className="w-5 h-5" />
      </Link>

      <FeedbackWidget />
    </div>
  );
}
