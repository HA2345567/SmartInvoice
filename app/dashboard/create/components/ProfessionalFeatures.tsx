'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Sparkles } from 'lucide-react';

interface ProfessionalFeaturesProps {
    user: any;
    token: string;
    invoiceData: any;
    setInvoiceData: (data: any) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    toast: any;
}

export const ProfessionalFeatures = React.memo(({
    user,
    token,
    invoiceData,
    setInvoiceData,
    loading,
    setLoading,
    toast
}: ProfessionalFeaturesProps) => {
    return (
        <Card className="card-green-mist animate-slide-in">
            <CardHeader>
                <CardTitle className="text-white flex items-center text-lg">
                    <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                    Professional Features
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
                <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                    <div className="space-y-0.5">
                        <Label className="text-white text-sm">White-Label Mode</Label>
                        <p className="text-[10px] text-green-muted">Remove "Powered by SmartInvoice"</p>
                    </div>
                    <Switch
                        checked={invoiceData.whiteLabelMode}
                        onCheckedChange={(checked) => {
                            setInvoiceData((prev: any) => ({ ...prev, whiteLabelMode: checked }));
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    );
});

ProfessionalFeatures.displayName = 'ProfessionalFeatures';
