/**
 * Server-side authentication helpers for API routes
 * Uses JWT tokens and Neon DB for authentication
 */

import { NextRequest } from 'next/server';
import { AuthService } from './auth';
import { DatabaseService } from './database';

// Helper to extract JWT token from request header or cookies
export function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  const cookieStore = request.cookies;
  const token = cookieStore.get('auth-token')?.value ||
                cookieStore.get('token')?.value ||
                cookieStore.get('sb-access-token')?.value;

  return token || null;
}

// Get user from request - either from Authorization header or cookies
export async function getAuthUser(request: NextRequest): Promise<{ id: string; email: string; name?: string } | null> {
  try {
    const token = getAuthToken(request);
    if (!token) return null;

    const payload = AuthService.verifyToken(token);
    if (!payload || !payload.userId) {
      return null;
    }

    const user = await DatabaseService.getUserById(payload.userId);
    if (!user) return null;

    return {
      id: user.id,
      email: user.email || '',
      name: user.name,
    };
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

// Legacy compatibility helper for user database client
export async function getUserClient(request: NextRequest) {
  const user = await getAuthUser(request);
  return { user, supabase: null };
}

export function getSupabaseClient(authToken?: string) {
  return null;
}
