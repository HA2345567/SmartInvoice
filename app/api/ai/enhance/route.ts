import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { DatabaseService } from '@/lib/database';
import { enhanceText, resolveEffectiveModel, resolveEffectiveBaseUrl } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const user = await AuthService.getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json().catch(() => ({}));
        const { text, mode, provider, apiKey, model, baseUrl } = body || {};

        // Fallback to database user profile if not on user object directly
        const dbProfile = (!user.aiApiKey && user.id) ? await DatabaseService.getUserById(user.id) : null;

        const effectiveProvider = provider || user.aiProvider || dbProfile?.aiProvider || 'gemini';
        const effectiveKey = apiKey || user.aiApiKey || dbProfile?.aiApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || process.env.ANTHROPIC_API_KEY || '';
        const rawModel = model || user.aiModel || dbProfile?.aiModel || '';
        const rawBaseUrl = baseUrl || user.aiBaseUrl || dbProfile?.aiBaseUrl || '';

        const aiConfig = {
            provider: effectiveProvider,
            apiKey: effectiveKey,
            model: resolveEffectiveModel(effectiveProvider, rawModel),
            baseUrl: resolveEffectiveBaseUrl(effectiveProvider, rawBaseUrl)
        };

        if (!aiConfig.apiKey) {
            return NextResponse.json({
                error: 'AI API Key is required. Please configure your API key in Settings > AI (BYOK).'
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
