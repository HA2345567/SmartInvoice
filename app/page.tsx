'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, Sparkles, Zap, Shield, ChartBar as BarChart3, Star, TrendingUp, DollarSign, Users, Clock, Globe, ChevronDown, ChevronRight, Play, Check, X, Menu, Lock, Repeat, Send, Download, Activity, Building, Twitter, Linkedin, Github, Quote, MoveRight, BadgeCheck, Gauge, Layers } from 'lucide-react';

// ─── Premium Design System ────────────────────────────────────────────────────
const theme = {
  // Primary
  accent: '#00D4AA',
  accentHover: '#00E5BB',
  accentGlow: 'rgba(0, 212, 170, 0.4)',
  // Gold accent for luxury
  gold: '#D4AF37',
  goldGlow: 'rgba(212, 175, 55, 0.3)',
  // Backgrounds
  bg0: '#000000',
  bg1: '#050505',
  bg2: '#0A0A0A',
  bg3: '#0F0F0F',
  bg4: '#141414',
  // Glass
  glass: 'rgba(255, 255, 255, 0.03)',
  glassHover: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassBorderHover: 'rgba(255, 255, 255, 0.12)',
  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  // Gradients
  gradientAccent: 'linear-gradient(135deg, #00D4AA 0%, #00E5BB 50%, #00F5CC 100%)',
  gradientGold: 'linear-gradient(135deg, #D4AF37 0%, #F0C850 100%)',
  gradientDark: 'linear-gradient(180deg, #0A0A0A 0%, #000000 100%)',
  gradientRadial: 'radial-gradient(ellipse at 50% 0%, rgba(0, 212, 170, 0.15) 0%, transparent 50%)',
};

// ─── Noise Texture Component ─────────────────────────────────────────────────
const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.015]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
);

// ─── Gradient Orbs ──────────────────────────────────────────────────────────
const GradientOrbs = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {/* Main ambient glow */}
    <div className="absolute top-[-20%] left-[50%] -translate-x-[50%] w-[1000px] h-[600px] rounded-full blur-[120px] opacity-30" style={{ background: 'radial-gradient(ellipse, rgba(0, 212, 170, 0.3) 0%, transparent 70%)' }} />
    {/* Secondary accent */}
    <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-20" style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, transparent 70%)' }} />
    {/* Tertiary subtle */}
    <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] rounded-full blur-[80px] opacity-15" style={{ background: 'radial-gradient(circle, rgba(0, 212, 170, 0.2) 0%, transparent 70%)' }} />
    {/* Grid pattern */}
    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
  </div>
);

// ─── Premium Button ───────────────────────────────────────────────────────────
const PremiumButton = ({ children, href, variant = 'primary', size = 'md', className = '', ...props }: { children: React.ReactNode; href: string; variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const base = 'group relative inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-300';
  const sizes = { sm: 'px-5 py-2 text-sm', md: 'px-7 py-3 text-sm', lg: 'px-9 py-4 text-base' };
  const variants = {
    primary: `bg-white text-black hover:bg-white/90 shadow-lg hover:shadow-xl hover:shadow-white/10`,
    secondary: `border hover:bg-white/5 text-white`,
    ghost: `text-white/70 hover:text-white hover:bg-white/5`,
  };
  const inner = (
    <span className="relative z-10 flex items-center gap-2">
      {children}
    </span>
  );
  return (
    <Link href={href} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} style={{ border: variant !== 'primary' ? `1px solid rgba(255,255,255,0.1)` : undefined }} {...props}>
      {variant === 'primary' && (
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
      )}
      {inner}
    </Link>
  );
};

// ─── Glass Card ──────────────────────────────────────────────────────────────
const GlassCard = ({ children, className = '', hover = true, glow = false }: { children: React.ReactNode; className?: string; hover?: boolean; glow?: boolean }) => (
  <div className={`relative rounded-2xl overflow-hidden ${className}`}>
    {/* Glass background */}
    <div className={`absolute inset-0 rounded-2xl transition-all duration-300`} style={{ background: theme.glass, border: `1px solid ${theme.glassBorder}`, backdropFilter: 'blur(20px)' }} />
    {/* Glow effect */}
    {glow && <div className="absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `linear-gradient(135deg, ${theme.accentGlow} 0%, transparent 50%)` }} />}
    {/* Content */}
    <div className="relative z-10">{children}</div>
  </div>
);

// ─── Section Label ──────────────────────────────────────────────────────────
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center gap-3 mb-6">
    <div className="h-px w-8" style={{ background: `linear-gradient(90deg, transparent, ${theme.glassBorder})` }} />
    <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: theme.accent }}>{children}</span>
    <div className="h-px w-8" style={{ background: `linear-gradient(90deg, ${theme.glassBorder}, transparent)` }} />
  </div>
);

// ─── Dashboard Mock ──────────────────────────────────────────────────────────
const DashboardMock = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative rounded-3xl overflow-hidden" style={{ background: theme.bg2, boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.7), 0 30px 60px -30px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
      {/* Chrome dots */}
      <div className="flex items-center gap-2 px-5 py-4" style={{ borderBottom: `1px solid ${theme.glassBorder}` }}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <div className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex-1 mx-4">
          <div className="mx-auto w-80 h-6 rounded-full flex items-center px-4 text-xs" style={{ background: theme.bg3, color: theme.textMuted }}>
            smartinvoice.app
          </div>
        </div>
      </div>

      {/* App content */}
      <div className="flex h-80">
        {/* Sidebar */}
        <div className="w-14 sm:w-52 p-3 flex flex-col gap-1.5" style={{ background: theme.bg1, borderRight: `1px solid ${theme.glassBorder}` }}>
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 py-3 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: theme.gradientAccent, boxShadow: `0 4px 12px ${theme.accentGlow}` }}>
              <FileText className="w-4 h-4 text-black" />
            </div>
            <span className="hidden sm:block text-sm font-semibold text-white">SmartInvoice</span>
          </div>

          {/* Nav items */}
          {[
            { icon: BarChart3, label: 'Dashboard', active: true },
            { icon: FileText, label: 'Invoices', active: false },
            { icon: Users, label: 'Clients', active: false },
            { icon: DollarSign, label: 'Revenue', active: false },
          ].map(({ icon: Icon, label, active }) => (
            <div key={label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? 'text-white' : ''}`} style={{ background: active ? theme.bg3 : 'transparent', color: active ? theme.textPrimary : theme.textMuted }}>
              <Icon className="w-4 h-4" />
              <span className="hidden sm:block">{label}</span>
              {active && <div className="hidden sm:flex-1 h-0.5 rounded-full ml-auto" style={{ background: theme.gradientAccent }} />}
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 p-5" style={{ background: theme.bg2 }}>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Revenue', value: '$84.2K', change: '+24%', positive: true },
              { label: 'Invoices', value: '247', change: '+12', positive: true },
              { label: 'Paid', value: '94%', change: '+6%', positive: true },
            ].map((stat, i) => (
              <div key={stat.label} className="rounded-xl p-3" style={{ background: theme.bg3 }}>
                <div className="text-[10px] font-medium uppercase tracking-wider mb-1" style={{ color: theme.textMuted }}>{stat.label}</div>
                <div className="text-lg font-semibold text-white">{stat.value}</div>
                <div className="text-[10px] font-medium" style={{ color: theme.accent }}>{stat.change}</div>
              </div>
            ))}
          </div>

          {/* Chart placeholder */}
          <div className="rounded-xl p-4 mb-4" style={{ background: theme.bg3 }}>
            <div className="text-[10px] font-medium uppercase tracking-wider mb-3" style={{ color: theme.textMuted }}>Revenue Overview</div>
            <div className="flex items-end gap-1 h-20">
              {[35, 55, 40, 70, 50, 80, 65, 85, 60, 95, 75, 100].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm transition-all duration-500" style={{ height: mounted ? `${h}%` : '0%', background: i === 11 ? theme.accent : `rgba(0, 212, 170, ${0.15 + h / 500})` }} />
              ))}
            </div>
          </div>

          {/* Recent */}
          <div className="rounded-xl overflow-hidden" style={{ background: theme.bg3 }}>
            {[
              { name: 'Acme Corp', amount: '$4,200', status: 'Paid' },
              { name: 'TechFlow', amount: '$2,850', status: 'Pending' },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: i === 0 ? `1px solid ${theme.glassBorder}` : 'none' }}>
                <span className="text-sm text-white">{row.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white">{row.amount}</span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: row.status === 'Paid' ? 'rgba(0, 212, 170, 0.15)' : 'rgba(251, 191, 36, 0.15)', color: row.status === 'Paid' ? theme.accent : '#FBBF24' }}>{row.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Feature Card ────────────────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, title, desc, color = theme.accent, gradient }: { icon: any; title: string; desc: string; color?: string; gradient?: string }) => (
  <GlassCard className="group p-6 hover:scale-[1.02] transition-transform duration-300">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
    <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>{desc}</p>
  </GlassCard>
);

// ─── Testimonial Card ────────────────────────────────────────────────────────
const TestimonialCard = ({ quote, author, role, avatar }: { quote: string; author: string; role: string; avatar: string }) => (
  <GlassCard className="p-6">
    <Quote className="w-8 h-8 mb-4" style={{ color: theme.accent, opacity: 0.3 }} />
    <p className="text-sm leading-relaxed mb-6" style={{ color: theme.textSecondary }}>"{quote}"</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: theme.gradientAccent, color: '#000' }}>{avatar}</div>
      <div>
        <div className="text-sm font-medium text-white">{author}</div>
        <div className="text-xs" style={{ color: theme.textMuted }}>{role}</div>
      </div>
    </div>
  </GlassCard>
);

// ─── Pricing Card ────────────────────────────────────────────────────────────
const PricingCard = ({ name, price, period, desc, features, highlighted, cta }: { name: string; price: string; period: string; desc: string; features: string[]; highlighted?: boolean; cta: string }) => (
  <div className={`relative rounded-2xl p-7 transition-all duration-300 ${highlighted ? 'scale-105' : 'hover:scale-[1.02]'}`} style={{ background: highlighted ? 'linear-gradient(180deg, rgba(0,212,170,0.08) 0%, rgba(0,212,170,0.02) 100%)' : theme.glass, border: highlighted ? `1px solid ${theme.accent}40` : `1px solid ${theme.glassBorder}`, boxShadow: highlighted ? `0 20px 40px ${theme.accentGlow}` : undefined }}>
    {highlighted && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold" style={{ background: theme.gradientAccent, color: '#000' }}>Most Popular</div>
    )}
    <div className="mb-6">
      <div className="text-sm font-medium mb-2" style={{ color: highlighted ? theme.accent : theme.textMuted }}>{name}</div>
      <div className="flex items-baseline gap-1">
        <div className="text-4xl font-bold text-white">{price}</div>
        <div className="text-sm" style={{ color: theme.textMuted }}>/ {period}</div>
      </div>
      <div className="text-xs mt-2" style={{ color: theme.textSecondary }}>{desc}</div>
    </div>
    <Link href="/auth/signup" className={`block w-full text-center py-3 rounded-full text-sm font-medium mb-6 transition-all ${highlighted ? '' : 'hover:bg-white/5'}`} style={{ background: highlighted ? theme.gradientAccent : 'transparent', color: highlighted ? '#000' : 'white', border: highlighted ? 'none' : `1px solid ${theme.glassBorder}` }}>
      {cta}
    </Link>
    <ul className="space-y-3">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-3 text-sm">
          <Check className="w-4 h-4" style={{ color: theme.accent }} />
          <span style={{ color: theme.textSecondary }}>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

// ─── Page ────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: theme.bg0 }}>
      <NoiseOverlay />
      <GradientOrbs />

      {/* ── NAVIGATION ── */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style={{ background: scrollY > 50 ? 'rgba(0,0,0,0.8)' : 'transparent', backdropFilter: scrollY > 50 ? 'blur(20px)' : 'none', borderBottom: scrollY > 50 ? `1px solid ${theme.glassBorder}` : 'none' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ background: theme.gradientAccent, boxShadow: `0 4px 12px ${theme.accentGlow}` }}>
                <FileText className="w-4 h-4 text-black" />
              </div>
              <span className="text-base font-semibold tracking-tight text-white">SmartInvoice</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {['Features', 'Pricing', 'FAQ'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-2 text-sm font-medium rounded-full transition-colors" style={{ color: theme.textSecondary }}>{item}</a>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/login" className="text-sm font-medium px-4 py-2 transition-colors" style={{ color: theme.textSecondary }}>Sign in</Link>
              <PremiumButton href="/auth/signup" variant="primary" size="sm">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </PremiumButton>
            </div>

            {/* Mobile menu */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-5 h-5" style={{ color: theme.textSecondary }} />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t px-4 py-4 space-y-1" style={{ borderColor: theme.glassBorder, background: theme.bg1 }}>
            {['Features', 'Pricing', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-medium rounded-xl" style={{ color: theme.textSecondary }}>{item}</a>
            ))}
            <div className="pt-3 space-y-2">
              <Link href="/auth/login" className="block text-center py-3 text-sm font-medium rounded-full" style={{ color: theme.textSecondary }}>Sign in</Link>
              <Link href="/auth/signup" className="block text-center py-3 text-sm font-medium rounded-full" style={{ background: theme.gradientAccent, color: '#000' }}>Get Started</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: theme.bg3, border: `1px solid ${theme.glassBorder}` }}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: theme.accent }} />
            <span className="text-xs font-medium" style={{ color: theme.accent }}>Introducing AI-powered invoicing</span>
            <ChevronRight className="w-3.5 h-3.5" style={{ color: theme.textMuted }} />
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
            <span className="text-white">Invoice smarter.</span>
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: theme.gradientAccent }}>Get paid faster.</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10" style={{ color: theme.textSecondary }}>
            The premium invoicing platform for professionals. Create stunning invoices in seconds with AI, track payments effortlessly, and get paid 40% faster.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <PremiumButton href="/auth/signup" variant="primary" size="lg">
              Start free today
              <ArrowRight className="w-4 h-4" />
            </PremiumButton>
            <PremiumButton href="/auth/login" variant="secondary" size="lg">
              <Play className="w-4 h-4" style={{ color: theme.accent }} />
              Watch demo
            </PremiumButton>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-16">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[theme.accent, '#00E5BB', '#00F5CC', '#00D4AA'].map((c, i) => (
                  <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold border-2" style={{ background: c, borderColor: theme.bg0, color: '#000' }}>
                    {['AB', 'CD', 'EF', 'GH'][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm" style={{ color: theme.textSecondary }}>Trusted by 10,000+ businesses</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4" fill={theme.gold} style={{ color: theme.gold }} />)}
              <span className="text-sm ml-1" style={{ color: theme.textSecondary }}>4.9/5 from 2,000+ reviews</span>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute -inset-4 rounded-3xl opacity-50" style={{ background: `radial-gradient(ellipse at center, ${theme.accentGlow} 0%, transparent 70%)` }} />
            <DashboardMock />
          </div>
        </div>
      </section>

      {/* ── BRANDS ── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs font-medium uppercase tracking-widest mb-8" style={{ color: theme.textMuted }}>Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {['Acme', 'Quantum', 'Nexus', 'Vertex', 'Aurora', 'Cipher'].map(brand => (
              <div key={brand} className="text-lg font-semibold transition-colors duration-300" style={{ color: theme.textMuted }}>{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Features</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-white">
              Everything you need.<br />
              <span style={{ color: theme.accent }}>Nothing you don't.</span>
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: theme.textSecondary }}>
              Powerful features designed for professionals who value their time.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            <GlassCard className="group p-8 hover:scale-[1.01] transition-all duration-300" glow>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${theme.accent}20, ${theme.accent}05)`, border: `1px solid ${theme.accent}30` }}>
                <Sparkles className="w-6 h-6" style={{ color: theme.accent }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Invoice Generation</h3>
              <p className="text-base leading-relaxed mb-5" style={{ color: theme.textSecondary }}>
                Describe your work in natural language. Our AI creates professional invoices with perfect line items, descriptions, and pricing in seconds.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Natural Language', 'Smart Pricing', 'Instant Draft'].map(tag => (
                  <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: theme.bg3, color: theme.textMuted }}>{tag}</span>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="group p-8 hover:scale-[1.01] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: `linear-gradient(135deg, ${theme.gold}20, ${theme.gold}05)`, border: `1px solid ${theme.gold}30` }}>
                <Zap className="w-6 h-6" style={{ color: theme.gold }} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant Payments</h3>
              <p className="text-base leading-relaxed mb-5" style={{ color: theme.textSecondary }}>
                Embedded payment links let clients pay instantly. Support for Stripe, Razorpay, UPI, and bank transfers.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Stripe', 'UPI', 'Bank Transfer'].map(tag => (
                  <span key={tag} className="text-xs font-medium px-3 py-1.5 rounded-full" style={{ background: theme.bg3, color: theme.textMuted }}>{tag}</span>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <FeatureCard icon={BarChart3} title="Analytics" desc="Real-time revenue insights, cash flow forecasts, and client profitability metrics." color={theme.accent} />
            <FeatureCard icon={Clock} title="Auto Reminders" desc="Scheduled payment reminders that run automatically, reducing late payments by 60%." color="#FBBF24" />
            <FeatureCard icon={Globe} title="Multi-currency" desc="Bill clients in 50+ currencies with live exchange rates and automatic conversion." color="#A78BFA" />
            <FeatureCard icon={Shield} title="Bank Security" desc="SOC 2 Type II compliant, end-to-end encryption, GDPR ready." color={theme.accent} />
            <FeatureCard icon={Users} title="Client Portal" desc="White-label portal for clients to view and pay invoices." color="#F472B6" />
            <FeatureCard icon={Repeat} title="Recurring Billing" desc="Set once, collect forever. Perfect for retainers." color="#38BDF8" />
            <FeatureCard icon={Download} title="PDF Export" desc="Pixel-perfect PDFs ready for print or email." color={theme.gold} />
            <FeatureCard icon={Activity} title="Real-time Tracking" desc="Know when invoices are viewed, downloaded, paid." color={theme.accent} />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6" style={{ background: theme.bg2 }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '$2.4B+', label: 'Invoices processed', icon: DollarSign },
              { value: '10,000+', label: 'Active users', icon: Users },
              { value: '40%', label: 'Faster payments', icon: TrendingUp },
              { value: '99.99%', label: 'Uptime SLA', icon: Activity },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <Icon className="w-6 h-6 mx-auto mb-3" style={{ color: theme.accent }} />
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{value}</div>
                <div className="text-xs font-medium uppercase tracking-wider" style={{ color: theme.textMuted }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Testimonials</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
              Loved by <span style={{ color: theme.accent }}>10,000+</span> professionals
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <TestimonialCard quote="SmartInvoice transformed my billing. What took hours now takes seconds. Clients pay faster than ever." author="Sarah Chen" role="Freelance Designer" avatar="SC" />
            <TestimonialCard quote="The AI invoice generation is incredible. Describe your work and everything fills itself." author="Michael Park" role="Agency Founder" avatar="MP" />
            <TestimonialCard quote="Best invoicing tool I've used. The templates are stunning and the UX is flawless." author="Emma Wilson" role="Tech Consultant" avatar="EW" />
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 text-white">
              Simple, transparent pricing
            </h2>
            <p className="text-lg" style={{ color: theme.textSecondary }}>Start free. Scale when you're ready.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 items-start">
            <PricingCard name="Free" price="$0" period="forever" desc="Perfect for getting started" features={['Unlimited invoices', '3 clients', '3 templates', 'PDF export']} cta="Get started" />
            <PricingCard name="Pro" price="₹299" period="month" desc="For growing businesses" features={['Everything in Free', 'Unlimited clients', 'All 12 templates', 'Payment links', 'Analytics', 'Auto reminders']} highlighted cta="Start trial" />
            <PricingCard name="Business" price="₹999" period="month" desc="For scaling teams" features={['Everything in Pro', 'Team accounts', 'Custom branding', 'Client portal', 'API access', 'Priority support']} cta="Contact sales" />
          </div>

          <div className="text-center mt-8">
            <p className="text-sm" style={{ color: theme.textMuted }}>No credit card required · 14-day money-back guarantee · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6" style={{ background: theme.bg2 }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="text-4xl font-bold tracking-tight text-white">Questions & Answers</h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Is SmartInvoice really free?', a: 'Yes. Our free plan includes unlimited invoices for up to 3 clients. No credit card required, no time limits.' },
              { q: 'How does AI invoice generation work?', a: 'Simply describe your work in plain language. Our AI parses the description, creates line items, calculates totals, and generates a professional invoice instantly.' },
              { q: 'What payment methods do you support?', a: 'We support Stripe (cards, Apple Pay, Google Pay), Razorpay (UPI, wallets, net banking), and direct bank transfers. Clients get instant payment options.' },
              { q: 'Is my financial data secure?', a: 'Absolutely. We are SOC 2 Type II compliant, use end-to-end encryption, and never store payment card data directly (handled by PCI-compliant Stripe).' },
              { q: 'Can I import existing clients?', a: 'Yes. Import clients via CSV or manually add them. We support tax IDs, multiple addresses, and custom fields.' },
            ].map((item, i) => (
              <details key={i} className="group rounded-2xl overflow-hidden" style={{ background: theme.bg3, border: `1px solid ${theme.glassBorder}` }}>
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none">
                  <span className="text-base font-medium text-white pr-4">{item.q}</span>
                  <ChevronDown className="w-5 h-5 shrink-0 transition-transform duration-300 group-open:rotate-180" style={{ color: theme.textMuted }} />
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard className="p-12 sm:p-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
              Ready to transform your billing?
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: theme.textSecondary }}>
              Join 10,000+ professionals getting paid faster with SmartInvoice.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <PremiumButton href="/auth/signup" variant="primary" size="lg">
                Start free today
                <ArrowRight className="w-4 h-4" />
              </PremiumButton>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <span className="flex items-center gap-2 text-sm" style={{ color: theme.textMuted }}><Check className="w-4 h-4" style={{ color: theme.accent }} /> Free forever plan</span>
              <span className="flex items-center gap-2 text-sm" style={{ color: theme.textMuted }}><Lock className="w-4 h-4" style={{ color: theme.accent }} /> No card required</span>
              <span className="flex items-center gap-2 text-sm" style={{ color: theme.textMuted }}><BadgeCheck className="w-4 h-4" style={{ color: theme.accent }} /> GDPR compliant</span>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6" style={{ borderTop: `1px solid ${theme.glassBorder}` }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: theme.gradientAccent }}>
                  <FileText className="w-4 h-4 text-black" />
                </div>
                <span className="font-semibold text-white">SmartInvoice</span>
              </Link>
              <p className="text-sm" style={{ color: theme.textMuted }}>Premium invoicing for modern professionals.</p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Templates', 'Pricing', 'Changelog'] },
              { title: 'Resources', links: ['Documentation', 'API', 'Blog', 'Support'] },
              { title: 'Company', links: ['About', 'Careers', 'Privacy', 'Terms'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-xs font-semibold uppercase tracking-widest mb-4 text-white">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm transition-colors" style={{ color: theme.textMuted }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4" style={{ borderTop: `1px solid ${theme.glassBorder}` }}>
            <p className="text-sm" style={{ color: theme.textMuted }}>© 2025 SmartInvoice. All rights reserved.</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: theme.accent }} />
              <span className="text-xs" style={{ color: theme.textMuted }}>All systems operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
