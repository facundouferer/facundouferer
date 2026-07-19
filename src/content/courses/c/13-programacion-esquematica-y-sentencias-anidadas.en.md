---
title: 'Schematic Programming and Nested Statements'
course: 'c'
slug: 'programacion-esquematica-y-sentencias-anidadas'
order: 13
lang: 'en'
published: true
---

Ya viste secuencia, decisión e iteración. Ahora toca una idea más grande: **cómo pensar programas completos combinando esas estructuras sin perder claridad**.

Eso conecta con la **programación esquemática** y con el uso controlado de **sentencias anidadas**.

En esta lección vas a aprender:

- qué es programación esquemática
- cómo usar refinamiento sucesivo para diseñar programas
- cómo combinar secuencia, decisión e iteración
- qué son las sentencias anidadas
- cuándo conviene anidar y cuándo empieza el desorden

## ¿Qué es programación esquemática?

La **programación esquemática** es una forma de diseñar programas a partir de esquemas de control bien conocidos.

En vez de improvisar, pensás el problema usando estructuras base como:

- secuencia
- selección
- iteración

O sea: no inventás la lógica desde cero cada vez. Reconocés patrones de construcción.

## Los tres grandes esquemas básicos

### 1. Secuencia

Una acción después de otra.

### 2. Selección

Elegir entre caminos posibles.

### 3. Iteración

Repetir acciones mientras una condición lo indique.

Toda una enorme cantidad de programas se puede pensar combinando estos tres esquemas.

## Ejemplo de pensamiento esquemático

Supongamos que querés un programa que:

1. lea números
2. sume solo los positivos
3. termine cuando el usuario ingrese 0
4. muestre la suma final

Si lo pensás esquemáticamente, podés ver:

- hay **iteración**: leer varias veces
- hay **selección**: sumar solo si el número es positivo
- hay **secuencia**: inicializar, leer, procesar, mostrar

Eso ordena la mente antes de escribir código.

## Refinamiento sucesivo aplicado al control de flujo

### Esquema general

1. inicializar datos
2. repetir lectura y procesamiento
3. decidir qué hacer con cada dato
4. terminar y mostrar resultado

### Refinamiento más detallado

1. declarar `numero` y `suma`
2. inicializar `suma` en 0
3. leer un número
4. mientras el número no sea 0:
   - si es positivo, acumularlo
   - leer otro número
5. mostrar la suma

Recién después escribirías el código.

## Sentencias anidadas

Una **sentencia anidada** es una estructura de control colocada dentro de otra.

Puede ser:

- un `if` dentro de otro `if`
- un `if` dentro de un `while`
- un `while` dentro de otro `while`
- un `switch` dentro de un `if`

## Ejemplo: `if` dentro de `while`

```c
#include <stdio.h>

int main() {
    int numero;
    int suma = 0;

    printf("Ingrese un número (0 para terminar): ");
    scanf("%d", &numero);

    while (numero != 0) {
        if (numero > 0) {
            suma = suma + numero;
        }

        printf("Ingrese un número (0 para terminar): ");
        scanf("%d", &numero);
    }

    printf("La suma es %d\n", suma);

    return 0;
}
```

## ¿Por qué este ejemplo es importante?

Porque muestra cómo se combinan esquemas:

- secuencia para inicializar y mostrar
- iteración para repetir la lectura
- selección para decidir si se suma o no

Eso es programación esquemática en acción.

## ¿Cuándo la anidación es razonable?

Es razonable cuando realmente expresa dependencias lógicas claras.

Por ejemplo:

- repetir varias veces una acción
- y dentro de cada repetición decidir algo

Eso tiene sentido.

## ¿Cuándo la anidación empieza a ser un problema?

Cuando acumulás demasiados niveles y ya no se entiende qué controla a qué.

Si al leer el código te perdés entre llaves, niveles y caminos, el diseño probablemente necesita simplificarse.

## Buenas prácticas

- indentá correctamente
- usá llaves siempre
- mantené cada bloque con una intención clara
- pensá primero el esquema antes del código
- refiná la solución de lo general a lo particular

## Resumen

- la programación esquemática organiza soluciones usando secuencia, selección e iteración
- el refinamiento sucesivo ayuda a pasar del problema al código
- las sentencias anidadas permiten combinar estructuras de control
- anidar está bien cuando mejora la lógica, pero mal usado vuelve el código confuso

## Idea final

Programar bien no es encadenar estructuras al azar.

Es reconocer esquemas, combinarlos con criterio y refinar la solución hasta que el código exprese claramente la lógica del problema.

Ahí es donde dejás de “probar cosas” y empezás realmente a diseñar programas.
