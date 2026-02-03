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
import { Plus, Trash2, Save, Eye, Send, AlertCircle, User, FileText, Download, Sparkles, Layout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import jsPDF from 'jspdf';
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
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearch, setClientSearch] = useState('');
  const [itemSuggestions, setItemSuggestions] = useState<any[]>([]);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);

  // Theme configuration
  const themeSchemes = useMemo(() => ({
    'ultra-luxury': { primary: '#000000', secondary: '#333333', accent: '#666666', background: '#ffffff' },
    'microsoft': { primary: '#0078D4', secondary: '#605E5C', accent: '#F3F2F1', background: '#ffffff' },
    'amazon': { primary: '#FF9900', secondary: '#111111', accent: '#232F3E', background: '#ffffff' },
    'financial': { primary: '#000000', secondary: '#1A1A1A', accent: '#FFFFFF', background: '#ffffff' },
    'creative-agency': { primary: '#EC008C', secondary: '#000000', accent: '#F5F5F5', background: '#ffffff' },
    'professional-services': { primary: '#002147', secondary: '#868E96', accent: '#F8F9FA', background: '#ffffff' }
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
    theme: 'ultra-luxury' as any,
    customColors: themeSchemes['ultra-luxury'],
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

  useEffect(() => {
    if (token) {
      fetchClients();
      generateInvoiceNumber();
    }

    const savedType = sessionStorage.getItem('invoiceType');
    if (savedType) {
      setInvoiceData(prev => ({ ...prev, invoiceType: savedType as any }));
    }
  }, [token]);

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

  const fetchClients = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/clients', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const generateInvoiceNumber = async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/invoices/generate-number', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const { invoiceNumber } = await response.json();
        setInvoiceData(prev => ({ ...prev, invoiceNumber }));
      }
    } catch (error) {
      console.error('Error generating invoice number:', error);
    }
  };

  const fetchItemSuggestions = async (query: string) => {
    if (query.length < 2 || !token) {
      setItemSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`/api/suggestions/items?q=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setItemSuggestions(data.slice(0, 5));
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

  const handlePreviewInModal = useCallback(() => {
    const error = validateForm();
    if (error) {
      toast({ title: 'Validation Error', description: error, variant: 'destructive' });
      return;
    }
    setShowPreviewDialog(true);
  }, [validateForm, toast]);

  const handleSave = async (status: 'draft' | 'sent' = 'draft') => {
    const error = validateForm();
    if (error) {
      toast({ title: 'Validation Error', description: error, variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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

      const response = await fetch('/api/invoices/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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

    toast({ title: 'Generating PDF', description: 'Your PDF is being generated...' });
    const doc = new jsPDF();
    const currency = invoiceData.clientCurrency || '$';

    doc.setFontSize(16);
    doc.text('INVOICE', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoiceData.invoiceNumber || 'N/A'}`, 10, 40);
    doc.text(`Date: ${invoiceData.date}`, 10, 50);
    doc.text(`Due Date: ${invoiceData.dueDate}`, 10, 60);

    doc.text(`To: ${invoiceData.clientName || 'N/A'}`, 10, 80);
    doc.text(`Email: ${invoiceData.clientEmail || 'N/A'}`, 10, 90);
    doc.text(`Company: ${invoiceData.clientCompany || 'N/A'}`, 10, 100);

    let y = 120;
    doc.setFontSize(14);
    doc.text('Items:', 10, y);
    y += 10;
    doc.setFontSize(12);
    invoiceData.items.forEach((item) => {
      doc.text(
        `${item.description || 'N/A'} | Qty: ${item.quantity} | Rate: ${currency}${item.rate} | Amount: ${currency}${item.amount.toFixed(2)}`,
        10,
        y
      );
      y += 8;
    });

    y += 10;
    doc.setFontSize(14);
    doc.text(`Subtotal: ${currency}${totals.subtotal.toFixed(2)}`, 130, y);
    y += 8;
    if (invoiceData.discountRate > 0) {
      doc.text(`Discount (${invoiceData.discountRate}%): -${currency}${totals.discountAmount.toFixed(2)}`, 130, y);
      y += 8;
    }
    if (invoiceData.taxRate > 0) {
      doc.text(`Tax (${invoiceData.taxRate}%): ${currency}${totals.taxAmount.toFixed(2)}`, 130, y);
      y += 10;
    }
    doc.text(`Total: ${currency}${totals.total.toFixed(2)}`, 130, y);

    if (invoiceData.notes) {
      y += 20;
      doc.setFontSize(12);
      doc.text('Notes:', 10, y);
      y += 7;
      doc.text(invoiceData.notes, 10, y);
    }

    doc.save(`invoice-${invoiceData.invoiceNumber || 'N/A'}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24">
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

          <Card className="card-green-mist animate-slide-in border-green-500/30" style={{ animationDelay: '0.03s' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-green-primary" />
                  <div>
                    <p className="text-xs text-green-muted">Invoice Type</p>
                    <p className="text-sm font-semibold text-white capitalize">
                      {invoiceData.invoiceType.replace('-', ' ')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/dashboard/create/select-type')}
                  className="btn-green-secondary text-xs"
                >
                  Change Type
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
            token={token || ''}
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
        invoiceData={invoiceData}
        handleTemplateSelect={handleTemplateSelect}
        handlePreview={handlePreview}
        previewLoading={previewLoading}
      />
    </div>
  );
}
