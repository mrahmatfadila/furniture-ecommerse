import mysql from 'mysql2/promise';

async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'furniture_db' });

  await conn.query(`CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    image_url VARCHAR(500),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  const [existing] = await conn.query('SELECT COUNT(*) as count FROM categories');
  if (existing[0].count === 0) {
    await conn.query(`INSERT INTO categories (name, slug, sort_order) VALUES
      ('Semua Produk', '', 0),
      ('Kursi', 'Chairs', 1),
      ('Sofa', 'Sofas', 2),
      ('Meja', 'Tables', 3),
      ('Kasur', 'Beds', 4),
      ('Lampu', 'Lighting', 5),
      ('Penyimpanan', 'Storage', 6),
      ('Dekorasi', 'Decor', 7)`);
    console.log('Seeded default categories.');
  } else {
    console.log('Categories already exist.');
  }

  console.log('Done!');
  await conn.end();
}

run().catch(e => { console.error(e.message); process.exit(1); });
