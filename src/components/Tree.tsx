import arbol from "../../public/img/arbol.png"
import Image from "next/image"

export default function Tree() {

  return (
    <Image
      alt="tree"
      src={arbol}
      className="z-50 contain-content"
    />

  )
}