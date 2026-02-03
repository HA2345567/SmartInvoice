import { DatabaseService, Invoice } from './database';

export type Tone = 'polite' | 'firm' | 'final';

export interface FollowUpAction {
    invoiceId: string;
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    amount: number;
    daysOverdue: number;
    suggestedTone: Tone;
    subject: string;
    body: string;
}

export class AIAgentService {
    private static readonly TEMPLATES = {
        polite: {
            subject: (inv: string) => `Quick check-in regarding Invoice #${inv}`,
            body: (name: string, inv: string, date: string) => `Hi ${name},\n\nI hope you're having a great week!\n\nI just wanted to drop a friendly note regarding Invoice #${inv} which was due on ${new Date(date).toLocaleDateString()}. It might have just slipped through perfectly normal.\n\nCould you please check on this when you have a moment?\n\nBest regards,`
        },
        firm: {
            subject: (inv: string) => `Reminder: Payment overdue for Invoice #${inv}`,
            body: (name: string, inv: string, days: number) => `Hi ${name},\n\nThis is a reminder that payment for Invoice #${inv} is now ${days} days overdue.\n\nWe would appreciate it if you could settle this at your earliest convenience to avoid any service disruptions.\n\nPlease let us know if there is an issue with the payment.\n\nRegards,`
        },
        final: {
            subject: (inv: string) => `URGENT: Final Notice for Invoice #${inv}`,
            body: (name: string, inv: string) => `Hi ${name},\n\nWe still have not received payment for Invoice #${inv}, effectively immediately.\n\nPlease remit payment immediately to close this balance.\n\nIf payment is not received, we may have to escalate this matter.\n\nSincerely,`
        }
    };

    /**
     * Scans all invoices for a user and identifies those requiring follow-up.
     * Simulates an AI deciding the best course of action based on overdue duration.
     */
    static async scanForFollowUps(userId: string): Promise<FollowUpAction[]> {
        const invoices = await DatabaseService.getInvoices(userId);
        const today = new Date();
        const actions: FollowUpAction[] = [];

        for (const invoice of invoices) {
            if (invoice.status === 'paid' || invoice.status === 'draft') continue;

            const dueDate = new Date(invoice.dueDate);
            const diffTime = today.getTime() - dueDate.getTime();
            const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (daysOverdue > 0) {
                // AI Logic for Tone Selection
                let tone: Tone = 'polite';
                if (daysOverdue > 7) tone = 'firm';
                if (daysOverdue > 14) tone = 'final';

                // Don't spam: Check last reminder sent
                const lastSent = invoice.lastReminderSent ? new Date(invoice.lastReminderSent) : null;
                if (lastSent) {
                    const daysSinceLast = Math.ceil((today.getTime() - lastSent.getTime()) / (1000 * 60 * 60 * 24));
                    // If we already sent a reminder recently (e.g., within 3 days), skip
                    if (daysSinceLast < 3) continue;
                }

                // Generate Content
                // Generate Content
                const subject = this.TEMPLATES[tone].subject(invoice.invoiceNumber);
                // ts-ignore to handle variable argument length cleanly in strict mode if needed, though with 'any' or proper types it works
                // @ts-ignore 
                const body = this.TEMPLATES[tone].body(invoice.clientName, invoice.invoiceNumber, tone === 'firm' ? daysOverdue : invoice.dueDate);

                actions.push({
                    invoiceId: invoice.id,
                    invoiceNumber: invoice.invoiceNumber,
                    clientName: invoice.clientName,
                    clientEmail: invoice.clientEmail,
                    amount: invoice.amount,
                    daysOverdue,
                    suggestedTone: tone,
                    subject,
                    body
                });
            }
        }

        return actions;
    }

    /**
     * Executes the action: Sends the email via Resend and updates DB.
     * Note: This is server-side logic in a trusted environment (API route).
     */
    static async executeFollowUp(userId: string, action: FollowUpAction): Promise<boolean> {
        try {
            console.log(`[AI Agent] Attempting to send ${action.suggestedTone} email to ${action.clientEmail} for Invoice ${action.invoiceId}`);

            // Send email using Resend via our internal API to keep secrets safe on server
            const response = await fetch('/api/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: action.clientEmail,
                    subject: action.subject,
                    html: action.body.replace(/\n/g, '<br/>'), // Simple plain text to HTML conversion
                    invoiceId: action.invoiceId
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send email via API');
            }

            // Update Invoice Record in DB
            const invoice = await DatabaseService.getInvoiceById(userId, action.invoiceId);
            if (invoice) {
                await DatabaseService.updateInvoice(userId, action.invoiceId, {
                    remindersSent: (invoice.remindersSent || 0) + 1,
                    lastReminderSent: new Date().toISOString()
                });
                return true;
            }
            return false;

        } catch (error) {
            console.error('[AI Agent] Execution failed:', error);
            throw error;
        }
    }
}
