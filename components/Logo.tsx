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

  // Geometric Slanting Logo Mark (New Custom Yin-Yang Wave Vector Design)
  const LogoMark = () => (
    <svg
      width={s.mark}
      height={s.mark}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 drop-shadow-[0_0_10px_rgba(255,255,255,0.25)] transition-transform duration-300 hover:scale-105"
    >
      {/* Top Wing (solid filled white) */}
      <path
        d="M 10 48.5 L 48 48.5 C 35 48.5, 35 26, 50 26 C 30 26, 20 48.5, 10 48.5 Z"
        fill="#ffffff"
      />
      {/* Bottom Wing (solid filled white) */}
      <path
        d="M 90 51.5 L 52 51.5 C 65 51.5, 65 74, 50 74 C 70 74, 80 51.5, 90 51.5 Z"
        fill="#ffffff"
      />
      {/* Top-Right thin arc */}
      <path
        d="M 50 26 A 24 24 0 0 1 74 50"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bottom-Left thin arc */}
      <path
        d="M 50 74 A 24 24 0 0 1 26 50"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
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
