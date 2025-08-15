"use client";
import React, { useEffect, useState } from 'react';
import PortfolioItem from '@/components/PortfolioItem';
import Loading from '@/components/Loading';
import { IPortfolio } from '@/types/portfolio';

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<IPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/portfolio', {
          cache: 'no-store' // Para forzar la recarga en cada request
        });
        if (!res.ok) throw new Error('Error ' + res.status);
        const data = await res.json();
        if (Array.isArray(data)) setPortfolioItems(data);
        else setPortfolioItems([]);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading />;
  if (error) return <p>Error al cargar portfolio: {error}</p>;

  return (
    <section className="container mx-auto p-3 mt-4">
      <h1 className="text-4xl font-pokemon text-center">Mi Portfolio</h1>
      {portfolioItems.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-lg">No hay proyectos para mostrar.</p>
        </div>
      ) : (
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
      )}
    </section>
  );
}
