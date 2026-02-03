'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Tag, Calendar, DollarSign, AlertCircle, Edit2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface ExpenseItem {
    id: string;
    merchant: string;
    amount: number;
    date: string;
    category: string;
    confidence: number;
    fileName: string;
}

interface AiExpenseReviewProps {
    expenses: ExpenseItem[];
    onApprove: (id: string, correctedData?: Partial<ExpenseItem>) => void;
    onReject: (id: string) => void;
}

export function AiExpenseReview({ expenses, onApprove, onReject }: AiExpenseReviewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
                {expenses.map((expense, index) => (
                    <motion.div
                        key={expense.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="card-green-mist overflow-hidden relative group hover:border-green-500/40 transition-all duration-300">
                            {/* Confidence Indicator */}
                            <div className="absolute top-0 right-0 p-3">
                                <Badge variant="outline" className={`
                        ${expense.confidence > 90 ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                        expense.confidence > 70 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                            'bg-red-500/20 text-red-400 border-red-500/30'}
                   `}>
                                    {expense.confidence}% Confidence
                                </Badge>
                            </div>

                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
                                        {expense.merchant.charAt(0)}
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1 truncate">{expense.merchant}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="text-2xl font-bold text-green-400 flex items-center">
                                        <DollarSign className="w-5 h-5" />
                                        {expense.amount.toFixed(2)}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <Calendar className="w-4 h-4 text-gray-500" />
                                        {expense.date}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-400 group/cat">
                                        <Tag className="w-4 h-4 text-gray-500" />
                                        <span className="bg-white/5 px-2 py-0.5 rounded text-white group-hover/cat:bg-green-500/10 transition-colors">
                                            {expense.category}
                                        </span>
                                        {expense.confidence < 80 && (
                                            <span className="text-xs text-yellow-500 flex items-center ml-auto">
                                                <AlertCircle className="w-3 h-3 mr-1" /> Check this
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant="outline"
                                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30 hover:border-red-500/50"
                                        onClick={() => onReject(expense.id)}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Reject
                                    </Button>
                                    <Button
                                        className="bg-green-600 hover:bg-green-500 text-white border-none shadow-lg shadow-green-900/20"
                                        onClick={() => onApprove(expense.id)}
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Approve
                                    </Button>
                                </div>

                                <button className="absolute bottom-4 right-4 p-2 text-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
