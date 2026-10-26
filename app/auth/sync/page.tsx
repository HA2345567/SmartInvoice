'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';

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
            const hash = window.location.hash;
            if (hash && hash.includes('access_token')) {
                router.push('/auth/login');
            } else {
                router.push('/auth/login');
            }
        }
    }, [searchParams, router]);

    return (
        <LuxuryLoader 
            label="Finalizing secure session..." 
            sublabel="SmartInvoice Studio" 
            fullScreen={true} 
        />
    );
}

export default function AuthSyncPage() {
    return (
        <Suspense fallback={
            <LuxuryLoader 
                label="Synchronizing credentials..." 
                sublabel="SmartInvoice Studio" 
                fullScreen={true} 
            />
        }>
            <SyncContent />
        </Suspense>
    );
}
