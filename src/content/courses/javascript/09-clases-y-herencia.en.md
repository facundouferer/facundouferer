---
title: 'Classes and Inheritance'
course: 'javascript'
slug: 'clases-y-herencia'
order: 9
lang: 'en'
published: true
---

# Classes in JavaScript

Classes are "templates" for creating objects that share the same structure and behavior.

## Defining a Class

```javascript
class Persona {
    constructor(nombre, edad) {
        this.nombre = nombre;
        this.edad = edad;
    }

    saludar() {
        console.log(`Hi, I'm ${this.nombre}`);
    }
}

const p1 = new Persona("Juan", 30);
p1.saludar();
```

## Inheritance

It allows creating a class from another one, inheriting its characteristics and adding or modifying what we need. Use `extends`.

```javascript
class Estudiante extends Persona {
    constructor(nombre, edad, carrera) {
        super(nombre, edad); // Calls the parent constructor
        this.carrera = carrera;
    }

    estudiar() {
        console.log(`${this.nombre} is studying ${this.carrera}`);
    }
}

const e1 = new Estudiante("Pedro", 20, "Engineering");
e1.saludar(); // Inherited
e1.estudiar(); // Own
```

**Note:** By convention, class names always start with a **capital letter**.
