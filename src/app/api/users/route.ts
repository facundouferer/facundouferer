import { NextRequest, NextResponse } from 'next/server';
import { conectionDB } from '@/libs/mongodb';
import User from '@/models/user';
import { verifyToken } from '@/libs/auth';

export async function GET(req: NextRequest) {
  await conectionDB();
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
  // Solo admin
  if (payload.role !== 'admin') return NextResponse.json({ message: 'Prohibido' }, { status: 403 });
  const users = await User.find({}, { password: 0 }).lean();
  return NextResponse.json(users);
}
