import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { InvoiceData, InvoiceItem } from '../pdf-generator';

export function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  return [r, g, b];
}

export function safeFormatDate(dateStr: string | undefined | null, formatPattern: string, fallback = ''): string {
  if (!dateStr || typeof dateStr !== 'string' || !dateStr.trim()) return fallback;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return fallback;
    return format(d, formatPattern);
  } catch {
    return fallback;
  }
}

export function drawProportionalLogo(
  doc: jsPDF,
  logoUrl: string | undefined,
  x: number,
  y: number,
  maxW: number = 45,
  maxH: number = 22,
  alignRight: boolean = true
): boolean {
  if (!logoUrl) return false;
  try {
    let format = 'PNG';
    if (logoUrl.startsWith('data:image/jpeg') || logoUrl.startsWith('data:image/jpg')) {
      format = 'JPEG';
    } else if (logoUrl.startsWith('data:image/webp')) {
      format = 'WEBP';
    }

    let renderW = maxW;
    let renderH = maxH;
    let renderX = x;
    let renderY = y;

    try {
      const imgProps = (doc as any).getImageProperties(logoUrl);
      if (imgProps && imgProps.width && imgProps.height) {
        const imgAspect = imgProps.width / imgProps.height;
        const boxAspect = maxW / maxH;

        if (imgAspect > boxAspect) {
          renderW = maxW;
          renderH = maxW / imgAspect;
        } else {
          renderH = maxH;
          renderW = maxH * imgAspect;
        }

        if (alignRight) {
          renderX = (x + maxW) - renderW;
        }
        renderY = y + (maxH - renderH) / 2;
      }
    } catch (propErr) {
      // Fallback to max box if properties are unreadable
    }

    doc.addImage(logoUrl, format, renderX, renderY, renderW, renderH);
    return true;
  } catch (e) {
    console.warn('Failed to render logo in PDF template:', e);
    return false;
  }
}

export function getInvoiceTypeLabel(type?: string): string {
  switch (type) {
    case 'proforma': return 'PROFORMA INVOICE';
    case 'interim': return 'INTERIM INVOICE';
    case 'final': return 'FINAL INVOICE';
    case 'recurring': return 'RECURRING INVOICE';
    case 'credit-note': return 'CREDIT NOTE';
    case 'past-due': return 'PAST DUE INVOICE';
    case 'commercial': return 'COMMERCIAL INVOICE';
    case 'tax': return 'TAX INVOICE';
    case 'timesheet': return 'TIMESHEET INVOICE';
    case 'retainer': return 'RETAINER INVOICE';
    case 'expense': return 'EXPENSE REPORT';
    default: return 'INVOICE';
  }
}

export function getInvoiceTypeColor(type?: string): [number, number, number] {
  switch (type) {
    case 'proforma': return [217, 119, 6];
    case 'credit-note': return [220, 38, 38];
    case 'past-due': return [185, 28, 28];
    case 'recurring': return [37, 99, 235];
    case 'commercial': return [13, 148, 136];
    case 'tax': return [109, 40, 217];
    default: return [29, 29, 31];
  }
}

export function drawWatermark(doc: jsPDF, invoiceType?: string, pageWidth: number = 210, pageHeight: number = 297) {
  let watermarkText = '';
  let watermarkColor: [number, number, number] = [200, 200, 200];

  if (invoiceType === 'proforma') {
    watermarkText = 'PROFORMA';
    watermarkColor = [217, 119, 6];
  } else if (invoiceType === 'past-due') {
    watermarkText = 'PAST DUE';
    watermarkColor = [220, 38, 38];
  } else if (invoiceType === 'credit-note') {
    watermarkText = 'CREDIT NOTE';
    watermarkColor = [185, 28, 28];
  }

  if (watermarkText) {
    doc.saveGraphicsState();
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...watermarkColor);
    doc.setGState(new (doc as any).GState({ opacity: 0.08 }));
    const watermarkWidth = doc.getTextWidth(watermarkText);
    doc.text(watermarkText, (pageWidth - watermarkWidth) / 2, pageHeight / 2, { angle: 45 });
    doc.restoreGraphicsState();
  }
}

export function parseInvoiceItems(items: any): InvoiceItem[] {
  if (!items) return [];
  if (typeof items === 'string') {
    try {
      return JSON.parse(items);
    } catch {
      return [];
    }
  }
  return Array.isArray(items) ? items : [];
}

export function renderSpecializedFields(
  doc: jsPDF,
  data: InvoiceData,
  startY: number,
  margin: number,
  pageWidth: number
): number {
  const fields: { label: string; value: any }[] = [];

  if (data.invoiceType === 'interim') {
    fields.push({ label: 'Project', value: data.projectName });
    fields.push({ label: 'Milestone', value: data.milestoneDescription });
    fields.push({ label: 'Progress', value: data.percentComplete ? `${data.percentComplete}%` : undefined });
  } else if (data.invoiceType === 'recurring') {
    fields.push({ label: 'Billing Cycle', value: data.billingCycle });
    fields.push({ label: 'Next Billing', value: data.nextBillingDate });
  } else if (data.invoiceType === 'credit-note') {
    fields.push({ label: 'Original Inv #', value: data.originalInvoiceNumber });
    fields.push({ label: 'Reason', value: data.creditReason });
  } else if (data.invoiceType === 'past-due') {
    fields.push({ label: 'Original Due Date', value: data.originalDueDate });
    fields.push({ label: 'Late Fee', value: data.lateFeeAmount ? `${data.clientCurrency || '$'}${data.lateFeeAmount}` : undefined });
  } else if (data.invoiceType === 'commercial') {
    fields.push({ label: 'HS Code', value: data.hsCode });
    fields.push({ label: 'Origin', value: data.countryOfOrigin });
    fields.push({ label: 'Terms', value: data.shippingTerms });
  } else if (data.invoiceType === 'tax') {
    fields.push({ label: 'Seller Tax ID', value: data.sellerTaxId });
    fields.push({ label: 'Buyer Tax ID', value: data.buyerTaxId });
  }

  const validFields = fields.filter(f => f.value !== undefined && f.value !== '');
  if (validFields.length === 0) return startY;

  const contentWidth = pageWidth - (margin * 2);
  let rowY = startY;
  const col1X = margin;
  const col2X = margin + (contentWidth / 2);

  doc.setFontSize(9);
  validFields.forEach((field, index) => {
    const x = index % 2 === 0 ? col1X : col2X;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text(`${field.label}:`, x, rowY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(20, 20, 20);
    doc.text(String(field.value), x + 30, rowY);

    if (index % 2 === 1 || index === validFields.length - 1) {
      rowY += 6;
    }
  });

  doc.setDrawColor(220, 220, 225);
  doc.setLineWidth(0.3);
  doc.line(margin, rowY + 3, pageWidth - margin, rowY + 3);

  return rowY + 9;
}

export function renderItemsTable(
  doc: jsPDF,
  data: InvoiceData,
  startY: number,
  options: {
    margin?: number;
    pageWidth?: number;
    headerBg?: [number, number, number];
    headerTextColor?: [number, number, number];
    rowBorderColor?: [number, number, number];
    alternateRowBg?: boolean;
    headerHeight?: number;
    rowHeight?: number;
  } = {}
): number {
  const margin = options.margin || 20;
  const pageWidth = options.pageWidth || 210;
  const rightMargin = pageWidth - margin;
  const headerBg = options.headerBg || [245, 245, 247];
  const headerTextColor = options.headerTextColor || [100, 100, 105];
  const rowBorderColor = options.rowBorderColor || [230, 230, 235];
  const headerHeight = options.headerHeight || 8;
  const rowHeight = options.rowHeight || 8;

  const colQty = rightMargin - 70;
  const colRate = rightMargin - 40;
  const colAmount = rightMargin - 5;

  // Header Box
  doc.setFillColor(...headerBg);
  doc.rect(margin, startY, pageWidth - (2 * margin), headerHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...headerTextColor);
  doc.text('DESCRIPTION', margin + 4, startY + (headerHeight / 2) + 1.5);
  doc.text('QTY', colQty, startY + (headerHeight / 2) + 1.5, { align: 'right' });
  doc.text('RATE', colRate, startY + (headerHeight / 2) + 1.5, { align: 'right' });
  doc.text('AMOUNT', colAmount, startY + (headerHeight / 2) + 1.5, { align: 'right' });

  let currentY = startY + headerHeight;
  const items = parseInvoiceItems(data.items);
  const currency = data.clientCurrency || '$';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 35);

  items.forEach((item, index) => {
    if (options.alternateRowBg && index % 2 === 1) {
      doc.setFillColor(250, 250, 252);
      doc.rect(margin, currentY, pageWidth - (2 * margin), rowHeight, 'F');
    }

    const desc = (item.description && item.description.trim())
      || (item as any).name
      || (item as any).note
      || (Number(item.amount || 0) > 0 || Number(item.rate || 0) > 0 ? `Service / Item ${index + 1}` : 'Item');
    const descLines = doc.splitTextToSize(desc, colQty - margin - 8);
    const itemHeight = Math.max(rowHeight, descLines.length * 5 + 3);

    doc.text(descLines, margin + 4, currentY + 5);
    doc.text(String(item.quantity || 1), colQty, currentY + 5, { align: 'right' });
    doc.text(`${currency}${Number(item.rate || 0).toFixed(2)}`, colRate, currentY + 5, { align: 'right' });
    doc.text(`${currency}${Number(item.amount || 0).toFixed(2)}`, colAmount, currentY + 5, { align: 'right' });

    currentY += itemHeight;

    // Row divider
    doc.setDrawColor(...rowBorderColor);
    doc.setLineWidth(0.2);
    doc.line(margin, currentY, rightMargin, currentY);
  });

  return currentY;
}

export function renderTotals(
  doc: jsPDF,
  data: InvoiceData,
  tableEndY: number,
  options: {
    margin?: number;
    pageWidth?: number;
    pageHeight?: number;
    accentColor?: [number, number, number];
    highlightGrandTotal?: boolean;
  } = {}
): number {
  const margin = options.margin || 20;
  const pageWidth = options.pageWidth || 210;
  const pageHeight = options.pageHeight || 297;
  const rightMargin = pageWidth - margin;
  const currency = data.clientCurrency || '$';
  const accentColor = options.accentColor || [29, 29, 31];

  let totalsY = tableEndY + 10;
  const labelX = rightMargin - 65;
  const valueX = rightMargin - 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(110, 110, 115);

  // Subtotal
  doc.text('Subtotal:', labelX, totalsY);
  doc.setTextColor(30, 30, 35);
  doc.text(`${currency}${Number(data.subtotal || 0).toFixed(2)}`, valueX, totalsY, { align: 'right' });

  // Tax
  if (data.taxAmount && Number(data.taxAmount) > 0) {
    totalsY += 6;
    doc.setTextColor(110, 110, 115);
    doc.text(`Tax (${data.taxRate || 0}%):`, labelX, totalsY);
    doc.setTextColor(30, 30, 35);
    doc.text(`${currency}${Number(data.taxAmount).toFixed(2)}`, valueX, totalsY, { align: 'right' });
  }

  // Discount
  if (data.discountAmount && Number(data.discountAmount) > 0) {
    totalsY += 6;
    doc.setTextColor(110, 110, 115);
    doc.text('Discount:', labelX, totalsY);
    doc.setTextColor(220, 38, 38);
    doc.text(`-${currency}${Number(data.discountAmount).toFixed(2)}`, valueX, totalsY, { align: 'right' });
  }

  // Grand Total Box / Line
  totalsY += 9;
  if (options.highlightGrandTotal) {
    doc.setFillColor(...accentColor);
    doc.rect(labelX - 4, totalsY - 5, (valueX - labelX) + 9, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(255, 255, 255);
    doc.text('Total Due:', labelX, totalsY + 2);
    doc.text(`${currency}${Number(data.amount || 0).toFixed(2)}`, valueX, totalsY + 2, { align: 'right' });
    totalsY += 12;
  } else {
    doc.setDrawColor(210, 210, 215);
    doc.setLineWidth(0.5);
    doc.line(labelX, totalsY - 3, valueX, totalsY - 3);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(...accentColor);
    doc.text('Total:', labelX, totalsY + 3);
    doc.text(`${currency}${Number(data.amount || 0).toFixed(2)}`, valueX, totalsY + 3, { align: 'right' });
    totalsY += 10;
  }

  // Render Additional Information (Notes, Terms & Conditions, Payment Link) at the down side / lower area of the PDF
  const finalY = renderAdditionalInformation(doc, data, totalsY, {
    margin,
    pageWidth,
    pageHeight,
  });

  return finalY;
}

export function renderAdditionalInformation(
  doc: jsPDF,
  data: InvoiceData,
  totalsEndY: number,
  options: {
    margin?: number;
    pageWidth?: number;
    pageHeight?: number;
  } = {}
): number {
  const margin = options.margin || 20;
  const pageWidth = options.pageWidth || 210;
  const pageHeight = options.pageHeight || 297;
  const contentWidth = pageWidth - (2 * margin);

  const hasNotes = Boolean(data.notes && data.notes.trim().length > 0);
  const hasTerms = Boolean(data.terms && data.terms.trim().length > 0);
  const hasPaymentLink = Boolean(data.paymentLink && data.paymentLink.trim().length > 0);

  if (!hasNotes && !hasTerms && !hasPaymentLink) {
    return totalsEndY;
  }

  // Split all content into full lines - write out all information completely without truncating
  const noteLines: string[] = hasNotes ? doc.splitTextToSize(data.notes!.trim(), contentWidth) : [];
  const termLines: string[] = hasTerms ? doc.splitTextToSize(data.terms!.trim(), contentWidth) : [];

  // Calculate required vertical height for all additional information
  let totalHeight = 0;
  if (hasNotes) {
    totalHeight += 4.5 + (noteLines.length * 4.2) + 5;
  }
  if (hasTerms) {
    totalHeight += 4.5 + (termLines.length * 4.0) + 5;
  }
  if (hasPaymentLink) {
    totalHeight += 4.5 + 4.5 + 5;
  }

  // Anchor in down side / lower portion of the PDF (above footer at ~280)
  // Anchor in down side / lower portion of the PDF (above footer at ~280)
  // Safe content boundary before footer
  const footerSafeLimit = pageHeight - 25; // 272mm for standard A4
  let startY: number;

  if (totalsEndY + 8 + totalHeight > footerSafeLimit) {
    doc.addPage();
    startY = margin + 12;
  } else {
    const maxStartY = Math.max(totalsEndY + 8, footerSafeLimit - totalHeight);
    // Lower anchor starts around 215mm if space allows, so notes are placed in the lower area
    startY = Math.max(totalsEndY + 8, Math.min(215, maxStartY));
  }

  // Subtle separator line above downside additional information
  doc.setDrawColor(230, 230, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, startY - 3, pageWidth - margin, startY - 3);

  let currentY = startY + 2;

  // Render NOTES
  if (hasNotes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 105);
    doc.text('NOTES', margin, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 55);
    noteLines.forEach((line: string) => {
      doc.text(line, margin, currentY);
      currentY += 4.2;
    });
    currentY += 3;
  }

  // Render TERMS & CONDITIONS
  if (hasTerms) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 105);
    doc.text('TERMS & CONDITIONS', margin, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(70, 70, 75);
    termLines.forEach((line: string) => {
      doc.text(line, margin, currentY);
      currentY += 4.0;
    });
    currentY += 3;
  }

  // Render PAYMENT LINK
  if (hasPaymentLink) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 105);
    doc.text('PAYMENT LINK', margin, currentY);
    currentY += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(37, 99, 235);
    if (typeof (doc as any).textWithLink === 'function') {
      (doc as any).textWithLink(data.paymentLink!.trim(), margin, currentY, { url: data.paymentLink!.trim() });
    } else {
      doc.text(data.paymentLink!.trim(), margin, currentY);
    }
    currentY += 5;
  }

  return currentY;
}

export function renderStandardFooter(doc: jsPDF, data: InvoiceData, rightMargin: number, footerY: number = 280) {
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140, 140, 145);
  doc.text('Thank you for your business.', 20, footerY);

  if (!data.whiteLabelMode) {
    doc.setTextColor(180, 180, 185);
    doc.text('Powered by SmartInvoice', rightMargin, footerY, { align: 'right' });
  }
}
