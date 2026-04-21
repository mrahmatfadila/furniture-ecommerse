import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  
  return NextResponse.redirect(new URL('/login', req.url), { status: 303 });
}
