'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InvoiceTypeSelector, InvoiceType } from '@/components/invoice/InvoiceTypeSelector';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Sparkles, ShieldCheck, Zap, Layers, CheckCircle2 } from 'lucide-react';

export default function SelectInvoiceTypePage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<InvoiceType>('sales');

    const handleContinue = () => {
        sessionStorage.setItem('invoiceType', selectedType);
        router.push('/dashboard/create');
    };

    return (
        <div className="min-h-screen text-white p-4 md:p-8 relative overflow-hidden" style={{ background: '#121212' }}>
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto space-y-8 relative">
                {/* Top Navigation Bar */}
                <div className="flex items-center justify-between pt-2">
                    <Link
                        href="/dashboard/create"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-300 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 hover:scale-[1.03]"
                    >
                        <ArrowLeft className="w-4 h-4 text-green-400" />
                        <span>Back to Invoice Form</span>
                    </Link>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest hidden sm:inline-block">
                        Step 1 of 3
                    </span>
                </div>

                {/* Step Navigation Header */}
                <div className="text-center space-y-4 pt-2">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-black uppercase tracking-wider mb-1 shadow-lg shadow-green-500/10">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>Smart Format Engine</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                        Choose Document Format
                    </h1>

                    <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                        Select the billing schema tailored to your specific workflow. We automatically configure taxes, line-item structures, and compliance rules for you.
                    </p>

                    {/* Progress Steps Indicator */}
                    <div className="flex items-center justify-center gap-2 sm:gap-4 pt-4 max-w-xl mx-auto">
                        {/* Step 1 */}
                        <div className="flex items-center gap-2.5 bg-green-500/15 border border-green-500/40 px-4 py-2 rounded-full shadow-lg shadow-green-500/10">
                            <span className="w-5 h-5 rounded-full bg-green-400 text-black text-xs font-black flex items-center justify-center">
                                1
                            </span>
                            <span className="text-xs font-extrabold text-green-400">Select Format</span>
                        </div>

                        <div className="w-8 h-[2px] bg-white/10" />

                        {/* Step 2 */}
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-gray-500">
                            <span className="w-5 h-5 rounded-full bg-white/10 text-gray-400 text-xs font-bold flex items-center justify-center">
                                2
                            </span>
                            <span className="text-xs font-medium">Fill Details</span>
                        </div>

                        <div className="w-8 h-[2px] bg-white/10" />

                        {/* Step 3 */}
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-gray-500">
                            <span className="w-5 h-5 rounded-full bg-white/10 text-gray-400 text-xs font-bold flex items-center justify-center">
                                3
                            </span>
                            <span className="text-xs font-medium">Export PDF</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Selector Card */}
                <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                    <InvoiceTypeSelector
                        selected={selectedType}
                        onChange={setSelectedType}
                    />

                    {/* Action Footer Button */}
                    <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-gray-400 flex items-center gap-2">
                            <CheckCircle2 className="w-4.5 h-4.5 text-green-400 flex-shrink-0" />
                            <span>You can switch format templates anytime during editing</span>
                        </div>

                        <Button
                            onClick={handleContinue}
                            className="w-full sm:w-auto bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 text-black font-black px-9 py-6 text-sm sm:text-base rounded-full hover:from-green-500 hover:to-emerald-600 transition-all duration-300 transform hover:scale-[1.03] shadow-xl shadow-green-500/25"
                            size="lg"
                        >
                            <span>Continue with Selection</span>
                            <ArrowRight className="w-5 h-5 ml-2 stroke-[3]" />
                        </Button>
                    </div>
                </div>

                {/* Platform Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-12">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-start gap-4 backdrop-blur-md">
                        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-1">12 Specialized Schemas</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Tailored fields for Sales, Proforma, Retainers, Timesheets, Taxes, and Expense claims.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-start gap-4 backdrop-blur-md">
                        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-1">AI Smart Line Items</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Describe your services in natural text to generate complete line items & pricing instantly.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex items-start gap-4 backdrop-blur-md">
                        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white mb-1">Global Tax Compliance</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                Formatted for legal international compliance, HSN/SAC breakdowns, and PDF exports.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
