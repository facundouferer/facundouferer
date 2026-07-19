---
title: 'Loops and Iterators'
course: 'javascript'
slug: 'bucles-e-iteradores'
order: 6
lang: 'en'
published: true
---

# Loops and Iterators

Loops allow you to repeat a block of code while a condition is met or to traverse data sets.

## `for` Loop
Use it when you know exactly how many times you want to repeat something.

```javascript
for (let i = 0; i < 5; i++) {
    console.log("Number: " + i);
}
```

## `while` Loop
Repeats while the condition is true. Ideal if you don't know how many iterations it will take.

```javascript
let contador = 0;
while (contador < 5) {
    console.log(contador);
    contador++;
}
```

## `do...while` Loop
Similar to `while`, but guarantees the code runs **at least once**, since the condition is evaluated at the end.

```javascript
let i = 1;
do {
    console.log(i);
    i++;
} while (i <= 5);
```

## `for...in` Loop
Specifically for traversing the properties of an **object**.

```javascript
const persona = { nombre: "Facu", edad: 30 };
for (let clave in persona) {
    console.log(`${clave}: ${persona[clave]}`);
}
```

## Loop Control
- **`break`**: Exits the loop immediately.
- **`continue`**: Skips to the next iteration of the loop, ignoring the rest of the current one.
