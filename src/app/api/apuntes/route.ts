import { NextRequest, NextResponse } from 'next/server';
import { conectionDB } from '@/libs/mongodb';
import Apunte from '@/models/apunte';
import { validateApiKey } from '@/libs/validations';

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: 'Acceso no autorizado. API Key inválida o faltante.' }, { status: 401 });
  }

  try {
    await conectionDB();
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get('categoria');

    const filter = categoria ? { categoria } : {};
    const apuntes = await Apunte.find(filter)
      .sort({ categoria: 1, nroApunte: 1 })
      .lean();

    return NextResponse.json(apuntes);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener apuntes:', msg, error);
    return NextResponse.json({ message: 'Error al obtener los apuntes.', error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: 'Acceso no autorizado. API Key inválida o faltante.' }, { status: 401 });
  }

  try {
    await conectionDB();
    const body = await request.json();

    const apunte = new Apunte({
      nroApunte: body.nroApunte,
      titulo: body.titulo,
      descripcion: body.descripcion,
      imagen: body.imagen || null,
      url: body.url,
      tags: Array.isArray(body.tags) ? body.tags : [],
      categoria: body.categoria
    });

    await apunte.save();
    return NextResponse.json(apunte, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al crear apunte:', msg, error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json({ message: 'Ya existe un apunte con ese número en esta categoría.' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Error al crear el apunte.', error: msg }, { status: 500 });
  }
}
