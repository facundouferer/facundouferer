import { Metadata } from 'next';
import PortfolioItem from '@/components/PortfolioItem';
import { IPortfolio } from '@/types/portfolio';

export const metadata: Metadata = {
  title: 'Portfolio - Facundo Uferer',
  description: 'Mi portfolio de proyectos',
};

async function getPortfolioItems() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch portfolio items');
    }

    return res.json();
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
