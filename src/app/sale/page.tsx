import Link from 'next/link';
import pool from '@/lib/db';
import { formatRupiah } from '@/lib/currency';
import { ShoppingBag, Star, Tag } from 'lucide-react';

export default async function SalePage() {
  const [products]: any = await pool.query('SELECT * FROM products WHERE sale_price IS NOT NULL AND sale_price != price ORDER BY created_at DESC');

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="bg-[#133A42] w-full py-16 px-6 mb-12">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
           <div className="w-16 h-16 bg-[#00A19D] rounded-full flex items-center justify-center mb-6">
              <Tag className="w-8 h-8 text-white" />
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 uppercase">Clearance <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A19D] to-[#88DFDE]">Sale</span></h1>
           <p className="text-teal-50 drop-shadow max-w-xl text-lg opacity-90">Nikmati potongan harga eksklusif untuk koleksi terpilih. Stok sangat terbatas, wujudkan rumah impian Anda hari ini juga!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-gray-400 gap-6">
            <ShoppingBag className="w-20 h-20 opacity-20" />
            <p className="font-bold text-xl text-gray-500">Tidak ada barang promo saat ini.</p>
            <Link href="/shop" className="bg-[#133A42] text-white px-8 py-3 rounded-full hover:bg-[#00A19D] transition-colors shadow-lg">Kembali ke Shop</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((p: any) => {
              const normalPrice = parseFloat(p.price);
              const salePrice = p.sale_price ? parseFloat(p.sale_price) : normalPrice;
              const hasDiscount = salePrice < normalPrice;
              const discountPercent = hasDiscount ? Math.round(((normalPrice - salePrice) / normalPrice) * 100) : 0;

              return (
                <div key={p.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#133A42]/10 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(19,58,66,0.08)] transition-all duration-500 transform hover:-translate-y-2">
                  <Link href={`/products/${p.id}`} className="block relative h-64 md:h-80 overflow-hidden bg-gray-100">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="bg-[#00A19D] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">- {discountPercent}% OFF</span>
                    </div>

                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white cursor-pointer shadow-sm transition-all z-10">
                      <Star className="w-4 h-4" />
                    </div>
                  </Link>
                  <div className="p-5 md:p-6 flex flex-col flex-1">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">{p.category}</div>
                    <Link href={`/products/${p.id}`}>
                      <h3 className="font-bold text-[#133A42] text-lg lg:text-xl leading-tight mb-3 group-hover:text-[#00A19D] transition-colors">{p.name}</h3>
                    </Link>
                    <div className="mt-auto flex flex-col gap-1">
                      <div className="text-gray-400 text-sm line-through decoration-red-500/50">{formatRupiah(p.price)}</div>
                      <div className="font-black text-[#00A19D] text-xl tracking-tight">{formatRupiah(p.sale_price)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
