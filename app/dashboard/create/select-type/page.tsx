'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InvoiceTypeSelector, InvoiceType, invoiceTypes } from '@/components/invoice/InvoiceTypeSelector';
import { Button } from '@/components/ui/button';
import {
    ArrowLeft,
    ArrowRight,
    Crown,
    ShieldCheck,
    Zap,
    Layers,
    FileCheck2,
    CheckCircle2,
    SlidersHorizontal,
    Compass
} from 'lucide-react';

export default function SelectInvoiceTypePage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<InvoiceType>('sales');
    const [withSampleData, setWithSampleData] = useState(false);

    const handleContinue = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('invoiceType', selectedType);
            if (withSampleData) {
                sessionStorage.setItem('prefillSampleData', 'true');
            } else {
                sessionStorage.removeItem('prefillSampleData');
            }
        }
        router.push('/dashboard/create');
    };

    const currentTypeOption = invoiceTypes.find(t => t.type === selectedType) || invoiceTypes[0];

    return (
        <div
            className="min-h-screen text-white p-4 sm:p-6 md:p-8 relative overflow-hidden"
            style={{ background: '#0a0a0c' }}
        >
            {/* Background Ambient Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-green-500/15 via-emerald-600/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none -z-10" />
            <div className="absolute bottom-10 right-0 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto space-y-8 relative">
                {/* Top Navigation Bar */}
                <div className="flex items-center justify-between pt-2">
                    <Link
                        href="/dashboard/create"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-300 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:scale-[1.02] shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4 text-green-400" />
                        <span>Back to Editor</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden sm:inline-block">
                            Smart Schema Selector
                        </span>
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                    </div>
                </div>

                {/* Hero Header & Step Indicator */}
                <div className="text-center space-y-4 pt-1 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-black uppercase tracking-wider mb-1 shadow-lg shadow-green-500/10">
                        <Crown className="w-3.5 h-3.5" />
                        <span>Document Architect</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                        Choose Document Format
                    </h1>

                    <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Pick a specialized billing structure tailored to your exact transaction model. Taxes, line-item structures, and compliance rules are pre-configured automatically.
                    </p>

                    {/* Progress Steps Indicator */}
                    <div className="flex items-center justify-center gap-2 sm:gap-4 pt-2">
                        {/* Step 1: Active */}
                        <div className="flex items-center gap-2.5 bg-green-500/15 border border-green-500/40 px-4 py-2 rounded-full shadow-lg shadow-green-500/10">
                            <span className="w-5 h-5 rounded-full bg-green-400 text-black text-xs font-black flex items-center justify-center">
                                1
                            </span>
                            <span className="text-xs font-extrabold text-green-400">Select Format</span>
                        </div>

                        <div className="w-6 sm:w-10 h-[2px] bg-white/10" />

                        {/* Step 2 */}
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-gray-400">
                            <span className="w-5 h-5 rounded-full bg-white/10 text-gray-400 text-xs font-bold flex items-center justify-center">
                                2
                            </span>
                            <span className="text-xs font-medium">Fill Details</span>
                        </div>

                        <div className="w-6 sm:w-10 h-[2px] bg-white/10" />

                        {/* Step 3 */}
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-gray-400">
                            <span className="w-5 h-5 rounded-full bg-white/10 text-gray-400 text-xs font-bold flex items-center justify-center">
                                3
                            </span>
                            <span className="text-xs font-medium">Review & Export</span>
                        </div>
                    </div>
                </div>

                {/* Main Interactive Showcase Section */}
                <div className="rounded-3xl border border-white/10 bg-zinc-950/40 backdrop-blur-2xl p-4 sm:p-6 md:p-8 shadow-2xl relative">
                    <InvoiceTypeSelector
                        selected={selectedType}
                        onChange={setSelectedType}
                        onContinue={handleContinue}
                        withSampleData={withSampleData}
                        setWithSampleData={setWithSampleData}
                    />
                </div>

                {/* Feature Value Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-16">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-start gap-3.5 backdrop-blur-md hover:border-green-500/30 transition-colors">
                        <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex-shrink-0">
                            <Layers className="w-4.5 h-4.5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-extrabold text-white mb-1">12 Dedicated Schemas</h4>
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                From standard Sales to Retainers, Timesheets, and Cross-Border Trade.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-start gap-3.5 backdrop-blur-md hover:border-green-500/30 transition-colors">
                        <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex-shrink-0">
                            <ShieldCheck className="w-4.5 h-4.5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-extrabold text-white mb-1">Tax & Audit Compliant</h4>
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                Formatted for legal statutory guidelines, GSTIN/VAT, and HSN/SAC codes.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-start gap-3.5 backdrop-blur-md hover:border-green-500/30 transition-colors">
                        <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex-shrink-0">
                            <FileCheck2 className="w-4.5 h-4.5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-extrabold text-white mb-1">Crisp Vector PDFs</h4>
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                High-definition print-ready rendering with custom fonts and brand logos.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-start gap-3.5 backdrop-blur-md hover:border-green-500/30 transition-colors">
                        <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex-shrink-0">
                            <Zap className="w-4.5 h-4.5" />
                        </div>
                        <div>
                            <h4 className="text-xs font-extrabold text-white mb-1">Seamless Switch</h4>
                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                Switch template styles and formats anytime without losing your line items.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-zinc-950/90 border-t border-white/10 backdrop-blur-xl z-40 flex items-center justify-between gap-3 shadow-2xl">
                <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block truncate">
                        Selected Format
                    </span>
                    <span className="text-xs font-black text-green-400 truncate block">
                        {currentTypeOption.label}
                    </span>
                </div>

                <Button
                    onClick={handleContinue}
                    className="bg-green-500 hover:bg-green-600 text-black font-black text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-green-500/25 flex items-center gap-1.5 flex-shrink-0"
                >
                    <span>Continue</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </Button>
            </div>
        </div>
    );
}
