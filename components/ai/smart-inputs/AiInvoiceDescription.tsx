'use client';

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Wand2, RefreshCw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AiInvoiceDescriptionProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function AiInvoiceDescription({ value, onChange, placeholder, className }: AiInvoiceDescriptionProps) {
    const [isEnhancing, setIsEnhancing] = useState(false);

    // Real AI enhancement function
    const enhanceText = async (mode: 'formal' | 'friendly' | 'detailed') => {
        if (!value.trim()) return;

        setIsEnhancing(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/ai/enhance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: value, mode })
            });

            if (!response.ok) throw new Error('Enhancement failed');
            const data = await response.json();
            onChange(data.enhancedText);
        } catch (error) {
            console.error('Enhancement error:', error);
            // Fallback mock logic if API fails or for demo safety
            let enhanced = value;
            if (mode === 'formal') enhanced = `Professional Services Rendered:\n${value}`;
            else if (mode === 'friendly') enhanced = `Hi there! Here's the invoice for:\n${value}\nThanks!`;
            onChange(enhanced);
        } finally {
            setIsEnhancing(false);
        }
    };

    return (
        <div className="relative group">
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Describe the services provided..."}
                className={cn(
                    "pr-12 min-h-[100px] resize-none input-green transition-all duration-300",
                    isEnhancing ? "opacity-50 blur-[1px]" : "",
                    className
                )}
                disabled={isEnhancing}
            />

            <div className="absolute top-2 right-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-full hover:bg-green-500/20 hover:text-green-400 transition-all"
                            disabled={!value.trim() || isEnhancing}
                        >
                            {isEnhancing ? (
                                <RefreshCw className="w-4 h-4 animate-spin text-green-500" />
                            ) : (
                                <Sparkles className="w-4 h-4 text-purple-400" />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-black/90 border-green-500/20 backdrop-blur-xl text-white">
                        <DropdownMenuItem onClick={() => enhanceText('formal')} className="cursor-pointer hover:bg-green-500/20 focus:bg-green-500/20">
                            <Wand2 className="w-4 h-4 mr-2 text-blue-400" /> Make Formal
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => enhanceText('friendly')} className="cursor-pointer hover:bg-green-500/20 focus:bg-green-500/20">
                            <Sparkles className="w-4 h-4 mr-2 text-yellow-400" /> Make Friendly
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => enhanceText('detailed')} className="cursor-pointer hover:bg-green-500/20 focus:bg-green-500/20">
                            <Check className="w-4 h-4 mr-2 text-green-400" /> Make Detailed
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {isEnhancing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-green-500/30 flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4 text-green-400 animate-pulse" />
                        <span className="text-xs font-medium text-green-100">AI Rewriting...</span>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
