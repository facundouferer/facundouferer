import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/libs/auth';
import { IPortfolio } from '@/types/portfolio';
import DeletePortfolioButton from '@/components/DeletePortfolioButton';

async function getPortfolioItems() {
  try {
    const { Portfolio } = await import('@/models/portfolio');
    const { conectionDB } = await import('@/libs/mongodb');

    await conectionDB();
    const portfolios = await Portfolio.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(portfolios)); // Necesario para serializar los datos de MongoDB
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
              <h2 className="text-xl font-pokemon text-cyan-900">{item.title}</h2>
              <div className="flex gap-2">
                <Link
                  href={`/admin/portfolio/${item._id}/edit`}
                  className="pokemon-button"
                >
                  Editar
                </Link>
                <DeletePortfolioButton id={item._id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
