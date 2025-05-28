'use client';
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import linksData from "@/data/links.json";
import logo from "../../public/img/home.svg"

interface SubLinkItem {
  text: string;
  href: string;
  img?: string;
}

interface NavLinkItem {
  text: string;
  href: string;
  img: string;
  sublinks?: SubLinkItem[];
}

const navLinks: NavLinkItem[] = linksData;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMobileSubmenus, setOpenMobileSubmenus] = useState<Record<string, boolean>>({});

  const toggleMobileSubmenu = (text: string) => {
    setOpenMobileSubmenus(prev => ({
      ...prev,
      [text]: !prev[text]
    }));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 shadow-md z-50 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image
                src={logo}
                alt="Logo"
                width={35}
                height={35}
              />
            </Link>
          </div>

          {/* Links para pantallas grandes */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-1">
            {navLinks.map((link) => (
              <div key={link.text} className="relative group">
                <Link
                  id={`desktop-menu-trigger-${link.text.replace(/\s+/g, '-').toLowerCase()}`}
                  href={link.href}
                  className="text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                  onClick={(e) => {
                    if (link.href === "#" && link.sublinks) {
                      e.preventDefault();
                    }
                  }}
                  aria-haspopup={!!link.sublinks}
                  aria-expanded={!!link.sublinks} // This could be dynamic if using click to open
                >
                  <Image src={link.img} alt={link.text} width={20} height={20} className="pb-2" />
                  <span>{link.text}</span>
                  {link.sublinks && (
                    <svg className="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </Link>
                {link.sublinks && (
                  <div
                    className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out invisible group-hover:visible z-20"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby={`desktop-menu-trigger-${link.text.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <div className="py-1">
                      {link.sublinks.map((sublink) => (
                        <Link
                          key={sublink.text}
                          href={sublink.href}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white flex items-center space-x-2"
                          role="menuitem"
                        >
                          {sublink.img && <Image src={sublink.img} alt={sublink.text} width={18} height={18} />}
                          <span>{sublink.text}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botón del menú móvil */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => { setIsOpen(!isOpen); if (isOpen) setOpenMobileSubmenus({}); }} // Reset submenus when closing main
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
          {navLinks.map((link) => (
            <div key={link.text}>
              {link.sublinks ? (
                <>
                  <button
                    onClick={() => toggleMobileSubmenu(link.text)}
                    className="w-full text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center justify-between"
                    aria-expanded={!!openMobileSubmenus[link.text]}
                    aria-controls={`mobile-submenu-${link.text.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Image src={link.img} alt={link.text} width={22} height={22} />
                      <span>{link.text}</span>
                    </div>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${openMobileSubmenus[link.text] ? 'rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {openMobileSubmenus[link.text] && (
                    <div
                      id={`mobile-submenu-${link.text.replace(/\s+/g, '-').toLowerCase()}`}
                      className="pl-5 border-l-2 border-gray-200 dark:border-gray-700 ml-3 space-y-1 py-1"
                    >
                      {link.sublinks.map((sublink) => (
                        <Link
                          key={sublink.text}
                          href={sublink.href}
                          className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white block pl-3 pr-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                          onClick={() => { setIsOpen(false); setOpenMobileSubmenus({}); }}
                        >
                          {sublink.img && <Image src={sublink.img} alt={sublink.text} width={18} height={18} />}
                          <span>{sublink.text}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.href}
                  className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                  onClick={() => { setIsOpen(false); setOpenMobileSubmenus({}); }}
                >
                  <Image src={link.img} alt={link.text} width={22} height={22} />
                  <span>{link.text}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}