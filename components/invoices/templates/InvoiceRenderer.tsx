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

// Import Styles
import ultraLuxury from './styles/ultra-luxury.module.css';
import financial from './styles/financial.module.css';
import microsoft from './styles/microsoft.module.css';
import amazon from './styles/amazon.module.css';
import creativeAgency from './styles/creative-agency.module.css';
import professionalServices from './styles/professional-services.module.css';
import stripe from './styles/stripe.module.css';
import google from './styles/google.module.css';
import salesforce from './styles/salesforce.module.css';
import shopify from './styles/shopify.module.css';
import slack from './styles/slack.module.css';
import notion from './styles/notion.module.css';

const INVOICE_TYPES: Record<InvoiceType, any> = {
    'sales': SalesInvoice,
    'proforma': ProformaInvoice,
    'interim': InterimInvoice,
    'final': FinalInvoice,
    'recurring': RecurringInvoice,
    'credit-note': CreditNote,
    'past-due': PastDueInvoice,
    'commercial': SalesInvoice,
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
    'professional-services': professionalServices,
    'stripe': stripe,
    'google': google,
    'salesforce': salesforce,
    'shopify': shopify,
    'slack': slack,
    'notion': notion,
};

interface InvoiceRendererProps {
    type: InvoiceType;
    style: InvoiceStyle;
    data: InvoiceData;
}

const InvoiceRenderer: React.FC<InvoiceRendererProps> = ({ type, style, data }) => {
    const InvoiceComponent = INVOICE_TYPES[type] || SalesInvoice;
    const styleClass = STYLE_CLASSES[style] || ultraLuxury;

    const logoUrl = (data as any)?.companyLogo || data?.from?.logoUrl || '';

    const safeFrom = data?.from ? {
        name: data.from.name || (data as any)?.companyName || 'Your Company Name',
        email: data.from.email || (data as any)?.companyEmail || '',
        address: data.from.address || (data as any)?.companyAddress || '',
        city: data.from.city || '',
        phone: data.from.phone || (data as any)?.companyPhone || '',
        gst: data.from.gst || (data as any)?.companyGST || '',
        logoUrl: logoUrl,
    } : {
        name: (data as any)?.companyName || 'Your Company Name',
        email: (data as any)?.companyEmail || '',
        address: (data as any)?.companyAddress || '',
        city: '',
        phone: (data as any)?.companyPhone || '',
        gst: (data as any)?.companyGST || '',
        logoUrl: logoUrl,
    };

    const safeTo = data?.to ? {
        name: data.to.name || (data as any)?.clientName || 'Client Name',
        email: data.to.email || (data as any)?.clientEmail || '',
        address: data.to.address || (data as any)?.clientAddress || '',
        city: data.to.city || '',
        company: data.to.company || (data as any)?.clientCompany || '',
        gst: data.to.gst || (data as any)?.clientGST || '',
    } : {
        name: (data as any)?.clientName || 'Client Name',
        email: (data as any)?.clientEmail || '',
        address: (data as any)?.clientAddress || '',
        city: '',
        company: (data as any)?.clientCompany || '',
        gst: (data as any)?.clientGST || '',
    };

    const normalizedData: InvoiceData = {
        ...data,
        from: safeFrom,
        to: safeTo,
        invoiceNumber: data?.invoiceNumber || 'INV-0001',
        issuedDate: data?.issuedDate || (data as any)?.date || new Date().toISOString().split('T')[0],
        dueDate: data?.dueDate || '',
        currencySymbol: data?.currencySymbol || (data as any)?.clientCurrency || '$',
        items: data?.items || [],
        subtotal: data?.subtotal || 0,
        tax: data?.tax || 0,
        discount: data?.discount || 0,
        total: data?.total || (data as any)?.amount || 0,
        whiteLabelMode: (data as any)?.whiteLabelMode || false,
    };

    return <InvoiceComponent data={normalizedData} styleClass={styleClass} />;
};

export default InvoiceRenderer;
