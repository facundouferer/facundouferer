import { conectionDB } from "../../../libs/mongodb"
import Post, { IPost } from "@/models/post" // Importamos IPost
import mongoose from "mongoose"; // Importamos mongoose para sus tipos de error
import { NextRequest, NextResponse } from "next/server"
import slugify from 'slugify';
import { validateApiKey } from "@/libs/validations"

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: "Acceso no autorizado. API Key inválida o faltante." }, { status: 401 });
  }

  try {
    await conectionDB();
    const posts = await Post.find();
    return NextResponse.json(posts);
  } catch (error: unknown) { // Usamos unknown para el error
    let errorMessage = "Error desconocido";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error al obtener los posts:", errorMessage, error); // Logueamos el error completo también
    return NextResponse.json(
      { message: "Ocurrió un error en el servidor al obtener los posts.", error: errorMessage },
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

    const newPostData: Pick<IPost, 'title' | 'content' | 'slug'> & Partial<Pick<IPost, 'tags' | 'featuredImage'>> = {
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
  } catch (error: unknown) { // Usamos unknown para el error
    if (error instanceof Error && error.name === "ValidationError") {
      // Hacemos una aserción de tipo más específica para el error de validación de Mongoose
      const validationError = error as mongoose.Error.ValidationError;
      // Extraemos los mensajes de error de validación de Mongoose
      const errorMessages = Object.values(validationError.errors).map(
        (err: mongoose.Error.ValidatorError | mongoose.Error.CastError) => err.message
      );
      return NextResponse.json(
        { message: "Error de validación al crear el post.", errors: errorMessages },
        { status: 400 }
      );
    }

    let errorMessage = "Error desconocido";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("Error al crear el post:", errorMessage, error); // Logueamos el error completo también
    return NextResponse.json(
      { message: "Ocurrió un error en el servidor al crear el post.", error: errorMessage },
      { status: 500 }
    );
  }
}
