import { jsPDF } from 'jspdf';
import { safeFormatDate } from './base';
import { InvoiceData } from '../pdf-generator';
import { InvoiceTemplate, TemplateContext } from './types';

export const googleTemplate: InvoiceTemplate = {
  id: 'google',
  name: 'Google',
  description: 'Clean Material Design aesthetic with Google blue branding and vibrant micro-accents.',
  defaultColors: {
    primary: '#1A73E8',
    secondary: '#34A853',
    accent: '#FBBC05',
    bg: '#FFFFFF',
  },
  render: (doc: jsPDF, data: InvoiceData, context: TemplateContext) => {
    const margin = 20;
    const rightMargin = context.pageWidth - margin;

    // Top Google 4-Color Accent Strip
    const stripWidth = context.pageWidth / 4;
    doc.setFillColor(66, 133, 244); // Blue
    doc.rect(0, 0, stripWidth, 4, 'F');
    doc.setFillColor(234, 67, 53);  // Red
    doc.rect(stripWidth, 0, stripWidth, 4, 'F');
    doc.setFillColor(251, 188, 5);  // Yellow
    doc.rect(stripWidth * 2, 0, stripWidth, 4, 'F');
    doc.setFillColor(52, 168, 83);  // Green
    doc.rect(stripWidth * 3, 0, stripWidth, 4, 'F');

    const startY = 26;

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
    doc.setTextColor(32, 33, 36); // Google Charcoal #202124
    doc.text(data.companyName || 'SmartInvoice', margin, startY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(95, 99, 104);
    let compY = startY + 6;
    if (data.companyAddress) {
      doc.text(data.companyAddress, margin, compY);
      compY += 4.5;
    }
    if (data.companyEmail) {
      doc.text(data.companyEmail, margin, compY);
    }

    // Invoice Title & Badge
    const typeLabel = context.getInvoiceTypeLabel(data.invoiceType);
    const metaY = hasLogo ? 38 : 26;

    doc.setFillColor(232, 240, 254); // Google light blue tint #E8F0FE
    doc.roundedRect(rightMargin - 38, metaY - 5, 38, 7, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(26, 115, 232); // Google Blue #1A73E8
    doc.text(typeLabel, rightMargin - 19, metaY - 0.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(32, 33, 36);
    doc.text(data.invoiceNumber || '', rightMargin, metaY + 8, { align: 'right' });

    // Client & Metadata Card (Material Box)
    const cardY = Math.max(compY + 10, metaY + 16);
    doc.setFillColor(248, 249, 250); // #F8F9FA
    doc.setDrawColor(218, 220, 224); // #DADCE0
    doc.roundedRect(margin, cardY, context.pageWidth - (2 * margin), 26, 3, 3, 'FD');

    const col1X = margin + 8;
    const col2X = margin + 75;
    const col3X = rightMargin - 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(95, 99, 104);
    doc.text('PREPARED FOR', col1X, cardY + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(32, 33, 36);
    const clientDisplayName = (data.clientName && data.clientName.trim())
      || (data.clientCompany && data.clientCompany.trim())
      || 'Client Name';
    doc.text(clientDisplayName, col1X, cardY + 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(95, 99, 104);
    if (data.clientEmail) doc.text(data.clientEmail, col1X, cardY + 19);

    // Invoice Date
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(95, 99, 104);
    doc.text('INVOICE DATE', col2X, cardY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(32, 33, 36);
    doc.text(safeFormatDate(data.date, 'MMMM dd, yyyy'), col2X, cardY + 13);

    // Due Date
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(95, 99, 104);
    doc.text('PAYMENT DUE', col3X, cardY + 7, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(26, 115, 232); // #1A73E8
    doc.text(safeFormatDate(data.dueDate, 'MMMM dd, yyyy'), col3X, cardY + 13, { align: 'right' });

    // Watermark
    context.drawWatermark(data.invoiceType);

    // Specialized Section
    let tableStartY = cardY + 34;
    if (data.invoiceType && data.invoiceType !== 'sales') {
      tableStartY = context.renderSpecializedSection(data, tableStartY);
    }

    // Items Table
    const tableEndY = context.renderStandardItemsTable(data, tableStartY, {
      headerBg: [241, 243, 244],
      headerTextColor: [60, 64, 67],
      rowBorderColor: [232, 234, 237],
      alternateRowBg: true,
    });

    // Totals Block
    context.renderTotalsBlock(data, tableEndY, {
      accentColor: [26, 115, 232],
      highlightGrandTotal: true,
    });

    // Footer
    context.renderFooter(data);
  },
};
