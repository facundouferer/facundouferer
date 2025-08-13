import { NextRequest, NextResponse } from 'next/server';
import { conectionDB } from '@/libs/mongodb';
import Post, { IPost } from '@/models/post';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    await conectionDB();
    const post = await Post.findOne({ slug }, 'title featuredImage').lean<IPost>();

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://facundouferer.ar';

    // Si el post tiene imagen destacada, devolverla
    if (post.featuredImage) {
      const imageUrl = post.featuredImage.startsWith('http')
        ? post.featuredImage
        : `${baseUrl}${post.featuredImage}`;

      return NextResponse.json({ imageUrl });
    }

    // Si no hay imagen, generar una URL para imagen por defecto con el título
    const defaultImageUrl = `${baseUrl}/img/blog.png`;

    return NextResponse.json({
      imageUrl: defaultImageUrl,
      title: post.title
    });

  } catch (error) {
    console.error('Error generating OG image:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
