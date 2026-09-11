import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAuthUser } from '@/lib/auth-helpers';
import { DatabaseService } from '@/lib/database';
import { resolveEffectiveModel, resolveEffectiveBaseUrl } from '@/lib/gemini';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // Authenticate user
        const user = await getAuthUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user data via Neon DB DatabaseService
        const userProfile = await DatabaseService.getUserById(user.id);
        const provider = (userProfile?.aiProvider || user.aiProvider || 'gemini').toLowerCase();
        const apiKey = userProfile?.aiApiKey || 
                       user.aiApiKey || 
                       userProfile?.googleApiKey || 
                       process.env.GEMINI_API_KEY || 
                       process.env.GOOGLE_AI_API_KEY || 
                       process.env.OPENAI_API_KEY || 
                       process.env.GROQ_API_KEY || 
                       process.env.ANTHROPIC_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'AI features are disabled. Please configure your AI API Key in Settings > AI (BYOK).' },
                { status: 400 }
            );
        }

        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: 'Invalid message format' },
                { status: 400 }
            );
        }

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
You MUST ALWAYS respond with a valid JSON object containing exactly two keys: "content" (string) and "invoiceDraft" (object or null).

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

        let text = '';
        const rawModel = userProfile?.aiModel || user.aiModel || '';
        const rawBaseUrl = userProfile?.aiBaseUrl || user.aiBaseUrl || '';
        const activeModel = resolveEffectiveModel(provider, rawModel);
        const activeBaseUrl = resolveEffectiveBaseUrl(provider, rawBaseUrl);

        if (provider === 'gemini') {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: activeModel,
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
                    maxOutputTokens: 1500,
                    responseMimeType: 'application/json',
                },
            });

            const result = await chat.sendMessage(typeof lastMessage === 'string' ? lastMessage : JSON.stringify(lastMessage));
            const response = await result.response;
            text = response.text();
        } else if (provider === 'claude' && (!rawBaseUrl || rawBaseUrl.includes('anthropic.com'))) {
            // Anthropic Messages API
            const claudeUrl = `${activeBaseUrl}/messages`;
            const messagesToSend = messages.map((msg: any) => ({
                role: msg.role === 'assistant' ? 'assistant' : 'user',
                content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
            }));

            const response = await axios.post(claudeUrl, {
                model: activeModel,
                max_tokens: 2048,
                system: systemInstruction,
                messages: messagesToSend
            }, {
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json'
                }
            });

            text = response.data?.content?.[0]?.text || '';
        } else {
            // OpenAI, Groq, OpenRouter, DeepSeek, or Custom OpenAI-Compatible
            const messagesToSend: any[] = [
                { role: 'system', content: systemInstruction }
            ];

            messages.forEach((msg: any) => {
                messagesToSend.push({
                    role: msg.role === 'assistant' ? 'assistant' : 'user',
                    content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
                });
            });

            const url = `${activeBaseUrl}/chat/completions`;
            const headers: Record<string, string> = {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            };

            if (provider === 'openrouter') {
                headers['HTTP-Referer'] = 'http://localhost:3000';
                headers['X-Title'] = 'SmartInvoice';
            }

            const payload: any = {
                model: activeModel,
                messages: messagesToSend
            };

            if (provider === 'openai') {
                payload.response_format = { type: "json_object" };
            }

            const response = await axios.post(url, payload, { headers });
            text = response.data?.choices?.[0]?.message?.content || '';
        }

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : text;

        try {
            const parsed = JSON.parse(cleanJson);
            return NextResponse.json({
                content: parsed.content || text,
                invoiceDraft: parsed.invoiceDraft || null,
            });
        } catch (e) {
            console.warn('AI response was not standard JSON, returning raw text:', text);
            return NextResponse.json({
                content: text,
                invoiceDraft: null,
            });
        }
    } catch (error: any) {
        console.error('AI API Error:', error?.response?.data || error);
        const details = error?.response?.data?.error?.message || error.message || 'Failed to process AI request';
        return NextResponse.json(
            { error: details },
            { status: 500 }
        );
    }
}
