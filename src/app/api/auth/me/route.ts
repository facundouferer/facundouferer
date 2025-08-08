import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/libs/auth';
import { conectionDB } from '@/libs/mongodb';

export async function GET() {
  await conectionDB();
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ id: user._id, email: user.email, role: user.role, name: user.name });
}
