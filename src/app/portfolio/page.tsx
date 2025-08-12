import { Metadata } from 'next';
import PortfolioItem from '@/components/PortfolioItem';
import { IPortfolio } from '@/types/portfolio';

export const metadata: Metadata = {
  title: 'Portfolio - Facundo Uferer',
  description: 'Mi portfolio de proyectos',
};

async function getPortfolioItems() {
  try {
    // Directamente importamos desde la conexión a la base de datos
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

export default async function PortfolioPage() {
  const portfolioItems = await getPortfolioItems();

  return (
    <section className="container mx-auto p-4 mt-4">
      <h1 className="text-4xl font-pokemon text-center">Mi Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioItems.map((item: IPortfolio) => (
          <PortfolioItem
            key={item._id}
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
            codeUrl={item.codeUrl}
            projectUrl={item.projectUrl}
            tags={item.tags}
          />
        ))}
      </div>
    </section>
  );
}
