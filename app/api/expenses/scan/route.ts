import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { DatabaseService } from '@/lib/database';
import { scanReceipt, resolveEffectiveModel, resolveEffectiveBaseUrl } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const user = await AuthService.getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Convert file to base64
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const mimeType = file.type;

        // Fallback to database user profile if needed
        const dbProfile = (!user.aiApiKey && user.id) ? await DatabaseService.getUserById(user.id) : null;

        const effectiveProvider = user.aiProvider || dbProfile?.aiProvider || 'gemini';
        const effectiveKey = user.aiApiKey || dbProfile?.aiApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY || process.env.ANTHROPIC_API_KEY || '';
        const rawModel = user.aiModel || dbProfile?.aiModel || '';
        const rawBaseUrl = user.aiBaseUrl || dbProfile?.aiBaseUrl || '';

        const aiConfig = {
            provider: effectiveProvider,
            apiKey: effectiveKey,
            model: resolveEffectiveModel(effectiveProvider, rawModel),
            baseUrl: resolveEffectiveBaseUrl(effectiveProvider, rawBaseUrl)
        };

        if (!aiConfig.apiKey) {
            return NextResponse.json({
                error: 'AI feature is disabled. Please configure your AI API Key in Settings > AI (BYOK).'
            }, { status: 400 });
        }

        // Scan with AI
        const result = await scanReceipt(aiConfig, base64, mimeType);

        return NextResponse.json({
            ...result,
            id: Date.now().toString(),
            fileName: file.name
        });

    } catch (error: any) {
        console.error('Expense scan error:', error);
        return NextResponse.json({
            error: 'Failed to scan receipt',
            details: error?.response?.data?.error?.message || error.message || String(error)
        }, { status: 500 });
    }
}
