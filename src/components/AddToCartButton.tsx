'use client';

import { useState } from 'react';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({ productId }: { productId: number }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleAdd = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      const data = await res.json();
      
      if (!data.success) {
        if (data.error === 'Unauthorized') {
          router.push('/login');
        } else {
          alert('Gagal menambahkan ke keranjang: ' + data.error);
        }
      } else {
        setSuccess(true);
        router.refresh(); // Update the cart count in navbar
        setTimeout(() => setSuccess(false), 2500); // Reset after 2.5s
      }
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <button 
        className="flex-1 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-3 text-sm shadow-lg shadow-emerald-500/30 bg-emerald-500 scale-100 ease-out duration-300"
        disabled
      >
        <CheckCircle2 className="w-5 h-5 animate-pulse" /> 
        Berhasil Ditambahkan!
      </button>
    );
  }

  return (
    <button 
      onClick={handleAdd}
      disabled={loading}
      className={`flex-1 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-3 text-sm shadow-lg shadow-[#133A42]/20 ${
        loading ? 'bg-[#133A42]/80 cursor-not-allowed transform scale-[0.98]' : 'bg-[#133A42] hover:bg-[#00A19D] hover:-translate-y-1 hover:shadow-xl hover:shadow-[#00A19D]/20 active:scale-95'
      }`}
    >
      <ShoppingCart className={`w-5 h-5 ${loading ? 'animate-bounce' : ''}`} /> 
      {loading ? 'Memproses...' : 'Tambah ke Keranjang'}
    </button>
  );
}
