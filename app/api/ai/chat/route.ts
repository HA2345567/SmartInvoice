import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAuthUser } from '@/lib/auth-helpers';
import { DatabaseService } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const apiKey = process.env.GOOGLE_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Google API key is not configured' },
                { status: 500 }
            );
        }

        // Authenticate user
        const user = await getAuthUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Invalid message format' },
                { status: 400 }
            );
        }

        // Fetch user data via Neon DB DatabaseService
        const userProfile = await DatabaseService.getUserById(user.id);
        const clientsData = await DatabaseService.getClients(user.id);
        const invoicesData = await DatabaseService.getInvoices(user.id);

        const clients = clientsData || [];
        const invoices = invoicesData || [];
        const profile = userProfile || {
            name: user.name || user.email.split('@')[0],
            email: user.email,
            currency: 'USD',
            defaultgstrate: 18,
            defaulttaxrate: 0
        };

        const genAI = new GoogleGenerativeAI(apiKey);

        const systemInstruction = `
You are the SmartInvoice AI Assistant, embedded in the SmartInvoice platform. You help freelancers, agencies, and businesses create invoices, manage clients, track payments, and understand their revenue quickly and accurately.

## User Account Context
- Account Name: ${profile.name || 'User'}
- Company: ${profile.company || 'N/A'}
- Email: ${profile.email}
- Default Currency: ${profile.currency || 'USD'}
- Default GST Rate: ${profile.defaultgstrate ?? 18}%
- Default Tax Rate: ${profile.defaulttaxrate ?? 0}%

## Database Knowledge (Authenticated User Data from Neon DB)
- Existing Clients (${clients.length}): ${JSON.stringify(clients.map((c: any) => ({ id: c.id, name: c.name, email: c.email, company: c.company, currency: c.currency })))}
- Existing Invoices (${invoices.length}): ${JSON.stringify(invoices.map((i: any) => ({ invoiceNumber: i.invoiceNumber, clientName: i.clientName, clientEmail: i.clientEmail, amount: i.amount, status: i.status, date: i.date, dueDate: i.dueDate, itemsCount: Array.isArray(i.items) ? i.items.length : 0 })))}

## Core Capabilities & Rules
1. **AI Invoice Generation**:
   - Extract: clientName, clientEmail, services/items (description, quantity, rate), currency, dueDate, discountRate, taxRate.
   - Match clientName with existing clients if applicable to retrieve their email/currency/address.
   - If critical info is missing (e.g., rate or client name), ask ONE concise clarifying question and set "invoiceDraft" to null.
   - Never invent prices, tax rates, or client details not provided or found in account context.
   - Default currency is "${profile.currency || 'USD'}" and tax rate is ${profile.defaulttaxrate ?? profile.defaultgstrate ?? 0}% unless specified.
   - When drafting an invoice, populate the "invoiceDraft" JSON object matching the app's invoice schema.

2. **Client & Payment Q&A**:
   - Answer questions about clients, invoice statuses, and payment histories accurately using account context.

3. **Reminders & Follow-ups**:
   - Draft polite payment reminder messages for overdue invoices.

4. **Insights**:
   - Summarize revenue trends, cash flow, and outstanding balances in plain, clear business language.

5. **Data Handling & Security**:
   - Treat financial data as sensitive. Mask all but the last 4 digits of bank accounts/cards if mentioned.
   - Never fabricate payment confirmations, transaction IDs, or fake balances.
   - Do not take irreversible actions without explicit user confirmation.

6. **Boundaries**:
   - You are not a tax advisor, accountant, or lawyer. For tax compliance, legal, or accounting-specific questions beyond basic invoice math, note that the user should consult a qualified professional.
   - Do not provide guidance on evading taxes or falsifying invoices.

## Output Format Specification
You MUST ALWAYS respond with a JSON object containing exactly two keys: "content" (string) and "invoiceDraft" (object or null).

Schema of "invoiceDraft" when generating/drafting an invoice:
{
  "clientName": "Client Name",
  "clientEmail": "client@example.com",
  "clientCompany": "Optional Company",
  "clientAddress": "Optional Address",
  "clientGst": "Optional GST/VAT Number",
  "clientCurrency": "USD",
  "items": [
    {
      "description": "Service Description",
      "quantity": 1,
      "rate": 100,
      "amount": 100
    }
  ],
  "taxRate": 18,
  "discountRate": 0,
  "notes": "Thank you for your business!",
  "dueDate": "YYYY-MM-DD"
}
If no invoice draft is being generated, set "invoiceDraft" to null.
`;

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: systemInstruction,
        });

        // Convert chat history to Gemini format
        const history = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content) }],
        }));

        const lastMessage = messages[messages.length - 1].content;

        const chat = model.startChat({
            history: history,
            generationConfig: {
                maxOutputTokens: 1200,
                responseMimeType: 'application/json',
            },
        });

        const result = await chat.sendMessage(lastMessage);
        const response = await result.response;
        const text = response.text();

        try {
            const parsed = JSON.parse(text);
            return NextResponse.json({
                content: parsed.content || text,
                invoiceDraft: parsed.invoiceDraft || null,
            });
        } catch (e) {
            console.error('Failed to parse Gemini JSON output:', text);
            return NextResponse.json({
                content: text,
                invoiceDraft: null,
            });
        }
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process AI request' },
            { status: 500 }
        );
    }
}
