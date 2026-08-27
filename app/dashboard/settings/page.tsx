'use client';

import { useState, useEffect } from 'react';
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
    if (!session?.access_token) return;

    try {
      const response = await fetch('/api/user/settings', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
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
    if (!session?.access_token) return;

    setSaving(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
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
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#1ed760]" />
          <p className="text-dark-muted">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Settings</h1>
          <p className="text-base text-dark-muted">
            Configure your SmartInvoice preferences, company branding, and AI integration
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="font-bold text-sm bg-[#1ed760] text-black hover:bg-[#1abe53] rounded-full uppercase tracking-wider px-6 h-11"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto bg-[#181818] p-1 rounded-xl border border-white/10">
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-[#1ed760] text-xs sm:text-sm py-2.5">
            <User className="w-4 h-4 mr-2" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-[#1ed760] text-xs sm:text-sm py-2.5">
            <Building className="w-4 h-4 mr-2" />
            <span>Business</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-[#1ed760] text-xs sm:text-sm py-2.5">
            <SettingsIcon className="w-4 h-4 mr-2" />
            <span>Invoices</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-[#1ed760] text-xs sm:text-sm py-2.5">
            <Bell className="w-4 h-4 mr-2" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-[#1ed760] text-xs sm:text-sm py-2.5">
            <Sparkles className="w-4 h-4 mr-2 text-[#1ed760]" />
            <span>AI Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="card-dark-mist border-[#4d4d4d]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#1ed760]/10 border border-[#1ed760]/20">
                  <User className="w-5 h-5 text-[#1ed760]" />
                </div>
                <div>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  <CardDescription className="text-dark-muted">
                    Your personal account details and branding avatar
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-[#1f1f1f] border border-white/5">
                <div className="relative group">
                  {settings.avatar ? (
                    <img
                      src={settings.avatar}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#1ed760]"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#1ed760] text-black font-bold text-2xl flex items-center justify-center shadow-lg">
                      {(settings.name || user?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-lg font-bold text-white">{settings.name || 'Your Name'}</p>
                  <p className="text-sm text-dark-muted">{user?.email}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-3 mt-3">
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
                        className="bg-[#282828] border-white/10 hover:bg-[#333] text-white text-xs"
                        onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                      >
                        {uploadingLogo ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5 mr-1.5 text-[#1ed760]" />
                            Upload Photo / Logo
                          </>
                        )}
                      </Button>
                    </label>
                    {settings.avatar && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 text-xs hover:bg-red-500/10"
                        onClick={() => handleInputChange('avatar', '')}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="bg-[#4d4d4d]" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold text-dark-muted">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="h-12 text-white bg-[#1f1f1f] border-[#4d4d4d]"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-bold text-dark-muted">Company Name</Label>
                  <Input
                    id="company"
                    value={settings.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="h-12 text-white bg-[#1f1f1f] border-[#4d4d4d]"
                    placeholder="Your company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-bold text-dark-muted">Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="h-12 text-white bg-[#1f1f1f] border-[#4d4d4d]"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-dark-muted">Account Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="h-12 text-gray-400 bg-[#141414] border-[#333] cursor-not-allowed"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-6">
          <Card className="card-dark-mist border-[#4d4d4d]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#1ed760]/10 border border-[#1ed760]/20">
                  <Building className="w-5 h-5 text-[#1ed760]" />
                </div>
                <div>
                  <CardTitle className="text-white">Business Details & Tax Information</CardTitle>
                  <CardDescription className="text-dark-muted">
                    Official business address, tax IDs, and default currency for issued invoices
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-bold text-dark-muted">Business Address</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="text-white bg-[#1f1f1f] border-[#4d4d4d]"
                  placeholder="Street address, City, State, ZIP, Country"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gstNumber" className="text-sm font-bold text-dark-muted">GST / Tax Identification Number</Label>
                  <Input
                    id="gstNumber"
                    value={settings.gstNumber}
                    onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                    className="h-12 text-white bg-[#1f1f1f] border-[#4d4d4d]"
                    placeholder="e.g. 22AAAAA0000A1Z5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-sm font-bold text-dark-muted">Default Invoice Currency</Label>
                  <select
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full h-12 px-3 text-white bg-[#1f1f1f] border border-[#4d4d4d] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1ed760]"
                  >
                    <option value="USD">USD - US Dollar ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                    <option value="GBP">GBP - British Pound (£)</option>
                    <option value="INR">INR - Indian Rupee (₹)</option>
                    <option value="AUD">AUD - Australian Dollar ($)</option>
                    <option value="CAD">CAD - Canadian Dollar ($)</option>
                    <option value="SGD">SGD - Singapore Dollar ($)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultGstRate" className="text-sm font-bold text-dark-muted">Default GST Rate (%)</Label>
                  <Input
                    id="defaultGstRate"
                    type="number"
                    step="0.01"
                    value={settings.defaultGstRate}
                    onChange={(e) => handleInputChange('defaultGstRate', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                    className="h-12 text-white bg-[#1f1f1f] border-[#4d4d4d]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultTaxRate" className="text-sm font-bold text-dark-muted">Default Tax Rate (%)</Label>
                  <Input
                    id="defaultTaxRate"
                    type="number"
                    step="0.01"
                    value={settings.defaultTaxRate}
                    onChange={(e) => handleInputChange('defaultTaxRate', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                    className="h-12 text-white bg-[#1f1f1f] border-[#4d4d4d]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card className="card-dark-mist border-[#4d4d4d]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#1ed760]/10 border border-[#1ed760]/20">
                  <SettingsIcon className="w-5 h-5 text-[#1ed760]" />
                </div>
                <div>
                  <CardTitle className="text-white">Invoice Preset Defaults</CardTitle>
                  <CardDescription className="text-dark-muted">
                    Configure default numbering formats, terms & conditions, and footer notes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix" className="text-sm font-bold text-dark-muted">Invoice Number Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={settings.invoicePrefix}
                    onChange={(e) => handleInputChange('invoicePrefix', e.target.value)}
                    className="h-12 text-white bg-[#1f1f1f] border-[#4d4d4d]"
                    placeholder="INV"
                  />
                </div>
                <div className="flex items-end p-4 rounded-lg bg-[#1f1f1f] border border-white/5">
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <Label className="text-sm font-bold text-white">Auto-Generate Numbers</Label>
                      <p className="text-xs text-dark-muted">Automatically increment sequential invoice numbers</p>
                    </div>
                    <Switch
                      checked={settings.autoGenerateNumbers}
                      onCheckedChange={(checked) => handleInputChange('autoGenerateNumbers', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultTerms" className="text-sm font-bold text-dark-muted">Default Terms & Conditions</Label>
                <Textarea
                  id="defaultTerms"
                  value={settings.defaultTerms}
                  onChange={(e) => handleInputChange('defaultTerms', e.target.value)}
                  rows={3}
                  className="text-white bg-[#1f1f1f] border-[#4d4d4d]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultNotes" className="text-sm font-bold text-dark-muted">Default Invoice Notes / Thank You Message</Label>
                <Textarea
                  id="defaultNotes"
                  value={settings.defaultNotes}
                  onChange={(e) => handleInputChange('defaultNotes', e.target.value)}
                  rows={2}
                  className="text-white bg-[#1f1f1f] border-[#4d4d4d]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="card-dark-mist border-[#4d4d4d]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#1ed760]/10 border border-[#1ed760]/20">
                  <Mail className="w-5 h-5 text-[#1ed760]" />
                </div>
                <div>
                  <CardTitle className="text-white">Email Dispatch & Automated Reminders</CardTitle>
                  <CardDescription className="text-dark-muted">
                    Configure automated email delivery and client reminder triggers
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-xl bg-[#1f1f1f] border border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-bold text-white">Email Delivery Notifications</Label>
                    <p className="text-xs text-dark-muted">Automatically dispatch invoice emails to clients when issued</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                  />
                </div>
              </div>

              <Separator className="bg-[#4d4d4d]" />

              <div className="p-4 rounded-xl bg-[#1f1f1f] border border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-bold text-white">Automated Payment Reminders</Label>
                    <p className="text-xs text-dark-muted">Send automated email reminders before and after due dates</p>
                  </div>
                  <Switch
                    checked={settings.reminderEmails}
                    onCheckedChange={(checked) => handleInputChange('reminderEmails', checked)}
                  />
                </div>
              </div>

              {settings.reminderEmails && (
                <div className="space-y-2 p-4 rounded-xl bg-[#1f1f1f] border border-white/5">
                  <Label htmlFor="reminderDays" className="text-sm font-bold text-dark-muted">Reminder Threshold (Days Before Due Date)</Label>
                  <Input
                    id="reminderDays"
                    type="number"
                    value={settings.reminderDays}
                    onChange={(e) => handleInputChange('reminderDays', parseInt(e.target.value) || 7)}
                    className="h-12 text-white bg-[#141414] border-[#4d4d4d]"
                  />
                  <p className="text-xs text-dark-muted">Send payment reminder exactly this many days before the due date</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings Tab */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="card-dark-mist border-[#4d4d4d]">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#1ed760]/10 border border-[#1ed760]/20">
                  <Sparkles className="w-5 h-5 text-[#1ed760]" />
                </div>
                <div>
                  <CardTitle className="text-white">Bring Your Own Key (BYOK) AI Integration</CardTitle>
                  <CardDescription className="text-dark-muted">
                    Configure your AI provider API Key to power invoice generation, item suggestions, and cash flow analysis
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="aiProvider" className="text-sm font-bold text-dark-muted">AI Provider</Label>
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
                  className="w-full h-12 px-3 text-white bg-[#1f1f1f] border border-[#4d4d4d] rounded-md focus:outline-none focus:ring-1 focus:ring-[#1ed760]"
                >
                  <option value="gemini">Google Gemini (Recommended - Free Tier)</option>
                  <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                  <option value="claude">Anthropic Claude (Claude 3.5 Sonnet / Haiku)</option>
                  <option value="groq">Groq Cloud (Ultra Fast - Llama 3.3 / Mixtral)</option>
                  <option value="openrouter">OpenRouter (Access 200+ AI Models)</option>
                  <option value="deepseek">DeepSeek (DeepSeek V3 / R1)</option>
                  <option value="custom">Custom / Local OpenAI Spec (Ollama, vLLM, LM Studio)</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="aiApiKey" className="text-sm font-bold text-dark-muted">API Key</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-dark-muted hover:text-white"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 mr-1" />
                        Hide Key
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Show Key
                      </>
                    )}
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="aiApiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.aiApiKey}
                    onChange={(e) => handleInputChange('aiApiKey', e.target.value)}
                    className="h-12 text-white font-mono bg-[#1f1f1f] border-[#4d4d4d] pr-28"
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
                    onClick={handleTestAiKey}
                    disabled={testingAi}
                    className="absolute right-1.5 top-1.5 h-9 text-xs font-bold bg-[#282828] hover:bg-[#333] text-[#1ed760] border border-[#1ed760]/30"
                  >
                    {testingAi ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3 mr-1" />
                        Test Key
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aiModel" className="text-sm font-bold text-dark-muted">Model Name</Label>
                  <Input
                    id="aiModel"
                    value={settings.aiModel}
                    onChange={(e) => handleInputChange('aiModel', e.target.value)}
                    className="h-12 text-white bg-[#1f1f1f] border-[#4d4d4d]"
                    placeholder={
                      settings.aiProvider === 'gemini' ? 'gemini-2.0-flash' :
                      settings.aiProvider === 'openai' ? 'gpt-4o-mini' :
                      settings.aiProvider === 'claude' ? 'claude-3-5-sonnet-20241022' :
                      settings.aiProvider === 'groq' ? 'llama-3.3-70b-versatile' :
                      settings.aiProvider === 'openrouter' ? 'google/gemini-2.5-flash' :
                      settings.aiProvider === 'deepseek' ? 'deepseek-chat' : 'custom-model'
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aiBaseUrl" className="text-sm font-bold text-dark-muted">
                    Custom Base URL <span className="text-xs font-normal text-gray-500">(Optional)</span>
                  </Label>
                  <Input
                    id="aiBaseUrl"
                    value={settings.aiBaseUrl}
                    onChange={(e) => handleInputChange('aiBaseUrl', e.target.value)}
                    className="h-12 text-white bg-[#1f1f1f] border-[#4d4d4d]"
                    placeholder={
                      settings.aiProvider === 'gemini' ? 'https://generativelanguage.googleapis.com/v1beta/models' :
                      settings.aiProvider === 'openai' ? 'https://api.openai.com/v1' :
                      settings.aiProvider === 'claude' ? 'https://api.anthropic.com/v1' :
                      settings.aiProvider === 'groq' ? 'https://api.groq.com/openai/v1' :
                      settings.aiProvider === 'openrouter' ? 'https://openrouter.ai/api/v1' :
                      settings.aiProvider === 'deepseek' ? 'https://api.deepseek.com/v1' :
                      'http://localhost:11434/v1'
                    }
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
