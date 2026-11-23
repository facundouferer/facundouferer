---
title: 'Árboles Binarios'
course: 'c'
slug: 'arboles-binarios'
description: 'Organiza datos jerárquicos en un árbol binario de búsqueda (ABB), inserta y busca claves, recorre en preorden, inorden y postorden, y libera en postorden.'
order: 33
lang: 'es'
published: true
---

Hasta ahora organizaste los datos en estructuras **lineales**: listas, pilas y colas. En ellas cada elemento tiene un único sucesor, como en una fila. Pero muchos datos son **jerárquicos**: el organigrama de una empresa, las carpetas de tu computadora, las decisiones de un juego. Para eso existen los **árboles**, y el más usado en programación es el **árbol binario**.

Un árbol binario se construye con las mismas piezas que una lista: nodos en el heap creados con `malloc`, enlazados con punteros y liberados con `free`. La diferencia es que cada nodo tiene **dos** enlaces, y eso hace que la forma natural de recorrerlo sea la **recursividad**.

## Objetivos

- Usar la terminología de los árboles: raíz, hijo, padre, hoja, subárbol, nivel y altura.
- Definir un nodo con `typedef struct` y dos punteros autorreferenciados.
- Entender la regla del **árbol binario de búsqueda** (BST, *binary search tree*) e implementar inserción y búsqueda recursivas.
- Implementar los tres **recorridos** en profundidad: inorden, preorden y postorden.
- Liberar el árbol completo con un recorrido en postorden.
- Calcular la altura, el mínimo y el máximo.
- Eliminar un valor (extensión) resolviendo sus tres casos.
- Explicar por qué un árbol balanceado busca en O(log n) y uno degenerado en O(n).

**Requisitos previos:** `recursividad`, `estructuras-dinamicas-listas` y `propiedad-y-errores-de-memoria`.

## ¿Por qué árboles?

Imagina una lista enlazada ordenada con 1 000 000 de números. Para encontrar el 999 999 tienes que recorrer casi todos los nodos, uno por uno: no se puede saltar al medio, como en la búsqueda binaria de un arreglo, porque para llegar a un nodo hay que pasar por todos los anteriores.

Un **árbol binario de búsqueda** guarda los datos de modo que en cada nodo puedes descartar la mitad del resto, como cuando buscas una palabra en el diccionario: abres por la mitad, ves que la palabra está antes, y descartas toda la mitad derecha. En un árbol bien balanceado con un millón de nodos, encontrar un dato lleva unos **20 pasos**.

## Anatomía de un árbol

Un árbol se dibuja al revés: la raíz arriba y las ramas hacia abajo.

```text
             [50]           <- raíz (nivel 0)
            /    \
        [30]      [70]      <- nodos internos (nivel 1)
        /  \      /  \
     [20] [40] [60] [80]    <- hojas (nivel 2)
```

- **Raíz**: el nodo superior. Es el único que no tiene padre.
- **Hijo** y **padre**: cada nodo puede tener hijos debajo; él es su padre. En un árbol **binario** cada nodo tiene como máximo **dos** hijos: el izquierdo y el derecho.
- **Hoja**: un nodo sin hijos (sus dos punteros valen `NULL`).
- **Subárbol**: cada hijo es la raíz de un árbol más chico. Esta idea es la base de todos los algoritmos de la lección: una función que resuelve el problema para un árbol puede resolverlo llamándose a sí misma para sus dos subárboles.
- **Nivel**: la distancia a la raíz. La raíz está en el nivel 0.
- **Altura**: la cantidad de nodos del camino más largo desde la raíz hasta una hoja. En este curso un árbol vacío tiene altura 0 y uno con un solo nodo, altura 1; el árbol del dibujo tiene altura 3. Algunos libros cuentan aristas en lugar de nodos y obtienen uno menos: lo importante es ser consistente.

## El nodo en C

```c
typedef struct Nodo {
    int dato;
    struct Nodo *izquierdo;   // subárbol de los menores, o NULL
    struct Nodo *derecho;     // subárbol de los mayores, o NULL
} Nodo;
```

Como en las listas, la estructura es autorreferenciada, y un árbol vacío es un puntero `Nodo *raiz = NULL`. La regla de propiedad también es la misma: **el árbol es dueño de todos sus nodos**, y quien tiene la raíz es dueño del árbol entero.

```c
// Crea una hoja con dato.
// Propiedad: el llamador es dueño del nodo devuelto. Devuelve NULL si no hay memoria.
Nodo *crear_nodo(int dato) {
    Nodo *nodo = malloc(sizeof *nodo);
    if (nodo == NULL) {
        return NULL;
    }
    nodo->dato = dato;
    nodo->izquierdo = NULL;
    nodo->derecho = NULL;
    return nodo;
}
```

## La regla del árbol binario de búsqueda

Un árbol binario cualquiera no tiene orden. Un **árbol binario de búsqueda** cumple, para **cada** nodo:

1. todos los valores de su subárbol izquierdo son **menores** que el valor del nodo;
2. todos los valores de su subárbol derecho son **mayores** que el valor del nodo.

En esta lección no se guardan valores repetidos: insertar un valor que ya está no cambia el árbol.

### Insertar

Insertar es buscar el lugar vacío (`NULL`) donde le corresponde estar al valor y colgar ahí un nodo nuevo. Ese lugar es un puntero que hay que **modificar**: la raíz, si el árbol está vacío, o el campo `izquierdo` o `derecho` de algún nodo. Por eso la función recibe `Nodo **raiz`, igual que las funciones de listas que cambian la cabeza.

```c
// Inserta dato en el árbol. Devuelve false solo si no hay memoria.
// Si dato ya estaba, el árbol no cambia y devuelve true.
bool insertar(Nodo **raiz, int dato) {
    if (*raiz == NULL) {                 // caso base: encontramos el lugar
        *raiz = crear_nodo(dato);        // el árbol es dueño del nodo nuevo
        return *raiz != NULL;
    }
    if (dato < (*raiz)->dato) {
        return insertar(&(*raiz)->izquierdo, dato);
    }
    if (dato > (*raiz)->dato) {
        return insertar(&(*raiz)->derecho, dato);
    }
    return true;                          // ya estaba
}
```

Aplica la receta de `recursividad`: un **caso base** que no se llama a sí mismo (el subárbol vacío) y un **caso recursivo** que trabaja sobre un problema más chico (uno de los dos subárboles). `&(*raiz)->izquierdo` es la dirección del campo `izquierdo` del nodo actual: la siguiente llamada podrá escribir en él.

Insertar 50, 30, 70 y 40, en ese orden:

```text
insertar 50      insertar 30      insertar 70       insertar 40: 40 < 50, va a la izquierda;
                                                    40 > 30, va a la derecha de 30
  [50]             [50]              [50]                 [50]
                   /                 /  \                 /  \
                [30]              [30]  [70]           [30]  [70]
                                                          \
                                                          [40]
```

### Buscar

La búsqueda sigue el mismo camino que la inserción, pero solo lee:

```c
// Devuelve el nodo que contiene dato, o NULL si no está.
// El nodo sigue siendo del árbol: el llamador solo lo toma prestado.
const Nodo *buscar(const Nodo *raiz, int dato) {
    if (raiz == NULL || raiz->dato == dato) {
        return raiz;
    }
    if (dato < raiz->dato) {
        return buscar(raiz->izquierdo, dato);
    }
    return buscar(raiz->derecho, dato);
}
```

Cada llamada baja un nivel y descarta el otro subárbol entero. La cantidad de pasos es, como mucho, la altura del árbol.

## Recorridos

Un **recorrido** visita todos los nodos una vez. En una lista hay un solo orden natural; en un árbol hay varios. Los tres recorridos en profundidad visitan el subárbol izquierdo antes que el derecho, y se diferencian en **cuándo** visitan el nodo actual:

| Recorrido | Orden | Resultado en el árbol de ejemplo |
| --- | --- | --- |
| **Inorden** | izquierdo, nodo, derecho | 20 30 40 50 60 70 80 |
| **Preorden** | nodo, izquierdo, derecho | 50 30 20 40 70 60 80 |
| **Postorden** | izquierdo, derecho, nodo | 20 40 30 60 80 70 50 |

```c
void inorden(const Nodo *raiz) {
    if (raiz != NULL) {
        inorden(raiz->izquierdo);
        printf("%d ", raiz->dato);
        inorden(raiz->derecho);
    }
}

void preorden(const Nodo *raiz) {
    if (raiz != NULL) {
        printf("%d ", raiz->dato);
        preorden(raiz->izquierdo);
        preorden(raiz->derecho);
    }
}

void postorden(const Nodo *raiz) {
    if (raiz != NULL) {
        postorden(raiz->izquierdo);
        postorden(raiz->derecho);
        printf("%d ", raiz->dato);
    }
}
```

Cada uno tiene su uso:

- **Inorden** en un árbol binario de búsqueda produce los valores **ordenados** de menor a mayor: primero todos los menores, después el nodo, después todos los mayores.
- **Preorden** visita cada padre antes que sus hijos. Si insertas los valores en ese orden en un árbol vacío, obtienes una copia con la misma forma.
- **Postorden** visita cada padre después de sus hijos. Es el orden que hace falta para liberar el árbol.

## Liberar el árbol en postorden

Un nodo solo se puede liberar cuando ya no hace falta leer sus punteros. Si liberas primero la raíz, ya no puedes leer `raiz->izquierdo` ni `raiz->derecho` sin un uso después de liberar, y si no los lees, sus subárboles quedan inalcanzables: una fuga. En postorden, cada nodo se libera después de sus dos subárboles:

```c
// Libera todos los nodos del árbol. El árbol es dueño de ellos, así que
// después de esta llamada ningún puntero a sus nodos es válido.
void destruir_arbol(Nodo *raiz) {
    if (raiz == NULL) {
        return;
    }
    destruir_arbol(raiz->izquierdo);
    destruir_arbol(raiz->derecho);
    free(raiz);   // los hijos ya se liberaron; este nodo es el último en irse
}
```

Quien llama debe dejar su raíz en `NULL` después: `destruir_arbol(raiz); raiz = NULL;`. Un programa que crea un árbol y no lo destruye tiene una fuga de un bloque por nodo.

## Altura, mínimo y máximo

La altura se define de forma recursiva: un árbol vacío mide 0, y uno no vacío mide 1 más la altura de su subárbol más alto.

```c
size_t altura(const Nodo *raiz) {
    if (raiz == NULL) {
        return 0;
    }
    size_t izquierda = altura(raiz->izquierdo);
    size_t derecha = altura(raiz->derecho);
    return 1 + (izquierda > derecha ? izquierda : derecha);
}
```

Por la regla del árbol de búsqueda, el mínimo es el nodo más a la izquierda y el máximo, el más a la derecha. No hace falta recursividad: basta con bajar por un lado. Un árbol vacío no tiene mínimo, así que la función devuelve `bool` y entrega el valor por un puntero de salida:

```c
// Guarda en *resultado el menor valor. Devuelve false si el árbol está vacío.
bool minimo(const Nodo *raiz, int *resultado) {
    if (raiz == NULL) {
        return false;
    }
    while (raiz->izquierdo != NULL) {
        raiz = raiz->izquierdo;
    }
    *resultado = raiz->dato;
    return true;
}

bool maximo(const Nodo *raiz, int *resultado) {
    if (raiz == NULL) {
        return false;
    }
    while (raiz->derecho != NULL) {
        raiz = raiz->derecho;
    }
    *resultado = raiz->dato;
    return true;
}
```

## Programa completo

Este programa construye el árbol del ejemplo, lo recorre, busca, calcula la altura y los extremos, y lo destruye. Compílalo con `-fsanitize=address` para comprobar que no queda ningún nodo sin liberar ni hay accesos inválidos.

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Nodo {
    int dato;
    struct Nodo *izquierdo;
    struct Nodo *derecho;
} Nodo;

// Propiedad: el llamador es dueño del nodo devuelto. NULL si no hay memoria.
Nodo *crear_nodo(int dato) {
    Nodo *nodo = malloc(sizeof *nodo);
    if (nodo == NULL) {
        return NULL;
    }
    nodo->dato = dato;
    nodo->izquierdo = NULL;
    nodo->derecho = NULL;
    return nodo;
}

bool insertar(Nodo **raiz, int dato) {
    if (*raiz == NULL) {
        *raiz = crear_nodo(dato);
        return *raiz != NULL;
    }
    if (dato < (*raiz)->dato) {
        return insertar(&(*raiz)->izquierdo, dato);
    }
    if (dato > (*raiz)->dato) {
        return insertar(&(*raiz)->derecho, dato);
    }
    return true;
}

const Nodo *buscar(const Nodo *raiz, int dato) {
    if (raiz == NULL || raiz->dato == dato) {
        return raiz;
    }
    if (dato < raiz->dato) {
        return buscar(raiz->izquierdo, dato);
    }
    return buscar(raiz->derecho, dato);
}

void inorden(const Nodo *raiz) {
    if (raiz != NULL) {
        inorden(raiz->izquierdo);
        printf("%d ", raiz->dato);
        inorden(raiz->derecho);
    }
}

void preorden(const Nodo *raiz) {
    if (raiz != NULL) {
        printf("%d ", raiz->dato);
        preorden(raiz->izquierdo);
        preorden(raiz->derecho);
    }
}

void postorden(const Nodo *raiz) {
    if (raiz != NULL) {
        postorden(raiz->izquierdo);
        postorden(raiz->derecho);
        printf("%d ", raiz->dato);
    }
}

size_t altura(const Nodo *raiz) {
    if (raiz == NULL) {
        return 0;
    }
    size_t izquierda = altura(raiz->izquierdo);
    size_t derecha = altura(raiz->derecho);
    return 1 + (izquierda > derecha ? izquierda : derecha);
}

bool minimo(const Nodo *raiz, int *resultado) {
    if (raiz == NULL) {
        return false;
    }
    while (raiz->izquierdo != NULL) {
        raiz = raiz->izquierdo;
    }
    *resultado = raiz->dato;
    return true;
}

bool maximo(const Nodo *raiz, int *resultado) {
    if (raiz == NULL) {
        return false;
    }
    while (raiz->derecho != NULL) {
        raiz = raiz->derecho;
    }
    *resultado = raiz->dato;
    return true;
}

// El árbol es dueño de todos sus nodos: se liberan en postorden.
void destruir_arbol(Nodo *raiz) {
    if (raiz == NULL) {
        return;
    }
    destruir_arbol(raiz->izquierdo);
    destruir_arbol(raiz->derecho);
    free(raiz);
}

int main(void) {
    const int valores[] = {50, 30, 70, 20, 40, 60, 80};
    size_t cantidad = sizeof valores / sizeof valores[0];
    Nodo *raiz = NULL;   // main es dueña del árbol

    for (size_t i = 0; i < cantidad; i++) {
        if (!insertar(&raiz, valores[i])) {
            fprintf(stderr, "Sin memoria\n");
            destruir_arbol(raiz);
            return 1;
        }
    }

    printf("Inorden:   ");
    inorden(raiz);
    printf("\nPreorden:  ");
    preorden(raiz);
    printf("\nPostorden: ");
    postorden(raiz);
    printf("\n");

    printf("¿Está el 60? %s\n", buscar(raiz, 60) != NULL ? "sí" : "no");
    printf("¿Está el 65? %s\n", buscar(raiz, 65) != NULL ? "sí" : "no");
    printf("Altura: %zu\n", altura(raiz));

    int menor;
    int mayor;
    if (minimo(raiz, &menor) && maximo(raiz, &mayor)) {
        printf("Mínimo: %d, máximo: %d\n", menor, mayor);
    }

    destruir_arbol(raiz);
    raiz = NULL;
    printf("Altura después de destruir: %zu\n", altura(raiz));
    return 0;
}
```

Salida:

```text
Inorden:   20 30 40 50 60 70 80
Preorden:  50 30 20 40 70 60 80
Postorden: 20 40 30 60 80 70 50
¿Está el 60? sí
¿Está el 65? no
Altura: 3
Mínimo: 20, máximo: 80
Altura después de destruir: 0
```

> **C moderno (C23):** `bool`, `true` y `false` son palabras clave.
>
> **C básico:** en C99 y C17 agrega `#include <stdbool.h>` para compilar este programa.

## Extensión: eliminar un valor

Eliminar es la operación más delicada, porque el árbol tiene que seguir cumpliendo la regla de búsqueda. Primero se encuentra el nodo (igual que en `buscar`) y después hay tres casos:

1. **Es una hoja:** se libera y el puntero que apuntaba a él pasa a `NULL`.
2. **Tiene un solo hijo:** ese hijo ocupa su lugar y el nodo se libera.
3. **Tiene dos hijos:** no se puede quitar sin romper el árbol. Se busca su **sucesor**, el menor valor del subárbol derecho (el mínimo de ese subárbol), que es el siguiente en inorden. Se copia ese valor en el nodo y se elimina el sucesor de su subárbol. El sucesor no tiene hijo izquierdo, así que su eliminación siempre es el caso 1 o el 2.

```text
eliminar 30 (dos hijos)             sucesor de 30: el mínimo de su derecha, 40

        [50]                               [50]
        /  \                               /  \
     [30]  [70]       copiar 40,        [40]  [70]
     /  \             eliminar 40       /
  [20]  [40]          de la derecha  [20]
```

Como el puntero que apunta al nodo puede cambiar (la raíz, o el campo de su padre), la función recibe `Nodo **raiz`:

```c
// Elimina dato del árbol y libera su nodo. Devuelve false si no estaba.
bool eliminar(Nodo **raiz, int dato) {
    Nodo *nodo = *raiz;
    if (nodo == NULL) {
        return false;
    }
    if (dato < nodo->dato) {
        return eliminar(&nodo->izquierdo, dato);
    }
    if (dato > nodo->dato) {
        return eliminar(&nodo->derecho, dato);
    }
    if (nodo->izquierdo == NULL || nodo->derecho == NULL) {
        // Casos 1 y 2: el hijo que exista (o NULL) ocupa su lugar.
        *raiz = nodo->izquierdo != NULL ? nodo->izquierdo : nodo->derecho;
        free(nodo);
        return true;
    }
    // Caso 3: copiar el sucesor y eliminarlo del subárbol derecho.
    Nodo *sucesor = nodo->derecho;
    while (sucesor->izquierdo != NULL) {
        sucesor = sucesor->izquierdo;
    }
    nodo->dato = sucesor->dato;
    return eliminar(&nodo->derecho, sucesor->dato);
}
```

En los casos 1 y 2, `*raiz` se actualiza **antes** del `free`, y el nodo liberado ya no es alcanzable desde el árbol. En el caso 3 no se libera el nodo encontrado sino el del sucesor, en la llamada recursiva.

## Costo: balanceado frente a degenerado

Buscar, insertar y eliminar recorren un único camino desde la raíz, así que su costo es proporcional a la **altura**:

- En un árbol **balanceado** (las ramas tienen alturas parecidas), cada nivel duplica la cantidad de nodos: con *n* nodos la altura es cerca de log₂ n. Un millón de nodos caben en unos 20 niveles: O(log n).
- En un árbol **degenerado**, cada nodo tiene un solo hijo y el árbol es, en la práctica, una lista: la altura es *n* y las operaciones son O(n).

Que el árbol quede balanceado o degenerado depende del **orden de inserción**. Insertar valores ya ordenados produce el peor caso:

```text
insertar 10, 20, 30, 40, 50 en ese orden:

[10]
   \
   [20]
      \
      [30]          altura 5 con 5 nodos: buscar 50 visita los 5
         \
         [40]
            \
            [50]
```

| Operación | Balanceado | Degenerado | Lista ordenada | Arreglo ordenado |
| --- | --- | --- | --- | --- |
| Buscar | O(log n) | O(n) | O(n) | O(log n) |
| Insertar | O(log n) | O(n) | O(n) | O(n) |
| Eliminar | O(log n) | O(n) | O(n) | O(n) |
| Recorrer en orden | O(n) | O(n) | O(n) | O(n) |
| Destruir | O(n) | O(n) | O(n) | O(1) |

## Usos y límites

Los árboles binarios de búsqueda sirven cuando los datos cambian con frecuencia y además hay que buscarlos o recorrerlos en orden: índices, diccionarios ordenados, conjuntos sin repetidos, la tabla de símbolos de un compilador. Otros árboles binarios no son de búsqueda: el árbol de una expresión aritmética, por ejemplo, guarda operadores en los nodos internos y números en las hojas.

Sus límites también importan:

- **No se balancean solos.** Con datos ordenados o casi ordenados degeneran en una lista. Los árboles **AVL** y **rojinegros** agregan rotaciones que mantienen la altura en O(log n); son el paso siguiente si estudias estructuras de datos.
- **La recursividad tiene un costo.** Cada nivel es un marco más en la pila de llamadas (lección `recursividad`). En un árbol degenerado con cientos de miles de nodos, `destruir_arbol` o `altura` pueden agotar la pila; en esos casos se usan versiones iterativas.
- **Memoria y dispersión.** Cada valor ocupa un nodo con dos punteros, en un bloque aparte del heap. Para datos que casi no cambian, un arreglo ordenado con búsqueda binaria usa menos memoria y es más rápido de recorrer.

## Resumen

- Un árbol binario es una estructura jerárquica: cada nodo tiene como máximo dos hijos.
- En un árbol binario de búsqueda, los menores van a la izquierda y los mayores a la derecha, en cada nodo.
- Insertar y buscar se escriben de forma recursiva; insertar recibe `Nodo **raiz` porque modifica un puntero.
- Cada nodo se crea con `malloc(sizeof *nodo)` y se comprueba contra `NULL`.
- Los recorridos inorden, preorden y postorden visitan el nodo en distinto momento; inorden da los valores ordenados.
- El árbol se libera en postorden: primero los hijos, después el padre.
- El costo de las operaciones depende de la altura: O(log n) si está balanceado, O(n) si degeneró.

## Ejercicios prácticos

### Ejercicio 1: recorridos a mano

Se insertan, en este orden, los valores 8, 3, 10, 1, 6, 14, 4, 7 en un árbol vacío. Dibuja el árbol y escribe sus recorridos inorden, preorden y postorden. ¿Cuál es su altura?

<details><summary>Ver solución</summary>

```text
          [8]
         /   \
      [3]     [10]
     /   \       \
   [1]   [6]     [14]
        /   \
      [4]   [7]
```

- Inorden: 1 3 4 6 7 8 10 14
- Preorden: 8 3 1 6 4 7 10 14
- Postorden: 1 4 7 6 3 14 10 8

La altura es 4 (camino 8, 3, 6, 4).

</details>

### Ejercicio 2: contar nodos y hojas

Escribe `size_t contar_nodos(const Nodo *raiz)` y `size_t contar_hojas(const Nodo *raiz)` de forma recursiva.

<details><summary>Ver solución</summary>

```c
size_t contar_nodos(const Nodo *raiz) {
    if (raiz == NULL) {
        return 0;
    }
    return 1 + contar_nodos(raiz->izquierdo) + contar_nodos(raiz->derecho);
}

size_t contar_hojas(const Nodo *raiz) {
    if (raiz == NULL) {
        return 0;
    }
    if (raiz->izquierdo == NULL && raiz->derecho == NULL) {
        return 1;
    }
    return contar_hojas(raiz->izquierdo) + contar_hojas(raiz->derecho);
}
```

Las dos visitan cada nodo una vez: O(n). Solo leen el árbol, por eso reciben `const Nodo *`.

</details>

### Ejercicio 3: encuentra el error

Este `destruir` compila, pero AddressSanitizer informa `heap-use-after-free`. ¿Por qué? ¿Qué recorrido está usando?

<!-- c-check: skip -->
```c
void destruir(Nodo *raiz) {
    if (raiz == NULL) {
        return;
    }
    free(raiz);
    destruir(raiz->izquierdo);
    destruir(raiz->derecho);
}
```

<details><summary>Ver solución</summary>

Libera en **preorden**: primero el nodo y después lee `raiz->izquierdo` y `raiz->derecho`, que están dentro del bloque que acaba de liberar. Hay que liberar en **postorden**, como `destruir_arbol`:

```c
void destruir(Nodo *raiz) {
    if (raiz == NULL) {
        return;
    }
    destruir(raiz->izquierdo);
    destruir(raiz->derecho);
    free(raiz);
}
```

</details>

### Ejercicio 4: eliminar y comprobar

Escribe un programa completo que inserte 50, 30, 70, 20, 40, 60, 80, elimine una hoja (20), un nodo con un hijo (30, después de quitar el 20) y la raíz (50, que tiene dos hijos), muestre el inorden después de cada paso y destruya el árbol. Compílalo con `-fsanitize=address`.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Nodo {
    int dato;
    struct Nodo *izquierdo;
    struct Nodo *derecho;
} Nodo;

bool insertar(Nodo **raiz, int dato) {
    if (*raiz == NULL) {
        Nodo *nodo = malloc(sizeof *nodo);
        if (nodo == NULL) {
            return false;
        }
        nodo->dato = dato;
        nodo->izquierdo = NULL;
        nodo->derecho = NULL;
        *raiz = nodo;
        return true;
    }
    if (dato < (*raiz)->dato) {
        return insertar(&(*raiz)->izquierdo, dato);
    }
    if (dato > (*raiz)->dato) {
        return insertar(&(*raiz)->derecho, dato);
    }
    return true;
}

bool eliminar(Nodo **raiz, int dato) {
    Nodo *nodo = *raiz;
    if (nodo == NULL) {
        return false;
    }
    if (dato < nodo->dato) {
        return eliminar(&nodo->izquierdo, dato);
    }
    if (dato > nodo->dato) {
        return eliminar(&nodo->derecho, dato);
    }
    if (nodo->izquierdo == NULL || nodo->derecho == NULL) {
        *raiz = nodo->izquierdo != NULL ? nodo->izquierdo : nodo->derecho;
        free(nodo);
        return true;
    }
    Nodo *sucesor = nodo->derecho;
    while (sucesor->izquierdo != NULL) {
        sucesor = sucesor->izquierdo;
    }
    nodo->dato = sucesor->dato;
    return eliminar(&nodo->derecho, sucesor->dato);
}

void inorden(const Nodo *raiz) {
    if (raiz != NULL) {
        inorden(raiz->izquierdo);
        printf("%d ", raiz->dato);
        inorden(raiz->derecho);
    }
}

void destruir_arbol(Nodo *raiz) {
    if (raiz != NULL) {
        destruir_arbol(raiz->izquierdo);
        destruir_arbol(raiz->derecho);
        free(raiz);
    }
}

void mostrar(const char *titulo, const Nodo *raiz) {
    printf("%-14s", titulo);
    inorden(raiz);
    printf("\n");
}

int main(void) {
    const int valores[] = {50, 30, 70, 20, 40, 60, 80};
    Nodo *raiz = NULL;

    for (size_t i = 0; i < sizeof valores / sizeof valores[0]; i++) {
        if (!insertar(&raiz, valores[i])) {
            destruir_arbol(raiz);
            return 1;
        }
    }
    mostrar("Inicial:", raiz);
    eliminar(&raiz, 20);
    mostrar("Sin 20:", raiz);       // hoja
    eliminar(&raiz, 30);
    mostrar("Sin 30:", raiz);       // un hijo (40)
    eliminar(&raiz, 50);
    mostrar("Sin 50:", raiz);       // dos hijos: 60 pasa a la raíz
    printf("¿Eliminar 99? %s\n", eliminar(&raiz, 99) ? "sí" : "no estaba");

    destruir_arbol(raiz);
    return 0;
}
```

Salida:

```text
Inicial:      20 30 40 50 60 70 80
Sin 20:       30 40 50 60 70 80
Sin 30:       40 50 60 70 80
Sin 50:       40 60 70 80
¿Eliminar 99? no estaba
```

El inorden sigue ordenado después de cada eliminación: es la prueba de que el árbol conserva la regla de búsqueda.

</details>
