---
title: 'Arreglos'
course: 'c'
slug: 'arreglos-unidimensionales-y-multidimensionales'
order: 15
lang: 'es'
published: true
---

Hasta ahora trabajaste muchas veces con una variable por vez.

Por ejemplo:

```c
int edad;
float precio;
char inicial;
```

Eso está bien cuando necesitás guardar un solo dato.

Pero, ¿qué pasa si necesitás guardar:

- 5 notas
- 10 edades
- 30 temperaturas
- 7 números ingresados por el usuario

¿Vas a crear una variable para cada dato?

```c
int nota1;
int nota2;
int nota3;
int nota4;
int nota5;
```

Podrías hacerlo, sí. Pero sería incómodo, desordenado y poco práctico.

Ahí es donde aparecen los **arreglos**.

## ¿Qué es un arreglo?

Un **arreglo** es una estructura que permite guardar varios datos del mismo tipo bajo un mismo nombre.

Cada dato se guarda en una **posición** y se accede a esa posición mediante un **índice**.

### Ejemplo simple

```c
int notas[5];
```

Esto significa:

- `int` es el tipo de dato de cada elemento
- `notas` es el nombre del arreglo
- `5` es la cantidad de posiciones reservadas

O sea: `notas` puede guardar 5 valores enteros.

## ¿Por qué un arreglo es útil?

Porque te permite agrupar muchos datos relacionados.

Por ejemplo, si querés guardar 5 notas, en vez de tener:

```c
int nota1, nota2, nota3, nota4, nota5;
```

podés tener:

```c
int notas[5];
```

Eso organiza mejor el programa y facilita muchísimo el trabajo posterior.

## Todos los elementos deben ser del mismo tipo

En un arreglo, todos los elementos tienen el mismo tipo.

Por ejemplo:

```c
int numeros[4];
```

acá todos los elementos son `int`.

Y en:

```c
char letras[6];
```

acá todos los elementos son `char`.

No podés guardar en el mismo arreglo un `int`, un `float` y un `char` mezclados.

## Índices: las posiciones del arreglo

En C, los arreglos empiezan en el índice `0`.

Esto es FUNDAMENTAL. Si no entendés esto bien, después todo se empieza a romper.

Si tenemos:

```c
int notas[5];
```

las posiciones válidas son:

- `notas[0]`
- `notas[1]`
- `notas[2]`
- `notas[3]`
- `notas[4]`

### Ojo con esto

Si el arreglo tiene 5 elementos:

- la cantidad de elementos es `5`
- el último índice es `4`

No es lo mismo.

## Forma mental de imaginar un arreglo

Podés pensar un arreglo como una fila de casilleros.

```text
Indice:   0    1    2    3    4
Valor:   [ ]  [ ]  [ ]  [ ]  [ ]
```

Cada casillero tiene:

- una posición
- un valor posible

## Declaración de un arreglo

Declarar un arreglo significa reservar espacio para sus elementos.

```c
int numeros[5];
```

Acá reservamos espacio para 5 enteros.

## Asignar valores a las posiciones

Después de declarar el arreglo, podemos cargar valores en sus posiciones.

```c
#include <stdio.h>

int main() {
    int numeros[5];

    numeros[0] = 10;
    numeros[1] = 20;
    numeros[2] = 30;
    numeros[3] = 40;
    numeros[4] = 50;

    printf("Primer valor: %d\n", numeros[0]);
    printf("Ultimo valor: %d\n", numeros[4]);

    return 0;
}
```

## Inicialización de un arreglo

También podemos declarar y cargar valores al mismo tiempo.

```c
int numeros[5] = {10, 20, 30, 40, 50};
```

Eso significa exactamente esto:

- `numeros[0] = 10`
- `numeros[1] = 20`
- `numeros[2] = 30`
- `numeros[3] = 40`
- `numeros[4] = 50`

## Acceso a los elementos

Para leer o usar un valor del arreglo, escribimos el nombre del arreglo y entre corchetes el índice.

```c
int primero = numeros[0];
int tercero = numeros[2];
```

## Ejemplo completo con acceso a posiciones

```c
#include <stdio.h>

int main() {
    int edades[4] = {15, 18, 20, 22};

    printf("Edad en la posicion 0: %d\n", edades[0]);
    printf("Edad en la posicion 1: %d\n", edades[1]);
    printf("Edad en la posicion 2: %d\n", edades[2]);
    printf("Edad en la posicion 3: %d\n", edades[3]);

    return 0;
}
```

## Modificar un elemento del arreglo

Los valores del arreglo también pueden cambiar.

```c
#include <stdio.h>

int main() {
    int notas[3] = {6, 7, 8};

    printf("Antes: %d\n", notas[1]);

    notas[1] = 10;

    printf("Despues: %d\n", notas[1]);

    return 0;
}
```

## Arreglo unidimensional

Un **arreglo unidimensional** es el arreglo más simple.

Tiene una sola dimensión y se puede imaginar como una fila de elementos.

```text
[10, 20, 30, 40, 50]
```

O más visualmente:

```text
Indice:   0    1    2    3    4
Valor:   10   20   30   40   50
```

## Ejemplo con `float`

```c
#include <stdio.h>

int main() {
    float precios[3] = {1250.5, 980.0, 1500.75};

    printf("Precio 1: %.2f\n", precios[0]);
    printf("Precio 2: %.2f\n", precios[1]);
    printf("Precio 3: %.2f\n", precios[2]);

    return 0;
}
```

Esto muestra algo importante:

> un arreglo no tiene que ser siempre de enteros. Puede ser de cualquier tipo, siempre que todos sus elementos sean del mismo tipo.

## Cargar datos en un arreglo con un ciclo

Una de las grandes ventajas de los arreglos es que se combinan muy bien con estructuras repetitivas.

```c
#include <stdio.h>

int main() {
    int numeros[5];
    int i;

    for (i = 0; i < 5; i = i + 1) {
        printf("Ingresa un numero: ");
        scanf("%d", &numeros[i]);
    }

    printf("\nValores guardados:\n");

    for (i = 0; i < 5; i = i + 1) {
        printf("numeros[%d] = %d\n", i, numeros[i]);
    }

    return 0;
}
```

### ¿Qué tiene de bueno este ejemplo?

Muchísimo.

Porque te muestra que no hace falta escribir:

```c
scanf("%d", &numeros[0]);
scanf("%d", &numeros[1]);
scanf("%d", &numeros[2]);
```

Eso sería repetitivo e incómodo. Con un ciclo, trabajamos todas las posiciones de forma ordenada.

## Arreglos multidimensionales

Un **arreglo multidimensional** es un arreglo con más de una dimensión.

El caso más común cuando se empieza a programar es el **arreglo bidimensional**, también llamado **matriz**.

## ¿Qué es una matriz?

Una matriz organiza los datos en:

- filas
- columnas

Entonces, en vez de imaginar una sola fila de casilleros, imaginamos una tabla.

## Declaración de una matriz

```c
int matriz[2][3];
```

Esto significa:

- 2 filas
- 3 columnas

O sea, hay lugar para 6 enteros en total.

## Forma mental de imaginar una matriz

```text
       Columna 0  Columna 1  Columna 2
Fila 0     [ ]        [ ]        [ ]
Fila 1     [ ]        [ ]        [ ]
```

## Inicialización de una matriz

```c
int matriz[2][3] = {
    {1, 2, 3},
    {4, 5, 6}
};
```

Esto significa:

- `matriz[0][0] = 1`
- `matriz[0][1] = 2`
- `matriz[0][2] = 3`
- `matriz[1][0] = 4`
- `matriz[1][1] = 5`
- `matriz[1][2] = 6`

## Acceso a un elemento de la matriz

Para acceder a un elemento de una matriz necesitamos dos índices:

- uno para la fila
- otro para la columna

```c
int valor = matriz[1][2];
```

Ese valor es `6`.

### ¿Por qué?

Porque:

- fila `1` es la segunda fila
- columna `2` es la tercera columna

## Ejemplo completo con matriz

```c
#include <stdio.h>

int main() {
    int matriz[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };

    printf("matriz[0][0] = %d\n", matriz[0][0]);
    printf("matriz[0][2] = %d\n", matriz[0][2]);
    printf("matriz[1][1] = %d\n", matriz[1][1]);
    printf("matriz[1][2] = %d\n", matriz[1][2]);

    return 0;
}
```

## Modificar una posición en una matriz

También podemos cambiar un valor de la matriz.

```c
#include <stdio.h>

int main() {
    int tablero[2][2] = {
        {1, 0},
        {0, 1}
    };

    tablero[0][1] = 9;

    printf("Nuevo valor: %d\n", tablero[0][1]);

    return 0;
}
```

## ¿Para qué sirven los arreglos multidimensionales?

Sirven cuando los datos tienen organización de tabla.

Por ejemplo:

- notas de varios alumnos en varias materias
- asientos de una sala
- tablero de juego
- matrices matemáticas
- temperaturas por día y por turno

## Ejemplo conceptual: notas por alumno y materia

```c
int notas[3][2];
```

Podría significar:

- 3 alumnos
- 2 materias

Entonces:

- `notas[0][0]` = nota del alumno 1 en la materia 1
- `notas[0][1]` = nota del alumno 1 en la materia 2
- `notas[1][0]` = nota del alumno 2 en la materia 1
- y así sucesivamente

## Diferencia entre arreglo unidimensional y multidimensional

### Unidimensional

Tiene una sola línea de posiciones.

```c
int numeros[5];
```

Se accede con un solo índice.

```c
numeros[2]
```

### Multidimensional

Tiene más de una dimensión.

```c
int matriz[2][3];
```

Se accede con más de un índice.

```c
matriz[1][2]
```

## Errores comunes

### Olvidar que el índice empieza en `0`

Este es el error clásico.

Si el arreglo tiene 5 elementos, el último índice es `4`, no `5`.

### Acceder a una posición que no existe

Esto está mal:

```c
int numeros[5];
int x = numeros[5];
```

Porque `numeros[5]` queda fuera del arreglo.

### Confundir cantidad con último índice

Si hay 3 filas y 2 columnas:

```c
int notas[3][2];
```

las filas válidas son:

- `0`
- `1`
- `2`

Y las columnas válidas son:

- `0`
- `1`

### Pensar que una matriz se maneja igual que un arreglo simple

No. En una matriz necesitás dos índices.

## Resumen

- un arreglo permite guardar varios datos del mismo tipo
- cada elemento se identifica por su índice
- en C, el primer índice siempre es `0`
- un arreglo unidimensional se parece a una fila de datos
- un arreglo bidimensional se parece a una tabla con filas y columnas
- para acceder a una matriz se necesitan dos índices

## Idea final

Los arreglos son una de las primeras herramientas realmente poderosas para trabajar con varios datos relacionados.

Si entendés bien estas tres ideas:

- que los datos comparten un mismo nombre
- que cada posición se identifica por un índice
- que una matriz agrega filas y columnas

entonces ya tenés una base muy sólida para todo lo que viene después.