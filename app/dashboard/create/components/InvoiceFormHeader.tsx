'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Save, Send, Layout } from 'lucide-react';

interface InvoiceFormHeaderProps {
    setShowTemplateDialog: (show: boolean) => void;
    handleSimplePDF: () => void;
    handleSave: (status?: 'draft' | 'sent') => void;
    loading: boolean;
}

export const InvoiceFormHeader = React.memo(({
    setShowTemplateDialog,
    handleSimplePDF,
    handleSave,
    loading
}: InvoiceFormHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center">
                    <Plus className="w-8 h-8 mr-3 text-green-primary" />
                    Create New Invoice
                </h1>
                <p className="text-green-muted">Generate a professional invoice in seconds</p>
            </div>
            <div className="flex flex-wrap gap-3">
                <Button
                    variant="outline"
                    onClick={() => setShowTemplateDialog(true)}
                    className="btn-green-secondary"
                >
                    <Layout className="w-4 h-4 mr-2" />
                    Change Template
                </Button>
                <Button
                    variant="outline"
                    onClick={handleSimplePDF}
                    className="btn-green-secondary"
                >
                    <Eye className="w-4 h-4 mr-2" />
                    Quick PDF
                </Button>
                <Button
                    variant="outline"
                    onClick={() => handleSave('draft')}
                    disabled={loading}
                    className="btn-green-secondary"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                </Button>
                <Button
                    onClick={() => handleSave('sent')}
                    disabled={loading}
                    className="btn-green-primary dark-glow"
                >
                    <Send className="w-4 h-4 mr-2" />
                    {loading ? 'Creating...' : 'Create & Send'}
                </Button>
            </div>
        </div>
    );
});

InvoiceFormHeader.displayName = 'InvoiceFormHeader';
