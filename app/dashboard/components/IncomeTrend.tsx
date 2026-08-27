'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

interface IncomeTrendProps {
    analytics: any;
    safeFormatCurrency: (amount: number) => string;
}

export const IncomeTrend = React.memo(({ analytics, safeFormatCurrency }: IncomeTrendProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const monthlyData = analytics?.monthlyData || [];
    const hasAnyRevenue = monthlyData.some((m: any) => (m.revenue || 0) > 0);

    return (
        <Card className="card-dark-mist lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-white flex items-center text-lg font-bold">
                        <TrendingUp className="w-5 h-5 mr-2 text-[#1ed760]" />
                        Monthly Income Trend
                    </CardTitle>
                    <CardDescription className="text-dark-muted">Revenue from paid invoices over the last 6 months</CardDescription>
                </div>
                <Link href="/dashboard/analytics">
                    <Button variant="ghost" className="text-dark-muted hover:text-[#1ed760] text-xs font-semibold">
                        View Details
                    </Button>
                </Link>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {!isMounted ? (
                    <div className="h-64 sm:h-80 w-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-[#1ed760] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : monthlyData.length > 0 ? (
                    <div className="h-64 sm:h-80 w-full relative min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="incomeTrendFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1ed760" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#1ed760" stopOpacity={0.0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#282828" vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    stroke="#808080"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={5}
                                />
                                <YAxis
                                    stroke="#808080"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(val: number) => val >= 1000 ? `$${(val / 1000).toFixed(1)}k` : `$${val}`}
                                />
                                <Tooltip
                                    content={({ active, payload, label }: any) => {
                                        if (active && payload && payload.length) {
                                            const data = payload[0].payload;
                                            return (
                                                <div className="bg-[#181818] border border-[#333] p-3 rounded-lg shadow-xl text-xs">
                                                    <p className="font-semibold text-gray-300 mb-1">{label}</p>
                                                    <p className="text-sm font-bold text-[#1ed760]">
                                                        Revenue: ${safeFormatCurrency(data.revenue)}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                                        {data.invoices} paid invoice{data.invoices !== 1 ? 's' : ''}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#1ed760"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#incomeTrendFill)"
                                    dot={{ r: 4, fill: '#1ed760', strokeWidth: 2, stroke: '#121212' }}
                                    activeDot={{ r: 6, fill: '#1ed760', stroke: '#ffffff', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                        {!hasAnyRevenue && (
                            <p className="text-xs text-center text-dark-muted mt-2">
                                No paid invoices recorded in the last 6 months. Paid invoices will automatically update this trend.
                            </p>
                        )}
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
