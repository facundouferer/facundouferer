'use client';
import { useEffect, useState } from "react";
import { typeWriterEffect } from "../utils/helpers";
import Image from "next/image";
import Section from "@/components/Section";
import sections from "@/data/sections.json";

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const titulo = document.getElementById("titulo");
    const bajada = document.getElementById("bajada");

    if (titulo && bajada) {
      typeWriterEffect(titulo);
      typeWriterEffect(bajada);
    }
  }, []);

  return (
    <div className="home grid place-items-center min-h-screen">

      <div className="p-7 m-4 title flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">

        <div className="flex flex-col items-center sm:items-start sm:w-1/3">

          <div className=" rounded-2xl border-4 border-[#473F3E] bg-[#FAFCDF] mb-3">
            <Image
              src="/img/foto.png"
              alt="Foto de Facundo Uferer"
              width={150}
              height={150}
              className="image-zoom w-24 h-24 sm:w-36 sm:h-36 lg:w-40 lg:h-40 p-2 rounded-2xl"
            />
          </div>
          <h1 id="titulo" className="typewriter text-xl sm:text-2xl lg:text-3xl mb-3" tabIndex={-1}>
            Facundo Uferer
          </h1>
          <h2 id="bajada" className="typewriter mb-3" tabIndex={-1}>
            Desarrollador Web Full Stack
          </h2>
        </div>

        <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col justify-center sm:w-2/3">
          <ul id="title-list">
            {sections.map((section) => (
              <li
                key={section.title}
                className="cursor-pointer p-2 text-sm"
                onClick={() => setActiveSection(section.title)}
              >
                {section.icon} {section.title}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-12">
        {sections
          .filter((section) => section.title === activeSection)
          .map((section) => (
            <Section
              key={section.title}
              icon={section.icon}
              title={section.title}
              content={section.content}
              onClose={() => setActiveSection(null)}
            />
          ))}
      </div>

    </div>
  );
}
