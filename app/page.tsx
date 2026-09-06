'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo, { LogoMarkOnly } from '@/components/Logo';
import {
  FileText,
  ArrowRight,
  Sparkles,
  Shield,
  Star,
  TrendingUp,
  Users,
  ChevronDown,
  Menu,
  X,
  Lock,
  Check,
  Activity,
  ArrowUpRight
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// AWESOMIC DESIGN SYSTEM — Editorial Zinc Grid with Confetti-Orange Punctuation
// ═══════════════════════════════════════════════════════════════════════════════

const awesomic = {
  // Palette
  obsidian: '#09090b',    // Primary CTA, hero headlines, dominant text
  graphite: '#18181b',    // Body text, nav text, badge text
  slate: '#27272a',       // Secondary headings, elevated dark card surfaces
  iron: '#3f3f46',        // Muted text, button labels on light surfaces
  steel: '#52525b',       // Icon strokes, supporting metadata
  fog: '#71717a',         // Helper text, tertiary labels
  ash: '#a1a1aa',         // Placeholder text, disabled labels
  mist: '#d4d4d8',        // Subtle borders, secondary card fills
  cloud: '#ececee',       // Primary border color across the system (1px hairline)
  paper: '#f4f4f5',       // Canvas background
  snow: '#ffffff',        // Elevated surfaces, card surfaces
  ember: '#ff5a00',       // Accent badges, highlight chips

  // Elevation
  darkBtnElevation:
    'inset 0 0.5px 0 0 rgba(255,255,255,0.5), inset 0 9px 14px -5px rgba(117,123,133,0.4), 0 0 0 1.5px rgb(44,46,52), 0 4px 6px 0 rgba(0,0,0,0.14)',
  cardBorder: '1px solid #ececee',
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS — Awesomic Geometry (36px cards, 14px buttons, 10000px pills)
// ═══════════════════════════════════════════════════════════════════════════════

// Primary Action Button (Dark Filled) / Ghost Action Button (White) / Pill
const ActionButton = ({
  children,
  href,
  variant = 'dark',
  size = 'md',
  icon,
  className = '',
  pill = false,
}: {
  children: React.ReactNode;
  href: string;
  variant?: 'dark' | 'ghost' | 'light' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
  pill?: boolean;
}) => {
  const sizes = {
    sm: 'px-4 py-2 text-xs font-medium',
    md: 'px-5 py-2.5 text-sm font-medium',
    lg: 'px-7 py-3.5 text-base font-medium',
  };

  const borderRadius = pill ? '9999px' : '14px';

  let customStyle: React.CSSProperties = {};

  if (variant === 'dark') {
    customStyle = {
      background: awesomic.obsidian,
      color: '#ffffff',
      border: '1.5px solid #2c2e34',
      boxShadow: awesomic.darkBtnElevation,
      borderRadius,
    };
  } else if (variant === 'ghost') {
    customStyle = {
      background: awesomic.snow,
      color: awesomic.iron,
      border: `1px solid ${awesomic.mist}`,
      borderRadius,
    };
  } else if (variant === 'orange') {
    customStyle = {
      background: awesomic.ember,
      color: '#ffffff',
      border: '1px solid #e04e00',
      boxShadow: '0 2px 4px rgba(255, 90, 0, 0.2)',
      borderRadius,
    };
  } else {
    customStyle = {
      background: '#fafafa',
      color: awesomic.graphite,
      border: `1px solid ${awesomic.cloud}`,
      borderRadius,
    };
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] ${sizes[size]} ${className}`}
      style={customStyle}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </Link>
  );
};

// Section Label with editorial tag styling
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center mb-4">
    <span
      className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-[12px]"
      style={{
        background: '#ffffff',
        border: `1px solid ${awesomic.cloud}`,
        color: awesomic.iron,
      }}
    >
      {children}
    </span>
  </div>
);

// FAQ Accordion Item (Clean light surface with hairline border)
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-[20px] transition-all duration-200"
      style={{
        background: awesomic.snow,
        border: `1px solid ${open ? awesomic.mist : awesomic.cloud}`,
      }}
    >
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span
          className="text-base font-semibold pr-4"
          style={{ color: awesomic.obsidian }}
        >
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: open ? awesomic.obsidian : awesomic.steel }}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 pt-1">
          <p
            className="text-sm leading-relaxed"
            style={{ color: awesomic.steel }}
          >
            {a}
          </p>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LANDING PAGE COMPONENT
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
    <div
      className="min-h-screen selection:bg-[#ff5a00] selection:text-white"
      style={{
        background: awesomic.paper,
        color: awesomic.graphite,
        fontFamily: "'DM Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ═══ NAVIGATION BAR ═══ */}
      <header
        className={`fixed left-1/2 z-50 transition-all duration-500 ease-out ${
          scrollY > 20
            ? 'top-4 w-[calc(100%-2rem)] max-w-5xl py-2'
            : 'top-6 w-[calc(100%-2rem)] max-w-6xl py-3'
        }`}
        style={{
          transform: 'translateX(-50%)',
        }}
      >
        <div
          className="w-full rounded-[9999px] px-6 py-2.5 transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${awesomic.cloud}`,
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div className="flex items-center justify-between h-11">
            {/* Logo */}
            <Link href="/" className="group flex items-center origin-left">
              <Logo variant="full" size="sm" theme="light" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {['Features', 'FAQ'].map(item => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="px-4 py-2 text-sm font-medium rounded-[9999px] transition-colors"
                  style={{ color: awesomic.iron }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = awesomic.obsidian;
                    e.currentTarget.style.background = '#f4f4f5';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = awesomic.iron;
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{ color: awesomic.iron }}
                onMouseEnter={e => (e.currentTarget.style.color = awesomic.obsidian)}
                onMouseLeave={e => (e.currentTarget.style.color = awesomic.iron)}
              >
                Sign In
              </Link>
              <ActionButton
                href="/dashboard/create"
                variant="dark"
                size="sm"
                pill
                icon={<Sparkles className="w-3.5 h-3.5 mr-0.5 text-[#ff5a00]" />}
              >
                <span>Create Free Invoice</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </ActionButton>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: '#ffffff',
                border: `1px solid ${awesomic.cloud}`,
                color: awesomic.obsidian,
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div
            className="md:hidden absolute top-[calc(100%+0.5rem)] left-0 right-0 p-5 rounded-[28px] space-y-2 animate-in fade-in slide-in-from-top-4 duration-300"
            style={{
              background: '#ffffff',
              border: `1px solid ${awesomic.cloud}`,
              boxShadow: '0 12px 36px -4px rgba(0, 0, 0, 0.08)',
            }}
          >
            {['Features', 'FAQ'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-sm font-semibold rounded-[14px] transition-colors"
                style={{
                  color: awesomic.graphite,
                  background: awesomic.paper,
                }}
              >
                {item}
              </a>
            ))}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-3 text-sm font-medium rounded-[14px] transition-colors"
                style={{
                  background: '#ffffff',
                  border: `1px solid ${awesomic.cloud}`,
                  color: awesomic.iron,
                }}
              >
                Sign In
              </Link>
              <Link
                href="/dashboard/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-3 text-sm font-medium rounded-[14px] transition-transform hover:scale-[1.01]"
                style={{
                  background: awesomic.obsidian,
                  color: '#ffffff',
                }}
              >
                Create Invoice
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subtle Orange Punctuation Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[12px] text-xs font-semibold mb-8"
            style={{
              background: '#ffffff',
              border: `1px solid ${awesomic.cloud}`,
              color: awesomic.iron,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: awesomic.ember }}
            />
            <span>Instant PDF download • No sign up required • 100% Free</span>
          </div>

          {/* Headline — Cosmica/DM Sans 56-64px Display Weight */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.12] mb-6"
            style={{ color: awesomic.obsidian }}
          >
            <span>Invoice smarter.</span>
            <br />
            <span style={{ color: awesomic.graphite }}>Get paid faster.</span>
          </h1>

          {/* Subtitle — Compact 16px Weight 400 */}
          <p
            className="text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-normal"
            style={{ color: awesomic.steel }}
          >
            Create and download stunning PDF invoices instantly as a guest. No credit card, password, or registration needed.
          </p>

          {/* CTAs — 14px radius Awesomic Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <ActionButton href="/dashboard/create" variant="dark" size="lg">
              <Sparkles className="w-4 h-4 text-[#ff5a00]" />
              <span>Create Free Invoice</span>
              <ArrowRight className="w-4 h-4" />
            </ActionButton>
            <ActionButton href="/auth/signup" variant="ghost" size="lg">
              <span>Create Account</span>
              <ArrowUpRight className="w-4 h-4" style={{ color: awesomic.steel }} />
            </ActionButton>
          </div>

          {/* Social Proof Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6" style={{ color: awesomic.steel }}>
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-2">
                {[awesomic.obsidian, '#27272a', '#3f3f46', '#52525b'].map((bg, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: bg, border: '2px solid #ffffff' }}
                  >
                    {['JS', 'MC', 'ER', 'AK'][i]}
                  </div>
                ))}
              </div>
              <span className="text-xs font-medium" style={{ color: awesomic.graphite }}>
                10,000+ professionals
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: awesomic.graphite }}>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-[#ff5a00] text-[#ff5a00]"
                  />
                ))}
              </div>
              <span className="ml-1">4.9/5</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DASHBOARD PREVIEW ═══ */}
      <section id="demo" className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-10">
            <SectionLabel>Dashboard Preview</SectionLabel>
            <h2
              className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3"
              style={{ color: awesomic.obsidian }}
            >
              A powerful, intuitive workspace
            </h2>
            <p
              className="text-sm max-w-md mx-auto leading-relaxed"
              style={{ color: awesomic.steel }}
            >
              Take a look at the comprehensive business overview and real-time tracking designed to get you paid faster.
            </p>
          </div>

          {/* Clean 36px Card with 1px Hairline Border */}
          <div
            className="relative rounded-[36px] overflow-hidden p-3 sm:p-4 transition-all duration-300 hover:scale-[1.005]"
            style={{
              background: awesomic.snow,
              border: `1px solid ${awesomic.cloud}`,
            }}
          >
            <img
              src="/dashboard-screenshot.png"
              alt="SmartInvoice Dashboard Preview"
              className="w-full h-auto block rounded-[26px]"
              style={{ border: `1px solid ${awesomic.cloud}` }}
            />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel>Features</SectionLabel>
            <h2
              className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3"
              style={{ color: awesomic.obsidian }}
            >
              Everything you need.<br />Nothing you don't.
            </h2>
            <p
              className="text-sm max-w-md mx-auto leading-relaxed"
              style={{ color: awesomic.steel }}
            >
              Powerful features designed for professionals who value their time.
            </p>
          </div>

          {/* Feature Highlights — Alternating White Cards and Inverted Dark Feature Card */}
          <div className="space-y-8">
            {/* Feature 1: Create Invoice (White Card) */}
            <div
              className="rounded-[36px] p-8 sm:p-12 transition-all duration-300"
              style={{
                background: awesomic.snow,
                border: `1px solid ${awesomic.cloud}`,
              }}
            >
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="relative rounded-[24px] overflow-hidden order-1">
                  <img
                    src="/features/create-invoice.png"
                    alt="Create New Invoice Dashboard"
                    className="w-full h-auto block rounded-[24px]"
                    style={{ border: `1px solid ${awesomic.cloud}` }}
                  />
                </div>
                <div className="space-y-4 order-2">
                  <span
                    className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[8px]"
                    style={{ background: awesomic.paper, color: awesomic.iron }}
                  >
                    Template Builder
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-semibold tracking-tight"
                    style={{ color: awesomic.obsidian }}
                  >
                    Create Professional Invoices
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: awesomic.steel }}
                  >
                    An intuitive invoice builder that lets you customize templates, choose modern themes, and customize visual appearance. Easily configure tax and discount rates with real-time dynamic total calculations.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2: Smart Reminders (Inverted Dark Feature Card) */}
            <div
              className="rounded-[36px] p-8 sm:p-12 transition-all duration-300"
              style={{
                background: awesomic.graphite,
                border: '1px solid #27272a',
                color: '#ffffff',
              }}
            >
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-4 order-2 lg:order-1">
                  <span
                    className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[8px]"
                    style={{ background: '#27272a', color: awesomic.ash }}
                  >
                    Automation
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                    Smart Reminders & Overdue Tracking
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: awesomic.ash }}>
                    Keep client relations professional while collecting payments faster. Our smart timing adjustments analyze invoice sizes and payment histories, scheduling automated escalation updates to recover unpaid balances.
                  </p>
                </div>
                <div className="relative rounded-[24px] overflow-hidden order-1 lg:order-2">
                  <img
                    src="/features/smart-reminders.png"
                    alt="Smart Reminders Dashboard"
                    className="w-full h-auto block rounded-[24px]"
                    style={{ border: '1px solid #3f3f46' }}
                  />
                </div>
              </div>
            </div>

            {/* Feature 3: Tax Center (White Card) */}
            <div
              className="rounded-[36px] p-8 sm:p-12 transition-all duration-300"
              style={{
                background: awesomic.snow,
                border: `1px solid ${awesomic.cloud}`,
              }}
            >
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="relative rounded-[24px] overflow-hidden order-1">
                  <img
                    src="/features/tax-center.png"
                    alt="Tax Center Dashboard"
                    className="w-full h-auto block rounded-[24px]"
                    style={{ border: `1px solid ${awesomic.cloud}` }}
                  />
                </div>
                <div className="space-y-4 order-2">
                  <span
                    className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[8px]"
                    style={{ background: awesomic.paper, color: awesomic.iron }}
                  >
                    Financial Intelligence
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-semibold tracking-tight"
                    style={{ color: awesomic.obsidian }}
                  >
                    Automated GST & Tax Reporting
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: awesomic.steel }}
                  >
                    Real-time GST/VAT liability calculation and tax rate breakdowns. View total revenues, taxable sales, and exempt sales for any custom period. Instantly export reports to CSV for stress-free accounting.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4: Invoices Directory (White Card) */}
            <div
              className="rounded-[36px] p-8 sm:p-12 transition-all duration-300"
              style={{
                background: awesomic.snow,
                border: `1px solid ${awesomic.cloud}`,
              }}
            >
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-4 order-2 lg:order-1">
                  <span
                    className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[8px]"
                    style={{ background: awesomic.paper, color: awesomic.iron }}
                  >
                    Pipeline Management
                  </span>
                  <h3
                    className="text-2xl sm:text-3xl font-semibold tracking-tight"
                    style={{ color: awesomic.obsidian }}
                  >
                    Centralized Invoice & PDF Directory
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: awesomic.steel }}
                  >
                    Track, organize, and manage your entire invoicing pipeline. Filter by status, search by client details or invoice numbers, export directories to CSV, and run bulk PDF downloads.
                  </p>
                </div>
                <div className="relative rounded-[24px] overflow-hidden order-1 lg:order-2">
                  <img
                    src="/features/invoices-list.png"
                    alt="Invoices Directory Dashboard"
                    className="w-full h-auto block rounded-[24px]"
                    style={{ border: `1px solid ${awesomic.cloud}` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BLOCK ═══ */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-[36px] p-8 sm:p-12"
            style={{
              background: awesomic.snow,
              border: `1px solid ${awesomic.cloud}`,
            }}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { val: '1,000+', label: 'Invoices processed', icon: FileText },
                { val: '200+', label: 'Active users', icon: Users },
                { val: '40%', label: 'Faster payments', icon: TrendingUp },
                { val: '99.99%', label: 'Uptime SLA', icon: Activity },
              ].map(({ val, label, icon: Icon }) => (
                <div key={label} className="text-left border-l pl-5" style={{ borderColor: awesomic.cloud }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4" style={{ color: awesomic.steel }} />
                  </div>
                  <div
                    className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-1"
                    style={{ color: awesomic.obsidian }}
                  >
                    {val}
                  </div>
                  <div
                    className="text-sm font-normal"
                    style={{ color: awesomic.steel }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FAQ SECTION ═══ */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>FAQ</SectionLabel>
            <h2
              className="text-3xl sm:text-4xl font-semibold tracking-tight"
              style={{ color: awesomic.obsidian }}
            >
              Questions? Answers.
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Is SmartInvoice really free?',
                a: 'Yes. Our free plan includes unlimited invoices for up to 3 clients. No credit card required, no time limits.',
              },
              {
                q: 'How does AI invoice generation work?',
                a: 'Simply describe your work in plain language. Our AI parses the description, creates line items, calculates totals, and generates a professional invoice instantly.',
              },
              {
                q: 'What payment methods do you support?',
                a: 'We support Stripe (cards, Apple Pay, Google Pay), Razorpay (UPI, wallets, net banking), and direct bank transfers.',
              },
              {
                q: 'Is my financial data secure?',
                a: 'Absolutely. SOC 2 Type II compliant, end-to-end encrypted, and we never store payment card data directly.',
              },
              {
                q: 'Can I import existing clients?',
                a: 'Yes. Import clients via CSV or manually add them. We support tax IDs and custom fields.',
              },
            ].map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA (Inverted Dark Feature Surface) ═══ */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div
            className="rounded-[36px] p-10 sm:p-16 relative overflow-hidden"
            style={{
              background: awesomic.obsidian,
              border: '1.5px solid #27272a',
              color: '#ffffff',
            }}
          >
            <div className="flex justify-center mb-6">
              <LogoMarkOnly size={56} theme="dark" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">
              Ready to transform your billing?
            </h2>
            <p
              className="text-base mb-8 max-w-md mx-auto font-normal"
              style={{ color: awesomic.ash }}
            >
              Join 10,000+ professionals getting paid faster with SmartInvoice.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <ActionButton
                href="/dashboard/create"
                variant="ghost"
                size="lg"
                pill
              >
                <span>Create Free Invoice Now</span>
                <ArrowRight className="w-4 h-4" />
              </ActionButton>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
              <span className="flex items-center gap-2 text-xs" style={{ color: awesomic.ash }}>
                <Check className="w-4 h-4" style={{ color: awesomic.ember }} /> Free forever
              </span>
              <span className="flex items-center gap-2 text-xs" style={{ color: awesomic.ash }}>
                <Lock className="w-4 h-4" style={{ color: awesomic.ember }} /> No card required
              </span>
              <span className="flex items-center gap-2 text-xs" style={{ color: awesomic.ash }}>
                <Shield className="w-4 h-4" style={{ color: awesomic.ember }} /> GDPR compliant
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer
        className="py-14 px-6"
        style={{
          borderTop: `1px solid ${awesomic.cloud}`,
          background: awesomic.paper,
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-12">
            <div className="col-span-2 sm:col-span-1">
              <Link href="/" className="mb-3 inline-block">
                <Logo variant="full" size="sm" theme="light" />
              </Link>
              <p
                className="text-xs leading-relaxed"
                style={{ color: awesomic.steel }}
              >
                Premium invoicing for modern professionals.
              </p>
            </div>
            {[
              { title: 'Product', links: ['Features', 'Templates', 'Security'] },
              { title: 'Resources', links: ['Documentation', 'API', 'Blog'] },
              { title: 'Company', links: ['About', 'Privacy', 'Terms'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4
                  className="text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ color: awesomic.obsidian }}
                >
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map(link => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors font-normal"
                        style={{ color: awesomic.steel }}
                        onMouseEnter={e => (e.currentTarget.style.color = awesomic.obsidian)}
                        onMouseLeave={e => (e.currentTarget.style.color = awesomic.steel)}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4"
            style={{ borderTop: `1px solid ${awesomic.cloud}` }}
          >
            <p className="text-xs" style={{ color: awesomic.steel }}>
              © 2025 SmartInvoice. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: '#22c55e' }}
              />
              <span className="text-xs font-medium" style={{ color: awesomic.steel }}>
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
