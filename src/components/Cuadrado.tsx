"use client";
import { ReactNode, useState } from "react";

type Estado = "max" | "min";

type CuadroProprs = {
  children: ReactNode;
  title: string;
  icon: string;
  cols?: number;
  estado?: Estado; // nuevo prop
};

const defineColumnas = (cols: number) => {
  switch (cols) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-3";
    case 4:
      return "grid-cols-4";
    default:
      return "grid-cols-1";
  }
};

const Cuadrado = ({ children, title, icon, cols, estado = "min" }: CuadroProprs) => {
  const [visible, setVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [maximizado, setMaximizado] = useState(estado === "max");

  if (!visible) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setVisible(false), 400);
  };

  const handleMaximizar = () => setMaximizado(true);
  const handleMinimizar = () => setMaximizado(false);

  return (
    <div
      className={`
        title m-3 transition-opacity duration-300 ${isClosing ? "opacity-0" : "opacity-100"}
        ${maximizado
          ? "fixed top-1/3 left-1/2 z-50 -translate-x-1/2 w-full max-w-2xl shadow-2xl"
          : ""}
      `}
      style={maximizado ? { margin: 0 } : {}}
    >
      <div className="flex">
        <div className="flex justify-between items-stretch w-full bg-teal-800 h-12">
          <div className="text-3xl p-2">{icon}</div>
          <h2 className="text-xl font-semibold text-white p-2">{title}</h2>
          <div className="flex">
            {maximizado ? (
              <button
                className="bg-lime-950 w-12 flex justify-center items-center text-white cursor-pointer"
                onClick={handleMinimizar}
                aria-label="Minimizar"
                title="Minimizar"
              >
                &#x2013;
              </button>
            ) : (
              <button
                className="bg-lime-950 w-12 flex justify-center items-center text-white cursor-pointer"
                onClick={handleMaximizar}
                aria-label="Maximizar"
                title="Maximizar"
              >
                &#x2610;
              </button>
            )}
            <button
              className="bg-lime-950 w-12 flex justify-center items-center text-white cursor-pointer"
              onClick={handleClose}
              aria-label="Cerrar"
              title="Cerrar"
            >
              X
            </button>
          </div>
        </div>
      </div>
      <div className={`grid ${defineColumnas(cols ?? 1)} p-3`}>{children}</div>
    </div>
  );
};

export default Cuadrado;
