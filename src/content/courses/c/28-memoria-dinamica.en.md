---
title: 'Dynamic memory: malloc, calloc, realloc and free'
course: 'c'
slug: 'memoria-dinamica'
description: 'Allocate and resize heap blocks at runtime with malloc, calloc and realloc, check allocation failures and release memory with free.'
order: 28
lang: 'en'
published: true
---

In the previous lesson you saw that automatic variables die when their block ends and that static ones live for the whole program with a fixed size. A third option is missing: memory the program **requests when it needs it**, of the size it needs, and **gives back when it is done**. That is allocated storage duration, and in this lesson you learn to manage it.

## Objectives

- Explain when dynamic memory is needed.
- Allocate memory with `malloc` and `calloc`, and always check whether the allocation failed.
- Grow a block with `realloc` using the safe pattern.
- Release memory with `free` and set the pointer to `NULL`.
- Build a dynamic array that grows as the data arrives.
- Initialize and clean up correctly: every allocation checked, every block freed.

**Prerequisites:** `punteros-y-direcciones`, `punteros-arreglos-y-estructuras` (pointer arithmetic, `->`, `void *`) and `duracion-y-ciclo-de-vida`.

## Why dynamic memory?

So far every array had a fixed size written in the code: `int grades[100];`. That brings two problems:

1. **The size is only known at run time.** If the user enters 3 grades, 97 slots are wasted; if they enter 150, they do not fit.
2. **The object must outlive the function that creates it.** A local variable dies on return; a `static` one is unique and shared. Sometimes you need to create a new object in a function and hand it to the caller.

Dynamic memory solves both: the size is decided at run time and the object lives until the program explicitly releases it.

## The heap

Dynamic memory comes from an area usually called the **heap**. As you saw in the previous lesson, it is an explanatory model: the standard does not require it, but it helps you reason. What matters is the rule:

> An allocated block lives **from the moment you request it until you call `free`**. No closing brace and no function return releases it.

The four functions are in `<stdlib.h>`.

## `malloc`: allocating a block

`malloc` takes a number of **bytes** (a `size_t`) and returns a `void *` with the address of the block, or `NULL` if it could not allocate it. The contents of the block are **not initialized**.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t n = 5;
    int *numbers = malloc(n * sizeof *numbers);
    if (numbers == NULL) {
        fprintf(stderr, "Not enough memory\n");
        return 1;
    }

    for (size_t i = 0; i < n; i++) {
        numbers[i] = (int)(i * i);
    }
    for (size_t i = 0; i < n; i++) {
        printf("%d ", numbers[i]);
    }
    printf("\n");

    free(numbers);
    numbers = NULL;
    return 0;
}
```

Details worth noticing:

- **`n * sizeof *numbers`**: `sizeof *numbers` is the size of *one* element (an `int`). Writing it this way, instead of `sizeof(int)`, avoids mistakes if you later change the pointer's type: the size adjusts by itself.
- **There is no need to cast the result.** `void *` converts implicitly to any object pointer. Writing `(int *)malloc(...)` is required in C++, not in C.
- **Always check for `NULL`.** If the allocation fails and you use the pointer anyway, it is undefined behavior.
- **The index is a `size_t`**, the same type used for sizes.

Once you have the pointer, the block is used like an array: `numbers[i]` is the same as `*(numbers + i)`.

### Beware of overflow when multiplying

If `n` comes from the user and is huge, `n * sizeof *numbers` can overflow `size_t` and produce a small number: `malloc` would allocate less than you think. When the size is not under your control, check it first:

```c
#include <stdint.h>
#include <stdlib.h>

int *allocate_ints(size_t n) {
    if (n == 0 || n > SIZE_MAX / sizeof(int)) {
        return NULL;               // invalid size or the product would overflow
    }
    return malloc(n * sizeof(int));
}
```

> **Portability:** `malloc(0)` is allowed, but the result is implementation-defined: it may return `NULL` or a unique pointer that must not be dereferenced. Avoid requesting zero bytes.

## `free`: giving the block back

`free(p)` returns the block `p` points to. After `free`, the block is dead: `p` still holds the address, but it is a **dangling pointer**, just like the ones in the previous lesson.

Two practical rules:

1. **Set the pointer to `NULL` after freeing** when the pointer is still in use (a variable that lives longer, a structure member). A later use then fails predictably on a `NULL` check instead of reading dead memory.
2. **`free(NULL)` does nothing.** The standard guarantees it, so there is no need to write `if (p != NULL) free(p);`.

```c
free(numbers);
numbers = NULL;    // no longer points to a dead block
free(numbers);     // free(NULL): does nothing, not an error
```

Only pass to `free` a pointer that came from `malloc`, `calloc` or `realloc` (or `NULL`), and free each block **exactly once**. The next lesson studies what happens when you do not.

> **Basic C:** the null pointer is written `NULL`.

> **Modern C (C23):** there is also the constant `nullptr`, of type `nullptr_t`, which is always a null pointer and never an integer. `p = nullptr;` is equivalent to `p = NULL;`.

> **Portability:** `nullptr` requires a compiler with C23 support; `NULL` works in every version. This course keeps using `NULL`.

## `calloc`: allocating and zeroing

`calloc(count, size)` allocates room for `count` elements of `size` bytes each and sets **every byte to zero**.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t days = 7;
    int *sales = calloc(days, sizeof *sales);
    if (sales == NULL) {
        fprintf(stderr, "Not enough memory\n");
        return 1;
    }

    sales[2] = 15;                 // the rest is already 0
    for (size_t i = 0; i < days; i++) {
        printf("Day %zu: %d\n", i + 1, sales[i]);
    }

    free(sales);
    return 0;
}
```

Advantages over `malloc`:

- **Initialized contents:** every byte is zero. For integers that is the value `0`.
- **Safe multiplication:** `calloc` must check that `count × size` does not overflow; if it would, it returns `NULL`. That makes it the natural choice when the count comes from outside.

Use `malloc` when you are about to write every element right away, and `calloc` when you need to start from zero or the count is not under your control.

## `realloc`: resizing a block

`realloc(p, new_size)` changes the size of block `p`. It may grow it in place or move the data to a new block and free the old one; that is why it **returns the address you must use from now on**. The data already there (up to the smaller of the two sizes) is kept.

If it fails, it returns `NULL` and **the original block is still alive and unchanged**. That is why you never write `p = realloc(p, ...)` directly: if it fails, you lose the only address of the old block. The safe pattern uses a temporary pointer:

```c
int *bigger = realloc(numbers, new_capacity * sizeof *numbers);
if (bigger == NULL) {
    // numbers is still valid: decide what to do and free it later
    free(numbers);
    return 1;
}
numbers = bigger;                  // only now is it replaced
```

Also, `realloc(NULL, size)` behaves like `malloc(size)`. That lets you start with a `NULL` pointer and always grow it with the same code.

> **Basic C:** in C17, `realloc(p, 0)` had an implementation-defined result.

> **Modern C (C23):** `realloc` with size zero becomes undefined behavior. To release memory, use `free`.

> **Portability:** do not rely on `realloc(p, 0)` in any version; check that the new size is greater than zero.

## An array that grows

Now let us put it all together. The program reads integers until the user types `0` or the input ends (end of file: Ctrl+D on Linux and macOS, Ctrl+Z and Enter on Windows). It does not know in advance how many numbers will arrive, so it starts with a small capacity and **doubles** it every time it fills up.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t capacity = 4;
    size_t count = 0;
    int *numbers = malloc(capacity * sizeof *numbers);
    if (numbers == NULL) {
        fprintf(stderr, "Not enough memory\n");
        return 1;
    }

    printf("Enter integers (0 to finish):\n");
    int value;
    while (scanf("%d", &value) == 1 && value != 0) {
        if (count == capacity) {
            size_t new_capacity = capacity * 2;
            int *bigger = realloc(numbers, new_capacity * sizeof *numbers);
            if (bigger == NULL) {
                fprintf(stderr, "Could not grow the array\n");
                free(numbers);
                return 1;
            }
            numbers = bigger;
            capacity = new_capacity;
        }
        numbers[count] = value;
        count++;
    }

    long long sum = 0;
    for (size_t i = 0; i < count; i++) {
        sum += numbers[i];
    }
    printf("Read: %zu (capacity %zu), sum: %lld\n", count, capacity, sum);

    free(numbers);
    numbers = NULL;
    return 0;
}
```

With the input `5 8 13 2 7 0` it prints `Read: 5 (capacity 8), sum: 35`: the capacity went from 4 to 8 when the fifth number arrived.

Why double instead of adding 1? Every `realloc` may copy the whole array. Growing one element at a time, reading `n` numbers would cost on the order of `n²` copies; by doubling, the total number of copies stays on the order of `n`. It is the same idea behind the dynamic arrays of almost every language.

Look at the cleanup: there are **two** exit paths with memory allocated (the `realloc` error and the normal end), and both call `free`. If `malloc` fails at the start there is nothing to free.

## Initialization and cleanup in a structure

In a real program it pays to wrap the dynamic array in a structure with functions that keep its rules. Allocation, growth and release then live in a single place:

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    size_t count;
    size_t capacity;
} Vector;

void vector_init(Vector *v) {
    v->data = NULL;                // realloc(NULL, ...) acts like malloc
    v->count = 0;
    v->capacity = 0;
}

bool vector_push(Vector *v, int value) {
    if (v->count == v->capacity) {
        size_t new_capacity = v->capacity == 0 ? 4 : v->capacity * 2;
        int *bigger = realloc(v->data, new_capacity * sizeof *bigger);
        if (bigger == NULL) {
            return false;          // v stays intact and valid
        }
        v->data = bigger;
        v->capacity = new_capacity;
    }
    v->data[v->count] = value;
    v->count++;
    return true;
}

void vector_free(Vector *v) {
    free(v->data);
    v->data = NULL;
    v->count = 0;
    v->capacity = 0;
}

int main(void) {
    Vector v;
    vector_init(&v);
    for (int i = 1; i <= 10; i++) {
        if (!vector_push(&v, i * 3)) {
            fprintf(stderr, "Out of memory\n");
            vector_free(&v);
            return 1;
        }
    }
    printf("%zu elements, the last one is %d\n", v.count, v.data[v.count - 1]);
    vector_free(&v);
    return 0;
}
```

The state of the `Vector` is always consistent: freshly initialized, after a successful push, after a failure and after being freed. `vector_free` leaves the structure as if freshly initialized, so calling it twice is harmless (thanks to `free(NULL)`).

## Summary

| Function | Purpose | On failure |
| --- | --- | --- |
| `malloc(bytes)` | allocate an uninitialized block | returns `NULL` |
| `calloc(count, size)` | allocate zeroed memory, with safe multiplication | returns `NULL` |
| `realloc(p, bytes)` | resize, keeping the data | returns `NULL` and `p` stays valid |
| `free(p)` | release; `free(NULL)` does nothing | (cannot fail) |

- Write sizes as `n * sizeof *p` and store them in `size_t`.
- Check **every** allocation before using it.
- Use a temporary pointer with `realloc`.
- Free **every** block exactly once, on every exit path, and set the pointer to `NULL` if it is still in use.

## Practice exercises

### Exercise 1: find the bugs

This fragment has three problems. Find and fix them.

<!-- c-check: skip -->

```c
int *copy = malloc(n * sizeof(int));
for (size_t i = 0; i <= n; i++) {
    copy[i] = original[i];
}
copy = realloc(copy, 2 * n * sizeof(int));
```

<details><summary>Show solution</summary>

1. It does not check whether `malloc` returned `NULL`.
2. The `for` uses `i <= n`: it writes `copy[n]`, one slot past the block (off-by-one overflow).
3. `copy = realloc(copy, ...)` loses the original block if `realloc` fails.

```c
int *copy = malloc(n * sizeof *copy);
if (copy == NULL) {
    return 1;
}
for (size_t i = 0; i < n; i++) {
    copy[i] = original[i];
}
int *bigger = realloc(copy, 2 * n * sizeof *copy);
if (bigger == NULL) {
    free(copy);
    return 1;
}
copy = bigger;
```

</details>

### Exercise 2: `malloc` or `calloc`

A program counts how many times each value between 0 and `n - 1` appears, where `n` is entered by the user. Which function would you use to allocate the array of counters, and why? Write the allocation.

<details><summary>Show solution</summary>

`calloc`: the counters must start at zero and `n` comes from the user, so the safe multiplication `calloc` performs is welcome.

```c
size_t *counters = calloc(n, sizeof *counters);
if (counters == NULL) {
    fprintf(stderr, "Not enough memory\n");
    return 1;
}
// ... use counters ...
free(counters);
```

</details>

### Exercise 3: dynamic copy of a string

Write `char *duplicate(const char *text)` that allocates exactly the memory needed, copies `text` and returns the new block (or `NULL` on failure). Test it from `main` and free the result.

<details><summary>Show solution</summary>

You must allocate `strlen(text) + 1` bytes: the `+ 1` is for the `'\0'` terminator.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *duplicate(const char *text) {
    size_t length = strlen(text) + 1;
    char *copy = malloc(length);
    if (copy == NULL) {
        return NULL;
    }
    memcpy(copy, text, length);
    return copy;
}

int main(void) {
    char *greeting = duplicate("Hello, memory");
    if (greeting == NULL) {
        return 1;
    }
    printf("%s\n", greeting);
    free(greeting);
    return 0;
}
```

> **Modern C (C23):** the standard library adds `strdup`, which does exactly this. Before C23 it only existed in POSIX.

</details>

### Exercise 4: an array sized by the user

Write a program that asks for a size `n`, allocates an array of `n` `double`, reads `n` values and prints the average. Check the read of `n`, that it is greater than zero, the allocation and the read of every value.

<details><summary>Show solution</summary>

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    printf("Number of values: ");
    if (scanf("%d", &n) != 1 || n <= 0) {
        fprintf(stderr, "Invalid count\n");
        return 1;
    }

    double *values = malloc((size_t)n * sizeof *values);
    if (values == NULL) {
        fprintf(stderr, "Not enough memory\n");
        return 1;
    }

    double sum = 0.0;
    for (int i = 0; i < n; i++) {
        if (scanf("%lf", &values[i]) != 1) {
            fprintf(stderr, "Invalid value\n");
            free(values);
            return 1;
        }
        sum += values[i];
    }
    printf("Average: %.2f\n", sum / n);

    free(values);
    return 0;
}
```

Notice that the read-error path frees the memory too.

</details>

### Exercise 5: shrinking at the end

In the growing-array program, some capacity may be left over once reading ends. Add a step that shrinks the block to the exact size with `realloc`, without losing data if it fails and without requesting size zero.

<details><summary>Show solution</summary>

```c
if (count > 0 && count < capacity) {
    int *fitted = realloc(numbers, count * sizeof *numbers);
    if (fitted != NULL) {
        numbers = fitted;
        capacity = count;
    }
    // on failure the original block is still valid, just larger: not an error
}
```

`count == 0` is avoided because `realloc` with size zero is undefined behavior in C23.

</details>
