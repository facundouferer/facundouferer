---
title: 'While Loop'
course: 'c'
slug: 'sentencia-while'
order: 10
lang: 'en'
published: true
---

Hasta ahora viste cómo un programa puede ejecutar acciones en secuencia y cómo puede elegir entre distintos caminos.

Ahora aparece otro problema fundamental: **repetir acciones**.

Ahí entran en juego las sentencias de iteración. La primera que vas a estudiar es `while`.

En esta lección vas a aprender:

- qué significa iterar
- cómo funciona `while`
- cómo pensar un ciclo con estado inicial, condición y actualización
- qué es un ciclo infinito
- cómo usar `break` y `continue` dentro de un ciclo

## ¿Qué es una iteración?

Una **iteración** es cada repetición de un conjunto de instrucciones.

Si un ciclo imprime cinco números, entonces hubo cinco iteraciones.

## ¿Qué hace `while`?

La sentencia `while` repite un bloque de código **mientras una condición sea verdadera**.

### Sintaxis

```c
while (condicion) {
    instrucciones;
}
```

## Idea mental correcta para leer un `while`

Un ciclo `while` tiene tres elementos fundamentales:

1. **estado inicial**
2. **condición de continuación**
3. **actualización del estado**

Si te olvidás de uno de esos tres, normalmente el ciclo queda mal pensado.

## Ejemplo básico

```c
#include <stdio.h>

int main() {
    int i = 1;

    while (i <= 5) {
        printf("%d\n", i);
        i = i + 1;
    }

    return 0;
}
```

## Lectura paso a paso

- estado inicial: `i = 1`
- condición: `i <= 5`
- actualización: `i = i + 1`

Mientras la condición sea verdadera, el bloque sigue ejecutándose.

## ¿Qué pasa en cada iteración?

### Iteración 1

- `i` vale `1`
- se imprime `1`
- `i` pasa a valer `2`

### Iteración 2

- `i` vale `2`
- se imprime `2`
- `i` pasa a valer `3`

Y así sucesivamente hasta que `i` deja de cumplir la condición.

## Ciclo infinito

Un **ciclo infinito** ocurre cuando la condición nunca se vuelve falsa.

### Ejemplo incorrecto

```c
while (i <= 5) {
    printf("%d\n", i);
}
```

Si `i` no cambia, el ciclo puede repetirse para siempre.

Por eso tenés que pensar siempre:

> ¿qué acción dentro del ciclo acerca al programa al final del ciclo?

## Uso de `break` en un `while`

`break` permite salir inmediatamente del ciclo.

```c
while (i <= 10) {
    if (i == 5) {
        break;
    }
    printf("%d\n", i);
    i = i + 1;
}
```

Cuando `i` vale `5`, el ciclo se corta.

## Uso de `continue` en un `while`

`continue` hace que el ciclo salte directamente a la siguiente iteración.

```c
while (i <= 5) {
    i = i + 1;

    if (i == 3) {
        continue;
    }

    printf("%d\n", i);
}
```

No hace falta dominarlo al detalle todavía, pero sí entender su idea general: altera el flujo normal del ciclo.

## ¿Cuándo conviene usar `while`?

`while` conviene mucho cuando la repetición depende de una condición y no querés pensar primero en una cantidad exacta de repeticiones.

## Resumen

- `while` repite un bloque mientras una condición sea verdadera
- para diseñar bien un `while` tenés que pensar estado inicial, condición y actualización
- si la condición nunca se vuelve falsa, aparece un ciclo infinito
- `break` corta el ciclo
- `continue` salta a la siguiente iteración

## Idea final

`while` te enseña una de las ideas más profundas de la programación: repetir no es copiar código muchas veces, sino controlar cómo evoluciona un estado mientras una condición siga cumpliéndose.
