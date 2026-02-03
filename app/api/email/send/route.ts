import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API Key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { to, subject, html, invoiceId } = await request.json();

        if (!process.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY is missing. Simulating email send.');
            // If no key, return success to prevent app crash during demo
            return NextResponse.json({ success: true, simulated: true });
        }

        const { data, error } = await resend.emails.send({
            from: 'SmartInvoice AI <ai@onboarding.resend.dev>', // Use verified domain later
            to: [to], // During test mode, this must be your own email address unless you add a domain
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('Resend API Error:', error);
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('Email API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
