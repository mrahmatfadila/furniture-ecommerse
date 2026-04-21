'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Users, Package, BarChart2, LogOut, ChevronRight, Eye } from 'lucide-react';

interface Props { name: string; role: string; }

export default function OwnerSidebar({ name, role }: Props) {
  const pathname = usePathname();

  const navItems = [
    { href: '/owner',           label: 'Dashboard',       icon: LayoutDashboard },
    { href: '/owner/sales',     label: 'Laporan Penjualan', icon: BarChart2 },
    { href: '/owner/orders',    label: 'Semua Pesanan',    icon: ShoppingBag },
    { href: '/owner/products',  label: 'Daftar Produk',   icon: Package },
    { href: '/owner/customers', label: 'Daftar Pelanggan', icon: Users },
  ];

  const isActive = (href: string) =>
    href === '/owner' ? pathname === '/owner' : pathname.startsWith(href);

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between hidden md:flex sticky top-20 h-[calc(100vh-80px)] shadow-sm">
      <div className="p-6 space-y-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✺</span>
          <div>
            <h2 className="text-[#133A42] font-extrabold text-lg tracking-tight leading-none">Owner Portal</h2>
            <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest mt-0.5 flex items-center gap-1">
              <Eye className="w-3 h-3" /> Mode Pantau
            </p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  active ? 'bg-[#133A42] text-white shadow-md shadow-[#133A42]/20' : 'text-gray-600 hover:bg-gray-50 hover:text-[#133A42]'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white font-bold text-sm flex items-center justify-center uppercase flex-shrink-0">
            {name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{name}</p>
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Owner</p>
          </div>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="flex items-center gap-3 text-sm font-semibold text-gray-400 hover:text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-2xl transition-colors w-full text-left">
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}
