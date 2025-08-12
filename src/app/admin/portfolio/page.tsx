import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/libs/auth';
import { IPortfolio } from '@/types/portfolio';

async function getPortfolioItems() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio`, {
      cache: 'no-store',
    });
    return res.json();
  } catch (error) {
    console.error('Error loading portfolio items:', error);
    return [];
  }
}

export default async function AdminPortfolioPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  const portfolioItems = await getPortfolioItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-pokemon">Administrar Portfolio</h1>
        <Link
          href="/admin/portfolio/new"
          className="pokemon-button"
        >
          Nuevo Proyecto
        </Link>
      </div>

      <div className="grid gap-4">
        {portfolioItems.map((item: IPortfolio) => (
          <div key={item._id} className="pokemon-window p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-pokemon">{item.title}</h2>
              <div className="flex gap-2">
                <Link
                  href={`/admin/portfolio/${item._id}/edit`}
                  className="pokemon-button"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="pokemon-button pokemon-button-danger"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function handleDelete(id: string) {
  try {
    const res = await fetch(`/api/portfolio/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Error al eliminar el proyecto');
    }

    window.location.reload();
  } catch (error) {
    console.error('Error:', error);
  }
}
