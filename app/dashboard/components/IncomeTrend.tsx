'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface IncomeTrendProps {
    analytics: any;
    safeFormatCurrency: (amount: number) => string;
}

export const IncomeTrend = React.memo(({ analytics, safeFormatCurrency }: IncomeTrendProps) => {
    return (
        <Card className="card-dark-mist lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-white flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-dark-primary" />
                        Monthly Income Trend
                    </CardTitle>
                    <CardDescription className="text-dark-muted">Revenue from paid invoices over the last 6 months</CardDescription>
                </div>
                <Link href="/dashboard/analytics">
                    <Button variant="ghost" className="text-dark-muted hover:text-dark-primary">View Details</Button>
                </Link>
            </CardHeader>
            <CardContent>
                {analytics && analytics.monthlyData && analytics.monthlyData.length > 0 ? (
                    <div className="h-64 sm:h-80 w-full">
                        <div className="flex h-full items-end justify-around space-x-2">
                            {analytics.monthlyData.slice(-6).map((month: any, i: number) => {
                                const maxRevenue = Math.max(...analytics.monthlyData.map((m: any) => m.revenue));
                                const height = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
                                return (
                                    <div key={i} className="flex flex-col items-center justify-end h-full">
                                        <div
                                            className="w-8 sm:w-12 bg-green-500 rounded-t-lg hover:bg-green-400 transition-all"
                                            style={{ height: `${height}%` }}
                                            title={`$${safeFormatCurrency(month.revenue)}`}
                                        ></div>
                                        <p className="text-xs text-dark-muted mt-2">{month.month}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="h-64 sm:h-80 flex flex-col items-center justify-center text-center">
                        <BarChart3 className="w-12 h-12 text-dark-muted mb-4" />
                        <h3 className="font-semibold text-white">No revenue data yet</h3>
                        <p className="text-dark-muted">Paid invoices will be shown here.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

IncomeTrend.displayName = 'IncomeTrend';
