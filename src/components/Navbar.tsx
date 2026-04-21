import Link from 'next/link';
import { ShoppingCart, User, Search, Menu, ChevronDown, LogOut } from 'lucide-react';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';
import ClientNavLink from './ClientNavLink';

export default async function Navbar() {
  const session = await getSession();

  let cartCount = 0;
  if (session) {
    try {
      const [rows]: any = await pool.query('SELECT SUM(quantity) as count FROM carts WHERE user_id = ?', [session.id]);
      if (rows[0].count) cartCount = parseInt(rows[0].count);
    } catch (e) { }
  }

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 md:px-12 fixed top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Menu className="w-6 h-6 md:hidden text-gray-800" />
        <Link href="/" className="text-2xl font-bold tracking-tight text-[#133A42] flex items-center gap-2">
          <span className="text-3xl leading-none">✺</span>
          Furniture
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
        <ClientNavLink href="/">Home</ClientNavLink>
        <ClientNavLink href="/shop">Shop</ClientNavLink>
        <ClientNavLink href="/room-ideas">Room Sets</ClientNavLink>
        <ClientNavLink href="/sale">Sale</ClientNavLink>
        <ClientNavLink href="/blog">Blog</ClientNavLink>
        <ClientNavLink href="/about">About Us</ClientNavLink>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-emerald-900 md:hidden"><Search className="w-5 h-5" /></button>
        {session ? (
          <div className="hidden md:flex items-center gap-4">
            <Link href={session.role === 'user' ? '/' : session.role === 'owner' ? '/owner' : '/admin'} className="text-sm font-semibold text-gray-700 hover:text-[#133A42] flex items-center gap-2 bg-gray-50 pr-4 pl-1 py-1 rounded-full border border-gray-100">
              <div className="w-7 h-7 rounded-full bg-[#133A42] text-white flex items-center justify-center font-bold text-xs uppercase">
                {(session.name as string).charAt(0)}
              </div>
              {session.name as string}
            </Link>
            <form action="/api/auth/logout" method="POST" className="hidden md:block">
              <button type="submit" className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Log Out">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <>
            <Link href="/login" className="hidden md:block text-sm font-semibold text-gray-700 hover:text-[#133A42]">Sign In</Link>
            <Link href="/register" className="hidden md:block text-sm font-semibold bg-[#133A42] text-white px-6 py-2.5 rounded-full hover:bg-emerald-950 transition-colors">Get Started</Link>
          </>
        )}
        <div className="h-6 w-px bg-gray-200 hidden md:block mx-1"></div>
        <Link href="/cart" className="text-gray-600 hover:text-emerald-900 relative">
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full leading-none">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
}
