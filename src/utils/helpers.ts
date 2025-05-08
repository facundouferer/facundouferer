export function typeWriterEffect(text: string, element: HTMLElement, delay: number = 0) {
  let index = 0;
  const speed = 100;

  // Limpia el contenido del elemento antes de iniciar la escritura
  element.textContent = "";

  const typeWriter = () => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(typeWriter, speed); // Controla la velocidad de escritura
    }
  };

  setTimeout(typeWriter, delay); // Inicia la escritura después del retraso
}