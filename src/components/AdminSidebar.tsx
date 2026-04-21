'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, LayoutDashboard, Package, LogOut, ChevronRight, Layers } from 'lucide-react';

interface Props {
  name: string;
  role: string;
}

export default function AdminSidebar({ name, role }: Props) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin',             label: 'Dashboard',        icon: LayoutDashboard },
    { href: '/admin/users',       label: 'Kelola Pengguna',  icon: Users },
    { href: '/admin/products',    label: 'Kelola Produk',    icon: Package },
    { href: '/admin/categories',  label: 'Kelola Kategori',  icon: Layers },
  ];

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between hidden md:flex sticky top-20 h-[calc(100vh-80px)] shadow-sm">
      {/* Logo area */}
      <div className="p-6 space-y-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">✺</span>
          <div>
            <h2 className="text-[#133A42] font-extrabold text-lg tracking-tight leading-none">Admin Panel</h2>
            <p className="text-[10px] font-semibold text-[#00A19D] uppercase tracking-widest mt-0.5">Furniture Store</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-[#133A42] text-white shadow-md shadow-[#133A42]/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#133A42]'
                }`}
              >
                <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom user info + logout */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#133A42] text-white font-bold text-sm flex items-center justify-center uppercase flex-shrink-0">
            {name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{name}</p>
            <p className="text-[10px] font-bold text-[#00A19D] uppercase tracking-widest">{role}</p>
          </div>
        </div>

        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 text-sm font-semibold text-gray-400 hover:text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-2xl transition-colors w-full text-left"
          >
            <LogOut className="w-4 h-4" /> Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}
