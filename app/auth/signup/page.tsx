'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader as Loader2, Zap, Globe, Users, Shield, Target } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Logo from '@/components/Logo';

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

    if (!formData.name || !formData.email || !formData.password) {
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
    <div className="min-h-screen w-full grid lg:grid-cols-2" style={{ background: '#121212' }}>
      {/* Left Column - Form */}
      <div className="flex flex-col justify-center px-4 sm:px-12 md:px-20 lg:px-24 xl:px-32 py-8 relative">
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center mb-6">
              <Logo variant="full" size="md" />
            </Link>
            <h1 className="text-3xl font-bold text-white">
              Create an account
            </h1>
            <p className="text-base" style={{ color: '#b3b3b3' }}>
              Start managing invoices like a pro.
            </p>
          </div>

          <div className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold" style={{ color: '#b3b3b3' }}>Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="h-10 text-white"
                    style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-xs font-bold" style={{ color: '#b3b3b3' }}>Company</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Acme Inc"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="h-10 text-white"
                    style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold" style={{ color: '#b3b3b3' }}>Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-10 text-white"
                  style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold" style={{ color: '#b3b3b3' }}>Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className="h-10 pr-10 text-white"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-bold" style={{ color: '#b3b3b3' }}>Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="h-10 pr-10 text-white"
                    style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ color: '#b3b3b3' }}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Info notice */}
              <div className="p-3 rounded-lg flex items-center gap-2" style={{ background: 'rgba(30,215,96,0.1)', border: '1px solid rgba(30,215,96,0.2)' }}>
                <Zap className="w-4 h-4 shrink-0" style={{ color: '#1ed760' }} />
                <p className="text-xs" style={{ color: '#b3b3b3' }}>
                  Free forever. No card required.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 font-bold text-sm"
                style={{ background: '#1ed760', color: '#000', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '1.4px' }}
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

            <p className="text-center text-sm" style={{ color: '#b3b3b3' }}>
              Already have an account?{' '}
              <Link href="/auth/login" className="font-bold" style={{ color: '#1ed760' }}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Visual */}
      <div className="hidden lg:flex flex-col sticky top-0 h-screen p-12 overflow-hidden justify-center items-center" style={{ background: '#181818', borderLeft: '1px solid #4d4d4d' }}>
        {/* Decorative Gradient */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" style={{ background: 'rgba(30,215,96,0.1)' }} />

        {/* Content Container */}
        <div className="relative z-10 max-w-lg w-full">
          {/* Visual Grid */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="space-y-4 pt-12">
              <div className="p-5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: '#1f1f1f' }}>
                <Globe className="w-8 h-8 mb-3" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-sm mb-1">Global Ready</h3>
                <p className="text-xs" style={{ color: '#b3b3b3' }}>Multi-currency support</p>
              </div>
              <div className="p-5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: 'rgba(30,215,96,0.1)', border: '1px solid rgba(30,215,96,0.2)' }}>
                <Target className="w-8 h-8 mb-3" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-sm mb-1">Precision</h3>
                <p className="text-xs" style={{ color: '#b3b3b3' }}>Accurate calculations</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: '#1f1f1f' }}>
                <Users className="w-8 h-8 mb-3" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-sm mb-1">Collaborate</h3>
                <p className="text-xs" style={{ color: '#b3b3b3' }}>Manage teams easily</p>
              </div>
              <div className="p-5 rounded-lg transition-transform hover:scale-[1.02]" style={{ background: '#1f1f1f' }}>
                <Shield className="w-8 h-8 mb-3" style={{ color: '#1ed760' }} />
                <h3 className="text-white font-bold text-sm mb-1">Secure</h3>
                <p className="text-xs" style={{ color: '#b3b3b3' }}>Enterprise encryption</p>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-white mb-4">
              Join 10,000+ Professionals
            </h2>
            <p className="text-base mb-8" style={{ color: '#b3b3b3' }}>
              Access professional tools and manage invoices like a pro.
            </p>

            <div className="flex items-center space-x-4 text-sm" style={{ color: '#b3b3b3' }}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#1f1f1f', border: '2px solid #121212' }}>
                    <Users className="w-4 h-4" style={{ color: '#b3b3b3' }} />
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
