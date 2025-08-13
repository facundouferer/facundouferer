import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto - Conecta con Facundo Uferer",
  description: "¿Necesitas un desarrollador Full Stack? Contacta con Facundo Uferer para proyectos de desarrollo web, consultoría técnica o colaboraciones. Disponible para proyectos freelance y oportunidades laborales.",
  keywords: [
    "Contacto Facundo Uferer",
    "Desarrollador freelance",
    "Contratar desarrollador",
    "Consultoría web",
    "Proyectos desarrollo",
    "Desarrollador Argentina",
    "Contacto desarrollador Full Stack"
  ],
  openGraph: {
    title: "Contacto - Facundo Uferer Desarrollador Full Stack",
    description: "Conecta conmigo para proyectos de desarrollo web, consultoría técnica o colaboraciones profesionales.",
    url: "https://facundouferer.ar/contact",
    images: [
      {
        url: "/img/contact.svg",
        width: 1200,
        height: 630,
        alt: "Contacto con Facundo Uferer",
      },
    ],
  },
  alternates: {
    canonical: "https://facundouferer.ar/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Datos estructurados para la página de contacto */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contacto con Facundo Uferer",
            "description": "Página de contacto para conectar con Facundo Uferer, desarrollador Full Stack",
            "url": "https://facundouferer.ar/contact",
            "mainEntity": {
              "@type": "Person",
              "name": "Facundo Uferer",
              "jobTitle": "Desarrollador Full Stack",
              "sameAs": [
                "https://github.com/facundouferer",
                "https://linkedin.com/in/facundouferer",
                "https://x.com/facundouferer",
                "https://www.instagram.com/facundouferer"
              ]
            }
          })
        }}
      />
      {children}
    </>
  );
}
