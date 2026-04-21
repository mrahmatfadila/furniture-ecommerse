import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, ArrowLeft, Search, Truck, Wrench, Leaf, ChevronDown, Armchair } from "lucide-react";
import { formatRupiah } from "@/lib/currency";
import pool from "@/lib/db";
import HowItWorks from "@/components/HowItWorks";
import HomeSearchBar from "@/components/HomeSearchBar";

const FALLBACK_PRODUCTS = [
  { id: 0, name: 'Velvet Cloud Armchair',   price: '2100000', sale_price: '2700000', image_url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop' },
  { id: 0, name: 'Hexa Wood Coffee Table',  price: '3850000', sale_price: '4900000', image_url: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=600&auto=format&fit=crop' },
  { id: 0, name: 'Aura Pendant Light',      price: '1750000', sale_price: '2400000', image_url: 'https://images.unsplash.com/photo-1540932239986-30128078f3b5?q=80&w=600&auto=format&fit=crop' },
  { id: 0, name: 'Terra Ceramic Vases',     price: '950000',  sale_price: '1300000', image_url: 'https://images.unsplash.com/photo-1612152505975-6454ce466c6e?q=80&w=600&auto=format&fit=crop' },
];

export default async function Home() {
  let dbProducts: any[] = [];
  let dbCategories: any[] = [];
  try {
    const [rows]: any = await pool.query('SELECT * FROM products ORDER BY id DESC LIMIT 8');
    dbProducts = rows;

    const [catRows]: any = await pool.query('SELECT * FROM categories ORDER BY sort_order ASC LIMIT 4');
    dbCategories = catRows;
  } catch(_) {}
  
  const trendingProducts = dbProducts.length > 0 ? dbProducts : FALLBACK_PRODUCTS;
  return (
    <div className="flex flex-col items-center justify-center w-full overflow-hidden">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24 text-center flex flex-col items-center">
        <div className="text-gray-500 font-semibold text-sm mb-6 flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#00A19D]" /> 1000+ daily orders shipped all over the United States.
        </div>
        
        <h1 className="text-[3.5rem] md:text-[4.5rem] font-bold tracking-tight text-[#133A42] mb-6 max-w-4xl leading-[1.1]">
          Luxury Furniture <br/> for Every <span className="text-[#00A19D]">Room</span> and <span className="text-[#00A19D]">Style</span>
        </h1>
        
        <p className="text-gray-500 mb-10 text-lg">
          Transform your home with statement pieces.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-12 mb-20 relative">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/shop" className="bg-[#133A42] text-white pl-8 pr-6 py-4 rounded-full font-semibold hover:bg-emerald-950 transition-all flex items-center gap-3 shadow-lg shadow-[#133A42]/20">
              Start Shopping <span className="text-2xl text-[#00A19D] leading-none mb-1">✺</span>
            </Link>
            <Link href="/about" className="bg-white border border-gray-100 text-[#133A42] px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all shadow-sm">
              Learn More
            </Link>
          </div>
          
          <div className="flex flex-col items-center sm:ml-8">
            <div className="flex items-center gap-1 text-[#FDB022] mb-1">
              {[1,2,3,4,5].map((i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              <span className="text-[#133A42] font-bold text-lg ml-1">5.0</span>
            </div>
            <span className="text-xs text-gray-500 underline decoration-gray-300 underline-offset-4 cursor-pointer hover:text-gray-700">From 90k+ reviews</span>
          </div>
        </div>
        
        {/* Search Bar */}
        <HomeSearchBar />

      </section>
      
      {/* Logos */}
      <section className="w-full bg-white flex flex-col items-center justify-center pt-8 pb-16 px-4">
         <div className="flex items-center gap-3 mb-12">
            <div className="w-2 h-2 rotate-45 bg-[#133A42]"></div>
            <span className="text-[#133A42] font-bold tracking-wider text-base">Trusted By</span>
            <div className="w-2 h-2 rotate-45 bg-[#133A42]"></div>
         </div>
         
         <div className="w-full max-w-5xl mx-auto flex items-center justify-between gap-6 flex-wrap relative">
           <button className="hidden md:flex items-center justify-center text-gray-400 hover:text-[#133A42] opacity-50"><ArrowLeft className="w-5 h-5"/></button>
           {["Panasonic", "Alibaba", "Hitachi", "amazon", "MasterCard"].map((logo) => (
             <span key={logo} className="text-2xl font-bold text-[#133A42] opacity-80 hover:opacity-100 transition-opacity">
               {logo}
             </span>
           ))}
           <button className="hidden md:flex items-center justify-center text-gray-400 hover:text-[#133A42] opacity-50"><ArrowRight className="w-5 h-5"/></button>
         </div>
      </section>

      {/* Trending Picks */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24">
         <div className="flex justify-between items-end mb-10 text-left">
           <h2 className="text-3xl font-bold text-gray-900">Trending Picks 🔥</h2>
           <Link href="/shop" className="text-sm font-semibold text-[#133A42] border border-[#133A42] px-4 py-2 rounded-full hover:bg-emerald-50 transition-colors">View All &rarr;</Link>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left">
            {trendingProducts.slice(0, 4).map((p, i) => (
               <Link key={p.id || i} href={p.id ? `/products/${p.id}` : '/shop'} className="group cursor-pointer block">
                 <div className="w-full h-72 rounded-3xl overflow-hidden mb-4 bg-gray-100">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                 </div>
                 <h3 className="text-base font-semibold text-[#133A42] mb-1">{p.name}</h3>
                 <div className="flex items-center gap-3">
                   <span className="font-bold text-[#00A19D]">{formatRupiah(p.price)}</span>
                   {p.sale_price && <span className="text-gray-400 line-through text-xs">{formatRupiah(p.sale_price)}</span>}
                 </div>
                 <div className="flex items-center text-amber-500 mt-2 gap-1 text-xs">
                   <Star className="w-3 h-3 fill-current" /> <span className="font-semibold text-gray-700">5.0</span>
                 </div>
               </Link>
            ))}
         </div>
      </section>

      {/* Explore Our Categories */}
      <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24">
         <div className="flex justify-between items-center mb-16 px-2">
            <div className="flex items-center gap-3">
               <div className="flex gap-1.5 opacity-80">
                 <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#00A19D]"></div>
                 <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-200"></div>
               </div>
               <h2 className="text-4xl font-bold text-[#3A3F45] tracking-tight mx-2">Explore Our Categories</h2>
               <div className="flex gap-1.5 opacity-80">
                 <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#00A19D]"></div>
                 <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-200"></div>
               </div>
            </div>
            
            <Link href="/categories" className="hidden md:flex text-xs font-bold text-gray-600 border border-gray-200 px-6 py-2.5 rounded hover:bg-gray-50 items-center justify-center transition-colors uppercase gap-4 tracking-wider">
               <span className="text-gray-300 font-light tracking-widest leading-none">---&gt;</span> VIEW ALL
            </Link>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
           {dbCategories.length > 0 ? (
             dbCategories.map((item: any, idx: number) => (
                <Link key={idx} href={`/shop?category=${item.slug || item.name}`} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col group hover:border-[#00A19D] transition-all">
                   <div className="w-full h-52 rounded-2xl mb-6 overflow-hidden bg-gray-100">
                      <img src={item.image_url || `https://placehold.co/500x500/e5e7eb/9ca3af?text=${encodeURIComponent(item.name)}`} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   </div>
                   <div className="flex flex-col text-left px-1 pb-1">
                      <span className="text-[13px] font-bold text-[#133A42] tracking-tight mb-2 opacity-90">{item.name}</span>
                      <div className="flex justify-between items-center mt-2">
                         <span className="text-xl font-extrabold text-[#111827]">{item.slug || item.name}</span>
                         <div className="w-9 h-9 rounded-full bg-[#E5F5F5] text-[#00A19D] flex items-center justify-center group-hover:bg-[#00A19D] group-hover:text-white transition-colors flex-shrink-0">
                            <ArrowRight className="w-4 h-4 -rotate-45" strokeWidth={3} />
                         </div>
                      </div>
                   </div>
                </Link>
             ))
           ) : (
             [
               { name: 'Comfort Beds', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=500&auto=format&fit=crop', label: 'Beds' },
               { name: 'Relaxing Sofas', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=500&auto=format&fit=crop', label: 'Sofas' },
               { name: 'Stylish Chairs', img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=500&auto=format&fit=crop', label: 'Chairs' },
               { name: 'Smart Storage', img: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=500&auto=format&fit=crop', label: 'Storage' },
             ].map((item, idx) => (
                <Link key={idx} href={`/shop?category=${item.label}`} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col group hover:border-[#00A19D] transition-all">
                   <div className="w-full h-52 rounded-2xl mb-6 overflow-hidden bg-gray-100">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   </div>
                   <div className="flex flex-col text-left px-1 pb-1">
                      <span className="text-[13px] font-bold text-[#133A42] tracking-tight mb-2 opacity-90">{item.name}</span>
                      <div className="flex justify-between items-center mt-2">
                         <span className="text-xl font-extrabold text-[#111827]">{item.label}</span>
                         <div className="w-9 h-9 rounded-full bg-[#E5F5F5] text-[#00A19D] flex items-center justify-center group-hover:bg-[#00A19D] group-hover:text-white transition-colors flex-shrink-0">
                            <ArrowRight className="w-4 h-4 -rotate-45" strokeWidth={3} />
                         </div>
                      </div>
                   </div>
                </Link>
             ))
           )}
        </div>
      </section>

      {/* Try Our E-commerce View component - All Product Grid Preview */}
      <section className="w-full bg-gray-50 py-24 border-y border-gray-100">
         <div className="max-w-7xl mx-auto px-6 md:px-12 text-center flex flex-col items-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 capitalize text-left w-full border-b border-gray-200 pb-4">All Products Preview (E-commerce Section)</h2>
            <div className="text-left w-full mb-8">
               <p className="text-gray-500 mb-8">Experience a dedicated full e-commerce view with filters.</p>
               <Link href="/shop" className="bg-emerald-900 text-white px-8 py-4 rounded-full font-medium hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 max-w-xs text-center shadow-lg shadow-emerald-900/20">
                  Go to full Shop view <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
         </div>
      </section>
      
      {/* How it Works */}
      <HowItWorks />
      
    </div>
  );
}
