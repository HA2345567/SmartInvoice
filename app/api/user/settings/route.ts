import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helpers';
import { DatabaseService } from '@/lib/database';
import { getNeonSql } from '@/lib/database-config';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
    const now = new Date().toISOString();

    const current = await DatabaseService.getUserById(user.id);
    if (!current) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const name = data.name ?? current.name;
    const company = data.company ?? current.company;
    const phone = data.phone ?? current.phone;
    const address = data.address ?? current.address;
    const gstNumber = data.gstNumber ?? current.gstNumber;
    const currency = data.currency ?? current.currency;
    const invoicePrefix = data.invoicePrefix ?? current.invoicePrefix;
    const defaultTerms = data.defaultTerms ?? current.defaultTerms;
    const defaultNotes = data.defaultNotes ?? current.defaultNotes;
    const defaultGstRate = data.defaultGstRate ?? current.defaultGstRate;
    const defaultTaxRate = data.defaultTaxRate ?? current.defaultTaxRate;
    const emailNotifications = data.emailNotifications ?? current.emailNotifications;
    const reminderEmails = data.reminderEmails ?? current.reminderEmails;
    const reminderDays = data.reminderDays ?? current.reminderDays;
    const autoGenerateNumbers = data.autoGenerateNumbers ?? current.autoGenerateNumbers;

    await sql`
      UPDATE users
      SET name = ${name}, company = ${company}, phone = ${phone}, address = ${address},
          gstnumber = ${gstNumber}, currency = ${currency}, invoiceprefix = ${invoicePrefix},
          defaultterms = ${defaultTerms}, defaultnotes = ${defaultNotes}, defaultgstrate = ${defaultGstRate},
          defaulttaxrate = ${defaultTaxRate}, emailnotifications = ${emailNotifications},
          reminderemails = ${reminderEmails}, reminderdays = ${reminderDays},
          autogeneratenumbers = ${autoGenerateNumbers}, updatedat = ${now}
      WHERE id = ${user.id}
    `;

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({
      error: 'Failed to update settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
