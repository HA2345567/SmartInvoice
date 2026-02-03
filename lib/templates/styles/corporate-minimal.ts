
import { InvoiceStyleDefinition } from '../types';

export const CorporateMinimalStyle: InvoiceStyleDefinition = {
    id: 'corporate-minimal',
    name: 'Corporate Minimal',
    description: 'Maximum whitespace, thin typography, monochrome or single accent color.',
    colors: {
        primary: '#000000', // Black
        secondary: '#333333',
        accent: '#666666',
        background: '#ffffff',
        text: '#111827', // Gray 900
        muted: '#6B7280', // Gray 500
        border: '#E5E7EB', // Gray 200
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        headingWeight: '400', // Thin/Regular
        bodyWeight: '300', // Light
    },
    layout: {
        spacing: 'relaxed',
        borderRadius: '0px',
        containerClass: 'max-w-4xl mx-auto bg-white p-12 shadow-sm',
    }
};
