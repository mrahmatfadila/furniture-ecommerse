import mysql from 'mysql2/promise';

// Targeted fix: Map each product name (partial match) to a relevant verified image
const PRODUCT_IMAGE_MAP = [
  // Chairs
  {
    nameContains: 'Kursi Santai Retro Kulit',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=100&w=1080&auto=format&fit=crop'
    // Beautiful retro leather armchair
  },
  {
    nameContains: 'Kursi Teras Plastik',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=100&w=1080&auto=format&fit=crop'
    // Modern outdoor plastic chairs
  },

  // Sofas
  {
    nameContains: 'Sofa Recliner Retro',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=100&w=1080&auto=format&fit=crop'
    // Recliner sofa
  },
  {
    nameContains: 'Single Sofa Klasik Kulit',
    image: 'https://images.unsplash.com/photo-1519961655809-34fa156820ff?q=100&w=1080&auto=format&fit=crop'
    // Classic leather single sofa/chair
  },

  // Storage / Kabinet / Lemari
  {
    nameContains: 'Kabinet Vintage Kayu Mahoni',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=100&w=1080&auto=format&fit=crop'
    // Wooden mahogany cabinet
  },
  {
    nameContains: 'Kabinet Elegan Kayu Jati',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=100&w=1440&auto=format&fit=crop'
    // Elegant wooden cabinet with legs
  },
  {
    nameContains: 'Bufet Minimalis Kayu Jati',
    image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=100&w=1080&auto=format&fit=crop'
    // Sideboard/buffet
  },
  {
    nameContains: 'Lemari Pakaian Klasik 3 Pintu',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=100&w=1080&auto=format&fit=crop'
    // 3-door wardrobe
  },

  // Tables
  {
    nameContains: 'Meja Sudut Minimalis',
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=100&w=1080&auto=format&fit=crop'
    // Side table / corner table
  },
  {
    nameContains: 'Meja Rias Mewah Kayu Jati',
    image: 'https://images.unsplash.com/photo-1617325710236-4a36d46427c5?q=100&w=1080&auto=format&fit=crop'
    // Luxury dressing table
  },

  // ---- General pattern fixes ----
  {
    nameContains: 'Meja Rias',
    image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Sofa L',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Sofa Bed',
    image: 'https://images.unsplash.com/photo-1484101403630-1f61fc1000bb?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Coffee Table',
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Meja Makan',
    image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Meja Kerja',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Meja TV',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Meja Kopi',
    image: 'https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Meja Konsol',
    image: 'https://images.unsplash.com/photo-1577140917170-20513e9a7e80?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Ranjang',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Tempat Tidur',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Rak Buku',
    image: 'https://images.unsplash.com/photo-1594620044405-b174b04d1ed3?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Rak Sepatu',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Laci',
    image: 'https://images.unsplash.com/photo-1617325710236-4a36d46427c5?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Lampu Gantung',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Lampu Berdiri',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Lampu Meja',
    image: 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Lampu Dinding',
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Lampu Sorot',
    image: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Karpet',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Vas',
    image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Cermin',
    image: 'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Kursi Makan',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Kursi Kerja',
    image: 'https://images.unsplash.com/photo-1551298370-9d3d53740c72?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Armchair',
    image: 'https://images.unsplash.com/photo-1506898667547-42e22a46e125?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Stool',
    image: 'https://images.unsplash.com/photo-1620141925927-44b8aebe96ea?q=100&w=1080&auto=format&fit=crop'
  },
  {
    nameContains: 'Lounge Chair',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=100&w=1080&auto=format&fit=crop'
  },
];

async function fixProductImages() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'furniture_db'
  });

  console.log('Connected to furniture_db.');

  const [products] = await connection.query('SELECT id, name, image_url FROM products');
  console.log(`Found ${products.length} products. Updating with matched images...`);

  let updated = 0;
  let notMatched = 0;

  for (const product of products) {
    const name = product.name;

    // Find the best matching rule by longest nameContains (most specific first)
    const sortedMap = PRODUCT_IMAGE_MAP.sort((a, b) => b.nameContains.length - a.nameContains.length);
    const match = sortedMap.find(rule => name.includes(rule.nameContains));

    if (match) {
      await connection.query('UPDATE products SET image_url = ? WHERE id = ?', [match.image, product.id]);
      console.log(`  ✓ [${product.id}] "${name}" → matched "${match.nameContains}"`);
      updated++;
    } else {
      console.log(`  ✗ [${product.id}] "${name}" → no match, keeping existing`);
      notMatched++;
    }
  }

  console.log(`\nDone! Updated: ${updated}, Not matched: ${notMatched}`);
  await connection.end();
}

fixProductImages().catch(console.error);
