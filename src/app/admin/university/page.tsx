"use client";
import Link from 'next/link';

export default function AdminApuntesPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Administración de Universidad</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Gestión de Categorías */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Categorías</h2>
          <p className="text-gray-600 mb-4">
            Administra las categorías de apuntes universitarios.
          </p>
          <div className="space-y-2">
            <Link
              href="/admin/categories/new"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors text-center"
            >
              Nueva Categoría
            </Link>
            <Link
              href="/admin/categories"
              className="block w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors text-center"
            >
              Ver Todas las Categorías
            </Link>
          </div>
        </div>

        {/* Gestión de Apuntes */}
        <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Apuntes</h2>
          <p className="text-gray-600 mb-4">
            Administra los apuntes y documentos de estudio.
          </p>
          <div className="space-y-2">
            <Link
              href="/admin/apuntes/new"
              className="block w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors text-center"
            >
              Nuevo Apunte
            </Link>
            <Link
              href="/admin/apuntes"
              className="block w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors text-center"
            >
              Ver Todos los Apuntes
            </Link>
          </div>
        </div>

      </div>

      {/* Enlaces de navegación */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <Link
          href="/admin"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Volver al Panel de Administración
        </Link>
      </div>
    </div>
  );
}
