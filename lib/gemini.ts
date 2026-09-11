import axios from 'axios';

export interface AIConfig {
    provider: string; // 'gemini' | 'openai' | 'claude' | 'groq' | 'openrouter' | 'deepseek' | 'custom'
    apiKey: string;
    model: string;
    baseUrl?: string;
}

export function getProviderDefaults(provider: string) {
    const p = (provider || 'gemini').toLowerCase();
    switch (p) {
        case 'openai':
            return {
                defaultBaseUrl: 'https://api.openai.com/v1',
                defaultModel: 'gpt-4o-mini',
            };
        case 'claude':
            return {
                defaultBaseUrl: 'https://api.anthropic.com/v1',
                defaultModel: 'claude-3-5-sonnet-20241022',
            };
        case 'groq':
            return {
                defaultBaseUrl: 'https://api.groq.com/openai/v1',
                defaultModel: 'llama-3.3-70b-versatile',
            };
        case 'openrouter':
            return {
                defaultBaseUrl: 'https://openrouter.ai/api/v1',
                defaultModel: 'google/gemini-2.5-flash',
            };
        case 'deepseek':
            return {
                defaultBaseUrl: 'https://api.deepseek.com/v1',
                defaultModel: 'deepseek-chat',
            };
        case 'custom':
            return {
                defaultBaseUrl: 'http://localhost:11434/v1',
                defaultModel: 'llama3',
            };
        case 'gemini':
        default:
            return {
                defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
                defaultModel: 'gemini-2.0-flash',
            };
    }
}

export function resolveEffectiveModel(provider: string, model?: string): string {
    const p = (provider || 'gemini').toLowerCase();
    const defaults = getProviderDefaults(p);
    const trimmed = model?.trim();
    if (!trimmed) return defaults.defaultModel;

    // Sanity check: if model clearly belongs to Gemini but provider is not Gemini or OpenRouter
    if (trimmed.startsWith('gemini-') && p !== 'gemini' && p !== 'openrouter') {
        return defaults.defaultModel;
    }
    // If model is Claude-specific but provider is not Claude or OpenRouter
    if (trimmed.startsWith('claude-') && p !== 'claude' && p !== 'openrouter') {
        return defaults.defaultModel;
    }
    // If model is GPT-specific but provider is Claude or Gemini
    if (trimmed.startsWith('gpt-') && p !== 'openai' && p !== 'openrouter' && p !== 'custom') {
        return defaults.defaultModel;
    }

    return trimmed;
}

export function resolveEffectiveBaseUrl(provider: string, baseUrl?: string): string {
    const p = (provider || 'gemini').toLowerCase();
    const trimmed = baseUrl?.trim();
    if (trimmed) return trimmed;
    return getProviderDefaults(p).defaultBaseUrl;
}

export async function callAI(config: AIConfig, prompt: string, systemInstruction?: string, base64Image?: string, mimeType?: string): Promise<string> {
    const provider = (config.provider || 'gemini').toLowerCase();
    const apiKey = config.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || process.env.ANTHROPIC_API_KEY || '';
    const model = resolveEffectiveModel(provider, config.model);
    const baseUrl = resolveEffectiveBaseUrl(provider, config.baseUrl);

    if (!apiKey) {
        throw new Error('AI API key is missing. Please configure it in Settings.');
    }

    if (provider === 'gemini') {
        const activeBaseUrl = baseUrl;
        const activeModel = model;
        const url = `${activeBaseUrl}/${activeModel}:generateContent?key=${apiKey}`;

        const parts: any[] = [];
        if (base64Image && mimeType) {
            parts.push({
                inlineData: {
                    mimeType: mimeType,
                    data: base64Image
                }
            });
        }
        parts.push({ text: prompt });

        const body: any = {
            contents: [{ parts }]
        };

        if (systemInstruction) {
            body.systemInstruction = {
                parts: [{ text: systemInstruction }]
            };
        }

        const response = await axios.post(url, body);
        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            console.error('Gemini API Error Response:', response.data);
            throw new Error('Invalid response received from Gemini API');
        }
        return text;
    } else if (provider === 'claude' && (!baseUrl || baseUrl.includes('anthropic.com'))) {
        // Native Anthropic Messages API
        const activeBaseUrl = baseUrl;
        const activeModel = model;
        const url = `${activeBaseUrl}/messages`;

        const content: any[] = [];
        if (base64Image && mimeType) {
            content.push({
                type: 'image',
                source: {
                    type: 'base64',
                    media_type: mimeType,
                    data: base64Image
                }
            });
        }
        content.push({ type: 'text', text: prompt });

        const body: any = {
            model: activeModel,
            max_tokens: 2048,
            messages: [{ role: 'user', content }]
        };

        if (systemInstruction) {
            body.system = systemInstruction;
        }

        const response = await axios.post(url, body, {
            headers: {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'content-type': 'application/json'
            }
        });

        const text = response.data?.content?.[0]?.text;
        if (!text) {
            throw new Error('Invalid response received from Anthropic Claude API');
        }
        return text;
    } else {
        // OpenAI, Groq, OpenRouter, DeepSeek, or Custom OpenAI-Compatible
        const activeBaseUrl = baseUrl;
        const activeModel = model;
        const url = `${activeBaseUrl}/chat/completions`;

        const messages: any[] = [];
        if (systemInstruction) {
            messages.push({ role: 'system', content: systemInstruction });
        }

        if (base64Image && mimeType) {
            messages.push({
                role: 'user',
                content: [
                    { type: 'text', text: prompt },
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:${mimeType};base64,${base64Image}`
                        }
                    }
                ]
            });
        } else {
            messages.push({ role: 'user', content: prompt });
        }

        const headers: Record<string, string> = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };

        if (provider === 'openrouter') {
            headers['HTTP-Referer'] = 'http://localhost:3000';
            headers['X-Title'] = 'SmartInvoice';
        }

        const response = await axios.post(url, {
            model: activeModel,
            messages
        }, { headers });

        const text = response.data?.choices?.[0]?.message?.content;
        if (!text) {
            console.error('AI API Error Response:', response.data);
            throw new Error(`Invalid response received from ${provider} API`);
        }
        return text;
    }
}

export async function enhanceText(config: AIConfig, text: string, mode: 'formal' | 'friendly' | 'detailed'): Promise<string> {
    const prompt = `Enhance the following text to be more ${mode} for an invoice description or notes. 
  Original text: "${text}"
  Return only the enhanced text, nothing else.`;

    return callAI(config, prompt);
}

export async function scanReceipt(config: AIConfig, base64Image: string, mimeType: string) {
    const prompt = `Extract information from this receipt/document. 
  Focus on: merchant/vendor name, total amount, date, and category (e.g., Office, Travel, Software, Food, etc.).
  Return the data in EXACTLY this JSON format:
  {
    "merchant": "Name",
    "amount": 123.45,
    "date": "YYYY-MM-DD",
    "category": "Category",
    "confidence": 95
  }`;

    const text = await callAI(config, prompt, undefined, base64Image, mimeType);
    console.log("RAW AI RESPONSE:", text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text;

    try {
        return JSON.parse(cleanJson);
    } catch (e) {
        console.error("Failed to parse AI JSON:", cleanJson);
        throw new Error("AI returned invalid data format. Please try again.");
    }
}
