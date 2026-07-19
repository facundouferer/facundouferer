---
title: 'Dynamic Structures — Linked Lists'
course: 'c'
slug: 'estructuras-dinamicas-listas'
order: 21
lang: 'en'
published: true
---

**Linked lists** are dynamic structures. That means they can grow or change during program execution.

In this lesson you'll learn:

- what a linked list is
- what a node is
- list traversal
- search in lists
- insertion in lists

## What is a linked list?

It's a structure made up of nodes.

Each node usually contains:

- a data value
- a pointer to the next node

## Node in C

```c
struct Nodo {
    int dato;
    struct Nodo* siguiente;
};
```

## Traversal

Traversing a list means visiting node by node until reaching the end.

```c
actual = cabeza;
while (actual != NULL) {
    printf("%d\n", actual->dato);
    actual = actual->siguiente;
}
```

## Search

Searching in a list means traversing it until finding the target value.

```c
while (actual != NULL) {
    if (actual->dato == buscado) {
        encontrado = 1;
    }
    actual = actual->siguiente;
}
```

## Insertion

Insertion can be done at the beginning, at the end, or at an intermediate position.

### Insertion at the beginning

```c
nuevo->siguiente = cabeza;
cabeza = nuevo;
```

## Summary

- a linked list is made up of nodes
- it allows traversal, search, and insertion
- it's more flexible than a fixed-size array

## Final thought

The linked list shows a very strong mindset shift: you no longer think in fixed positions, but in links between nodes.
