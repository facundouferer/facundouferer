import Biblioteca from "../../components/Biblioteca";
import Escritorio from "@/components/Escritorio";
import ImagePixel from "@/components/ImagePixel";

const page = () => {
  return (
    <div className="madera w-full h-full">
      <Escritorio />
      <div className='max-w-5xl mx-auto'>
        <h1 className="text-4xl font-bold mt-10 mb-10 text-center">Facundo Uferer</h1>

        <div className="title mb-10 flex">
          <div className="flex flex-col items-center sm:items-start sm:w-1/3">

            <div className=" rounded-2xl border-4 border-[#473F3E] bg-[#FAFCDF] mb-3">
              <ImagePixel
                src="/img/foto.png"
                height={150}
                width={150}
                scale={0.1}
                className="image-zoom w-24 h-24 sm:w-36 sm:h-36 lg:w-40 lg:h-40 p-2 rounded-2xl"
              />
            </div>
          </div>
          <div>
            <h1 id="titulo" className="text-2xl" tabIndex={-1}>
              Desarrollador Web Full Stack
            </h1>
            <div>
              <p className="mb-2">
                Especializado en el ecosistema JavaScript, con amplia experiencia en el desarrollo de soluciones modernas, escalables e impulsadas por inteligencia artificial.
              </p>
              <p>
                Me defino como un profesional comprometido con la innovación, el aprendizaje constante y la creación de soluciones que integran tecnología, pensamiento crítico y creatividad.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 pb-10">

          <div className="title">
            <div className='flex'>
              <div className="flex mb-3">
                <div className="text-3xl mr-4">🚀</div>
                <h2 className="text-xl font-semibold mb-3">Tecnologías Front-end</h2>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <h3 className="text-base font-bold mt-3 mb-1">Lenguajes y frameworks</h3>
                <ul className="list-disc list-inside">
                  <li>JavaScript</li>
                  <li>TypeScript</li>
                  <li>React</li>
                  <li>Next.js</li>
                </ul>
              </div>
              <div>
                <h3 className="text-base font-bold mt-3 mb-1">Estilos y UI</h3>
                <ul className="list-disc list-inside">
                  <li>Bootstrap</li>
                  <li>Tailwind CSS</li>
                  <li>HTML</li>
                  <li>CSS</li>
                  <li>SASS</li>
                </ul>
              </div>
              <div>
                <h3 className="text-base font-bold mt-3 mb-1">Buenas prácticas</h3>
                <ul className="list-disc list-inside">
                  <li>Accesibilidad</li>
                  <li>Rendimiento</li>
                  <li>Diseño responsivo</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="title">
            <div className="flex">
              <div className="flex">
                <div className="text-3xl mb-4">🔧</div>
                <h2 className="text-xl font-semibold mb-3">Back-end y Base de Datos</h2>
              </div>
            </div>

            <div className="grid grid-cols-2">

              <div>
                <h3 className="text-base font-bold mt-3 mb-1">Back-end</h3>
                <ul className="list-disc list-inside">
                  <li>Node.js</li>
                  <li>Express</li>
                  <li>Firebase</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold mt-3 mb-1">Bases de datos</h3>
                <ul className="list-disc list-inside">
                  <li>MySQL (relacional)</li>
                  <li>MongoDB (no relacional)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold mt-3 mb-1">APIs y Seguridad</h3>
                <ul className="list-disc list-inside">
                  <li>APIs REST</li>
                  <li>Autenticación segura</li>
                  <li>Gestión eficiente de datos</li>
                </ul>
              </div>

            </div>

          </div>

          <div className="title">
            <div className="flex">
              <div className="text-3xl mb-4">☁️</div>
              <h2 className="text-xl font-semibold mb-3">Infraestructura y Despliegue</h2>
            </div>

            <div className="grid grid-cols-2">

              <div>
                <h3 className="text-base font-bold mt-3 mb-1">Plataformas</h3>
                <ul className="list-disc list-inside">
                  <li>Vercel</li>
                  <li>AWS</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold mt-3 mb-1">Herramientas</h3>
                <ul className="list-disc list-inside">
                  <li>Serverless functions</li>
                  <li>Edge middleware</li>
                  <li>ISR (Incremental Static Regeneration)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold mt-3 mb-1">DevOps</h3>
                <ul className="list-disc list-inside">
                  <li>Integración y despliegue continuo (CI/CD)</li>
                  <li>Automatización de flujos de desarrollo</li>
                  <li>Monitoreo</li>
                </ul>
              </div>

            </div>

          </div>

          <div className="title">
            <div className="flex">
              <div className="text-3xl mb-4">🤖</div>
              <h2 className="text-xl font-semibold mb-3">Integración con IA</h2>
            </div>
            <p className="mb-2">
              Implementación de soluciones basadas en IA para mejorar la experiencia de usuario, automatizar procesos y analizar datos.
            </p>
            <p>
              Integración de APIs de IA generativa, procesamiento de lenguaje natural (NLP) y modelos adaptados a cada proyecto.
            </p>
          </div>

          <div className="title">
            <div className="flex">
              <div className="text-3xl mb-4">🎙️</div>
              <h2 className="text-xl font-semibold mb-3">Divulgación y Arte</h2>
            </div>
            <h3 className="text-base font-bold mt-3 mb-1">Podcast</h3>
            <p className="mb-2">
              Soy conductor de un podcast sobre ciencia y filosofía, en el que exploro ideas complejas desde una mirada crítica y accesible.
            </p>
            <h3 className="text-base font-bold mt-3 mb-1">Arte</h3>
            <p>
              Mantengo una dedicación activa al arte y la escritura, con proyectos personales de dibujo y la creación de relatos y cuentos.
            </p>
          </div>

          <div className="title">
            <div className="text-3xl mb-4">🎓</div>
            <h2 className="text-xl font-semibold mb-3">Docencia Universitaria</h2>
            <p className="mb-2">
              Profesor de programación en la Universidad Tecnológica Nacional (UTN).
            </p>
            <p>
              Formación de estudiantes en fundamentos del desarrollo web, pensamiento lógico y buenas prácticas de programación.
            </p>
          </div>

        </div>
      </div>
      <Biblioteca />
    </div >
  );
}

export default page