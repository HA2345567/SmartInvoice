'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, Calendar, TrendingUp } from 'lucide-react';

interface StatsGridProps {
    stats: any[];
}

export const StatsGrid = React.memo(({ stats }: StatsGridProps) => {
    const getColorStyles = (color: string) => {
        switch (color) {
            case 'green':
                return { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e' };
            case 'yellow':
                return { bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308' };
            case 'blue':
                return { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6' };
            case 'purple':
                return { bg: 'rgba(168, 85, 247, 0.15)', text: '#a855f7' };
            default:
                return { bg: 'rgba(255, 255, 255, 0.1)', text: '#ffffff' };
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => {
                const styles = getColorStyles(stat.color);
                return (
                    <Card key={index} className="card-dark-mist group animate-slide-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-dark-muted">
                                {stat.title}
                            </CardTitle>
                            <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:dark-glow transition-all duration-300"
                                style={{ backgroundColor: styles.bg }}
                            >
                                <stat.icon 
                                    className="h-4 w-4" 
                                    style={{ color: styles.text }}
                                />
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
                );
            })}
        </div>
    );
});

StatsGrid.displayName = 'StatsGrid';
