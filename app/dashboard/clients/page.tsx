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
import { LuxuryLoader } from '@/components/ui/LuxuryLoader';

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
    return <LuxuryLoader label="Loading client directory..." sublabel="Relationship Roster" />;
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-white">Client Directory</h1>
            <Badge
              variant="outline"
              className="text-[11px] font-mono border-white/10 bg-white/[0.03] text-white/60 rounded-full px-2.5 py-0.5"
            >
              {clients.length} {clients.length === 1 ? 'client' : 'clients'}
            </Badge>
          </div>
          <p className="text-xs text-white/40 mt-1">
            Maintain relationship records, default currencies, and client billing telemetry
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchClients(true)}
            disabled={refreshing}
            className="rounded-full border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white/80 text-xs h-9 px-3.5 inline-flex items-center gap-1.5"
          >
            <RotateCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#1ed760]' : 'text-white/40'}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportClients}
            className="rounded-full border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white/80 text-xs h-9 px-3.5 inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-white/40" />
            <span>Export CSV</span>
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                onClick={() => openDialog()}
                className="rounded-full bg-[#1ed760] text-black hover:bg-[#1fdf64] text-xs font-medium h-9 px-4 inline-flex items-center gap-1.5 shadow-sm transition-transform active:scale-[0.98]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Client</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[520px] rounded-2xl bg-[#181818] border border-white/10 p-6 shadow-2xl">
              <DialogHeader className="pb-2">
                <DialogTitle className="text-lg font-normal tracking-tight text-white">
                  {editingClient ? 'Edit Client Profile' : 'Add New Client'}
                </DialogTitle>
                <DialogDescription className="text-xs text-white/40 mt-0.5">
                  {editingClient ? 'Update client contact information and invoicing defaults' : 'Register a new client entity in your directory'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-normal text-white/60">
                      Client Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Jane Doe or Acme Corp"
                      className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-normal text-white/60">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="billing@client.com"
                      className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-xs font-normal text-white/60">
                    Company / Organization
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Legal company or trade name"
                    className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs font-normal text-white/60">
                    Billing Address
                  </Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Street, suite, city, state, postal code, country"
                    rows={2}
                    className="text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60 resize-none py-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="gstNumber" className="text-xs font-normal text-white/60">
                      Tax ID / GST / VAT
                    </Label>
                    <Input
                      id="gstNumber"
                      value={formData.gstNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, gstNumber: e.target.value }))}
                      placeholder="Optional tax number"
                      className="h-9 text-xs rounded-lg border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="currency" className="text-xs font-normal text-white/60">
                      Default Currency
                    </Label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full h-9 px-3 text-xs rounded-lg border border-white/10 bg-[#121212] text-white focus:border-[#1ed760]/60 outline-none"
                    >
                      {currencies.map(c => (
                        <option key={c.value} value={c.value} className="bg-[#181818] text-white">{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <DialogFooter className="pt-4 border-t border-white/[0.06] flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={closeDialog}
                    className="text-xs text-white/50 hover:text-white rounded-full h-8 px-4"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={formLoading}
                    className="rounded-full bg-[#1ed760] text-black hover:bg-[#1fdf64] font-medium text-xs h-8 px-4"
                  >
                    {formLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : editingClient ? (
                      'Update Profile'
                    ) : (
                      'Save Client'
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
        <Card className="rounded-2xl border border-white/[0.08] bg-[#181818] p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono">Total Clients</span>
            <Users className="w-4 h-4 text-white/30" />
          </div>
          <div className="text-3xl font-light tracking-tight text-white mt-3 font-mono">{stats.total}</div>
          <div className="text-[11px] text-white/40 mt-1">Registered clients</div>
        </Card>

        <Card className="rounded-2xl border border-white/[0.08] bg-[#181818] p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono">Active Accounts</span>
            <CheckCircle className="w-4 h-4 text-white/30" />
          </div>
          <div className="text-3xl font-light tracking-tight text-white mt-3 font-mono">{stats.active}</div>
          <div className="text-[11px] text-white/40 mt-1">In good standing</div>
        </Card>

        <Card className="rounded-2xl border border-white/[0.08] bg-[#181818] p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono">Invoices Issued</span>
            <FileText className="w-4 h-4 text-white/30" />
          </div>
          <div className="text-3xl font-light tracking-tight text-white mt-3 font-mono">{stats.totalInvoices}</div>
          <div className="text-[11px] text-white/40 mt-1">Linked billing documents</div>
        </Card>

        <Card className="rounded-2xl border border-white/[0.08] bg-[#181818] p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono">Cumulative Billed</span>
            <TrendingUp className="w-4 h-4 text-[#1ed760]/70" />
          </div>
          <div className="text-3xl font-light tracking-tight text-white mt-3 font-mono">
            {formatCurrency(stats.totalBilled)}
          </div>
          <div className="text-[11px] text-white/40 mt-1">Total recognized billings</div>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <Input
          placeholder="Search by client name, email, company, or tax ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 text-xs text-white h-10 rounded-xl border border-white/[0.08] bg-[#181818] focus:border-[#1ed760]/60 placeholder:text-white/30"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <Card className="rounded-2xl border border-white/[0.08] bg-[#181818] p-12 text-center">
          <Users className="w-8 h-8 mx-auto mb-3 text-white/20" />
          <h3 className="text-sm font-normal text-white mb-1">
            {searchTerm ? 'No clients match your filter' : 'No clients registered yet'}
          </h3>
          <p className="text-xs text-white/40 max-w-sm mx-auto mb-4">
            {searchTerm
              ? 'Try modifying your search keywords or clearing the active search.'
              : 'Add your first client to start creating personalized invoices and tracking receivables.'}
          </p>
          {!searchTerm && (
            <Button
              size="sm"
              onClick={() => openDialog()}
              className="rounded-full bg-[#1ed760] text-black hover:bg-[#1fdf64] text-xs font-medium h-8 px-4"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add First Client
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => (
            <Card
              key={client.id}
              className="rounded-2xl border border-white/[0.08] bg-[#181818] hover:border-white/20 transition-colors p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header & Actions */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 font-medium rounded-full flex items-center justify-center text-xs flex-shrink-0 bg-white/[0.04] border border-white/10 text-white/80 font-mono">
                      {(client.name || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-normal text-sm tracking-tight truncate">{client.name}</h3>
                      <p className="text-[11px] truncate flex items-center gap-1 text-white/40 mt-0.5">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDialog(client)}
                      className="text-white/40 hover:text-white hover:bg-white/[0.06] h-7 w-7 p-0 rounded-md transition-colors"
                      title="Edit Client"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(client)}
                      className="text-white/40 hover:text-red-400 hover:bg-red-500/10 h-7 w-7 p-0 rounded-md transition-colors"
                      title="Delete Client"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Info List */}
                <div className="space-y-1.5 mb-4 text-xs text-white/60">
                  {client.company && (
                    <div className="flex items-center gap-2">
                      <Building className="w-3 h-3 text-white/30 flex-shrink-0" />
                      <span className="truncate">{client.company}</span>
                    </div>
                  )}

                  {client.address && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3 h-3 text-white/30 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1 text-white/40">{client.address}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                    {client.gstNumber && (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-mono px-2 py-0 border-white/10 bg-white/[0.02] text-white/50 rounded-md"
                      >
                        Tax: {client.gstNumber}
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="text-[10px] font-mono px-2 py-0 border-white/10 bg-white/[0.02] text-white/50 rounded-md"
                    >
                      {client.currency || 'USD'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Card Footer Metrics */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.06]">
                <div>
                  <div className="text-[10px] uppercase font-mono tracking-wider text-white/30 mb-0.5">Invoices</div>
                  <p className="text-sm font-light text-white font-mono">{client.totalInvoices || 0}</p>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-white/30 mb-0.5">Total Billed</div>
                  <p className="text-sm font-light text-white font-mono">
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