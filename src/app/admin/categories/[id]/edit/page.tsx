"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';
import Loading from '@/components/Loading';

interface Category {
  _id: string;
  nombre: string;
  descripcion: string;
  caratula?: string;
}

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string>('');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    caratula: ''
  });

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setCategoryId(resolvedParams.id);
      await loadCategory(resolvedParams.id);
    })();
  }, [params]);

  const loadCategory = async (id: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!baseUrl || !apiKey) {
        throw new Error('Faltan variables de entorno');
      }

      const res = await fetch(`${baseUrl}/api/categories/${id}`, {
        headers: { 'X-API-KEY': apiKey }
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Categoría no encontrada');
        }
        throw new Error('Error al cargar la categoría');
      }

      const category: Category = await res.json();
      setFormData({
        nombre: category.nombre,
        descripcion: category.descripcion,
        caratula: category.caratula || ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!baseUrl || !apiKey) {
        throw new Error('Faltan variables de entorno');
      }

      const res = await fetch(`${baseUrl}/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al actualizar la categoría');
      }

      router.push('/admin/categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer.')) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!baseUrl || !apiKey) {
        throw new Error('Faltan variables de entorno');
      }

      const res = await fetch(`${baseUrl}/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: { 'X-API-KEY': apiKey }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al eliminar la categoría');
      }

      router.push('/admin/categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Editar Categoría</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Categoría *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
            maxLength={500}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Imagen de Carátula */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen de Carátula
          </label>
          <ImageUploader
            onImageUploaded={(url: string) => setFormData({ ...formData, caratula: url })}
            currentImage={formData.caratula}
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded transition-colors"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
          >
            Cancelar
          </button>
        </div>

        {/* Botón de eliminar */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded transition-colors"
          >
            {deleting ? 'Eliminando...' : 'Eliminar Categoría'}
          </button>
        </div>
      </form>
    </div>
  );
}
