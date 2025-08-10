
import Building from "./Building";
import Tree from "./Tree";

export default function Adventure() {
  return (
    <div className="w-full p-4">

      <div className="grid grid-cols-4">

        <Building
          href="/yo"
          imgSrc="/img/buildings/casa-amarilla.png"
          text="SOBRE MI"
        />

        <Tree arboles={2} />

        <Building
          href="/portfolio"
          imgSrc="/img/buildings/casa-chimenea.png"
          text="PORTFOLIO"
        />

        <Tree arboles={1} />

        <Building
          href="/tags/cuentos"
          imgSrc="/img/buildings/casa-umilde.png"
          text="CUENTOS"
        />

        <Tree arboles={1} />

        <Building
          href="/university"
          imgSrc="/img/buildings/university.png"
          text="APRENDER"
        />

        <Tree arboles={4} />

        <Tree arboles={2} />

        <Building
          href="/posts"
          imgSrc="/img/buildings/castillo.png"
          text="BLOG"
        />

        <Tree arboles={1} />

        <Tree arboles={4} />

        <Building
          href="/contact"
          imgSrc="/img/buildings/hospital.png"
          text="CONTACTO"
        />

        <Tree arboles={3} />


      </div>

    </div>
  );
}