import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(config?: EmailConfig) {
    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.EMAIL_PORT || '587', 10);
    const secure = process.env.EMAIL_SECURE !== undefined 
      ? process.env.EMAIL_SECURE === 'true' 
      : port === 465;

    // Strip spaces from Google App Passwords automatically if present (e.g. "suzw vaji wgbb mnwl" -> "suzwvajiwgbbmnwl")
    const pass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');

    const emailConfig = config || {
      host,
      port,
      secure,
      auth: {
        user: process.env.EMAIL_USER || '',
        pass,
      }
    };

    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        attachments: emailData.attachments,
      });
      return true;
    } catch (error) {
      console.error('[EmailService] Email sending failed:', {
        to: emailData.to,
        subject: emailData.subject,
        error
      });
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('[EmailService] SMTP configuration test failed:', error);
      return false;
    }
  }

  /**
   * Generates a Tailwind/shadcn UI styled executive HTML email for sent invoices (zero emojis)
   */
  static generateInvoiceEmail(invoiceData: any, companyData: any): string {
    const companyName = companyData?.name || companyData?.company || 'SmartInvoice';
    const currency = invoiceData.clientCurrency || '$';
    const rawAmount = typeof invoiceData.amount === 'number' ? invoiceData.amount : parseFloat(invoiceData.amount || '0');
    const formattedAmount = `${currency}${rawAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const items = Array.isArray(invoiceData.items) ? invoiceData.items : [];

    const itemsHtml = items.length > 0 ? `
      <div style="margin-top: 24px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <thead>
            <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; text-align: left; color: #475569; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
              <th style="padding: 12px 16px;">Item Description</th>
              <th style="padding: 12px 16px; text-align: center;">Qty</th>
              <th style="padding: 12px 16px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item: any) => `
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 14px 16px; color: #0f172a; font-weight: 500;">${item.description || 'Service item'}</td>
                <td style="padding: 14px 16px; text-align: center; color: #64748b; font-weight: 600;">${item.quantity || 1}</td>
                <td style="padding: 14px 16px; text-align: right; color: #0f172a; font-weight: 700;">${currency}${(Number(item.amount) || 0).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : '';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoiceData.invoiceNumber}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #0f172a; background-color: #f1f5f9; margin: 0; padding: 30px 12px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04); border: 1px solid #e2e8f0;">
          
          <!-- Tailwind Slate-950 Header Banner -->
          <div style="background: #090d16; padding: 40px 32px; text-align: center; background-image: linear-gradient(135deg, #090d16 0%, #1e293b 100%); border-bottom: 1px solid #1e293b;">
            <div style="display: inline-block; padding: 6px 16px; background: rgba(30, 215, 96, 0.12); border: 1px solid rgba(30, 215, 96, 0.25); border-radius: 9999px; margin-bottom: 14px;">
              <span style="color: #1ed760; font-size: 12px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;">INVOICE ISSUED</span>
            </div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">${companyName}</h1>
          </div>

          <!-- Body Content -->
          <div style="padding: 40px 36px;">
            <p style="font-size: 16px; color: #334155; margin-top: 0;">Hello <strong>${invoiceData.clientName}</strong>,</p>
            <p style="font-size: 15px; color: #64748b; margin-bottom: 28px;">Thank you for your business. Your invoice is ready and summarized below. A official PDF copy is attached to this email.</p>

            <!-- Invoice Summary Card (Shadcn Card Style) -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 5px solid #1ed760; border-radius: 14px; padding: 22px 26px; margin-bottom: 28px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Invoice Number:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 800; text-align: right;">#${invoiceData.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Invoice Date:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600; text-align: right;">${invoiceData.date ? new Date(invoiceData.date).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Payment Due Date:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600; text-align: right;">${invoiceData.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'N/A'}</td>
                </tr>
              </table>
            </div>

            <!-- Amount Highlight Box -->
            <div style="text-align: center; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #bbf7d0; border-radius: 16px; padding: 24px; margin-bottom: 28px;">
              <span style="font-size: 12px; color: #166534; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Total Amount Due</span>
              <div style="font-size: 38px; font-weight: 900; color: #15803d; margin-top: 4px; letter-spacing: -0.5px;">${formattedAmount}</div>
            </div>

            ${itemsHtml}

            <!-- Tailwind Pill CTA Button -->
            ${invoiceData.paymentLink ? `
              <div style="text-align: center; margin: 36px 0 28px 0;">
                <a href="${invoiceData.paymentLink}" target="_blank" style="display: inline-block; padding: 18px 42px; background-color: #1ed760; color: #000000; text-decoration: none; border-radius: 9999px; font-weight: 800; font-size: 15px; letter-spacing: 0.8px; text-transform: uppercase; box-shadow: 0 10px 20px -3px rgba(30, 215, 96, 0.4);">
                  PAY INVOICE ONLINE
                </a>
              </div>
            ` : ''}

            <p style="font-size: 14px; color: #64748b; margin-top: 28px; text-align: center;">
              If you have any questions regarding this invoice, please reply directly to this email.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 28px 36px; text-align: center;">
            <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 800; color: #0f172a;">${companyName}</p>
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
              Powered by <strong style="color: #16a34a;">SmartInvoice</strong> &mdash; Professional Invoice & Payment Management
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generates a clean welcome email for new user registrations (zero emojis)
   */
  static generateWelcomeEmail(recipientName: string, ctaLink: string = "https://smartinvoice-rosy.vercel.app/"): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SmartInvoice</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #0f172a; background-color: #f1f5f9; margin: 0; padding: 30px 12px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
          
          <div style="background: #090d16; padding: 40px 32px; text-align: center; background-image: linear-gradient(135deg, #090d16 0%, #1e293b 100%); border-bottom: 1px solid #1e293b;">
            <div style="display: inline-block; padding: 6px 16px; background: rgba(30, 215, 96, 0.12); border: 1px solid rgba(30, 215, 96, 0.25); border-radius: 9999px; margin-bottom: 14px;">
              <span style="color: #1ed760; font-size: 12px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;">WELCOME ABOARD</span>
            </div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff;">Welcome to SmartInvoice</h1>
          </div>

          <div style="padding: 40px 36px;">
            <p style="font-size: 16px; color: #334155; margin-top: 0;">Hello <strong>${recipientName}</strong>,</p>
            <p style="font-size: 15px; color: #64748b;">We are pleased to welcome you to SmartInvoice. Your account is active and ready to streamline invoicing, manage client billing, and track business revenue.</p>

            <div style="background-color: #f8fafc; border-radius: 16px; padding: 24px; border: 1px solid #e2e8f0; margin: 28px 0;">
              <h3 style="margin-top: 0; font-size: 15px; color: #0f172a; font-weight: 800;">SmartInvoice Core Features:</h3>
              <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.9;">
                <li style="margin-bottom: 8px;">Create and customize professional invoices in seconds</li>
                <li style="margin-bottom: 8px;">AI-powered line item suggestions and receipt scanning</li>
                <li style="margin-bottom: 8px;">Track real-time monthly income trends and cash flow analytics</li>
                <li style="margin-bottom: 8px;">Send automated payment reminders to clients</li>
                <li style="margin-bottom: 8px;">Export accounting reports and download PDF invoices</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 36px 0 28px 0;">
              <a href="${ctaLink}" target="_blank" style="display: inline-block; padding: 18px 42px; background-color: #1ed760; color: #000000; text-decoration: none; border-radius: 9999px; font-weight: 800; font-size: 15px; letter-spacing: 0.8px; text-transform: uppercase; box-shadow: 0 10px 20px -3px rgba(30, 215, 96, 0.4);">
                OPEN YOUR DASHBOARD
              </a>
            </div>

            <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 32px;">
              <p style="margin: 0; font-size: 14px; color: #475569;">Warm regards,</p>
              <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 800; color: #0f172a;">Harsh Bhardwaj</p>
              <p style="margin: 0; font-size: 13px; color: #64748b;">CEO & Founder, SmartInvoice</p>
            </div>
          </div>

          <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 28px 36px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
              SmartInvoice &mdash; Professional Invoice & Business Management Platform
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generates confirmation email after issuing an invoice (zero emojis)
   */
  static generateInvoiceSentEmail(clientName: string, invoiceNumber: string, recipientEmail: string, currency: string, amount: number, dueDate: string, invoiceLink: string): string {
    const formattedAmount = `${currency || '$'}${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice Dispatch Confirmation</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #0f172a; background-color: #f1f5f9; margin: 0; padding: 30px 12px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
          
          <div style="background: #090d16; padding: 36px 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #ffffff;">Invoice Sent Successfully</h1>
          </div>

          <div style="padding: 36px;">
            <p style="font-size: 15px; color: #334155; margin-top: 0;">Hi <strong>${clientName}</strong>,</p>
            <p style="font-size: 15px; color: #64748b;">Invoice <strong>#${invoiceNumber}</strong> has been issued and delivered to <strong>${recipientEmail}</strong>.</p>

            <div style="background-color: #f8fafc; border-radius: 14px; padding: 22px; border: 1px solid #e2e8f0; margin: 24px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Amount:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 800; text-align: right;">${formattedAmount}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Due Date:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600; text-align: right;">${dueDate}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${invoiceLink}" target="_blank" style="display: inline-block; padding: 16px 38px; background-color: #1ed760; color: #000000; text-decoration: none; border-radius: 9999px; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 0.8px;">
                VIEW ONLINE INVOICE
              </a>
            </div>
          </div>

          <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 36px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
              SmartInvoice Platform Notification
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generates payment receipt confirmation email (zero emojis)
   */
  static generatePaymentReceivedEmail(clientName: string, invoiceNumber: string, currency: string, amount: number, paymentDate: string): string {
    const formattedAmount = `${currency || '$'}${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt - #${invoiceNumber}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #0f172a; background-color: #f1f5f9; margin: 0; padding: 30px 12px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
          
          <div style="background: #064e3b; padding: 40px 32px; text-align: center; background-image: linear-gradient(135deg, #064e3b 0%, #047857 100%);">
            <div style="display: inline-block; padding: 6px 16px; background: rgba(255, 255, 255, 0.2); border-radius: 9999px; margin-bottom: 14px;">
              <span style="color: #ffffff; font-size: 12px; font-weight: 800; letter-spacing: 1.2px; text-transform: uppercase;">PAYMENT RECEIVED</span>
            </div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff;">Payment Confirmation</h1>
          </div>

          <div style="padding: 40px 36px;">
            <p style="font-size: 16px; color: #334155; margin-top: 0;">Hi <strong>${clientName}</strong>,</p>
            <p style="font-size: 15px; color: #64748b;">We confirm receipt of your payment for invoice <strong>#${invoiceNumber}</strong>.</p>

            <div style="text-align: center; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 1px solid #bbf7d0; border-radius: 16px; padding: 28px; margin: 28px 0;">
              <span style="font-size: 12px; color: #166534; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Total Amount Paid</span>
              <div style="font-size: 40px; font-weight: 900; color: #15803d; margin-top: 4px; letter-spacing: -0.5px;">${formattedAmount}</div>
              <p style="margin: 8px 0 0 0; font-size: 13px; color: #166534; font-weight: 600;">Payment Date: ${paymentDate}</p>
            </div>

            <p style="font-size: 14px; color: #64748b; text-align: center;">
              Your account balance for this invoice is fully settled. Thank you for your prompt payment.
            </p>
          </div>

          <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 28px 36px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
              SmartInvoice Payment Receipt &mdash; Official Confirmation
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generates payment reminder email for pending/overdue invoices (zero emojis)
   */
  static generatePaymentReminderEmail(clientName: string, invoiceNumber: string, currency: string, amount: number, dueDate: string, paymentLink: string, daysOverdue?: number): string {
    const formattedAmount = `${currency || '$'}${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const isOverdue = (daysOverdue && daysOverdue > 0);

    const bannerBg = isOverdue ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)' : 'linear-gradient(135deg, #854d0e 0%, #a16207 100%)';
    const statusLabel = isOverdue ? `OVERDUE BY ${daysOverdue} DAY${daysOverdue > 1 ? 'S' : ''}` : 'UPCOMING PAYMENT REMINDER';

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Reminder - #${invoiceNumber}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #0f172a; background-color: #f1f5f9; margin: 0; padding: 30px 12px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
          
          <div style="background: ${bannerBg}; padding: 40px 32px; text-align: center;">
            <div style="display: inline-block; padding: 6px 16px; background: rgba(255, 255, 255, 0.2); border-radius: 9999px; margin-bottom: 14px;">
              <span style="color: #ffffff; font-size: 12px; font-weight: 800; letter-spacing: 1.2px;">${statusLabel}</span>
            </div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff;">Payment Reminder</h1>
          </div>

          <div style="padding: 40px 36px;">
            <p style="font-size: 16px; color: #334155; margin-top: 0;">Hi <strong>${clientName}</strong>,</p>
            <p style="font-size: 15px; color: #64748b;">This is a payment reminder regarding invoice <strong>#${invoiceNumber}</strong>.</p>

            <div style="background-color: #f8fafc; border-radius: 14px; padding: 22px 26px; border: 1px solid #e2e8f0; border-left: 5px solid ${isOverdue ? '#ef4444' : '#f59e0b'}; margin: 28px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Amount Outstanding:</td>
                  <td style="padding: 6px 0; font-size: 16px; color: #0f172a; font-weight: 800; text-align: right;">${formattedAmount}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-size: 14px; color: #64748b;">Due Date:</td>
                  <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600; text-align: right;">${dueDate}</td>
                </tr>
                ${daysOverdue ? `
                  <tr>
                    <td style="padding: 6px 0; font-size: 14px; color: #dc2626;">Days Overdue:</td>
                    <td style="padding: 6px 0; font-size: 14px; color: #dc2626; font-weight: 700; text-align: right;">${daysOverdue} days</td>
                  </tr>
                ` : ''}
              </table>
            </div>

            ${paymentLink ? `
              <div style="text-align: center; margin: 36px 0;">
                <a href="${paymentLink}" target="_blank" style="display: inline-block; padding: 18px 42px; background-color: #1ed760; color: #000000; text-decoration: none; border-radius: 9999px; font-weight: 800; font-size: 15px; letter-spacing: 0.8px; text-transform: uppercase; box-shadow: 0 10px 20px -3px rgba(30, 215, 96, 0.4);">
                  PAY INVOICE ONLINE
                </a>
              </div>
            ` : ''}

            <p style="font-size: 14px; color: #64748b; text-align: center;">
              If you have already processed this payment, please disregard this notice.
            </p>
          </div>

          <div style="background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 28px 36px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #94a3b8;">
              SmartInvoice Payment Notification System
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}