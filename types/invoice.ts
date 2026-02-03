
export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface Client {
    id: string;
    name: string;
    email: string;
    company?: string;
    address: string;
    gstNumber?: string;
    currency: string;
}

export interface InvoiceData {
    invoiceNumber: string;
    date: string;
    dueDate: string;
    clientName: string;
    clientEmail: string;
    clientCompany: string;
    clientAddress: string;
    clientGST: string;
    clientCurrency: string;
    items: InvoiceItem[];
    notes: string;
    terms: string;
    taxRate: number;
    discountRate: number;
    paymentLink: string;
    theme: string;
    customColors: any;
    companyLogo: string;
    whiteLabelMode: boolean;
    invoiceType: string;

    // Phase 1 Fields
    validityPeriod?: string;
    estimatedDelivery?: string;
    notForPaymentNote?: boolean;
    projectName?: string;
    projectId?: string;
    milestoneDescription?: string;
    percentComplete?: number;
    totalProjectValue?: number;
    previouslyInvoiced?: number;
    billingCycle?: string;
    nextBillingDate?: string;
    creditReason?: string;
    originalInvoiceNumber?: string;
    originalInvoiceDate?: string;

    // Computed (often passed separately, but useful to have in type)
    subtotal?: number;
    discountAmount?: number;
    taxAmount?: number;
    amount?: number;
}
