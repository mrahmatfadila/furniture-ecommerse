export const dynamic = 'force-dynamic';

import pool from '@/lib/db';
import { formatRupiah } from '@/lib/currency';
import { TrendingUp, ShoppingBag } from 'lucide-react';

export default async function OwnerSalesPage() {
  let dailySales: any[] = [];
  let monthlySales: any[] = [];
  let totalRevenue = 0;
  let totalOrders = 0;
  let avgOrderValue = 0;

  try {
    // All-time stats
    const [[rev]]: any = await pool.query("SELECT COALESCE(SUM(total_amount),0) as total, COUNT(*) as count FROM orders WHERE status='paid'");
    totalRevenue = parseFloat(rev.total);
    totalOrders = rev.count;
    avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Daily sales last 14 days
    const [ds]: any = await pool.query(`
      SELECT DATE(created_at) as day, COUNT(*) as orders, SUM(total_amount) as revenue
      FROM orders WHERE status='paid' AND created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY)
      GROUP BY day ORDER BY day DESC
    `);
    dailySales = ds;

    // Monthly sales last 12 months
    const [ms]: any = await pool.query(`
      SELECT DATE_FORMAT(created_at,'%b %Y') as month, COUNT(*) as orders, SUM(total_amount) as revenue
      FROM orders WHERE status='paid' AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY month ORDER BY created_at ASC
    `);
    monthlySales = ms;
  } catch (_) {}

  return (
    <div className="w-full space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#133A42] flex items-center gap-3">
          <TrendingUp className="w-7 h-7 text-[#00A19D]" /> Laporan Penjualan
        </h1>
        <p className="text-gray-400 mt-1">Ringkasan pendapatan dan tren penjualan secara keseluruhan.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Total Pendapatan', value: formatRupiah(totalRevenue), color: 'text-[#133A42]' },
          { label: 'Total Pesanan Lunas', value: totalOrders + ' pesanan', color: 'text-[#00A19D]' },
          { label: 'Rata-rata Nilai Pesanan', value: formatRupiah(avgOrderValue), color: 'text-amber-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7">
            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-gray-400 font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly bar chart */}
      {monthlySales.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 className="font-bold text-[#133A42] text-lg mb-6">Pendapatan Bulanan</h2>
          <div className="flex items-end gap-3 h-56">
            {(() => {
              const maxVal = Math.max(...monthlySales.map((m: any) => parseFloat(m.revenue)));
              return monthlySales.map((m: any, i: number) => {
                const pct = maxVal > 0 ? (parseFloat(m.revenue) / maxVal) * 100 : 0;
                return (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 group relative">
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-[#133A42] text-white text-xs rounded-xl px-3 py-1.5 whitespace-nowrap shadow-lg z-10">
                      {m.orders} pesanan<br/>{formatRupiah(parseFloat(m.revenue))}
                    </div>
                    <div
                      className="w-full rounded-t-2xl bg-gradient-to-t from-[#133A42] to-[#00A19D] hover:to-amber-400 transition-colors cursor-pointer"
                      style={{ height: `${Math.max(pct, 4)}%` }}
                    ></div>
                    <p className="text-[10px] text-gray-400 font-semibold truncate w-full text-center">{m.month}</p>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Daily sales table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-[#133A42] text-lg mb-6 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#00A19D]" /> Penjualan Harian (14 Hari Terakhir)
        </h2>
        {dailySales.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">Belum ada data penjualan</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-bold">Tanggal</th>
                  <th className="text-center py-3 px-4 font-bold">Jumlah Pesanan</th>
                  <th className="text-right py-3 px-4 font-bold">Total Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {dailySales.map((d: any) => (
                  <tr key={d.day} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-semibold text-gray-700">{new Date(d.day).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                    <td className="py-4 px-4 text-center font-bold text-[#00A19D]">{d.orders}</td>
                    <td className="py-4 px-4 text-right font-extrabold text-[#133A42]">{formatRupiah(parseFloat(d.revenue))}</td>
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
