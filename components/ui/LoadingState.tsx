'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading...', className = 'min-h-[400px]' }: LoadingStateProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#1ed760' }} />
        <p style={{ color: '#b3b3b3' }}>{message}</p>
      </div>
    </div>
  );
}

export default LoadingState;
