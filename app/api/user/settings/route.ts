import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, getSupabaseClient } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const supabase = getSupabaseClient(token);

    // Get user profile
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user settings:', error);
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    // Transform to camelCase
    const settings = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      company: profile.company,
      avatar: profile.avatar,
      phone: profile.phone,
      address: profile.address,
      gstNumber: profile.gstnumber,
      currency: profile.currency || 'USD',
      invoicePrefix: profile.invoiceprefix || 'INV',
      defaultTerms: profile.defaultterms || 'Payment due within 30 days',
      defaultNotes: profile.defaultnotes || 'Thank you for your business!',
      defaultGstRate: profile.defaultgstrate || 18,
      defaultTaxRate: profile.defaulttaxrate || 0,
      emailNotifications: profile.emailnotifications ?? true,
      reminderEmails: profile.reminderemails ?? true,
      reminderDays: profile.reminderdays || 7,
      autoGenerateNumbers: profile.autogeneratenumbers ?? true,
      createdAt: profile.createdat,
      updatedAt: profile.updatedat,
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

    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    const supabase = getSupabaseClient(token);

    const data = await request.json();

    // Prepare update object with snake_case column names
    const updateData: Record<string, any> = {
      updatedat: new Date().toISOString(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.company !== undefined) updateData.company = data.company;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.gstNumber !== undefined) updateData.gstnumber = data.gstNumber;
    if (data.currency !== undefined) updateData.currency = data.currency;
    if (data.invoicePrefix !== undefined) updateData.invoiceprefix = data.invoicePrefix;
    if (data.defaultTerms !== undefined) updateData.defaultterms = data.defaultTerms;
    if (data.defaultNotes !== undefined) updateData.defaultnotes = data.defaultNotes;
    if (data.defaultGstRate !== undefined) updateData.defaultgstrate = data.defaultGstRate;
    if (data.defaultTaxRate !== undefined) updateData.defaulttaxrate = data.defaultTaxRate;
    if (data.emailNotifications !== undefined) updateData.emailnotifications = data.emailNotifications;
    if (data.reminderEmails !== undefined) updateData.reminderemails = data.reminderEmails;
    if (data.reminderDays !== undefined) updateData.reminderdays = data.reminderDays;
    if (data.autoGenerateNumbers !== undefined) updateData.autogeneratenumbers = data.autoGenerateNumbers;

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id);

    if (error) {
      console.error('Error updating settings:', error);
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({
      error: 'Failed to update settings',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
