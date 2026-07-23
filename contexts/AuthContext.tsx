'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AppUser {
  id: string;
  email: string;
  name: string;
  company?: string;
  avatar?: string;
}

interface AppSession {
  access_token: string;
  user: AppUser;
}

interface AuthContextType {
  user: AppUser | null;
  session: AppSession | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, company?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<AppSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const setAuthToken = (token: string | null) => {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem('auth-token', token);
      document.cookie = `auth-token=${token}; path=/; max-age=604800; SameSite=Lax`;
    } else {
      localStorage.removeItem('auth-token');
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  };

  const getStoredToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth-token');
  };

  // Check auth status on mount
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const token = getStoredToken();
        if (!token) {
          if (mounted) setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          if (mounted && data.user) {
            setUser(data.user);
            setSession({ access_token: token, user: data.user });
          } else {
            setAuthToken(null);
          }
        } else {
          setAuthToken(null);
        }
      } catch (err) {
        console.error('Init auth error:', err);
        setAuthToken(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setAuthToken(data.token);
      setUser(data.user);
      setSession({ access_token: data.token, user: data.user });
      router.push('/dashboard');
      return { success: true };
    } catch (err: any) {
      console.error('Sign in exception:', err);
      return { success: false, error: err.message || 'An error occurred during sign in' };
    }
  }, [router]);

  const signUp = useCallback(async (email: string, password: string, name: string, company?: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, company }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Sign up failed' };
      }

      setAuthToken(data.token);
      setUser(data.user);
      setSession({ access_token: data.token, user: data.user });
      router.push('/dashboard');
      return { success: true };
    } catch (err: any) {
      console.error('Sign up exception:', err);
      return { success: false, error: err.message || 'An error occurred during sign up' };
    }
  }, [router]);

  const signOut = useCallback(async () => {
    setAuthToken(null);
    setUser(null);
    setSession(null);
    router.push('/');
  }, [router]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }), [user, session, loading, signUp, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
