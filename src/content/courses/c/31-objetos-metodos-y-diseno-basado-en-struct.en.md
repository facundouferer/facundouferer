---
title: 'Objects, Methods, and Struct-Based Design'
course: 'c'
slug: 'objetos-metodos-y-diseno-basado-en-struct'
order: 31
lang: 'en'
published: true
---

If you want to think in an object-oriented style within C, there's a fundamental idea:

> a `struct` can represent the state, and a set of functions can represent the methods.

In this lesson you will learn:

- how to think of an "object" in C
- how to associate behavior with a structure
- how to better design functions that operate on an entity

## State + behavior

### State

```c
struct Rectangulo {
    float base;
    float altura;
};
```

### Behavior

```c
float calcularArea(struct Rectangulo r) {
    return r.base * r.altura;
}
```

## Where would the "method" be here?

In C, the method is not embedded inside the structure like in native object-oriented languages.

But conceptually, `calcularArea` plays a similar role: it's an operation belonging to `Rectangulo`.

## Clearer design with pointers

```c
void escalar(struct Rectangulo* r, float factor) {
    r->base = r->base * factor;
    r->altura = r->altura * factor;
}
```

Here the function directly modifies the structure's state.

## Summary

- in C, a `struct` can represent the state of an entity
- related functions can be thought of as its conceptual methods
- this approach helps design clearer and more organized software

## Final thought

OOP in C is not about imitating someone else's syntax, but about building a design where each entity has clear data and coherent operations on that data.
