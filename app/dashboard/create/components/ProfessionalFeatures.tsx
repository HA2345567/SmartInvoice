'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Crown } from 'lucide-react';

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
        <Card className="rounded-2xl border border-white/[0.08] bg-[#181818]">
            <CardHeader className="p-6 pb-4">
                <CardTitle className="text-lg font-normal tracking-tight text-white flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Presentation Settings</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
                <div className="flex items-center justify-between p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                    <div className="space-y-0.5">
                        <Label className="text-xs font-normal text-white/80">White-Label Export</Label>
                        <p className="text-[11px] text-white/40">Omit &quot;Powered by SmartInvoice&quot; branding from generated PDF</p>
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
