import mysql from 'mysql2/promise';

// Targeted fix: these are the EXACT names from DB that still have broken images
// Using rock-solid Unsplash photo IDs that are known to be stable long-term
const TARGETED_FIXES = {
  // Storage category - bookshelf/rack images
  'Rak Buku Mewah Kayu Mahoni Natural': 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?q=100&w=1080&auto=format&fit=crop',
  'Rak Buku Elegan Metal Natural': 'https://images.unsplash.com/photo-1594620044405-b174b04d1ed3?q=100&w=1080&auto=format&fit=crop',
  'Rak Buku Skandinavia Terbuka Rotan': 'https://images.unsplash.com/photo-1612969308146-066d55f37ccb?q=100&w=1080&auto=format&fit=crop',
  
  // Tables
  'Meja Kerja Retro Kain Velvet Navy': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=100&w=1080&auto=format&fit=crop',
  'Meja Rias Klasik Kayu Mahoni': 'https://images.unsplash.com/photo-1615873968403-89e068629265?q=100&w=1080&auto=format&fit=crop',
  
  // Sofas
  'Sofa L Skandinavia Kain Velvet Emas': 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=100&w=1080&auto=format&fit=crop',
  'Single Sofa Minimalis Kulit Putih': 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=100&w=1080&auto=format&fit=crop',
  'Single Sofa Vintage Kayu Jati Putih': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=100&w=1080&auto=format&fit=crop',
  
  // Decor
  'Karpet Modern Metal Cokelat': 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=100&w=1080&auto=format&fit=crop',
  'Karpet Bohemian Kayu Jati Krem': 'https://images.unsplash.com/photo-1567016432779-094069958ea5?q=100&w=1080&auto=format&fit=crop',
  
  // Chairs  
  'Kursi Makan Vintage Kain Velvet Emas': 'https://images.unsplash.com/photo-1577140917170-20513e9a7e80?q=100&w=1080&auto=format&fit=crop',
  
  // Storage
  'Kabinet Elegan Kayu Jati Cokelat': 'https://images.unsplash.com/photo-1619642307139-c7aeadbd01a8?q=100&w=1080&auto=format&fit=crop',
  'Kabinet Vintage Kayu Mahoni Abu-abu': 'https://images.unsplash.com/photo-1615529328331-f8917597711f?q=100&w=1080&auto=format&fit=crop',
  'Lemari Pakaian Elegan Metal Krem': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=100&w=1080&auto=format&fit=crop',
  'Lemari Pakaian Klasik 3 Pintu Kayu Mahoni': 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=100&w=1080&auto=format&fit=crop',
  
  // Fix wrong/irrelevant images from previous run
  // Beds - should not show pillows or kitchen
  'Ranjang King Size Modern Minimalis Kayu Jati': 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=100&w=1080&auto=format&fit=crop',
  'Ranjang Queen Size Modern Metal Emas': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=100&w=1080&auto=format&fit=crop',
  'Ranjang Queen Size Modern Rotan Krem': 'https://images.unsplash.com/photo-1576354302919-96748cb8299e?q=100&w=1080&auto=format&fit=crop',
  'Ranjang Single Vintage Kayu Jati Putih': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=100&w=1080&auto=format&fit=crop',
  'Tempat Tidur Tingkat Bohemian Kayu Mahoni Cokelat': 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=100&w=1080&auto=format&fit=crop',
  'Ranjang Anak Minimalis Plastik Navy': 'https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?q=100&w=1080&auto=format&fit=crop',
  
  // Lighting - Standing lamp (was showing landscape)
  'Lampu Berdiri Skandinavia Plastik Putih': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=100&w=1080&auto=format&fit=crop',
};

async function fixTargeted() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'furniture_db'
  });

  console.log('Connected to furniture_db.');

  let fixed = 0;
  let notFound = 0;

  for (const [name, imageUrl] of Object.entries(TARGETED_FIXES)) {
    const [result] = await connection.query(
      'UPDATE products SET image_url = ? WHERE name = ?',
      [imageUrl, name]
    );
    
    if (result.affectedRows > 0) {
      console.log(`  ✓ Fixed: "${name}"`);
      fixed++;
    } else {
      // Try partial match
      const [partialResult] = await connection.query(
        'UPDATE products SET image_url = ? WHERE name LIKE ?',
        [imageUrl, `%${name.substring(0, 20)}%`]
      );
      if (partialResult.affectedRows > 0) {
        console.log(`  ~ Partial match fixed: "${name}"`);
        fixed++;
      } else {
        console.log(`  ✗ Not found: "${name}"`);
        notFound++;
      }
    }
  }

  console.log(`\nDone. Fixed: ${fixed}, Not found: ${notFound}`);
  await connection.end();
}

fixTargeted().catch(console.error);
