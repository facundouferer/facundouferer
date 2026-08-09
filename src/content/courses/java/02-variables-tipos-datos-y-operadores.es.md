---
course: 'java'
slug: '02-variables-tipos-datos-y-operadores'
title: 'Variables, Tipos de Datos y Operadores'
description: 'Dominá los tipos primitivos, tipos por referencia, conversión de tipos (casting) y operadores en Java.'
order: 2
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

## 2. Tipos Primitivos vs. Tipos por Referencia

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

## 3. Conversión de Tipos (Casting)

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

## 4. Operadores en Java

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

## 5. Ejercicio Práctico
Escribí un programa que declare las notas de tres exámenes de un alumno, calcule su promedio usando valores decimales (`double`), e imprima si el alumno aprobó (promedio mayor o igual a 6.0) mediante un resultado booleano.
