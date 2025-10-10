import arbol from "../../public/img/arbol.png"
import Image from "next/image"

interface TreeProps {
  mobil?: boolean;
}

export default function Tree({ mobil = false }: TreeProps) {
  // Determinar las clases de visibilidad basadas en la prop mobil
  const visibilityClass = mobil
    ? "block" // Se ve en todos los dispositivos
    : "hidden md:block"; // Solo se ve en dispositivos medianos y grandes

  return (
    <div
      className={`w-[100px] h-[100px] ${visibilityClass}`}
      style={{ margin: 0, padding: 0, lineHeight: 0 }}
    >
      <Image
        alt="tree"
        src={arbol}
        width={100}
        height={100}
        className="w-full h-full object-contain block"
        style={{ margin: 0, padding: 0, display: 'block' }}
      />
    </div>
  )
}