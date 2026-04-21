import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'owner')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Only JPG, PNG, WEBP, GIF allowed' }, { status: 400 });
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File too large (max 5MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const ext = file.name.split('.').pop();
    const filename = `product_${Date.now()}.${ext}`;
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);

    await writeFile(uploadPath, buffer);

    return NextResponse.json({ success: true, url: `/uploads/${filename}` });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Upload failed: ' + error.message }, { status: 500 });
  }
}
