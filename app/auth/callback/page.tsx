'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const redirectTarget = searchParams.get('redirect') || '/dashboard';

    if (token) {
      loginWithToken(token, redirectTarget);
    } else {
      router.replace('/auth/login?error=no_token');
    }
  }, [searchParams, loginWithToken, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#121212' }}>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#1ed760' }} />
        <p className="text-sm font-bold tracking-wide uppercase" style={{ color: '#b3b3b3' }}>
          Completing sign in...
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#121212' }}>
          <Loader2 className="w-10 h-10 animate-spin" style={{ color: '#1ed760' }} />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
