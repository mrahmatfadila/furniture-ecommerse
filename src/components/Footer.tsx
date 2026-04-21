import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-16 px-6 md:px-12 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-gray-900 flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-emerald-900 rounded-full flex items-center justify-center text-white text-xs">W</div>
            Furniture
          </Link>
          <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
            Our materials are carefully crafted, adding a natural touch to your everyday routine.
          </p>
          <p className="text-xs text-gray-400">©2024 Furniture. All rights reserved.</p>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-900">Company</h4>
          <ul className="space-y-3">
            <li><Link href="/about" className="text-sm text-gray-500 hover:text-emerald-900">About Us</Link></li>
            <li><Link href="/careers" className="text-sm text-gray-500 hover:text-emerald-900">Careers</Link></li>
            <li><Link href="/blog" className="text-sm text-gray-500 hover:text-emerald-900">Blog</Link></li>
            <li><Link href="/affiliate" className="text-sm text-gray-500 hover:text-emerald-900">Affiliate Program</Link></li>
            <li><Link href="/contact" className="text-sm text-gray-500 hover:text-emerald-900">Contact Us</Link></li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-900">Help</h4>
          <ul className="space-y-3">
            <li><Link href="/faq" className="text-sm text-gray-500 hover:text-emerald-900">FAQ</Link></li>
            <li><Link href="/shipping" className="text-sm text-gray-500 hover:text-emerald-900">Shipping & Returns</Link></li>
            <li><Link href="/policy" className="text-sm text-gray-500 hover:text-emerald-900">Return Policy</Link></li>
            <li><Link href="/track" className="text-sm text-gray-500 hover:text-emerald-900">Order Tracking</Link></li>
            <li><Link href="/payment" className="text-sm text-gray-500 hover:text-emerald-900">Payment Options</Link></li>
          </ul>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-sm font-semibold tracking-wider uppercase text-gray-900">Shop</h4>
          <ul className="space-y-3">
            <li><Link href="/furniture" className="text-sm text-gray-500 hover:text-emerald-900">Furniture</Link></li>
            <li><Link href="/decor" className="text-sm text-gray-500 hover:text-emerald-900">Decor</Link></li>
            <li><Link href="/lighting" className="text-sm text-gray-500 hover:text-emerald-900">Lighting</Link></li>
            <li><Link href="/sale" className="text-sm text-gray-500 hover:text-emerald-900">Clearance/Sale</Link></li>
            <li><Link href="/gift" className="text-sm text-gray-500 hover:text-emerald-900">Gift Cards</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
