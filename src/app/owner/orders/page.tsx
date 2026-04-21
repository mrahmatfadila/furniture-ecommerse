export const dynamic = 'force-dynamic';

import pool from '@/lib/db';
import { formatRupiah } from '@/lib/currency';
import { ShoppingBag } from 'lucide-react';

export default async function OwnerOrdersPage() {
  let orders: any[] = [];
  try {
    const [rows]: any = await pool.query(`
      SELECT o.id, o.total_amount, o.status, o.created_at, u.name as buyer, u.email
      FROM orders o JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    orders = rows;
  } catch (_) {}

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#133A42] flex items-center gap-3">
          <ShoppingBag className="w-7 h-7 text-[#00A19D]" /> Semua Pesanan
        </h1>
        <p className="text-gray-400 mt-1">Daftar seluruh transaksi yang masuk ke toko. <span className="text-amber-600 font-bold">Hanya bisa dipantau.</span></p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="font-bold text-[#133A42]">Total: {orders.length} pesanan</h2>
        </div>
        {orders.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-20">Belum ada pesanan</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left py-4 px-6 font-bold">ID Pesanan</th>
                  <th className="text-left py-4 px-6 font-bold">Pelanggan</th>
                  <th className="text-left py-4 px-6 font-bold">Email</th>
                  <th className="text-center py-4 px-6 font-bold">Status</th>
                  <th className="text-right py-4 px-6 font-bold">Total</th>
                  <th className="text-right py-4 px-6 font-bold">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o: any) => (
                  <tr key={o.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-gray-500">{o.id}</td>
                    <td className="py-4 px-6 font-bold text-gray-800">{o.buyer}</td>
                    <td className="py-4 px-6 text-gray-500">{o.email}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        o.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                        o.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{o.status}</span>
                    </td>
                    <td className="py-4 px-6 text-right font-extrabold text-[#133A42]">{formatRupiah(o.total_amount)}</td>
                    <td className="py-4 px-6 text-right text-xs text-gray-400">
                      {new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
