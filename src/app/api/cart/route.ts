import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { productId, quantity } = await req.json();
    const [existing]: any = await pool.query(
      'SELECT id, quantity FROM carts WHERE user_id = ? AND product_id = ?',
      [session.id, productId]
    );

    if (existing.length > 0) {
      await pool.query(
        'UPDATE carts SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [session.id, productId, quantity]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [rows] = await pool.query(`
      SELECT c.id as cart_id, c.quantity, p.* 
      FROM carts c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_id = ?
    `, [session.id]);
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const cartId = searchParams.get('id');
    
    if (cartId) {
      await pool.query('DELETE FROM carts WHERE id = ? AND user_id = ?', [cartId, session.id]);
    } else {
      await pool.query('DELETE FROM carts WHERE user_id = ?', [session.id]);
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
