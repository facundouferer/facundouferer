---
course: 'java'
slug: '07-fundamentos-poo-clases-y-objetos'
title: 'Fundamentos de POO: Clases, Objetos y Atributos'
description: 'Dominá los pilares prácticos de la POO en Java: el concepto de clase como molde, instanciación con el operador new, estado, comportamiento y la referencia memoria this.'
order: 7
lang: 'es'
published: true
---

# Fundamentos de POO: Clases, Objetos y Atributos

La **Programación Orientada a Objetos (POO)** gira en torno a dos conceptos centrales que determinan la forma en que estructuramos el software en Java: **Clases** y **Objetos**.

Mientras que la programación procedimental se centra en escribir algoritmos que operan sobre variables sueltas, la POO nos permite construir el software modelando entes del mundo real o conceptos del dominio, combinando su **Estado** (datos) y su **Comportamiento** (funciones) en una sola estructura unificada.

 En esta lección comprenderás qué es una clase, cómo se instancian objetos en la memoria Heap, el papel del operador `new`, el uso de la referencia `this` y cómo interactúan las variables de referencia con la pila de memoria (Stack).

---

## 1. La Metáfora del Plano vs. La Edificación: Clase vs. Objeto

Para entender la diferencia entre una **Clase** y un **Objeto**, consideremos la metáfora de un arquitecto:

- **Clase (El Plano o Molde)**: Es la plantilla abstracta definida en el código fuente (`.java`). En ella declaramos qué características (**atributos**) tendrá cada elemento y qué acciones (**métodos**) podrá realizar. La clase en sí misma **no ocupa memoria de datos en el Heap** durante la ejecución.
- **Objeto (La Edificación concreta)**: Es la **instancia física** creada en memoria a partir del plano de la clase. Podemos construir múltiples casas (objetos) a partir del mismo plano, cada una con su propio color de pintura, número de dirección y estado particular.

![Anatomía de una Clase Java y Proceso de Instanciación en Memoria](/img/courses/java/java-class-anatomy-instantiation.jpg)

### Anatomía Interna de una Clase:
1. **Atributos / Campos (Estado)**: Variables que representan la información o datos que guarda un objeto.
2. **Métodos (Comportamiento)**: Funciones que definen las operaciones y lógica de negocio que el objeto puede ejecutar sobre su propio estado.

---

## 2. El Operador `new` y el Ciclo de Instanciación en Memoria

Para crear un objeto en Java a partir de una clase, utilizá la palabra reservada `new`.

```java
// Sintaxis de instanciación:
NombreClase variableReferencia = new NombreClase();
```

![Disposición de Memoria Stack y Heap para Clases y Objetos en Java](/img/courses/java/java-class-object-memory.jpg)

### ¿Qué sucede internamente cuando ejecutás `new`?

1. **Reserva de Memoria en el Heap**: La JVM calcula el tamaño requerido por todos los atributos de la clase y asigna un bloque de memoria en el **Heap**.
2. **Inicialización de Atributos con Valores por Defecto**:
   - `int`, `long`, `byte` $\rightarrow$ `0`
   - `double`, `float` $\rightarrow$ `0.0`
   - `boolean` $\rightarrow$ `false`
   - Referencias a objetos (`String`, etc.) $\rightarrow$ `null`
3. **Invocación del Constructor**: Se ejecuta el constructor de la clase para configurar el estado inicial del objeto.
4. **Asignación de Referencia**: El operador `new` devuelve la dirección de memoria de la nueva instancia en el Heap, la cual se almacena en la variable de referencia alojada en el **Stack**.

---

## 3. Ejemplo Práctico: Modelando una Clase `Persona`

Veamos cómo implementar una clase completa en Java y cómo instanciar múltiples objetos independientes en el método `main`:

```java
// Definición del molde (Clase Persona)
public class Persona {
    // 1. Atributos (Estado del objeto)
    public String nombre;
    public int edad;
    public double estatura;

    // 2. Métodos (Comportamiento del objeto)
    public void saludar() {
        System.out.println("Hola, mi nombre es " + nombre + " y tengo " + edad + " años.");
    }

    public void cumplirAnios() {
        edad++;
        System.out.println("¡Feliz cumpleaños " + nombre + "! Ahora tenés " + edad + " años.");
    }
}
```

### Instanciación y Uso en la Clase Principal:

```java
public class MainPersona {
    public static void main(String[] args) {
        // Instancia 1: Creamos el primer objeto en el Heap
        Persona p1 = new Persona();
        p1.nombre = "Laura";
        p1.edad = 28;
        p1.estatura = 1.68;

        // Instancia 2: Creamos un segundo objeto completamente independiente
        Persona p2 = new Persona();
        p2.nombre = "Carlos";
        p2.edad = 34;
        p2.estatura = 1.80;

        // Ejecución de comportamientos
        p1.saludar(); // Imprime: Hola, mi nombre es Laura y tengo 28 años.
        p2.saludar(); // Imprime: Hola, mi nombre es Carlos y tengo 34 años.

        p1.cumplirAnios(); // Modifica solo el estado interno de p1 (edad pasa a 29)
        System.out.println("Edad de p2 sigue siendo: " + p2.edad); // Permanece en 34
    }
}
```

---

## 4. La Palabra Reservada `this` y Sombreamiento de Variables

Dentro de cualquier método de instancia, la palabra reservada **`this`** es una referencia implícita al **objeto actual que está ejecutando el método**.

### Usos fundamentales de `this`:
1. **Resolver ambigüedades entre parámetros y atributos**: Ocurre cuando un parámetro del método se llama exactamente igual que un atributo de la clase (fenómeno conocido como *Variable Shadowing* o Sombreamiento de Variables).
2. **Pasar la instancia actual como argumento** a otros métodos.

```java
public class Estudiante {
    private String nombre; // Atributo de la clase
    private double notaFinal;

    // El parámetro 'nombre' tapa al atributo 'nombre'
    public void setDatos(String nombre, double notaFinal) {
        // this.nombre se refiere al atributo del objeto en el Heap
        // 'nombre' a la derecha se refiere al parámetro local en el Stack Frame
        this.nombre = nombre;
        this.notaFinal = notaFinal;
    }

    public void mostrarFicha() {
        System.out.println("Estudiante: " + this.nombre + " | Nota: " + this.notaFinal);
    }
}
```

---

## 5. Referencias vs. Copia de Objetos

Es fundamental comprender que una variable que guarda un objeto **no contiene los datos del objeto directamente**, sino una **dirección de memoria (referencia)** al Heap.

```java
Persona p1 = new Persona();
p1.nombre = "Ana";

// Copiamos la referencia, NO el objeto:
Persona p2 = p1;

// Modificar p2 ALTERA a p1 porque ambas variables apuntan al mismo objeto en el Heap
p2.nombre = "Ana María";

System.out.println(p1.nombre); // Imprime: "Ana María"
```

---

## 6. Ejercicio Práctico Guiado

### Desafío: Sistema de Gestión de Cuentas Bancarias
Escribí una clase Java llamada `CuentaBancaria.java` que posea:
1. Atributos: `titular` (String), `numeroCuenta` (String) y `saldo` (double).
2. Un método `depositar(double monto)` que incremente el saldo si el monto es positivo.
3. Un método `retirar(double monto)` que descuente el saldo solo si hay fondos suficientes y el monto es válido.
4. Un método `mostrarEstado()` que imprima los datos de la cuenta.

<details>
<summary>Ver solución sugerida</summary>

```java
public class CuentaBancaria {
    public String titular;
    public String numeroCuenta;
    public double saldo;

    public void depositar(double monto) {
        if (monto > 0) {
            this.saldo += monto;
            System.out.println(" Depósito exitoso de $" + monto + " en cuenta " + numeroCuenta);
        } else {
            System.out.println(" Error: El monto a depositar debe ser mayor a cero.");
        }
    }

    public void retirar(double monto) {
        if (monto > 0 && monto <= this.saldo) {
            this.saldo -= monto;
            System.out.println(" Retiro exitoso de $" + monto + ". Saldo restante: $" + this.saldo);
        } else {
            System.out.println(" Error: Fondos insuficientes o monto no válido para retiro.");
        }
    }

    public void mostrarEstado() {
        System.out.println("==========================================");
        System.out.println(" Titular: " + this.titular);
        System.out.println(" Cta N°:   " + this.numeroCuenta);
        System.out.println(" Saldo:    $" + this.saldo);
        System.out.println("==========================================");
    }

    public static void main(String[] args) {
        CuentaBancaria c1 = new CuentaBancaria();
        c1.titular = "Mariana Pérez";
        c1.numeroCuenta = "001-987654";
        c1.saldo = 5000.0;

        c1.mostrarEstado();
        c1.depositar(1500.0);
        c1.retirar(2000.0);
        c1.retirar(10000.0); // Intento de retiro que supera el saldo
        c1.mostrarEstado();
    }
}
```
</details>
