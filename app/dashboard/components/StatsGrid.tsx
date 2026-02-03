'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, Calendar, TrendingUp } from 'lucide-react';

interface StatsGridProps {
    stats: any[];
}

export const StatsGrid = React.memo(({ stats }: StatsGridProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
                <Card key={index} className="card-dark-mist group animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-dark-muted">
                            {stat.title}
                        </CardTitle>
                        <div className={`w-8 h-8 bg-${stat.color}-500/20 rounded-lg flex items-center justify-center group-hover:dark-glow transition-all duration-300`}>
                            <stat.icon className={`h-4 w-4 text-${stat.color}-400`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                        <p className={`text-xs mt-1 ${stat.changeType === 'positive' ? 'text-green-400' :
                            stat.changeType === 'negative' ? 'text-red-400' : 'text-dark-muted'
                            }`}>
                            {stat.change}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
});

StatsGrid.displayName = 'StatsGrid';
