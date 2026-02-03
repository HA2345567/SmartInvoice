import { InvoiceType } from '../types';

export interface TemplateDefinition {
    id: InvoiceType;
    name: string;
    description: string;
}

export const INVOICE_TYPES: TemplateDefinition[] = [
    { id: 'sales', name: 'Sales Invoice', description: 'Standard payment request' },
    { id: 'proforma', name: 'Proforma Invoice', description: 'Estimate before work' },
    { id: 'interim', name: 'Progress Invoice', description: 'Milestone billing' },
    { id: 'final', name: 'Final Invoice', description: 'Project completion' },
    { id: 'recurring', name: 'Recurring Invoice', description: 'Subscriptions' },
    { id: 'credit-note', name: 'Credit Note', description: 'Refunds/returns' },
    { id: 'past-due', name: 'Past Due Invoice', description: 'Late payment reminder' },
    { id: 'commercial', name: 'Commercial Invoice', description: 'International trade' },
    { id: 'tax', name: 'Tax Invoice', description: 'VAT/GST Compliance' },
    { id: 'timesheet', name: 'Timesheet Invoice', description: 'Hourly billing' },
    { id: 'retainer', name: 'Retainer Invoice', description: 'Advance payments' },
    { id: 'expense', name: 'Expense Report', description: 'Reimbursements' }
];
