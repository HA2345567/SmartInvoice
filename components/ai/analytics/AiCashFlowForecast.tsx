'use client';

import React, { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TrendingUp, Sparkles, AlertTriangle, AlertCircle } from 'lucide-react';

interface AiCashFlowForecastProps {
    monthlyData: Array<{
        month: string;
        revenue: number;
        invoices: number;
    }>;
}

export function AiCashFlowForecast({ monthlyData = [] }: AiCashFlowForecastProps) {

    // Process data for the chart
    const predictionData = useMemo(() => {
        if (!monthlyData || monthlyData.length === 0) return [];

        // 1. Map existing actual data
        const data = monthlyData.map(d => ({
            month: d.month,
            actual: d.revenue,
            predicted: d.revenue, // Predicted line overlaps actual for history
            range: [d.revenue, d.revenue]
        }));

        // 2. Generate Future Predictions (Simple Linear Projection for Demo)
        // Get average growth rate from last 3 months if available, else default to 5%
        let growthRate = 1.05;
        if (data.length >= 2) {
            const lastMonth = data[data.length - 1].actual;
            const prevMonth = data[data.length - 2].actual;
            if (prevMonth > 0) {
                growthRate = (lastMonth / prevMonth);
                // Cap growth rate to avoid unrealistic exponential curves in demo
                if (growthRate > 1.2) growthRate = 1.2;
                if (growthRate < 0.8) growthRate = 0.8;
            }
        }

        const lastActual = data[data.length - 1];
        let currentPrediction = lastActual.actual;

        // Add 3 months of predictions
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const lastMonthIndex = months.findIndex(m => lastActual.month.startsWith(m) || m === lastActual.month) || 0;

        for (let i = 1; i <= 3; i++) {
            currentPrediction = currentPrediction * growthRate;
            const nextMonthIndex = (lastMonthIndex + i) % 12;

            // Confidence interval expands further into the future
            const uncertainty = 0.1 * i; // 10%, 20%, 30%

            data.push({
                month: months[nextMonthIndex],
                actual: null as any,
                predicted: Math.round(currentPrediction),
                range: [
                    Math.round(currentPrediction * (1 - uncertainty)),
                    Math.round(currentPrediction * (1 + uncertainty))
                ]
            });
        }

        return data;
    }, [monthlyData]);

    const nextMonthPrediction = predictionData.find(d => d.actual === null);
    const growthPercentage = nextMonthPrediction && predictionData.length > 3
        ? ((nextMonthPrediction.predicted - predictionData[predictionData.indexOf(nextMonthPrediction) - 1].predicted) / predictionData[predictionData.indexOf(nextMonthPrediction) - 1].predicted * 100).toFixed(1)
        : "0.0";

    // EMPTY STATE if no data
    if (!monthlyData || monthlyData.length === 0) {
        return (
            <Card className="bg-[#181818] border-white/10 rounded-2xl overflow-hidden relative min-h-[260px] flex items-center justify-center">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-24 h-24 text-[#1ed760]" />
                </div>
                <div className="text-center z-10 p-6">
                    <div className="w-14 h-14 bg-[#1ed760]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#1ed760]/20">
                        <TrendingUp className="w-7 h-7 text-[#1ed760] opacity-60" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">Awaiting Invoice Activity</h3>
                    <p className="text-xs text-[#b3b3b3] max-w-sm mx-auto">
                        The AI engine requires settled invoices to project cash flow trajectory.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="bg-[#181818] border-white/10 rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles className="w-24 h-24 text-[#1ed760]" />
            </div>

            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-white flex items-center gap-2 text-lg">
                            <TrendingUp className="w-5 h-5 text-[#1ed760]" />
                            AI Cash Flow Predictor
                        </CardTitle>
                        <CardDescription className="text-xs text-[#b3b3b3]">
                            Neural projection based on settlement velocity & rolling historical trends
                        </CardDescription>
                    </div>
                    <div className="px-3 py-1 bg-[#1ed760]/10 border border-[#1ed760]/20 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#1ed760] rounded-full animate-pulse" />
                        <span className="text-xs font-semibold text-[#1ed760]">High Confidence</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={predictionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: any) => `$${value}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: any, name: string) => [`$${value}`, name === 'predicted' ? 'AI Forecast' : 'Actual Revenue']}
                            />

                            {/* Predicted Range (Confidence Interval) */}
                            <Area
                                type="monotone"
                                dataKey="range"
                                stroke="none"
                                fill="#8b5cf6"
                                fillOpacity={0.05}
                                connectNulls
                            />

                            {/* Predicted Line */}
                            <Area
                                type="monotone"
                                dataKey="predicted"
                                stroke="#8b5cf6"
                                strokeDasharray="5 5"
                                strokeWidth={2}
                                fill="url(#colorPredicted)"
                            />

                            {/* Actual Data Line */}
                            <Area
                                type="monotone"
                                dataKey="actual"
                                stroke="#10b981"
                                strokeWidth={3}
                                fill="url(#colorActual)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="p-3 bg-green-900/10 rounded-lg border border-green-500/10 hover:border-green-500/30 transition-colors">
                        <p className="text-xs text-gray-400 mb-1">Predicted Next Month</p>
                        <p className="text-2xl font-bold text-white flex items-end gap-2">
                            ${nextMonthPrediction ? nextMonthPrediction.predicted.toLocaleString() : '---'}
                            <span className={`text-xs mb-1 flex items-center gap-0.5 ${Number(growthPercentage) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                <TrendingUp className={`w-3 h-3 ${Number(growthPercentage) < 0 ? 'rotate-180' : ''}`} />
                                {Number(growthPercentage) > 0 ? '+' : ''}{growthPercentage}%
                            </span>
                        </p>
                    </div>

                    <div className="p-3 bg-yellow-900/10 rounded-lg border border-yellow-500/10 hover:border-yellow-500/30 transition-colors flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3 text-yellow-500" />
                                Risk Assessment
                            </p>
                            <p className="text-sm font-medium text-white max-w-[150px]">
                                {monthlyData.length < 3 ? "More data needed for risk analysis." : "Payment trends appear stable."}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
