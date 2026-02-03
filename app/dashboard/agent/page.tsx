'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bot, Mail, CheckCircle, AlertCircle, RefreshCw, Send, Sparkles, Zap, Shield, ChevronRight } from 'lucide-react';
import { AIAgentService, FollowUpAction } from '@/lib/ai-agent';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function AgentPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [actions, setActions] = useState<FollowUpAction[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [executedCount, setExecutedCount] = useState(0);

    useEffect(() => {
        if (user) {
            loadActions();
        }
    }, [user]);

    const loadActions = async () => {
        setLoading(true);
        try {
            if (user) {
                const foundActions = await AIAgentService.scanForFollowUps(user.id);
                setActions(foundActions);
            }
        } catch (error: any) {
            console.error("Failed to scan for follow-ups", error);
            toast({
                title: "Scan Failed",
                description: error.message || "Could not retrieve follow-up actions.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const executeAll = async () => {
        if (!user) return;
        setProcessing(true);
        let count = 0;
        try {
            for (const action of actions) {
                await AIAgentService.executeFollowUp(user.id, action);
                count++;
            }
            setExecutedCount(prev => prev + count);
            setActions([]); // Clear list after execution
            toast({
                title: "AI Agent Finished",
                description: `Successfully processed ${count} smart follow-ups.`,
            });
        } catch (error) {
            toast({
                title: "Execution Error",
                description: "Something went wrong while processing actions.",
                variant: "destructive"
            });
        } finally {
            setProcessing(false);
        }
    };

    const getToneBadge = (tone: string) => {
        switch (tone) {
            case 'polite': return <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">Polite Reminder</Badge>;
            case 'firm': return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30">Firm Nudge</Badge>;
            case 'final': return <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">Final Notice</Badge>;
            default: return <Badge variant="outline" className="text-gray-400 border-gray-500/30">Unknown</Badge>;
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                        AI Payment Agent
                        <Badge variant="outline" className="border-green-500/50 text-green-400 animate-pulse">LIVE</Badge>
                    </h1>
                    <p className="text-green-muted text-lg mt-2 max-w-2xl">
                        Autonomous accounts receivable automation. I analyze your invoices, detect delays, and negotiate payments efficiently.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={loadActions}
                        disabled={loading || processing}
                        className="btn-green-secondary border-green-500/30"
                    >
                        <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                        Run Diagnosis
                    </Button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Status & Stats */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Agent Status Card */}
                    <Card className="card-green-mist overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Bot className="w-32 h-32 text-green-500" />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-400" />
                                Agent Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                            <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                                <span className="text-gray-400 text-sm">Operational State</span>
                                <div className="flex items-center text-green-400 gap-2 text-sm font-medium">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    Monitoring
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400 text-sm">Actions Executed (Session)</span>
                                    <span className="font-mono text-xl text-white">{executedCount}</span>
                                </div>
                                <div className="w-full bg-gray-800 rounded-full h-1">
                                    <div className="bg-green-500 h-1 rounded-full" style={{ width: `${Math.min(executedCount * 10, 100)}%` }}></div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 text-sm">
                                <p className="flex items-start gap-3">
                                    <Sparkles className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                                    <span className="text-gray-300 italic">
                                        "I've scanned your portfolio. There are <span className="text-white font-bold">{actions.length}</span> overdue items requiring immediate intervention."
                                    </span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* How It Works */}
                    <Card className="card-green-mist">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Logic Flow</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { step: 1, text: "Detect overdue invoices > 3 days", icon: AlertCircle },
                                { step: 2, text: "Analyze client relationship & history", icon: Bot },
                                { step: 3, text: "Draft dynamic negotiation emails", icon: Mail },
                                { step: 4, text: "Execute sending upon approval", icon: Send }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-green-400 border border-white/10 group-hover:border-green-500/50 group-hover:bg-green-500/10 transition-all">
                                        <item.icon className="w-4 h-4" />
                                    </div>
                                    <p className="text-sm text-gray-400 group-hover:text-white transition-colors">{item.text}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Pending Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between p-1">
                        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                            Pending Actions
                            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-white border border-white/10">{actions.length}</span>
                        </h2>
                        <AnimatePresence>
                            {actions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <Button
                                        onClick={executeAll}
                                        disabled={processing}
                                        className="bg-green-500 hover:bg-green-600 text-white font-medium shadow-lg shadow-green-500/20 border-none px-6"
                                    >
                                        <Zap className="w-4 h-4 mr-2 fill-current" />
                                        {processing ? 'Executing Sequence...' : 'Auto-Resolve All'}
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-green-500/20 border-t-green-500 animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-green-500/50" />
                                </div>
                            </div>
                            <p className="text-green-500/80 animate-pulse text-sm font-medium">Analyzing Payment Patterns...</p>
                        </div>
                    ) : actions.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-green-500/5 border border-green-500/20 rounded-2xl p-12 text-center"
                        >
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">All Clear</h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                                No overdue invoices detected. Your cash flow is healthy and optimized. The agent is standing by.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            <AnimatePresence>
                                {actions.map((action, i) => (
                                    <motion.div
                                        key={action.invoiceId}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Card className="bg-black/40 border-white/10 hover:border-green-500/40 transition-all duration-300 group">
                                            <CardContent className="p-0">
                                                {/* Action Header */}
                                                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between gap-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-lg font-bold text-white border border-white/10 group-hover:bg-green-500/20 group-hover:text-green-400 transition-colors">
                                                            {action.clientName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors flex items-center gap-2">
                                                                {action.clientName}
                                                                <ChevronRight className="w-4 h-4 text-gray-600" />
                                                                <span className="text-sm font-normal text-gray-400">{action.invoiceNumber}</span>
                                                            </h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <p className="text-sm text-gray-500">{action.clientEmail}</p>
                                                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                                <span className="text-xs text-red-400 font-medium">Overdue {action.daysOverdue} days</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-white tracking-tight">${action.amount.toLocaleString()}</div>
                                                        <div className="mt-1 flex justify-end">
                                                            {getToneBadge(action.suggestedTone)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* AI Draft Preview */}
                                                <div className="p-6 bg-white/[0.02]">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <Sparkles className="w-4 h-4 text-green-500" />
                                                        <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">AI Generated Draft</span>
                                                    </div>
                                                    <div className="bg-black/30 rounded-lg p-4 border border-white/5 text-sm text-gray-300 font-light leading-relaxed">
                                                        <p className="text-gray-500 mb-2 border-b border-white/5 pb-2">Subject: <span className="text-gray-300">{action.subject}</span></p>
                                                        <p className="whitespace-pre-wrap font-sans">{action.body}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
