
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
interface BuildingProps {
  href: string;
  imgSrc: string;
  text: string;
}

export default function Building(BuildingProps: BuildingProps) {
  const { href, imgSrc, text } = BuildingProps;
  const [hovered, setHoverred] = useState(false)
  return (
    <div className="col-span-1">
      <div
        className="flex flex-col items-center justify-center"
      >

        <Link
          href={href}
          onMouseEnter={() => setHoverred(true)}
          onMouseLeave={() => setHoverred(false)}
        >
          <Image
            src={imgSrc}
            alt={text}
            width={100}
            height={100}
          />
          <div
            className={`relative top-[-110px] buildingText ${hovered ? "buildingTextHover" : ""}`}
          >
            {text}
          </div>
        </Link>

      </div>

    </div>
  )
}