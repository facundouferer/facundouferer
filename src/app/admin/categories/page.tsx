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
  createdAt: string;
}

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!baseUrl || !apiKey) {
        setError('Faltan variables de configuración');
        setLoading(false);
        return;
      }

      const res = await fetch(`${baseUrl}/api/categories`, {
        headers: { 'X-API-KEY': apiKey }
      });

      if (!res.ok) throw new Error('Error al cargar categorías');

      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
        <Link
          href="/admin/categories/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Nueva Categoría
        </Link>
      </div>

      {!categories.length ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No hay categorías creadas.</p>
          <Link
            href="/admin/categories/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Crear Primera Categoría
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => (
            <div key={category._id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">

              {/* Imagen de carátula */}
              {category.caratula && (
                <div className="relative h-48 w-full">
                  <Image
                    src={category.caratula}
                    alt={category.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Contenido */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{category.nombre}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {category.descripcion}
                </p>

                <div className="text-xs text-gray-500 mb-4">
                  Creado: {new Date(category.createdAt).toLocaleDateString('es-AR')}
                </div>

                {/* Acciones */}
                <div className="flex gap-2">
                  <Link
                    href={`/university/${encodeURIComponent(category.nombre)}`}
                    target="_blank"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-center text-sm transition-colors"
                  >
                    Ver Página
                  </Link>
                  <Link
                    href={`/admin/categories/${category._id}/edit`}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded text-center text-sm transition-colors"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enlaces de navegación */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Link
          href="/admin/university"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Volver a Universidad
        </Link>
      </div>
    </div>
  );
}
