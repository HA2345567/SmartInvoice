'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, sparkle, Loader2, Sparkles, User as UserIcon, Minimize2, maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    actions?: {
        label: string;
        onClick: () => void;
    }[];
}

export function AiChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
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
    const { user } = useAuth();

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
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            };

            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error('Chat Error:', error);
            const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm having trouble connecting to my brain right now. Please try again later.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsTyping(false);
        }
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
                "fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] flex flex-col rounded-2xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 origin-bottom-right backdrop-blur-xl bg-black/80",
                isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-10 pointer-events-none"
            )}>

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-green-900/20 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center shadow-lg border border-white/10">
                            <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white text-sm">AI Assistant</h3>
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
                                "flex items-start gap-3 max-w-[85%]",
                                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border border-white/10 shadow-sm",
                                msg.role === 'assistant' ? "bg-green-900/30 text-green-400" : "bg-zinc-800 text-gray-300"
                            )}>
                                {msg.role === 'assistant' ? <Sparkles className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                            </div>

                            <div className={cn(
                                "rounded-2xl p-3 text-sm shadow-sm border",
                                msg.role === 'assistant'
                                    ? "bg-zinc-900/80 border-white/5 text-gray-200 rounded-tl-none"
                                    : "bg-green-600 text-white border-green-500 rounded-tr-none"
                            )}>
                                {msg.content}
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
                            placeholder="Ask anything..."
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
