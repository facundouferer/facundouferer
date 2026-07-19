---
title: 'Variables and Data Types'
course: 'java'
slug: 'variables-tipos-datos'
order: 3
lang: 'en'
published: true
---

# Variables y Tipos de Datos

## Las variables

Las variables son espacios de memoria donde almacenamos datos temporalmente. Imagina que son "contenedores" etiquetados con un nombre y un tipo de dato.

```java
int edad = 25;
edad = 30; // Podemos cambiar su valor en cualquier momento
```

## Tipos de Datos Primitivos

Java tiene 8 tipos de datos básicos integrados:

### 1. Enteros (Números sin decimales)
| Tipo | Tamaño | Rango |
|---|---|---|
| `byte` | 8 bits | -128 a 127 |
| `short` | 16 bits | -32,768 a 32,767 |
| `int` | 32 bits | ~-2 mil millones a ~2 mil millones |
| `long` | 64 bits | Rango enorme (usar 'L' al final: `100L`) |

### 2. Flotantes (Números con decimales)
| Tipo | Tamaño | Uso |
|---|---|---|
| `float` | 32 bits | Precisión simple (usar 'f' al final: `3.14f`) |
| `double` | 64 bits | Precisión doble (estándar para decimales) |

### 3. Caracteres
- `char`: Almacena un solo carácter Unicode (usa comillas simples: `'a'`).

### 4. Booleanos
- `boolean`: Solo puede ser `true` (verdadero) o `false` (falso).

## Resumen en tabla

| Tipo | Grupo | Tamaño | Rango |
|---|---|---|---|
| `boolean` | Lógico | 1 bit | `true` o `false` |
| `byte` | Entero | 8 bits | -128 a 127 |
| `char` | Carácter | 16 bits | '\u0000' a '\uffff' |
| `int` | Entero | 32 bits | -2,147,483,648 a 2,147,483,647 |
| `double` | Real | 64 bits | ~1.7e308 |
