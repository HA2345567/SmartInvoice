import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helpers';
import { AIAgentService } from '@/lib/ai-agent';

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const action = await request.json();
    if (!action || !action.invoiceId) {
      return NextResponse.json({ error: 'Action object with invoiceId is required' }, { status: 400 });
    }

    const success = await AIAgentService.executeFollowUp(user.id, action);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('AI Agent execute error:', error);
    return NextResponse.json({ 
      error: 'Failed to execute follow-up', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
