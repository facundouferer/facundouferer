---
title: 'Array Operations'
course: 'c'
slug: 'operaciones-con-arreglos'
order: 16
lang: 'en'
published: true
---

En la lección anterior aprendiste qué es un arreglo y cómo declarar arreglos unidimensionales y multidimensionales. Pero declarar un arreglo no alcanza. Un arreglo recién se vuelve útil cuando aprendés a **trabajar con sus elementos**.

Eso significa, por ejemplo:

- recorrerlo para leer todos sus valores
- buscar un dato dentro de él
- insertar un nuevo valor en una posición determinada
- procesar la información para obtener resultados

En esta lección vamos a concentrarnos en esas operaciones básicas, paso a paso y con ejemplos en C.

## ¿Qué significa operar con un arreglo?

Un arreglo guarda varios datos del mismo tipo en posiciones consecutivas de memoria.

Por ejemplo:

```c
int numeros[5] = {10, 20, 30, 40, 50};
```

En este caso:

- `numeros[0]` vale `10`
- `numeros[1]` vale `20`
- `numeros[2]` vale `30`
- `numeros[3]` vale `40`
- `numeros[4]` vale `50`

Trabajar con un arreglo consiste en usar su nombre y sus índices para leer o modificar sus elementos.

## Recorrido de un arreglo

**Recorrer** un arreglo significa visitar sus elementos uno por uno.

Esta es la operación más importante, porque casi todo lo que hacemos con arreglos parte de un recorrido.

### Ejemplo básico: mostrar todos los elementos

```c
#include <stdio.h>

int main() {
    int numeros[5] = {10, 20, 30, 40, 50};
    int i;

    for (i = 0; i < 5; i = i + 1) {
        printf("Posicion %d -> %d\n", i, numeros[i]);
    }

    return 0;
}
```

### ¿Qué hace este programa?

- la variable `i` empieza en `0`
- mientras `i` sea menor que `5`, el ciclo sigue
- en cada vuelta se muestra `numeros[i]`
- después `i` aumenta en `1`

Entonces el programa visita estas posiciones:

- `numeros[0]`
- `numeros[1]`
- `numeros[2]`
- `numeros[3]`
- `numeros[4]`

### Salida esperada

```text
Posicion 0 -> 10
Posicion 1 -> 20
Posicion 2 -> 30
Posicion 3 -> 40
Posicion 4 -> 50
```

## Recorrido para procesar datos

Recorrer no siempre significa mostrar valores. Muchas veces recorremos un arreglo para hacer cálculos.

### Ejemplo: sumar los elementos

```c
#include <stdio.h>

int main() {
    int numeros[5] = {3, 5, 2, 8, 4};
    int i;
    int suma = 0;

    for (i = 0; i < 5; i = i + 1) {
        suma = suma + numeros[i];
    }

    printf("La suma es: %d\n", suma);

    return 0;
}
```

### ¿Qué pasa acá?

- `suma` empieza en `0`
- en cada vuelta se agrega el valor actual del arreglo
- al final, `suma` contiene el total

### Paso a paso

Si el arreglo es `{3, 5, 2, 8, 4}`:

- al empezar, `suma = 0`
- después de leer `3`, `suma = 3`
- después de leer `5`, `suma = 8`
- después de leer `2`, `suma = 10`
- después de leer `8`, `suma = 18`
- después de leer `4`, `suma = 22`

## Recorrido para encontrar el mayor valor

Otro caso muy común es recorrer un arreglo para descubrir cuál es el mayor elemento.

```c
#include <stdio.h>

int main() {
    int numeros[5] = {12, 7, 25, 18, 9};
    int i;
    int mayor = numeros[0];

    for (i = 1; i < 5; i = i + 1) {
        if (numeros[i] > mayor) {
            mayor = numeros[i];
        }
    }

    printf("El mayor valor es: %d\n", mayor);

    return 0;
}
```

### Idea importante

Fijate esto:

```c
int mayor = numeros[0];
```

No empezamos con un valor inventado. Empezamos suponiendo que el primer elemento es el mayor. Después comparamos el resto.

Eso es una buena práctica. ¿Y sabés por qué? Porque trabajamos con un valor real del arreglo.

## Búsqueda en un arreglo

**Buscar** significa intentar encontrar un valor dentro del arreglo.

La forma más simple es la **búsqueda secuencial**. Se llama así porque revisa las posiciones una por una, desde el principio hasta el final.

### Ejemplo: buscar un número

```c
#include <stdio.h>

int main() {
    int numeros[5] = {10, 25, 30, 45, 50};
    int i;
    int buscado = 30;
    int encontrado = 0;

    for (i = 0; i < 5; i = i + 1) {
        if (numeros[i] == buscado) {
            encontrado = 1;
        }
    }

    if (encontrado == 1) {
        printf("El valor %d esta en el arreglo.\n", buscado);
    } else {
        printf("El valor %d no esta en el arreglo.\n", buscado);
    }

    return 0;
}
```

### ¿Cómo funciona?

- `buscado` guarda el valor que queremos encontrar
- `encontrado` empieza en `0`, que significa “todavía no lo encontré”
- si aparece una coincidencia, `encontrado` pasa a valer `1`

## Búsqueda mostrando la posición

Muchas veces no alcanza con saber si el dato existe. También queremos saber **en qué posición** está.

```c
#include <stdio.h>

int main() {
    int numeros[6] = {8, 14, 21, 14, 35, 42};
    int i;
    int buscado = 14;
    int posicion = -1;

    for (i = 0; i < 6; i = i + 1) {
        if (numeros[i] == buscado) {
            posicion = i;
            break;
        }
    }

    if (posicion != -1) {
        printf("El valor %d se encontro en la posicion %d.\n", buscado, posicion);
    } else {
        printf("El valor %d no se encontro.\n", buscado);
    }

    return 0;
}
```

### ¿Por qué usamos `-1`?

Porque una posición válida de un arreglo nunca puede ser `-1`.

Entonces:

- si `posicion` sigue valiendo `-1`, el dato no apareció
- si `posicion` cambia a `0`, `1`, `2`, etc., encontramos el dato

### ¿Y qué hace `break`?

`break` corta el ciclo en ese momento.

En este ejemplo nos sirve porque, una vez encontrado el valor, no hace falta seguir buscando.

## Inserción en un arreglo

**Insertar** significa agregar un nuevo dato en una posición determinada.

Acá aparece una idea MUY importante:

> en un arreglo, las posiciones ya están ocupadas o reservadas, y si querés insertar en el medio, tenés que mover elementos.

Además, recordá que el arreglo tiene un tamaño fijo. Eso significa que para insertar un dato tiene que haber lugar disponible.

## Ejemplo: insertar en el medio

```c
#include <stdio.h>

int main() {
    int numeros[6] = {10, 20, 40, 50};
    int cantidad = 4;
    int posicion = 2;
    int nuevo = 30;
    int i;

    for (i = cantidad; i > posicion; i = i - 1) {
        numeros[i] = numeros[i - 1];
    }

    numeros[posicion] = nuevo;
    cantidad = cantidad + 1;

    for (i = 0; i < cantidad; i = i + 1) {
        printf("%d ", numeros[i]);
    }

    printf("\n");

    return 0;
}
```

### ¿Qué había al comienzo?

El arreglo contenía:

```text
10 20 40 50
```

Y queríamos insertar `30` en la posición `2`.

### ¿Por qué hay que mover elementos?

Porque en la posición `2` ya estaba `40`.

Entonces hacemos lugar desplazando hacia la derecha:

- `50` pasa a la siguiente posición
- `40` pasa a la siguiente posición
- recién ahí se puede guardar `30`

### Resultado final

```text
10 20 30 40 50
```

## Explicación paso a paso del desplazamiento

Veamos este ciclo:

```c
for (i = cantidad; i > posicion; i = i - 1) {
    numeros[i] = numeros[i - 1];
}
```

Si `cantidad = 4` y `posicion = 2`:

- cuando `i = 4`, `numeros[4] = numeros[3]` → copia `50`
- cuando `i = 3`, `numeros[3] = numeros[2]` → copia `40`

Después de eso, la posición `2` queda libre para el nuevo valor.

## Error común al insertar

Un error muy común es mover los elementos desde la izquierda hacia la derecha.

Eso está mal en este caso, porque se pisan valores antes de copiarlos.

Cuando insertás en un arreglo, el desplazamiento debe hacerse **desde el final hacia la posición de inserción**.

## Arreglos bidimensionales

Un arreglo bidimensional, también llamado **matriz**, tiene filas y columnas.

Ejemplo:

```c
int matriz[2][3] = {
    {1, 2, 3},
    {4, 5, 6}
};
```

Acá hay:

- 2 filas
- 3 columnas

## Recorrido de una matriz

Para recorrer una matriz se usan normalmente dos ciclos:

- uno para las filas
- otro para las columnas

```c
#include <stdio.h>

int main() {
    int matriz[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };
    int i;
    int j;

    for (i = 0; i < 2; i = i + 1) {
        for (j = 0; j < 3; j = j + 1) {
            printf("%d ", matriz[i][j]);
        }
        printf("\n");
    }

    return 0;
}
```

### Salida esperada

```text
1 2 3
4 5 6
```

## Ejemplo: sumar todos los elementos de una matriz

```c
#include <stdio.h>

int main() {
    int matriz[2][3] = {
        {1, 2, 3},
        {4, 5, 6}
    };
    int i;
    int j;
    int suma = 0;

    for (i = 0; i < 2; i = i + 1) {
        for (j = 0; j < 3; j = j + 1) {
            suma = suma + matriz[i][j];
        }
    }

    printf("La suma total es: %d\n", suma);

    return 0;
}
```

## Errores comunes al trabajar con arreglos

### Usar una posición que no existe

Si el arreglo tiene 5 elementos, las posiciones válidas son:

- `0`
- `1`
- `2`
- `3`
- `4`

La posición `5` ya no pertenece al arreglo.

### Confundir cantidad de elementos con último índice

Si hay 5 elementos:

- la cantidad es `5`
- el último índice es `4`

No es lo mismo.

### Olvidarse de inicializar variables auxiliares

Si hacés una suma, una búsqueda o una comparación, las variables auxiliares tienen que empezar con un valor correcto.

Por ejemplo:

- `suma` suele empezar en `0`
- `encontrado` suele empezar en `0`
- `posicion` puede empezar en `-1`

## Resumen

- recorrer un arreglo es visitar sus elementos uno por uno
- un recorrido puede servir para mostrar, sumar, comparar o procesar datos
- la búsqueda secuencial revisa el arreglo desde el principio hasta el final
- insertar en un arreglo implica mover elementos cuando no se agrega al final
- una matriz se recorre con ciclos anidados

## Idea final

Los arreglos no son solo “cajas con varios datos”. Son estructuras sobre las que hacemos operaciones concretas.

Si entendés bien cómo recorrer, buscar e insertar, ya no estás mirando un arreglo como una lista estática: lo empezás a usar como una herramienta real para resolver problemas.
