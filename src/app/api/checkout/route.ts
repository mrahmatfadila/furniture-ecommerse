import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { sendWhatsAppNotification, sendEmailNotification } from '@/lib/notifications';

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const [cartItems]: any = await pool.query(`
      SELECT c.*, p.name, p.price, p.sale_price 
      FROM carts c 
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [session.id]);

    if (cartItems.length === 0) {
      return NextResponse.json({ success: false, error: 'Keranjang kosong.' }, { status: 400 });
    }

    let total = 0;
    for (const item of cartItems) {
      const price = item.sale_price ? parseFloat(item.sale_price) : parseFloat(item.price);
      total += price * item.quantity;
    }

    const finalTotal = total - 50000 > 0 ? total - 50000 : 0; 
    const orderId = `ORD-${Date.now()}-${session.id}`;

    await pool.query(
      `INSERT INTO orders (id, user_id, total_amount, status) VALUES (?, ?, ?, 'paid')`,
      [orderId, session.id, finalTotal]
    );

    const notifItems: { name: string; quantity: number; price: number }[] = [];
    for (const item of cartItems) {
      const price = item.sale_price ? parseFloat(item.sale_price) : parseFloat(item.price);
      await pool.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, price]
      );
      notifItems.push({ name: item.name, quantity: item.quantity, price });
    }

    await pool.query('DELETE FROM carts WHERE user_id = ?', [session.id]);

    // ── Kirim notifikasi (fire-and-forget, tidak block response) ──
    const itemSummary = notifItems.map(i => `  • ${i.name} x${i.quantity}`).join('\n');
    const buyerName  = session.name as string;
    const buyerEmail = (session.email as string) || '-';

    sendWhatsAppNotification({ orderId, buyerName, total: finalTotal, itemSummary }).catch(console.error);
    sendEmailNotification({ orderId, buyerName, buyerEmail, total: finalTotal, items: notifItems }).catch(console.error);
    // ───────────────────────────────────────────────────────────────

    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

