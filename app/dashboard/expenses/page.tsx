'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Receipt, Plus, Sparkles, Search, Filter, Calendar, DollarSign, Tag, TrendingUp, TrendingDown, ChartPie as PieChartIcon, CreditCard as Edit, Trash2, Recycle, X, Loader as Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  category: string;
  subcategory?: string;
  date: string;
  vendor?: string;
  notes?: string;
  isRecurring: boolean;
  recurringFrequency?: string;
  tags?: string[];
  aiCategorized: boolean;
  createdAt: string;
}

interface ExpenseSummary {
  total: number;
  count: number;
  categoryBreakdown: { [key: string]: number };
}

const CATEGORIES = [
  'Travel',
  'Food',
  'Office',
  'Equipment',
  'Software',
  'Marketing',
  'Professional',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Contractors',
  'Other',
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD'];

export default function ExpensesPage() {
  const { toast } = useToast();
  const { session } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<ExpenseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    currency: 'USD',
    category: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    notes: '',
    isRecurring: false,
    recurringFrequency: '',
  });

  useEffect(() => {
    if (session?.access_token) {
      fetchExpenses();
    }
  }, [session, selectedCategory]);

  const fetchExpenses = async () => {
    if (!session?.access_token) return;

    setLoading(true);
    try {
      let url = '/api/expenses';
      if (selectedCategory && selectedCategory !== 'all') {
        url += `?category=${selectedCategory}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses(data.expenses || []);
        setSummary(data.summary || null);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch expenses',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async () => {
    if (!session?.access_token) return;

    if (!formData.description || !formData.amount || !formData.date) {
      toast({
        title: 'Validation Error',
        description: 'Description, amount, and date are required',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Success',
          description: data.message,
        });
        setIsAddDialogOpen(false);
        resetForm();
        fetchExpenses();
      } else {
        throw new Error('Failed to add expense');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add expense',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditExpense = async () => {
    if (!session?.access_token || !editingExpense) return;

    setSaving(true);
    try {
      const response = await fetch('/api/expenses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: editingExpense.id,
          ...formData,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Expense updated successfully',
        });
        setIsEditDialogOpen(false);
        setEditingExpense(null);
        resetForm();
        fetchExpenses();
      } else {
        throw new Error('Failed to update expense');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update expense',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!session?.access_token) return;

    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const response = await fetch(`/api/expenses?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Expense deleted',
        });
        fetchExpenses();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete expense',
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      currency: expense.currency,
      category: expense.category,
      date: expense.date,
      vendor: expense.vendor || '',
      notes: expense.notes || '',
      isRecurring: expense.isRecurring,
      recurringFrequency: expense.recurringFrequency || '',
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      description: '',
      amount: '',
      currency: 'USD',
      category: '',
      date: new Date().toISOString().split('T')[0],
      vendor: '',
      notes: '',
      isRecurring: false,
      recurringFrequency: '',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Travel: '#3b82f6',
      Food: '#f59e0b',
      Office: '#8b5cf6',
      Equipment: '#ec4899',
      Software: '#06b6d4',
      Marketing: '#f97316',
      Professional: '#64748b',
      Utilities: '#14b8a6',
      Entertainment: '#a855f7',
      Healthcare: '#ef4444',
      Education: '#22c55e',
      Contractors: '#6366f1',
      Other: '#6b7280',
    };
    return colors[category] || colors.Other;
  };

  const filteredExpenses = expenses.filter(exp =>
    exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (exp.vendor && exp.vendor.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <p style={{ color: '#b3b3b3' }}>Loading expenses...</p>
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
            Expenses
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
            Track and categorize your business expenses with AI assistance
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
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" style={{ background: '#181818', border: '1px solid #4d4d4d' }}>
            <DialogHeader>
              <DialogTitle className="text-white">Add Expense</DialogTitle>
              <DialogDescription style={{ color: '#b3b3b3' }}>
                Enter expense details. AI will auto-categorize if no category is selected.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Description *</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="h-12 text-white"
                  style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  placeholder="e.g., Uber ride to client meeting"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Amount *</Label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="h-12 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Currency</Label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full h-12 px-3 text-white"
                    style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  >
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Category (leave empty for AI auto-categorization)</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-12 px-3 text-white"
                  style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                >
                  <option value="">Let AI categorize</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Date *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="h-12 text-white"
                  style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Vendor</Label>
                <Input
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="h-12 text-white"
                  style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                  placeholder="e.g., Uber, Starbucks"
                />
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
                onClick={handleAddExpense}
                disabled={saving}
                className="font-bold text-sm"
                style={{ background: '#1ed760', color: '#000', borderRadius: '9999px' }}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Expense'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-sm font-bold">
                <DollarSign className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{formatCurrency(summary.total)}</div>
              <p className="text-xs mt-1" style={{ color: '#b3b3b3' }}>{summary.count} transactions</p>
            </CardContent>
          </Card>

          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-sm font-bold">
                <TrendingUp className="w-4 h-4 mr-2" style={{ color: '#f59e0b' }} />
                Top Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-white">
                {Object.entries(summary.categoryBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
              </div>
              <p className="text-xs mt-1" style={{ color: '#b3b3b3' }}>
                {formatCurrency(Object.entries(summary.categoryBreakdown).sort((a, b) => b[1] - a[1])[0]?.[1] || 0)} spent
              </p>
            </CardContent>
          </Card>

          <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-sm font-bold">
                <Sparkles className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
                AI-Categorized
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {expenses.filter(e => e.aiCategorized).length}
              </div>
              <p className="text-xs mt-1" style={{ color: '#b3b3b3' }}>
                Auto-categorized expenses
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Breakdown */}
      {summary && Object.keys(summary.categoryBreakdown).length > 0 && (
        <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
          <CardHeader>
            <CardTitle className="text-white flex items-center text-sm font-bold">
              <PieChartIcon className="w-4 h-4 mr-2" style={{ color: '#1ed760' }} />
              Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(summary.categoryBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([category, amount]) => (
                  <div
                    key={category}
                    className="p-3 rounded-lg"
                    style={{ background: '#1f1f1f', borderLeft: `3px solid ${getCategoryColor(category)}` }}
                  >
                    <p className="text-xs font-bold" style={{ color: '#b3b3b3' }}>{category}</p>
                    <p className="text-lg font-bold text-white">{formatCurrency(amount)}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#b3b3b3' }} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 pl-10 text-white"
            style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
            placeholder="Search expenses..."
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-12 px-4 text-white min-w-[200px]"
          style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Expenses List */}
      <Card style={{ background: '#181818', border: '1px solid #4d4d4d', borderRadius: '8px' }}>
        <CardContent className="p-0">
          {filteredExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Receipt className="w-12 h-12 mb-4" style={{ color: '#4d4d4d' }} />
              <p className="text-lg font-bold text-white">No expenses yet</p>
              <p className="text-sm" style={{ color: '#b3b3b3' }}>
                Add your first expense to start tracking
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#4d4d4d' }}>
              {filteredExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ background: `${getCategoryColor(expense.category)}20` }}
                    >
                      <Receipt className="w-5 h-5" style={{ color: getCategoryColor(expense.category) }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-white">{expense.description}</p>
                        {expense.aiCategorized && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                            style={{ background: 'rgba(30,215,96,0.15)', color: '#1ed760', border: '1px solid rgba(30,215,96,0.3)' }}
                          >
                            <Sparkles className="w-3 h-3 mr-0.5" />
                            AI
                          </Badge>
                        )}
                        {expense.isRecurring && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                            style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }}
                          >
                            <Recycle className="w-3 h-3 mr-0.5" />
                            {expense.recurringFrequency}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            background: `${getCategoryColor(expense.category)}15`,
                            color: getCategoryColor(expense.category),
                            border: `1px solid ${getCategoryColor(expense.category)}30`
                          }}
                        >
                          {expense.category}
                          {expense.subcategory && ` / ${expense.subcategory}`}
                        </Badge>
                        <span className="text-xs" style={{ color: '#b3b3b3' }}>
                          {format(new Date(expense.date), 'MMM dd, yyyy')}
                        </span>
                        {expense.vendor && (
                          <span className="text-xs" style={{ color: '#b3b3b3' }}>
                            - {expense.vendor}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">{formatCurrency(expense.amount, expense.currency)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(expense)}
                        style={{ color: '#b3b3b3' }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteExpense(expense.id)}
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md" style={{ background: '#181818', border: '1px solid #4d4d4d' }}>
          <DialogHeader>
            <DialogTitle className="text-white">Edit Expense</DialogTitle>
            <DialogDescription style={{ color: '#b3b3b3' }}>
              Update expense details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="h-12 text-white"
                style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Amount</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="h-12 text-white"
                  style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Category</Label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-12 px-3 text-white"
                  style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Date</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="h-12 text-white"
                style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold" style={{ color: '#b3b3b3' }}>Vendor</Label>
              <Input
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="h-12 text-white"
                style={{ background: '#1f1f1f', border: '1px solid #4d4d4d', borderRadius: '8px' }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsEditDialogOpen(false)}
              style={{ color: '#b3b3b3' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditExpense}
              disabled={saving}
              className="font-bold text-sm"
              style={{ background: '#1ed760', color: '#000', borderRadius: '9999px' }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
