---
title: 'Object-Oriented Programming'
course: 'java'
slug: 'poo'
order: 8
lang: 'en'
published: true
---

# Object-Oriented Programming (OOP)

OOP is a paradigm that organizes code into "objects" that contain data (attributes) and behaviors (methods).

## The 4 Pillars of OOP

1. **Encapsulation:** Hide internal details and expose only what's needed (using `private` and `getters/setters`).
2. **Inheritance:** Create new classes from existing ones (`extends`).
3. **Polymorphism:** The ability of an object to behave in different ways.
4. **Abstraction:** Represent complex concepts in a simplified way (abstract classes and interfaces).

## Classes and Objects

- **Class:** The blueprint or template (e.g., the `Perro` class).
- **Object:** The actual instance created from the template (e.g., `miPerro`).

```java
public class Perro {
    String nombre;
    
    public void ladrar() {
        System.out.println("¡Guau!");
    }
}

// Usage:
Perro miPerro = new Perro();
miPerro.nombre = "Firulais";
miPerro.ladrar();
```

## Access Modifiers
- `public`: Accessible from anywhere.
- `private`: Only accessible within the same class.
- `protected`: Accessible within the same package and by subclasses.
- `default`: Only within the same package.

## Constructors
Special methods that run when an object is created (`new`). They have no return type and are named the same as the class.

```java
public Persona(String nombre, int edad) {
    this.nombre = nombre;
    this.edad = edad;
}
```

## Wrappers
Classes that wrap primitive types to treat them as objects (e.g., `Integer` for `int`, `Double` for `double`). They are useful for collections.
