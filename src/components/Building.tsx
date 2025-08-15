import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface BuildingProps {
  href: string;
  imgSrc: string;
  text: string;
}

export default function Building({ href, imgSrc, text }: BuildingProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={`col-span-1 flex flex-col items-center`}>

      <div className={`w-30 h-18 rounded-full transition-all duration-300 -translate-y-[-35px] ${hovered && "bg-white/50 shadow-2xl shadow-white"}`}></div>

      <Link
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`flex-col items-center absolute`}
      >
        {/* Imagen */}
        <Image
          src={imgSrc}
          alt={text}
          width={100}
          height={100}
        />
        {/* Cartel clavado */}
        <div className="relative flex flex-col items-center -mt-5">
          {/* Cartel */}
          <div
            className={`mt-3 ml-6 px-[2px] border-2 border-yellow-700 text-xs font-bold text-center
              transition-all duration-300 ${hovered ? "bg-yellow-500 text-yellow-700" : "bg-yellow-600 text-yellow-900"
              }`}
          >
            {text.length > 7 ? text.slice(0, 7) : text}
          </div>

          {/* Poste */}
          <div className="ml-6 w-1 h-2 bg-yellow-700 "></div>
        </div>
      </Link>
    </div>
  );
}
