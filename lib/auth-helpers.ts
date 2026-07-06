/**
 * Server-side authentication helpers for API routes
 * Works with Supabase Auth to get the current user from cookies/headers
 */

import { createClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a Supabase client for server-side use
export function getSupabaseClient(authToken?: string) {
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    },
  });
  return client;
}

// Get user from request - either from Authorization header or cookies
export async function getAuthUser(request: NextRequest): Promise<{ id: string; email: string } | null> {
  try {
    // Try Authorization header first (for API calls from client)
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const supabase = getSupabaseClient(token);

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email || '',
      };
    }

    // Try cookie-based auth (for SSR)
    const cookieStore = request.cookies;
    const accessToken = cookieStore.get('sb-access-token')?.value ||
                        cookieStore.get('supabase-auth-token')?.value;

    if (accessToken) {
      const supabase = getSupabaseClient(accessToken);
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);

      if (error || !user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email || '',
      };
    }

    return null;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

// Create a user-scoped Supabase client for database operations
export async function getUserClient(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return { user: null, supabase: null };

  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;

  const supabase = getSupabaseClient(token);

  return { user, supabase };
}
