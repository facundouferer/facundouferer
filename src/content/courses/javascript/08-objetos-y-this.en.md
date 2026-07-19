---
title: "Objects and the 'this' Keyword"
course: 'javascript'
slug: 'objetos-y-this'
order: 8
lang: 'en'
published: true
---

# Objetos en JavaScript

Un objeto es una colección de propiedades (clave y valor). Es la base de casi todo en JavaScript.

## Crear y Acceder

```javascript
const persona = {
    nombre: "Juan",
    edad: 30,
    saludar: function() {
        console.log("Hola!");
    }
};

// Notación de punto (Estándar)
console.log(persona.nombre);

// Notación de corchetes (Para nombres dinámicos o con espacios)
console.log(persona["edad"]);
```

## Manipulación
- **Agregar:** `persona.trabajo = "Dev";`
- **Eliminar:** `delete persona.edad;`
- **Verificar:** `"nombre" in persona; // true`

## El concepto de `this`

La palabra reservada `this` hace referencia al **objeto actual** en el que se está ejecutando el código. Su valor cambia según cómo se llame a la función.

```javascript
const usuario = {
    nombre: "Facu",
    presentarse() {
        console.log(`Hola, soy ${this.nombre}`);
    }
};

usuario.presentarse(); // "Hola, soy Facu"
```

Dentro de un método de un objeto, `this` nos permite acceder a las otras propiedades de ese mismo objeto.
