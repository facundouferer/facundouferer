'use client';
import { useEffect } from "react";
import { typeWriterEffect } from "../utils/helpers";
import Image from "next/image";

export default function Home() {
  useEffect(() => {
    const titulo = document.getElementById("titulo");
    const bajada = document.getElementById("bajada");

    if (titulo && bajada) {
      const speed = 100; // Velocidad de escritura (ms por letra)
      const text1 = "Facundo Uferer";
      const text2 = "Desarrollador Full Stack";

      // Calcula el tiempo necesario para escribir el primer texto
      const delayForSecondText = text1.length * speed;

      typeWriterEffect(text1, titulo, 0);
      typeWriterEffect(text2, bajada, delayForSecondText);
    }
  }, []);

  return (
    <div className="home min-h-screen flex flex-col items-center p-8 sm:p-20">
      <main className="max-w-4xl w-full space-y-12">

        <div className="title flex items-center">
          <Image
            src="/pokemon/foto.png"
            alt="Foto de Facundo Uferer"
            width={150}
            height={150}
            className="image-zoom"
          />
          <div className="ml-4 flex flex-col justify-center">
            <h1 id="titulo" className="typewriter" tabIndex={-1}></h1>
            <h2 id="bajada" className="typewriter" tabIndex={-1}></h2>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h3 className="flex items-center gap-3">
              <span className="text-2xl">🧑‍💻</span>
              Perfil Profesional
            </h3>
            <p>
              Desarrollador Full Stack especializado en el ecosistema JavaScript, con amplia experiencia en el desarrollo de soluciones modernas, escalables e impulsadas por inteligencia artificial. Me defino como un profesional comprometido con la innovación, el aprendizaje constante y la creación de soluciones que integran tecnología, pensamiento crítico y creatividad.
            </p>
          </section>

          <section className="prose dark:prose-invert max-w-none">
            <h3 className="text-2xl font-bold  flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              Tecnologías Front-end
            </h3>
            <div className="mt-4 space-y-4">
              <p className="font-medium">Lenguajes y frameworks:</p>
              <p>JavaScript, TypeScript, React, Next.js</p>

              <p className="font-medium">Estilos y UI:</p>
              <p>Bootstrap, Tailwind CSS, HTML, CSS, SASS</p>

              <p className="font-medium">Buenas prácticas:</p>
              <p>Accesibilidad, rendimiento, diseño responsivo</p>
            </div>
          </section>

          <section className="prose dark:prose-invert max-w-none">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-2xl">🔧</span>
              Tecnologías Back-end y Base de Datos
            </h3>
            <div className="mt-4 space-y-4 ">
              <p className="font-medium">Back-end:</p>
              <p>Node.js, Express, Firebase</p>

              <p className="font-medium">Bases de datos:</p>
              <p>MySQL (relacional), MongoDB (no relacional)</p>

              <p className="font-medium">Autenticación, APIs y seguridad:</p>
              <p>Diseño e integración de APIs REST, autenticación segura, gestión eficiente de datos</p>
            </div>
          </section>

          <section className="prose dark:prose-invert max-w-none">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span className="text-2xl">☁️</span>
              Infraestructura y Despliegue
            </h3>
            <div className="mt-4 space-y-4 ">
              <p className="font-medium">Plataformas:</p>
              <p>Vercel, AWS (EC2, S3, Lambda, RDS)</p>

              <p className="font-medium">Herramientas:</p>
              <p>Serverless functions, Edge middleware, ISR (Incremental Static Regeneration)</p>

              <p className="font-medium">DevOps:</p>
              <p>Integración y despliegue continuo (CI/CD), automatización de flujos de desarrollo y monitoreo</p>
            </div>
          </section>

          <section className="prose dark:prose-invert max-w-none">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              Integración con Inteligencia Artificial
            </h3>
            <div className="mt-4 space-y-4 ">
              <p>Implementación de soluciones basadas en IA para mejorar la experiencia de usuario, automatizar procesos y analizar datos</p>
              <p>Integración de APIs de IA generativa, procesamiento de lenguaje natural (NLP) y modelos adaptados a cada proyecto</p>
            </div>
          </section>

          <section className="prose dark:prose-invert max-w-none">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              Docencia Universitaria
            </h3>
            <div className="mt-4 space-y-4 ">
              <p>Profesor de programación en la Universidad Tecnológica Nacional (UTN)</p>
              <p>Formación de estudiantes en fundamentos del desarrollo web, pensamiento lógico y buenas prácticas de programación</p>
            </div>
          </section>

          <section className="prose dark:prose-invert max-w-none">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span className="text-2xl">🎙️</span>
              Divulgación y Creatividad
            </h3>
            <div className="mt-4 space-y-4 ">
              <p>Conductor de un podcast sobre ciencia y filosofía, donde exploro ideas complejas desde una perspectiva crítica y accesible</p>
              <p>Dedicación activa al arte y la escritura, con proyectos personales de dibujo y creación de relatos y cuentos</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
