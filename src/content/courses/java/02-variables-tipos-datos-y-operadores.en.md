---
course: 'java'
slug: '02-variables-tipos-datos-y-operadores'
title: 'Variables, Data Types, and Operators'
description: 'Master primitive types, reference types, type casting, and operators in Java.'
order: 2
lang: 'en'
published: true
---

# Variables, Data Types, and Operators

In Java, every data value has a clearly defined type. Java is a **statically typed** language, meaning that every variable's type must be explicitly declared and cannot change during execution.

## 1. Variable and Constant Declaration

A variable is a reserved memory space for storing information.

```java
// Declaration and initialization
int age = 25;
double price = 99.99;
boolean isStudent = true;
char initial = 'F';

// Constant (value cannot be changed after assignment)
final double PI = 3.14159;
```

## 2. Primitive Types vs. Reference Types

Java categorizes data types into two main groups:

### Primitive Types (Store direct values)
| Type | Size | Range / Example |
| --- | --- | --- |
| `byte` | 8 bits | -128 to 127 |
| `short` | 16 bits | -32,768 to 32,767 |
| `int` | 32 bits | -2,147,483,648 to 2,147,483,647 |
| `long` | 64 bits | Large integers (e.g., `10000000000L`) |
| `float` | 32 bits | Single-precision floating point (e.g., `3.14f`) |
| `double` | 64 bits | Double-precision floating point (e.g., `3.14159265`) |
| `boolean` | 1 bit | `true` or `false` |
| `char` | 16 bits | Single Unicode character (e.g., `'A'`) |

### Reference Types (Store memory addresses to objects)
Examples: `String`, Arrays, and any custom class.

```java
String name = "Facundo"; // Reference to a String object
```

## 3. Type Casting

- **Implicit Casting (Widening)**: Smaller type to larger type (automatic).
  ```java
  int intValue = 10;
  double doubleValue = intValue; // 10.0
  ```
- **Explicit Casting (Narrowing)**: Larger type to smaller type (requires `(type)` syntax).
  ```java
  double exactPrice = 45.89;
  int roundedPrice = (int) exactPrice; // 45 (loses fractional part)
  ```

## 4. Java Operators

### Arithmetic Operators
`+`, `-`, `*`, `/`, `%` (modulus / remainder).
```java
int a = 10;
int b = 3;
int quotient = a / b; // 3
int remainder = a % b; // 1
```

### Relational and Logical Operators
- Relational: `==`, `!=`, `>`, `<`, `>=`, `<=`
- Logical: `&&` (AND), `||` (OR), `!` (NOT)

```java
boolean isAdult = age >= 18;
boolean canAccess = isAdult && isStudent;
```

## 5. Hands-on Exercise
Write a program that declares the grades for three exams of a student, calculates their average using floating-point numbers (`double`), and prints whether the student passed (average >= 6.0) using a boolean expression.
