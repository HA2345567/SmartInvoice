'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Building2, Crown, Loader2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';

export interface Client {
    id: string;
    name: string;
    email: string;
    company?: string;
    address: string;
    gstNumber?: string;
    currency: string;
}

interface AiClientSelectorProps {
    value: string;
    onChange: (value: string) => void;
    onSelect: (client: Client) => void;
    clients: Client[];
    className?: string;
}

export function AiClientSelector({
    value,
    onChange,
    onSelect,
    clients,
    className
}: AiClientSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<(Client & { matchReason?: string; confidence: number })[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!value.trim()) {
            setSuggestions([]);
            return;
        }

        const debounce = setTimeout(async () => {
            setIsSearching(true);
            try {
                // In production, call /api/ai/match-client
                // For now, robust client-side semantic-like substring search
                const query = value.toLowerCase();
                const matched = clients
                    .map(c => {
                        let score = 0;
                        let matchReason = '';
                        if (c.name.toLowerCase().startsWith(query)) {
                            score = 95;
                            matchReason = 'Name prefix match';
                        } else if (c.name.toLowerCase().includes(query)) {
                            score = 80;
                            matchReason = 'Name includes query';
                        } else if (c.company && c.company.toLowerCase().includes(query)) {
                            score = 70;
                            matchReason = 'Company match';
                        } else if (c.email.toLowerCase().includes(query)) {
                            score = 60;
                            matchReason = 'Email match';
                        }

                        return { ...c, confidence: score, matchReason };
                    })
                    .filter(c => c.confidence > 0)
                    .sort((a, b) => b.confidence - a.confidence);

                setSuggestions(matched);
            } catch (err) {
                console.error("Failed to match clients", err);
            } finally {
                setIsSearching(false);
            }
        }, 200);

        return () => clearTimeout(debounce);
    }, [value, clients]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (client: Client) => {
        onSelect(client);
        onChange(client.name); // Update the text input to match selection
        setIsOpen(false);
    };

    return (
        <div className={cn("relative z-20", className)} ref={containerRef}>
            <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none">
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <Input
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Type client name..."
                    className={cn(
                        "pl-10 input-green transition-all duration-300",
                        isOpen && value.length > 0 ? "ring-2 ring-green-500/50 bg-black/60 rounded-b-none border-b-0" : "bg-black/40"
                    )}
                />
            </div>

            <AnimatePresence>
                {isOpen && value.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border border-green-500/30 border-t-0 rounded-b-xl shadow-2xl overflow-hidden z-50"
                    >
                        {isSearching ? (
                            <div className="p-3 text-center text-xs text-green-400/50">
                                <span className="animate-pulse">Matching Client Directory...</span>
                            </div>
                        ) : suggestions.length > 0 ? (
                            <div className="py-0">
                                <div className="px-3 py-1.5 text-[10px] font-bold text-green-600 uppercase tracking-widest bg-green-900/10 flex justify-between items-center">
                                    <span>Client Directory</span>
                                    <Crown className="w-3 h-3 text-amber-400" />
                                </div>
                                {suggestions.map((client) => (
                                    <div
                                        key={client.id}
                                        onClick={() => handleSelect(client)}
                                        className="px-4 py-3 hover:bg-green-500/20 cursor-pointer transition-all border-l-2 border-transparent hover:border-green-500 group flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="text-sm text-gray-200 group-hover:text-white font-medium">{client.name}</p>
                                            <div className="flex gap-2 text-xs text-gray-500">
                                                <span>{client.email}</span>
                                                {client.company && <span>• {client.company}</span>}
                                            </div>
                                        </div>

                                        <Badge variant="outline" className={cn(
                                            "ml-2 border-none h-5 text-[10px]",
                                            client.confidence > 80 ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-500"
                                        )}>
                                            {client.confidence}%
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            !isSearching && (
                                <div
                                    onClick={() => setIsOpen(false)}
                                    className="p-3 text-center cursor-pointer hover:bg-green-500/10 transition-colors"
                                >
                                    <p className="text-xs text-gray-400 font-medium">Use <span className="text-white font-semibold">&quot;{value}&quot;</span> as client</p>
                                    <div className="mt-1.5 text-xs text-green-400 flex items-center justify-center gap-1 font-semibold">
                                        <Plus className="w-3.5 h-3.5" /> Continue with new client
                                    </div>
                                </div>
                            )
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
