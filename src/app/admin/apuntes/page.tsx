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
  createdAt: string;
}

export default function ApuntesAdminPage() {
  const [apuntes, setApuntes] = useState<Apunte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');

  useEffect(() => {
    loadApuntes();
  }, []);

  const loadApuntes = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!baseUrl || !apiKey) {
        setError('Faltan variables de configuración');
        setLoading(false);
        return;
      }

      const res = await fetch(`${baseUrl}/api/apuntes`, {
        headers: { 'X-API-KEY': apiKey }
      });

      if (!res.ok) throw new Error('Error al cargar apuntes');

      const data = await res.json();
      setApuntes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar apuntes por categoría
  const filteredApuntes = filterCategory
    ? apuntes.filter(apunte => apunte.categoria === filterCategory)
    : apuntes;

  // Obtener categorías únicas
  const categories = [...new Set(apuntes.map(apunte => apunte.categoria))];

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Apuntes</h1>
        <Link
          href="/admin/apuntes/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
        >
          Nuevo Apunte
        </Link>
      </div>

      {/* Filtro por categoría */}
      {categories.length > 0 && (
        <div className="mb-6">
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por categoría:
          </label>
          <select
            id="category-filter"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      )}

      {!apuntes.length ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No hay apuntes creados.</p>
          <Link
            href="/admin/apuntes/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
          >
            Crear Primer Apunte
          </Link>
        </div>
      ) : (
        <>
          {/* Resumen */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Mostrando {filteredApuntes.length} de {apuntes.length} apuntes
              {filterCategory && ` en la categoría "${filterCategory}"`}
            </p>
          </div>

          {/* Lista de apuntes */}
          <div className="space-y-6">
            {filteredApuntes.map(apunte => (
              <div key={apunte._id} className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
                <div className="flex gap-6">

                  {/* Imagen */}
                  {apunte.imagen && (
                    <div className="flex-shrink-0">
                      <div className="relative w-24 h-32">
                        <Image
                          src={apunte.imagen}
                          alt={apunte.titulo}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    </div>
                  )}

                  {/* Contenido */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="bg-green-700 text-white px-2 py-1 rounded text-xs font-bold mr-3">
                          #{apunte.nroApunte}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {apunte.categoria}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(apunte.createdAt).toLocaleDateString('es-AR')}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">{apunte.titulo}</h3>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {apunte.descripcion}
                    </p>

                    {/* Tags */}
                    {apunte.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {apunte.tags.map(tag => (
                          <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* URL */}
                    <p className="text-xs text-gray-500 mb-4 truncate">
                      📎 {apunte.url}
                    </p>

                    {/* Acciones */}
                    <div className="flex gap-2">
                      <a
                        href={apunte.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Abrir Apunte
                      </a>
                      <Link
                        href={`/university/${encodeURIComponent(apunte.categoria)}`}
                        target="_blank"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Ver en Sitio
                      </Link>
                      <Link
                        href={`/admin/apuntes/${apunte._id}/edit`}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
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
