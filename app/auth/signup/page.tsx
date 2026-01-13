'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Eye, EyeOff, Loader2, Sparkles, Zap, Shield, Globe, Users, Target } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/database';

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { signup } = useAuth();

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
      const result = await signup(
        formData.email,
        formData.password,
        formData.name,
        formData.company
      );

      if (result.success) {
        toast({
          title: 'Success!',
          description: 'Your account has been created successfully.',
        });
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } else {
        if (result.userExists) {
          toast({
            title: 'Account Already Exists',
            description: result.error || 'An account with this email already exists. Please try logging in instead.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Signup Failed',
            description: result.error || 'Failed to create account. Please try again.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
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
      <div className="flex flex-col justify-center px-4 sm:px-12 md:px-20 lg:px-24 xl:px-32 py-8 relative">
        {/* Background elements - Absolute but contained within relative column */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[10%] right-[10%] w-80 h-80 rounded-full bg-green-500/5 blur-[80px]" />
        </div>

        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6 group">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center green-glow group-hover:scale-105 transition-transform duration-300">
                <FileText className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold text-white group-hover:text-green-400 transition-colors font-cookie">SmartInvoice</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Create an account
            </h1>
            <p className="text-gray-400 text-sm">
              Start managing your business like a pro today.
            </p>
          </div>

          <div className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-gray-200 font-medium text-xs">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-dark h-9 text-sm bg-zinc-900/50 border-zinc-800 focus:border-green-500/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-gray-200 font-medium text-xs">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Acme Inc"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="input-dark h-9 text-sm bg-zinc-900/50 border-zinc-800 focus:border-green-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-gray-200 font-medium text-xs">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input-dark h-9 text-sm bg-zinc-900/50 border-zinc-800 focus:border-green-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-gray-200 font-medium text-xs">Password</Label>
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
                    className="input-dark h-9 text-sm bg-zinc-900/50 border-zinc-800 focus:border-green-500/50 pr-8"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-9 w-9 p-0 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-gray-200 font-medium text-xs">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="input-dark h-9 text-sm bg-zinc-900/50 border-zinc-800 focus:border-green-500/50 pr-8"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-9 w-9 p-0 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-3 h-3" />
                    ) : (
                      <Eye className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Info notice */}
              <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20 flex items-start space-x-2">
                <Zap className="w-3 h-3 text-green-400 mt-0.5 shrink-0" />
                <p className="text-[10px] text-green-200/80">
                  Free forever. No card required.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-10 btn-dark-primary text-sm green-glow"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Get Started
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-4 text-gray-500">Or sign up with</span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full h-10 bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-white hover:text-white transition-all duration-200 text-sm"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
              Sign up with Google
            </Button>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-semibold text-green-500 hover:text-green-400 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Visual */}
      <div className="hidden lg:flex flex-col sticky top-0 h-screen bg-[#050505] p-12 overflow-hidden justify-center items-center border-l border-zinc-900">
        {/* Decorative Gradients */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-lg w-full">
          {/* Visual Grid / Collage */}
          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="space-y-4 pt-12">
              <div className="bg-zinc-900/50 backdrop-blur-xl p-5 rounded-2xl border border-zinc-800 transform hover:-translate-y-1 transition-transform duration-300">
                <Globe className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-white font-medium mb-1">Global Ready</h3>
                <p className="text-xs text-zinc-400">Multi-currency support for international business</p>
              </div>
              <div className="bg-green-500/10 backdrop-blur-xl p-5 rounded-2xl border border-green-500/20 transform hover:-translate-y-1 transition-transform duration-300">
                <Target className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-white font-medium mb-1">Precision</h3>
                <p className="text-xs text-green-200/70">Accurate calculations and tax handling</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-zinc-900/50 backdrop-blur-xl p-5 rounded-2xl border border-zinc-800 transform hover:-translate-y-1 transition-transform duration-300">
                <Users className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-white font-medium mb-1">Collaborate</h3>
                <p className="text-xs text-zinc-400">Manage teams and clients efficiently</p>
              </div>
              <div className="bg-zinc-900/50 backdrop-blur-xl p-5 rounded-2xl border border-zinc-800 transform hover:-translate-y-1 transition-transform duration-300">
                <Shield className="w-8 h-8 text-green-400 mb-3" />
                <h3 className="text-white font-medium mb-1">Secure</h3>
                <p className="text-xs text-zinc-400">Your data is safe with enterprise grade encryption</p>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
              Join a Community Committed to Your Success
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              Access professional tools, build your brand, and manage invoices like a pro.
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center bg-zinc-800`}>
                    <Users className="w-4 h-4 text-gray-500" />
                  </div>
                ))}
              </div>
              <span>Join 10,000+ others today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}