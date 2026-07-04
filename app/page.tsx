'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, CircleCheck as CheckCircle, Sparkles, Zap, Shield, ChartBar as BarChart3, Star, Award, TrendingUp, DollarSign, Users, Clock, Globe, ChevronDown, ChevronRight, Play, Check, X, Minus, Menu, Bell, Search, Mail, CreditCard, ChartPie as PieChart, Lock, Repeat, Send, Download, Eye, Layers, Activity, Target, Briefcase, Building, MessageSquare, Phone, Twitter, Linkedin, Github } from 'lucide-react';

// ─── Tiny helpers ────────────────────────────────────────────────────────────
const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-widest">
    {children}
  </span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex justify-center mb-4">
    <Pill>{children}</Pill>
  </div>
);

const SectionHeading = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1] ${className}`}>
    {children}
  </h2>
);

const SectionSub = ({ children }: { children: React.ReactNode }) => (
  <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">{children}</p>
);

// ─── Mini Dashboard Mock ─────────────────────────────────────────────────────
const DashboardMock = () => (
  <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0d] shadow-2xl" style={{ boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)' }}>
    {/* Title bar */}
    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-black/40">
      <div className="w-3 h-3 rounded-full bg-red-500/70" />
      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
      <div className="w-3 h-3 rounded-full bg-green-500/70" />
      <div className="flex-1 mx-4 bg-white/5 rounded-md px-3 py-1 text-xs text-gray-500 border border-white/5">app.smartinvoice.com/dashboard</div>
    </div>
    {/* App layout */}
    <div className="flex h-72 sm:h-80">
      {/* Sidebar */}
      <div className="w-12 sm:w-44 border-r border-white/[0.06] bg-black/20 flex flex-col py-4 px-2 sm:px-3 gap-1 shrink-0">
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="hidden sm:block text-xs font-bold text-white">SmartInvoice</span>
        </div>
        {[
          { icon: BarChart3, label: 'Dashboard', active: true },
          { icon: FileText, label: 'Invoices', active: false },
          { icon: Users, label: 'Clients', active: false },
          { icon: DollarSign, label: 'Payments', active: false },
          { icon: PieChart, label: 'Reports', active: false },
        ].map(({ icon: Icon, label, active }) => (
          <div key={label} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all ${active ? 'bg-emerald-500/15 text-emerald-400' : 'text-gray-500'}`}>
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:block">{label}</span>
          </div>
        ))}
      </div>
      {/* Main */}
      <div className="flex-1 p-3 sm:p-4 overflow-hidden">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          {[
            { label: 'Revenue', val: '$48,290', chg: '+12%', color: 'text-green-400' },
            { label: 'Invoices', val: '184', chg: '+8', color: 'text-blue-400' },
            { label: 'Paid', val: '162', chg: '88%', color: 'text-emerald-400' },
            { label: 'Pending', val: '$6,420', chg: '3 due', color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-2">
              <div className="text-[10px] text-gray-500 mb-1">{s.label}</div>
              <div className="text-sm font-bold text-white">{s.val}</div>
              <div className={`text-[10px] ${s.color}`}>{s.chg}</div>
            </div>
          ))}
        </div>
        {/* Chart bar */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 mb-3">
          <div className="text-[10px] text-gray-500 mb-2">Monthly Revenue</div>
          <div className="flex items-end gap-1 h-14">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 11 ? '#10b981' : `rgba(16,185,129,${0.15 + h / 300})` }} />
            ))}
          </div>
        </div>
        {/* Recent rows */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
          {[
            { name: 'Acme Corp', amount: '$2,400', status: 'Paid', color: 'text-emerald-400 bg-emerald-500/10' },
            { name: 'TechFlow Inc', amount: '$1,850', status: 'Pending', color: 'text-yellow-400 bg-yellow-500/10' },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-1.5 border-b border-white/[0.04] last:border-0">
              <div className="text-xs text-gray-300">{r.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">{r.amount}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${r.color}`}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── Invoice Template Mock ───────────────────────────────────────────────────
const InvoiceMock = ({ style }: { style: 'stripe' | 'minimal' | 'bold' }) => {
  const styles = {
    stripe: { bg: 'from-violet-900/30 to-black', accent: 'bg-violet-500', label: 'Stripe Style' },
    minimal: { bg: 'from-gray-900/30 to-black', accent: 'bg-white', label: 'Minimal' },
    bold: { bg: 'from-emerald-900/30 to-black', accent: 'bg-emerald-500', label: 'Emerald Bold' },
  };
  const s = styles[style];
  return (
    <div className={`bg-gradient-to-br ${s.bg} border border-white/10 rounded-xl p-4 h-40 relative overflow-hidden`}>
      <div className={`absolute top-0 left-0 right-0 h-1 ${s.accent}`} />
      <div className="text-[10px] text-gray-500 mb-2 font-medium uppercase tracking-wider">{s.label}</div>
      <div className="text-sm font-bold text-white mb-1">INVOICE #0042</div>
      <div className="text-[10px] text-gray-400 mb-3">Due: Jan 31, 2025</div>
      <div className="space-y-1">
        {['Design Services', 'Development', 'Consulting'].map((item, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-[10px] text-gray-400">{item}</span>
            <span className="text-[10px] text-white">${(800 + i * 300).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className={`absolute bottom-3 right-3 px-2 py-1 rounded-lg ${s.accent} bg-opacity-20 text-[10px] font-bold text-white`}>
        $4,200
      </div>
    </div>
  );
};

// ─── FAQ Item ────────────────────────────────────────────────────────────────
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/[0.08] rounded-2xl overflow-hidden hover:border-emerald-500/20 transition-colors">
      <button className="w-full flex items-center justify-between px-6 py-5 text-left" onClick={() => setOpen(!open)}>
        <span className="text-white font-medium text-sm sm:text-base">{q}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 ml-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
};

// ─── Page ────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">

      {/* ── NAVIGATION ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg" style={{ boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
                <FileText className="w-4.5 h-4.5 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">SmartInvoice</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {['Features', 'Templates', 'Pricing', 'Testimonials', 'FAQ'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-150">
                  {item}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white px-4 py-2 transition-colors">
                Sign in
              </Link>
              <Link href="/auth/signup" className="flex items-center gap-2 text-sm font-semibold text-black bg-emerald-500 hover:bg-emerald-400 px-5 py-2 rounded-lg transition-all duration-200" style={{ boxShadow: '0 0 20px rgba(16,185,129,0.35)' }}>
                Get started free
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-black/95 backdrop-blur-xl px-4 py-4 space-y-1">
            {['Features', 'Templates', 'Pricing', 'Testimonials', 'FAQ'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                {item}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <Link href="/auth/login" className="text-center py-3 text-sm text-gray-300 border border-white/10 rounded-xl hover:bg-white/5 transition-all">Sign in</Link>
              <Link href="/auth/signup" className="text-center py-3 text-sm font-semibold text-black bg-emerald-500 rounded-xl">Get started free</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px]" style={{ background: 'radial-gradient(ellipse at center top, rgba(16,185,129,0.1) 0%, transparent 60%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[400px]" style={{ background: 'linear-gradient(to bottom, transparent, rgba(16,185,129,0.2), transparent)' }} />
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 text-emerald-400 text-sm font-medium mb-8" style={{ background: 'rgba(16,185,129,0.05)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            New: AI-powered invoice generation
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            <span className="text-white">Invoice smarter.</span>
            <br />
            <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Get paid faster.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
            The all-in-one invoicing platform for freelancers and businesses.
            Create, send, and track professional invoices with AI assistance.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14">
            <Link href="/auth/signup" className="group flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-base transition-all duration-200 w-full sm:w-auto justify-center" style={{ boxShadow: '0 0 40px rgba(16,185,129,0.3)' }}>
              Start for free — no card needed
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/auth/login" className="flex items-center gap-2 px-8 py-4 border border-white/10 text-white hover:border-white/20 hover:bg-white/5 rounded-xl text-base font-medium transition-all duration-200 w-full sm:w-auto justify-center">
              <Play className="w-4 h-4 text-emerald-400" /> Watch demo
            </Link>
          </div>

          {/* Social proof mini */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['#10b981', '#059669', '#34d399', '#6ee7b7'].map((c, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center text-[9px] font-bold text-black" style={{ background: c }}>
                    {['JS', 'MC', 'ER', 'AK'][i]}
                  </div>
                ))}
              </div>
              <span>Joined by 10,000+ professionals</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
              <span className="ml-1">4.9/5 rating</span>
            </div>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="relative max-w-4xl mx-auto mt-16 px-4">
          <div className="absolute -inset-4 rounded-3xl" style={{ background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />
          <DashboardMock />
        </div>
      </section>

      {/* ── LOGO BAR ── */}
      <section className="py-12 border-y border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-xs text-gray-600 uppercase tracking-widest mb-8 font-medium">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
            {['Acme Corp', 'TechFlow', 'DesignHub', 'BuildCo', 'NovaSoft', 'CreativeX'].map(name => (
              <div key={name} className="text-gray-600 font-semibold text-sm tracking-wide hover:text-gray-400 transition-colors cursor-default">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Features</SectionLabel>
            <SectionHeading className="mb-4">
              Everything you need to<br />run your billing
            </SectionHeading>
            <SectionSub>
              From invoice creation to payment collection, SmartInvoice handles every step of your billing workflow.
            </SectionSub>
          </div>

          {/* Feature highlight - large card */}
          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-emerald-950/30 to-black p-8 group hover:border-emerald-500/20 transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }} />
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-5">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI-Powered Generation</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Describe your work in plain English and our AI creates a professional invoice instantly. Smart line items, auto-pricing, and natural language input.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Natural Language', 'Smart Pricing', 'Auto-Complete'].map(tag => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">{tag}</span>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-blue-950/20 to-black p-8 group hover:border-blue-500/20 transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)' }} />
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center mb-5">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Instant Payments</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Add a payment link to any invoice. Clients pay directly — no back-and-forth. Supports Stripe, Razorpay, bank transfers, and more.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Stripe', 'UPI / Razorpay', 'Bank Transfer'].map(tag => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: BarChart3, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', title: 'Analytics', desc: 'Revenue trends, aging reports, P&L statements, and cash flow forecasts.' },
              { icon: Clock, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20', title: 'Auto-Reminders', desc: 'Schedule payment reminders and follow-ups automatically.' },
              { icon: Globe, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', title: 'Multi-Currency', desc: 'Bill clients in any currency with live exchange rates.' },
              { icon: Shield, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', title: 'Bank-Level Security', desc: 'SOC 2 compliant, end-to-end encrypted, GDPR ready.' },
              { icon: Users, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20', title: 'Client Portal', desc: 'Give clients a branded portal to view and pay invoices.' },
              { icon: Repeat, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', title: 'Recurring Billing', desc: 'Set-and-forget recurring invoices for retainer clients.' },
              { icon: Download, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20', title: 'PDF Export', desc: 'Download pixel-perfect PDFs for any invoice template.' },
              { icon: Activity, color: 'text-red-400 bg-red-500/10 border-red-500/20', title: 'Real-time Tracking', desc: 'Know when invoices are opened, viewed, and paid.' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200 group">
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1.5">{title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 sm:py-28 px-4 border-t border-white/[0.06]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>How it works</SectionLabel>
            <SectionHeading className="mb-4">Up and running in minutes</SectionHeading>
            <SectionSub>Three simple steps to send your first professional invoice.</SectionSub>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

            <div className="grid lg:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  icon: Users,
                  title: 'Add your clients',
                  desc: 'Import existing clients or add new ones in seconds. Store contacts, billing addresses, and preferred currencies.',
                  detail: ['CSV import', 'Smart autofill', 'Tax ID storage'],
                },
                {
                  step: '02',
                  icon: FileText,
                  title: 'Create the invoice',
                  desc: 'Pick a template, add line items, apply taxes. Or just describe your work and let AI fill everything.',
                  detail: ['12 premium templates', 'AI generation', 'Tax calculator'],
                },
                {
                  step: '03',
                  icon: Send,
                  title: 'Send & get paid',
                  desc: 'Email a payment link directly from the app. Clients pay in one click. You get notified instantly.',
                  detail: ['One-click payment', 'Auto-receipts', 'Bank deposit'],
                },
              ].map(({ step, icon: Icon, title, desc, detail }) => (
                <div key={step} className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-center relative z-10">
                      <Icon className="w-4.5 h-4.5 text-emerald-400" />
                    </div>
                    <span className="text-5xl font-black text-white/5 select-none">{step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-4">{desc}</p>
                  <ul className="space-y-1.5">
                    {detail.map(d => (
                      <li key={d} className="flex items-center gap-2 text-xs text-gray-500">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
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
      <section id="templates" className="py-20 sm:py-28 px-4 border-t border-white/[0.06]" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.04) 0%, transparent 60%)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Templates</SectionLabel>
            <SectionHeading className="mb-4">
              12 premium invoice styles
            </SectionHeading>
            <SectionSub>
              Inspired by Stripe, Google, Notion, Shopify, and more. Every template is pixel-perfect and print-ready.
            </SectionSub>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InvoiceMock style="stripe" />
            <InvoiceMock style="minimal" />
            <InvoiceMock style="bold" />
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-3">
            {[
              { name: 'Stripe Style', tags: ['SaaS', 'Modern'] },
              { name: 'Google Cloud', tags: ['Material', 'Clean'] },
              { name: 'Notion Doc', tags: ['Minimal', 'Docs'] },
              { name: 'Shopify Order', tags: ['E-commerce'] },
              { name: 'Salesforce CRM', tags: ['Enterprise'] },
              { name: 'Goldman Sachs', tags: ['Finance', 'Formal'] },
              { name: 'Apple Style', tags: ['Luxury', 'Minimal'] },
              { name: 'Microsoft 365', tags: ['Office', 'Clean'] },
              { name: 'McKinsey', tags: ['Consulting'] },
            ].map(({ name, tags }) => (
              <div key={name} className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all">
                <span className="text-sm text-gray-300 font-medium">{name}</span>
                <div className="flex gap-1">
                  {tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500">{t}</span>)}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/auth/signup" className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
              Browse all templates <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── METRICS ── */}
      <section className="py-16 sm:py-20 px-4 border-t border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { val: '$2.4B+', label: 'Invoices processed', icon: DollarSign },
              { val: '10,000+', label: 'Active businesses', icon: Building },
              { val: '40%', label: 'Faster payments avg.', icon: TrendingUp },
              { val: '99.9%', label: 'Platform uptime', icon: Activity },
            ].map(({ val, label, icon: Icon }) => (
              <div key={label} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-emerald-400" />
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">{val}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-20 sm:py-28 px-4 border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Testimonials</SectionLabel>
            <SectionHeading className="mb-4">Loved by freelancers<br />and businesses alike</SectionHeading>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Sarah Johnson', role: 'Freelance Designer', rating: 5, text: '"SmartInvoice completely transformed my billing. I used to spend hours on invoices — now it takes 2 minutes. Clients pay 40% faster since I started using payment links."' },
              { name: 'Michael Chen', role: 'Marketing Agency', rating: 5, text: '"The AI invoice generation is mind-blowing. I describe the project and it fills out everything perfectly. The analytics help me understand which clients are most profitable."' },
              { name: 'Emma Rodriguez', role: 'Software Consultant', rating: 5, text: '"I\'ve tried every invoicing tool out there. SmartInvoice is the only one that actually feels premium and has all the features I need. The templates look incredible."' },
              { name: 'James Wilson', role: 'Photographer', rating: 5, text: '"Getting paid was always a pain. Now I just send an invoice and clients click pay. The automated reminders have basically eliminated late payments entirely."' },
              { name: 'Priya Patel', role: 'UX Research Lead', rating: 5, text: '"The Notion-style template is exactly what my clients expect from a design-forward studio. Plus the recurring billing feature saves me 2 hours every month."' },
              { name: 'Alex Kim', role: 'Dev Agency Owner', rating: 5, text: '"We process $50k+ per month through SmartInvoice. The financial reports give us exactly the visibility we need. Support team is incredibly responsive too."' },
            ].map(({ name, role, rating, text }) => (
              <div key={name} className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-200">
                <div className="flex mb-4">
                  {[...Array(rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-5">{text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xs font-bold text-black shrink-0">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{name}</div>
                    <div className="text-xs text-gray-500">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 sm:py-28 px-4 border-t border-white/[0.06]" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.04) 0%, transparent 50%)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Pricing</SectionLabel>
            <SectionHeading className="mb-4">Transparent, simple pricing</SectionHeading>
            <SectionSub>Start free. Upgrade when you're ready. No hidden fees.</SectionSub>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 items-start">
            {/* Free */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 hover:border-white/[0.12] transition-all">
              <div className="mb-5">
                <div className="text-sm font-semibold text-gray-400 mb-1">Free</div>
                <div className="text-4xl font-black text-white mb-1">$0</div>
                <div className="text-xs text-gray-500">Forever free</div>
              </div>
              <Link href="/auth/signup" className="block w-full text-center py-3 rounded-xl border border-white/10 text-sm font-semibold text-white hover:bg-white/5 transition-all mb-6">
                Get started
              </Link>
              <ul className="space-y-3">
                {[
                  ['Unlimited invoices', true],
                  ['3 clients', true],
                  ['3 templates', true],
                  ['PDF export', true],
                  ['Payment links', false],
                  ['Analytics', false],
                  ['Auto-reminders', false],
                  ['Custom branding', false],
                ].map(([feat, inc]) => (
                  <li key={feat as string} className="flex items-center gap-3 text-sm">
                    {inc
                      ? <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      : <X className="w-4 h-4 text-gray-700 shrink-0" />}
                    <span className={inc ? 'text-gray-300' : 'text-gray-600'}>{feat as string}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro - featured */}
            <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 to-black p-7 relative" style={{ boxShadow: '0 0 60px rgba(16,185,129,0.08)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-emerald-500 text-black text-xs font-bold">Most popular</div>
              <div className="mb-5">
                <div className="text-sm font-semibold text-emerald-400 mb-1">Pro</div>
                <div className="flex items-baseline gap-1">
                  <div className="text-4xl font-black text-white">₹299</div>
                  <div className="text-gray-400 text-sm">/month</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">Billed monthly · Cancel anytime</div>
              </div>
              <Link href="/auth/signup" className="block w-full text-center py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-sm font-bold text-black transition-all mb-6" style={{ boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
                Start Pro trial
              </Link>
              <ul className="space-y-3">
                {[
                  ['Unlimited invoices', true],
                  ['Unlimited clients', true],
                  ['All 12 templates', true],
                  ['PDF export', true],
                  ['Payment links', true],
                  ['Advanced analytics', true],
                  ['Auto-reminders', true],
                  ['Custom branding', false],
                ].map(([feat, inc]) => (
                  <li key={feat as string} className="flex items-center gap-3 text-sm">
                    {inc
                      ? <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      : <X className="w-4 h-4 text-gray-700 shrink-0" />}
                    <span className={inc ? 'text-gray-300' : 'text-gray-600'}>{feat as string}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-7 hover:border-white/[0.12] transition-all">
              <div className="mb-5">
                <div className="text-sm font-semibold text-gray-400 mb-1">Business</div>
                <div className="flex items-baseline gap-1">
                  <div className="text-4xl font-black text-white">₹999</div>
                  <div className="text-gray-400 text-sm">/month</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">For growing teams</div>
              </div>
              <Link href="/auth/signup" className="block w-full text-center py-3 rounded-xl border border-white/10 text-sm font-semibold text-white hover:bg-white/5 transition-all mb-6">
                Contact sales
              </Link>
              <ul className="space-y-3">
                {[
                  ['Everything in Pro', true],
                  ['Team accounts', true],
                  ['Custom branding', true],
                  ['Client portal', true],
                  ['API access', true],
                  ['Priority support', true],
                  ['Dedicated CSM', true],
                  ['SLA guarantee', true],
                ].map(([feat, inc]) => (
                  <li key={feat as string} className="flex items-center gap-3 text-sm">
                    {inc
                      ? <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      : <X className="w-4 h-4 text-gray-700 shrink-0" />}
                    <span className={inc ? 'text-gray-300' : 'text-gray-600'}>{feat as string}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Money back */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-2"><Shield className="w-3.5 h-3.5 text-emerald-500" /> 14-day money-back guarantee</div>
            <div className="flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-emerald-500" /> No credit card required</div>
            <div className="flex items-center gap-2"><X className="w-3.5 h-3.5 text-emerald-500" /> Cancel anytime</div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-16 px-4 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-xl font-bold text-white mb-8">Why SmartInvoice vs. alternatives?</h3>
          <div className="rounded-2xl border border-white/[0.08] overflow-hidden">
            <div className="grid grid-cols-4 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-white/[0.03] border-b border-white/[0.06]">
              <div className="p-4">Feature</div>
              <div className="p-4 text-center text-emerald-400">SmartInvoice</div>
              <div className="p-4 text-center">FreshBooks</div>
              <div className="p-4 text-center">Wave</div>
            </div>
            {[
              ['AI Invoice Generation', true, false, false],
              ['12 Premium Templates', true, false, false],
              ['Free Plan Available', true, false, true],
              ['Real-time Tracking', true, true, false],
              ['Client Portal', true, true, false],
              ['Multi-currency', true, true, false],
              ['Auto Reminders', true, true, false],
              ['PDF Export', true, true, true],
            ].map(([feat, si, fb, wave]) => (
              <div key={feat as string} className="grid grid-cols-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
                <div className="p-4 text-sm text-gray-300">{feat as string}</div>
                {[si, fb, wave].map((v, i) => (
                  <div key={i} className="p-4 flex justify-center">
                    {v
                      ? <Check className="w-4 h-4 text-emerald-400" />
                      : <Minus className="w-4 h-4 text-gray-700" />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 sm:py-28 px-4 border-t border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <SectionLabel>FAQ</SectionLabel>
            <SectionHeading className="mb-4">Frequently asked questions</SectionHeading>
          </div>
          <div className="space-y-3">
            {[
              { q: 'Is SmartInvoice really free to start?', a: 'Yes. Our Free plan is genuinely free — no credit card required, no time limit. You can create unlimited invoices for up to 3 clients and access 3 professional templates. Upgrade when you need more.' },
              { q: 'How does the AI invoice generation work?', a: 'You describe what work you did in plain English — for example, "3 days of React development for Acme Corp at $800/day." Our AI parses the description, creates line items, calculates totals, and fills out the invoice. You review and send.' },
              { q: 'What payment methods do clients have?', a: 'SmartInvoice supports Stripe (card payments, Apple Pay, Google Pay), Razorpay (UPI, net banking, wallets), and manual bank transfer. You can enable or disable payment methods per invoice.' },
              { q: 'Can I use my own branding?', a: 'On the Pro and Business plans, you can upload your logo and it appears on all invoices. Business plan users can also customize the sender domain and client portal branding.' },
              { q: 'Is my financial data secure?', a: 'Absolutely. We\'re SOC 2 Type II compliant, all data is encrypted at rest and in transit, and we never store payment card data (handled by Stripe\'s PCI-compliant infrastructure). We\'re also fully GDPR compliant.' },
              { q: 'Can I migrate from another invoicing tool?', a: 'Yes. You can import clients via CSV and we have import guides for FreshBooks, QuickBooks, Wave, and Zoho. Historical invoices can be uploaded as PDFs for record-keeping.' },
              { q: 'Do you offer a refund?', a: 'We offer a 14-day money-back guarantee on all paid plans. If you\'re not happy for any reason, email us and we\'ll refund immediately — no questions asked.' },
            ].map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 sm:py-28 px-4 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-emerald-950/40 via-black to-black p-10 sm:p-16 text-center" style={{ boxShadow: '0 0 80px rgba(16,185,129,0.06)' }}>
            {/* BG effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]" style={{ background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.1) 0%, transparent 60%)' }} />
            <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)' }} />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold mb-6 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Join 10,000+ professionals
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
                Ready to get paid<br />what you're worth?
              </h2>
              <p className="text-gray-400 text-base sm:text-lg mb-10 max-w-xl mx-auto">
                Start sending professional invoices today. Free forever, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/auth/signup" className="flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-base transition-all w-full sm:w-auto justify-center" style={{ boxShadow: '0 0 40px rgba(16,185,129,0.4)' }}>
                  Create your free account
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/auth/login" className="px-8 py-4 border border-white/10 text-white hover:bg-white/5 rounded-xl text-base font-medium transition-all w-full sm:w-auto text-center">
                  Sign in
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-5 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Free forever plan</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> No credit card</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Cancel anytime</span>
                <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> GDPR compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.06] py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 sm:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-black" strokeWidth={2.5} />
                </div>
                <span className="text-base font-bold text-white">SmartInvoice</span>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-5">
                Professional invoice management for freelancers and businesses. Built for the modern web.
              </p>
              <div className="flex items-center gap-3">
                {[
                  { icon: Twitter, href: '#' },
                  { icon: Linkedin, href: '#' },
                  { icon: Github, href: '#' },
                ].map(({ icon: Icon, href }) => (
                  <a key={href} href={href} className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-white/20 transition-all">
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'Product', links: ['Features', 'Templates', 'Pricing', 'Changelog', 'Roadmap'] },
              { title: 'Resources', links: ['Documentation', 'API Reference', 'Blog', 'Status', 'Support'] },
              { title: 'Company', links: ['About', 'Careers', 'Privacy', 'Terms', 'Contact'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-xs font-semibold text-white uppercase tracking-widest mb-4">{title}</h4>
                <ul className="space-y-2.5">
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">© 2025 SmartInvoice. All rights reserved. Made by Harsh Bhardwaj.</p>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
