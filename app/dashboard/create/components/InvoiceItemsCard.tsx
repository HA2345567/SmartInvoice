'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { InvoiceItem } from '@/types/invoice';

interface InvoiceItemsCardProps {
    invoiceData: any;
    addItem: () => void;
    updateItem: (id: string, field: keyof InvoiceItem, value: string | number) => void;
    removeItem: (id: string) => void;
    fetchItemSuggestions: (query: string) => void;
    itemSuggestions: any[];
    setItemSuggestions: (suggestions: any[]) => void;
}

export const InvoiceItemsCard = React.memo(({
    invoiceData,
    addItem,
    updateItem,
    removeItem,
    fetchItemSuggestions,
    itemSuggestions,
    setItemSuggestions
}: InvoiceItemsCardProps) => {
    return (
        <Card className="rounded-2xl border border-white/[0.08] bg-[#181818]">
            <CardHeader className="p-6 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <CardTitle className="text-lg font-normal tracking-tight text-white">Line Items</CardTitle>
                        <CardDescription className="text-xs text-white/40 mt-0.5">
                            Products, deliverables, or billable services included in this document
                        </CardDescription>
                    </div>
                    <Button
                        onClick={addItem}
                        size="sm"
                        variant="outline"
                        className="rounded-full border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white text-xs h-8 px-3 inline-flex items-center gap-1.5"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add Line Item
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-2">
                <div className="overflow-x-auto">
                    {/* Header Row */}
                    <div className="min-w-[600px] grid grid-cols-12 gap-3 pb-2 border-b border-white/[0.06] text-[11px] font-medium uppercase tracking-wider text-white/40">
                        <div className="col-span-6">Description</div>
                        <div className="col-span-2">Quantity</div>
                        <div className="col-span-2">Rate ({invoiceData.clientCurrency || '$'})</div>
                        <div className="col-span-2 text-right pr-8">Amount</div>
                    </div>

                    {/* Item Rows */}
                    <div className="min-w-[600px] divide-y divide-white/[0.04]">
                        {invoiceData.items.map((item: any, index: number) => (
                            <div key={item.id || index} className="grid grid-cols-12 gap-3 py-3 items-center group">
                                <div className="col-span-6 relative">
                                    <Input
                                        id={`description-${item.id}`}
                                        value={item.description}
                                        onChange={(e: any) => {
                                            updateItem(item.id, 'description', e.target.value);
                                            fetchItemSuggestions(e.target.value);
                                        }}
                                        placeholder="Item or service description"
                                        className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white placeholder:text-white/20 focus:border-[#1ed760]/60 focus:bg-[#151515]"
                                        required
                                    />
                                    {itemSuggestions.length > 0 && item.description && (
                                        <div className="absolute z-20 w-full mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl max-h-40 overflow-y-auto backdrop-blur-md">
                                            {itemSuggestions.map((suggestion: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="px-3 py-2 hover:bg-white/[0.06] cursor-pointer text-xs text-white/90 transition-colors"
                                                    onClick={() => {
                                                        updateItem(item.id, 'description', suggestion.description);
                                                        setItemSuggestions([]);
                                                    }}
                                                >
                                                    {suggestion.description}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <Input
                                        id={`quantity-${item.id}`}
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e: any) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.01"
                                        className="h-9 text-xs font-mono rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60 text-center"
                                        required
                                    />
                                </div>

                                <div className="col-span-2">
                                    <div className="relative">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-white/40 select-none">
                                            {invoiceData.clientCurrency || '$'}
                                        </span>
                                        <Input
                                            id={`rate-${item.id}`}
                                            type="number"
                                            value={item.rate || ''}
                                            onChange={(e: any) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                            min="0"
                                            step="0.01"
                                            className="h-9 text-xs font-mono rounded-lg border-white/10 bg-[#121212] text-white pl-6 focus:border-[#1ed760]/60"
                                            placeholder="0.00"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2 flex items-center justify-between pl-2">
                                    <span className="text-xs font-mono font-medium text-white/90 tracking-tight">
                                        {invoiceData.clientCurrency || '$'}{Number(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    {invoiceData.items.length > 1 ? (
                                        <Button
                                            onClick={() => removeItem(item.id)}
                                            size="sm"
                                            variant="ghost"
                                            className="h-7 w-7 p-0 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                            title="Delete line item"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    ) : (
                                        <div className="w-7" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});

InvoiceItemsCard.displayName = 'InvoiceItemsCard';

