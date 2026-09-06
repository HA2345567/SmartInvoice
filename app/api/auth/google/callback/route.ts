import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ||
    request.nextUrl.origin ||
    'http://localhost:3000';

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(error)}`, origin)
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/auth/login?error=missing_code_or_state', origin)
    );
  }

  // Validate state
  const savedState = request.cookies.get('oauth_state')?.value;
  if (!savedState || savedState !== state) {
    console.error('OAuth state mismatch:', { savedState, state });
    return NextResponse.redirect(
      new URL('/auth/login?error=invalid_state', origin)
    );
  }

  // Extract redirect target from state
  let redirectTarget = '/dashboard';
  const stateParts = state.split(':');
  if (stateParts.length > 1 && stateParts[1]) {
    try {
      redirectTarget = decodeURIComponent(stateParts[1]);
    } catch {
      redirectTarget = '/dashboard';
    }
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackUrl = `${origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL('/auth/login?error=google_not_configured', origin)
    );
  }

  try {
    // 1. Exchange code for access token & ID token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: callbackUrl,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errData = await tokenRes.text();
      console.error('Google token exchange error:', errData);
      return NextResponse.redirect(
        new URL('/auth/login?error=token_exchange_failed', origin)
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch user profile from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userRes.ok) {
      console.error('Failed to fetch Google userinfo');
      return NextResponse.redirect(
        new URL('/auth/login?error=userinfo_failed', origin)
      );
    }

    const googleProfile = await userRes.json();

    if (!googleProfile.email) {
      return NextResponse.redirect(
        new URL('/auth/login?error=email_not_provided', origin)
      );
    }

    // 3. Upsert user in Neon DB via Prisma
    const user = await AuthService.upsertGoogleUser({
      email: googleProfile.email,
      name: googleProfile.name || googleProfile.given_name || 'Google User',
      avatar: googleProfile.picture || undefined,
    });

    // 4. Generate SmartInvoice JWT token
    const token = AuthService.generateToken(user.id);

    // 5. Redirect to intermediate callback page to synchronize client state
    const callbackRedirect = new URL('/auth/callback', origin);
    callbackRedirect.searchParams.set('token', token);
    callbackRedirect.searchParams.set('redirect', redirectTarget);

    const response = NextResponse.redirect(callbackRedirect);

    // Set auth-token cookie (1 week)
    response.cookies.set('auth-token', token, {
      path: '/',
      maxAge: 604800,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Clear oauth_state cookie
    response.cookies.delete('oauth_state');

    return response;
  } catch (err) {
    console.error('Google OAuth callback error:', err);
    return NextResponse.redirect(
      new URL('/auth/login?error=unexpected_oauth_error', origin)
    );
  }
}
