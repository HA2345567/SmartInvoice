import { InvoiceTemplate, ColorScheme, TemplateId } from './types';
import { minimalTemplate } from './minimal';
import { appleTemplate } from './apple';
import { stripeTemplate } from './stripe';
import { amazonTemplate } from './amazon';
import { microsoftTemplate } from './microsoft';
import { googleTemplate } from './google';
import { shopifyTemplate } from './shopify';
import { customTemplate } from './custom';
import { luxuryTemplate, LuxuryInvoiceTemplate } from './luxury';

export * from './types';
export * from './base';
export * from './luxury';
export {
  minimalTemplate,
  appleTemplate,
  stripeTemplate,
  amazonTemplate,
  microsoftTemplate,
  googleTemplate,
  shopifyTemplate,
  customTemplate,
  luxuryTemplate,
  LuxuryInvoiceTemplate,
};

export const ALL_TEMPLATES: InvoiceTemplate[] = [
  luxuryTemplate,
  appleTemplate,
  stripeTemplate,
  minimalTemplate,
  amazonTemplate,
  microsoftTemplate,
  googleTemplate,
  shopifyTemplate,
  customTemplate,
];

export const TEMPLATES_BY_ID: Record<string, InvoiceTemplate> = {
  luxury: luxuryTemplate,
  'ultra-luxury': luxuryTemplate,
  minimal: minimalTemplate,
  apple: appleTemplate,
  stripe: stripeTemplate,
  amazon: amazonTemplate,
  microsoft: microsoftTemplate,
  google: googleTemplate,
  shopify: shopifyTemplate,
  custom: customTemplate,

  // Backward compatibility aliases
  financial: stripeTemplate,
  'creative-agency': customTemplate,
  'professional-services': microsoftTemplate,
  salesforce: stripeTemplate,
  notion: minimalTemplate,
  slack: shopifyTemplate,
};

export function getTemplate(themeId?: string): InvoiceTemplate {
  const normalized = (themeId || 'luxury').toLowerCase().trim();
  return TEMPLATES_BY_ID[normalized] || luxuryTemplate;
}

export const DEFAULT_THEME_SCHEMES: Record<TemplateId, ColorScheme> = {
  luxury: luxuryTemplate.defaultColors,
  minimal: minimalTemplate.defaultColors,
  apple: appleTemplate.defaultColors,
  stripe: stripeTemplate.defaultColors,
  amazon: amazonTemplate.defaultColors,
  microsoft: microsoftTemplate.defaultColors,
  google: googleTemplate.defaultColors,
  shopify: shopifyTemplate.defaultColors,
  custom: customTemplate.defaultColors,
};
