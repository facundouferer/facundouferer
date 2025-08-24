import { NextRequest, NextResponse } from 'next/server';
import { conectionDB } from '@/libs/mongodb';
import Post from '@/models/post';
import { validateApiKey } from '@/libs/validations';

const EXCERPT_LENGTH = 280;

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return NextResponse.json({ message: 'Acceso no autorizado. API Key inválida o faltante.' }, { status: 401 });
  }
  try {
    await conectionDB();
    const posts = await Post.find({}, 'title slug content tags featuredImage').sort({ createdAt: -1 }).lean();
    const data = posts.map(p => {
      const raw = typeof p.content === 'string' ? p.content : '';
      const simplified = raw.replace(/(```[\s\S]*?```)/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/(!?\[[^\]]*\]\([^\)]*\))/g, '')
        .replace(/^#+\s*/gm, '')
        .replace(/[*_>#-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      const excerpt = simplified.slice(0, EXCERPT_LENGTH) + (simplified.length > EXCERPT_LENGTH ? '…' : '');
      return {
        _id: String(p._id),
        title: p.title,
        slug: p.slug,
        tags: Array.isArray(p.tags) ? p.tags : [],
        featuredImage: p.featuredImage || null,
        excerpt
      };
    });
    return NextResponse.json(data);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error al obtener excerpts de posts:', msg, error);
    return NextResponse.json({ message: 'Error al obtener los posts.', error: msg }, { status: 500 });
  }
}
