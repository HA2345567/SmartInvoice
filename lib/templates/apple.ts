import { jsPDF } from 'jspdf';
import { safeFormatDate } from './base';
import { InvoiceData } from '../pdf-generator';
import { InvoiceTemplate, TemplateContext } from './types';

export const appleTemplate: InvoiceTemplate = {
  id: 'apple',
  name: 'Apple',
  description: 'Ultra-luxury Cupertino design with generous whitespace and refined typography.',
  defaultColors: {
    primary: '#1D1D1F',
    secondary: '#86868B',
    accent: '#0071E3',
    bg: '#FFFFFF',
  },
  render: (doc: jsPDF, data: InvoiceData, context: TemplateContext) => {
    const leftMargin = 20;
    const rightMargin = context.pageWidth - leftMargin;

    // 1. Company Logo in Top Corner Right Side
    if (data.companyLogo) {
      const logoW = 45;
      const logoH = 22;
      context.drawLogo(data.companyLogo, rightMargin - logoW, 18, logoW, logoH, true);
    }

    // 2. Company Name on Top Left
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(29, 29, 31);
    doc.text(data.companyName || 'SmartInvoice', leftMargin, 32);

    // Address Block below Company Name
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    if (data.companyAddress) {
      doc.text(data.companyAddress, leftMargin, 46);
    }

    // Invoice Type Label
    const startY = 40;
    const invoiceY = startY + 40;
    const typeLabel = context.getInvoiceTypeLabel(data.invoiceType);
    const typeColor = context.getInvoiceTypeColor(data.invoiceType);

    doc.setFontSize(24);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...typeColor);
    doc.text(typeLabel, leftMargin, invoiceY);

    doc.setFontSize(11);
    doc.setTextColor(134, 134, 139);
    doc.text(data.invoiceNumber || '', leftMargin, invoiceY + 8);

    // Watermark
    context.drawWatermark(data.invoiceType);

    // Separator 1
    const line1Y = invoiceY + 18;
    doc.setDrawColor(210, 210, 215);
    doc.setLineWidth(0.4);
    doc.line(leftMargin, line1Y, rightMargin, line1Y);

    // Bill To & Dates Section
    const section2Y = line1Y + 12;

    // Column 1: Bill To
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(134, 134, 139);
    doc.text('BILL TO', leftMargin, section2Y);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(29, 29, 31);

    let clientY = section2Y + 7;
    const clientDisplayName = (data.clientName && data.clientName.trim())
      || (data.clientCompany && data.clientCompany.trim())
      || 'Client Name';
    doc.text(clientDisplayName, leftMargin, clientY);
    clientY += 5.5;
    if (data.clientCompany && data.clientName && data.clientCompany.trim().toLowerCase() !== data.clientName.trim().toLowerCase()) {
      doc.text(data.clientCompany, leftMargin, clientY);
      clientY += 5.5;
    }
    if (data.clientEmail) {
      doc.text(data.clientEmail, leftMargin, clientY);
      clientY += 5.5;
    }
    if (data.clientAddress) {
      const addressLines = doc.splitTextToSize(data.clientAddress, 80);
      doc.text(addressLines, leftMargin, clientY);
    }

    // Column 2: Invoice Date
    const col2X = leftMargin + 105;
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(134, 134, 139);
    doc.text('INVOICE DATE', col2X, section2Y);

    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(29, 29, 31);
    doc.text(safeFormatDate(data.date, 'MMMM dd, yyyy'), col2X, section2Y + 7);

    // Due Date
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(134, 134, 139);
    doc.text('DUE DATE', col2X, section2Y + 18);

    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(29, 29, 31);
    doc.text(safeFormatDate(data.dueDate, 'MMMM dd, yyyy'), col2X, section2Y + 25);

    // Specialized Fields
    let nextSectionY = section2Y + 38;
    if (data.invoiceType && data.invoiceType !== 'sales') {
      nextSectionY = context.renderSpecializedSection(data, section2Y + 35);
    }

    // Items Table
    const tableEndY = context.renderStandardItemsTable(data, nextSectionY, {
      headerBg: [245, 245, 247],
      headerTextColor: [134, 134, 139],
      rowBorderColor: [230, 230, 235],
      alternateRowBg: false,
    });

    // Totals Block
    context.renderTotalsBlock(data, tableEndY, {
      accentColor: [29, 29, 31],
      highlightGrandTotal: false,
    });

    // Footer
    context.renderFooter(data);
  },
};
