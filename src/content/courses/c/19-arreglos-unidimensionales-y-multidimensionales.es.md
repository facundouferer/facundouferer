---
title: 'Arreglos'
course: 'c'
slug: 'arreglos-unidimensionales-y-multidimensionales'
description: 'Almacena elementos del mismo tipo en celdas contiguas indexadas desde cero, valida límites con sizeof y trabaja con matrices bidimensionales fila por fila.'
order: 19
lang: 'es'
published: true
---

En la lección anterior viste por qué hace falta guardar muchos datos en orden bajo un solo nombre. En C, la estructura que lo hace es el **arreglo**: una fila de elementos del mismo tipo, uno pegado al otro en memoria, a los que se llega por su **índice**. Es la estructura de acceso directo y tamaño estático del mapa del módulo.

## Objetivos

- Declarar e inicializar arreglos, incluidos `= {0}` y los inicializadores designados.
- Acceder a los elementos por índice, sabiendo que el primero es el `0`.
- Respetar el **límite** del arreglo, validar índices y reconocer que salirse del arreglo es comportamiento indefinido.
- Calcular la cantidad de elementos con `sizeof v / sizeof v[0]` y saber dónde funciona.
- Declarar y recorrer arreglos bidimensionales como `int m[3][4]` y entender su orden por filas en memoria.
- Pasar arreglos a funciones junto con su cantidad de elementos.

**Requisitos previos:** `manejo-de-estructuras-secuenciales-de-datos` (secuencias, capacidad), `tipos-de-datos` (`sizeof`, `size_t`, `%zu`), `operadores` (comportamiento indefinido), `sentencia-for`, `modularizacion-subprogramas-y-funciones` y `variables-parametros-y-pasaje` (los argumentos se pasan por valor).

## Declarar un arreglo

```c
int notas[5];
```

La declaración tiene tres partes:

- `int` es el tipo de **cada** elemento. Todos los elementos de un arreglo tienen el mismo tipo.
- `notas` es el nombre del arreglo.
- `5` es la cantidad de elementos, que también es su **capacidad**. Debe ser una constante entera positiva.

Conviene darle nombre a esa cantidad con `#define`, para escribirla una sola vez:

```c
#include <stdio.h>

#define CANTIDAD 5

int main(void) {
    int notas[CANTIDAD];

    notas[0] = 8;
    notas[1] = 6;
    notas[2] = 10;
    notas[3] = 7;
    notas[4] = 9;

    printf("Primera nota: %d\n", notas[0]);
    printf("Última nota: %d\n", notas[CANTIDAD - 1]);
    return 0;
}
```

> **Portabilidad:** C99 permitió declarar arreglos cuyo tamaño es una variable (`int v[n];`, llamados VLA). Desde C11 son una característica **opcional** que algunos compiladores no implementan, y un `n` grande puede agotar la memoria sin aviso. En este curso los tamaños son constantes; para tamaños que se conocen en ejecución está la lección `memoria-dinamica`.

## Índices: del 0 al n − 1

Cada elemento se identifica por su **índice**, que en C empieza en `0`:

```text
índice:    0    1    2    3    4
notas:   [ 8 ][ 6 ][10 ][ 7 ][ 9 ]
```

El índice indica **cuántos elementos hay antes** del que buscas: `notas[0]` es el primero porque no tiene ninguno antes. Por eso, en un arreglo de `n` elementos:

- el primer índice es `0`;
- el último índice es `n - 1`;
- la cantidad (`5`) **no** es un índice válido.

Leer y escribir un elemento usa la misma notación:

```c
int tercera = notas[2];   /* lee el elemento de índice 2 */
notas[1] = 7;             /* reemplaza el elemento de índice 1 */
```

## Inicializar un arreglo

Un arreglo local sin inicializar contiene **valores indeterminados**: basura de lo que hubo antes en esa memoria. Leerlos antes de asignarlos es un error. Lo más seguro es inicializar al declarar:

```c
#include <stdio.h>

int main(void) {
    int completo[5] = {10, 20, 30, 40, 50};
    int parcial[5] = {10, 20};
    int ceros[5] = {0};
    int designado[5] = {[1] = 7, [4] = 9};

    for (size_t i = 0; i < 5; i++) {
        printf("%2d %2d %2d %2d\n", completo[i], parcial[i], ceros[i], designado[i]);
    }
    return 0;
}
```

Salida:

```text
10 10  0  0
20 20  0  7
30  0  0  0
40  0  0  0
50  0  0  9
```

Las reglas:

- Con una lista completa, cada valor va a su posición.
- Con una lista **parcial**, los elementos que faltan valen `0`. Por eso `= {0}` es la forma habitual de poner todo en cero.
- Un **inicializador designado** (`[1] = 7`) elige la posición. Los elementos no nombrados valen `0`.
- Si omites el tamaño, el compilador cuenta los valores: `int primos[] = {2, 3, 5, 7};` tiene 4 elementos.

> **C moderno (C23):** C23 admite la lista vacía: `int v[5] = {};` pone todos los elementos en cero.

> **Portabilidad:** antes de C23, `= {}` era una extensión de GCC y Clang, no C estándar; con `-std=c17 -Wpedantic` produce una advertencia. `= {0}` funciona en todas las versiones.

Un arreglo **no se puede asignar** entero: si `a` y `b` son arreglos, `a = b;` no compila. Hay que copiar elemento por elemento, como verás en la lección siguiente.

## El límite del arreglo

Los índices válidos de `notas` van del `0` al `4`. Ese es el **límite** del arreglo, y respetarlo es responsabilidad tuya: **C no lo comprueba**.

```c
int notas[5] = {8, 6, 10, 7, 9};
notas[5] = 4;    /* fuera del límite: comportamiento indefinido */
int x = notas[-1];   /* también fuera del límite */
```

Acceder fuera del arreglo es **comportamiento indefinido** (lo viste en `operadores`): el estándar no dice qué pasa. En la práctica puede no notarse nada, puede cambiar el valor de otra variable que estaba al lado en memoria, o puede terminar el programa. Lo peor es el primer caso: el programa "funciona" hasta que un día deja de hacerlo. Las herramientas de la lección `depuracion-y-sanitizers` ayudan a detectar estos accesos.

### Validar índices

Cuando un índice viene del usuario o de un cálculo, se valida **antes** de usarlo:

```c
#include <stdio.h>

#define CANTIDAD 5

int main(void) {
    int notas[CANTIDAD] = {8, 6, 10, 7, 9};
    int posicion;

    printf("¿Qué posición quieres ver (0 a %d)? ", CANTIDAD - 1);
    if (scanf("%d", &posicion) != 1) {
        printf("Entrada inválida.\n");
        return 1;
    }
    if (posicion < 0 || posicion >= CANTIDAD) {
        printf("La posición %d está fuera del límite del arreglo.\n", posicion);
        return 1;
    }
    printf("notas[%d] = %d\n", posicion, notas[posicion]);
    return 0;
}
```

La condición válida es `0 <= posicion && posicion < CANTIDAD`. Fíjate en el `<` estricto: `CANTIDAD` ya está afuera.

## Cuántos elementos tiene: `sizeof v / sizeof v[0]`

`sizeof` aplicado a un arreglo da su tamaño **total en bytes**. Dividido por el tamaño de un elemento, da la cantidad de elementos:

```c
#include <stdio.h>

int main(void) {
    double temperaturas[] = {21.5, 23.0, 19.8, 25.1, 22.4, 20.0, 18.7};
    size_t cantidad = sizeof temperaturas / sizeof temperaturas[0];

    printf("Bytes del arreglo: %zu\n", sizeof temperaturas);
    printf("Bytes de un elemento: %zu\n", sizeof temperaturas[0]);
    printf("Cantidad de elementos: %zu\n", cantidad);

    for (size_t i = 0; i < cantidad; i++) {
        printf("Día %zu: %.1f\n", i + 1, temperaturas[i]);
    }
    return 0;
}
```

El resultado es un `size_t` (se muestra con `%zu`), por eso los índices del ciclo también son `size_t`: así se comparan dos valores del mismo tipo sin signo.

Esta fórmula **solo funciona donde el arreglo está declarado**. Dentro de una función que recibe el arreglo como parámetro da otro número, como se explica a continuación.

## Arreglos y funciones

Una función recibe un arreglo con la notación `tipo nombre[]` y, siempre, un segundo parámetro con la cantidad de elementos:

```c
#include <stdio.h>

double promedio(const int v[], size_t n) {
    if (n == 0) {
        return 0.0;
    }
    int suma = 0;
    for (size_t i = 0; i < n; i++) {
        suma += v[i];
    }
    return (double)suma / n;
}

void sumar_a_todos(int v[], size_t n, int cantidad) {
    for (size_t i = 0; i < n; i++) {
        v[i] += cantidad;
    }
}

int main(void) {
    int puntos[] = {8, 6, 10, 7, 9};
    size_t n = sizeof puntos / sizeof puntos[0];

    printf("Promedio: %.2f\n", promedio(puntos, n));
    sumar_a_todos(puntos, n, 1);
    printf("Primer elemento después de sumar: %d\n", puntos[0]);
    printf("Promedio: %.2f\n", promedio(puntos, n));
    return 0;
}
```

Salida:

```text
Promedio: 8.00
Primer elemento después de sumar: 9
Promedio: 9.00
```

Tres cosas importantes:

1. **La función trabaja sobre el arreglo del llamador.** En `variables-parametros-y-pasaje` viste que C pasa los argumentos siempre por valor: una función que modifica un parámetro `int` no cambia la variable original. Con arreglos no se copian los elementos; lo que la función recibe le permite llegar al arreglo original, y por eso `sumar_a_todos` sí cambia `puntos`. El argumento se sigue pasando por valor; la lección `punteros-arreglos-y-estructuras` (26) explica qué valor se copia exactamente.
2. **`const` promete no modificar.** `promedio` declara `const int v[]`: si por error escribe `v[i] = 0;`, el compilador lo rechaza. Usa `const` siempre que la función solo lea.
3. **La cantidad viaja aparte.** La función no puede averiguar cuántos elementos tiene el arreglo. `sizeof v` dentro de `promedio` **no** da el tamaño del arreglo del llamador (Clang y GCC avisan con una advertencia). Por eso se calcula `n` donde el arreglo está declarado y se pasa como argumento.

## Arreglos bidimensionales

Un **arreglo bidimensional** (o matriz) organiza los datos en filas y columnas. `int m[3][4]` declara 3 filas de 4 columnas: 12 enteros en total. Cada elemento necesita dos índices, primero la fila y después la columna.

```c
int m[3][4] = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12},
};
```

```text
          col 0  col 1  col 2  col 3
fila 0      1      2      3      4
fila 1      5      6      7      8
fila 2      9     10     11     12
```

`m[1][2]` es `7`: fila 1 (la segunda), columna 2 (la tercera). Los límites valen para cada índice: filas de `0` a `2`, columnas de `0` a `3`.

### Orden por filas en memoria

En realidad, `int m[3][4]` es un arreglo de 3 elementos, y cada elemento es una fila de 4 `int`. En memoria las filas quedan una detrás de otra (**orden por filas**, en inglés *row-major*):

```text
memoria: [ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][ 9 ][10 ][11 ][12 ]
         |----- fila 0 -----||----- fila 1 -----||----- fila 2 -----|
```

Por eso `sizeof m[0]` es el tamaño de una fila completa, y recorrer la matriz fila por fila (el ciclo de la fila afuera, el de la columna adentro) visita la memoria en orden, que es lo más rápido.

### Recorrer y pasar una matriz a una función

```c
#include <stdio.h>

#define FILAS 3
#define COLUMNAS 4

void imprimir_matriz(int m[][COLUMNAS], size_t filas) {
    for (size_t f = 0; f < filas; f++) {
        for (size_t c = 0; c < COLUMNAS; c++) {
            printf("%4d", m[f][c]);
        }
        printf("\n");
    }
}

int main(void) {
    int m[FILAS][COLUMNAS] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12},
    };

    m[1][2] = 70;
    imprimir_matriz(m, FILAS);
    printf("Filas: %zu, columnas: %zu\n", sizeof m / sizeof m[0], sizeof m[0] / sizeof m[0][0]);
    return 0;
}
```

Al pasar una matriz, la cantidad de **columnas** tiene que figurar en el parámetro (`m[][COLUMNAS]`): el compilador la necesita para saber dónde empieza cada fila en esa memoria continua. La cantidad de filas viaja aparte, igual que la cantidad de elementos de un arreglo común.

## Errores comunes

- **Usar `<=` en el ciclo.** `for (size_t i = 0; i <= n; i++)` visita `v[n]`, que está fuera del límite. La condición correcta es `i < n`.
- **Confundir cantidad con último índice.** En `int v[10]`, el último índice es `9`.
- **Leer elementos sin inicializar.** Inicializa con `= {0}` o asigna antes de leer.
- **Calcular `sizeof v / sizeof v[0]` dentro de la función que recibe el arreglo.** Ahí no da la cantidad; pásala como parámetro.
- **Intentar `a = b;` entre arreglos.** No compila; se copia elemento por elemento.

## Resumen

- Un arreglo guarda una cantidad fija de elementos del mismo tipo, contiguos en memoria.
- Los índices van de `0` a `n - 1`. Salirse del límite es comportamiento indefinido y C no lo comprueba: valida los índices.
- `= {0}` pone todo en cero; los inicializadores designados eligen posiciones; C23 agrega `= {}`.
- `sizeof v / sizeof v[0]` da la cantidad de elementos, pero solo donde el arreglo está declarado.
- Una función recibe el arreglo como `const int v[]` (o `int v[]` si lo modifica) más un `size_t n`; trabaja sobre el arreglo del llamador.
- `int m[3][4]` son 3 filas de 4 columnas guardadas fila tras fila.

## Ejercicios prácticos

### Ejercicio 1: predecir la inicialización

¿Qué valores tiene cada elemento de este arreglo?

```c
int v[6] = {[2] = 5, 1, [0] = 3};
```

<details><summary>Ver solución</summary>

```text
v[0] = 3, v[1] = 0, v[2] = 5, v[3] = 1, v[4] = 0, v[5] = 0
```

`[2] = 5` ubica el 5 en el índice 2; el `1` que sigue sin designador va a la posición siguiente, la 3; `[0] = 3` ubica el 3 al principio. Los demás valen 0.

</details>

### Ejercicio 2: encontrar los errores

Este programa quiere sumar cinco números, pero tiene dos errores. Encuéntralos y corrígelos.

```c
int numeros[5] = {4, 8, 15, 16, 23};
int suma;
for (int i = 0; i <= 5; i++) {
    suma += numeros[i];
}
```

<details><summary>Ver solución</summary>

1. `suma` no está inicializada: empieza con un valor indeterminado.
2. `i <= 5` visita `numeros[5]`, fuera del límite (comportamiento indefinido).

```c
#include <stdio.h>

int main(void) {
    int numeros[5] = {4, 8, 15, 16, 23};
    size_t n = sizeof numeros / sizeof numeros[0];
    int suma = 0;

    for (size_t i = 0; i < n; i++) {
        suma += numeros[i];
    }
    printf("Suma: %d\n", suma);
    return 0;
}
```

</details>

### Ejercicio 3: consultar un día de la semana

Escribe un programa que lea las temperaturas de 7 días (validando cada lectura) y después pida un número de día del 1 al 7. Si el número está fuera de ese rango, debe mostrar un mensaje de error; si no, la temperatura de ese día. Cuidado: el usuario cuenta desde 1 y el arreglo desde 0.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

#define DIAS 7

int main(void) {
    double temperaturas[DIAS] = {0};

    for (size_t i = 0; i < DIAS; i++) {
        printf("Temperatura del día %zu: ", i + 1);
        if (scanf("%lf", &temperaturas[i]) != 1) {
            printf("Entrada inválida.\n");
            return 1;
        }
    }

    int dia;
    printf("¿Qué día quieres consultar (1 a %d)? ", DIAS);
    if (scanf("%d", &dia) != 1 || dia < 1 || dia > DIAS) {
        printf("Día fuera del límite.\n");
        return 1;
    }
    printf("El día %d hubo %.1f grados.\n", dia, temperaturas[dia - 1]);
    return 0;
}
```

El día `dia` está en el índice `dia - 1`. La validación se hace sobre el número que escribe el usuario, antes de convertirlo en índice.

</details>

### Ejercicio 4: suma por filas

Escribe una función `int suma_fila(int m[][4], size_t fila)` que devuelva la suma de una fila de una matriz `int m[3][4]`, y un `main` que muestre la suma de cada fila.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

#define FILAS 3
#define COLUMNAS 4

int suma_fila(int m[][COLUMNAS], size_t fila) {
    int suma = 0;
    for (size_t c = 0; c < COLUMNAS; c++) {
        suma += m[fila][c];
    }
    return suma;
}

int main(void) {
    int m[FILAS][COLUMNAS] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12},
    };

    for (size_t f = 0; f < FILAS; f++) {
        printf("Fila %zu: %d\n", f, suma_fila(m, f));
    }
    return 0;
}
```

Salida: `Fila 0: 10`, `Fila 1: 26`, `Fila 2: 42`.

</details>
