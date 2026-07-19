---
title: 'Introducción a JavaScript'
course: 'javascript'
slug: 'introduccion'
order: 1
lang: 'es'
published: true
---

# ¿Qué es JavaScript?

JavaScript es el lenguaje de programación interpretado que da vida a la web. A diferencia de HTML (estructura) y CSS (diseño), JavaScript permite que las páginas sean interactivas y dinámicas.

## Un poco de historia
Nació en 1995, creado por Brendan Eich en apenas 10 días. Aunque empezó como un "juguete" para pequeños trucos, hoy es uno de los lenguajes más potentes y versátiles del mundo.

## ¿Qué significa "del lado del cliente"?
Cuando decimos que JS corre en el cliente, significa que se ejecuta directamente en el navegador de la persona que visita la web. Esto permite:
- Modificar la página en tiempo real.
- Validar formularios al instante.
- Crear efectos visuales y animaciones.
- Comunicarse con servidores sin recargar la página.

## ¿Y "del lado del servidor"?
Gracias a entornos como **Node.js**, JavaScript también puede usarse para crear el "cerebro" de las aplicaciones que maneja bases de datos y archivos.

## Ingresar o visualizar datos

Existen varias formas de interactuar con el usuario:

1. **`console.log()`**: Muestra mensajes en la consola del navegador (F12).
2. **`alert()`**: Muestra una ventana emergente de aviso.
3. **`prompt()`**: Abre un cuadro para que el usuario ingrese texto.
4. **`document.write()`**: Escribe contenido directamente en el cuerpo del HTML (usar con precaución).

### Ejemplo:
```javascript
const nombre = prompt("¿Cómo te llamás?");
console.log("Hola, " + nombre);
alert("Bienvenido a Programierds");
```