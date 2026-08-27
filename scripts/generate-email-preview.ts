import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fs from 'fs';
import path from 'path';
import { EmailService } from '../lib/email-service';

function generatePreviewHtml() {
  const sampleInvoice = {
    invoiceNumber: 'INV-2026-001',
    date: '2026-08-27',
    dueDate: '2026-09-10',
    clientName: 'Harsh Bhardwaj',
    clientCurrency: '$',
    amount: 2450.00,
    items: [
      { description: 'Full-Stack Web Application Development', quantity: 1, amount: 1800.00 },
      { description: 'UI/UX Design & Brand Strategy', quantity: 1, amount: 650.00 }
    ],
    paymentLink: 'https://smartinvoice-rosy.vercel.app/dashboard'
  };

  const sampleCompany = {
    name: 'SmartInvoice Premium Services',
    email: 'curiousharsh03@gmail.com'
  };

  const invoiceHtml = EmailService.generateInvoiceEmail(sampleInvoice, sampleCompany);
  const welcomeHtml = EmailService.generateWelcomeEmail('Harsh Bhardwaj', 'https://smartinvoice-rosy.vercel.app/dashboard');
  const reminderHtml = EmailService.generatePaymentReminderEmail('Harsh Bhardwaj', 'INV-2026-001', '$', 2450.00, 'September 10, 2026', 'https://smartinvoice-rosy.vercel.app/dashboard', 3);
  const receiptHtml = EmailService.generatePaymentReceivedEmail('Harsh Bhardwaj', 'INV-2026-001', '$', 2450.00, 'August 27, 2026');

  const previewDoc = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>SmartInvoice - Executive HTML Email Preview Gallery</title>
      <style>
        body { font-family: -apple-system, sans-serif; background: #0f172a; color: #fff; margin: 0; padding: 40px 20px; }
        .gallery-title { text-align: center; font-size: 32px; font-weight: 800; margin-bottom: 8px; color: #1ed760; }
        .gallery-subtitle { text-align: center; font-size: 16px; color: #94a3b8; margin-bottom: 40px; }
        .preview-section { max-width: 700px; margin: 0 auto 50px auto; background: #1e293b; border-radius: 20px; padding: 30px; border: 1px solid #334155; }
        .section-tag { display: inline-block; padding: 6px 14px; background: rgba(30,215,96,0.15); color: #1ed760; font-weight: 700; font-size: 12px; border-radius: 9999px; margin-bottom: 16px; letter-spacing: 1px; }
        .section-title { font-size: 20px; font-weight: 700; margin: 0 0 20px 0; color: #f8fafc; }
        .iframe-container { background: #f8fafc; border-radius: 16px; padding: 20px; overflow: hidden; }
      </style>
    </head>
    <body>
      <h1 class="gallery-title">SmartInvoice Email Showcase</h1>
      <p class="gallery-subtitle">Executive HTML Templates (100% Emoji-Free & Responsive)</p>

      <div class="preview-section">
        <span class="section-tag">TEMPLATE 1</span>
        <h2 class="section-title">Invoice Delivery Email</h2>
        <div class="iframe-container">
          ${invoiceHtml}
        </div>
      </div>

      <div class="preview-section">
        <span class="section-tag">TEMPLATE 2</span>
        <h2 class="section-title">Welcome Onboarding Email</h2>
        <div class="iframe-container">
          ${welcomeHtml}
        </div>
      </div>

      <div class="preview-section">
        <span class="section-tag">TEMPLATE 3</span>
        <h2 class="section-title">Payment Reminder (Overdue Notice)</h2>
        <div class="iframe-container">
          ${reminderHtml}
        </div>
      </div>

      <div class="preview-section">
        <span class="section-tag">TEMPLATE 4</span>
        <h2 class="section-title">Payment Receipt Confirmation</h2>
        <div class="iframe-container">
          ${receiptHtml}
        </div>
      </div>
    </body>
    </html>
  `;

  const outputPath = path.join(process.cwd(), 'scripts', 'email-preview.html');
  fs.writeFileSync(outputPath, previewDoc);
  console.log(`✅ Email Preview Gallery successfully created at: ${outputPath}`);
}

generatePreviewHtml();
