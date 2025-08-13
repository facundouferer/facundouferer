import Building from "./Building";
import Tree from "./Tree";
import { useState, useEffect } from 'react';

export default function Adventure() {

  const [showTrees, setShowTrees] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      setShowTrees(window.innerWidth > 412);
    };

    updateDimensions();

    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);

  }, []);

  return (
    <div className="w-full pl-4 pr-4 mt-5 mb-24">

      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">

        {showTrees && (
          <>
            <Tree />
            <Tree />
            <Tree />
            <Tree />
          </>
        )}

        <Tree />

        <Building
          href="/about"
          imgSrc="/img/buildings/casa-amarilla.png"
          text="SOBRE MI"
        />

        <Tree />

        <Building
          href="/portfolio"
          imgSrc="/img/buildings/casa-chimenea.png"
          text="PORTFOLIO"
        />

        {showTrees && (
          <>
            <Tree />
            <Tree />
          </>
        )}

        <Building
          href="/tags/cuentos"
          imgSrc="/img/buildings/casa-umilde.png"
          text="CUENTOS"
        />


        <Tree />

        {showTrees && (
          <>
            <Tree />
            <Tree />
          </>
        )}

        <Building
          href="/university"
          imgSrc="/img/buildings/university.png"
          text="APRENDER"
        />

        <Tree />

        {showTrees && (
          <>
            <Tree />
            <Tree />
          </>
        )}

        <Building
          href="/posts"
          imgSrc="/img/buildings/castillo.png"
          text="BLOG"
        />

        {showTrees && (
          <>
            <Tree />
            <Tree />
            <Tree />
          </>
        )}

        <Tree />
        <Tree />
        <Tree />
        <Tree />
        <Tree />

        <Building
          href="/contact"
          imgSrc="/img/buildings/hospital.png"
          text="CONTACTO"
        />


        {showTrees && (
          <>
            <Tree />
            <Tree />
            <Tree />
          </>
        )}

        <Tree />

      </div>

    </div>
  );
}