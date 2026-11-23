---
title: 'Búsqueda de Datos en Arreglos'
course: 'c'
slug: 'busqueda-en-arreglos'
order: 23
lang: 'es'
published: true
---

Guardar datos es solo la mitad del trabajo. La otra mitad, muchas veces la más importante, es **encontrarlos**: el alumno con legajo 1042, el producto con código 77, la palabra en un diccionario.

En la lección de operaciones con arreglos ya buscaste un valor recorriendo el arreglo. Aquí convertimos esa idea en funciones reutilizables, aprendemos un método mucho más rápido para arreglos ordenados y, sobre todo, aprendemos a **medir** cuánto trabajo hace cada uno.

> Idea clave: la búsqueda lineal sirve siempre pero mira, en el peor caso, todos los elementos. La búsqueda binaria descarta la mitad en cada paso, pero exige que el arreglo esté **ordenado**.

## Objetivos

- Escribir una función de búsqueda lineal que devuelva el índice del elemento o `-1`.
- Contar los pasos de un algoritmo y expresarlos con la notación de complejidad `O(n)` y `O(log n)`.
- Implementar la búsqueda binaria sobre un arreglo ordenado, calculando el medio sin desbordamiento.
- Buscar registros por una clave en arreglos de estructuras.
- Elegir el método adecuado según los datos y la cantidad de búsquedas.

**Requisitos previos:** [Sentencia while](/cursos/c/sentencia-while), [Modularización, subprogramas y funciones](/cursos/c/modularizacion-subprogramas-y-funciones), [Recursividad](/cursos/c/recursividad), [Arreglos](/cursos/c/arreglos-unidimensionales-y-multidimensionales), [Operaciones con arreglos](/cursos/c/operaciones-con-arreglos), [Cadenas](/cursos/c/cadenas-de-caracteres-y-operaciones) (`strcmp`) y [Estructuras](/cursos/c/concepto-de-estructuras).

## El contrato de una función de búsqueda

Antes de escribir el algoritmo, decidamos qué recibe y qué devuelve una función de búsqueda:

- Recibe el arreglo (de solo lectura, con `const`), la cantidad de elementos y el valor buscado (la **clave**).
- Devuelve el **índice** donde está la clave, o `-1` si no está.

¿Por qué `-1`? Porque ningún índice válido es negativo, así que `-1` no se confunde con una posición real. Por eso en esta lección usamos `int` para los índices y la cantidad: necesitamos un tipo con signo para poder devolver `-1`. (Con `size_t`, que no tiene signo, habría que usar otra convención.)

Quien llama **siempre** debe comprobar el resultado antes de usarlo como índice:

```c
int pos = buscar_lineal(v, n, 42);
if (pos != -1) {
    printf("%d\n", v[pos]); /* seguro: pos es un índice válido */
}
```

Usar `v[pos]` sin comprobar sería acceder a `v[-1]`, fuera del arreglo: comportamiento indefinido.

## Búsqueda lineal (o secuencial)

Imagina una lista de nombres anotados en un papel sin ningún orden. Para encontrar a "Juan" no hay atajo: empiezas por el primero y miras uno por uno hasta encontrarlo o llegar al final.

```c
#include <stdio.h>

int buscar_lineal(const int v[], int n, int clave) {
    for (int i = 0; i < n; i++) {
        if (v[i] == clave) {
            return i; /* lo encontramos: no hace falta seguir */
        }
    }
    return -1; /* recorrimos todo y no estaba */
}

int main(void) {
    int numeros[] = {10, 5, 8, 2, 7};
    int n = (int)(sizeof numeros / sizeof numeros[0]);

    int pos = buscar_lineal(numeros, n, 8);
    if (pos != -1) {
        printf("8 está en la posición %d\n", pos);
    }

    if (buscar_lineal(numeros, n, 4) == -1) {
        printf("4 no está en el arreglo\n");
    }
    return 0;
}
```

Salida:

```text
8 está en la posición 2
4 no está en el arreglo
```

El `return i;` dentro del `for` cumple el papel del `break` que usaste en la lección de operaciones con arreglos: termina la función apenas encuentra la clave. Si hay elementos repetidos, devuelve la **primera** aparición.

La cantidad se calcula con `sizeof` como en la lección de arreglos; el cast `(int)` deja explícito que pasamos de `size_t` a `int`, lo cual es seguro porque el arreglo es pequeño.

## ¿Cuánto tarda? Contar pasos

Medir en segundos depende de la computadora. Lo que sí podemos medir de forma independiente es **cuántas comparaciones** hace el algoritmo según la cantidad de elementos `n`.

Para la búsqueda lineal en un arreglo de `n` elementos:

| Caso | Cuándo pasa | Comparaciones |
| --- | --- | --- |
| Mejor caso | la clave está en `v[0]` | 1 |
| Peor caso | la clave está al final o no está | `n` |
| Caso promedio | la clave está en una posición al azar | alrededor de `n / 2` |

Lo que más nos importa es el **peor caso**, porque es la garantía: "nunca tarda más que esto". Y en el peor caso, si el arreglo tiene el doble de elementos, la búsqueda hace el doble de comparaciones.

### La notación de complejidad

A esa relación entre el tamaño de la entrada y el trabajo la llamamos **complejidad** del algoritmo, y se escribe con la notación *O grande*:

- **`O(n)`** (lineal): el trabajo crece en proporción a `n`. La búsqueda lineal es `O(n)`.
- **`O(log n)`** (logarítmica): el trabajo crece muy despacio; duplicar `n` agrega **un solo paso**. Es la complejidad de la búsqueda binaria.
- **`O(1)`** (constante): el trabajo no depende de `n`. Acceder a `v[i]` es `O(1)`.

La notación ignora las constantes: un algoritmo que hace `n / 2` comparaciones también es `O(n)`. Lo que describe es **cómo crece** el trabajo cuando los datos crecen, que es lo que decide si un programa sigue siendo usable con un millón de datos.

## Búsqueda binaria

La búsqueda binaria es muchísimo más rápida, pero tiene un requisito: el arreglo **tiene que estar ordenado**. Si no lo está, el resultado es incorrecto (no se rompe el programa: simplemente responde mal).

### La analogía del diccionario

Para buscar "programa" en un diccionario de papel no empiezas por la primera página. Lo abres por la mitad:

1. Si la palabra que ves va **después** de "programa", descartas toda la segunda mitad.
2. Si va **antes**, descartas la primera mitad.
3. Repites con la mitad que queda hasta encontrarla o hasta que no quede nada.

Cada vez que miras una página, descartas la mitad de lo que quedaba.

### El algoritmo

Mantenemos dos índices, `inicio` y `fin`, que marcan la zona donde la clave **todavía puede estar**. Al comienzo es todo el arreglo.

```c
#include <stdio.h>

int buscar_binaria(const int v[], int n, int clave) {
    int inicio = 0;
    int fin = n - 1;

    while (inicio <= fin) {               /* mientras la zona no esté vacía */
        int medio = inicio + (fin - inicio) / 2;

        if (v[medio] == clave) {
            return medio;
        }
        if (v[medio] < clave) {
            inicio = medio + 1;            /* la clave solo puede estar a la derecha */
        } else {
            fin = medio - 1;               /* la clave solo puede estar a la izquierda */
        }
    }
    return -1;                             /* la zona quedó vacía */
}

int main(void) {
    int v[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = (int)(sizeof v / sizeof v[0]);

    printf("23 está en la posición %d\n", buscar_binaria(v, n, 23));
    printf("40 devuelve %d\n", buscar_binaria(v, n, 40));
    return 0;
}
```

Salida:

```text
23 está en la posición 5
40 devuelve -1
```

### Seguimiento paso a paso

Busquemos `23` en `{2, 5, 8, 12, 16, 23, 38, 56, 72, 91}`:

| Paso | `inicio` | `fin` | `medio` | `v[medio]` | Decisión |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 9 | 4 | 16 | 16 < 23: `inicio = 5` |
| 2 | 5 | 9 | 7 | 56 | 56 > 23: `fin = 6` |
| 3 | 5 | 6 | 5 | 23 | encontrado en 5 |

Tres comparaciones en lugar de seis. Y si buscamos `40`:

| Paso | `inicio` | `fin` | `medio` | `v[medio]` | Decisión |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 9 | 4 | 16 | 16 < 40: `inicio = 5` |
| 2 | 5 | 9 | 7 | 56 | 56 > 40: `fin = 6` |
| 3 | 5 | 6 | 5 | 23 | 23 < 40: `inicio = 6` |
| 4 | 6 | 6 | 6 | 38 | 38 < 40: `inicio = 7` |
| 5 | 7 | 6 | | | `inicio > fin`: zona vacía, devuelve `-1` |

Los detalles que hacen correcto al algoritmo:

- **`inicio <= fin`, no `<`**: cuando `inicio == fin` queda un elemento por revisar.
- **`medio + 1` y `medio - 1`**: `v[medio]` ya se comparó, así que se excluye. Si escribieras `inicio = medio`, en algunos casos la zona dejaría de achicarse y el ciclo no terminaría nunca.

### El medio sin desbordamiento

¿Por qué `inicio + (fin - inicio) / 2` y no la fórmula obvia `(inicio + fin) / 2`? Matemáticamente dan lo mismo, pero en C la suma `inicio + fin` se calcula con `int`, y si los dos índices son grandes la suma puede superar `INT_MAX`. El desbordamiento de un entero con signo es **comportamiento indefinido** (lo viste en la lección de operadores).

Con `int` de 32 bits, `INT_MAX` es 2 147 483 647. Si `inicio` vale 1 500 000 000 y `fin` vale 2 000 000 000, la suma no entra en un `int`. En cambio `fin - inicio` (500 000 000) siempre es un valor que entra, y sumarle la mitad a `inicio` nunca pasa de `fin`.

Con arreglos chicos no se nota, pero este error estuvo durante años en implementaciones de bibliotecas muy usadas. Escribe siempre la forma segura.

### Por qué es `O(log n)`

Cada comparación divide la zona a la mitad. Empezando con `n` elementos, después de `k` pasos quedan unos `n / 2^k`. La búsqueda termina cuando queda un elemento, es decir, después de unos `log₂ n` pasos. Eso es `O(log n)`.

Contemos el peor caso de cada método:

| Elementos `n` | Búsqueda lineal `O(n)` | Búsqueda binaria `O(log n)` |
| --- | --- | --- |
| 10 | 10 | 4 |
| 1 000 | 1 000 | 10 |
| 1 000 000 | 1 000 000 | 20 |
| 1 000 000 000 | 1 000 000 000 | 30 |

Con mil millones de datos, la búsqueda binaria hace a lo sumo 30 comparaciones. Puedes comprobarlo contando los pasos en un programa:

```c
#include <stdio.h>

#define N 1024

int pasos_lineal(const int v[], int n, int clave) {
    int pasos = 0;
    for (int i = 0; i < n; i++) {
        pasos++;
        if (v[i] == clave) {
            break;
        }
    }
    return pasos;
}

int pasos_binaria(const int v[], int n, int clave) {
    int pasos = 0;
    int inicio = 0;
    int fin = n - 1;
    while (inicio <= fin) {
        int medio = inicio + (fin - inicio) / 2;
        pasos++;
        if (v[medio] == clave) {
            break;
        }
        if (v[medio] < clave) {
            inicio = medio + 1;
        } else {
            fin = medio - 1;
        }
    }
    return pasos;
}

int main(void) {
    int v[N];
    for (int i = 0; i < N; i++) {
        v[i] = 2 * i; /* 0, 2, 4, ...: ordenado */
    }

    int clave = v[N - 1]; /* el último: peor caso para la lineal */
    printf("n = %d\n", N);
    printf("lineal:  %d pasos\n", pasos_lineal(v, N, clave));
    printf("binaria: %d pasos\n", pasos_binaria(v, N, clave));
    return 0;
}
```

Salida:

```text
n = 1024
lineal:  1024 pasos
binaria: 11 pasos
```

Prueba a cambiar `N` por 2048: la lineal duplica sus pasos y la binaria suma solo uno.

## Buscar en arreglos de estructuras

En la práctica casi nunca buscamos un número suelto: buscamos un **registro** a partir de una **clave**, como el legajo de un alumno o el código de un producto. El algoritmo es el mismo; lo único que cambia es qué campo se compara.

```c
#include <stdio.h>
#include <string.h>

typedef struct {
    int legajo;
    char nombre[40];
    double promedio;
} Alumno;

/* Búsqueda lineal por nombre: sirve aunque el arreglo no esté ordenado. */
int buscar_por_nombre(const Alumno v[], int n, const char nombre[]) {
    for (int i = 0; i < n; i++) {
        if (strcmp(v[i].nombre, nombre) == 0) {
            return i;
        }
    }
    return -1;
}

/* Búsqueda binaria por legajo: el arreglo debe estar ordenado por legajo. */
int buscar_por_legajo(const Alumno v[], int n, int legajo) {
    int inicio = 0;
    int fin = n - 1;
    while (inicio <= fin) {
        int medio = inicio + (fin - inicio) / 2;
        if (v[medio].legajo == legajo) {
            return medio;
        }
        if (v[medio].legajo < legajo) {
            inicio = medio + 1;
        } else {
            fin = medio - 1;
        }
    }
    return -1;
}

int main(void) {
    Alumno curso[] = {
        {.legajo = 1003, .nombre = "Ana", .promedio = 8.5},
        {.legajo = 1010, .nombre = "Luis", .promedio = 6.0},
        {.legajo = 1021, .nombre = "Marta", .promedio = 9.25},
        {.legajo = 1042, .nombre = "Pedro", .promedio = 7.5},
    };
    int n = (int)(sizeof curso / sizeof curso[0]);

    int pos = buscar_por_legajo(curso, n, 1021);
    if (pos != -1) {
        printf("Legajo 1021: %s, promedio %.2f\n", curso[pos].nombre, curso[pos].promedio);
    }

    pos = buscar_por_nombre(curso, n, "Pedro");
    if (pos != -1) {
        printf("Pedro tiene legajo %d\n", curso[pos].legajo);
    }

    if (buscar_por_legajo(curso, n, 2000) == -1) {
        printf("No hay alumno con legajo 2000\n");
    }
    return 0;
}
```

Salida:

```text
Legajo 1021: Marta, promedio 9.25
Pedro tiene legajo 1042
No hay alumno con legajo 2000
```

Observa que el arreglo está ordenado **por legajo**, no por nombre. La búsqueda binaria solo funciona con la clave por la que se ordenó. Para buscar por nombre en este arreglo hay que usar la búsqueda lineal (u ordenar otra copia por nombre).

La función devuelve el **índice**, no el registro. Así quien llama decide qué hacer con él: leer campos, modificarlos en el arreglo o simplemente saber si existe.

## ¿Cuál conviene usar?

- **Datos desordenados y pocas búsquedas:** búsqueda lineal. Ordenar primero cuesta más que lo que ahorrarías.
- **Muchas búsquedas sobre los mismos datos:** ordenar una vez (próxima lección) y después usar búsqueda binaria. El costo de ordenar se reparte entre todas las búsquedas.
- **Datos que cambian todo el tiempo:** mantener el arreglo ordenado obliga a desplazar elementos en cada inserción (como viste en operaciones con arreglos). Más adelante verás estructuras que resuelven mejor ese caso, como los árboles binarios de búsqueda.

La biblioteca estándar también tiene una búsqueda binaria genérica, `bsearch` (en `<stdlib.h>`). Para usarla hay que pasarle una función de comparación, así que la verás junto con `qsort` después de la lección [Punteros, arreglos y estructuras](/cursos/c/punteros-arreglos-y-estructuras) (26).

## Errores comunes

- **Usar búsqueda binaria en un arreglo desordenado.** No hay error de compilación: simplemente devuelve `-1` para elementos que sí están.
- **Ordenar por un campo y buscar por otro.**
- **Usar el resultado sin comprobar `-1`** (`v[pos]` con `pos == -1` accede fuera del arreglo).
- **`while (inicio < fin)`** en lugar de `<=`: se saltea el último elemento candidato.
- **`inicio = medio` o `fin = medio`**: la zona puede dejar de achicarse y el ciclo no termina.
- **`(inicio + fin) / 2`** con índices grandes: desbordamiento de `int`.

## Resumen

- Una función de búsqueda devuelve el índice de la clave o `-1`; quien llama comprueba el resultado.
- La búsqueda lineal funciona con cualquier arreglo y hace `n` comparaciones en el peor caso: `O(n)`.
- La búsqueda binaria exige un arreglo ordenado y descarta la mitad en cada paso: `O(log n)`.
- El medio se calcula con `inicio + (fin - inicio) / 2` para evitar el desbordamiento.
- En arreglos de estructuras se busca por un campo clave; la búsqueda binaria solo sirve con la clave por la que se ordenó.
- La complejidad describe cómo crece el trabajo con el tamaño de los datos.

## Ejercicios prácticos

### Ejercicio 1: seguimiento de la búsqueda binaria

Haz la tabla de seguimiento (`inicio`, `fin`, `medio`, `v[medio]`, decisión) para buscar `72` y luego `3` en el arreglo `{2, 5, 8, 12, 16, 23, 38, 56, 72, 91}`. ¿Cuántas comparaciones hace cada búsqueda?

<details><summary>Ver solución</summary>

Buscando `72`:

| Paso | `inicio` | `fin` | `medio` | `v[medio]` | Decisión |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 9 | 4 | 16 | 16 < 72: `inicio = 5` |
| 2 | 5 | 9 | 7 | 56 | 56 < 72: `inicio = 8` |
| 3 | 8 | 9 | 8 | 72 | encontrado en 8 |

Tres comparaciones.

Buscando `3`:

| Paso | `inicio` | `fin` | `medio` | `v[medio]` | Decisión |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 9 | 4 | 16 | 16 > 3: `fin = 3` |
| 2 | 0 | 3 | 1 | 5 | 5 > 3: `fin = 0` |
| 3 | 0 | 0 | 0 | 2 | 2 < 3: `inicio = 1` |
| 4 | 1 | 0 | | | zona vacía: `-1` |

Tres comparaciones, y la cuarta vuelta solo comprueba que la zona quedó vacía. Con 10 elementos nunca se necesitan más de 4 comparaciones (`log₂ 10` es un poco más de 3).

</details>

### Ejercicio 2: contar apariciones

Escribe `int contar(const int v[], int n, int clave)` que devuelva cuántas veces aparece `clave` en un arreglo desordenado. ¿Cuál es su complejidad? ¿Por qué aquí no sirve cortar el recorrido al encontrar la primera?

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int contar(const int v[], int n, int clave) {
    int cantidad = 0;
    for (int i = 0; i < n; i++) {
        if (v[i] == clave) {
            cantidad++;
        }
    }
    return cantidad;
}

int main(void) {
    int dados[] = {3, 6, 1, 6, 2, 6, 5};
    int n = (int)(sizeof dados / sizeof dados[0]);
    printf("El 6 salió %d veces\n", contar(dados, n, 6));
    printf("El 4 salió %d veces\n", contar(dados, n, 4));
    return 0;
}
```

Salida:

```text
El 6 salió 3 veces
El 4 salió 0 veces
```

Es `O(n)` y además siempre recorre los `n` elementos (no hay mejor caso más corto): una aparición puede estar en cualquier posición, así que no se puede saber que no hay más sin mirar todas.

</details>

### Ejercicio 3: buscar un producto por código

Con este tipo:

```c
typedef struct {
    int codigo;
    char nombre[30];
    double precio;
} Producto;
```

escribe una búsqueda binaria `int buscar_producto(const Producto v[], int n, int codigo)` para un arreglo ordenado por código, y un programa que muestre el nombre y el precio del producto 77, o un mensaje si no existe.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

typedef struct {
    int codigo;
    char nombre[30];
    double precio;
} Producto;

int buscar_producto(const Producto v[], int n, int codigo) {
    int inicio = 0;
    int fin = n - 1;
    while (inicio <= fin) {
        int medio = inicio + (fin - inicio) / 2;
        if (v[medio].codigo == codigo) {
            return medio;
        }
        if (v[medio].codigo < codigo) {
            inicio = medio + 1;
        } else {
            fin = medio - 1;
        }
    }
    return -1;
}

int main(void) {
    Producto catalogo[] = {
        {12, "Yerba", 2500.0},
        {35, "Azucar", 1200.0},
        {77, "Cafe", 4800.0},
        {90, "Te", 900.0},
    };
    int n = (int)(sizeof catalogo / sizeof catalogo[0]);

    int pos = buscar_producto(catalogo, n, 77);
    if (pos != -1) {
        printf("%s: %.2f\n", catalogo[pos].nombre, catalogo[pos].precio);
    } else {
        printf("No existe el producto 77\n");
    }
    return 0;
}
```

Salida:

```text
Cafe: 4800.00
```

</details>

### Ejercicio 4: búsqueda binaria recursiva

Escribe una versión recursiva `int binaria_rec(const int v[], int inicio, int fin, int clave)`, usando lo que viste en la lección de recursividad. ¿Cuál es el caso base? ¿Cuántas llamadas se apilan como máximo para un arreglo de 1000 elementos?

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int binaria_rec(const int v[], int inicio, int fin, int clave) {
    if (inicio > fin) {
        return -1; /* caso base: zona vacía */
    }
    int medio = inicio + (fin - inicio) / 2;
    if (v[medio] == clave) {
        return medio; /* caso base: encontrado */
    }
    if (v[medio] < clave) {
        return binaria_rec(v, medio + 1, fin, clave);
    }
    return binaria_rec(v, inicio, medio - 1, clave);
}

int main(void) {
    int v[] = {1, 4, 9, 16, 25, 36, 49};
    int n = (int)(sizeof v / sizeof v[0]);
    printf("%d\n", binaria_rec(v, 0, n - 1, 36));
    printf("%d\n", binaria_rec(v, 0, n - 1, 10));
    return 0;
}
```

Salida:

```text
5
-1
```

Hay dos casos base: la zona vacía (`inicio > fin`) y la clave encontrada. Cada llamada recursiva trabaja con la mitad de la zona, así que para 1000 elementos hay como mucho unas 10 u 11 llamadas apiladas: la profundidad de la recursión también es `O(log n)`, por eso esta recursión no pone en riesgo la pila.

</details>
