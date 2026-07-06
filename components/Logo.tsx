import React from 'react';

/**
 * SmartInvoice Logo Component
 */

interface LogoProps {
  variant?: 'full' | 'mark' | 'wordmark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeConfig = {
  sm: { mark: 32, textSize: 'text-sm', gap: 'gap-2' },
  md: { mark: 40, textSize: 'text-base', gap: 'gap-2.5' },
  lg: { mark: 48, textSize: 'text-lg', gap: 'gap-3' },
  xl: { mark: 64, textSize: 'text-xl', gap: 'gap-3' },
};

// Brand colors
const GREEN = '#1ed760';

export default function Logo({
  variant = 'full',
  size = 'md',
  className = '',
}: LogoProps) {
  const s = sizeConfig[size] || sizeConfig.md;

  // Logo Mark SVG
  const LogoMark = () => (
    <svg
      width={s.mark}
      height={s.mark}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1ed760" />
          <stop offset="50%" stopColor="#00D4AA" />
          <stop offset="100%" stopColor="#1db954" />
        </linearGradient>
        <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <circle cx="32" cy="32" r="30" fill="url(#logoGradient)" filter="url(#logoGlow)" />
      <path d="M20 16C20 14.8954 20.8954 14 22 14H38L44 20V48C44 49.1046 43.1046 50 42 50H22C20.8954 50 20 49.1046 20 48V16Z" fill="url(#logoGradient)" />
      <path d="M38 14V20H44L38 14Z" fill="#181818" opacity="0.3" />
      <rect x="25" y="24" width="14" height="3" rx="1.5" fill="#181818" />
      <rect x="25" y="31" width="10" height="2" rx="1" fill="#181818" opacity="0.8" />
      <rect x="25" y="36" width="12" height="2" rx="1" fill="#181818" opacity="0.6" />
      <rect x="25" y="41" width="8" height="2" rx="1" fill="#181818" opacity="0.4" />
      <circle cx="40" cy="44" r="6" fill="#181818" />
      <path d="M37 44L39 46L43.5 41.5" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M12 32C12 21.5066 20.5066 13 31 13" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );

  // Wordmark text
  const Wordmark = () => (
    <span className={`font-bold tracking-tight ${s.textSize} text-white`}>
      Smart<span style={{ color: GREEN }}>Invoice</span>
    </span>
  );

  // Render based on variant
  if (variant === 'mark') {
    return <LogoMark />;
  }

  if (variant === 'wordmark') {
    return <Wordmark />;
  }

  // Full logo
  return (
    <div className={`inline-flex items-center ${s.gap} ${className}`}>
      <LogoMark />
      <Wordmark />
    </div>
  );
}

// Standalone logo mark for icons/favicons
export function LogoMarkOnly({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoMarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1ed760" />
          <stop offset="50%" stopColor="#00D4AA" />
          <stop offset="100%" stopColor="#1db954" />
        </linearGradient>
        <filter id="logoMarkGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <circle cx="32" cy="32" r="30" fill="url(#logoMarkGradient)" filter="url(#logoMarkGlow)" />
      <path d="M20 16C20 14.8954 20.8954 14 22 14H38L44 20V48C44 49.1046 43.1046 50 42 50H22C20.8954 50 20 49.1046 20 48V16Z" fill="url(#logoMarkGradient)" />
      <rect x="25" y="24" width="14" height="3" rx="1.5" fill="#181818" />
      <rect x="25" y="31" width="10" height="2" rx="1" fill="#181818" opacity="0.8" />
      <rect x="25" y="36" width="12" height="2" rx="1" fill="#181818" opacity="0.6" />
      <rect x="25" y="41" width="8" height="2" rx="1" fill="#181818" opacity="0.4" />
      <circle cx="40" cy="44" r="6" fill="#181818" />
      <path d="M37 44L39 46L43.5 41.5" stroke="url(#logoMarkGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
