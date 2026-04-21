import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'owner')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users');
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Server error: ' + error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getSession();
  if (!session || (session.role !== 'admin' && session.role !== 'owner')) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const { userId, newRole, name, email } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (newRole) {
      if (!['user', 'admin', 'owner'].includes(newRole)) {
        return NextResponse.json({ success: false, error: 'Invalid input parameters.' }, { status: 400 });
      }
      if (session.role !== 'owner' && newRole === 'owner') {
        return NextResponse.json({ success: false, error: 'Only owners can assign the owner role.' }, { status: 403 });
      }
      if (session.role !== 'owner' && session.id === userId && newRole !== 'admin') {
        return NextResponse.json({ success: false, error: 'You cannot demote yourself.' }, { status: 403 });
      }
      updates.push('role = ?');
      values.push(newRole);
    }

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }

    if (email) {
      updates.push('email = ?');
      values.push(email);
    }

    if (updates.length > 0) {
      values.push(userId);
      await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    return NextResponse.json({ success: true, message: 'User updated successfully.' });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Server error: ' + error.message }, { status: 500 });
  }
}
