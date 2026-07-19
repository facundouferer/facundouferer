---
title: 'If-Else'
course: 'c'
slug: 'sentencia-if-else'
order: 7
lang: 'es'
published: true
---

Hasta ahora viste programas secuenciales: las instrucciones se ejecutan una detrás de otra. Pero a veces eso no alcanza.

Muchas veces un programa necesita **elegir** entre dos o más caminos según una condición.

Ahí aparece la sentencia `if-else`.

En esta lección vas a aprender:

- qué significa tomar una decisión en un programa
- qué hace `if`
- qué hace `if-else`
- cómo se usan bloques de código con llaves
- qué son las sentencias anidadas
- errores comunes al trabajar con decisiones

> Idea clave: `if-else` permite romper la secuencia lineal simple para elegir qué bloque ejecutar según una condición.

## ¿Qué es una decisión en programación?

Una decisión ocurre cuando el programa debe evaluar una condición y, a partir de eso, ejecutar un bloque u otro.

Por ejemplo:

- si la edad es 18 o más, mostrar “mayor de edad”
- si la nota es menor que 6, mostrar “desaprobado”
- si el número es 0, mostrar “cero”

## Recordatorio: ¿qué es una condición?

Una **condición** es una expresión que puede resultar verdadera o falsa.

Ejemplos:

```c
edad >= 18
numero == 0
nota < 6
```

Estas expresiones usan operadores relacionales, que ya viste en la lección anterior.

## Sentencia `if`

La sentencia `if` ejecuta un bloque de código solo si la condición es verdadera.

### Sintaxis

```c
if (condicion) {
    instrucciones;
}
```

## Ejemplo simple

```c
#include <stdio.h>

int main() {
    int edad = 20;

    if (edad >= 18) {
        printf("Es mayor de edad\n");
    }

    return 0;
}
```

Si la condición es verdadera, el bloque se ejecuta.
Si es falsa, ese bloque se omite.

## Sentencia `if-else`

La estructura `if-else` permite ejecutar un bloque si la condición es verdadera y otro bloque distinto si es falsa.

### Sintaxis

```c
if (condicion) {
    instrucciones_si_verdadero;
} else {
    instrucciones_si_falso;
}
```

## Ejemplo

```c
#include <stdio.h>

int main() {
    int numero = 5;

    if (numero % 2 == 0) {
        printf("El número es par\n");
    } else {
        printf("El número es impar\n");
    }

    return 0;
}
```

## ¿Qué papel tienen las llaves?

Las llaves `{}` delimitan el bloque de instrucciones que pertenece al `if` o al `else`.

```c
if (edad >= 18) {
    printf("Mayor de edad\n");
    printf("Puede continuar\n");
}
```

Acá ambas sentencias pertenecen al mismo bloque.

Aunque en C existe la posibilidad de escribir un `if` sin llaves cuando solo hay una instrucción, para enseñar y escribir código claro conviene usar llaves siempre.

## Sentencias anidadas

Una **sentencia anidada** es una sentencia de control colocada dentro de otra.

Por ejemplo, un `if` dentro de otro `if`.

### Ejemplo

```c
#include <stdio.h>

int main() {
    int numero = 0;

    if (numero >= 0) {
        if (numero == 0) {
            printf("El número es cero\n");
        } else {
            printf("El número es positivo\n");
        }
    } else {
        printf("El número es negativo\n");
    }

    return 0;
}
```

## ¿Cuándo conviene anidar?

Conviene anidar cuando una segunda decisión depende de que la primera ya se haya cumplido.

Pero tampoco hay que exagerar.

Si empezás a meter demasiados niveles de anidación, el código se vuelve difícil de leer.

## Flujo del programa con `if-else`

Mirá este ejemplo:

```c
int edad = 16;

if (edad >= 18) {
    printf("Mayor\n");
} else {
    printf("Menor\n");
}
```

### Flujo

1. se evalúa `edad >= 18`
2. como es falso, no se ejecuta el bloque del `if`
3. se ejecuta el bloque del `else`

La clave es entender que el programa no ejecuta los dos caminos: elige uno.

## Errores comunes al empezar

### 1. Confundir `=` con `==`

```c
if (edad = 18) {
```

Eso está mal conceptualmente para una comparación. Para comparar se usa `==`.

### 2. Olvidar las llaves en bloques que crecen

Hoy tenés una línea, mañana agregás dos más y ya aparece el caos.

### 3. No pensar el flujo

No alcanza con escribir la condición. Tenés que entender qué bloque se ejecuta cuando la condición da verdadero y cuál cuando da falso.

### 4. Anidar sin necesidad

La anidación sirve, pero abusar de ella vuelve el código más difícil.

## Resumen

- `if` ejecuta un bloque solo si la condición es verdadera
- `if-else` permite elegir entre dos caminos
- las llaves delimitan el bloque de instrucciones
- las sentencias anidadas permiten decisiones dentro de otras decisiones
- el programa elige un camino según el resultado de la condición

## Idea final

`if-else` es la primera gran ruptura de la secuencia simple.

A partir de acá, el programa ya no hace siempre lo mismo: empieza a adaptarse según los datos.

Y eso es exactamente lo que vuelve útil a una enorme cantidad de programas reales.