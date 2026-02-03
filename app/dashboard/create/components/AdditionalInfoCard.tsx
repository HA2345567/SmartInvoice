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
        <Card className="card-green-mist animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
                <CardTitle className="text-white">Additional Information</CardTitle>
                <CardDescription className="text-green-muted">Notes and terms for this invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="notes" className="text-white">Notes</Label>
                    <AiInvoiceDescription
                        value={invoiceData.notes}
                        onChange={(val: any) => setInvoiceData((prev: any) => ({ ...prev, notes: val }))}
                        placeholder="Additional notes for the client"
                        className="input-green"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="terms" className="text-white">Terms & Conditions</Label>
                    <AiInvoiceDescription
                        value={invoiceData.terms}
                        onChange={(val: any) => setInvoiceData((prev: any) => ({ ...prev, terms: val }))}
                        placeholder="Payment terms and conditions"
                        className="input-green"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paymentLink" className="text-white">Payment Link (Optional)</Label>
                    <Input
                        id="paymentLink"
                        value={invoiceData.paymentLink}
                        onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, paymentLink: e.target.value }))}
                        placeholder="https://payment-link.com"
                        className="input-green"
                    />
                </div>
            </CardContent>
        </Card >
    );
});

AdditionalInfoCard.displayName = 'AdditionalInfoCard';
