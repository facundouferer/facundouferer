---
title: 'Concept of Structures'
course: 'c'
slug: 'concepto-de-estructuras'
order: 18
lang: 'en'
published: true
---

Arrays work when all the data is of the same type. But in many real problems you need to group different data that belongs to the same entity.

That's where the concept of **structure** comes in.

In this lesson you'll learn:

- what a structure is
- how to declare it in C
- how to create variables of that type
- how to access its fields

## What is a structure?

A **structure** is a compound data type that groups several related pieces of data, even if they're of different types.

### Conceptual example

A person could have:

- name
- age
- height

## Declaration with `struct`

```c
struct Persona {
    char nombre[30];
    int edad;
    float altura;
};
```

## Creating a structure variable

```c
struct Persona alumno;
```

## Accessing fields

```c
alumno.edad = 20;
alumno.altura = 1.75;
```

## Complete example

```c
#include <stdio.h>

struct Persona {
    char nombre[30];
    int edad;
    float altura;
};

int main() {
    struct Persona alumno = {"Facu", 20, 1.75};

    printf("Name: %s\n", alumno.nombre);
    printf("Age: %d\n", alumno.edad);
    printf("Height: %f\n", alumno.altura);

    return 0;
}
```

## Why are structures so important?

Because many dynamic structures are built from nodes represented with `struct`.

## Summary

- a structure groups related data of different types
- it's declared with `struct`
- its fields are accessed with `.`
- it's key for modeling entities and creating more complex structures

## Final thought

Structures are the step that allows you to model information meaningfully, not just store isolated values.
