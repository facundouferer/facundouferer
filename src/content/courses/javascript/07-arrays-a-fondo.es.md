---
title: 'Arrays a Fondo'
course: 'javascript'
slug: 'arrays-a-fondo'
order: 7
lang: 'es'
published: true
---

# Arrays (Arreglos)

Un Array es un objeto que permite almacenar múltiples valores en una sola variable. Los índices empiezan en `0`.

## Operaciones Básicas

```javascript
const frutas = ["Manzana", "Banana"];

frutas.push("Naranja"); // Agrega al final
frutas.pop(); // Elimina el último
frutas.unshift("Pera"); // Agrega al principio
frutas.shift(); // Elimina el primero

console.log(frutas.length); // Tamaño del array
```

## Modificación y Copia
- **`slice(inicio, fin)`**: Crea una copia de una parte del array sin modificar el original.
- **`splice(inicio, cantidad, item1...)`**: Cambia el contenido eliminando, reemplazando o agregando elementos. **Modifica el original**.

## Métodos Modernos (Orden Superior)

Son los más potentes para trabajar con datos:

- **`map()`**: Transforma cada elemento y devuelve un nuevo array.
- **`filter()`**: Crea un nuevo array con elementos que cumplan una condición.
- **`reduce()`**: Reduce el array a un único valor (ej: sumar todo).
- **`forEach()`**: Ejecuta una función para cada elemento.
- **`join()`**: Une todos los elementos en una cadena de texto.
- **`includes()`**: Verifica si un valor existe en el array.

### Ejemplo:
```javascript
const numeros = [1, 2, 3, 4, 5];
const pares = numeros.filter(n => n % 2 === 0); // [2, 4]
const dobles = numeros.map(n => n * 2); // [2, 4, 6, 8, 10]
```