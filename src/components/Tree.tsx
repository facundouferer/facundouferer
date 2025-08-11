import arbol from "../../public/img/arbol.png"
import Image from "next/image"

export default function Tree() {

  return (
    <Image
      alt="tree"
      src={arbol}
      className="w-[100px] h-[100px]"
    />

  )
}