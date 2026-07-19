---
title: 'Funciones y Orden Superior'
course: 'javascript'
slug: 'funciones-y-orden-superior'
order: 10
lang: 'es'
published: true
---

# Funciones Avanzadas

## Declaración vs. Expresión (Arrow)

Existen dos formas principales de escribir funciones:

```javascript
// Función tradicional (Sintaxis antigua)
function sumar(a, b) {
    return a + b;
}

// Arrow Function (Sintaxis moderna - ES6)
const sumar = (a, b) => a + b;
```

**Ventajas de las Arrow Functions:**
- Sintaxis más corta y limpia.
- El retorno es implícito si es una sola línea.
- No crean su propio contexto de `this` (lo heredan del padre).

## Funciones de Orden Superior

Son funciones que pueden recibir otras funciones como argumentos o devolverlas. Esto permite un código mucho más modular.

### `setTimeout()`
Ejecuta una función después de un tiempo determinado (en milisegundos).

```javascript
setTimeout(() => {
    console.log("Pasó 1 segundo");
}, 1000);
```

### Map, Filter y Reduce
Como vimos en la sección de Arrays, estos métodos son el corazón de la programación funcional en JavaScript ya que operan usando otras funciones (callbacks).