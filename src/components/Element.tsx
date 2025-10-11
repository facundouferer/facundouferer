import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface ElementProps {
  href: string;
  imgSrc: string;
  text: string;
  mobil: boolean;
  showTitle: boolean;
}

export default function Element({ href, imgSrc, text, mobil, showTitle }: ElementProps) {

  const [hovered, setHovered] = useState(false);

  const visibility = mobil ? "block" : "hidden md:block";

  // Función para renderizar texto con efecto neón secuencial en loop
  const renderNeonText = (text: string) => {
    const displayText = text.length > 7 ? text.slice(0, 7) : text;

    return displayText.split('').map((char, index) => (
      <span
        key={index}
        className="inline-block"
        style={{
          animation: hovered ? `neonLoop 1.5s ease-in-out ${index * 0.2}s infinite` : 'none',
          opacity: hovered ? 0 : 1,
          textShadow: 'none',
          transition: 'opacity 0.1s ease-out'
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <>
      {/* Estilos CSS para las animaciones */}
      <style jsx>{`
        @keyframes neonLoop {
          0% {
            opacity: 0.5;
            text-shadow: none;
          }
          20% {
            opacity: 1;
            text-shadow: 
              0 0 5px #fef08a, 
              0 0 10px #fef08a, 
              0 0 15px #fef08a,
              0 0 20px #fef08a;
          }
          40% {
            opacity: 1;
            text-shadow: 
              0 0 3px #fef08a, 
              0 0 6px #fef08a, 
              0 0 9px #fef08a;
          }
          60% {
            opacity: 1;
            text-shadow: 
              0 0 3px #fef08a, 
              0 0 6px #fef08a, 
              0 0 9px #fef08a;
          }
          80% {
            opacity: 0.3;
            text-shadow: 
              0 0 2px #fef08a;
          }
          100% {
            opacity: 0.5;
            text-shadow: none;
          }
        }

        @keyframes shadowPulse {
          0% {
            transform: translateY(50px) scale(0.8);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
          }
          50% {
            transform: translateY(50px) scale(1.2);
            box-shadow: 0 0 30px rgba(255, 255, 255, 0.7);
          }
          100% {
            transform: translateY(50px) scale(0.8);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
          }
        }
      `}</style>

      <div className={`w-[100px] h-[100px] ${visibility} relative`} style={{ margin: 0, padding: 0, lineHeight: 0 }}>
        {/** sombra brillante con animación de pulso */}
        <div
          className={`w-[100px] h-[50px] rounded-3xl duration-300 ${hovered ? "bg-white/50" : ""}`}
          style={{
            transform: 'translateY(50px)',
            animation: hovered ? 'shadowPulse 2s ease-in-out infinite' : 'none',
            boxShadow: hovered ? '0 0 20px rgba(255, 255, 255, 0.5)' : 'none'
          }}
        ></div>

        <Link
          href={href}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex flex-col items-center absolute inset-0"
          style={{ margin: 0, padding: 0 }}
        >
          {/* Imagen */}
          <Image
            src={imgSrc}
            alt={text}
            width={100}
            height={100}
            className={`w-[100px] h-[100px] object-contain block transition-all duration-300 ${hovered ? "sepia" : ""}`}
            style={{ margin: 0, padding: 0, display: 'block' }}
          />
          {showTitle && (
            <div className="relative flex flex-col items-center translate-x-[1px] translate-y-[-65px]">
              {/* Cartel con efecto neón */}
              <div
                className={`border-2 border-yellow-700 text-xs font-bold text-center px-1
              transition-all duration-300 ${hovered ? "bg-yellow-400/70 text-yellow-800" : "bg-yellow-500/65 text-yellow-900"
                  }`}
                style={{
                  boxShadow: hovered
                    ? '0 0 10px #fef08a, 0 0 20px #fef08a, 0 0 30px #fef08a'
                    : 'none'
                }}
              >
                {renderNeonText(text)}
              </div>
            </div>
          )}

        </Link>
      </div>
    </>
  )
}