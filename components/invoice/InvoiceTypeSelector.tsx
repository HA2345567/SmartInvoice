'use client';

import { FileText, FileCheck, TrendingUp, CheckCircle, RefreshCw, DollarSign, AlertTriangle, Globe, Receipt, Clock, Wallet, FileSpreadsheet } from 'lucide-react';
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
        description: 'Standard invoice for completed sales and services',
        bestFor: ['Product sales', 'Service delivery', 'One-time transactions'],
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30'
    },
    {
        type: 'proforma',
        label: 'Proforma Invoice',
        icon: FileCheck,
        description: 'Preliminary quote or estimate - not a payment request',
        bestFor: ['Price estimates', 'International trade', 'Customs documentation'],
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30'
    },
    {
        type: 'interim',
        label: 'Interim Invoice',
        icon: TrendingUp,
        description: 'Progress billing for ongoing projects at milestones',
        bestFor: ['Construction', 'Long-term projects', 'Milestone payments'],
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30'
    },
    {
        type: 'final',
        label: 'Final Invoice',
        icon: CheckCircle,
        description: 'Final payment request upon project completion',
        bestFor: ['Project completion', 'Contract closeout', 'Final deliverables'],
        color: 'text-green-400',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30'
    },
    {
        type: 'recurring',
        label: 'Recurring Invoice',
        icon: RefreshCw,
        description: 'Automatic billing for subscriptions and regular services',
        bestFor: ['SaaS subscriptions', 'Monthly retainers', 'Recurring services'],
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-500/10',
        borderColor: 'border-cyan-500/30'
    },
    {
        type: 'credit-note',
        label: 'Credit Note',
        icon: DollarSign,
        description: 'Issue refunds or credits for returns and corrections',
        bestFor: ['Product returns', 'Billing corrections', 'Discounts'],
        color: 'text-red-400',
        bgColor: 'bg-red-500/10',
        borderColor: 'border-red-500/30'
    },
    {
        type: 'past-due',
        label: 'Past Due Invoice',
        icon: AlertTriangle,
        description: 'Payment reminder for overdue invoices',
        bestFor: ['Overdue payments', 'Late fee notices', 'Payment reminders'],
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30'
    },
    {
        type: 'commercial',
        label: 'Commercial Invoice',
        icon: Globe,
        description: 'International trade and customs clearance documentation',
        bestFor: ['Import/export', 'Customs clearance', 'International shipping'],
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30'
    },
    {
        type: 'tax',
        label: 'Tax Invoice',
        icon: Receipt,
        description: 'VAT/GST compliant invoice with detailed tax breakdown',
        bestFor: ['VAT-registered businesses', 'Tax compliance', 'Government reporting'],
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30'
    },
    {
        type: 'timesheet',
        label: 'Timesheet Invoice',
        icon: Clock,
        description: 'Hourly billing with detailed time tracking',
        bestFor: ['Consultants', 'Freelancers', 'Legal services'],
        color: 'text-violet-400',
        bgColor: 'bg-violet-500/10',
        borderColor: 'border-violet-500/30'
    },
    {
        type: 'retainer',
        label: 'Retainer Invoice',
        icon: Wallet,
        description: 'Advance payment for future services',
        bestFor: ['Law firms', 'Monthly retainers', 'Prepaid services'],
        color: 'text-sky-400',
        bgColor: 'bg-sky-500/10',
        borderColor: 'border-sky-500/30'
    },
    {
        type: 'expense',
        label: 'Expense Report',
        icon: FileSpreadsheet,
        description: 'Business expense reimbursement documentation',
        bestFor: ['Employee reimbursements', 'Travel expenses', 'Business costs'],
        color: 'text-amber-400',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30'
    }
];

interface InvoiceTypeSelectorProps {
    selected: InvoiceType;
    onChange: (type: InvoiceType) => void;
}

export function InvoiceTypeSelector({ selected, onChange }: InvoiceTypeSelectorProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white">Invoice Type</h3>
                    <p className="text-sm text-green-muted">Choose the type that matches your billing scenario</p>
                </div>
                <Badge className="bg-green-500/20 text-green-primary border-green-500/30">
                    {invoiceTypes.find(t => t.type === selected)?.label}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {invoiceTypes.map((invoiceType) => {
                    const Icon = invoiceType.icon;
                    const isSelected = selected === invoiceType.type;

                    return (
                        <Card
                            key={invoiceType.type}
                            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${isSelected
                                ? `${invoiceType.bgColor} border-2 ${invoiceType.borderColor} shadow-lg`
                                : 'card-green-mist border-gray-700 hover:border-green-500/50'
                                }`}
                            onClick={() => onChange(invoiceType.type)}
                        >
                            <CardContent className="p-4 space-y-3">
                                {/* Icon & Title */}
                                <div className="flex items-start justify-between">
                                    <div className={`p-2 rounded-lg ${invoiceType.bgColor}`}>
                                        <Icon className={`w-6 h-6 ${invoiceType.color}`} />
                                    </div>
                                    {isSelected && (
                                        <div className="w-3 h-3 rounded-full bg-green-primary animate-pulse" />
                                    )}
                                </div>

                                <div>
                                    <h4 className="font-semibold text-white mb-1">
                                        {invoiceType.label}
                                    </h4>
                                    <p className="text-xs text-green-muted leading-relaxed">
                                        {invoiceType.description}
                                    </p>
                                </div>

                                {/* Best For Tags */}
                                <div className="flex flex-wrap gap-1">
                                    {invoiceType.bestFor.slice(0, 2).map((use, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs px-2 py-0.5 rounded-full bg-gray-800/50 text-gray-400"
                                        >
                                            {use}
                                        </span>
                                    ))}
                                    {invoiceType.bestFor.length > 2 && (
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800/50 text-gray-400">
                                            +{invoiceType.bestFor.length - 2}
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Selected Type Info */}
            {selected && (
                <Card className="card-green-mist border-green-500/30">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${invoiceTypes.find(t => t.type === selected)?.bgColor}`}>
                                {(() => {
                                    const Icon = invoiceTypes.find(t => t.type === selected)?.icon;
                                    return Icon ? <Icon className={`w-5 h-5 ${invoiceTypes.find(t => t.type === selected)?.color}`} /> : null;
                                })()}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-white mb-1">
                                    {invoiceTypes.find(t => t.type === selected)?.label}
                                </h4>
                                <p className="text-xs text-green-muted mb-2">
                                    {invoiceTypes.find(t => t.type === selected)?.description}
                                </p>
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-green-primary">Best suited for:</p>
                                    <ul className="text-xs text-green-muted space-y-0.5">
                                        {invoiceTypes.find(t => t.type === selected)?.bestFor.map((use, idx) => (
                                            <li key={idx}>• {use}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
