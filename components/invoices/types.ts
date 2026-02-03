export interface InvoiceItem {
    description: string;
    qty: number;
    rate: number;
    amount: number;
}

export interface Address {
    name: string;
    company?: string;
    email?: string;
    address: string;
    city: string;
    logo?: string;
}

export interface InvoiceData {
    invoiceNumber: string;
    issuedDate: string;
    dueDate: string;
    from: Address;
    to: Address;
    items: InvoiceItem[];
    subtotal: number;
    tax?: number;
    total: number;
    notes?: string;

    // Specific fields
    proforma?: {
        validUntil: string;
        notForPayment: boolean;
    };
    interim?: {
        projectName: string;
        milestone: string;
        percentComplete: number;
        totalProject: number;
        invoicedToDate: number;
    };
    recurring?: {
        subscriptionPeriod: string;
        nextBillingDate: string;
        subscriptionDetails: string;
    };
}

export type InvoiceType =
    | 'sales'
    | 'proforma'
    | 'interim'
    | 'final'
    | 'recurring'
    | 'credit-note'
    | 'past-due'
    | 'commercial'
    | 'tax'
    | 'timesheet'
    | 'retainer'
    | 'expense';

export type InvoiceStyle =
    | 'ultra-luxury'
    | 'financial'
    | 'microsoft'
    | 'amazon'
    | 'creative-agency'
    | 'professional-services';
