---
title: 'Pointers and memory addresses'
course: 'c'
slug: 'punteros-y-direcciones'
order: 25
lang: 'en'
published: true
---

So far you have worked with variables by their **name**: `age`, `grades[3]`, `student.name`. But the computer knows nothing about names: it knows **memory locations**. Every piece of data lives somewhere, and that place has a number.

In this lesson you will look underneath the names. This is the step that sets C apart from almost every language you met before, and it is the foundation of everything that follows: arrays and strings from the inside, dynamic memory, lists, stacks and trees.

> Key idea: a **pointer** is a variable whose value is the **address** of another object. With the address you can reach the object and read or modify it, even when its name is not at hand.

## Objectives

- Explain what an object in memory is and what its address is.
- Get addresses with `&` and print them with `%p`.
- Declare, initialize and dereference pointers with `*`.
- Recognize when a pointer is valid and when it is not (`NULL`, uninitialized pointers).
- Modify a caller's variables by passing addresses, knowing that the pointer itself is also passed **by value**.
- Return several results from a function through pointer parameters.
- Read declarations that combine `const` and pointers.

**Prerequisites:** [Data types](/en/courses/c/tipos-de-datos) (`sizeof`), [Modularization, subprograms and functions](/en/courses/c/modularizacion-subprogramas-y-funciones), [Variables, parameters and passing](/en/courses/c/variables-parametros-y-pasaje) (C always passes arguments by value), [Arrays](/en/courses/c/arreglos-unidimensionales-y-multidimensionales) and [Structs](/en/courses/c/concepto-de-estructuras).

## Memory as a row of numbered cells

A useful model of memory is a very long row of one-byte cells. Each cell has a unique number: its **address**.

When you declare a variable, the compiler reserves for it as many consecutive cells as its type needs. The C standard calls that region of memory holding a value an **object** (it has nothing to do with object-oriented programming).

```c
int x = 42;
char letter = 'A';
```

If `sizeof(int)` is 4 on your machine, the result could look like this (the addresses are made up, but the model is the real one):

| Address | Content | Belongs to |
| --- | --- | --- |
| `1000` | byte of `x` | `x` (4 bytes) |
| `1001` | byte of `x` | |
| `1002` | byte of `x` | |
| `1003` | byte of `x` | |
| `1004` | `'A'` | `letter` (1 byte) |

The **address of an object** is the address of its first byte. In the table, the address of `x` is `1000` and the address of `letter` is `1004`.

Two ideas worth separating from the start:

- the **value** of `x` is `42`;
- the **address** of `x` is `1000`.

A pointer works with the second one.

## The `&` operator: the address of an object

The unary `&` operator (address-of) yields the address of an object. You already used it without a formal name: in `scanf("%d", &x)` you gave `scanf` **the address of `x`**, so it could write the number it read there. Now you know why it was needed: `scanf` cannot change your variable if it only receives a copy of its value.

To print an address you use the `%p` conversion, which expects a `void *` (a generic pointer, covered in depth in the next lesson). That is why the address is converted with `(void *)`:

```c
#include <stdio.h>

int main(void) {
    int x = 42;
    double price = 9.5;

    printf("value of x:        %d\n", x);
    printf("address of x:      %p\n", (void *)&x);
    printf("address of price:  %p\n", (void *)&price);
    printf("sizeof x: %zu, sizeof price: %zu\n", sizeof x, sizeof price);

    return 0;
}
```

A possible output:

```text
value of x:        42
address of x:      0x7ffd5e8a3b4c
address of price:  0x7ffd5e8a3b40
sizeof x: 4, sizeof price: 8
```

> **Portability:** the format printed by `%p` is chosen by each implementation (usually hexadecimal), and addresses change between runs, because modern operating systems place the program at different locations every time. Never write a program that depends on a specific address value.

## Declaring and initializing a pointer

A pointer is declared with the type of the object it will point to, followed by `*`:

```c
int x = 42;
int *p = &x;   /* p is a pointer to int and holds the address of x */
```

Read it right to left: "`p` is a pointer (`*`) to `int`". After that line we say that **`p` points to `x`**.

<svg viewBox="0 0 560 170" role="img" aria-label="Memory diagram: p, at address 2000, holds 1000; x, at address 1000, holds 42; an arrow goes from p to x" style="max-width: 100%; height: auto; font-family: var(--font-body);">
  <rect x="20" y="40" width="160" height="70" rx="16" fill="var(--color-surface)" stroke="var(--color-accent-2)" stroke-width="3"/>
  <text x="100" y="30" text-anchor="middle" fill="var(--color-text)" font-size="16">p (address 2000)</text>
  <text x="100" y="82" text-anchor="middle" fill="var(--color-text)" font-size="22" font-family="monospace">1000</text>
  <rect x="380" y="40" width="160" height="70" rx="16" fill="var(--color-surface)" stroke="var(--color-accent)" stroke-width="3"/>
  <text x="460" y="30" text-anchor="middle" fill="var(--color-text)" font-size="16">x (address 1000)</text>
  <text x="460" y="82" text-anchor="middle" fill="var(--color-text)" font-size="22" font-family="monospace">42</text>
  <path d="M180 75 C 260 75, 300 75, 372 75" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
  <path d="M362 66 L 374 75 L 362 84" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="280" y="140" text-anchor="middle" fill="var(--color-text)" font-size="15">the value of p is the address of x</text>
</svg>

Notice that `p` is a variable like any other: it takes up memory, it has its own address (`2000` in the diagram), and its value is a number, which in this case is an address.

A syntax detail that confuses many people: the `*` belongs to each name, not to the type.

```c
int *p, q;   /* p is int *, but q is a plain int */
int *r, *s;  /* r and s are pointers to int */
```

To avoid mistakes, declare one pointer per line.

## Dereferencing: reading and writing through the pointer

The unary `*` operator applied to a pointer is called **dereferencing**: `*p` is the object `p` points to. You can use it to read and also to write.

```c
#include <stdio.h>

int main(void) {
    int x = 42;
    int *p = &x;

    printf("x = %d, *p = %d\n", x, *p);

    *p = 50;              /* writes into x through p */
    printf("x = %d\n", x);

    *p = *p + 1;          /* reads x, adds 1 and stores it back into x */
    printf("x = %d\n", x);

    return 0;
}
```

Output:

```text
x = 42, *p = 42
x = 50
x = 51
```

Let's follow the program step by step with a memory diagram (made-up addresses):

| Step | `x` (at 1000) | `p` (at 2000) | `*p` |
| --- | --- | --- | --- |
| `int x = 42;` | 42 | — | — |
| `int *p = &x;` | 42 | 1000 | 42 |
| `*p = 50;` | **50** | 1000 | 50 |
| `*p = *p + 1;` | **51** | 1000 | 51 |

Notice that `p` never changed: it is always `1000`. What changed was the object it points to.

The `*` symbol has three meanings depending on where it appears:

| Where | Example | Meaning |
| --- | --- | --- |
| In a declaration | `int *p;` | `p` is a pointer to `int` |
| Before a pointer in an expression | `*p = 5;` | the pointed-to object (dereference) |
| Between two operands | `a * b` | multiplication |

And `&` and `*` undo each other: `*&x` is `x`, and if `p` points to something, `&*p` is `p`.

### Predict the value

```c
int a = 3;
int b = 7;
int *p = &a;
*p = *p * 2;
p = &b;
*p = *p + a;
```

What are `a` and `b` at the end? Think before reading on.

Answer: `a` is `6` (it was doubled through `p`) and `b` is `13` (`7 + 6`). The line `p = &b;` copies no integer: it makes `p` **point to another object**.

## Pointer types must match

An `int *` points to an `int`, a `double *` points to a `double`, a `char *` points to a `char`. The type tells the compiler how many bytes to read and how to interpret them when dereferencing.

```c
int age = 20;
double *pd = &age;   /* ERROR: incompatible pointer types */
```

With the course options (`-Wall -Wextra -Wpedantic`), the compiler reports that `int *` and `double *` are incompatible. If you forced it, `*pd` would read 8 bytes where there are 4 and interpret them as a `double`: undefined behavior. When the compiler complains about a pointer's type, it is almost always right.

## The null pointer: `NULL`

Sometimes a pointer has no object to point to yet. To express "points to nothing" there is the **null pointer**, written `NULL` (defined in `<stddef.h>`, `<stdio.h>` and other headers).

```c
int *p = NULL;

if (p != NULL) {
    printf("%d\n", *p);   /* only dereferenced when it points to something */
}
```

`NULL` is a value you can **compare**, never **dereference**. Many standard library functions return `NULL` to signal that something failed; you will see it with dynamic memory and with files.

> **Basic C:** initialize every pointer, even if only with `NULL`. A pointer initialized with `NULL` can be checked; an uninitialized one cannot.

> **Modern C (C23):** C23 adds the `nullptr` constant (of type `nullptr_t`), which represents the null pointer unambiguously: `int *p = nullptr;`. `NULL` is still valid, and it is what you will find in almost all existing code.

> **Portability:** `nullptr` does not exist in C17 or in older compilers; if your code must build with `-std=c17`, use `NULL`. This course uses `NULL` in its examples so they work in both.

## When a pointer is valid

Before writing `*p`, `p` must point to a **valid object**: a variable that exists, an element inside an array. Otherwise, dereferencing is **undefined behavior**: the standard does not say what happens. The program may crash with a segmentation fault, may seem to work, or may silently corrupt other data.

The two classic cases:

```c
int *p;          /* uninitialized: its value is garbage */
*p = 10;         /* undefined behavior: writes to an arbitrary address */

int *q = NULL;
printf("%d\n", *q);   /* undefined behavior: q points to no object */
```

The first one is the most dangerous, because an uninitialized pointer cannot be told apart from a valid one at a glance. Hence the golden rule: **every pointer is born pointing to something valid or to `NULL`**. (There is a third case, a pointer to an object that no longer exists; you will study it in the lesson on storage duration and lifetime.)

## Modifying a caller's variable

In the lesson on parameters you saw that C **always** passes arguments **by value**: the function receives a copy. That is why this version of `swap` does not work:

```c
void swap_copies(int a, int b) {
    int tmp = a;
    a = b;
    b = tmp;     /* changes the copies; main's variables stay the same */
}
```

The technique that lets a function modify its caller's variables is to **pass their addresses**:

```c
#include <stdio.h>

void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

int main(void) {
    int x = 3;
    int y = 8;

    swap(&x, &y);
    printf("x = %d, y = %d\n", x, y);

    return 0;
}
```

Output:

```text
x = 8, y = 3
```

Let's follow memory during the call (made-up addresses):

| Moment | `x` (1000) | `y` (1004) | `a` | `b` | `tmp` |
| --- | --- | --- | --- | --- | --- |
| before the call | 3 | 8 | — | — | — |
| on entry | 3 | 8 | 1000 | 1004 | — |
| `tmp = *a;` | 3 | 8 | 1000 | 1004 | 3 |
| `*a = *b;` | **8** | 8 | 1000 | 1004 | 3 |
| `*b = tmp;` | 8 | **3** | 1000 | 1004 | 3 |
| after returning | 8 | 3 | — | — | — |

### The pointer is also passed by value

This matters, and it is often explained wrongly. In `swap(&x, &y)` **there is no special "pass by reference" mechanism**. `&x` and `&y` are evaluated, giving two values (two addresses), and those values are **copied** into the parameters `a` and `b`. It is pass by value, as always; what gets copied is an address.

What changes `main`'s variable is not the call but the dereference `*a = ...` inside the function. The proof: if the function changes **the pointer itself**, the caller never finds out.

```c
#include <stdio.h>

void redirect(int *p) {
    static int other = 99;
    p = &other;     /* changes the local copy of the pointer */
    *p = 100;       /* writes into other, not into x */
}

int main(void) {
    int x = 5;
    int *px = &x;

    redirect(px);
    printf("x = %d, px points to x: %s\n", x, px == &x ? "yes" : "no");

    return 0;
}
```

Output:

```text
x = 5, px points to x: yes
```

`px` still points to `x`, because `redirect` received a copy of `px`. (The `static` keyword keeps `other` alive after the function returns; you will see it in detail in the lesson on storage duration. To change what `px` points to from inside a function, you would pass the address of `px`: a pointer to a pointer, which appears in the next lesson.)

## Returning several results

A C function returns a single value with `return`. When you need more than one result, the usual technique is to receive pointers to the variables where the function should leave them. These parameters are called **output parameters**.

```c
#include <stdio.h>

/* Returns 0 if b is 0 (division impossible) and 1 if everything went well. */
int divide(int a, int b, int *quotient, int *remainder) {
    if (b == 0) {
        return 0;
    }
    *quotient = a / b;
    *remainder = a % b;
    return 1;
}

int main(void) {
    int q = 0;
    int r = 0;

    if (divide(17, 5, &q, &r)) {
        printf("17 / 5 = %d, remainder %d\n", q, r);
    }
    if (!divide(4, 0, &q, &r)) {
        printf("cannot divide by zero\n");
    }

    return 0;
}
```

Output:

```text
17 / 5 = 3, remainder 2
cannot divide by zero
```

This pattern is very common in C: the return value says whether the operation succeeded, and the results travel through the pointer parameters. You will recognize it in `scanf`, which returns how many items it read and leaves the data at the addresses you gave it.

## `const` and pointers

When a function receives a pointer only to **read**, declare it `const`. The compiler then stops you from modifying the object by mistake, and the caller knows their data will not change.

`const` can go in two places, and they mean different things:

```c
int x = 1;
int y = 2;

const int *p = &x;   /* pointer to const int: you cannot change *p */
p = &y;              /* fine: p may point to another object */
/* *p = 5;              error: *p is read-only */

int *const q = &x;   /* const pointer to int: you cannot change q */
*q = 5;              /* fine: you may change the object */
/* q = &y;              error: q always points to x */
```

How to read it: look at which side of the `*` the `const` is on. On the left (`const int *`) it protects the **pointed-to object**; on the right (`int *const`) it protects the **pointer**.

```c
void show(const int *value) {
    printf("%d\n", *value);   /* reading is allowed */
}
```

## Summary

- Memory can be pictured as numbered cells; an object's address is the address of its first byte.
- `&x` gives the address of `x`; `%p` prints it, after converting it with `(void *)`.
- `int *p = &x;` declares a pointer to `int` that points to `x`; `*p` is the pointed-to object, for reading and writing.
- The pointer's type must match the object's type.
- `NULL` (or `nullptr` in C23) means "points to nothing": compare it, never dereference it.
- Dereferencing an uninitialized or null pointer is undefined behavior.
- C always passes arguments by value; passing an address lets a function modify the caller's object, but the pointer itself arrives as a copy.
- Pointer parameters let a function return several results.
- `const int *` protects the object; `int *const` protects the pointer.

## Practice exercises

### Exercise 1: trace the values

Without running it, fill in the values of `a`, `b`, `*p` and `*q` after each line. Then state what it prints.

```c
#include <stdio.h>

int main(void) {
    int a = 10;
    int b = 20;
    int *p = &a;
    int *q = &b;

    *p = *q;
    q = p;
    *q = 5;
    printf("%d %d %d %d\n", a, b, *p, *q);

    return 0;
}
```

<details><summary>Show solution</summary>

| Line | `a` | `b` | `p` points to | `q` points to |
| --- | --- | --- | --- | --- |
| start | 10 | 20 | `a` | `b` |
| `*p = *q;` | 20 | 20 | `a` | `b` |
| `q = p;` | 20 | 20 | `a` | `a` |
| `*q = 5;` | 5 | 20 | `a` | `a` |

It prints `5 20 5 5`. After `q = p;` both pointers point to `a`, so writing to `*q` changes `a`, and `b` stays `20`.

</details>

### Exercise 2: find the bug

This program sometimes prints a strange number and sometimes crashes with a segmentation fault. Explain why and fix it.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int total;
    int *p;

    total = 0;
    *p = 7;
    total = total + *p;
    printf("%d\n", total);

    return 0;
}
```

<details><summary>Show solution</summary>

`p` is declared without being initialized, so its value is garbage: `*p = 7;` writes to an arbitrary address. That is undefined behavior, which is why the result changes from run to run (with the course options, the compiler usually even warns that `p` is used uninitialized).

The pointer must point to a valid object before it is dereferenced:

```c
#include <stdio.h>

int main(void) {
    int total = 0;
    int value = 0;
    int *p = &value;

    *p = 7;
    total = total + *p;
    printf("%d\n", total);

    return 0;
}
```

</details>

### Exercise 3: sort two variables

Write `void sort_two(int *a, int *b)` that leaves the smaller value in `*a` and the larger one in `*b`. Test it from `main` with `x = 9` and `y = 4`.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

void sort_two(int *a, int *b) {
    if (*a > *b) {
        int tmp = *a;
        *a = *b;
        *b = tmp;
    }
}

int main(void) {
    int x = 9;
    int y = 4;

    sort_two(&x, &y);
    printf("x = %d, y = %d\n", x, y);   /* x = 4, y = 9 */

    return 0;
}
```

The function receives copies of the addresses of `x` and `y`; through them it modifies `main`'s objects.

</details>

### Exercise 4: minimum and maximum of an array

Write `int min_max(const int v[], int n, int *minimum, int *maximum)` that stores the smallest and largest element of `v` in `*minimum` and `*maximum`. If `n` is less than 1, it must return `0` without touching the results; otherwise it returns `1`. Why can `v` be `const` while `minimum` cannot?

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int min_max(const int v[], int n, int *minimum, int *maximum) {
    if (n < 1) {
        return 0;
    }
    *minimum = v[0];
    *maximum = v[0];
    for (int i = 1; i < n; i++) {
        if (v[i] < *minimum) {
            *minimum = v[i];
        }
        if (v[i] > *maximum) {
            *maximum = v[i];
        }
    }
    return 1;
}

int main(void) {
    int grades[] = {7, 3, 9, 5, 8};
    int lowest = 0;
    int highest = 0;

    if (min_max(grades, 5, &lowest, &highest)) {
        printf("lowest = %d, highest = %d\n", lowest, highest);   /* 3 and 9 */
    }

    return 0;
}
```

`v` is only read, so `const` documents and guarantees that the function does not modify it. `minimum` and `maximum` are output parameters: the function writes through them, so they cannot point to `const` objects.

</details>

### Exercise 5: which line does not compile?

State which of the marked lines cause a compile error, and why.

```c
int a = 1;
int b = 2;
const int *p = &a;
int *const q = &a;

*p = 10;   /* (1) */
p = &b;    /* (2) */
*q = 10;   /* (3) */
q = &b;    /* (4) */
```

<details><summary>Show solution</summary>

- (1) **Error:** `p` is a pointer to const `int`; you cannot write through it.
- (2) Fine: the pointer `p` is not const, so it may point to another object.
- (3) Fine: `q` points to a modifiable `int`.
- (4) **Error:** `q` is a const pointer; it always points to `a`.

</details>
