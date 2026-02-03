'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Eye, EyeOff, Loader2, Sparkles, Building2, User, Globe, ArrowRight, Wallet, PieChart, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/database';
import { AltchaWidget } from '@/components/security/AltchaWidget';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login, user } = useAuth();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

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
      const result = await login(email, password);

      if (result.success) {
        toast({
          title: 'Success!',
          description: 'You have been logged in successfully.',
        });
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
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
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

    } catch (error: any) {
      toast({
        title: 'Google Login Failed',
        description: error.message,
        variant: 'destructive',
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-black">
      {/* Left Column - Form */}
      <div className="flex flex-col justify-center px-4 sm:px-12 md:px-20 lg:px-24 xl:px-32 py-12 relative">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[20%] -right-[20%] w-96 h-96 rounded-full bg-green-500/5 blur-[100px]" />
          <div className="absolute -bottom-[20%] -left-[20%] w-96 h-96 rounded-full bg-green-500/5 blur-[100px]" />
        </div>

        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center space-x-2 mb-8 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center green-glow group-hover:scale-105 transition-transform duration-300">
                <FileText className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors font-cookie">SmartInvoice</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-gray-400 text-lg">
              Manage your invoices with ease and professionalism.
            </p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-200 font-medium">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-dark h-12 bg-zinc-900/50 border-zinc-800 focus:border-green-500/50"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-200 font-medium">Password</Label>
                  <Link href="/auth/reset-password" className="text-sm font-medium text-green-500 hover:text-green-400">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-dark h-12 bg-zinc-900/50 border-zinc-800 focus:border-green-500/50 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <AltchaWidget />

              <Button
                type="submit"
                className="w-full h-12 btn-dark-primary text-base green-glow"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in with Email
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-4 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full h-12 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white hover:text-white transition-all duration-200"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Sign in with Google
            </Button>

            <p className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="font-semibold text-green-500 hover:text-green-400 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Visual */}
      <div className="hidden lg:flex flex-col sticky top-0 h-screen bg-[#050505] p-12 overflow-hidden justify-center items-center border-l border-zinc-900">
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-lg w-full">
          {/* Visual Grid / Collage */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="space-y-4 pt-8">
              <div className="bg-zinc-900/50 backdrop-blur-xl p-5 rounded-2xl border border-zinc-800 transform hover:-translate-y-1 transition-transform duration-300">
                <Wallet className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-white font-medium mb-1">Track Revenue</h3>
                <p className="text-xs text-zinc-400">Monitor your income with detailed analytics</p>
              </div>
              <div className="bg-zinc-900/50 backdrop-blur-xl p-5 rounded-2xl border border-zinc-800 transform hover:-translate-y-1 transition-transform duration-300">
                <Shield className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-white font-medium mb-1">Secure Data</h3>
                <p className="text-xs text-zinc-400">Enterprise-grade security for your business</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-zinc-900/50 backdrop-blur-xl p-5 rounded-2xl border border-zinc-800 transform hover:-translate-y-1 transition-transform duration-300">
                <PieChart className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-white font-medium mb-1">Smart Reports</h3>
                <p className="text-xs text-zinc-400">Automated reporting and insights</p>
              </div>
              <div className="bg-green-500/10 backdrop-blur-xl p-5 rounded-2xl border border-green-500/20 transform hover:-translate-y-1 transition-transform duration-300">
                <Building2 className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-white font-medium mb-1">Client Mgmt</h3>
                <p className="text-xs text-green-200/70">Organize client data efficiently</p>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Empower Your Business with Smart Financial Tools
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Join thousands of freelancers and businesses who trust SmartInvoice for their billing needs.
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center bg-zinc-800`}>
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                ))}
              </div>
              <span>Trusted by 10,000+ users</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}