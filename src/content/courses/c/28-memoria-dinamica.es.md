---
title: 'Memoria dinámica: malloc, calloc, realloc y free'
course: 'c'
slug: 'memoria-dinamica'
description: 'Reserva y redimensiona bloques en el montículo en tiempo de ejecución con malloc, calloc y realloc, verifica fallos de asignación y libera con free.'
order: 28
lang: 'es'
published: true
---

En la lección anterior viste que las variables automáticas mueren al salir de su bloque y que las estáticas viven todo el programa con un tamaño fijo. Falta la tercera opción: memoria que el programa **pide cuando la necesita**, del tamaño que necesita, y **devuelve cuando termina**. Esa es la duración asignada, y en esta lección aprendes a manejarla.

## Objetivos

- Explicar cuándo hace falta memoria dinámica.
- Reservar memoria con `malloc` y `calloc`, y comprobar siempre si la reserva falló.
- Agrandar un bloque con `realloc` usando el patrón seguro.
- Liberar memoria con `free` y dejar el puntero en `NULL`.
- Construir un arreglo dinámico que crece a medida que llegan los datos.
- Inicializar y limpiar correctamente: toda reserva comprobada, todo bloque liberado.

**Requisitos previos:** `punteros-y-direcciones`, `punteros-arreglos-y-estructuras` (aritmética de punteros, `->`, `void *`) y `duracion-y-ciclo-de-vida`.

## ¿Por qué memoria dinámica?

Hasta ahora todos los arreglos tenían un tamaño fijo escrito en el código: `int notas[100];`. Eso trae dos problemas:

1. **El tamaño se conoce recién al ejecutar.** Si el usuario carga 3 notas, sobran 97 lugares; si carga 150, no entran.
2. **El objeto tiene que sobrevivir a la función que lo crea.** Una variable local muere al volver; una `static` es única y compartida. A veces necesitas crear un objeto nuevo en una función y entregárselo al llamador.

La memoria dinámica resuelve las dos cosas: el tamaño se decide en tiempo de ejecución y el objeto vive hasta que el programa lo libera explícitamente.

## El montículo (heap)

La memoria dinámica se toma de una zona que se suele llamar **montículo** (en inglés, *heap*). Como viste en la lección anterior, es un modelo explicativo: el estándar no exige que exista, pero ayuda a razonar. Lo importante es la regla:

> Un bloque reservado vive **desde que lo pides hasta que llamas a `free`**. No lo libera ninguna llave de cierre ni el final de una función.

Las cuatro funciones están en `<stdlib.h>`.

## `malloc`: reservar un bloque

`malloc` recibe una cantidad de **bytes** (un `size_t`) y devuelve un `void *` con la dirección del bloque, o `NULL` si no pudo reservarlo. El contenido del bloque **no está inicializado**.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t n = 5;
    int *numeros = malloc(n * sizeof *numeros);
    if (numeros == NULL) {
        fprintf(stderr, "No hay memoria suficiente\n");
        return 1;
    }

    for (size_t i = 0; i < n; i++) {
        numeros[i] = (int)(i * i);
    }
    for (size_t i = 0; i < n; i++) {
        printf("%d ", numeros[i]);
    }
    printf("\n");

    free(numeros);
    numeros = NULL;
    return 0;
}
```

Detalles que vale la pena mirar:

- **`n * sizeof *numeros`**: `sizeof *numeros` es el tamaño de *un* elemento (un `int`). Escribirlo así, en lugar de `sizeof(int)`, evita errores si mañana cambias el tipo del puntero: el tamaño se ajusta solo.
- **No hace falta convertir el resultado.** `void *` se convierte implícitamente a cualquier puntero a objeto. Escribir `(int *)malloc(...)` es necesario en C++, no en C.
- **Siempre se comprueba `NULL`.** Si la reserva falla y usas el puntero igual, es comportamiento indefinido.
- **El índice es `size_t`**, el mismo tipo que usan los tamaños.

Una vez que tienes el puntero, el bloque se usa como un arreglo: `numeros[i]` es lo mismo que `*(numeros + i)`.

### Cuidado con el desborde al multiplicar

Si `n` viene del usuario y es enorme, `n * sizeof *numeros` puede desbordar `size_t` y dar un número chico: `malloc` reservaría menos de lo que crees. Cuando el tamaño no está controlado, compruébalo antes:

```c
#include <stdint.h>
#include <stdlib.h>

int *reservar_enteros(size_t n) {
    if (n == 0 || n > SIZE_MAX / sizeof(int)) {
        return NULL;               // tamaño inválido o la cuenta desbordaría
    }
    return malloc(n * sizeof(int));
}
```

> **Portabilidad:** `malloc(0)` está permitido, pero el resultado depende de la implementación: puede devolver `NULL` o un puntero único que no se puede desreferenciar. Evita pedir cero bytes.

## `free`: devolver el bloque

`free(p)` devuelve al sistema el bloque al que apunta `p`. Después de `free`, el bloque está muerto: `p` sigue guardando la dirección, pero es un **puntero colgante**, igual que los de la lección anterior.

Dos reglas prácticas:

1. **Asigna `NULL` después de liberar** cuando el puntero sigue en uso (una variable que vive más, un campo de una estructura). Así un uso posterior falla de forma predecible al comprobar `NULL`, en lugar de leer memoria muerta.
2. **`free(NULL)` no hace nada.** Está garantizado por el estándar, así que no hace falta escribir `if (p != NULL) free(p);`.

```c
free(numeros);
numeros = NULL;    // ya no apunta a un bloque muerto
free(numeros);     // free(NULL): no hace nada, no es un error
```

Solo se pasa a `free` un puntero que vino de `malloc`, `calloc` o `realloc` (o `NULL`), y cada bloque se libera **una sola vez**. La próxima lección estudia qué pasa cuando no se cumple.

> **C básico:** el puntero nulo se escribe `NULL`.

> **C moderno (C23):** existe además la constante `nullptr`, de tipo `nullptr_t`, que siempre es un puntero nulo y nunca un entero. `p = nullptr;` es equivalente a `p = NULL;`.

> **Portabilidad:** `nullptr` requiere un compilador con soporte de C23; `NULL` funciona en todas las versiones. En este curso seguimos usando `NULL`.

## `calloc`: reservar e inicializar en cero

`calloc(cantidad, tamaño)` reserva espacio para `cantidad` elementos de `tamaño` bytes cada uno y pone **todos los bytes en cero**.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t dias = 7;
    int *ventas = calloc(dias, sizeof *ventas);
    if (ventas == NULL) {
        fprintf(stderr, "No hay memoria suficiente\n");
        return 1;
    }

    ventas[2] = 15;                // el resto ya vale 0
    for (size_t i = 0; i < dias; i++) {
        printf("Dia %zu: %d\n", i + 1, ventas[i]);
    }

    free(ventas);
    return 0;
}
```

Ventajas frente a `malloc`:

- **Contenido inicializado:** todos los bytes en cero. Para enteros eso es el valor `0`.
- **Multiplicación segura:** `calloc` debe comprobar que `cantidad × tamaño` no desborde; si desbordaría, devuelve `NULL`. Por eso es la opción natural cuando la cantidad viene de afuera.

Usa `malloc` cuando vas a escribir todos los elementos enseguida, y `calloc` cuando necesitas empezar desde cero o la cantidad no está controlada.

## `realloc`: cambiar el tamaño de un bloque

`realloc(p, nuevo_tamaño)` cambia el tamaño del bloque `p`. Puede agrandarlo en el mismo lugar o mover los datos a un bloque nuevo y liberar el viejo; por eso **devuelve la dirección que hay que usar a partir de ahora**. Los datos que ya estaban (hasta el menor de los dos tamaños) se conservan.

Si falla, devuelve `NULL` y **el bloque original sigue vivo y sin cambios**. Por eso nunca se escribe `p = realloc(p, ...)` directamente: si falla, pierdes la única dirección del bloque viejo. El patrón seguro usa un puntero temporal:

```c
int *nuevo = realloc(numeros, nueva_capacidad * sizeof *numeros);
if (nuevo == NULL) {
    // numeros sigue siendo válido: decide qué hacer y libéralo después
    free(numeros);
    return 1;
}
numeros = nuevo;                   // solo ahora se reemplaza
```

Además, `realloc(NULL, tamaño)` se comporta como `malloc(tamaño)`. Eso permite empezar con un puntero en `NULL` y agrandarlo siempre con el mismo código.

> **C básico:** en C17, `realloc(p, 0)` tenía un resultado definido por la implementación.

> **C moderno (C23):** `realloc` con tamaño cero pasa a ser comportamiento indefinido. Para liberar, usa `free`.

> **Portabilidad:** no dependas de `realloc(p, 0)` en ninguna versión; comprueba que el nuevo tamaño sea mayor que cero.

## Un arreglo que crece

Ahora juntamos todo. El programa lee enteros hasta que el usuario escribe `0` o termina la entrada (fin de archivo: Ctrl+D en Linux y macOS, Ctrl+Z y Enter en Windows). No sabe de antemano cuántos números llegarán, así que empieza con una capacidad chica y la **duplica** cada vez que se llena.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t capacidad = 4;
    size_t cantidad = 0;
    int *numeros = malloc(capacidad * sizeof *numeros);
    if (numeros == NULL) {
        fprintf(stderr, "No hay memoria suficiente\n");
        return 1;
    }

    printf("Ingresa enteros (0 para terminar):\n");
    int valor;
    while (scanf("%d", &valor) == 1 && valor != 0) {
        if (cantidad == capacidad) {
            size_t nueva_capacidad = capacidad * 2;
            int *nuevo = realloc(numeros, nueva_capacidad * sizeof *numeros);
            if (nuevo == NULL) {
                fprintf(stderr, "No se pudo agrandar el arreglo\n");
                free(numeros);
                return 1;
            }
            numeros = nuevo;
            capacidad = nueva_capacidad;
        }
        numeros[cantidad] = valor;
        cantidad++;
    }

    long long suma = 0;
    for (size_t i = 0; i < cantidad; i++) {
        suma += numeros[i];
    }
    printf("Leidos: %zu (capacidad %zu), suma: %lld\n", cantidad, capacidad, suma);

    free(numeros);
    numeros = NULL;
    return 0;
}
```

Con la entrada `5 8 13 2 7 0` imprime `Leidos: 5 (capacidad 8), suma: 35`: la capacidad pasó de 4 a 8 al llegar el quinto número.

¿Por qué duplicar y no sumar 1? Cada `realloc` puede copiar todo el arreglo. Si crecieras de a un elemento, leer `n` números costaría del orden de `n²` copias; duplicando, el total de copias queda en el orden de `n`. Es la misma idea que usan los vectores dinámicos de casi todos los lenguajes.

Observa la limpieza: hay **dos** caminos de salida con memoria reservada (el error de `realloc` y el final normal), y los dos llaman a `free`. Si `malloc` falla al principio no hay nada que liberar.

## Inicialización y limpieza en una estructura

En un programa real conviene encapsular el arreglo dinámico en una estructura con funciones que mantengan sus reglas. Así la reserva, el crecimiento y la liberación están en un solo lugar:

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *datos;
    size_t cantidad;
    size_t capacidad;
} Vector;

void vector_iniciar(Vector *v) {
    v->datos = NULL;               // realloc(NULL, ...) actúa como malloc
    v->cantidad = 0;
    v->capacidad = 0;
}

bool vector_agregar(Vector *v, int valor) {
    if (v->cantidad == v->capacidad) {
        size_t nueva = v->capacidad == 0 ? 4 : v->capacidad * 2;
        int *nuevo = realloc(v->datos, nueva * sizeof *nuevo);
        if (nuevo == NULL) {
            return false;          // v queda intacto y válido
        }
        v->datos = nuevo;
        v->capacidad = nueva;
    }
    v->datos[v->cantidad] = valor;
    v->cantidad++;
    return true;
}

void vector_liberar(Vector *v) {
    free(v->datos);
    v->datos = NULL;
    v->cantidad = 0;
    v->capacidad = 0;
}

int main(void) {
    Vector v;
    vector_iniciar(&v);
    for (int i = 1; i <= 10; i++) {
        if (!vector_agregar(&v, i * 3)) {
            fprintf(stderr, "Sin memoria\n");
            vector_liberar(&v);
            return 1;
        }
    }
    printf("%zu elementos, el ultimo es %d\n", v.cantidad, v.datos[v.cantidad - 1]);
    vector_liberar(&v);
    return 0;
}
```

El estado del `Vector` es siempre coherente: recién iniciado, después de agregar con éxito, después de un fallo y después de liberar. `vector_liberar` deja la estructura como recién iniciada, así que llamarla dos veces es inofensivo (gracias a `free(NULL)`).

## Resumen

| Función | Para qué | Si falla |
| --- | --- | --- |
| `malloc(bytes)` | reservar un bloque sin inicializar | devuelve `NULL` |
| `calloc(cantidad, tamaño)` | reservar en cero, con multiplicación segura | devuelve `NULL` |
| `realloc(p, bytes)` | cambiar el tamaño, conservando los datos | devuelve `NULL` y `p` sigue válido |
| `free(p)` | liberar; `free(NULL)` no hace nada | (no falla) |

- Escribe los tamaños como `n * sizeof *p` y guárdalos en `size_t`.
- Comprueba **cada** reserva antes de usarla.
- Usa un puntero temporal con `realloc`.
- Libera **cada** bloque exactamente una vez, en todos los caminos de salida, y deja el puntero en `NULL` si sigue en uso.

## Ejercicios prácticos

### Ejercicio 1: encuentra los errores

Este fragmento tiene tres problemas. Encuéntralos y corrígelos.

<!-- c-check: skip -->

```c
int *copia = malloc(n * sizeof(int));
for (size_t i = 0; i <= n; i++) {
    copia[i] = original[i];
}
copia = realloc(copia, 2 * n * sizeof(int));
```

<details><summary>Ver solución</summary>

1. No comprueba si `malloc` devolvió `NULL`.
2. El `for` usa `i <= n`: escribe `copia[n]`, una posición fuera del bloque (desborde por uno).
3. `copia = realloc(copia, ...)` pierde el bloque original si `realloc` falla.

```c
int *copia = malloc(n * sizeof *copia);
if (copia == NULL) {
    return 1;
}
for (size_t i = 0; i < n; i++) {
    copia[i] = original[i];
}
int *nuevo = realloc(copia, 2 * n * sizeof *copia);
if (nuevo == NULL) {
    free(copia);
    return 1;
}
copia = nuevo;
```

</details>

### Ejercicio 2: `malloc` o `calloc`

Un programa cuenta cuántas veces aparece cada valor entre 0 y `n - 1`, donde `n` lo ingresa el usuario. ¿Qué función usarías para reservar el arreglo de contadores y por qué? Escribe la reserva.

<details><summary>Ver solución</summary>

`calloc`: los contadores tienen que empezar en cero y `n` viene del usuario, así que conviene la multiplicación segura que hace `calloc`.

```c
size_t *contadores = calloc(n, sizeof *contadores);
if (contadores == NULL) {
    fprintf(stderr, "No hay memoria suficiente\n");
    return 1;
}
// ... usar contadores ...
free(contadores);
```

</details>

### Ejercicio 3: copia dinámica de una cadena

Escribe `char *duplicar(const char *texto)` que reserve exactamente la memoria necesaria, copie `texto` y devuelva el nuevo bloque (o `NULL` si falla). Pruébala desde `main` y libera el resultado.

<details><summary>Ver solución</summary>

Hay que reservar `strlen(texto) + 1` bytes: el `+ 1` es para el terminador `'\0'`.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *duplicar(const char *texto) {
    size_t largo = strlen(texto) + 1;
    char *copia = malloc(largo);
    if (copia == NULL) {
        return NULL;
    }
    memcpy(copia, texto, largo);
    return copia;
}

int main(void) {
    char *saludo = duplicar("Hola, memoria");
    if (saludo == NULL) {
        return 1;
    }
    printf("%s\n", saludo);
    free(saludo);
    return 0;
}
```

> **C moderno (C23):** la biblioteca estándar incorpora `strdup`, que hace exactamente esto. Antes de C23 solo existía en POSIX.

</details>

### Ejercicio 4: arreglo de tamaño elegido por el usuario

Escribe un programa que pida un tamaño `n`, reserve un arreglo de `n` `double`, lea `n` valores y muestre el promedio. Comprueba la lectura de `n`, que sea mayor que cero, la reserva y la lectura de cada valor.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    printf("Cantidad de valores: ");
    if (scanf("%d", &n) != 1 || n <= 0) {
        fprintf(stderr, "Cantidad invalida\n");
        return 1;
    }

    double *valores = malloc((size_t)n * sizeof *valores);
    if (valores == NULL) {
        fprintf(stderr, "No hay memoria suficiente\n");
        return 1;
    }

    double suma = 0.0;
    for (int i = 0; i < n; i++) {
        if (scanf("%lf", &valores[i]) != 1) {
            fprintf(stderr, "Valor invalido\n");
            free(valores);
            return 1;
        }
        suma += valores[i];
    }
    printf("Promedio: %.2f\n", suma / n);

    free(valores);
    return 0;
}
```

Observa que el camino de error de la lectura también libera.

</details>

### Ejercicio 5: achicar al final

En el programa del arreglo que crece, al terminar de leer puede sobrar capacidad. Agrega un paso que achique el bloque al tamaño justo con `realloc`, sin perder datos si falla y sin pedir tamaño cero.

<details><summary>Ver solución</summary>

```c
if (cantidad > 0 && cantidad < capacidad) {
    int *ajustado = realloc(numeros, cantidad * sizeof *numeros);
    if (ajustado != NULL) {
        numeros = ajustado;
        capacidad = cantidad;
    }
    // si falla, el bloque original sigue siendo válido y más grande: no es un error
}
```

Se evita `cantidad == 0` porque `realloc` con tamaño cero es comportamiento indefinido en C23.

</details>
