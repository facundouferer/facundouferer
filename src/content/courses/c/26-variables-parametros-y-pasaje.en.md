---
title: 'Variables, Parameters, and Passing'
course: 'c'
slug: 'variables-parametros-y-pasaje'
order: 26
lang: 'en'
published: true
---

Once you start working with functions, a central question appears:

> what data does each function know and how is that data passed to it?

That's where local variables, global variables, and parameter passing come into play.

In this lesson you'll learn:

- what local and global variables are
- what formal and actual parameters are
- what pass-by-value is
- what pass-by-reference is
- how data changes inside and outside a function

## Local variables

A **local variable** is a variable declared inside a function.

It only exists within that function and can only be used directly there.

### Example

```c
void saludar() {
    int veces = 1;
    printf("Hello %d\n", veces);
}
```

The variable `veces` is local to `saludar`.

## Global variables

A **global variable** is declared outside all functions.

It can be used by multiple functions in the program.

### Example

```c
int contador = 0;

void aumentar() {
    contador = contador + 1;
}
```

## Conceptual difference

- the local variable belongs to a function
- the global variable belongs to the entire program or a much wider scope

## Should you use global variables?

They can be useful in some cases, but they must be used wisely.

Why? Because if many functions modify the same global variable, the program can become harder to understand and control.

For beginners, a good rule is this:

> prefer local variables unless there's a clear reason to share the data.

## What is a parameter?

A **parameter** is a piece of data that a function receives to do its work.

### Example

```c
int sumar(int a, int b) {
    return a + b;
}
```

Here, `a` and `b` are the function's parameters.

## Formal and actual parameters

This distinction is very important.

### Formal parameters

These are the names that appear in the function definition.

```c
int sumar(int a, int b)
```

Here, `a` and `b` are formal parameters.

### Actual parameters

These are the real values or variables passed when the function is called.

```c
resultado = sumar(5, 3);
```

Here, `5` and `3` are actual parameters.

## Pass-by-value

In **pass-by-value**, the function receives a copy of the data.

That means if the function modifies that parameter, the original does not change.

### Example

```c
#include <stdio.h>

void cambiar(int x) {
    x = 100;
}

int main() {
    int numero = 5;
    cambiar(numero);
    printf("%d\n", numero);
    return 0;
}
```

The displayed value will still be `5`.

And why? Because `cambiar` received a copy of `numero`, not the original.

## Pass-by-reference

In C, there is no native "pass-by-reference" like in other languages, but the same practical effect can be achieved using **pointers**.

This is important to say correctly to avoid teaching it wrong.

When introductory courses talk about "pass-by-reference" in C, they're usually talking about passing the address of a variable through pointers, so the function can modify the original data.

### Conceptual example

```c
void cambiar(int *x) {
    *x = 100;
}
```

And the call:

```c
cambiar(&numero);
```

## What changes here?

Now the function doesn't work on a simple copy of the value, but on the address of the original data.

That allows modifying the actual variable.

## Complete example

```c
#include <stdio.h>

void cambiar(int *x) {
    *x = 100;
}

int main() {
    int numero = 5;
    cambiar(&numero);
    printf("%d\n", numero);
    return 0;
}
```

Now the displayed value will be `100`.

## Comparison between both passing methods

### By value

- the function receives a copy
- the original does not change

### By reference simulated with pointers

- the function works on the address of the data
- the original can change

## When to use each one

### Pass-by-value

Use it when you only want to use the data to calculate or query something.

### Pass-by-reference with pointers

Use it when you want the function to be able to modify the original data.

## Common mistakes when starting

### 1. Believing that changing a parameter by value modifies the original

No. If it was passed by value, what gets modified is the copy.

### 2. Using too many global variables

That makes it harder to understand where data comes from and who modifies it.

### 3. Confusing formal and actual parameters

One belongs to the function definition. The other belongs to the function call.

## Summary

- a local variable lives inside a function
- a global variable has a wider scope
- formal parameters appear in the definition
- actual parameters appear in the invocation
- by value, a copy is passed
- in C, the effect of pass-by-reference is achieved using pointers

## Final thought

Understanding scope and parameter passing completely changes the way you read functions.

Because from now on, it's not just about what a function does, but also **what data it works with and what data it might modify**.
