'use client';

import { useRouter } from 'next/navigation';
import { InvoiceTypeSelector, InvoiceType } from '@/components/invoice/InvoiceTypeSelector';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Layers, CheckCircle2 } from 'lucide-react';

export default function SelectInvoiceTypePage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<InvoiceType>('sales');

    const handleContinue = () => {
        sessionStorage.setItem('invoiceType', selectedType);
        router.push('/dashboard/create');
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Step Navigation Header */}
                <div className="text-center space-y-4 pt-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Smart Invoice Builder</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                        Choose Document Format
                    </h1>

                    <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Select the invoice schema that matches your exact billing scenario. We automatically adjust taxes, line-item fields, and compliance templates for you.
                    </p>

                    {/* Progress Steps Indicator */}
                    <div className="flex items-center justify-center gap-2 sm:gap-4 pt-4 max-w-xl mx-auto">
                        {/* Step 1 */}
                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/40 px-3 py-1.5 rounded-full">
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-black text-xs font-bold flex items-center justify-center">
                                1
                            </span>
                            <span className="text-xs font-semibold text-emerald-400">Select Type</span>
                        </div>

                        <div className="w-6 h-[1px] bg-zinc-800" />

                        {/* Step 2 */}
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-zinc-500">
                            <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center">
                                2
                            </span>
                            <span className="text-xs font-medium">Fill Details</span>
                        </div>

                        <div className="w-6 h-[1px] bg-zinc-800" />

                        {/* Step 3 */}
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-zinc-500">
                            <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center">
                                3
                            </span>
                            <span className="text-xs font-medium">Export & Send</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Selector Card */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-2xl p-6 md:p-8 shadow-2xl shadow-black/80">
                    <InvoiceTypeSelector
                        selected={selectedType}
                        onChange={setSelectedType}
                    />

                    {/* Action Footer Button */}
                    <div className="mt-8 pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-zinc-400 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>You can switch templates and edit preset details anytime on the next step</span>
                        </div>

                        <Button
                            onClick={handleContinue}
                            className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-black font-extrabold px-8 py-6 text-base rounded-xl hover:from-emerald-400 hover:to-teal-400 transition-all transform hover:scale-[1.02] shadow-xl shadow-emerald-500/20"
                            size="lg"
                        >
                            <span>Continue with Selection</span>
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Platform Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-12">
                    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-1">12 Specialized Preset Schemas</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Optimized schemas for Sales, Proforma, Retainers, Timesheets, Taxes, and Expense claims.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-1">AI Smart Invoice Auto-Fill</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Describe your services in plain language and our AI generates line items & pricing instantly.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-1">Tax & Audit Compliant</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Formatted for legal international compliance, HSN/SAC codes, and PDF exports.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
