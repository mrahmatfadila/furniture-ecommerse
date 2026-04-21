import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(req: Request, context: { params: { id: string } }) {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'owner')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    const { name, price, sale_price, image_url, status, category, description } = await req.json();

    await pool.query(
      'UPDATE products SET name=?, price=?, sale_price=?, image_url=?, status=?, category=?, description=? WHERE id=?',
      [name, price, sale_price || null, image_url, status, category, description || null, id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Server error: ' + error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'owner')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { id } = await context.params;
    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Server error: ' + error.message }, { status: 500 });
  }
}
