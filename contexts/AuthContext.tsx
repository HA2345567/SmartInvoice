'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/database';
import type { User, Session } from '@supabase/supabase-js';

// Extended user type with profile data
interface AppUser {
  id: string;
  email: string;
  name: string;
  company?: string;
  avatar?: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, company?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user profile from public.users table
  const fetchUserProfile = useCallback(async (authUser: User): Promise<AppUser | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, company, avatar')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      if (data) {
        return {
          id: data.id,
          email: data.email,
          name: data.name || authUser.email?.split('@')[0] || 'User',
          company: data.company,
          avatar: data.avatar,
        };
      }

      // No profile exists - create one
      const newProfile = {
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        company: authUser.user_metadata?.company || null,
      };

      const { error: insertError } = await supabase
        .from('users')
        .insert([newProfile]);

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        // Still return a user object based on auth data
        return {
          id: authUser.id,
          email: authUser.email!,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          company: authUser.user_metadata?.company,
        };
      }

      // Fetch the newly created profile
      const { data: newProfileData } = await supabase
        .from('users')
        .select('id, email, name, company, avatar')
        .eq('id', authUser.id)
        .maybeSingle();

      return newProfileData ? {
        id: newProfileData.id,
        email: newProfileData.email,
        name: newProfileData.name,
        company: newProfileData.company,
        avatar: newProfileData.avatar,
      } : null;
    } catch (err) {
      console.error('Exception fetching user profile:', err);
      return null;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (!mounted) return;

        if (initialSession?.user) {
          setSession(initialSession);
          const profile = await fetchUserProfile(initialSession.user);
          if (mounted && profile) {
            setUser(profile);
          }
        }
      } catch (err) {
        console.error('Init auth error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state change:', event);

      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setSession(null);
        setLoading(false);

        // Redirect to home if on a protected route
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
          router.push('/');
        }
        return;
      }

      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && newSession) {
        setSession(newSession);

        // Fetch profile using async wrapper
        (async () => {
          const profile = await fetchUserProfile(newSession.user);
          if (mounted && profile) {
            setUser(profile);

            // Redirect after successful sign in
            if (event === 'SIGNED_IN') {
              const path = window.location.pathname;
              if (path === '/auth/login' || path === '/auth/signup' || path === '/') {
                router.push('/dashboard');
              }
            }
          }
        })();
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, router]);

  // Sign up with email/password
  const signUp = useCallback(async (
    email: string,
    password: string,
    name: string,
    company?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            company: company || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create profile in public.users
        await supabase.from('users').insert([{
          id: data.user.id,
          email: email.toLowerCase(),
          name,
          company: company || null,
        }]);

        // If email confirmation is disabled, user is immediately signed in
        if (data.session) {
          setSession(data.session);
          const profile: AppUser = {
            id: data.user.id,
            email: email.toLowerCase(),
            name,
            company,
          };
          setUser(profile);
          router.push('/dashboard');
        }

        setLoading(false);
        return { success: true };
      }

      setLoading(false);
      return { success: false, error: 'Failed to create account' };
    } catch (err) {
      setLoading(false);
      console.error('SignUp error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, [router]);

  // Sign in with email/password
  const signIn = useCallback(async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        // Handle specific error messages
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid email or password. Please try again.' };
        }
        return { success: false, error: error.message };
      }

      if (data.user && data.session) {
        setSession(data.session);
        const profile = await fetchUserProfile(data.user);
        if (profile) {
          setUser(profile);
        }
        router.push('/dashboard');
      }

      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      console.error('SignIn error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, [fetchUserProfile, router]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      router.push('/');
    } catch (err) {
      console.error('SignOut error:', err);
    }
  }, [router]);

  const contextValue = useMemo(() => ({
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }), [user, session, loading, signUp, signIn, signOut]);

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
