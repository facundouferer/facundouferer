---
course: 'java'
slug: '07-constructores-y-encapsulamiento'
title: 'Constructores, Modificadores de Acceso y Getters/Setters'
description: 'Aprendé a inicializar objetos con constructores y a proteger el estado interno con encapsulamiento.'
order: 7
lang: 'es'
published: true
---

# Constructores, Modificadores de Acceso y Getters/Setters

Para construir software seguro y mantenible, el estado interno de un objeto debe protegerse contra modificaciones no autorizadas mediante **Encapsulamiento**.

## 1. Constructores en Java
Un **constructor** se ejecuta al instanciar un objeto con `new`.

```java
public class Producto {
    private String nombre;
    private double precio;

    public Producto(String nombre, double precio) {
        this.nombre = nombre;
        setPrecio(precio);
    }

    public String getNombre() { return nombre; }
    public void setPrecio(double precio) {
        if (precio >= 0) this.precio = precio;
    }
}
```

## 2. Modificadores de Acceso
`public`, `protected`, package-private (default), `private`.

## 3. Ejercicio Práctico
Creá la clase `Estudiante` con atributos privados `nombre` y `promedio`, asegurando que `promedio` se mantenga entre 0.0 y 10.0.
