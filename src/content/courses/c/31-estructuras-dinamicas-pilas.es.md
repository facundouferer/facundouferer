---
title: 'Pilas'
course: 'c'
slug: 'estructuras-dinamicas-pilas'
description: 'Implementa una pila LIFO con nodos enlazados o arreglo dinámico, manejando apilar, desapilar, consulta del tope, pila vacía y liberación completa.'
order: 31
lang: 'es'
published: true
---

Una **pila** es una colección en la que solo se puede tocar un extremo, el **tope**: se agrega arriba y se quita de arriba. El último elemento que entra es el primero que sale. Esa regla se llama **LIFO** (*Last In, First Out*). Piensa en una pila de platos, en el botón "deshacer" de un editor o en la pila de llamadas que viste en `recursividad`: cada llamada nueva se apila y la que termina se desapila.

Una pila no es una estructura nueva en memoria: es una **interfaz** (un conjunto de operaciones con reglas) que se puede implementar con nodos enlazados o con un arreglo. En esta lección haces las dos.

## Objetivos

- Describir la regla LIFO y las operaciones de una pila: **apilar** (*push*), **desapilar** (*pop*), **ver el tope** (*peek*) y **está vacía** (*is empty*).
- Implementar una pila enlazada sobre la lista de `estructuras-dinamicas-listas`, con creación comprobada de cada nodo y una función que la destruye.
- Implementar una pila sobre un arreglo dinámico que crece con `realloc`.
- Informar el error de desapilar una pila vacía sin romper el programa.
- Resolver un problema clásico con una pila: verificar paréntesis balanceados.
- Comparar el costo de cada operación en ambas implementaciones.

**Requisitos previos:** `estructuras-dinamicas-listas`, `memoria-dinamica` y `propiedad-y-errores-de-memoria`.

## Las operaciones

| Operación | En español | Qué hace | Puede fallar |
| --- | --- | --- | --- |
| *push* | apilar | agrega un elemento en el tope | sí, si no hay memoria |
| *pop* | desapilar | quita el elemento del tope y lo devuelve | sí, si la pila está vacía |
| *peek* | ver el tope | devuelve el elemento del tope sin quitarlo | sí, si la pila está vacía |
| *is empty* | está vacía | dice si la pila no tiene elementos | no |

Las operaciones que pueden fallar devuelven `bool`. El valor que producen (el elemento desapilado o el del tope) se entrega a través de un puntero de salida, como hace `scanf`: así el resultado de la operación y el dato viajan por caminos distintos y ningún valor del dato queda reservado para "error".

```text
apilar 1, apilar 2, apilar 3        desapilar -> 3

   | 3 |  <- tope                      | 2 |  <- tope
   | 2 |                               | 1 |
   | 1 |                               +---+
   +---+
```

## Pila enlazada

Una pila enlazada es una lista simple en la que solo se inserta y se elimina en la cabeza, que aquí se llama **tope**. Las dos operaciones son O(1), porque no hay que recorrer nada.

Agrupamos el tope y la cantidad de elementos en una estructura `Pila`. Las funciones reciben un `Pila *`: cambian el tope, así que necesitan la dirección de la estructura que lo guarda, por la misma razón que las funciones de la lección anterior recibían `Nodo **cabeza`.

```c
typedef struct Nodo {
    int dato;
    struct Nodo *siguiente;   // el elemento que quedó debajo
} Nodo;

// La pila es dueña de todos sus nodos.
typedef struct {
    Nodo *tope;
    size_t cantidad;
} Pila;
```

### Apilar

```c
// Apila dato. Devuelve false si no hay memoria (la pila queda igual).
bool pila_apilar(Pila *pila, int dato) {
    Nodo *nodo = malloc(sizeof *nodo);
    if (nodo == NULL) {
        return false;
    }
    nodo->dato = dato;
    nodo->siguiente = pila->tope;   // el tope anterior queda debajo
    pila->tope = nodo;              // la pila pasa a ser dueña del nodo
    pila->cantidad++;
    return true;
}
```

### Desapilar

Desapilar una pila vacía es un error del programa que llama, pero la pila no debe desreferenciar `NULL` por eso: lo detecta y devuelve `false`.

```c
// Quita el elemento del tope y lo guarda en *dato.
// Devuelve false si la pila está vacía (*dato no se modifica).
bool pila_desapilar(Pila *pila, int *dato) {
    if (pila->tope == NULL) {
        return false;
    }
    Nodo *viejo = pila->tope;
    *dato = viejo->dato;            // copiar el dato antes de liberar
    pila->tope = viejo->siguiente;
    free(viejo);
    pila->cantidad--;
    return true;
}
```

El nodo se libera dentro de `pila_desapilar`: quien llama recibe una **copia** del dato, no el nodo, así que nunca tiene que liberar nada.

### Ver el tope, está vacía y destruir

```c
bool pila_ver_tope(const Pila *pila, int *dato) {
    if (pila->tope == NULL) {
        return false;
    }
    *dato = pila->tope->dato;
    return true;
}

bool pila_vacia(const Pila *pila) {
    return pila->tope == NULL;
}

// Libera todos los nodos y deja la pila vacía y reutilizable.
void pila_destruir(Pila *pila) {
    Nodo *actual = pila->tope;
    while (actual != NULL) {
        Nodo *debajo = actual->siguiente;
        free(actual);
        actual = debajo;
    }
    pila->tope = NULL;
    pila->cantidad = 0;
}
```

### Programa completo

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Nodo {
    int dato;
    struct Nodo *siguiente;
} Nodo;

// La pila es dueña de todos sus nodos.
typedef struct {
    Nodo *tope;
    size_t cantidad;
} Pila;

bool pila_apilar(Pila *pila, int dato) {
    Nodo *nodo = malloc(sizeof *nodo);
    if (nodo == NULL) {
        return false;
    }
    nodo->dato = dato;
    nodo->siguiente = pila->tope;
    pila->tope = nodo;
    pila->cantidad++;
    return true;
}

bool pila_desapilar(Pila *pila, int *dato) {
    if (pila->tope == NULL) {
        return false;
    }
    Nodo *viejo = pila->tope;
    *dato = viejo->dato;
    pila->tope = viejo->siguiente;
    free(viejo);
    pila->cantidad--;
    return true;
}

bool pila_ver_tope(const Pila *pila, int *dato) {
    if (pila->tope == NULL) {
        return false;
    }
    *dato = pila->tope->dato;
    return true;
}

bool pila_vacia(const Pila *pila) {
    return pila->tope == NULL;
}

void pila_destruir(Pila *pila) {
    Nodo *actual = pila->tope;
    while (actual != NULL) {
        Nodo *debajo = actual->siguiente;
        free(actual);
        actual = debajo;
    }
    pila->tope = NULL;
    pila->cantidad = 0;
}

int main(void) {
    Pila pila = {NULL, 0};   // main es dueña de la pila

    for (int i = 1; i <= 3; i++) {
        if (!pila_apilar(&pila, i * 10)) {
            fprintf(stderr, "Sin memoria\n");
            pila_destruir(&pila);
            return 1;
        }
    }
    int valor;
    if (pila_ver_tope(&pila, &valor)) {
        printf("Tope: %d (hay %zu elementos)\n", valor, pila.cantidad);
    }
    while (pila_desapilar(&pila, &valor)) {
        printf("Desapilado: %d\n", valor);
    }
    if (!pila_desapilar(&pila, &valor)) {
        printf("Error: no se puede desapilar una pila vacía\n");
    }
    printf("¿Vacía? %s\n", pila_vacia(&pila) ? "sí" : "no");

    pila_destruir(&pila);   // no hace nada si ya está vacía, pero es el cierre correcto
    return 0;
}
```

Salida:

```text
Tope: 30 (hay 3 elementos)
Desapilado: 30
Desapilado: 20
Desapilado: 10
Error: no se puede desapilar una pila vacía
¿Vacía? sí
```

## Pila sobre un arreglo dinámico

La misma interfaz se puede implementar con un arreglo: el tope es la última posición ocupada. Apilar escribe en `datos[cantidad]` y desapilar lee `datos[cantidad - 1]`. Cuando el arreglo se llena, se duplica su capacidad con `realloc` (lección `memoria-dinamica`).

```text
datos:     [ 10 | 20 | 30 |    ]     capacidad = 4
                         ^
                cantidad = 3, el tope es datos[2]
```

```c
#include <stdio.h>
#include <stdlib.h>

// La pila es dueña del arreglo datos.
typedef struct {
    int *datos;
    size_t cantidad;
    size_t capacidad;
} PilaArreglo;

// Apila dato; si el arreglo está lleno, duplica su capacidad.
// Devuelve false si no hay memoria (la pila queda igual).
bool pila_arreglo_apilar(PilaArreglo *pila, int dato) {
    if (pila->cantidad == pila->capacidad) {
        size_t nueva_capacidad = pila->capacidad == 0 ? 4 : pila->capacidad * 2;
        int *nuevos = realloc(pila->datos, nueva_capacidad * sizeof *nuevos);
        if (nuevos == NULL) {
            return false;   // pila->datos sigue siendo válido
        }
        pila->datos = nuevos;
        pila->capacidad = nueva_capacidad;
    }
    pila->datos[pila->cantidad] = dato;
    pila->cantidad++;
    return true;
}

bool pila_arreglo_desapilar(PilaArreglo *pila, int *dato) {
    if (pila->cantidad == 0) {
        return false;
    }
    pila->cantidad--;
    *dato = pila->datos[pila->cantidad];
    return true;
}

void pila_arreglo_destruir(PilaArreglo *pila) {
    free(pila->datos);
    pila->datos = NULL;
    pila->cantidad = 0;
    pila->capacidad = 0;
}

int main(void) {
    PilaArreglo pila = {NULL, 0, 0};

    for (int i = 1; i <= 10; i++) {
        if (!pila_arreglo_apilar(&pila, i)) {
            pila_arreglo_destruir(&pila);
            return 1;
        }
    }
    printf("Cantidad: %zu, capacidad: %zu\n", pila.cantidad, pila.capacidad);

    int valor;
    while (pila_arreglo_desapilar(&pila, &valor)) {
        printf("%d ", valor);
    }
    printf("\n");

    pila_arreglo_destruir(&pila);
    return 0;
}
```

Salida:

```text
Cantidad: 10, capacidad: 16
10 9 8 7 6 5 4 3 2 1
```

Fíjate en tres detalles que vienen de las lecciones anteriores:

- El resultado de `realloc` se guarda en una variable auxiliar. Si fuera `pila->datos = realloc(...)` y fallara, perderías el único puntero al bloque viejo (lección `propiedad-y-errores-de-memoria`).
- `realloc(NULL, n)` se comporta como `malloc(n)`, por eso la pila empieza con `datos = NULL` y capacidad 0.
- Destruir es un solo `free`, porque todos los elementos viven en un único bloque.

Si sabes de antemano cuántos elementos habrá como máximo, puedes usar una capacidad fija y que `apilar` devuelva `false` cuando la pila esté llena.

## Un uso clásico: paréntesis balanceados

Una expresión como `{[(a + b) * c]}` está balanceada si cada símbolo de apertura se cierra con el símbolo correspondiente y en el orden inverso. La pila es la herramienta natural: cada apertura se apila; cada cierre debe coincidir con el tope, que se desapila.

```text
{ [ ( ) ] }
apila {      pila: {
apila [      pila: { [
apila (      pila: { [ (
cierra )     tope ( coincide -> desapila    pila: { [
cierra ]     tope [ coincide -> desapila    pila: {
cierra }     tope { coincide -> desapila    pila vacía -> balanceada
```

Hay dos formas de fallar: un cierre que no coincide con el tope (o que llega con la pila vacía), y aperturas que sobran al final. En el primer caso la función termina antes de tiempo **con nodos todavía en la pila**: hay que destruirla antes de cada `return`.

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Nodo {
    char simbolo;
    struct Nodo *siguiente;
} Nodo;

bool apilar(Nodo **tope, char simbolo) {
    Nodo *nodo = malloc(sizeof *nodo);
    if (nodo == NULL) {
        return false;
    }
    nodo->simbolo = simbolo;
    nodo->siguiente = *tope;
    *tope = nodo;
    return true;
}

bool desapilar(Nodo **tope, char *simbolo) {
    if (*tope == NULL) {
        return false;
    }
    Nodo *viejo = *tope;
    *simbolo = viejo->simbolo;
    *tope = viejo->siguiente;
    free(viejo);
    return true;
}

void destruir_pila(Nodo **tope) {
    char descarte;
    while (desapilar(tope, &descarte)) {
    }
}

char apertura_de(char cierre) {
    switch (cierre) {
    case ')': return '(';
    case ']': return '[';
    default: return '{';
    }
}

// Devuelve true si texto está balanceado. Crea y destruye su propia pila:
// nunca deja nodos vivos, termine como termine.
// Si no hay memoria, informa el error y devuelve false.
bool esta_balanceado(const char *texto) {
    Nodo *tope = NULL;
    for (const char *c = texto; *c != '\0'; c++) {
        if (*c == '(' || *c == '[' || *c == '{') {
            if (!apilar(&tope, *c)) {
                fprintf(stderr, "Sin memoria\n");
                destruir_pila(&tope);
                return false;
            }
        } else if (*c == ')' || *c == ']' || *c == '}') {
            char abierto;
            if (!desapilar(&tope, &abierto) || abierto != apertura_de(*c)) {
                destruir_pila(&tope);   // pueden quedar aperturas apiladas
                return false;
            }
        }
    }
    bool balanceado = tope == NULL;   // si sobran aperturas, no está balanceado
    destruir_pila(&tope);
    return balanceado;
}

int main(void) {
    const char *pruebas[] = {"{[(a + b) * c]}", "(a + b]", "((a)", "a)", ""};
    size_t cantidad = sizeof pruebas / sizeof pruebas[0];

    for (size_t i = 0; i < cantidad; i++) {
        printf("\"%s\": %s\n", pruebas[i],
               esta_balanceado(pruebas[i]) ? "balanceado" : "no balanceado");
    }
    return 0;
}
```

Salida:

```text
"{[(a + b) * c]}": balanceado
"(a + b]": no balanceado
"((a)": no balanceado
"a)": no balanceado
"": balanceado
```

Esta versión no usa la estructura `Pila`: el tope es un simple `Nodo *` local, y las funciones reciben `Nodo **tope` porque lo cambian. Las dos formas son correctas; la estructura es cómoda cuando además quieres llevar la cantidad.

## Costo de las operaciones

| Operación | Pila enlazada | Pila sobre arreglo dinámico |
| --- | --- | --- |
| Apilar | O(1) | O(1) en promedio; O(n) cuando hay que crecer |
| Desapilar | O(1) | O(1) |
| Ver el tope | O(1) | O(1) |
| Está vacía | O(1) | O(1) |
| Destruir | O(n) (un `free` por nodo) | O(1) (un solo `free`) |
| Memoria extra | un puntero por elemento | capacidad sin usar (hasta la mitad) |

Duplicar la capacidad hace que los `realloc` sean cada vez más raros: en promedio, cada apilar cuesta O(1). La versión con arreglo suele ser más rápida en la práctica, porque los datos están contiguos y hay una sola reserva cada muchas operaciones. La enlazada nunca copia elementos y cada operación tiene un costo predecible.

## Resumen

- Una pila sigue la regla LIFO: solo se trabaja sobre el tope.
- Apilar (*push*), desapilar (*pop*), ver el tope (*peek*) y está vacía (*is empty*) son O(1).
- Desapilar o ver el tope de una pila vacía es un error que la pila informa con `false`, sin desreferenciar `NULL`.
- La pila es dueña de sus nodos (o de su arreglo) y tiene una función que los libera; las funciones que salen antes de tiempo la destruyen antes de `return`.
- Con arreglo dinámico, el resultado de `realloc` se guarda en una variable auxiliar.

## Ejercicios prácticos

### Ejercicio 1: predice la salida

Con la pila enlazada de la lección, ¿qué imprime este fragmento?

```c
Pila pila = {NULL, 0};
int x;
pila_apilar(&pila, 1);
pila_apilar(&pila, 2);
pila_desapilar(&pila, &x);
pila_apilar(&pila, 3);
pila_apilar(&pila, 4);
pila_desapilar(&pila, &x);
printf("%d ", x);
pila_desapilar(&pila, &x);
printf("%d %zu\n", x, pila.cantidad);
pila_destruir(&pila);
```

<details><summary>Ver solución</summary>

Imprime `4 3 1`. Tras apilar 1 y 2 y desapilar, queda `1`. Se apilan 3 y 4: `1 3 4`, con 4 en el tope. El primer desapilar da 4, el segundo da 3, y queda un elemento (el 1), que `pila_destruir` libera.

</details>

### Ejercicio 2: invertir una cadena

Usa una pila para imprimir una cadena al revés: apila cada carácter y después desapila hasta vaciarla. Escribe el programa completo con una pila enlazada de `char` y verifica que no queden nodos vivos.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Nodo {
    char caracter;
    struct Nodo *siguiente;
} Nodo;

bool apilar(Nodo **tope, char caracter) {
    Nodo *nodo = malloc(sizeof *nodo);
    if (nodo == NULL) {
        return false;
    }
    nodo->caracter = caracter;
    nodo->siguiente = *tope;
    *tope = nodo;
    return true;
}

bool desapilar(Nodo **tope, char *caracter) {
    if (*tope == NULL) {
        return false;
    }
    Nodo *viejo = *tope;
    *caracter = viejo->caracter;
    *tope = viejo->siguiente;
    free(viejo);
    return true;
}

int main(void) {
    const char *texto = "pila";
    Nodo *tope = NULL;
    char c;

    for (const char *p = texto; *p != '\0'; p++) {
        if (!apilar(&tope, *p)) {
            while (desapilar(&tope, &c)) {
            }
            return 1;
        }
    }
    while (desapilar(&tope, &c)) {   // al vaciarla, libera todos los nodos
        putchar(c);
    }
    putchar('\n');                    // imprime "alip"
    return 0;
}
```

Desapilar hasta que la pila esté vacía libera todos los nodos, así que al final no queda ninguno vivo.

</details>

### Ejercicio 3: pila de capacidad fija

Modifica la pila sobre arreglo para que tenga una capacidad fija, elegida al crearla, y que `apilar` devuelva `false` cuando esté llena en lugar de crecer. Escribe `bool pila_fija_crear(PilaArreglo *pila, size_t capacidad)` y la nueva versión de apilar.

<details><summary>Ver solución</summary>

```c
// Reserva el arreglo. Devuelve false si capacidad es 0 o no hay memoria.
bool pila_fija_crear(PilaArreglo *pila, size_t capacidad) {
    pila->cantidad = 0;
    pila->capacidad = 0;
    pila->datos = NULL;
    if (capacidad == 0) {
        return false;
    }
    pila->datos = malloc(capacidad * sizeof *pila->datos);
    if (pila->datos == NULL) {
        return false;
    }
    pila->capacidad = capacidad;
    return true;
}

// Devuelve false si la pila está llena.
bool pila_fija_apilar(PilaArreglo *pila, int dato) {
    if (pila->cantidad == pila->capacidad) {
        return false;
    }
    pila->datos[pila->cantidad] = dato;
    pila->cantidad++;
    return true;
}
```

Desapilar y destruir no cambian. Ahora apilar tiene dos motivos distintos de error en las dos implementaciones (sin memoria o pila llena), y por eso el llamador siempre debe mirar el `bool`.

</details>
