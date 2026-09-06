'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader as Loader2, Zap, Globe, Users, Shield, Target, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';
import GoogleIcon from '@/components/icons/GoogleIcon';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signUp, user, loading } = useAuth();

  // Auto-redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.company || undefined
      );

      if (result.success) {
        toast({
          title: 'Success!',
          description: 'Your account has been created.',
        });
      } else {
        toast({
          title: 'Signup Failed',
          description: result.error || 'Failed to create account.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#121212' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#1ed760' }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen w-full grid lg:grid-cols-2 lg:overflow-hidden" style={{ background: '#121212' }}>
      {/* Left Column - Form */}
      <div className="flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-10 xl:px-16 py-4 sm:py-6 h-full max-h-screen overflow-y-auto relative">
        <div className="w-full max-w-sm mx-auto space-y-3.5 my-auto">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Link href="/" className="inline-flex items-center">
                <Logo variant="full" size="md" />
              </Link>
              <Link 
                href="/dashboard/create" 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Create Invoice (Guest)</span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white pt-1">
              Create an account
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: '#b3b3b3' }}>
              Start managing invoices like a pro.
            </p>
          </div>

          <div className="space-y-3">
            <a
              href="/api/auth/google?redirect=/dashboard"
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

            <div className="relative flex items-center justify-center my-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#333333]" />
              </div>
              <div className="relative px-3 text-[10px] sm:text-xs uppercase tracking-widest font-semibold text-[#888888]" style={{ background: '#121212' }}>
                or sign up with email
              </div>
            </div>

            <form onSubmit={handleSignup} className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-bold" style={{ color: '#b3b3b3' }}>Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-9 sm:h-10 text-xs sm:text-sm text-white"
                    style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="company" className="text-xs font-bold" style={{ color: '#b3b3b3' }}>Company</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Acme Inc"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="h-9 sm:h-10 text-xs sm:text-sm text-white"
                    style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-bold" style={{ color: '#b3b3b3' }}>Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-9 sm:h-10 text-xs sm:text-sm text-white"
                  style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-xs font-bold" style={{ color: '#b3b3b3' }}>Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 6 chars"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={6}
                      className="h-9 sm:h-10 pr-9 text-xs sm:text-sm text-white"
                      style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                    />
                    <button
                      type="button"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ color: '#b3b3b3' }}
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmPassword" className="text-xs font-bold" style={{ color: '#b3b3b3' }}>Confirm</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repeat"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="h-9 sm:h-10 pr-9 text-xs sm:text-sm text-white"
                      style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                    />
                    <button
                      type="button"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ color: '#b3b3b3' }}
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Info notice */}
              <div className="py-2 px-3 rounded-lg flex items-center gap-2" style={{ background: 'rgba(30,215,96,0.08)', border: '1px solid rgba(30,215,96,0.15)' }}>
                <Zap className="w-3.5 h-3.5 shrink-0" style={{ color: '#1ed760' }} />
                <p className="text-[11px]" style={{ color: '#b3b3b3' }}>
                  Free forever. No credit card required.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-10 sm:h-11 font-bold text-xs sm:text-sm"
                style={{ background: '#1ed760', color: '#000', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '1.2px' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Get Started'
                )}
              </Button>
            </form>

            <p className="text-center text-xs sm:text-sm pt-0.5" style={{ color: '#b3b3b3' }}>
              Already have an account?{' '}
              <Link href="/auth/login" className="font-bold" style={{ color: '#1ed760' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Visual */}
      <div className="hidden lg:flex flex-col h-full p-6 xl:p-10 overflow-hidden justify-center items-center relative" style={{ background: '#181818', borderLeft: '1px solid #4d4d4d' }}>
        {/* Decorative Gradient */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" style={{ background: 'rgba(30,215,96,0.08)' }} />

        {/* Content Container */}
        <div className="relative z-10 max-w-sm w-full">
          {/* Visual Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="space-y-3 pt-3">
              <div className="p-3.5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: '#1f1f1f' }}>
                <Globe className="w-6 h-6 mb-2" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-xs sm:text-sm mb-0.5">Global Ready</h3>
                <p className="text-[11px]" style={{ color: '#b3b3b3' }}>Multi-currency support</p>
              </div>
              <div className="p-3.5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: 'rgba(30,215,96,0.1)', border: '1px solid rgba(30,215,96,0.2)' }}>
                <Target className="w-6 h-6 mb-2" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-xs sm:text-sm mb-0.5">Precision</h3>
                <p className="text-[11px]" style={{ color: '#b3b3b3' }}>Accurate calculations</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: '#1f1f1f' }}>
                <Users className="w-6 h-6 mb-2" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-xs sm:text-sm mb-0.5">Collaborate</h3>
                <p className="text-[11px]" style={{ color: '#b3b3b3' }}>Manage teams easily</p>
              </div>
              <div className="p-3.5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: '#1f1f1f' }}>
                <Shield className="w-6 h-6 mb-2" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-xs sm:text-sm mb-0.5">Secure</h3>
                <p className="text-[11px]" style={{ color: '#b3b3b3' }}>Enterprise encryption</p>
              </div>
            </div>
          </div>

          <div className="text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Join 10,000+ Professionals
            </h2>
            <p className="text-xs sm:text-sm mb-4" style={{ color: '#b3b3b3' }}>
              Access professional tools and manage invoices like a pro.
            </p>

            <div className="flex items-center space-x-3 text-xs" style={{ color: '#b3b3b3' }}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: '#1f1f1f', border: '2px solid #121212' }}>
                    <Users className="w-3 h-3" style={{ color: '#b3b3b3' }} />
                  </div>
                ))}
              </div>
              <span>Join today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
