---
title: 'Programación Orientada a Objetos'
course: 'java'
slug: 'poo'
order: 8
lang: 'es'
published: true
---

# Programación Orientada a Objetos (POO)

La POO es un paradigma que organiza el código en "objetos" que contienen datos (atributos) y comportamientos (métodos).

## Los 4 Pilares de la POO

1. **Encapsulamiento:** Ocultar detalles internos y exponer solo lo necesario (usando `private` y `getters/setters`).
2. **Herencia:** Crear clases nuevas a partir de existentes (`extends`).
3. **Polimorfismo:** Capacidad de un objeto de actuar de diferentes formas.
4. **Abstracción:** Representar conceptos complejos de forma simplificada (clases abstractas e interfaces).

## Clases y Objetos

- **Clase:** El plano o molde (ej: la clase `Perro`).
- **Objeto:** La instancia real creada del molde (ej: `miPerro`).

```java
public class Perro {
    String nombre;
    
    public void ladrar() {
        System.out.println("¡Guau!");
    }
}

// Uso:
Perro miPerro = new Perro();
miPerro.nombre = "Firulais";
miPerro.ladrar();
```

## Modificadores de Acceso
- `public`: Accesible desde cualquier lugar.
- `private`: Solo accesible dentro de la misma clase.
- `protected`: Accesible en el mismo paquete y por subclases.
- `default`: Solo dentro del mismo paquete.

## Constructores
Métodos especiales que se ejecutan al crear el objeto (`new`). No tienen tipo de retorno y se llaman igual que la clase.

```java
public Persona(String nombre, int edad) {
    this.nombre = nombre;
    this.edad = edad;
}
```

## Wrappers
Clases que envuelven tipos primitivos para tratarlos como objetos (ej: `Integer` para `int`, `Double` para `double`). Son útiles para colecciones.