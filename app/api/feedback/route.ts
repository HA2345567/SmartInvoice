import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.title || !data.description || !data.type || !data.rating) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    await DatabaseService.addFeedback(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit feedback.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const feedback = await DatabaseService.getAllFeedback();
    return NextResponse.json(feedback);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch feedback' }, { status: 500 });
  }
} 