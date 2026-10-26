'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader as Loader2, Wallet, ChartPie as PieChart, Shield, Building2, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Logo, { LogoMarkOnly } from '@/components/Logo';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import GoogleIcon from '@/components/icons/GoogleIcon';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/dashboard';
  const { toast } = useToast();
  const { signIn, user, loading } = useAuth();

  // Check for OAuth errors
  useEffect(() => {
    const err = searchParams.get('error');
    if (err) {
      const messages: Record<string, string> = {
        google_not_configured: 'Google OAuth is not configured yet. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local.',
        invalid_state: 'Security check failed. Please try signing in again.',
        token_exchange_failed: 'Failed to verify with Google. Please try again.',
        oauth_cancelled: 'Google sign-in was cancelled.',
      };
      toast({
        title: 'Authentication notice',
        description: messages[err] || `Authentication error: ${err}`,
        variant: 'destructive',
      });
    }
  }, [searchParams, toast]);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTarget);
    }
  }, [user, loading, router, redirectTarget]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        toast({
          title: 'Success!',
          description: 'Welcome back!',
        });
        router.push(redirectTarget);
      } else {
        toast({
          title: 'Login Failed',
          description: result.error || 'Invalid email or password.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth state
  if (loading) {
    return <LuxuryLoader label="Securing authentication..." sublabel="SmartInvoice Studio" fullScreen={true} />;
  }

  return (
    <div className="min-h-screen lg:h-screen w-full grid lg:grid-cols-2 lg:overflow-hidden" style={{ background: '#121212' }}>
      {/* Left Column - Form */}
      <div className="flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-10 xl:px-16 py-4 sm:py-6 h-full max-h-screen overflow-y-auto relative">
        <div className="w-full max-w-[420px] mx-auto space-y-4 my-auto">
          {/* Back button & Logo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="inline-flex items-center shrink-0">
                <Logo variant="full" size="sm" />
              </Link>
              <Link 
                href="/dashboard/create" 
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-200 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10"
              >
                <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Create Invoice (Guest)</span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white pt-1">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: '#b3b3b3' }}>
              Sign in to access your cloud invoices & tools.
            </p>
          </div>

          <div className="space-y-3.5">
            <a
              href={`/api/auth/google?redirect=${encodeURIComponent(redirectTarget)}`}
              className="w-full h-10 sm:h-11 flex items-center justify-center gap-2.5 px-4 font-bold text-xs sm:text-sm text-white transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: '#1f1f1f',
                border: '1px solid #4d4d4d',
                borderRadius: '9999px',
              }}
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Continue with Google</span>
            </a>

            <div className="relative flex items-center justify-center my-1.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#333333]" />
              </div>
              <div className="relative px-3 text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-[#888888]" style={{ background: '#121212' }}>
                or continue with email
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold" style={{ color: '#b3b3b3' }}>Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 text-xs sm:text-sm text-white"
                  style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold" style={{ color: '#b3b3b3' }}>Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 pr-10 text-xs sm:text-sm text-white"
                    style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: '#b3b3b3' }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-11 font-bold text-xs sm:text-sm mt-1"
                style={{ background: '#1ed760', color: '#000', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '1.2px' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <p className="text-center text-xs sm:text-sm pt-1" style={{ color: '#b3b3b3' }}>
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="font-bold" style={{ color: '#1ed760' }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Visual */}
      <div className="hidden lg:flex flex-col h-full p-6 xl:p-10 overflow-hidden justify-center items-center relative" style={{ background: '#181818', borderLeft: '1px solid #4d4d4d' }}>
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" style={{ background: 'rgba(30,215,96,0.08)' }} />

        {/* Content Container */}
        <div className="relative z-10 max-w-sm w-full">
          {/* Visual Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="space-y-3 pt-3">
              <div className="p-3.5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: '#1f1f1f' }}>
                <Wallet className="w-6 h-6 mb-2" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-xs sm:text-sm mb-0.5">Track Revenue</h3>
                <p className="text-[11px]" style={{ color: '#b3b3b3' }}>Monitor income with analytics</p>
              </div>
              <div className="p-3.5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: '#1f1f1f' }}>
                <Shield className="w-6 h-6 mb-2" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-xs sm:text-sm mb-0.5">Secure Data</h3>
                <p className="text-[11px]" style={{ color: '#b3b3b3' }}>Enterprise-grade security</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: '#1f1f1f' }}>
                <PieChart className="w-6 h-6 mb-2" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-xs sm:text-sm mb-0.5">Smart Reports</h3>
                <p className="text-[11px]" style={{ color: '#b3b3b3' }}>Automated insights</p>
              </div>
              <div className="p-3.5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: 'rgba(30,215,96,0.1)', border: '1px solid rgba(30,215,96,0.2)' }}>
                <Building2 className="w-6 h-6 mb-2" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-xs sm:text-sm mb-0.5">Client Mgmt</h3>
                <p className="text-[11px]" style={{ color: '#b3b3b3' }}>Organize efficiently</p>
              </div>
            </div>
          </div>

          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Empower Your Business
            </h2>
            <p className="text-xs sm:text-sm mb-4" style={{ color: '#b3b3b3' }}>
              Join thousands of professionals who trust SmartInvoice.
            </p>

            <div className="flex items-center space-x-3 text-xs" style={{ color: '#b3b3b3' }}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#1f1f1f', border: '2px solid #121212' }}>
                    <User className="w-3 h-3" style={{ color: '#b3b3b3' }} />
                  </div>
                ))}
              </div>
              <span>Sign in to manage your invoices</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LuxuryLoader label="Securing authentication..." sublabel="SmartInvoice Studio" fullScreen={true} />}>
      <LoginContent />
    </Suspense>
  );
}
