import mysql from 'mysql2/promise';

// Verified Unsplash photo IDs - each tested and confirmed working
const VERIFIED_IMAGES = {
  Sofas: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571167530149-c1105da4c2e0?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=100&w=1080&auto=format&fit=crop',
  ],
  Chairs: [
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506898667547-42e22a46e125?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620141925927-44b8aebe96ea?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551298370-9d3d53740c72?q=100&w=1080&auto=format&fit=crop',
  ],
  Tables: [
    'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1615873968403-89e068629265?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1577140917170-20513e9a7e80?q=100&w=1080&auto=format&fit=crop',
  ],
  Beds: [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1416339684178-3a239570f315?q=100&w=1080&auto=format&fit=crop',
  ],
  Storage: [
    'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1594620044405-b174b04d1ed3?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618220179428-22790b46a015?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=100&w=1080&auto=format&fit=crop',
  ],
  Lighting: [
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=100&w=1080&auto=format&fit=crop',
  ],
  Decor: [
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507149833265-60c372daea22?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554295405-abb8fd54f153?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=100&w=1080&auto=format&fit=crop',
  ],
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=100&w=1080&auto=format&fit=crop';

async function fixImages() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'furniture_db'
  });

  console.log('Connected to furniture_db.');

  // Get all products
  const [products] = await connection.query('SELECT id, name, category, image_url FROM products');
  console.log(`Found ${products.length} products. Fixing images...`);

  const counters = {};

  for (const product of products) {
    const cat = product.category;
    const images = VERIFIED_IMAGES[cat] || VERIFIED_IMAGES['Decor'];

    // Use a cycling counter per category so images are spread evenly
    if (!counters[cat]) counters[cat] = 0;
    const img = images[counters[cat] % images.length];
    counters[cat]++;

    await connection.query('UPDATE products SET image_url = ? WHERE id = ?', [img, product.id]);
  }

  console.log(`Done! Fixed images for ${products.length} products.`);
  await connection.end();
}

fixImages().catch(console.error);
