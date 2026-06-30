import { InvoiceStyle } from '../types';

export interface StyleDefinition {
    id: InvoiceStyle;
    name: string;
    description: string;
    preview: string;
    category: 'tech' | 'finance' | 'ecommerce' | 'productivity' | 'creative';
    tags: string[];
}

export const DESIGN_STYLES: StyleDefinition[] = [
    // Premium Tech Company Styles
    {
        id: 'stripe',
        name: 'Stripe Style',
        description: 'Premium SaaS billing with gradient headers, rounded cards, and clean data tables.',
        preview: '/previews/stripe.png',
        category: 'tech',
        tags: ['SaaS', 'Modern', 'Premium']
    },
    {
        id: 'google',
        name: 'Google Cloud',
        description: 'Material Design inspired with color-coded headers and structured data layout.',
        preview: '/previews/google.png',
        category: 'tech',
        tags: ['Cloud', 'Material', 'Clean']
    },
    {
        id: 'salesforce',
        name: 'Salesforce',
        description: 'Enterprise CRM billing with account cards, opportunity linking, and activity feed.',
        preview: '/previews/salesforce.png',
        category: 'tech',
        tags: ['CRM', 'Enterprise', 'Professional']
    },
    {
        id: 'shopify',
        name: 'Shopify',
        description: 'E-commerce platform style with order tracking, product cards, and store branding.',
        preview: '/previews/shopify.png',
        category: 'ecommerce',
        tags: ['E-commerce', 'Store', 'Merchant']
    },
    {
        id: 'slack',
        name: 'Slack',
        description: 'Workspace billing with channel listings, member counts, and payment actions.',
        preview: '/previews/slack.png',
        category: 'productivity',
        tags: ['Team', 'Subscription', 'Workspace']
    },
    {
        id: 'notion',
        name: 'Notion',
        description: 'Document-style invoices with cover images, properties, and database views.',
        preview: '/previews/notion.png',
        category: 'productivity',
        tags: ['Minimal', 'Documentation', 'Block-based']
    },
    // Original Premium Styles
    {
        id: 'ultra-luxury',
        name: 'Apple Style',
        description: 'Ultra-clean, minimal design with broad whitespace and elegant typography.',
        preview: '/previews/ultra-luxury.png',
        category: 'tech',
        tags: ['Minimal', 'Premium', 'Luxury']
    },
    {
        id: 'financial',
        name: 'Goldman Sachs',
        description: 'Formal, traditional serif typography for financial and legal documents.',
        preview: '/previews/financial.png',
        category: 'finance',
        tags: ['Banking', 'Formal', 'Corporate']
    },
    {
        id: 'microsoft',
        name: 'Microsoft 365',
        description: 'Structured, organized design with blue accent color and clear sections.',
        preview: '/previews/microsoft.png',
        category: 'tech',
        tags: ['Enterprise', 'Modern', 'Office']
    },
    {
        id: 'amazon',
        name: 'Amazon Business',
        description: 'Efficient, dense, data-focused layout optimized for quick scanning.',
        preview: '/previews/amazon.png',
        category: 'ecommerce',
        tags: ['Marketplace', 'Efficient', 'Data-heavy']
    },
    {
        id: 'creative-agency',
        name: 'Creative Agency',
        description: 'Bold, vibrant design with modern typography and visual impact.',
        preview: '/previews/creative-agency.png',
        category: 'creative',
        tags: ['Design', 'Bold', 'Modern']
    },
    {
        id: 'professional-services',
        name: 'McKinsey Style',
        description: 'Elegant, high-end consulting layout with executive summary format.',
        preview: '/previews/professional-services.png',
        category: 'finance',
        tags: ['Consulting', 'Executive', 'Premium']
    }
];
