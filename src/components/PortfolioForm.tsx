'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';

interface PortfolioFormProps {
  initialData?: {
    title: string;
    description: string;
    imageUrl: string;
    codeUrl: string;
    projectUrl: string;
    tags: string[];
  };
  isEditing?: boolean;
}

export default function PortfolioForm({ initialData, isEditing = false }: PortfolioFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    imageUrl: initialData?.imageUrl || '',
    codeUrl: initialData?.codeUrl || '',
    projectUrl: initialData?.projectUrl || '',
    tags: initialData?.tags?.join(', ') || '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    const data = {
      ...formData,
      tags: tagsArray,
    };

    try {
      const res = await fetch('/api/portfolio', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Error al guardar el proyecto');
      }

      router.push('/admin/portfolio');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="pokemon-window">
        <div className="pokemon-window-header">
          <h2 className="text-xl font-pokemon text-center">
            {isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
          </h2>
        </div>

        <div className="p-6 space-y-6">
          <div className="pokemon-field-group">
            <label className="pokemon-label">Título:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="pokemon-input w-full pixel-corners"
              required
            />
          </div>

          <div className="pokemon-field-group">
            <label className="pokemon-label">Descripción:</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="pokemon-input w-full h-32 pixel-corners"
              required
            />
          </div>

          <div className="pokemon-field-group">
            <label className="pokemon-label">Imagen:</label>
            <div className="pokemon-input-container pixel-corners p-4">
              <ImageUploader
                onImageUploaded={(url) => setFormData({ ...formData, imageUrl: url })}
                currentImage={formData.imageUrl}
              />
            </div>
          </div>

          <div className="pokemon-field-group">
            <label className="pokemon-label">URL del Código:</label>
            <input
              type="url"
              value={formData.codeUrl}
              onChange={(e) => setFormData({ ...formData, codeUrl: e.target.value })}
              className="pokemon-input w-full pixel-corners"
              required
            />
          </div>

          <div className="pokemon-field-group">
            <label className="pokemon-label">URL del Proyecto:</label>
            <input
              type="url"
              value={formData.projectUrl}
              onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
              className="pokemon-input w-full pixel-corners"
              required
            />
          </div>

          <div className="pokemon-field-group">
            <label className="pokemon-label">Tags:</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="pokemon-input w-full pixel-corners"
              placeholder="react, typescript, nextjs"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/portfolio')}
              className="pokemon-button-secondary flex-1 pixel-corners hover:brightness-90 active:brightness-75 transition-all">
              Cancelar
            </button>
            <button
              type="submit"
              className="pokemon-button flex-1 pixel-corners hover:brightness-90 active:brightness-75 transition-all">
              {isEditing ? '¡Actualizar!' : '¡Crear!'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
