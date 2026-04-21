import mysql from 'mysql2/promise';

async function initDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud') 
      ? { minVersion: 'TLSv1.2', rejectUnauthorized: true }
      : undefined
  });

  console.log('Connected to MySQL server.');

  await connection.query('CREATE DATABASE IF NOT EXISTS furniture_db');
  console.log('Database furniture_db created or already exists.');

  await connection.query('USE furniture_db');

  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('user', 'admin', 'owner') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await connection.query(createUsersTable);
  console.log('Table users generated.');

  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100),
      price DECIMAL(10, 2) NOT NULL,
      sale_price DECIMAL(10, 2),
      status ENUM('in_stock', 'sold_out', 'new_in', 'on_sale') DEFAULT 'in_stock',
      image_url VARCHAR(500),
      color VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await connection.query(createProductsTable);
  console.log('Table products generated.');

  console.log('Seeding initial data...');
  const [users] = await connection.query('SELECT * FROM users WHERE email = ?', ['owner@furniture.com']);
  if (users.length === 0) {
    await connection.query(`
      INSERT INTO users (name, email, password, role) VALUES 
      ('Owner User', 'owner@furniture.com', 'owner123', 'owner'),
      ('Admin User', 'admin@furniture.com', 'admin123', 'admin'),
      ('Normal User', 'user@furniture.com', 'user123', 'user')
    `);
    console.log('Seeded initial users.');
  }

  const [products] = await connection.query('SELECT count(*) as count FROM products');
  if (products[0].count === 0) {
    await connection.query(`
      INSERT INTO products (name, description, category, price, sale_price, status, image_url, color) VALUES 
      ('Waiting Shofa With Castors, Beige', 'Comfortable beige sofa', 'Chair', 100.00, NULL, 'new_in', '/products/p1.png', 'Beige'),
      ('Curvilinear Vases - Set of Two', 'White ceramic vases', 'Vases', 42.00, NULL, 'sold_out', '/products/p2.png', 'White'),
      ('Rhombus Testube Planter - Brown', 'Wooden brown planter', 'Vases', 60.00, NULL, 'new_in', '/products/p3.png', 'Brown'),
      ('Basika Vase - Set of Four', 'Four ceramic vases', 'Vases', 20.00, NULL, 'new_in', '/products/p4.png', 'Off White'),
      ('Davina Runa Lamp With Wooden', 'Wooden lamp base', 'Lamps', 80.00, 70.00, 'on_sale', '/products/p5.png', 'Wood'),
      ('Armchair, Birch Veneer/Knisa Light Beige', 'Comfy birch veneer armchair', 'Chair', 68.00, NULL, 'new_in', '/products/p6.png', 'Beige')
    `);
    console.log('Seeded initial products.');
  }

  await connection.end();
  console.log('Database initialization complete.');
}

initDB().catch(console.error);
