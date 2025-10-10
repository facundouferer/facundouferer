import Image from "next/image";
import Link from "next/link";

interface StartMessageProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StartMessage({ isOpen, onClose }: StartMessageProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay oscuro */}
      <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
        {/* Modal container estilo Pokémon */}
        <div className="relative max-w-xl w-full">
          {/* Ventana principal estilo NES */}
          <div
            className="bg-amber-100 border-8 relative"
            style={{
              borderImageSource: 'linear-gradient(45deg, #ffffff 25%, #c0c0c0 25%, #c0c0c0 50%, #808080 50%, #808080 75%, #404040 75%)',
              borderImageSlice: '8',
              borderStyle: 'solid',
              borderColor: '#ffffff #404040 #404040 #ffffff'
            }}
          >
            {/* Header del modal */}
            <div className="bg-amber-800 text-white px-4 py-2 font-mono text-sm font-bold border-b-4 border-amber-900">
              ¡BIENVENIDO!
            </div>

            {/* Contenido del modal */}
            <div className="p-6 bg-amber-50">
              <div className="flex gap-4 mb-4">
                {/* Imagen de perfil */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 border-4 border-gray-800 bg-white p-1">
                    <Image
                      src="/img/foto.png"
                      alt="Facundo Uferer"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover pixelated"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                </div>

                {/* Mensaje principal */}
                <div className="flex-1">
                  <div className="font-mono text-sm text-gray-900 leading-relaxed text-justify">
                    <p className="mb-3">
                      Mi nombre es <strong>Facundo Uferer</strong>, soy desarrollador y en este sitio podrás encontrar mis{' '}
                      <Link
                        href="/portfolio"
                        className="text-amber-700 underline hover:text-amber-900 font-bold"
                        onClick={onClose}
                      >
                        habilidades
                      </Link>{' '}
                      y{' '}
                      <Link
                        href="/contact"
                        className="text-amber-700 underline hover:text-amber-900 font-bold"
                        onClick={onClose}
                      >
                        dónde encontrarme.
                      </Link>.
                      <br />
                      También puedes recorrer los edificios y personajes donde encontrarás cosas interesantes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón Aceptar estilo NES */}
              <div className="flex justify-center mt-3">
                <button
                  onClick={onClose}
                  className="px-8 py-3 font-mono font-bold text-sm bg-amber-700 border-4 border-green-600 hover:bg-amber-600 active:bg-amber-500 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300"
                  style={{
                    borderStyle: 'solid',
                    borderColor: '#ffffff #404040 #404040 #ffffff',
                    textShadow: '1px 1px 0px #000000'
                  }}
                >
                  ACEPTAR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS para efectos pixelados */}
      <style jsx>{`
        .pixelated {
          image-rendering: -moz-crisp-edges;
          image-rendering: -webkit-crisp-edges;
          image-rendering: pixelated;
        }
      `}</style>
    </>
  );
}