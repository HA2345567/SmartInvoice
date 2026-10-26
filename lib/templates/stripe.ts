import { jsPDF } from 'jspdf';
import { safeFormatDate } from './base';
import { InvoiceData } from '../pdf-generator';
import { InvoiceTemplate, TemplateContext } from './types';

export const stripeTemplate: InvoiceTemplate = {
  id: 'stripe',
  name: 'Stripe',
  description: 'Modern fintech styling with crisp indigo accents and structured tabular rows.',
  defaultColors: {
    primary: '#635BFF',
    secondary: '#0A2540',
    accent: '#00D4B2',
    bg: '#FFFFFF',
  },
  render: (doc: jsPDF, data: InvoiceData, context: TemplateContext) => {
    const margin = 20;
    const rightMargin = context.pageWidth - margin;

    // Top Stripe Accent Bar
    doc.setFillColor(99, 91, 255); // #635BFF
    doc.rect(0, 0, context.pageWidth, 5, 'F');

    const startY = 28;

    // Top Right Logo
    let hasLogo = false;
    if (data.companyLogo) {
      const logoW = 44;
      const logoH = 20;
      hasLogo = context.drawLogo(data.companyLogo, rightMargin - logoW, 14, logoW, logoH, true);
    }

    // Company Header on Left
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(10, 37, 64); // #0A2540
    doc.text(data.companyName || 'SmartInvoice', margin, startY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    let compY = startY + 6;
    if (data.companyAddress) {
      doc.text(data.companyAddress, margin, compY);
      compY += 4.5;
    }
    if (data.companyEmail) {
      doc.text(data.companyEmail, margin, compY);
    }

    // Header Right Metadata (if no logo, or stacked below logo)
    const typeLabel = context.getInvoiceTypeLabel(data.invoiceType);
    const metaY = hasLogo ? 40 : 28;

    // Subtle Badge for Invoice Type
    doc.setFillColor(242, 244, 255);
    doc.roundedRect(rightMargin - 40, metaY - 5, 40, 7, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(99, 91, 255);
    doc.text(typeLabel, rightMargin - 20, metaY - 0.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(10, 37, 64);
    doc.text(data.invoiceNumber || '', rightMargin, metaY + 8, { align: 'right' });

    // Key Value Grid (Stripe style)
    const gridY = Math.max(compY + 12, metaY + 16);
    doc.setFillColor(248, 250, 252); // #F8FAFC
    doc.roundedRect(margin, gridY, context.pageWidth - (2 * margin), 28, 2, 2, 'F');

    const col1X = margin + 10;
    const col2X = margin + 70;
    const col3X = rightMargin - 40;

    // Customer Col
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('CUSTOMER', col1X, gridY + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(10, 37, 64);
    const clientDisplayName = (data.clientName && data.clientName.trim())
      || (data.clientCompany && data.clientCompany.trim())
      || 'Client Name';
    doc.text(clientDisplayName, col1X, gridY + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    if (data.clientEmail) doc.text(data.clientEmail, col1X, gridY + 20);

    // Issue Date Col
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('ISSUED', col2X, gridY + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(10, 37, 64);
    doc.text(safeFormatDate(data.date, 'MMM dd, yyyy'), col2X, gridY + 14);

    // Due Date Col
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('DUE DATE', col3X, gridY + 8, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(99, 91, 255);
    doc.text(safeFormatDate(data.dueDate, 'MMM dd, yyyy'), col3X, gridY + 14, { align: 'right' });

    // Watermark
    context.drawWatermark(data.invoiceType);

    // Specialized Section
    let tableStartY = gridY + 36;
    if (data.invoiceType && data.invoiceType !== 'sales') {
      tableStartY = context.renderSpecializedSection(data, tableStartY);
    }

    // Items Table
    const tableEndY = context.renderStandardItemsTable(data, tableStartY, {
      headerBg: [241, 245, 249],
      headerTextColor: [71, 85, 105],
      rowBorderColor: [226, 232, 240],
      alternateRowBg: false,
    });

    // Totals Block
    context.renderTotalsBlock(data, tableEndY, {
      accentColor: [99, 91, 255],
      highlightGrandTotal: true,
    });

    // Footer
    context.renderFooter(data);
  },
};
