import Link from 'next/link';

const blogs = [
  { id: 1, title: '5 Tips Mengubah Ruang Tamu Anda Menjadi Estetik', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800', date: '21 Mar 2026', category: 'Inspirasi' },
  { id: 2, title: 'Menata Meja Kerja Untuk Produktivitas Penuh', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800', date: '15 Mar 2026', category: 'Tips & Trik' },
  { id: 3, title: 'Kapan Waktu yang Tepat Mengganti Busa Sofa Anda?', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800', date: '02 Mar 2026', category: 'Perawatan' },
];

export default function BlogPage() {
  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#133A42] tracking-tight mb-4">Blog & Kisah Kami</h1>
          <p className="text-gray-500 text-lg">Temukan inspirasi penataan ruangan, panduan gaya hidup, serta kiat-kiat merawat perlengkapan furnitur Anda agar awet dari para ahli.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map(blog => (
            <Link href={`/blog/${blog.id}`} key={blog.id} className="bg-white group rounded-3xl overflow-hidden shadow-sm hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-2 cursor-pointer border border-gray-100 flex flex-col">
              <div className="h-64 overflow-hidden relative">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-[#133A42] uppercase tracking-wider">{blog.category}</div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <p className="text-sm font-semibold text-[#00A19D] mb-3">{blog.date}</p>
                <h3 className="text-2xl font-bold text-[#133A42] mb-4 group-hover:text-[#00A19D] transition-colors leading-snug">{blog.title}</h3>
                <div className="mt-auto">
                   <div className="font-bold border-b-2 border-transparent group-hover:border-[#133A42] text-[#133A42] transition-all inline-flex pb-1">Baca Selengkapnya</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12 hidden">
           <button className="bg-white border-2 border-[#133A42] text-[#133A42] font-bold px-8 py-3 rounded-full hover:bg-[#133A42] hover:text-white transition-colors">Muat Lebih Banyak</button>
        </div>
      </div>
    </div>
  );
}
