---
title: 'Variables and Comments'
course: 'javascript'
slug: 'variables-y-comentarios'
order: 2
lang: 'en'
published: true
---

# Variables, Constants and Comments

## Comments
Comments are notes we leave in the code for ourselves or other developers. They are not executed.

- **Single line:** Use `//`.
- **Block (multiple lines):** Use `/* ... */`.

```javascript
// This is a single-line comment
/*
   This is a comment
   that spans multiple lines
*/
```

## Variable Declaration

JavaScript has three keywords to create data containers:

1. **`var`**: Old way. Has function scope and can cause confusion (avoid using it).
2. **`let`**: Modern way. Allows reassigning values and has block scope.
3. **`const`**: For values that won't change. Once assigned, it cannot be modified.

### Scope
Scope is where a variable lives and is accessible.
- **Global:** Outside any function or block.
- **Local / Block:** Inside `{ }`, like in an `if` or a function.

```javascript
if (true) {
    let mensaje = "Hola"; // Only lives inside this block
    var saludo = "Buen día"; // Leaks out of the block (var problem)
}
console.log(saludo); // Works
console.log(mensaje); // Error! ReferenceError
```

**Golden rule:** Use `const` by default. If you need to change the value later, use `let`.
