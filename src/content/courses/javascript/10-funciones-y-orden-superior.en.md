---
title: 'Functions and Higher-Order Functions'
course: 'javascript'
slug: 'funciones-y-orden-superior'
order: 10
lang: 'en'
published: true
---

# Advanced Functions

## Declaration vs. Expression (Arrow)

There are two main ways to write functions:

```javascript
// Traditional function (Old syntax)
function sumar(a, b) {
    return a + b;
}

// Arrow Function (Modern syntax - ES6)
const sumar = (a, b) => a + b;
```

**Advantages of Arrow Functions:**
- Shorter and cleaner syntax.
- Implicit return if it's a single line.
- They don't create their own `this` context (they inherit it from the parent).

## Higher-Order Functions

These are functions that can receive other functions as arguments or return them. This enables much more modular code.

### `setTimeout()`
Executes a function after a specified time (in milliseconds).

```javascript
setTimeout(() => {
    console.log("1 second passed");
}, 1000);
```

### Map, Filter and Reduce
As we saw in the Arrays section, these methods are the heart of functional programming in JavaScript because they operate using other functions (callbacks).
