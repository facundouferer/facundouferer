import { NextRequest, NextResponse } from 'next/server';
import { conectionDB } from '@/libs/mongodb';
import Category from '@/models/category';
import { validateApiKey } from '@/libs/validations';

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: 'Acceso no autorizado. API Key inválida o faltante.' }, { status: 401 });
  }

  try {
    await conectionDB();
    const categories = await Category.find({}).sort({ nombre: 1 }).lean();
    return NextResponse.json(categories);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener categorías:', msg, error);
    return NextResponse.json({ message: 'Error al obtener las categorías.', error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: 'Acceso no autorizado. API Key inválida o faltante.' }, { status: 401 });
  }

  try {
    await conectionDB();
    const body = await request.json();

    const category = new Category({
      nombre: body.nombre,
      descripcion: body.descripcion,
      caratula: body.caratula || null
    });

    await category.save();
    return NextResponse.json(category, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al crear categoría:', msg, error);

    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json({ message: 'Ya existe una categoría con ese nombre.' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Error al crear la categoría.', error: msg }, { status: 500 });
  }
}
