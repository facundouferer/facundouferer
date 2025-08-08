import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Import edge-safe JWT verifier (sin mongoose)
import { verifyJwtHS256 } from '@/libs/edgeJwt';

// Rutas sólo para usuarios logueados (ej: /admin)
const PROTECTED_PREFIXES = ['/admin'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get('auth_token')?.value;
  if (token) {
    const secret = process.env.JWT_SECRET || 'dev_secret_change_me';
    const payload = await verifyJwtHS256(token, secret);
    if (payload) return NextResponse.next();
  }
  const loginUrl = new URL('/login', req.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*']
};
