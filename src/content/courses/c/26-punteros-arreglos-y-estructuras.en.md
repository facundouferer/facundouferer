---
title: 'Pointers, arrays and structs'
course: 'c'
slug: 'punteros-arreglos-y-estructuras'
order: 26
lang: 'en'
published: true
---

In the previous lesson a pointer pointed to a single variable. But pointers show their full power when they point **inside an array**: there they can move from one element to the next. In this lesson you will discover that many things you already used (indexes, strings, passing an array to a function) were pointers in disguise.

> Key idea: in almost every expression, an array's name turns into a pointer to its first element, and `a[i]` is just another way of writing `*(a + i)`.

## Objectives

- Use pointer arithmetic: add, subtract and compare pointers inside an array.
- Explain how arrays and pointers are related, and how they differ.
- Pass arrays to functions knowing that what travels is a pointer, together with the length.
- Tell which pointers may be computed and which may be dereferenced.
- Traverse strings with a `char *`.
- Access structs through pointers with `->`.
- Use double pointers, generic `void *` pointers and function pointers.

**Prerequisites:** [Pointers and memory addresses](/en/courses/c/punteros-y-direcciones), [Arrays](/en/courses/c/arreglos-unidimensionales-y-multidimensionales), [Strings](/en/courses/c/cadenas-de-caracteres-y-operaciones), [Structs](/en/courses/c/concepto-de-estructuras) and [Sorting arrays](/en/courses/c/ordenacion-de-arreglos).

## Pointer arithmetic

An array's elements are **contiguous** in memory: one right after the other. If a pointer points to an element, adding 1 takes it to the **next element**, not to the next byte.

```c
int a[4] = {10, 20, 30, 40};
int *p = &a[0];
```

With `sizeof(int)` equal to 4 and the array starting at address `1000`:

| Expression | Points to | Address | Pointed-to value |
| --- | --- | --- | --- |
| `p` | `a[0]` | 1000 | 10 |
| `p + 1` | `a[1]` | 1004 | 20 |
| `p + 2` | `a[2]` | 1008 | 30 |
| `p + 3` | `a[3]` | 1012 | 40 |

The rule of **pointer arithmetic**: `p + n` moves `n` elements forward, that is, `n * sizeof(*p)` bytes. The compiler does the multiplication for you, because it knows the pointed-to type. That is why the pointer's type matters so much.

<svg viewBox="0 0 600 190" role="img" aria-label="Array a of four ints at addresses 1000, 1004, 1008 and 1012; p points to a[0] and p + 1 points to a[1]" style="max-width: 100%; height: auto; font-family: var(--font-body);">
  <rect x="40" y="70" width="120" height="60" rx="14" fill="var(--color-surface)" stroke="var(--color-accent)" stroke-width="3"/>
  <rect x="170" y="70" width="120" height="60" rx="14" fill="var(--color-surface)" stroke="var(--color-accent-2)" stroke-width="3"/>
  <rect x="300" y="70" width="120" height="60" rx="14" fill="var(--color-surface)" stroke="var(--color-accent-2)" stroke-width="3"/>
  <rect x="430" y="70" width="120" height="60" rx="14" fill="var(--color-surface)" stroke="var(--color-accent-2)" stroke-width="3"/>
  <text x="100" y="108" text-anchor="middle" fill="var(--color-text)" font-size="20" font-family="monospace">10</text>
  <text x="230" y="108" text-anchor="middle" fill="var(--color-text)" font-size="20" font-family="monospace">20</text>
  <text x="360" y="108" text-anchor="middle" fill="var(--color-text)" font-size="20" font-family="monospace">30</text>
  <text x="490" y="108" text-anchor="middle" fill="var(--color-text)" font-size="20" font-family="monospace">40</text>
  <text x="100" y="155" text-anchor="middle" fill="var(--color-text)" font-size="14" font-family="monospace">1000</text>
  <text x="230" y="155" text-anchor="middle" fill="var(--color-text)" font-size="14" font-family="monospace">1004</text>
  <text x="360" y="155" text-anchor="middle" fill="var(--color-text)" font-size="14" font-family="monospace">1008</text>
  <text x="490" y="155" text-anchor="middle" fill="var(--color-text)" font-size="14" font-family="monospace">1012</text>
  <text x="100" y="30" text-anchor="middle" fill="var(--color-accent)" font-size="17" font-family="monospace">p</text>
  <path d="M100 38 L 100 62" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
  <text x="230" y="30" text-anchor="middle" fill="var(--color-text)" font-size="17" font-family="monospace">p + 1</text>
  <path d="M230 38 L 230 62" stroke="var(--color-accent-2)" stroke-width="3" stroke-linecap="round"/>
  <text x="300" y="182" text-anchor="middle" fill="var(--color-text)" font-size="14">each step moves sizeof(int) bytes</text>
</svg>

You can check it by printing the addresses. To measure the distance in bytes, the program converts the pointers to `char *`, because a `char` takes exactly one byte:

```c
#include <stdio.h>

int main(void) {
    int a[4] = {10, 20, 30, 40};
    int *p = a;

    printf("p     = %p, *p       = %d\n", (void *)p, *p);
    printf("p + 1 = %p, *(p + 1) = %d\n", (void *)(p + 1), *(p + 1));
    printf("bytes between p and p + 1: %td\n", (char *)(p + 1) - (char *)p);

    return 0;
}
```

With 4-byte ints, the last line prints `bytes between p and p + 1: 4`. Change `int` to `double` and it prints 8.

The allowed operations are few, and they only make sense **inside the same array**:

| Operation | Example | Result |
| --- | --- | --- |
| pointer + integer | `p + 2` | pointer two elements further |
| pointer − integer | `q - 1` | pointer one element back |
| `++` and `--` | `p++` | moves one element forward or back |
| pointer − pointer | `q - p` | number of elements between them |
| comparison | `p < q` | which one comes first in the array |

Adding two pointers makes no sense and does not compile.

## The array name turns into a pointer

Look at the line `int *p = a;` in the previous program: we assigned the whole array to a pointer, without `&`. It works because, in almost every expression, **an array's name is converted into a pointer to its first element**. We say the array *decays* to a pointer. So `a` in an expression is the same value as `&a[0]`.

That gives the central equivalence of this lesson:

```c
a[i]  ==  *(a + i)
```

The `[]` operator is **defined** as pointer arithmetic plus a dereference. That is why indexes start at 0: `a[0]` is `*(a + 0)`, the first element, with no offset. And that is also why you can use `[]` on a pointer: if `p` points to `a[0]`, `p[2]` is `a[2]`.

With this you can traverse an array by moving a pointer instead of an index:

```c
#include <stdio.h>

int main(void) {
    int grades[5] = {7, 4, 9, 6, 8};
    int sum = 0;

    for (int *p = grades; p < grades + 5; p++) {
        sum += *p;
    }
    printf("sum = %d\n", sum);   /* sum = 34 */

    return 0;
}
```

`grades + 5` points right **after** the last element. The loop stops when it reaches it, without dereferencing it. That special pointer shows up again below.

### Predict the value

```c
int v[5] = {2, 4, 6, 8, 10};
int *p = v + 1;
int x = *p + 1;
int y = *(p + 1);
int z = p[2];
p += 3;
int w = *p;
```

Work out `x`, `y`, `z` and `w` before reading on.

Answer: `p` starts at `v[1]` (value 4). `x = 4 + 1 = 5` (`*` applies before `+`); `y = v[2] = 6`; `z = p[2] = v[3] = 8`; after `p += 3`, `p` points to `v[4]`, so `w = 10`. Compare `*p + 1` with `*(p + 1)`: the parentheses change everything.

## Arrays and pointers are not the same

An array turning into a pointer does not mean it **is** a pointer. There are important differences:

```c
int a[5] = {1, 2, 3, 4, 5};
int *p = a;

sizeof a;   /* 5 * sizeof(int): for example 20, the whole array */
sizeof p;   /* the size of a pointer: for example 8 */
```

| | Array `int a[5]` | Pointer `int *p` |
| --- | --- | --- |
| What it is | 5 contiguous `int` objects | a variable holding an address |
| `sizeof` | size of all the elements | size of a pointer |
| Assignable? | no: `a = p;` does not compile | yes: `p = other_address;` |
| `&` | `&a` is the address of the whole array | `&p` is the address of the pointer variable |

Arrays are **not assignable**: you cannot copy an array with `=` or make its name point elsewhere. The conversion to a pointer does not happen in three cases: with `sizeof`, with `&`, and when a string literal initializes a `char` array.

## Passing an array to a function passes a pointer

When you write `average(grades, 5)`, the array decays to a pointer and what is copied into the parameter is **the address of the first element**. That is why these two declarations are exactly equivalent:

```c
double average(const int v[], size_t n);
double average(const int *v, size_t n);
```

Consequences you already knew without knowing why:

- The function can modify the elements of the original array (if the parameter is not `const`): it has their address.
- The function **cannot know how many elements there are**: inside it, `sizeof v` is the size of a pointer. That is why the length always travels as a separate parameter, ideally of type `size_t`.

```c
#include <stddef.h>
#include <stdio.h>

double average(const int *v, size_t n) {
    int sum = 0;
    for (size_t i = 0; i < n; i++) {
        sum += v[i];
    }
    return n > 0 ? (double)sum / (double)n : 0.0;
}

int main(void) {
    int grades[] = {7, 4, 9, 6, 8};
    size_t n = sizeof grades / sizeof grades[0];   /* here it works: grades is an array */

    printf("average = %.2f\n", average(grades, n));   /* average = 6.80 */

    return 0;
}
```

The calculation `sizeof grades / sizeof grades[0]` only works where the array was declared. Inside `average`, `v` is already a pointer.

## Subtracting pointers: `ptrdiff_t`

Subtracting two pointers into the same array gives the **number of elements** between them. The result has type `ptrdiff_t` (a signed integer defined in `<stddef.h>`) and is printed with `%td`.

```c
#include <stddef.h>
#include <stdio.h>

int main(void) {
    int v[6] = {5, 8, 3, 9, 1, 7};
    int *start = v;
    int *largest = v;

    for (int *p = v + 1; p < v + 6; p++) {
        if (*p > *largest) {
            largest = p;
        }
    }

    ptrdiff_t position = largest - start;
    printf("the largest is %d, at position %td\n", *largest, position);

    return 0;
}
```

It prints `the largest is 9, at position 3`. Subtracting pointers from **different arrays** is undefined behavior: the result means nothing.

## Out-of-bounds pointers

Dereferencing a pointer that leaves the array is **undefined behavior**, just like using an out-of-range index (in fact it is the same thing: `a[5]` is `*(a + 5)`). The standard makes a single useful exception:

- You may **compute** and **compare** the pointer **one past the last element** (`a + n`). That is why `p < a + n` loops are correct.
- You may **not** dereference it: `*(a + n)` is undefined behavior.
- Any other pointer outside the array (`a - 1`, `a + n + 1`) is undefined behavior even if you only compute it.

```c
int a[3] = {1, 2, 3};
int *end = a + 3;      /* fine: one past the end */
int x = *end;          /* undefined behavior: there is no element there */
int *before = a - 1;   /* undefined behavior: it cannot even be computed */
```

## Strings and `char *`

A string is a `char` array terminated by `'\0'`. Like any array, it decays to a `char *` pointing to the first character. That is why the `<string.h>` functions take `char *` or `const char *`.

Traversing a string with a pointer is very natural: move forward until you find the terminator.

```c
#include <stddef.h>
#include <stdio.h>

size_t my_strlen(const char *s) {
    const char *p = s;
    while (*p != '\0') {
        p++;
    }
    return (size_t)(p - s);   /* elements walked = length */
}

int main(void) {
    char greeting[] = "hello";
    printf("%zu\n", my_strlen(greeting));   /* 5 */

    for (const char *c = greeting; *c != '\0'; c++) {
        printf("[%c]", *c);
    }
    printf("\n");                            /* [h][e][l][l][o] */

    return 0;
}
```

There are two ways to hold a string, and they are not equivalent:

```c
char word[] = "hello";          /* your own array of 6 char: you may modify it */
const char *literal = "hello";  /* pointer to a string literal: read-only */
```

Modifying a string literal is undefined behavior. That is why a pointer to a literal is declared `const char *`: the compiler then stops you if you try to write through it.

## Pointers to structs and the `->` operator

Structs tend to be large, so instead of copying them you pass their address. With a pointer `p` to a struct, you reach a member with `(*p).member`. The parentheses are required, because `.` binds tighter than `*`. Since that form is clumsy, C offers the **arrow** operator:

```c
p->member   /* exactly the same as (*p).member */
```

```c
#include <stdio.h>

struct Point {
    int x;
    int y;
};

void move(struct Point *p, int dx, int dy) {
    p->x += dx;
    p->y += dy;
}

void show(const struct Point *p) {
    printf("(%d, %d)\n", p->x, p->y);
}

int main(void) {
    struct Point a = {1, 2};

    move(&a, 3, -1);
    show(&a);             /* (4, 1) */

    struct Point *pa = &a;
    (*pa).x = 0;          /* the same as pa->x = 0 */
    show(pa);             /* (0, 1) */

    return 0;
}
```

Rule of thumb: with a struct **variable** you use `.`; with a **pointer** to a struct you use `->`. `show` takes a `const struct Point *` because it only reads: it does not copy the struct and it promises not to modify it.

You can also walk an array of structs with a pointer:

```c
#include <stdio.h>

struct Student {
    char name[20];
    int grade;
};

int main(void) {
    struct Student course[3] = {{"Ann", 8}, {"Louis", 5}, {"Sophie", 9}};

    for (struct Student *s = course; s < course + 3; s++) {
        if (s->grade >= 6) {
            printf("%s passed with %d\n", s->name, s->grade);
        }
    }

    return 0;
}
```

## Double pointers

A pointer is a variable, so it has an address, and that address can be stored in another pointer. An `int **` is a **pointer to a pointer to `int`**.

```c
int x = 5;
int *p = &x;
int **pp = &p;

**pp = 6;   /* pp -> p -> x: changes x */
```

| Expression | Type | Value |
| --- | --- | --- |
| `pp` | `int **` | address of `p` |
| `*pp` | `int *` | the value of `p`, that is, the address of `x` |
| `**pp` | `int` | the value of `x` |

What is it for? For the case left open in the previous lesson: a function that changes **what a caller's pointer points to**. Since the pointer is passed by value, the function needs its address.

```c
#include <stddef.h>
#include <stdio.h>

/* Stores in *result a pointer to the first element equal to target,
   or NULL if it is not there. Returns 1 if found and 0 otherwise. */
int find(int *v, size_t n, int target, int **result) {
    for (size_t i = 0; i < n; i++) {
        if (v[i] == target) {
            *result = &v[i];
            return 1;
        }
    }
    *result = NULL;
    return 0;
}

int main(void) {
    int data[] = {4, 7, 1, 7};
    int *found = NULL;

    if (find(data, 4, 7, &found)) {
        *found = 70;   /* changes the element inside the array */
    }
    printf("%d %d %d %d\n", data[0], data[1], data[2], data[3]);   /* 4 70 1 7 */

    return 0;
}
```

The second typical use is already in sight from this lesson on: `int main(int argc, char *argv[])`. `argv` is an array of pointers to `char` (the words typed on the command line) and, as a parameter, it is a `char **`.

## `void *`: the generic pointer

A `void *` can hold the address of an object of **any** type. In exchange, it does not know what is on the other side: it **cannot be dereferenced** or used in pointer arithmetic. To use the object, you first convert it to the right type.

```c
int n = 42;
void *g = &n;              /* any object pointer converts to void * */

/* printf("%d", *g);         error: a void * cannot be dereferenced */
int *pi = g;               /* back to int *: a valid implicit conversion in C */
printf("%d\n", *pi);       /* 42 */
printf("%d\n", *(int *)g); /* the same, with an explicit conversion */
```

You already used it with `%p`, which takes a `void *`. Its real use is generic functions, which work with data without knowing its type. This swap works for any type because it copies byte by byte, through `unsigned char *`:

```c
#include <stddef.h>
#include <stdio.h>

void swap_bytes(void *a, void *b, size_t size) {
    unsigned char *x = a;
    unsigned char *y = b;
    for (size_t i = 0; i < size; i++) {
        unsigned char tmp = x[i];
        x[i] = y[i];
        y[i] = tmp;
    }
}

int main(void) {
    double d1 = 1.5;
    double d2 = 2.5;
    swap_bytes(&d1, &d2, sizeof d1);
    printf("%.1f %.1f\n", d1, d2);   /* 2.5 1.5 */

    return 0;
}
```

With a `void *`, using the right type becomes your responsibility: the compiler can no longer check it.

## Function pointers

Functions also have an address, and it can be stored in a **function pointer**. The declaration reads like this:

```c
int (*operation)(int, int);   /* operation is a pointer to a function
                                 taking two ints and returning int */
```

The parentheses in `(*operation)` are essential: without them, `int *operation(int, int);` declares a function returning `int *`.

With a function pointer, the program can **choose at run time** which function to call:

```c
#include <stdio.h>

int add(int a, int b) { return a + b; }
int subtract(int a, int b) { return a - b; }
int multiply(int a, int b) { return a * b; }

int apply(int (*f)(int, int), int a, int b) {
    return f(a, b);   /* (*f)(a, b) also works */
}

int main(void) {
    int (*operations[3])(int, int) = {add, subtract, multiply};
    const char *names[3] = {"sum", "difference", "product"};

    for (int i = 0; i < 3; i++) {
        printf("%s: %d\n", names[i], apply(operations[i], 6, 3));
    }

    return 0;
}
```

Output:

```text
sum: 9
difference: 3
product: 18
```

Like an array, a function's name turns into a pointer to it: that is why `add` appears without `&` in the initializer.

### `qsort`: sorting with a comparison function

The standard library combines the last two ideas in `qsort` (from `<stdlib.h>`): it sorts an array of **any type** (received as `void *`) and, to know which element goes first, it calls a **comparison function** you pass by pointer. The comparator receives two `const void *`, converts them to the real type, and returns a negative number, zero or a positive number.

```c
#include <stdio.h>
#include <stdlib.h>

int compare_ints(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);   /* -1, 0 or 1 with no risk of overflow */
}

int main(void) {
    int v[] = {42, 7, 19, 3, 25};
    size_t n = sizeof v / sizeof v[0];

    qsort(v, n, sizeof v[0], compare_ints);

    for (size_t i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");   /* 3 7 19 25 42 */

    return 0;
}
```

In the sorting lesson you wrote your own algorithms; `qsort` is the library version, which works for any type thanks to `void *` and function pointers.

> **Portability:** the standard does not require `qsort` to use a particular algorithm or to be stable (equal elements may change their relative order). If you need stability, you must guarantee it yourself, for example by adding a second criterion to the comparator.

## Summary

- `p + n` moves `n` elements forward (`n * sizeof(*p)` bytes): that is pointer arithmetic.
- An array's name decays to a pointer to its first element; `a[i]` is `*(a + i)`.
- Arrays and pointers differ in `sizeof`, in assignment and in `&`.
- Passing an array to a function passes a pointer: the length travels separately, as `size_t`.
- Subtracting pointers into the same array gives a `ptrdiff_t` (`%td`).
- Computing the one-past-the-end pointer is allowed; dereferencing it is not. Leaving the array is undefined behavior.
- A string is traversed with a `char *` up to `'\0'`; string literals are read-only.
- `p->member` is equivalent to `(*p).member`.
- `int **` lets a function change what a caller's pointer points to.
- `void *` holds any address but cannot be dereferenced without converting it.
- Function pointers let you choose which function to call, as `qsort` does with its comparator.

## Practice exercises

### Exercise 1: follow the pointers

Without running it, state what the program prints. Assume `v` starts at address `2000` and `sizeof(int)` is 4: what address does `q` hold at the end?

```c
#include <stdio.h>

int main(void) {
    int v[5] = {3, 6, 9, 12, 15};
    int *p = v;
    int *q = v + 4;

    p++;
    *p = *p + *q;
    q -= 2;
    printf("%d %d %d %td\n", v[1], *q, q[1], q - p);

    return 0;
}
```

<details><summary>Show solution</summary>

- `p++` leaves `p` pointing to `v[1]`.
- `*p = *p + *q` sets `v[1] = 6 + 15 = 21`.
- `q -= 2` moves `q` from `v[4]` to `v[2]`, address `2000 + 2 * 4 = 2008`.
- `*q` is `v[2] = 9`; `q[1]` is `v[3] = 12`; `q - p` is `2 - 1 = 1` element.

It prints `21 9 12 1`.

</details>

### Exercise 2: find the bug

This function should return the array's last element, but it sometimes returns garbage. What is wrong?

```c
int last(const int *v, size_t n) {
    const int *end = v + n;
    return *end;
}
```

<details><summary>Show solution</summary>

`v + n` is the pointer **one past** the last element. Computing it is allowed, but dereferencing it is undefined behavior: there is no array element there. The last element is at `v + n - 1`. Also, if `n` is 0 there is no last element, so require `n > 0`:

```c
#include <stddef.h>
#include <stdio.h>

int last(const int *v, size_t n) {
    return *(v + n - 1);   /* requires n > 0 */
}

int main(void) {
    int data[] = {4, 8, 15};
    printf("%d\n", last(data, 3));   /* 15 */

    return 0;
}
```

</details>

### Exercise 3: count a character with pointers

Write `size_t count(const char *s, char c)` that counts how many times `c` appears in the string `s`, walking it with a pointer and **without indexes or `strlen`**.

<details><summary>Show solution</summary>

```c
#include <stddef.h>
#include <stdio.h>

size_t count(const char *s, char c) {
    size_t times = 0;
    for (const char *p = s; *p != '\0'; p++) {
        if (*p == c) {
            times++;
        }
    }
    return times;
}

int main(void) {
    printf("%zu\n", count("banana", 'a'));   /* 3 */

    return 0;
}
```

</details>

### Exercise 4: the top student

With the struct `struct Student { char name[20]; int grade; };`, write `const struct Student *best(const struct Student *v, size_t n)` that returns a pointer to the student with the highest grade (or `NULL` if `n` is 0). Print their name from `main` using `->`.

<details><summary>Show solution</summary>

```c
#include <stddef.h>
#include <stdio.h>

struct Student {
    char name[20];
    int grade;
};

const struct Student *best(const struct Student *v, size_t n) {
    if (n == 0) {
        return NULL;
    }
    const struct Student *b = v;
    for (const struct Student *s = v + 1; s < v + n; s++) {
        if (s->grade > b->grade) {
            b = s;
        }
    }
    return b;
}

int main(void) {
    struct Student course[] = {{"Ann", 8}, {"Louis", 5}, {"Sophie", 9}};
    const struct Student *b = best(course, 3);

    if (b != NULL) {
        printf("%s (%d)\n", b->name, b->grade);   /* Sophie (9) */
    }

    return 0;
}
```

Returning a pointer to an array element is safe because the array still exists in `main`. The function copies no struct.

</details>

### Exercise 5: moving a pointer from a function

Write `void skip_spaces(const char **s)` that moves the caller's pointer forward to the first character that is not a space. For example, if `text` points to `"   hello"`, after `skip_spaces(&text)` it must point to `"hello"`. Why must the parameter be `const char **` and not `const char *`?

<details><summary>Show solution</summary>

```c
#include <stdio.h>

void skip_spaces(const char **s) {
    while (**s == ' ') {
        (*s)++;   /* moves the caller's pointer */
    }
}

int main(void) {
    const char *text = "   hello";

    skip_spaces(&text);
    printf("[%s]\n", text);   /* [hello] */

    return 0;
}
```

The function must change **the value of `main`'s pointer** `text`. If it received a `const char *`, it would receive a copy and only move the copy. Receiving the address of `text` (`const char **`), `*s` is `text` itself and `(*s)++` moves it. The parentheses matter: `*s++` would move `s`, not `*s`.

</details>

### Exercise 6: choosing the operation

Using a function pointer, write `void apply_to_all(int *v, size_t n, int (*f)(int))` that replaces each element with `f(element)`. Test it with a `twice` function and a `square` function.

<details><summary>Show solution</summary>

```c
#include <stddef.h>
#include <stdio.h>

int twice(int x) { return 2 * x; }
int square(int x) { return x * x; }

void apply_to_all(int *v, size_t n, int (*f)(int)) {
    for (int *p = v; p < v + n; p++) {
        *p = f(*p);
    }
}

void show(const int *v, size_t n) {
    for (size_t i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");
}

int main(void) {
    int v[] = {1, 2, 3, 4};

    apply_to_all(v, 4, twice);
    show(v, 4);               /* 2 4 6 8 */
    apply_to_all(v, 4, square);
    show(v, 4);               /* 4 16 36 64 */

    return 0;
}
```

</details>
