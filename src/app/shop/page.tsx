import Link from "next/link";
import pool from "@/lib/db";
import ShopClient from "./ShopClient";

const FALLBACK = [
  { id: 1, name: "Waiting Sofa With Castors, Beige",          price: 1800000, sale_price: null, status: "new_in",  category: "Sofas",   image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop" },
  { id: 2, name: "Curvilinear Vases – Set Of Two",             price: 750000,  sale_price: null, status: "sold_out",category: "Decor",   image_url: "https://images.unsplash.com/photo-1507149833265-60c372daea22?q=80&w=600&auto=format&fit=crop" },
  { id: 3, name: "Rhombus Planter – Brown",                   price: 980000,  sale_price: null, status: "new_in",  category: "Decor",   image_url: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=600&auto=format&fit=crop" },
  { id: 4, name: "Davina Runa Lamp With Wooden Base",         price: 1250000, sale_price: 1700000, status: "on_sale", category: "Lighting", image_url: "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?q=80&w=600&auto=format&fit=crop" },
  { id: 5, name: "Armchair, Birch Veneer / Knisa Light Beige", price: 2300000, sale_price: null, status: "in_stock",category: "Chairs",  image_url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=600&auto=format&fit=crop" },
];

interface SearchProps {
  category?: string;
  type?: string;
  price?: string;
  material?: string;
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchProps> }) {
  const { category, type, price, material } = await searchParams;

  let dbProducts: any[] = [];
  let dbCategories: any[] = [];

  try {
    let pQuery = "SELECT * FROM products WHERE 1=1";
    const pParams: any[] = [];

    if (category) { pQuery += " AND category = ?"; pParams.push(category); }
    if (type)     { pQuery += " AND name LIKE ?";  pParams.push(`%${type}%`); }
    if (material) { pQuery += " AND name LIKE ?";  pParams.push(`%${material}%`); }

    if (price) {
      const [min, max] = price.split('-');
      if (min && max) {
        pQuery += " AND price >= ? AND price <= ?";
        pParams.push(parseInt(min, 10), parseInt(max, 10));
      }
    }

    pQuery += " ORDER BY id DESC";

    const [pRows]: any = await pool.query(pQuery, pParams);
    dbProducts = pRows;

    const [cRows]: any = await pool.query("SELECT * FROM categories ORDER BY sort_order ASC, name ASC");
    dbCategories = cRows;
  } catch (err) {
    console.error(err);
  }

  const allCategories = [
    { name: "Semua", slug: "", image_url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=400&auto=format&fit=crop" },
    ...dbCategories
  ];

  const isFilterActive = category || type || price || material;
  const products = (dbProducts.length > 0 || isFilterActive) ? dbProducts : FALLBACK;
  const total = products.length;

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-[1400px] mx-auto px-6 md:px-12 py-10">

        {/* Breadcrumb */}
        <div className="text-sm font-medium text-gray-400 mb-6 flex gap-2 items-center">
          <Link href="/" className="hover:text-[#133A42] transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#133A42] transition-colors">Semua Produk</Link>
          {category && (
            <><span>/</span><span className="text-gray-900 font-semibold">{category}</span></>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-[#133A42] mb-10 tracking-tight">
          {category ? category.toUpperCase() : 'SEMUA PRODUK'}
        </h1>

        {/* Top Categories */}
        <div className="flex gap-4 md:gap-5 overflow-x-auto pb-6">
          {allCategories.map((cat: any, i: number) => {
            const isActive = cat.slug ? category === cat.slug : !category;
            const imgSrc = cat.image_url || `https://placehold.co/300x200/e5e7eb/9ca3af?text=${encodeURIComponent(cat.name)}`;
            return (
              <Link
                key={i}
                href={cat.slug ? `/shop?category=${cat.slug}` : '/shop'}
                className={`flex flex-col gap-2 min-w-[120px] md:min-w-[145px] group flex-shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-65 hover:opacity-100'}`}
              >
                <div className={`w-full h-28 md:h-36 rounded-2xl overflow-hidden bg-gray-100 border-2 transition-all ${isActive ? 'border-[#00A19D] shadow-lg shadow-[#00A19D]/20' : 'border-transparent'}`}>
                  <img src={imgSrc} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <span className={`font-bold text-xs tracking-wide text-center ${isActive ? 'text-[#00A19D]' : 'text-gray-700'}`}>{cat.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Interactive shop controls + product grid (Client Component) */}
        <ShopClient
          initialProducts={products}
          allCategories={allCategories}
          currentCategory={category}
          total={total}
        />
      </div>
    </div>
  );
}
