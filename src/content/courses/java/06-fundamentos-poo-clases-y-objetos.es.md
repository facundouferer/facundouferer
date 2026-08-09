---
course: 'java'
slug: '06-fundamentos-poo-clases-y-objetos'
title: 'Fundamentos de POO: Clases, Objetos y Atributos'
description: 'Comprendé los conceptos de clase, objeto, estado, comportamiento e instanciación en Java.'
order: 6
lang: 'es'
published: true
---

# Fundamentos de POO: Clases, Objetos y Atributos

La **Programación Orientada a Objetos (POO)** se basa en el concepto de "objetos", los cuales contienen datos en forma de **atributos** (campos) y código en forma de **métodos** (comportamientos).

## 1. ¿Qué es una Clase y qué es un Objeto?

- **Clase**: Es el plano, plantilla o molde abstracto a partir del cual se crean objetos. Define los atributos y métodos comunes.
- **Objeto**: Es una instancia concreta en memoria creada a partir de una clase.

```java
public class Persona {
    String nombre;
    int edad;

    public void saludar() {
        System.out.println("Hola, mi nombre es " + nombre + " y tengo " + edad + " años.");
    }
}
```

## 2. Instanciación y Referencia `this`

```java
public class Main {
    public static void main(String[] args) {
        Persona p1 = new Persona();
        p1.nombre = "Laura";
        p1.edad = 28;
        p1.saludar();
    }
}
```

## 3. Ejercicio Práctico
Creá una clase `CuentaBancaria` con los atributos `titular` (String) y `saldo` (double), e instanciá dos objetos operando con ellos.
