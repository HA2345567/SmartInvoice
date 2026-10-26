'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';

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
    <LuxuryLoader 
      label="Completing secure sign in..." 
      sublabel="SmartInvoice Studio" 
      fullScreen={true} 
    />
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <LuxuryLoader 
          label="Authorizing session..." 
          sublabel="SmartInvoice Studio" 
          fullScreen={true} 
        />
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
