---
title: 'Memory ownership and common errors'
course: 'c'
slug: 'propiedad-y-errores-de-memoria'
description: 'Define clear ownership contracts for who allocates and who frees memory, and catch leaks, double frees and use-after-free bugs with AddressSanitizer.'
order: 29
lang: 'en'
published: true
---

Knowing how to call `malloc` and `free` is not enough. In a program with many functions, the hard question is a different one: **who frees this block, and when?** If nobody frees it, there is a leak; if two parts free it, the program breaks. In this lesson you learn to answer that question with a simple idea, **ownership**, and to recognize and detect the most common memory errors.

## Objectives

- Reason about the **ownership** of every block: who allocates it, who uses it and who frees it.
- Document ownership in the comment of each function.
- Design functions that return memory (`create_...` / `destroy_...` pairs), that borrow it and that transfer its ownership.
- Recognize, with a minimal program, its symptom and its fix: memory leak, double free, use after free, dangling pointers, freeing memory not obtained from `malloc`, off-by-one heap overflow and a lost pointer after `realloc`.
- Detect those errors with AddressSanitizer and read its report.

**Prerequisites:** `duracion-y-ciclo-de-vida` and `memoria-dinamica`.

## Ownership: who allocates, who uses, who frees

C does not keep track of which blocks are still in use: that responsibility is yours. The way not to get lost is to give every block an **owner**.

- The **owner** of a block is the part of the program (a function, a structure, a variable) responsible for freeing it exactly once.
- Others may **borrow** it: read or modify it while the owner keeps it alive, never freeing it.
- Ownership can be **transferred**: the previous owner stops being responsible and the new one becomes responsible.

The golden rule: **at every moment, every block has exactly one owner**. With zero owners, it is a leak. If two parts believe they are the owner, there will be a double free.

The language has no keyword to express this, so ownership is **documented in the comment** of every function that receives or returns memory:

```c
// Returns a new copy of text.
// Ownership: the caller owns the result and must free it with free.
// Returns NULL if out of memory.
char *duplicate(const char *text);

// Prints text on screen.
// Ownership: only borrows text; it neither stores nor frees it.
void show(const char *text);
```

A `const T *` parameter is a good hint of borrowing: the function promises not to modify the object, and freeing it almost never makes sense.

## Functions that return memory: `create_...` and `destroy_...`

When an object has several separately allocated parts, a plain `free` is not enough to release it. The usual pattern is a pair of functions: one that creates and one that destroys. The caller never calls `free` on the object directly, but the matching `destroy_...` function.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char *name;
    int age;
} Person;

// Creates a person with a copy of name.
// Ownership: the caller owns the result and must release it with
// destroy_person. Returns NULL if out of memory.
Person *create_person(const char *name, int age) {
    Person *p = malloc(sizeof *p);
    if (p == NULL) {
        return NULL;
    }
    size_t length = strlen(name) + 1;
    p->name = malloc(length);
    if (p->name == NULL) {
        free(p);                   // undo what was already allocated
        return NULL;
    }
    memcpy(p->name, name, length);
    p->age = age;
    return p;
}

// Frees the person and everything it owns. Accepts NULL.
void destroy_person(Person *p) {
    if (p == NULL) {
        return;
    }
    free(p->name);                 // first the parts...
    free(p);                       // ...then the container
}

// Ownership: only borrows p.
void print_person(const Person *p) {
    printf("%s (%d)\n", p->name, p->age);
}

int main(void) {
    Person *ann = create_person("Ann", 31);
    if (ann == NULL) {
        fprintf(stderr, "Not enough memory\n");
        return 1;
    }
    print_person(ann);             // borrowing
    destroy_person(ann);           // main was the owner: main frees
    ann = NULL;
    return 0;
}
```

Notice three decisions:

1. If the second allocation fails, `create_person` frees the first one before returning `NULL`. A function that fails must not leave memory half-allocated.
2. `destroy_person` frees in the reverse order of creation: first `name` (which belongs to the person) and then the person. If you freed `p` first, reading `p->name` would be a use after free.
3. `destroy_person(NULL)` does nothing, just like `free(NULL)`. That simplifies error paths.

## Transferring ownership

Sometimes a function receives a block and **keeps it**. You must document it precisely, including what happens if the function fails:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define CONTACTS_CAPACITY 8

typedef struct {
    char *name;
    int age;
} Person;

typedef struct {
    Person *people[CONTACTS_CAPACITY];
    size_t count;
} Contacts;

Person *create_person(const char *name, int age) {
    Person *p = malloc(sizeof *p);
    if (p == NULL) {
        return NULL;
    }
    size_t length = strlen(name) + 1;
    p->name = malloc(length);
    if (p->name == NULL) {
        free(p);
        return NULL;
    }
    memcpy(p->name, name, length);
    p->age = age;
    return p;
}

void destroy_person(Person *p) {
    if (p == NULL) {
        return;
    }
    free(p->name);
    free(p);
}

// Adds p to the contacts.
// Ownership: if it returns true, the contacts become the owner of p and the
// caller must not free it. If it returns false, the caller is still the owner.
bool contacts_add(Contacts *c, Person *p) {
    if (c->count == CONTACTS_CAPACITY) {
        return false;
    }
    c->people[c->count] = p;
    c->count++;
    return true;
}

// Frees every person the contacts own.
void contacts_clear(Contacts *c) {
    for (size_t i = 0; i < c->count; i++) {
        destroy_person(c->people[i]);
        c->people[i] = NULL;
    }
    c->count = 0;
}

int main(void) {
    Contacts contacts = { .count = 0 };
    const char *names[] = { "Ann", "Louis", "Martha" };

    for (size_t i = 0; i < 3; i++) {
        Person *p = create_person(names[i], 20 + (int)i);
        if (p == NULL) {
            contacts_clear(&contacts);
            return 1;
        }
        if (!contacts_add(&contacts, p)) {
            destroy_person(p);     // not accepted: it is still ours
        }
        // if it was added, p is no longer ours: we do not free it here
    }

    for (size_t i = 0; i < contacts.count; i++) {
        printf("%s\n", contacts.people[i]->name);
    }
    contacts_clear(&contacts);     // the contacts free what they own
    return 0;
}
```

After a transfer, the pointer the caller keeps (`p`) still points to the block, but it is only a **borrow** now: it may read it while the contacts keep it alive, never free it.

## Common errors

Each error is shown with a minimal program, its symptom and its fix. Several of these programs **compile without warnings**: the compiler cannot track ownership for you. That is why at the end of the lesson you will see how to detect them at run time.

### 1. Memory leak

A **memory leak** happens when the last address of a block is lost without freeing it: the block stays allocated until the program ends.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    for (int i = 0; i < 3; i++) {
        char *line = malloc(32);
        if (line == NULL) {
            return 1;
        }
        snprintf(line, 32, "Line %d", i);
        printf("%s\n", line);
    }                              // line dies here; the block does not
    return 0;
}
```

**Symptom:** nothing visible in a short program. In a server or a program that runs for hours, memory usage keeps growing until the system kills it.

**Fix:** the owner (here, each iteration of the `for`) frees before losing the address: `free(line);` at the end of the block. Other classic leaks are reassigning the pointer (`line = malloc(...)` twice in a row) or leaving through an error path without freeing.

### 2. Double free

A **double free** is calling `free` twice on the same block. It usually happens when two pointers point to the same block and both believe they are the owner.

```c
#include <stdlib.h>

int main(void) {
    int *data = malloc(4 * sizeof *data);
    if (data == NULL) {
        return 1;
    }
    int *alias = data;             // two pointers, one block
    free(data);
    free(alias);                   // ERROR: the block was already freed
    return 0;
}
```

**Symptom:** undefined behavior. Many libraries abort with a message such as `free(): double free detected` or `pointer being freed was not allocated`; others silently corrupt their internal structures and the program fails much later, far from the error.

**Fix:** decide a single owner. Only `data` frees; `alias` is a borrow. Setting `data = NULL;` after `free` helps when the same pointer is freed twice, but it does not protect the aliases.

### 3. Use after free

A **use after free** is reading or writing a block that has already been freed.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *score = malloc(sizeof *score);
    if (score == NULL) {
        return 1;
    }
    *score = 100;
    free(score);
    printf("%d\n", *score);        // ERROR: the block no longer exists
    return 0;
}
```

**Symptom:** sometimes it prints `100`, sometimes garbage, sometimes the program crashes. As you saw in `duracion-y-ciclo-de-vida`, "it works" proves nothing. It is also one of the errors most exploited in security attacks.

**Fix:** use the block before freeing it and set `score = NULL;` after `free`, so a later use fails predictably.

> **Portability:** GCC 12 or later can warn about some simple cases with `-Wuse-after-free` (included in `-Wall`). It is a compiler aid, not a guarantee: most real cases are not detected at compile time.

### 4. Dangling pointers after `free`

A subtler case: a borrow that outlives its owner. Here `name` borrows a block that belongs to the person, and the person is destroyed before it is used.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char *name;
} Person;

int main(void) {
    Person *p = malloc(sizeof *p);
    if (p == NULL) {
        return 1;
    }
    p->name = malloc(4);
    if (p->name == NULL) {
        free(p);
        return 1;
    }
    strcpy(p->name, "Ann");

    char *name = p->name;          // borrow
    free(p->name);
    free(p);                       // the owner goes away
    printf("%s\n", name);          // ERROR: name is dangling
    return 0;
}
```

**Symptom:** the same as a use after free; it is a use after free through another pointer.

**Fix:** a borrow must never outlive its owner. Use `name` before destroying the person, or make your own copy (`duplicate(p->name)`) if you need it afterwards, and free that copy when you are done.

### 5. Freeing memory not obtained from `malloc`

You may only pass to `free` what `malloc`, `calloc` or `realloc` returned (or `NULL`). Freeing a local array, a global variable, a string literal or a pointer into the *middle* of a block is undefined behavior.

<!-- c-check: skip -->

```c
#include <stdlib.h>

int main(void) {
    int values[3] = { 1, 2, 3 };
    free(values);                  // ERROR: values has automatic storage duration
    return 0;
}
```

**Symptom:** in this simple case the compiler catches it: Clang reports `attempt to call free on non-heap object 'values' [-Wfree-nonheap-object]` (with `-Werror`, it does not compile). In less obvious cases, such as `free(p + 1)`, the program usually aborts at run time.

**Fix:** free only what you allocated, and always with the exact address the allocation returned. If a function receives a pointer that may come from anywhere, document that it does *not* free it.

### 6. Off-by-one heap overflow

Allocating one byte less than needed, or looping with `<=` instead of `<`, writes outside the block. The most typical example is forgetting room for the `'\0'` terminator.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    const char *name = "Ann";
    char *copy = malloc(strlen(name));       // ERROR: no room for the '\0'
    if (copy == NULL) {
        return 1;
    }
    strcpy(copy, name);                      // writes 4 bytes into a 3-byte block
    printf("%s\n", copy);
    free(copy);
    return 0;
}
```

**Symptom:** it almost always "works", because the extra byte lands in memory nobody looks at... until it overwrites the heap's internal data and the program fails in a later `malloc` or `free`, somewhere else in the code.

**Fix:** `malloc(strlen(name) + 1)`. For arrays, loop with `i < n` and validate indexes.

### 7. Lost pointer after `realloc`

```c
#include <stdlib.h>

int main(void) {
    size_t capacity = 4;
    int *data = malloc(capacity * sizeof *data);
    if (data == NULL) {
        return 1;
    }
    capacity *= 2;
    data = realloc(data, capacity * sizeof *data);   // ERROR if it fails
    if (data == NULL) {
        return 1;                  // the original block was left without an owner
    }
    free(data);
    return 0;
}
```

**Symptom:** none while `realloc` succeeds. When it fails, it returns `NULL`, the only address of the original block is lost and a leak appears, exactly when memory is scarce.

**Fix:** the safe pattern from the previous lesson, with a temporary pointer:

```c
int *bigger = realloc(data, capacity * sizeof *data);
if (bigger == NULL) {
    free(data);                    // data is still valid: free it
    return 1;
}
data = bigger;
```

## Detecting errors with AddressSanitizer

Since most of these errors compile, you need a tool that looks for them **while the program runs**. **AddressSanitizer** (ASan) adds checks to every memory access and reports the exact moment of the error. You enable it when compiling:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address programa.c -o programa
./programa
```

- `-fsanitize=address` adds the checks.
- `-g` adds debug information, so the report shows file and line.

The program runs slower and uses more memory, so it is used during development and testing, not in the build you ship.

> **Portability:** AddressSanitizer is a GCC and Clang tool, not part of the C standard. It works on Linux, macOS and Windows (with Clang or MSVC), with different levels of support.

### Reading a use-after-free report

With the program of error 3, ASan stops the execution and prints something like this (addresses change on every run):

```
==1572==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000950
READ of size 4 at 0x602000000950 thread T0
    #0 0x0001021988dc in main programa.c:11

0x602000000950 is located 0 bytes inside of 4-byte region [0x602000000950,0x602000000954)
freed by thread T0 here:
    #0 0x000102911368 in free
    #1 0x00010219888c in main programa.c:10

previously allocated by thread T0 here:
    #0 0x000102911274 in malloc
    #1 0x000102198804 in main programa.c:5

SUMMARY: AddressSanitizer: heap-use-after-free programa.c:11 in main
```

Read it from top to bottom; it answers three questions:

1. **What happened:** `heap-use-after-free`, a read (`READ of size 4`) at `programa.c:11`.
2. **When it was freed:** the `freed by thread T0 here` section, with the line of the `free` (10).
3. **Where it was allocated:** the `previously allocated by` section, with the line of the `malloc` (5).

With those three lines you know which block it is, who freed it and who used it afterwards: it is almost always enough to tell which of the two broke the ownership rules.

### Other reports

- **Double free** (error 2): `AddressSanitizer: attempting double-free on 0x...`, followed by where it was freed the first time and where it was allocated.
- **Overflow** (error 6): `AddressSanitizer: heap-buffer-overflow`, `WRITE of size 4` and the phrase `located 0 bytes after 3-byte region`, which says you wrote right past the end of a 3-byte block.
- **Leaks** (error 1): detected by **LeakSanitizer**, which ships with ASan and checks memory when the program ends:

```
==2210==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 96 byte(s) in 3 object(s) allocated from:
    #0 0x7f3a2c4b in malloc
    #1 0x55d1a0e2 in main programa.c:6

SUMMARY: AddressSanitizer: 96 byte(s) leaked in 3 allocation(s).
```

`Direct leak` means blocks whose address nobody holds anymore; the line `programa.c:6` is the `malloc` that was never freed, and `SUMMARY` gives the total.

> **Portability:** LeakSanitizer is not available on every platform. On Linux it is enabled with ASan; on macOS, Apple's Clang does not support it (`detect_leaks is not supported on this platform`). Alternatives: on Linux, `valgrind --leak-check=full ./programa` (no need to recompile with sanitizers); on macOS, the `leaks --atExit -- ./programa` tool that comes with Xcode's developer tools.

A sanitizer only finds errors on the paths that actually run. That is why you should run it with several inputs, including the error cases.

## Summary

- Every block has **exactly one owner** at every moment; everyone else only borrows it.
- Document ownership in the comment of every function that receives or returns memory.
- For objects with parts, use `create_...` / `destroy_...` pairs; `destroy_...` accepts `NULL` and frees in reverse order.
- A function that fails undoes what it allocated; a function that transfers ownership says what happens on failure.
- Classic errors: leak, double free, use after free, dangling borrow, freeing what did not come from `malloc`, off-by-one overflow, `p = realloc(p, ...)`.
- Compile your tests with `-g -fsanitize=address` and learn to read the report.

## Practice exercises

### Exercise 1: find the bug

What memory error does this function have and how do you fix it?

```c
#include <stdlib.h>

// Returns the sum of the first n squares.
long long sum_of_squares(size_t n) {
    long long *squares = malloc(n * sizeof *squares);
    if (squares == NULL) {
        return -1;
    }
    long long sum = 0;
    for (size_t i = 0; i < n; i++) {
        squares[i] = (long long)(i * i);
        sum += squares[i];
    }
    return sum;
}
```

<details><summary>Show solution</summary>

It is a **memory leak**: the function owns `squares` and never frees it. Call `free(squares);` before `return sum;`. Even better: the array is not needed at all, because the sum can be accumulated directly without allocating anything.

</details>

### Exercise 2: who must free?

For each function, state who owns the block when the call ends and who must free it.

1. `char *read_line(void);` — "Returns a new line read from the input."
2. `size_t count_vowels(const char *text);`
3. `bool list_add(List *l, char *text);` — "If it returns true, the list keeps text."

<details><summary>Show solution</summary>

1. The **caller** owns the returned line and must free it with `free` (or the destroy function the documentation names).
2. `count_vowels` only **borrows** `text` (`const char *`); the owner is still whoever passed it.
3. It depends on the result: with `true`, the **list** is the new owner and will free it when cleared; with `false`, the **caller** is still the owner and must free it.

</details>

### Exercise 3: fix the leak on the error path

This function allocates two arrays. What happens if the second allocation fails? Fix it.

<!-- c-check: skip -->

```c
bool prepare(size_t n, int **a, int **b) {
    *a = malloc(n * sizeof **a);
    *b = malloc(n * sizeof **b);
    if (*a == NULL || *b == NULL) {
        return false;
    }
    return true;
}
```

<details><summary>Show solution</summary>

If the first allocation succeeds and the second fails, the function returns `false` and the caller, reading "it failed", does not free `*a`: a leak. A function that fails must undo what it allocated:

```c
bool prepare(size_t n, int **a, int **b) {
    *a = malloc(n * sizeof **a);
    if (*a == NULL) {
        return false;
    }
    *b = malloc(n * sizeof **b);
    if (*b == NULL) {
        free(*a);
        *a = NULL;
        return false;
    }
    return true;
}
```

</details>

### Exercise 4: interpret the report

AddressSanitizer prints this summary. What kind of error is it and what would you look for at lines 14 and 9?

```
ERROR: AddressSanitizer: heap-use-after-free on address 0x6020000000f0
READ of size 8 at 0x6020000000f0 thread T0
    #0 in print_list list.c:14
freed by thread T0 here:
    #1 in remove_node list.c:9
```

<details><summary>Show solution</summary>

It is a **use after free**: at `list.c:14`, `print_list` reads 8 bytes (probably a pointer to the next node) from a block that `remove_node` freed at line 9. Check whether `remove_node` leaves some pointer (for example, the previous node's `next`) pointing to the freed node, or whether the node is freed before its `next` field is read.

</details>

### Exercise 5: write the create/destroy pair

Write `Vector *create_vector(size_t capacity)` and `void destroy_vector(Vector *v)` for `typedef struct { int *data; size_t capacity; } Vector;`. `create_vector` allocates the structure and the array (zeroed) and leaks nothing if something fails; `destroy_vector` accepts `NULL`. Use them from `main`.

<details><summary>Show solution</summary>

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *data;
    size_t capacity;
} Vector;

// Ownership: the caller owns the result and releases it with
// destroy_vector. Returns NULL if out of memory.
Vector *create_vector(size_t capacity) {
    Vector *v = malloc(sizeof *v);
    if (v == NULL) {
        return NULL;
    }
    v->data = calloc(capacity, sizeof *v->data);
    if (v->data == NULL) {
        free(v);
        return NULL;
    }
    v->capacity = capacity;
    return v;
}

void destroy_vector(Vector *v) {
    if (v == NULL) {
        return;
    }
    free(v->data);
    free(v);
}

int main(void) {
    Vector *v = create_vector(10);
    if (v == NULL) {
        return 1;
    }
    v->data[3] = 7;
    printf("%d %d\n", v->data[0], v->data[3]);
    destroy_vector(v);
    return 0;
}
```

</details>
