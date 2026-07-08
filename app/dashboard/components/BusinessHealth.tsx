'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface BusinessHealthProps {
  score: number;
  loading?: boolean;
}

export const BusinessHealth = React.memo(({ score, loading }: BusinessHealthProps) => {
  const getHealthColor = (s: number) => {
    if (s >= 80) return '#1ed760';
    if (s >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getHealthLabel = (s: number) => {
    if (s >= 80) return 'Excellent';
    if (s >= 60) return 'Good';
    if (s >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const getHealthIcon = (s: number) => {
    if (s >= 70) return TrendingUp;
    if (s >= 50) return Minus;
    return TrendingDown;
  };

  const color = getHealthColor(score);
  const label = getHealthLabel(score);
  const Icon = getHealthIcon(score);

  if (loading) {
    return (
      <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center text-sm font-bold">
            <Heart className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
            Business Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-24">
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
          <Heart className="w-4 h-4 mr-2" style={{ color }} />
          Business Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-4xl font-bold text-white">{score}</div>
            <div className="text-xs" style={{ color: '#b3b3b3' }}>out of 100</div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end" style={{ color }}>
              <Icon className="w-4 h-4" />
              <span className="text-sm font-bold">{label}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full" style={{ background: '#1f1f1f' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${score}%`, background: color }}
          />
        </div>

        {/* Score breakdown */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 rounded" style={{ background: '#1f1f1f' }}>
            <div className="font-bold text-white">{score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D'}</div>
            <div style={{ color: '#b3b3b3' }}>Grade</div>
          </div>
          <div className="text-center p-2 rounded" style={{ background: '#1f1f1f' }}>
            <div className="font-bold text-white">{score >= 60 ? 'Stable' : 'At Risk'}</div>
            <div style={{ color: '#b3b3b3' }}>Status</div>
          </div>
          <div className="text-center p-2 rounded" style={{ background: '#1f1f1f' }}>
            <div className="font-bold text-white">{score >= 70 ? 'Low' : 'High'}</div>
            <div style={{ color: '#b3b3b3' }}>Risk</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

BusinessHealth.displayName = 'BusinessHealth';
