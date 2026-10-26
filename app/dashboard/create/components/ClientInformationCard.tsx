'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User } from 'lucide-react';
import { AiClientSelector } from '@/components/ai/smart-inputs/AiClientSelector';

interface ClientInformationCardProps {
    invoiceData: any;
    setInvoiceData: (data: any) => void;
    clients: any[];
    selectClient: (client: any) => void;
    clientSearch: string;
    handleClientSearch: (value: string) => void;
}

export const ClientInformationCard = React.memo(({
    invoiceData,
    setInvoiceData,
    clients,
    selectClient,
    clientSearch,
    handleClientSearch
}: ClientInformationCardProps) => {
    return (
        <Card className="rounded-2xl border border-white/[0.08] bg-[#181818]">
            <CardHeader className="p-6 pb-4">
                <CardTitle className="text-lg font-normal tracking-tight text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-white/40" />
                    <span>Client Details</span>
                </CardTitle>
                <CardDescription className="text-xs text-white/40 mt-0.5">
                    Select a saved client from your directory or input new recipient info
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
                {/* Client Search/Selection */}
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="clientSearch" className="text-xs font-normal text-white/60">Client Name *</Label>
                        <span className="text-[11px] text-white/30">Type name or choose existing</span>
                    </div>
                    <AiClientSelector
                        clients={clients}
                        onSelect={(client: any) => {
                            selectClient(client);
                        }}
                        value={invoiceData.clientName || clientSearch || ''}
                        onChange={(value: string) => {
                            handleClientSearch(value);
                            setInvoiceData((prev: any) => ({ ...prev, clientName: value }));
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="clientEmail" className="text-xs font-normal text-white/60">Client Email *</Label>
                        <Input
                            id="clientEmail"
                            type="email"
                            value={invoiceData.clientEmail}
                            onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, clientEmail: e.target.value }))}
                            placeholder="client@company.com"
                            className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="clientCompany" className="text-xs font-normal text-white/60">Company Name</Label>
                        <Input
                            id="clientCompany"
                            value={invoiceData.clientCompany}
                            onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, clientCompany: e.target.value }))}
                            placeholder="Organization / Brand (optional)"
                            className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="clientAddress" className="text-xs font-normal text-white/60">Billing Address</Label>
                    <Textarea
                        id="clientAddress"
                        value={invoiceData.clientAddress}
                        onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, clientAddress: e.target.value }))}
                        placeholder="Street, suite, city, state, postal code, country"
                        rows={2}
                        className="text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60 resize-none py-2"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="clientGST" className="text-xs font-normal text-white/60">Tax ID / VAT / GST</Label>
                        <Input
                            id="clientGST"
                            value={invoiceData.clientGST}
                            onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, clientGST: e.target.value }))}
                            placeholder="Tax identifier (optional)"
                            className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="clientCurrency" className="text-xs font-normal text-white/60">Currency</Label>
                        <Select
                            value={invoiceData.clientCurrency}
                            onValueChange={(value) => setInvoiceData((prev: any) => ({ ...prev, clientCurrency: value }))}
                        >
                            <SelectTrigger className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                                <SelectItem value="$">USD ($) - US Dollar</SelectItem>
                                <SelectItem value="€">EUR (€) - Euro</SelectItem>
                                <SelectItem value="£">GBP (£) - British Pound</SelectItem>
                                <SelectItem value="₹">INR (₹) - Indian Rupee</SelectItem>
                                <SelectItem value="C$">CAD (C$) - Canadian Dollar</SelectItem>
                                <SelectItem value="A$">AUD (A$) - Australian Dollar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});

ClientInformationCard.displayName = 'ClientInformationCard';

