export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 sm:p-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            Facundo Uferer
          </h1>
          <h2 className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-300">
            Senior Software Developer
          </h2>
        </div>

        <div className="mt-12 space-y-6">
          <section className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Sobre Mí</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Desarrollador de software senior con experiencia en la creación de aplicaciones web modernas y escalables.
              Apasionado por la tecnología y el desarrollo de soluciones innovadoras.
            </p>
          </section>

          <section className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Habilidades</h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <li className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-300">JavaScript/TypeScript</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-300">React/Next.js</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-300">Node.js</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-300">AWS</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-300">Docker</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-gray-600 dark:text-gray-300">SQL/NoSQL</span>
              </li>
            </ul>
          </section>

          <section className="prose dark:prose-invert max-w-none">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Contacto</h3>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://github.com/facundouferer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/facundouferer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <span>LinkedIn</span>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
