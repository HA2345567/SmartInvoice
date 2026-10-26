'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, Download, Info } from 'lucide-react';

interface InvoiceSidebarProps {
    invoiceData: any;
    setInvoiceData: (data: any) => void;
    totals: any;
    handlePreviewInModal: () => void;
    handlePreview: () => void;
    loading: boolean;
    previewLoading: boolean;
}

export const InvoiceSidebarCards = React.memo(({
    invoiceData,
    setInvoiceData,
    totals,
    handlePreviewInModal,
    handlePreview,
    loading,
    previewLoading
}: InvoiceSidebarProps) => {
    return (
        <div className="space-y-6">
            {/* Invoice Summary */}
            <Card className="rounded-2xl border border-white/[0.08] bg-[#181818]">
                <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-base font-normal tracking-tight text-white">Summary</CardTitle>
                    <CardDescription className="text-xs text-white/40">Financial computation breakdown</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                    <div className="space-y-2.5 text-xs text-white/60">
                        <div className="flex justify-between items-center">
                            <span>Subtotal</span>
                            <span className="font-mono text-white/90">{invoiceData.clientCurrency || '$'}{totals.subtotal.toFixed(2)}</span>
                        </div>

                        {invoiceData.discountRate > 0 && (
                            <div className="flex justify-between items-center text-amber-400/80">
                                <span>Discount ({invoiceData.discountRate}%)</span>
                                <span className="font-mono">-{invoiceData.clientCurrency || '$'}{totals.discountAmount.toFixed(2)}</span>
                            </div>
                        )}

                        {invoiceData.taxRate > 0 && (
                            <div className="flex justify-between items-center">
                                <span>Tax ({invoiceData.taxRate}%)</span>
                                <span className="font-mono text-white/90">+{invoiceData.clientCurrency || '$'}{totals.taxAmount.toFixed(2)}</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-baseline justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-white/50">Total Due</span>
                        <div className="text-right">
                            <span className="text-2xl font-light text-white font-mono tracking-tight">
                                {invoiceData.clientCurrency || '$'}{totals.total.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/[0.06] space-y-2">
                        <Button
                            onClick={handlePreviewInModal}
                            variant="outline"
                            className="w-full rounded-full border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white text-xs h-9 inline-flex items-center justify-center gap-2"
                            disabled={loading || previewLoading}
                        >
                            <Eye className="w-3.5 h-3.5 text-white/60" />
                            Live Preview
                        </Button>
                        <Button
                            onClick={handlePreview}
                            className="w-full rounded-full bg-[#1ed760] text-black hover:bg-[#1fdf64] font-medium text-xs h-9 inline-flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
                            disabled={loading || previewLoading}
                        >
                            <Download className="w-3.5 h-3.5" />
                            {previewLoading ? 'Generating...' : 'Download PDF'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tax & Discount Options */}
            <Card className="rounded-2xl border border-white/[0.08] bg-[#181818]">
                <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-base font-normal tracking-tight text-white">Adjustments</CardTitle>
                    <CardDescription className="text-xs text-white/40">Tax & discount percentages</CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="taxRate" className="text-xs font-normal text-white/60">Tax Rate (%)</Label>
                            <span className="text-[11px] text-white/30 font-mono">0 - 100%</span>
                        </div>
                        <Input
                            id="taxRate"
                            type="number"
                            value={invoiceData.taxRate || ''}
                            onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="0"
                            className="h-9 text-xs font-mono rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="discountRate" className="text-xs font-normal text-white/60">Discount (%)</Label>
                            <span className="text-[11px] text-white/30 font-mono">0 - 100%</span>
                        </div>
                        <Input
                            id="discountRate"
                            type="number"
                            value={invoiceData.discountRate || ''}
                            onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, discountRate: parseFloat(e.target.value) || 0 }))}
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="0"
                            className="h-9 text-xs font-mono rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Validation Notice */}
            <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.01] flex items-start gap-3">
                <Info className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                <div className="text-[11px] text-white/40 leading-relaxed">
                    <span className="text-white/70 font-medium block mb-0.5">Required for export:</span>
                    Client name, email, due date, and at least one line item are required before finalizing the document.
                </div>
            </div>
        </div>
    );
});

InvoiceSidebarCards.displayName = 'InvoiceSidebarCards';

