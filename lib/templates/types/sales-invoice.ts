
import { z } from 'zod';
import { InvoiceTypeDefinition } from '../types';

const salesInvoiceSchema = z.object({
    invoiceNumber: z.string().min(1, "Invoice number is required"),
    date: z.string(),
    dueDate: z.string(),
    clientName: z.string().min(1, "Client name is required"),
    clientEmail: z.string().email().optional().or(z.literal('')),
    items: z.array(z.object({
        description: z.string().min(1, "Item description is required"),
        quantity: z.number().min(0.01),
        rate: z.number().min(0),
        amount: z.number()
    })).min(1, "At least one item is required"),
    notes: z.string().optional(),
    terms: z.string().optional(),
    taxRate: z.number().min(0).optional(),
    discountRate: z.number().min(0).optional(),
});

export const SalesInvoiceDefinition: InvoiceTypeDefinition = {
    id: 'sales',
    name: 'Sales Invoice',
    description: 'Most common invoice - request payment after delivering goods/services',
    features: [
        'Invoice number',
        'Itemized list of products/services',
        'Quantities and prices',
        'Tax calculations',
        'Payment terms',
        'Total amount due'
    ],
    schema: salesInvoiceSchema
};
