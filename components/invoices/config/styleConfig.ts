import { InvoiceStyle } from '../types';

export interface StyleDefinition {
    id: InvoiceStyle;
    name: string;
    description: string;
    preview: string;
}

export const DESIGN_STYLES: StyleDefinition[] = [
    {
        id: 'ultra-luxury',
        name: 'Apple Style',
        description: 'Ultra-clean, minimal design with broad whitespace.',
        preview: '/previews/ultra-luxury.png'
    },
    {
        id: 'financial',
        name: 'Financial/Corporate',
        description: 'Formal, traditional serif typography.',
        preview: '/previews/financial.png'
    },
    {
        id: 'microsoft',
        name: 'Microsoft Style',
        description: 'Structured, organized with clear sections.',
        preview: '/previews/microsoft.png'
    },
    {
        id: 'amazon',
        name: 'Amazon Style',
        description: 'Efficient, dense, data-focused layout.',
        preview: '/previews/amazon.png'
    },
    {
        id: 'creative-agency',
        name: 'Creative Agency',
        description: 'Bold, vibrant, and modern design.',
        preview: '/previews/creative-agency.png'
    },
    {
        id: 'professional-services',
        name: 'Professional Services',
        description: 'Elegant, high-end consulting layout.',
        preview: '/previews/professional-services.png'
    }
];
