import Link from "next/link";
import { notFound } from "next/navigation";
import pool from "@/lib/db";
import { formatRupiah } from "@/lib/currency";
import { Star, ArrowLeft, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";

const STATUS_TAG: Record<string, { label: string; cls: string }> = {
  in_stock: { label: "Tersedia",  cls: "bg-green-100 text-green-800" },
  sold_out: { label: "Habis",     cls: "bg-red-100 text-red-800" },
  new_in:   { label: "Baru Masuk",cls: "bg-blue-100 text-blue-800" },
  on_sale:  { label: "Diskon",    cls: "bg-amber-100 text-amber-800" },
};

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  let product: any = null;
  let related: any[] = [];

  try {
    const [rows]: any = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    if (rows.length === 0) notFound();
    product = rows[0];

    // Fetch related products same category
    const [rel]: any = await pool.query(
      "SELECT * FROM products WHERE category = ? AND id != ? LIMIT 4",
      [product.category, id]
    );
    related = rel;
  } catch (_) {
    notFound();
  }

  const tag = STATUS_TAG[product.status] ?? STATUS_TAG.in_stock;

  return (
    <div className="w-full min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <Link href="/" className="hover:text-[#133A42] transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#133A42] transition-colors">Produk</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/shop?category=${product.category}`} className="hover:text-[#133A42] transition-colors">{product.category}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-700 font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Product Image */}
          <div className="relative group">
            <div className="w-full aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-[0_20px_60px_rgb(0,0,0,0.08)]">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <span className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest ${tag.cls}`}>
              {tag.label}
            </span>
          </div>

          {/* Product Info */}
          <div className="flex flex-col sticky top-28">
            {product.category && (
              <Link href={`/shop?category=${product.category}`} className="text-sm font-semibold text-[#00A19D] uppercase tracking-widest mb-3 hover:underline">
                {product.category}
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-[#133A42] leading-tight mb-4">{product.name}</h1>

            {product.description && (
              <p className="text-gray-500 leading-relaxed mb-6 text-sm">{product.description}</p>
            )}

            {/* Rating placeholders */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <span className="text-sm font-semibold text-gray-600">5.0</span>
              <span className="text-sm text-gray-400">(12 ulasan)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-extrabold text-[#133A42]">{formatRupiah(product.price)}</span>
              {product.sale_price && (
                <span className="text-xl text-gray-400 line-through font-medium">{formatRupiah(product.sale_price)}</span>
              )}
              {product.sale_price && (
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                  Hemat {Math.round((1 - parseFloat(product.price) / parseFloat(product.sale_price)) * 100)}%
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <AddToCartButton productId={product.id} />
              <button className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-400 hover:text-red-400 transition-colors flex-shrink-0">
                <Heart className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-400 hover:border-[#133A42] hover:text-[#133A42] transition-colors flex-shrink-0">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Trust badges */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-[#00A19D] flex-shrink-0" />
                <span>Pengiriman gratis ke seluruh Indonesia</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-[#00A19D] flex-shrink-0" />
                <span>Garansi produk 1 tahun</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw className="w-5 h-5 text-[#00A19D] flex-shrink-0" />
                <span>Pengembalian mudah dalam 30 hari</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-bold text-[#133A42] mb-8">Produk Serupa</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((r: any) => (
                <Link key={r.id} href={`/products/${r.id}`} className="group cursor-pointer block">
                  <div className="w-full h-52 rounded-2xl overflow-hidden mb-3 bg-gray-100">
                    <img src={r.image_url} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h3 className="font-bold text-[#133A42] text-sm mb-1 leading-snug">{r.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#00A19D] text-sm">{formatRupiah(r.price)}</span>
                    {r.sale_price && <span className="text-gray-400 line-through text-xs">{formatRupiah(r.sale_price)}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back button */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#133A42] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Produk
          </Link>
        </div>
      </div>
    </div>
  );
}
