import { jsPDF } from 'jspdf';
import { safeFormatDate } from './base';
import { InvoiceData } from '../pdf-generator';
import { InvoiceTemplate, TemplateContext } from './types';

export const minimalTemplate: InvoiceTemplate = {
  id: 'minimal',
  name: 'Minimal',
  description: 'Pure typography and monochrome elegance with maximum clarity.',
  defaultColors: {
    primary: '#000000',
    secondary: '#71717A',
    accent: '#18181B',
    bg: '#FFFFFF',
  },
  render: (doc: jsPDF, data: InvoiceData, context: TemplateContext) => {
    const margin = 20;
    const rightMargin = context.pageWidth - margin;
    const startY = 32;

    // 1. Logo in Top Right Corner
    if (data.companyLogo) {
      const logoW = 42;
      const logoH = 20;
      context.drawLogo(data.companyLogo, rightMargin - logoW, 16, logoW, logoH, true);
    }

    // 2. Company Name on Top Left
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(0, 0, 0);
    doc.text(data.companyName || 'SmartInvoice', margin, startY);

    // Company Address
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(110, 110, 115);
    let compY = startY + 6;
    if (data.companyAddress) {
      doc.text(data.companyAddress, margin, compY);
      compY += 5;
    }
    if (data.companyEmail) {
      doc.text(data.companyEmail, margin, compY);
    }

    // 3. Invoice Title & Meta Row
    const metaY = startY + 28;
    const typeLabel = context.getInvoiceTypeLabel(data.invoiceType);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(typeLabel, margin, metaY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 105);
    doc.text(`#${data.invoiceNumber || ''}`, margin, metaY + 6);

    // Divider Line
    const lineY = metaY + 12;
    doc.setDrawColor(228, 228, 231);
    doc.setLineWidth(0.4);
    doc.line(margin, lineY, rightMargin, lineY);

    // 4. Client and Date Columns
    const detailY = lineY + 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    doc.text('BILLED TO', margin, detailY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    const clientDisplayName = (data.clientName && data.clientName.trim())
      || (data.clientCompany && data.clientCompany.trim())
      || 'Valued Client';
    doc.text(clientDisplayName, margin, detailY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 65);
    let clientY = detailY + 11;
    if (data.clientCompany && data.clientName && data.clientCompany.trim().toLowerCase() !== data.clientName.trim().toLowerCase()) {
      doc.text(data.clientCompany, margin, clientY);
      clientY += 5;
    }
    if (data.clientEmail) {
      doc.text(data.clientEmail, margin, clientY);
    }

    // Dates on Right Column
    const dateX = rightMargin - 65;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    doc.text('ISSUE DATE', dateX, detailY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(safeFormatDate(data.date, 'MMM dd, yyyy'), rightMargin, detailY, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(113, 113, 122);
    doc.text('DUE DATE', dateX, detailY + 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    doc.text(safeFormatDate(data.dueDate, 'MMM dd, yyyy'), rightMargin, detailY + 10, { align: 'right' });

    // Watermark
    context.drawWatermark(data.invoiceType);

    // Specialized Fields
    let sectionY = detailY + 22;
    if (data.invoiceType && data.invoiceType !== 'sales') {
      sectionY = context.renderSpecializedSection(data, sectionY);
    }

    // Items Table (clean minimalist table)
    const tableEndY = context.renderStandardItemsTable(data, sectionY, {
      headerBg: [250, 250, 250],
      headerTextColor: [50, 50, 50],
      rowBorderColor: [240, 240, 242],
      alternateRowBg: false,
    });

    // Totals Block
    context.renderTotalsBlock(data, tableEndY, {
      accentColor: [0, 0, 0],
      highlightGrandTotal: false,
    });

    // Footer
    context.renderFooter(data);
  },
};
