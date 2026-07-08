'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileText, Plus, Sparkles, Search, DollarSign, TrendingUp, Clock, CircleCheck as CheckCircle, Circle as XCircle, Eye, CreditCard as Edit, Trash2, Send, Copy, Loader as Loader2, Calendar, ArrowRight, CircleAlert as AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import Link from 'next/link';

interface Proposal {
  id: string;
  proposalNum: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  title: string;
  description?: string;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  amount: number;
  taxRate: number;
  discountRate: number;
  currency: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
  date: string;
  validUntil: string;
  terms?: string;
  notes?: string;
  aiSummary?: string;
  aiSuggestions?: string[];
  acceptedAt?: string;
  viewedAt?: string;
  createdAt: string;
}

interface ProposalSummary {
  total: number;
  count: number;
  accepted: number;
  pending: number;
  winRate: string;
}

export default function ProposalsPage() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [summary, setSummary] = useState<ProposalSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    title: '',
    description: '',
    items: [{ description: '', quantity: 1, rate: 0 }],
    taxRate: 0,
    discountRate: 0,
    currency: 'USD',
    validDays: 30,
    terms: '',
    notes: '',
    generateAI: true,
  });

  useEffect(() => {
    if (session?.access_token) {
      fetchProposals();
    }
  }, [session, selectedStatus]);

  const fetchProposals = async () => {
    if (!session?.access_token) return;

    setLoading(true);
    try {
      let url = '/api/proposals';
      if (selectedStatus && selectedStatus !== 'all') {
        url += `?status=${selectedStatus}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProposals(data.proposals || []);
        setSummary(data.summary || null);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch proposals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProposal = async () => {
    if (!session?.access_token) return;

    if (!formData.clientName || !formData.clientEmail || !formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Client name, email, and title are required',
        variant: 'destructive',
      });
      return;
    }

    if (formData.items.length === 0 || !formData.items[0].description) {
      toast({
        title: 'Validation Error',
        description: 'At least one item with description is required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Proposal created successfully',
        });
        setIsAddDialogOpen(false);
        resetForm();
        fetchProposals();
      } else {
        throw new Error('Failed to create proposal');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create proposal',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    if (!session?.access_token) return;

    try {
      const response = await fetch('/api/proposals', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Proposal marked as ${status}`,
        });
        fetchProposals();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update proposal',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProposal = async (id: string) => {
    if (!session?.access_token) return;

    if (!confirm('Are you sure you want to delete this proposal?')) return;

    try {
      const response = await fetch(`/api/proposals?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Proposal deleted',
        });
        fetchProposals();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete proposal',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientEmail: '',
      clientCompany: '',
      title: '',
      description: '',
      items: [{ description: '', quantity: 1, rate: 0 }],
      taxRate: 0,
      discountRate: 0,
      currency: 'USD',
      validDays: 30,
      terms: '',
      notes: '',
      generateAI: true,
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, rate: 0 }],
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.rate || 0)), 0);
    const discount = formData.discountRate ? (subtotal * formData.discountRate) / 100 : 0;
    const afterDiscount = subtotal - discount;
    const tax = formData.taxRate ? (afterDiscount * formData.taxRate) / 100 : 0;
    return afterDiscount + tax;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return '#1ed760';
      case 'declined': return '#ef4444';
      case 'sent': return '#3b82f6';
      case 'viewed': return '#f59e0b';
      case 'expired': return '#6b7280';
      default: return '#b3b3b3';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return CheckCircle;
      case 'declined': return XCircle;
      case 'sent': return Send;
      case 'viewed': return Eye;
      case 'expired': return Clock;
      default: return FileText;
    }
  };

  const filteredProposals = proposals.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.proposalNum.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#1ed760' }} />
          <p style={{ color: '#b3b3b3' }}>Loading proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            Proposals
            <Badge
              variant="outline"
              className="text-xs"
              style={{ background: 'rgba(30,215,96,0.15)', color: '#1ed760', border: '1px solid rgba(30,215,96,0.3)' }}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI Powered
            </Badge>
          </h1>
          <p className="text-base" style={{ color: '#b3b3b3' }}>
            Create and send professional proposals with AI assistance
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="font-bold text-sm"
              style={{ background: '#1ed760', color: '#000', borderRadius: '9999px', textTransform: 'uppercase', letterSpacing: '1.4px' }}
              onClick={() => resetForm()}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Proposal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" style={{ background: '#181818', border: '1px solid #4d4d4d' }}>
            <DialogHeader>
              <DialogTitle className="text-white">Create Proposal</DialogTitle>
              <DialogDescription style={{ color: '#b3b3b3' }}>
                Fill in the details. AI will generate a summary and suggestions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Client Name *</Label>
                  <Input
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="h-12 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                    placeholder="Client name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Client Email *</Label>
                  <Input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="h-12 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                    placeholder="client@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Proposal Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-12 text-white"
                  style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  placeholder="e.g., Website Redesign Project"
                />
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white">Line Items</Label>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="flex-1 h-10 text-white"
                      style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                      placeholder="Description"
                    />
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-20 h-10 text-white"
                      style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                      placeholder="Qty"
                    />
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      className="w-28 h-10 text-white"
                      style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                      placeholder="Rate"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      className="h-10 w-10"
                      style={{ color: '#ef4444' }}
                      disabled={formData.items.length === 1}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addItem}
                  className="w-full h-10"
                  style={{ border: '1px dashed #4d4d4d', color: '#b3b3b3' }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                    className="h-12 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Discount (%)</Label>
                  <Input
                    type="number"
                    value={formData.discountRate}
                    onChange={(e) => setFormData({ ...formData, discountRate: parseFloat(e.target.value) || 0 })}
                    className="h-12 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Valid For (Days)</Label>
                  <Input
                    type="number"
                    value={formData.validDays}
                    onChange={(e) => setFormData({ ...formData, validDays: parseInt(e.target.value) || 30 })}
                    className="h-12 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  />
                </div>
              </div>

              {/* Total */}
              <div className="p-4 rounded-lg text-right" style={{ background: '#1f1f1f' }}>
                <span className="text-sm" style={{ color: '#b3b3b3' }}>Total: </span>
                <span className="text-2xl font-bold text-white">{formatCurrency(calculateTotal(), formData.currency)}</span>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="text-white"
                  style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setIsAddDialogOpen(false)}
                style={{ color: '#b3b3b3' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddProposal}
                disabled={saving}
                className="font-bold text-sm"
                style={{ background: '#1ed760', color: '#000', borderRadius: '9999px' }}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Proposal'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-sm font-bold">
                <DollarSign className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatCurrency(summary.total)}</div>
              <p className="text-xs mt-1" style={{ color: '#b3b3b3' }}>{summary.count} proposals</p>
            </CardContent>
          </Card>

          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-sm font-bold">
                <CheckCircle className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
                Accepted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{summary.accepted}</div>
              <p className="text-xs mt-1" style={{ color: '#b3b3b3' }}>Win rate: {summary.winRate}%</p>
            </CardContent>
          </Card>

          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-sm font-bold">
                <Clock className="w-4 h-4 mr-2" style={{ color: '#f59e0b' }} />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{summary.pending}</div>
              <p className="text-xs mt-1" style={{ color: '#b3b3b3' }}>Awaiting response</p>
            </CardContent>
          </Card>

          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-sm font-bold">
                <TrendingUp className="w-4 h-4 mr-2" style={{ color: '#3b82f6' }} />
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{summary.winRate}%</div>
              <p className="text-xs mt-1" style={{ color: '#b3b3b3' }}>Acceptance rate</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#b3b3b3' }} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-10 text-white"
            style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
            placeholder="Search proposals..."
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-12 px-4 text-white min-w-[200px]"
          style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="viewed">Viewed</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Proposals List */}
      <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
        <CardContent className="p-0">
          {filteredProposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-12 h-12 mb-4" style={{ color: '#4d4d4d' }} />
              <p className="text-lg font-bold text-white">No proposals yet</p>
              <p className="text-sm" style={{ color: '#b3b3b3' }}>
                Create your first proposal to start winning more business
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#4d4d4d' }}>
              {filteredProposals.map((proposal) => {
                const StatusIcon = getStatusIcon(proposal.status);
                const statusColor = getStatusColor(proposal.status);
                const isExpired = new Date(proposal.validUntil) < new Date() && proposal.status === 'sent';

                return (
                  <div
                    key={proposal.id}
                    className="p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center"
                          style={{ background: `${statusColor}20` }}
                        >
                          <StatusIcon className="w-5 h-5" style={{ color: statusColor }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-white">{proposal.title}</p>
                            {proposal.aiSummary && (
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1.5"
                                style={{ background: 'rgba(30,215,96,0.15)', color: '#1ed760', border: '1px solid rgba(30,215,96,0.3)' }}
                              >
                                <Sparkles className="w-3 h-3 mr-0.5" />
                                AI
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className="text-xs"
                              style={{
                                background: `${statusColor}15`,
                                color: statusColor,
                                border: `1px solid ${statusColor}30`
                              }}
                            >
                              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                            </Badge>
                            <span className="text-xs" style={{ color: '#b3b3b3' }}>
                              {proposal.proposalNum}
                            </span>
                            <span className="text-xs" style={{ color: '#b3b3b3' }}>
                              for {proposal.clientName}
                            </span>
                            {isExpired && (
                              <Badge
                                variant="outline"
                                className="text-xs"
                                style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
                              >
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Expired
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">{formatCurrency(proposal.amount, proposal.currency)}</p>
                          <p className="text-xs" style={{ color: '#b3b3b3' }}>
                            Valid until {format(new Date(proposal.validUntil), 'MMM dd')}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {proposal.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStatusChange(proposal.id, 'sent')}
                              title="Send proposal"
                              style={{ color: '#3b82f6' }}
                            >
                              <Send className="w-4 h-4" />
                            </Button>
                          )}
                          {proposal.status === 'sent' && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(proposal.id, 'accepted')}
                                title="Mark as accepted"
                                style={{ color: '#1ed760' }}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStatusChange(proposal.id, 'declined')}
                                title="Mark as declined"
                                style={{ color: '#ef4444' }}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProposal(proposal.id)}
                            style={{ color: '#b3b3b3' }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {proposal.aiSummary && (
                      <div
                        className="mt-3 p-3 rounded-lg text-sm"
                        style={{ background: 'rgba(30,215,96,0.05)', border: '1px solid rgba(30,215,96,0.15)' }}
                      >
                        <p style={{ color: '#b3b3b3' }}>{proposal.aiSummary}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
