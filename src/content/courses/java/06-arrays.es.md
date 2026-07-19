---
title: 'Arrays en Java'
course: 'java'
slug: 'arrays'
order: 6
lang: 'es'
published: true
---

# Arrays (Arreglos)

Un array es una estructura de datos que permite almacenar múltiples valores del mismo tipo en una sola variable.

## Características
- **Estáticos:** Su tamaño se define al crearlos y no puede cambiar.
- **Homogéneos:** Todos los elementos deben ser del mismo tipo.
- **Indexados:** Se accede a ellos mediante un índice que empieza en `0`.

## Cómo crear un Array

```java
// Forma 1: Valores directos
int[] numeros = {1, 2, 3, 4, 5};

// Forma 2: Con tamaño fijo
int[] otrosNumeros = new int[5];
otrosNumeros[0] = 10;
```

## Recorrer un Array

Usamos bucles para acceder a cada elemento:

```java
int[] numeros = {2, 4, 6, 8};
for (int i = 0; i < numeros.length; i++) {
    System.out.println("Posición " + i + ": " + numeros[i]);
}
```

## Arrays Multidimensionales

Podemos crear tablas (matrices) o estructuras de más dimensiones:

```java
// Bidimensional (3x3)
int[][] matriz = new int[3][3];
matriz[0][0] = 1;

// Tridimensional (Cubo)
int[][][] cubo = new int[3][3][3];
```