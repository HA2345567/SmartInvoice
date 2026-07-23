'use client';

import { FileText, FileCheck, TrendingUp, CheckCircle, RefreshCw, DollarSign, AlertTriangle, Globe, Receipt, Clock, Wallet, FileSpreadsheet, Sparkles, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export type InvoiceType = 'sales' | 'proforma' | 'interim' | 'final' | 'recurring' | 'credit-note' | 'past-due' |
    'commercial' | 'tax' | 'timesheet' | 'retainer' | 'expense';

interface InvoiceTypeOption {
    type: InvoiceType;
    label: string;
    icon: React.ElementType;
    description: string;
    bestFor: string[];
    color: string;
    bgColor: string;
    borderColor: string;
}

const invoiceTypes: InvoiceTypeOption[] = [
    {
        type: 'sales',
        label: 'Sales Invoice',
        icon: FileText,
        description: 'Standard invoice for completed sales, products, and services',
        bestFor: ['Product sales', 'Service delivery', 'One-time transactions'],
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/40'
    },
    {
        type: 'proforma',
        label: 'Proforma Invoice',
        icon: FileCheck,
        description: 'Preliminary quote or estimate before final delivery',
        bestFor: ['Price estimates', 'International trade', 'Customs documentation'],
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/40'
    },
    {
        type: 'interim',
        label: 'Interim Invoice',
        icon: TrendingUp,
        description: 'Progress billing for ongoing projects at key milestones',
        bestFor: ['Construction', 'Long-term projects', 'Milestone payments'],
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/40'
    },
    {
        type: 'final',
        label: 'Final Invoice',
        icon: CheckCircle,
        description: 'Final payment request upon complete project delivery',
        bestFor: ['Project completion', 'Contract closeout', 'Final deliverables'],
        color: 'text-teal-400',
        bgColor: 'bg-teal-500/10',
        borderColor: 'border-teal-500/40'
    },
    {
        type: 'recurring',
        label: 'Recurring Invoice',
        icon: RefreshCw,
        description: 'Automated billing for subscriptions and retainer services',
        bestFor: ['SaaS subscriptions', 'Monthly retainers', 'Recurring services'],
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10',
        borderColor: 'border-cyan-500/40'
    },
    {
        type: 'credit-note',
        label: 'Credit Note',
        icon: DollarSign,
        description: 'Issue refunds, price adjustments, or account credits',
        bestFor: ['Product returns', 'Billing corrections', 'Discounts'],
        color: 'text-rose-400',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/40'
    },
    {
        type: 'past-due',
        label: 'Past Due Invoice',
        icon: AlertTriangle,
        description: 'Formatted payment demand notice for overdue balances',
        bestFor: ['Overdue payments', 'Late fee notices', 'Payment reminders'],
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/40'
    },
    {
        type: 'commercial',
        label: 'Commercial Invoice',
        icon: Globe,
        description: 'Cross-border trade and international customs clearance',
        bestFor: ['Import/export', 'Customs clearance', 'Global shipping'],
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/40'
    },
    {
        type: 'tax',
        label: 'Tax Invoice',
        icon: Receipt,
        description: 'GST / VAT compliant invoice with statutory breakdowns',
        bestFor: ['VAT-registered businesses', 'Tax compliance', 'Audit reporting'],
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/40'
    },
    {
        type: 'timesheet',
        label: 'Timesheet Invoice',
        icon: Clock,
        description: 'Detailed hourly billing with tracked time logs',
        bestFor: ['Consultants', 'Freelancers', 'Agencies & Lawyers'],
        color: 'text-violet-400',
        bgColor: 'bg-violet-500/10',
        borderColor: 'border-violet-500/40'
    },
    {
        type: 'retainer',
        label: 'Retainer Invoice',
        icon: Wallet,
        description: 'Advance deposit billing for upcoming work hours',
        bestFor: ['Law firms', 'Agencies', 'Prepaid service retainers'],
        color: 'text-sky-400',
        bgColor: 'bg-sky-500/10',
        borderColor: 'border-sky-500/40'
    },
    {
        type: 'expense',
        label: 'Expense Report',
        icon: FileSpreadsheet,
        description: 'Reimbursement invoice for out-of-pocket business costs',
        bestFor: ['Employee claims', 'Travel expenses', 'Vendor costs'],
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/40'
    }
];

interface InvoiceTypeSelectorProps {
    selected: InvoiceType;
    onChange: (type: InvoiceType) => void;
}

export function InvoiceTypeSelector({ selected, onChange }: InvoiceTypeSelectorProps) {
    const selectedOption = invoiceTypes.find(t => t.type === selected) || invoiceTypes[0];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                <div>
                    <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                        <span>Select Document Type</span>
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <p className="text-sm text-zinc-400 mt-0.5">
                        Choose a tailored document schema designed for your specific workflow
                    </p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-sm font-semibold">
                    {selectedOption.label} Selected
                </Badge>
            </div>

            {/* Grid of Invoice Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {invoiceTypes.map((invoiceType) => {
                    const Icon = invoiceType.icon;
                    const isSelected = selected === invoiceType.type;

                    return (
                        <div
                            key={invoiceType.type}
                            onClick={() => onChange(invoiceType.type)}
                            className={`group relative cursor-pointer rounded-xl p-5 border transition-all duration-300 transform hover:-translate-y-1 ${
                                isSelected
                                    ? `bg-zinc-900/90 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/50`
                                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-3 rounded-lg border border-zinc-800 ${invoiceType.bgColor} transition-transform group-hover:scale-110`}>
                                    <Icon className={`w-6 h-6 ${invoiceType.color}`} />
                                </div>
                                {isSelected ? (
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-md shadow-emerald-500/50">
                                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                                    </div>
                                ) : (
                                    <div className="w-5 h-5 rounded-full border border-zinc-700 group-hover:border-zinc-500 transition-colors" />
                                )}
                            </div>

                            <h4 className="font-bold text-white text-base mb-1 group-hover:text-emerald-400 transition-colors">
                                {invoiceType.label}
                            </h4>
                            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                                {invoiceType.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {invoiceType.bestFor.slice(0, 2).map((use, idx) => (
                                    <span
                                        key={idx}
                                        className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
                                    >
                                        {use}
                                    </span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detailed Info Card for Selected Document */}
            {selectedOption && (
                <div className="rounded-xl p-5 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-zinc-900/60 to-zinc-900/60 backdrop-blur-xl">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl border border-emerald-500/30 ${selectedOption.bgColor}`}>
                            <selectedOption.icon className={`w-7 h-7 ${selectedOption.color}`} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-base font-bold text-white">
                                    {selectedOption.label} Setup
                                </h4>
                                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">
                                    Active Preset
                                </Badge>
                            </div>
                            <p className="text-xs text-zinc-300 mb-3">
                                {selectedOption.description}
                            </p>
                            <div>
                                <span className="text-xs font-semibold text-emerald-400 block mb-1.5">
                                    Included Features & Recommended Use Cases:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {selectedOption.bestFor.map((use, idx) => (
                                        <span key={idx} className="text-xs px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center gap-1.5">
                                            <Check className="w-3 h-3 text-emerald-400" />
                                            {use}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
