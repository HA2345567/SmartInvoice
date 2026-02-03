'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/database';
import { Loader2 } from 'lucide-react';

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
                        // If exchange failed, check if we have a session anyway (e.g. race condition/already handled)
                        const { data: { session } } = await supabase.auth.getSession();
                        if (session) {
                            finalizeLogin(session);
                            return;
                        }
                        throw exchangeError;
                    }
                    if (data.session) {
                        finalizeLogin(data.session);
                        return;
                    }
                }

                // Check for existing session if no code or falling through
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    finalizeLogin(session);
                } else {
                    // No code and no session
                    router.push('/auth/login');
                }
            } catch (error) {
                console.error('Auth Process Error:', error);
                router.push('/auth/login');
            }
        };

        const finalizeLogin = (session: any) => {
            // Sync to localStorage for application state
            if (session.access_token) {
                localStorage.setItem('auth_token', session.access_token);
            }

            if (session.user) {
                const appUser = {
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
                    avatar: session.user.user_metadata?.avatar_url,
                };
                localStorage.setItem('auth_user', JSON.stringify(appUser));
            }

            // Redirect to dashboard
            window.location.href = '/dashboard';
        };

        handleAuthCallback();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                <p className="text-gray-400">Verifying...</p>
            </div>
        </div>
    );
}
