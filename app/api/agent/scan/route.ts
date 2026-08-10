import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helpers';
import { AIAgentService } from '@/lib/ai-agent';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const actions = await AIAgentService.scanForFollowUps(user.id);
    return NextResponse.json(actions);
  } catch (error) {
    console.error('AI Agent scan error:', error);
    return NextResponse.json({ 
      error: 'Failed to scan follow-ups', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
