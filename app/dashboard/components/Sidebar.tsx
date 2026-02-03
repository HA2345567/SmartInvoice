'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    FileText, Home, Plus, Users, Settings, LogOut, X,
    BarChart3, Download, Sparkles, FileDown, Bell, Zap, Receipt
} from 'lucide-react';

interface SidebarProps {
    user: any;
    navigation: any[];
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    isActiveRoute: (href: string) => boolean;
    handleExportInvoices: () => void;
    handleExportClients: () => void;
    isExporting: boolean;
    logout: () => void;
}

export const Sidebar = React.memo(({
    user,
    navigation,
    sidebarOpen,
    setSidebarOpen,
    isActiveRoute,
    handleExportInvoices,
    handleExportClients,
    isExporting,
    logout
}: SidebarProps) => {
    return (
        <div className={`sidebar-responsive sidebar-dark ${sidebarOpen ? 'open' : ''}`}>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-white/10 flex-shrink-0">
                <Link href="/dashboard" className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center dark-glow">
                        <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-black" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-bold text-dark-primary font-cookie">SmartInvoice</span>
                </Link>
                <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden text-dark-muted hover:text-dark-primary p-1"
                    onClick={() => setSidebarOpen(false)}
                >
                    <X className="w-5 h-5" />
                </Button>
            </div>

            {/* Navigation - Scrollable */}
            <div className="flex-1 flex flex-col min-h-0">
                <nav className="flex-1 px-2 sm:px-4 py-4 sm:py-6 overflow-y-auto">
                    <div className="space-y-1 sm:space-y-2">
                        {navigation.map((item) => {
                            const isActive = isActiveRoute(item.href);
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`nav-item-dark flex items-center px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all duration-200 text-sm sm:text-base ${isActive ? 'active' : ''
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                                    <span className="truncate">{item.name}</span>
                                    {item.badge && (
                                        <div className="ml-auto">
                                            <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-500/20 text-dark-primary text-xs font-bold rounded-full border border-green-500/30 flex items-center">
                                                <Zap className="w-2 h-2 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                                                <span className="hidden sm:inline">{item.badge}</span>
                                            </div>
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Smart Features Section */}
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
                        <h3 className="text-xs sm:text-sm font-semibold text-dark-primary mb-2 sm:mb-3 px-3 sm:px-4 flex items-center">
                            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Smart Features</span>
                            <span className="sm:hidden">Smart</span>
                        </h3>
                        <div className="space-y-1 sm:space-y-2">
                            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-dark-primary flex-shrink-0" />
                                    <span className="text-xs sm:text-sm font-medium text-white truncate">AI Auto-Suggestions</span>
                                </div>
                                <p className="text-xs text-dark-muted hidden sm:block">Smart line items and client data auto-fill</p>
                            </div>
                            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                                    <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-dark-primary flex-shrink-0" />
                                    <span className="text-xs sm:text-sm font-medium text-white truncate">Smart Reminders</span>
                                </div>
                                <p className="text-xs text-dark-muted hidden sm:block">Automated overdue invoice reminders</p>
                            </div>
                        </div>
                    </div>

                    {/* Export Section */}
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
                        <h3 className="text-xs sm:text-sm font-semibold text-dark-primary mb-2 sm:mb-3 px-3 sm:px-4">Export Data</h3>
                        <div className="space-y-1 sm:space-y-2">
                            <Button
                                variant="ghost"
                                className="w-full justify-start nav-item-dark px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm h-auto"
                                onClick={handleExportInvoices}
                                disabled={isExporting}
                            >
                                <FileDown className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                                <span className="truncate">{isExporting ? 'Exporting...' : 'Export Invoices'}</span>
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start nav-item-dark px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm h-auto"
                                onClick={handleExportClients}
                                disabled={isExporting}
                            >
                                <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                                <span className="truncate">{isExporting ? 'Exporting...' : 'Export Clients'}</span>
                            </Button>
                        </div>
                    </div>
                </nav>

                {/* User Profile Section - Fixed at bottom */}
                <div className="border-t border-white/10 p-3 sm:p-4 flex-shrink-0">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full flex items-center justify-center text-dark-primary font-semibold border border-green-500/30 flex-shrink-0">
                            {(user?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-dark-muted truncate">{user?.email || ''}</p>
                            {user?.company && (
                                <p className="text-xs text-dark-muted/70 truncate hidden sm:block">{user.company}</p>
                            )}
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-dark-muted hover:text-red-400 hover:bg-red-500/10 text-xs sm:text-sm h-auto py-2"
                        onClick={logout}
                    >
                        <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
});

Sidebar.displayName = 'Sidebar';
