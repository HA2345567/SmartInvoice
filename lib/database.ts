import { neon } from '@neondatabase/serverless';

// Singleton Neon SQL client to reuse HTTP connections across queries
const connectionString = process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@ep-placeholder.neon.tech/neondb';
const sql = neon(connectionString);

export const supabase: any = null;

function getSql() {
  return sql;
}

export interface Invoice {
  id: string;
  userId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  clientAddress: string;
  clientGST?: string;
  clientCurrency: string;
  amount: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  date: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  paymentNotes?: string;
  items: any[];
  notes?: string;
  terms?: string;
  taxRate: number;
  discountRate: number;
  paymentLink?: string;
  emailSent: boolean;
  remindersSent: number;
  lastReminderSent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string;
  company?: string;
  address: string;
  gstNumber?: string;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export class DatabaseService {
  private static transformUserToCamelCase(data: any): any {
    if (!data) return null;
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      company: data.company,
      companyAddress: data.company_address || data.address,
      companyGST: data.company_gst || data.gstnumber,
      companyPhone: data.company_phone || data.phone,
      companyWebsite: data.company_website,
      avatar: data.avatar,
      createdAt: data.createdat || data.created_at,
      updatedAt: data.updatedat || data.updated_at,
      password: data.password
    };
  }

  private static transformClientToCamelCase(data: any): Client | null {
    if (!data) return null;
    return {
      id: data.id,
      userId: data.userid || data.user_id,
      name: data.name,
      email: data.email,
      company: data.company,
      address: data.address,
      gstNumber: data.gstnumber || data.gst_number,
      currency: data.currency || 'USD',
      isActive: data.isactive ?? true,
      createdAt: data.createdat || data.created_at,
      updatedAt: data.updatedat || data.updated_at,
    };
  }

  private static transformInvoiceToCamelCase(data: any): any {
    if (!data) return null;
    let items = data.items;
    if (typeof items === 'string') {
      try {
        items = JSON.parse(items);
      } catch (e) {
        items = [];
      }
    }
    return {
      id: data.id,
      userId: data.userid || data.user_id,
      invoiceNumber: data.invoicenumber || data.invoice_number,
      clientId: data.clientid || data.client_id,
      clientName: data.clientname || data.client_name,
      clientEmail: data.clientemail || data.client_email,
      clientCompany: data.clientcompany || data.client_company,
      clientAddress: data.clientaddress || data.client_address,
      clientGST: data.clientgst || data.client_gst,
      clientCurrency: data.clientcurrency || data.client_currency || 'USD',
      amount: parseFloat(data.amount || 0),
      subtotal: parseFloat(data.subtotal || 0),
      taxAmount: parseFloat(data.taxamount || data.tax_amount || 0),
      discountAmount: parseFloat(data.discountamount || data.discount_amount || 0),
      status: data.status || 'draft',
      date: data.date,
      dueDate: data.duedate || data.due_date,
      paidDate: data.paiddate || data.paid_date,
      paymentMethod: data.paymentmethod || data.payment_method,
      paymentNotes: data.paymentnotes || data.payment_notes,
      items: Array.isArray(items) ? items : [],
      notes: data.notes,
      terms: data.terms,
      taxRate: parseFloat(data.taxrate || data.tax_rate || 0),
      discountRate: parseFloat(data.discountrate || data.discount_rate || 0),
      paymentLink: data.paymentlink || data.payment_link,
      theme: data.theme || 'ultra-luxury',
      invoiceType: data.invoicetype || data.invoice_type || 'sales',
      customColors: typeof data.customcolors === 'string' ? JSON.parse(data.customcolors) : data.customcolors || null,
      emailSent: data.emailsent ?? false,
      remindersSent: data.reminderssent ?? 0,
      lastReminderSent: data.lastremindersent,
      createdAt: data.createdat || data.created_at,
      updatedAt: data.updatedat || data.updated_at,
    };
  }

  // User operations
  static async createUser(userData: {
    email: string;
    password?: string;
    name: string;
    company?: string;
  }): Promise<{ user: any; exists: boolean }> {
    try {
      const sql = getSql();
      const existing = await sql`SELECT * FROM users WHERE LOWER(email) = ${userData.email.toLowerCase()} LIMIT 1`;
      
      if (existing && existing.length > 0) {
        const transformed = this.transformUserToCamelCase(existing[0]);
        const { password, ...userWithoutPassword } = transformed;
        return { user: userWithoutPassword, exists: true };
      }

      const userId = crypto.randomUUID();
      const now = new Date().toISOString();

      const result = await sql`
        INSERT INTO users (id, email, password, name, company, createdat, updatedat)
        VALUES (${userId}, ${userData.email.toLowerCase()}, ${userData.password || ''}, ${userData.name}, ${userData.company || null}, ${now}, ${now})
        RETURNING *
      `;

      const transformed = this.transformUserToCamelCase(result[0]);
      const { password, ...userWithoutPassword } = transformed;
      return { user: userWithoutPassword, exists: false };
    } catch (error) {
      console.error('Error creating user in Neon DB:', error);
      throw error;
    }
  }

  static async getUserByEmail(email: string): Promise<any | null> {
    try {
      const sql = getSql();
      const users = await sql`SELECT * FROM users WHERE LOWER(email) = ${email.toLowerCase()} LIMIT 1`;
      if (!users || users.length === 0) return null;
      return this.transformUserToCamelCase(users[0]);
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  static async getUserById(id: string): Promise<any | null> {
    try {
      const sql = getSql();
      const users = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
      if (!users || users.length === 0) return null;
      return this.transformUserToCamelCase(users[0]);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  // Client operations
  static async createClient(userId: string, clientData: Omit<Client, 'id' | 'userId' | 'isActive' | 'createdAt' | 'updatedAt'>): Promise<Client> {
    try {
      const sql = getSql();
      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      const result = await sql`
        INSERT INTO clients (id, userid, name, email, company, address, gstnumber, currency, isactive, createdat, updatedat)
        VALUES (${id}, ${userId}, ${clientData.name}, ${clientData.email.toLowerCase()}, ${clientData.company || null}, ${clientData.address || ''}, ${clientData.gstNumber || null}, ${clientData.currency || 'USD'}, true, ${now}, ${now})
        RETURNING *
      `;

      return this.transformClientToCamelCase(result[0])!;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  static async getClients(userId: string): Promise<Client[]> {
    try {
      const sql = getSql();
      const clients = await sql`SELECT * FROM clients WHERE userid = ${userId} ORDER BY createdat DESC`;
      const invoices = await sql`SELECT clientid, amount FROM invoices WHERE userid = ${userId}`;
      
      const invoiceCounts: Record<string, number> = {};
      const invoiceTotals: Record<string, number> = {};
      (invoices || []).forEach(inv => {
        if (inv.clientid) {
          invoiceCounts[inv.clientid] = (invoiceCounts[inv.clientid] || 0) + 1;
          invoiceTotals[inv.clientid] = (invoiceTotals[inv.clientid] || 0) + (parseFloat(inv.amount) || 0);
        }
      });

      return (clients || []).map(c => {
        const transformed = this.transformClientToCamelCase(c)!;
        return {
          ...transformed,
          totalInvoices: invoiceCounts[c.id] || 0,
          totalAmount: invoiceTotals[c.id] || 0,
        };
      });
    } catch (error) {
      console.error('Error getting clients:', error);
      return [];
    }
  }

  static async getClientById(userId: string, id: string): Promise<Client | null> {
    try {
      const sql = getSql();
      const clients = await sql`SELECT * FROM clients WHERE userid = ${userId} AND id = ${id} LIMIT 1`;
      if (!clients || clients.length === 0) return null;
      return this.transformClientToCamelCase(clients[0]);
    } catch (error) {
      console.error('Error getting client by id:', error);
      return null;
    }
  }

  static async updateClient(userId: string, id: string, updates: any): Promise<Client | null> {
    try {
      const sql = getSql();
      const existing = await this.getClientById(userId, id);
      if (!existing) return null;

      const name = updates.name ?? existing.name;
      const email = updates.email ? updates.email.toLowerCase() : existing.email;
      const company = updates.company ?? existing.company;
      const address = updates.address ?? existing.address;
      const gstNumber = updates.gstNumber ?? existing.gstNumber;
      const currency = updates.currency ?? existing.currency;
      const isActive = updates.isActive ?? existing.isActive;
      const now = new Date().toISOString();

      const result = await sql`
        UPDATE clients
        SET name = ${name}, email = ${email}, company = ${company}, address = ${address},
            gstnumber = ${gstNumber}, currency = ${currency}, isactive = ${isActive}, updatedat = ${now}
        WHERE userid = ${userId} AND id = ${id}
        RETURNING *
      `;

      return this.transformClientToCamelCase(result[0]);
    } catch (error) {
      console.error('Error updating client:', error);
      return null;
    }
  }

  static async deleteClient(userId: string, id: string): Promise<boolean> {
    try {
      const sql = getSql();
      await sql`DELETE FROM clients WHERE userid = ${userId} AND id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      return false;
    }
  }

  static async clientHasInvoices(userId: string, clientId: string): Promise<boolean> {
    try {
      const sql = getSql();
      const invoices = await sql`SELECT id FROM invoices WHERE userid = ${userId} AND clientid = ${clientId} LIMIT 1`;
      return invoices && invoices.length > 0;
    } catch (error) {
      console.error('Error checking client invoices:', error);
      return false;
    }
  }

  // Invoice operations
  static async createInvoice(userId: string, invoiceData: any): Promise<any> {
    try {
      const sql = getSql();
      const clientId = await this.getOrCreateClientId(userId, invoiceData.clientEmail, {
        name: invoiceData.clientName,
        address: invoiceData.clientAddress,
        company: invoiceData.clientCompany,
        gstNumber: invoiceData.clientGST || invoiceData.clientGst,
        currency: invoiceData.clientCurrency
      });

      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      const itemsJson = JSON.stringify(invoiceData.items || []);

      const result = await sql`
        INSERT INTO invoices (
          id, userid, invoicenumber, clientid, clientname, clientemail, clientcompany, clientaddress, clientgst, clientcurrency,
          amount, subtotal, taxamount, discountamount, status, date, duedate, items, notes, terms, taxrate, discountrate, emailsent, reminderssent, theme, invoicetype, customcolors, createdat, updatedat
        ) VALUES (
          ${id}, ${userId}, ${invoiceData.invoiceNumber}, ${clientId}, ${invoiceData.clientName}, ${invoiceData.clientEmail.toLowerCase()},
          ${invoiceData.clientCompany || null}, ${invoiceData.clientAddress || ''}, ${invoiceData.clientGST || invoiceData.clientGst || null},
          ${invoiceData.clientCurrency || 'USD'}, ${invoiceData.amount || 0}, ${invoiceData.subtotal || 0}, ${invoiceData.taxAmount || 0},
          ${invoiceData.discountAmount || 0}, ${invoiceData.status || 'draft'}, ${invoiceData.date || now.split('T')[0]}, ${invoiceData.dueDate || now.split('T')[0]},
          ${itemsJson}, ${invoiceData.notes || null}, ${invoiceData.terms || null}, ${invoiceData.taxRate || 0}, ${invoiceData.discountRate || 0}, false, 0,
          ${invoiceData.theme || 'ultra-luxury'}, ${invoiceData.invoiceType || 'sales'}, ${invoiceData.customColors ? JSON.stringify(invoiceData.customColors) : null}, ${now}, ${now}
        )
        RETURNING *
      `;

      return this.transformInvoiceToCamelCase(result[0]);
    } catch (error) {
      console.error('Error creating invoice in Neon DB:', error);
      throw error;
    }
  }

  private static async getOrCreateClientId(userId: string, email: string, clientData?: any): Promise<string> {
    try {
      const sql = getSql();
      const existing = await sql`SELECT id FROM clients WHERE userid = ${userId} AND LOWER(email) = ${email.toLowerCase()} LIMIT 1`;
      if (existing && existing.length > 0) {
        return existing[0].id;
      }

      const newClient = await this.createClient(userId, {
        email,
        name: clientData?.name || 'N/A',
        address: clientData?.address || 'N/A',
        company: clientData?.company,
        gstNumber: clientData?.gstNumber,
        currency: clientData?.currency || 'USD'
      });
      return newClient.id;
    } catch (error) {
      console.error('Error getting or creating client id:', error);
      throw error;
    }
  }

  static async getInvoices(userId: string): Promise<any[]> {
    try {
      const sql = getSql();
      const invoices = await sql`SELECT * FROM invoices WHERE userid = ${userId} ORDER BY createdat DESC`;
      return (invoices || []).map(inv => this.transformInvoiceToCamelCase(inv));
    } catch (error) {
      console.error('Error getting invoices:', error);
      return [];
    }
  }

  static async getInvoiceById(userId: string, id: string): Promise<any | null> {
    try {
      const sql = getSql();
      const invoices = await sql`SELECT * FROM invoices WHERE userid = ${userId} AND id = ${id} LIMIT 1`;
      if (!invoices || invoices.length === 0) return null;
      return this.transformInvoiceToCamelCase(invoices[0]);
    } catch (error) {
      console.error('Error getting invoice by id:', error);
      return null;
    }
  }

  static async getPublicInvoiceById(id: string): Promise<any | null> {
    try {
      const sql = getSql();
      const invoices = await sql`SELECT * FROM invoices WHERE id = ${id} LIMIT 1`;
      if (!invoices || invoices.length === 0) return null;
      return this.transformInvoiceToCamelCase(invoices[0]);
    } catch (error) {
      console.error('Error getting public invoice by id:', error);
      return null;
    }
  }

  static async updateInvoice(userId: string, id: string, updates: any): Promise<any | null> {
    try {
      const sql = getSql();
      const existing = await this.getInvoiceById(userId, id);
      if (!existing) return null;

      const invoiceNumber = updates.invoiceNumber ?? existing.invoiceNumber;
      const clientName = updates.clientName ?? existing.clientName;
      const clientEmail = updates.clientEmail ? updates.clientEmail.toLowerCase() : existing.clientEmail;
      const clientCompany = updates.clientCompany ?? existing.clientCompany;
      const clientAddress = updates.clientAddress ?? existing.clientAddress;
      const clientGst = updates.clientGST || updates.clientGst || existing.clientGST;
      const clientCurrency = updates.clientCurrency ?? existing.clientCurrency;
      const amount = updates.amount ?? existing.amount;
      const subtotal = updates.subtotal ?? existing.subtotal;
      const taxAmount = updates.taxAmount ?? existing.taxAmount;
      const discountAmount = updates.discountAmount ?? existing.discountAmount;
      const status = updates.status ?? existing.status;
      const date = updates.date ?? existing.date;
      const dueDate = updates.dueDate ?? existing.dueDate;
      const paidDate = updates.paidDate ?? existing.paidDate;
      const paymentMethod = updates.paymentMethod ?? existing.paymentMethod;
      const paymentNotes = updates.paymentNotes ?? existing.paymentNotes;
      const itemsJson = updates.items ? JSON.stringify(updates.items) : JSON.stringify(existing.items);
      const notes = updates.notes ?? existing.notes;
      const terms = updates.terms ?? existing.terms;
      const taxRate = updates.taxRate ?? existing.taxRate;
      const discountRate = updates.discountRate ?? existing.discountRate;
      const paymentLink = updates.paymentLink ?? existing.paymentLink;
      const emailSent = updates.emailSent ?? existing.emailSent;
      const remindersSent = updates.remindersSent ?? existing.remindersSent;
      const lastReminderSent = updates.lastReminderSent ?? existing.lastReminderSent;
      const now = new Date().toISOString();

      const result = await sql`
        UPDATE invoices
        SET invoicenumber = ${invoiceNumber}, clientname = ${clientName}, clientemail = ${clientEmail},
            clientcompany = ${clientCompany}, clientaddress = ${clientAddress}, clientgst = ${clientGst},
            clientcurrency = ${clientCurrency}, amount = ${amount}, subtotal = ${subtotal}, taxamount = ${taxAmount},
            discountamount = ${discountAmount}, status = ${status}, date = ${date}, duedate = ${dueDate},
            paiddate = ${paidDate}, paymentmethod = ${paymentMethod}, paymentnotes = ${paymentNotes},
            items = ${itemsJson}, notes = ${notes}, terms = ${terms}, taxrate = ${taxRate}, discountrate = ${discountRate},
            paymentlink = ${paymentLink}, emailsent = ${emailSent}, reminderssent = ${remindersSent},
            lastremindersent = ${lastReminderSent}, updatedat = ${now}
        WHERE userid = ${userId} AND id = ${id}
        RETURNING *
      `;

      return this.transformInvoiceToCamelCase(result[0]);
    } catch (error) {
      console.error('Error updating invoice:', error);
      return null;
    }
  }

  static async deleteInvoice(userId: string, id: string): Promise<boolean> {
    try {
      const sql = getSql();
      await sql`DELETE FROM invoices WHERE userid = ${userId} AND id = ${id}`;
      return true;
    } catch (error) {
      console.error('Error deleting invoice:', error);
      return false;
    }
  }

  static generateInvoiceNumber(userId: string): string {
    const prefix = 'INV-';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}-${random}`;
  }

  static async getAnalytics(userId: string): Promise<any> {
    try {
      const invoices = await this.getInvoices(userId);
      const totalRevenue = invoices
        .filter((inv: any) => inv.status === 'paid')
        .reduce((sum: number, inv: any) => sum + inv.amount, 0);

      const totalInvoices = invoices.length;
      const paidInvoices = invoices.filter((inv: any) => inv.status === 'paid').length;
      const pendingInvoices = invoices.filter((inv: any) => inv.status === 'sent' || inv.status === 'overdue').length;
      const averageInvoiceValue = totalInvoices > 0 && paidInvoices > 0 ? totalRevenue / paidInvoices : 0;

      const monthlyData = this.calculateMonthlyData(invoices);
      const topClients = this.calculateTopClients(invoices);
      const invoiceStatusDistribution = {
        paid: paidInvoices,
        pending: pendingInvoices,
        draft: invoices.filter((inv: any) => inv.status === 'draft').length,
        overdue: invoices.filter((inv: any) => inv.status === 'overdue').length,
      };

      return {
        totalRevenue,
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        averageInvoiceValue,
        monthlyData,
        topClients,
        invoiceStatusDistribution,
      };
    } catch (error) {
      console.error('Error getting analytics:', error);
      return {
        totalRevenue: 0,
        totalInvoices: 0,
        paidInvoices: 0,
        pendingInvoices: 0,
        averageInvoiceValue: 0,
        monthlyData: [],
        topClients: [],
        invoiceStatusDistribution: { paid: 0, pending: 0, draft: 0, overdue: 0 },
      };
    }
  }

  static calculateMonthlyData(invoices: any[]): Array<{ month: string; revenue: number; invoices: number }> {
    const monthly: { [key: string]: { revenue: number; invoices: number } } = {};
    invoices.filter((i: any) => i.status === 'paid' && i.paidDate).forEach((invoice: any) => {
      const month = new Date(invoice.paidDate).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!monthly[month]) {
        monthly[month] = { revenue: 0, invoices: 0 };
      }
      monthly[month].revenue += invoice.amount;
      monthly[month].invoices += 1;
    });
    return Object.entries(monthly).map(([month, data]) => ({ month, ...data }));
  }

  static calculateTopClients(invoices: any[]): Array<{ id: string; name: string; company?: string; totalAmount: number; totalInvoices: number }> {
    const clientMap: { [key: string]: { id: string; name: string; company?: string; totalAmount: number; totalInvoices: number } } = {};
    invoices.filter((i: any) => i.status === 'paid').forEach((invoice: any) => {
      if (!clientMap[invoice.clientId]) {
        clientMap[invoice.clientId] = {
          id: invoice.clientId,
          name: invoice.clientName,
          company: invoice.clientCompany,
          totalAmount: 0,
          totalInvoices: 0
        };
      }
      clientMap[invoice.clientId].totalAmount += invoice.amount;
      clientMap[invoice.clientId].totalInvoices += 1;
    });

    return Object.values(clientMap)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);
  }

  static async addFeedback(feedback: any) {
    try {
      const sql = getSql();
      const id = crypto.randomUUID();
      const now = feedback.createdAt || new Date().toISOString();
      await sql`
        INSERT INTO feedback (id, type, rating, title, description, email, category, created_at)
        VALUES (${id}, ${feedback.type}, ${feedback.rating}, ${feedback.title}, ${feedback.description}, ${feedback.email}, ${feedback.category}, ${now})
      `;
    } catch (error) {
      console.error('Error adding feedback:', error);
      throw error;
    }
  }

  static async getAllFeedback() {
    try {
      const sql = getSql();
      const feedback = await sql`SELECT * FROM feedback ORDER BY created_at DESC`;
      return feedback || [];
    } catch (error) {
      console.error('Error getting feedback:', error);
      return [];
    }
  }
}