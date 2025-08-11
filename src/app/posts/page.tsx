"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Loading from '@/components/Loading';

interface ExcerptPost { _id: string; title: string; slug: string; excerpt: string; tags: string[] }

export default function PostsPageClient() {
  const [posts, setPosts] = useState<ExcerptPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (!baseUrl || !apiKey) {
        setError('Faltan variables NEXT_PUBLIC_BASE_URL o NEXT_PUBLIC_API_KEY');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${baseUrl}/api/posts/excerpts`, { headers: { 'X-API-KEY': apiKey } });
        if (!res.ok) throw new Error('Error ' + res.status);
        const data = await res.json();
        if (Array.isArray(data)) setPosts(data);
        else setPosts([]);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>Error al cargar posts: {error}</p>;
  if (!posts.length) return <p>No hay posts para mostrar.</p>;

  return (
    <div className='w-full min-h-screen pb-12' style={{
      backgroundImage: 'url("/img/parque.png")',
      backgroundRepeat: 'repeat',
      width: 'auto',
      objectFit: 'cover'
    }}>

      <div className='w-full h-[125px] mb-4 py-7 px-4 sm:px-6 lg:px-8' style={{
        backgroundImage: 'url("/img/pared-verde.png")',
        backgroundRepeat: 'repeat',
      }}></div>
      <div className='max-w-7xl mx-auto grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
        {posts.map(p => (
          <article key={p._id} className='bg-white p-4 border-green-800 border-8 flex flex-col'>
            <h2 className='mb-2 text-2xl font-bold text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors'>
              <Link href={`/posts/${p.slug}`}>{p.title}</Link>
            </h2>
            <p className='text-gray-700 leading-relaxed flex-grow'>
              {p.excerpt}
              <Link
                href={`/posts/${p.slug}`}
                className='text-blue-500 block mt-2 hover:text-blue-700 transition-colors'
              >
                Leer más 🔻
              </Link>
            </p>
            {p.tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-3'>
                {p.tags.map(t => (
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
