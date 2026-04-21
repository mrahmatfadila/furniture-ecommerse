import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

const blogs = [
  { id: 1, title: '5 Tips Mengubah Ruang Tamu Anda Menjadi Estetik', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200', date: '21 Mar 2026', category: 'Inspirasi' },
  { id: 2, title: 'Menata Meja Kerja Untuk Produktivitas Penuh', image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200', date: '15 Mar 2026', category: 'Tips & Trik' },
  { id: 3, title: 'Kapan Waktu yang Tepat Mengganti Busa Sofa Anda?', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200', date: '02 Mar 2026', category: 'Perawatan' },
];

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blogId = parseInt(id);
  const blog = blogs.find(b => b.id === blogId);

  if (!blog) {
    notFound();
  }

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 md:px-12 pt-8">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00A19D] font-bold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Blog List
        </Link>
        
        <div className="mb-10 text-center">
           <div className="inline-block bg-[#00A19D]/10 text-[#00A19D] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              {blog.category}
           </div>
           <h1 className="text-4xl md:text-5xl font-black text-[#133A42] tracking-tight mb-6 leading-tight max-w-3xl mx-auto">{blog.title}</h1>
           <p className="text-gray-400 font-semibold">{blog.date} • Ditulis oleh Tim Desain</p>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 md:px-12 mb-16">
         <div className="w-full h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
         </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="prose prose-lg text-gray-600 prose-headings:text-[#133A42] prose-a:text-[#00A19D] prose-img:rounded-3xl max-w-none">
          <p className="lead text-xl">Menemukan keseimbangan yang tepat antara fungsionalitas dan tampilan estetika adalah langkah pertama yang krusial untuk membuat rumah yang nyaman. Di artikel ini, kita akan membahas lebih dalam bagaimana mencapai harmoni tersebut.</p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Kenapa Pemilihan Furnitur Sangat Penting?</h2>
          <p>Banyak dari kita yang mengabaikan bahwa furnitur adalah kunci utama yang mempengaruhi kebiasaan sehari-hari dan energi ruangan. Mulai dari warna bahan kain hingga kepadatan bantalan busa, setiap elemen memainkan peran besarnya. Olehnya itu, riset mendalam sebelum membeli sangatlah tidak bisa ditawar lagi!</p>
          
          <blockquote className="border-l-4 border-[#00A19D] pl-6 italic font-bold text-gray-500 my-8 py-2">
            "Ruangan bukan sekedar tempat Anda tidur atau bekerja, melainkan refleksi dari nilai dan kedamaian pikiran Anda." — Senior Interior Designer.
          </blockquote>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Langkah Awal yang Mudah</h2>
          <p>Jika Anda merasa kewalahan harus mulai darimana, mulailah dengan membersihkan (decluttering). Menyingkirkan perabotan yang sudah lapuk dan menggantinya dengan satu furnitur ikonik yang multifungsi adalah tren nomor satu tahun ini.</p>
          <p className="mt-8">Jangan ragu untuk mengelilingi etalase beranda kami untuk mencari potongan furnitur yang didesain secara brilian. Sampai jumpa di kisah interior berikutnya!</p>
        </div>
        
        <div className="mt-16 pt-10 border-t border-gray-100 flex justify-between items-center text-sm font-bold text-gray-400">
           <Link href="/blog" className="hover:text-[#133A42] transition-colors">Bagikan Artikel</Link>
           <span className="bg-gray-50 px-4 py-2 rounded-full cursor-not-allowed hidden md:block">Terima Kasih Telah Membaca</span>
        </div>
      </div>
    </div>
  );
}
