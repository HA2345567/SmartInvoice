'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <Logo size="lg" className="mb-6" />
      <Loader2 className="w-6 h-6 animate-spin mb-4 text-emerald-400" />
      <p className="text-sm text-gray-400">Completing sign in...</p>
    </div>
  );
}
