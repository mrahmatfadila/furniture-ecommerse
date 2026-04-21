import mysql from 'mysql2/promise';

const NEW_PRODUCTS = [
  // SOFAS
  {
    name: "Sofa Minimalis Modern Kain Velvet 3 Seater",
    description: "Sofa 3 dudukan berbalut kain velvet premium dengan gaya minimalis modern. Cocok untuk ruang tamu yang elegan.",
    category: "Sofas",
    price: 4500000.00,
    sale_price: 4000000.00,
    status: "on_sale",
    image_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
    color: "Grey"
  },
  {
    name: "Sofa L Skandinavia Kayu Jati",
    description: "Sofa L dengan kaki kayu jati solid dan desain Skandinavia yang hangat.",
    category: "Sofas",
    price: 7500000.00,
    sale_price: null,
    status: "in_stock",
    image_url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop",
    color: "Beige"
  },
  {
    name: "Single Sofa Klasik Kulit Asli",
    description: "Sofa tunggal bergaya klasik dengan pelapis kulit asli berkualitas.",
    category: "Sofas",
    price: 3200000.00,
    sale_price: null,
    status: "new_in",
    image_url: "https://images.unsplash.com/photo-1519961655809-34fa156820ff?q=80&w=800&auto=format&fit=crop",
    color: "Brown"
  },

  // CHAIRS
  {
    name: "Kursi Makan Rotan Bohemian (Set of 2)",
    description: "Kursi makan yang terbuat dari rotan asli dengan gaya Bohemian. Kuat dan estetis.",
    category: "Chairs",
    price: 1500000.00,
    sale_price: null,
    status: "in_stock",
    image_url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop",
    color: "Natural"
  },
  {
    name: "Armchair Industrial Kayu Mahoni & Metal",
    description: "Kursi santai bergaya industrial memadukan rangka metal kokoh dan kayu mahoni yang solid.",
    category: "Chairs",
    price: 2100000.00,
    sale_price: 1900000.00,
    status: "on_sale",
    image_url: "https://images.unsplash.com/photo-1506898667547-42e22a46e125?q=80&w=800&auto=format&fit=crop",
    color: "Black"
  },
  {
    name: "Kursi Teras Plastik Modern Tahan Cuaca",
    description: "Kursi dari bahan plastik kokoh dengan desain modern. Cocok untuk indoor maupun outdoor.",
    category: "Chairs",
    price: 450000.00,
    sale_price: null,
    status: "in_stock",
    image_url: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=800&auto=format&fit=crop",
    color: "White"
  },

  // TABLES
  {
    name: "Meja Makan Minimalis Kayu Jati Solid",
    description: "Meja makan berdesain minimalis yang dibuat sepenuhnya dari kayu jati asli. Kapasitas 6 orang.",
    category: "Tables",
    price: 5500000.00,
    sale_price: null,
    status: "new_in",
    image_url: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=80&w=800&auto=format&fit=crop",
    color: "Wood"
  },
  {
    name: "Coffee Table Skandinavia Metal & Kaca",
    description: "Meja kopi ala Skandinavia dengan kaki metal dan top table kaca transparan.",
    category: "Tables",
    price: 1200000.00,
    sale_price: null,
    status: "in_stock",
    image_url: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=800&auto=format&fit=crop",
    color: "Black/Clear"
  },
  {
    name: "Meja Rias Klasik Kayu Mahoni",
    description: "Meja rias cantik dengan ukiran klasik bernuansa kayu mahoni mewah.",
    category: "Tables",
    price: 3800000.00,
    sale_price: 3500000.00,
    status: "on_sale",
    image_url: "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=800&auto=format&fit=crop",
    color: "White"
  },

  // BEDS
  {
    name: "Ranjang Tidur Modern Minimalis King Size Kayu Jati",
    description: "Ranjang king size beraliran modern minimalis, kokoh berbahan kayu jati pilihan.",
    category: "Beds",
    price: 8500000.00,
    sale_price: null,
    status: "in_stock",
    image_url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop",
    color: "Wood"
  },
  {
    name: "Tempat Tidur Industrial Pipa Metal Hitam Double",
    description: "Desain bed frame unik yang menonjolkan elemen industrial dari pipa metal hitam pekat.",
    category: "Beds",
    price: 2800000.00,
    sale_price: null,
    status: "new_in",
    image_url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800&auto=format&fit=crop",
    color: "Black"
  },
  
  // STORAGE
  {
    name: "Lemari Pakaian Klasik 3 Pintu Kayu Mahoni",
    description: "Lemari luas dengan 3 pintu berbahan kayu mahoni elegan bergaya klasik.",
    category: "Storage",
    price: 6200000.00,
    sale_price: null,
    status: "in_stock",
    image_url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=800&auto=format&fit=crop",
    color: "Brown"
  },
  {
    name: "Rak Buku Skandinavia Terbuka Rotan",
    description: "Rak serbaguna berdesain Skandinavia dengan jalinan rotan untuk koleksi buku atau pajangan Anda.",
    category: "Storage",
    price: 1800000.00,
    sale_price: 1500000.00,
    status: "on_sale",
    image_url: "https://images.unsplash.com/photo-1594620044405-b174b04d1ed3?q=80&w=800&auto=format&fit=crop",
    color: "Light Wood"
  },

  // LIGHTING
  {
    name: "Lampu Gantung Industrial Tungsten Metal",
    description: "Lampu langit-langit bergaya industrial vintage dengan rangka metal dan bohlam tungsten.",
    category: "Lighting",
    price: 750000.00,
    sale_price: null,
    status: "new_in",
    image_url: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop",
    color: "Black"
  },
  {
    name: "Standing Lamp Modern Klasik Kuningan",
    description: "Lampu berdiri mewah dilapisi nuansa klasik keemasan/kuningan untuk sudut ruang yang temaram.",
    category: "Lighting",
    price: 1300000.00,
    sale_price: null,
    status: "in_stock",
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop",
    color: "Gold"
  },

  // DECOR
  {
    name: "Karpet Permadani Bohemian Tenun Kain Velvet",
    description: "Karpet bermotif Bohemian yang sangat lembut disentuh berkat material kain velvet alami.",
    category: "Decor",
    price: 950000.00,
    sale_price: null,
    status: "sold_out",
    image_url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=800&auto=format&fit=crop",
    color: "Multicolor"
  },
  {
    name: "Vas Keramik Skandinavia Set 2 Modern Plastik",
    description: "Vas bunga artistik yang sebetulnya terbuat dari plastik tahan banting ala Skandinavia modern.",
    category: "Decor",
    price: 250000.00,
    sale_price: 200000.00,
    status: "on_sale",
    image_url: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=800&auto=format&fit=crop",
    color: "White"
  }
];

async function seedProducts() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: 'furniture_db'
    });

    console.log('Connected to furniture_db.');

    // We can clear or truncate table.
    // Let's just insert these new items directly so they add up to the beautiful dataset.
    // console.log('Clearing old products ...');
    // await connection.query('TRUNCATE TABLE products');

    console.log('Inserting new comprehensive dummy products...');

    for (const p of NEW_PRODUCTS) {
      await connection.query(
        'INSERT INTO products (name, description, category, price, sale_price, status, image_url, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [p.name, p.description, p.category, p.price, p.sale_price, p.status, p.image_url, p.color]
      );
    }

    console.log('Done inserting ' + NEW_PRODUCTS.length + ' products!');
    await connection.end();

  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

seedProducts();
