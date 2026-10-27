'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sparkles, FileText, Eye, Download, AlertCircle } from 'lucide-react';

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
            {/* Tax & Discount Options */}
            <Card className="card-green-mist animate-slide-in" style={{ animationDelay: '0.4s' }}>
                <CardHeader>
                    <CardTitle className="text-white">Tax & Discount</CardTitle>
                    <CardDescription className="text-green-muted">Configure tax and discount rates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="taxRate" className="text-white">Tax Rate (%)</Label>
                        <Input
                            id="taxRate"
                            type="number"
                            value={invoiceData.taxRate}
                            onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="0"
                            className="input-green"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="discountRate" className="text-white">Discount Rate (%)</Label>
                        <Input
                            id="discountRate"
                            type="number"
                            value={invoiceData.discountRate}
                            onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, discountRate: parseFloat(e.target.value) || 0 }))}
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="0"
                            className="input-green"
                        />
                    </div>
                </CardContent>
            </Card >

            {/* Invoice Summary */}
            <Card className="card-green-mist animate-slide-in" style={{ animationDelay: '0.5s' }}>
                <CardHeader>
                    <CardTitle className="text-white">Invoice Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="flex justify-between text-green-muted">
                            <span>Subtotal:</span>
                            <span>{invoiceData.clientCurrency}{totals.subtotal.toFixed(2)}</span>
                        </div>

                        {invoiceData.discountRate > 0 && (
                            <div className="flex justify-between text-green-muted">
                                <span>Discount ({invoiceData.discountRate}%):</span>
                                <span className="text-red-400">-{invoiceData.clientCurrency}{totals.discountAmount.toFixed(2)}</span>
                            </div>
                        )}

                        {invoiceData.taxRate > 0 && (
                            <div className="flex justify-between text-green-muted">
                                <span>Tax ({invoiceData.taxRate}%):</span>
                                <span>{invoiceData.clientCurrency}{totals.taxAmount.toFixed(2)}</span>
                            </div>
                        )}

                        <Separator className="bg-green-500/30" />

                        <div className="flex justify-between text-lg font-bold text-white">
                            <span>Total:</span>
                            <span className="text-green-primary">{invoiceData.clientCurrency}{totals.total.toFixed(2)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card >

            {/* Premium PDF Features */}
            <Card className="card-green-mist animate-slide-in" style={{ animationDelay: '0.6s' }}>
                <CardHeader>
                    <CardTitle className="text-white flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-green-primary" />
                        Premium PDF Features
                    </CardTitle>
                    <CardDescription className="text-green-muted">Professional invoice design</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center space-x-2 mb-2">
                            <FileText className="w-4 h-4 text-green-primary" />
                            <span className="text-sm font-medium text-white">Modern Design</span>
                        </div>
                        <p className="text-xs text-green-muted">Clean, professional layout with premium typography</p>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center space-x-2 mb-2">
                            <Eye className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-medium text-white">Live Preview</span>
                        </div>
                        <p className="text-xs text-green-muted">See exactly how your invoice will look</p>
                    </div>
                    <Button
                        onClick={handlePreviewInModal}
                        className="w-full btn-green-secondary"
                        disabled={loading || previewLoading}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Quick Preview
                    </Button>
                    <Button
                        onClick={handlePreview}
                        className="w-full btn-green-primary"
                        disabled={loading || previewLoading}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        {previewLoading ? 'Generating...' : 'Download Premium PDF'}
                    </Button>
                </CardContent>
            </Card >

            {/* Validation Notice */}
            <Card className="card-green-mist animate-slide-in" style={{ animationDelay: '0.7s' }}>
                <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-white">Required Fields</p>
                            <p className="text-sm text-green-muted mt-1">
                                Make sure to fill in client name, email, due date, and at least one item before saving.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card >
        </div>
    );
});

InvoiceSidebarCards.displayName = 'InvoiceSidebarCards';
