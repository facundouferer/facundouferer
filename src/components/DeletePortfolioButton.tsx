'use client';

import { useRouter } from 'next/navigation';

interface DeletePortfolioButtonProps {
  id: string;
}

export default function DeletePortfolioButton({ id }: DeletePortfolioButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      return;
    }

    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Error al eliminar el proyecto');
      }

      router.refresh(); // Más moderno que window.location.reload()
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el proyecto');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="pokemon-button pokemon-button-danger"
    >
      Eliminar
    </button>
  );
}
