'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import dangerAmarillo from "../../public/img/danger.png"
import dangerRojo from "../../public/img/danger-rojo.png"

const NotFound = () => {
  const [currentImage, setCurrentImage] = useState(dangerAmarillo);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage(prevImage =>
        prevImage === dangerAmarillo ? dangerRojo : dangerAmarillo
      );
    }, 800);

    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen  text-center px-4">
      <div className="flex flex-col items-center justify-center">
        <Image
          src={currentImage}
          alt="imagen"
          className='mb-3'
          width={128} // Ajusta el tamaño según sea necesario
          height={128} // Ajusta el tamaño según sea necesario
        />
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">¡Acá no hay nada!</h2>
      </div>
    </main>
  );
};

export default NotFound;
