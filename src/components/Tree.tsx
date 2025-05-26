import arbol from "../../public/img/universe/arbol.png"
import Image from "next/image"

interface TreeProps {
  arboles: number
}

export default function Tree(TreeProps: TreeProps) {
  const { arboles } = TreeProps
  return (
    <div className="flex flex-wrap w-full h-full justify-around">
      {Array.from({ length: arboles }).map((_, i) => (
        <Image
          alt="tree"
          key={i}
          src={arbol}
          className="w-[100px] h-[100px]"
        />
      ))}
    </div>
  )
}