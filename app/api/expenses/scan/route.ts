import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { scanReceipt } from '@/lib/gemini';

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
            details: error.message || String(error)
        }, { status: 500 });
    }
}
