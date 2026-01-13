'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/database';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
    const router = useRouter();
    const [debugStatus, setDebugStatus] = useState('Initializing authentication...');

    useEffect(() => {
        const handleAuthCallback = async () => {
            setDebugStatus('Verifying URL parameters...');
            // Use window.location instead of useSearchParams to avoid Next.js caching/router issues
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');
            const error = params.get('error');
            const errorDesc = params.get('error_description');

            if (error) {
                console.error('Auth Error:', error, errorDesc);
                setDebugStatus(`Login failed: ${errorDesc || error}`);
                setTimeout(() => router.push('/auth/login'), 4000);
                return;
            }

            setDebugStatus('Checking session status...');

            // 1. Check if we already have a session (e.g., from immediate auto-restore)
            const { data: { session: existingSession } } = await supabase.auth.getSession();
            if (existingSession) {
                console.log('Existing session found.');
                finalizeLogin(existingSession);
                return;
            }

            // 2. Set up a listener for immediate updates
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
                console.log('Auth State Change:', event);
                if (event === 'SIGNED_IN' && session) {
                    finalizeLogin(session);
                }
            });

            // 3. If we have a code but no session yet, attempt manual exchange if auto-detect is slow
            if (code) {
                setDebugStatus('Exchanging authentication code...');
                try {
                    // Try to exchange code manually if Supabase auto-detect doesn't fire quickly
                    // The library usually handles this, but explicit call ensures it happens.
                    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

                    if (data.session) {
                        finalizeLogin(data.session);
                        return; // Done
                    }

                    if (exchangeError) {
                        console.warn('Manual exchange warning:', exchangeError.message);
                        // Don't fail immediately, let the listener checking continue for a moment
                    }
                } catch (err) {
                    console.error('Exchange error:', err);
                }
            } else {
                // 4. Check for Hash Fragment (Implicit Flow / PKCE fallback)
                const hash = window.location.hash;
                if (hash && hash.includes('access_token')) {
                    setDebugStatus('Processing authentication tokens...');
                    try {
                        // Parse the hash manually
                        const hashParams = new URLSearchParams(hash.substring(1)); // remove the #
                        const accessToken = hashParams.get('access_token');
                        const refreshToken = hashParams.get('refresh_token');
                        const type = hashParams.get('type');
                        const errorCode = hashParams.get('error');
                        const errorDescription = hashParams.get('error_description');

                        if (errorCode) {
                            console.error('Hash Auth Error:', errorCode, errorDescription);
                            setDebugStatus(`Login failed: ${errorDescription || errorCode}`);
                            setTimeout(() => router.push('/auth/login'), 4000);
                            return;
                        }

                        if (accessToken) {
                            // Initialize Supabase session with these tokens
                            const { data, error: sessionError } = await supabase.auth.setSession({
                                access_token: accessToken,
                                refresh_token: refreshToken || '',
                            });

                            if (sessionError) {
                                console.error('Set Session Error:', sessionError);
                                setDebugStatus('Failed to recover session from URL.');
                            } else if (data.session) {
                                console.log('Session manually set from hash.');
                                finalizeLogin(data.session);
                                return;
                            }
                        }
                    } catch (parseError) {
                        console.error('Error parsing hash:', parseError);
                    }
                } else if (!existingSession) {
                    // No code, no session, no hash.
                    console.log('No authentication credential found.');
                    setDebugStatus('No authentication credential found.');
                    setTimeout(() => router.push('/auth/login'), 2000);
                    return;
                }
            }

            return () => {
                subscription.unsubscribe();
            };
        };

        const finalizeLogin = (session: any) => {
            setDebugStatus('Login successful. Taking you to dashboard...');

            // 4. Sync session to localStorage for the application's AuthContext
            localStorage.setItem('auth_token', session.access_token);

            const appUser = {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata.full_name || session.user.email?.split('@')[0],
                avatar: session.user.user_metadata.avatar_url,
            };
            localStorage.setItem('auth_user', JSON.stringify(appUser));

            // 5. Force redirect to dashboard
            window.location.href = '/dashboard';
        };

        handleAuthCallback();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
                <p className="text-gray-400">{debugStatus}</p>
            </div>
        </div>
    );
}
