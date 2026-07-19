---
title: 'DOM and Events'
course: 'javascript'
slug: 'dom-y-eventos'
order: 11
lang: 'en'
published: true
---

# El DOM y Eventos

El DOM (Document Object Model) es el árbol de objetos que representa tu página HTML. JavaScript lo usa para interactuar con lo que el usuario ve.

## Modificar el DOM

Podés seleccionar elementos por ID, clase o etiqueta y cambiar sus propiedades:

```javascript
const titulo = document.getElementById("titulo");
titulo.innerText = "¡Cambiado por JS!";
titulo.style.color = "green";

const nuevoDiv = document.createElement("div");
document.body.appendChild(nuevoDiv);
```

## Eventos: La respuesta a la interacción

Un evento es una acción que ocurre en el navegador (un click, una tecla presionada, el envío de un formulario).

### Cómo escuchar eventos
La forma moderna y recomendada es `addEventListener`:

```javascript
const boton = document.querySelector("button");
boton.addEventListener("click", (event) => {
    console.log("Hiciste click en:", event.target);
});
```

### Tipos de Eventos comunes

1. **Mouse:** `click`, `mouseover`, `mouseout`, `mousedown`, `mouseup`.
2. **Teclado:** `keydown`, `keyup`, `keypress`.
3. **Formularios:**
   - `change`: Cuando el valor cambia y se pierde el foco.
   - `input`: Mientras el usuario escribe (en tiempo real).
   - `submit`: Al enviar el formulario (usar `event.preventDefault()` para evitar que la página se recargue).

### Ejemplo de Input en tiempo real:
```javascript
const input = document.getElementById("nombre");
input.addEventListener("input", (e) => {
    console.log("Escribiendo:", e.target.value);
});
```
