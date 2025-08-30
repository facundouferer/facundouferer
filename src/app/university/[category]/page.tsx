"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Loading from '@/components/Loading';

interface Apunte {
  _id: string;
  nroApunte: number;
  titulo: string;
  descripcion: string;
  imagen?: string;
  url: string;
  tags: string[];
  categoria: string;
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const [apuntes, setApuntes] = useState<Apunte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState<string>('');

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      const decodedCategory = decodeURIComponent(resolvedParams.category);
      setCategoryName(decodedCategory);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!baseUrl || !apiKey) {
        setError('Faltan variables NEXT_PUBLIC_BASE_URL o NEXT_PUBLIC_API_KEY');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${baseUrl}/api/apuntes?categoria=${encodeURIComponent(decodedCategory)}`, {
          headers: { 'X-API-KEY': apiKey }
        });

        if (!res.ok) throw new Error('Error ' + res.status);

        const data = await res.json();
        if (Array.isArray(data)) setApuntes(data);
        else setApuntes([]);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    })();
  }, [params]);

  if (loading) return <Loading />;
  if (error) return <p>Error al cargar apuntes: {error}</p>;

  return (
    <div className='w-full min-h-screen pb-12' style={{
      backgroundImage: 'url("/img/background_grass.svg")',
      backgroundRepeat: 'repeat',
      width: 'auto',
      objectFit: 'cover'
    }}>

      <div className='w-full h-[125px] mb-4 py-7 px-4 sm:px-6 lg:px-8'>
        <Link href='/university/apuntes' className='text-sm text-white hover:text-green-200'>&larr; Volver a Categorías</Link>
        <h1 className='text-3xl font-bold mt-2 text-white'>{categoryName}</h1>
      </div>

      {!apuntes.length ? (
        <div className='max-w-4xl mx-auto px-4'>
          <div className='bg-white p-6 border-green-800 border-8 rounded'>
            <p className='text-gray-600 text-center'>No hay apuntes disponibles en esta categoría.</p>
          </div>
        </div>
      ) : (
        <div className='max-w-7xl mx-auto grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-3'>
          {apuntes.map(apunte => (
            <article key={apunte._id} className='relative bg-white p-4 border-green-800 border-8 flex flex-col hover:shadow-xl transition-all duration-300 overflow-hidden'>

              {/* Fondo con imagen transparente */}
              {apunte.imagen && (
                <div className='absolute inset-0 z-0'>
                  <Image
                    src={apunte.imagen}
                    alt={apunte.titulo}
                    fill
                    className='object-cover opacity-30 duration-300'
                  />
                </div>
              )}

              {/* Contenido por encima del fondo */}
              <div className='relative z-10'>
                {/* Número de Apunte */}
                <div className='bg-green-700 text-white px-3 py-1 rounded-full text-sm font-bold mb-3 self-start'>
                  Apunte #{apunte.nroApunte}
                </div>

                {/* Imagen del Apunte */}
                {apunte.imagen && (
                  <div className='mb-3 relative w-full h-64 overflow-hidden rounded'>
                    <Image
                      src={apunte.imagen}
                      alt={apunte.titulo}
                      fill
                      className='object-cover hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                )}

                {/* Título */}
                <h2 className='mb-2 text-xl font-bold text-gray-700'>
                  {apunte.titulo}
                </h2>

                {/* Descripción */}
                <p className='text-gray-700 leading-relaxed flex-grow mb-4'>
                  {apunte.descripcion}
                </p>

                {/* Tags */}
                {apunte.tags.length > 0 && (
                  <div className='flex flex-wrap gap-2 mb-4'>
                    {apunte.tags.map(tag => (
                      <span
                        key={tag}
                        className='bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Botón para abrir el apunte */}
                <a
                  href={apunte.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors text-center font-medium'
                >
                  Abrir Apunte 📖
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
