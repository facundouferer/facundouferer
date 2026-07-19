---
title: 'Modularization — Subprograms and Functions'
course: 'c'
slug: 'modularizacion-subprogramas-y-funciones'
order: 25
lang: 'en'
published: true
---

When a program starts to grow, writing everything inside `main` becomes a bad idea.

Yes, it can work for minimal examples. But when the problem grows, you need to divide the program into smaller, understandable, and reusable parts.

That's where **modularization** comes in.

In this lesson you'll learn:

- what modularization is
- what a subprogram is
- what the conceptual difference between function and procedure is
- how to declare and use a function in C
- why modularization improves program design

> Key idea: modularization is dividing a large problem into smaller parts so you can think about it, implement it, and maintain it better.

## What is modularization?

**Modularization** means dividing a program into smaller, organized parts, where each one fulfills a specific task.

Instead of having a huge block of code mixing everything together, you separate responsibilities.

For example, instead of writing a giant program that:

- reads data
- validates data
- calculates results
- displays results

mixing everything into a single block, you can separate each task into a different part.

## Why modularize?

Because it improves many things at once:

- the code is easier to understand
- each part has a clearer responsibility
- you can reuse logic
- it's easier to detect errors
- the program grows more orderly

## What is a subprogram?

A **subprogram** is a part of the program that performs a specific task.

It's basically a named block of code that the program can call when it needs to execute that task.

In C, subprograms are expressed through **functions**.

## Functions and procedures: conceptual difference

Here's a VERY useful distinction at a pedagogical level.

### Function

A **function** is a subprogram that returns a result.

For example, a function that adds two numbers and returns the total.

### Procedure

A **procedure** is a subprogram whose main idea is to perform an action, without focusing on returning a value.

For example, displaying a message on the screen.

## Important in C

In C, technically everything is expressed with functions.

In other words: even what we conceptually call a "procedure" is usually written as a function with `void` return type.

So, the difference between function and procedure in this course is taught as a **conceptual distinction**, not as two different language mechanisms.

## Example of a function that returns a value

```c
int sumar(int a, int b) {
    return a + b;
}
```

This function receives two integers and returns another integer.

## Example of a conceptual procedure in C

```c
void mostrarSaludo() {
    printf("Hello\n");
}
```

Here no useful value is returned. The function performs an action.

## General structure of a function

```c
tipo_retorno nombre(parametros) {
    instrucciones;
}
```

### Parts

- **return type**: what the function returns
- **name**: how it's called
- **parameters**: data it receives
- **body**: instructions it executes

## Complete example

```c
#include <stdio.h>

int sumar(int a, int b) {
    return a + b;
}

void mostrarResultado(int resultado) {
    printf("The result is %d\n", resultado);
}

int main() {
    int total;

    total = sumar(5, 3);
    mostrarResultado(total);

    return 0;
}
```

## What do you gain from this?

A lot.

Because now the logic is separated:

- one part adds
- another part displays
- `main` coordinates

That makes the program much easier to read.

## Modularization across multiple files

When the program grows further, modularization can also be reflected in separate files.

Generally speaking, these appear:

- `.h` files for declarations
- `.c` files for implementations
- a `main.c` as the entry point

### Conceptual example

#### Header file

```c
int sumar(int a, int b);
```

#### Implementation file

```c
int sumar(int a, int b) {
    return a + b;
}
```

## When should you create a subprogram?

It's convenient when:

- a task makes sense on its own
- a piece of logic is repeated
- a block inside `main` is already growing too large
- you want to separate responsibilities

## Common mistakes when starting

### 1. Putting everything in `main`

That makes the code hard to read and maintain.

### 2. Creating functions without a clear responsibility

It's not about dividing for the sake of dividing. Each subprogram must have a concrete intention.

### 3. Not distinguishing between "calculating" and "displaying"

Good modularization separates calculation, input, and output when it makes sense.

## Summary

- modularization is dividing a program into smaller parts
- a subprogram performs a specific task
- a function returns a value
- a procedure, conceptually, performs an action
- in C, both are represented by functions
- modularization improves clarity, reusability, and maintainability

## Final thought

Modularization is a sign of maturity in programming.

When you stop thinking of the program as a giant block and start thinking of it as pieces with clear responsibilities, your design improves GREATLY.
