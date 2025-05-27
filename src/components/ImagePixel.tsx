'use client';
import React, { useEffect, useRef } from 'react';

interface ImagePixelProps {
  src: string;
  width?: number;
  height?: number;
  scale?: number;
  className?: string;
}

const ImagePixel: React.FC<ImagePixelProps> = ({
  src,
  width = 100,
  height = 100,
  scale = 0.1,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "Anonymous"; // Necesario si la imagen viene de otro dominio, para evitar problemas de CORS con el canvas
    img.src = src;

    img.onload = () => {
      // Dibujar imagen en tamaño pequeño para pixelar
      const w = img.width * scale;
      const h = img.height * scale;

      // Paso 1: dibujar pequeño en un canvas fuera de pantalla
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = w;
      offscreenCanvas.height = h;
      const offscreenCtx = offscreenCanvas.getContext('2d');
      offscreenCtx?.drawImage(img, 0, 0, w, h);

      // Paso 2: volver a dibujar grande (pixelado) en el canvas visible
      ctx.imageSmoothingEnabled = false; // Clave para el efecto pixelado
      ctx.drawImage(offscreenCanvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
    };

    img.onerror = () => {
      console.error("Error al cargar la imagen:", src);
    }
  }, [src, width, height, scale, className]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default ImagePixel;