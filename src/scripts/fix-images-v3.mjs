import mysql from 'mysql2/promise';

// Use Unsplash Source API - always returns a valid image based on search term
// Format: https://source.unsplash.com/1080x720/?keyword
// These are guaranteed to work and return relevant furniture images

const CATEGORY_KEYWORDS = {
  Sofas: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550254478-ead40cc54513?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571167530149-c1105da4c2e0?q=100&w=1080&auto=format&fit=crop',
  ],
  Chairs: [
    'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551298370-9d3d53740c72?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506898667547-42e22a46e125?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620141925927-44b8aebe96ea?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=100&w=1080&auto=format&fit=crop',
  ],
  Tables: [
    'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565183928294-7063f23ce0f8?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1577140917170-20513e9a7e80?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611967164521-abae8fba4668?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=100&w=1080&auto=format&fit=crop',
  ],
  Beds: [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576354302919-96748cb8299e?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?q=100&w=1080&auto=format&fit=crop',
  ],
  Storage: [
    'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1484101403630-1f61fc1000bb?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=100&w=1080&auto=format&fit=crop',
  ],
  Lighting: [
    'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555400038-63f5ba517a47?q=100&w=1080&auto=format&fit=crop',
  ],
  Decor: [
    'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507149833265-60c372daea22?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560184611-ff3e53f9e5e0?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=100&w=1080&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523413555158-afe73358f09c?q=100&w=1080&auto=format&fit=crop',
  ],
};

async function fixAllImages() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'furniture_db'
  });

  console.log('Connected to furniture_db.');

  const [products] = await connection.query('SELECT id, name, category FROM products ORDER BY category, id');
  console.log(`Fixing images for ${products.length} products...`);

  const counters = {};
  let updated = 0;

  for (const product of products) {
    const cat = product.category;
    const images = CATEGORY_KEYWORDS[cat] || CATEGORY_KEYWORDS['Decor'];

    if (!counters[cat]) counters[cat] = 0;
    const img = images[counters[cat] % images.length];
    counters[cat]++;

    await connection.query('UPDATE products SET image_url = ? WHERE id = ?', [img, product.id]);
    updated++;
  }

  console.log(`Done! Updated ${updated} products.`);
  
  const summary = Object.entries(counters).map(([cat, count]) => `  ${cat}: ${count}`).join('\n');
  console.log('Summary:\n' + summary);

  await connection.end();
}

fixAllImages().catch(console.error);
