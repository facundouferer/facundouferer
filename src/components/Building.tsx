
import Image from "next/image";
import Link from "next/link";

interface BuildingProps {
  href: string;
  imgSrc: string;
  text: string;
}

export default function Building(BuildingProps: BuildingProps) {
  const { href, imgSrc, text } = BuildingProps;
  return (
    <div className="flex flex-col items-center justify-center building">
      <Link
        href={href}
        className="texto-3d absolute opacity-0 transition-opacity duration-600 hover:opacity-100 transform"
      >
        {text}
      </Link>
      <Link href={href}>
        <Image
          src={imgSrc}
          alt={text}
          width={100}
          height={100}
        />
      </Link>
    </div>
  )
}