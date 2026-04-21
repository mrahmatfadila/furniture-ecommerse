export const dynamic = 'force-dynamic';

import pool from '@/lib/db';
import { Users } from 'lucide-react';

export default async function OwnerCustomersPage() {
  let customers: any[] = [];
  try {
    const [rows]: any = await pool.query(`
      SELECT u.id, u.name, u.email, u.created_at,
        COUNT(o.id) as order_count,
        COALESCE(SUM(o.total_amount),0) as total_spent
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'paid'
      WHERE u.role = 'user'
      GROUP BY u.id
      ORDER BY total_spent DESC
    `);
    customers = rows;
  } catch (_) {}

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#133A42] flex items-center gap-3">
          <Users className="w-7 h-7 text-[#00A19D]" /> Daftar Pelanggan
        </h1>
        <p className="text-gray-400 mt-1">Semua pengguna yang terdaftar dan riwayat belanja mereka. <span className="text-amber-600 font-bold">Hanya bisa dipantau.</span></p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="font-bold text-[#133A42]">Total: {customers.length} pelanggan</h2>
        </div>
        {customers.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-20">Belum ada pelanggan terdaftar</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left py-4 px-6 font-bold">Nama</th>
                  <th className="text-left py-4 px-6 font-bold">Email</th>
                  <th className="text-center py-4 px-6 font-bold">Total Pesanan</th>
                  <th className="text-right py-4 px-6 font-bold">Total Belanja</th>
                  <th className="text-right py-4 px-6 font-bold">Bergabung</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c: any) => (
                  <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#133A42] text-white font-bold text-xs flex items-center justify-center uppercase flex-shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-500">{c.email}</td>
                    <td className="py-4 px-6 text-center font-bold text-[#00A19D]">{c.order_count}</td>
                    <td className="py-4 px-6 text-right font-extrabold text-[#133A42]">
                      {parseFloat(c.total_spent) > 0
                        ? 'Rp ' + Math.round(parseFloat(c.total_spent)).toLocaleString('id-ID')
                        : <span className="text-gray-300 font-normal">Belum belanja</span>}
                    </td>
                    <td className="py-4 px-6 text-right text-xs text-gray-400">
                      {new Date(c.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
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
