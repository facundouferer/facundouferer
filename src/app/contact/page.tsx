'use client'

export default function Contact() {
  return (
    <div className="home min-h-screen flex flex-col items-center p-4 sm:p-8 lg:p-20">

      <main className="max-w-4xl w-full space-y-12 flex items-center justify-center">

        <div className="title p-7">
          <div className="text-center space-y-4">
            <h1 className="text-2xl sm:text-5xl font-bold ">
              Contacto
            </h1>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <div className="mt-4 space-y-4 ">
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
                  <span>Psicodelia Nerd</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 