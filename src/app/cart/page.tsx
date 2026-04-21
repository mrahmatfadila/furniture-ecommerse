'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { formatRupiah } from '@/lib/currency';

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const res = await fetch('/api/cart');
    const data = await res.json();
    if (!data.success) {
      if (data.error === 'Unauthorized') router.push('/login');
    } else {
      setCart(data.data);
    }
    setLoading(false);
  };

  const removeItem = async (id: number) => {
    if (!confirm('Hapus produk ini dari keranjang?')) return;
    try {
      await fetch(`/api/cart?id=${id}`, { method: 'DELETE' });
      setCart(prev => prev.filter(c => c.cart_id !== id));
    } catch(e) {}
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    try {
      setLoading(true);
      const res = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        router.push(`/checkout/receipt?id=${data.orderId}`);
      } else {
        alert(data.error);
        setLoading(false);
      }
    } catch(e) {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => {
    const price = item.sale_price ? parseFloat(item.sale_price) : parseFloat(item.price);
    return sum + (price * item.quantity);
  }, 0);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-[#133A42] text-xl animate-pulse">Memuat Keranjang...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-10 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-4xl font-bold text-[#133A42] tracking-tight">Keranjang Anda</h1>
            <p className="text-gray-500 mt-2 text-sm">Review barang Anda sebelum melanjutkan ke pembayaran.</p>
          </div>
          <p className="hidden md:block font-bold text-[#00A19D] bg-[#00A19D]/10 px-4 py-2 rounded-full text-sm">
            {cart.length} Barang Tersimpan
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
            <ShoppingBag className="w-16 h-16 text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Keranjang Kosong</h2>
            <p className="text-gray-500 mb-8 max-w-md">Anda belum memasukkan apa-apa ke keranjang. Mari temukan produk furnitur impian Anda!</p>
            <Link href="/shop" className="bg-[#133A42] text-white px-8 py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#00A19D] transition-colors shadow-lg shadow-[#133A42]/20">
              <ArrowLeft className="w-4 h-4" /> Belanja Sekarang
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* items list */}
            <div className="flex-1 space-y-4">
              {cart.map(item => {
                const price = item.sale_price ? parseFloat(item.sale_price) : parseFloat(item.price);
                return (
                  <div key={item.cart_id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all flex flex-col lg:flex-row items-center gap-6 group">
                    <img src={item.image_url} alt={item.name} className="w-full lg:w-28 h-48 lg:h-28 object-cover rounded-2xl bg-gray-50 flex-shrink-0 group-hover:scale-[1.02] transition-transform" />
                    
                    <div className="flex-1 w-full min-w-0">
                      <h3 className="font-bold text-[#133A42] text-lg lg:text-xl truncate mb-1">{item.name}</h3>
                      <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">{item.category}</p>
                    </div>
                    
                    <div className="flex items-center justify-between w-full lg:w-auto gap-4 lg:gap-8">
                      <div className="bg-gray-50 px-4 h-11 rounded-xl text-sm font-bold text-[#133A42] border border-gray-100 flex items-center gap-2">
                        <span className="text-gray-400 font-medium tracking-wide">Qty:</span> {item.quantity}
                      </div>
                      
                      <div className="font-extrabold text-[#133A42] text-xl lg:text-2xl min-w-[140px] text-right tracking-tight">
                        {formatRupiah((price * item.quantity).toString())}
                      </div>

                      <button onClick={() => removeItem(item.cart_id)} className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors" title="Hapus Barang">
                        <Trash2 className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* order summary */}
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <div className="bg-white p-8 rounded-[2rem] border border-[#133A42]/10 shadow-[0_20px_60px_rgb(0,0,0,0.05)] sticky top-28">
                <h3 className="text-xl font-bold text-[#133A42] mb-6 border-b border-gray-100 pb-4">Ringkasan Pesanan</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Total Harga ({cart.length} barang)</span>
                    <span className="font-semibold">{formatRupiah(total.toString())}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Diskon Ongkir</span>
                    <span className="font-semibold text-green-500">- Rp 50.000</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-6 mb-8 flex flex-col gap-2">
                  <span className="text-gray-900 font-bold">Total Pembayaran</span>
                  <span className="text-3xl font-black text-[#00A19D]">{formatRupiah((total - 50000 > 0 ? total - 50000 : 0).toString())}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className={`w-full text-white py-4 rounded-full font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-[#133A42] hover:bg-[#00A19D] shadow-[#133A42]/20 hover:-translate-y-1'}`}
                >
                  {loading ? 'Memproses...' : 'Bayar Sekarang'} <ArrowRight className="w-4 h-4" />
                </button>
                
                <p className="text-[10px] text-gray-400 text-center mt-6 leading-relaxed">
                  Dengan memproses pesanan, Anda menyetujui syarat & ketentuan Furniture Co.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Support badges at the bottom */}
        {cart.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200 flex flex-wrap justify-center gap-8 md:gap-16 opacity-60">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500"><span className="w-2 h-2 rounded-full bg-green-500"></span> Pembayaran Aman 100%</div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Return Mudah 30 Hari</div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Pengiriman Cepat</div>
          </div>
        )}
      </div>
    </div>
  );
}
