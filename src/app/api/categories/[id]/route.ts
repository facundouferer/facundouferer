import { NextRequest, NextResponse } from 'next/server';
import { conectionDB } from '@/libs/mongodb';
import Category from '@/models/category';
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
    const category = await Category.findById(id).lean();

    if (!category) {
      return NextResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener categoría:', msg, error);
    return NextResponse.json({ message: 'Error al obtener la categoría.', error: msg }, { status: 500 });
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

    const category = await Category.findByIdAndUpdate(
      id,
      {
        nombre: body.nombre,
        descripcion: body.descripcion,
        caratula: body.caratula || null
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al actualizar categoría:', msg, error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json({ message: 'Ya existe una categoría con ese nombre.' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Error al actualizar la categoría.', error: msg }, { status: 500 });
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

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json({ message: 'Categoría no encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Categoría eliminada correctamente.' });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al eliminar categoría:', msg, error);
    return NextResponse.json({ message: 'Error al eliminar la categoría.', error: msg }, { status: 500 });
  }
}
