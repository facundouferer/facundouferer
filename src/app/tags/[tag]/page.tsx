import { conectionDB } from '@/libs/mongodb';
import Post, { IPost } from '@/models/post';
import Link from 'next/link';

interface ExcerptPost { _id: string; title: string; slug: string; excerpt: string; tags: string[] }

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `Posts con tag: ${decodedTag}`,
    description: `Todos los posts etiquetados con ${decodedTag}`
  };
}

async function getPostsByTag(tag: string): Promise<ExcerptPost[]> {
  await conectionDB();
  const decodedTag = decodeURIComponent(tag);

  // Buscar posts que contengan el tag (case insensitive)
  const docs = await Post.find(
    { tags: { $regex: new RegExp(`^${decodedTag}$`, 'i') } },
    'title slug content tags'
  ).sort({ createdAt: -1 }).lean<IPost[]>();

  return docs.map(d => {
    const raw = typeof d.content === 'string' ? d.content : '';
    // Limpiar markdown básico para excerpt
    const simplified = raw.replace(/(```[\s\S]*?```)/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/(!?\[[^\]]*\]\([^\)]*\))/g, '')
      .replace(/^#+\s*/gm, '')
      .replace(/[*_>#-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const excerpt = simplified.slice(0, 280) + (simplified.length > 280 ? '…' : '');

    return {
      _id: String(d._id),
      title: d.title,
      slug: d.slug,
      tags: Array.isArray(d.tags) ? d.tags : [],
      excerpt
    };
  });
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = await getPostsByTag(tag);

  if (!posts.length) {
    return (
      <div className='max-w-4xl mx-auto py-7 px-4'>
        <Link href='/posts' className='text-sm text-blue-600'>&larr; Volver a Posts</Link>
        <h1 className='text-3xl font-bold mt-4 mb-6'>Tag: {decodedTag}</h1>
        <p className='text-gray-600'>No se encontraron posts con el tag &quot;{decodedTag}&quot;.</p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto py-7 px-4 sm:px-6 lg:px-8'>
      <Link href='/posts' className='text-sm text-blue-600'>&larr; Volver a Posts</Link>
      <h1 className='text-3xl font-bold mt-4 mb-6'>{decodedTag}</h1>
      <p className='text-gray-600 mb-8'>Se encontraron {posts.length} post{posts.length !== 1 ? 's' : ''} con este tag.</p>

      <div className='space-y-8'>
        {posts.map(post => (
          <article key={post._id} className='border-b pb-4'>
            <h2 className='mb-2 text-2xl font-bold'>
              <Link href={`/posts/${post.slug}`} className='hover:text-blue-600'>
                {post.title}
              </Link>
            </h2>
            <p className='text-gray-700 leading-relaxed'>{post.excerpt}</p>
            {post.tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-3'>
                {post.tags.map(t => (
                  <Link
                    key={t}
                    href={`/tags/${encodeURIComponent(t)}`}
                    className='bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 text-xs rounded transition-colors'
                  >
                    {t}
                  </Link>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
