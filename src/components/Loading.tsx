// components/Loading.tsx
import React, { useEffect, useState } from 'react';
import pokebola from '../../public/img/pokebola.png';
import Image from 'next/image';

const Loading = () => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => (prev < 3 ? prev + 1 : 1));
    }, 500); // cada 500ms aparece una más
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-2 justify-center items-center mt-10 h-screen w-screen">
      {[...Array(count)].map((_, index) => (
        <Image
          key={index}
          src={pokebola}
          alt="pokebola"
          width={40}
          height={40}
          className="animate-bounce"
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
};

export default Loading;
