import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio - Proyectos y Trabajos de Facundo Uferer",
  description: "Explora el portfolio de Facundo Uferer con proyectos desarrollados en React, Next.js, Node.js y otras tecnologías modernas. Descubre aplicaciones web innovadoras y soluciones técnicas.",
  keywords: [
    "Portfolio Facundo Uferer",
    "Proyectos React",
    "Aplicaciones Next.js",
    "Desarrollos web",
    "Proyectos JavaScript",
    "Portfolio desarrollador",
    "Trabajos programación"
  ],
  openGraph: {
    title: "Portfolio de Facundo Uferer - Proyectos y Desarrollos",
    description: "Descubre los proyectos y aplicaciones desarrolladas por Facundo Uferer usando tecnologías modernas como React, Next.js y Node.js.",
    url: "https://facundouferer.ar/portfolio",
    images: [
      {
        url: "/img/foto.png",
        width: 1200,
        height: 630,
        alt: "Portfolio de proyectos de Facundo Uferer",
      },
    ],
  },
  alternates: {
    canonical: "https://facundouferer.ar/portfolio",
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Datos estructurados para el portfolio */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "name": "Portfolio de Facundo Uferer",
            "description": "Colección de proyectos y trabajos desarrollados por Facundo Uferer",
            "author": {
              "@type": "Person",
              "name": "Facundo Uferer",
              "jobTitle": "Desarrollador Full Stack"
            },
            "url": "https://facundouferer.ar/portfolio",
            "inLanguage": "es-AR"
          })
        }}
      />
      {children}
    </>
  );
}
