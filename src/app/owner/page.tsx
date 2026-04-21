export const dynamic = 'force-dynamic';

import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { formatRupiah } from '@/lib/currency';
import { Package, Users, ShoppingBag, TrendingUp, BarChart2, Eye } from 'lucide-react';
import Link from 'next/link';

export default async function OwnerDashboard() {
  const session = await getSession();

  let productCount = 0, userCount = 0, orderCount = 0;
  let totalRevenue = 0, paidOrders = 0;
  let recentOrders: any[] = [];
  let topProducts: any[] = [];
  let monthlyRevenue: any[] = [];

  try {
    const [[pc]]: any = await pool.query('SELECT COUNT(*) as count FROM products');
    productCount = pc.count;
    const [[uc]]: any = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "user"');
    userCount = uc.count;
    const [[oc]]: any = await pool.query('SELECT COUNT(*) as count FROM orders');
    orderCount = oc.count;
    const [[rev]]: any = await pool.query('SELECT COALESCE(SUM(total_amount),0) as total FROM orders WHERE status = "paid"');
    totalRevenue = parseFloat(rev.total);
    const [[po]]: any = await pool.query('SELECT COUNT(*) as count FROM orders WHERE status = "paid"');
    paidOrders = po.count;

    // Recent orders
    const [ro]: any = await pool.query(`
      SELECT o.id, o.total_amount, o.status, o.created_at, u.name as buyer
      FROM orders o JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC LIMIT 8
    `);
    recentOrders = ro;

    // Top products by quantity sold
    const [tp]: any = await pool.query(`
      SELECT p.name, p.image_url, SUM(oi.quantity) as qty_sold, SUM(oi.quantity * oi.price) as revenue
      FROM order_items oi JOIN products p ON oi.product_id = p.id
      GROUP BY p.id ORDER BY qty_sold DESC LIMIT 5
    `);
    topProducts = tp;

    // Monthly revenue last 6 months
    const [mr]: any = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%b %Y') as month, SUM(total_amount) as total
      FROM orders WHERE status='paid' AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month ORDER BY created_at ASC
    `);
    monthlyRevenue = mr;
  } catch (_) {}

  const stats = [
    { label: 'Total Pendapatan', value: formatRupiah(totalRevenue), icon: TrendingUp, color: 'bg-[#133A42]', sub: `${paidOrders} pesanan lunas` },
    { label: 'Total Pesanan', value: orderCount, icon: ShoppingBag, color: 'bg-[#00A19D]', sub: 'Semua waktu' },
    { label: 'Total Pelanggan', value: userCount, icon: Users, color: 'bg-amber-500', sub: 'Pengguna aktif' },
    { label: 'Total Produk', value: productCount, icon: Package, color: 'bg-purple-600', sub: 'Katalog aktif' },
  ];

  return (
    <div className="w-full space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Eye className="w-3 h-3" /> Mode Pantau – Hanya Lihat
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#133A42]">
            Selamat datang, {session?.name as string}! 👋
          </h1>
          <p className="text-gray-400 mt-1">Pantau performa dan aktivitas toko secara real-time.</p>
        </div>
        <Link href="/shop" target="_blank" className="text-sm font-semibold text-gray-500 border border-gray-200 px-4 py-2 rounded-xl hover:border-[#133A42] hover:text-[#133A42] transition-colors">
          🌐 Lihat Toko
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col gap-4">
            <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center text-white flex-shrink-0`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-[#133A42]">{s.value}</p>
              <p className="text-sm font-semibold text-gray-500 mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-[#133A42] text-lg">Pesanan Terbaru</h2>
            <Link href="/owner/orders" className="text-xs font-bold text-[#00A19D] hover:underline">Lihat semua →</Link>
          </div>
          <div className="space-y-3">
            {recentOrders.length === 0 && <p className="text-gray-400 text-sm text-center py-8">Belum ada pesanan</p>}
            {recentOrders.map((o: any) => (
              <div key={o.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-bold text-gray-800">{o.buyer}</p>
                  <p className="text-xs text-gray-400">{o.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#133A42]">{formatRupiah(o.total_amount)}</p>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${o.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-[#133A42] text-lg">Produk Terlaris</h2>
            <Link href="/owner/products" className="text-xs font-bold text-[#00A19D] hover:underline">Lihat semua →</Link>
          </div>
          <div className="space-y-4">
            {topProducts.length === 0 && <p className="text-gray-400 text-sm text-center py-8">Belum ada data penjualan</p>}
            {topProducts.map((p: any, i: number) => (
              <div key={i} className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full bg-[#133A42]/10 text-[#133A42] text-xs font-extrabold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.qty_sold} terjual</p>
                </div>
                <p className="text-sm font-bold text-[#00A19D] flex-shrink-0">{formatRupiah(p.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Revenue */}
      {monthlyRevenue.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-[#133A42] text-lg mb-6 flex items-center gap-2"><BarChart2 className="w-5 h-5 text-[#00A19D]" /> Pendapatan 6 Bulan Terakhir</h2>
          <div className="flex items-end gap-4 h-48">
            {(() => {
              const maxVal = Math.max(...monthlyRevenue.map((m: any) => parseFloat(m.total)));
              return monthlyRevenue.map((m: any, i: number) => {
                const pct = maxVal > 0 ? (parseFloat(m.total) / maxVal) * 100 : 0;
                return (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <p className="text-xs font-bold text-[#133A42]">{formatRupiah(parseFloat(m.total)).replace('Rp ', '')}</p>
                    <div className="w-full rounded-t-xl bg-gradient-to-t from-[#133A42] to-[#00A19D]" style={{ height: `${Math.max(pct, 4)}%` }}></div>
                    <p className="text-[10px] text-gray-400 font-semibold">{m.month}</p>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
