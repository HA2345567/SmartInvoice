'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, CircleCheck as CheckCircle, Sparkles, Zap, Shield, ChartBar as BarChart3, Star, Award, TrendingUp, DollarSign, Users, Clock, Globe, ChevronDown, ChevronRight, Play, Check, X, Minus, Menu, Bell, Search, Mail, CreditCard, ChartPie as PieChart, Lock, Repeat, Send, Download, Eye, Layers, Activity, Target, Briefcase, Building, MessageSquare, Phone, Twitter, Linkedin, Github, Headphones, CirclePlay as PlayCircle } from 'lucide-react';

// ─── Spotify Design System Tokens ─────────────────────────────────────────────
const colors = {
  // Primary
  spotifyGreen: '#1ed760',
  spotifyGreenHover: '#1db954',
  spotifyGreenBorder: '#169c46',
  // Backgrounds
  nearBlack: '#121212',
  darkSurface: '#181818',
  midDark: '#1f1f1f',
  darkCard: '#252525',
  midCard: '#272727',
  // Text
  white: '#ffffff',
  silver: '#b3b3b3',
  nearWhite: '#cbcbcb',
  // Semantic
  negativeRed: '#f3727f',
  warningOrange: '#ffa42b',
  announcementBlue: '#539df5',
  // Borders
  borderGray: '#4d4d4d',
  lightBorder: '#7c7c7c',
};

// ─── Tiny helpers ────────────────────────────────────────────────────────────
const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: 'rgba(30,215,96,0.15)', color: colors.spotifyGreen, letterSpacing: '1.4px' }}>
    {children}
  </span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-center mb-4">
    <Pill>{children}</Pill>
  </div>
);

const SectionHeading = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight ${className}`} style={{ fontFamily: 'Circular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
    {children}
  </h2>
);

const SectionSub = ({ children }: { children: React.ReactNode }) => (
  <p className="text-base max-w-xl mx-auto leading-relaxed" style={{ color: colors.silver }}>{children}</p>
);

// ─── Mini Dashboard Mock (Spotify Style) ──────────────────────────────────────
const DashboardMock = () => (
  <div className="relative w-full rounded-lg overflow-hidden" style={{ background: colors.darkSurface, boxShadow: 'rgba(0,0,0,0.5) 0px 8px 24px' }}>
    {/* Title bar */}
    <div className="flex items-center gap-2 px-4 py-3" style={{ background: colors.nearBlack, borderBottom: `1px solid ${colors.borderGray}` }}>
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
      </div>
      <div className="flex-1 mx-4 rounded-full px-4 py-1.5 text-xs" style={{ background: colors.midDark, color: colors.silver }}>
        smartinvoice.app/dashboard
      </div>
    </div>
    {/* App layout */}
    <div className="flex h-64 sm:h-72">
      {/* Sidebar */}
      <div className="w-12 sm:w-48 flex flex-col py-4 px-2 sm:px-3 gap-1 shrink-0" style={{ background: colors.nearBlack }}>
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: colors.spotifyGreen }}>
            <FileText className="w-4 h-4" style={{ color: colors.nearBlack }} />
          </div>
          <span className="hidden sm:block text-sm font-bold text-white">SmartInvoice</span>
        </div>
        {[
          { icon: BarChart3, label: 'Dashboard', active: true },
          { icon: FileText, label: 'Invoices', active: false },
          { icon: Users, label: 'Clients', active: false },
          { icon: DollarSign, label: 'Payments', active: false },
          { icon: PieChart, label: 'Reports', active: false },
        ].map(({ icon: Icon, label, active }) => (
          <div key={label} className={`flex items-center gap-3 px-3 py-2 rounded text-sm font-bold transition-all ${active ? 'text-white' : ''}`} style={{ background: active ? colors.midDark : 'transparent', color: active ? colors.white : colors.silver }}>
            <Icon className="w-5 h-5 shrink-0" />
            <span className="hidden sm:block">{label}</span>
          </div>
        ))}
      </div>
      {/* Main */}
      <div className="flex-1 p-4 overflow-hidden" style={{ background: colors.darkSurface }}>
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Revenue', val: '$48,290', chg: '+12%', positive: true },
            { label: 'Invoices', val: '184', chg: '+8', positive: true },
            { label: 'Paid', val: '162', chg: '88%', positive: true },
            { label: 'Pending', val: '$6,420', chg: '3 due', positive: false },
          ].map(s => (
            <div key={s.label} className="rounded-lg p-3" style={{ background: colors.midDark }}>
              <div className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.silver }}>{s.label}</div>
              <div className="text-lg font-bold text-white">{s.val}</div>
              <div className="text-[11px] font-bold" style={{ color: s.positive ? colors.spotifyGreen : colors.warningOrange }}>{s.chg}</div>
            </div>
          ))}
        </div>
        {/* Chart bar */}
        <div className="rounded-lg p-4 mb-3" style={{ background: colors.midDark }}>
          <div className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: colors.silver }}>Monthly Revenue</div>
          <div className="flex items-end gap-1.5 h-16">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm transition-all" style={{ height: `${h}%`, background: i === 11 ? colors.spotifyGreen : `rgba(30,215,96,${0.2 + h / 400})` }} />
            ))}
          </div>
        </div>
        {/* Recent rows */}
        <div className="rounded-lg overflow-hidden" style={{ background: colors.midDark }}>
          {[
            { name: 'Acme Corp', amount: '$2,400', status: 'Paid', isPositive: true },
            { name: 'TechFlow Inc', amount: '$1,850', status: 'Pending', isPositive: false },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: i === 0 ? `1px solid ${colors.borderGray}` : 'none' }}>
              <div className="text-sm text-white font-medium">{r.name}</div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-white">{r.amount}</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: r.isPositive ? 'rgba(30,215,96,0.2)' : 'rgba(255,164,43,0.2)', color: r.isPositive ? colors.spotifyGreen : colors.warningOrange }}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Invoice Template Mock ───────────────────────────────────────────────────
const InvoiceMock = ({ style }: { style: 'stripe' | 'minimal' | 'green' }) => {
  const styles = {
    stripe: { bg: colors.midDark, accent: '#6366f1', label: 'Stripe Style' },
    minimal: { bg: colors.darkSurface, accent: colors.white, label: 'Minimal' },
    green: { bg: colors.darkCard, accent: colors.spotifyGreen, label: 'Spotify Style' },
  };
  const s = styles[style];
  return (
    <div className="rounded-lg overflow-hidden h-40 p-4 relative" style={{ background: s.bg, boxShadow: 'rgba(0,0,0,0.3) 0px 8px 8px' }}>
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: s.accent }} />
      <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: colors.silver }}>{s.label}</div>
      <div className="text-sm font-bold text-white mb-1">INVOICE #0042</div>
      <div className="text-[11px] mb-3" style={{ color: colors.silver }}>Due: Jan 31, 2025</div>
      <div className="space-y-1.5">
        {['Design Services', 'Development', 'Consulting'].map((item, i) => (
          <div key={i} className="flex justify-between text-[11px]">
            <span style={{ color: colors.silver }}>{item}</span>
            <span className="text-white font-medium">${(800 + i * 300).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full text-[11px] font-bold text-black" style={{ background: s.accent }}>
        $4,200
      </div>
    </div>
  );
};

// ─── FAQ Item ────────────────────────────────────────────────────────────────
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg overflow-hidden transition-all" style={{ background: colors.darkSurface, border: `1px solid ${open ? colors.spotifyGreen : colors.borderGray}` }}>
      <button className="w-full flex items-center justify-between px-5 py-4 text-left transition-all" onClick={() => setOpen(!open)}>
        <span className="text-white font-bold text-sm pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} style={{ color: colors.silver }} />
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm leading-relaxed" style={{ color: colors.silver }}>{a}</p>
        </div>
      )}
    </div>
  );
};

// ─── Play Button (Spotify Style) ─────────────────────────────────────────────
const PlayButton = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = { sm: 'w-10 h-10', md: 'w-12 h-12', lg: 'w-14 h-14' };
  const iconSizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105`} style={{ background: colors.spotifyGreen, boxShadow: 'rgba(0,0,0,0.3) 0px 8px 8px' }}>
      <Play className={`${iconSizes[size]}`} style={{ color: colors.nearBlack, marginLeft: '2px' }} fill={colors.nearBlack} />
    </div>
  );
};

// ─── Page ────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: colors.nearBlack }}>

      {/* ── NAVIGATION ── */}
      <header className="sticky top-0 z-50" style={{ background: colors.nearBlack, borderBottom: `1px solid ${colors.borderGray}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-105" style={{ background: colors.spotifyGreen, boxShadow: 'rgba(0,0,0,0.3) 0px 8px 8px' }}>
                <FileText className="w-4 h-4" style={{ color: colors.nearBlack }} strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold text-white tracking-tight">SmartInvoice</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {['Features', 'Templates', 'Pricing', 'FAQ'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-2 text-sm font-bold rounded-full transition-all hover:text-white" style={{ color: colors.silver }}>
                  {item}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/login" className="text-sm font-bold px-5 py-2 transition-colors rounded-full" style={{ color: colors.silver }}>
                Sign in
              </Link>
              <Link href="/auth/signup" className="flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 hover:scale-105" style={{ background: colors.spotifyGreen, color: colors.nearBlack, textTransform: 'uppercase', letterSpacing: '1.4px' }}>
                GET STARTED
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-full" style={{ color: colors.silver }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-4 space-y-1" style={{ background: colors.darkSurface }}>
            {['Features', 'Templates', 'Pricing', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm font-bold rounded-lg text-white transition-all" style={{ background: colors.midDark }}>
                {item}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <Link href="/auth/login" className="text-center py-3 text-sm font-bold rounded-full" style={{ color: colors.silver }}>Sign in</Link>
              <Link href="/auth/signup" className="text-center py-3 text-sm font-bold rounded-full" style={{ background: colors.spotifyGreen, color: colors.nearBlack }}>Get started free</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-16 pb-12 sm:pt-20 sm:pb-16 px-4 overflow-hidden">
        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-8" style={{ background: colors.midDark, color: colors.spotifyGreen, textTransform: 'uppercase', letterSpacing: '1.4px' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.spotifyGreen }} />
            New: AI-powered invoicing
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6" style={{ fontFamily: 'Circular, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            <span className="text-white">Invoice smarter.</span>
            <br />
            <span style={{ color: colors.spotifyGreen }}>Get paid faster.</span>
          </h1>

          <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10" style={{ color: colors.silver }}>
            The all-in-one invoicing platform for freelancers and businesses. Create, send, and track professional invoices with AI assistance.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link href="/auth/signup" className="group flex items-center gap-2 px-10 py-3.5 font-bold rounded-full text-sm transition-all duration-200 hover:scale-105" style={{ background: colors.spotifyGreen, color: colors.nearBlack, textTransform: 'uppercase', letterSpacing: '1.4px', boxShadow: 'rgba(0,0,0,0.3) 0px 8px 8px' }}>
              Start free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/auth/login" className="flex items-center gap-2 px-8 py-3.5 font-bold rounded-full text-sm transition-all" style={{ background: 'transparent', color: colors.white, border: `1px solid ${colors.lightBorder}` }}>
              <Play className="w-4 h-4" style={{ color: colors.spotifyGreen }} /> Watch demo
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm" style={{ color: colors.silver }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[colors.spotifyGreen, '#1db954', '#169c46', '#22c55e'].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[9px] font-bold" style={{ background: c, borderColor: colors.nearBlack, color: colors.nearBlack }}>
                    {['JS', 'MC', 'ER', 'AK'][i]}
                  </div>
                ))}
              </div>
              <span>10,000+ users</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5" style={{ color: '#ffc107' }} fill="#ffc107" />)}
              <span className="ml-1">4.9/5</span>
            </div>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="relative max-w-4xl mx-auto mt-12 px-4">
          <DashboardMock />
        </div>
      </section>

      {/* ── LOGO BAR ── */}
      <section className="py-10 px-4" style={{ background: colors.darkSurface, borderTop: `1px solid ${colors.borderGray}`, borderBottom: `1px solid ${colors.borderGray}` }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-[11px] uppercase tracking-widest mb-6 font-bold" style={{ color: colors.silver }}>Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
            {['Acme Corp', 'TechFlow', 'DesignHub', 'BuildCo', 'NovaSoft', 'CreativeX'].map(name => (
              <div key={name} className="text-sm font-bold tracking-wide transition-colors" style={{ color: colors.silver }}>
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Features</SectionLabel>
            <SectionHeading className="mb-4">
              Everything you need<br />to run your billing
            </SectionHeading>
            <SectionSub>
              From invoice creation to payment collection, SmartInvoice handles every step.
            </SectionSub>
          </div>

          {/* Feature highlight cards */}
          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            <div className="rounded-lg p-6 group transition-all hover:scale-[1.01]" style={{ background: colors.darkSurface, boxShadow: 'rgba(0,0,0,0.3) 0px 8px 8px' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(30,215,96,0.15)' }}>
                <Sparkles className="w-5 h-5" style={{ color: colors.spotifyGreen }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI-Powered Generation</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: colors.silver }}>
                Describe your work in plain English and our AI creates a professional invoice instantly. Smart line items, auto-pricing, and natural language input.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Natural Language', 'Smart Pricing', 'Auto-Complete'].map(tag => (
                  <span key={tag} className="text-[11px] px-3 py-1 rounded-full font-bold" style={{ background: colors.midDark, color: colors.silver }}>{tag}</span>
                ))}
              </div>
            </div>

            <div className="rounded-lg p-6 group transition-all hover:scale-[1.01]" style={{ background: colors.darkSurface, boxShadow: 'rgba(0,0,0,0.3) 0px 8px 8px' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(255,164,43,0.15)' }}>
                <Zap className="w-5 h-5" style={{ color: colors.warningOrange }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Payments</h3>
              <p className="text-sm leading-relaxed mb-4" style={{ color: colors.silver }}>
                Add a payment link to any invoice. Clients pay directly. Supports Stripe, Razorpay, bank transfers, and more.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Stripe', 'UPI / Razorpay', 'Bank Transfer'].map(tag => (
                  <span key={tag} className="text-[11px] px-3 py-1 rounded-full font-bold" style={{ background: colors.midDark, color: colors.silver }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: BarChart3, color: colors.spotifyGreen, title: 'Analytics', desc: 'Revenue trends, aging reports, and cash flow forecasts.' },
              { icon: Clock, color: colors.warningOrange, title: 'Auto-Reminders', desc: 'Schedule payment reminders automatically.' },
              { icon: Globe, color: colors.announcementBlue, title: 'Multi-Currency', desc: 'Bill clients in any currency with live rates.' },
              { icon: Shield, color: colors.spotifyGreen, title: 'Bank-Level Security', desc: 'SOC 2 compliant, end-to-end encrypted.' },
              { icon: Users, color: '#f472b6', title: 'Client Portal', desc: 'Branded portal for clients to view and pay.' },
              { icon: Repeat, color: '#a78bfa', title: 'Recurring Billing', desc: 'Set-and-forget recurring invoices.' },
              { icon: Download, color: '#14b8a6', title: 'PDF Export', desc: 'Download pixel-perfect PDFs for any invoice.' },
              { icon: Activity, color: colors.negativeRed, title: 'Real-time Tracking', desc: 'Know when invoices are opened and paid.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="rounded-lg p-4 transition-all group" style={{ background: colors.darkSurface }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: `${color}20` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{title}</h4>
                <p className="text-[11px] leading-relaxed" style={{ color: colors.silver }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 px-4" style={{ background: colors.darkSurface, borderTop: `1px solid ${colors.borderGray}`, borderBottom: `1px solid ${colors.borderGray}` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>How it works</SectionLabel>
            <SectionHeading className="mb-4">Up and running in minutes</SectionHeading>
            <SectionSub>Three simple steps to send your first professional invoice.</SectionSub>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-[16.67%] right-[16.67%] h-px" style={{ background: colors.midDark }} />

            <div className="grid lg:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  icon: Users,
                  title: 'Add your clients',
                  desc: 'Import existing clients or add new ones in seconds.',
                  detail: ['CSV import', 'Smart autofill', 'Tax ID storage'],
                },
                {
                  step: '02',
                  icon: FileText,
                  title: 'Create the invoice',
                  desc: 'Pick a template and let AI fill everything.',
                  detail: ['12 templates', 'AI generation', 'Tax calculator'],
                },
                {
                  step: '03',
                  icon: Send,
                  title: 'Send & get paid',
                  desc: 'Email a payment link. Clients pay in one click.',
                  detail: ['One-click payment', 'Auto-receipts', 'Bank deposit'],
                },
              ].map(({ step, icon: Icon, title, desc, detail }) => (
                <div key={step} className="relative flex flex-col items-center text-center lg:items-start lg:text-left rounded-lg p-6" style={{ background: colors.midDark }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center relative z-10" style={{ background: colors.spotifyGreen }}>
                      <Icon className="w-5 h-5" style={{ color: colors.nearBlack }} />
                    </div>
                    <span className="text-4xl font-black" style={{ color: colors.darkCard }}>{step}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm mb-4" style={{ color: colors.silver }}>{desc}</p>
                  <ul className="space-y-2">
                    {detail.map(d => (
                      <li key={d} className="flex items-center gap-2 text-xs" style={{ color: colors.silver }}>
                        <Check className="w-3.5 h-3.5" style={{ color: colors.spotifyGreen }} />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section id="templates" className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Templates</SectionLabel>
            <SectionHeading className="mb-4">12 premium invoice styles</SectionHeading>
            <SectionSub>Inspired by the best. Every template is pixel-perfect and print-ready.</SectionSub>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <InvoiceMock style="green" />
            <InvoiceMock style="stripe" />
            <InvoiceMock style="minimal" />
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { name: 'Spotify Style', tags: ['Music', 'Dark'] },
              { name: 'Stripe Style', tags: ['SaaS', 'Modern'] },
              { name: 'Google Cloud', tags: ['Material'] },
              { name: 'Notion Doc', tags: ['Minimal'] },
              { name: 'Shopify Order', tags: ['E-commerce'] },
              { name: 'Apple Style', tags: ['Luxury'] },
            ].map(({ name, tags }) => (
              <div key={name} className="flex items-center justify-between px-4 py-3 rounded-lg transition-all" style={{ background: colors.darkSurface }}>
                <span className="text-sm font-medium text-white">{name}</span>
                <div className="flex gap-1">
                  {tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: colors.midDark, color: colors.silver }}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link href="/auth/signup" className="inline-flex items-center gap-2 text-sm font-bold transition-colors" style={{ color: colors.spotifyGreen }}>
              Browse all templates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section className="py-12 px-4" style={{ background: colors.darkSurface, borderTop: `1px solid ${colors.borderGray}`, borderBottom: `1px solid ${colors.borderGray}` }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { val: '$2.4B+', label: 'Invoices processed', icon: DollarSign },
              { val: '10,000+', label: 'Active businesses', icon: Building },
              { val: '40%', label: 'Faster payments', icon: TrendingUp },
              { val: '99.9%', label: 'Platform uptime', icon: Activity },
            ].map(({ val, label, icon: Icon }) => (
              <div key={label} className="text-center rounded-lg p-4" style={{ background: colors.midDark }}>
                <div className="flex justify-center mb-2">
                  <Icon className="w-5 h-5" style={{ color: colors.spotifyGreen }} />
                </div>
                <div className="text-2xl font-black text-white mb-1">{val}</div>
                <div className="text-[11px] uppercase tracking-wider font-bold" style={{ color: colors.silver }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Testimonials</SectionLabel>
            <SectionHeading className="mb-4">Loved by 10,000+ users</SectionHeading>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Sarah Johnson', role: 'Freelance Designer', text: '"SmartInvoice completely transformed my billing. I used to spend hours on invoices — now it takes 2 minutes. Clients pay 40% faster."' },
              { name: 'Michael Chen', role: 'Marketing Agency', text: '"The AI invoice generation is mind-blowing. I describe the project and it fills out everything perfectly."' },
              { name: 'Emma Rodriguez', role: 'Software Consultant', text: '"I\'ve tried every invoicing tool out there. SmartInvoice is the only one that actually feels premium."' },
            ].map(({ name, role, text }) => (
              <div key={name} className="rounded-lg p-5 transition-all" style={{ background: colors.darkSurface, boxShadow: 'rgba(0,0,0,0.3) 0px 8px 8px' }}>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5" style={{ color: '#ffc107' }} fill="#ffc107" />)}
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: colors.nearWhite }}>{text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: colors.spotifyGreen, color: colors.nearBlack }}>
                    {name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{name}</div>
                    <div className="text-[11px]" style={{ color: colors.silver }}>{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-16 sm:py-20 px-4" style={{ background: colors.darkSurface, borderTop: `1px solid ${colors.borderGray}` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Pricing</SectionLabel>
            <SectionHeading className="mb-4">Simple, transparent pricing</SectionHeading>
            <SectionSub>Start free. Upgrade when you're ready.</SectionSub>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 items-start">
            {/* Free */}
            <div className="rounded-lg p-6" style={{ background: colors.midDark }}>
              <div className="mb-5">
                <div className="text-sm font-bold mb-1" style={{ color: colors.silver }}>Free</div>
                <div className="text-3xl font-black text-white mb-1">$0</div>
                <div className="text-[11px]" style={{ color: colors.silver }}>Forever free</div>
              </div>
              <Link href="/auth/signup" className="block w-full text-center py-3 rounded-full text-sm font-bold mb-6 transition-all" style={{ border: `1px solid ${colors.lightBorder}`, color: colors.white, textTransform: 'uppercase', letterSpacing: '1.4px' }}>
                Get started
              </Link>
              <ul className="space-y-2.5">
                {[['Unlimited invoices', true], ['3 clients', true], ['3 templates', true], ['PDF export', false], ['Payment links', false], ['Analytics', false]].map(([feat, inc]) => (
                  <li key={feat as string} className="flex items-center gap-2 text-sm">
                    {inc ? <Check className="w-4 h-4" style={{ color: colors.spotifyGreen }} /> : <X className="w-4 h-4" style={{ color: colors.borderGray }} />}
                    <span className="font-medium" style={{ color: inc ? colors.white : colors.borderGray }}>{feat as string}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro */}
            <div className="rounded-lg p-6 relative" style={{ background: colors.nearBlack, border: `1px solid ${colors.spotifyGreen}`, boxShadow: 'rgba(0,0,0,0.5) 0px 8px 24px' }}>
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold" style={{ background: colors.spotifyGreen, color: colors.nearBlack, textTransform: 'uppercase' }}>Most popular</div>
              <div className="mb-5">
                <div className="text-sm font-bold mb-1" style={{ color: colors.spotifyGreen }}>Pro</div>
                <div className="flex items-baseline gap-1">
                  <div className="text-3xl font-black text-white">₹299</div>
                  <div className="text-sm" style={{ color: colors.silver }}>/month</div>
                </div>
              </div>
              <Link href="/auth/signup" className="block w-full text-center py-3 rounded-full text-sm font-bold mb-6 transition-all hover:scale-105" style={{ background: colors.spotifyGreen, color: colors.nearBlack, textTransform: 'uppercase', letterSpacing: '1.4px' }}>
                Start trial
              </Link>
              <ul className="space-y-2.5">
                {[['Unlimited invoices', true], ['Unlimited clients', true], ['All 12 templates', true], ['PDF export', true], ['Payment links', true], ['Analytics', true]].map(([feat, inc]) => (
                  <li key={feat as string} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4" style={{ color: colors.spotifyGreen }} />
                    <span className="font-medium text-white">{feat as string}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business */}
            <div className="rounded-lg p-6" style={{ background: colors.midDark }}>
              <div className="mb-5">
                <div className="text-sm font-bold mb-1" style={{ color: colors.silver }}>Business</div>
                <div className="flex items-baseline gap-1">
                  <div className="text-3xl font-black text-white">₹999</div>
                  <div className="text-sm" style={{ color: colors.silver }}>/month</div>
                </div>
              </div>
              <Link href="/auth/signup" className="block w-full text-center py-3 rounded-full text-sm font-bold mb-6 transition-all" style={{ border: `1px solid ${colors.lightBorder}`, color: colors.white, textTransform: 'uppercase', letterSpacing: '1.4px' }}>
                Contact sales
              </Link>
              <ul className="space-y-2.5">
                {[['Everything in Pro', true], ['Team accounts', true], ['Custom branding', true], ['Client portal', true], ['API access', true], ['Priority support', true]].map(([feat, inc]) => (
                  <li key={feat as string} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4" style={{ color: colors.spotifyGreen }} />
                    <span className="font-medium text-white">{feat as string}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-[11px]" style={{ color: colors.silver }}>
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" style={{ color: colors.spotifyGreen }} /> 14-day guarantee</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" style={{ color: colors.spotifyGreen }} /> No card required</span>
            <span className="flex items-center gap-1.5"><X className="w-3.5 h-3.5" style={{ color: colors.spotifyGreen }} /> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>FAQ</SectionLabel>
            <SectionHeading className="mb-4">Questions? Answers.</SectionHeading>
          </div>
          <div className="space-y-3">
            {[
              { q: 'Is SmartInvoice really free?', a: 'Yes. Our Free plan is genuinely free — no credit card required. Create unlimited invoices for up to 3 clients. Upgrade when you need more.' },
              { q: 'How does AI invoice generation work?', a: 'Describe your work in plain English. Our AI parses it, creates line items, calculates totals, and fills the invoice. Review and send.' },
              { q: 'What payment methods are supported?', a: 'Stripe (cards, Apple Pay, Google Pay), Razorpay (UPI, net banking), and manual bank transfer.' },
              { q: 'Can I customize my branding?', a: 'Pro and Business plans include logo upload. Business users get full sender domain customization.' },
              { q: 'Is my data secure?', a: 'SOC 2 Type II compliant, encrypted at rest and in transit. PCI compliance handled by Stripe. GDPR compliant.' },
            ].map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-16 px-4" style={{ background: colors.darkSurface, borderTop: `1px solid ${colors.borderGray}` }}>
        <div className="max-w-3xl mx-auto">
          <div className="rounded-lg p-8 sm:p-12 text-center relative overflow-hidden" style={{ background: colors.nearBlack, border: `1px solid ${colors.spotifyGreen}`, boxShadow: 'rgba(0,0,0,0.5) 0px 8px 24px' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32" style={{ background: 'radial-gradient(ellipse at center top, rgba(30,215,96,0.1) 0%, transparent 70%)' }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold mb-6" style={{ background: 'rgba(30,215,96,0.15)', color: colors.spotifyGreen, textTransform: 'uppercase', letterSpacing: '1.4px' }}>
                <Headphones className="w-3.5 h-3.5" /> Join 10,000+ professionals
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-4 leading-tight">
                Ready to get paid<br />what you're worth?
              </h2>
              <p className="text-sm mb-8" style={{ color: colors.silver }}>
                Start sending professional invoices today. Free forever, no credit card.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/auth/signup" className="flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold transition-all hover:scale-105" style={{ background: colors.spotifyGreen, color: colors.nearBlack, textTransform: 'uppercase', letterSpacing: '1.4px', boxShadow: 'rgba(0,0,0,0.3) 0px 8px 8px' }}>
                  Create free account
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-4 text-[11px]" style={{ color: colors.silver }}>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" style={{ color: colors.spotifyGreen }} /> Free forever</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" style={{ color: colors.spotifyGreen }} /> No card</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" style={{ color: colors.spotifyGreen }} /> Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12 px-4" style={{ background: colors.nearBlack, borderTop: `1px solid ${colors.borderGray}` }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: colors.spotifyGreen }}>
                  <FileText className="w-4 h-4" style={{ color: colors.nearBlack }} strokeWidth={2.5} />
                </div>
                <span className="text-base font-bold text-white">SmartInvoice</span>
              </Link>
              <p className="text-sm mb-5 max-w-xs" style={{ color: colors.silver }}>
                Professional invoice management for freelancers and businesses.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: Twitter, href: '#' },
                  { icon: Linkedin, href: '#' },
                  { icon: Github, href: '#' },
                ].map(({ icon: Icon, href }) => (
                  <a key={href} href={href} className="w-8 h-8 rounded-full flex items-center justify-center transition-all" style={{ background: colors.midDark, color: colors.silver }}>
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Templates', 'Pricing', 'Changelog'] },
              { title: 'Resources', links: ['Documentation', 'API', 'Blog', 'Support'] },
              { title: 'Company', links: ['About', 'Careers', 'Privacy', 'Terms'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-3 text-white">{title}</h4>
                <ul className="space-y-2">
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm transition-colors" style={{ color: colors.silver }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: `1px solid ${colors.borderGray}` }}>
            <p className="text-[11px]" style={{ color: colors.silver }}>© 2025 SmartInvoice. Made with love.</p>
            <div className="flex items-center gap-1 text-[11px]" style={{ color: colors.silver }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: colors.spotifyGreen }} />
              All systems operational
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
