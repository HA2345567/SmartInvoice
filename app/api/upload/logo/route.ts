import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/database';
import { AuthService } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        // Verify authentication
        const user = await AuthService.getUserFromRequest(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is Pro or Business
        // For now, we'll allow all users (you can add tier check from database later)

        // Get the file from the request
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
        }

        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size must be less than 2MB' }, { status: 400 });
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `company-logos/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('invoices') // This is your storage bucket name
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('invoices')
            .getPublicUrl(filePath);

        return NextResponse.json({
            url: publicUrl,
            path: filePath
        });

    } catch (error) {
        console.error('Logo upload error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
