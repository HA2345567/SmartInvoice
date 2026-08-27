import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { enhanceText } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const user = await AuthService.getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { text, mode, provider, apiKey, model, baseUrl } = body || {};

        const aiConfig = {
            provider: provider || (user as any).aiProvider || 'gemini',
            apiKey: apiKey || (user as any).aiApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY,
            model: model || (user as any).aiModel || 'gemini-2.0-flash',
            baseUrl: baseUrl || (user as any).aiBaseUrl
        };

        if (!aiConfig.apiKey) {
            return NextResponse.json({
                error: 'AI API Key is required. Please enter your API Key.'
            }, { status: 400 });
        }

        const textToEnhance = text || 'Thank you for your business!';
        const modeToUse = mode || 'formal';

        const enhancedText = await enhanceText(aiConfig, textToEnhance, modeToUse);

        return NextResponse.json({ enhancedText });

    } catch (error: any) {
        console.error('Enhance text error:', error?.response?.data || error);
        const detailMsg = error.response?.data?.error?.message || error.message || String(error);
        return NextResponse.json({
            error: 'AI Connection Failed',
            details: detailMsg
        }, { status: 500 });
    }
}
