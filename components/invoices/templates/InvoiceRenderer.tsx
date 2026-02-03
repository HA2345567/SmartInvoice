import React from 'react';
import dynamic from 'next/dynamic';
import { InvoiceData, InvoiceType, InvoiceStyle } from '../types';

// Dynamically import type components for better performance
const SalesInvoice = dynamic(() => import('./types/SalesInvoice'));
const ProformaInvoice = dynamic(() => import('./types/ProformaInvoice'));
const InterimInvoice = dynamic(() => import('./types/InterimInvoice'));
const FinalInvoice = dynamic(() => import('./types/FinalInvoice'));
const RecurringInvoice = dynamic(() => import('./types/RecurringInvoice'));
const CreditNote = dynamic(() => import('./types/CreditNote'));
const PastDueInvoice = dynamic(() => import('./types/PastDueInvoice'));

// Import Styles (Static imports are fine for small CSS modules, or we could dynamic import them if they were huge)
import ultraLuxury from './styles/ultra-luxury.module.css';
import financial from './styles/financial.module.css';
import microsoft from './styles/microsoft.module.css';
import amazon from './styles/amazon.module.css';
import creativeAgency from './styles/creative-agency.module.css';
import professionalServices from './styles/professional-services.module.css';

const INVOICE_TYPES: Record<InvoiceType, any> = {
    'sales': SalesInvoice,
    'proforma': ProformaInvoice,
    'interim': InterimInvoice,
    'final': FinalInvoice,
    'recurring': RecurringInvoice,
    'credit-note': CreditNote,
    'past-due': PastDueInvoice,
    'commercial': SalesInvoice, // Fallbacks
    'tax': SalesInvoice,
    'timesheet': SalesInvoice,
    'retainer': SalesInvoice,
    'expense': SalesInvoice
};

const STYLE_CLASSES: Record<InvoiceStyle, { readonly [key: string]: string }> = {
    'ultra-luxury': ultraLuxury,
    'financial': financial,
    'microsoft': microsoft,
    'amazon': amazon,
    'creative-agency': creativeAgency,
    'professional-services': professionalServices
};

interface InvoiceRendererProps {
    type: InvoiceType;
    style: InvoiceStyle;
    data: InvoiceData;
}

const InvoiceRenderer: React.FC<InvoiceRendererProps> = ({ type, style, data }) => {
    const InvoiceComponent = INVOICE_TYPES[type];
    const styleClass = STYLE_CLASSES[style];

    if (!InvoiceComponent) {
        console.error(`Invalid invoice type: ${type}`);
        return (
            <div className="flex items-center justify-center h-full p-4 border border-dashed border-red-300 bg-red-50 text-red-500 rounded">
                Error: Invalid invoice type "{type}"
            </div>
        );
    }

    if (!styleClass) {
        console.error(`Invalid invoice style: ${style}`);
        return (
            <div className="flex items-center justify-center h-full p-4 border border-dashed border-red-300 bg-red-50 text-red-500 rounded">
                Error: Invalid invoice style "{style}"
            </div>
        );
    }

    return <InvoiceComponent data={data} styleClass={styleClass} />;
};

export default InvoiceRenderer;
