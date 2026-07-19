---
title: 'Dynamic Structures — Queues'
course: 'c'
slug: 'estructuras-dinamicas-colas'
order: 23
lang: 'en'
published: true
---

A **queue** is a structure where the first one that enters is the first one that leaves.

That's known as **FIFO**: *First In, First Out*.

Think of it like a real line:

- the first person to arrive is the first to be served
- new people join at the end
- nobody cuts out from the middle

In this lesson you'll learn:

- what a queue is
- queue traversal
- search in queues
- insertion in queues
- basic extraction

> Key idea: a queue strictly respects arrival order.

## What is a queue?

A **queue** is a dynamic structure where typically two ends are managed:

- the **front**
- the **rear**

Insertion happens at the rear.
Extraction happens from the front.

## Node of a linked queue

A common way to implement a queue in C is through linked nodes.

```c
struct Nodo {
    int dato;
    struct Nodo* siguiente;
};
```

Each node has:

- a data value
- a pointer to the next node

## Main queue variables

To manage the queue, two pointers are typically used:

```c
struct Nodo* frente = NULL;
struct Nodo* final = NULL;
```

- `frente` points to the first node
- `final` points to the last node

If both are `NULL`, the queue is empty.

## Insertion in queues: enqueue

Adding an element to the end of the queue is called **enqueue**.

### General idea

If the queue is empty:

- the new node becomes both front and rear

If the queue already has elements:

- the current rear node must point to the new node
- then `final` points to the new node

### Code example

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

### What does this function do?

1. creates a new node
2. stores the value in that node
3. if the queue is empty, that node becomes both first and last
4. if not empty, it links to the current rear and then becomes the new rear

## Basic extraction: dequeue

Removing the element at the front is called **dequeue**.

### General idea

When you dequeue:

- the front node is taken
- front advances to the next node
- if the queue becomes empty, `final` must also be updated

### Code example

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

### What does this function do?

1. checks if the queue is empty
2. saves the data from the front
3. moves `frente` to the next node
4. if there are no more nodes, also sets `final` to `NULL`
5. frees the memory of the removed node
6. returns the extracted value

## Queue traversal

**Traversal** visits nodes from the front to the rear.

### Code example

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

### What does this traversal do?

- starts at the front
- prints each node's data
- advances until reaching `NULL`

If the queue contains:

```text
10, 20, 30
```

the traversal will show:

```text
10
20
30
```

## Search in queues

**Search** consists of traversing the queue until finding a value.

### Code example

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

### What does this function do?

- traverses node by node
- if it finds the value, returns `1`
- if it reaches the end without finding it, returns `0`

## Complete usage example

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

    printf("Queue traversal:\n");
    recorrerCola(frente);

    if (buscarEnCola(frente, 20) == 1) {
        printf("Value 20 was found\n");
    } else {
        printf("Value 20 was not found\n");
    }

    eliminado = desencolar(&frente, &final);
    printf("Extracted value: %d\n", eliminado);

    printf("Queue after dequeue:\n");
    recorrerCola(frente);

    return 0;
}
```

## Summary

- a queue follows the FIFO rule
- inserting is called **enqueue**
- extracting is called **dequeue**
- traversal goes from front to rear
- search traverses node by node until finding the value
- when dequeuing you must correctly update `frente` and, if needed, also `final`

## Final thought

The queue not only helps you understand a dynamic structure: it also teaches a very important design idea.

You can't always access data any way you want. Sometimes the structure defines an access discipline. And understanding that discipline is part of learning to program well.
