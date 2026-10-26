'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Layout, Download, Save, Send, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface InvoiceFormHeaderProps {
    setShowTemplateDialog: (show: boolean) => void;
    handleSimplePDF: () => void;
    handleSave: (status?: 'draft' | 'sent') => void;
    loading: boolean;
}

export const InvoiceFormHeader = React.memo(({
    setShowTemplateDialog,
    handleSimplePDF,
    handleSave,
    loading
}: InvoiceFormHeaderProps) => {
    const { user } = useAuth();

    return (
        <div className="space-y-4 mb-8">
            {/* Editorial Studio Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/invoices"
                        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Invoices</span>
                    </Link>
                    <span className="text-zinc-600">/</span>
                    <h1 className="text-lg font-medium text-white tracking-tight">Invoice Studio</h1>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-white/[0.08]">
                        Draft
                    </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        variant="outline"
                        onClick={() => setShowTemplateDialog(true)}
                        className="border-white/10 hover:bg-white/5 text-zinc-300 text-xs font-medium rounded-full px-3.5 h-9"
                    >
                        <Layout className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
                        Templates
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleSimplePDF}
                        className="border-white/10 hover:bg-white/5 text-zinc-300 text-xs font-medium rounded-full px-3.5 h-9"
                    >
                        <Download className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
                        Download PDF
                    </Button>
                    {user ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => handleSave('draft')}
                                disabled={loading}
                                className="border-white/10 hover:bg-white/5 text-zinc-300 text-xs font-medium rounded-full px-3.5 h-9"
                            >
                                <Save className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
                                Save Draft
                            </Button>
                            <Button
                                onClick={() => handleSave('sent')}
                                disabled={loading}
                                className="bg-[#1ed760] text-black font-semibold text-xs rounded-full px-5 h-9 hover:bg-[#1fdf64] transition-all active:scale-[0.98]"
                            >
                                <Send className="w-3.5 h-3.5 mr-1.5" />
                                Issue & Send
                            </Button>
                        </>
                    ) : (
                        <Link href="/auth/signup">
                            <Button
                                className="bg-[#1ed760] text-black font-semibold text-xs rounded-full px-5 h-9 hover:bg-[#1fdf64] transition-all"
                            >
                                Sign Up to Save
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Guest Notice if unauthenticated */}
            {!user && (
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-200/90">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Guest Studio Mode — Fill details and click <strong>Download PDF</strong> freely.</span>
                    </div>
                    <Link href="/auth/signup" className="underline text-white font-medium hover:text-amber-300">
                        Create account to save records
                    </Link>
                </div>
            )}
        </div>
    );
});

InvoiceFormHeader.displayName = 'InvoiceFormHeader';
export default InvoiceFormHeader;
