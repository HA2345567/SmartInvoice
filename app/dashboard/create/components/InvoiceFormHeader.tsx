'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Save, Send, Layout, Download, Sparkles, ShieldCheck } from 'lucide-react';
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
            {!user && (
                <div 
                    className="p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border shadow-xl relative overflow-hidden transition-all duration-300 hover:border-green-500/40"
                    style={{
                        background: 'linear-gradient(135deg, rgba(30,215,96,0.08) 0%, rgba(18,18,18,0.95) 50%, rgba(30,215,96,0.04) 100%)',
                        borderColor: 'rgba(30,215,96,0.25)',
                        backdropFilter: 'blur(16px)'
                    }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/10 border border-green-500/30 text-green-400">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-extrabold text-white">Free Guest Mode</span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-500/20 text-green-400 border border-green-500/30">
                                    No Sign In Required
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">Fill details below and click <strong className="text-green-400">Quick PDF</strong> to download immediately.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <Link 
                            href="/auth/signup"
                            className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:scale-[1.03]"
                        >
                            Sign Up to Save Cloud History
                        </Link>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center mr-3 bg-gradient-to-br from-green-400 to-green-600 text-black shadow-lg shadow-green-500/20">
                            <Plus className="w-6 h-6 stroke-[3]" />
                        </div>
                        Create New Invoice
                    </h1>
                    <p className="text-green-muted mt-1 text-sm">Generate a professional, high-conversion invoice in seconds</p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                    <Button
                        variant="outline"
                        onClick={() => setShowTemplateDialog(true)}
                        className="btn-green-secondary text-xs h-10 px-3.5"
                    >
                        <Layout className="w-4 h-4 mr-2" />
                        Templates
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleSimplePDF}
                        className="btn-green-secondary text-xs h-10 px-4 border-green-500/40 text-green-400 hover:bg-green-500/10 font-bold"
                    >
                        <Download className="w-4 h-4 mr-2 text-green-400" />
                        Download PDF
                    </Button>
                    {user ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => handleSave('draft')}
                                disabled={loading}
                                className="btn-green-secondary text-xs h-10 px-3.5"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Draft
                            </Button>
                            <Button
                                onClick={() => handleSave('sent')}
                                disabled={loading}
                                className="btn-green-primary dark-glow text-xs h-10 px-4 font-bold"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                {loading ? 'Creating...' : 'Save & Send'}
                            </Button>
                        </>
                    ) : (
                        <Button
                            onClick={handleSimplePDF}
                            className="bg-gradient-to-r from-green-400 to-green-500 text-black hover:from-green-500 hover:to-green-600 font-extrabold text-xs h-10 px-5 rounded-full shadow-lg shadow-green-500/25 transition-transform hover:scale-[1.03]"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Invoice Now
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
});

InvoiceFormHeader.displayName = 'InvoiceFormHeader';
