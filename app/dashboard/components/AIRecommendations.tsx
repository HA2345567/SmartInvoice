'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, CircleAlert as AlertCircle, TriangleAlert as AlertTriangle, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Recommendation {
  type: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  action?: string;
}

interface AIRecommendationsProps {
  recommendations: Recommendation[];
  loading?: boolean;
}

export const AIRecommendations = React.memo(({ recommendations, loading }: AIRecommendationsProps) => {
  const getIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return AlertTriangle;
      default: return Info;
    }
  };

  const getColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#1ed760';
    }
  };

  const getBgColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'rgba(239,68,68,0.1)';
      case 'medium': return 'rgba(245,158,11,0.1)';
      default: return 'rgba(30,215,96,0.1)';
    }
  };

  if (loading) {
    return (
      <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center text-sm font-bold">
            <Sparkles className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
            AI Recommendations
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
          <Sparkles className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-6">
            <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: '#1ed760' }} />
            <p className="text-sm font-bold text-white">All caught up!</p>
            <p className="text-xs mt-1" style={{ color: '#b3b3b3' }}>No urgent actions needed right now</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((rec, index) => {
              const Icon = getIcon(rec.priority);
              const color = getColor(rec.priority);
              const bgColor = getBgColor(rec.priority);

              return (
                <div
                  key={index}
                  className="p-3 rounded-lg transition-colors hover:bg-white/5"
                  style={{ background: bgColor, border: `1px solid ${color}20` }}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white">{rec.message}</p>
                      {rec.action && (
                        <Link href="/dashboard/reminders">
                          <Button
                            variant="link"
                            className="h-auto p-0 mt-1 text-xs font-bold flex items-center gap-1"
                            style={{ color }}
                          >
                            {rec.action}
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

// Import CheckCircle for the empty state
import { CircleCheck as CheckCircle } from 'lucide-react';

AIRecommendations.displayName = 'AIRecommendations';
