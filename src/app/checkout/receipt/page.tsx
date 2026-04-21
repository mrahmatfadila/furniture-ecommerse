import Link from 'next/link';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatRupiah } from '@/lib/currency';
import { CheckCircle2, Package } from 'lucide-react';
import DownloadReceiptWrapper from '@/components/DownloadReceiptWrapper';

export default async function ReceiptPage({ searchParams }: { searchParams: { id?: string } }) {
  const session = await getSession();
  if (!session) redirect('/login');

  const { id: orderId } = await searchParams;
  if (!orderId) redirect('/cart');

  const [orderRes]: any = await pool.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, session.id]);
  if (orderRes.length === 0) redirect('/cart');
  const order = orderRes[0];

  const [itemsRes]: any = await pool.query(`
    SELECT oi.*, p.name, p.image_url, p.category 
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `, [orderId]);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center p-6 pt-24 pb-20">
      <div id="receipt-wrapper" className="max-w-2xl w-full bg-white rounded-[2rem] border border-gray-100 shadow-[0_30px_60px_rgb(0,0,0,0.05)] overflow-hidden">
        {/* Header */}
        <div className="bg-[#133A42] p-12 text-center text-white flex flex-col items-center">
          <div className="w-20 h-20 bg-[#00A19D] rounded-full flex items-center justify-center mb-8 ring-[6px] ring-white/10 animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Pembayaran Berhasil!</h1>
          <p className="text-teal-100 opacity-90 text-sm max-w-sm leading-relaxed">Pesanan Anda telah kami terima dan sedang diproses untuk pengiriman. Terima kasih telah berbelanja di Furniture.</p>
        </div>

        {/* Details */}
        <div className="p-10 md:p-12">
          <div className="flex justify-between items-center border-b border-gray-100 pb-8 mb-8">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Nomor Pesanan</p>
              <p className="text-xl font-black text-[#133A42] font-mono">{order.id}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Tanggal</p>
              <p className="font-semibold text-gray-800">{new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="font-bold text-[#133A42] mb-6 flex items-center gap-3 text-lg"><Package className="w-5 h-5"/> Ringkasan Barang</h3>
            <div className="space-y-6">
              {itemsRes.map((item: any) => (
                <div key={item.id} className="flex gap-5">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="font-bold text-[#133A42] text-sm md:text-base leading-snug mb-1 truncate">{item.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.category}</p>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <p className="text-xs text-gray-500 mb-1">{item.quantity} x {formatRupiah(item.price)}</p>
                    <p className="font-extrabold text-[#00A19D] text-sm md:text-base">{formatRupiah((item.price * item.quantity).toString())}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#133A42] rounded-[1.5rem] p-8 mb-10 text-white shadow-xl shadow-[#133A42]/10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
            <div className="flex justify-between items-center text-lg relative z-10">
              <span className="font-bold text-teal-50">Total Dibayar</span>
              <span className="font-black text-[#00A19D] text-3xl drop-shadow-sm">{formatRupiah(order.total_amount)}</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-2 mb-6 text-sm text-[#00A19D] font-bold hover:text-[#133A42] transition-colors print:hidden">
            <Link href="/shop">&larr; Lanjut Berbelanja</Link>
          </div>
          <DownloadReceiptWrapper orderId={order.id} />
        </div>
      </div>
    </div>
  );
}
