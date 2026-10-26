'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
    FileText,
    FileCheck,
    TrendingUp,
    CheckCircle,
    RefreshCw,
    DollarSign,
    AlertTriangle,
    Globe,
    Receipt,
    Clock,
    Wallet,
    FileSpreadsheet,
    Check,
    Search,
    ArrowRight,
    HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export type InvoiceType =
    | 'sales'
    | 'proforma'
    | 'interim'
    | 'final'
    | 'recurring'
    | 'credit-note'
    | 'past-due'
    | 'commercial'
    | 'tax'
    | 'timesheet'
    | 'retainer'
    | 'expense';

export type InvoiceCategory = 'all' | 'core' | 'projects' | 'compliance' | 'notices';

export interface InvoiceTypeOption {
    type: InvoiceType;
    label: string;
    badge: string;
    category: 'core' | 'projects' | 'compliance' | 'notices';
    icon: React.ElementType;
    description: string;
    tags: string[];
    color: string;
    bgColor: string;
    borderColor: string;
    glowColor: string;
    pillBg: string;
}

export const invoiceTypes: InvoiceTypeOption[] = [
    {
        type: 'sales',
        label: 'Sales Invoice',
        badge: 'Most Popular',
        category: 'core',
        icon: FileText,
        description: 'Universal standard bill for products, software licenses, and completed client services.',
        tags: ['Product Sales', 'Consulting'],
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/40',
        glowColor: 'rgba(16,185,129,0.2)',
        pillBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    },
    {
        type: 'tax',
        label: 'Tax Invoice (GST / VAT)',
        badge: 'Statutory Compliant',
        category: 'compliance',
        icon: Receipt,
        description: 'Statutory invoice tailored for VAT/GST registration, input tax credit (ITC), and audit checks.',
        tags: ['GST & VAT', 'B2B Audits'],
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/40',
        glowColor: 'rgba(34,197,94,0.2)',
        pillBg: 'bg-green-500/15 text-green-400 border-green-500/30'
    },
    {
        type: 'proforma',
        label: 'Proforma Invoice',
        badge: 'Preliminary Quote',
        category: 'core',
        icon: FileCheck,
        description: 'Pre-shipment quote showing committed pricing, specifications, and terms before delivery.',
        tags: ['Price Quotes', 'Customs Docs'],
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/40',
        glowColor: 'rgba(168,85,247,0.2)',
        pillBg: 'bg-purple-500/15 text-purple-400 border-purple-500/30'
    },
    {
        type: 'interim',
        label: 'Interim / Milestone',
        badge: 'Project Progress',
        category: 'projects',
        icon: TrendingUp,
        description: 'Progress billing for multi-stage contracts, billed when specific milestones are reached.',
        tags: ['Milestone Billing', 'Contracts'],
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/40',
        glowColor: 'rgba(245,158,11,0.2)',
        pillBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30'
    },
    {
        type: 'recurring',
        label: 'Recurring Invoice',
        badge: 'Automated Billing',
        category: 'core',
        icon: RefreshCw,
        description: 'Scheduled automated invoices for recurring SaaS subscriptions, agency retainers, and maintenance.',
        tags: ['SaaS Subscriptions', 'Retainers'],
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10',
        borderColor: 'border-cyan-500/40',
        glowColor: 'rgba(6,182,212,0.2)',
        pillBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
    },
    {
        type: 'timesheet',
        label: 'Timesheet Invoice',
        badge: 'Hourly & Logged',
        category: 'projects',
        icon: Clock,
        description: 'Itemized billing with granular work logs, hourly rates, tasks, and consultant timesheets.',
        tags: ['Hourly Logs', 'Freelancers'],
        color: 'text-violet-400',
        bgColor: 'bg-violet-500/10',
        borderColor: 'border-violet-500/40',
        glowColor: 'rgba(139,92,246,0.2)',
        pillBg: 'bg-violet-500/15 text-violet-400 border-violet-500/30'
    },
    {
        type: 'commercial',
        label: 'Commercial Invoice',
        badge: 'Cross-Border',
        category: 'compliance',
        icon: Globe,
        description: 'Required international customs document for clearance, freight shipping, and duties valuation.',
        tags: ['Global Trade', 'Customs Duties'],
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/40',
        glowColor: 'rgba(59,130,246,0.2)',
        pillBg: 'bg-blue-500/15 text-blue-400 border-blue-500/30'
    },
    {
        type: 'final',
        label: 'Final Project Closeout',
        badge: 'Project Complete',
        category: 'projects',
        icon: CheckCircle,
        description: 'Concluding payment request issued upon full completion, formal acceptance, and handover.',
        tags: ['Project Closeout', '100% Signoff'],
        color: 'text-teal-400',
        bgColor: 'bg-teal-500/10',
        borderColor: 'border-teal-500/40',
        glowColor: 'rgba(20,184,166,0.2)',
        pillBg: 'bg-teal-500/15 text-teal-400 border-teal-500/30'
    },
    {
        type: 'retainer',
        label: 'Retainer Deposit',
        badge: 'Advance Deposit',
        category: 'projects',
        icon: Wallet,
        description: 'Advance billing to secure dedicated service capacity, retainer funds, or project deposits.',
        tags: ['Prepaid Funds', 'Advance Retainers'],
        color: 'text-sky-400',
        bgColor: 'bg-sky-500/10',
        borderColor: 'border-sky-500/40',
        glowColor: 'rgba(14,165,233,0.2)',
        pillBg: 'bg-sky-500/15 text-sky-400 border-sky-500/30'
    },
    {
        type: 'credit-note',
        label: 'Credit Note / Memo',
        badge: 'Refunds',
        category: 'notices',
        icon: DollarSign,
        description: 'Official negative balance credit note for customer refunds, cancellations, and corrections.',
        tags: ['Refunds', 'Price Adjustments'],
        color: 'text-rose-400',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/40',
        glowColor: 'rgba(244,63,94,0.2)',
        pillBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
    },
    {
        type: 'past-due',
        label: 'Past Due Notice',
        badge: 'Overdue Notice',
        category: 'notices',
        icon: AlertTriangle,
        description: 'Formatted urgent payment demand for delinquent accounts with accrued late fees.',
        tags: ['Overdue Accounts', 'Late Fees'],
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/40',
        glowColor: 'rgba(249,115,22,0.2)',
        pillBg: 'bg-orange-500/15 text-orange-400 border-orange-500/30'
    },
    {
        type: 'expense',
        label: 'Expense Reimbursement',
        badge: 'Reimbursement',
        category: 'compliance',
        icon: FileSpreadsheet,
        description: 'Corporate expense claim for out-of-pocket business outlays, travel, and re-billed costs.',
        tags: ['Travel Claims', 'Reimbursements'],
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/40',
        glowColor: 'rgba(234,179,8,0.2)',
        pillBg: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
    }
];

interface InvoiceTypeSelectorProps {
    selected: InvoiceType;
    onChange: (type: InvoiceType) => void;
    onContinue?: () => void;
    withSampleData?: boolean;
    setWithSampleData?: (val: boolean) => void;
}

export function InvoiceTypeSelector({
    selected,
    onChange,
    onContinue,
    withSampleData = false,
    setWithSampleData
}: InvoiceTypeSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<InvoiceCategory>('all');

    const selectedOption = useMemo(() => {
        return invoiceTypes.find(t => t.type === selected) || invoiceTypes[0];
    }, [selected]);

    // Filter items based on Category and Search Query
    const filteredTypes = useMemo(() => {
        return invoiceTypes.filter(item => {
            const matchesCategory =
                activeCategory === 'all' ? true : item.category === activeCategory;

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                item.label.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                item.badge.toLowerCase().includes(q) ||
                item.tags.some(tag => tag.toLowerCase().includes(q));

            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    // Keyboard navigation: Press Enter to continue
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && onContinue) {
                if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
                    return;
                }
                onContinue();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onContinue]);

    const categories: { id: InvoiceCategory; label: string; count: number }[] = [
        { id: 'all', label: 'All Formats', count: invoiceTypes.length },
        { id: 'core', label: 'Popular & Core', count: invoiceTypes.filter(t => t.category === 'core').length },
        { id: 'projects', label: 'Projects & Time', count: invoiceTypes.filter(t => t.category === 'projects').length },
        { id: 'compliance', label: 'Tax & Compliance', count: invoiceTypes.filter(t => t.category === 'compliance').length },
        { id: 'notices', label: 'Financial & Notices', count: invoiceTypes.filter(t => t.category === 'notices').length }
    ];

    return (
        <div className="space-y-6">
            {/* Top Filter Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white/[0.02] p-2.5 sm:p-3 rounded-2xl border border-white/10 backdrop-blur-xl">
                {/* Category Navigation Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                    {categories.map(cat => {
                        const isActive = activeCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 ${
                                    isActive
                                        ? 'bg-green-500 text-black shadow-lg shadow-green-500/25 font-extrabold'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span>{cat.label}</span>
                                <span
                                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                        isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'
                                    }`}
                                >
                                    {cat.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <Input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search formats or tags..."
                        className="pl-9 pr-8 bg-black/40 border-white/10 text-xs text-white placeholder:text-gray-500 rounded-xl focus:border-green-500 focus:ring-green-500/20 h-9"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs font-bold w-4 h-4 rounded-full bg-white/10 flex items-center justify-center"
                        >
                            ×
                        </button>
                    )}
                </div>
            </div>

            {/* Full-width Cards Grid */}
            {filteredTypes.length === 0 ? (
                <div className="text-center py-16 px-4 rounded-3xl border border-white/10 bg-white/[0.02]">
                    <HelpCircle className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                    <h4 className="text-base font-bold text-white mb-1">No templates found</h4>
                    <p className="text-xs text-gray-400 mb-4 max-w-sm mx-auto">
                        No invoice format matches &quot;{searchQuery}&quot;. Try a broader term or reset the category filter.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setSearchQuery('');
                            setActiveCategory('all');
                        }}
                        className="rounded-full border-white/20 text-xs text-gray-300"
                    >
                        Reset Filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredTypes.map(invoiceType => {
                        const Icon = invoiceType.icon;
                        const isSelected = selected === invoiceType.type;

                        return (
                            <div
                                key={invoiceType.type}
                                onClick={() => onChange(invoiceType.type)}
                                onDoubleClick={() => onContinue && onContinue()}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => {
                                    if (e.key === ' ' || e.key === 'Enter') {
                                        e.preventDefault();
                                        onChange(invoiceType.type);
                                    }
                                }}
                                className={`group relative text-left rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer border ${
                                    isSelected
                                        ? 'bg-gradient-to-br from-green-950/40 via-zinc-900/95 to-zinc-900/95 border-green-500 shadow-[0_0_30px_rgba(30,215,96,0.18)] ring-1 ring-green-500/50'
                                        : 'bg-white/[0.025] border-white/10 hover:border-green-500/40 hover:bg-white/[0.05] hover:-translate-y-1'
                                }`}
                            >
                                {/* Glow layer for selected card */}
                                {isSelected && (
                                    <div
                                        className="absolute -inset-px rounded-2xl pointer-events-none opacity-30 blur-sm"
                                        style={{ background: invoiceType.glowColor }}
                                    />
                                )}

                                <div className="relative z-10 flex flex-col flex-1 justify-between">
                                    <div>
                                        {/* Card Top: Icon, Badge, Radio Circle */}
                                        <div className="flex items-center justify-between gap-2 mb-3.5">
                                            <div
                                                className={`p-2.5 rounded-xl border border-white/10 ${invoiceType.bgColor} transition-transform duration-200 group-hover:scale-105 flex items-center justify-center`}
                                            >
                                                <Icon className={`w-5 h-5 ${invoiceType.color}`} />
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${invoiceType.pillBg}`}
                                                >
                                                    {invoiceType.badge}
                                                </span>

                                                <div
                                                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                                                        isSelected
                                                            ? 'bg-green-500 text-black shadow-md shadow-green-500/40'
                                                            : 'border border-gray-600 group-hover:border-green-400/70'
                                                    }`}
                                                >
                                                    {isSelected ? (
                                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Title & Description */}
                                        <h4
                                            className={`font-black text-sm mb-1.5 transition-colors ${
                                                isSelected
                                                    ? 'text-green-400'
                                                    : 'text-white group-hover:text-green-400'
                                            }`}
                                        >
                                            {invoiceType.label}
                                        </h4>
                                        <p className="text-xs text-gray-400 leading-relaxed min-h-[40px] line-clamp-2 mb-4">
                                            {invoiceType.description}
                                        </p>
                                    </div>

                                    {/* Bottom Tags Box */}
                                    <div className="pt-3 border-t border-white/10 flex items-center flex-wrap gap-1.5">
                                        {invoiceType.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 border border-white/5 whitespace-nowrap"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Bottom Action Footer Bar */}
            <div className="mt-8 pt-6 border-t border-white/10 rounded-2xl bg-white/[0.02] border p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-xl">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className={`p-2.5 rounded-xl border border-white/10 ${selectedOption.bgColor} flex-shrink-0`}>
                        <selectedOption.icon className={`w-6 h-6 ${selectedOption.color}`} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">
                                Selected Format
                            </span>
                            <span className={`text-[10px] font-extrabold px-2 py-0.2 rounded-full border ${selectedOption.pillBg}`}>
                                {selectedOption.badge}
                            </span>
                        </div>
                        <h3 className="text-base font-black text-white">
                            {selectedOption.label}
                        </h3>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    {setWithSampleData && (
                        <label
                            htmlFor="sample-data-toggle"
                            className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors select-none text-xs text-gray-300"
                        >
                            <input
                                type="checkbox"
                                id="sample-data-toggle"
                                checked={withSampleData}
                                onChange={e => setWithSampleData(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-700 bg-zinc-800 text-green-500 focus:ring-green-400 focus:ring-offset-black cursor-pointer"
                            />
                            <span>Include sample line items</span>
                        </label>
                    )}

                    <Button
                        onClick={() => onContinue && onContinue()}
                        className="bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 text-black font-black text-sm px-7 py-5 rounded-xl hover:from-green-500 hover:to-emerald-600 transition-all duration-200 transform hover:scale-[1.02] shadow-xl shadow-green-500/25 flex items-center justify-center gap-2"
                    >
                        <span>Continue to Editor</span>
                        <ArrowRight className="w-4 h-4 stroke-[3]" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
