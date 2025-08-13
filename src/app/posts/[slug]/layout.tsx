import { ReactNode } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function PostLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <article className="min-h-screen">
      {/* Breadcrumbs para navegación */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Blog', href: '/posts' },
            { label: 'Artículo' }
          ]}
        />
      </div>

      {children}
    </article>
  );
}
