'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LuxuryLoaderProps {
  label?: string;
  sublabel?: string;
  fullScreen?: boolean;
  minHeight?: string;
  className?: string;
}

export function LuxuryLoader({
  label = 'Loading...',
  sublabel,
  fullScreen = false,
  minHeight = 'min-h-[400px]',
  className = '',
}: LuxuryLoaderProps) {
  return (
    <div
      className={`flex items-center justify-center relative overflow-hidden ${
        fullScreen ? 'min-h-screen w-full bg-[#121212]' : minHeight
      } ${className}`}
    >
      {/* Ambient luxury radial glow */}
      <div 
        className="absolute w-48 h-48 rounded-full pointer-events-none blur-3xl opacity-30 animate-pulse"
        style={{ background: 'radial-gradient(circle, rgba(30,215,96,0.35) 0%, rgba(30,215,96,0) 70%)' }}
      />

      <div className="relative z-10 text-center px-4">
        <div className="relative inline-flex items-center justify-center mb-4">
          {/* Subtle spinning glow ring */}
          <div className="absolute inset-0 rounded-full blur-md opacity-40 bg-[#1ed760] animate-pulse" />
          <Loader2 
            className="w-8 h-8 animate-spin relative z-10" 
            style={{ color: '#1ed760' }} 
          />
        </div>

        <p 
          className="text-sm font-medium tracking-wide transition-all"
          style={{ color: '#b3b3b3' }}
        >
          {label}
        </p>

        {sublabel && (
          <p className="text-[11px] text-zinc-500 font-mono uppercase tracking-widest mt-1.5">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}

export default LuxuryLoader;
