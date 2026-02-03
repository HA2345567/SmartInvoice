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
        <Card className="card-green-mist animate-slide-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
                <CardTitle className="text-white flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-primary" />
                    Client Information
                </CardTitle>
                <CardDescription className="text-green-muted">Select existing client or enter new details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Client Search/Selection */}
                <div className="space-y-2">
                    <Label htmlFor="clientSearch" className="text-white">Client *</Label>
                    <AiClientSelector
                        clients={clients}
                        onSelect={selectClient}
                        value={clientSearch}
                        onChange={handleClientSearch}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="clientEmail" className="text-white">Client Email *</Label>
                        <Input
                            id="clientEmail"
                            type="email"
                            value={invoiceData.clientEmail}
                            onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, clientEmail: e.target.value }))}
                            placeholder="client@example.com"
                            className="input-green"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="clientCompany" className="text-white">Company</Label>
                        <Input
                            id="clientCompany"
                            value={invoiceData.clientCompany}
                            onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, clientCompany: e.target.value }))}
                            placeholder="Company name (optional)"
                            className="input-green"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="clientAddress" className="text-white">Client Address</Label>
                    <Textarea
                        id="clientAddress"
                        value={invoiceData.clientAddress}
                        onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, clientAddress: e.target.value }))}
                        placeholder="Enter client address"
                        rows={3}
                        className="input-green"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="clientGST" className="text-white">GST/VAT Number</Label>
                        <Input
                            id="clientGST"
                            value={invoiceData.clientGST}
                            onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, clientGST: e.target.value }))}
                            placeholder="GST/VAT number (optional)"
                            className="input-green"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="clientCurrency" className="text-white">Currency</Label>
                        <Select
                            value={invoiceData.clientCurrency}
                            onValueChange={(value) => setInvoiceData((prev: any) => ({ ...prev, clientCurrency: value }))}
                        >
                            <SelectTrigger className="input-green">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-green-900 border-green-500/30">
                                <SelectItem value="$">USD - US Dollar</SelectItem>
                                <SelectItem value="€">EUR - Euro</SelectItem>
                                <SelectItem value="£">GBP - British Pound</SelectItem>
                                <SelectItem value="₹">INR - Indian Rupee</SelectItem>
                                <SelectItem value="C$">CAD - Canadian Dollar</SelectItem>
                                <SelectItem value="A$">AUD - Australian Dollar</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card >
    );
});

ClientInformationCard.displayName = 'ClientInformationCard';
