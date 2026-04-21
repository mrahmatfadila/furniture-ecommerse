'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronDown, SlidersHorizontal, LayoutGrid, LayoutList, Eye, ShoppingBag, X
} from 'lucide-react';
import { formatRupiah } from '@/lib/currency';

const STATUS_TAG: Record<string, { label: string; cls: string }> = {
  in_stock: { label: 'IN STOCK',  cls: 'bg-lime-200 text-lime-900' },
  sold_out: { label: 'SOLD OUT',  cls: 'bg-red-100 text-red-800' },
  new_in:   { label: 'NEW IN',    cls: 'bg-cyan-100 text-cyan-900' },
  on_sale:  { label: 'ON SALE',   cls: 'bg-fuchsia-200 text-fuchsia-900' },
};

const SORT_OPTIONS = [
  { label: 'Terbaru', value: 'newest' },
  { label: 'Terlama', value: 'oldest' },
  { label: 'Harga Terendah', value: 'price_asc' },
  { label: 'Harga Tertinggi', value: 'price_desc' },
  { label: 'Nama A-Z', value: 'name_asc' },
];

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  sale_price: number | null;
  status: string;
  image_url: string;
}

interface Category {
  name: string;
  slug: string;
  image_url?: string;
}

interface Props {
  initialProducts: Product[];
  allCategories: Category[];
  currentCategory?: string;
  total: number;
}

function sortProducts(products: Product[], sortBy: string): Product[] {
  const arr = [...products];
  switch (sortBy) {
    case 'oldest':   return arr.reverse();
    case 'price_asc': return arr.sort((a, b) => Number(a.price) - Number(b.price));
    case 'price_desc': return arr.sort((a, b) => Number(b.price) - Number(a.price));
    case 'name_asc': return arr.sort((a, b) => a.name.localeCompare(b.name));
    default: return arr; // newest (default from DB)
  }
}

export default function ShopClient({ initialProducts, allCategories, currentCategory, total }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [gridView, setGridView] = useState<'grid3' | 'grid2'>('grid3');
  const [showSidebar, setShowSidebar] = useState(true);
  const [sort, setSort] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const sortRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const sorted = sortProducts(initialProducts, sort);

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice || maxPrice) {
      params.set('price', `${minPrice || 0}-${maxPrice || 999999999}`);
    } else {
      params.delete('price');
    }
    router.push(`/shop?${params.toString()}`);
  };

  const clearPriceFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('price');
    router.push(`/shop?${params.toString()}`);
  };

  const currentSort = SORT_OPTIONS.find(o => o.value === sort) || SORT_OPTIONS[0];

  return (
    <div className="w-full">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between py-6 mt-8 border-t border-gray-200 gap-4">
        <span className="text-sm font-semibold text-gray-500 tracking-wide">
          {sorted.length} Produk Ditemukan
        </span>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-500">Urutkan</span>

          {/* Sort Dropdown */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-[#00A19D] transition-colors"
            >
              {currentSort.label}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 min-w-[180px] py-2 overflow-hidden">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => { setSort(opt.value); setSortOpen(false); }}
                    className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors hover:bg-[#133A42]/5 hover:text-[#133A42] ${sort === opt.value ? 'bg-[#133A42]/5 text-[#133A42] font-bold' : 'text-gray-700'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              title={showSidebar ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
              className={`p-2 border-r border-gray-200 transition-colors ${showSidebar ? 'bg-[#133A42] text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridView(gridView === 'grid3' ? 'grid2' : 'grid3')}
              title={gridView === 'grid3' ? 'Tampilan 2 Kolom' : 'Tampilan 3 Kolom'}
              className={`p-2 transition-colors ${gridView === 'grid2' ? 'bg-[#133A42] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {gridView === 'grid3' ? <LayoutGrid className="w-4 h-4" /> : <LayoutList className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <div className={`flex gap-8 mt-4 items-start relative transition-all duration-300`}>
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-60 flex-shrink-0 space-y-6 sticky top-28 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-[#133A42]">Filter</span>
              <button onClick={() => setShowSidebar(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <h3 className="font-bold text-[#133A42] text-sm">Kategori</h3>
              <div className="space-y-2">
                {allCategories.filter(c => c.slug !== '').map(c => (
                  <Link
                    key={c.slug || c.name}
                    href={c.slug === currentCategory ? '/shop' : `/shop?category=${c.slug}`}
                    className={`flex items-center gap-3 text-sm cursor-pointer transition-colors ${
                      currentCategory === c.slug
                        ? 'text-[#00A19D] font-bold'
                        : 'text-gray-700 hover:text-[#00A19D] font-medium'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${currentCategory === c.slug ? 'border-[#00A19D] bg-[#00A19D]' : 'border-gray-300'}`}>
                      {currentCategory === c.slug && <span className="text-white text-[8px] font-bold">✓</span>}
                    </div>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <h3 className="font-bold text-[#133A42] text-sm">Harga (Rp)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  className="w-full text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-lg p-2 outline-none focus:border-[#00A19D]"
                />
                <span className="text-gray-400">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="w-full text-xs font-medium text-gray-900 bg-white border border-gray-200 rounded-lg p-2 outline-none focus:border-[#00A19D]"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={applyPriceFilter}
                  className="flex-1 py-1.5 text-xs font-bold bg-[#133A42] text-white rounded-lg hover:bg-[#00A19D] transition-colors"
                >
                  Terapkan
                </button>
                {(minPrice || maxPrice) && (
                  <button
                    onClick={clearPriceFilter}
                    className="px-3 py-1.5 text-xs font-bold bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <h3 className="font-bold text-[#133A42] text-sm">Status</h3>
              <div className="space-y-2">
                {[
                  { label: 'In Stock', cls: 'bg-lime-200 text-lime-900' },
                  { label: 'New In', cls: 'bg-cyan-100 text-cyan-900' },
                  { label: 'On Sale', cls: 'bg-fuchsia-200 text-fuchsia-900' },
                  { label: 'Sold Out', cls: 'bg-red-100 text-red-800' },
                ].map(s => (
                  <span key={s.label} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mr-1 mb-1 ${s.cls}`}>
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1 min-w-0">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-gray-400 gap-4">
              <ShoppingBag className="w-16 h-16 opacity-20" />
              <p className="font-semibold text-lg">Belum ada produk.</p>
              <p className="text-sm">Coba ubah filter pencarian.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              gridView === 'grid3'
                ? showSidebar ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1 sm:grid-cols-2'
            }`}>
              {sorted.map((p) => {
                const tag = STATUS_TAG[p.status] ?? STATUS_TAG.in_stock;
                return (
                  <Link key={p.id} href={`/products/${p.id}`} className="group flex flex-col cursor-pointer block">
                    <div className={`w-full ${gridView === 'grid2' ? 'h-96' : 'h-72 lg:h-80'} rounded-[2rem] bg-gray-200 mb-4 relative overflow-hidden group-hover:shadow-xl transition-all duration-300`}>
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest z-10 ${tag.cls}`}>
                        {tag.label}
                      </span>
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute bottom-4 right-4 bg-white p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-300 text-gray-900 z-10 hover:bg-[#133A42] hover:text-white">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="font-bold text-[#133A42] text-sm mb-1 leading-snug">{p.name}</h3>
                    {p.category && <p className="text-xs text-gray-400 mb-1">{p.category}</p>}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-[#00A19D]">{formatRupiah(p.price)}</span>
                      {p.sale_price && (
                        <span className="text-gray-400 line-through text-xs font-medium">{formatRupiah(p.sale_price)}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
