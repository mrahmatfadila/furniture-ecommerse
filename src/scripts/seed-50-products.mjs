import mysql from 'mysql2/promise';

const ADJECTIVES = ['Modern', 'Skandinavia', 'Minimalis', 'Klasik', 'Industrial', 'Bohemian', 'Elegan', 'Mewah', 'Vintage', 'Retro'];
const MATERIALS = ['Kayu Jati', 'Kayu Mahoni', 'Rotan', 'Metal', 'Plastik', 'Kain Velvet', 'Kulit'];
const COLORS = ['Hitam', 'Putih', 'Cokelat', 'Abu-abu', 'Krem', 'Natural', 'Navy', 'Emas'];

const CATEGORY_MAP = {
  'Sofas': {
    nouns: ['Sofa 2 Seater', 'Sofa 3 Seater', 'Sofa L', 'Sofa Bed', 'Single Sofa', 'Sofa Recliner'],
    images: ['1555041469-a586c61ea9bc', '1493663284031-b7e3aefcae8e', '1519961655809-34fa156820ff', '1618220179428-22790b46a015', '1484101403630-1f61fc1000bb'],
    priceRange: [2500000, 15000000]
  },
  'Chairs': {
    nouns: ['Kursi Makan', 'Kursi Teras', 'Armchair', 'Kursi Kerja', 'Kursi Santai', 'Stool', 'Lounge Chair'],
    images: ['1598300042247-d088f8ab3a91', '1506898667547-42e22a46e125', '1580480055273-228ff5388ef8', '1524758631624-e2822e304c36', '1600585154340-be6161a56a0c', '1567538096630-e0c55bd6374c'],
    priceRange: [300000, 3500000]
  },
  'Tables': {
    nouns: ['Meja Makan', 'Meja Kopi', 'Meja Rias', 'Meja Kerja', 'Meja Sudut', 'Meja Konsol', 'Meja TV'],
    images: ['1533090481720-856c6e3c1fdc', '1532372320572-cda25653a26d', '1615873968403-89e068629265', '1634712282287-14ed57b9cc89', '1577805947367-5fb0cc17da72'],
    priceRange: [1000000, 8000000]
  },
  'Beds': {
    nouns: ['Ranjang King Size', 'Ranjang Queen Size', 'Ranjang Single', 'Tempat Tidur Tingkat', 'Ranjang Anak'],
    images: ['1505693416388-ac5ce068fe85', '1540518614846-7eded433c457', '1520281206124-783a7894a8c3', '1505691938895-1758d7bef519'],
    priceRange: [2000000, 12000000]
  },
  'Storage': {
    nouns: ['Lemari Pakaian', 'Rak Buku', 'Kabinet', 'Laci', 'Rak Sepatu', 'Bufet'],
    images: ['1595428774223-ef52624120d2', '1594620044405-b174b04d1ed3', '1577140917170-20513e9a7e80', '1591129841117-3adfd313e34f'],
    priceRange: [800000, 9000000]
  },
  'Lighting': {
    nouns: ['Lampu Gantung', 'Lampu Berdiri', 'Lampu Meja', 'Lampu Dinding', 'Lampu Sorot'],
    images: ['1513506003901-1e6a229e2d15', '1507473885765-e6ed057f782c', '1505843490538-5133c6c7d0e1', '1517991104123-1d56a6e81ed9'],
    priceRange: [200000, 3000000]
  },
  'Decor': {
    nouns: ['Karpet', 'Vas Bunga', 'Cermin', 'Hiasan Dinding', 'Jam Dinding', 'Tanaman Artifisial'],
    images: ['1533090161767-e6ffed986c88', '1581783898377-1c85bf937427', '1647895821262-b1319c5bc5d7', '1507149833265-60c372daea22'],
    priceRange: [100000, 1500000]
  }
};

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPrice(min, max) {
  const price = Math.floor((Math.random() * (max - min) + min) / 50000) * 50000;
  return price;
}

const products = [];
const catKeys = Object.keys(CATEGORY_MAP);

for (let i = 0; i < 50; i++) {
  const catName = catKeys[i % catKeys.length]; 
  const catData = CATEGORY_MAP[catName];
  
  const noun = getRandom(catData.nouns);
  const adjective = getRandom(ADJECTIVES);
  const material = getRandom(MATERIALS);
  const color = getRandom(COLORS);
  
  const name = `${noun} ${adjective} ${material} ${color}`;
  const price = getRandomPrice(catData.priceRange[0], catData.priceRange[1]);
  const isSale = Math.random() > 0.7;
  const salePrice = isSale ? price * (0.8 + Math.random() * 0.15) : null;
  const finalSalePrice = salePrice ? Math.floor(salePrice / 50000) * 50000 : null;
  
  const statuses = ['in_stock', 'in_stock', 'new_in', 'on_sale', 'sold_out'];
  const status = isSale ? 'on_sale' : getRandom(statuses);
  
  const imageId = getRandom(catData.images);
  // Using high-res imagery (1080p, quality 100)
  const imageUrl = `https://images.unsplash.com/photo-${imageId}?q=100&w=1080&auto=format&fit=crop`;

  const descriptions = [
    `${name} dirancang khusus untuk memberikan sentuhan ${adjective.toLowerCase()} premium pada ruangan Anda. Terbuat dari bahan ${material} berkualitas tinggi yang awet dan tahan lama.`,
    `Tingkatkan estetika hunian dengan ${name}. Perpaduan desain ${adjective.toLowerCase()} dan material ${material} menjadikan produk ini unggulan di kelasnya.`,
    `Hadirkan kenyamanan dan gaya dengan ${name}. Warna ${color.toLowerCase()} yang elegan mudah dipadukan dengan berbagai interior modern.`
  ];

  products.push({
    name,
    description: getRandom(descriptions),
    category: catName,
    price,
    sale_price: finalSalePrice,
    status,
    image_url: imageUrl,
    color
  });
}

// shuffle products
products.sort(() => Math.random() - 0.5);

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'furniture_db'
  });

  console.log('Connected. Seeding 50 new HD products...');

  let count = 0;
  for (const p of products) {
    await connection.query(
      'INSERT INTO products (name, description, category, price, sale_price, status, image_url, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [p.name, p.description, p.category, p.price, p.sale_price, p.status, p.image_url, p.color]
    );
    count++;
  }
  
  console.log(`Successfully added ${count} products!`);
  await connection.end();
}

seed().catch(console.error);
