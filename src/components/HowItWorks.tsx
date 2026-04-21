'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Palette, CreditCard, MapPin, Truck, LifeBuoy, ArrowRight } from 'lucide-react';

const tabs = [
  {
    id: 'belanja',
    label: 'Belanja Online',
    icon: <ShoppingBag className="w-5 h-5" />,
    heading: 'Temukan Furnitur Impian Anda',
    description: 'Jelajahi ribuan koleksi furnitur berkualitas tinggi dari berbagai kategori — ruang tamu, kamar tidur, dapur, dan lainnya. Gunakan filter cerdas untuk menemukan produk yang sesuai gaya dan anggaran Anda.',
    steps: [
      { number: '01', title: 'Buka halaman Shop', desc: 'Kunjungi halaman toko kami dan pilih kategori favorit Anda.' },
      { number: '02', title: 'Cari & Filter Produk', desc: 'Gunakan filter harga, kategori, dan rating untuk mempersempit pilihan.' },
      { number: '03', title: 'Tambahkan ke Keranjang', desc: 'Klik "Tambah ke Keranjang" dan lanjutkan memilih atau langsung checkout.' },
    ],
    cta: { href: '/shop', label: 'Mulai Belanja Sekarang' },
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
  },
  {
    id: 'kustom',
    label: 'Kustomisasi Furnitur',
    icon: <Palette className="w-5 h-5" />,
    heading: 'Wujudkan Furnitur Sesuai Keinginan Anda',
    description: 'Pilih material, warna, ukuran, dan detail finishing khusus sesuai kebutuhan ruangan Anda. Tim desainer kami siap membantu membuatkan sesuai spesifikasi impian Anda.',
    steps: [
      { number: '01', title: 'Pilih Model Dasar', desc: 'Tentukan tipe furnitur yang ingin dikostumisasi.' },
      { number: '02', title: 'Tentukan Material & Warna', desc: 'Pilih jenis kayu, kain, dan finishing yang Anda inginkan.' },
      { number: '03', title: 'Konfirmasi & Produksi', desc: 'Tim kami akan memproses pesanan khusus Anda dalam 7–14 hari kerja.' },
    ],
    cta: { href: '/shop', label: 'Eksplor Koleksi Kustom' },
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=800',
  },
  {
    id: 'pembayaran',
    label: 'Pembayaran Mudah',
    icon: <CreditCard className="w-5 h-5" />,
    heading: 'Bayar dengan Cara yang Paling Mudah',
    description: 'Kami menerima berbagai metode pembayaran — transfer bank, kartu kredit, dompet digital, hingga cicilan 0% tanpa kartu kredit. Semua transaksi dijamin aman dengan enkripsi SSL.',
    steps: [
      { number: '01', title: 'Pilih Metode Pembayaran', desc: 'Transfer bank, kartu kredit, GoPay, OVO, Dana, QRIS, dan lainnya.' },
      { number: '02', title: 'Selesaikan Pembayaran', desc: 'Lakukan pembayaran dalam batas waktu yang ditentukan.' },
      { number: '03', title: 'Konfirmasi Otomatis', desc: 'Sistem kami langsung memverifikasi dan memproses pesanan Anda.' },
    ],
    cta: { href: '/cart', label: 'Coba Checkout Sekarang' },
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
  },
  {
    id: 'lacak',
    label: 'Lacak Pesanan',
    icon: <MapPin className="w-5 h-5" />,
    heading: 'Pantau Pesanan Anda Secara Real-Time',
    description: 'Setelah pembayaran dikonfirmasi, Anda dapat memantau status pesanan secara langsung mulai dari proses pengemasan, pengiriman, hingga tiba di depan pintu Anda.',
    steps: [
      { number: '01', title: 'Cek Email Konfirmasi', desc: 'Anda akan menerima email konfirmasi berisi nomor resi pengiriman.' },
      { number: '02', title: 'Pantau di Halaman Pesanan', desc: 'Login dan buka halaman "Pesanan Saya" untuk melihat status terkini.' },
      { number: '03', title: 'Terima Notifikasi', desc: 'Kami mengirim pemberitahuan setiap kali ada pembaruan status pesanan.' },
    ],
    cta: { href: '/login', label: 'Masuk & Cek Pesanan' },
    image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800',
  },
  {
    id: 'pengiriman',
    label: 'Pengiriman & Pemasangan',
    icon: <Truck className="w-5 h-5" />,
    heading: 'Dikirim Cepat, Dipasang Tuntas',
    description: 'Kurir profesional kami mengantarkan furnitur langsung ke tempat pemasangan yang Anda inginkan. Layanan pemasangan gratis tersedia untuk wilayah Jabodetabek dan kota-kota besar lainnya.',
    steps: [
      { number: '01', title: 'Jadwalkan Pengiriman', desc: 'Pilih tanggal dan jam pengiriman yang paling tepat untuk Anda.' },
      { number: '02', title: 'Tim Kirim Datang', desc: 'Tim kami tiba tepat waktu dan membawa seluruh perlengkapan instalasi.' },
      { number: '03', title: 'Pemasangan & Finishing', desc: 'Furnitur dipasang rapi dan area kerja dibersihkan setelah selesai.' },
    ],
    cta: { href: '/shop', label: 'Belanja Sekarang' },
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
  },
  {
    id: 'pengembalian',
    label: 'Return & Dukungan',
    icon: <LifeBuoy className="w-5 h-5" />,
    heading: 'Belanja Aman dengan Jaminan Return',
    description: 'Tidak puas? Tenang. Kami memberikan garansi pengembalian dalam 30 hari tanpa syarat yang rumit. Tim Customer Support kami siap membantu 7 hari seminggu via chat, email, dan telepon.',
    steps: [
      { number: '01', title: 'Hubungi CS Kami', desc: 'Chat langsung atau kirim email ke support@furnitureco.id dalam 30 hari.' },
      { number: '02', title: 'Proses Pengambilan', desc: 'Tim kami akan menjadwalkan pengambilan barang tanpa biaya tambahan.' },
      { number: '03', title: 'Refund Cepat', desc: 'Dana dikembalikan penuh ke metode pembayaran asal dalam 3–5 hari kerja.' },
    ],
    cta: { href: '/about', label: 'Hubungi Tim Kami' },
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24">
      {/* Header */}
      <div className="flex justify-center items-center gap-3 mb-12 text-center">
        <div className="flex gap-1.5 opacity-80">
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#00A19D]"></div>
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-200"></div>
        </div>
        <h2 className="text-4xl font-bold text-[#3A3F45] tracking-tight mx-2">Cara Kerjanya</h2>
        <div className="flex gap-1.5 opacity-80">
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-[#00A19D]"></div>
          <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-200"></div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-12">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            onClick={() => setActive(i)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all border ${
              active === i
                ? 'bg-[#133A42] text-white border-[#133A42] shadow-lg shadow-[#133A42]/20'
                : 'bg-white text-gray-500 border-gray-200 hover:border-[#133A42] hover:text-[#133A42]'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div key={tab.id} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Info */}
        <div className="space-y-8">
          <div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#133A42] tracking-tight mb-4">{tab.heading}</h3>
            <p className="text-gray-500 text-lg leading-relaxed">{tab.description}</p>
          </div>

          <div className="space-y-5">
            {tab.steps.map((step) => (
              <div key={step.number} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-[#133A42]/5 flex items-center justify-center">
                  <span className="font-black text-[#00A19D] text-sm">{step.number}</span>
                </div>
                <div>
                  <h4 className="font-bold text-[#133A42] mb-1">{step.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href={tab.cta.href}
            className="inline-flex items-center gap-2 bg-[#133A42] hover:bg-[#00A19D] text-white px-8 py-4 rounded-full font-bold transition-all hover:-translate-y-1 shadow-xl shadow-[#133A42]/10"
          >
            {tab.cta.label} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right: Image */}
        <div className="relative h-[380px] md:h-[460px] rounded-[3rem] overflow-hidden shadow-2xl">
          <img
            src={tab.image}
            alt={tab.heading}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#133A42]/10 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}
