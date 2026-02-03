'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/database';

interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  avatar?: string;
  subscriptionTier?: 'free' | 'pro' | 'business';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; userNotFound?: boolean }>;
  signup: (email: string, password: string, name: string, company?: string) => Promise<{ success: boolean; error?: string; userExists?: boolean }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const verifyAndRefreshToken = useCallback(async () => {
    const storedToken = localStorage.getItem('auth_token');
    console.log('Verifying token from localStorage:', storedToken ? 'Token exists' : 'No token');

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      console.log('Making request to /api/auth/me with token');
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      console.log('Auth check response status:', response.status);

      if (response.ok) {
        const { user: refreshedUser, token: refreshedToken } = await response.json();
        console.log('Auth check successful, user:', refreshedUser.email);
        setUser(refreshedUser);
        setToken(refreshedToken);
        localStorage.setItem('auth_token', refreshedToken);
        localStorage.setItem('auth_user', JSON.stringify(refreshedUser));
      } else if (response.status === 401) {
        console.log('Token is invalid or expired, clearing storage');
        // Token is invalid or expired, clear storage but don't redirect immediately
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
        setToken(null);
        // Only redirect if we're on a protected route
        if (window.location.pathname.startsWith('/dashboard')) {
          router.push('/auth/login');
        }
      } else {
        // Other errors - don't logout, just log the error
        console.error('Session verification failed with status:', response.status);
      }
    } catch (error) {
      console.error("Session verification failed", error);
      // Don't logout on network errors, just log the error
      // This prevents redirects due to temporary network issues
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // 1. Initialize Authentication
    const initializeAuth = async () => {
      // First, check for an active Supabase session (for Google/OAuth users)
      // This is crucial because Supabase tokens expire in 1h, but the client auto-refreshes them.
      // We must prefer the fresh token from the client over any stale 'auth_token' in localStorage.
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        console.log('AuthContext: Recovered active Supabase session for', session.user.email);
        const appUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          avatar: session.user.user_metadata.avatar_url,
        };

        setUser(appUser);
        setToken(session.access_token);
        localStorage.setItem('auth_token', session.access_token);
        localStorage.setItem('auth_user', JSON.stringify(appUser));
        setLoading(false);
      } else {
        // Fallback: Check for Local JWT (for Email/Password users who use our custom 7-day tokens)
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
          // We have a stored token, but no Supabase session. 
          // This is likely a Local JWT user. Verify it.
          try {
            // Optimistically set user to avoid flash (will be corrected by verify if invalid)
            setUser(JSON.parse(storedUser));
          } catch (e) { /* ignore parse error */ }

          verifyAndRefreshToken(); // This controls 'loading' state
        } else {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // 2. Listen for Supabase Auth changes (handles OAuth redirects, Token Refreshes, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: Supabase Auth State Change:', event);

      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && session) {
        const appUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          avatar: session.user.user_metadata.avatar_url,
        };
        setUser(appUser);
        setToken(session.access_token);
        localStorage.setItem('auth_token', session.access_token);
        localStorage.setItem('auth_user', JSON.stringify(appUser));
        setLoading(false);

        // Redirect logic for SIGNED_IN only (avoid redirecting on just a refresh)
        if (event === 'SIGNED_IN') {
          const path = window.location.pathname;
          if (path === '/auth/login' || path === '/auth/signup' || path === '/') {
            router.push('/dashboard');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        // Only clear if we actually received a definite sign out event
        // (Sometimes 'initial' is null, don't wipe just yet)
        console.log('AuthContext: Signed out event received.');
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        router.push('/');
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [verifyAndRefreshToken, router]);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string; userNotFound?: boolean }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login response not ok:', response.status, errorText);

        // Try to parse as JSON, fallback to text
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: `Server error: ${response.status}` };
        }

        return {
          success: false,
          error: errorData.error || `Server error: ${response.status}`,
          userNotFound: errorData.userNotFound
        };
      }

      const data = await response.json();

      if (data.user && data.token) {
        setUser(data.user);
        setToken(data.token);

        // Store in localStorage
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));

        return { success: true };
      }

      return {
        success: false,
        error: data.error || 'Login failed',
        userNotFound: data.userNotFound
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      };
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, company?: string): Promise<{ success: boolean; error?: string; userExists?: boolean }> => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, company }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Signup response not ok:', response.status, errorText);

        // Try to parse as JSON, fallback to text
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: `Server error: ${response.status}` };
        }

        return {
          success: false,
          error: errorData.error || `Server error: ${response.status}`,
          userExists: errorData.userExists
        };
      }

      const data = await response.json();

      if (data.user && data.token) {
        setUser(data.user);
        setToken(data.token);

        // Store in localStorage
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));

        return { success: true };
      }

      return {
        success: false,
        error: data.error || 'Signup failed',
        userExists: data.userExists
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      };
    }
  }, []);

  const logout = useCallback(() => {
    console.log('Logout called - clearing authentication data');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
    setToken(null);
    // Only redirect if we're not already on the home page
    if (window.location.pathname !== '/') {
      router.push('/');
    }
  }, [router]);

  const contextValue = useMemo(() => ({
    user,
    token,
    login,
    signup,
    logout,
    loading,
  }), [user, token, login, signup, logout, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}