'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AiInvoiceDescription } from '@/components/ai/smart-inputs/AiInvoiceDescription';

interface AdditionalInfoCardProps {
    invoiceData: any;
    setInvoiceData: (data: any) => void;
}

export const AdditionalInfoCard = React.memo(({
    invoiceData,
    setInvoiceData
}: AdditionalInfoCardProps) => {
    return (
        <Card className="rounded-2xl border border-white/[0.08] bg-[#181818]">
            <CardHeader className="p-6 pb-4">
                <CardTitle className="text-lg font-normal tracking-tight text-white">Additional Details</CardTitle>
                <CardDescription className="text-xs text-white/40 mt-0.5">Payment terms, client notes, and direct payment link</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-xs font-normal text-white/60">Client Notes</Label>
                    <AiInvoiceDescription
                        value={invoiceData.notes}
                        onChange={(val: any) => setInvoiceData((prev: any) => ({ ...prev, notes: val }))}
                        placeholder="Thank you for your partnership. Wire instructions enclosed below."
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="terms" className="text-xs font-normal text-white/60">Terms & Conditions</Label>
                    <AiInvoiceDescription
                        value={invoiceData.terms}
                        onChange={(val: any) => setInvoiceData((prev: any) => ({ ...prev, terms: val }))}
                        placeholder="Payment due within 30 days. Late remittances subject to a 1.5% fee."
                    />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="paymentLink" className="text-xs font-normal text-white/60">Payment Link (Optional)</Label>
                    <Input
                        id="paymentLink"
                        value={invoiceData.paymentLink}
                        onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, paymentLink: e.target.value }))}
                        placeholder="https://buy.stripe.com/..."
                        className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                    />
                </div>
            </CardContent>
        </Card>
    );
});

AdditionalInfoCard.displayName = 'AdditionalInfoCard';
