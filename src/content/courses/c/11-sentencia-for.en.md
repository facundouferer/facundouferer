---
title: 'For Loop'
course: 'c'
slug: 'sentencia-for'
order: 11
lang: 'en'
published: true
---

Después de aprender `while`, aparece una estructura muy usada cuando la repetición tiene una forma más compacta y controlada: `for`.

En esta lección vas a aprender:

- cómo funciona `for`
- qué partes tiene
- cómo se relaciona con el estado inicial, la condición y la actualización
- cuándo conviene usar `for`
- cómo usar `break` y `continue` dentro de un `for`

## ¿Qué hace `for`?

La sentencia `for` repite un bloque de código y concentra en una sola línea tres elementos muy importantes del ciclo:

- inicialización
- condición
- actualización

### Sintaxis

```c
for (inicializacion; condicion; actualizacion) {
    instrucciones;
}
```

## Ejemplo básico

```c
#include <stdio.h>

int main() {
    int i;

    for (i = 1; i <= 5; i = i + 1) {
        printf("%d\n", i);
    }

    return 0;
}
```

## Lectura correcta del `for`

### Inicialización

```c
i = 1
```

Se ejecuta una sola vez, al comienzo.

### Condición

```c
i <= 5
```

Se evalúa antes de cada iteración.

### Actualización

```c
i = i + 1
```

Se ejecuta al final de cada vuelta.

## ¿Cuándo conviene usar `for`?

`for` conviene mucho cuando la repetición está asociada a un contador o a una cantidad de pasos bastante clara.

Por ejemplo:

- mostrar los números del 1 al 10
- repetir una acción 5 veces
- recorrer posiciones numeradas

## `for` y `while`: misma idea, distinta forma

Un `for` y un `while` muchas veces pueden expresar la misma lógica.

La diferencia principal está en cómo se organiza la lectura.

`for` suele ser más cómodo cuando querés ver juntas la inicialización, la condición y la actualización.

## Uso de `break` en `for`

```c
for (i = 1; i <= 10; i = i + 1) {
    if (i == 6) {
        break;
    }
    printf("%d\n", i);
}
```

El ciclo se corta cuando `i` vale `6`.

## Uso de `continue` en `for`

```c
for (i = 1; i <= 5; i = i + 1) {
    if (i == 3) {
        continue;
    }
    printf("%d\n", i);
}
```

Cuando `i` vale `3`, esa iteración salta directamente al siguiente paso del ciclo.

## Error conceptual frecuente

Muchos estudiantes creen que `for` es “otro tipo de magia” distinta de `while`.

No.

La idea profunda es la misma: repetir un bloque mientras una condición lo permita.

Lo que cambia es la forma de organizar la expresión del ciclo.

## Resumen

- `for` organiza en una sola línea inicialización, condición y actualización
- es muy útil cuando trabajás con un contador o una cantidad de repeticiones clara
- `break` puede cortar el ciclo
- `continue` puede saltar a la siguiente iteración
- conceptualmente, `for` y `while` comparten la misma lógica de repetición controlada

## Idea final

Si `while` te enseña la lógica general de la repetición, `for` te enseña a escribirla de forma más compacta y legible cuando la estructura del ciclo está bien definida.
