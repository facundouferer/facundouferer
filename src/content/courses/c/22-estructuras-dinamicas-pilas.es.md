---
title: 'Pilas'
course: 'c'
slug: 'estructuras-dinamicas-pilas'
order: 22
lang: 'es'
published: true
---

Una **pila** es una estructura en la que el último elemento que entra es el primero que sale.

Eso se conoce como **LIFO**: Last In, First Out.

En esta lección vas a aprender:

- qué es una pila
- recorrido en pilas
- búsqueda en pilas
- inserción en pilas
- extracción básica

## Inserción: push

Agregar un elemento a la pila se conoce como `push`.

## Extracción: pop

Quitar el elemento superior se conoce como `pop`.

## Recorrido

El recorrido visita los elementos desde el tope hacia abajo.

## Búsqueda

La búsqueda se hace recorriendo la pila elemento por elemento.

## Ejemplo de nodo

```c
struct Nodo {
    int dato;
    struct Nodo* siguiente;
};
```

## Resumen

- una pila sigue la regla LIFO
- insertar se llama `push`
- extraer se llama `pop`
- también puede recorrerse y buscarse

## Idea final

La pila es excelente para entender que no todas las estructuras permiten acceder a los datos de cualquier forma. Cada una tiene su propia lógica de uso.