import { conectionDB } from "../../../libs/mongodb"
import Post from "@/models/post"
import { NextRequest, NextResponse } from "next/server"
import slugify from 'slugify';
const SERVER_API_KEY = process.env.API_SECRET_KEY;

function validateApiKey(request: NextRequest): boolean {
  if (!SERVER_API_KEY) {
    console.error("CRITICAL: API_SECRET_KEY no está configurada en el servidor.");
    return false;
  }
  const clientApiKey = request.headers.get("X-API-KEY");
  return clientApiKey === SERVER_API_KEY;
}

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: "Acceso no autorizado. API Key inválida o faltante." }, { status: 401 });
  }

  try {
    await conectionDB();
    const posts = await Post.find();
    return NextResponse.json(posts);
  } catch (error: any) {
    console.error("Error al obtener los posts:", error);
    return NextResponse.json(
      { message: "Ocurrió un error en el servidor al obtener los posts.", error: error.message || "Error desconocido" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json({ message: "Acceso no autorizado. API Key inválida o faltante." }, { status: 401 });
    }

    await conectionDB();
    const body = await request.json();

    const { title, content, tags, featuredImage } = body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { message: "Error de validación al crear el post.", errors: ["El título es obligatorio y no puede estar vacío."] },
        { status: 400 }
      );
    }

    const newPostData: any = {
      title,
      content,
      slug: slugify(title, { lower: true, strict: true, trim: true })
    };

    if (tags !== undefined) {
      newPostData.tags = tags;
    }
    if (featuredImage !== undefined) {
      newPostData.featuredImage = featuredImage;
    }

    const post = new Post(newPostData);
    const savedPost = await post.save();

    return NextResponse.json(savedPost, { status: 201 });
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const errorMessages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: "Error de validación al crear el post.", errors: errorMessages },
        { status: 400 }
      );
    }
    console.error("Error al crear el post:", error);
    return NextResponse.json(
      { message: "Ocurrió un error en el servidor al crear el post.", error: error.message || "Error desconocido" },
      { status: 500 }
    );
  }
}
