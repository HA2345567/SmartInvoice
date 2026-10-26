'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Download, FileText, Layout, Loader2, ShieldCheck, Check, RefreshCw, Palette } from 'lucide-react';
import InvoiceRenderer from '@/components/invoices/templates/InvoiceRenderer';
import TemplateSelector from '@/components/invoices/TemplateSelector';
import { PremiumPDFGenerator } from '@/lib/pdf-generator';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';

export interface ThemeOption {
    id: string;
    name: string;
    tagline: string;
    primaryColor: string;
    badgeText: string;
}

export const PREVIEW_THEMES: ThemeOption[] = [
    {
        id: 'luxury',
        name: 'Luxury',
        tagline: 'Haute Editorial',
        primaryColor: '#B89B5E',
        badgeText: 'Editorial',
    },
    {
        id: 'apple',
        name: 'Apple',
        tagline: 'Cupertino Minimal',
        primaryColor: '#0071E3',
        badgeText: 'Modern',
    },
    {
        id: 'stripe',
        name: 'Stripe',
        tagline: 'Fintech Precision',
        primaryColor: '#635BFF',
        badgeText: 'Fintech',
    },
    {
        id: 'minimal',
        name: 'Minimal',
        tagline: 'Swiss Monolith',
        primaryColor: '#18181B',
        badgeText: 'Swiss',
    },
    {
        id: 'shopify',
        name: 'Shopify',
        tagline: 'Merchant Commerce',
        primaryColor: '#008060',
        badgeText: 'Commerce',
    },
    {
        id: 'amazon',
        name: 'Amazon',
        tagline: 'High-Density Enterprise',
        primaryColor: '#FF9900',
        badgeText: 'Corporate',
    },
    {
        id: 'google',
        name: 'Google',
        tagline: 'Material Horizon',
        primaryColor: '#1A73E8',
        badgeText: 'Material',
    },
    {
        id: 'microsoft',
        name: 'Microsoft',
        tagline: 'Fluent Executive',
        primaryColor: '#0078D4',
        badgeText: 'Executive',
    },
    {
        id: 'custom',
        name: 'Custom',
        tagline: 'Bespoke Atelier',
        primaryColor: '#8B5CF6',
        badgeText: 'Atelier',
    },
];

interface PreviewDialogsProps {
    showPreviewDialog: boolean;
    setShowPreviewDialog: (show: boolean) => void;
    showTemplateDialog: boolean;
    setShowTemplateDialog: (show: boolean) => void;
    invoiceData: any;
    handleTemplateSelect: (type: any, style: any) => void;
    handlePreview: () => void;
    previewLoading: boolean;
    onThemeChange?: (theme: string) => void;
    themeSchemes?: Record<string, any>;
}

export const PreviewDialogs = React.memo(({
    showPreviewDialog,
    setShowPreviewDialog,
    showTemplateDialog,
    setShowTemplateDialog,
    invoiceData,
    handleTemplateSelect,
    handlePreview,
    previewLoading,
    onThemeChange,
    themeSchemes,
}: PreviewDialogsProps) => {
    const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
    const [loadingPdf, setLoadingPdf] = useState<boolean>(false);
    const [previewMode, setPreviewMode] = useState<'pdf' | 'html'>('pdf');
    const [renderError, setRenderError] = useState<string | null>(null);
    const [renderKey, setRenderKey] = useState<number>(0);

    const activeTheme = invoiceData.theme || 'luxury';

    // Generate authentic, downloadable PDF blob whenever dialog opens, data updates, or theme switches
    useEffect(() => {
        if (!showPreviewDialog) {
            if (pdfBlobUrl) {
                URL.revokeObjectURL(pdfBlobUrl);
                setPdfBlobUrl(null);
            }
            setRenderError(null);
            return;
        }

        let isMounted = true;
        setLoadingPdf(true);
        setRenderError(null);

        try {
            const generator = new PremiumPDFGenerator();
            const pdfBuffer = generator.generatePDF({
                ...invoiceData,
                theme: invoiceData.theme || 'luxury',
                customColors: invoiceData.customColors || (themeSchemes && themeSchemes[invoiceData.theme]),
            });

            const blob = new Blob([pdfBuffer as BlobPart], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            if (isMounted) {
                if (pdfBlobUrl) {
                    URL.revokeObjectURL(pdfBlobUrl);
                }
                setPdfBlobUrl(url);
                setLoadingPdf(false);
                setPreviewMode('pdf');
            }
        } catch (err: any) {
            console.error('Error generating live PDF preview:', err);
            if (isMounted) {
                setLoadingPdf(false);
                setRenderError(err?.message || 'Could not render PDF preview');
            }
        }

        return () => {
            isMounted = false;
        };
    }, [showPreviewDialog, invoiceData, renderKey, themeSchemes]);

    const handleSelectTheme = useCallback((themeId: string) => {
        if (onThemeChange) {
            onThemeChange(themeId);
        }
        setRenderKey(prev => prev + 1);
    }, [onThemeChange]);

    const handleRefresh = useCallback(() => {
        setRenderKey(prev => prev + 1);
    }, []);

    const handleDownloadCurrentPDF = () => {
        if (!pdfBlobUrl) {
            handlePreview();
            return;
        }
        const a = document.createElement('a');
        a.href = pdfBlobUrl;
        a.download = `invoice-${invoiceData.invoiceNumber || 'draft'}-${activeTheme}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <>
            {/* 100% End-to-End Live Preview Dialog with Real Downloadable PDF & In-Modal Theme Switcher */}
            <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
                <DialogContent className="max-w-6xl w-[96vw] h-[92vh] bg-zinc-950/95 border-zinc-800 backdrop-blur-2xl flex flex-col p-4 sm:p-6 text-white shadow-2xl overflow-hidden">
                    {/* Header Row */}
                    <DialogHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 gap-2 border-b border-zinc-800/80 shrink-0">
                        <div>
                            <DialogTitle className="text-white flex items-center text-lg font-bold">
                                <Eye className="w-5 h-5 mr-2 text-emerald-400" />
                                <span>Live Downloadable PDF Preview</span>
                                <span className="ml-2.5 text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                    #{invoiceData.invoiceNumber || 'DRAFT'}
                                </span>
                                <span className="ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 capitalize flex items-center gap-1.5">
                                    <span
                                        className="w-2 h-2 rounded-full inline-block"
                                        style={{ backgroundColor: PREVIEW_THEMES.find(t => t.id === activeTheme)?.primaryColor || '#10B981' }}
                                    />
                                    {activeTheme}
                                </span>
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400 text-xs mt-0.5">
                                Exact pixel-perfect PDF that the user will download. Switch themes in real-time below.
                            </DialogDescription>
                        </div>

                        {/* Top Right Actions: Refresh & View Switcher */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRefresh}
                                title="Re-render PDF"
                                className="h-8 px-2.5 bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 mr-1 ${loadingPdf ? 'animate-spin text-emerald-400' : ''}`} />
                                <span>Refresh</span>
                            </Button>

                            <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setPreviewMode('pdf')}
                                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                                        previewMode === 'pdf'
                                            ? 'bg-emerald-500 text-black shadow-sm font-bold'
                                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                                    }`}
                                >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Actual PDF</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setPreviewMode('html')}
                                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                                        previewMode === 'html'
                                            ? 'bg-emerald-500 text-black shadow-sm font-bold'
                                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                                    }`}
                                >
                                    <Layout className="w-3.5 h-3.5" />
                                    <span>HTML Mock</span>
                                </button>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* In-Modal Theme Switcher Strip */}
                    <div className="py-2 px-1 border-b border-zinc-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0 bg-zinc-900/40 -mx-4 sm:-mx-6 px-4 sm:px-6">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 shrink-0 mr-1">
                            <Palette className="w-3.5 h-3.5 text-emerald-400" />
                            Theme:
                        </span>
                        <div className="flex items-center gap-1.5">
                            {PREVIEW_THEMES.map((theme) => {
                                const isSelected = activeTheme === theme.id;
                                return (
                                    <button
                                        key={theme.id}
                                        type="button"
                                        onClick={() => handleSelectTheme(theme.id)}
                                        className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all duration-150 shrink-0 select-none ${
                                            isSelected
                                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 font-bold shadow-sm shadow-emerald-500/20'
                                                : 'bg-zinc-900/90 text-zinc-400 border border-zinc-800/80 hover:text-white hover:border-zinc-700 hover:bg-zinc-800/80'
                                        }`}
                                    >
                                        <span
                                            className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/40"
                                            style={{ backgroundColor: theme.primaryColor }}
                                        />
                                        <span>{theme.name}</span>
                                        {isSelected && (
                                            <Check className="w-3 h-3 text-emerald-400 stroke-[3] ml-0.5" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Preview Canvas Stage */}
                    <div className="flex-1 w-full h-full min-h-[350px] overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800/80 my-2 relative">
                        {previewMode === 'pdf' ? (
                            loadingPdf ? (
                                <LuxuryLoader 
                                    label={`Generating pixel-perfect ${PREVIEW_THEMES.find(t => t.id === activeTheme)?.name || 'Invoice'} PDF...`}
                                    sublabel="Invoice Studio"
                                    minHeight="h-full min-h-[350px]"
                                />
                            ) : pdfBlobUrl ? (
                                <iframe
                                    key={`${pdfBlobUrl}-${activeTheme}-${renderKey}`}
                                    src={`${pdfBlobUrl}#toolbar=1&navpanes=0`}
                                    className="w-full h-full rounded-xl border-0 bg-zinc-900 shadow-inner"
                                    title="Live PDF Document Preview"
                                />
                            ) : renderError ? (
                                <div className="flex flex-col items-center justify-center h-full text-zinc-400 p-6 text-center gap-3">
                                    <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20 text-red-400">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-semibold text-white">PDF Preview Generation Notice</p>
                                    <p className="text-xs text-zinc-400 max-w-md">{renderError}</p>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleRefresh}
                                        className="btn-green-secondary text-xs h-8"
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                                    <p className="text-xs">Preparing PDF document preview...</p>
                                </div>
                            )
                        ) : (
                            <div className="h-full overflow-y-auto p-4 sm:p-8 flex justify-center bg-zinc-900/90">
                                <div className="w-full max-w-2xl bg-white rounded-lg shadow-2xl overflow-hidden p-6 sm:p-10 text-black">
                                    <InvoiceRenderer
                                        type={invoiceData.invoiceType || 'sales'}
                                        style={invoiceData.theme as any}
                                        data={invoiceData}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Row */}
                    <DialogFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2 border-t border-zinc-800/80 shrink-0">
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>
                                Live A4 PDF • 300 DPI Vector Typography • Matches Final Download 1:1
                            </span>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowPreviewDialog(false)}
                                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs h-9 px-4"
                            >
                                Close
                            </Button>
                            <Button
                                onClick={handleDownloadCurrentPDF}
                                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs h-9 px-4 shadow-lg shadow-emerald-500/20"
                                disabled={previewLoading || loadingPdf}
                            >
                                <Download className="w-3.5 h-3.5 mr-1.5" />
                                {previewLoading ? 'Downloading...' : 'Download This PDF'}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Template Selection Dialog (Visual Carousel) */}
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                <DialogContent className="max-w-[95vw] h-[95vh] p-0 bg-transparent border-none shadow-none z-50">
                    <TemplateSelector
                        onSelect={handleTemplateSelect}
                        initialType={invoiceData.invoiceType}
                        initialStyle={invoiceData.theme as any}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
});

PreviewDialogs.displayName = 'PreviewDialogs';
