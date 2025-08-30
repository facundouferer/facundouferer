"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';

interface Category {
  _id: string;
  nombre: string;
}

export default function NewApuntePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    nroApunte: 1,
    titulo: '',
    descripcion: '',
    imagen: '',
    url: '',
    tags: '',
    categoria: ''
  });

  // Cargar categorías
  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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

      const res = await fetch(`${baseUrl}/api/apuntes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey
        },
        body: JSON.stringify(submitData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear el apunte');
      }

      router.push('/admin/apuntes');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Nuevo Apunte</h1>

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
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded transition-colors"
          >
            {loading ? 'Creando...' : 'Crear Apunte'}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
