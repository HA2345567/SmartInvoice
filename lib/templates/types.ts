import { jsPDF } from 'jspdf';
import { InvoiceData } from '../pdf-generator';

export type TemplateId =
  | 'minimal'
  | 'apple'
  | 'stripe'
  | 'amazon'
  | 'microsoft'
  | 'google'
  | 'shopify'
  | 'custom'
  | 'luxury';

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface TemplateContext {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  colors: {
    primary: [number, number, number];
    secondary: [number, number, number];
    accent: [number, number, number];
    bg: [number, number, number];
  };
  drawLogo: (
    logoUrl: string | undefined,
    x: number,
    y: number,
    maxW?: number,
    maxH?: number,
    alignRight?: boolean
  ) => boolean;
  drawWatermark: (invoiceType?: string) => void;
  renderSpecializedSection: (data: InvoiceData, startY: number) => number;
  renderStandardItemsTable: (
    data: InvoiceData,
    startY: number,
    options?: {
      headerBg?: [number, number, number];
      headerTextColor?: [number, number, number];
      rowBorderColor?: [number, number, number];
      alternateRowBg?: boolean;
    }
  ) => number;
  renderTotalsBlock: (
    data: InvoiceData,
    tableEndY: number,
    options?: {
      accentColor?: [number, number, number];
      highlightGrandTotal?: boolean;
    }
  ) => number;
  renderAdditionalInformation?: (data: InvoiceData, totalsEndY: number) => number;
  renderFooter: (data: InvoiceData) => void;
  hexToRgb: (hex: string) => [number, number, number];
  getInvoiceTypeLabel: (type?: string) => string;
  getInvoiceTypeColor: (type?: string) => [number, number, number];
}

export interface InvoiceTemplate {
  id: TemplateId;
  name: string;
  description: string;
  defaultColors: ColorScheme;
  render: (doc: jsPDF, data: InvoiceData, context: TemplateContext) => void;
}

export interface InvoiceTypeDefinition {
  id: any;
  name: string;
  description: string;
  features?: string[];
  schema: any;
}

export interface InvoiceStyleDefinition {
  id: string;
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

