---
title: 'Clases y Herencia'
course: 'javascript'
slug: 'clases-y-herencia'
order: 9
lang: 'es'
published: true
---

# Clases en JavaScript

Las clases son "plantillas" para crear objetos que comparten la misma estructura y comportamiento.

## Definición de una Clase

```javascript
class Persona {
    constructor(nombre, edad) {
        this.nombre = nombre;
        this.edad = edad;
    }

    saludar() {
        console.log(`Hola, soy ${this.nombre}`);
    }
}

const p1 = new Persona("Juan", 30);
p1.saludar();
```

## Herencia

Permite crear una clase a partir de otra, heredando sus características y agregando o modificando lo que necesitemos. Se usa `extends`.

```javascript
class Estudiante extends Persona {
    constructor(nombre, edad, carrera) {
        super(nombre, edad); // Llama al constructor del padre
        this.carrera = carrera;
    }

    estudiar() {
        console.log(`${this.nombre} está estudiando ${this.carrera}`);
    }
}

const e1 = new Estudiante("Pedro", 20, "Ingeniería");
e1.saludar(); // Heredado
e1.estudiar(); // Propio
```

**Nota:** Por convención, los nombres de las clases siempre empiezan con **Mayúscula**.