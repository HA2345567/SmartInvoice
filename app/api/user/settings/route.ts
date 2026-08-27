import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helpers';
import { DatabaseService } from '@/lib/database';
import { getNeonSql } from '@/lib/database-config';

export const dynamic = 'force-dynamic';

async function ensureUserColumnsExist(sql: any) {
  try {
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS company TEXT;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS gstnumber TEXT;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS invoiceprefix TEXT DEFAULT 'INV';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS defaultterms TEXT DEFAULT 'Payment due within 30 days';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS defaultnotes TEXT DEFAULT 'Thank you for your business!';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS defaultgstrate NUMERIC DEFAULT 18;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS defaulttaxrate NUMERIC DEFAULT 0;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS emailnotifications BOOLEAN DEFAULT true;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS reminderemails BOOLEAN DEFAULT true;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS reminderdays INTEGER DEFAULT 7;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS autogeneratenumbers BOOLEAN DEFAULT true;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS aiprovider TEXT DEFAULT 'gemini';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS aiapikey TEXT;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS aimodel TEXT DEFAULT 'gemini-2.0-flash';`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS aibaseurl TEXT;`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT;`;
  } catch (err) {
    console.warn('ensureUserColumnsExist warning:', err);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = getNeonSql();
    await ensureUserColumnsExist(sql);

    const profile = await DatabaseService.getUserById(user.id);

    if (!profile) {
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    const settings = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      company: profile.company,
      avatar: profile.avatar,
      phone: profile.phone || profile.companyPhone,
      address: profile.address || profile.companyAddress,
      gstNumber: profile.gstNumber || profile.companyGST,
      currency: profile.currency || 'USD',
      invoicePrefix: profile.invoicePrefix || 'INV',
      defaultTerms: profile.defaultTerms || 'Payment due within 30 days',
      defaultNotes: profile.defaultNotes || 'Thank you for your business!',
      defaultGstRate: profile.defaultGstRate || 18,
      defaultTaxRate: profile.defaultTaxRate || 0,
      emailNotifications: profile.emailNotifications ?? true,
      reminderEmails: profile.reminderEmails ?? true,
      reminderDays: profile.reminderDays || 7,
      autoGenerateNumbers: profile.autoGenerateNumbers ?? true,
      aiProvider: profile.aiProvider || 'gemini',
      aiApiKey: profile.aiApiKey || '',
      aiModel: profile.aiModel || 'gemini-2.0-flash',
      aiBaseUrl: profile.aiBaseUrl || '',
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const sql = getNeonSql();
    await ensureUserColumnsExist(sql);

    const now = new Date().toISOString();

    const current = await DatabaseService.getUserById(user.id);
    if (!current) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const name = data.name ?? current.name ?? user.name ?? '';
    const company = data.company ?? current.company ?? '';
    const phone = data.phone ?? current.phone ?? '';
    const address = data.address ?? current.address ?? '';
    const gstNumber = data.gstNumber ?? current.gstNumber ?? '';
    const currency = data.currency ?? current.currency ?? 'USD';
    const invoicePrefix = data.invoicePrefix ?? current.invoicePrefix ?? 'INV';
    const defaultTerms = data.defaultTerms ?? current.defaultTerms ?? 'Payment due within 30 days';
    const defaultNotes = data.defaultNotes ?? current.defaultNotes ?? 'Thank you for your business!';
    const defaultGstRate = typeof data.defaultGstRate === 'number' ? data.defaultGstRate : parseFloat(data.defaultGstRate || current.defaultGstRate || 18);
    const defaultTaxRate = typeof data.defaultTaxRate === 'number' ? data.defaultTaxRate : parseFloat(data.defaultTaxRate || current.defaultTaxRate || 0);
    const emailNotifications = Boolean(data.emailNotifications ?? current.emailNotifications ?? true);
    const reminderEmails = Boolean(data.reminderEmails ?? current.reminderEmails ?? true);
    const reminderDays = parseInt(data.reminderDays ?? current.reminderDays ?? 7, 10);
    const autoGenerateNumbers = Boolean(data.autoGenerateNumbers ?? current.autoGenerateNumbers ?? true);
    const aiProvider = data.aiProvider ?? current.aiProvider ?? 'gemini';
    const aiApiKey = data.aiApiKey ?? current.aiApiKey ?? '';
    const aiModel = data.aiModel ?? current.aiModel ?? 'gemini-2.0-flash';
    const aiBaseUrl = data.aiBaseUrl ?? current.aiBaseUrl ?? '';
    const avatar = data.avatar ?? current.avatar ?? null;

    await sql`
      UPDATE users
      SET name = ${name}, company = ${company}, phone = ${phone}, address = ${address},
          gstnumber = ${gstNumber}, currency = ${currency}, invoiceprefix = ${invoicePrefix},
          defaultterms = ${defaultTerms}, defaultnotes = ${defaultNotes}, defaultgstrate = ${defaultGstRate},
          defaulttaxrate = ${defaultTaxRate}, emailnotifications = ${emailNotifications},
          reminderemails = ${reminderEmails}, reminderdays = ${reminderDays},
          autogeneratenumbers = ${autoGenerateNumbers}, aiprovider = ${aiProvider}, 
          aiapikey = ${aiApiKey}, aimodel = ${aiModel}, aibaseurl = ${aiBaseUrl},
          avatar = ${avatar}, updatedat = ${now}
      WHERE id = ${user.id}
    `;

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error: any) {
    console.error('Update settings error:', error);
    return NextResponse.json({
      error: 'Failed to update settings',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
