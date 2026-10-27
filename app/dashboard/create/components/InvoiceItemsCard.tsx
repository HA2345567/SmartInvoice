'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
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
        <Card className="card-green-mist animate-slide-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="text-white">Invoice Items</CardTitle>
                        <CardDescription className="text-green-muted">Add products or services</CardDescription>
                    </div>
                    <Button onClick={addItem} size="sm" className="btn-green-secondary">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Item
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {invoiceData.items.map((item: any) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 items-end p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                            <div className="col-span-5">
                                <Label htmlFor={`description-${item.id}`} className="text-white">Description *</Label>
                                <div className="relative">
                                    <Input
                                        id={`description-${item.id}`}
                                        value={item.description}
                                        onChange={(e: any) => {
                                            updateItem(item.id, 'description', e.target.value);
                                            fetchItemSuggestions(e.target.value);
                                        }}
                                        placeholder="Item description"
                                        className="input-green"
                                        required
                                    />
                                    {itemSuggestions.length > 0 && item.description && (
                                        <div className="absolute z-10 w-full mt-1 bg-green-900/95 border border-green-500/30 rounded-lg shadow-lg max-h-40 overflow-y-auto backdrop-blur-sm">
                                            {itemSuggestions.map((suggestion: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="p-2 hover:bg-green-500/20 cursor-pointer text-sm text-white"
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
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor={`quantity-${item.id}`} className="text-white">Qty *</Label>
                                <Input
                                    id={`quantity-${item.id}`}
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e: any) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                    min="0"
                                    step="0.01"
                                    className="input-green"
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                <Label htmlFor={`rate-${item.id}`} className="text-white text-xs font-bold mb-1.5 block">Rate *</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-green-400 select-none">
                                        {invoiceData.clientCurrency || '$'}
                                    </span>
                                    <Input
                                        id={`rate-${item.id}`}
                                        type="number"
                                        value={item.rate || ''}
                                        onChange={(e: any) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.01"
                                        className="input-green pl-7 font-bold text-white text-sm"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <Label className="text-white text-xs font-bold mb-1.5 block">Amount</Label>
                                <div className="h-10 px-3 rounded-md bg-green-500/10 border border-green-500/30 text-white font-extrabold text-sm flex items-center justify-between shadow-sm">
                                    <span className="text-xs text-green-400 font-bold">{invoiceData.clientCurrency || '$'}</span>
                                    <span className="text-sm font-extrabold text-green-300 font-mono tracking-wide">
                                        {Number(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                            <div className="col-span-1">
                                {invoiceData.items.length > 1 && (
                                    <Button
                                        onClick={() => removeItem(item.id)}
                                        size="sm"
                                        variant="outline"
                                        className="text-red-400 hover:text-red-300 border-red-500/30 hover:bg-red-500/10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card >
    );
});

InvoiceItemsCard.displayName = 'InvoiceItemsCard';
