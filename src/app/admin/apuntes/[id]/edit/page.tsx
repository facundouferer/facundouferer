"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';
import Loading from '@/components/Loading';

interface Category {
  _id: string;
  nombre: string;
}

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

export default function EditApuntePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [apunteId, setApunteId] = useState<string>('');

  const [formData, setFormData] = useState({
    nroApunte: 1,
    titulo: '',
    descripcion: '',
    imagen: '',
    url: '',
    tags: '',
    categoria: ''
  });

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setApunteId(resolvedParams.id);
      await Promise.all([
        loadCategories(),
        loadApunte(resolvedParams.id)
      ]);
    })();
  }, [params]);

  const loadCategories = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!baseUrl || !apiKey) return;

      const res = await fetch(`${baseUrl}/api/categories`, {
        headers: { 'X-API-KEY': apiKey }
      });

      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  };

  const loadApunte = async (id: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!baseUrl || !apiKey) {
        throw new Error('Faltan variables de entorno');
      }

      const res = await fetch(`${baseUrl}/api/apuntes/${id}`, {
        headers: { 'X-API-KEY': apiKey }
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Apunte no encontrado');
        }
        throw new Error('Error al cargar el apunte');
      }

      const apunte: Apunte = await res.json();
      setFormData({
        nroApunte: apunte.nroApunte,
        titulo: apunte.titulo,
        descripcion: apunte.descripcion,
        imagen: apunte.imagen || '',
        url: apunte.url,
        tags: apunte.tags.join(', '),
        categoria: apunte.categoria
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

      // Convertir tags de string a array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const submitData = {
        ...formData,
        tags: tagsArray,
        nroApunte: Number(formData.nroApunte)
      };

      const res = await fetch(`${baseUrl}/api/apuntes/${apunteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey
        },
        body: JSON.stringify(submitData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al actualizar el apunte');
      }

      router.push('/admin/apuntes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este apunte? Esta acción no se puede deshacer.')) {
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

      const res = await fetch(`${baseUrl}/api/apuntes/${apunteId}`, {
        method: 'DELETE',
        headers: { 'X-API-KEY': apiKey }
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al eliminar el apunte');
      }

      router.push('/admin/apuntes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Editar Apunte</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Número de Apunte */}
        <div>
          <label htmlFor="nroApunte" className="block text-sm font-medium text-gray-700 mb-2">
            Número de Apunte *
          </label>
          <input
            type="number"
            id="nroApunte"
            name="nroApunte"
            value={formData.nroApunte}
            onChange={handleChange}
            required
            min={1}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            maxLength={200}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Categoría */}
        <div>
          <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
            Categoría *
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.nombre}>
                {cat.nombre}
              </option>
            ))}
          </select>
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
            maxLength={1000}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* URL del Apunte */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            URL del Apunte (Drive) *
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            required
            placeholder="https://drive.google.com/..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags (separados por comas)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="matemática, álgebra, ejercicios"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Imagen del Apunte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen del Apunte (rectangular vertical)
          </label>
          <ImageUploader
            onImageUploaded={(url: string) => setFormData({ ...formData, imagen: url })}
            currentImage={formData.imagen}
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
            {deleting ? 'Eliminando...' : 'Eliminar Apunte'}
          </button>
        </div>
      </form>
    </div>
  );
}
