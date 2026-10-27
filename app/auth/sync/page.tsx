'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function SyncContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const error = searchParams.get('error');

        if (token) {
            console.log('Syncing session token...');
            localStorage.setItem('auth_token', token);
            if (refreshToken) localStorage.setItem('auth_refresh_token', refreshToken);

            // Force reload to ensure AuthContext picks it up fresh
            window.location.href = '/dashboard';
        } else if (error) {
            console.error('Auth sync error:', error);
            router.push(`/auth/login?error=${encodeURIComponent(error)}`);
        } else {
            // Fallback: Check if we happen to have a hash fragment (implicit flow fallback)
            // But since we are using route handler exchange, this shouldn't happen unless direct nav.
            const hash = window.location.hash;
            if (hash && hash.includes('access_token')) {
                // Manual parse if needed, but unlikely given our architecture change.
                // Just redirect to login.
                router.push('/auth/login');
            } else {
                router.push('/auth/login');
            }
        }
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                <p className="text-gray-400">Finalizing login...</p>
            </div>
        </div>
    );
}

export default function AuthSyncPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
        }>
            <SyncContent />
        </Suspense>
    );
}
