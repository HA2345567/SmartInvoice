import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const searchParams = request.nextUrl.searchParams;
  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  // If Google OAuth credentials are not configured yet
  if (!clientId || clientId.trim() === '' || clientId.includes('your-google-client-id')) {
    return NextResponse.redirect(
      new URL('/auth/login?error=google_not_configured', request.url)
    );
  }

  // Generate random CSRF state
  const randomBytes = crypto.randomBytes(16).toString('hex');
  const state = `${randomBytes}:${encodeURIComponent(redirectTarget)}`;

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    request.nextUrl.origin ||
    'http://localhost:3000';
  const callbackUrl = `${origin}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'select_account',
    state: state,
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  const response = NextResponse.redirect(googleAuthUrl);
  // Store CSRF state in secure cookie
  response.cookies.set('oauth_state', state, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 600, // 10 minutes
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}
