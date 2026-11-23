---
title: 'Ordenación de Arreglos'
course: 'c'
slug: 'ordenacion-de-arreglos'
order: 24
lang: 'es'
published: true
---

Ordenar datos no es una cuestión de estética. Un arreglo ordenado permite usar la búsqueda binaria (lección anterior), encontrar el mínimo y el máximo en sus extremos, detectar repetidos porque quedan juntos y mostrar listados que una persona puede leer.

En esta lección estudiamos los tres métodos clásicos para empezar: **burbuja**, **selección** e **inserción**. Los tres son cortos y fáciles de seguir a mano, y nos sirven para aprender a comparar algoritmos: cuántas comparaciones hacen, cuánta memoria extra usan y si respetan el orden de los elementos iguales.

> Idea clave: los tres métodos son `O(n²)` en el peor caso, pero no son iguales. Burbuja (con corte temprano) e inserción terminan rápido si el arreglo ya está casi ordenado; selección hace siempre el mismo trabajo, pero muy pocos intercambios.

## Objetivos

- Intercambiar dos elementos de un arreglo con una variable auxiliar.
- Implementar y seguir paso a paso burbuja, selección e inserción.
- Calcular la complejidad temporal de cada método (`O(n²)`, y `O(n)` en el mejor caso cuando corresponde) y su complejidad espacial.
- Explicar qué es un ordenamiento **estable** y por qué importa.
- Ordenar arreglos de estructuras por un campo.
- Elegir un método según los datos.

**Requisitos previos:** [Sentencia for](/cursos/c/sentencia-for), [Variables, parámetros y pasaje](/cursos/c/variables-parametros-y-pasaje), [Arreglos](/cursos/c/arreglos-unidimensionales-y-multidimensionales), [Cadenas](/cursos/c/cadenas-de-caracteres-y-operaciones) (`strcmp`), [Estructuras](/cursos/c/concepto-de-estructuras) y [Búsqueda en arreglos](/cursos/c/busqueda-en-arreglos) (complejidad).

## El intercambio (swap)

Los tres métodos mueven elementos de lugar. La operación básica es **intercambiar** dos posiciones. Imagina una copa con jugo y otra con agua: para intercambiar los contenidos necesitas una **tercera copa vacía**. En C, esa copa es una variable auxiliar:

```c
int aux = v[i]; /* guardamos v[i] en la copa auxiliar */
v[i] = v[j];    /* ponemos v[j] en la posición i */
v[j] = aux;     /* ponemos lo que guardamos en la posición j */
```

Si escribes solo `v[i] = v[j]; v[j] = v[i];`, pierdes el valor original de `v[i]` en la primera línea y terminas con dos copias de `v[j]`.

Conviene escribirlo una vez como función. Como recibe el **arreglo**, la función llega a los elementos del llamador:

```c
void intercambiar(int v[], int i, int j) {
    int aux = v[i];
    v[i] = v[j];
    v[j] = aux;
}
```

En cambio, `void intercambiar(int a, int b)` **no** funcionaría: C pasa los argumentos por valor, así que la función recibiría copias de los dos números e intercambiaría las copias. Para intercambiar dos variables sueltas hace falta pasar sus direcciones, lo que verás en [Punteros y direcciones](/cursos/c/punteros-y-direcciones) (25).

## 1. Método de la burbuja (bubble sort)

Se llama así porque los valores grandes "suben" hacia el final del arreglo como burbujas.

**Idea:** recorre el arreglo comparando cada par de **vecinos**. Si el de la izquierda es mayor que el de la derecha, los intercambia. Al terminar la primera pasada, el mayor de todos quedó en la última posición. La segunda pasada lleva el segundo mayor a la anteúltima, y así sucesivamente.

**Corte temprano:** si en una pasada completa no hubo ningún intercambio, el arreglo ya está ordenado y no hace falta seguir. Una variable `bool` lo registra.

```c
void ordenar_burbuja(int v[], int n) {
    for (int pasada = 0; pasada < n - 1; pasada++) {
        bool hubo_intercambio = false;
        /* los últimos 'pasada' elementos ya están en su lugar */
        for (int j = 0; j < n - 1 - pasada; j++) {
            if (v[j] > v[j + 1]) {
                intercambiar(v, j, j + 1);
                hubo_intercambio = true;
            }
        }
        if (!hubo_intercambio) {
            break;
        }
    }
}
```

Seguimiento con `{5, 1, 4, 2, 8}`:

| Pasada | Arreglo al terminar la pasada | ¿Hubo intercambios? |
| --- | --- | --- |
| 1 | `{1, 4, 2, 5, 8}` | sí (el 5 burbujeó hasta antes del 8) |
| 2 | `{1, 2, 4, 5, 8}` | sí |
| 3 | `{1, 2, 4, 5, 8}` | no: corte temprano |

**Complejidad:**

- **Peor caso** (arreglo invertido): la pasada 1 hace `n - 1` comparaciones, la 2 hace `n - 2`, ..., la última 1. En total `n(n - 1) / 2`, que es `O(n²)`.
- **Mejor caso** (arreglo ya ordenado): una sola pasada sin intercambios y corta: `n - 1` comparaciones, `O(n)`. Sin la variable `hubo_intercambio`, el mejor caso también sería `O(n²)`.

## 2. Método de selección (selection sort)

**Idea:** el arreglo se divide en una parte ordenada (al principio, inicialmente vacía) y una parte desordenada. En cada paso se **selecciona** el mínimo de la parte desordenada y se lo intercambia con la primera posición de esa parte.

```c
void ordenar_seleccion(int v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minimo = i;                  /* suponemos que el mínimo está en i */
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[minimo]) {
                minimo = j;              /* encontramos uno menor */
            }
        }
        intercambiar(v, i, minimo);     /* lo llevamos a su lugar definitivo */
    }
}
```

Seguimiento con `{29, 10, 14, 37, 13}`:

| `i` | Mínimo de la parte desordenada | Arreglo después del intercambio |
| --- | --- | --- |
| 0 | 10 (posición 1) | `{10, 29, 14, 37, 13}` |
| 1 | 13 (posición 4) | `{10, 13, 14, 37, 29}` |
| 2 | 14 (posición 2) | `{10, 13, 14, 37, 29}` |
| 3 | 29 (posición 4) | `{10, 13, 14, 29, 37}` |

**Complejidad:**

- Siempre hace `n(n - 1) / 2` comparaciones, esté como esté el arreglo: es `O(n²)` en el mejor, el promedio y el peor caso. Para saber cuál es el mínimo hay que mirar toda la parte desordenada.
- Hace exactamente `n - 1` intercambios (uno por posición). Es su gran ventaja cuando mover un elemento es caro, por ejemplo con registros grandes.

## 3. Método de inserción (insertion sort)

Es la forma en que mucha gente ordena las cartas en la mano: tomas una carta nueva y la **insertas** en su lugar entre las que ya tienes ordenadas.

**Idea:** la parte izquierda `v[0..i-1]` ya está ordenada. Se toma `v[i]`, se desplazan una posición a la derecha todos los elementos mayores que él, y se lo coloca en el hueco que queda.

```c
void ordenar_insercion(int v[], int n) {
    for (int i = 1; i < n; i++) {
        int actual = v[i];
        int j = i - 1;
        /* desplazamos a la derecha los mayores que 'actual' */
        while (j >= 0 && v[j] > actual) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = actual;               /* lo insertamos en el hueco */
    }
}
```

Es el mismo desplazamiento que usaste para insertar en el medio de un arreglo en la lección de operaciones con arreglos. La condición `j >= 0` va **primero**: gracias al cortocircuito de `&&`, cuando `j` llega a `-1` no se evalúa `v[-1]`.

Seguimiento con `{5, 2, 4, 6, 1}`:

| `i` | `actual` | Arreglo después de insertar |
| --- | --- | --- |
| 1 | 2 | `{2, 5, 4, 6, 1}` |
| 2 | 4 | `{2, 4, 5, 6, 1}` |
| 3 | 6 | `{2, 4, 5, 6, 1}` (no se desplaza nada) |
| 4 | 1 | `{1, 2, 4, 5, 6}` |

**Complejidad:**

- **Peor caso** (arreglo invertido): cada elemento se desplaza hasta el principio: `n(n - 1) / 2` comparaciones, `O(n²)`.
- **Mejor caso** (ya ordenado): cada elemento se compara una vez con su vecino y no se mueve: `n - 1` comparaciones, `O(n)`.
- Con un arreglo **casi** ordenado está muy cerca del mejor caso. Por eso inserción es la mejor opción de las tres en la práctica para arreglos chicos o casi ordenados.

## Los tres métodos en un programa

```c
#include <stdbool.h>
#include <stdio.h>

void intercambiar(int v[], int i, int j) {
    int aux = v[i];
    v[i] = v[j];
    v[j] = aux;
}

void ordenar_burbuja(int v[], int n) {
    for (int pasada = 0; pasada < n - 1; pasada++) {
        bool hubo_intercambio = false;
        for (int j = 0; j < n - 1 - pasada; j++) {
            if (v[j] > v[j + 1]) {
                intercambiar(v, j, j + 1);
                hubo_intercambio = true;
            }
        }
        if (!hubo_intercambio) {
            break;
        }
    }
}

void ordenar_seleccion(int v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minimo = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[minimo]) {
                minimo = j;
            }
        }
        intercambiar(v, i, minimo);
    }
}

void ordenar_insercion(int v[], int n) {
    for (int i = 1; i < n; i++) {
        int actual = v[i];
        int j = i - 1;
        while (j >= 0 && v[j] > actual) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = actual;
    }
}

void mostrar(const char titulo[], const int v[], int n) {
    printf("%-10s", titulo);
    for (int i = 0; i < n; i++) {
        printf(" %d", v[i]);
    }
    printf("\n");
}

int main(void) {
    int a[] = {29, 10, 14, 37, 13, 5};
    int b[] = {29, 10, 14, 37, 13, 5};
    int c[] = {29, 10, 14, 37, 13, 5};
    int n = (int)(sizeof a / sizeof a[0]);

    mostrar("original:", a, n);
    ordenar_burbuja(a, n);
    ordenar_seleccion(b, n);
    ordenar_insercion(c, n);
    mostrar("burbuja:", a, n);
    mostrar("seleccion:", b, n);
    mostrar("insercion:", c, n);
    return 0;
}
```

Salida:

```text
original:  29 10 14 37 13 5
burbuja:   5 10 13 14 29 37
seleccion: 5 10 13 14 29 37
insercion: 5 10 13 14 29 37
```

## Contar comparaciones

Igual que con la búsqueda, podemos comprobar la complejidad contando. Si agregas un contador en la comparación de cada método y los ejecutas con `n = 100`, obtienes:

| Método | Arreglo ya ordenado | Arreglo invertido |
| --- | --- | --- |
| Burbuja (con corte temprano) | 99 | 4950 |
| Selección | 4950 | 4950 |
| Inserción | 99 | 4950 |

`4950` es `100 · 99 / 2`. Si duplicas `n` a 200, el peor caso pasa a 19 900: **cuatro veces** más trabajo por el doble de datos. Eso es lo que significa `O(n²)`, y por qué estos métodos dejan de servir con cientos de miles de elementos.

## Complejidad espacial

La **complejidad espacial** mide cuánta memoria **extra** usa el algoritmo además del propio arreglo. Los tres métodos ordenan **en el lugar** (*in place*): solo usan unas pocas variables (`aux`, `minimo`, `actual`, `j`), sin importar el tamaño del arreglo. Su complejidad espacial es `O(1)`.

Otros algoritmos más rápidos, como el *merge sort*, necesitan un arreglo auxiliar del mismo tamaño: `O(n)` de memoria extra a cambio de tiempo `O(n log n)`.

## Estabilidad

Un ordenamiento es **estable** si los elementos con la **misma clave** conservan el orden relativo que tenían antes de ordenar.

Con números sueltos no se nota: un 7 es igual a otro 7. Pero al ordenar **registros** sí importa. Supón una lista de alumnos ya ordenada alfabéticamente, que ahora ordenas por nota. Con un método estable, los alumnos con la misma nota quedan en orden alfabético entre sí. Con uno inestable, ese orden se puede perder.

- **Burbuja** es estable: solo intercambia vecinos cuando el de la izquierda es **estrictamente mayor** (`>`). Dos iguales nunca se cruzan.
- **Inserción** es estable por la misma razón: deja de desplazar al encontrar uno **igual o menor** (la condición es `v[j] > actual`, no `>=`).
- **Selección no es estable**: el intercambio de larga distancia puede saltar por encima de un elemento igual.

Veamos el contraejemplo de selección con registros:

```c
#include <stdio.h>

typedef struct {
    char nombre[20];
    int nota;
} Alumno;

void ordenar_seleccion_por_nota(Alumno v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minimo = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j].nota < v[minimo].nota) {
                minimo = j;
            }
        }
        Alumno aux = v[i];
        v[i] = v[minimo];
        v[minimo] = aux;
    }
}

void ordenar_insercion_por_nota(Alumno v[], int n) {
    for (int i = 1; i < n; i++) {
        Alumno actual = v[i];
        int j = i - 1;
        while (j >= 0 && v[j].nota > actual.nota) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = actual;
    }
}

void mostrar(const char titulo[], const Alumno v[], int n) {
    printf("%s", titulo);
    for (int i = 0; i < n; i++) {
        printf(" %s(%d)", v[i].nombre, v[i].nota);
    }
    printf("\n");
}

int main(void) {
    Alumno a[] = {{"Bea", 7}, {"Ana", 7}, {"Ciro", 5}};
    Alumno b[] = {{"Bea", 7}, {"Ana", 7}, {"Ciro", 5}};
    int n = (int)(sizeof a / sizeof a[0]);

    ordenar_seleccion_por_nota(a, n);
    ordenar_insercion_por_nota(b, n);
    mostrar("seleccion:", a, n);
    mostrar("insercion:", b, n);
    return 0;
}
```

Salida:

```text
seleccion: Ciro(5) Ana(7) Bea(7)
insercion: Ciro(5) Bea(7) Ana(7)
```

Al principio Bea estaba antes que Ana, y las dos tienen 7. En el primer paso, selección intercambia la posición 0 (Bea) con el mínimo, Ciro, que estaba en la posición 2: Bea salta por encima de Ana. Inserción, en cambio, conserva el orden original de las dos.

## Ordenar arreglos de estructuras por un campo

El programa anterior ya muestra cómo se ordena un arreglo de estructuras. Hay solo dos diferencias con un arreglo de enteros:

1. **La comparación usa un campo** (`v[j].nota > actual.nota`). Para ordenar por un texto se usa `strcmp`: `strcmp(v[j].nombre, actual.nombre) > 0` significa "va después en orden alfabético".
2. **El intercambio y el desplazamiento copian registros completos** (`Alumno aux = v[i];`). Como viste en la lección de estructuras, la asignación copia todos los campos. Con registros grandes, cada movimiento cuesta más, y ahí la poca cantidad de intercambios de selección es una ventaja.

Para ordenar de mayor a menor basta con invertir la comparación (`<` en lugar de `>`), cuidando de seguir usando una comparación estricta para no perder la estabilidad.

## Comparación de los tres métodos

| Método | Mejor caso | Promedio | Peor caso | Intercambios | Espacio extra | Estable |
| --- | --- | --- | --- | --- | --- | --- |
| Burbuja (con corte) | `O(n)` | `O(n²)` | `O(n²)` | muchos, `O(n²)` | `O(1)` | sí |
| Selección | `O(n²)` | `O(n²)` | `O(n²)` | `n - 1`, `O(n)` | `O(1)` | no |
| Inserción | `O(n)` | `O(n²)` | `O(n²)` | desplazamientos, `O(n²)` | `O(1)` | sí |

¿Cuál usar?

- **Inserción**: la mejor opción general de las tres para arreglos chicos o casi ordenados. Estable.
- **Selección**: cuando mover elementos es caro y no importa la estabilidad.
- **Burbuja**: sobre todo didáctico; con corte temprano detecta rápido un arreglo ya ordenado.

Para arreglos grandes existen algoritmos `O(n log n)` (como *merge sort* o *quicksort*). La biblioteca estándar de C trae uno listo para usar: **`qsort`**, en `<stdlib.h>`, que ordena arreglos de cualquier tipo. Para usarlo hay que pasarle una función que compare dos elementos, y eso requiere punteros: lo verás después de la lección [Punteros, arreglos y estructuras](/cursos/c/punteros-arreglos-y-estructuras) (26). El estándar **no** garantiza que `qsort` sea estable.

## Errores comunes

- **Intercambiar sin variable auxiliar** y perder un valor.
- **Recorrer de más**: en burbuja, el ciclo interno compara `v[j]` con `v[j + 1]`, así que debe terminar en `j < n - 1 - pasada`. Con `j < n`, cuando `j` vale `n - 1` se lee `v[n]`, fuera del arreglo. (Restar `pasada` no es necesario para que el resultado sea correcto, pero evita comparar lo que ya está en su lugar.)
- **Invertir el orden de la condición en inserción**: `v[j] > actual && j >= 0` evalúa `v[-1]` antes de comprobar `j`.
- **Usar `>=`** en burbuja o inserción: el resultado sigue ordenado, pero el método deja de ser estable (y burbuja hace intercambios innecesarios).
- **Ordenar por un campo y buscar con búsqueda binaria por otro.**

## Resumen

- El intercambio necesita una variable auxiliar; una función que recibe el arreglo puede intercambiar sus elementos.
- Burbuja compara vecinos; selección elige el mínimo; inserción inserta cada elemento en la parte ya ordenada.
- Los tres tienen complejidad temporal `O(n²)` en el peor caso; burbuja con corte e inserción son `O(n)` en el mejor caso.
- Los tres tienen complejidad espacial `O(1)`: ordenan en el lugar.
- Burbuja e inserción son estables; selección no.
- Para ordenar estructuras se compara un campo y se mueven registros completos.
- `qsort` es la herramienta estándar; la verás después de punteros.

## Ejercicios prácticos

### Ejercicio 1: seguimiento de burbuja

Escribe cómo queda el arreglo `{4, 3, 2, 1}` después de cada pasada de burbuja con corte temprano. ¿Cuántas comparaciones e intercambios hace en total? ¿Por qué es el peor caso?

<details><summary>Ver solución</summary>

| Pasada | Arreglo | Comparaciones | Intercambios |
| --- | --- | --- | --- |
| 1 | `{3, 2, 1, 4}` | 3 | 3 |
| 2 | `{2, 1, 3, 4}` | 2 | 2 |
| 3 | `{1, 2, 3, 4}` | 1 | 1 |

En total 6 comparaciones y 6 intercambios, que es `4 · 3 / 2`. Es el peor caso porque el arreglo está invertido: cada comparación encuentra un par desordenado, así que hay intercambio en todas, y el corte temprano nunca se activa (después de la tercera pasada el ciclo termina solo).

</details>

### Ejercicio 2: comprobar si un arreglo está ordenado

Escribe `bool esta_ordenado(const int v[], int n)` que devuelva `true` si el arreglo está en orden ascendente. ¿Cuál es su complejidad? Úsala para comprobar el resultado de `ordenar_insercion`.

<details><summary>Ver solución</summary>

```c
#include <stdbool.h>
#include <stdio.h>

bool esta_ordenado(const int v[], int n) {
    for (int i = 1; i < n; i++) {
        if (v[i - 1] > v[i]) {
            return false;
        }
    }
    return true;
}

void ordenar_insercion(int v[], int n) {
    for (int i = 1; i < n; i++) {
        int actual = v[i];
        int j = i - 1;
        while (j >= 0 && v[j] > actual) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = actual;
    }
}

int main(void) {
    int v[] = {8, 3, 9, 1, 4};
    int n = (int)(sizeof v / sizeof v[0]);

    printf("antes: %s\n", esta_ordenado(v, n) ? "ordenado" : "desordenado");
    ordenar_insercion(v, n);
    printf("después: %s\n", esta_ordenado(v, n) ? "ordenado" : "desordenado");
    return 0;
}
```

Salida:

```text
antes: desordenado
después: ordenado
```

Es `O(n)`: en el peor caso compara cada par de vecinos una vez. Es mucho más barato que ordenar, así que vale la pena usarlo para verificar tus algoritmos.

</details>

### Ejercicio 3: ordenar productos por nombre

Con el tipo:

```c
typedef struct {
    int codigo;
    char nombre[30];
    double precio;
} Producto;
```

ordena un arreglo de productos alfabéticamente por nombre con inserción y muéstralo. Luego explica qué método elegirías si los registros tuvieran además una descripción de 2000 caracteres y no importara la estabilidad.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>
#include <string.h>

typedef struct {
    int codigo;
    char nombre[30];
    double precio;
} Producto;

void ordenar_por_nombre(Producto v[], int n) {
    for (int i = 1; i < n; i++) {
        Producto actual = v[i];
        int j = i - 1;
        while (j >= 0 && strcmp(v[j].nombre, actual.nombre) > 0) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = actual;
    }
}

int main(void) {
    Producto catalogo[] = {
        {77, "Cafe", 4800.0},
        {12, "Yerba", 2500.0},
        {35, "Azucar", 1200.0},
        {90, "Te", 900.0},
    };
    int n = (int)(sizeof catalogo / sizeof catalogo[0]);

    ordenar_por_nombre(catalogo, n);
    for (int i = 0; i < n; i++) {
        printf("%-8s %3d %8.2f\n", catalogo[i].nombre, catalogo[i].codigo, catalogo[i].precio);
    }
    return 0;
}
```

Salida:

```text
Azucar    35  1200.00
Cafe      77  4800.00
Te        90   900.00
Yerba     12  2500.00
```

Con registros de más de 2000 bytes, cada desplazamiento o intercambio copia todo el registro. Selección hace solo `n - 1` intercambios, contra `O(n²)` desplazamientos de inserción en el peor caso, así que sería la mejor de las tres si la estabilidad no importa. (Con punteros, en la lección 26, verás otra solución: ordenar un arreglo de direcciones en lugar de mover los registros.)

</details>

### Ejercicio 4: ordenar y después buscar

Escribe un programa que ordene `{42, 7, 19, 3, 25, 11}` con selección y después use búsqueda binaria para informar en qué posición del arreglo ordenado quedó el 19. Explica por qué no se puede usar la búsqueda binaria antes de ordenar.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

void ordenar_seleccion(int v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int minimo = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[minimo]) {
                minimo = j;
            }
        }
        int aux = v[i];
        v[i] = v[minimo];
        v[minimo] = aux;
    }
}

int buscar_binaria(const int v[], int n, int clave) {
    int inicio = 0;
    int fin = n - 1;
    while (inicio <= fin) {
        int medio = inicio + (fin - inicio) / 2;
        if (v[medio] == clave) {
            return medio;
        }
        if (v[medio] < clave) {
            inicio = medio + 1;
        } else {
            fin = medio - 1;
        }
    }
    return -1;
}

int main(void) {
    int v[] = {42, 7, 19, 3, 25, 11};
    int n = (int)(sizeof v / sizeof v[0]);

    ordenar_seleccion(v, n);
    printf("El 19 quedó en la posición %d\n", buscar_binaria(v, n, 19));
    return 0;
}
```

Salida:

```text
El 19 quedó en la posición 3
```

El arreglo ordenado es `{3, 7, 11, 19, 25, 42}`. La búsqueda binaria descarta una mitad suponiendo que todo lo que está a la izquierda del medio es menor y todo lo de la derecha es mayor; en el arreglo original eso no se cumple. Por ejemplo, en `{42, 7, 19, 3, 25, 11}` el primer medio es la posición 2 (el 19) y lo encontraría de casualidad, pero al buscar el 3 compararía con 19, iría a la izquierda (`{42, 7}`) y respondería `-1` aunque el 3 está en la posición 3.

</details>
