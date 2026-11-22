---
title: 'Colas'
course: 'c'
slug: 'estructuras-dinamicas-colas'
order: 32
lang: 'es'
published: true
---

Una **cola** funciona como la fila de un banco: quien llega se ubica al **final** y se atiende a quien está en el **frente**. El primero que entra es el primero que sale. Esa regla se llama **FIFO** (*First In, First Out*). Las colas aparecen en todos lados: trabajos que esperan una impresora, mensajes que esperan ser procesados, tareas que esperan su turno en el procesador.

Igual que la pila, la cola es una interfaz que se puede implementar con nodos enlazados o con un arreglo. La diferencia es que trabaja sobre **dos** extremos: se inserta por uno y se quita por el otro.

## Objetivos

- Describir la regla FIFO y las operaciones **encolar** (*enqueue*), **desencolar** (*dequeue*), ver el frente y está vacía.
- Implementar una cola enlazada con punteros al frente y al final, de modo que ambas operaciones sean O(1).
- Manejar correctamente el caso en que la cola queda vacía al desencolar: el final también debe volver a `NULL`.
- Implementar una cola sobre un arreglo circular.
- Usar una cola para simular la planificación por turnos (*round robin*).
- Comparar el costo de cada operación.

**Requisitos previos:** `estructuras-dinamicas-listas`, `estructuras-dinamicas-pilas` y `propiedad-y-errores-de-memoria`.

## Las operaciones

| Operación | En español | Qué hace | Puede fallar |
| --- | --- | --- | --- |
| *enqueue* | encolar | agrega un elemento al final | sí, si no hay memoria o no hay lugar |
| *dequeue* | desencolar | quita el elemento del frente y lo devuelve | sí, si la cola está vacía |
| *front* / *peek* | ver el frente | devuelve el elemento del frente sin quitarlo | sí, si la cola está vacía |
| *is empty* | está vacía | dice si la cola no tiene elementos | no |

```text
encolar 1, 2, 3                         desencolar -> 1

frente                final             frente           final
  |                     |                 |                |
  v                     v                 v                v
[ 1 ] --> [ 2 ] --> [ 3 ] --> NULL      [ 2 ] --> [ 3 ] --> NULL
```

## Cola enlazada

Con una lista simple y un único puntero a la cabeza, encolar al final costaría O(n): habría que recorrer hasta el último nodo. La solución es guardar **dos** punteros: `frente` (por donde se desencola) y `final` (por donde se encola). Los enlaces van del frente hacia el final, así que desencolar es quitar la cabeza de la lista, y encolar es colgar un nodo después del último.

```c
typedef struct Nodo {
    int dato;
    struct Nodo *siguiente;   // el que llegó después
} Nodo;

// La cola es dueña de todos sus nodos.
// Invariante: frente y final son ambos NULL (cola vacía) o ambos no NULL.
typedef struct {
    Nodo *frente;
    Nodo *final;
    size_t cantidad;
} Cola;
```

El comentario de la estructura escribe su **invariante**: una condición que toda operación debe mantener. Si `frente` es `NULL` pero `final` no, el programa tiene un error.

### Encolar

```c
// Agrega dato al final. Devuelve false si no hay memoria (la cola queda igual).
bool cola_encolar(Cola *cola, int dato) {
    Nodo *nodo = malloc(sizeof *nodo);
    if (nodo == NULL) {
        return false;
    }
    nodo->dato = dato;
    nodo->siguiente = NULL;          // será el último
    if (cola->final == NULL) {       // cola vacía: es frente y final a la vez
        cola->frente = nodo;
    } else {
        cola->final->siguiente = nodo;
    }
    cola->final = nodo;              // la cola pasa a ser dueña del nodo
    cola->cantidad++;
    return true;
}
```

### Desencolar y el caso vacío

```c
// Quita el elemento del frente y lo guarda en *dato.
// Devuelve false si la cola está vacía (*dato no se modifica).
bool cola_desencolar(Cola *cola, int *dato) {
    if (cola->frente == NULL) {
        return false;
    }
    Nodo *viejo = cola->frente;
    *dato = viejo->dato;
    cola->frente = viejo->siguiente;
    if (cola->frente == NULL) {      // se fue el último elemento
        cola->final = NULL;          // si no, final quedaría colgando
    }
    free(viejo);
    cola->cantidad--;
    return true;
}
```

Esa línea `cola->final = NULL` es el error clásico de las colas. Mira qué pasa sin ella cuando la cola tiene un solo elemento:

```text
antes:               frente --> [ 7 ] <-- final

desencolar sin       frente --> NULL
corregir final:      final  --> [ ? ]   nodo ya liberado: puntero colgante

encolar 8:           cola->final->siguiente = nodo   escribe en memoria liberada
```

El siguiente `cola_encolar` ve `final != NULL` y escribe en un nodo liberado: un uso después de liberar que AddressSanitizer informa como `heap-use-after-free`. Además, `frente` queda en `NULL` y el nodo nuevo nunca se alcanza: una fuga.

### Ver el frente, está vacía, recorrer y destruir

```c
bool cola_ver_frente(const Cola *cola, int *dato) {
    if (cola->frente == NULL) {
        return false;
    }
    *dato = cola->frente->dato;
    return true;
}

bool cola_vacia(const Cola *cola) {
    return cola->frente == NULL;
}

// Muestra la cola del frente al final, sin modificarla.
void cola_imprimir(const Cola *cola) {
    printf("frente -> ");
    for (const Nodo *actual = cola->frente; actual != NULL; actual = actual->siguiente) {
        printf("%d ", actual->dato);
    }
    printf("<- final\n");
}

// Libera todos los nodos y deja la cola vacía y reutilizable.
void cola_destruir(Cola *cola) {
    Nodo *actual = cola->frente;
    while (actual != NULL) {
        Nodo *siguiente = actual->siguiente;
        free(actual);
        actual = siguiente;
    }
    cola->frente = NULL;
    cola->final = NULL;
    cola->cantidad = 0;
}
```

Recorrer una cola para mostrarla es útil para depurar, pero no es parte de la interfaz FIFO: quien usa una cola solo debería encolar y desencolar.

### Programa completo

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Nodo {
    int dato;
    struct Nodo *siguiente;
} Nodo;

// La cola es dueña de todos sus nodos.
// Invariante: frente y final son ambos NULL o ambos no NULL.
typedef struct {
    Nodo *frente;
    Nodo *final;
    size_t cantidad;
} Cola;

bool cola_encolar(Cola *cola, int dato) {
    Nodo *nodo = malloc(sizeof *nodo);
    if (nodo == NULL) {
        return false;
    }
    nodo->dato = dato;
    nodo->siguiente = NULL;
    if (cola->final == NULL) {
        cola->frente = nodo;
    } else {
        cola->final->siguiente = nodo;
    }
    cola->final = nodo;
    cola->cantidad++;
    return true;
}

bool cola_desencolar(Cola *cola, int *dato) {
    if (cola->frente == NULL) {
        return false;
    }
    Nodo *viejo = cola->frente;
    *dato = viejo->dato;
    cola->frente = viejo->siguiente;
    if (cola->frente == NULL) {
        cola->final = NULL;
    }
    free(viejo);
    cola->cantidad--;
    return true;
}

bool cola_ver_frente(const Cola *cola, int *dato) {
    if (cola->frente == NULL) {
        return false;
    }
    *dato = cola->frente->dato;
    return true;
}

bool cola_vacia(const Cola *cola) {
    return cola->frente == NULL;
}

void cola_imprimir(const Cola *cola) {
    printf("frente -> ");
    for (const Nodo *actual = cola->frente; actual != NULL; actual = actual->siguiente) {
        printf("%d ", actual->dato);
    }
    printf("<- final\n");
}

void cola_destruir(Cola *cola) {
    Nodo *actual = cola->frente;
    while (actual != NULL) {
        Nodo *siguiente = actual->siguiente;
        free(actual);
        actual = siguiente;
    }
    cola->frente = NULL;
    cola->final = NULL;
    cola->cantidad = 0;
}

int main(void) {
    Cola cola = {NULL, NULL, 0};   // main es dueña de la cola
    int valor;

    for (int i = 1; i <= 3; i++) {
        if (!cola_encolar(&cola, i * 10)) {
            fprintf(stderr, "Sin memoria\n");
            cola_destruir(&cola);
            return 1;
        }
    }
    cola_imprimir(&cola);
    if (cola_ver_frente(&cola, &valor)) {
        printf("Frente: %d (hay %zu)\n", valor, cola.cantidad);
    }

    while (cola_desencolar(&cola, &valor)) {   // vacía la cola por completo
        printf("Atendido: %d\n", valor);
    }
    printf("¿Vacía? %s\n", cola_vacia(&cola) ? "sí" : "no");
    if (!cola_desencolar(&cola, &valor)) {
        printf("Error: no se puede desencolar una cola vacía\n");
    }

    // Después de vaciarla, final volvió a NULL: encolar de nuevo es seguro.
    if (!cola_encolar(&cola, 99)) {
        cola_destruir(&cola);
        return 1;
    }
    cola_imprimir(&cola);

    cola_destruir(&cola);
    return 0;
}
```

Salida:

```text
frente -> 10 20 30 <- final
Frente: 10 (hay 3)
Atendido: 10
Atendido: 20
Atendido: 30
¿Vacía? sí
Error: no se puede desencolar una cola vacía
frente -> 99 <- final
```

El final del `main` prueba justamente el caso delicado: vaciar la cola y volver a encolar.

## Cola sobre un arreglo circular

Con un arreglo, la idea ingenua es encolar en `datos[cantidad]` y desencolar `datos[0]`, corriendo todos los demás un lugar hacia adelante: desencolar costaría O(n). La alternativa es no correr nada y llevar un índice `inicio` que avanza. El problema es que la cola "camina" hacia el final del arreglo y deja lugares libres al principio.

La solución es un **arreglo circular**: cuando un índice llega al final, vuelve a 0. El operador `%` hace ese salto:

- el frente está en `datos[inicio]`;
- el lugar donde se encola es `datos[(inicio + cantidad) % capacidad]`;
- al desencolar, `inicio = (inicio + 1) % capacidad`.

```text
capacidad = 5, inicio = 3, cantidad = 3

 índice:   0     1     2     3     4
         [ 50 |     |     | 30  | 40 ]
           ^                 ^
         final            frente
   (inicio + cantidad) % 5 = 1  ->  el próximo se encola en datos[1]
```

Llevar `cantidad` además de `inicio` resuelve una ambigüedad: con solo dos índices, "cola llena" y "cola vacía" se verían iguales.

```c
#include <stdio.h>
#include <stdlib.h>

// La cola es dueña del arreglo datos.
typedef struct {
    int *datos;
    size_t capacidad;
    size_t inicio;     // índice del frente
    size_t cantidad;
} ColaCircular;

// Reserva el arreglo. Devuelve false si capacidad es 0 o no hay memoria.
bool cola_circular_crear(ColaCircular *cola, size_t capacidad) {
    cola->inicio = 0;
    cola->cantidad = 0;
    cola->capacidad = 0;
    cola->datos = NULL;
    if (capacidad == 0) {
        return false;
    }
    cola->datos = malloc(capacidad * sizeof *cola->datos);
    if (cola->datos == NULL) {
        return false;
    }
    cola->capacidad = capacidad;
    return true;
}

// Devuelve false si la cola está llena.
bool cola_circular_encolar(ColaCircular *cola, int dato) {
    if (cola->cantidad == cola->capacidad) {
        return false;
    }
    size_t final = (cola->inicio + cola->cantidad) % cola->capacidad;
    cola->datos[final] = dato;
    cola->cantidad++;
    return true;
}

// Devuelve false si la cola está vacía.
bool cola_circular_desencolar(ColaCircular *cola, int *dato) {
    if (cola->cantidad == 0) {
        return false;
    }
    *dato = cola->datos[cola->inicio];
    cola->inicio = (cola->inicio + 1) % cola->capacidad;
    cola->cantidad--;
    return true;
}

void cola_circular_destruir(ColaCircular *cola) {
    free(cola->datos);
    cola->datos = NULL;
    cola->capacidad = 0;
    cola->inicio = 0;
    cola->cantidad = 0;
}

int main(void) {
    ColaCircular cola;
    if (!cola_circular_crear(&cola, 3)) {
        return 1;
    }
    int valor;

    cola_circular_encolar(&cola, 1);
    cola_circular_encolar(&cola, 2);
    cola_circular_encolar(&cola, 3);
    if (!cola_circular_encolar(&cola, 4)) {
        printf("Cola llena: el 4 no entra\n");
    }
    cola_circular_desencolar(&cola, &valor);   // sale el 1, se libera datos[0]
    cola_circular_encolar(&cola, 4);           // el 4 va a datos[0]: dio la vuelta

    while (cola_circular_desencolar(&cola, &valor)) {
        printf("%d ", valor);
    }
    printf("\n");

    cola_circular_destruir(&cola);
    return 0;
}
```

Salida:

```text
Cola llena: el 4 no entra
2 3 4
```

El arreglo circular tiene capacidad fija. Si necesitas que crezca, no alcanza con `realloc`: los elementos que dieron la vuelta quedarían en el orden equivocado. Hay que reservar un arreglo nuevo y copiarlos en orden desde `inicio` (lo resuelves en el ejercicio 3).

## Un caso de uso: planificación por turnos

Un sistema operativo reparte el procesador entre varios procesos con una cola: toma el proceso del frente, lo deja ejecutar un **quantum** (una porción fija de tiempo) y, si no terminó, lo vuelve a encolar al final. Esa política se llama *round robin*.

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Nodo {
    int id;
    int restante;   // unidades de tiempo que le faltan al proceso
    struct Nodo *siguiente;
} Nodo;

// La cola es dueña de todos sus nodos.
typedef struct {
    Nodo *frente;
    Nodo *final;
} Cola;

bool encolar(Cola *cola, int id, int restante) {
    Nodo *nodo = malloc(sizeof *nodo);
    if (nodo == NULL) {
        return false;
    }
    nodo->id = id;
    nodo->restante = restante;
    nodo->siguiente = NULL;
    if (cola->final == NULL) {
        cola->frente = nodo;
    } else {
        cola->final->siguiente = nodo;
    }
    cola->final = nodo;
    return true;
}

// Quita el nodo del frente y transfiere su propiedad al llamador,
// que debe liberarlo o volver a encolarlo. Devuelve NULL si la cola está vacía.
Nodo *desencolar_nodo(Cola *cola) {
    Nodo *nodo = cola->frente;
    if (nodo == NULL) {
        return NULL;
    }
    cola->frente = nodo->siguiente;
    if (cola->frente == NULL) {
        cola->final = NULL;
    }
    nodo->siguiente = NULL;
    return nodo;
}

// Vuelve a encolar un nodo existente; la cola recupera su propiedad.
void reencolar_nodo(Cola *cola, Nodo *nodo) {
    if (cola->final == NULL) {
        cola->frente = nodo;
    } else {
        cola->final->siguiente = nodo;
    }
    cola->final = nodo;
}

void destruir(Cola *cola) {
    Nodo *nodo;
    while ((nodo = desencolar_nodo(cola)) != NULL) {
        free(nodo);
    }
}

int main(void) {
    const int quantum = 3;
    const int duraciones[] = {5, 2, 7};
    Cola listos = {NULL, NULL};

    for (int i = 0; i < 3; i++) {
        if (!encolar(&listos, i + 1, duraciones[i])) {
            destruir(&listos);
            return 1;
        }
    }

    int reloj = 0;
    Nodo *proceso;
    while ((proceso = desencolar_nodo(&listos)) != NULL) {
        int uso = proceso->restante < quantum ? proceso->restante : quantum;
        reloj += uso;
        proceso->restante -= uso;
        if (proceso->restante > 0) {
            printf("t=%2d  P%d usa %d, le faltan %d\n", reloj, proceso->id, uso, proceso->restante);
            reencolar_nodo(&listos, proceso);   // vuelve al final de la fila
        } else {
            printf("t=%2d  P%d usa %d y termina\n", reloj, proceso->id, uso);
            free(proceso);                      // el bucle era su dueño
        }
    }
    return 0;
}
```

Salida:

```text
t= 3  P1 usa 3, le faltan 2
t= 5  P2 usa 2 y termina
t= 8  P3 usa 3, le faltan 4
t=10  P1 usa 2 y termina
t=13  P3 usa 3, le faltan 1
t=14  P3 usa 1 y termina
```

Aquí desencolar no copia el dato: **transfiere la propiedad del nodo** al bucle, que decide si lo libera o lo devuelve a la cola. Reutilizar el nodo evita un `free` y un `malloc` por turno, y los comentarios dejan claro quién es dueño en cada momento.

## Costo de las operaciones

| Operación | Cola enlazada (frente y final) | Arreglo circular | Lista con solo cabeza |
| --- | --- | --- | --- |
| Encolar | O(1) | O(1) | O(n) |
| Desencolar | O(1) | O(1) | O(1) |
| Ver el frente | O(1) | O(1) | O(1) |
| Destruir | O(n) | O(1) | O(n) |
| Límite | la memoria disponible | capacidad fija | la memoria disponible |

La cola enlazada crece sin límite y nunca copia elementos; el arreglo circular hace una sola reserva y tiene sus datos contiguos, pero hay que decidir su capacidad.

## Resumen

- Una cola sigue la regla FIFO: se encola por el final y se desencola por el frente.
- Con punteros a `frente` y `final`, encolar y desencolar son O(1).
- Al desencolar el último elemento, `final` debe volver a `NULL`; si no, queda colgando y el próximo encolar escribe en memoria liberada.
- Cada nodo se crea con `malloc(sizeof *nodo)`, se comprueba contra `NULL`, y la cola tiene una función que libera todos sus nodos.
- Un arreglo circular usa `%` para que los índices den la vuelta, y lleva `cantidad` para distinguir cola llena de cola vacía.

## Ejercicios prácticos

### Ejercicio 1: rastrea los índices

En una `ColaCircular` de capacidad 4, recién creada, se ejecuta: encolar 1, encolar 2, encolar 3, desencolar, desencolar, encolar 4, encolar 5, encolar 6. ¿Cuánto valen `inicio` y `cantidad`, y qué hay en cada posición del arreglo?

<details><summary>Ver solución</summary>

- Tras encolar 1, 2, 3: `datos = [1, 2, 3, ?]`, `inicio = 0`, `cantidad = 3`.
- Tras dos desencolar (salen 1 y 2): `inicio = 2`, `cantidad = 1`.
- Encolar 4 va a `(2 + 1) % 4 = 3`; encolar 5 va a `(2 + 2) % 4 = 0`; encolar 6 va a `(2 + 3) % 4 = 1`.

Resultado: `datos = [5, 6, 3, 4]`, `inicio = 2`, `cantidad = 4` (cola llena). El orden de salida será 3, 4, 5, 6.

</details>

### Ejercicio 2: encuentra el error

Este `desencolar` funciona mientras la cola tiene varios elementos, pero un programa que vacía la cola y vuelve a encolar falla con AddressSanitizer. ¿Qué falta?

<!-- c-check: skip -->
```c
bool cola_desencolar(Cola *cola, int *dato) {
    if (cola->frente == NULL) {
        return false;
    }
    Nodo *viejo = cola->frente;
    *dato = viejo->dato;
    cola->frente = viejo->siguiente;
    free(viejo);
    cola->cantidad--;
    return true;
}
```

<details><summary>Ver solución</summary>

Cuando sale el último elemento, `frente` pasa a `NULL` pero `final` sigue apuntando al nodo liberado. El siguiente `cola_encolar` ve `final != NULL` y ejecuta `cola->final->siguiente = nodo`: escribe en memoria liberada (`heap-use-after-free`), y el nodo nuevo queda inalcanzable porque `frente` sigue en `NULL`. Falta restablecer el invariante:

```c
    cola->frente = viejo->siguiente;
    if (cola->frente == NULL) {
        cola->final = NULL;
    }
```

</details>

### Ejercicio 3: arreglo circular que crece

Escribe `bool cola_circular_crecer(ColaCircular *cola)`, que duplica la capacidad reservando un arreglo nuevo y copiando los elementos en orden, desde el frente. ¿Por qué no alcanza con `realloc`? Pruébala en un programa completo.

<details><summary>Ver solución</summary>

Con `realloc`, los elementos que dieron la vuelta (los que están en las posiciones bajas, después del final físico del arreglo) quedarían antes del frente en vez de después. Copiando en orden lógico, el frente queda en la posición 0:

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *datos;
    size_t capacidad;
    size_t inicio;
    size_t cantidad;
} ColaCircular;

// Duplica la capacidad. Devuelve false si no hay memoria (la cola queda igual).
bool cola_circular_crecer(ColaCircular *cola) {
    size_t nueva_capacidad = cola->capacidad == 0 ? 4 : cola->capacidad * 2;
    int *nuevos = malloc(nueva_capacidad * sizeof *nuevos);
    if (nuevos == NULL) {
        return false;
    }
    for (size_t i = 0; i < cola->cantidad; i++) {
        nuevos[i] = cola->datos[(cola->inicio + i) % cola->capacidad];
    }
    free(cola->datos);   // el arreglo viejo ya no se usa
    cola->datos = nuevos;
    cola->capacidad = nueva_capacidad;
    cola->inicio = 0;
    return true;
}

bool cola_circular_encolar(ColaCircular *cola, int dato) {
    if (cola->cantidad == cola->capacidad && !cola_circular_crecer(cola)) {
        return false;
    }
    cola->datos[(cola->inicio + cola->cantidad) % cola->capacidad] = dato;
    cola->cantidad++;
    return true;
}

bool cola_circular_desencolar(ColaCircular *cola, int *dato) {
    if (cola->cantidad == 0) {
        return false;
    }
    *dato = cola->datos[cola->inicio];
    cola->inicio = (cola->inicio + 1) % cola->capacidad;
    cola->cantidad--;
    return true;
}

int main(void) {
    ColaCircular cola = {NULL, 0, 0, 0};
    int valor;

    for (int i = 1; i <= 4; i++) {
        cola_circular_encolar(&cola, i);
    }
    cola_circular_desencolar(&cola, &valor);   // sale 1; inicio = 1
    for (int i = 5; i <= 9; i++) {            // da la vuelta y luego crece
        if (!cola_circular_encolar(&cola, i)) {
            free(cola.datos);
            return 1;
        }
    }
    while (cola_circular_desencolar(&cola, &valor)) {
        printf("%d ", valor);                   // 2 3 4 5 6 7 8 9
    }
    printf("(capacidad %zu)\n", cola.capacidad);
    free(cola.datos);
    return 0;
}
```

</details>
