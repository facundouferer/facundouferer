import Link from 'next/link';


interface BotonGrandeProps {
  url: string;
  text: string
}

export default function BotonGrande({ url, text }: BotonGrandeProps) {
  return (
    <Link
      href={url}
      className="
        inline-block
        relative
        px-8 
        py-4 
        text-pink-950 
        text-xl   
        bg-white 
        border-2 
        border-black
        rounded-sm
        font-pixel
        shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
        active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]
        active:translate-x-[2px]
        active:translate-y-[2px]
        transition-all
        hover:bg-gray-100
        before:absolute
        before:content-['']
        before:block
        before:top-[-2px]
        before:left-[-2px]
        before:w-[calc(100%+4px)]
        before:h-[2px]
        before:bg-white
        after:absolute
        after:content-['']
        after:block
        after:top-[-2px]
        after:left-[-2px]
        after:w-[2px]
        after:h-[calc(100%+4px)]
        after:bg-white
        mt-3
      "
    >
      {text}
    </Link>
  )
}