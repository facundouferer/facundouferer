import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { validateApiKey } from '@/libs/validations';
import { put } from '@vercel/blob';

// Tipos de archivo permitidos
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: 'Acceso no autorizado. API Key inválida o faltante.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No se proporcionó ningún archivo.' }, { status: 400 });
    }

    // Validar tipo de archivo
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({
        message: 'Tipo de archivo no permitido. Solo se permiten: JPG, PNG, WebP, GIF.'
      }, { status: 400 });
    }

    // Validar tamaño
    if (file.size > MAX_SIZE) {
      return NextResponse.json({
        message: 'El archivo es demasiado grande. Tamaño máximo: 5MB.'
      }, { status: 400 });
    }

    // En producción, usar Vercel Blob. En desarrollo, usar filesystem local.
    const isProd = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';

    if (isProd) {
      try {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          throw new Error('BLOB_READ_WRITE_TOKEN not configured');
        }
        const bytes = await file.arrayBuffer();
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}-${file.name}`;
        const { url } = await put(uniqueFileName, Buffer.from(bytes), {
          access: 'public',
          token: process.env.BLOB_READ_WRITE_TOKEN
        });
        return NextResponse.json({
          message: 'Imagen subida exitosamente.',
          url, // URL absoluta
          fileName: path.basename(url)
        }, { status: 201 });
      } catch (blobError) {
        console.error('Error with Vercel Blob:', blobError);
        return NextResponse.json({
          message: 'Error al configurar el almacenamiento de archivos. Por favor, contacte al administrador.',
          error: blobError instanceof Error ? blobError.message : 'Unknown error'
        }, { status: 500 });
      }
    } else {
      // Generar nombre único
      const timestamp = Date.now();
      const extension = path.extname(file.name);
      const baseName = path.basename(file.name, extension).replace(/[^a-zA-Z0-9]/g, '-');
      const fileName = `${timestamp}-${baseName}${extension}`;

      // Crear directorio si no existe
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch {
        // Directorio ya existe, continuar
      }

      // Guardar archivo
      const filePath = path.join(uploadDir, fileName);
      const bytes = await file.arrayBuffer();
      await writeFile(filePath, Buffer.from(bytes));

      // Retornar URL relativa (sin dominio para que sea dinámico)
      const imageUrl = `/uploads/${fileName}`;

      return NextResponse.json({
        message: 'Imagen subida exitosamente.',
        url: imageUrl,
        fileName
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Error al subir imagen:', error);
    return NextResponse.json({
      message: 'Error interno del servidor al subir la imagen.'
    }, { status: 500 });
  }
}
