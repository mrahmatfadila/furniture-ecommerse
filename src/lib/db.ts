import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'furniture_db',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  ssl:
    process.env.DB_HOST && process.env.DB_HOST.includes('tidbcloud')
      ? { minVersion: 'TLSv1.2', rejectUnauthorized: true }
      : undefined,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
