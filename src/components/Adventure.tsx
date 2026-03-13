"use client";

import { useState, useEffect } from "react";
import Element from "./Element";
import SimpleElement from "./SimpleElement";
import StartMessage from "./StartMessage";

export default function Adventure() {
  const [showStartMessage, setShowStartMessage] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isDroppingIcons, setIsDroppingIcons] = useState(false);

  useEffect(() => {
    // Verificar si el modal ya fue descartado (persistente)
    try {
      const dismissed = localStorage.getItem("startMessageDismissed");
      if (!dismissed) setShowStartMessage(true);
    } catch (e) {
      // Si localStorage no está disponible, mostrar el modal por defecto
      setShowStartMessage(true);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isDroppingIcons) return;

    const timeoutId = window.setTimeout(() => {
      setIsDroppingIcons(false);
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [isDroppingIcons]);

  const handleCloseModal = () => {
    setShowStartMessage(false);
    setIsDroppingIcons(true);
    // Marcar que el modal fue descartado (persistente)
    try {
      localStorage.setItem("startMessageDismissed", "true");
    } catch (e) {
      // ignore
    }
  };

  const shouldHideIcons = !isReady || showStartMessage;
  const gridClassName = [
    "inline-grid grid-cols-4 md:grid-cols-8 adventure-grid",
    shouldHideIcons ? "icons-hidden" : "",
    isDroppingIcons ? "icons-dropping" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div className="w-full pl-4 pr-4 mt-5 mb-24 items-center align-middle">

        <div className={gridClassName} style={{
          gap: "0px",
          gridTemplateRows: "repeat(auto-fit, 100px)",
          lineHeight: "0"
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

          <Element
            href="/contratar"
            imgSrc="/img/buildings/shop-techo-rojo.png"
            text="CONTRATA"
            mobil={true}
            showTitle={true}
          />

          <SimpleElement
            imgSrc="/img/arbol.png"
            mobil={false}
          />

          <Element
            href="/contact"
            imgSrc="/img/buildings/contact.png"
            text="CONTACT"
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

      <style jsx>{`
        .adventure-grid > :global(*) {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 200ms ease;
          will-change: transform, opacity;
        }

        .adventure-grid.icons-hidden > :global(*) {
          opacity: 0;
          transform: translateY(-140px);
          pointer-events: none;
        }

        .adventure-grid.icons-dropping > :global(*) {
          animation: skyDrop 1200ms cubic-bezier(0.15, 0.95, 0.2, 1.2) both;
        }

        .adventure-grid.icons-dropping > :global(*):nth-child(3n) {
          animation-delay: 110ms;
        }

        .adventure-grid.icons-dropping > :global(*):nth-child(4n) {
          animation-delay: 190ms;
        }

        @keyframes skyDrop {
          0% {
            opacity: 0;
            transform: translateY(-320px) scale(0.88) rotate(-3deg);
          }
          45% {
            opacity: 1;
            transform: translateY(18px) scale(1.03) rotate(2deg);
          }
          68% {
            opacity: 1;
            transform: translateY(-10px) scale(0.99) rotate(-1.5deg);
          }
          84% {
            opacity: 1;
            transform: translateY(6px) scale(1.01) rotate(0.8deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0deg);
          }
        }
      `}</style>
    </>
  );
}
