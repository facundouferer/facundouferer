import { conectionDB } from "@/libs/mongodb";
import Post from "@/models/post";
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/libs/validations";

type RouteContext = {
  params: {
    slug: string;
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(request: NextRequest, context: any) {
  const { params } = context as RouteContext;
  const { slug } = params;

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
