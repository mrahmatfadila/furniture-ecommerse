import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if email already exists
    const [existing]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, error: 'Email is already registered' }, { status: 409 });
    }

    // Insert new user
    // Role is automatically 'user' in this basic setup
    const [result]: any = await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, 'user']);
    
    // Automatically log them in after registration
    const token = await signToken({
      id: result.insertId,
      email: email,
      name: name,
      role: 'user'
    });

    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
       httpOnly: true,
       secure: process.env.NODE_ENV === 'production',
       sameSite: 'lax',
       path: '/'
    });

    return NextResponse.json({
      success: true,
      user: {
        id: result.insertId,
        email: email,
        name: name,
        role: 'user'
      }
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Server error: ' + error.message }, { status: 500 });
  }
}
