'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface PendingInvoicesProps {
    pendingInvoices: any[];
    safeFormatDate: (date: string) => string;
    safeFormatCurrency: (amount: number) => string;
    getDaysOverdue: (dueDate: string) => number;
}

export const PendingInvoices = React.memo(({
    pendingInvoices,
    safeFormatDate,
    safeFormatCurrency,
    getDaysOverdue
}: PendingInvoicesProps) => {
    return (
        <Card className="card-dark-mist">
            <CardHeader>
                <CardTitle className="text-white">Pending Invoices</CardTitle>
                <CardDescription className="text-dark-muted">Invoices that are due or overdue.</CardDescription>
            </CardHeader>
            <CardContent>
                {pendingInvoices.length > 0 ? (
                    <ul role="list" className="divide-y divide-dark-border">
                        {pendingInvoices.map((invoice) => (
                            <li key={invoice.id} className="py-3 sm:py-4">
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${invoice.status === 'overdue' ? 'bg-red-500/20' : 'bg-blue-500/20'
                                            }`}>
                                            <AlertCircle className={`w-4 h-4 ${invoice.status === 'overdue' ? 'text-red-400' : 'text-blue-400'
                                                }`} />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white truncate">
                                            {invoice.clientName || 'No Client'}
                                        </p>
                                        <p className="text-sm text-dark-muted truncate">
                                            Due {safeFormatDate(invoice.dueDate)}
                                            {invoice.status === 'overdue' && ` (${getDaysOverdue(invoice.dueDate)} days overdue)`}
                                        </p>
                                    </div>
                                    <div className="inline-flex items-center text-base font-semibold text-white">
                                        ${safeFormatCurrency(invoice.amount)}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                        <h3 className="mt-2 text-sm font-medium text-white">All caught up!</h3>
                        <p className="mt-1 text-sm text-dark-muted">You have no pending or overdue invoices.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

PendingInvoices.displayName = 'PendingInvoices';
