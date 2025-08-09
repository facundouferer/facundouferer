"use client";
import React, { useState } from 'react';

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  label?: string;
}

export default function ImageUploader({ onImageUploaded, currentImage, label = 'Imagen destacada' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validaciones del lado cliente
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Tipo de archivo no permitido. Solo JPG, PNG, WebP, GIF.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 5MB.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!baseUrl || !apiKey) {
        throw new Error('Configuración de API faltante');
      }

      const response = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al subir imagen');
      }

      const data = await response.json();
      const fullUrl = `${baseUrl}${data.url}`;

      setPreview(fullUrl);
      onImageUploaded(data.url); // Pasamos la URL relativa para guardar en DB

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUploaded('');
  };

  return (
    <div className='space-y-3'>
      <label className='block text-sm font-medium'>{label}</label>

      {preview && (
        <div className='relative inline-block'>
          <img
            src={preview}
            alt='Preview'
            className='max-w-xs max-h-48 object-cover border rounded'
          />
          <button
            type='button'
            onClick={removeImage}
            className='absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600'
          >
            ×
          </button>
        </div>
      )}

      <div className='flex items-center gap-2'>
        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          disabled={uploading}
          className='text-sm'
        />
        {uploading && <span className='text-sm text-blue-600'>Subiendo...</span>}
      </div>

      {error && (
        <p className='text-red-600 text-sm'>{error}</p>
      )}
    </div>
  );
}
