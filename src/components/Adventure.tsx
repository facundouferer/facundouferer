
import Image from "next/image";
import Link from "next/link";

export default function Adventure() {
  return (
    <div className="w-scree">
      <Link
        href="/cuentos">
        <Image
          src="/img/university.png"
          alt="Universidad Nacional de La Plata"
          width={100}
          height={100}
        ></Image>
      </Link>
    </div>
  )
}