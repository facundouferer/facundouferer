import Building from "./Building";
import Tree from "./Tree";
import { useState, useEffect } from 'react';

export default function Adventure() {

  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log('Ancho:', windowSize.width, 'Alto:', windowSize.height);
  }, [windowSize]);

  return (
    <div className="w-full pl-4 pr-4 mt-5 mb-24">

      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">

        {windowSize.width > 375 &&
          <>
            <Tree />
            <Tree />
            <Tree />
            <Tree />
            <Tree />
            <Tree />
            <Tree />
            <Tree />
            <Tree />
          </>
        }

        <Tree />

        <Building
          href="/yo"
          imgSrc="/img/buildings/casa-amarilla.png"
          text="SOBRE MI"
        />

        <Tree />

        <Building
          href="/portfolio"
          imgSrc="/img/buildings/casa-chimenea.png"
          text="PORTFOLIO"
        />

        {windowSize.width > 375 &&
          <>
            <Tree />
            <Tree />
            <Tree />
          </>
        }

        <Building
          href="/tags/cuentos"
          imgSrc="/img/buildings/casa-umilde.png"
          text="CUENTOS"
        />


        <Tree />

        {windowSize.width > 375 &&
          <>
            <Tree />
            <Tree />
            <Tree />
          </>
        }

        <Building
          href="/university"
          imgSrc="/img/buildings/university.png"
          text="APRENDER"
        />

        <Tree />

        {windowSize.width > 375 &&
          <>
            <Tree />
            <Tree />
            <Tree />
            <Tree />
          </>
        }

        <Building
          href="/posts"
          imgSrc="/img/buildings/castillo.png"
          text="BLOG"
        />

        {windowSize.width > 375 &&
          <>
            <Tree />
            <Tree />
            <Tree />
            <Tree />
            <Tree />
          </>
        }

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


        {windowSize.width > 375 &&
          <>
            <Tree />
            <Tree />
            <Tree />
            <Tree />
            <Tree />
            <Tree />
            <Tree />
            <Tree />
          </>
        }

        <Tree />

      </div>

    </div>
  );
}