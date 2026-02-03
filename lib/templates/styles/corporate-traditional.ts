
import { InvoiceStyleDefinition } from '../types';

export const CorporateTraditionalStyle: InvoiceStyleDefinition = {
    id: 'corporate-traditional',
    name: 'Corporate Traditional',
    description: 'Serif fonts, centered formal headers, black and white only.',
    colors: {
        primary: '#000000',
        secondary: '#000000',
        accent: '#000000',
        background: '#ffffff',
        text: '#000000',
        muted: '#333333',
        border: '#000000',
    },
    typography: {
        fontFamily: '"Times New Roman", Times, serif',
        headingWeight: '700', // Bold
        bodyWeight: '400', // Regular
    },
    layout: {
        spacing: 'compact',
        borderRadius: '0px',
        containerClass: 'max-w-4xl mx-auto bg-white p-12 border-2 border-black',
    }
};
