import { notFound } from 'next/navigation';
import { conectionDB } from '@/libs/mongodb';
import Post, { IPost } from '@/models/post';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await conectionDB();
  const { slug } = await params;
  const post = await Post.findOne({ slug }, 'title').lean<IPost>();
  if (!post) return { title: 'Post no encontrado' };
  return { title: post.title };
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await conectionDB();
  const { slug } = await params;
  const post = await Post.findOne({ slug }).lean<IPost>();
  if (!post) return notFound();
  return (
    <div className='max-w-3xl mx-auto py-8 px-4'>
      <Link href='/posts' className='text-sm text-blue-600'>&larr; Volver</Link>
      <h1 className='text-3xl font-bold mt-2 mb-6'>{post.title}</h1>
      {post.featuredImage && (
        <div className='mb-6'>
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_URL}${post.featuredImage}`}
            alt={post.title}
            className='w-full max-h-96 object-cover rounded-lg shadow-md'
          />
        </div>
      )}
      <div className='prose prose-sm max-w-none cuentos'>
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      {Array.isArray(post.tags) && post.tags.length > 0 && (
        <div className='flex flex-wrap gap-2 mt-6'>
          {post.tags.map((t: string) => (
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
    </div>
  );
}
