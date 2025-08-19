import Building from "./Building";
import Tree from "./Tree";

export default function Adventure() {

  return (
    <div className="w-full pl-4 pr-4 mt-5 mb-24 items-center align-middle">

      <div className="grid grid-cols-4 md:grid-cols-8 gap-4 ">

        <div className="hidden lg:grid grid-cols-3 gap-4 col-span-3">
          <Tree />
          <Tree />
          <Tree />
        </div>

        <Tree />

        <Building
          href="/about"
          imgSrc="/img/buildings/casa-amarilla.png"
          text="YO"
        />

        <Tree />

        <Building
          href="/portfolio"
          imgSrc="/img/buildings/casa-chimenea.png"
          text="PORTFOLIO"
        />


        <div className="hidden lg:grid grid-cols-2 gap-4 col-span-2">
          <Tree />
          <Tree />
        </div>


        <Building
          href="/tags/cuentos"
          imgSrc="/img/buildings/casa-umilde.png"
          text="CUENTOS"
        />

        <Tree />

        <div className="hidden lg:grid grid-cols-2 gap-4 col-span-2">
          <Tree />
          <Tree />
        </div>


        <Building
          href="/university"
          imgSrc="/img/buildings/university.png"
          text="APRENDER"
        />

        <Tree />

        <div className="hidden lg:grid grid-cols-2 gap-4 col-span-2">
          <Tree />
          <Tree />
        </div>

        <Building
          href="/posts"
          imgSrc="/img/buildings/castillo.png"
          text="BLOG"
        />

        <div className="hidden lg:grid grid-cols-2 gap-4 col-span-2">
          <Tree />
          <Tree />
        </div>

        <Tree />

        <Building
          href="/contact"
          imgSrc="/img/buildings/hospital.png"
          text="CONTACTO"
        />



        <div className="hidden lg:grid grid-cols-2 gap-4 col-span-2">
          <Tree />
          <Tree />
        </div>

        <Tree />

      </div>

    </div>
  );
}