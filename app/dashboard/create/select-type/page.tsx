'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InvoiceTypeSelector, InvoiceType } from '@/components/invoice/InvoiceTypeSelector';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function SelectInvoiceTypePage() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<InvoiceType>('sales');

    const handleContinue = () => {
        // Store selected type in sessionStorage and navigate to create page
        sessionStorage.setItem('invoiceType', selectedType);
        router.push('/dashboard/create');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/10 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center space-y-4 py-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <Sparkles className="w-8 h-8 text-green-primary animate-pulse" />
                        <h1 className="text-4xl font-bold text-white">
                            Create New Invoice
                        </h1>
                    </div>
                    <p className="text-lg text-green-muted max-w-2xl mx-auto">
                        Start by selecting the invoice type that best matches your business needs.
                        We'll customize the form to capture exactly what you need.
                    </p>
                    <div className="flex items-center justify-center space-x-2 pt-2">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-green-primary flex items-center justify-center text-white font-semibold">
                                1
                            </div>
                            <span className="text-green-primary font-medium">Select Type</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-600" />
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 font-semibold">
                                2
                            </div>
                            <span className="text-gray-400 font-medium">Fill Details</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-600" />
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 font-semibold">
                                3
                            </div>
                            <span className="text-gray-400 font-medium">Generate & Send</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <Card className="card-green-mist">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white">Choose Your Invoice Type</CardTitle>
                        <CardDescription className="text-green-muted">
                            Select the invoice type that matches your billing scenario. Each type has specific fields optimized for your needs.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <InvoiceTypeSelector
                            selected={selectedType}
                            onChange={setSelectedType}
                        />
                    </CardContent>
                </Card>

                {/* Continue Button */}
                <div className="flex justify-center pt-6 pb-12">
                    <Button
                        onClick={handleContinue}
                        className="btn-green-primary px-8 py-6 text-lg font-semibold"
                        size="lg"
                    >
                        Continue to Invoice Details
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
                    <Card className="card-green-mist border-green-500/20">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-green-primary mb-2">7</div>
                            <div className="text-sm text-green-muted">Invoice Types</div>
                            <div className="text-xs text-gray-500 mt-1">Phase 1 Available</div>
                        </CardContent>
                    </Card>
                    <Card className="card-green-mist border-green-500/20">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-green-primary mb-2">4</div>
                            <div className="text-sm text-green-muted">Professional Styles</div>
                            <div className="text-xs text-gray-500 mt-1">Apple, Microsoft, Amazon, Financial</div>
                        </CardContent>
                    </Card>
                    <Card className="card-green-mist border-green-500/20">
                        <CardContent className="p-6 text-center">
                            <div className="text-3xl font-bold text-green-primary mb-2">28</div>
                            <div className="text-sm text-green-muted">Template Combinations</div>
                            <div className="text-xs text-gray-500 mt-1">100% Free Access</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
