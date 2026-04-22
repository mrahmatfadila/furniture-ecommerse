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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#133A42]/20 border-t-[#00A19D] rounded-full animate-spin"></div>
        <p className="font-bold text-[#133A42] text-lg animate-pulse">Memuat Keranjang...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#133A42] tracking-tight">Keranjang Anda</h1>
            <p className="text-gray-500 mt-2 text-xs md:text-sm">Review barang Anda sebelum melanjutkan ke pembayaran.</p>
          </div>
          <p className="hidden sm:block font-bold text-[#00A19D] bg-[#00A19D]/10 px-4 py-2 rounded-full text-xs md:text-sm">
            {cart.length} Barang
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white p-8 md:p-16 text-center rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
            <ShoppingBag className="w-16 h-16 md:w-20 md:h-20 text-gray-300 mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-4">Keranjang Kosong</h2>
            <p className="text-gray-500 mb-8 max-w-md text-sm md:text-base">Anda belum memasukkan apa-apa ke keranjang. Mari temukan produk furnitur impian Anda!</p>
            <Link href="/shop" className="bg-[#133A42] text-white px-6 md:px-8 py-3 md:py-3.5 rounded-full font-bold flex items-center gap-2 hover:bg-[#00A19D] transition-colors shadow-lg shadow-[#133A42]/20 text-sm md:text-base">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" /> Belanja Sekarang
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
            {/* items list */}
            <div className="flex-1 space-y-4">
              {cart.map(item => {
                const price = item.sale_price ? parseFloat(item.sale_price) : parseFloat(item.price);
                return (
                  <div key={item.cart_id} className="bg-white p-4 sm:p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 group">
                    
                    <div className="flex items-center gap-4 w-full sm:w-auto flex-1">
                      <img src={item.image_url} alt={item.name} className="w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-2xl bg-gray-50 flex-shrink-0 group-hover:scale-[1.02] transition-transform" />
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[#133A42] text-base sm:text-xl line-clamp-2 mb-1">{item.name}</h3>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-widest font-bold">{item.category}</p>
                        <div className="mt-2 sm:hidden font-extrabold text-[#00A19D] text-base">
                          {formatRupiah((price * item.quantity).toString())}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100 mt-2 sm:mt-0">
                      <div className="bg-gray-50 px-3 sm:px-4 h-9 sm:h-11 rounded-xl text-xs sm:text-sm font-bold text-[#133A42] border border-gray-100 flex items-center gap-2">
                        <span className="text-gray-400 font-medium tracking-wide">Qty:</span> {item.quantity}
                      </div>
                      
                      <div className="hidden sm:block font-extrabold text-[#133A42] text-xl lg:text-2xl min-w-[140px] text-right tracking-tight">
                        {formatRupiah((price * item.quantity).toString())}
                      </div>

                      <button onClick={() => removeItem(item.cart_id)} className="w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors ml-auto sm:ml-0" title="Hapus Barang">
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* order summary */}
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#133A42]/10 shadow-lg lg:sticky lg:top-28">
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
                  className={`w-full text-white py-4 rounded-full font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg text-sm md:text-base ${loading ? 'bg-gray-400 cursor-not-allowed shadow-none' : 'bg-[#133A42] hover:bg-[#00A19D] shadow-[#133A42]/20 hover:-translate-y-1'}`}
                >
                  {loading ? 'Memproses...' : 'Bayar Sekarang'} <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
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
          <div className="mt-12 md:mt-16 pt-8 border-t border-gray-200 flex flex-wrap justify-center gap-6 md:gap-16 opacity-60">
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-500"><span className="w-2 h-2 rounded-full bg-green-500"></span> Pembayaran Aman 100%</div>
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-500"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Return Mudah 30 Hari</div>
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-500"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Pengiriman Cepat</div>
          </div>
        )}
      </div>
    </div>
  );
}
