'use client';

import React, { useState } from 'react';
import { Check, Layout, Palette } from 'lucide-react';
import { INVOICE_TYPES, TemplateDefinition } from './config/templateConfig';
import { DESIGN_STYLES, StyleDefinition } from './config/styleConfig';
import InvoiceRenderer from './templates/InvoiceRenderer';
import { InvoiceType, InvoiceStyle, InvoiceData } from './types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils'; // Assuming standard utils exist

interface TemplateSelectorProps {
    onSelect: (type: InvoiceType, style: InvoiceStyle) => void;
    initialType?: InvoiceType;
    initialStyle?: InvoiceStyle;
}

// Sample data for checking previews
const SAMPLE_DATA: InvoiceData = {
    invoiceNumber: 'INV-2024-001',
    issuedDate: '2024-03-20',
    dueDate: '2024-04-03',
    from: {
        name: 'Acme Inc.',
        email: 'billing@acme.com',
        address: '123 Innovation Dr',
        city: 'San Francisco, CA 94105',
        company: 'Acme Incorporated'
    },
    to: {
        name: 'Sarah Connor',
        company: 'Cyberdyne Systems',
        email: 'sarah@cyberdyne.com',
        address: '456 Future Ave',
        city: 'Los Angeles, CA 90001'
    },
    items: [
        { description: 'Web Development Services', qty: 40, rate: 150, amount: 6000 },
        { description: 'UI/UX Design Phase', qty: 15, rate: 120, amount: 1800 },
        { description: 'Server Setup', qty: 1, rate: 500, amount: 500 }
    ],
    subtotal: 8300,
    tax: 830,
    total: 9130,
    notes: 'Thank you for your business!',

    // Specific fields for specialized types
    proforma: { validUntil: '2024-03-27', notForPayment: true },
    interim: {
        projectName: 'Skynet Integration',
        milestone: 'Alpha Release',
        percentComplete: 45,
        totalProject: 50000,
        invoicedToDate: 22500
    },
    recurring: {
        subscriptionPeriod: 'Monthly',
        nextBillingDate: '2024-04-20',
        subscriptionDetails: 'Enterprise Plan'
    }
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
    onSelect,
    initialType = 'sales',
    initialStyle = 'corporateMinimal'
}) => {
    const [activeType, setActiveType] = useState<InvoiceType>(initialType);
    const [activeStyle, setActiveStyle] = useState<InvoiceStyle>(initialStyle);

    const handleApply = () => {
        onSelect(activeType, activeStyle);
    };

    return (
        <div className="flex flex-col h-[85vh] w-full max-w-7xl mx-auto bg-background rounded-xl shadow-2xl overflow-hidden border border-border">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Template Gallery</h2>
                    <p className="text-sm text-muted-foreground">Select professional invoice types and premium styles</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setActiveType('sales')}>Reset</Button>
                    <Button onClick={handleApply} className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Use This Template
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">

                {/* Left Sidebar: Controls */}
                <div className="w-80 flex-shrink-0 border-r bg-card flex flex-col">
                    <ScrollArea className="flex-1">
                        <div className="p-6 space-y-8">

                            {/* Section 1: Type Selection */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <Layout className="w-4 h-4 text-primary" />
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Invoice Type</h3>
                                </div>
                                <div className="grid gap-2">
                                    {INVOICE_TYPES.map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setActiveType(type.id)}
                                            className={cn(
                                                "flex items-start gap-3 p-3 w-full text-left rounded-lg transition-all border",
                                                activeType === type.id
                                                    ? "bg-primary/5 border-primary ring-1 ring-primary/20"
                                                    : "hover:bg-muted/50 border-transparent hover:border-border"
                                            )}
                                        >
                                            <div className={cn(
                                                "mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0",
                                                activeType === type.id ? "border-primary bg-primary text-white" : "border-muted-foreground"
                                            )}>
                                                {activeType === type.id && <Check className="w-2.5 h-2.5" />}
                                            </div>
                                            <div>
                                                <div className={cn("text-sm font-medium", activeType === type.id ? "text-primary" : "text-foreground")}>
                                                    {type.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                                    {type.description}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <Separator />

                            {/* Section 2: Style Selection */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <Palette className="w-4 h-4 text-primary" />
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Design Style</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {DESIGN_STYLES.map((style) => (
                                        <button
                                            key={style.id}
                                            onClick={() => setActiveStyle(style.id)}
                                            className={cn(
                                                "relative group flex flex-col items-center p-3 rounded-lg border text-center transition-all",
                                                activeStyle === style.id
                                                    ? "bg-primary/5 border-primary ring-1 ring-primary/20 shadow-sm"
                                                    : "hover:bg-muted/50 border-border hover:border-primary/50"
                                            )}
                                        >
                                            {/* Placeholder for thumbnail - in real app, use style.preview */}
                                            <div className={cn(
                                                "w-full aspect-[3/4] rounded bg-muted mb-3 flex items-center justify-center text-xs text-muted-foreground overflow-hidden",
                                                activeStyle === style.id ? "bg-white" : ""
                                            )}>
                                                {/* Mini visual representation of style */}
                                                <div className={cn("w-[80%] h-[80%] border shadow-sm",
                                                    style.id === 'ultra-luxury' && "bg-white",
                                                    style.id === 'financial' && "bg-white border-double border-4 border-black",
                                                    style.id === 'microsoft' && "border-t-4 border-t-blue-500 bg-gray-50",
                                                    style.id === 'amazon' && "border-l-4 border-orange-400",
                                                    style.id === 'creative-agency' && "bg-gradient-to-br from-pink-500 to-orange-400",
                                                    style.id === 'professional-services' && "border-t-8 border-t-[#002147]"
                                                )}></div>
                                            </div>

                                            <div className="text-xs font-medium">{style.name}</div>

                                            {activeStyle === style.id && (
                                                <div className="absolute top-2 right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center shadow-sm">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </section>

                        </div>
                    </ScrollArea>
                </div>

                {/* Center: Live Preview */}
                <div className="flex-1 bg-muted/20 relative flex flex-col items-center">
                    <div className="w-full h-12 flex items-center justify-center border-b bg-background/50 backdrop-blur text-xs text-muted-foreground">
                        Preview Mode • A4 Layout
                    </div>

                    <ScrollArea className="flex-1 w-full p-8 md:p-12">
                        <div className="min-h-full flex items-center justify-center">
                            <div
                                className="bg-white shadow-xl transition-all duration-300 transform origin-top"
                                style={{
                                    width: '210mm',
                                    minHeight: '297mm',
                                    transform: 'scale(0.85)', // Scale down slightly to fit screens
                                }}
                            >
                                <InvoiceRenderer
                                    type={activeType}
                                    style={activeStyle}
                                    data={SAMPLE_DATA}
                                />
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};

export default TemplateSelector;
