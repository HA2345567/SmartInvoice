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

    const safeFrom = data?.from ? {
        name: data.from.name || 'Your Company Name',
        email: data.from.email || '',
        address: data.from.address || '',
        city: data.from.city || '',
        phone: data.from.phone || '',
        gst: data.from.gst || '',
        logoUrl: data.from.logoUrl || '',
    } : {
        name: 'Your Company Name',
        email: '',
        address: '',
        city: '',
        phone: '',
        gst: '',
        logoUrl: '',
    };

    const safeTo = data?.to ? {
        name: data.to.name || 'Client Name',
        email: data.to.email || '',
        address: data.to.address || '',
        city: data.to.city || '',
        company: data.to.company || '',
        gst: data.to.gst || '',
    } : {
        name: 'Client Name',
        email: '',
        address: '',
        city: '',
        company: '',
        gst: '',
    };

    const normalizedData: InvoiceData = {
        ...data,
        from: safeFrom,
        to: safeTo,
        invoiceNumber: data?.invoiceNumber || 'INV-0001',
        issuedDate: data?.issuedDate || new Date().toISOString().split('T')[0],
        dueDate: data?.dueDate || '',
        currencySymbol: data?.currencySymbol || '$',
        items: data?.items || [],
        subtotal: data?.subtotal || 0,
        tax: data?.tax || 0,
        discount: data?.discount || 0,
        total: data?.total || 0,
    };

    return <InvoiceComponent data={normalizedData} styleClass={styleClass} />;
};

export default InvoiceRenderer;
