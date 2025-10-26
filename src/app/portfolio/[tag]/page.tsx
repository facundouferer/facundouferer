"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PortfolioItem from '@/components/PortfolioItem';
import Loading from '@/components/Loading';
import { IPortfolio } from '@/types/portfolio';
import Link from 'next/link';

export default function PortfolioByTagPage() {
  const params = useParams();
  const tag = decodeURIComponent(params.tag as string);
  const [portfolioItems, setPortfolioItems] = useState<IPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/portfolio', {
          cache: 'no-store'
        });
        if (!res.ok) throw new Error('Error ' + res.status);
        const data = await res.json();

        if (Array.isArray(data)) {
          // Filtrar proyectos que contengan el tag específico
          const filteredItems = data.filter((item: IPortfolio) =>
            item.tags.some((itemTag: string) =>
              itemTag.toLowerCase() === tag.toLowerCase()
            )
          );
          setPortfolioItems(filteredItems);
        } else {
          setPortfolioItems([]);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    })();
  }, [tag]);

  if (loading) return <Loading />;
  if (error) return <p>Error al cargar portfolio: {error}</p>;

  return (
    <section className="container mx-auto p-3 mt-4 mb-10">
      <div className="mb-6">
        <Link
          href="/portfolio"
          className="pokemon-button-secondary inline-block mb-4"
        >
          ← Volver al Portfolio
        </Link>
        <h1 className="text-4xl font-pokemon text-center mb-2 mt-3 capitalize">
          {tag}
        </h1>
        <p className="text-center text-gray-600 mb-4">
          Proyectos que utilizan <strong>{tag}</strong>
        </p>
      </div>

      {portfolioItems.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-lg">No hay proyectos con el tag &ldquo;{tag}&rdquo;.</p>
          <Link href="/portfolio" className="pokemon-button mt-4 inline-block">
            Ver todos los proyectos
          </Link>
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