export const dynamic = 'force-dynamic';

import pool from '@/lib/db';
import { formatRupiah } from '@/lib/currency';
import { Package } from 'lucide-react';

export default async function OwnerProductsPage() {
  let products: any[] = [];
  try {
    const [rows]: any = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    products = rows;
  } catch (_) {}

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#133A42] flex items-center gap-3">
          <Package className="w-7 h-7 text-[#00A19D]" /> Daftar Produk
        </h1>
        <p className="text-gray-400 mt-1">Semua produk yang terdaftar di katalog. <span className="text-amber-600 font-bold">Hanya bisa dipantau.</span></p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="font-bold text-[#133A42]">Total: {products.length} produk</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="text-left py-4 px-6 font-bold">Produk</th>
                <th className="text-left py-4 px-6 font-bold">Kategori</th>
                <th className="text-right py-4 px-6 font-bold">Harga Normal</th>
                <th className="text-right py-4 px-6 font-bold">Harga Sale</th>
                <th className="text-left py-4 px-6 font-bold">Stok</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
                      </div>
                      <span className="font-bold text-gray-800">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-500">{p.category || '-'}</td>
                  <td className="py-4 px-6 text-right font-bold text-gray-700">{formatRupiah(p.price)}</td>
                  <td className="py-4 px-6 text-right font-bold text-[#00A19D]">{p.sale_price ? formatRupiah(p.sale_price) : <span className="text-gray-300">—</span>}</td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">In Stock</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
