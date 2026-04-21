'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function ClientNavLink({ href, children }: { href: string, children: ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link 
      href={href} 
      className={`transition-colors flex items-center gap-1 pb-1 ${isActive ? 'text-[#133A42] font-semibold border-b-2 border-[#133A42]' : 'hover:text-[#133A42]'}`}
    >
      {children}
    </Link>
  );
}
