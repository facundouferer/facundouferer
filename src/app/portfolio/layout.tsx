import React from 'react';
import "../../styles/cuentos.css"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Facundo Uferer | Portfolio de Desarrollo Web",
  description: "Portafolio de Facundo Uferer: Desarrollador Full Stack especializado en soluciones web modernas y eficientes.",
  keywords: ["Desarrollador Web", "Full Stack", "React", "Next.js", "JavaScript", "Portfolio", "Facundo Uferer"],
  authors: [{ name: "Facundo Uferer" }],
  openGraph: {
    title: "Facundo Uferer | Portfolio de Desarrollo Web",
    description: "Conocé los proyectos y tecnologías que uso como desarrollador Full Stack.",
    url: "https://facundouferer.ar",
    siteName: "Facundo Uferer",
    images: [
      {
        url: "https://www.facundouferer.ar/img/foto.png",
        width: 1200,
        height: 630,
        alt: "Facundo Uferer - Portafolio",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
};


export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <>
      <div className="mt-9">
        <h1>Portfolio</h1>
        {children}
      </div>
    </>
  );
}