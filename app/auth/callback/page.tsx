'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/database';
import { Loader as Loader2 } from 'lucide-react';
import LogoMarkOnly from '@/components/Logo';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');

        if (error) {
          console.error('Auth Callback Error:', error, params.get('error_description'));
          router.push('/auth/login');
          return;
        }

        if (code) {
          // Exchange code for session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('Exchange error:', exchangeError);
            // If exchange failed, check if we have a session anyway
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
              router.push('/dashboard');
              return;
            }
            throw exchangeError;
          }
          if (data.session) {
            router.push('/dashboard');
            return;
          }
        }

        // Check for existing session if no code
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push('/dashboard');
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error('Auth Process Error:', error);
        router.push('/auth/login');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#121212' }}>
      <LogoMarkOnly size={64} className="mb-6" />
      <Loader2 className="w-6 h-6 animate-spin mb-4" style={{ color: '#1ed760' }} />
      <p className="text-sm" style={{ color: '#b3b3b3' }}>Completing sign in...</p>
    </div>
  );
}
