'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo, { LogoMarkOnly } from '@/components/Logo';
import { FileText, ArrowRight, Sparkles, Zap, Shield, ChartBar as BarChart3, Star, TrendingUp, DollarSign, Users, Clock, Globe, ChevronDown, ChevronRight, Play, Check, X, Menu, Lock, Repeat, Send, Download, Activity, Building, Twitter, Linkedin, Github, Headphones } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// SPOTIFY DESIGN SYSTEM - Exact Implementation
// ═══════════════════════════════════════════════════════════════════════════════

const spotify = {
  // Primary Brand Colors
  green: '#1ed760',
  greenHover: '#1fdf64',
  greenBorder: '#1db954',

  // Background Surfaces (Dark Immersive)
  nearBlack: '#121212',      // Level 0 - Deepest background
  darkSurface: '#181818',    // Level 1 - Cards, containers, elevated surfaces
  midDark: '#1f1f1f',        // Level 1 - Button backgrounds, interactive surfaces
  darkCard: '#252525',       // Level 2 - Elevated card surface
  midCard: '#272727',        // Level 2 - Alternate card surface

  // Text Colors
  textBase: '#ffffff',       // Primary text
  textMuted: '#b3b3b3',      // Secondary text, muted labels, inactive nav
  textNearWhite: '#cbcbcb',  // Slightly brighter secondary text
  textLight: '#fdfdfd',      // Near-pure white for max emphasis

  // Semantic Colors
  negative: '#f3727f',        // Error states
  warning: '#ffa42b',        // Warning states
  announcement: '#539df5',    // Info states

  // Surface & Border
  borderGray: '#4d4d4d',     // Button borders on dark
  lightBorder: '#7c7c7c',    // Outlined button borders
  separator: '#b3b3b3',      // Divider lines
  lightSurface: '#eeeeee',   // Light-mode buttons (rare)

  // Shadows
  shadowHeavy: 'rgba(0,0,0,0.5) 0px 8px 24px',
  shadowMedium: 'rgba(0,0,0,0.3) 0px 8px 8px',
  shadowInset: 'rgb(18,18,18) 0px 1px 0px, rgb(124,124,124) 0px 0px 0px 1px inset',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS - Following Spotify Geometry Exactly
// ═══════════════════════════════════════════════════════════════════════════════

// Pill Button (500px-9999px radius)
const PillButton = ({
  children,
  href,
  variant = 'dark',
  size = 'md',
  icon,
  className = ''
}: {
  children: React.ReactNode;
  href: string;
  variant?: 'dark' | 'green' | 'light' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}) => {
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'py-3 px-8 text-sm',
    lg: 'py-4 px-10 text-sm',
  };

  const variants: Record<
    'dark' | 'green' | 'light' | 'outlined',
    { bg: string; text: string; hover?: string; border?: string }
  > = {
    dark: { bg: spotify.midDark, text: spotify.textBase, hover: spotify.darkSurface },
    green: { bg: spotify.green, text: '#000000', hover: spotify.greenHover },
    light: { bg: spotify.lightSurface, text: spotify.darkSurface, hover: '#ffffff' },
    outlined: { bg: 'transparent', text: spotify.textBase, border: `1px solid ${spotify.lightBorder}` },
  };

  const v = variants[variant];

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${sizes[size]} ${className}`}
      style={{
        background: v.bg,
        color: v.text,
        border: v.border || 'none',
        borderRadius: '9999px',
        textTransform: 'uppercase',
        letterSpacing: '1.4px',
        boxShadow: variant === 'green' ? spotify.shadowMedium : 'none',
      }}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </Link>
  );
};

// Circular Button (50% radius)
const CircularButton = ({
  children,
  href,
  variant = 'dark',
  size = 'md'
}: {
  children: React.ReactNode;
  href?: string;
  variant?: 'dark' | 'green';
  size?: 'sm' | 'md' | 'lg';
}) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };
  const iconSizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };

  const style = {
    dark: { bg: spotify.midDark, color: spotify.textBase },
    green: { bg: spotify.green, color: '#000000' },
  };

  const s = style[variant];

  const inner = (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-105`}
      style={{ background: s.bg, boxShadow: spotify.shadowMedium }}
    >
      <span style={{ color: s.color }} className={iconSizes[size]}>{children}</span>
    </div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
};

// Card Component
const Card = ({
  children,
  className = '',
  hover = true,
  elevated = false,
  style = {}
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  elevated?: boolean;
  style?: React.CSSProperties;
}) => (
  <div
    className={`transition-transform duration-200 ${hover ? 'hover:scale-[1.02]' : ''} ${className}`}
    style={{
      background: spotify.darkSurface,
      borderRadius: '8px',
      boxShadow: elevated ? spotify.shadowMedium : 'none',
      ...style,
    }}
  >
    {children}
  </div>
);

// Section Label with decorative lines
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center gap-4 mb-4">
    <span
      className="text-[10.5px] font-semibold uppercase tracking-widest"
      style={{ color: spotify.textMuted, letterSpacing: '0.15em' }}
    >
      {children}
    </span>
  </div>
);

// Badge (2px radius)
const Badge = ({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'green' | 'warning' }) => {
  const styles = {
    default: { bg: 'rgba(255,255,255,0.1)', color: spotify.textMuted },
    green: { bg: 'rgba(30,215,96,0.15)', color: spotify.green },
    warning: { bg: 'rgba(255,164,43,0.15)', color: spotify.warning },
  };
  const s = styles[variant];
  return (
    <span
      className="inline-block px-2 py-0.5 text-[10px] font-semibold"
      style={{ background: s.bg, color: s.color, borderRadius: '2px', textTransform: 'capitalize' }}
    >
      {children}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD MOCK - App Preview
// ═══════════════════════════════════════════════════════════════════════════════

const DashboardMock = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div
      className="relative w-full rounded-lg overflow-hidden"
      style={{ background: spotify.darkSurface, boxShadow: spotify.shadowHeavy }}
    >
      {/* Chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: spotify.nearBlack, borderBottom: `1px solid ${spotify.borderGray}` }}
      >
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
        </div>
        <div
          className="flex-1 mx-4"
          style={{ background: spotify.midDark, borderRadius: '500px' }}
        >
          <div className="px-4 py-1.5 text-xs" style={{ color: spotify.textMuted }}>
            smartinvoice.app/dashboard
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="flex h-72 sm:h-80">
        {/* Sidebar */}
        <div
          className="w-14 sm:w-48 flex flex-col py-4 px-2 sm:px-3 gap-1"
          style={{ background: spotify.nearBlack }}
        >
          <div className="flex items-center gap-3 mb-6 px-2">
            <LogoMarkOnly size={32} />
            <span className="hidden sm:block text-sm font-bold text-white">SmartInvoice</span>
          </div>

          {[
            { icon: BarChart3, label: 'Dashboard', active: true },
            { icon: FileText, label: 'Invoices', active: false },
            { icon: Users, label: 'Clients', active: false },
            { icon: DollarSign, label: 'Payments', active: false },
          ].map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-3 py-2 rounded text-sm font-bold transition-colors"
              style={{
                background: active ? spotify.midDark : 'transparent',
                color: active ? spotify.textBase : spotify.textMuted
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:block">{label}</span>
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 p-4" style={{ background: spotify.darkSurface }}>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {[
              { label: 'Revenue', val: '$48,290', chg: '+12%' },
              { label: 'Invoices', val: '184', chg: '+8' },
              { label: 'Paid', val: '162', chg: '88%' },
              { label: 'Pending', val: '22', chg: '3 due' },
            ].map(s => (
              <div key={s.label} className="p-3 rounded" style={{ background: spotify.midDark }}>
                <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: spotify.textMuted }}>{s.label}</div>
                <div className="text-lg font-bold text-white">{s.val}</div>
                <div className="text-[10px] font-bold" style={{ color: spotify.green }}>{s.chg}</div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="p-3 rounded mb-3" style={{ background: spotify.midDark }}>
            <div className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: spotify.textMuted }}>Monthly Revenue</div>
            <div className="flex items-end gap-1 h-14">
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-all duration-500"
                  style={{
                    height: mounted ? `${h}%` : '0%',
                    background: i === 11 ? spotify.green : `rgba(30,215,96,${0.1 + h / 400})`
                  }}
                />
              ))}
            </div>
          </div>

          {/* List */}
          <div className="rounded overflow-hidden" style={{ background: spotify.midDark }}>
            {[
              { name: 'Acme Corp', amount: '$2,400', status: 'Paid', isPaid: true },
              { name: 'TechFlow Inc', amount: '$1,850', status: 'Pending', isPaid: false },
            ].map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2.5"
                style={{ borderBottom: i === 0 ? `1px solid ${spotify.borderGray}` : 'none' }}
              >
                <div className="text-sm text-white font-medium">{r.name}</div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">{r.amount}</span>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase"
                    style={{
                      background: r.isPaid ? 'rgba(30,215,96,0.15)' : 'rgba(255,164,43,0.15)',
                      color: r.isPaid ? spotify.green : spotify.warning
                    }}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// FAQ ACCORDION
// ═══════════════════════════════════════════════════════════════════════════════

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-lg overflow-hidden transition-colors"
      style={{ background: spotify.darkSurface }}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
        onClick={() => setOpen(!open)}
        style={{ borderColor: open ? spotify.green : 'transparent' }}
      >
        <span className="text-sm font-bold text-white pr-4">{q}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: spotify.textMuted }}
        />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm leading-relaxed" style={{ color: spotify.textMuted }}>{a}</p>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-white" style={{ background: spotify.nearBlack }}>

      {/* ═══ HEADER ═══ */}
      <header
        className={`fixed left-1/2 z-50 rounded-full transition-all duration-500 ease-out border backdrop-blur-lg ${
          scrollY > 20
            ? 'top-3 bg-black/80 border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.6)] w-[calc(100%-4rem)] max-w-4xl py-1.5'
            : 'top-6 bg-[#121212]/30 border-white/5 w-[calc(100%-2rem)] max-w-5xl py-3'
        }`}
        style={{
          transform: scrollY > 20 ? 'translateX(-50%) scale(0.95)' : 'translateX(-50%) scale(1)',
        }}
      >
        <div className={`w-full transition-all duration-500 ${scrollY > 20 ? 'px-4 md:px-6' : 'px-6 md:px-8'}`}>
          <div className="flex items-center justify-between h-11">
            {/* Logo */}
            <Link
              href="/"
              className={`group flex items-center transition-all duration-500 origin-left ${
                scrollY > 20 ? 'scale-90' : 'scale-100'
              }`}
            >
              <Logo variant="full" size="sm" className="transition-opacity" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-0.5 group/nav">
              {['Features', 'Pricing', 'FAQ'].map(item => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`relative font-bold rounded-full transition-all duration-300 hover:bg-white/10 hover:text-white group-hover/nav:opacity-60 hover:!opacity-100 ${
                    scrollY > 20 ? 'px-3 py-1 text-[10px]' : 'px-4 py-2 text-xs'
                  }`}
                  style={{
                    color: spotify.textMuted,
                    letterSpacing: '0.8px',
                    textTransform: 'uppercase'
                  }}
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className={`hidden md:flex items-center transition-all duration-500 ${scrollY > 20 ? 'gap-3' : 'gap-4'}`}>
              <Link
                href="/auth/login"
                className={`font-extrabold transition-all duration-300 hover:text-white hover:scale-[1.05] ${
                  scrollY > 20 ? 'text-[10px] px-2 py-1.5' : 'text-xs px-3 py-2'
                }`}
                style={{ color: spotify.textMuted, textTransform: 'uppercase', letterSpacing: '1.4px' }}
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className={`relative inline-flex items-center justify-center font-bold transition-all duration-500 hover:scale-[1.05] active:scale-[0.98] text-black shadow-[0_4px_12px_rgba(30,215,96,0.3)] hover:shadow-[0_4px_20px_rgba(30,215,96,0.5)] ${
                  scrollY > 20 ? 'px-4 py-2 text-[10px] gap-1' : 'px-5 py-2.5 text-xs gap-1.5'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${spotify.green} 0%, #1db954 100%)`,
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.4px',
                }}
              >
                <span>Get Started</span>
                <ArrowRight className={`transition-all duration-500 ${scrollY > 20 ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
              </Link>
            </div>

            {/* Mobile Menu */}
            <button
              className="md:hidden p-2 rounded-full transition-colors hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-white" />
              ) : (
                <Menu className="w-4 h-4" style={{ color: spotify.textBase }} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div
            className="md:hidden absolute top-[calc(100%+0.5rem)] left-0 right-0 p-4 rounded-3xl border border-white/10 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300"
            style={{
              background: 'rgba(18,18,18,0.95)',
              backdropFilter: 'blur(20px)'
            }}
          >
            {['Features', 'Pricing', 'FAQ'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-5 py-3 text-xs font-extrabold rounded-full transition-colors hover:bg-white/10"
                style={{
                  color: spotify.textMuted,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase'
                }}
              >
                {item}
              </a>
            ))}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-3 text-xs font-bold rounded-full transition-colors hover:bg-white/10 border border-white/10"
                style={{ color: spotify.textMuted, textTransform: 'uppercase', letterSpacing: '1.2px' }}
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-3 text-xs font-bold rounded-full transition-transform hover:scale-[1.02]"
                style={{
                  background: spotify.green,
                  color: '#000',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px'
                }}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ═══ HERO ═══ */}
      <section 
        className="relative pt-32 pb-24 px-6 overflow-hidden transition-all duration-500" 
      >
        {/* Ambient Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/60 via-[#121212]/30 to-[#121212] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center z-10">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: spotify.midDark }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: spotify.green }} />
            <span className="text-xs font-bold" style={{ color: spotify.green, textTransform: 'uppercase', letterSpacing: '1.4px' }}>
              Introducing AI invoicing
            </span>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: spotify.textMuted }} />
          </div>

          {/* Headline - 24px Section Title weight */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            <span className="text-white">Invoice smarter.</span>
            <br />
            <span style={{ color: spotify.green }}>Get paid faster.</span>
          </h1>

          {/* Body text - 16px weight 400 */}
          <p className="text-base max-w-xl mx-auto mb-10" style={{ color: spotify.textMuted }}>
            The premium invoicing platform for professionals. Create stunning invoices in seconds with AI, track payments effortlessly, and get paid faster.
          </p>

          {/* CTAs - Pill buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <PillButton href="/auth/signup" variant="green" size="lg">
              Start Free
              <ArrowRight className="w-4 h-4" />
            </PillButton>
            <PillButton href="#demo" variant="outlined" size="lg" icon={<ArrowRight className="w-4 h-4" style={{ color: spotify.green }} />}>
              Explore App
            </PillButton>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12" style={{ color: spotify.textMuted }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[spotify.green, '#1db954', '#169c46', '#22c55e'].map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: c, border: `2px solid ${spotify.nearBlack}`, color: '#000' }}
                  >
                    {['JS', 'MC', 'ER', 'AK'][i]}
                  </div>
                ))}
              </div>
              <span className="text-xs">10,000+ professionals</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5" fill={spotify.warning} style={{ color: spotify.warning }} />
              ))}
              <span className="text-xs ml-1">4.9/5</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BRANDS ═══ */}
      <section className="py-12 px-6" style={{ background: spotify.darkSurface }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest mb-6" style={{ color: spotify.textMuted }}>
            Trusted by teams at
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
            {['Acme Corp', 'TechFlow', 'DesignHub', 'BuildCo', 'NovaSoft', 'CreativeX'].map(name => (
              <span key={name} className="text-sm font-bold transition-colors" style={{ color: spotify.textMuted }}>
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ DASHBOARD PREVIEW ═══ */}
      <section id="demo" className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-10">
            <SectionLabel>Dashboard Preview</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              A powerful, intuitive workspace
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: spotify.textMuted }}>
              Take a look at the comprehensive business overview and real-time tracking designed to get you paid faster.
            </p>
          </div>

          <div 
            className="relative rounded-xl overflow-hidden border transition-all duration-300 hover:scale-[1.01]"
            style={{ 
              borderColor: spotify.borderGray,
              boxShadow: spotify.shadowHeavy
            }}
          >
            <img 
              src="/dashboard-screenshot.png" 
              alt="SmartInvoice Dashboard Preview" 
              className="w-full h-auto block" 
            />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Features</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Everything you need.<br />Nothing you don't.
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: spotify.textMuted }}>
              Powerful features designed for professionals who value their time.
            </p>
          </div>

          {/* Feature highlights - Large cards */}
          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            <Card className="p-6" elevated>
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(30,215,96,0.1)' }}
              >
                <Sparkles className="w-5 h-5" style={{ color: spotify.green }} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">AI Invoice Generation</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: spotify.textMuted }}>
                Describe your work in natural language. Our AI creates professional invoices with perfect line items and pricing in seconds.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Natural Language', 'Smart Pricing', 'Instant Draft'].map(tag => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6" elevated>
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(255,164,43,0.1)' }}
              >
                <Zap className="w-5 h-5" style={{ color: spotify.warning }} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Instant Payments</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: spotify.textMuted }}>
                Embedded payment links let clients pay instantly. Stripe, Razorpay, UPI, and bank transfers supported.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Stripe', 'UPI', 'Bank Transfer'].map(tag => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Feature grid - Small cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: BarChart3, title: 'Analytics', desc: 'Revenue trends and cash flow forecasts.' },
              { icon: Clock, title: 'Auto Reminders', desc: 'Scheduled payment reminders.' },
              { icon: Globe, title: 'Multi-currency', desc: 'Bill in 50+ currencies.' },
              { icon: Shield, title: 'Bank Security', desc: 'SOC 2 compliant, encrypted.' },
              { icon: Users, title: 'Client Portal', desc: 'White-label client portal.' },
              { icon: Repeat, title: 'Recurring', desc: 'Set-and-forget billing.' },
              { icon: Download, title: 'PDF Export', desc: 'Pixel-perfect PDFs.' },
              { icon: Activity, title: 'Tracking', desc: 'Real-time payment tracking.' },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="p-4">
                <Icon className="w-5 h-5 mb-3" style={{ color: spotify.green }} />
                <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
                <p className="text-xs" style={{ color: spotify.textMuted }}>{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-12 px-6" style={{ background: spotify.darkSurface }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { val: '$2.4B+', label: 'Invoices processed', icon: DollarSign },
              { val: '10,000+', label: 'Active users', icon: Users },
              { val: '40%', label: 'Faster payments', icon: TrendingUp },
              { val: '99.99%', label: 'Uptime SLA', icon: Activity },
            ].map(({ val, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="flex justify-center mb-2">
                  <Icon className="w-5 h-5" style={{ color: spotify.green }} />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{val}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: spotify.textMuted }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Testimonials</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Loved by <span style={{ color: spotify.green }}>10,000+</span> professionals
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { quote: 'SmartInvoice transformed my billing. What took hours now takes seconds.', author: 'Sarah Chen', role: 'Freelance Designer', initials: 'SC' },
              { quote: 'The AI invoice generation is incredible. Describe your work and everything fills itself.', author: 'Michael Park', role: 'Agency Founder', initials: 'MP' },
              { quote: 'Best invoicing tool I\'ve used. The templates are stunning and UX is flawless.', author: 'Emma Wilson', role: 'Tech Consultant', initials: 'EW' },
            ].map(({ quote, author, role, initials }) => (
              <Card key={author} className="p-5">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5" fill={spotify.warning} style={{ color: spotify.warning }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: spotify.textNearWhite }}>"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: spotify.green, color: '#000' }}
                  >
                    {initials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{author}</div>
                    <div className="text-[10px]" style={{ color: spotify.textMuted }}>{role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PRICING ═══ */}
      <section id="pricing" className="py-16 px-6" style={{ background: spotify.darkSurface }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-sm" style={{ color: spotify.textMuted }}>Start free. Scale when you're ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 items-start">
            {/* Free */}
            <Card className="p-6">
              <div className="mb-5">
                <div className="text-xs font-bold" style={{ color: spotify.textMuted }}>Free</div>
                <div className="text-3xl font-bold text-white">$0</div>
                <div className="text-[10px]" style={{ color: spotify.textMuted }}>Forever free</div>
              </div>
              <PillButton href="/auth/signup" variant="outlined" size="sm" className="w-full mb-6">
                Get Started
              </PillButton>
              <ul className="space-y-2.5">
                {[['Unlimited invoices', true], ['3 clients', true], ['3 templates', true], ['PDF export', false], ['Payment links', false], ['Analytics', false]].map(([feat, inc]) => (
                  <li key={feat as string} className="flex items-center gap-2 text-xs">
                    {inc ? <Check className="w-4 h-4" style={{ color: spotify.green }} /> : <X className="w-4 h-4" style={{ color: spotify.borderGray }} />}
                    <span className="font-medium" style={{ color: inc ? spotify.textBase : spotify.borderGray }}>{feat as string}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Pro - Featured */}
            <Card
              className="p-6"
              elevated
              style={{ border: `1px solid ${spotify.green}`, boxShadow: spotify.shadowHeavy }}
            >
              <div className="mb-5">
                <div className="text-xs font-bold" style={{ color: spotify.green }}>Pro</div>
                <div className="flex items-baseline gap-1">
                  <div className="text-3xl font-bold text-white">₹299</div>
                  <div className="text-xs" style={{ color: spotify.textMuted }}>/mo</div>
                </div>
              </div>
              <PillButton href="/auth/signup" variant="green" size="sm" className="w-full mb-6">
                Start Trial
              </PillButton>
              <ul className="space-y-2.5">
                {[['Unlimited invoices', true], ['Unlimited clients', true], ['All 12 templates', true], ['Payment links', true], ['Analytics', true], ['Auto reminders', true]].map(([feat, inc]) => (
                  <li key={feat as string} className="flex items-center gap-2 text-xs">
                    <Check className="w-4 h-4" style={{ color: spotify.green }} />
                    <span className="font-medium text-white">{feat as string}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Business */}
            <Card className="p-6">
              <div className="mb-5">
                <div className="text-xs font-bold" style={{ color: spotify.textMuted }}>Business</div>
                <div className="flex items-baseline gap-1">
                  <div className="text-3xl font-bold text-white">₹999</div>
                  <div className="text-xs" style={{ color: spotify.textMuted }}>/mo</div>
                </div>
              </div>
              <PillButton href="/auth/signup" variant="outlined" size="sm" className="w-full mb-6">
                Contact Sales
              </PillButton>
              <ul className="space-y-2.5">
                {[['Everything in Pro', true], ['Team accounts', true], ['Custom branding', true], ['Client portal', true], ['API access', true], ['Priority support', true]].map(([feat, inc]) => (
                  <li key={feat as string} className="flex items-center gap-2 text-xs">
                    <Check className="w-4 h-4" style={{ color: spotify.green }} />
                    <span className="font-medium text-white">{feat as string}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs" style={{ color: spotify.textMuted }}>
              No credit card required · 14-day money-back guarantee · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Questions? Answers.</h2>
          </div>

          <div className="space-y-3">
            {[
              { q: 'Is SmartInvoice really free?', a: 'Yes. Our free plan includes unlimited invoices for up to 3 clients. No credit card required, no time limits.' },
              { q: 'How does AI invoice generation work?', a: 'Simply describe your work in plain language. Our AI parses the description, creates line items, calculates totals, and generates a professional invoice instantly.' },
              { q: 'What payment methods do you support?', a: 'We support Stripe (cards, Apple Pay, Google Pay), Razorpay (UPI, wallets, net banking), and direct bank transfers.' },
              { q: 'Is my financial data secure?', a: 'Absolutely. SOC 2 Type II compliant, end-to-end encrypted, and we never store payment card data directly.' },
              { q: 'Can I import existing clients?', a: 'Yes. Import clients via CSV or manually add them. We support tax IDs and custom fields.' },
            ].map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 px-6" style={{ background: spotify.darkSurface }}>
        <div className="max-w-3xl mx-auto text-center">
          <Card className="p-10 sm:p-12">
            <div className="flex justify-center mb-6">
              <LogoMarkOnly size={64} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to transform your billing?
            </h2>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: spotify.textMuted }}>
              Join 10,000+ professionals getting paid faster with SmartInvoice.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <PillButton href="/auth/signup" variant="green" size="md">
                Start Free Today
                <ArrowRight className="w-4 h-4" />
              </PillButton>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-5 mt-6">
              <span className="flex items-center gap-1.5 text-xs" style={{ color: spotify.textMuted }}>
                <Check className="w-4 h-4" style={{ color: spotify.green }} /> Free forever
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: spotify.textMuted }}>
                <Lock className="w-4 h-4" style={{ color: spotify.green }} /> No card required
              </span>
              <span className="flex items-center gap-1.5 text-xs" style={{ color: spotify.textMuted }}>
                <Shield className="w-4 h-4" style={{ color: spotify.green }} /> GDPR compliant
              </span>
            </div>
          </Card>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 px-6" style={{ borderTop: `1px solid ${spotify.borderGray}` }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <Link href="/" className="mb-4 inline-block">
                <Logo variant="full" size="sm" />
              </Link>
              <p className="text-xs" style={{ color: spotify.textMuted }}>
                Premium invoicing for modern professionals.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Templates', 'Pricing'] },
              { title: 'Resources', links: ['Documentation', 'API', 'Blog'] },
              { title: 'Company', links: ['About', 'Privacy', 'Terms'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-white">{title}</h4>
                <ul className="space-y-2">
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-xs transition-colors hover:text-white" style={{ color: spotify.textMuted }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4"
            style={{ borderTop: `1px solid ${spotify.borderGray}` }}
          >
            <p className="text-xs" style={{ color: spotify.textMuted }}>© 2025 SmartInvoice. All rights reserved.</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: spotify.green }} />
              <span className="text-xs" style={{ color: spotify.textMuted }}>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
