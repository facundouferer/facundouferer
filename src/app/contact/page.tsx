'use client'

export default function Contact() {
  return (
    <div className="home min-h-screen flex flex-col items-center justify-center p-8 sm:p-20 ">
      <div className="max-w-4xl w-full space-y-12">

        <div className="title">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold ">
              Contacto
            </h1>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <div className="mt-4 space-y-4 ">
              <p>
                Puedes encontrarme en cualquiera de mis redes sociales o escuchar mi podcast.
                Estoy siempre abierto a nuevas oportunidades y colaboraciones.
              </p>
              <p>
                Si tienes un proyecto en mente o quieres discutir ideas, no dudes en contactarme.
              </p>
            </div>
          </div>
        </div>

        <section className="prose dark:prose-invert max-w-none">
          <h3 className="text-2xl font-bold  flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            Redes y Podcast
          </h3>
          <div className="mt-4 flex flex-col gap-4">
            <a
              href="https://github.com/facundouferer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2  hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <span className="text-xl">💻</span>
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/facundouferer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2  hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <span className="text-xl">🔗</span>
              <span>LinkedIn</span>
            </a>
            <a
              href="https://www.instagram.com/facundouferer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2  hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <span className="text-xl">📸</span>
              <span>Instagram</span>
            </a>
            <a
              href="https://x.com/facundouferer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2  hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <span className="text-xl">𝕏</span>
              <span>X (Twitter)</span>
            </a>
            <a
              href="https://open.spotify.com/show/2CiWuSGhYr70Nwlanpoqzx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2  hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <span className="text-xl">🎙️</span>
              <span>Podcast Psicodelia Nerd</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
} 