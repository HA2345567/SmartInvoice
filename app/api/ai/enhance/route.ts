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

        const aiConfig = {
            provider: (user as any).aiProvider || 'gemini',
            apiKey: (user as any).aiApiKey,
            model: (user as any).aiModel || 'gemini-2.0-flash',
            baseUrl: (user as any).aiBaseUrl
        };

        if (!aiConfig.apiKey) {
            return NextResponse.json({
                error: 'AI feature is disabled. Please configure your AI API Key in Settings.'
            }, { status: 400 });
        }

        const { text, mode } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        const enhancedText = await enhanceText(aiConfig, text, mode);

        return NextResponse.json({ enhancedText });

    } catch (error: any) {
        console.error('Enhance text error:', error);
        return NextResponse.json({
            error: 'Failed to enhance text',
            details: error.message || String(error)
        }, { status: 500 });
    }
}
