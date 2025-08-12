import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import User, { IUser } from '@/models/user';
import { conectionDB } from './mongodb';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES = '7d';

export interface AuthTokenPayload { id: string; role: string; email: string; }

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(user: IUser) {
  const id = (user as unknown as { _id: { toString(): string } })._id.toString();
  const payload: AuthTokenPayload = { id, role: user.role, email: user.email };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
}

interface CookieStoreLike {
  get(name: string): { name: string; value: string } | undefined;
  set?(name: string, value: string, options?: Record<string, unknown>): void;
  delete?(name: string): void;
}

function getCookieStore(): CookieStoreLike {
  return cookies() as unknown as CookieStoreLike;
}

export async function getCurrentUser(): Promise<IUser | null> {
  const store = getCookieStore();
  const token = store.get('auth_token')?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  await conectionDB();
  return User.findById(payload.id);
}

export function setAuthCookie(token: string) {
  const store = getCookieStore();
  if (store.set) {
    store.set('auth_token', token, { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 });
  }
}

export function clearAuthCookie() {
  const store = getCookieStore();
  if (store.delete) store.delete('auth_token');
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await conectionDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) return null;

        const isValid = await comparePassword(
          credentials.password as string,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/login'
  }
} satisfies NextAuthConfig;
