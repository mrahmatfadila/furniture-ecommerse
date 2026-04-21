import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
       return NextResponse.json({ success: false, error: 'Database connection refused. Ensure XAMPP MySQL is running.' }, { status: 500 });
    }
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}
