'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Globe, Receipt, Clock, Wallet, FileSpreadsheet } from 'lucide-react';

interface SpecializedFieldsProps {
    invoiceType: string;
    invoiceData: any;
    setInvoiceData: (data: any) => void;
}

export const SpecializedFields = React.memo(({ invoiceType, invoiceData, setInvoiceData }: SpecializedFieldsProps) => {
    if (invoiceType === 'sales') return null;

    const updateField = (field: string, value: any) => {
        setInvoiceData((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <Card className="card-green-mist animate-slide-in border-blue-500/30">
            <CardHeader>
                <CardTitle className="text-white flex items-center text-lg">
                    <Sparkles className="w-5 h-5 mr-2 text-blue-400" />
                    Specialized {invoiceType.replace('-', ' ')} Details
                </CardTitle>
                <CardDescription className="text-green-muted text-xs">Extra details required for this invoice type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
                {/* Proforma */}
                {invoiceType === 'proforma' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 text-sm">
                            <Label className="text-white">Validity Period</Label>
                            <Input
                                value={invoiceData.validityPeriod}
                                onChange={(e) => updateField('validityPeriod', e.target.value)}
                                placeholder="e.g. 30 Days"
                                className="input-green"
                            />
                        </div>
                        <div className="space-y-2 text-sm">
                            <Label className="text-white">Estimated Delivery</Label>
                            <Input
                                value={invoiceData.estimatedDelivery}
                                onChange={(e) => updateField('estimatedDelivery', e.target.value)}
                                placeholder="e.g. 2 weeks after order"
                                className="input-green"
                            />
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                            <Switch
                                checked={invoiceData.notForPaymentNote}
                                onCheckedChange={(checked) => updateField('notForPaymentNote', checked)}
                            />
                            <Label className="text-white text-xs cursor-pointer">Show "Not for Payment" note</Label>
                        </div>
                    </div>
                )}

                {/* Interim/Final */}
                {(invoiceType === 'interim' || invoiceType === 'final') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 text-sm">
                            <Label className="text-white">Project Name</Label>
                            <Input
                                value={invoiceData.projectName}
                                onChange={(e) => updateField('projectName', e.target.value)}
                                placeholder="Project Omega"
                                className="input-green"
                            />
                        </div>
                        <div className="space-y-2 text-sm">
                            <Label className="text-white">Milestone Description</Label>
                            <Input
                                value={invoiceData.milestoneDescription}
                                onChange={(e) => updateField('milestoneDescription', e.target.value)}
                                placeholder="Initial Design Handoff"
                                className="input-green"
                            />
                        </div>
                        <div className="space-y-2 text-sm">
                            <Label className="text-white">Completion (%)</Label>
                            <Input
                                type="number"
                                value={invoiceData.percentComplete}
                                onChange={(e) => updateField('percentComplete', parseFloat(e.target.value) || 0)}
                                className="input-green"
                            />
                        </div>
                    </div>
                )}

                {/* Recurring */}
                {invoiceType === 'recurring' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 text-sm">
                            <Label className="text-white">Billing Cycle</Label>
                            <Select
                                value={invoiceData.billingCycle}
                                onValueChange={(val) => updateField('billingCycle', val)}
                            >
                                <SelectTrigger className="input-green">
                                    <SelectValue placeholder="Select cycle" />
                                </SelectTrigger>
                                <SelectContent className="bg-green-900 border-green-500/30">
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="quarterly">Quarterly</SelectItem>
                                    <SelectItem value="annually">Annually</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 text-sm">
                            <Label className="text-white">Next Billing Date</Label>
                            <Input
                                type="date"
                                value={invoiceData.nextBillingDate}
                                onChange={(e) => updateField('nextBillingDate', e.target.value)}
                                className="input-green"
                            />
                        </div>
                    </div>
                )}

                {/* Credit Note */}
                {invoiceType === 'credit-note' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 text-sm">
                            <Label className="text-white">Original Invoice #</Label>
                            <Input
                                value={invoiceData.originalInvoiceNumber}
                                onChange={(e) => updateField('originalInvoiceNumber', e.target.value)}
                                placeholder="INV-2024-001"
                                className="input-green"
                            />
                        </div>
                        <div className="space-y-2 text-sm">
                            <Label className="text-white">Reason for Credit</Label>
                            <Input
                                value={invoiceData.creditReason}
                                onChange={(e) => updateField('creditReason', e.target.value)}
                                placeholder="Return of damaged goods"
                                className="input-green"
                            />
                        </div>
                    </div>
                )}

                {/* Commercial - Phase 2 */}
                {invoiceType === 'commercial' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <Label className="text-white"><Globe className="w-3 h-3 inline mr-1" /> HS Code</Label>
                            <Input
                                value={invoiceData.hsCode}
                                onChange={(e) => updateField('hsCode', e.target.value)}
                                placeholder="8471.30.0000"
                                className="input-green"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white">Country of Origin</Label>
                            <Input
                                value={invoiceData.countryOfOrigin}
                                onChange={(e) => updateField('countryOfOrigin', e.target.value)}
                                placeholder="United States"
                                className="input-green"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white">Shipping Terms (Incoterms)</Label>
                            <Select
                                value={invoiceData.shippingTerms}
                                onValueChange={(val) => updateField('shippingTerms', val)}
                            >
                                <SelectTrigger className="input-green">
                                    <SelectValue placeholder="FOB, CIF, EXW..." />
                                </SelectTrigger>
                                <SelectContent className="bg-green-900 border-green-500/30">
                                    <SelectItem value="FOB">FOB - Free On Board</SelectItem>
                                    <SelectItem value="CIF">CIF - Cost, Insurance, and Freight</SelectItem>
                                    <SelectItem value="EXW">EXW - Ex Works</SelectItem>
                                    <SelectItem value="DDP">DDP - Delivered Duty Paid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* Timesheet */}
                {invoiceType === 'timesheet' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                            <Label className="text-white"><Clock className="w-3 h-3 inline mr-1" /> Consultant</Label>
                            <Input
                                value={invoiceData.consultantName}
                                onChange={(e) => updateField('consultantName', e.target.value)}
                                className="input-green"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white">Rate Override</Label>
                            <Input
                                type="number"
                                value={invoiceData.hourlyRate}
                                onChange={(e) => updateField('hourlyRate', parseFloat(e.target.value) || 0)}
                                className="input-green"
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

SpecializedFields.displayName = 'SpecializedFields';
