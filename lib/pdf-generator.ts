import jsPDF from 'jspdf';
import { format } from 'date-fns';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  note?: string;
  category?: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  clientAddress: string;
  clientGST?: string;
  clientCurrency: string;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  amount: number;
  taxRate: number;
  discountRate: number;
  paymentLink?: string;
  companyName?: string;
  companyAddress?: string;
  companyGST?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyWebsite?: string;
  companyLogo?: string;
  invoiceStatus?: 'PAID' | 'DUE' | 'OVERDUE' | 'PENDING';
  theme?: 'professional' | 'modern' | 'luxury' | 'minimal' | 'elegant-black-gold' | 'minimal-white-silver' | 'ivory-serif-classic' | 'modern-rose-gold' | 'ultra-luxury' | 'microsoft' | 'amazon' | 'financial' | 'creative-agency' | 'professional-services';
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  whiteLabelMode?: boolean; // Pro tier: Remove "Powered by SmartInvoice"

  // Invoice Type System - Phase 1 + Phase 2
  invoiceType?: 'sales' | 'proforma' | 'interim' | 'final' | 'recurring' | 'credit-note' | 'past-due' |
  'commercial' | 'tax' | 'timesheet' | 'retainer' | 'expense';

  // Proforma specific
  validityPeriod?: string;
  estimatedDelivery?: string;
  notForPaymentNote?: boolean;

  // Interim/Final specific
  projectName?: string;
  projectId?: string;
  milestoneDescription?: string;
  percentComplete?: number;
  totalProjectValue?: number;
  previouslyInvoiced?: number;
  workPeriod?: string;
  projectStartDate?: string;
  projectEndDate?: string;
  allInterimPayments?: Array<{ invoiceNumber: string; date: string; amount: number; }>;
  finalDeliverables?: string[];

  // Recurring specific
  subscriptionPeriod?: string;
  billingCycle?: string;
  nextBillingDate?: string;
  subscriptionDetails?: string;
  autoRenewal?: boolean;
  cancellationPolicy?: string;

  // Credit Note specific
  originalInvoiceNumber?: string;
  originalInvoiceDate?: string;
  creditReason?: string;

  // Past Due specific
  originalDueDate?: string;
  daysOverdue?: number;
  lateFeeAmount?: number;
  lateFeePercentage?: number;
  urgentNote?: string;

  // PHASE 2 TYPES:

  // Commercial Invoice specific (International trade)
  hsCode?: string; // Harmonized System code
  countryOfOrigin?: string;
  totalWeight?: string;
  totalDimensions?: string;
  shippingTerms?: string; // Incoterms (FOB, CIF, etc.)
  declaredValue?: number;
  exportLicenseNumber?: string;
  destinationCountry?: string;
  portOfLoading?: string;
  portOfDischarge?: string;

  // Tax Invoice specific (VAT/GST)
  sellerTaxId?: string;
  buyerTaxId?: string;
  taxBreakdown?: Array<{
    description: string;
    rate: number;
    taxableAmount: number;
    taxAmount: number;
  }>;
  totalTaxableAmount?: number;
  totalTaxAmount?: number;
  taxExemptItems?: Array<{ description: string; reason: string; }>;

  // Timesheet Invoice specific (Hourly billing)
  timeEntries?: Array<{
    date: string;
    task: string;
    hours: number;
    rate: number;
    amount: number;
  }>;
  totalHours?: number;
  hourlyRate?: number;
  consultantName?: string;
  timesheetPeriodStart?: string;
  timesheetPeriodEnd?: string;

  // Retainer Invoice specific (Advance payments)
  retainerPeriodStart?: string;
  retainerPeriodEnd?: string;
  servicesIncluded?: string[];
  retainerAmount?: number;
  unusedHours?: number;
  carryoverPolicy?: string;
  retainerTerms?: string;

  // Expense Report specific (Reimbursements)
  expenses?: Array<{
    date: string;
    category: string;
    description: string;
    amount: number;
    receiptAttached: boolean;
  }>;
  totalExpenses?: number;
  reimbursementMethod?: string;
  employeeName?: string;
  employeeId?: string;
  approvedBy?: string;
  approvalDate?: string;
}

export class PremiumPDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private colors: {
    primary: [number, number, number];
    secondary: [number, number, number];
    accent: [number, number, number];
    dark: [number, number, number];
    medium: [number, number, number];
    light: [number, number, number];
    bg: [number, number, number];
    white: [number, number, number];
  };

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 15;
    this.colors = this.getColorScheme('professional') as {
      primary: [number, number, number];
      secondary: [number, number, number];
      accent: [number, number, number];
      dark: [number, number, number];
      medium: [number, number, number];
      light: [number, number, number];
      bg: [number, number, number];
      white: [number, number, number];
    };
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  }

  private getColorScheme(theme: string = 'professional', customColors?: InvoiceData['customColors']) {
    if (customColors) {
      return {
        primary: this.hexToRgb(customColors.primary),
        secondary: this.hexToRgb(customColors.secondary),
        accent: this.hexToRgb(customColors.accent),
        dark: [15, 23, 42] as [number, number, number],
        medium: [71, 85, 105] as [number, number, number],
        light: [148, 163, 184] as [number, number, number],
        bg: this.hexToRgb(customColors.background),
        white: [255, 255, 255] as [number, number, number]
      } as {
        primary: [number, number, number];
        secondary: [number, number, number];
        accent: [number, number, number];
        dark: [number, number, number];
        medium: [number, number, number];
        light: [number, number, number];
        bg: [number, number, number];
        white: [number, number, number];
      };
    }

    type RGB = [number, number, number];
    const schemes: Record<string, {
      primary: RGB;
      secondary: RGB;
      accent: RGB;
      dark: RGB;
      medium: RGB;
      light: RGB;
      bg: RGB;
      white: RGB;
    }> = {
      professional: {
        primary: [13, 60, 97],
        secondary: [14, 165, 233],
        accent: [16, 185, 129],
        dark: [15, 23, 42],
        medium: [71, 85, 105],
        light: [148, 163, 184],
        bg: [248, 250, 252],
        white: [255, 255, 255]
      },
      'creative-agency': {
        primary: [236, 0, 140],     // Vibrant Magenta
        secondary: [0, 0, 0],       // Black
        accent: [245, 245, 245],
        dark: [0, 0, 0],
        medium: [100, 100, 100],
        light: [230, 230, 230],
        bg: [255, 255, 255],
        white: [255, 255, 255]
      },
      'professional-services': {
        primary: [0, 33, 71],      // Navy Blue
        secondary: [134, 142, 150], // Slate
        accent: [248, 249, 250],
        dark: [33, 37, 41],
        medium: [108, 117, 125],
        light: [222, 226, 230],
        bg: [255, 255, 255],
        white: [255, 255, 255]
      },
      modern: {
        primary: [79, 70, 229],
        secondary: [139, 92, 246],
        accent: [236, 72, 153],
        dark: [17, 24, 39],
        medium: [75, 85, 99],
        light: [156, 163, 175],
        bg: [249, 250, 251],
        white: [255, 255, 255]
      },
      luxury: {
        primary: [113, 63, 18],
        secondary: [217, 119, 6],
        accent: [245, 158, 11],
        dark: [20, 83, 45],
        medium: [52, 73, 94],
        light: [127, 140, 141],
        bg: [254, 252, 232],
        white: [255, 255, 255]
      },
      minimal: {
        primary: [31, 41, 55],
        secondary: [75, 85, 99],
        accent: [99, 102, 241],
        dark: [17, 24, 39],
        medium: [107, 114, 128],
        light: [156, 163, 175],
        bg: [255, 255, 255],
        white: [255, 255, 255]
      },
      'elegant-black-gold': {
        primary: [0, 0, 0],
        secondary: [212, 175, 55],
        accent: [255, 215, 0],
        dark: [20, 20, 20],
        medium: [64, 64, 64],
        light: [128, 128, 128],
        bg: [15, 15, 15],
        white: [255, 255, 255]
      },
      'minimal-white-silver': {
        primary: [64, 64, 64],
        secondary: [192, 192, 192],
        accent: [128, 128, 128],
        dark: [32, 32, 32],
        medium: [96, 96, 96],
        light: [160, 160, 160],
        bg: [255, 255, 255],
        white: [255, 255, 255]
      },
      'ivory-serif-classic': {
        primary: [139, 69, 19],
        secondary: [160, 82, 45],
        accent: [205, 133, 63],
        dark: [101, 67, 33],
        medium: [139, 115, 85],
        light: [188, 170, 164],
        bg: [255, 255, 240],
        white: [255, 255, 255]
      },
      'modern-rose-gold': {
        primary: [188, 143, 143],
        secondary: [255, 182, 193],
        accent: [255, 192, 203],
        dark: [139, 69, 19],
        medium: [205, 133, 63],
        light: [255, 218, 185],
        bg: [255, 255, 255],
        white: [255, 255, 255]
      },
      'ultra-luxury': {
        primary: [0, 0, 0],         // Pure Black
        secondary: [50, 50, 50],    // Charcoal
        accent: [100, 100, 100],    // Slate Gray
        dark: [0, 0, 0],
        medium: [80, 80, 80],
        light: [230, 230, 230],     // Very light gray for lines
        bg: [255, 255, 255],        // Pure White
        white: [255, 255, 255]
      }
    };
    return schemes[theme as keyof typeof schemes] || schemes.professional;
  }

  // Invoice Type Helper Methods
  private getInvoiceTypeLabel(invoiceType?: string): string {
    const labels: Record<string, string> = {
      'sales': 'INVOICE',
      'proforma': 'PROFORMA INVOICE',
      'interim': 'INTERIM INVOICE',
      'final': 'FINAL INVOICE',
      'recurring': 'RECURRING INVOICE',
      'credit-note': 'CREDIT NOTE',
      'past-due': 'PAST DUE INVOICE',
      // Phase 2
      'commercial': 'COMMERCIAL INVOICE',
      'tax': 'TAX INVOICE',
      'timesheet': 'TIMESHEET INVOICE',
      'retainer': 'RETAINER INVOICE',
      'expense': 'EXPENSE REPORT'
    };
    return labels[invoiceType || 'sales'] || 'INVOICE';
  }

  private getInvoiceTypeColor(invoiceType?: string): [number, number, number] {
    const colors: Record<string, [number, number, number]> = {
      'sales': [0, 0, 0],           // Black
      'proforma': [147, 51, 234],   // Purple
      'interim': [249, 115, 22],    // Orange
      'final': [34, 197, 94],       // Green
      'recurring': [6, 182, 212],   // Cyan
      'credit-note': [239, 68, 68], // Red
      'past-due': [234, 179, 8],     // Yellow
      // Phase 2
      'commercial': [59, 130, 246], // Blue (International)
      'tax': [16, 185, 129],        // Green (Government)
      'timesheet': [168, 85, 247],  // Purple (Consulting)
      'retainer': [14, 165, 233],   // Light Blue (Services)
      'expense': [251, 146, 60]     // Orange (Reimbursement)
    };
    return colors[invoiceType || 'sales'] || [0, 0, 0];
  }

  private shouldShowWatermark(invoiceType?: string): { show: boolean; text: string; color: [number, number, number] } {
    if (invoiceType === 'proforma') {
      return { show: true, text: 'NOT FOR PAYMENT', color: [147, 51, 234] };
    }
    if (invoiceType === 'past-due') {
      return { show: true, text: 'PAYMENT OVERDUE', color: [239, 68, 68] };
    }
    if (invoiceType === 'expense') {
      return { show: true, text: 'REIMBURSEMENT REQUEST', color: [251, 146, 60] };
    }
    return { show: false, text: '', color: [0, 0, 0] };
  }

  private renderSpecializedSection(invoiceData: InvoiceData, startY: number): number {
    if (!invoiceData.invoiceType || invoiceData.invoiceType === 'sales') return startY;

    const margin = 20;
    const contentWidth = this.pageWidth - (margin * 2);
    let currentY = startY + 5;

    this.doc.setDrawColor(...(this.colors.light as [number, number, number]));
    this.doc.setLineWidth(0.1);
    this.doc.line(margin, currentY, this.pageWidth - margin, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(...(this.getInvoiceTypeColor(invoiceData.invoiceType)));
    this.doc.text(`${this.getInvoiceTypeLabel(invoiceData.invoiceType)} DETAILS`, margin, currentY);
    currentY += 8;

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(...(this.colors.medium as [number, number, number]));

    const fields: Array<{ label: string; value: string | number | boolean | undefined }> = [];

    if (invoiceData.invoiceType === 'proforma') {
      fields.push({ label: 'Validity Period', value: invoiceData.validityPeriod });
      fields.push({ label: 'Est. Delivery', value: invoiceData.estimatedDelivery });
    } else if (invoiceData.invoiceType === 'interim' || invoiceData.invoiceType === 'final') {
      fields.push({ label: 'Project', value: invoiceData.projectName });
      fields.push({ label: 'Milestone', value: invoiceData.milestoneDescription });
      fields.push({ label: 'Progress', value: invoiceData.percentComplete ? `${invoiceData.percentComplete}%` : undefined });
    } else if (invoiceData.invoiceType === 'recurring') {
      fields.push({ label: 'Billing Cycle', value: invoiceData.billingCycle });
      fields.push({ label: 'Next Billing', value: invoiceData.nextBillingDate });
    } else if (invoiceData.invoiceType === 'credit-note') {
      fields.push({ label: 'Original Inv #', value: invoiceData.originalInvoiceNumber });
      fields.push({ label: 'Reason', value: invoiceData.creditReason });
    } else if (invoiceData.invoiceType === 'past-due') {
      fields.push({ label: 'Original Due Date', value: invoiceData.originalDueDate });
      fields.push({ label: 'Late Fee', value: invoiceData.lateFeeAmount ? `${invoiceData.clientCurrency}${invoiceData.lateFeeAmount}` : undefined });
    } else if (invoiceData.invoiceType === 'commercial') {
      fields.push({ label: 'HS Code', value: invoiceData.hsCode });
      fields.push({ label: 'Origin', value: invoiceData.countryOfOrigin });
      fields.push({ label: 'Terms', value: invoiceData.shippingTerms });
      fields.push({ label: 'Exp License', value: invoiceData.exportLicenseNumber });
    } else if (invoiceData.invoiceType === 'tax') {
      fields.push({ label: 'Seller Tax ID', value: invoiceData.sellerTaxId });
      fields.push({ label: 'Buyer Tax ID', value: invoiceData.buyerTaxId });
    } else if (invoiceData.invoiceType === 'timesheet') {
      fields.push({ label: 'Consultant', value: invoiceData.consultantName });
      fields.push({ label: 'Period', value: invoiceData.timesheetPeriodStart ? `${invoiceData.timesheetPeriodStart} to ${invoiceData.timesheetPeriodEnd}` : undefined });
    } else if (invoiceData.invoiceType === 'retainer') {
      fields.push({ label: 'Retainer Amt', value: invoiceData.retainerAmount ? `${invoiceData.clientCurrency}${invoiceData.retainerAmount}` : undefined });
      fields.push({ label: 'Terms', value: invoiceData.retainerTerms });
    } else if (invoiceData.invoiceType === 'expense') {
      fields.push({ label: 'Employee', value: invoiceData.employeeName });
      fields.push({ label: 'Employee ID', value: invoiceData.employeeId });
      fields.push({ label: 'Reimb. Method', value: invoiceData.reimbursementMethod });
    }

    // Render fields in 2 columns
    let col1X = margin;
    let col2X = margin + (contentWidth / 2);
    let rowY = currentY;

    fields.filter(f => f.value !== undefined && f.value !== '').forEach((field, index) => {
      const x = index % 2 === 0 ? col1X : col2X;
      this.doc.setFont('helvetica', 'bold');
      this.doc.text(`${field.label}:`, x, rowY);
      this.doc.setFont('helvetica', 'normal');
      const valStr = String(field.value);
      this.doc.text(valStr, x + 25, rowY);

      if (index % 2 === 1) rowY += 6;
      else if (index === fields.length - 1) rowY += 6;
    });

    currentY = rowY + 5;
    this.doc.line(margin, currentY, this.pageWidth - margin, currentY);

    return currentY + 10;
  }

  generatePDF(invoiceData: InvoiceData): Uint8Array {
    try {
      this.colors = this.getColorScheme(invoiceData.theme || 'professional', invoiceData.customColors);

      this.doc.setProperties({
        title: `Invoice #${invoiceData.invoiceNumber}`,
        subject: 'Premium Invoice Document',
        author: invoiceData.companyName || 'Premium Invoice System',
        keywords: 'invoice, billing, payment, premium',
        creator: 'Premium Invoice Generator Pro'
      });

      this.doc.setFillColor(...(this.colors.bg as [number, number, number]));
      this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');

      if (invoiceData.theme === 'ultra-luxury') {
        this.renderUltraLuxuryLayout(invoiceData); // Apple Minimal
      } else if (invoiceData.theme === 'microsoft') {
        this.renderMicrosoftLayout(invoiceData);
      } else if (invoiceData.theme === 'amazon') {
        this.renderAmazonLayout(invoiceData);
      } else if (invoiceData.theme === 'financial') {
        this.renderFinancialLayout(invoiceData);
      } else if (invoiceData.theme === 'creative-agency') {
        this.renderCreativeAgencyLayout(invoiceData);
      } else if (invoiceData.theme === 'professional-services') {
        this.renderProfessionalServicesLayout(invoiceData);
      } else {
        this.renderMicrosoftLayout(invoiceData);
      }

      return this.doc.output('arraybuffer') as unknown as Uint8Array;
    } catch (error) {
      console.error('Premium PDF Generation Error:', error);
      throw new Error('Failed to generate premium PDF');
    }
  }

  // --- Apple Minimal (Template 1) Renderer ---
  private renderUltraLuxuryLayout(data: InvoiceData) {
    const startY = 40; // Approx 40px/15mm top margin, PRD says 60px/20mm
    const leftMargin = 20; // PRD says 60px ~ 21mm
    const rightMargin = this.pageWidth - leftMargin;

    // 1. Company Name (Huge, Thin)
    // "Company Name: 48pt, Light weight"
    this.doc.setFontSize(48);
    this.doc.setFont('helvetica', 'normal'); // Closest to 'Light' in standard fonts without custom fonts
    this.doc.setTextColor(29, 29, 31); // #1D1D1F
    this.doc.text(data.companyName || 'SmartInvoice', leftMargin, startY);

    // Address Block below Company Name
    this.doc.setFontSize(10); // Standard Body 10-11pt
    this.doc.setFont('helvetica', 'normal');
    const companyInfo = [
      data.companyAddress,
      data.companyEmail
    ].filter(Boolean).join('\n');
    this.doc.text(companyInfo, leftMargin, startY + 15);

    // Invoice Type Label (dynamic based on type)
    const invoiceY = startY + 40;
    const typeLabel = this.getInvoiceTypeLabel(data.invoiceType);
    const typeColor = this.getInvoiceTypeColor(data.invoiceType);

    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...typeColor);
    this.doc.text(typeLabel, leftMargin, invoiceY);

    this.doc.setFontSize(11);
    this.doc.setTextColor(134, 134, 139); // #86868B
    this.doc.text(data.invoiceNumber || '', leftMargin, invoiceY + 8);

    // Watermark for Proforma/Past Due
    const watermark = this.shouldShowWatermark(data.invoiceType);
    if (watermark.show) {
      this.doc.setFontSize(60);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(...watermark.color);
      this.doc.setGState(new (this.doc as any).GState({ opacity: 0.1 }));
      const watermarkWidth = this.doc.getTextWidth(watermark.text);
      this.doc.text(watermark.text, (this.pageWidth - watermarkWidth) / 2, this.pageHeight / 2, {
        angle: 45
      });
      this.doc.setGState(new (this.doc as any).GState({ opacity: 1 }));
    }

    // Separator 1
    const line1Y = invoiceY + 20;
    this.doc.setDrawColor(210, 210, 215); // #D2D2D7
    this.doc.setLineWidth(0.5);
    this.doc.line(leftMargin, line1Y, rightMargin, line1Y);

    // "Bill To" & "Dates" Section
    const section2Y = line1Y + 15;

    // Column 1: Bill To
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold'); // Uppercase headers usually bold/heavy
    this.doc.setTextColor(134, 134, 139); // Gray
    this.doc.text('BILL TO', leftMargin, section2Y);

    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(29, 29, 31); // Near black

    let clientY = section2Y + 8;
    this.doc.text(data.clientName, leftMargin, clientY);
    clientY += 6;
    if (data.clientCompany) {
      this.doc.text(data.clientCompany, leftMargin, clientY);
      clientY += 6;
    }
    this.doc.text(data.clientEmail, leftMargin, clientY);
    if (data.clientAddress) {
      const addressLines = this.doc.splitTextToSize(data.clientAddress, 80);
      this.doc.text(addressLines, leftMargin, clientY + 6);
    }

    // Column 2: Invoice Date
    const col2X = leftMargin + 100;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(134, 134, 139);
    this.doc.text('INVOICE DATE', col2X, section2Y);

    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(29, 29, 31);
    this.doc.text(data.date ? format(new Date(data.date), 'MMMM dd, yyyy') : '', col2X, section2Y + 8);

    // Due Date below Invoice Date
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(134, 134, 139);
    this.doc.text('DUE DATE', col2X, section2Y + 20);

    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(29, 29, 31);
    this.doc.text(data.dueDate ? format(new Date(data.dueDate), 'MMMM dd, yyyy') : '', col2X, section2Y + 28);


    // Specialized Fields Section (Phase 2)
    let nextSectionY = section2Y + 45;
    if (data.invoiceType && data.invoiceType !== 'sales') {
      nextSectionY = this.renderSpecializedSection(data, section2Y + 40);
    }

    // Separator 2
    const line2Y = nextSectionY;
    this.doc.setDrawColor(210, 210, 215);
    this.doc.line(leftMargin, line2Y, rightMargin, line2Y);

    // Items Header
    const tableHeaderY = line2Y + 10;
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(134, 134, 139); // Gray

    const colQty = rightMargin - 70;
    const colRate = rightMargin - 40;
    const colAmount = rightMargin;

    this.doc.text('DESCRIPTION', leftMargin, tableHeaderY);
    this.doc.text('QTY', colQty, tableHeaderY, { align: 'right' });
    this.doc.text('RATE', colRate, tableHeaderY, { align: 'right' });
    this.doc.text('AMOUNT', colAmount, tableHeaderY, { align: 'right' });

    // Separator 3 (Header Line)
    const line3Y = tableHeaderY + 5;
    this.doc.setDrawColor(210, 210, 215);
    this.doc.line(leftMargin, line3Y, rightMargin, line3Y);

    // Items
    let items: InvoiceItem[] = [];
    if (data.items) {
      items = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
    }

    let currentY = line3Y + 10;
    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(29, 29, 31);

    items.forEach((item) => {
      const descWidth = colQty - leftMargin - 10;
      const descLines = this.doc.splitTextToSize(item.description, descWidth);

      this.doc.text(descLines, leftMargin, currentY);
      this.doc.text(item.quantity.toString(), colQty, currentY, { align: 'right' });
      this.doc.text(`${data.clientCurrency || '$'}${item.rate.toFixed(2)}`, colRate, currentY, { align: 'right' });
      this.doc.text(`${data.clientCurrency || '$'}${item.amount.toFixed(2)}`, colAmount, currentY, { align: 'right' });

      currentY += Math.max(10, descLines.length * 6);
    });

    // Separator 4 (End of items)
    const line4Y = currentY + 5;
    this.doc.setDrawColor(210, 210, 215);
    this.doc.line(leftMargin, line4Y, rightMargin, line4Y);

    // Totals
    let totalY = line4Y + 15;

    // Subtotal
    this.doc.setFontSize(11);
    this.doc.setTextColor(134, 134, 139); // Gray
    this.doc.text('Subtotal', colRate, totalY, { align: 'right' });
    this.doc.setTextColor(29, 29, 31); // Black
    this.doc.text(`${data.clientCurrency || '$'}${data.subtotal.toFixed(2)}`, colAmount, totalY, { align: 'right' });

    totalY += 8;

    // Tax
    if (data.taxAmount > 0) {
      this.doc.setTextColor(134, 134, 139);
      this.doc.text(`Tax (${data.taxRate}%)`, colRate, totalY, { align: 'right' });
      this.doc.setTextColor(29, 29, 31);
      this.doc.text(`${data.clientCurrency || '$'}${data.taxAmount.toFixed(2)}`, colAmount, totalY, { align: 'right' });
      totalY += 8;
    }

    // Discount
    if (data.discountAmount > 0) {
      this.doc.setTextColor(134, 134, 139);
      this.doc.text(`Discount (${data.discountRate}%)`, colRate, totalY, { align: 'right' });
      this.doc.setTextColor(29, 29, 31);
      this.doc.text(`-${data.clientCurrency || '$'}${data.discountAmount.toFixed(2)}`, colAmount, totalY, { align: 'right' });
      totalY += 8;
    }

    // Total (Big)
    totalY += 5;
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'normal'); // PRD says 'Medium', but standard Helvetica doesn't have Medium usually, use Normal or Bold? 'Bold' is usually closest to Medium if Normal is Light. PRD says '24pt, Medium weight'.
    // Actually PRD says "Total: 24pt, Medium weight". In standard jsPDF, 'bold' is strong. 'normal' is 400.
    // Let's use Bold for emphasis as it's the Total.
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(29, 29, 31);
    this.doc.text('Total', colRate - 10, totalY, { align: 'right' });
    this.doc.text(`${data.clientCurrency || '$'}${data.amount.toFixed(2)}`, colAmount, totalY, { align: 'right' });


    // Footer Line
    const footerY = totalY + 30;
    this.doc.setDrawColor(210, 210, 215);
    this.doc.setLineWidth(0.5);
    this.doc.line(leftMargin, footerY, rightMargin, footerY);

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(134, 134, 139);
    this.doc.text(data.companyEmail || '', leftMargin, footerY + 10);

    // White-label mode: Don't show "Powered by" if Pro/Business tier
    if (!data.whiteLabelMode) {
      this.doc.setFontSize(8);
      this.doc.setTextColor(180, 180, 180);
      this.doc.text('Powered by SmartInvoice', rightMargin, footerY + 10, { align: 'right' });
    }
  }

  // --- Microsoft Corporate (Template 2) Renderer ---
  private renderMicrosoftLayout(data: InvoiceData) {
    // Blue accent bar
    this.doc.setFillColor(0, 120, 212); // #0078D4
    this.doc.rect(this.margin, 20, this.pageWidth - (2 * this.margin), 5, 'F');

    const startY = 40;

    // Header
    // Company Name
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(24);
    this.doc.setTextColor(50, 49, 48); // #323130
    this.doc.text(data.companyName || 'SmartInvoice', this.margin, startY);

    // Invoice Type Label & Number (dynamic)
    const typeLabel = this.getInvoiceTypeLabel(data.invoiceType);
    const typeColor = this.getInvoiceTypeColor(data.invoiceType);

    this.doc.setFontSize(24);
    this.doc.setTextColor(...typeColor);
    this.doc.text(typeLabel, this.pageWidth - this.margin, startY, { align: 'right' });

    this.doc.setFontSize(10);
    this.doc.setTextColor(96, 94, 92); // #605E5C
    this.doc.text(data.invoiceNumber || '', this.pageWidth - this.margin, startY + 8, { align: 'right' });

    // Watermark for Proforma/Past Due
    const watermark = this.shouldShowWatermark(data.invoiceType);
    if (watermark.show) {
      this.doc.setFontSize(60);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(...watermark.color);
      this.doc.setGState(new (this.doc as any).GState({ opacity: 0.1 }));
      const watermarkWidth = this.doc.getTextWidth(watermark.text);
      this.doc.text(watermark.text, (this.pageWidth - watermarkWidth) / 2, this.pageHeight / 2, {
        angle: 45
      });
      this.doc.setGState(new (this.doc as any).GState({ opacity: 1 }));
    }

    // Company Address
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(50, 49, 48);
    const companyInfo = [
      data.companyAddress,
      data.companyEmail
    ].filter(Boolean).join('\n');
    this.doc.text(companyInfo, this.margin, startY + 10);

    // Dates (aligned right)
    let dateY = startY + 20;
    const dateColX = this.pageWidth - this.margin - 50;

    this.doc.text('Date:', dateColX, dateY);
    this.doc.text(data.date ? format(new Date(data.date), 'MMM dd, yyyy') : '', this.pageWidth - this.margin, dateY, { align: 'right' });

    dateY += 6;
    this.doc.text('Due:', dateColX, dateY);
    this.doc.text(data.dueDate ? format(new Date(data.dueDate), 'MMM dd, yyyy') : '', this.pageWidth - this.margin, dateY, { align: 'right' });


    // Bill To Section (Gray Box)
    const billToY = startY + 40;
    this.doc.setFillColor(243, 242, 241); // #F3F2F1
    this.doc.rect(this.margin, billToY, 80, 40, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(96, 94, 92); // #605E5C
    this.doc.text('BILL TO', this.margin + 5, billToY + 8);

    this.doc.setFont('helvetica', 'bold'); // Client Name is bold
    this.doc.setFontSize(10);
    this.doc.setTextColor(50, 49, 48);
    this.doc.text(data.clientName, this.margin + 5, billToY + 16);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    let clientY = billToY + 22;
    if (data.clientCompany) {
      this.doc.text(data.clientCompany, this.margin + 5, clientY);
      clientY += 5;
    }
    this.doc.text(data.clientEmail, this.margin + 5, clientY);


    // Specialized Fields Section (Phase 2)
    let nextSectionY = billToY + 50;
    if (data.invoiceType && data.invoiceType !== 'sales') {
      nextSectionY = this.renderSpecializedSection(data, billToY + 45);
    }

    // Items Table
    const tableY = nextSectionY + 5;
    const rightMargin = this.pageWidth - this.margin;

    // Table Header Box
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.1);
    this.doc.rect(this.margin, tableY, this.pageWidth - (2 * this.margin), 10);

    const colQty = rightMargin - 70;
    const colRate = rightMargin - 40;
    const colAmount = rightMargin - 5;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(96, 94, 92);

    this.doc.text('DESCRIPTION', this.margin + 5, tableY + 7);
    this.doc.text('QTY', colQty, tableY + 7, { align: 'right' });
    this.doc.text('UNIT PRICE', colRate, tableY + 7, { align: 'right' });
    this.doc.text('AMOUNT', colAmount, tableY + 7, { align: 'right' });

    // Items
    let items: InvoiceItem[] = [];
    if (data.items) {
      items = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
    }

    let currentY = tableY + 10;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(50, 49, 48);

    items.forEach((item) => {
      const descWidth = colQty - this.margin - 15;
      const descLines = this.doc.splitTextToSize(item.description, descWidth);
      const rowHeight = Math.max(10, descLines.length * 5 + 4);

      // Vertical borders
      this.doc.setDrawColor(230, 230, 230);
      this.doc.line(this.margin, currentY, this.margin, currentY + rowHeight); // Left
      this.doc.line(rightMargin, currentY, rightMargin, currentY + rowHeight); // Right

      this.doc.text(descLines, this.margin + 5, currentY + 5);
      this.doc.text(item.quantity.toString(), colQty, currentY + 5, { align: 'right' });
      this.doc.text(`${data.clientCurrency || '$'}${item.rate.toFixed(2)}`, colRate, currentY + 5, { align: 'right' });
      this.doc.text(`${data.clientCurrency || '$'}${item.amount.toFixed(2)}`, colAmount, currentY + 5, { align: 'right' });

      // Bottom border
      this.doc.line(this.margin, currentY + rowHeight, rightMargin, currentY + rowHeight);

      currentY += rowHeight;
    });

    // Totals
    let totalY = currentY + 10;
    const totalLabelX = colRate - 20;

    this.doc.setFontSize(10);
    this.doc.setTextColor(50, 49, 48);

    this.doc.text('Subtotal:', totalLabelX, totalY, { align: 'right' });
    this.doc.text(`${data.clientCurrency || '$'}${data.subtotal.toFixed(2)}`, colAmount, totalY, { align: 'right' });
    totalY += 6;

    if (data.taxAmount > 0) {
      this.doc.text('Tax:', totalLabelX, totalY, { align: 'right' });
      this.doc.text(`${data.clientCurrency || '$'}${data.taxAmount.toFixed(2)}`, colAmount, totalY, { align: 'right' });
      totalY += 6;
    }

    if (data.discountAmount > 0) {
      this.doc.text('Discount:', totalLabelX, totalY, { align: 'right' });
      this.doc.text(`-${data.clientCurrency || '$'}${data.discountAmount.toFixed(2)}`, colAmount, totalY, { align: 'right' });
      totalY += 6;
    }

    // Total Due Double Line style
    totalY += 2;
    this.doc.setDrawColor(0, 120, 212); // Blue
    this.doc.setLineWidth(0.5);
    this.doc.line(colAmount - 30, totalY, colAmount, totalY);
    totalY += 6;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(12);
    this.doc.text('Total Due:', totalLabelX, totalY, { align: 'right' });
    this.doc.text(`${data.clientCurrency || '$'}${data.amount.toFixed(2)}`, colAmount, totalY, { align: 'right' });

    // Footer lines
    const footerY = this.pageHeight - 20;
    this.doc.setDrawColor(200, 200, 200);
    this.doc.setLineWidth(0.1);
    this.doc.line(this.margin, footerY, rightMargin, footerY);
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(96, 94, 92);
    this.doc.text('Payment Terms: Net 30 days', this.margin, footerY + 5);

    if (!data.whiteLabelMode) {
      this.doc.setFontSize(8);
      this.doc.setTextColor(150, 150, 150);
      this.doc.text('Powered by SmartInvoice', rightMargin, footerY + 5, { align: 'right' });
    }
  }

  // --- Amazon Efficient (Template 3) Renderer ---
  private renderAmazonLayout(data: InvoiceData) {
    const accentColor = [255, 153, 0]; // #FF9900

    const startY = 20;

    // Header Section
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(22);
    this.doc.setTextColor(17, 17, 17); // #111111
    this.doc.text(data.companyName || 'SmartInvoice', this.margin, startY + 8);

    // Orange Line
    this.doc.setDrawColor(255, 153, 0);
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin + 80, startY + 5, this.pageWidth - this.margin, startY + 5);

    // Invoice Type Label (dynamic)
    const typeLabel = this.getInvoiceTypeLabel(data.invoiceType);
    const typeColor = this.getInvoiceTypeColor(data.invoiceType);

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...typeColor);
    this.doc.text(typeLabel, this.pageWidth - this.margin - 40, startY + 3);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(17, 17, 17);
    this.doc.text(data.invoiceNumber || '', this.pageWidth - this.margin, startY + 10, { align: 'right' });

    // Watermark for Proforma/Past Due
    const watermark = this.shouldShowWatermark(data.invoiceType);
    if (watermark.show) {
      this.doc.setFontSize(60);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(...watermark.color);
      this.doc.setGState(new (this.doc as any).GState({ opacity: 0.1 }));
      const watermarkWidth = this.doc.getTextWidth(watermark.text);
      this.doc.text(watermark.text, (this.pageWidth - watermarkWidth) / 2, this.pageHeight / 2, {
        angle: 45
      });
      this.doc.setGState(new (this.doc as any).GState({ opacity: 1 }));
    }

    // Company Address
    this.doc.setFontSize(9);
    const companyInfo = [data.companyAddress, data.companyEmail].filter(Boolean).join(', ');
    this.doc.text(companyInfo, this.margin, startY + 16);

    // Boxed Sections
    const boxY = startY + 30;
    const boxHeight = 25;
    const col2X = this.margin + 90;

    // Box 1: Bill To
    this.doc.setDrawColor(221, 221, 221); // #DDD
    this.doc.setLineWidth(0.1);
    this.doc.rect(this.margin, boxY, 85, boxHeight);

    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Bill To:', this.margin + 2, boxY + 5);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(data.clientName, this.margin + 2, boxY + 10);
    if (data.clientEmail) this.doc.text(data.clientEmail, this.margin + 2, boxY + 15);

    // Box 2: Invoice Details
    this.doc.rect(col2X, boxY, 85, boxHeight);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Invoice Details:', col2X + 2, boxY + 5);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Date: ${data.date ? format(new Date(data.date), 'MMM dd, yyyy') : ''}`, col2X + 2, boxY + 10);
    this.doc.text(`Due: ${data.dueDate ? format(new Date(data.dueDate), 'MMM dd, yyyy') : ''}`, col2X + 2, boxY + 15);

    // Specialized Fields Section (Phase 2)
    let nextSectionY = boxY + boxHeight + 10;
    if (data.invoiceType && data.invoiceType !== 'sales') {
      nextSectionY = this.renderSpecializedSection(data, boxY + boxHeight + 5);
    }

    // Items Section
    const tableY = nextSectionY;

    // Header Bar
    this.doc.setFillColor(245, 245, 245); // #F5F5F5
    this.doc.rect(this.margin, tableY, this.pageWidth - (2 * this.margin), 8, 'F');
    this.doc.rect(this.margin, tableY, this.pageWidth - (2 * this.margin), 8, 'S'); // Border

    const colQty = this.pageWidth - this.margin - 70;
    const colRate = this.pageWidth - this.margin - 40;
    const colAmount = this.pageWidth - this.margin - 5;

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.text('DESCRIPTION', this.margin + 2, tableY + 5);
    this.doc.text('QTY', colQty, tableY + 5, { align: 'right' });
    this.doc.text('RATE', colRate, tableY + 5, { align: 'right' });
    this.doc.text('AMOUNT', colAmount, tableY + 5, { align: 'right' });

    // Items
    let items: InvoiceItem[] = [];
    if (data.items) {
      items = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
    }

    let currentY = tableY + 8;
    this.doc.setFont('helvetica', 'normal');

    items.forEach((item) => {
      const descWidth = colQty - this.margin - 10;
      const descLines = this.doc.splitTextToSize(item.description, descWidth);
      const rowHeight = Math.max(8, descLines.length * 4 + 4);

      // Box around row
      this.doc.rect(this.margin, currentY, this.pageWidth - (2 * this.margin), rowHeight);

      this.doc.text(descLines, this.margin + 2, currentY + 4);
      this.doc.text(item.quantity.toString(), colQty, currentY + 4, { align: 'right' });
      this.doc.text(`${data.clientCurrency || '$'}${item.rate.toFixed(2)}`, colRate, currentY + 4, { align: 'right' });
      this.doc.text(`${data.clientCurrency || '$'}${item.amount.toFixed(2)}`, colAmount, currentY + 4, { align: 'right' });

      currentY += rowHeight;
    });

    // Totals Box
    const summaryWidth = 60;
    const summaryX = this.pageWidth - this.margin - summaryWidth;
    const summaryY = currentY + 5;

    this.doc.rect(summaryX, summaryY, summaryWidth, 25);

    this.doc.text('Subtotal:', summaryX + 2, summaryY + 5);
    this.doc.text(`${data.clientCurrency || '$'}${data.subtotal.toFixed(2)}`, this.pageWidth - this.margin - 2, summaryY + 5, { align: 'right' });

    this.doc.setDrawColor(221, 221, 221);
    this.doc.line(summaryX, summaryY + 15, summaryX + summaryWidth, summaryY + 15);

    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Total:', summaryX + 2, summaryY + 20);
    this.doc.text(`${data.clientCurrency || '$'}${data.amount.toFixed(2)}`, this.pageWidth - this.margin - 2, summaryY + 20, { align: 'right' });

    // Footer
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('Payment Instructions: Net 30 days', this.margin, this.pageHeight - 20);
    this.doc.text(data.companyEmail ? `Questions: ${data.companyEmail}` : '', this.margin, this.pageHeight - 15);

    if (!data.whiteLabelMode) {
      this.doc.setFontSize(8);
      this.doc.setTextColor(150, 150, 150);
      this.doc.text('Powered by SmartInvoice', this.pageWidth - this.margin, this.pageHeight - 20, { align: 'right' });
    }
  }


  // --- Financial Corporate (Template 4) Renderer ---
  private renderFinancialLayout(data: InvoiceData) {
    // Double Border
    this.doc.setDrawColor(0, 0, 0);
    this.doc.setLineWidth(0.5);
    this.doc.rect(10, 10, this.pageWidth - 20, this.pageHeight - 20); // Outer
    this.doc.setLineWidth(0.2);
    this.doc.rect(12, 12, this.pageWidth - 24, this.pageHeight - 24); // Inner

    const startY = 30;

    // Centered Header
    this.doc.setFont('times', 'bold');
    this.doc.setFontSize(28);
    this.doc.setTextColor(0, 0, 0);
    const companyWidth = this.doc.getTextWidth(data.companyName || 'SmartInvoice');
    this.doc.text(data.companyName || 'SmartInvoice', (this.pageWidth - companyWidth) / 2, startY);

    this.doc.setFontSize(10);
    this.doc.setFont('times', 'normal');
    const address = [data.companyAddress, data.companyEmail].filter(Boolean).join(' • ');
    const addrWidth = this.doc.getTextWidth(address);
    this.doc.text(address, (this.pageWidth - addrWidth) / 2, startY + 8);

    // Separator
    this.doc.setLineWidth(0.5);
    this.doc.line(30, startY + 15, this.pageWidth - 30, startY + 15);

    // Invoice Title (dynamic based on type)
    const typeLabel = this.getInvoiceTypeLabel(data.invoiceType);
    const typeColor = this.getInvoiceTypeColor(data.invoiceType);

    this.doc.setFont('times', 'bold');
    this.doc.setFontSize(18);
    this.doc.setTextColor(...typeColor);
    const invWidth = this.doc.getTextWidth(typeLabel);
    this.doc.text(typeLabel, (this.pageWidth - invWidth) / 2, startY + 30);

    this.doc.setFontSize(12);
    this.doc.setFont('times', 'normal');
    this.doc.setTextColor(0, 0, 0);
    const invNum = data.invoiceNumber || '';
    const invNumWidth = this.doc.getTextWidth(invNum);
    this.doc.text(invNum, (this.pageWidth - invNumWidth) / 2, startY + 36);

    // Watermark for Proforma/Past Due
    const watermark = this.shouldShowWatermark(data.invoiceType);
    if (watermark.show) {
      this.doc.setFontSize(60);
      this.doc.setFont('times', 'bold');
      this.doc.setTextColor(...watermark.color);
      this.doc.setGState(new (this.doc as any).GState({ opacity: 0.1 }));
      const watermarkWidth = this.doc.getTextWidth(watermark.text);
      this.doc.text(watermark.text, (this.pageWidth - watermarkWidth) / 2, this.pageHeight / 2, {
        angle: 45
      });
      this.doc.setGState(new (this.doc as any).GState({ opacity: 1 }));
    }

    // Columns
    const sectionY = startY + 50;
    const col1X = 25;
    const col2X = this.pageWidth / 2 + 10;

    this.doc.setFont('times', 'bold');
    this.doc.setFontSize(10);
    this.doc.text('BILLED TO:', col1X, sectionY);
    this.doc.text('INVOICE INFORMATION:', col2X, sectionY);

    this.doc.setFont('times', 'normal');
    this.doc.text(data.clientName, col1X, sectionY + 6);
    this.doc.text(data.clientEmail, col1X, sectionY + 11);
    if (data.clientCompany) this.doc.text(data.clientCompany, col1X, sectionY + 16);

    this.doc.text(`Date: ${data.date ? format(new Date(data.date), 'MMM dd, yyyy') : ''}`, col2X, sectionY + 6);
    this.doc.text(`Due: ${data.dueDate ? format(new Date(data.dueDate), 'MMM dd, yyyy') : ''}`, col2X, sectionY + 11);


    // Specialized Fields Section (Phase 2)
    let nextSectionY = sectionY + 30;
    if (data.invoiceType && data.invoiceType !== 'sales') {
      nextSectionY = this.renderSpecializedSection(data, sectionY + 25);
    }

    // Table
    const tableY = nextSectionY + 5;
    const rightMargin = this.pageWidth - 25;

    // Black Header
    this.doc.setFillColor(0, 0, 0);
    this.doc.rect(20, tableY, this.pageWidth - 40, 8, 'F');

    this.doc.setTextColor(255, 255, 255);
    this.doc.setFont('times', 'bold');
    this.doc.setFontSize(9);

    const colQty = rightMargin - 60;
    const colRate = rightMargin - 35;
    const colAmount = rightMargin - 5;

    this.doc.text('DESCRIPTION', 25, tableY + 5);
    this.doc.text('QTY', colQty, tableY + 5, { align: 'right' });
    this.doc.text('RATE', colRate, tableY + 5, { align: 'right' });
    this.doc.text('AMOUNT', colAmount, tableY + 5, { align: 'right' });

    // Items
    let items: InvoiceItem[] = [];
    if (data.items) {
      items = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;
    }

    let currentY = tableY + 8;
    this.doc.setTextColor(0, 0, 0);
    this.doc.setFont('times', 'normal');

    items.forEach((item) => {
      const descWidth = colQty - 25 - 5;
      const descLines = this.doc.splitTextToSize(item.description, descWidth);
      const rowHeight = Math.max(8, descLines.length * 4 + 4);

      // Vertical lines
      this.doc.setDrawColor(0, 0, 0);
      this.doc.setLineWidth(0.1);
      this.doc.line(20, currentY, 20, currentY + rowHeight); // Left
      this.doc.line(this.pageWidth - 20, currentY, this.pageWidth - 20, currentY + rowHeight); // Right

      this.doc.text(descLines, 25, currentY + 5);
      this.doc.text(item.quantity.toString(), colQty, currentY + 5, { align: 'right' });
      this.doc.text(`${data.clientCurrency || '$'}${item.rate.toFixed(2)}`, colRate, currentY + 5, { align: 'right' });
      this.doc.text(`${data.clientCurrency || '$'}${item.amount.toFixed(2)}`, colAmount, currentY + 5, { align: 'right' });

      this.doc.line(20, currentY + rowHeight, this.pageWidth - 20, currentY + rowHeight); // Bottom
      currentY += rowHeight;
    });

    // Totals
    const summaryY = currentY + 10;
    const summaryWidth = 70;
    const summaryX = this.pageWidth - 20 - summaryWidth;

    // Summary Box
    this.doc.setDrawColor(0, 0, 0);
    this.doc.rect(summaryX, summaryY, summaryWidth, 30);

    let totalLineY = summaryY + 6;
    this.doc.text('Subtotal', summaryX + 5, totalLineY);
    this.doc.text(`${data.clientCurrency || '$'}${data.subtotal.toFixed(2)}`, this.pageWidth - 25, totalLineY, { align: 'right' });

    totalLineY += 6;
    if (data.taxAmount > 0) {
      this.doc.text(`Tax (${data.taxRate}%)`, summaryX + 5, totalLineY);
      this.doc.text(`${data.clientCurrency || '$'}${data.taxAmount.toFixed(2)}`, this.pageWidth - 25, totalLineY, { align: 'right' });
      totalLineY += 6;
    }

    this.doc.line(summaryX, totalLineY, summaryX + summaryWidth, totalLineY);
    totalLineY += 6;

    this.doc.setFont('times', 'bold');
    this.doc.text('TOTAL', summaryX + 5, totalLineY);
    this.doc.text(`${data.clientCurrency || '$'}${data.amount.toFixed(2)}`, this.pageWidth - 25, totalLineY, { align: 'right' });

    // Footer
    if (!data.whiteLabelMode) {
      const footerY = this.pageHeight - 30;
      this.doc.setFontSize(8);
      this.doc.setFont('times', 'normal');
      this.doc.setTextColor(150, 150, 150);
      const poweredText = 'Powered by SmartInvoice';
      const poweredWidth = this.doc.getTextWidth(poweredText);
      this.doc.text(poweredText, (this.pageWidth - poweredWidth) / 2, footerY);
    }
  }

  // --- Creative Agency (Style 5) Renderer ---
  private renderCreativeAgencyLayout(data: InvoiceData) {
    this.colors = this.getColorScheme('creative-agency', data.customColors);
    const margin = 20;
    const rightMargin = this.pageWidth - margin;
    let currentY = 0;

    // 1. HEADER: Full-width vibrant background with huge whitespace
    // Create a modern, diagonal header shape
    this.doc.setFillColor(...(this.colors.primary as [number, number, number]));
    this.doc.triangle(
      this.pageWidth, 0,
      this.pageWidth, 120,
      this.pageWidth * 0.4, 0,
      'F'
    );

    // Add a second accent shape for depth
    this.doc.setFillColor(...(this.colors.accent as [number, number, number]));
    this.doc.setGState(this.doc.GState({ opacity: 0.8 }));
    this.doc.triangle(
      this.pageWidth, 0,
      this.pageWidth, 60,
      this.pageWidth * 0.7, 0,
      'F'
    );
    this.doc.setGState(this.doc.GState({ opacity: 1 }));

    // Company Name (Top Left, huge and bold)
    currentY = 30;
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(24);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(data.companyName || 'SmartInvoice', margin, currentY);

    // Company Meta (Below Name, small and tracked out)
    currentY += 8;
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(110, 110, 110);
    const companyMeta = [data.companyAddress, data.companyEmail, data.companyWebsite].filter(Boolean).join('  |  ');
    this.doc.text(companyMeta.toUpperCase(), margin, currentY);

    // INVOICE Label (Top Right, overlapping the color)
    this.doc.setFontSize(42);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('INVOICE', rightMargin, 35, { align: 'right' });

    // 2. HERO SECTION: Client & Details Grid
    currentY += 40;
    const leftColX = margin;
    const rightColX = this.pageWidth * 0.6;

    // "BILL TO" - Modern minimalist
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...(this.colors.primary as [number, number, number]));
    this.doc.text('PREPARED FOR', leftColX, currentY);

    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(data.clientName, leftColX, currentY + 8);

    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(80, 80, 80);
    if (data.clientCompany) this.doc.text(data.clientCompany, leftColX, currentY + 14);
    if (data.clientEmail) this.doc.text(data.clientEmail, leftColX, currentY + 19);
    if (data.clientAddress) {
      const addrLines = this.doc.splitTextToSize(data.clientAddress, 80);
      this.doc.text(addrLines, leftColX, currentY + 24);
    }

    // Invoice Meta (Right Side)
    const metaY = currentY;
    const metaRows = [
      { label: 'NUMBER', value: data.invoiceNumber },
      { label: 'DATE', value: data.date ? format(new Date(data.date), 'MMM dd, yyyy') : '' },
      { label: 'DUE', value: data.dueDate ? format(new Date(data.dueDate), 'MMM dd, yyyy') : '' },
    ];

    metaRows.forEach((row, i) => {
      const y = metaY + (i * 12);
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(...(this.colors.primary as [number, number, number]));
      this.doc.text(row.label, rightColX, y);

      this.doc.setFontSize(10);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(row.value, rightColX + 30, y);
    });

    // 3. SPECIALIZED CONTENT
    currentY += 60;
    if (data.invoiceType && data.invoiceType !== 'sales') {
      currentY = this.renderSpecializedSection(data, currentY);
      currentY += 20;
    }

    // 4. ITEMS TABLE: Clean, spacious, no vertical lines
    const tableHeaderY = currentY;

    // Header Line
    this.doc.setDrawColor(230, 230, 230);
    this.doc.setLineWidth(0.5);
    this.doc.line(margin, tableHeaderY + 2, rightMargin, tableHeaderY + 2);

    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(150, 150, 150);

    this.doc.text('ITEM DESCRIPTION', margin, tableHeaderY);
    this.doc.text('QTY', rightMargin - 80, tableHeaderY, { align: 'right' });
    this.doc.text('RATE', rightMargin - 40, tableHeaderY, { align: 'right' });
    this.doc.text('AMOUNT', rightMargin, tableHeaderY, { align: 'right' });

    let itemsY = tableHeaderY + 15;
    const items: InvoiceItem[] = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;

    items.forEach((item, index) => {
      // Item Name
      this.doc.setFontSize(10);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(0, 0, 0);
      const descLines = this.doc.splitTextToSize(item.description, 100);
      this.doc.text(descLines, margin, itemsY);

      // Values
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(80, 80, 80);
      this.doc.text(item.quantity.toString(), rightMargin - 80, itemsY, { align: 'right' });
      this.doc.text(item.rate.toFixed(2), rightMargin - 40, itemsY, { align: 'right' });

      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(item.amount.toFixed(2), rightMargin, itemsY, { align: 'right' });

      const rowHeight = Math.max(10, descLines.length * 5 + 8);
      itemsY += rowHeight;

      // Subtle separator
      this.doc.setDrawColor(245, 245, 245);
      this.doc.setLineWidth(0.2);
      this.doc.line(margin, itemsY - 5, rightMargin, itemsY - 5);
    });

    // 5. TOTALS SECTION: Modern large typography
    const summaryY = itemsY + 10;
    const summaryX = this.pageWidth * 0.5;

    // Subtotal
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text('Subtotal', rightMargin - 60, summaryY, { align: 'right' });
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(`${data.clientCurrency}${data.subtotal.toFixed(2)}`, rightMargin, summaryY, { align: 'right' });

    // Tax
    if (data.taxAmount > 0) {
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(`Tax (${data.taxRate}%)`, rightMargin - 60, summaryY + 8, { align: 'right' });
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(`${data.clientCurrency}${data.taxAmount.toFixed(2)}`, rightMargin, summaryY + 8, { align: 'right' });
    }

    // Grand Total (Big & Bold)
    const totalY = summaryY + 25;
    this.doc.setFontSize(28);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...(this.colors.primary as [number, number, number]));
    this.doc.text(`${data.clientCurrency}${data.amount.toFixed(2)}`, rightMargin, totalY, { align: 'right' });

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(80, 80, 80);
    this.doc.text('TOTAL DUE', rightMargin, totalY - 12, { align: 'right' });

    // Footer Tagline
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...(this.colors.primary as [number, number, number]));
    this.doc.text('DESIGNED FOR SUCCESS', margin, this.pageHeight - 20);
  }

  // --- Professional Services (Style 6) Renderer ---
  private renderProfessionalServicesLayout(data: InvoiceData) {
    this.colors = this.getColorScheme('professional-services', data.customColors);
    const margin = 20;
    const rightMargin = this.pageWidth - margin;

    // Header Bar - Refined Navy Blue
    this.doc.setFillColor(...(this.colors.primary as [number, number, number]));
    this.doc.rect(0, 0, this.pageWidth, 18, 'F');

    // Accent Line
    this.doc.setFillColor(...(this.colors.accent as [number, number, number]));
    this.doc.rect(0, 18, this.pageWidth, 1, 'F');

    let currentY = 40;

    // Header Section - Classic Corporate Layout
    // Left: Company Info
    this.doc.setFont('times', 'bold'); // Using Times for more formal look
    this.doc.setFontSize(24);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(data.companyName || 'SmartInvoice', margin, currentY);

    currentY += 8;
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(80, 80, 80);
    if (data.companyAddress) this.doc.text(data.companyAddress, margin, currentY);

    // Right: Invoice Meta Box
    const boxWidth = 70;
    const boxX = rightMargin - boxWidth;
    const boxY = 25;
    const boxHeight = 35;

    // Light gray background box
    this.doc.setFillColor(248, 248, 250);
    this.doc.setDrawColor(230, 230, 230);
    this.doc.rect(boxX, boxY, boxWidth, boxHeight, 'FD');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(...(this.colors.primary as [number, number, number]));
    this.doc.text('INVOICE', boxX + 10, boxY + 12);

    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(`# ${data.invoiceNumber}`, boxX + 10, boxY + 22);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(8);
    this.doc.setTextColor(100, 100, 100);
    this.doc.text(data.date ? format(new Date(data.date), 'MMMM dd, yyyy') : '', boxX + 10, boxY + 29);

    currentY += 25;

    // Continued from new implementation...

    // Client Info Section (Refined)
    currentY += 15;

    // Left: Client Box
    const clientBoxY = currentY;

    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...(this.colors.primary as [number, number, number]));
    this.doc.text('PREPARED FOR', margin, clientBoxY);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(data.clientName, margin, clientBoxY + 8);

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(9);
    this.doc.setTextColor(80, 80, 80);
    if (data.clientCompany) this.doc.text(data.clientCompany, margin, clientBoxY + 14);
    if (data.clientEmail) this.doc.text(data.clientEmail, margin, clientBoxY + 19);

    // Right: Summary/Total (Clean look without heavy backgrounds)
    const rightColX = this.pageWidth * 0.6;

    this.doc.setDrawColor(230, 230, 230);
    this.doc.setLineWidth(0.5);
    this.doc.line(rightColX, clientBoxY, rightColX, clientBoxY + 30); // Vertical separator

    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(100, 100, 100);
    this.doc.text('AMOUNT DUE', rightColX + 15, clientBoxY + 5);

    this.doc.setFontSize(20);
    this.doc.setFont('times', 'bold'); // Matching header font
    this.doc.setTextColor(...(this.colors.primary as [number, number, number]));
    this.doc.text(`${data.clientCurrency}${data.amount.toFixed(2)}`, rightColX + 15, clientBoxY + 15);

    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...(this.colors.accent as [number, number, number]));
    // Add Due Date if exists
    if (data.dueDate) {
      this.doc.text(`DUE: ${format(new Date(data.dueDate), 'MMM dd, yyyy')}`, rightColX + 15, clientBoxY + 24);
    }

    currentY += 45;

    // Specialized Section (Connected from new implementation)
    if (data.invoiceType && data.invoiceType !== 'sales') {
      currentY = this.renderSpecializedSection(data, currentY);
    }

    // Professional Table
    const tableY = currentY + 10;
    this.doc.setFillColor(...(this.colors.primary as [number, number, number]));
    this.doc.rect(margin, tableY, rightMargin - margin, 8, 'F');

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(9);
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('SERVICE DESCRIPTION', margin + 5, tableY + 6);
    this.doc.text('QTY', rightMargin - 50, tableY + 6, { align: 'right' });
    this.doc.text('RATE', rightMargin - 30, tableY + 6, { align: 'right' });
    this.doc.text('TOTAL', rightMargin - 5, tableY + 6, { align: 'right' });

    let itemsY = tableY + 15;
    const items: InvoiceItem[] = typeof data.items === 'string' ? JSON.parse(data.items) : data.items;

    items.forEach((item, index) => {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);
      this.doc.setTextColor(0, 0, 0);

      const descLines = this.doc.splitTextToSize(item.description, 100);
      this.doc.text(descLines, margin + 5, itemsY);

      this.doc.text(item.quantity.toString(), rightMargin - 50, itemsY, { align: 'right' });
      this.doc.text(item.rate.toFixed(2), rightMargin - 30, itemsY, { align: 'right' });
      this.doc.text(item.amount.toFixed(2), rightMargin - 5, itemsY, { align: 'right' });

      itemsY += Math.max(8, descLines.length * 5 + 4);

      this.doc.setDrawColor(240, 240, 240);
      this.doc.line(margin, itemsY - 2, rightMargin, itemsY - 2);
    });

    // Totals Section
    let totalsY = itemsY + 10;
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Subtotal:', rightMargin - 50, totalsY, { align: 'right' });
    this.doc.text(`${data.clientCurrency}${data.subtotal.toFixed(2)}`, rightMargin - 5, totalsY, { align: 'right' });

    if (data.taxAmount > 0) {
      totalsY += 6;
      this.doc.text(`Tax (${data.taxRate}%):`, rightMargin - 50, totalsY, { align: 'right' });
      this.doc.text(`${data.clientCurrency}${data.taxAmount.toFixed(2)}`, rightMargin - 5, totalsY, { align: 'right' });
    }

    totalsY += 6;
    this.doc.setFillColor(...(this.colors.primary as [number, number, number]));
    this.doc.rect(rightMargin - 60, totalsY - 4, 60, 8, 'F');
    this.doc.setTextColor(255, 255, 255);
    this.doc.text('TOTAL DUE:', rightMargin - 35, totalsY + 2, { align: 'right' });
    this.doc.text(`${data.clientCurrency}${data.amount.toFixed(2)}`, rightMargin - 5, totalsY + 2, { align: 'right' });

    // Payment Terms
    this.doc.setTextColor(100, 100, 100);
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('PAYMENT TERMS:', margin, totalsY + 20);
    this.doc.text(data.terms || 'Payment is due within 30 days.', margin, totalsY + 25);
  }

  private addGeometricPattern() {
    this.doc.setDrawColor(...(this.colors.white as [number, number, number]));
    this.doc.setGState(this.doc.GState({ opacity: 0.05 }));

    for (let i = 0; i < 15; i++) {
      const x = (i * 25) - 50;
      const y = 20 + (i % 3) * 15;
      this.doc.circle(x, y, 8);
      this.doc.circle(x + 200, y + 20, 6);
    }

    this.doc.setGState(this.doc.GState({ opacity: 1 }));
  }

  private addPremiumStatusBadge(status: string) {
    const statusConfig = {
      PAID: { color: [16, 185, 129], text: 'PAID', bgOpacity: 0.9 },
      DUE: { color: [245, 158, 11], text: 'DUE', bgOpacity: 0.9 },
      OVERDUE: { color: [239, 68, 68], text: 'OVERDUE', bgOpacity: 0.9 },
      PENDING: { color: [99, 102, 241], text: 'PENDING', bgOpacity: 0.9 }
    }[status] || { color: [156, 163, 175], text: status, bgOpacity: 0.9 };

    const badgeWidth = 35;
    const badgeHeight = 10;
    const badgeX = this.pageWidth - this.margin - badgeWidth;
    const badgeY = 30;

    this.doc.setFillColor(0, 0, 0);
    this.doc.setGState(this.doc.GState({ opacity: 0.1 }));
    this.doc.roundedRect(badgeX, badgeY + 1, badgeWidth, badgeHeight, 5, 5, 'F');

    this.doc.setGState(this.doc.GState({ opacity: statusConfig.bgOpacity }));
    this.doc.setFillColor(...(statusConfig.color as [number, number, number]));
    this.doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 5, 5, 'F');

    this.doc.setGState(this.doc.GState({ opacity: 1 }));
    this.doc.setTextColor(...(this.colors.white as [number, number, number]));
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(statusConfig.text, badgeX + badgeWidth / 2, badgeY + 6.5, { align: 'center' });
  }

  private addCompanyBranding(data: InvoiceData) {
    const startY = 25;

    this.doc.setFillColor(...(this.colors.accent as [number, number, number]));
    this.doc.setGState(this.doc.GState({ opacity: 0.9 }));
    this.doc.roundedRect(this.margin, startY - 8, 24, 24, 4, 4, 'F');
    this.doc.setGState(this.doc.GState({ opacity: 1 }));

    this.doc.setFontSize(16);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...(this.colors.white as [number, number, number]));
    const initials = (data.companyName || 'SI').substring(0, 2).toUpperCase();
    this.doc.text(initials, this.margin + 12, startY + 6, { align: 'center' });

    this.doc.setFontSize(22);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...(this.colors.white as [number, number, number]));

    const companyNameLines = this.doc.splitTextToSize(data.companyName || 'SmartInvoice', 60);
    this.doc.text(companyNameLines, this.margin + 35, startY + 2);

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setGState(this.doc.GState({ opacity: 0.8 }));
    this.doc.text('Professional Invoice Management', this.margin + 35, startY + 12);
    this.doc.setGState(this.doc.GState({ opacity: 1 }));

    const contactY = startY + 22;
    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...(this.colors.white as [number, number, number]));

    const contactInfo = [
      data.companyEmail,
      data.companyPhone,
      data.companyWebsite
    ].filter(Boolean) as string[];

    let contactLineY = contactY;
    contactInfo.forEach((info) => {
      if (info) {
        const infoLines = this.doc.splitTextToSize(info, 60);
        this.doc.text(infoLines, this.margin + 35, contactLineY);
        contactLineY += (infoLines.length * 4);
      }
    });

    this.doc.setFontSize(32);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...(this.colors.white as [number, number, number]));
    this.doc.text('INVOICE', this.pageWidth - this.margin - 40, startY + 18, { align: 'right' });
  }

  private addInvoiceMetadata(data: InvoiceData) {
    const startY = 100;
    const cardWidth = 85;
    const cardHeight = 50;

    this.doc.setFillColor(0, 0, 0);
    this.doc.setGState(this.doc.GState({ opacity: 0.05 }));
    this.doc.roundedRect(this.margin + 2, startY + 2, cardWidth, cardHeight, 4, 4, 'F');

    this.doc.setGState(this.doc.GState({ opacity: 1 }));
    this.doc.setFillColor(...(this.colors.white as [number, number, number]));
    this.doc.roundedRect(this.margin, startY, cardWidth, cardHeight, 4, 4, 'F');

    this.doc.setDrawColor(...(this.colors.light as [number, number, number]));
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(this.margin, startY, cardWidth, cardHeight, 4, 4);

    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...(this.colors.primary as [number, number, number]));
    this.doc.text('Invoice Details', this.margin + 5, startY + 10);

    const metadata = [
      ['Invoice #', data.invoiceNumber || 'INV-001'],
      ['Issue Date', data.date ? format(new Date(data.date), 'MMM dd, yyyy') : 'N/A'],
      ['Due Date', data.dueDate ? format(new Date(data.dueDate), 'MMM dd, yyyy') : 'N/A'],
      ['Currency', data.clientCurrency || 'USD']
    ];

    this.doc.setFontSize(8);
    metadata.forEach(([label, value], index) => {
      const y = startY + 18 + (index * 7);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(...(this.colors.medium as [number, number, number]));
      this.doc.text(label + ':', this.margin + 5, y);

      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(...(this.colors.dark as [number, number, number]));
      this.doc.text(value, this.margin + 35, y);
    });
  }

  private addClientSection(data: InvoiceData) {
    const startY = 100;
    const cardWidth = 85;
    const cardHeight = 50;
    const rightX = this.pageWidth - this.margin - cardWidth;

    this.doc.setFillColor(0, 0, 0);
    this.doc.setGState(this.doc.GState({ opacity: 0.05 }));
    this.doc.roundedRect(rightX + 2, startY + 2, cardWidth, cardHeight, 4, 4, 'F');

    this.doc.setGState(this.doc.GState({ opacity: 1 }));
    this.doc.setFillColor(...(this.colors.bg as [number, number, number]));
    this.doc.roundedRect(rightX, startY, cardWidth, cardHeight, 4, 4, 'F');

    this.doc.setDrawColor(...(this.colors.light as [number, number, number]));
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(rightX, startY, cardWidth, cardHeight, 4, 4);

    this.doc.setFontSize(11);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...(this.colors.primary as [number, number, number]));
    this.doc.text('Bill To', rightX + 5, startY + 10);

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...(this.colors.accent as [number, number, number]));

    const clientName = data.clientName || 'Valued Client';

    this.doc.setTextColor(...(this.colors.dark as [number, number, number]));
    this.doc.setFont('helvetica', 'bold');
    const clientNameLines = this.doc.splitTextToSize(clientName, cardWidth - 16);
    this.doc.text(clientNameLines, rightX + 8, startY + 20);

    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...(this.colors.dark as [number, number, number]));

    const detailsY = startY + 20 + (clientNameLines.length * 5) + 2;
    const details = [
      data.clientCompany || '',
      data.clientEmail || '',
      data.clientAddress || '',
      data.clientGST ? `GST: ${data.clientGST}` : ''
    ].filter(Boolean);

    const fullDetailsText = details.join('\n');
    const textLines = this.doc.splitTextToSize(fullDetailsText, cardWidth - 16);
    this.doc.text(textLines, rightX + 8, detailsY);
  }

  private calculateItemsTableHeight(items: InvoiceItem[]): { totalHeight: number, rowHeights: number[] } {
    if (!items || !Array.isArray(items)) {
      return { totalHeight: 0, rowHeights: [] };
    }
    const tableWidth = this.pageWidth - (2 * this.margin);
    let totalRowsHeight = 0;
    const rowHeights = items.map(item => {
      const descriptionLines = this.doc.splitTextToSize(item.description || 'N/A', tableWidth * 0.5 - 16);
      const rowHeight = Math.max(15, (descriptionLines.length * 5) + 6);
      totalRowsHeight += rowHeight;
      return rowHeight;
    });
    return { totalHeight: totalRowsHeight, rowHeights };
  }

  private addPremiumItemsTable(data: InvoiceData) {
    // Ensure items is an array
    let items: InvoiceItem[] = [];
    if (data.items) {
      if (typeof data.items === 'string') {
        try {
          items = JSON.parse(data.items);
        } catch (error) {
          console.error('Failed to parse items JSON:', error);
          items = [];
        }
      } else if (Array.isArray(data.items)) {
        items = data.items;
      } else {
        console.error('Items is not an array or JSON string:', typeof data.items);
        items = [];
      }
    }

    const startY = 165;
    const tableWidth = this.pageWidth - (2 * this.margin);
    const headerHeight = 18;

    const { totalHeight: totalRowsHeight, rowHeights } = this.calculateItemsTableHeight(items);
    const tableHeight = headerHeight + totalRowsHeight;

    // Draw the main container with rounded corners
    this.doc.setDrawColor(...(this.colors.light as [number, number, number]));
    this.doc.setLineWidth(0.3);
    this.doc.setFillColor(...(this.colors.white as [number, number, number]));
    this.doc.roundedRect(this.margin, startY, tableWidth, tableHeight, 4, 4, 'FD');

    // Draw the header
    this.doc.setFillColor(...(this.colors.primary as [number, number, number]));
    this.doc.rect(this.margin, startY, tableWidth, headerHeight, 'F');

    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...(this.colors.white as [number, number, number]));

    const headers = ['Description', 'Qty', 'Rate', 'Amount'];
    const columnWidths = [tableWidth * 0.5, tableWidth * 0.15, tableWidth * 0.175, tableWidth * 0.175];
    let currentX = this.margin;

    // ==================================================================
    // TODO: Implement PDF generation for Phase 2 invoice types (Timesheet, Commercial, Tax, Retainer, Expense)
    // The previously pasted JSX code is strictly for React components (UI) and cannot be used here.
    // These sections must be implemented using this.doc.text(), this.doc.rect() and other jspdf commands.
    // ==================================================================

    headers.forEach((header, index) => {
      const headerX = index === 0 ? currentX + 8 : currentX + columnWidths[index] - 8;
      const align = index === 0 ? 'left' : 'right';
      this.doc.text(header, headerX, startY + 12, { align });
      currentX += columnWidths[index];
    });

    this.doc.setFontSize(9);
    let currentY = startY + headerHeight;

    items.forEach((item, index) => {
      const rowHeight = rowHeights[index];

      if (index < items.length - 1) {
        this.doc.setDrawColor(...(this.colors.light as [number, number, number]));
        this.doc.setLineWidth(0.2);
        this.doc.line(this.margin, currentY + rowHeight, this.pageWidth - this.margin, currentY + rowHeight);
      }

      this.doc.setTextColor(...(this.colors.dark as [number, number, number]));
      this.doc.setFont('helvetica', 'bold');

      const descriptionLines = this.doc.splitTextToSize(item.description, 75);
      const textY = currentY + 8;
      this.doc.text(descriptionLines, this.margin + 5, textY);

      const verticalCenterY = currentY + rowHeight / 2 + 2;

      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(...(this.colors.medium as [number, number, number]));

      this.doc.text(item.quantity.toString(), this.margin + 105, verticalCenterY, { align: 'right' });
      this.doc.text(`${data.clientCurrency || '$'}${item.rate.toFixed(2)}`, this.margin + 140, verticalCenterY, { align: 'right' });

      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(...(this.colors.primary as [number, number, number]));
      this.doc.text(`${data.clientCurrency || '$'}${item.amount.toFixed(2)}`, this.margin + 175, verticalCenterY, { align: 'right' });

      currentY += rowHeight;
    });
  }

  private addFinancialSummary(data: InvoiceData) {
    // Ensure items is an array
    let items: InvoiceItem[] = [];
    if (data.items) {
      if (typeof data.items === 'string') {
        try {
          items = JSON.parse(data.items);
        } catch (error) {
          console.error('Failed to parse items JSON:', error);
          items = [];
        }
      } else if (Array.isArray(data.items)) {
        items = data.items;
      } else {
        console.error('Items is not an array or JSON string:', typeof data.items);
        items = [];
      }
    }

    const { totalHeight } = this.calculateItemsTableHeight(items);
    const tableEndy = 165 + 18 + totalHeight;

    const startY = tableEndy + 10;
    const summaryWidth = 80;
    const summaryX = this.pageWidth - this.margin - summaryWidth;

    this.doc.setFillColor(0, 0, 0);
    this.doc.setGState(this.doc.GState({ opacity: 0.05 }));
    this.doc.roundedRect(summaryX + 2, startY + 2, summaryWidth, 40, 4, 4, 'F');
    this.doc.setGState(this.doc.GState({ opacity: 1 }));

    this.doc.setFillColor(...(this.colors.bg as [number, number, number]));
    this.doc.roundedRect(summaryX, startY, summaryWidth, 40, 4, 4, 'F');

    this.doc.setDrawColor(...(this.colors.light as [number, number, number]));
    this.doc.setLineWidth(0.3);
    this.doc.roundedRect(summaryX, startY, summaryWidth, 40, 4, 4);

    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...(this.colors.medium as [number, number, number]));

    const financials = [
      ['Subtotal', `${data.clientCurrency || '$'}${data.subtotal?.toFixed(2) || '0.00'}`],
      ['Discount', `(${(data.discountRate || 0).toFixed(1)}%) -${data.clientCurrency || '$'}${data.discountAmount?.toFixed(2) || '0.00'}`],
      ['Tax', `(${(data.taxRate || 0).toFixed(1)}%) +${data.clientCurrency || '$'}${data.taxAmount?.toFixed(2) || '0.00'}`]
    ];

    financials.forEach(([label, value], index) => {
      const y = startY + 10 + (index * 7);
      this.doc.text(label, summaryX + 8, y);
      this.doc.text(value, summaryX + summaryWidth - 8, y, { align: 'right' });
    });

    const totalY = startY + 32;
    this.doc.setDrawColor(...(this.colors.accent as [number, number, number]));
    this.doc.setLineWidth(0.5);
    this.doc.line(summaryX + 8, totalY - 2, summaryX + summaryWidth - 8, totalY - 2);

    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...(this.colors.primary as [number, number, number]));
    this.doc.text('TOTAL:', summaryX + 8, totalY + 5);

    this.doc.setTextColor(...(this.colors.accent as [number, number, number]));
    this.doc.setFontSize(14);
    this.doc.text(`${data.clientCurrency || '$'}${data.amount?.toFixed(2) || '0.00'}`, summaryX + summaryWidth - 8, totalY + 5, { align: 'right' });
  }

  private addPaymentInformation(data: InvoiceData) {
    const items = Array.isArray(data.items) ? data.items : [];
    const { totalHeight } = this.calculateItemsTableHeight(items);
    let tableEndy = 165 + 18 + totalHeight;

    let currentY = tableEndy + 10;

    if (data.notes) {
      this.addPremiumTextSection('Notes', data.notes, currentY);
      currentY += 25;
    }

    if (data.terms) {
      this.addPremiumTextSection('Terms & Conditions', data.terms, currentY);
      currentY += 25;
    }

    if (data.paymentLink) {
      currentY = Math.max(currentY, 230);
      this.doc.setFillColor(...(this.colors.accent as [number, number, number]));
      this.doc.setGState(this.doc.GState({ opacity: 0.1 }));
      this.doc.roundedRect(this.margin, currentY, this.pageWidth - (2 * this.margin), 25, 4, 4, 'F');
      this.doc.setGState(this.doc.GState({ opacity: 1 }));

      this.doc.setDrawColor(...(this.colors.accent as [number, number, number]));
      this.doc.setLineWidth(0.3);
      this.doc.roundedRect(this.margin, currentY, this.pageWidth - (2 * this.margin), 25, 4, 4);

      this.doc.setFontSize(11);
      this.doc.setFont('helvetica', 'bold');
      this.doc.setTextColor(...(this.colors.primary as [number, number, number]));
      this.doc.text('Quick Payment', this.margin + 5, currentY + 7);

      this.doc.setFontSize(9);
      this.doc.setFont('helvetica', 'normal');
      this.doc.setTextColor(...(this.colors.dark as [number, number, number]));
      this.doc.textWithLink('Pay securely online', this.margin + 5, currentY + 15, { url: data.paymentLink });
    }
  }

  private addPremiumTextSection(title: string, content: string, y: number) {
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...(this.colors.primary as [number, number, number]));
    this.doc.text(title, this.margin, y);

    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...(this.colors.dark as [number, number, number]));
    const lines = this.doc.splitTextToSize(content, this.pageWidth - (2 * this.margin) - 90);
    this.doc.text(lines.slice(0, 3), this.margin, y + 7);
  }

  private addFooterBranding(data: InvoiceData) {
    const footerY = this.pageHeight - 20;

    this.doc.setDrawColor(...(this.colors.primary as [number, number, number]));
    this.doc.setLineWidth(1);
    this.doc.line(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5);

    this.doc.setDrawColor(...(this.colors.accent as [number, number, number]));
    this.doc.setLineWidth(0.2);
    this.doc.line(this.margin, footerY - 4, this.pageWidth - this.margin, footerY - 4);

    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'bold');
    this.doc.setTextColor(...(this.colors.primary as [number, number, number]));
    this.doc.text('Generated by SmartInvoice', this.pageWidth / 2, footerY, { align: 'center' });

    this.doc.setFontSize(8);
    this.doc.setFont('helvetica', 'normal');
    this.doc.setTextColor(...(this.colors.medium as [number, number, number]));
    this.doc.text('Professional Invoice Management', this.pageWidth / 2, footerY + 5, { align: 'center' });

    const timestamp = format(new Date(), 'MMM dd, yyyy HH:mm');
    this.doc.setFontSize(7);
    this.doc.setTextColor(...(this.colors.light as [number, number, number]));
    this.doc.text(`Generated on ${timestamp}`, this.pageWidth / 2, footerY + 10, { align: 'center' });
  }
}
