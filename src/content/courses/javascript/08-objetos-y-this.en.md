---
title: "Objects and the 'this' Keyword"
course: 'javascript'
slug: 'objetos-y-this'
order: 8
lang: 'en'
published: true
---

# Objects in JavaScript

An object is a collection of properties (key and value). It is the foundation of almost everything in JavaScript.

## Create and Access

```javascript
const persona = {
    nombre: "Juan",
    edad: 30,
    saludar: function() {
        console.log("Hello!");
    }
};

// Dot notation (Standard)
console.log(persona.nombre);

// Bracket notation (For dynamic names or with spaces)
console.log(persona["edad"]);
```

## Manipulation
- **Add:** `persona.trabajo = "Dev";`
- **Delete:** `delete persona.edad;`
- **Check:** `"nombre" in persona; // true`

## The concept of `this`

The reserved word `this` refers to the **current object** in which the code is being executed. Its value changes depending on how the function is called.

```javascript
const usuario = {
    nombre: "Facu",
    presentarse() {
        console.log(`Hi, I'm ${this.nombre}`);
    }
};

usuario.presentarse(); // "Hi, I'm Facu"
```

Inside an object method, `this` lets us access the other properties of that same object.
