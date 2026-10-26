import { jsPDF } from 'jspdf';
import { safeFormatDate } from './base';
import { InvoiceData } from '../pdf-generator';
import { InvoiceTemplate, TemplateContext } from './types';

export const shopifyTemplate: InvoiceTemplate = {
  id: 'shopify',
  name: 'Shopify',
  description: 'Modern merchant and ecommerce receipt aesthetic with emerald green accents.',
  defaultColors: {
    primary: '#008060',
    secondary: '#202223',
    accent: '#5C6AC4',
    bg: '#FFFFFF',
  },
  render: (doc: jsPDF, data: InvoiceData, context: TemplateContext) => {
    const margin = 20;
    const rightMargin = context.pageWidth - margin;

    // Emerald Top Banner Accent
    doc.setFillColor(0, 128, 96); // #008060
    doc.rect(0, 0, context.pageWidth, 6, 'F');

    const startY = 28;

    // Header Logo in Top Right Corner
    let hasLogo = false;
    if (data.companyLogo) {
      const logoW = 42;
      const logoH = 18;
      hasLogo = context.drawLogo(data.companyLogo, rightMargin - logoW, 14, logoW, logoH, true);
    }

    // Company Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(32, 34, 35); // #202223
    doc.text(data.companyName || 'SmartInvoice', margin, startY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(109, 113, 117);
    let compY = startY + 6;
    if (data.companyAddress) {
      doc.text(data.companyAddress, margin, compY);
      compY += 4.5;
    }
    if (data.companyEmail) {
      doc.text(data.companyEmail, margin, compY);
    }

    // Right Side Order / Invoice Tag
    const typeLabel = context.getInvoiceTypeLabel(data.invoiceType);
    const metaY = hasLogo ? 38 : 28;

    // Emerald Badge
    doc.setFillColor(237, 247, 242);
    doc.setDrawColor(0, 128, 96);
    doc.setLineWidth(0.3);
    doc.roundedRect(rightMargin - 42, metaY - 5, 42, 7, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(0, 128, 96);
    doc.text(typeLabel, rightMargin - 21, metaY - 0.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(32, 34, 35);
    doc.text(`Order #${data.invoiceNumber || ''}`, rightMargin, metaY + 8, { align: 'right' });

    // Client & Dates Section
    const sectionY = Math.max(compY + 12, metaY + 16);
    doc.setDrawColor(225, 227, 229);
    doc.setLineWidth(0.4);
    doc.line(margin, sectionY, rightMargin, sectionY);

    const clientY = sectionY + 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(109, 113, 117);
    doc.text('CUSTOMER DETAILS', margin, clientY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(32, 34, 35);
    const clientDisplayName = (data.clientName && data.clientName.trim())
      || (data.clientCompany && data.clientCompany.trim())
      || 'Customer';
    doc.text(clientDisplayName, margin, clientY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(74, 79, 84);
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
    doc.setTextColor(109, 113, 117);
    doc.text('ORDER DATE', dateX, clientY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(32, 34, 35);
    doc.text(safeFormatDate(data.date, 'MMM dd, yyyy'), rightMargin, clientY, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(109, 113, 117);
    doc.text('PAYMENT TERMS', dateX, clientY + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 128, 96);
    const dueFormatted = safeFormatDate(data.dueDate, 'MMM dd');
    doc.text(dueFormatted ? `Due ${dueFormatted}` : 'Due on receipt', rightMargin, clientY + 9, { align: 'right' });

    // Watermark
    context.drawWatermark(data.invoiceType);

    // Specialized Section
    let tableStartY = Math.max(custY + 8, clientY + 18);
    if (data.invoiceType && data.invoiceType !== 'sales') {
      tableStartY = context.renderSpecializedSection(data, tableStartY);
    }

    // Items Table
    const tableEndY = context.renderStandardItemsTable(data, tableStartY, {
      headerBg: [246, 246, 247],
      headerTextColor: [74, 79, 84],
      rowBorderColor: [225, 227, 229],
      alternateRowBg: true,
    });

    // Totals Block
    context.renderTotalsBlock(data, tableEndY, {
      accentColor: [0, 128, 96],
      highlightGrandTotal: true,
    });

    // Footer
    context.renderFooter(data);
  },
};
