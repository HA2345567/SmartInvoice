import { jsPDF } from 'jspdf';
import { safeFormatDate } from './base';
import { InvoiceData } from '../pdf-generator';
import { InvoiceTemplate, TemplateContext } from './types';

export const customTemplate: InvoiceTemplate = {
  id: 'custom',
  name: 'Custom',
  description: 'Fully personalized styling driven dynamically by your custom color palette.',
  defaultColors: {
    primary: '#4F46E5',
    secondary: '#06B6D4',
    accent: '#10B981',
    bg: '#FFFFFF',
  },
  render: (doc: jsPDF, data: InvoiceData, context: TemplateContext) => {
    const margin = 20;
    const rightMargin = context.pageWidth - margin;

    const primaryColor = context.colors.primary || [79, 70, 229];
    const secondaryColor = context.colors.secondary || [6, 182, 212];
    const accentColor = context.colors.accent || [16, 185, 129];

    // Dynamic Top Accent Bar with gradient effect
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, context.pageWidth * 0.65, 5, 'F');
    doc.setFillColor(...secondaryColor);
    doc.rect(context.pageWidth * 0.65, 0, context.pageWidth * 0.35, 5, 'F');

    const startY = 28;

    // Header Logo in Top Right Corner
    let hasLogo = false;
    if (data.companyLogo) {
      const logoW = 44;
      const logoH = 20;
      hasLogo = context.drawLogo(data.companyLogo, rightMargin - logoW, 14, logoW, logoH, true);
    }

    // Company Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text(data.companyName || 'SmartInvoice', margin, startY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 105);
    let compY = startY + 6;
    if (data.companyAddress) {
      doc.text(data.companyAddress, margin, compY);
      compY += 4.5;
    }
    if (data.companyEmail) {
      doc.text(data.companyEmail, margin, compY);
    }

    // Right Side Metadata
    const typeLabel = context.getInvoiceTypeLabel(data.invoiceType);
    const metaY = hasLogo ? 38 : 28;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text(typeLabel, rightMargin, metaY, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(100, 100, 105);
    doc.text(`#${data.invoiceNumber || ''}`, rightMargin, metaY + 6, { align: 'right' });

    // Client and Details Section
    const sectionY = Math.max(compY + 12, metaY + 16);

    // Accent line divider
    doc.setDrawColor(...secondaryColor);
    doc.setLineWidth(0.6);
    doc.line(margin, sectionY, rightMargin, sectionY);

    const clientY = sectionY + 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...primaryColor);
    doc.text('PREPARED FOR', margin, clientY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(30, 30, 35);
    const clientDisplayName = (data.clientName && data.clientName.trim())
      || (data.clientCompany && data.clientCompany.trim())
      || 'Valued Client';
    doc.text(clientDisplayName, margin, clientY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(80, 80, 85);
    let custY = clientY + 11;
    if (data.clientCompany && data.clientName && data.clientCompany.trim().toLowerCase() !== data.clientName.trim().toLowerCase()) {
      doc.text(data.clientCompany, margin, custY);
      custY += 4.5;
    }
    if (data.clientEmail) {
      doc.text(data.clientEmail, margin, custY);
    }

    // Dates
    const dateX = rightMargin - 65;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...primaryColor);
    doc.text('INVOICE DATE', dateX, clientY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 35);
    doc.text(safeFormatDate(data.date, 'MMM dd, yyyy'), rightMargin, clientY, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...primaryColor);
    doc.text('DUE DATE', dateX, clientY + 9);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...accentColor);
    doc.text(safeFormatDate(data.dueDate, 'MMM dd, yyyy'), rightMargin, clientY + 9, { align: 'right' });

    // Watermark
    context.drawWatermark(data.invoiceType);

    // Specialized Section
    let tableStartY = Math.max(custY + 8, clientY + 18);
    if (data.invoiceType && data.invoiceType !== 'sales') {
      tableStartY = context.renderSpecializedSection(data, tableStartY);
    }

    // Items Table (with custom color accent header)
    const tableEndY = context.renderStandardItemsTable(data, tableStartY, {
      headerBg: [248, 249, 252],
      headerTextColor: primaryColor,
      rowBorderColor: [230, 230, 235],
      alternateRowBg: true,
    });

    // Totals Block
    context.renderTotalsBlock(data, tableEndY, {
      accentColor: primaryColor,
      highlightGrandTotal: true,
    });

    // Footer
    context.renderFooter(data);
  },
};
