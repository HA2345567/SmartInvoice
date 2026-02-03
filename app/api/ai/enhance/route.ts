import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { enhanceText } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const user = await AuthService.getUserFromRequest(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { text, mode } = await request.json();

        if (!text) {
            return NextResponse.json({ error: 'No text provided' }, { status: 400 });
        }

        const enhancedText = await enhanceText(text, mode);

        return NextResponse.json({ enhancedText });

    } catch (error: any) {
        console.error('Enhance text error:', error);
        return NextResponse.json({
            error: 'Failed to enhance text',
            details: error.message || String(error)
        }, { status: 500 });
    }
}
