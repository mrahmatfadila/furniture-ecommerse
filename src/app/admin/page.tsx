export const dynamic = 'force-dynamic';

import { getSession } from '@/lib/auth';
import pool from '@/lib/db';
import Link from 'next/link';
import { Package, Users, TrendingUp, Plus } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await getSession();

  let productCount = 0;
  let userCount = 0;

  try {
    const [[pc]]: any = await pool.query('SELECT COUNT(*) as count FROM products');
    productCount = pc.count;
    const [[uc]]: any = await pool.query('SELECT COUNT(*) as count FROM users');
    userCount = uc.count;
  } catch (_) {}

  const stats = [
    { label: 'Total Produk', value: productCount, icon: Package, href: '/admin/products', color: 'bg-[#133A42]' },
    { label: 'Total Pengguna', value: userCount, icon: Users, href: '/admin/users', color: 'bg-[#00A19D]' },
    { label: 'Kategori Tersedia', value: 8, icon: TrendingUp, href: '/admin/products', color: 'bg-amber-600' },
  ];

  return (
    <div className="w-full">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-[#133A42]">
          Selamat datang, {session?.name as string}! 👋
        </h1>
        <p className="text-gray-400 mt-2">Kelola produk, pengguna, dan konten website Anda dari sini.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex items-center gap-5 group hover:shadow-md hover:border-gray-200 transition-all">
            <div className={`w-14 h-14 rounded-2xl ${s.color} flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
              <s.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#133A42]">{s.value}</p>
              <p className="text-sm font-semibold text-gray-400 mt-0.5">{s.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-700 mb-4">Aksi Cepat</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products" className="flex items-center gap-2 bg-[#133A42] text-white px-5 py-3 rounded-xl font-semibold text-sm hover:bg-[#00A19D] transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Tambah Produk Baru
          </Link>
          <Link href="/admin/users" className="flex items-center gap-2 bg-white text-[#133A42] border border-[#133A42] px-5 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
            <Users className="w-4 h-4" /> Kelola Pengguna
          </Link>
          <Link href="/shop" target="_blank" className="flex items-center gap-2 bg-white text-gray-600 border border-gray-200 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
            🌐 Lihat Website
          </Link>
        </div>
      </div>

      {/* Info card */}
      <div className="bg-gradient-to-br from-[#133A42] to-[#00A19D] rounded-3xl p-8 text-white mt-8">
        <h3 className="text-xl font-bold mb-2">💡 Tips</h3>
        <p className="text-white/80 text-sm leading-relaxed">
          Produk yang Anda tambahkan melalui menu <strong>Kelola Produk</strong> akan langsung tampil di halaman <strong>Trending Picks</strong> di beranda website secara otomatis. Gunakan foto berkualitas tinggi dan deskripsi yang menarik!
        </p>
      </div>
    </div>
  );
}
