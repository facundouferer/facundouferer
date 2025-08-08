import { conectionDB } from "@/libs/mongodb";
import Post from "@/models/post";
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/libs/validations";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: any) {
  const { params } = context as RouteContext;
  const { slug } = await params;

  if (!validateApiKey(request)) {
    return NextResponse.json(
      { message: "Acceso no autorizado. API Key inválida o faltante." },
      { status: 401 }
    );
  }

  try {
    await conectionDB();

    if (!slug) {
      return NextResponse.json(
        { message: "El slug es obligatorio." },
        { status: 400 }
      );
    }

    const post = await Post.findOne({ slug });

    if (!post) {
      return NextResponse.json(
        { message: "Post no encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    console.error(`Error al obtener el post con slug '${slug}':`, errorMessage, error);
    return NextResponse.json(
      {
        message: "Ocurrió un error en el servidor al obtener el post.",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { params } = context;
  const { slug } = await params;
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: 'Acceso no autorizado. API Key inválida o faltante.' }, { status: 401 });
  }
  try {
    await conectionDB();
    const data = await request.json();
    if (data.title) {
      data.slug = data.title
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
    const updated = await Post.findOneAndUpdate({ slug }, data, { new: true });
    if (!updated) return NextResponse.json({ message: 'Post no encontrado.' }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ message: 'Error al actualizar el post.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { params } = context;
  const { slug } = await params;
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: 'Acceso no autorizado. API Key inválida o faltante.' }, { status: 401 });
  }
  try {
    await conectionDB();
    const deleted = await Post.findOneAndDelete({ slug });
    if (!deleted) return NextResponse.json({ message: 'Post no encontrado.' }, { status: 404 });
    return NextResponse.json({ message: 'Post eliminado' });
  } catch {
    return NextResponse.json({ message: 'Error al eliminar el post.' }, { status: 500 });
  }
}
