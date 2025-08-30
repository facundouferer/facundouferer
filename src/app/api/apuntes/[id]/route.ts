import { NextRequest, NextResponse } from 'next/server';
import { conectionDB } from '@/libs/mongodb';
import Apunte from '@/models/apunte';
import { validateApiKey } from '@/libs/validations';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: 'Acceso no autorizado. API Key inválida o faltante.' }, { status: 401 });
  }

  try {
    await conectionDB();
    const { id } = await params;
    const apunte = await Apunte.findById(id).lean();

    if (!apunte) {
      return NextResponse.json({ message: 'Apunte no encontrado.' }, { status: 404 });
    }

    return NextResponse.json(apunte);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener apunte:', msg, error);
    return NextResponse.json({ message: 'Error al obtener el apunte.', error: msg }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: 'Acceso no autorizado. API Key inválida o faltante.' }, { status: 401 });
  }

  try {
    await conectionDB();
    const { id } = await params;
    const body = await request.json();

    const apunte = await Apunte.findByIdAndUpdate(
      id,
      {
        nroApunte: body.nroApunte,
        titulo: body.titulo,
        descripcion: body.descripcion,
        imagen: body.imagen || null,
        url: body.url,
        tags: Array.isArray(body.tags) ? body.tags : [],
        categoria: body.categoria
      },
      { new: true, runValidators: true }
    );

    if (!apunte) {
      return NextResponse.json({ message: 'Apunte no encontrado.' }, { status: 404 });
    }

    return NextResponse.json(apunte);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al actualizar apunte:', msg, error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json({ message: 'Ya existe un apunte con ese número en esta categoría.' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Error al actualizar el apunte.', error: msg }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: 'Acceso no autorizado. API Key inválida o faltante.' }, { status: 401 });
  }

  try {
    await conectionDB();
    const { id } = await params;

    const apunte = await Apunte.findByIdAndDelete(id);

    if (!apunte) {
      return NextResponse.json({ message: 'Apunte no encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Apunte eliminado correctamente.' });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al eliminar apunte:', msg, error);
    return NextResponse.json({ message: 'Error al eliminar el apunte.', error: msg }, { status: 500 });
  }
}
