'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, Loader2, Sparkles, User as UserIcon, Minimize2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface InvoiceDraftItem {
    description: string;
    quantity: number;
    rate: number;
    amount?: number;
}

interface InvoiceDraft {
    clientName: string;
    clientEmail: string;
    clientCompany?: string;
    clientAddress?: string;
    clientGst?: string;
    clientCurrency?: string;
    items: InvoiceDraftItem[];
    taxRate?: number;
    discountRate?: number;
    notes?: string;
    dueDate?: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    invoiceDraft?: InvoiceDraft | null;
    isInvoiceCreated?: boolean;
    createdInvoiceNumber?: string;
}

export function AiChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [creatingInvoiceId, setCreatingInvoiceId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Hello! I'm your SmartInvoice AI Assistant. I can help you create invoices, check payment status, or analyze your cash flow. How can I help you today?",
            timestamp: new Date(),
        }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { user, session } = useAuth();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen, isTyping]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        try {
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    messages: messages.concat(userMessage).map(m => ({
                        role: m.role,
                        content: m.content
                    }))
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to fetch response');

            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.content,
                timestamp: new Date(),
                invoiceDraft: data.invoiceDraft || null,
            };

            setMessages(prev => [...prev, botResponse]);
        } catch (error: any) {
            console.error('Chat Error:', error);
            const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: error.message || "I'm having trouble connecting right now. Please try again later.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleCreateInvoice = async (draft: InvoiceDraft, messageId: string) => {
        if (!session?.access_token) return;
        setCreatingInvoiceId(messageId);

        try {
            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    clientName: draft.clientName,
                    clientEmail: draft.clientEmail,
                    clientCompany: draft.clientCompany,
                    clientAddress: draft.clientAddress,
                    clientGst: draft.clientGst,
                    clientCurrency: draft.clientCurrency || 'USD',
                    items: draft.items,
                    taxRate: draft.taxRate || 0,
                    discountRate: draft.discountRate || 0,
                    notes: draft.notes,
                    dueDate: draft.dueDate,
                    status: 'draft',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create invoice');
            }

            const invoiceNumber = data.invoice?.invoiceNumber || data.invoice?.invoicenumber || 'created';

            setMessages(prev => prev.map(m => {
                if (m.id === messageId) {
                    return {
                        ...m,
                        isInvoiceCreated: true,
                        createdInvoiceNumber: invoiceNumber,
                        content: `${m.content}\n\n✅ Invoice **${invoiceNumber}** has been created as a draft!`
                    };
                }
                return m;
            }));
        } catch (error: any) {
            console.error('Create Invoice Error:', error);
            alert(error.message || 'Failed to create invoice.');
        } finally {
            setCreatingInvoiceId(null);
        }
    };

    const calculateDraftTotal = (draft: InvoiceDraft) => {
        const subtotal = (draft.items || []).reduce((sum, item) => sum + (item.quantity * item.rate), 0);
        const discountAmount = draft.discountRate ? (subtotal * draft.discountRate) / 100 : 0;
        const subtotalAfterDiscount = subtotal - discountAmount;
        const taxAmount = draft.taxRate ? (subtotalAfterDiscount * draft.taxRate) / 100 : 0;
        return subtotalAfterDiscount + taxAmount;
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!user) return null;

    return (
        <>
            {/* Floating Toggle Button */}
            <div className={cn(
                "fixed bottom-6 right-6 z-50 transition-all duration-300",
                isOpen ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
            )}>
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-110 p-0 flex items-center justify-center border border-white/10"
                >
                    <Bot className="h-7 w-7 text-white" />
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                </Button>
            </div>

            {/* Chat Window */}
            <div className={cn(
                "fixed bottom-6 right-6 z-50 w-[90vw] md:w-[420px] h-[620px] max-h-[82vh] flex flex-col rounded-2xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 origin-bottom-right backdrop-blur-xl bg-black/85",
                isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-10 pointer-events-none"
            )}>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-green-900/20 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-lg border border-white/10">
                            <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-sm">SmartInvoice Assistant</h3>
                            <p className="text-xs text-green-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                Online
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/5 rounded-full" onClick={() => setIsOpen(false)}>
                            <Minimize2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" ref={scrollRef}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex items-start gap-3 max-w-[90%]",
                                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border border-white/10 shadow-sm",
                                msg.role === 'assistant' ? "bg-green-900/30 text-green-400" : "bg-zinc-800 text-gray-300"
                            )}>
                                {msg.role === 'assistant' ? <Sparkles className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                            </div>

                            <div className="flex flex-col gap-2.5 w-full">
                                <div className={cn(
                                    "rounded-2xl p-3.5 text-sm shadow-sm border whitespace-pre-wrap leading-relaxed",
                                    msg.role === 'assistant'
                                        ? "bg-zinc-900/90 border-white/10 text-gray-200 rounded-tl-none"
                                        : "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-500/50 rounded-tr-none"
                                )}>
                                    {msg.content}
                                </div>

                                {/* Invoice Draft Card */}
                                {msg.role === 'assistant' && msg.invoiceDraft && (
                                    <div className="rounded-xl border border-emerald-500/30 bg-zinc-950/90 p-3.5 shadow-xl space-y-3">
                                        <div className="flex justify-between items-start border-b border-white/10 pb-2">
                                            <div>
                                                <span className="text-[10px] uppercase font-bold tracking-wider text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                                                    Draft Invoice
                                                </span>
                                                <h4 className="text-sm font-semibold text-white mt-1.5 truncate max-w-[200px]">
                                                    {msg.invoiceDraft.clientName}
                                                </h4>
                                                <p className="text-[11px] text-gray-400 truncate max-w-[200px]">
                                                    {msg.invoiceDraft.clientEmail}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400">Estimated Total</p>
                                                <p className="text-sm font-bold text-green-400">
                                                    {msg.invoiceDraft.clientCurrency || 'USD'} {calculateDraftTotal(msg.invoiceDraft).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Line items list */}
                                        <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                                            {msg.invoiceDraft.items?.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-xs py-1 px-2 rounded bg-white/5">
                                                    <span className="text-gray-300 truncate max-w-[170px]">{item.description}</span>
                                                    <span className="text-gray-400 font-mono text-[11px]">
                                                        {item.quantity} × {item.rate} = {(item.quantity * item.rate).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Rates metadata */}
                                        {(msg.invoiceDraft.taxRate! > 0 || msg.invoiceDraft.discountRate! > 0) && (
                                            <div className="flex justify-end gap-3 text-[11px] text-gray-400 border-t border-white/5 pt-1.5">
                                                {msg.invoiceDraft.discountRate! > 0 && (
                                                    <span>Discount: {msg.invoiceDraft.discountRate}%</span>
                                                )}
                                                {msg.invoiceDraft.taxRate! > 0 && (
                                                    <span>Tax/GST: {msg.invoiceDraft.taxRate}%</span>
                                                )}
                                            </div>
                                        )}

                                        {/* Create Action Button */}
                                        <Button
                                            onClick={() => handleCreateInvoice(msg.invoiceDraft!, msg.id)}
                                            disabled={msg.isInvoiceCreated || creatingInvoiceId === msg.id}
                                            className={cn(
                                                "w-full h-9 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-md",
                                                msg.isInvoiceCreated
                                                    ? "bg-zinc-800 text-green-400 border border-green-500/30 cursor-default"
                                                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                                            )}
                                        >
                                            {creatingInvoiceId === msg.id ? (
                                                <>
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    Creating Invoice...
                                                </>
                                            ) : msg.isInvoiceCreated ? (
                                                <>
                                                    <Check className="h-3.5 w-3.5 text-green-400" />
                                                    Invoice Created ({msg.createdInvoiceNumber})
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="h-3.5 w-3.5" />
                                                    Create Draft Invoice
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex items-start gap-3 max-w-[85%]">
                            <div className="h-8 w-8 rounded-full bg-green-900/30 text-green-400 flex items-center justify-center shrink-0 border border-white/10 shadow-sm">
                                <Sparkles className="h-4 w-4" />
                            </div>
                            <div className="bg-zinc-900/80 border border-white/5 text-gray-200 rounded-2xl rounded-tl-none p-4 flex items-center gap-2 h-10">
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
                    <div className="relative flex items-center gap-2">
                        <Input
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask or generate an invoice..."
                            className="pr-12 bg-white/5 border-white/10 focus:border-green-500/50 text-white placeholder:text-gray-500 h-12 rounded-xl backdrop-blur-sm transition-all focus:bg-white/10"
                        />
                        <Button
                            size="icon"
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isTyping}
                            className={cn(
                                "absolute right-1 top-1 h-10 w-10 transition-all duration-200 rounded-lg",
                                inputValue.trim()
                                    ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-900/20"
                                    : "bg-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5"
                            )}
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="mt-2 flex justify-center">
                        <p className="text-[10px] text-gray-600 flex items-center gap-1">
                            Powered by <span className="font-semibold text-gray-500">SmartInvoice AI</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
