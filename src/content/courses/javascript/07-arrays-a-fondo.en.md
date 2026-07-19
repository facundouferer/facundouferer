---
title: 'Arrays in Depth'
course: 'javascript'
slug: 'arrays-a-fondo'
order: 7
lang: 'en'
published: true
---

# Arrays

An Array is an object that allows you to store multiple values in a single variable. Indices start at `0`.

## Basic Operations

```javascript
const frutas = ["Manzana", "Banana"];

frutas.push("Naranja"); // Adds to the end
frutas.pop(); // Removes the last
frutas.unshift("Pera"); // Adds to the beginning
frutas.shift(); // Removes the first

console.log(frutas.length); // Array size
```

## Modification and Copy
- **`slice(start, end)`**: Creates a copy of a portion of the array without modifying the original.
- **`splice(start, deleteCount, item1...)`**: Changes the content by removing, replacing, or adding elements. **Modifies the original**.

## Modern Methods (Higher-Order)

These are the most powerful for working with data:

- **`map()`**: Transforms each element and returns a new array.
- **`filter()`**: Creates a new array with elements that meet a condition.
- **`reduce()`**: Reduces the array to a single value (e.g., sum everything).
- **`forEach()`**: Executes a function for each element.
- **`join()`**: Joins all elements into a text string.
- **`includes()`**: Checks if a value exists in the array.

### Example:
```javascript
const numeros = [1, 2, 3, 4, 5];
const pares = numeros.filter(n => n % 2 === 0); // [2, 4]
const dobles = numeros.map(n => n * 2); // [2, 4, 6, 8, 10]
```
