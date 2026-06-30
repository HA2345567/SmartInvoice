import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight, CircleCheck as CheckCircle, Sparkles, Zap, Shield, ChartBar as BarChart3, Star, Award, TrendingUp, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { FeedbackWidget } from '@/components/FeedbackWidget';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">

      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-green-500/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg green-glow">
              <FileText className="w-5 h-5 sm:w-7 sm:h-7 text-black" />
            </div>
            <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent font-cookie">
              SmartInvoice
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-gray-300 hover:text-green-400 hover:bg-green-500/10 font-medium text-sm sm:text-base">
                Login
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-semibold shadow-lg green-glow text-sm sm:text-base">
                Get Started
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 px-4 overflow-hidden">

        {/* Background grid */}
        <div className="absolute inset-0 z-0" style={{
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px'
        }} />

        {/* Radial green glow center */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '900px',
            height: '600px',
            background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.12) 0%, rgba(16,185,129,0.06) 40%, transparent 70%)',
            borderRadius: '50%'
          }} />
        </div>

        {/* Top-left glow accent */}
        <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none z-0" style={{
          background: 'radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)'
        }} />

        {/* Bottom-right glow accent */}
        <div className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none z-0" style={{
          background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)'
        }} />

        {/* Horizontal scan lines for depth */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-green-500/20 to-transparent z-0" />
        <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-green-500/10 to-transparent z-0" />
        <div className="absolute inset-x-0 top-2/3 h-px bg-gradient-to-r from-transparent via-green-500/10 to-transparent z-0" />

        {/* Corner accent lines */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-green-500/30 z-0" />
        <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-green-500/30 z-0" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-green-500/30 z-0" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-green-500/30 z-0" />

        {/* Floating orbs */}
        <div className="absolute top-24 left-[10%] w-3 h-3 rounded-full bg-green-400/40 blur-[2px] z-0" />
        <div className="absolute top-40 right-[15%] w-2 h-2 rounded-full bg-green-500/50 z-0" />
        <div className="absolute bottom-32 left-[20%] w-2 h-2 rounded-full bg-green-400/30 z-0" />
        <div className="absolute bottom-20 right-[25%] w-3 h-3 rounded-full bg-green-500/40 blur-[2px] z-0" />

        <div className="container mx-auto text-center relative z-10 max-w-5xl">
          {/* Premium badge */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-green-500/8 border border-green-500/25 rounded-full backdrop-blur-sm" style={{ background: 'rgba(34,197,94,0.06)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <Award className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400 font-medium text-sm tracking-wide">Professional Invoice Management</span>
              <Star className="w-3.5 h-3.5 text-green-400" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in leading-[1.05] tracking-tight">
            Transform Your Business
            <br />
            <span className="relative">
              <span className="bg-gradient-to-r from-green-300 via-green-400 to-emerald-500 bg-clip-text text-transparent">
                with Smart Invoicing
              </span>
              {/* Underline glow */}
              <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 mb-10 sm:mb-12 max-w-2xl mx-auto animate-fade-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Create stunning invoices, automate payments, and grow your business with our
            AI-powered platform trusted by thousands of professionals worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link href="/auth/signup">
              <Button size="lg" className="group relative w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-black font-bold text-base px-10 py-4 shadow-2xl transition-all duration-300 overflow-hidden" style={{ boxShadow: '0 0 40px rgba(34,197,94,0.3), 0 0 80px rgba(34,197,94,0.1)' }}>
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="ghost" className="w-full sm:w-auto border border-green-500/20 hover:border-green-500/40 hover:bg-green-500/5 text-gray-300 hover:text-green-300 font-medium text-base px-10 py-4 transition-all duration-300">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 sm:mt-20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <p className="text-gray-600 text-xs uppercase tracking-widest mb-8 font-medium">Trusted by businesses worldwide</p>
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto">
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-green-500/10 bg-green-500/3" style={{ background: 'rgba(34,197,94,0.02)' }}>
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-bold text-lg">4.9/5</span>
                <span className="text-gray-500 text-xs">Rating</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-green-500/10 bg-green-500/3" style={{ background: 'rgba(34,197,94,0.02)' }}>
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-white font-bold text-lg">Bank</span>
                <span className="text-gray-500 text-xs">Level Security</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-green-500/10 bg-green-500/3" style={{ background: 'rgba(34,197,94,0.02)' }}>
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-white font-bold text-lg">99.9%</span>
                <span className="text-gray-500 text-xs">Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Updated with Green Theme */}
      <section className="py-16 sm:py-20 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything You Need to Succeed</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Comprehensive invoicing solution with intelligent features designed for modern businesses
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Card className="bg-green-900/20 border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm group hover:bg-green-900/30">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-green-500/30">
                  <FileText className="w-8 h-8 text-green-400" />
                </div>
                <CardTitle className="text-xl text-white text-center">Smart Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-green-muted text-center">
                  AI-powered templates that adapt to your business needs with professional designs and automatic calculations
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-green-900/20 border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm group hover:bg-green-900/30">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-green-500/30">
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
                <CardTitle className="text-xl text-white text-center">Auto Calculations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-green-muted text-center">
                  Intelligent tax calculations with GST, VAT, and multi-currency support for global businesses
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-green-900/20 border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm group hover:bg-green-900/30">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-green-500/30">
                  <Zap className="w-8 h-8 text-green-400" />
                </div>
                <CardTitle className="text-xl text-white text-center">Instant Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-green-muted text-center">
                  Integrated payment links with real-time tracking and automated follow-ups for faster payments
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-green-900/20 border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:transform hover:scale-105 backdrop-blur-sm group hover:bg-green-900/30">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 border border-green-500/30">
                  <BarChart3 className="w-8 h-8 text-green-400" />
                </div>
                <CardTitle className="text-xl text-white text-center">Smart Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-green-muted text-center">
                  Advanced insights and reporting to optimize your business performance and cash flow
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section - Updated with Green Theme */}
      <section className="py-16 sm:py-20 px-4 relative">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Loved by Professionals Worldwide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-green-900/20 border-green-500/30 p-6 backdrop-blur-sm hover:bg-green-900/30 transition-all duration-300">
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "SmartInvoice transformed our billing process. We're getting paid 40% faster!"
              </p>
              <div className="text-white font-medium">Sarah Johnson</div>
              <div className="text-green-muted text-sm">Freelance Designer</div>
            </Card>

            <Card className="bg-green-900/20 border-green-500/30 p-6 backdrop-blur-sm hover:bg-green-900/30 transition-all duration-300">
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "The AI suggestions save me hours every week. Absolutely game-changing!"
              </p>
              <div className="text-white font-medium">Michael Chen</div>
              <div className="text-green-muted text-sm">Marketing Agency</div>
            </Card>

            <Card className="bg-green-900/20 border-green-500/30 p-6 backdrop-blur-sm hover:bg-green-900/30 transition-all duration-300">
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-4">
                "Professional, reliable, and incredibly easy to use. Highly recommended!"
              </p>
              <div className="text-white font-medium">Emma Rodriguez</div>
              <div className="text-green-muted text-sm">Consulting Firm</div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - Updated with Green Theme */}
      <section className="py-16 sm:py-20 px-4 relative">
        <div className="container mx-auto text-center max-w-4xl">
          <Card className="bg-gradient-to-br from-green-900/30 to-black/90 border-green-500/30 p-8 sm:p-12 backdrop-blur-sm shadow-2xl hover:border-green-400/50 transition-all duration-300">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of professionals who've streamlined their invoicing and accelerated their growth
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-black font-bold text-lg px-8 py-4 shadow-2xl green-glow">
                  <Sparkles className="mr-2 w-5 h-5" />
                  Start Free Trial
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 text-sm text-gray-400">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-black via-green-950/60 to-black relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Choose the plan that fits your business. No hidden fees. Cancel anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="bg-green-900/20 border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm group">
              <CardHeader className="pb-4 text-center">
                <CardTitle className="text-2xl text-white mb-2">Free</CardTitle>
                <div className="text-4xl font-bold text-green-400 mb-2">$0</div>
                <CardDescription className="text-green-muted">For individuals and freelancers just getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-green-muted space-y-3 mb-6">
                  <li>✔️ Unlimited invoices</li>
                  <li>✔️ 3 clients</li>
                  <li>✔️ Basic analytics</li>
                  <li>✔️ Email support</li>
                </ul>
                <Link href="/auth/signup">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-black font-bold">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
            {/* Pro Plan */}
            <Card className="bg-gradient-to-br from-green-600/80 to-green-800/80 border-green-500/50 shadow-2xl scale-105 group">
              <CardHeader className="pb-4 text-center">
                <CardTitle className="text-2xl text-white mb-2 flex items-center justify-center gap-2">Pro <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-400/30 ml-2">Most Popular</Badge></CardTitle>
                <div className="text-4xl font-bold text-yellow-400 mb-2">₹299<span className="text-lg text-gray-300 font-normal">/mo</span></div>
                <CardDescription className="text-green-muted">For growing businesses that need more power</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-green-muted space-y-3 mb-6">
                  <li>✔️ Unlimited invoices & clients</li>
                  <li>✔️ Advanced analytics & reports</li>
                  <li>✔️ Payment reminders & automation</li>
                  <li>✔️ Priority email support</li>
                </ul>
                <Link href="/auth/signup">
                  <Button className="w-full bg-yellow-400 text-black font-bold hover:bg-yellow-500">Start Pro Trial</Button>
                </Link>
              </CardContent>
            </Card>
            {/* Business Plan */}
            <Card className="bg-green-900/20 border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm group">
              <CardHeader className="pb-4 text-center">
                <CardTitle className="text-2xl text-white mb-2">Business</CardTitle>
                <div className="text-4xl font-bold text-green-400 mb-2">₹999<span className="text-lg text-gray-300 font-normal">/mo</span></div>
                <CardDescription className="text-green-muted">For teams and enterprises with advanced needs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-green-muted space-y-3 mb-6">
                  <li>✔️ Everything in Pro</li>
                  <li>✔️ Team management</li>
                  <li>✔️ Custom branding</li>
                  <li>✔️ Dedicated support</li>
                </ul>
                <Link href="/auth/signup">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-black font-bold">Contact Sales</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-green-900/20 border-t border-green-500/30 text-white py-12 px-4 backdrop-blur-sm">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-black" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent font-cookie">
              SmartInvoice
            </span>
          </div>
          <p className="text-gray-400 mb-8 text-lg">
            Professional invoice management for the modern business
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 mb-8">
            <a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-green-400 transition-colors">Support</a>
            <a href="#" className="hover:text-green-400 transition-colors">API Documentation</a>
            <a href="#" className="hover:text-green-400 transition-colors">Contact</a>
          </div>
          <div className="pt-8 border-t border-green-500/30">
            <p className="text-gray-400 text-sm">
              © 2024 SmartInvoice &nbsp;|&nbsp; Cofounder & CEO: Harsh Bhardwaj
            </p>
          </div>
        </div>
      </footer>

      {/* Feedback Widget */}
      <FeedbackWidget />
    </div>
  );
}