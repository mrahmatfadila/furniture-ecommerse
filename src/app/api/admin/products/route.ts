import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Server error: ' + error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'owner')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { name, price, sale_price, image_url, status, category } = await req.json();

    if (!name || !price) {
      return NextResponse.json({ success: false, error: 'Name and price are required' }, { status: 400 });
    }

    const [result]: any = await pool.query(
      'INSERT INTO products (name, price, sale_price, image_url, status, category) VALUES (?, ?, ?, ?, ?, ?)',
       [name, price, sale_price || null, image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&auto=format&fit=crop', status || 'in_stock', category || 'Furniture']
    );

    return NextResponse.json({ success: true, data: { id: result.insertId } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Server error: ' + error.message }, { status: 500 });
  }
}
