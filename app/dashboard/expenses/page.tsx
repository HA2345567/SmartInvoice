'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Sparkles, Plus, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AiExpenseDropzone } from '@/components/ai/expenses/AiExpenseDropzone';
import { AiExpenseReview, ExpenseItem } from '@/components/ai/expenses/AiExpenseReview';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function ExpensesPage() {
    const [view, setView] = useState<'scan' | 'review' | 'list'>('scan');
    const [scannedExpenses, setScannedExpenses] = useState<ExpenseItem[]>([]);
    const { toast } = useToast();
    const { token } = useAuth();
    const [isScanning, setIsScanning] = useState(false);

    const handleFilesSelected = async (files: File[]) => {
        setIsScanning(true);
        try {
            const authToken = token || localStorage.getItem('token');

            if (!authToken) {
                console.error('No auth token found');
                throw new Error('Please login again');
            }

            const scanPromises = files.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/expenses/scan', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${authToken}` },
                    body: formData
                });

                if (!response.ok) throw new Error('Scan failed');
                return await response.json();
            });

            const results = await Promise.all(scanPromises);

            setScannedExpenses(prev => [...prev, ...results]);
            setView('review');
            toast({
                title: "AI Analysis Complete",
                description: `Successfully analyzed ${files.length} receipts.`
            });
        } catch (error) {
            console.error('Scan error:', error);
            toast({
                title: "Scan Error",
                description: "Failed to analyze receipts. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsScanning(false);
        }
    };

    const handleApprove = (id: string) => {
        setScannedExpenses(prev => prev.filter(e => e.id !== id));
        toast({
            title: "Expense Approved",
            description: "The expense has been added to your records."
        });

        if (scannedExpenses.length <= 1) {
            setTimeout(() => setView('scan'), 500);
        }
    };

    const handleReject = (id: string) => {
        setScannedExpenses(prev => prev.filter(e => e.id !== id));
        toast({
            variant: "destructive",
            title: "Expense Rejected",
            description: "The expense item has been discarded."
        });
        if (scannedExpenses.length <= 1) {
            setTimeout(() => setView('scan'), 500);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                        Expenses <Badge variant="outline" className="border-green-500/50 text-green-400">AI Powered</Badge>
                    </h1>
                    <p className="text-green-muted text-lg">Smart receipt scanning & categorization</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="btn-green-secondary" onClick={() => setView('scan')}>
                        <Plus className="w-4 h-4 mr-2" /> Upload
                    </Button>
                    <Button variant="outline" className="btn-green-secondary">
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            {view === 'scan' && (
                <div className="max-w-3xl mx-auto space-y-8 mt-10">
                    <AiExpenseDropzone onFilesSelected={handleFilesSelected} isScanning={isScanning} />

                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <Sparkles className="w-6 h-6 text-green-400 mx-auto mb-2" />
                            <h3 className="text-white font-medium">Smart Scan</h3>
                            <p className="text-xs text-gray-500">OCR automatically extracts data</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <Filter className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                            <h3 className="text-white font-medium">Auto Categorize</h3>
                            <p className="text-xs text-gray-500">AI assigns tax categories</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                            <Receipt className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <h3 className="text-white font-medium">Digital Archive</h3>
                            <p className="text-xs text-gray-500">Securely stored with 256-bit encryption</p>
                        </div>
                    </div>
                </div>
            )}

            {view === 'review' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-semibold text-white">Reviewing {scannedExpenses.length} Receipts</h2>
                        <Button variant="ghost" size="sm" onClick={() => setView('scan')} className="text-gray-400">Cancel</Button>
                    </div>
                    <AiExpenseReview
                        expenses={scannedExpenses}
                        onApprove={handleApprove}
                        onReject={handleReject}
                    />
                </div>
            )}
        </div>
    );
}

// Simple Badge Helper
function Badge({ children, variant, className }: any) {
    return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${className}`}>{children}</span>
}
