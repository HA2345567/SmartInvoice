import { NextResponse } from 'next/server';
import { EmailService } from '@/lib/email-service';

export async function POST(request: Request) {
    try {
        const { to, subject, html, invoiceId } = await request.json();

        if (!to || !subject || !html) {
            return NextResponse.json({ error: 'Missing required parameters (to, subject, html)' }, { status: 400 });
        }

        // 1. Try sending via SMTP (Nodemailer) first if credentials exist
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            try {
                const emailService = new EmailService();
                const sent = await emailService.sendEmail({
                    to,
                    subject,
                    html
                });

                if (sent) {
                    console.log(`[Email API] Successfully sent email to ${to} via SMTP`);
                    return NextResponse.json({ success: true, provider: 'smtp' });
                } else {
                    console.warn(`[Email API] SMTP failed to send to ${to}, falling back if available`);
                }
            } catch (smtpError: any) {
                console.error('[Email API] SMTP Exception:', smtpError?.message || smtpError);
            }
        }

        // 2. Try Resend if configured
        if (process.env.RESEND_API_KEY) {
            try {
                const { Resend } = await import('resend');
                const resend = new Resend(process.env.RESEND_API_KEY);

                const { data, error } = await resend.emails.send({
                    from: process.env.EMAIL_FROM || 'SmartInvoice AI <ai@onboarding.resend.dev>',
                    to: [to],
                    subject: subject,
                    html: html,
                });

                if (error) {
                    console.error('Resend API Error:', error);
                    return NextResponse.json({ error: error.message }, { status: 400 });
                }

                return NextResponse.json({ success: true, provider: 'resend', data });
            } catch (resendError: any) {
                console.error('[Email API] Resend Exception:', resendError?.message || resendError);
            }
        }

        // 3. If neither is available, simulate in dev
        console.warn('[Email API] Neither working SMTP nor RESEND_API_KEY configured. Simulating email send to:', to);
        return NextResponse.json({ success: true, simulated: true });

    } catch (error: any) {
        console.error('Email API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
