import React from 'react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen  text-center px-4">
      <div className="max-w-md">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Página no encontrada</h2>
        <p className="mt-2 ">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link href="/" className="mt-6 inline-block px-6 py-3 text-sm font-medium text-white bg-[#473F3E] rounded-md hover:bg-[#6b615d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#473F3E] retro-button">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
