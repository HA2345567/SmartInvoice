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
import { Save, Building, Mail, Bell, CreditCard, Shield, Sparkles, Zap, Settings as SettingsIcon, User, Globe, Loader as Loader2, CircleCheck as CheckCircle } from 'lucide-react';
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
};

export default function SettingsPage() {
  const { toast } = useToast();
  const { user, session } = useAuth();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

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
          defaultGstRate: data.defaultGstRate || 18,
          defaultTaxRate: data.defaultTaxRate || 0,
          emailNotifications: data.emailNotifications ?? true,
          reminderEmails: data.reminderEmails ?? true,
          reminderDays: data.reminderDays || 7,
          autoGenerateNumbers: data.autoGenerateNumbers ?? true,
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

      if (response.ok) {
        toast({
          title: 'Settings Saved',
          description: 'Your settings have been updated successfully.',
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#1ed760' }} />
          <p style={{ color: '#b3b3b3' }}>Loading settings...</p>
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
          <p className="text-base" style={{ color: '#b3b3b3' }}>
            Configure your SmartInvoice preferences and business details
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="font-bold text-sm"
          style={{ background: '#1ed760', color: '#000', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '1.4px' }}
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
        <TabsList className="grid w-full grid-cols-4 h-auto" style={{ background: '#181818', borderRadius: '8px' }}>
          <TabsTrigger value="profile" className="data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-white text-xs sm:text-sm">
            <User className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-white text-xs sm:text-sm">
            <Building className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-white text-xs sm:text-sm">
            <SettingsIcon className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Invoices</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-[#1f1f1f] data-[state=active]:text-white text-xs sm:text-sm">
            <Bell className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(30,215,96,0.1)' }}>
                  <User className="w-5 h-5" style={{ color: '#1ed760' }} />
                </div>
                <div>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  <CardDescription style={{ color: '#b3b3b3' }}>
                    Your personal information and account details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                  style={{ background: '#1ed760', color: '#000' }}
                >
                  {(settings.name || user?.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{settings.name || 'Your Name'}</p>
                  <p className="text-sm" style={{ color: '#b3b3b3' }}>{user?.email}</p>
                  <Badge
                    className="mt-2"
                    style={{ background: 'rgba(30,215,96,0.15)', color: '#1ed760', border: '1px solid rgba(30,215,96,0.3)' }}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Free Plan
                  </Badge>
                </div>
              </div>

              <Separator style={{ background: '#4d4d4d' }} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Full Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="h-12 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Company</Label>
                  <Input
                    id="company"
                    value={settings.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="h-12 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                    placeholder="Your company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Phone Number</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="h-12 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>

              {/* Upgrade prompt */}
              <div
                className="p-4 rounded-lg"
                style={{ background: 'rgba(30,215,96,0.1)', border: '1px solid rgba(30,215,96,0.2)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5" style={{ color: '#1ed760' }} />
                    <div>
                      <p className="text-sm font-bold text-white">Upgrade to Pro</p>
                      <p className="text-xs" style={{ color: '#b3b3b3' }}>Unlock logo upload, custom themes, and more</p>
                    </div>
                  </div>
                  <Button
                    className="font-bold text-xs"
                    style={{ background: '#1ed760', color: '#000', borderRadius: '9999px' }}
                  >
                    Upgrade
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business" className="space-y-6">
          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(30,215,96,0.1)' }}>
                  <Building className="w-5 h-5" style={{ color: '#1ed760' }} />
                </div>
                <div>
                  <CardTitle className="text-white">Business Information</CardTitle>
                  <CardDescription style={{ color: '#b3b3b3' }}>
                    Details that appear on your invoices
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Business Address</Label>
                <Textarea
                  id="address"
                  value={settings.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="text-white"
                  style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  placeholder="Your business address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gstNumber" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>GST Number</Label>
                  <Input
                    id="gstNumber"
                    value={settings.gstNumber}
                    onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                    className="h-12 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                    placeholder="GSTIN number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Default Currency</Label>
                  <select
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full h-12 px-3 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="AUD">AUD - Australian Dollar</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultGstRate" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Default GST Rate (%)</Label>
                  <Input
                    id="defaultGstRate"
                    type="number"
                    value={settings.defaultGstRate}
                    onChange={(e) => handleInputChange('defaultGstRate', parseFloat(e.target.value) || 0)}
                    className="h-12 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultTaxRate" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Default Tax Rate (%)</Label>
                  <Input
                    id="defaultTaxRate"
                    type="number"
                    value={settings.defaultTaxRate}
                    onChange={(e) => handleInputChange('defaultTaxRate', parseFloat(e.target.value) || 0)}
                    className="h-12 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(30,215,96,0.1)' }}>
                  <SettingsIcon className="w-5 h-5" style={{ color: '#1ed760' }} />
                </div>
                <div>
                  <CardTitle className="text-white">Invoice Defaults</CardTitle>
                  <CardDescription style={{ color: '#b3b3b3' }}>
                    Configure default values for new invoices
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoicePrefix" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Invoice Number Prefix</Label>
                  <Input
                    id="invoicePrefix"
                    value={settings.invoicePrefix}
                    onChange={(e) => handleInputChange('invoicePrefix', e.target.value)}
                    className="h-12 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                    placeholder="INV"
                  />
                </div>
                <div className="flex items-end p-4 rounded-lg" style={{ background: '#1f1f1f' }}>
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <Label className="text-sm font-bold text-white">Auto-Generate Numbers</Label>
                      <p className="text-xs" style={{ color: '#b3b3b3' }}>Automatically assign invoice numbers</p>
                    </div>
                    <Switch
                      checked={settings.autoGenerateNumbers}
                      onCheckedChange={(checked) => handleInputChange('autoGenerateNumbers', checked)}
                      style={{ background: settings.autoGenerateNumbers ? '#1ed760' : '#4d4d4d' }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultTerms" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Default Terms & Conditions</Label>
                <Textarea
                  id="defaultTerms"
                  value={settings.defaultTerms}
                  onChange={(e) => handleInputChange('defaultTerms', e.target.value)}
                  rows={3}
                  className="text-white"
                  style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultNotes" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Default Notes</Label>
                <Textarea
                  id="defaultNotes"
                  value={settings.defaultNotes}
                  onChange={(e) => handleInputChange('defaultNotes', e.target.value)}
                  rows={2}
                  className="text-white"
                  style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(30,215,96,0.1)' }}>
                  <Mail className="w-5 h-5" style={{ color: '#1ed760' }} />
                </div>
                <div>
                  <CardTitle className="text-white">Email Settings</CardTitle>
                  <CardDescription style={{ color: '#b3b3b3' }}>
                    Configure email notifications and reminders
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg" style={{ background: '#1f1f1f' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-bold text-white">Email Notifications</Label>
                    <p className="text-xs" style={{ color: '#b3b3b3' }}>Send invoice emails to clients</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                    style={{ background: settings.emailNotifications ? '#1ed760' : '#4d4d4d' }}
                  />
                </div>
              </div>

              <Separator style={{ background: '#4d4d4d' }} />

              <div className="p-4 rounded-lg" style={{ background: '#1f1f1f' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-bold text-white">Payment Reminders</Label>
                    <p className="text-xs" style={{ color: '#b3b3b3' }}>Auto-send payment reminders</p>
                  </div>
                  <Switch
                    checked={settings.reminderEmails}
                    onCheckedChange={(checked) => handleInputChange('reminderEmails', checked)}
                    style={{ background: settings.reminderEmails ? '#1ed760' : '#4d4d4d' }}
                  />
                </div>
              </div>

              {settings.reminderEmails && (
                <div className="space-y-2">
                  <Label htmlFor="reminderDays" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Days Before Due Date</Label>
                  <Input
                    id="reminderDays"
                    type="number"
                    value={settings.reminderDays}
                    onChange={(e) => handleInputChange('reminderDays', parseInt(e.target.value) || 7)}
                    className="h-12 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  />
                  <p className="text-xs" style={{ color: '#b3b3b3' }}>Send reminder this many days before due date</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Smart Features Card */}
          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(30,215,96,0.1)' }}>
                  <Sparkles className="w-5 h-5" style={{ color: '#1ed760' }} />
                </div>
                <div>
                  <CardTitle className="text-white">Smart Features</CardTitle>
                  <CardDescription style={{ color: '#b3b3b3' }}>
                    AI-powered enhancements
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg" style={{ background: 'rgba(30,215,96,0.1)', border: '1px solid rgba(30,215,96,0.2)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5" style={{ color: '#1ed760' }} />
                  <span className="font-bold text-white">AI Auto-Suggestions</span>
                </div>
                <p className="text-sm" style={{ color: '#b3b3b3' }}>
                  Smart line items and client data auto-fill based on your history
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <Bell className="w-5 h-5" style={{ color: '#3b82f6' }} />
                  <span className="font-bold text-white">Smart Reminders</span>
                </div>
                <p className="text-sm" style={{ color: '#b3b3b3' }}>
                  Automated overdue invoice reminders with intelligent timing
                </p>
              </div>

              <div className="p-4 rounded-lg" style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-5 h-5" style={{ color: '#a855f7' }} />
                  <span className="font-bold text-white">Payment Insights</span>
                </div>
                <p className="text-sm" style={{ color: '#b3b3b3' }}>
                  Predict payment likelihood and optimize collections
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
