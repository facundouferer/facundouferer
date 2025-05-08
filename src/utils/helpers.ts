export function typeWriterEffect(element: HTMLElement) {
  let index = 0;
  const speed = 20;
  const text = element.textContent || "";
  const delay = text.length * speed
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