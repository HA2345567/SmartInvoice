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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signIn, user, loading } = useAuth();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

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
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2" style={{ background: '#121212' }}>
      {/* Left Column - Form */}
      <div className="flex flex-col justify-center px-4 sm:px-12 md:px-20 lg:px-24 xl:px-32 py-12 relative">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[20%] -right-[20%] w-96 h-96 rounded-full blur-[100px]" style={{ background: 'rgba(30,215,96,0.05)' }} />
          <div className="absolute -bottom-[20%] -left-[20%] w-96 h-96 rounded-full blur-[100px]" style={{ background: 'rgba(30,215,96,0.05)' }} />
        </div>

        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center mb-8">
              <Logo variant="full" size="md" />
            </Link>
            <h1 className="text-3xl font-bold text-white">
              Welcome back
            </h1>
            <p className="text-base" style={{ color: '#b3b3b3' }}>
              Sign in to manage your invoices.
            </p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-white"
                  style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-12 text-white"
                    style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ color: '#b3b3b3' }}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 font-bold text-sm"
                style={{ background: '#1ed760', color: '#000', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '1.4px' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <p className="text-center text-sm" style={{ color: '#b3b3b3' }}>
              Don't have an account?{' '}
              <Link href="/auth/signup" className="font-bold" style={{ color: '#1ed760' }}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Visual */}
      <div className="hidden lg:flex flex-col sticky top-0 h-screen p-12 overflow-hidden justify-center items-center" style={{ background: '#181818', borderLeft: '1px solid #4d4d4d' }}>
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" style={{ background: 'rgba(30,215,96,0.1)' }} />

        {/* Content Container */}
        <div className="relative z-10 max-w-lg w-full">
          {/* Visual Grid */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="space-y-4 pt-8">
              <div className="p-5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: '#1f1f1f' }}>
                <Wallet className="w-8 h-8 mb-3" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-sm mb-1">Track Revenue</h3>
                <p className="text-xs" style={{ color: '#b3b3b3' }}>Monitor your income with analytics</p>
              </div>
              <div className="p-5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: '#1f1f1f' }}>
                <Shield className="w-8 h-8 mb-3" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-sm mb-1">Secure Data</h3>
                <p className="text-xs" style={{ color: '#b3b3b3' }}>Enterprise-grade security</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: '#1f1f1f' }}>
                <PieChart className="w-8 h-8 mb-3" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-sm mb-1">Smart Reports</h3>
                <p className="text-xs" style={{ color: '#b3b3b3' }}>Automated insights</p>
              </div>
              <div className="p-5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: 'rgba(30,215,96,0.1)', border: '1px solid rgba(30,215,96,0.2)' }}>
                <Building2 className="w-8 h-8 mb-3" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-sm mb-1">Client Mgmt</h3>
                <p className="text-xs" style={{ color: '#b3b3b3' }}>Organize efficiently</p>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white mb-4">
              Empower Your Business
            </h2>
            <p className="text-base mb-8" style={{ color: '#b3b3b3' }}>
              Join thousands of professionals who trust SmartInvoice.
            </p>

            <div className="flex items-center space-x-4 text-sm" style={{ color: '#b3b3b3' }}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#1f1f1f', border: '2px solid #121212' }}>
                    <User className="w-4 h-4" style={{ color: '#b3b3b3' }} />
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
