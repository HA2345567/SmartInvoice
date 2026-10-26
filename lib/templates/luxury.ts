import { jsPDF } from 'jspdf';
import { InvoiceData, InvoiceItem } from '../pdf-generator';
import { InvoiceTemplate, TemplateContext, ColorScheme } from './types';
import { drawProportionalLogo, parseInvoiceItems, safeFormatDate } from './base';

/**
 * Luxury Editorial Color Palette
 * An intentional, high-end palette balancing near-black ink, warm-white paper,
 * and an extremely restrained champagne gold accent.
 */
export const LUXURY_PALETTE = {
  nearBlack: [17, 17, 17] as [number, number, number],       // #111111 - Headings & Grand Total
  charcoal: [43, 43, 43] as [number, number, number],         // #2B2B2B - Body text, company name
  mutedGray: [119, 119, 119] as [number, number, number],     // #777777 - Labels, headers, metadata
  lightGray: [217, 217, 217] as [number, number, number],     // #D9D9D9 - Structural dividers
  subtleDivider: [238, 238, 235] as [number, number, number], // #EEEEEE - Row lines
  champagne: [184, 155, 94] as [number, number, number],      // #B89B5E - Restrained metallic accent
  background: [250, 250, 248] as [number, number, number],    // #FAFAF8 - Warm editorial paper
  pureWhite: [255, 255, 255] as [number, number, number],
};

/**
 * High-fidelity currency formatter supporting INR, USD, EUR, GBP, and global ISO currencies.
 * Uses ASCII-safe codes and symbols to guarantee crisp PDF rendering across all standard viewers.
 */
export function formatLuxuryCurrency(amount: number, currencyInput?: string): string {
  const num = Number(amount) || 0;
  const rawCurrency = (currencyInput || 'USD').trim();

  // Normalize currency code
  let code = 'USD';
  if (rawCurrency.length === 3 && /^[A-Za-z]{3}$/.test(rawCurrency)) {
    code = rawCurrency.toUpperCase();
  } else if (rawCurrency === '₹' || rawCurrency.toUpperCase() === 'INR') {
    code = 'INR';
  } else if (rawCurrency === '€' || rawCurrency.toUpperCase() === 'EUR') {
    code = 'EUR';
  } else if (rawCurrency === '£' || rawCurrency.toUpperCase() === 'GBP') {
    code = 'GBP';
  } else if (rawCurrency === '$' || rawCurrency.toUpperCase() === 'USD') {
    code = 'USD';
  }

  // Format numbers with strict 2 decimal precision
  const formattedNumber = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  switch (code) {
    case 'INR':
      return `INR ${formattedNumber}`;
    case 'USD':
      return `$${formattedNumber}`;
    case 'EUR':
      return `EUR ${formattedNumber}`;
    case 'GBP':
      return `GBP ${formattedNumber}`;
    default:
      return `${code} ${formattedNumber}`;
  }
}

/**
 * LuxuryInvoiceTemplate
 * A bespoke, editorial invoice renderer built for high-end commerce, corporate precision,
 * and design studios. Emphasizes typography hierarchy, generous whitespace, dynamic calculation,
 * and seamless multi-page pagination.
 */
export class LuxuryInvoiceTemplate {
  private pageWidth: number;
  private pageHeight: number;
  private margin: number = 20;
  private currentY: number = 20;
  private currentPage: number = 1;
  private currency: string = 'USD';

  constructor(private doc: jsPDF) {
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
  }

  /**
   * Main entrypoint to render the luxury invoice.
   */
  public render(data: InvoiceData): void {
    this.currency = data.clientCurrency || 'USD';
    this.currentPage = 1;
    this.currentY = this.margin;

    // 1. Paint background canvas for Page 1
    this.paintPageCanvas();

    // 2. Render Header (Company anchor & display INVOICE title)
    this.renderHeader(data);

    // 3. Render Billing Section (FROM & BILL TO in clean typography)
    this.renderBillingSection(data);

    // 4. Render Editorial Item Table (with multi-page support)
    this.renderItemsTable(data);

    // 5. Render Totals Block (with dynamic GST, TDS, Discount calculation)
    this.renderTotals(data);

    // 6. Render Downside Additional Information & Footer
    this.renderFooterAndNotes(data);
  }

  // ==========================================
  // HELPERS & PRIMITIVES
  // ==========================================

  private paintPageCanvas(): void {
    this.doc.setFillColor(...LUXURY_PALETTE.background);
    this.doc.rect(0, 0, this.pageWidth, this.pageHeight, 'F');
  }

  private drawText(
    text: string,
    x: number,
    y: number,
    options?: {
      size?: number;
      font?: 'helvetica' | 'times';
      style?: 'normal' | 'bold' | 'italic';
      color?: [number, number, number];
      align?: 'left' | 'center' | 'right';
    }
  ): void {
    const size = options?.size || 9;
    const font = options?.font || 'helvetica';
    const style = options?.style || 'normal';
    const color = options?.color || LUXURY_PALETTE.charcoal;
    const align = options?.align || 'left';

    this.doc.setFont(font, style);
    this.doc.setFontSize(size);
    this.doc.setTextColor(...color);
    this.doc.text(text, x, y, { align });
  }

  private drawWrappedText(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    options?: {
      size?: number;
      font?: 'helvetica' | 'times';
      style?: 'normal' | 'bold' | 'italic';
      color?: [number, number, number];
    }
  ): number {
    const size = options?.size || 8.5;
    const font = options?.font || 'helvetica';
    const style = options?.style || 'normal';
    const color = options?.color || LUXURY_PALETTE.charcoal;

    this.doc.setFont(font, style);
    this.doc.setFontSize(size);
    this.doc.setTextColor(...color);

    const lines: string[] = this.doc.splitTextToSize(text, maxWidth);
    lines.forEach((line, idx) => {
      this.doc.text(line, x, y + idx * lineHeight);
    });

    return lines.length * lineHeight;
  }

  private drawDivider(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: [number, number, number] = LUXURY_PALETTE.lightGray,
    lineWidth: number = 0.35
  ): void {
    this.doc.setDrawColor(...color);
    this.doc.setLineWidth(lineWidth);
    this.doc.line(x1, y1, x2, y2);
  }

  private drawLabel(label: string, x: number, y: number): void {
    this.drawText(label.toUpperCase(), x, y, {
      size: 7.5,
      style: 'bold',
      color: LUXURY_PALETTE.mutedGray,
    });
  }

  private checkPageBreak(requiredHeight: number): boolean {
    const bottomLimit = this.pageHeight - this.margin - 8; // 269mm
    if (this.currentY + requiredHeight > bottomLimit) {
      this.doc.addPage();
      this.currentPage += 1;
      this.paintPageCanvas();
      this.currentY = this.margin + 4;

      // Draw subtle header continuation rule on new pages
      this.drawText(`INVOICE — PAGE ${this.currentPage}`, this.margin, this.currentY, {
        size: 7.5,
        style: 'bold',
        color: LUXURY_PALETTE.mutedGray,
      });
      this.currentY += 8;

      // Re-draw table header for continued item tables
      this.drawTableHeader();
      return true;
    }
    return false;
  }

  // ==========================================
  // SECTION RENDERERS
  // ==========================================

  private renderHeader(data: InvoiceData): void {
    const rightMargin = this.pageWidth - this.margin;
    const headerStartY = this.currentY + 4;

    // LEFT: Company Identity
    let companyY = headerStartY;

    // Optional Logo
    let hasLogo = false;
    if (data.companyLogo) {
      hasLogo = drawProportionalLogo(this.doc, data.companyLogo, this.margin, companyY - 2, 38, 16, false);
      if (hasLogo) {
        companyY += 18;
      }
    }

    const companyName = data.companyName || 'STUDIO ATELIER';
    this.drawText(companyName, this.margin, companyY + 4, {
      size: 15,
      style: 'bold',
      color: LUXURY_PALETTE.nearBlack,
    });
    companyY += 9;

    // Company Contact & Tax Info
    if (data.companyAddress) {
      const addrHeight = this.drawWrappedText(data.companyAddress, this.margin, companyY, 70, 3.8, {
        size: 8,
        color: LUXURY_PALETTE.mutedGray,
      });
      companyY += addrHeight + 2;
    }

    if (data.companyEmail) {
      this.drawText(data.companyEmail, this.margin, companyY, {
        size: 8,
        color: LUXURY_PALETTE.mutedGray,
      });
      companyY += 4;
    }

    if (data.companyGST) {
      this.drawText(`GSTIN: ${data.companyGST}`, this.margin, companyY, {
        size: 8,
        style: 'bold',
        color: LUXURY_PALETTE.charcoal,
      });
      companyY += 4.5;
    }

    // RIGHT: Editorial "I N V O I C E" & Metadata
    let rightY = headerStartY + 3;

    // Editorial Display Heading
    this.drawText('I N V O I C E', rightMargin, rightY, {
      size: 20,
      style: 'bold',
      color: LUXURY_PALETTE.nearBlack,
      align: 'right',
    });
    rightY += 8;

    // Invoice Number
    this.drawText(`#${data.invoiceNumber || 'INV-001'}`, rightMargin, rightY, {
      size: 11,
      style: 'bold',
      color: LUXURY_PALETTE.charcoal,
      align: 'right',
    });
    rightY += 8;

    // Dates Grid
    const formattedDate = safeFormatDate(data.date, 'dd MMM yyyy', safeFormatDate(new Date().toISOString(), 'dd MMM yyyy'));
    this.drawText(`DATE`, rightMargin - 45, rightY, {
      size: 7.5,
      style: 'bold',
      color: LUXURY_PALETTE.mutedGray,
    });
    this.drawText(formattedDate, rightMargin, rightY, {
      size: 8.5,
      color: LUXURY_PALETTE.charcoal,
      align: 'right',
    });
    rightY += 5.5;

    if (data.dueDate) {
      const formattedDueDate = safeFormatDate(data.dueDate, 'dd MMM yyyy');
      if (formattedDueDate) {
        this.drawText(`DUE`, rightMargin - 45, rightY, {
          size: 7.5,
          style: 'bold',
          color: LUXURY_PALETTE.mutedGray,
        });
        this.drawText(formattedDueDate, rightMargin, rightY, {
          size: 8.5,
          style: 'bold',
          color: LUXURY_PALETTE.nearBlack,
          align: 'right',
        });
        rightY += 5.5;
      }
    }

    // Status Pill (Optional)
    if (data.invoiceStatus) {
      const statusText = data.invoiceStatus.toUpperCase();
      this.drawText(`STATUS`, rightMargin - 45, rightY, {
        size: 7.5,
        style: 'bold',
        color: LUXURY_PALETTE.mutedGray,
      });
      this.drawText(statusText, rightMargin, rightY, {
        size: 8,
        style: 'bold',
        color: statusText === 'PAID' ? [22, 101, 52] : LUXURY_PALETTE.champagne,
        align: 'right',
      });
      rightY += 6;
    }

    // Advance currentY to the lower of left and right columns
    this.currentY = Math.max(companyY, rightY) + 10;

    // Editorial Divider below Header
    this.drawDivider(this.margin, this.currentY, rightMargin, this.currentY, LUXURY_PALETTE.lightGray, 0.4);
    this.currentY += 8;
  }

  private renderBillingSection(data: InvoiceData): void {
    const colWidth = (this.pageWidth - 2 * this.margin - 16) / 2;
    const col1X = this.margin;
    const col2X = this.margin + colWidth + 16;
    const sectionStartY = this.currentY;

    // LEFT: FROM
    let fromY = sectionStartY;
    this.drawLabel('FROM', col1X, fromY);
    fromY += 5.5;

    this.drawText(data.companyName || 'Studio Provider', col1X, fromY, {
      size: 9.5,
      style: 'bold',
      color: LUXURY_PALETTE.nearBlack,
    });
    fromY += 4.5;

    if (data.companyAddress) {
      const addrH = this.drawWrappedText(data.companyAddress, col1X, fromY, colWidth, 4.0, {
        size: 8.5,
        color: LUXURY_PALETTE.charcoal,
      });
      fromY += addrH;
    }

    if (data.companyGST) {
      fromY += 1;
      this.drawText(`GSTIN: ${data.companyGST}`, col1X, fromY, {
        size: 8,
        color: LUXURY_PALETTE.mutedGray,
      });
      fromY += 4;
    }

    // RIGHT: BILL TO
    let toY = sectionStartY;
    this.drawLabel('BILLED TO', col2X, toY);
    toY += 5.5;

    const clientTitle = data.clientCompany || data.clientName || 'Valued Client';
    this.drawText(clientTitle, col2X, toY, {
      size: 9.5,
      style: 'bold',
      color: LUXURY_PALETTE.nearBlack,
    });
    toY += 4.5;

    if (data.clientCompany && data.clientName) {
      this.drawText(`Attn: ${data.clientName}`, col2X, toY, {
        size: 8.5,
        color: LUXURY_PALETTE.charcoal,
      });
      toY += 4;
    }

    if (data.clientAddress) {
      const clientAddrH = this.drawWrappedText(data.clientAddress, col2X, toY, colWidth, 4.0, {
        size: 8.5,
        color: LUXURY_PALETTE.charcoal,
      });
      toY += clientAddrH;
    }

    if (data.clientEmail) {
      this.drawText(data.clientEmail, col2X, toY, {
        size: 8,
        color: LUXURY_PALETTE.mutedGray,
      });
      toY += 4;
    }

    if (data.clientGST) {
      toY += 1;
      this.drawText(`Client GSTIN: ${data.clientGST}`, col2X, toY, {
        size: 8,
        style: 'bold',
        color: LUXURY_PALETTE.charcoal,
      });
      toY += 4;
    }

    this.currentY = Math.max(fromY, toY) + 12;
  }

  private drawTableHeader(): void {
    const rightMargin = this.pageWidth - this.margin;
    const colQty = rightMargin - 65;
    const colRate = rightMargin - 35;
    const colAmount = rightMargin;

    // Top hairline
    this.drawDivider(this.margin, this.currentY, rightMargin, this.currentY, LUXURY_PALETTE.lightGray, 0.4);
    this.currentY += 5;

    // Column Headers
    this.drawLabel('DESCRIPTION', this.margin, this.currentY);
    this.drawText('QTY', colQty, this.currentY, {
      size: 7.5,
      style: 'bold',
      color: LUXURY_PALETTE.mutedGray,
      align: 'right',
    });
    this.drawText('RATE', colRate, this.currentY, {
      size: 7.5,
      style: 'bold',
      color: LUXURY_PALETTE.mutedGray,
      align: 'right',
    });
    this.drawText('AMOUNT', colAmount, this.currentY, {
      size: 7.5,
      style: 'bold',
      color: LUXURY_PALETTE.mutedGray,
      align: 'right',
    });

    this.currentY += 3;
    // Bottom hairline
    this.drawDivider(this.margin, this.currentY, rightMargin, this.currentY, LUXURY_PALETTE.lightGray, 0.4);
    this.currentY += 6;
  }

  private renderItemsTable(data: InvoiceData): void {
    const items: InvoiceItem[] = parseInvoiceItems(data.items);
    const rightMargin = this.pageWidth - this.margin;
    const colQty = rightMargin - 65;
    const colRate = rightMargin - 35;
    const colAmount = rightMargin;
    const descWidth = colQty - this.margin - 10;

    // Draw initial table header
    this.drawTableHeader();

    items.forEach((item, index) => {
      const description = item.description || `Item #${index + 1}`;
      const quantity = Number(item.quantity) || 1;
      const rate = Number(item.rate) || 0;
      const lineAmount = item.amount !== undefined && item.amount !== null ? Number(item.amount) : quantity * rate;

      // Calculate wrapped description height
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8.5);
      const descLines: string[] = this.doc.splitTextToSize(description, descWidth);
      const rowContentHeight = Math.max(descLines.length * 4.2, 5);
      const totalRowHeight = rowContentHeight + 6;

      // Check pagination before rendering row
      this.checkPageBreak(totalRowHeight);

      const rowTopY = this.currentY;

      // Render Description
      descLines.forEach((line, lineIdx) => {
        this.doc.setFont('helvetica', lineIdx === 0 ? 'bold' : 'normal');
        this.doc.setFontSize(8.5);
        this.doc.setTextColor(...LUXURY_PALETTE.nearBlack);
        this.doc.text(line, this.margin, rowTopY + lineIdx * 4.2);
      });

      // Render Numerical Columns (Right-Aligned)
      this.drawText(String(quantity), colQty, rowTopY, {
        size: 8.5,
        color: LUXURY_PALETTE.charcoal,
        align: 'right',
      });

      this.drawText(formatLuxuryCurrency(rate, this.currency), colRate, rowTopY, {
        size: 8.5,
        color: LUXURY_PALETTE.charcoal,
        align: 'right',
      });

      this.drawText(formatLuxuryCurrency(lineAmount, this.currency), colAmount, rowTopY, {
        size: 8.5,
        style: 'bold',
        color: LUXURY_PALETTE.nearBlack,
        align: 'right',
      });

      this.currentY += totalRowHeight;

      // Thin row divider
      this.drawDivider(this.margin, this.currentY - 2, rightMargin, this.currentY - 2, LUXURY_PALETTE.subtleDivider, 0.2);
    });

    this.currentY += 4;
  }

  private renderTotals(data: InvoiceData): void {
    const items = parseInvoiceItems(data.items);
    const rightMargin = this.pageWidth - this.margin;
    const labelX = rightMargin - 70;
    const valueX = rightMargin;

    // Derive totals from items rather than trusting raw client calculations
    const derivedSubtotal = items.reduce((sum, item) => {
      const amt = Number(item.amount);
      if (!isNaN(amt) && amt > 0) return sum + amt;
      return sum + (Number(item.quantity || 1) * Number(item.rate || 0));
    }, 0);

    const subtotal = derivedSubtotal > 0 ? derivedSubtotal : Number(data.subtotal || 0);

    // Discount Calculation
    let discountAmount = Number(data.discountAmount || 0);
    if (!discountAmount && data.discountRate && data.discountRate > 0) {
      discountAmount = (subtotal * data.discountRate) / 100;
    }
    const taxableBase = Math.max(0, subtotal - discountAmount);

    // GST Calculation
    const hasGST = Boolean(data.includeGST ?? (data.taxAmount && Number(data.taxAmount) > 0));
    const effectiveGstRate = Number(data.gstRate ?? data.taxRate ?? (hasGST ? 18 : 0));
    const gstAmount = hasGST ? (taxableBase * effectiveGstRate) / 100 : 0;

    // TDS Calculation
    const hasTDS = Boolean(data.includeTDS);
    const tdsRate = Number(data.tdsRate || 0);
    const tdsAmount = hasTDS ? (subtotal * tdsRate) / 100 : 0;

    // Grand Total
    const finalTotal = Math.max(0, subtotal - discountAmount + gstAmount - tdsAmount);

    // Ensure space for totals block (approx 35mm)
    this.checkPageBreak(35);

    let totalsY = this.currentY + 5;

    // Subtotal
    this.drawText('Subtotal', labelX, totalsY, {
      size: 8.5,
      color: LUXURY_PALETTE.mutedGray,
    });
    this.drawText(formatLuxuryCurrency(subtotal, this.currency), valueX, totalsY, {
      size: 9,
      color: LUXURY_PALETTE.charcoal,
      align: 'right',
    });
    totalsY += 5.5;

    // Discount (if any)
    if (discountAmount > 0) {
      const discountLabel = data.discountRate ? `Discount (${data.discountRate}%)` : 'Discount';
      this.drawText(discountLabel, labelX, totalsY, {
        size: 8.5,
        color: LUXURY_PALETTE.mutedGray,
      });
      this.drawText(`-${formatLuxuryCurrency(discountAmount, this.currency)}`, valueX, totalsY, {
        size: 9,
        color: [180, 40, 40],
        align: 'right',
      });
      totalsY += 5.5;
    }

    // GST / Tax (if enabled)
    if (hasGST && gstAmount > 0) {
      this.drawText(`GST (${effectiveGstRate}%)`, labelX, totalsY, {
        size: 8.5,
        color: LUXURY_PALETTE.mutedGray,
      });
      this.drawText(formatLuxuryCurrency(gstAmount, this.currency), valueX, totalsY, {
        size: 9,
        color: LUXURY_PALETTE.charcoal,
        align: 'right',
      });
      totalsY += 5.5;
    }

    // TDS Deduction (if enabled)
    if (hasTDS && tdsAmount > 0) {
      this.drawText(`TDS (${tdsRate}%)`, labelX, totalsY, {
        size: 8.5,
        color: LUXURY_PALETTE.mutedGray,
      });
      this.drawText(`-${formatLuxuryCurrency(tdsAmount, this.currency)}`, valueX, totalsY, {
        size: 9,
        color: [180, 40, 40],
        align: 'right',
      });
      totalsY += 5.5;
    }

    totalsY += 2;
    // Elegant Divider above Final Total (Subtle Charcoal / Champagne Rule)
    this.drawDivider(labelX - 4, totalsY, valueX, totalsY, LUXURY_PALETTE.nearBlack, 0.45);
    totalsY += 6;

    // TOTAL DUE - Strongest numerical visual hierarchy on the page
    this.drawText('TOTAL DUE', labelX - 4, totalsY + 1, {
      size: 10,
      style: 'bold',
      color: LUXURY_PALETTE.nearBlack,
    });

    this.drawText(formatLuxuryCurrency(finalTotal, this.currency), valueX, totalsY + 1.5, {
      size: 16,
      style: 'bold',
      color: LUXURY_PALETTE.nearBlack,
      align: 'right',
    });

    this.currentY = totalsY + 14;
  }

  private renderFooterAndNotes(data: InvoiceData): void {
    const rightMargin = this.pageWidth - this.margin;
    const contentWidth = rightMargin - this.margin;

    const hasNotes = Boolean(data.notes && data.notes.trim().length > 0);
    const hasTerms = Boolean(data.terms && data.terms.trim().length > 0);
    const hasPaymentLink = Boolean(data.paymentLink && data.paymentLink.trim().length > 0);

    if (hasNotes || hasTerms || hasPaymentLink) {
      // Calculate height needed
      const noteLines: string[] = hasNotes ? this.doc.splitTextToSize(data.notes!.trim(), contentWidth) : [];
      const termLines: string[] = hasTerms ? this.doc.splitTextToSize(data.terms!.trim(), contentWidth) : [];

      let requiredH = 10;
      if (hasNotes) requiredH += 4 + noteLines.length * 4.0 + 4;
      if (hasTerms) requiredH += 4 + termLines.length * 4.0 + 4;
      if (hasPaymentLink) requiredH += 10;

      // Position lower on the page if space allows, or flow naturally
      const safeFloor = this.pageHeight - this.margin - 8; // 269mm
      const targetStartY = Math.max(this.currentY + 6, Math.min(215, safeFloor - requiredH));

      // If it genuinely does not fit on this page, create clean new page for notes
      if (this.currentY + requiredH > safeFloor) {
        this.doc.addPage();
        this.currentPage += 1;
        this.paintPageCanvas();
        this.currentY = this.margin + 6;
      } else {
        this.currentY = targetStartY;
      }

      // Subtle editorial separator rule
      this.drawDivider(this.margin, this.currentY - 3, rightMargin, this.currentY - 3, LUXURY_PALETTE.lightGray, 0.35);
      this.currentY += 3;

      // NOTES
      if (hasNotes) {
        this.drawLabel('NOTES', this.margin, this.currentY);
        this.currentY += 4.5;

        noteLines.forEach((line) => {
          this.drawText(line, this.margin, this.currentY, {
            size: 8.5,
            color: LUXURY_PALETTE.charcoal,
          });
          this.currentY += 4.0;
        });
        this.currentY += 3;
      }

      // TERMS & CONDITIONS
      if (hasTerms) {
        this.drawLabel('TERMS & CONDITIONS', this.margin, this.currentY);
        this.currentY += 4.5;

        termLines.forEach((line) => {
          this.drawText(line, this.margin, this.currentY, {
            size: 8,
            color: LUXURY_PALETTE.mutedGray,
          });
          this.currentY += 3.8;
        });
        this.currentY += 3;
      }

      // PAYMENT LINK
      if (hasPaymentLink) {
        this.drawLabel('PAYMENT LINK', this.margin, this.currentY);
        this.currentY += 4.5;

        this.doc.setFont('helvetica', 'normal');
        this.doc.setFontSize(8);
        this.doc.setTextColor(37, 99, 235);
        const link = data.paymentLink!.trim();

        if (typeof (this.doc as any).textWithLink === 'function') {
          (this.doc as any).textWithLink(link, this.margin, this.currentY, { url: link });
        } else {
          this.doc.text(link, this.margin, this.currentY);
        }
        this.currentY += 6;
      }
    }

    // Quiet, refined print footer at the absolute bottom
    const footerY = this.pageHeight - 12;
    this.drawText('Thank you for your business.', this.margin, footerY, {
      size: 7.5,
      color: LUXURY_PALETTE.mutedGray,
    });

    if (!data.whiteLabelMode) {
      this.drawText('SmartInvoice • Haute Facturation', rightMargin, footerY, {
        size: 7.5,
        color: LUXURY_PALETTE.mutedGray,
        align: 'right',
      });
    }
  }
}

/**
 * Standard InvoiceTemplate wrapper conforming to SmartInvoice template interface
 */
export const luxuryTemplate: InvoiceTemplate = {
  id: 'luxury',
  name: 'Luxury Editorial',
  description: 'Bespoke editorial typography, warm-white background, generous whitespace and dynamic totals.',
  defaultColors: {
    primary: '#111111',
    secondary: '#777777',
    accent: '#B89B5E',
    bg: '#FAFAF8',
  },
  render: (doc: jsPDF, data: InvoiceData, context: TemplateContext) => {
    const template = new LuxuryInvoiceTemplate(doc);
    template.render(data);
  },
};
