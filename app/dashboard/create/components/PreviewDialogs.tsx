'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Eye, Download } from 'lucide-react';
import InvoiceRenderer from '@/components/invoices/templates/InvoiceRenderer';
import TemplateSelector from '@/components/invoices/TemplateSelector';

interface PreviewDialogsProps {
    showPreviewDialog: boolean;
    setShowPreviewDialog: (show: boolean) => void;
    showTemplateDialog: boolean;
    setShowTemplateDialog: (show: boolean) => void;
    invoiceData: any;
    handleTemplateSelect: (type: any, style: any) => void;
    handlePreview: () => void;
    previewLoading: boolean;
}

export const PreviewDialogs = React.memo(({
    showPreviewDialog,
    setShowPreviewDialog,
    showTemplateDialog,
    setShowTemplateDialog,
    invoiceData,
    handleTemplateSelect,
    handlePreview,
    previewLoading
}: PreviewDialogsProps) => {
    return (
        <>
            {/* Premium Preview Dialog */}
            < Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog} >
                <DialogContent className="max-w-4xl h-[85vh] bg-slate-900/95 border-slate-700 backdrop-blur-sm">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center">
                            <Eye className="w-5 h-5 mr-2 text-blue-400" />
                            Premium Invoice Preview
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Preview of your professional invoice - {invoiceData.invoiceNumber}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 bg-white rounded-lg p-8 overflow-auto shadow-2xl">
                        {/* Premium Preview Content */}
                        <div className="max-w-2xl mx-auto">
                            <div className={`shadow-xl bg-white origin-top transform scale-75 origin-top md:scale-90`} style={{ minHeight: '297mm', width: '210mm' }}>
                                <InvoiceRenderer
                                    type={invoiceData.invoiceType}
                                    style={invoiceData.theme as any}
                                    data={invoiceData as any}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowPreviewDialog(false)}
                            className="border-slate-600 text-slate-300 hover:bg-slate-800"
                        >
                            Close Preview
                        </Button>
                        <Button
                            onClick={handlePreview}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={previewLoading}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {previewLoading ? 'Generating...' : 'Download Premium PDF'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog >

            {/* Template Selection Dialog */}
            <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
                <DialogContent className="max-w-[95vw] h-[95vh] p-0 bg-transparent border-none shadow-none z-50">
                    <TemplateSelector
                        onSelect={handleTemplateSelect}
                        initialType={invoiceData.invoiceType}
                        initialStyle={invoiceData.theme as any}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
});

PreviewDialogs.displayName = 'PreviewDialogs';
