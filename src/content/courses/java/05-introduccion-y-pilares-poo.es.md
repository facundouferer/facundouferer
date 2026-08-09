---
course: 'java'
slug: '05-introduccion-y-pilares-poo'
title: 'Programación Orientada a Objetos y sus Pilares'
description: 'Comprendé qué es el paradigma de POO, sus ventajas frente a la programación estructurada y sus 4 pilares fundamentales explicados en Java.'
order: 5
lang: 'es'
published: true
---

# Programación Orientada a Objetos y sus Pilares

La **Programación Orientada a Objetos (POO)** es un paradigma de diseño de software que modela el mundo real agrupando datos y comportamientos en entidades llamadas **Objetos**. Java es un lenguaje diseñado desde sus cimientos para aplicar la POO de forma nativa.

## 1. ¿Qué es el Paradigma de POO?

En la programación estructurada u orientada a procedimientos, los datos y las funciones se tratan como entidades separadas. Esto genera problemas de mantenimiento y acoplamiento a medida que el sistema crece.

En la **POO**, un programa se concibe como una **red de objetos independientes** que se comunican entre sí mediante el envío de mensajes (invocación de métodos).

### Programación Estructurada vs. Orientada a Objetos:
- **Estructurada**: `funciones(datos_globales)` ──> Alto riesgo de modificar datos accidentalmente.
- **POO**: `objeto.ejecutarComportamiento()` ──> El objeto protege su propio estado interno.

```
       ┌──────────────────────────────────────────┐
       │                 OBJETO                   │
       │  ┌────────────────────────────────────┐  │
       │  │ Estado (Atributos/Campos de datos) │  │
       │  └────────────────────────────────────┘  │
       │  ┌────────────────────────────────────┐  │
       │  │ Comportamiento (Métodos/Funciones) │  │
       │  └────────────────────────────────────┘  │
       └──────────────────────────────────────────┘
```

## 2. Los 4 Pilares de la Programación Orientada a Objetos

Toda arquitectura POO profesional se sostiene sobre cuatro pilares fundamentales:

---

### Pilar 1: Abstracción
La **abstracción** consiste en identificar las características esenciales de una entidad del mundo real e ignorar los detalles irrelevantes para el problema actual.

En Java, modelamos la abstracción definiendo qué datos y acciones son relevantes para nuestro sistema mediante clases e interfaces.

```java
// Ejemplo de Abstracción en Java
public class Auto {
    // Solo abstraemos los atributos relevantes para un sistema de transito
    private String patente;
    private String modelo;
    private double velocidadActual;

    public void acelerar(double incremento) {
        this.velocidadActual += incremento;
    }
}
```

---

### Pilar 2: Encapsulamiento
El **encapsulamiento** consiste en ocultar la estructura interna de los datos de un objeto y restringir el acceso directo desde el exterior, exponiendo únicamente los métodos necesarios para interactuar con él.

En Java se implementa combinando los modificadores de acceso (`private`, `public`, etc.) con métodos `getters` y `setters`.

```java
// Ejemplo de Encapsulamiento en Java
public class CuentaBancaria {
    // Atributo privado: NINGUNA otra clase puede modificar el saldo directamente
    private double saldo;

    public CuentaBancaria(double saldoInicial) {
        if (saldoInicial >= 0) {
            this.saldo = saldoInicial;
        }
    }

    // El saldo solo se altera mediante reglas de negocio validadas
    public void depositar(double monto) {
        if (monto > 0) {
            this.saldo += monto;
        }
    }

    public double getSaldo() {
        return this.saldo;
    }
}
```

---

### Pilar 3: Herencia
La **herencia** permite crear una nueva clase (subclase) a partir de una clase existente (superclase), reutilizando su estado y comportamiento y agregando o modificando funcionalidades específicas.

En Java se utiliza la palabra reservada `extends`.

```java
// Clase Base (Superclase)
public class Animal {
    protected String nombre;

    public Animal(String nombre) {
        this.nombre = nombre;
    }

    public void hacerSonido() {
        System.out.println("El animal emite un sonido indeterminado.");
    }
}

// Clase Derivada (Subclase hereda de Animal)
public class Perro extends Animal {
    public Perro(String nombre) {
        super(nombre); // Llama al constructor de Animal
    }

    @Override
    public void hacerSonido() {
        System.out.println(nombre + " dice: ¡Guau, guau!");
    }
}
```

---

### Pilar 4: Polimorfismo
El **polimorfismo** ("múltiples formas") es la capacidad de tratar a objetos de distintas clases derivadas como si fueran instancias de una clase base o interfaz común, ejecutando la respuesta adecuada en tiempo de ejecución.

```java
// Ejemplo de Polimorfismo en Java
public class Main {
    public static void main(String[] args) {
        // Una lista de la superclase Animal contiene instancias de distintas subclases
        Animal[] granja = new Animal[2];
        granja[0] = new Perro("Firulais");
        granja[1] = new Gato("Michi");

        // Polimorfismo: Cada objeto responde segun su propia implementacion
        for (Animal a : granja) {
            a.hacerSonido();
        }
    }
}
```

---

## 3. Ejercicio Práctico
Identificá un elemento del mundo real (por ejemplo, una `Computadora` o un `Celular`) y escribí un resumen en código Java donde apliques Abstracción (atributos principales) y Encapsulamiento (atributo `bateria` privado con métodos de carga y uso).
