---
title: 'Dynamic Structures — Linked Lists'
course: 'c'
slug: 'estructuras-dinamicas-listas'
order: 21
lang: 'en'
published: true
---

Las **listas enlazadas** son estructuras dinámicas. Eso significa que pueden crecer o cambiar durante la ejecución del programa.

En esta lección vas a aprender:

- qué es una lista enlazada
- qué es un nodo
- recorrido en listas
- búsqueda en listas
- inserción en listas

## ¿Qué es una lista enlazada?

Es una estructura formada por nodos.

Cada nodo suele contener:

- un dato
- un puntero al siguiente nodo

## Nodo en C

```c
struct Nodo {
    int dato;
    struct Nodo* siguiente;
};
```

## Recorrido

Recorrer una lista significa visitar nodo por nodo hasta llegar al final.

```c
actual = cabeza;
while (actual != NULL) {
    printf("%d\n", actual->dato);
    actual = actual->siguiente;
}
```

## Búsqueda

Buscar en una lista implica recorrerla hasta encontrar el valor buscado.

```c
while (actual != NULL) {
    if (actual->dato == buscado) {
        encontrado = 1;
    }
    actual = actual->siguiente;
}
```

## Inserción

Insertar puede hacerse al inicio, al final o en una posición intermedia.

### Inserción al inicio

```c
nuevo->siguiente = cabeza;
cabeza = nuevo;
```

## Resumen

- una lista enlazada está formada por nodos
- permite recorrido, búsqueda e inserción
- es más flexible que un arreglo de tamaño fijo

## Idea final

La lista enlazada muestra un cambio de mentalidad muy fuerte: ya no pensás en posiciones fijas, sino en enlaces entre nodos.
