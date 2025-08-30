"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Loading from '@/components/Loading';

interface Category {
  _id: string;
  nombre: string;
  descripcion: string;
  caratula?: string;
}

export default function UniversityPage() {
  const [categories, setCategories] = useState<Category[]>([]);
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
        const res = await fetch(`${baseUrl}/api/categories`, {
          headers: { 'X-API-KEY': apiKey }
        });

        if (!res.ok) throw new Error('Error ' + res.status);

        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
        else setCategories([]);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>Error al cargar categorías: {error}</p>;

  return (
    <div className='w-full min-h-screen pb-12' style={{
      backgroundImage: 'url("/img/background_grass.svg")',
      backgroundRepeat: 'repeat',
      width: 'auto',
      objectFit: 'cover'
    }}>

      <div className='w-full h-[125px] mb-4 py-7 px-4 sm:px-6 lg:px-8'>
        <h1 className='text-3xl font-bold mt-16 text-white'>Educación</h1>
      </div>

      {!categories.length ? (
        <div className='max-w-4xl mx-auto px-4'>
          <div className='bg-white p-6 border-green-800 border-8 rounded'>
            <p className='text-gray-600 text-center'>No hay categorías disponibles.</p>
          </div>
        </div>
      ) : (
        <div className='max-w-7xl mx-auto grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-3'>
          {categories.map(category => (
            <Link
              key={category._id}
              href={`/university/${encodeURIComponent(category.nombre)}`}
              className='group'
            >
              <article className='bg-white p-4 border-green-800 border-8 flex flex-col hover:shadow-xl transition-all duration-300 group-hover:scale-105'>
                {category.caratula && (
                  <div className='mb-3 relative w-full h-48 overflow-hidden rounded'>
                    <Image
                      src={category.caratula}
                      alt={category.nombre}
                      fill
                      className='object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                  </div>
                )}
                <h2 className='mb-2 text-2xl font-bold text-gray-700 group-hover:text-green-700 transition-colors'>
                  {category.nombre}
                </h2>
                <p className='text-gray-700 leading-relaxed flex-grow'>
                  {category.descripcion}
                </p>
                <div className='mt-3 text-blue-500 group-hover:text-blue-700 transition-colors font-medium'>
                  Ver apuntes →
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}