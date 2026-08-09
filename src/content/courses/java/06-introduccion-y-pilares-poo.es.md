---
course: 'java'
slug: '06-introduccion-y-pilares-poo'
title: 'Programación Orientada a Objetos y sus Pilares'
description: 'Comprendé qué es el paradigma de POO, sus ventajas frente a la programación estructurada y sus 4 pilares fundamentales explicados en Java.'
order: 6
lang: 'es'
published: true
---

# Programación Orientada a Objetos y sus Pilares

La **Programación Orientada a Objetos (POO)** es el paradigma dominante en la ingeniería de software moderna. En lugar de estructurar una aplicación alrededor de procedimientos o funciones sueltas que manipulan datos globales, la POO concibe un programa como un ecosistema de entidades independientes llamadas **Objetos**, los cuales agrupan datos (estado) y comportamiento (métodos).

En esta lección comprenderás la transición desde la programación estructurada hacia la POO y desglosaremos en detalle sus **4 pilares fundamentales** con diagramas y código Java.

---

## 1. ¿Qué es el Paradigma de POO?

En la programación estructurada u orientada a procedimientos, los datos y las funciones se tratan como entidades separadas. A medida que el software crece, las funciones terminan accediendo y modificando datos compartidos sin control, creando un **alto acoplamiento** y código frágil difícil de mantener.

En la **POO**, un programa se modela como una **red limpia de objetos encapsulados** que protegen su propio estado interno y se comunican enviándose mensajes (invocación de métodos).

![Comparación: Programación Estructurada vs Programación Orientada a Objetos](/img/courses/java/procedural-vs-oop.jpg)

### Diferencias Clave:

| Criterio | Programación Estructurada | Programación Orientada a Objetos (POO) |
| :--- | :--- | :--- |
| **Enfoque principal** | Funciones y algoritmos secuenciales | Objetos y responsabilidades delimitadas |
| **Manejo de datos** | Datos compartidos globalmente | Estado encapsulado en cada objeto |
| **Acoplamiento** | Alto acoplamiento (efectos secundarios colaterales) | Bajo acoplamiento y alta cohesión |
| **Mantenibilidad** | Compleja en sistemas medianos y grandes | Escalable mediante modularidad y reusabilidad |

---

## 2. Los 4 Pilares de la Programación Orientada a Objetos

Toda arquitectura orientada a objetos sólida en Java se sostiene sobre cuatro pilares fundamentales:

![Los 4 Pilares de la Programación Orientada a Objetos en Java](/img/courses/java/java-oop-four-pillars.jpg)

---

### Pilar 1: Abstracción
La **abstracción** consiste en modelar las características esenciales de una entidad del mundo real omitiendo los detalles de implementación irrelevantes para el dominio actual de la aplicación.

En Java, modelamos la abstracción identificando qué campos (atributos) y acciones (métodos) pertenecen a nuestro modelo:

```java
// Ejemplo de Abstracción en Java
public class Vehiculo {
    // Solo abstraemos los atributos necesarios para la gestión de flota
    private String patente;
    private String marca;
    private double velocidadActual;

    public void acelerar(double incremento) {
        this.velocidadActual += incremento;
    }
}
```

---

### Pilar 2: Encapsulamiento
El **encapsulamiento** consiste en proteger y ocultar el estado interno de un objeto. Ningún componente externo debe ser capaz de modificar los datos de un objeto de forma arbitraria; solo pueden hacerlo a través de una **interfaz pública controlada** (`getters` y `setters` con validaciones).

```java
// Ejemplo de Encapsulamiento en Java
public class CuentaBancaria {
    // Atributo privado: Nadie puede alterar el saldo directamente desde afuera
    private double saldo;

    public CuentaBancaria(double saldoInicial) {
        if (saldoInicial >= 0) {
            this.saldo = saldoInicial;
        }
    }

    // El saldo solo se modifica aplicando reglas de negocio estrictas
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
La **herencia** permite que una clase derivada (**subclase**) adquiera las propiedades y métodos de una clase base (**superclase**), promoviendo la reutilización de código y estableciendo una relación jerárquica del tipo *"es un"*.

En Java se implementa con la palabra clave `extends`:

```java
// Superclase (Clase Base)
public class Animal {
    protected String nombre;

    public Animal(String nombre) {
        this.nombre = nombre;
    }

    public void hacerSonido() {
        System.out.println("El animal emite un sonido indeterminado.");
    }
}

// Subclase (Hereda de Animal)
public class Perro extends Animal {
    public Perro(String nombre) {
        super(nombre); // Llama al constructor de la superclase
    }

    @Override
    public void hacerSonido() {
        System.out.println(nombre + " dice: ¡Guau, guau!");
    }
}
```

---

### Pilar 4: Polimorfismo
El **polimorfismo** (*"múltiples formas"*) es la capacidad de tratar a objetos de distintas subclases como si fueran de su superclase o interfaz común. En tiempo de ejecución, la JVM invoca dinámicamente la implementación correspondiente al objeto real en memoria (**despacho dinámico de métodos**).

```java
public class MainPolimorfismo {
    public static void main(String[] args) {
        // Colección de la superclase Animal que contiene subclases diversas
        Animal[] animales = new Animal[2];
        animales[0] = new Perro("Firulais");
        animales[1] = new Gato("Michi");

        // Polimorfismo: Cada objeto responde con su comportamiento propio
        for (Animal a : animales) {
            a.hacerSonido();
        }
    }
}
```

---

## 3. Ejercicio Práctico Guiado

### Desafío: Modelado de Dispositivos Electrónicos
Diseñá una clase Java llamada `Celular.java` aplicando **Abstracción** y **Encapsulamiento**:
1. Atributos privados: `marca`, `modelo`, `porcentajeBateria` (entero de 0 a 100).
2. Método `usarApp(int minutos)` que consuma 1% de batería por cada 5 minutos de uso.
3. Método `cargarBateria(int cantidad)` que aumente el porcentaje sin superar el 100%.

<details>
<summary>Ver solución sugerida</summary>

```java
public class Celular {
    private String marca;
    private String modelo;
    private int porcentajeBateria;

    public Celular(String marca, String modelo, int bateriaInicial) {
        this.marca = marca;
        this.modelo = modelo;
        this.porcentajeBateria = Math.min(100, Math.max(0, bateriaInicial));
    }

    public void usarApp(int minutos) {
        int consumo = minutos / 5;
        this.porcentajeBateria = Math.max(0, this.porcentajeBateria - consumo);
        System.out.println("Usaste " + minutos + " mins. Batería restante: " + this.porcentajeBateria + "%");
    }

    public void cargarBateria(int cantidad) {
        if (cantidad > 0) {
            this.porcentajeBateria = Math.min(100, this.porcentajeBateria + cantidad);
            System.out.println("Batería cargada al: " + this.porcentajeBateria + "%");
        }
    }

    public int getPorcentajeBateria() {
        return porcentajeBateria;
    }
}
```
</details>
