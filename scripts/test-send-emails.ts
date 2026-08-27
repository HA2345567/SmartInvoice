import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { EmailService } from '../lib/email-service';

async function sendTestEmails() {
  const emailService = new EmailService();

  const recipient = process.env.EMAIL_USER || 'bhardwajharsh0312@gmail.com';
  console.log(`Testing SMTP connection and sending sample emails to: ${recipient}...`);

  const isValid = await emailService.testConnection();
  if (!isValid) {
    console.error('❌ SMTP Connection failed. Please check EMAIL_USER and EMAIL_PASS in .env.local.');
    return;
  }
  console.log('✅ SMTP Connection verified successfully!');

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
    email: recipient
  };

  // 1. Invoice Email
  console.log('Sending Sample Invoice Email...');
  const invoiceHtml = EmailService.generateInvoiceEmail(sampleInvoice, sampleCompany);
  const sentInvoice = await emailService.sendEmail({
    to: recipient,
    subject: 'Invoice INV-2026-001 from SmartInvoice Premium Services',
    html: invoiceHtml
  });
  console.log('Invoice email sent:', sentInvoice ? 'SUCCESS ✅' : 'FAILED ❌');

  // 2. Welcome Email
  console.log('Sending Sample Welcome Email...');
  const welcomeHtml = EmailService.generateWelcomeEmail('Harsh Bhardwaj', 'https://smartinvoice-rosy.vercel.app/dashboard');
  const sentWelcome = await emailService.sendEmail({
    to: recipient,
    subject: 'Welcome to SmartInvoice - Professional Invoice Management',
    html: welcomeHtml
  });
  console.log('Welcome email sent:', sentWelcome ? 'SUCCESS ✅' : 'FAILED ❌');

  // 3. Payment Reminder Email
  console.log('Sending Sample Payment Reminder Email...');
  const reminderHtml = EmailService.generatePaymentReminderEmail('Harsh Bhardwaj', 'INV-2026-001', '$', 2450.00, 'September 10, 2026', 'https://smartinvoice-rosy.vercel.app/dashboard', 3);
  const sentReminder = await emailService.sendEmail({
    to: recipient,
    subject: 'Payment Reminder - Invoice INV-2026-001 is Overdue',
    html: reminderHtml
  });
  console.log('Payment Reminder email sent:', sentReminder ? 'SUCCESS ✅' : 'FAILED ❌');

  // 4. Payment Receipt Email
  console.log('Sending Sample Payment Receipt Email...');
  const receiptHtml = EmailService.generatePaymentReceivedEmail('Harsh Bhardwaj', 'INV-2026-001', '$', 2450.00, 'August 27, 2026');
  const sentReceipt = await emailService.sendEmail({
    to: recipient,
    subject: 'Payment Receipt - Invoice INV-2026-001',
    html: receiptHtml
  });
  console.log('Payment Receipt email sent:', sentReceipt ? 'SUCCESS ✅' : 'FAILED ❌');
}

sendTestEmails().catch(console.error);
