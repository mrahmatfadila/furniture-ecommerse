import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold text-[#133A42] tracking-tight mb-4">Membangun Kenyamanan Setiap Rumah.</h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Furniture Co lahir dari ide sederhana: setiap orang berhak memiliki rumah yang mencerminkan karakter terbaik mereka, tanpa harus berurusan dengan proses yang rumit dan mebel yang kaku. Sejak tahun 2026, kami menempatkan estetika, kenyamanan, dan keberlanjutan pada intinya.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Misi kami bukan hanya sekedar berjualan kursi atau meja, tapi merancang kehangatan di ruang keluarga Anda, dan membangkitkan produktivitas di ruang kerja melalui furnitur terbaik dari pekerja kayu pengrajin lokal berbakat.
            </p>
            <div className="pt-8 flex flex-wrap gap-12">
              <div>
                <p className="text-4xl font-black text-[#00A19D]">50k+</p>
                <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mt-2">Keluarga Bahagia</p>
              </div>
              <div>
                <p className="text-4xl font-black text-[#00A19D]">200+</p>
                <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mt-2">Pilihan Desain</p>
              </div>
              <div>
                <p className="text-4xl font-black text-[#00A19D]">10</p>
                <p className="text-xs uppercase tracking-widest font-bold text-gray-500 mt-2">Tahun Pengalaman</p>
              </div>
            </div>
            
            <div className="pt-10">
               <Link href="/shop" className="inline-flex items-center gap-2 bg-[#133A42] hover:bg-[#00A19D] text-white px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1 shadow-xl shadow-[#133A42]/10">
                 Telusuri Koleksi Kami <ArrowRight className="w-5 h-5" />
               </Link>
            </div>
          </div>
          
          <div className="relative mt-12 md:mt-0">
             <div className="rounded-[3rem] overflow-hidden relative z-10 w-full xl:w-[120%] h-[400px] md:h-[600px] shadow-2xl">
                <img src="https://images.unsplash.com/photo-1618220179428-22790b46a0eb?w=1200&q=80" alt="About Us" className="w-full h-full object-cover" />
             </div>
             <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#00A19D]/20 rounded-full blur-3xl z-0"></div>
          </div>
        </div>

        {/* Misi & Visi Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
           <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#133A42] text-white flex items-center justify-center rounded-2xl mb-6">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#133A42] mb-3">Keberlanjutan Alam</h3>
              <p className="text-gray-500 leading-relaxed">Fokus kami pada material ramah lingkungan dan kayu bersertifikasi memastikan hutan kita tetap asri untuk generasi mendatang.</p>
           </div>
           
           <div className="bg-[#133A42] p-10 rounded-[2rem] shadow-xl text-white transform md:-translate-y-4">
              <div className="w-14 h-14 bg-[#00A19D] flex items-center justify-center rounded-2xl mb-6">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Keahlian Pengrajin</h3>
              <p className="text-teal-50 opacity-90 leading-relaxed">Melibatkan pengrajin lokal profesional untuk menjahit, memotong, dan merakit tiap bagian dedikasi tinggi tanpa mesin massal.</p>
           </div>
           
           <div className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#133A42] text-white flex items-center justify-center rounded-2xl mb-6">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-[#133A42] mb-3">Desain Universal</h3>
              <p className="text-gray-500 leading-relaxed">Menciptakan furnitur yang sesuai dan tak lekang oleh waktu, berbaur di antara ribuan gaya rumah apapun yang Anda pilih.</p>
           </div>
        </div>

        {/* Location Section */}
        <div className="mt-32 bg-gray-50 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-16 border border-gray-100">
           <div className="flex-1">
              <h2 className="text-4xl font-extrabold text-[#133A42] tracking-tight mb-6">Kunjungi Studio Kami</h2>
              <p className="text-gray-600 text-lg mb-8">Uji langsung kenyamanan bantalan busa kami, cium aroma kayu mahoni asli, dan berkonsultasi langsung dengan ahli tata ruang kami secara gratis di Galeri Pusat Furniture Co.</p>
              
              <div className="space-y-4">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-full flex-shrink-0 text-[#00A19D]">📍</div>
                    <div>
                       <h4 className="font-bold text-[#133A42]">Alamat Utama</h4>
                       <p className="text-gray-500 text-sm">Jl. Kreatif No. 88, Kawasan Desain Industri<br/>Jakarta Selatan, 12345</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-full flex-shrink-0 text-[#00A19D]">🕒</div>
                    <div>
                       <h4 className="font-bold text-[#133A42]">Jam Operasional</h4>
                       <p className="text-gray-500 text-sm">Senin - Jumat: 09:00 - 20:00 WIB<br/>Sabtu - Minggu: 10:00 - 22:00 WIB</p>
                    </div>
                 </div>
              </div>
           </div>
           <div className="flex-1 w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden bg-gray-200 shadow-inner">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.24083315261!2d106.758784!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x100c5e82dd4b820!2sJakarta%20Selatan%2C%20Kota%20Jakarta%20Selatan%2C%20Daerah%20Khusus%20Ibukota%20Jakarta!5e0!3m2!1sid!2sid!4v1709403130123!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{border:0}} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
           </div>
        </div>
      </div>
    </div>
  );
}
