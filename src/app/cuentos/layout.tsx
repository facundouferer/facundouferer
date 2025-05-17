import React from 'react';
import Link from 'next/link';
import "../../styles/cuentos.css"

export const metadata = {
  title: "Cuentos - Facundo Uferer",
  description: "Historias de un barrio argentino, contadas y dibujadas por mí!",
  openGraph: {
    title: "Cuentos - Facundo Uferer",
    description: "Historias de un barrio argentino, contadas y dibujadas por mí!",
    images: ["https://www.facundouferer.ar/img/foto.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <nav className="fixed h-9 pt-2 pb-1 left-0 right-0 mx-auto">
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16'>
          <Link
            href="/cuentos/"
            className='hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 p-2'
          >
            Cuentos
          </Link>
        </div>
      </nav>
      <div className="mt-9">
        {children}
      </div>
    </>
  );
}