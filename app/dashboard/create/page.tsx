'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, Save, Eye, Send, CircleAlert as AlertCircle, User, FileText, Download, Crown, LayoutGrid as Layout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import jsPDF from 'jspdf';
import { PremiumPDFGenerator } from '@/lib/pdf-generator';
import { AiClientSelector } from '@/components/ai/smart-inputs/AiClientSelector';
import { AiInvoiceDescription } from '@/components/ai/smart-inputs/AiInvoiceDescription';
import TemplateSelector from '@/components/invoices/TemplateSelector';
import InvoiceRenderer from '@/components/invoices/templates/InvoiceRenderer';
import { InvoiceItem, Client } from '@/types/invoice';

// Modular Sub-components
import { SpecializedFields } from './components/SpecializedFields';
import { ThemeSelector } from './components/ThemeSelector';
import { ProfessionalFeatures } from './components/ProfessionalFeatures';
import { InvoiceFormHeader } from './components/InvoiceFormHeader';
import { InvoiceDetailsCard } from './components/InvoiceDetailsCard';
import { ClientInformationCard } from './components/ClientInformationCard';
import { InvoiceItemsCard } from './components/InvoiceItemsCard';
import { AdditionalInfoCard } from './components/AdditionalInfoCard';
import { InvoiceSidebarCards } from './components/InvoiceSidebarCards';
import { PreviewDialogs } from './components/PreviewDialogs';


export default function CreateInvoice() {
  const { toast } = useToast();
  const router = useRouter();
  const { session, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  const getEffectiveToken = useCallback(() => {
    if (session?.access_token) return session.access_token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth-token') || localStorage.getItem('token') || '';
    }
    return '';
  }, [session?.access_token]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [itemSuggestions, setItemSuggestions] = useState<any[]>([]);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);

  // Theme configuration (9 Modular Templates)
  const themeSchemes = useMemo(() => ({
    'luxury': { primary: '#111111', secondary: '#777777', accent: '#B89B5E', background: '#FFFFFF' },
    'minimal': { primary: '#000000', secondary: '#71717A', accent: '#18181B', background: '#FFFFFF' },
    'apple': { primary: '#1D1D1F', secondary: '#86868B', accent: '#0071E3', background: '#FFFFFF' },
    'stripe': { primary: '#635BFF', secondary: '#0A2540', accent: '#00D4B2', background: '#FFFFFF' },
    'amazon': { primary: '#FF9900', secondary: '#111111', accent: '#232F3E', background: '#FFFFFF' },
    'microsoft': { primary: '#0078D4', secondary: '#605E5C', accent: '#F3F2F1', background: '#FFFFFF' },
    'google': { primary: '#1A73E8', secondary: '#34A853', accent: '#FBBC05', background: '#FFFFFF' },
    'shopify': { primary: '#008060', secondary: '#202223', accent: '#5C6AC4', background: '#FFFFFF' },
    'custom': { primary: '#4F46E5', secondary: '#06B6D4', accent: '#10B981', background: '#FFFFFF' },

    // Backward compatibility aliases
    'ultra-luxury': { primary: '#1D1D1F', secondary: '#86868B', accent: '#0071E3', background: '#FFFFFF' },
    'financial': { primary: '#0A2540', secondary: '#635BFF', accent: '#00D4B2', background: '#FFFFFF' },
    'creative-agency': { primary: '#EC008C', secondary: '#000000', accent: '#F5F5F5', background: '#FFFFFF' },
    'professional-services': { primary: '#0078D4', secondary: '#605E5C', accent: '#F3F2F1', background: '#FFFFFF' }
  }), []);

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    clientAddress: '',
    clientGST: '',
    clientCurrency: '$',
    items: [
      { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
    ] as InvoiceItem[],
    notes: 'Thank you for your business!',
    terms: 'Payment due within 30 days',
    taxRate: 0,
    discountRate: 0,
    paymentLink: '',
    theme: 'apple' as any,
    customColors: { primary: '#1D1D1F', secondary: '#86868B', accent: '#0071E3', background: '#FFFFFF' },
    companyLogo: '',
    whiteLabelMode: false,
    invoiceType: 'sales' as any,
    // Specialized Fields (Phase 1 & 2)
    validityPeriod: '',
    estimatedDelivery: '',
    notForPaymentNote: false,
    projectName: '',
    projectId: '',
    milestoneDescription: '',
    percentComplete: 0,
    totalProjectValue: 0,
    previouslyInvoiced: 0,
    workPeriod: '',
    projectStartDate: '',
    projectEndDate: '',
    subscriptionPeriod: '',
    billingCycle: '',
    nextBillingDate: '',
    subscriptionDetails: '',
    autoRenewal: false,
    cancellationPolicy: '',
    originalInvoiceNumber: '',
    originalInvoiceDate: '',
    creditReason: '',
    originalDueDate: '',
    daysOverdue: 0,
    lateFeeAmount: 0,
    lateFeePercentage: 0,
    urgentNote: '',
    hsCode: '',
    countryOfOrigin: '',
    totalWeight: '',
    totalDimensions: '',
    shippingTerms: '',
    declaredValue: 0,
    exportLicenseNumber: '',
    destinationCountry: '',
    portOfLoading: '',
    portOfDischarge: '',
    sellerTaxId: '',
    buyerTaxId: '',
    taxBreakdown: [] as any[],
    totalTaxableAmount: 0,
    totalTaxAmount: 0,
    timeEntries: [] as any[],
    totalHours: 0,
    hourlyRate: 0,
    consultantName: '',
    timesheetPeriodStart: '',
    timesheetPeriodEnd: '',
    retainerPeriodStart: '',
    retainerPeriodEnd: '',
    servicesIncluded: [] as string[],
    retainerAmount: 0,
    unusedHours: 0,
    carryoverPolicy: '',
    retainerTerms: '',
    expenses: [] as any[],
    totalExpenses: 0,
    reimbursementMethod: '',
    employeeName: '',
    employeeId: '',
    approvedBy: '',
    approvalDate: ''
  });

  const totals = useMemo(() => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0);
    const discountAmount = invoiceData.discountRate ? (subtotal * invoiceData.discountRate) / 100 : 0;
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = invoiceData.taxRate ? (subtotalAfterDiscount * invoiceData.taxRate) / 100 : 0;
    const total = subtotalAfterDiscount + taxAmount;
    return { subtotal, discountAmount, taxAmount, total };
  }, [invoiceData.items, invoiceData.discountRate, invoiceData.taxRate]);

  const fetchClients = useCallback(async () => {
    try {
      const token = getEffectiveToken();
      const headers: Record<string, string> = { 'Cache-Control': 'no-cache' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/clients', {
        headers,
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setClients(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  }, [getEffectiveToken]);

  const generateInvoiceNumber = useCallback(async () => {
    try {
      const token = getEffectiveToken();
      const headers: Record<string, string> = { 'Cache-Control': 'no-cache' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/invoices/generate-number', {
        headers,
        credentials: 'include',
      });
      if (response.ok) {
        const { invoiceNumber } = await response.json();
        if (invoiceNumber) {
          setInvoiceData(prev => ({ ...prev, invoiceNumber }));
          return;
        }
      }
      setInvoiceData(prev => ({
        ...prev,
        invoiceNumber: prev.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`
      }));
    } catch (error) {
      console.error('Error generating invoice number:', error);
      setInvoiceData(prev => ({
        ...prev,
        invoiceNumber: prev.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`
      }));
    }
  }, [getEffectiveToken]);

  useEffect(() => {
    fetchClients();
    generateInvoiceNumber();

    const savedType = sessionStorage.getItem('invoiceType');
    const shouldPrefill = sessionStorage.getItem('prefillSampleData');
    if (savedType) {
      setInvoiceData(prev => ({ ...prev, invoiceType: savedType as any }));
    }
    if (shouldPrefill === 'true') {
      sessionStorage.removeItem('prefillSampleData');
      setInvoiceData(prev => ({
        ...prev,
        clientName: prev.clientName || 'NexaCorp Solutions Inc.',
        clientEmail: prev.clientEmail || 'billing@nexacorp.com',
        clientCompany: prev.clientCompany || 'NexaCorp Solutions',
        clientAddress: prev.clientAddress || '100 Silicon Way, Suite 500, San Francisco, CA',
        items: [
          { id: '1', description: 'Enterprise Full-Stack Application Development', quantity: 40, rate: 125, amount: 5000 },
          { id: '2', description: 'Cloud Infrastructure & Automated CI/CD Pipeline', quantity: 1, rate: 1850, amount: 1850 }
        ],
        taxRate: 10
      }));
    }

    const savedLogo = typeof window !== 'undefined' ? localStorage.getItem('savedCompanyLogo') : null;
    if (savedLogo) {
      setInvoiceData(prev => ({ ...prev, companyLogo: prev.companyLogo || savedLogo }));
    } else if (user?.avatar) {
      setInvoiceData(prev => ({ ...prev, companyLogo: prev.companyLogo || user.avatar || '' }));
    }
  }, [fetchClients, generateInvoiceNumber, user]);

  useEffect(() => {
    if (invoiceData.date && !invoiceData.dueDate) {
      const dueDate = new Date(invoiceData.date);
      dueDate.setDate(dueDate.getDate() + 30);
      setInvoiceData(prev => ({
        ...prev,
        dueDate: dueDate.toISOString().split('T')[0]
      }));
    }
  }, [invoiceData.date]);

  const fetchItemSuggestions = async (query: string) => {
    if (query.length < 2) {
      setItemSuggestions([]);
      return;
    }
    try {
      const token = getEffectiveToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/suggestions/items?q=${encodeURIComponent(query)}`, {
        headers,
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setItemSuggestions(Array.isArray(data) ? data.slice(0, 5) : []);
      }
    } catch (error) {
      console.error('Error fetching item suggestions:', error);
    }
  };

  const selectClient = useCallback((client: Client) => {
    setSelectedClient(client);
    setInvoiceData(prev => ({
      ...prev,
      clientName: client.name,
      clientEmail: client.email,
      clientCompany: client.company || '',
      clientAddress: client.address,
      clientGST: client.gstNumber || '',
      clientCurrency: client.currency || '$',
    }));
    setClientSearch(client.name);
  }, []);

  const handleClientSearch = useCallback((value: string) => {
    setClientSearch(value);
    setInvoiceData(prev => ({ ...prev, clientName: value }));
  }, []);

  const handleTemplateSelect = useCallback((type: any, style: any) => {
    const newColors = themeSchemes[style as keyof typeof themeSchemes] || invoiceData.customColors;
    setInvoiceData(prev => ({
      ...prev,
      invoiceType: type,
      theme: style || prev.theme,
      customColors: newColors
    }));
    setShowTemplateDialog(false);
  }, [themeSchemes, invoiceData.customColors]);

  const updateItem = useCallback((id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.rate);
          }
          return updatedItem;
        }
        return item;
      })
    }));
  }, []);

  const addItem = useCallback(() => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now().toString(), description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (!invoiceData.clientName.trim()) return 'Client name is required.';
    if (!invoiceData.dueDate || invoiceData.dueDate.trim() === '') return 'Due date is required.';
    if (!invoiceData.clientEmail.trim()) return 'Client email is required.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(invoiceData.clientEmail)) return 'Please enter a valid email address.';

    if (invoiceData.items.length === 0) return 'At least one invoice item is required.';

    for (let i = 0; i < invoiceData.items.length; i++) {
      const item = invoiceData.items[i];
      if (!item.description.trim()) return `Item ${i + 1} description is required.`;
      if (item.quantity <= 0) return `Item ${i + 1} quantity must be greater than 0.`;
      if (item.rate < 0) return `Item ${i + 1} rate cannot be negative.`;
    }
    return null;
  }, [invoiceData]);

  const previewData = useMemo(() => {
    const items = (invoiceData.items || []).map((item, idx) => {
      const qty = Number(item.quantity) || 1;
      const rate = Number(item.rate) || 0;
      const amt = item.amount !== undefined && item.amount !== null && !isNaN(Number(item.amount))
        ? Number(item.amount)
        : qty * rate;
      const desc = item.description && item.description.trim().length > 0
        ? item.description.trim()
        : (rate > 0 || qty > 1 ? `Service / Item ${idx + 1}` : 'Item');

      return {
        ...item,
        id: item.id || `item-${idx}`,
        description: desc,
        quantity: qty,
        rate: rate,
        amount: amt,
      };
    });

    const resolvedClientName = (invoiceData.clientName && invoiceData.clientName.trim())
      || (invoiceData.clientCompany && invoiceData.clientCompany.trim())
      || (clientSearch && clientSearch.trim())
      || '';

    return {
      ...invoiceData,
      items: items.length > 0 ? items : [{ id: '1', description: 'Item', quantity: 1, rate: 0, amount: 0 }],
      invoiceNumber: invoiceData.invoiceNumber || 'INV-0001',
      date: invoiceData.date || new Date().toISOString().split('T')[0],
      dueDate: invoiceData.dueDate || '',
      clientName: resolvedClientName,
      clientEmail: invoiceData.clientEmail || '',
      clientAddress: invoiceData.clientAddress || '',
      clientCompany: invoiceData.clientCompany || '',
      clientGST: invoiceData.clientGST || '',
      clientCurrency: invoiceData.clientCurrency || '$',
      subtotal: totals.subtotal,
      discountAmount: totals.discountAmount || 0,
      taxAmount: totals.taxAmount || 0,
      amount: totals.total,
      notes: invoiceData.notes || '',
      terms: invoiceData.terms || '',
      paymentLink: invoiceData.paymentLink || '',
      companyName: (invoiceData as any).companyName || user?.company || (user as any)?.businessName || (user as any)?.name || 'SmartInvoice',
      companyEmail: (invoiceData as any).companyEmail || user?.email || '',
      companyAddress: (invoiceData as any).companyAddress || (user as any)?.companyAddress || (user as any)?.address || '',
      companyPhone: (invoiceData as any).companyPhone || (user as any)?.companyPhone || (user as any)?.phone || '',
      companyGST: (invoiceData as any).companyGST || (user as any)?.companyGST || (user as any)?.gstNumber || '',
      companyWebsite: (invoiceData as any).companyWebsite || (user as any)?.companyWebsite || (user as any)?.website || '',
      companyLogo: invoiceData.companyLogo || (user as any)?.logoUrl || '',
      theme: invoiceData.theme || 'luxury',
      invoiceType: invoiceData.invoiceType || 'sales',
      customColors: invoiceData.customColors || (themeSchemes as any)[invoiceData.theme],
    };
  }, [invoiceData, clientSearch, totals, user, themeSchemes]);

  const handleQuickThemeChange = useCallback((newTheme: string) => {
    const colors = themeSchemes[newTheme as keyof typeof themeSchemes] || invoiceData.customColors;
    setInvoiceData(prev => ({
      ...prev,
      theme: newTheme as any,
      customColors: colors,
    }));
  }, [themeSchemes, invoiceData.customColors]);

  const handlePreviewInModal = useCallback(() => {
    setShowPreviewDialog(true);
  }, []);

  const handleSave = async (status: 'draft' | 'sent' = 'draft') => {
    const error = validateForm();
    if (error) {
      toast({ title: 'Validation Error', description: error, variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const token = getEffectiveToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({
          ...invoiceData,
          subtotal: totals.subtotal,
          discountAmount: totals.discountAmount,
          taxAmount: totals.taxAmount,
          amount: totals.total,
          status,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({ title: 'Success', description: result.message || `Invoice ${status === 'sent' ? 'created & sent' : 'saved as draft'} successfully` });
        router.push('/dashboard/invoices');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save invoice');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    const error = validateForm();
    if (error) {
      toast({ title: 'Validation Error', description: error, variant: 'destructive' });
      return;
    }

    setPreviewLoading(true);
    try {
      const tempInvoiceData = {
        ...invoiceData,
        subtotal: totals.subtotal,
        discountAmount: totals.discountAmount,
        taxAmount: totals.taxAmount,
        amount: totals.total,
      };

      const token = getEffectiveToken();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('/api/invoices/preview', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(tempInvoiceData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `preview-${invoiceData.invoiceType}-${invoiceData.invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to generate preview');
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSimplePDF = () => {
    const error = validateForm();
    if (error) {
      toast({ title: 'Validation Error', description: error, variant: 'destructive' });
      return;
    }

    try {
      toast({ title: 'Generating PDF', description: 'Your PDF is being generated...' });
      const generator = new PremiumPDFGenerator();
      const pdfBuffer = generator.generatePDF({
        invoiceNumber: invoiceData.invoiceNumber || 'INV-0001',
        date: invoiceData.date,
        dueDate: invoiceData.dueDate,
        clientName: invoiceData.clientName,
        clientEmail: invoiceData.clientEmail,
        clientCompany: invoiceData.clientCompany,
        clientAddress: invoiceData.clientAddress,
        clientGST: invoiceData.clientGST,
        clientCurrency: invoiceData.clientCurrency || '$',
        items: invoiceData.items,
        notes: invoiceData.notes,
        terms: invoiceData.terms,
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        discountAmount: totals.discountAmount,
        amount: totals.total,
        taxRate: invoiceData.taxRate,
        discountRate: invoiceData.discountRate,
        paymentLink: invoiceData.paymentLink,
        companyName: user?.company || (user as any)?.name || 'SmartInvoice',
        companyAddress: (user as any)?.companyAddress || (user as any)?.address || '',
        companyGST: (user as any)?.companyGST || (user as any)?.gstNumber || '',
        companyEmail: user?.email || '',
        companyLogo: invoiceData.companyLogo || undefined,
        whiteLabelMode: invoiceData.whiteLabelMode || false,
        theme: invoiceData.theme || 'ultra-luxury',
        invoiceType: invoiceData.invoiceType || 'sales',
        customColors: invoiceData.customColors
      });

      const blob = new Blob([pdfBuffer as BlobPart], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceData.invoiceNumber || 'draft'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: 'Success!', description: 'Invoice PDF downloaded successfully.' });
    } catch (e: any) {
      console.error('PDF Download Error:', e);
      toast({ title: 'Error', description: 'Failed to generate PDF invoice.', variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      <InvoiceFormHeader
        setShowTemplateDialog={setShowTemplateDialog}
        handleSimplePDF={handleSimplePDF}
        handleSave={handleSave}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <InvoiceDetailsCard invoiceData={invoiceData} setInvoiceData={setInvoiceData} />

          <SpecializedFields
            invoiceType={invoiceData.invoiceType}
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
          />

          <Card className="rounded-2xl border border-white/[0.08] bg-[#181818]">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/60">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-white/40 font-mono">Document Format</p>
                    <Select
                      value={invoiceData.invoiceType}
                      onValueChange={(val: any) => {
                        sessionStorage.setItem('invoiceType', val);
                        setInvoiceData(prev => ({ ...prev, invoiceType: val }));
                      }}
                    >
                      <SelectTrigger className="h-6 text-sm bg-transparent border-0 p-0 text-white font-medium capitalize focus:ring-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                        <SelectItem value="sales">Sales Invoice</SelectItem>
                        <SelectItem value="proforma">Proforma Invoice</SelectItem>
                        <SelectItem value="interim">Interim Invoice</SelectItem>
                        <SelectItem value="final">Final Invoice</SelectItem>
                        <SelectItem value="recurring">Recurring Invoice</SelectItem>
                        <SelectItem value="credit-note">Credit Note</SelectItem>
                        <SelectItem value="past-due">Past Due Invoice</SelectItem>
                        <SelectItem value="commercial">Commercial Invoice</SelectItem>
                        <SelectItem value="tax">Tax Invoice (VAT/GST)</SelectItem>
                        <SelectItem value="timesheet">Timesheet Invoice</SelectItem>
                        <SelectItem value="retainer">Retainer Invoice</SelectItem>
                        <SelectItem value="expense">Expense Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/dashboard/create/select-type')}
                  className="rounded-full border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-white text-xs h-8 px-3"
                >
                  Visual Selector
                </Button>
              </div>
            </CardContent>
          </Card>

          <ThemeSelector
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
            themeSchemes={themeSchemes}
          />

          <ProfessionalFeatures
            user={user}
            token={getEffectiveToken()}
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
            loading={loading}
            setLoading={setLoading}
            toast={toast}
          />

          <ClientInformationCard
            invoiceData={invoiceData}
            setInvoiceData={setInvoiceData}
            clients={clients}
            selectClient={selectClient}
            clientSearch={clientSearch}
            handleClientSearch={handleClientSearch}
          />

          <InvoiceItemsCard
            invoiceData={invoiceData}
            addItem={addItem}
            updateItem={updateItem}
            removeItem={removeItem}
            fetchItemSuggestions={fetchItemSuggestions}
            itemSuggestions={itemSuggestions}
            setItemSuggestions={setItemSuggestions}
          />

          <AdditionalInfoCard invoiceData={invoiceData} setInvoiceData={setInvoiceData} />
        </div>

        <InvoiceSidebarCards
          invoiceData={invoiceData}
          setInvoiceData={setInvoiceData}
          totals={totals}
          handlePreviewInModal={handlePreviewInModal}
          handlePreview={handlePreview}
          loading={loading}
          previewLoading={previewLoading}
        />
      </div>

      <PreviewDialogs
        showPreviewDialog={showPreviewDialog}
        setShowPreviewDialog={setShowPreviewDialog}
        showTemplateDialog={showTemplateDialog}
        setShowTemplateDialog={setShowTemplateDialog}
        invoiceData={previewData}
        handleTemplateSelect={handleTemplateSelect}
        handlePreview={handlePreview}
        previewLoading={previewLoading}
        onThemeChange={handleQuickThemeChange}
        themeSchemes={themeSchemes}
      />
    </div>
  );
}
