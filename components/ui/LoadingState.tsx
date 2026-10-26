'use client';

import React from 'react';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';

interface LoadingStateProps {
  message?: string;
  sublabel?: string;
  className?: string;
  fullScreen?: boolean;
}

export function LoadingState({
  message = 'Loading...',
  sublabel,
  className = 'min-h-[400px]',
  fullScreen = false,
}: LoadingStateProps) {
  return (
    <LuxuryLoader 
      label={message}
      sublabel={sublabel}
      minHeight={className}
      fullScreen={fullScreen}
    />
  );
}

export default LoadingState;
