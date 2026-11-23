---
title: 'Listas'
course: 'c'
slug: 'estructuras-dinamicas-listas'
order: 30
lang: 'es'
published: true
---

Un arreglo guarda sus elementos uno al lado del otro: acceder al quinto es inmediato, pero insertar al principio obliga a correr todos los demás, y crecer exige `realloc`. Una **lista enlazada** cambia esa idea: cada elemento vive en su propio bloque del heap y conoce la dirección del siguiente. Ya tienes todas las piezas para construirla: estructuras, punteros, `->`, punteros dobles, `malloc` y `free`, y la regla de que cada bloque tiene exactamente un dueño. En esta lección las juntas.

## Objetivos

- Definir un **nodo** con `typedef struct` y un puntero al nodo siguiente.
- Crear nodos con `malloc(sizeof *nodo)`, comprobar el resultado contra `NULL` y documentar quién es el dueño de cada uno.
- Implementar una lista simplemente enlazada: insertar al inicio, al final y en orden; buscar; eliminar por valor (en la cabeza, en el medio y un valor ausente); recorrer; contar; destruir.
- Entender por qué las funciones que cambian la cabeza reciben `Nodo **cabeza`.
- Extender la idea a una lista doblemente enlazada.
- Comparar el costo de cada operación con el de un arreglo.

**Requisitos previos:** `concepto-de-estructuras`, `punteros-y-direcciones`, `punteros-arreglos-y-estructuras`, `memoria-dinamica` y `propiedad-y-errores-de-memoria`.

## Nodos y enlaces

Una lista enlazada es una cadena de **nodos**. Cada nodo guarda un dato y la dirección del nodo siguiente. El último nodo guarda `NULL` en ese campo: así se marca el final.

```c
typedef struct Nodo {
    int dato;
    struct Nodo *siguiente;   // dirección del próximo nodo, o NULL si es el último
} Nodo;
```

La estructura es **autorreferenciada**: contiene un puntero a otra estructura de su mismo tipo. Dentro de las llaves todavía no existe el alias `Nodo`, por eso el campo se declara como `struct Nodo *`. Después del `typedef` puedes escribir simplemente `Nodo`.

Para usar la lista solo necesitas una variable: un puntero al primer nodo, la **cabeza**. Una lista vacía es una cabeza que vale `NULL`.

```c
Nodo *cabeza = NULL;   // lista vacía
```

### La lista en memoria

Así queda una lista con los valores 3, 7 y 9. La variable `cabeza` vive en la pila de `main`; los nodos viven en el heap, en direcciones que no tienen por qué ser contiguas (las direcciones son de ejemplo):

```text
 pila de main                 heap
+--------------+     +------------------+     +------------------+     +------------------+
| cabeza       |     | 0x5010           |     | 0x5080           |     | 0x5030           |
| 0x5010  -----+---->| dato: 3          |  +->| dato: 7          |  +->| dato: 9          |
+--------------+     | siguiente: 0x5080+--+  | siguiente: 0x5030+--+  | siguiente: NULL  |
                     +------------------+     +------------------+     +------------------+
```

Esa diferencia con el arreglo explica todo lo demás: para llegar al tercer nodo hay que pasar por los dos primeros, pero para insertar o quitar un nodo basta con cambiar un par de punteros, sin mover ningún dato.

## Crear un nodo

Toda la lista se construye con una función que reserva un nodo, comprueba la reserva y lo deja en un estado válido:

```c
// Crea un nodo con dato y sin siguiente.
// Propiedad: el llamador es dueño del nodo devuelto (lo libera, o lo enlaza
// en una lista que pasa a ser su dueña). Devuelve NULL si no hay memoria.
Nodo *crear_nodo(int dato) {
    Nodo *nodo = malloc(sizeof *nodo);
    if (nodo == NULL) {
        return NULL;
    }
    nodo->dato = dato;
    nodo->siguiente = NULL;
    return nodo;
}
```

- `sizeof *nodo` es el tamaño de lo apuntado (un `Nodo`), igual que en `memoria-dinamica`: si mañana cambias el tipo, el tamaño se ajusta solo.
- No se convierte el resultado de `malloc`: en C, `void *` se convierte solo.
- Si `malloc` falla, la función lo informa devolviendo `NULL`. Quien la llama decide qué hacer.

La regla de propiedad de la lista es simple: **la lista es dueña de todos sus nodos**. Quien tiene la cabeza es dueño de la lista entera y, cuando termina, la destruye con una sola llamada.

## Por qué `Nodo **cabeza`

Insertar al inicio cambia la cabeza. En C los argumentos se pasan siempre por valor (lección `variables-parametros-y-pasaje`), así que esta versión no funciona:

```c
// INCORRECTO: modifica una copia de la cabeza
void insertar_al_inicio_mal(Nodo *cabeza, Nodo *nuevo) {
    nuevo->siguiente = cabeza;
    cabeza = nuevo;   // cambia la copia local; la cabeza de main sigue igual
}
```

La función recibe una copia del puntero. Asignar a esa copia no cambia la variable de `main`, y el nodo nuevo queda inalcanzable: una fuga. La solución es la misma que con cualquier variable que una función deba modificar: pasar **su dirección**. Como la variable es un `Nodo *`, su dirección es un `Nodo **`:

```c
// Inserta dato al principio de la lista.
// Devuelve false si no hay memoria (la lista queda igual).
bool insertar_al_inicio(Nodo **cabeza, int dato) {
    Nodo *nuevo = crear_nodo(dato);
    if (nuevo == NULL) {
        return false;
    }
    nuevo->siguiente = *cabeza;   // el nuevo apunta al que era el primero
    *cabeza = nuevo;              // la cabeza de main ahora apunta al nuevo
    return true;                  // la lista es dueña del nodo nuevo
}
```

Se llama con `insertar_al_inicio(&cabeza, 5)`. Dentro, `*cabeza` es la variable `cabeza` de `main`.

```text
antes:   cabeza --> [3] --> [7] --> NULL

paso 1:  nuevo  --> [5] --+
                          v
         cabeza --------> [3] --> [7] --> NULL

paso 2:  cabeza --> [5] --> [3] --> [7] --> NULL
```

El orden importa: si primero haces `*cabeza = nuevo`, pierdes la dirección del antiguo primer nodo y, con ella, el resto de la lista.

## Recorrer, contar y buscar

Recorrer no cambia la lista, así que basta con recibir la cabeza por valor. El puntero auxiliar `actual` avanza de nodo en nodo hasta encontrar `NULL`:

```c
// Muestra la lista. Solo la lee (const): no toma la propiedad de nada.
void imprimir_lista(const Nodo *cabeza) {
    for (const Nodo *actual = cabeza; actual != NULL; actual = actual->siguiente) {
        printf("%d -> ", actual->dato);
    }
    printf("NULL\n");
}

size_t longitud(const Nodo *cabeza) {
    size_t cantidad = 0;
    for (const Nodo *actual = cabeza; actual != NULL; actual = actual->siguiente) {
        cantidad++;
    }
    return cantidad;
}

// Devuelve el primer nodo que contiene dato, o NULL si no está.
// El nodo devuelto sigue siendo de la lista: el llamador solo lo toma prestado.
const Nodo *buscar(const Nodo *cabeza, int dato) {
    for (const Nodo *actual = cabeza; actual != NULL; actual = actual->siguiente) {
        if (actual->dato == dato) {
            return actual;
        }
    }
    return NULL;
}
```

La búsqueda se detiene en cuanto encuentra el valor. La longitud usa `size_t`, el tipo de los tamaños y las cantidades, y se imprime con `%zu`.

## Insertar al final

Para insertar al final hay que llegar al último nodo, el que tiene `siguiente == NULL`. Si la lista está vacía no hay último nodo: el nuevo pasa a ser la cabeza, y por eso esta función también recibe `Nodo **`.

```c
// Inserta dato al final de la lista. Devuelve false si no hay memoria.
bool insertar_al_final(Nodo **cabeza, int dato) {
    Nodo *nuevo = crear_nodo(dato);
    if (nuevo == NULL) {
        return false;
    }
    if (*cabeza == NULL) {          // lista vacía: el nuevo es el primero
        *cabeza = nuevo;
        return true;
    }
    Nodo *ultimo = *cabeza;
    while (ultimo->siguiente != NULL) {
        ultimo = ultimo->siguiente;
    }
    ultimo->siguiente = nuevo;
    return true;
}
```

## Insertar en orden

Si la lista se mantiene ordenada de menor a mayor, el nuevo valor va justo antes del primer nodo cuyo dato sea mayor o igual. Hay dos casos: va en la cabeza (lista vacía o valor menor que el primero) o va después de algún nodo, al que llamamos `anterior`.

```c
// Inserta dato manteniendo la lista ordenada de menor a mayor.
// Devuelve false si no hay memoria.
bool insertar_ordenado(Nodo **cabeza, int dato) {
    Nodo *nuevo = crear_nodo(dato);
    if (nuevo == NULL) {
        return false;
    }
    if (*cabeza == NULL || dato <= (*cabeza)->dato) {   // va primero
        nuevo->siguiente = *cabeza;
        *cabeza = nuevo;
        return true;
    }
    Nodo *anterior = *cabeza;
    while (anterior->siguiente != NULL && anterior->siguiente->dato < dato) {
        anterior = anterior->siguiente;
    }
    nuevo->siguiente = anterior->siguiente;   // primero enlazar el resto
    anterior->siguiente = nuevo;              // después colgar el nuevo
    return true;
}
```

La condición `anterior->siguiente != NULL && ...` usa el cortocircuito de `&&` (lección `operadores`): si no hay siguiente, no se evalúa `anterior->siguiente->dato`, que sería desreferenciar `NULL`.

## Eliminar por valor

Eliminar un nodo es desenganchar sus vecinos y liberarlo. Hay tres situaciones:

1. **El valor está en la cabeza:** la cabeza pasa a ser el segundo nodo.
2. **El valor está en el medio o al final:** el nodo `anterior` saltea al eliminado.
3. **El valor no está:** la lista no cambia y la función lo informa.

```c
// Elimina el primer nodo que contiene dato y lo libera.
// Devuelve false si el valor no estaba.
bool eliminar(Nodo **cabeza, int dato) {
    Nodo *actual = *cabeza;
    Nodo *anterior = NULL;
    while (actual != NULL && actual->dato != dato) {
        anterior = actual;
        actual = actual->siguiente;
    }
    if (actual == NULL) {                    // caso 3: no está
        return false;
    }
    if (anterior == NULL) {                  // caso 1: era la cabeza
        *cabeza = actual->siguiente;
    } else {                                 // caso 2: estaba en el medio o al final
        anterior->siguiente = actual->siguiente;
    }
    free(actual);   // la lista era su dueña; nadie más debe usar este nodo
    return true;
}
```

```text
eliminar 7:   cabeza --> [3] --> [7] --> [9] --> NULL
                         anterior actual

después:      cabeza --> [3] -----------> [9] --> NULL      [7] liberado
```

Primero se desengancha y después se libera. Si haces `free(actual)` antes de leer `actual->siguiente`, lees memoria ya liberada: un uso después de liberar (lección `propiedad-y-errores-de-memoria`).

## Destruir la lista

Como la lista es dueña de todos sus nodos, necesita una función que los libere a todos. El detalle es guardar el siguiente **antes** de liberar el actual:

```c
// Libera todos los nodos y deja la cabeza en NULL (lista vacía y reutilizable).
void destruir_lista(Nodo **cabeza) {
    Nodo *actual = *cabeza;
    while (actual != NULL) {
        Nodo *siguiente = actual->siguiente;   // guardar antes de liberar
        free(actual);
        actual = siguiente;
    }
    *cabeza = NULL;   // evita que la cabeza de main quede colgando
}
```

Dejar `*cabeza = NULL` evita un puntero colgante: después de destruirla, la variable de `main` describe una lista vacía válida.

## El programa completo

Todas las funciones juntas, con un `main` que ejercita cada caso. Compílalo con AddressSanitizer para comprobar que no hay accesos inválidos ni fugas:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address listas.c -o listas
./listas
```

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Nodo {
    int dato;
    struct Nodo *siguiente;
} Nodo;

// Propiedad: el llamador es dueño del nodo devuelto. NULL si no hay memoria.
Nodo *crear_nodo(int dato) {
    Nodo *nodo = malloc(sizeof *nodo);
    if (nodo == NULL) {
        return NULL;
    }
    nodo->dato = dato;
    nodo->siguiente = NULL;
    return nodo;
}

bool insertar_al_inicio(Nodo **cabeza, int dato) {
    Nodo *nuevo = crear_nodo(dato);
    if (nuevo == NULL) {
        return false;
    }
    nuevo->siguiente = *cabeza;
    *cabeza = nuevo;
    return true;
}

bool insertar_al_final(Nodo **cabeza, int dato) {
    Nodo *nuevo = crear_nodo(dato);
    if (nuevo == NULL) {
        return false;
    }
    if (*cabeza == NULL) {
        *cabeza = nuevo;
        return true;
    }
    Nodo *ultimo = *cabeza;
    while (ultimo->siguiente != NULL) {
        ultimo = ultimo->siguiente;
    }
    ultimo->siguiente = nuevo;
    return true;
}

bool insertar_ordenado(Nodo **cabeza, int dato) {
    Nodo *nuevo = crear_nodo(dato);
    if (nuevo == NULL) {
        return false;
    }
    if (*cabeza == NULL || dato <= (*cabeza)->dato) {
        nuevo->siguiente = *cabeza;
        *cabeza = nuevo;
        return true;
    }
    Nodo *anterior = *cabeza;
    while (anterior->siguiente != NULL && anterior->siguiente->dato < dato) {
        anterior = anterior->siguiente;
    }
    nuevo->siguiente = anterior->siguiente;
    anterior->siguiente = nuevo;
    return true;
}

void imprimir_lista(const Nodo *cabeza) {
    for (const Nodo *actual = cabeza; actual != NULL; actual = actual->siguiente) {
        printf("%d -> ", actual->dato);
    }
    printf("NULL\n");
}

size_t longitud(const Nodo *cabeza) {
    size_t cantidad = 0;
    for (const Nodo *actual = cabeza; actual != NULL; actual = actual->siguiente) {
        cantidad++;
    }
    return cantidad;
}

const Nodo *buscar(const Nodo *cabeza, int dato) {
    for (const Nodo *actual = cabeza; actual != NULL; actual = actual->siguiente) {
        if (actual->dato == dato) {
            return actual;
        }
    }
    return NULL;
}

bool eliminar(Nodo **cabeza, int dato) {
    Nodo *actual = *cabeza;
    Nodo *anterior = NULL;
    while (actual != NULL && actual->dato != dato) {
        anterior = actual;
        actual = actual->siguiente;
    }
    if (actual == NULL) {
        return false;
    }
    if (anterior == NULL) {
        *cabeza = actual->siguiente;
    } else {
        anterior->siguiente = actual->siguiente;
    }
    free(actual);
    return true;
}

// La lista es dueña de todos sus nodos: esta función los libera a todos.
void destruir_lista(Nodo **cabeza) {
    Nodo *actual = *cabeza;
    while (actual != NULL) {
        Nodo *siguiente = actual->siguiente;
        free(actual);
        actual = siguiente;
    }
    *cabeza = NULL;
}

int main(void) {
    Nodo *cabeza = NULL;   // main es dueña de la lista

    if (!insertar_al_final(&cabeza, 7) || !insertar_al_final(&cabeza, 9) ||
        !insertar_al_inicio(&cabeza, 3) || !insertar_ordenado(&cabeza, 8) ||
        !insertar_ordenado(&cabeza, 1)) {
        fprintf(stderr, "Sin memoria\n");
        destruir_lista(&cabeza);   // libera lo que sí se insertó
        return 1;
    }
    imprimir_lista(cabeza);
    printf("Longitud: %zu\n", longitud(cabeza));
    printf("¿Está el 8? %s\n", buscar(cabeza, 8) != NULL ? "sí" : "no");

    eliminar(&cabeza, 1);   // en la cabeza
    eliminar(&cabeza, 8);   // en el medio
    if (!eliminar(&cabeza, 42)) {
        printf("El 42 no estaba en la lista\n");
    }
    imprimir_lista(cabeza);
    printf("Longitud: %zu\n", longitud(cabeza));

    destruir_lista(&cabeza);
    imprimir_lista(cabeza);
    return 0;
}
```

Salida:

```text
1 -> 3 -> 7 -> 8 -> 9 -> NULL
Longitud: 5
¿Está el 8? sí
El 42 no estaba en la lista
3 -> 7 -> 9 -> NULL
Longitud: 3
NULL
```

Fíjate en el camino de error de `main`: si una inserción falla, el programa destruye lo que ya había insertado antes de terminar. Un error no es excusa para una fuga.

> **C moderno (C23):** `bool`, `true` y `false` son palabras clave, por eso el programa no incluye nada para usarlos.
>
> **C básico:** en C99 y C17 agrega `#include <stdbool.h>`.

## Extensión: lista doblemente enlazada

En una lista simple solo se puede avanzar. Para eliminar un nodo hay que conocer su anterior, y eso obliga a recorrer desde la cabeza. Una **lista doblemente enlazada** agrega a cada nodo un puntero al anterior. Si además se guarda un puntero al último nodo, insertar al final y recorrer hacia atrás también son inmediatos.

```c
typedef struct NodoDoble {
    int dato;
    struct NodoDoble *anterior;
    struct NodoDoble *siguiente;
} NodoDoble;

typedef struct {
    NodoDoble *primero;
    NodoDoble *ultimo;
    size_t cantidad;
} ListaDoble;
```

```text
           primero                              ultimo
              |                                    |
              v                                    v
NULL <-- [ant| 3 |sig] <--> [ant| 7 |sig] <--> [ant| 9 |sig] --> NULL
```

Aquí la lista se representa con una estructura `ListaDoble`, y las funciones reciben un `ListaDoble *`: como cambian campos de esa estructura, igual que antes necesitan su dirección.

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct NodoDoble {
    int dato;
    struct NodoDoble *anterior;
    struct NodoDoble *siguiente;
} NodoDoble;

// La lista es dueña de todos sus nodos.
typedef struct {
    NodoDoble *primero;
    NodoDoble *ultimo;
    size_t cantidad;
} ListaDoble;

bool insertar_al_final_doble(ListaDoble *lista, int dato) {
    NodoDoble *nuevo = malloc(sizeof *nuevo);
    if (nuevo == NULL) {
        return false;
    }
    nuevo->dato = dato;
    nuevo->siguiente = NULL;
    nuevo->anterior = lista->ultimo;
    if (lista->ultimo == NULL) {        // lista vacía
        lista->primero = nuevo;
    } else {
        lista->ultimo->siguiente = nuevo;
    }
    lista->ultimo = nuevo;
    lista->cantidad++;
    return true;
}

// Desengancha y libera nodo, que debe pertenecer a lista. No recorre nada.
void eliminar_nodo_doble(ListaDoble *lista, NodoDoble *nodo) {
    if (nodo->anterior == NULL) {
        lista->primero = nodo->siguiente;
    } else {
        nodo->anterior->siguiente = nodo->siguiente;
    }
    if (nodo->siguiente == NULL) {
        lista->ultimo = nodo->anterior;
    } else {
        nodo->siguiente->anterior = nodo->anterior;
    }
    free(nodo);
    lista->cantidad--;
}

void imprimir_al_reves(const ListaDoble *lista) {
    for (const NodoDoble *actual = lista->ultimo; actual != NULL; actual = actual->anterior) {
        printf("%d ", actual->dato);
    }
    printf("\n");
}

void destruir_lista_doble(ListaDoble *lista) {
    NodoDoble *actual = lista->primero;
    while (actual != NULL) {
        NodoDoble *siguiente = actual->siguiente;
        free(actual);
        actual = siguiente;
    }
    lista->primero = NULL;
    lista->ultimo = NULL;
    lista->cantidad = 0;
}

int main(void) {
    ListaDoble lista = {NULL, NULL, 0};

    for (int i = 1; i <= 4; i++) {
        if (!insertar_al_final_doble(&lista, i * 10)) {
            destruir_lista_doble(&lista);
            return 1;
        }
    }
    imprimir_al_reves(&lista);                        // 40 30 20 10
    eliminar_nodo_doble(&lista, lista.primero->siguiente);   // quita el 20
    imprimir_al_reves(&lista);                        // 40 30 10
    printf("Cantidad: %zu\n", lista.cantidad);

    destruir_lista_doble(&lista);
    return 0;
}
```

El precio de la lista doble es un puntero más por nodo y más enlaces que mantener en cada operación: olvidar actualizar uno de los cuatro punteros es el error típico.

## Costo de cada operación: lista frente a arreglo

Con *n* elementos, O(1) significa "no depende de n" y O(n) significa "crece con n" (lección `busqueda-en-arreglos`).

| Operación | Arreglo | Lista simple | Lista doble con `ultimo` |
| --- | --- | --- | --- |
| Acceder al elemento i | O(1) | O(n) | O(n) |
| Insertar al inicio | O(n) (correr todo) | O(1) | O(1) |
| Insertar al final | O(1) si hay capacidad; `realloc` si no | O(n) (sin puntero al último) | O(1) |
| Insertar en orden | O(n) | O(n) | O(n) |
| Buscar un valor | O(n); O(log n) si está ordenado (búsqueda binaria) | O(n) | O(n) |
| Eliminar un nodo conocido | O(n) (correr todo) | O(n) (hay que hallar el anterior) | O(1) |
| Memoria extra | ninguna | un puntero por nodo | dos punteros por nodo |

Las listas ganan cuando se inserta y se elimina mucho en los extremos o en un punto ya conocido. Los arreglos ganan cuando se accede por posición o se recorre mucho: sus elementos están contiguos, y el procesador los lee más rápido que nodos dispersos por el heap. En la práctica, un arreglo dinámico es la opción por defecto, y la lista es la respuesta a un problema concreto.

## Resumen

- Un nodo guarda un dato y un puntero al siguiente; el último apunta a `NULL`.
- Cada nodo se crea con `malloc(sizeof *nodo)` y se comprueba contra `NULL`.
- La lista es dueña de sus nodos: `destruir_lista` los libera todos, guardando el siguiente antes de cada `free`.
- Las funciones que pueden cambiar la cabeza reciben `Nodo **cabeza`, porque C pasa los argumentos por valor.
- Las operaciones que pueden fallar devuelven `bool`; las cantidades son `size_t`.
- Eliminar es desenganchar primero y liberar después.

## Ejercicios prácticos

### Ejercicio 1: sumar la lista

Escribe `int sumar(const Nodo *cabeza)`, que devuelve la suma de los datos de la lista (0 si está vacía). ¿Por qué no necesita `Nodo **`?

<details><summary>Ver solución</summary>

```c
int sumar(const Nodo *cabeza) {
    int suma = 0;
    for (const Nodo *actual = cabeza; actual != NULL; actual = actual->siguiente) {
        suma += actual->dato;
    }
    return suma;
}
```

Solo lee la lista: no cambia la cabeza ni ningún nodo, así que basta con una copia del puntero, y `const` documenta que no modifica nada.

</details>

### Ejercicio 2: encuentra el error

Este `destruir` compila, pero AddressSanitizer informa `heap-use-after-free`. ¿Por qué? Corrígelo.

<!-- c-check: skip -->
```c
void destruir(Nodo *cabeza) {
    for (Nodo *actual = cabeza; actual != NULL; actual = actual->siguiente) {
        free(actual);
    }
}
```

<details><summary>Ver solución</summary>

La expresión de avance `actual = actual->siguiente` se ejecuta **después** de `free(actual)`: lee el campo `siguiente` de un nodo ya liberado. Hay que guardar el siguiente antes de liberar:

```c
void destruir(Nodo *cabeza) {
    Nodo *actual = cabeza;
    while (actual != NULL) {
        Nodo *siguiente = actual->siguiente;
        free(actual);
        actual = siguiente;
    }
}
```

Además, esta versión deja colgando el puntero del llamador. La versión de la lección recibe `Nodo **cabeza` para dejarlo en `NULL`.

</details>

### Ejercicio 3: eliminar sin casos especiales

La función `eliminar` de la lección distingue si el nodo es la cabeza. Reescríbela recorriendo con un `Nodo **enlace`, que apunta primero a la cabeza y después al campo `siguiente` de cada nodo, para que los tres casos se resuelvan con el mismo código. Pruébala en un programa completo.

<details><summary>Ver solución</summary>

`enlace` guarda la dirección del puntero que habría que cambiar. Al principio es la dirección de la cabeza; después, la dirección del campo `siguiente` del nodo anterior. Así no hace falta un caso especial para la cabeza:

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Nodo {
    int dato;
    struct Nodo *siguiente;
} Nodo;

bool insertar_al_inicio(Nodo **cabeza, int dato) {
    Nodo *nuevo = malloc(sizeof *nuevo);
    if (nuevo == NULL) {
        return false;
    }
    nuevo->dato = dato;
    nuevo->siguiente = *cabeza;
    *cabeza = nuevo;
    return true;
}

bool eliminar(Nodo **cabeza, int dato) {
    Nodo **enlace = cabeza;
    while (*enlace != NULL && (*enlace)->dato != dato) {
        enlace = &(*enlace)->siguiente;
    }
    if (*enlace == NULL) {
        return false;
    }
    Nodo *victima = *enlace;
    *enlace = victima->siguiente;   // el puntero que apuntaba a victima la saltea
    free(victima);
    return true;
}

void imprimir_lista(const Nodo *cabeza) {
    for (const Nodo *actual = cabeza; actual != NULL; actual = actual->siguiente) {
        printf("%d -> ", actual->dato);
    }
    printf("NULL\n");
}

void destruir_lista(Nodo **cabeza) {
    while (*cabeza != NULL) {
        Nodo *siguiente = (*cabeza)->siguiente;
        free(*cabeza);
        *cabeza = siguiente;
    }
}

int main(void) {
    Nodo *cabeza = NULL;
    for (int i = 1; i <= 4; i++) {
        if (!insertar_al_inicio(&cabeza, i)) {
            destruir_lista(&cabeza);
            return 1;
        }
    }
    imprimir_lista(cabeza);              // 4 -> 3 -> 2 -> 1 -> NULL
    eliminar(&cabeza, 4);                // cabeza
    eliminar(&cabeza, 2);                // medio
    printf("%s\n", eliminar(&cabeza, 9) ? "eliminado" : "no estaba");
    imprimir_lista(cabeza);              // 3 -> 1 -> NULL
    destruir_lista(&cabeza);
    return 0;
}
```

</details>

### Ejercicio 4: invertir la lista

Escribe `void invertir(Nodo **cabeza)`, que invierte la lista cambiando solo los punteros, sin crear ni liberar nodos. ¿Cuál es su costo?

<details><summary>Ver solución</summary>

```c
void invertir(Nodo **cabeza) {
    Nodo *anterior = NULL;
    Nodo *actual = *cabeza;
    while (actual != NULL) {
        Nodo *siguiente = actual->siguiente;   // guardar el resto
        actual->siguiente = anterior;          // dar vuelta el enlace
        anterior = actual;
        actual = siguiente;
    }
    *cabeza = anterior;   // el antiguo último es la nueva cabeza
}
```

Visita cada nodo una vez: O(n) en tiempo y O(1) en memoria extra. La propiedad no cambia: los mismos nodos siguen perteneciendo a la misma lista.

</details>
