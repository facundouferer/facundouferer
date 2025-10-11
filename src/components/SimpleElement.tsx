import Image from "next/image";

interface SimpleElementProps {
  mobil?: boolean;
  imgSrc: string;
}

export default function SimpleElement({ mobil, imgSrc }: SimpleElementProps) {

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
        src={imgSrc}
        width={100}
        height={100}
        className={`w-full h-full object-contain block`}
        style={{ margin: 0, padding: 0, display: 'block' }}
      />
    </div>
  )
}