---
title: 'Objects, Methods, and Struct-Based Design'
course: 'c'
slug: 'objetos-metodos-y-diseno-basado-en-struct'
order: 31
lang: 'en'
published: true
---

Si querés pensar en estilo orientado a objetos dentro de C, hay una idea fundamental:

> una `struct` puede representar el estado, y un conjunto de funciones puede representar los métodos.

En esta lección vas a aprender:

- cómo pensar un “objeto” en C
- cómo asociar comportamiento a una estructura
- cómo diseñar mejor las funciones que operan sobre una entidad

## Estado + comportamiento

### Estado

```c
struct Rectangulo {
    float base;
    float altura;
};
```

### Comportamiento

```c
float calcularArea(struct Rectangulo r) {
    return r.base * r.altura;
}
```

## ¿Dónde estaría el “método” acá?

En C, el método no está metido dentro de la estructura como en lenguajes orientados a objetos nativos.

Pero conceptualmente, `calcularArea` cumple un rol parecido: es una operación propia de `Rectangulo`.

## Diseño más claro con punteros

```c
void escalar(struct Rectangulo* r, float factor) {
    r->base = r->base * factor;
    r->altura = r->altura * factor;
}
```

Acá la función modifica directamente el estado de la estructura.

## Resumen

- en C, una `struct` puede representar el estado de una entidad
- las funciones relacionadas pueden pensarse como sus métodos conceptuales
- este enfoque ayuda a diseñar software más claro y organizado

## Idea final

La POO en C no se trata de imitar sintaxis ajena, sino de construir un diseño donde cada entidad tenga datos claros y operaciones coherentes sobre esos datos.
