import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Sesión cerrada' });
  res.cookies.delete('auth_token');
  return res;
}
