import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const rooms = [
  { id: 1, title: 'Ketenangan Skandinavia', image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1000', size: 'large' },
  { id: 2, title: 'Estetika Jepang Minimalis', image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800', size: 'regular' },
  { id: 3, title: 'Kehangatan Bohemian', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', size: 'regular' },
  { id: 4, title: 'Modern Industrial', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', size: 'regular' },
  { id: 5, title: 'Oase Kontemporer', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1000', size: 'large' },
];

export default function RoomIdeasPage() {
  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pt-12 border-b border-gray-200 pb-8">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-black text-[#133A42] tracking-tight mb-4">Inspirasi Ruang Anda</h1>
            <p className="text-gray-500 text-lg">Eksplorasi koleksi tata letak ruangan yang dirancang khusus oleh desainer interior kami untuk menstimulasi imajinasi Anda.</p>
          </div>
          <Link href="/shop" className="inline-flex font-bold items-center gap-2 text-[#00A19D] hover:text-[#133A42] border-b-2 border-[#00A19D] hover:border-[#133A42] pb-1 transition-all">
            Lihat Semua Koleksi
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[350px]">
          {rooms.map((room, index) => (
            <Link 
              href="/shop"
              key={room.id} 
              className={`block relative rounded-3xl overflow-hidden group border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all transform hover:-translate-y-1 ${room.size === 'large' ? 'md:col-span-2' : ''}`}
            >
              <img src={room.image} alt={room.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#133A42]/90 via-[#133A42]/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 p-8 w-full flex items-end justify-between">
                 <div>
                   <p className="text-teal-400 font-bold text-xs uppercase tracking-widest mb-2">Desain Kurasi</p>
                   <h3 className="text-3xl font-extrabold text-white leading-tight">{room.title}</h3>
                 </div>
                 
                 <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:bg-[#00A19D] group-hover:text-white transition-colors cursor-pointer">
                    <ArrowUpRight className="w-6 h-6" />
                 </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
