'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';

interface InvoiceDetailsCardProps {
    invoiceData: any;
    setInvoiceData: (data: any) => void;
}

export const InvoiceDetailsCard = React.memo(({ invoiceData, setInvoiceData }: InvoiceDetailsCardProps) => {
    return (
        <Card className="card-green-mist animate-slide-in">
            <CardHeader>
                <CardTitle className="text-white flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-green-primary" />
                    Invoice Details
                </CardTitle>
                <CardDescription className="text-green-muted">Basic information about this invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="invoiceNumber" className="text-white">Invoice Number</Label>
                        <Input
                            id="invoiceNumber"
                            value={invoiceData.invoiceNumber}
                            onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, invoiceNumber: e.target.value }))}
                            placeholder="Auto-generated"
                            className="input-green"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date" className="text-white">Invoice Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={invoiceData.date}
                            onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, date: e.target.value }))}
                            className="input-green"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-white">Due Date *</Label>
                    <Input
                        id="dueDate"
                        type="date"
                        value={invoiceData.dueDate}
                        onChange={(e: any) => setInvoiceData((prev: any) => ({ ...prev, dueDate: e.target.value }))}
                        className="input-green"
                        required
                    />
                </div>
            </CardContent>
        </Card>
    );
});

InvoiceDetailsCard.displayName = 'InvoiceDetailsCard';
