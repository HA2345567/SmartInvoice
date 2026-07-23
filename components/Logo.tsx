import React from 'react';

/**
 * SmartInvoice Logo Component - Geometric Slanting Wings + Spotify Green (#1ed760) Bold 'S' Ribbon
 */

interface LogoProps {
  variant?: 'full' | 'mark' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeConfig = {
  sm: { mark: 34, textSize: 'text-base', gap: 'gap-2.5' },
  md: { mark: 44, textSize: 'text-xl', gap: 'gap-3' },
  lg: { mark: 56, textSize: 'text-2xl', gap: 'gap-3.5' },
  xl: { mark: 70, textSize: 'text-3xl', gap: 'gap-4' },
};

export default function Logo({
  variant = 'full',
  size = 'md',
  className = '',
}: LogoProps) {
  const s = sizeConfig[size] || sizeConfig.md;

  // Geometric Slanting Logo Mark (Clean 100x100 Vector Geometry)
  const LogoMark = () => (
    <svg
      width={s.mark}
      height={s.mark}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 drop-shadow-[0_0_12px_rgba(30,215,96,0.4)] transition-transform duration-300 hover:scale-105"
    >
      <defs>
        <linearGradient id="spotifyGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1ed760" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Top Slanting White Polygon Wing */}
      <path d="M 28 10 L 88 10 L 64 42 L 18 42 Z" fill="#ffffff" />

      {/* Bottom Slanting White Polygon Wing */}
      <path d="M 36 58 L 82 58 L 72 90 L 12 90 Z" fill="#ffffff" />

      {/* Bold 'S' Ribbon in Signature Spotify Green (#1ed760) */}
      <path
        d="M 60 20 C 78 20 86 30 86 40 C 86 54 44 48 44 64 C 44 74 54 80 72 80"
        fill="none"
        stroke="url(#spotifyGreenGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // Wordmark text with Premium Luxury Typography
  const Wordmark = () => (
    <span
      className={`font-black ${s.textSize} text-white flex items-center gap-0.5 select-none`}
      style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', 'Syne', sans-serif" }}
    >
      <span className="text-white font-extrabold tracking-[-0.04em]">Smart</span>
      <span className="text-[#1ed760] font-black tracking-[-0.02em] drop-shadow-[0_0_15px_rgba(30,215,96,0.4)]">
        Invoice
      </span>
      <span className="h-2.5 w-2.5 rounded-full bg-[#1ed760] animate-pulse shadow-[0_0_10px_#1ed760] ml-1 flex-shrink-0" />
    </span>
  );

  if (variant === 'mark') {
    return <LogoMark />;
  }

  if (variant === 'wordmark') {
    return <Wordmark />;
  }

  return (
    <div className={`inline-flex items-center ${s.gap} ${className}`}>
      <LogoMark />
      <Wordmark />
    </div>
  );
}

export function LogoMarkOnly({ size = 32, className = '' }: { size?: number; className?: string }) {
  return <Logo variant="mark" size={size <= 32 ? 'sm' : size <= 44 ? 'md' : 'lg'} className={className} />;
}
