"use client";

import { useState, useEffect } from "react";
import Element from "./Element";
import SimpleElement from "./SimpleElement";
import StartMessage from "./StartMessage";

export default function Adventure() {
  const [showStartMessage, setShowStartMessage] = useState(false);

  useEffect(() => {
    // Mostrar el modal cuando el componente se monta por primera vez
    setShowStartMessage(true);
  }, []);

  const handleCloseModal = () => {
    setShowStartMessage(false);
  };

  return (
    <>
      <div className="w-full pl-4 pr-4 mt-5 mb-24 items-center align-middle">

        <div className="inline-grid grid-cols-4 md:grid-cols-8" style={{
          gap: '0px',
          gridTemplateRows: 'repeat(auto-fit, 100px)',
          lineHeight: '0'
        }}>

          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={true}
          />

          <Element
            href="/about"
            text="FACUNDO"
            imgSrc="/img/characters/facu.png"
            mobil={true}
            showTitle={false}
          />

          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={true}
          />
          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={true}
          />
          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={true}
          />
          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={true}
          />

          <Element
            href="/about"
            imgSrc="/img/buildings/casa-amarilla.png"
            text="YO"
            mobil={true}
            showTitle={true}
          />

          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={true}
          />

          <Element
            href="/portfolio"
            imgSrc="/img/buildings/casa-chimenea.png"
            text="PORTFOLIO"
            mobil={true}
            showTitle={true}
          />

          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={true}
          />
          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={true}
          />

          <Element
            href="/tags/cuentos"
            imgSrc="/img/buildings/casa-umilde.png"
            text="CUENTOS"
            mobil={true}
            showTitle={true}
          />


          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />

          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />

          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />

          <Element
            href="/university"
            imgSrc="/img/buildings/university.png"
            text="APRENDER"
            mobil={false}
            showTitle={true}
          />

          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />
          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />
          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />

          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />
          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />


          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={true}
          />

          <Element
            href="/contact"
            imgSrc="/img/buildings/contact.png"
            text="CONTACTO"
            mobil={false}
            showTitle={false}
          />

          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />
          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />
          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={true}
          />
          <Element
            href="/posts"
            imgSrc="/img/buildings/castillo.png"
            text="BLOG"
            mobil={false}
            showTitle={true}
          />

          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />
          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />
          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />
          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />
          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />

        </div>

      </div>

      {/* Modal de bienvenida */}
      <StartMessage isOpen={showStartMessage} onClose={handleCloseModal} />
    </>
  );
}