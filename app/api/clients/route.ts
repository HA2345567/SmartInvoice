import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth-helpers';
import { DatabaseService } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clients = await DatabaseService.getClients(user.id);
    return NextResponse.json(clients);
  } catch (error) {
    console.error('Get clients error:', error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json({
        error: 'Name and email are required'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({
        error: 'Please enter a valid email address'
      }, { status: 400 });
    }

    // Check if client with this email already exists
    const existingClients = await DatabaseService.getClients(user.id);
    const existing = existingClients.find(c => c.email.toLowerCase() === data.email.toLowerCase().trim());

    if (existing) {
      return NextResponse.json({
        error: 'A client with this email already exists'
      }, { status: 409 });
    }

    const client = await DatabaseService.createClient(user.id, {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      company: data.company?.trim(),
      address: data.address?.trim() || '',
      gstNumber: data.gstNumber?.trim(),
      currency: data.currency || 'USD',
    });

    return NextResponse.json({
      success: true,
      client,
      message: 'Client created successfully'
    });
  } catch (error) {
    console.error('Create client error:', error);
    return NextResponse.json({
      error: 'Failed to create client',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
