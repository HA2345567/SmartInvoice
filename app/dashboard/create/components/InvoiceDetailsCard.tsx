'use client';

import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvoiceDetailsCardProps {
    invoiceData: any;
    setInvoiceData: (data: any) => void;
}

export const InvoiceDetailsCard = React.memo(({ invoiceData, setInvoiceData }: InvoiceDetailsCardProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast({
                title: 'Invalid File',
                description: 'Please upload an image file (PNG, JPG, SVG, or WebP).',
                variant: 'destructive',
            });
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast({
                title: 'File Too Large',
                description: 'Logo size must be under 2MB.',
                variant: 'destructive',
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const rawDataUrl = reader.result as string;
            const img = new Image();
            img.onload = () => {
                // Ensure image is processed cleanly through canvas as PNG preserving exact natural aspect ratio
                const canvas = document.createElement('canvas');
                const maxDim = 800;
                let w = img.naturalWidth || 400;
                let h = img.naturalHeight || 400;
                if (w > maxDim || h > maxDim) {
                    if (w > h) {
                        h = Math.round((h * maxDim) / w);
                        w = maxDim;
                    } else {
                        w = Math.round((w * maxDim) / h);
                        h = maxDim;
                    }
                }
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, w, h);
                    const cleanPngUrl = canvas.toDataURL('image/png');
                    setInvoiceData((prev: any) => ({ ...prev, companyLogo: cleanPngUrl }));
                    try {
                        localStorage.setItem('savedCompanyLogo', cleanPngUrl);
                    } catch (err) {}
                } else {
                    setInvoiceData((prev: any) => ({ ...prev, companyLogo: rawDataUrl }));
                    try {
                        localStorage.setItem('savedCompanyLogo', rawDataUrl);
                    } catch (err) {}
                }
                toast({
                    title: 'Logo Added',
                    description: 'Brand logo will fit proportionally in the top right corner without distortion.',
                });
            };
            img.onerror = () => {
                setInvoiceData((prev: any) => ({ ...prev, companyLogo: rawDataUrl }));
            };
            img.src = rawDataUrl;
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveLogo = (e: React.MouseEvent) => {
        e.stopPropagation();
        setInvoiceData((prev: any) => ({ ...prev, companyLogo: '' }));
        try {
            localStorage.removeItem('savedCompanyLogo');
        } catch (err) {}
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        toast({
            title: 'Logo Removed',
            description: 'Brand logo removed from invoice header.',
        });
    };

    return (
        <Card className="rounded-2xl border border-white/[0.08] bg-[#181818]">
            <CardHeader className="p-6 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <CardTitle className="text-lg font-normal tracking-tight text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-white/40" />
                            <span>Document Details</span>
                        </CardTitle>
                        <CardDescription className="text-xs text-white/40 mt-0.5">
                            Core identification numbers, dates, and brand header
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Left 2 Columns: Invoice Numbers & Dates */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="invoiceNumber" className="text-xs font-normal text-white/60">Invoice Number</Label>
                                <Input
                                    id="invoiceNumber"
                                    value={invoiceData.invoiceNumber}
                                    onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, invoiceNumber: e.target.value }))}
                                    placeholder="INV-0001"
                                    className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="date" className="text-xs font-normal text-white/60">Issue Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={invoiceData.date}
                                    onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, date: e.target.value }))}
                                    className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="dueDate" className="text-xs font-normal text-white/60">Due Date *</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={invoiceData.dueDate}
                                onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, dueDate: e.target.value }))}
                                className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                                required
                            />
                        </div>
                    </div>

                    {/* Right Column: Logo Upload */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between mb-1">
                            <Label className="text-xs font-normal text-white/60 flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5 text-white/40" />
                                <span>Company Logo</span>
                            </Label>
                            <span className="text-[10px] text-white/30 uppercase tracking-wider font-mono">
                                PDF Header
                            </span>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleLogoUpload}
                            accept="image/*"
                            className="hidden"
                        />

                        {invoiceData.companyLogo ? (
                            <div className="relative group rounded-xl border border-white/10 bg-[#121212] p-3 flex flex-col items-center justify-center min-h-[110px] transition-all hover:border-white/20">
                                <div className="bg-white p-2 rounded-md max-h-[65px] max-w-[140px] flex items-center justify-center">
                                    <img
                                        src={invoiceData.companyLogo}
                                        alt="Company Logo Preview"
                                        className="max-h-[50px] max-w-[120px] object-contain"
                                    />
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="h-6 text-[11px] px-2 text-white/60 hover:text-white rounded-md"
                                    >
                                        Change
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="ghost"
                                        onClick={handleRemoveLogo}
                                        className="h-6 text-[11px] px-2 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-md"
                                    >
                                        <Trash2 className="w-3 h-3 mr-1" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="cursor-pointer border border-dashed border-white/15 hover:border-white/30 rounded-xl p-3 flex flex-col items-center justify-center min-h-[110px] transition-all bg-white/[0.01] hover:bg-white/[0.03] group text-center"
                            >
                                <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/50 mb-1.5 group-hover:text-white transition-colors">
                                    <Upload className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs font-normal text-white/80 group-hover:text-white transition-colors">
                                    Upload Logo
                                </span>
                                <span className="text-[10px] text-white/30 mt-0.5 font-mono">
                                    PNG, JPG • Max 2MB
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});

InvoiceDetailsCard.displayName = 'InvoiceDetailsCard';
