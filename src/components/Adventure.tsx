import Building from "./Building";
import Tree from "./Tree";
import Character from "./Character";

export default function Adventure() {

  return (
    <div className="w-full pl-4 pr-4 mt-5 mb-24 items-center align-middle">

      <div className="inline-grid grid-cols-4 md:grid-cols-8" style={{
        gap: '0px',
        gridTemplateRows: 'repeat(auto-fit, 100px)',
        lineHeight: '0'
      }}>



        <Character
          href="/about"
          text="FACUNDO"
          imgSrc="/img/characters/facu.png"
        />

        <Tree mobil={true} />
        <Tree mobil={true} />
        <Tree mobil={true} />

        <Tree mobil={true} />

        <Building
          href="/about"
          imgSrc="/img/buildings/casa-amarilla.png"
          text="YO"
        />

        <Tree mobil={true} />

        <Building
          href="/portfolio"
          imgSrc="/img/buildings/casa-chimenea.png"
          text="PORTFOLIO"
        />



        <Tree mobil={true} />
        <Tree mobil={true} />



        <Building
          href="/tags/cuentos"
          imgSrc="/img/buildings/casa-umilde.png"
          text="CUENTOS"
        />

        <Tree mobil={false} />
        <Tree mobil={false} />
        <Tree mobil={false} />

        <Building
          href="/university"
          imgSrc="/img/buildings/university.png"
          text="APRENDER"
        />

        <Tree mobil={false} />
        <Tree mobil={false} />
        <Tree mobil={false} />


        <Building
          href="/posts"
          imgSrc="/img/buildings/castillo.png"
          text="BLOG"
        />


        <Tree mobil={false} />
        <Tree mobil={false} />


        <Tree mobil={true} />

        <Character
          href="/contact"
          imgSrc="/img/buildings/contact.png"
          text="CONTACTO"
        />




        <Tree mobil={false} />
        <Tree mobil={false} />


        <Tree mobil={true} />

      </div>

    </div >
  );
}