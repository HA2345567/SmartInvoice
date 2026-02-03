'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Sparkles, Trash2 } from 'lucide-react';

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
    const isFree = user?.subscriptionTier === 'free';

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (isFree) {
            toast({
                title: "Pro Feature",
                description: "Logo upload is only available for Pro users.",
                variant: "destructive"
            });
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload/logo', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');
            const { url } = await response.json();
            setInvoiceData((prev: any) => ({ ...prev, companyLogo: url }));
            toast({ title: "Success", description: "Logo uploaded successfully" });
        } catch (error) {
            toast({ title: "Error", description: "Failed to upload logo", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="card-green-mist animate-slide-in">
            <CardHeader>
                <CardTitle className="text-white flex items-center text-lg">
                    <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                    Professional Features
                    {isFree && <span className="ml-2 px-2 py-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/40">PRO</span>}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                    <Label className="text-white text-sm">Company Logo</Label>
                    <div className="flex gap-2">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="input-green text-xs"
                            disabled={isFree || loading}
                        />
                        {invoiceData.companyLogo && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setInvoiceData((prev: any) => ({ ...prev, companyLogo: '' }))}
                                className="btn-green-secondary"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                    <div className="space-y-0.5">
                        <Label className="text-white text-sm">White-Label Mode</Label>
                        <p className="text-[10px] text-green-muted">Remove "Powered by SmartInvoice"</p>
                    </div>
                    <Switch
                        checked={invoiceData.whiteLabelMode}
                        onCheckedChange={(checked) => {
                            if (isFree) {
                                toast({ title: "Pro Feature", description: "Upgrade to remove branding!" });
                                return;
                            }
                            setInvoiceData((prev: any) => ({ ...prev, whiteLabelMode: checked }));
                        }}
                        disabled={isFree}
                    />
                </div>
            </CardContent>
        </Card>
    );
});

ProfessionalFeatures.displayName = 'ProfessionalFeatures';
