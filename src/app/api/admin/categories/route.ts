import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY sort_order ASC');
  return NextResponse.json({ success: true, data: rows });
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'owner')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }
  try {
    const { id, name, image_url } = await req.json();
    await pool.query('UPDATE categories SET name=?, image_url=? WHERE id=?', [name, image_url, id]);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
