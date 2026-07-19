---
title: 'Do-While'
course: 'c'
slug: 'sentencia-do-while'
order: 12
lang: 'es'
published: true
---

La sentencia `do-while` también repite instrucciones, pero tiene una diferencia muy importante respecto de `while`.

En esta lección vas a aprender:

- cómo funciona `do-while`
- en qué se diferencia de `while`
- por qué se ejecuta al menos una vez
- cuándo conviene usarlo

## Sintaxis

```c
do {
    instrucciones;
} while (condicion);
```

## Diferencia fundamental con `while`

En `while`, la condición se evalúa antes de entrar al bloque.

En `do-while`, la condición se evalúa después de ejecutar el bloque.

Eso significa que el bloque se ejecuta **al menos una vez**.

## Ejemplo

```c
#include <stdio.h>

int main() {
    int i = 1;

    do {
        printf("%d\n", i);
        i = i + 1;
    } while (i <= 5);

    return 0;
}
```

## Ejemplo donde la diferencia importa

```c
#include <stdio.h>

int main() {
    int numero = 10;

    do {
        printf("El número es %d\n", numero);
    } while (numero < 5);

    return 0;
}
```

Aunque `numero < 5` es falso, el bloque se ejecuta una vez.

## ¿Cuándo conviene usar `do-while`?

Conviene cuando querés que el bloque se ejecute al menos una vez antes de verificar si debe repetirse.

## Errores comunes

### 1. Creer que `while` y `do-while` son iguales

No lo son. La diferencia está en cuándo se evalúa la condición.

### 2. Olvidar el `;` final

```c
} while (condicion);
```

Ese punto y coma forma parte de la sintaxis.

## Resumen

- `do-while` evalúa la condición al final
- el bloque se ejecuta al menos una vez
- es útil cuando necesitás garantizar una primera ejecución

## Idea final

`do-while` muestra que en programación no solo importa qué condición se evalúa, sino también **en qué momento** se evalúa.