'use client';
import { useEffect } from "react";
import { typeWriterEffect } from "../utils/helpers";
import Adventure from "@/components/Adventure";

// Nota: En Next.js 13+ App Router, la metadata para componentes client 
// debe manejarse en el layout padre o convertir a server component


export default function Home() {

  useEffect(() => {
    const titulo = document.getElementById("titulo");
    const bajada = document.getElementById("bajada");

    if (titulo && bajada) {
      typeWriterEffect(titulo);
      typeWriterEffect(bajada);
    }
  }, []);

  return (
    <>
      <div className="home grid place-items-center min-h-screen">
        <div className="mb-10 sm:w-1xl lg:w-4xl">
          <Adventure />
        </div>
      </div>

      {/* Datos estructurados específicos para la página de inicio */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Facundo Uferer Portfolio",
            "url": "https://facundouferer.ar",
            "description": "Portfolio profesional de Facundo Uferer, desarrollador Full Stack",
            "author": {
              "@type": "Person",
              "name": "Facundo Uferer"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://facundouferer.ar/posts?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </>
  );
}
