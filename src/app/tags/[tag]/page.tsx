import { conectionDB } from '@/libs/mongodb';
import Post, { IPost } from '@/models/post';
import Link from 'next/link';
import Image from 'next/image';

interface ExcerptPost { _id: string; title: string; slug: string; excerpt: string; tags: string[]; featuredImage?: string | null }

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
    'title slug content tags featuredImage'
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
      featuredImage: d.featuredImage || null,
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
      <div className='w-full min-h-screen pb-12' style={{
        backgroundImage: 'url("/img/background_grass.svg")',
        backgroundRepeat: 'repeat',
        width: 'auto',
        objectFit: 'cover'
      }}>
        <div className='w-full h-[125px] mb-4 py-7 px-4 sm:px-6 lg:px-8'>
          <Link href='/posts' className='text-sm text-white hover:text-green-200'>&larr; Volver a Posts</Link>
          <h1 className='text-3xl font-bold mt-12 text-white'>Tag: {decodedTag}</h1>
        </div>
        <div className='max-w-4xl mx-auto px-4 mt-12'>
          <div className='bg-white p-6 border-green-800 border-8 rounded'>
            <p className='text-gray-600 text-center'>No se encontraron posts con el tag &quot;{decodedTag}&quot;.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full min-h-screen pb-12' style={{
      backgroundImage: 'url("/img/background_grass.svg")',
      backgroundRepeat: 'repeat',
      width: 'auto',
      objectFit: 'cover'
    }}>

      <div className='w-full h-[125px] mb-4 py-7 px-4 sm:px-6 lg:px-8'>

        <h1 className='text-3xl font-bold mt-2   text-white'>{decodedTag}</h1>
      </div>

      <div className='max-w-7xl mx-auto grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-3'>
        {posts.map(post => (
          <article key={post._id} className='bg-white p-4 border-green-800 border-8 flex flex-col'>
            {post.featuredImage && (
              <div className='mb-3 relative w-full h-48 overflow-hidden rounded'>
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className='object-cover hover:scale-105 transition-transform duration-300'
                />
              </div>
            )}
            <h2 className='mb-2 text-2xl font-bold text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors'>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className='text-gray-700 leading-relaxed flex-grow'>
              {post.excerpt}
              <Link
                href={`/posts/${post.slug}`}
                className='text-blue-500 block mt-2 hover:text-blue-700 transition-colors'
              >
                Leer más 🔻
              </Link>
            </p>
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
