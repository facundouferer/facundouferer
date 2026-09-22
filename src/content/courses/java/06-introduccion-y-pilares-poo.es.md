---
course: 'java'
slug: '06-introduccion-y-pilares-poo'
title: 'Programación Orientada a Objetos y sus Pilares'
description: 'Comprendé qué es el paradigma de POO, sus ventajas frente a la programación estructurada y sus 4 pilares fundamentales explicados en Java.'
order: 7
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

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="comparison-title-es comparison-desc-es" xmlns="http://www.w3.org/2000/svg">
  <title id="comparison-title-es">Programación estructurada / Programación orientada a objetos</title>
  <desc id="comparison-desc-es">De funciones que comparten datos a objetos que reúnen estado y comportamiento bajo una responsabilidad.</desc>
  <rect x="8" y="8" width="344" height="324" rx="28" fill="var(--color-accent-100)" />
  <rect x="368" y="8" width="344" height="324" rx="28" fill="var(--color-accent-2-100)" />
  <text x="28" y="45" font-family="var(--font-heading)" font-size="19" fill="var(--color-accent-900)">Programación estructurada</text>
  <text x="388" y="45" font-family="var(--font-heading)" font-size="17" fill="var(--color-accent-2-900)">Programación orientada a objetos</text>
  <rect x="95" y="136" width="170" height="72" rx="18" fill="var(--color-surface)" stroke="var(--color-accent-700)" stroke-width="2" />
  <text x="180" y="177" text-anchor="middle" font-size="17" font-weight="700" fill="var(--color-text)">Datos compartidos</text>
  <rect x="40" y="71" width="120" height="46" rx="23" fill="var(--color-accent-300)" />
  <rect x="200" y="71" width="120" height="46" rx="23" fill="var(--color-accent-300)" />
  <text x="100" y="99" text-anchor="middle" font-size="15" fill="var(--color-accent-900)">Función A</text>
  <text x="260" y="99" text-anchor="middle" font-size="15" fill="var(--color-accent-900)">Función B</text>
  <path d="M100 117 L145 136 M260 117 L215 136" stroke="var(--color-accent-700)" stroke-width="3" stroke-linecap="round" />
  <text x="180" y="256" text-anchor="middle" font-size="13" fill="var(--color-accent-900)">Ambas funciones alteran los mismos datos</text>
  <rect x="423" y="80" width="234" height="177" rx="28" fill="var(--color-surface)" stroke="var(--color-accent-2-700)" stroke-width="3" />
  <text x="540" y="113" text-anchor="middle" font-family="var(--font-heading)" font-size="21" fill="var(--color-accent-2-900)">Objeto</text>
  <rect x="447" y="130" width="186" height="40" rx="20" fill="var(--color-accent-2-200)" />
  <rect x="447" y="180" width="186" height="40" rx="20" fill="var(--color-accent-2-200)" />
  <text x="540" y="156" text-anchor="middle" font-size="15" fill="var(--color-accent-2-900)">Estado protegido</text>
  <text x="540" y="206" text-anchor="middle" font-size="15" fill="var(--color-accent-2-900)">Comportamiento</text>
  <text x="540" y="290" text-anchor="middle" font-size="14" fill="var(--color-accent-2-900)">Interfaz pública</text>
</svg>
<figcaption>De funciones que comparten datos a objetos que reúnen estado y comportamiento bajo una responsabilidad.</figcaption>
</figure>

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

<figure class="diagram">
<svg viewBox="0 0 720 340" role="img" aria-labelledby="pillars-title-es pillars-desc-es" xmlns="http://www.w3.org/2000/svg">
  <title id="pillars-title-es">Cuatro pilares, una idea: modelar responsabilidades con límites claros.</title>
  <desc id="pillars-desc-es">Los cuatro pilares describen cómo modelar, proteger, especializar y variar el comportamiento.</desc>
  <rect x="8" y="8" width="704" height="324" rx="28" fill="var(--color-neutral-100)" />
  <path d="M360 51 V75 M185 75 H535 M185 75 V94 M535 75 V94" fill="none" stroke="var(--color-accent-700)" stroke-width="3" stroke-linecap="round" />
  <circle cx="360" cy="41" r="21" fill="var(--color-accent-300)" />
  <text x="360" y="47" text-anchor="middle" font-size="17" font-weight="700" fill="var(--color-accent-900)">POO</text>
  <rect x="36" y="94" width="310" height="92" rx="24" fill="var(--color-accent-100)" />
  <rect x="374" y="94" width="310" height="92" rx="24" fill="var(--color-accent-2-100)" />
  <rect x="36" y="204" width="310" height="92" rx="24" fill="var(--color-accent-2-100)" />
  <rect x="374" y="204" width="310" height="92" rx="24" fill="var(--color-accent-100)" />
  <circle cx="76" cy="140" r="22" fill="var(--color-accent-300)" />
  <circle cx="414" cy="140" r="22" fill="var(--color-accent-2-300)" />
  <circle cx="76" cy="250" r="22" fill="var(--color-accent-2-300)" />
  <circle cx="414" cy="250" r="22" fill="var(--color-accent-300)" />
  <text x="76" y="146" text-anchor="middle" font-size="17" font-weight="700" fill="var(--color-text)">1</text>
  <text x="414" y="146" text-anchor="middle" font-size="17" font-weight="700" fill="var(--color-text)">2</text>
  <text x="76" y="256" text-anchor="middle" font-size="17" font-weight="700" fill="var(--color-text)">3</text>
  <text x="414" y="256" text-anchor="middle" font-size="17" font-weight="700" fill="var(--color-text)">4</text>
  <text x="111" y="134" font-family="var(--font-heading)" font-size="19" fill="var(--color-accent-900)">Abstracción</text>
  <text x="449" y="134" font-family="var(--font-heading)" font-size="19" fill="var(--color-accent-2-900)">Encapsulamiento</text>
  <text x="111" y="244" font-family="var(--font-heading)" font-size="19" fill="var(--color-accent-2-900)">Herencia</text>
  <text x="449" y="244" font-family="var(--font-heading)" font-size="19" fill="var(--color-accent-900)">Polimorfismo</text>
  <text x="111" y="162" font-size="14" fill="var(--color-text)">Elegir lo esencial</text>
  <text x="449" y="162" font-size="14" fill="var(--color-text)">Proteger el estado</text>
  <text x="111" y="272" font-size="14" fill="var(--color-text)">Especializar una clase</text>
  <text x="449" y="272" font-size="14" fill="var(--color-text)">Una interfaz, varias respuestas</text>
</svg>
<figcaption>Los cuatro pilares describen cómo modelar, proteger, especializar y variar el comportamiento.</figcaption>
</figure>

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
