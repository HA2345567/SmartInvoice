import React from 'react';

/**
 * SmartInvoice Luxury Logo Component
 */

interface LogoProps {
  variant?: 'full' | 'mark' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeConfig = {
  sm: { mark: 32, textSize: 'text-base', gap: 'gap-2' },
  md: { mark: 42, textSize: 'text-xl', gap: 'gap-2.5' },
  lg: { mark: 52, textSize: 'text-2xl', gap: 'gap-3' },
  xl: { mark: 64, textSize: 'text-3xl', gap: 'gap-3.5' },
};

export default function Logo({
  variant = 'full',
  size = 'md',
  className = '',
}: LogoProps) {
  const s = sizeConfig[size] || sizeConfig.md;

  // Logo Mark SVG - Ultra Luxury Emerald & Cyan AI Emblem
  const LogoMark = () => (
    <svg
      width={s.mark}
      height={s.mark}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-transform duration-300 hover:scale-105"
    >
      <defs>
        <linearGradient id="smartLogoBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#064e3b" />
          <stop offset="50%" stopColor="#022c22" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        <linearGradient id="smartLogoPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>

        <linearGradient id="smartLogoAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        <filter id="smartGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rounded Squircle Container */}
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill="url(#smartLogoBg)"
        stroke="rgba(52, 211, 153, 0.25)"
        strokeWidth="1.5"
      />

      {/* Outer Subtle Glow Ring */}
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="12"
        stroke="url(#smartLogoPrimary)"
        strokeOpacity="0.15"
        strokeWidth="1"
      />

      {/* Stylized 'S' + Invoice Ribbon Fold */}
      <path
        d="M20 22C20 18.6863 22.6863 16 26 16H38C41.3137 16 44 18.6863 44 22V26C44 28.2091 42.2091 30 40 30H24C21.7909 30 20 31.7909 20 34V42C20 45.3137 22.6863 48 26 48H38C41.3137 48 44 45.3137 44 42"
        stroke="url(#smartLogoPrimary)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#smartGlow)"
      />

      {/* Document Lines within the mark */}
      <line x1="28" y1="23" x2="36" y2="23" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="41" x2="36" y2="41" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" />

      {/* AI Sparkle Star Badge */}
      <path
        d="M44 18L45.5 22L49.5 23.5L45.5 25L44 29L42.5 25L38.5 23.5L42.5 22L44 18Z"
        fill="url(#smartLogoAccent)"
      />
    </svg>
  );

  // Wordmark text
  const Wordmark = () => (
    <span className={`font-extrabold tracking-tight ${s.textSize} text-white flex items-center gap-1`}>
      <span>Smart</span>
      <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(16,185,129,0.3)]">
        Invoice
      </span>
      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
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
