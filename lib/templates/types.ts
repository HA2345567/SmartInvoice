
import { z } from 'zod';
import { InvoiceType } from '@/components/invoice/InvoiceTypeSelector';

export interface InvoiceTypeDefinition {
    id: InvoiceType;
    name: string;
    description: string;
    features: string[];
    schema: z.ZodObject<any, any>;
}

export interface InvoiceStyleDefinition {
    id: string; // e.g., 'corporate-minimal'
    name: string;
    description: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        muted: string;
        border: string;
    };
    typography: {
        fontFamily: string;
        headingWeight: string;
        bodyWeight: string;
    };
    layout: {
        spacing: string;
        borderRadius: string;
        containerClass: string;
    };
}
