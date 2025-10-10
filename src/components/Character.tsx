
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type CharacterProps = {
  href: string;
  imgSrc: string;
  text: string;
};


export default function Character({ href, imgSrc, text }: CharacterProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="w-[100px] h-[100px] block relative" style={{ margin: 0, padding: 0, lineHeight: 0 }}>
      <div className={`w-[80px] h-[40px]  transition-all translate-y-[65px] translate-x-[10px] rounded-3xl duration-300 ${hovered && "bg-white/50 shadow-2xl shadow-white"}`}></div>

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
          className="w-[100px] h-[100px] object-contain block"
          style={{ margin: 0, padding: 0, display: 'block' }}
        />
      </Link>
    </div>
  );
}