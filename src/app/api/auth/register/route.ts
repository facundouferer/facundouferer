import { NextRequest, NextResponse } from 'next/server';
import { conectionDB } from '@/libs/mongodb';
import User from '@/models/user';
import { hashPassword, signToken } from '@/libs/auth';
import { validateApiKey } from '@/libs/validations';

export async function POST(req: NextRequest) {
  try {
    if (!validateApiKey(req)) {
      return NextResponse.json({ message: 'Acceso no autorizado. API Key inválida o faltante.' }, { status: 401 });
    }

    await conectionDB();
    const { email, password, name, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email y password son obligatorios' }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'El email ya está registrado' }, { status: 409 });
    }

    const hashed = await hashPassword(password);
    const user = await User.create({ email, password: hashed, name, role: role === 'admin' ? 'admin' : 'user' });

    const token = signToken(user);
    const res = NextResponse.json({ id: user._id, email: user.email, role: user.role, name: user.name }, { status: 201 });
    res.cookies.set('auth_token', token, { httpOnly: true, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 24 * 7 });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: 'Error en el servidor' }, { status: 500 });
  }
}
