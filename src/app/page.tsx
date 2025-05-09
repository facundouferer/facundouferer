'use client';
import { useEffect } from "react";
import { typeWriterEffect } from "../utils/helpers";
import Image from "next/image";
import Section from "@/components/Section";
import { useState } from "react";

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

  const sections = [
    {
      "icon": "🧑‍💻",
      "title": "Perfil Profesional",
      "content": "Desarrollador Web Full Stack especializado en el ecosistema JavaScript, con amplia experiencia en el desarrollo de soluciones modernas, escalables e impulsadas por inteligencia artificial.\n\nMe defino como un profesional comprometido con la innovación, el aprendizaje constante y la creación de soluciones que integran tecnología, pensamiento crítico y creatividad."
    },
    {
      "icon": "🚀",
      "title": "Tecnologías Front-end",
      "content": "### Lenguajes y frameworks:\n- JavaScript\n- TypeScript\n- React\n- Next.js  \n\n### Estilos y UI\n- Bootstrap  \n- Tailwind CSS  \n- HTML  \n- CSS  \n- SASS  \n\n### Buenas prácticas\n- Accesibilidad  \n- Rendimiento  \n- Diseño responsivo"
    },
    {
      "icon": "🔧",
      "title": "Tecnologías Back-end y Base de Datos",
      "content": "### Back-end\n- Node.js  \n- Express  \n- Firebase  \n\n### Bases de datos\n- MySQL (relacional)  \n- MongoDB (no relacional)  \n\n### Autenticación, APIs y seguridad\n- Diseño e integración de APIs REST  \n- Autenticación segura  \n- Gestión eficiente de datos"
    },
    {
      "icon": "☁️",
      "title": "Infraestructura y Despliegue",
      "content": "### Plataformas\n- Vercel  \n- AWS (EC2, S3, Lambda, RDS)  \n\n### Herramientas\n- Serverless functions  \n- Edge middleware  \n- ISR (Incremental Static Regeneration)  \n\n### DevOps\n- Integración y despliegue continuo (CI/CD)  \n- Automatización de flujos de desarrollo  \n- Monitoreo"
    },
    {
      "icon": "🤖",
      "title": "Integración con Inteligencia Artificial",
      "content": "Implementación de soluciones basadas en IA para mejorar la experiencia de usuario, automatizar procesos y analizar datos.\n\nIntegración de APIs de IA generativa, procesamiento de lenguaje natural (NLP) y modelos adaptados a cada proyecto"
    },
    {
      "icon": "🎓",
      "title": "Docencia Universitaria",
      "content": "Profesor de programación en la Universidad Tecnológica Nacional (UTN).\n\nFormación de estudiantes en fundamentos del desarrollo web, pensamiento lógico y buenas prácticas de programación."
    },
    {
      "icon": "🎙️",
      "title": "Divulgación y Creatividad",
      "content": "Conductor de un podcast sobre ciencia y filosofía, donde exploro ideas complejas desde una perspectiva crítica y accesible.\n\nDedicación activa al arte y la escritura, con proyectos personales de dibujo y creación de  [relatos y cuentos](https://sites.google.com/view/cuentosdelbarro/)."
    }
  ]

  return (
    <div className="home min-h-screen flex flex-col items-center p-4 sm:p-8 lg:p-20">

      <main className="max-w-4xl w-full space-y-12 flex items-center justify-center">

        <div className="p-7 title flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
          <div className="flex flex-col items-center sm:items-start">
            <div className="rounded-2xl border-4 border-[#473F3E] bg-[#FAFCDF] mb-3">
              <Image
                src="/pokemon/foto.png"
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

          <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-col justify-center">
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
              />))}

        </div>
      </main>
    </div>
  );
}
