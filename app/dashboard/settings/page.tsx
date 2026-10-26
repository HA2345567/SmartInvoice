'use client';

import { useState, useEffect } from 'react';
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Save,
  Building,
  Mail,
  Bell,
  CreditCard,
  Shield,
  Sparkles,
  Zap,
  Settings as SettingsIcon,
  User,
  Globe,
  Loader as Loader2,
  CircleCheck as CheckCircle,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Settings {
  name: string;
  company: string;
  phone: string;
  address: string;
  gstNumber: string;
  currency: string;
  invoicePrefix: string;
  defaultTerms: string;
  defaultNotes: string;
  defaultGstRate: number;
  defaultTaxRate: number;
  emailNotifications: boolean;
  reminderEmails: boolean;
  reminderDays: number;
  autoGenerateNumbers: boolean;
  aiProvider: string;
  aiApiKey: string;
  aiModel: string;
  aiBaseUrl: string;
  avatar?: string;
}

const defaultSettings: Settings = {
  name: '',
  company: '',
  phone: '',
  address: '',
  gstNumber: '',
  currency: 'USD',
  invoicePrefix: 'INV',
  defaultTerms: 'Payment due within 30 days',
  defaultNotes: 'Thank you for your business!',
  defaultGstRate: 18,
  defaultTaxRate: 0,
  emailNotifications: true,
  reminderEmails: true,
  reminderDays: 7,
  autoGenerateNumbers: true,
  aiProvider: 'gemini',
  aiApiKey: '',
  aiModel: 'gemini-2.0-flash',
  aiBaseUrl: '',
  avatar: '',
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { user, session, refreshUser } = useAuth();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [testingAi, setTestingAi] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, [session]);

  const fetchSettings = async () => {
    const token = session?.access_token || (typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null);
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings({
          name: data.name || '',
          company: data.company || '',
          phone: data.phone || '',
          address: data.address || '',
          gstNumber: data.gstNumber || '',
          currency: data.currency || 'USD',
          invoicePrefix: data.invoicePrefix || 'INV',
          defaultTerms: data.defaultTerms || 'Payment due within 30 days',
          defaultNotes: data.defaultNotes || 'Thank you for your business!',
          defaultGstRate: data.defaultGstRate ?? 18,
          defaultTaxRate: data.defaultTaxRate ?? 0,
          emailNotifications: data.emailNotifications ?? true,
          reminderEmails: data.reminderEmails ?? true,
          reminderDays: data.reminderDays || 7,
          autoGenerateNumbers: data.autoGenerateNumbers ?? true,
          aiProvider: data.aiProvider || 'gemini',
          aiApiKey: data.aiApiKey || '',
          aiModel: data.aiModel || 'gemini-2.0-flash',
          aiBaseUrl: data.aiBaseUrl || '',
          avatar: data.avatar || '',
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = session?.access_token || (typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null);
    if (!token) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to save your settings.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (response.ok) {
        await refreshUser();
        toast({
          title: 'Settings Saved',
          description: 'Your settings have been updated successfully across your account.',
        });
      } else {
        throw new Error(data.details || data.error || 'Failed to save settings');
      }
    } catch (error: any) {
      toast({
        title: 'Error Saving Settings',
        description: error.message || 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Settings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Logo file size must be less than 2MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = session?.access_token;
      const res = await fetch('/api/upload/logo', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        handleInputChange('avatar', data.url);
        toast({
          title: 'Logo Uploaded',
          description: 'Company logo uploaded successfully. Save changes to apply.',
        });
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to upload logo');
      }
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message || 'Could not upload logo',
        variant: 'destructive',
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleTestAiKey = async () => {
    if (!settings.aiApiKey) {
      toast({
        title: 'Missing API Key',
        description: 'Please enter an API key first before testing connection.',
        variant: 'destructive',
      });
      return;
    }

    setTestingAi(true);
    try {
      const token = session?.access_token || localStorage.getItem('auth-token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: 'Thank you for your business!',
          mode: 'formal',
          provider: settings.aiProvider,
          apiKey: settings.aiApiKey.trim(),
          model: settings.aiModel.trim(),
          baseUrl: settings.aiBaseUrl.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: 'AI Connection Verified',
          description: `Successfully connected to ${settings.aiProvider.toUpperCase()} (${settings.aiModel || 'default'}).`,
        });
      } else {
        throw new Error(data.details || data.error || 'Failed to verify AI provider connection');
      }
    } catch (error: any) {
      toast({
        title: 'AI Connection Failed',
        description: error.message || 'Verification failed. Please check your API key and provider settings.',
        variant: 'destructive',
      });
    } finally {
      setTestingAi(false);
    }
  };

  if (loading) {
    return <LuxuryLoader label="Loading settings..." sublabel="Account & Preferences" minHeight="min-h-[400px]" />;
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white">System Settings</h1>
          <p className="text-xs text-white/40 mt-1">
            Configure entity profile, default invoice parameters, automated notifications, and AI providers
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-[#1ed760] text-black hover:bg-[#1fdf64] text-xs font-medium h-9 px-5 inline-flex items-center gap-2 shadow-sm transition-transform active:scale-[0.98]"
        >
          {saving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto bg-[#181818] p-1 rounded-full border border-white/[0.08]">
          <TabsTrigger value="profile" className="rounded-full data-[state=active]:bg-[#242424] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/10 text-xs py-2 text-white/60">
            <User className="w-3.5 h-3.5 mr-1.5" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="rounded-full data-[state=active]:bg-[#242424] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/10 text-xs py-2 text-white/60">
            <Building className="w-3.5 h-3.5 mr-1.5" />
            <span>Business</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="rounded-full data-[state=active]:bg-[#242424] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/10 text-xs py-2 text-white/60">
            <SettingsIcon className="w-3.5 h-3.5 mr-1.5" />
            <span>Invoices</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-full data-[state=active]:bg-[#242424] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/10 text-xs py-2 text-white/60">
            <Bell className="w-3.5 h-3.5 mr-1.5" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="rounded-full data-[state=active]:bg-[#242424] data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-white/10 text-xs py-2 text-white/60">
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#1ed760]" />
            <span>AI Provider</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="rounded-2xl border border-white/[0.08] bg-[#181818]">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/10 text-white/60">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-normal tracking-tight text-white">Profile Information</CardTitle>
                  <CardDescription className="text-xs text-white/40 mt-0.5">
                    Your personal account details and brand avatar
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-white/[0.01] border border-white/[0.06]">
                <div className="relative group">
                  {settings.avatar ? (
                    <img
                      src={settings.avatar}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/[0.06] text-white border border-white/10 font-mono text-xl flex items-center justify-center">
                      {(settings.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-base font-normal text-white">{settings.name || 'Your Name'}</p>
                  <p className="text-xs text-white/40 mt-0.5">{user?.email}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-3">
                    <label className="cursor-pointer">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={uploadingLogo}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploadingLogo}
                        className="rounded-full border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white text-xs h-8 px-3.5"
                        onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                      >
                        {uploadingLogo ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3 h-3 mr-1.5 text-white/60" />
                            <span>Upload Avatar</span>
                          </>
                        )}
                      </Button>
                    </label>
                    {settings.avatar && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="rounded-full text-red-400/80 hover:text-red-400 hover:bg-red-500/10 text-xs h-8 px-3"
                        onClick={() => handleInputChange('avatar', '')}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        <span>Remove</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="bg-white/[0.06]" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-normal text-white/60">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                    placeholder="Your legal or brand name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-xs font-normal text-white/60">Company Name</Label>
                  <Input
                    id="company"
                    value={settings.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                    placeholder="Studio / Agency / Organization"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-normal text-white/60">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-normal text-white/60">Account Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="h-9 text-xs rounded-lg border-white/10 bg-[#121212]/50 text-white/40 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="profile-address" className="text-xs font-normal text-white/60">Company / Business Address</Label>
                  <Textarea
                    id="profile-address"
                    value={settings.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={2}
                    className="text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60 resize-none py-2"
                    placeholder="123 Innovation Drive, Suite 400, New York, NY 10001"
                  />
                  <p className="text-[11px] text-white/30">Displayed in the header of issued invoices and downloaded PDFs.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-6">
          <Card className="rounded-2xl border border-white/[0.08] bg-[#181818]">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/10 text-white/60">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-normal tracking-tight text-white">Business Details & Tax Information</CardTitle>
                  <CardDescription className="text-xs text-white/40 mt-0.5">
                    Official business address, tax IDs, and default currency for issued invoices
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-xs font-normal text-white/60">Business Address</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={2}
                  className="text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60 resize-none py-2"
                  placeholder="Street address, City, State, ZIP, Country"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="gstNumber" className="text-xs font-normal text-white/60">Tax ID / GST / VAT</Label>
                  <Input
                    id="gstNumber"
                    value={settings.gstNumber}
                    onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                    className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                    placeholder="e.g. 22AAAAA0000A1Z5"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="currency" className="text-xs font-normal text-white/60">Default Currency</Label>
                  <select
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full h-9 px-3 text-xs rounded-lg border border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60 outline-none"
                  >
                    <option value="USD" className="bg-[#181818] text-white">USD - US Dollar ($)</option>
                    <option value="EUR" className="bg-[#181818] text-white">EUR - Euro (€)</option>
                    <option value="GBP" className="bg-[#181818] text-white">GBP - British Pound (£)</option>
                    <option value="INR" className="bg-[#181818] text-white">INR - Indian Rupee (₹)</option>
                    <option value="AUD" className="bg-[#181818] text-white">AUD - Australian Dollar ($)</option>
                    <option value="CAD" className="bg-[#181818] text-white">CAD - Canadian Dollar ($)</option>
                    <option value="SGD" className="bg-[#181818] text-white">SGD - Singapore Dollar ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="defaultGstRate" className="text-xs font-normal text-white/60">Default GST Rate (%)</Label>
                  <Input
                    id="defaultGstRate"
                    type="number"
                    step="0.01"
                    value={settings.defaultGstRate}
                    onChange={(e) => handleInputChange('defaultGstRate', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                    className="h-9 text-xs font-mono rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="defaultTaxRate" className="text-xs font-normal text-white/60">Default Tax Rate (%)</Label>
                  <Input
                    id="defaultTaxRate"
                    type="number"
                    step="0.01"
                    value={settings.defaultTaxRate}
                    onChange={(e) => handleInputChange('defaultTaxRate', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                    className="h-9 text-xs font-mono rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card className="rounded-2xl border border-white/[0.08] bg-[#181818]">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/10 text-white/60">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-normal tracking-tight text-white">Invoice Preset Defaults</CardTitle>
                  <CardDescription className="text-xs text-white/40 mt-0.5">
                    Configure default numbering formats, terms & conditions, and footer notes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="invoicePrefix" className="text-xs font-normal text-white/60">Invoice Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={settings.invoicePrefix}
                    onChange={(e) => handleInputChange('invoicePrefix', e.target.value)}
                    className="h-9 text-xs font-mono rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                    placeholder="INV"
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div>
                    <Label className="text-xs font-normal text-white/80">Auto-Generate Numbers</Label>
                    <p className="text-[11px] text-white/40">Sequentially increment invoice numbers</p>
                  </div>
                  <Switch
                    checked={settings.autoGenerateNumbers}
                    onCheckedChange={(checked) => handleInputChange('autoGenerateNumbers', checked)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="defaultTerms" className="text-xs font-normal text-white/60">Default Terms & Conditions</Label>
                <Textarea
                  id="defaultTerms"
                  value={settings.defaultTerms}
                  onChange={(e) => handleInputChange('defaultTerms', e.target.value)}
                  rows={2}
                  className="text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60 resize-none py-2"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="defaultNotes" className="text-xs font-normal text-white/60">Default Client Notes</Label>
                <Textarea
                  id="defaultNotes"
                  value={settings.defaultNotes}
                  onChange={(e) => handleInputChange('defaultNotes', e.target.value)}
                  rows={2}
                  className="text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60 resize-none py-2"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="rounded-2xl border border-white/[0.08] bg-[#181818]">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/10 text-white/60">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-normal tracking-tight text-white">Email & Notifications</CardTitle>
                  <CardDescription className="text-xs text-white/40 mt-0.5">
                    Configure automated email delivery and payment reminder triggers
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <Label className="text-xs font-normal text-white/80">Email Delivery Notifications</Label>
                  <p className="text-[11px] text-white/40">Dispatch invoice PDF directly to client email upon issuance</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                />
              </div>

              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <Label className="text-xs font-normal text-white/80">Automated Payment Reminders</Label>
                  <p className="text-[11px] text-white/40">Send automated notifications before and after due date</p>
                </div>
                <Switch
                  checked={settings.reminderEmails}
                  onCheckedChange={(checked) => handleInputChange('reminderEmails', checked)}
                />
              </div>

              {settings.reminderEmails && (
                <div className="space-y-1.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <Label htmlFor="reminderDays" className="text-xs font-normal text-white/60">Reminder Lead Time (Days Before Due)</Label>
                  <Input
                    id="reminderDays"
                    type="number"
                    value={settings.reminderDays}
                    onChange={(e) => handleInputChange('reminderDays', parseInt(e.target.value) || 7)}
                    className="h-9 text-xs font-mono rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60 max-w-[200px]"
                  />
                  <p className="text-[11px] text-white/30">Dispatches an alert this many days prior to payment maturity.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings Tab */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="rounded-2xl border border-white/[0.08] bg-[#181818]">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/10 text-white/60">
                  <Sparkles className="w-4 h-4 text-[#1ed760]" />
                </div>
                <div>
                  <CardTitle className="text-lg font-normal tracking-tight text-white">AI Provider Integration (BYOK)</CardTitle>
                  <CardDescription className="text-xs text-white/40 mt-0.5">
                    Connect your own API key to power AI line items, description refinement, and invoice parsing
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="aiProvider" className="text-xs font-normal text-white/60">AI Provider</Label>
                <select
                  id="aiProvider"
                  value={settings.aiProvider}
                  onChange={(e) => {
                    const p = e.target.value;
                    let defaultModel = 'gemini-2.0-flash';
                    if (p === 'openai') defaultModel = 'gpt-4o-mini';
                    else if (p === 'claude') defaultModel = 'claude-3-5-sonnet-20241022';
                    else if (p === 'groq') defaultModel = 'llama-3.3-70b-versatile';
                    else if (p === 'openrouter') defaultModel = 'google/gemini-2.5-flash';
                    else if (p === 'deepseek') defaultModel = 'deepseek-chat';
                    else if (p === 'custom') defaultModel = 'model-name';

                    setSettings(prev => ({
                      ...prev,
                      aiProvider: p,
                      aiModel: defaultModel
                    }));
                  }}
                  className="w-full h-9 px-3 text-xs rounded-lg border border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60 outline-none"
                >
                  <option value="gemini" className="bg-[#181818] text-white">Google Gemini (Recommended - Free Tier)</option>
                  <option value="openai" className="bg-[#181818] text-white">OpenAI (GPT-4o / GPT-4o-mini)</option>
                  <option value="claude" className="bg-[#181818] text-white">Anthropic Claude (Claude 3.5 Sonnet / Haiku)</option>
                  <option value="groq" className="bg-[#181818] text-white">Groq Cloud (Ultra Fast - Llama 3.3 / Mixtral)</option>
                  <option value="openrouter" className="bg-[#181818] text-white">OpenRouter (model catalog)</option>
                  <option value="deepseek" className="bg-[#181818] text-white">DeepSeek (DeepSeek V3 / R1)</option>
                  <option value="custom" className="bg-[#181818] text-white">Custom / Local OpenAI Spec (Ollama, LM Studio)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="aiApiKey" className="text-xs font-normal text-white/60">API Key</Label>
                  <button
                    type="button"
                    className="text-xs text-white/40 hover:text-white inline-flex items-center gap-1 transition-colors"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <>
                        <EyeOff className="w-3 h-3" />
                        <span>Hide</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3 h-3" />
                        <span>Show</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="aiApiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.aiApiKey}
                    onChange={(e) => handleInputChange('aiApiKey', e.target.value)}
                    className="h-9 text-xs font-mono rounded-lg border-white/10 bg-[#121212] text-white pr-24 focus:border-[#1ed760]/60"
                    placeholder={
                      settings.aiProvider === 'gemini' ? 'AIzaSy...' :
                      settings.aiProvider === 'claude' ? 'sk-ant-...' :
                      settings.aiProvider === 'groq' ? 'gsk_...' :
                      settings.aiProvider === 'openrouter' ? 'sk-or-v1-...' :
                      settings.aiProvider === 'deepseek' ? 'sk-...' : 'sk-...'
                    }
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={handleTestAiKey}
                    disabled={testingAi}
                    className="absolute right-1 top-1 h-7 text-xs rounded-md text-white/60 hover:text-white hover:bg-white/[0.06] border border-white/10 px-2.5"
                  >
                    {testingAi ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#1ed760]" />
                        Test
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="aiModel" className="text-xs font-normal text-white/60">Model Identifier</Label>
                  <Input
                    id="aiModel"
                    value={settings.aiModel}
                    onChange={(e) => handleInputChange('aiModel', e.target.value)}
                    className="h-9 text-xs font-mono rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                    placeholder="gemini-2.0-flash"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="aiBaseUrl" className="text-xs font-normal text-white/60">
                    Custom Base URL <span className="text-[10px] text-white/30">(Optional)</span>
                  </Label>
                  <Input
                    id="aiBaseUrl"
                    value={settings.aiBaseUrl}
                    onChange={(e) => handleInputChange('aiBaseUrl', e.target.value)}
                    className="h-9 text-xs font-mono rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                    placeholder="https://api.openai.com/v1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

