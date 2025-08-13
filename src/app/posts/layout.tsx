import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Artículos y Tutoriales de Desarrollo Web",
  description: "Lee los últimos artículos de Facundo Uferer sobre desarrollo web, JavaScript, React, Next.js y tecnologías modernas. Tutoriales, tips y experiencias de un desarrollador Full Stack.",
  keywords: [
    "Blog desarrollo web",
    "Artículos JavaScript",
    "Tutoriales React",
    "Tips Next.js",
    "Blog programación",
    "Facundo Uferer blog",
    "Desarrollo Full Stack"
  ],
  openGraph: {
    title: "Blog de Facundo Uferer - Desarrollo Web y Tecnología",
    description: "Artículos, tutoriales y experiencias sobre desarrollo web, JavaScript, React y tecnologías modernas.",
    url: "https://facundouferer.ar/posts",
    images: [
      {
        url: "/img/blog.png",
        width: 1200,
        height: 630,
        alt: "Blog de Facundo Uferer",
      },
    ],
  },
  alternates: {
    canonical: "https://facundouferer.ar/posts",
  },
};

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Datos estructurados para el blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Blog de Facundo Uferer",
            "description": "Blog sobre desarrollo web, JavaScript, React y tecnologías modernas",
            "url": "https://facundouferer.ar/posts",
            "author": {
              "@type": "Person",
              "name": "Facundo Uferer",
              "jobTitle": "Desarrollador Full Stack"
            },
            "inLanguage": "es-AR"
          })
        }}
      />
      {children}
    </>
  );
}
