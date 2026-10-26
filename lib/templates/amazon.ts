import { jsPDF } from 'jspdf';
import { safeFormatDate } from './base';
import { InvoiceData } from '../pdf-generator';
import { InvoiceTemplate, TemplateContext } from './types';

export const amazonTemplate: InvoiceTemplate = {
  id: 'amazon',
  name: 'Amazon',
  description: 'Structured high-efficiency layout with signature amber accent and boxed panels.',
  defaultColors: {
    primary: '#FF9900',
    secondary: '#146EB4',
    accent: '#00A8E1',
    bg: '#FFFFFF',
  },
  render: (doc: jsPDF, data: InvoiceData, context: TemplateContext) => {
    const margin = 20;
    const rightMargin = context.pageWidth - margin;
    const startY = 20;

    // Header Logo in Top Right Corner
    let hasLogo = false;
    const logoW = 42;
    const logoH = 18;
    if (data.companyLogo) {
      hasLogo = context.drawLogo(data.companyLogo, rightMargin - logoW, 14, logoW, logoH, true);
    }

    // Header Section: Company Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(17, 17, 17);
    doc.text(data.companyName || 'SmartInvoice', margin, startY + 8);

    // Orange Line
    doc.setDrawColor(255, 153, 0); // #FF9900
    doc.setLineWidth(0.6);
    const lineEndX = hasLogo ? rightMargin - logoW - 6 : rightMargin;
    doc.line(margin + 80, startY + 5, lineEndX, startY + 5);

    // Invoice Type Label
    const typeLabel = context.getInvoiceTypeLabel(data.invoiceType);
    const typeColor = context.getInvoiceTypeColor(data.invoiceType);

    if (hasLogo) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...typeColor);
      doc.text(typeLabel, rightMargin, 36, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(data.invoiceNumber || '', rightMargin, 42, { align: 'right' });
    } else {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...typeColor);
      doc.text(typeLabel, rightMargin - 40, startY + 3);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(17, 17, 17);
      doc.text(data.invoiceNumber || '', rightMargin, startY + 10, { align: 'right' });
    }

    // Watermark
    context.drawWatermark(data.invoiceType);

    // Company Address
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    const companyInfo = [data.companyAddress].filter(Boolean).join(', ');
    doc.text(companyInfo, margin, startY + 16);

    // Boxed Sections
    const boxY = hasLogo ? startY + 28 : startY + 30;
    const boxHeight = 25;
    const col2X = margin + 90;

    // Box 1: Bill To
    doc.setDrawColor(221, 221, 221);
    doc.setLineWidth(0.2);
    doc.rect(margin, boxY, 85, boxHeight);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(17, 17, 17);
    doc.text('Bill To:', margin + 4, boxY + 6);
    doc.setFont('helvetica', 'normal');
    const clientDisplayName = (data.clientName && data.clientName.trim())
      || (data.clientCompany && data.clientCompany.trim())
      || 'Client Name';
    doc.text(clientDisplayName, margin + 4, boxY + 12);
    if (data.clientEmail) doc.text(data.clientEmail, margin + 4, boxY + 18);

    // Box 2: Invoice Details
    doc.rect(col2X, boxY, 85, boxHeight);
    doc.setFont('helvetica', 'bold');
    doc.text('Invoice Details:', col2X + 4, boxY + 6);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${safeFormatDate(data.date, 'MMM dd, yyyy')}`, col2X + 4, boxY + 12);
    doc.text(`Due: ${safeFormatDate(data.dueDate, 'MMM dd, yyyy')}`, col2X + 4, boxY + 18);

    // Specialized Section
    let nextSectionY = boxY + boxHeight + 10;
    if (data.invoiceType && data.invoiceType !== 'sales') {
      nextSectionY = context.renderSpecializedSection(data, boxY + boxHeight + 5);
    }

    // Items Table
    const tableEndY = context.renderStandardItemsTable(data, nextSectionY, {
      headerBg: [245, 245, 245],
      headerTextColor: [17, 17, 17],
      rowBorderColor: [225, 225, 225],
      alternateRowBg: true,
    });

    // Totals Block
    context.renderTotalsBlock(data, tableEndY, {
      accentColor: [255, 153, 0],
      highlightGrandTotal: true,
    });

    // Footer
    context.renderFooter(data);
  },
};
