---
title: 'Switch Statement and Code Blocks'
course: 'c'
slug: 'sentencia-switch-y-bloques-de-codigo'
order: 9
lang: 'en'
published: true
---

Después de aprender `if-else`, aparece otra necesidad frecuente: elegir entre varias opciones posibles según el valor de una variable.

Para eso existe `switch`.

Pero esta lección no trata solo de `switch`. También es un muy buen momento para entender mejor los **bloques de código** y algunas instrucciones que alteran el flujo dentro de esos bloques, como `break`.

En esta lección vas a aprender:

- qué problema resuelve `switch`
- cómo se escribe un `switch`
- para qué sirve `break`
- qué pasa si falta `break`
- qué es `default`
- qué son los bloques de código
- cómo algunas instrucciones alteran el flujo del bloque

## ¿Cuándo conviene usar `switch`?

`switch` conviene cuando querés comparar una misma variable contra varios valores posibles.

Por ejemplo:

- un número que representa un día
- una opción de menú
- un código simple de selección

En esos casos, un `switch` puede resultar más claro que una larga cadena de comparaciones.

## Sintaxis general

```c
switch (variable) {
    case valor1:
        instrucciones;
        break;

    case valor2:
        instrucciones;
        break;

    default:
        instrucciones;
}
```

## Ejemplo básico

```c
#include <stdio.h>

int main() {
    int dia = 3;

    switch (dia) {
        case 1:
            printf("Lunes\n");
            break;
        case 2:
            printf("Martes\n");
            break;
        case 3:
            printf("Miércoles\n");
            break;
        default:
            printf("Valor no válido\n");
    }

    return 0;
}
```

## ¿Qué hace `break`?

`break` corta la ejecución del `switch` cuando ya se ejecutó el caso que correspondía.

Si el valor de `dia` es `3`, el programa entra en `case 3`, muestra `Miércoles` y luego `break` hace que salga del `switch`.

## ¿Qué pasa si falta `break`?

Acá está uno de los comportamientos que más confunden al principio.

Si falta `break`, el programa puede seguir ejecutando el siguiente `case`.

### Ejemplo

```c
switch (opcion) {
    case 1:
        printf("Opción 1\n");
    case 2:
        printf("Opción 2\n");
        break;
}
```

Si `opcion` vale `1`, podrían ejecutarse ambas salidas, porque no hubo `break` al terminar el `case 1`.

Por eso, al comenzar, la regla práctica es muy simple:

> si no querés que siga al siguiente caso, usá `break`.

## ¿Qué hace `default`?

`default` representa el caso por defecto, es decir, qué debe pasar si ningún `case` coincide.

```c
default:
    printf("Opción no válida\n");
```

No siempre es obligatorio, pero casi siempre es una buena idea tenerlo.

## ¿Qué es un bloque de código?

Un **bloque de código** es un conjunto de sentencias encerradas entre llaves.

```c
{
    printf("Hola\n");
    printf("Mundo\n");
}
```

Esas dos sentencias forman un bloque.

Los bloques aparecen en muchas estructuras de control:

- `if`
- `else`
- `switch`
- `while`
- `for`
- `do-while`

## ¿Por qué importan los bloques?

Porque ayudan a organizar qué instrucciones pertenecen a cada parte del flujo.

Sin bloques claros, el programa se vuelve difícil de leer y más propenso a errores.

## Instrucciones que alteran el flujo dentro de un bloque

### `break`

Ya viste que `break` sirve para salir de un `switch`.

También más adelante lo vas a ver dentro de ciclos, donde permite cortar una repetición antes de tiempo.

### `continue`

`continue` se usa en ciclos, no en `switch`, y sirve para saltar al siguiente paso de la repetición.

Por ahora te alcanza con reconocer que existen instrucciones que pueden alterar el recorrido normal del bloque.

### `return`

`return` finaliza la función actual.

En `main`, por ejemplo:

```c
return 0;
```

indica que la ejecución principal terminó.

## Relación entre `switch` y bloques

Aunque visualmente `switch` parece una estructura distinta, sigue organizando el flujo en bloques y casos delimitados.

Aprender a leer bien esa estructura es clave para no perderte dentro del código.

## Errores comunes al empezar

### 1. Olvidar `break`

Es el error clásico en `switch`.

### 2. Usar `switch` para cualquier cosa

`switch` no reemplaza mágicamente a toda decisión. Conviene cuando comparás una misma variable con varios valores concretos.

### 3. Desordenar los bloques

Si no indentás bien o no usás llaves con claridad, el código se vuelve un desastre de leer.

## Resumen

- `switch` permite elegir entre varias opciones según el valor de una variable
- `case` representa cada alternativa posible
- `break` corta la ejecución del `switch`
- `default` cubre el caso en que no hubo coincidencias
- los bloques de código agrupan instrucciones relacionadas
- algunas sentencias, como `break`, alteran el flujo del bloque

## Idea final

Aprender `switch` no es solo aprender otra sintaxis.

Es aprender a organizar decisiones múltiples de manera clara y controlada.

Y entender los bloques de código es clave para no perder de vista qué instrucciones pertenecen a cada parte del programa.
