'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  Search,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Download,
  Building,
  CreditCard,
  RotateCw,
  Loader2,
  X,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Client } from '@/lib/types';

const currencies = [
  { value: 'USD', label: 'USD - US Dollar ($)' },
  { value: 'EUR', label: 'EUR - Euro (€)' },
  { value: 'GBP', label: 'GBP - British Pound (£)' },
  { value: 'INR', label: 'INR - Indian Rupee (₹)' },
  { value: 'CAD', label: 'CAD - Canadian Dollar ($)' },
  { value: 'AUD', label: 'AUD - Australian Dollar ($)' },
  { value: 'JPY', label: 'JPY - Japanese Yen (¥)' },
];

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    address: '',
    gstNumber: '',
    currency: 'USD',
  });

  const getEffectiveToken = useCallback(() => {
    if (session?.access_token) return session.access_token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token') || localStorage.getItem('token') || '';
    }
    return '';
  }, [session?.access_token]);

  const fetchClients = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const token = getEffectiveToken();
      const headers: Record<string, string> = {
        'Cache-Control': 'no-cache',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/clients', {
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setClients(Array.isArray(data) ? data : []);
        if (isRefresh) {
          toast({
            title: 'Clients Synced',
            description: 'Latest client directory loaded from database.',
          });
        }
      } else {
        throw new Error('Failed to fetch clients');
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch clients from database.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getEffectiveToken, toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = useMemo(() => {
    if (!searchTerm.trim()) return clients;
    const term = searchTerm.toLowerCase();
    return clients.filter(
      client =>
        client.name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        (client.company && client.company.toLowerCase().includes(term)) ||
        (client.gstNumber && client.gstNumber.toLowerCase().includes(term))
    );
  }, [clients, searchTerm]);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = clients.length;
    const active = clients.filter(c => c.isActive !== false).length;
    const totalInvoices = clients.reduce((acc, c) => acc + (c.totalInvoices || 0), 0);
    const totalBilled = clients.reduce((acc, c) => acc + (c.totalAmount || 0), 0);

    return {
      total,
      active,
      totalInvoices,
      totalBilled,
    };
  }, [clients]);

  const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode || 'USD',
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${currencyCode} ${amount.toLocaleString()}`;
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      address: '',
      gstNumber: '',
      currency: 'USD',
    });
    setEditingClient(null);
  };

  const openDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        email: client.email,
        company: client.company || '',
        address: client.address || '',
        gstNumber: client.gstNumber || '',
        currency: client.currency || 'USD',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Client name is required.',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Client email is required.',
        variant: 'destructive',
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormLoading(true);

    try {
      const url = editingClient ? `/api/clients/${editingClient.id}` : '/api/clients';
      const method = editingClient ? 'PUT' : 'POST';

      const token = getEffectiveToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: editingClient ? 'Client Updated' : 'Client Added',
          description: result.message || 'Client information successfully saved.',
        });
        closeDialog();
        fetchClients();
      } else {
        throw new Error(result.error || 'Failed to save client');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save client. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (client: Client) => {
    if (!confirm(`Are you sure you want to delete ${client.name}? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = getEffectiveToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/clients/${client.id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: 'Client Deleted',
          description: result.message || 'Client removed successfully.',
        });
        fetchClients();
      } else {
        throw new Error(result.error || 'Failed to delete client');
      }
    } catch (error) {
      toast({
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'Failed to delete client',
        variant: 'destructive',
      });
    }
  };

  const handleExportClients = async () => {
    try {
      const token = getEffectiveToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/export/clients', {
        headers,
        credentials: 'include',
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clients-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: 'Export Complete',
          description: 'Client roster successfully exported as CSV.',
        });
      } else {
        throw new Error('Failed to export clients');
      }
    } catch (error) {
      toast({
        title: 'Export Error',
        description: 'Failed to export clients. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#1ed760' }} />
          <p style={{ color: '#b3b3b3' }}>Loading client directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Clients</h1>
            <Badge
              variant="outline"
              className="text-xs"
              style={{ background: 'rgba(30,215,96,0.15)', color: '#1ed760', border: '1px solid rgba(30,215,96,0.3)' }}
            >
              {clients.length} {clients.length === 1 ? 'Client' : 'Clients'}
            </Badge>
          </div>
          <p className="text-base mt-1" style={{ color: '#b3b3b3' }}>
            Manage client profiles, billing information, and track invoiced totals
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="outline"
            onClick={() => fetchClients(true)}
            disabled={refreshing}
            className="border-white/10 hover:bg-white/5 text-white"
            style={{ borderRadius: '9999px' }}
          >
            <RotateCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin text-[#1ed760]' : ''}`} />
            {refreshing ? 'Syncing...' : 'Sync'}
          </Button>

          <Button
            variant="outline"
            onClick={handleExportClients}
            className="border-white/10 hover:bg-white/5 text-white"
            style={{ borderRadius: '9999px' }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => openDialog()}
                className="font-bold text-sm"
                style={{
                  background: '#1ed760',
                  color: '#000',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.4px',
                }}
              >
                <Plus className="w-4 h-4 mr-2 stroke-[3]" />
                Add Client
              </Button>
            </DialogTrigger>

            <DialogContent
              className="sm:max-w-[500px]"
              style={{ background: '#181818', border: '1px solid #4d4d4d' }}
            >
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingClient ? 'Edit Client' : 'Add New Client'}
                </DialogTitle>
                <DialogDescription style={{ color: '#b3b3b3' }}>
                  {editingClient ? 'Update client contact and billing profile' : 'Add a new client to your invoicing database'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>
                      Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Acme Corp / Jane Doe"
                      className="h-11 text-white"
                      style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="billing@client.com"
                      className="h-11 text-white"
                      style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Legal entity or brand name"
                    className="h-11 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>
                    Billing Address
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Street, City, Postal Code, Country"
                    rows={2}
                    className="text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>
                      GST / Tax ID
                    </Label>
                    <Input
                      id="gstNumber"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, gstNumber: e.target.value }))}
                      placeholder="Tax ID (optional)"
                      className="h-11 text-white"
                      style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm font-bold" style={{ color: '#b3b3b3' }}>
                      Default Currency
                    </Label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full h-11 px-3 text-white"
                      style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                    >
                      {currencies.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <DialogFooter className="pt-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={closeDialog}
                    style={{ color: '#b3b3b3' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={formLoading}
                    className="font-bold text-sm"
                    style={{ background: '#1ed760', color: '#000', borderRadius: '9999px' }}
                  >
                    {formLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : editingClient ? (
                      'Update Client'
                    ) : (
                      'Add Client'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }} className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3b3b3' }}>
              Total Clients
            </span>
            <Users className="w-4 h-4" style={{ color: '#1ed760' }} />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.total}</div>
          <div className="text-xs mt-1" style={{ color: '#b3b3b3' }}>All registered accounts</div>
        </Card>

        <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }} className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3b3b3' }}>
              Active Clients
            </span>
            <CheckCircle className="w-4 h-4" style={{ color: '#1ed760' }} />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.active}</div>
          <div className="text-xs mt-1" style={{ color: '#b3b3b3' }}>In good standing</div>
        </Card>

        <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }} className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3b3b3' }}>
              Total Invoices
            </span>
            <FileText className="w-4 h-4" style={{ color: '#1ed760' }} />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.totalInvoices}</div>
          <div className="text-xs mt-1" style={{ color: '#b3b3b3' }}>Linked invoice records</div>
        </Card>

        <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }} className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#b3b3b3' }}>
              Total Billed
            </span>
            <TrendingUp className="w-4 h-4" style={{ color: '#1ed760' }} />
          </div>
          <div className="text-2xl font-bold" style={{ color: '#1ed760' }}>
            {formatCurrency(stats.totalBilled)}
          </div>
          <div className="text-xs mt-1" style={{ color: '#b3b3b3' }}>Cumulative revenue</div>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#b3b3b3' }} />
            <Input
              placeholder="Search clients by name, email, company, or tax ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 text-white h-11"
              style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-4" style={{ color: '#4d4d4d' }} />
              <h3 className="text-lg font-bold text-white mb-2">
                {searchTerm ? 'No clients match your search' : 'No clients yet'}
              </h3>
              <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: '#b3b3b3' }}>
                {searchTerm
                  ? 'Try searching with a different name, email, or company.'
                  : 'Add your first client to start generating beautiful invoices and tracking receivables.'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => openDialog()}
                  className="font-bold text-sm"
                  style={{
                    background: '#1ed760',
                    color: '#000',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '1.4px',
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Client
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              style={{
                background: '#181818',
                border: '1px solid #4d4d4d',
                borderRadius: '8px',
              }}
              className="hover:border-[#1ed760]/50 transition-all p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header & Actions */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-11 h-11 font-bold rounded-full flex items-center justify-center text-base flex-shrink-0"
                      style={{
                        background: 'rgba(30,215,96,0.15)',
                        border: '1px solid rgba(30,215,96,0.3)',
                        color: '#1ed760',
                      }}
                    >
                      {(client.name || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-bold text-base truncate">{client.name}</h3>
                      <p className="text-xs truncate flex items-center gap-1.5 mt-0.5" style={{ color: '#b3b3b3' }}>
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDialog(client)}
                      className="text-zinc-400 hover:text-white hover:bg-white/5 h-8 w-8 p-0 rounded-lg"
                      title="Edit Client"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(client)}
                      className="text-zinc-400 hover:text-rose-400 hover:bg-white/5 h-8 w-8 p-0 rounded-lg"
                      title="Delete Client"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Info List */}
                <div className="space-y-2 mb-4">
                  {client.company && (
                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                      <Building className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#b3b3b3' }} />
                      <span className="truncate">{client.company}</span>
                    </div>
                  )}

                  {client.address && (
                    <div className="flex items-start gap-2 text-xs text-zinc-300">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: '#b3b3b3' }} />
                      <span className="line-clamp-2">{client.address}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    {client.gstNumber && (
                      <Badge
                        variant="outline"
                        className="text-[11px] px-2 py-0.5 border-white/10"
                        style={{ background: '#1f1f1f', color: '#b3b3b3' }}
                      >
                        Tax ID: {client.gstNumber}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="text-[11px] px-2 py-0.5 border-white/10"
                      style={{ background: '#1f1f1f', color: '#b3b3b3' }}
                    >
                      {client.currency || 'USD'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Card Footer Metrics */}
              <div
                className="grid grid-cols-2 gap-3 pt-3 -mx-5 -mb-5 px-5 py-3.5 mt-2"
                style={{
                  borderTop: '1px solid #2e2e2e',
                  background: '#141414',
                  borderBottomLeftRadius: '8px',
                  borderBottomRightRadius: '8px',
                }}
              >
                <div className="text-center pr-2" style={{ borderRight: '1px solid #2e2e2e' }}>
                  <div className="text-xs flex items-center justify-center gap-1 mb-0.5" style={{ color: '#b3b3b3' }}>
                    <FileText className="w-3.5 h-3.5" />
                    <span>Invoices</span>
                  </div>
                  <p className="text-base font-bold text-white">{client.totalInvoices || 0}</p>
                </div>

                <div className="text-center pl-2">
                  <div className="text-xs flex items-center justify-center gap-1 mb-0.5" style={{ color: '#1ed760' }}>
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Total Billed</span>
                  </div>
                  <p className="text-base font-bold" style={{ color: '#1ed760' }}>
                    {formatCurrency(client.totalAmount || 0, client.currency || 'USD')}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}