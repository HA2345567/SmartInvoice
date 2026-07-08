'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react';

interface CashRunwayProps {
  months: number;
  loading?: boolean;
}

export const CashRunway = React.memo(({ months, loading }: CashRunwayProps) => {
  const getStatusColor = (m: number) => {
    if (m >= 6) return '#1ed760';
    if (m >= 3) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusIcon = (m: number) => {
    if (m >= 6) return CheckCircle;
    return AlertTriangle;
  };

  const getStatusMessage = (m: number) => {
    if (m >= 12) return 'Very healthy runway';
    if (m >= 6) return 'Comfortable runway';
    if (m >= 3) return 'Manage your expenses';
    if (m > 0) return 'Focus on collections';
    return 'Immediate action needed';
  };

  const color = getStatusColor(months);
  const Icon = getStatusIcon(months);
  const message = getStatusMessage(months);

  if (loading) {
    return (
      <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center text-sm font-bold">
            <Plane className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
            Cash Runway
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-20">
            <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#1ed760', borderTopColor: 'transparent' }} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center text-sm font-bold">
          <Plane className="w-4 h-4 mr-2" style={{ color }} />
          Cash Runway
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-white">
              {months >= 999 ? '∞' : months.toFixed(1)}
            </div>
            <div className="text-xs" style={{ color: '#b3b3b3' }}>
              {months >= 999 ? 'Unlimited' : 'months'}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1" style={{ color }}>
              <Icon className="w-4 h-4" />
              <span className="text-sm font-bold">{message}</span>
            </div>
            <p className="text-xs" style={{ color: '#b3b3b3' }}>
              Based on current burn rate and revenue trends
            </p>
          </div>
        </div>

        {/* Runway visualization */}
        <div className="mt-4">
          <div className="flex gap-1">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 h-2 rounded-sm transition-colors"
                style={{
                  background: i < months ? '#1ed760' : '#1f1f1f',
                  opacity: i < months ? 1 : 0.5,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[10px]" style={{ color: '#b3b3b3' }}>
            <span>0</span>
            <span>3</span>
            <span>6</span>
            <span>9</span>
            <span>12+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CashRunway.displayName = 'CashRunway';
