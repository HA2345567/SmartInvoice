'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, Bell, Plus } from 'lucide-react';

interface TopNavProps {
    setSidebarOpen: (open: boolean) => void;
}

export const TopNav = React.memo(({ setSidebarOpen }: TopNavProps) => {
    return (
        <div className="top-nav-responsive">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-14 sm:h-16">
                    <div className="flex items-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="lg:hidden text-dark-muted hover:text-dark-primary p-2"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Link href="/dashboard/reminders" className="hidden sm:block">
                            <Button size="sm" className="btn-dark-secondary text-xs sm:text-sm">
                                <Bell className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">Smart Reminders</span>
                                <span className="sm:hidden">Reminders</span>
                            </Button>
                        </Link>
                        <Link href="/dashboard/create">
                            <Button size="sm" className="btn-dark-primary dark-glow text-xs sm:text-sm">
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                <span className="hidden sm:inline">New Invoice</span>
                                <span className="sm:hidden">New</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
});

TopNav.displayName = 'TopNav';
