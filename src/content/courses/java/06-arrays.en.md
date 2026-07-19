---
title: 'Arrays'
course: 'java'
slug: 'arrays'
order: 6
lang: 'en'
published: true
---

# Arrays

An array is a data structure that allows storing multiple values of the same type in a single variable.

## Characteristics
- **Fixed-size:** Its size is defined when created and cannot change.
- **Homogeneous:** All elements must be of the same type.
- **Indexed:** Accessed through an index that starts at `0`.

## How to create an Array

```java
// Form 1: Direct values
int[] numeros = {1, 2, 3, 4, 5};

// Form 2: With fixed size
int[] otrosNumeros = new int[5];
otrosNumeros[0] = 10;
```

## Iterating over an Array

We use loops to access each element:

```java
int[] numeros = {2, 4, 6, 8};
for (int i = 0; i < numeros.length; i++) {
    System.out.println("Position " + i + ": " + numeros[i]);
}
```

## Multidimensional Arrays

We can create tables (matrices) or structures with more dimensions:

```java
// Two-dimensional (3x3)
int[][] matriz = new int[3][3];
matriz[0][0] = 1;

// Three-dimensional (Cube)
int[][][] cubo = new int[3][3][3];
```
