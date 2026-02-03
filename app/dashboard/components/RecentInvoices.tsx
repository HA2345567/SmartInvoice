'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

interface RecentInvoicesProps {
    recentInvoices: any[];
    safeFormatDate: (date: string) => string;
    safeFormatCurrency: (amount: number) => string;
    getStatusColor: (status: string) => string;
}

export const RecentInvoices = React.memo(({
    recentInvoices,
    safeFormatDate,
    safeFormatCurrency,
    getStatusColor
}: RecentInvoicesProps) => {
    return (
        <Card className="card-dark-mist">
            <CardHeader>
                <CardTitle className="text-white">Recent Invoices</CardTitle>
                <CardDescription className="text-dark-muted">Your 5 most recently created invoices.</CardDescription>
            </CardHeader>
            <CardContent>
                {recentInvoices.length > 0 ? (
                    <div className="flow-root">
                        <ul role="list" className="-mb-8">
                            {recentInvoices.map((invoice, invoiceIdx) => (
                                <li key={invoice.id}>
                                    <div className="relative pb-8">
                                        {invoiceIdx !== recentInvoices.length - 1 ? (
                                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-dark-border" aria-hidden="true" />
                                        ) : null}
                                        <div className="relative flex space-x-3 items-start">
                                            <div>
                                                <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-dark-bg bg-dark-border`}>
                                                    <FileText className="h-4 w-4 text-dark-muted" />
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1 pt-1.5">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm text-dark-muted">
                                                        Invoice <span className="font-medium text-dark-primary">#{invoice.invoiceNumber}</span> to <span className="font-medium text-white">{invoice.clientName || "N/A"}</span>
                                                    </p>
                                                    <time dateTime={invoice.createdAt} className="flex-shrink-0 text-xs text-dark-muted">{safeFormatDate(invoice.createdAt)}</time>
                                                </div>
                                                <div className="mt-2 flex justify-between items-center">
                                                    <Badge className={`${getStatusColor(invoice.status)} text-xs font-semibold`}>{invoice.status}</Badge>
                                                    <p className="text-lg font-bold text-white">${safeFormatCurrency(invoice.amount)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <FileText className="mx-auto h-12 w-12 text-dark-muted" />
                        <h3 className="mt-2 text-sm font-medium text-white">No recent invoices</h3>
                        <p className="mt-1 text-sm text-dark-muted">Get started by creating a new invoice.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

RecentInvoices.displayName = 'RecentInvoices';
