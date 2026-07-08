'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface Forecast {
  nextMonth: number;
  nextQuarter: number;
  confidence: string;
}

interface ForecastWidgetProps {
  forecast: Forecast;
  currentMonthRevenue: number;
  loading?: boolean;
}

export const ForecastWidget = React.memo(({ forecast, currentMonthRevenue, loading }: ForecastWidgetProps) => {
  const getTrendIcon = () => {
    if (forecast.nextMonth > currentMonthRevenue) return ArrowUpRight;
    if (forecast.nextMonth < currentMonthRevenue) return ArrowDownRight;
    return Minus;
  };

  const getTrendColor = () => {
    if (forecast.nextMonth > currentMonthRevenue) return '#1ed760';
    if (forecast.nextMonth < currentMonthRevenue) return '#ef4444';
    return '#b3b3b3';
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return '#1ed760';
      case 'medium': return '#f59e0b';
      default: return '#b3b3b3';
    }
  };

  const TrendIcon = getTrendIcon();
  const trendColor = getTrendColor();

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}k`;
    }
    return `$${amount.toFixed(0)}`;
  };

  if (loading) {
    return (
      <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center text-sm font-bold">
            <TrendingUp className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
            Revenue Forecast
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
          <TrendingUp className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
          Revenue Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Next Month */}
          <div>
            <div className="text-xs mb-1" style={{ color: '#b3b3b3' }}>Next Month</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">{formatCurrency(forecast.nextMonth)}</span>
              <TrendIcon className="w-4 h-4" style={{ color: trendColor }} />
            </div>
          </div>

          {/* Next Quarter */}
          <div>
            <div className="text-xs mb-1" style={{ color: '#b3b3b3' }}>Next Quarter</div>
            <div className="text-2xl font-bold text-white">{formatCurrency(forecast.nextQuarter)}</div>
          </div>
        </div>

        {/* Confidence indicator */}
        <div className="mt-4 flex items-center gap-2">
          <div className="text-xs" style={{ color: '#b3b3b3' }}>Confidence:</div>
          <div
            className="px-2 py-0.5 rounded text-xs font-bold"
            style={{
              background: `${getConfidenceColor(forecast.confidence)}20`,
              color: getConfidenceColor(forecast.confidence),
            }}
          >
            {forecast.confidence.toUpperCase()}
          </div>
        </div>

        {/* Forecast visualization */}
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid #4d4d4d' }}>
          <div className="text-xs mb-2" style={{ color: '#b3b3b3' }}>Projected Revenue</div>
          <div className="flex items-end gap-1 h-16">
            {[currentMonthRevenue, forecast.nextMonth, forecast.nextMonth * 1.1, forecast.nextMonth * 1.2].map((value, i) => {
              const max = Math.max(currentMonthRevenue, forecast.nextQuarter);
              const height = max > 0 ? (value / max) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${Math.max(height, 5)}%`,
                      background: i === 0 ? '#4d4d4d' : `rgba(30,215,96,${0.4 + i * 0.2})`,
                    }}
                  />
                  <div className="text-[10px] mt-1" style={{ color: '#b3b3b3' }}>
                    {i === 0 ? 'Now' : `+${i}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ForecastWidget.displayName = 'ForecastWidget';
