---
course: 'java'
slug: '02-variables-tipos-datos-y-operadores'
title: 'Variables, Tipos de Datos y Operadores'
description: 'Dominá los tipos primitivos, tipos por referencia, conversión de tipos (casting) y operadores en Java.'
order: 3
lang: 'es'
published: true
---

# Variables, Tipos de Datos y Operadores

En Java, cada dato tiene un tipo claramente definido. Java es un lenguaje **estáticamente tipado**, lo que significa que el tipo de cada variable debe ser declarado explícitamente y no puede cambiar durante la ejecución.

## 1. Declaración de Variables y Constantes

Una variable es un espacio reservado en memoria para almacenar información.

```java
// Declaración e inicialización
int edad = 25;
double precio = 99.99;
boolean esEstudiante = true;
char inicial = 'F';

// Constante (no se puede modificar su valor después de asignarlo)
final double PI = 3.14159;
```

## 2. Ámbito, visibilidad y tiempo de vida

El **ámbito** (*scope*) es la región del código donde un nombre puede utilizarse. La **visibilidad** responde desde qué líneas se puede acceder a ese nombre; el **tiempo de vida** indica durante cuánto tiempo existe su valor durante la ejecución. Son conceptos relacionados, pero no idénticos.

Java usa ámbitos léxicos definidos por clases, métodos y bloques `{ }`. **No existen variables globales libres en Java**: todo dato declarado fuera de un método pertenece a una clase o a una instancia de esa clase.

| Categoría | Declaración | Visibilidad | Tiempo de vida | Inicialización |
| :--- | :--- | :--- | :--- | :--- |
| **Variable local** | Dentro de un método | Desde su declaración hasta el final del bloque | Durante esa invocación y bloque | No recibe valor predeterminado; exige asignación definida. |
| **Variable de ámbito de bloque** | Dentro de `if`, `for`, `while` o un bloque explícito | Solo dentro de ese bloque | Hasta que finaliza el bloque | Igual que cualquier variable local. |
| **Parámetro** | En la firma de un método o constructor | En todo el cuerpo de ese método | Durante la invocación | Recibe el valor del argumento. |
| **Campo de instancia** | En la clase, sin `static` | Según su modificador de acceso | Mientras el objeto sea alcanzable | Recibe un valor predeterminado si no se asigna. |
| **Campo de clase** | En la clase, con `static` | Según su modificador de acceso | Desde que se carga la clase | Recibe un valor predeterminado si no se asigna. |

Los campos numéricos reciben `0`, los booleanos `false` y las referencias `null`. Eso no significa que esos valores sean válidos para el dominio: un constructor debería establecer explícitamente el estado requerido.

### Ejemplo completo y sombreado

```java
public final class Cuenta {
    private static int totalCuentas = 0; // Campo de clase
    private int saldo;                   // Campo de instancia

    public Cuenta(int saldo) {           // Parámetro
        if (saldo < 0) {
            throw new IllegalArgumentException("saldo no puede ser negativo");
        }
        this.saldo = saldo;              // this.saldo distingue el campo
        totalCuentas++;
    }

    public void acreditar(int monto) {
        if (monto <= 0) {
            throw new IllegalArgumentException("monto debe ser positivo");
        }
        int saldoAnterior = saldo;       // Variable local
        saldo += monto;

        if (saldo < saldoAnterior) {
            throw new ArithmeticException("desbordamiento de saldo");
        }
    }
}
```

El parámetro `saldo` **sombrea** (*shadowing*) al campo con el mismo nombre. `this.saldo` selecciona explícitamente el campo de instancia. El sombreado es legal, pero abusarlo dificulta saber qué valor se modifica.

Un bloque también limita nombres:

```java
if (edad >= 18) {
    String mensaje = "Acceso permitido";
    System.out.println(mensaje);
}
// System.out.println(mensaje); // No compila: mensaje no es visible aquí.
```

### Reglas de inicialización y fallos claros

Java aplica **asignación definida** (*definite assignment*) a locales: el compilador debe poder demostrar que recibieron un valor antes de leerse.

```java
int resultado;
// System.out.println(resultado); // No compila: quizá no fue inicializada.

int resultadoSeguro = 0; // Solo es correcto si 0 representa un valor válido.
```

No agregues un valor predeterminado arbitrario solo para silenciar el compilador. Si falta un dato obligatorio, validalo y lanzá una excepción con contexto, como en el constructor de `Cuenta`. Para un dato opcional, elegí y documentá un valor neutral real.

---

## 3. Tipos Primitivos vs. Tipos por Referencia

Java clasifica los tipos de datos en dos grandes categorías:

### Tipos Primitivos (Almacenan valores directos)
| Tipo | Tamaño | Rango / Ejemplo |
| --- | --- | --- |
| `byte` | 8 bits | -128 a 127 |
| `short` | 16 bits | -32,768 a 32,767 |
| `int` | 32 bits | -2,147,483,648 a 2,147,483,647 |
| `long` | 64 bits | Números enteros grandes (ej: `10000000000L`) |
| `float` | 32 bits | Decimales de precisión simple (ej: `3.14f`) |
| `double` | 64 bits | Decimales de alta precisión (ej: `3.14159265`) |
| `boolean` | 1 bit | `true` o `false` |
| `char` | 16 bits | Un solo carácter en Unicode (ej: `'A'`) |

### Tipos por Referencia (Almacenan direcciones de memoria a objetos)
Ejemplos: `String`, Arrays, y cualquier clase personalizada.

```java
String nombre = "Facundo"; // Referencia a un objeto String
```

## 4. Conversión de Tipos (Casting)

- **Casting Implícito (Widening)**: De un tipo menor a uno mayor (automático).
  ```java
  int numeroEntero = 10;
  double numeroDecimal = numeroEntero; // 10.0
  ```
- **Casting Explícito (Narrowing)**: De un tipo mayor a uno menor (requiere sintaxis `(tipo)`).
  ```java
  double precioExacto = 45.89;
  int precioAproximado = (int) precioExacto; // 45 (pierde los decimales)
  ```

## 5. Operadores en Java

### Operadores Aritméticos
`+`, `-`, `*`, `/`, `%` (módulo o resto de división).
```java
int a = 10;
int b = 3;
int cociente = a / b; // 3
int resto = a % b;    // 1
```

### Operadores Relacionales y Lógicos
- Relacionales: `==`, `!=`, `>`, `<`, `>=`, `<=`
- Lógicos: `&&` (AND), `||` (OR), `!` (NOT)

```java
boolean tieneEdad = edad >= 18;
boolean puedeIngresar = tieneEdad && esEstudiante;
```

## 6. Ejercicio Práctico
Escribí un programa que declare las notas de tres exámenes de un alumno, calcule su promedio usando valores decimales (`double`), e imprima si el alumno aprobó (promedio mayor o igual a 6.0) mediante un resultado booleano.
