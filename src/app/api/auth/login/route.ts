import { NextRequest, NextResponse } from 'next/server';
import { conectionDB } from '@/libs/mongodb';
import User from '@/models/user';
import { comparePassword, signToken } from '@/libs/auth';

export async function POST(req: NextRequest) {
  try {
    await conectionDB();
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ message: 'Credenciales incompletas' }, { status: 400 });
    }
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });

    const ok = await comparePassword(password, user.password);
    if (!ok) return NextResponse.json({ message: 'Credenciales inválidas' }, { status: 401 });

    const token = signToken(user);
    const res = NextResponse.json({ id: user._id, email: user.email, role: user.role, name: user.name });
    res.cookies.set('auth_token', token, { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Error en el servidor' }, { status: 500 });
  }
}
