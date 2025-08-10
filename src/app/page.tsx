'use client';
import { useEffect } from "react";
import { typeWriterEffect } from "../utils/helpers";
import Adventure from "@/components/Adventure";


export default function Home() {

  useEffect(() => {
    const titulo = document.getElementById("titulo");
    const bajada = document.getElementById("bajada");

    if (titulo && bajada) {
      typeWriterEffect(titulo);
      typeWriterEffect(bajada);
    }
  }, []);

  return (
    <div className="home grid place-items-center min-h-screen">

      <div className="mb-10 sm:w-1xl lg:w-4xl">
        <Adventure />
      </div>

    </div>

  );
}
