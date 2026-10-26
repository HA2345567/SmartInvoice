import { jsPDF } from 'jspdf';
import { safeFormatDate } from './base';
import { InvoiceData } from '../pdf-generator';
import { InvoiceTemplate, TemplateContext } from './types';

export const microsoftTemplate: InvoiceTemplate = {
  id: 'microsoft',
  name: 'Microsoft',
  description: 'Fluent corporate styling with signature blue accent bar and structured cards.',
  defaultColors: {
    primary: '#0078D4',
    secondary: '#50E6FF',
    accent: '#107C41',
    bg: '#FFFFFF',
  },
  render: (doc: jsPDF, data: InvoiceData, context: TemplateContext) => {
    const margin = 20;
    const rightMargin = context.pageWidth - margin;

    // Blue accent bar
    doc.setFillColor(0, 120, 212); // #0078D4
    doc.rect(margin, 20, context.pageWidth - (2 * margin), 5, 'F');

    const startY = 40;

    // Header Logo in Top Right Corner
    let hasLogo = false;
    if (data.companyLogo) {
      const logoW = 42;
      const logoH = 18;
      hasLogo = context.drawLogo(data.companyLogo, rightMargin - logoW, 28, logoW, logoH, true);
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(50, 49, 48); // #323130
    doc.text(data.companyName || 'SmartInvoice', margin, startY);

    // Invoice Type Label & Number
    const typeLabel = context.getInvoiceTypeLabel(data.invoiceType);
    const typeColor = context.getInvoiceTypeColor(data.invoiceType);

    const typeLabelY = hasLogo ? 52 : startY;
    const invNumberY = hasLogo ? 59 : startY + 8;

    doc.setFontSize(hasLogo ? 18 : 24);
    doc.setTextColor(...typeColor);
    doc.text(typeLabel, rightMargin, typeLabelY, { align: 'right' });

    doc.setFontSize(10);
    doc.setTextColor(96, 94, 92);
    doc.text(data.invoiceNumber || '', rightMargin, invNumberY, { align: 'right' });

    // Watermark
    context.drawWatermark(data.invoiceType);

    // Company Address
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 49, 48);
    const companyInfo = [data.companyAddress, data.companyEmail].filter(Boolean).join('\n');
    doc.text(companyInfo, margin, startY + 10);

    // Dates (aligned right)
    let dateY = hasLogo ? 67 : startY + 20;
    const dateColX = rightMargin - 50;

    doc.text('Date:', dateColX, dateY);
    doc.text(safeFormatDate(data.date, 'MMM dd, yyyy'), rightMargin, dateY, { align: 'right' });

    dateY += 6;
    doc.text('Due:', dateColX, dateY);
    doc.text(safeFormatDate(data.dueDate, 'MMM dd, yyyy'), rightMargin, dateY, { align: 'right' });

    // Bill To Section (Gray Box)
    const billToY = hasLogo ? 86 : startY + 40;
    doc.setFillColor(243, 242, 241); // #F3F2F1
    doc.rect(margin, billToY, 80, 40, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(96, 94, 92);
    doc.text('BILL TO', margin + 5, billToY + 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(50, 49, 48);
    const clientDisplayName = (data.clientName && data.clientName.trim())
      || (data.clientCompany && data.clientCompany.trim())
      || 'Client Name';
    doc.text(clientDisplayName, margin + 5, billToY + 16);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    let clientY = billToY + 22;
    if (data.clientCompany && data.clientName && data.clientCompany.trim().toLowerCase() !== data.clientName.trim().toLowerCase()) {
      doc.text(data.clientCompany, margin + 5, clientY);
      clientY += 5;
    }
    if (data.clientEmail) {
      doc.text(data.clientEmail, margin + 5, clientY);
    }

    // Specialized Fields
    let nextSectionY = billToY + 50;
    if (data.invoiceType && data.invoiceType !== 'sales') {
      nextSectionY = context.renderSpecializedSection(data, billToY + 45);
    }

    // Items Table
    const tableEndY = context.renderStandardItemsTable(data, nextSectionY, {
      headerBg: [243, 242, 241],
      headerTextColor: [96, 94, 92],
      rowBorderColor: [220, 220, 220],
      alternateRowBg: true,
    });

    // Totals Block
    context.renderTotalsBlock(data, tableEndY, {
      accentColor: [0, 120, 212],
      highlightGrandTotal: true,
    });

    // Footer
    context.renderFooter(data);
  },
};
