---
title: 'Loops and Iterators'
course: 'javascript'
slug: 'bucles-e-iteradores'
order: 6
lang: 'en'
published: true
---

# Bucles e Iteradores

Los bucles permiten repetir un bloque de código mientras se cumpla una condición o para recorrer conjuntos de datos.

## Bucle `for`
Se usa cuando sabés exactamente cuántas veces querés repetir algo.

```javascript
for (let i = 0; i < 5; i++) {
    console.log("Número: " + i);
}
```

## Bucle `while`
Repite mientras la condición sea verdadera. Ideal si no sabés cuántas vueltas dará.

```javascript
let contador = 0;
while (contador < 5) {
    console.log(contador);
    contador++;
}
```

## Bucle `do...while`
Similar al `while`, pero garantiza que el código se ejecute **al menos una vez**, ya que la condición se evalúa al final.

```javascript
let i = 1;
do {
    console.log(i);
    i++;
} while (i <= 5);
```

## Bucle `for...in`
Especial para recorrer las propiedades de un **objeto**.

```javascript
const persona = { nombre: "Facu", edad: 30 };
for (let clave in persona) {
    console.log(`${clave}: ${persona[clave]}`);
}
```

## Control de Bucles
- **`break`**: Corta el bucle inmediatamente.
- **`continue`**: Salta a la siguiente vuelta del bucle ignorando lo que queda de la actual.
