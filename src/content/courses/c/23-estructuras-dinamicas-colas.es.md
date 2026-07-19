---
title: 'Colas'
course: 'c'
slug: 'estructuras-dinamicas-colas'
order: 23
lang: 'es'
published: true
---

Una **cola** es una estructura en la que el primero que entra es el primero que sale.

Eso se conoce como **FIFO**: *First In, First Out*.

Pensalo como una fila real:

- la primera persona en llegar es la primera en ser atendida
- las nuevas personas se agregan al final
- nadie sale por el medio

En esta lección vas a aprender:

- qué es una cola
- recorrido en colas
- búsqueda en colas
- inserción en colas
- extracción básica

> Idea clave: una cola respeta estrictamente el orden de llegada.

## ¿Qué es una cola?

Una **cola** es una estructura dinámica donde normalmente se manejan dos extremos:

- el **frente**
- el **final**

La inserción ocurre al final.
La extracción ocurre desde el frente.

## Nodo de una cola enlazada

Una forma común de implementar una cola en C es mediante nodos enlazados.

```c
struct Nodo {
    int dato;
    struct Nodo* siguiente;
};
```

Cada nodo tiene:

- un dato
- un puntero al siguiente nodo

## Variables principales de la cola

Para manejar la cola, normalmente se usan dos punteros:

```c
struct Nodo* frente = NULL;
struct Nodo* final = NULL;
```

- `frente` apunta al primer nodo
- `final` apunta al último nodo

Si ambos valen `NULL`, la cola está vacía.

## Inserción en colas: encolar

Agregar un elemento al final de la cola se llama **encolar**.

### Idea general

Si la cola está vacía:

- el nuevo nodo pasa a ser frente y final

Si la cola ya tiene elementos:

- el nodo actual final debe apuntar al nuevo nodo
- luego `final` pasa a apuntar al nuevo nodo

### Ejemplo de código

```c
#include <stdlib.h>

void encolar(struct Nodo** frente, struct Nodo** final, int valor) {
    struct Nodo* nuevo = malloc(sizeof(struct Nodo));

    nuevo->dato = valor;
    nuevo->siguiente = NULL;

    if (*final == NULL) {
        *frente = nuevo;
        *final = nuevo;
    } else {
        (*final)->siguiente = nuevo;
        *final = nuevo;
    }
}
```

### ¿Qué hace esta función?

1. crea un nuevo nodo
2. guarda el valor en ese nodo
3. si la cola está vacía, ese nodo pasa a ser el primero y el último
4. si no está vacía, se enlaza al final actual y luego pasa a ser el nuevo final

## Extracción básica: desencolar

Quitar el elemento del frente se llama **desencolar**.

### Idea general

Cuando desencolás:

- se toma el nodo del frente
- el frente avanza al siguiente nodo
- si la cola queda vacía, también hay que actualizar `final`

### Ejemplo de código

```c
#include <stdlib.h>

int desencolar(struct Nodo** frente, struct Nodo** final) {
    struct Nodo* temp;
    int valor;

    if (*frente == NULL) {
        return -1;
    }

    temp = *frente;
    valor = temp->dato;
    *frente = (*frente)->siguiente;

    if (*frente == NULL) {
        *final = NULL;
    }

    free(temp);
    return valor;
}
```

### ¿Qué hace esta función?

1. verifica si la cola está vacía
2. guarda el dato del frente
3. mueve `frente` al siguiente nodo
4. si ya no queda ningún nodo, también pone `final` en `NULL`
5. libera memoria del nodo eliminado
6. devuelve el valor extraído

## Recorrido en colas

El **recorrido** visita los nodos desde el frente hasta el final.

### Ejemplo de código

```c
#include <stdio.h>

void recorrerCola(struct Nodo* frente) {
    struct Nodo* actual = frente;

    while (actual != NULL) {
        printf("%d\n", actual->dato);
        actual = actual->siguiente;
    }
}
```

### ¿Qué hace este recorrido?

- empieza en el frente
- muestra el dato de cada nodo
- avanza hasta llegar a `NULL`

Si la cola contiene:

```text
10, 20, 30
```

el recorrido mostrará:

```text
10
20
30
```

## Búsqueda en colas

La **búsqueda** consiste en recorrer la cola hasta encontrar un valor.

### Ejemplo de código

```c
int buscarEnCola(struct Nodo* frente, int buscado) {
    struct Nodo* actual = frente;

    while (actual != NULL) {
        if (actual->dato == buscado) {
            return 1;
        }
        actual = actual->siguiente;
    }

    return 0;
}
```

### ¿Qué hace esta función?

- recorre nodo por nodo
- si encuentra el valor, devuelve `1`
- si llega al final sin encontrarlo, devuelve `0`

## Ejemplo completo de uso

```c
#include <stdio.h>
#include <stdlib.h>

struct Nodo {
    int dato;
    struct Nodo* siguiente;
};

void encolar(struct Nodo** frente, struct Nodo** final, int valor) {
    struct Nodo* nuevo = malloc(sizeof(struct Nodo));

    nuevo->dato = valor;
    nuevo->siguiente = NULL;

    if (*final == NULL) {
        *frente = nuevo;
        *final = nuevo;
    } else {
        (*final)->siguiente = nuevo;
        *final = nuevo;
    }
}

int desencolar(struct Nodo** frente, struct Nodo** final) {
    struct Nodo* temp;
    int valor;

    if (*frente == NULL) {
        return -1;
    }

    temp = *frente;
    valor = temp->dato;
    *frente = (*frente)->siguiente;

    if (*frente == NULL) {
        *final = NULL;
    }

    free(temp);
    return valor;
}

void recorrerCola(struct Nodo* frente) {
    struct Nodo* actual = frente;

    while (actual != NULL) {
        printf("%d\n", actual->dato);
        actual = actual->siguiente;
    }
}

int buscarEnCola(struct Nodo* frente, int buscado) {
    struct Nodo* actual = frente;

    while (actual != NULL) {
        if (actual->dato == buscado) {
            return 1;
        }
        actual = actual->siguiente;
    }

    return 0;
}

int main() {
    struct Nodo* frente = NULL;
    struct Nodo* final = NULL;
    int eliminado;

    encolar(&frente, &final, 10);
    encolar(&frente, &final, 20);
    encolar(&frente, &final, 30);

    printf("Recorrido de la cola:\n");
    recorrerCola(frente);

    if (buscarEnCola(frente, 20) == 1) {
        printf("Se encontró el valor 20\n");
    } else {
        printf("No se encontró el valor 20\n");
    }

    eliminado = desencolar(&frente, &final);
    printf("Valor extraído: %d\n", eliminado);

    printf("Cola luego de desencolar:\n");
    recorrerCola(frente);

    return 0;
}
```

## Resumen

- una cola sigue la regla FIFO
- insertar se llama **encolar**
- extraer se llama **desencolar**
- el recorrido va del frente al final
- la búsqueda recorre nodo por nodo hasta encontrar el valor
- al desencolar hay que actualizar correctamente `frente` y, si hace falta, también `final`

## Idea final

La cola no solo sirve para entender una estructura dinámica: también enseña una idea de diseño muy importante.

No siempre se puede acceder a los datos de cualquier manera. A veces la estructura define una disciplina de acceso. Y entender esa disciplina es parte de aprender a programar bien.