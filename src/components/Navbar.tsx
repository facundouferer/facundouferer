'use client';
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import links from "@/data/links.json";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 shadow-md z-50 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-gray-500 dark:text-gray-300 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 
      px-3 py-2 text-sm font-medium flex items-center space-x-1">
              <Image
                src="/img/logo.png"
                alt="Logo"
                width={30}
                height={30}
                className="mr-2"
              />
              <span className="mt-2">Home</span>
            </Link>
          </div>

          {/* Links para pantallas grandes */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-1">
            {links.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className="text-gray-500 dark:text-gray-300 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 
      px-3 py-2 text-sm font-medium flex items-center space-x-1"
              >
                <div className="flex items-center space-x-1">
                  <Image
                    src={link.img}
                    alt={link.text}
                    width={25}
                    height={25}
                  />
                </div>
              </Link>
            ))}
          </div>

          {/* Botón del menú móvil */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Abrir menú principal</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="pt-2 pb-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.text}
              href={link.href}
              className="text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 hover:text-gray-700 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium flex"
            >
              <Image
                src={link.img}
                alt={link.text}
                width={25}
                height={25}
              />
              <span className="ml-2 mt-2">{link.text}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}