'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';

const CATEGORIES = ['Semua Kategori', 'Sofas', 'Chairs', 'Tables', 'Beds', 'Storage', 'Lighting', 'Decor'];
const TYPES = ['Semua Tipe', 'Modern', 'Skandinavia', 'Minimalis', 'Klasik', 'Industrial', 'Bohemian'];
const PRICES = [
  { label: 'Semua Harga', value: '' },
  { label: 'Di bawah Rp 500k', value: '0-500000' },
  { label: 'Rp 500k – 1 juta', value: '500000-1000000' },
  { label: 'Rp 1 juta – 3 juta', value: '1000000-3000000' },
  { label: 'Rp 3 juta – 5 juta', value: '3000000-5000000' },
  { label: 'Di atas Rp 5 juta', value: '5000000-999999999' },
];
const MATERIALS = ['Semua Material', 'Kayu Jati', 'Kayu Mahoni', 'Rotan', 'Metal', 'Plastik', 'Kain Velvet', 'Kulit'];

function Dropdown({
  icon,
  label,
  options,
  value,
  onChange,
  isLast,
}: {
  icon: string;
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  isLast?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className={`relative flex-1 min-w-[140px] ${!isLast ? 'md:border-r border-gray-100' : ''}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-2 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-lg leading-none">{icon}</span>
          <span className="text-gray-700 text-sm font-semibold truncate max-w-[120px]">
            {value || label}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-3 bg-white rounded-2xl shadow-[0_20px_60px_rgb(0,0,0,0.12)] border border-gray-100 z-50 min-w-[200px] py-2 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt.startsWith('Semua') ? '' : opt); setOpen(false); }}
              className={`w-full text-left px-5 py-3 text-sm font-medium hover:bg-[#133A42]/5 hover:text-[#133A42] transition-colors ${
                value === opt || (!value && opt.startsWith('Semua')) ? 'bg-[#133A42]/5 text-[#133A42] font-bold' : 'text-gray-700'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function HomeSearchBar() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [material, setMaterial] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (type) params.set('type', type);
    if (price) params.set('price', price);
    if (material) params.set('material', material);
    router.push(`/shop${params.toString() ? '?' + params.toString() : ''}`);
  };

  return (
    <div className="w-full max-w-4xl bg-white p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-wrap md:flex-nowrap items-center justify-between mb-24 border border-gray-100 gap-y-2">
      <Dropdown icon="⊞" label="Kategori" options={CATEGORIES} value={category} onChange={setCategory} />
      <Dropdown icon="✓" label="Tipe Furnitur" options={TYPES} value={type} onChange={setType} />
      <Dropdown icon="⊡" label="Rentang Harga" options={PRICES.map(p => p.label)} value={PRICES.find(p => p.value === price)?.label || ''} onChange={(v) => setPrice(PRICES.find(p => p.label === v)?.value || '')} />
      <Dropdown icon="⟐" label="Material" options={MATERIALS} value={material} onChange={setMaterial} isLast />

      <button
        onClick={handleSearch}
        className="bg-[#133A42] text-white px-8 py-3.5 rounded-full font-semibold hover:bg-[#00A19D] transition-colors flex items-center gap-2 flex-shrink-0 w-full md:w-auto justify-center shadow-lg shadow-[#133A42]/20 hover:-translate-y-0.5 transition-all"
      >
        <Search className="w-4 h-4" /> Cari Produk
      </button>
    </div>
  );
}
