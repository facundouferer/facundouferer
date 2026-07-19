---
title: 'Modularización y Funciones'
course: 'c'
slug: 'modularizacion-subprogramas-y-funciones'
order: 25
lang: 'es'
published: true
---

Cuando un programa empieza a crecer, escribir todo dentro de `main` se vuelve una mala idea.

Sí, puede funcionar para ejemplos mínimos. Pero cuando el problema crece, necesitás dividir el programa en partes más pequeñas, comprensibles y reutilizables.

Ahí aparece la **modularización**.

En esta lección vas a aprender:

- qué es modularizar
- qué es un subprograma
- qué diferencia conceptual hay entre función y procedimiento
- cómo se declara y usa una función en C
- por qué modularizar mejora el diseño del programa

> Idea clave: modularizar es dividir un problema grande en partes más pequeñas para poder pensarlo, implementarlo y mantenerlo mejor.

## ¿Qué es modularización?

**Modularizar** significa dividir un programa en partes más pequeñas y organizadas, donde cada una cumple una tarea específica.

En vez de tener un bloque enorme de código mezclando todo, separás responsabilidades.

Por ejemplo, en lugar de escribir un programa gigante que:

- lea datos
- valide datos
- calcule resultados
- muestre resultados

mezclando todo en un solo bloque, podés separar cada tarea en una parte distinta.

## ¿Por qué modularizar?

Porque mejora muchas cosas a la vez:

- el código se entiende mejor
- cada parte tiene una responsabilidad más clara
- podés reutilizar lógica
- es más fácil detectar errores
- el programa crece con más orden

## ¿Qué es un subprograma?

Un **subprograma** es una parte del programa que realiza una tarea específica.

Es, básicamente, un bloque de código con nombre propio al que el programa puede acudir cuando necesita ejecutar esa tarea.

En C, los subprogramas se expresan mediante **funciones**.

## Funciones y procedimientos: diferencia conceptual

Acá hay una distinción MUY útil a nivel pedagógico.

### Función

Una **función** es un subprograma que devuelve un resultado.

Por ejemplo, una función que suma dos números y devuelve el total.

### Procedimiento

Un **procedimiento** es un subprograma cuya idea principal es realizar una acción, sin centrarse en devolver un valor.

Por ejemplo, mostrar un mensaje en pantalla.

## Importante en C

En C, técnicamente todo se expresa con funciones.

O sea: incluso aquello que conceptualmente llamamos “procedimiento” suele escribirse como una función con retorno `void`.

Entonces, la diferencia entre función y procedimiento en este curso se enseña como una **distinción conceptual**, no como dos mecanismos distintos del lenguaje.

## Ejemplo de función que devuelve un valor

```c
int sumar(int a, int b) {
    return a + b;
}
```

Esta función recibe dos enteros y devuelve otro entero.

## Ejemplo de procedimiento conceptual en C

```c
void mostrarSaludo() {
    printf("Hola\n");
}
```

Acá no se devuelve un valor útil. La función realiza una acción.

## Estructura general de una función

```c
tipo_retorno nombre(parametros) {
    instrucciones;
}
```

### Partes

- **tipo de retorno**: qué devuelve la función
- **nombre**: cómo se llama
- **parámetros**: datos que recibe
- **cuerpo**: instrucciones que ejecuta

## Ejemplo completo

```c
#include <stdio.h>

int sumar(int a, int b) {
    return a + b;
}

void mostrarResultado(int resultado) {
    printf("El resultado es %d\n", resultado);
}

int main() {
    int total;

    total = sumar(5, 3);
    mostrarResultado(total);

    return 0;
}
```

## ¿Qué se gana con esto?

Muchísimo.

Porque ahora la lógica está separada:

- una parte suma
- otra parte muestra
- `main` coordina

Eso hace que el programa se lea mucho mejor.

## Modularización en varios archivos

Cuando el programa crece más, la modularización también puede reflejarse en distintos archivos.

De manera general, aparecen:

- archivos `.h` para declaraciones
- archivos `.c` para implementaciones
- un `main.c` como punto de entrada

### Ejemplo conceptual

#### Archivo de cabecera

```c
int sumar(int a, int b);
```

#### Archivo de implementación

```c
int sumar(int a, int b) {
    return a + b;
}
```

## ¿Cuándo conviene crear un subprograma?

Conviene cuando:

- una tarea tiene sentido por sí misma
- una lógica se repite
- un bloque dentro de `main` ya está creciendo demasiado
- querés separar responsabilidades

## Errores comunes al empezar

### 1. Meter todo en `main`

Eso vuelve el código difícil de leer y mantener.

### 2. Crear funciones sin una responsabilidad clara

No se trata de dividir por dividir. Cada subprograma debe tener una intención concreta.

### 3. No distinguir entre “calcular” y “mostrar”

Una buena modularización separa cálculo, entrada y salida cuando tiene sentido.

## Resumen

- modularizar es dividir un programa en partes más pequeñas
- un subprograma realiza una tarea específica
- una función devuelve un valor
- un procedimiento, conceptualmente, realiza una acción
- en C, ambos se representan mediante funciones
- modularizar mejora claridad, reutilización y mantenimiento

## Idea final

La modularización es una señal de madurez al programar.

Cuando dejás de pensar el programa como un bloque gigante y empezás a pensarlo como piezas con responsabilidades claras, tu diseño mejora MUCHÍSIMO.