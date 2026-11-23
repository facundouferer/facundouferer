---
title: 'Objects and Operations: Struct-Based Design'
course: 'c'
slug: 'objetos-metodos-y-diseno-basado-en-struct'
description: 'Design cohesive modules by passing a struct pointer as the first parameter, model relationships through struct composition and handle errors explicitly.'
order: 43
lang: 'en'
published: true
---

In an object-oriented language you write `rectangle.scale(2)` and the language passes the object to the method without you seeing it. C has no methods: it has functions. But with one simple convention (the object always goes as the first parameter) you can write modules that read and are used as if they had them. In this lesson you learn that convention, how to build objects out of other objects (composition) and how to report errors without breaking the program.

## Objectives

- Write operations that receive the object pointer as their first parameter and name them with a common prefix.
- Choose between passing a structure by value, by pointer or by pointer to `const`.
- Write getters that are const-correct.
- Build types by **composition** and decide who owns each part.
- Report errors with return codes and output parameters.

**Prerequisites:** `concepto-de-estructuras`, `punteros-arreglos-y-estructuras` (`->`), `memoria-dinamica`, `biblioteca-estandar-y-errores` (return codes) and `encapsulacion-y-abstraccion-en-c`.

## State + behavior

A `struct` represents an entity's **state**:

```c
struct Rectangle {
    double width;
    double height;
};
```

And the functions that operate on it represent its **behavior**:

```c
double rectangle_area(struct Rectangle r) {
    return r.width * r.height;
}
```

In C the operation is not "inside" the structure, but conceptually `rectangle_area` is an operation of `Rectangle`. The `rectangle_` prefix makes it clear and avoids name clashes, because C has no namespaces.

## The object as first parameter

`rectangle_area` receives a **copy** of the rectangle: C always passes arguments by value. For a two-field structure that is fine, but it has two problems: copying large structures is costly, and a function that receives a copy cannot modify the original.

The struct-based design convention is to pass **the object's address as the first parameter**:

```c
void rectangle_scale(struct Rectangle *r, double factor) {
    r->width *= factor;
    r->height *= factor;
}
```

The pointer is also passed by value (the address is copied), but through it the function reaches the original rectangle. That first parameter plays the role of `this` or `self` in other languages, except that here it is explicit. The standard library follows the same idea: `fprintf(file, ...)`, `fgets(buffer, n, file)` and `fclose(file)` receive the `FILE *` they operate on.

## Const-correct getters

An operation that only **reads** the object should receive a pointer to `const`:

```c
double rectangle_area(const struct Rectangle *r) {
    return r->width * r->height;
}
```

You get three things:

- **Documentation:** the signature promises that the function does not modify the object.
- **Checking:** if you write `r->width = 0;` by mistake, the compiler rejects it.
- **Usability:** the getter can be called from another function that only has a `const struct Rectangle *`. If the getter took a non-`const` pointer, that call would not compile without a cast.

The practical rule: **modifiers** receive `T *`; **getters** receive `const T *`.

| Form | When to use it |
| --- | --- |
| `T value` | small structures that are only read (a point, a date) |
| `const T *` | getters on medium or large structures, and on opaque types |
| `T *` | operations that modify the object |

## Composition: objects made of objects

**Composition** means building a type with other types as fields. A rectangle placed on the plane **has** a corner, which is a point:

```c
struct Point {
    double x;
    double y;
};

struct Rectangle {
    struct Point corner;   /* bottom left */
    double width;
    double height;
};
```

Each type keeps its own operations, and the composite type's operations **delegate** to those of its parts:

```c
#include <stdbool.h>
#include <stdio.h>

struct Point {
    double x;
    double y;
};

void point_move(struct Point *p, double dx, double dy) {
    p->x += dx;
    p->y += dy;
}

struct Rectangle {
    struct Point corner;
    double width;
    double height;
};

void rectangle_move(struct Rectangle *r, double dx, double dy) {
    point_move(&r->corner, dx, dy);   /* delegates to the part */
}

bool rectangle_contains(const struct Rectangle *r, struct Point p) {
    return p.x >= r->corner.x && p.x <= r->corner.x + r->width
        && p.y >= r->corner.y && p.y <= r->corner.y + r->height;
}

double rectangle_area(const struct Rectangle *r) {
    return r->width * r->height;
}

int main(void) {
    struct Rectangle r = {.corner = {0.0, 0.0}, .width = 4.0, .height = 2.0};
    struct Point p = {5.0, 1.0};

    printf("Area: %.1f\n", rectangle_area(&r));
    printf("Contains (5, 1): %s\n", rectangle_contains(&r, p) ? "yes" : "no");
    rectangle_move(&r, 2.0, 0.0);
    printf("After moving: %s\n", rectangle_contains(&r, p) ? "yes" : "no");
    return 0;
}
```

Output:

```text
Area: 8.0
Contains (5, 1): no
After moving: yes
```

`&r->corner` is the address of the `corner` field inside `r` (`->` binds tighter than `&`). `rectangle_move` does not repeat the logic of moving a point: it reuses it.

### Composition with dynamic parts: who owns them

When a part lives in dynamic memory, composition implies **ownership**: the containing object owns its parts, creates them in its creation function and frees them in its destruction function. The user of the container never frees the parts on their own.

## Errors with return codes

In `biblioteca-estandar-y-errores` you saw that C functions report errors through their return value (`EOF`, `NULL`, a code). In a struct-based design it pays for every operation that can fail to return a **result code** and deliver its data through an **output parameter**. That way the caller can tell *why* it failed.

This inventory is composed of a dynamic array of products, grows with `realloc` and uses result codes in all its operations:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

enum InvResult {
    INV_OK,
    INV_INVALID_ARGUMENT,
    INV_OUT_OF_MEMORY,
    INV_NOT_FOUND
};

const char *inv_message(enum InvResult r) {
    switch (r) {
    case INV_OK:               return "ok";
    case INV_INVALID_ARGUMENT: return "invalid argument";
    case INV_OUT_OF_MEMORY:    return "out of memory";
    case INV_NOT_FOUND:        return "not found";
    }
    return "unknown result";
}

struct Product {
    char code[16];
    int stock;
};

struct Inventory {
    struct Product *products;   /* the inventory owns this array */
    size_t count;
    size_t capacity;
};

void inventory_init(struct Inventory *inv) {
    inv->products = NULL;
    inv->count = 0;
    inv->capacity = 0;
}

void inventory_release(struct Inventory *inv) {
    free(inv->products);
    inventory_init(inv);   /* left empty and reusable */
}

enum InvResult inventory_add(struct Inventory *inv, const char *code, int stock) {
    if (code == NULL || strlen(code) >= sizeof inv->products[0].code || stock < 0) {
        return INV_INVALID_ARGUMENT;
    }
    if (inv->count == inv->capacity) {
        size_t bigger = inv->capacity == 0 ? 4 : inv->capacity * 2;
        struct Product *more = realloc(inv->products, bigger * sizeof *more);
        if (more == NULL) {
            return INV_OUT_OF_MEMORY;   /* the old array is still intact */
        }
        inv->products = more;
        inv->capacity = bigger;
    }
    struct Product *p = &inv->products[inv->count];
    strcpy(p->code, code);   /* it fits: the length was checked */
    p->stock = stock;
    inv->count++;
    return INV_OK;
}

enum InvResult inventory_stock(const struct Inventory *inv, const char *code, int *stock) {
    for (size_t i = 0; i < inv->count; i++) {
        if (strcmp(inv->products[i].code, code) == 0) {
            *stock = inv->products[i].stock;
            return INV_OK;
        }
    }
    return INV_NOT_FOUND;
}

int main(void) {
    struct Inventory inv;
    inventory_init(&inv);

    const char *codes[] = {"A-100", "B-200", "code-that-is-too-long", "C-300"};
    for (size_t i = 0; i < 4; i++) {
        enum InvResult r = inventory_add(&inv, codes[i], 10 * (int)(i + 1));
        if (r != INV_OK) {
            printf("Could not add %s: %s\n", codes[i], inv_message(r));
        }
    }

    int stock = 0;
    enum InvResult r = inventory_stock(&inv, "C-300", &stock);
    if (r == INV_OK) {
        printf("Stock of C-300: %d\n", stock);
    }
    r = inventory_stock(&inv, "Z-999", &stock);
    printf("Z-999: %s\n", inv_message(r));

    inventory_release(&inv);
    return 0;
}
```

Output:

```text
Could not add code-that-is-too-long: invalid argument
Stock of C-300: 40
Z-999: not found
```

Design details worth noticing:

- **The result goes in the return value, the data in an output parameter** (`int *stock`). A query that may find nothing does not need to invent a special value such as `-1`.
- **No operation leaves the object broken:** if `realloc` fails, the inventory keeps its old array and the caller gets `INV_OUT_OF_MEMORY`.
- **`inv_message` turns the code into text**, like `strerror` does with `errno`.
- **The inventory owns its array:** `main` only calls `inventory_release`, never `free(inv.products)`. Running it with AddressSanitizer (`-fsanitize=address`) reports no leaks or invalid accesses.

Here `Inventory` is visible and lives on `main`'s stack; if you wanted to protect its invariants (for example, `count <= capacity`), you would turn it into an opaque type as in the previous lesson.

## Summary

- In C, an "object's operations" are functions that receive the object pointer as their first parameter and share a prefix (`rectangle_`, `inventory_`).
- C passes that pointer by value; through the copied address the function modifies the original.
- Getters receive `const T *`; modifiers, `T *`; small structures can go by value.
- **Composition** builds types out of other types; the container delegates to its parts' operations and owns its dynamic parts.
- Operations that can fail return a result code and deliver data through output parameters, without leaving the object in an invalid state.

## Practice exercises

### Exercise 1: `const` or not?

Write the correct signature for each operation of a `struct Student` type: (a) query the average; (b) add a grade; (c) print the student; (d) change the name.

<details><summary>Show solution</summary>

```c
double student_average(const struct Student *s);
bool student_add_grade(struct Student *s, int grade);
void student_print(const struct Student *s);
bool student_rename(struct Student *s, const char *name);
```

The getters (a) and (c) only read, so they receive `const struct Student *`. The modifiers (b) and (d) receive a non-`const` pointer and return `bool` because they can reject invalid data. The new name is received as `const char *` because the function does not modify it.

</details>

### Exercise 2: composition with delegation

Define `struct Date { int day, month, year; }` with the getter `date_is_before(const struct Date *a, const struct Date *b)`, and `struct Loan` composed of a checkout date and a return date. Write `loan_is_valid`, delegating to `date_is_before`, and test it.

<details><summary>Show solution</summary>

```c
#include <stdbool.h>
#include <stdio.h>

struct Date {
    int day;
    int month;
    int year;
};

bool date_is_before(const struct Date *a, const struct Date *b) {
    if (a->year != b->year) {
        return a->year < b->year;
    }
    if (a->month != b->month) {
        return a->month < b->month;
    }
    return a->day < b->day;
}

struct Loan {
    struct Date checkout;
    struct Date due;
};

bool loan_is_valid(const struct Loan *l) {
    return date_is_before(&l->checkout, &l->due);
}

int main(void) {
    struct Loan good = {{3, 5, 2026}, {17, 5, 2026}};
    struct Loan bad = {{3, 5, 2026}, {1, 4, 2026}};
    printf("First: %s\n", loan_is_valid(&good) ? "valid" : "invalid");
    printf("Second: %s\n", loan_is_valid(&bad) ? "valid" : "invalid");
    return 0;
}
```

It prints `First: valid` and `Second: invalid`.

</details>

### Exercise 3: removing with result codes

Add to the inventory the operation `enum InvResult inventory_remove(struct Inventory *inv, const char *code, int units)`, which subtracts units from the stock. It must return `INV_INVALID_ARGUMENT` if `units <= 0` or if there is not enough stock, and `INV_NOT_FOUND` if the code does not exist, without modifying the inventory in those cases.

<details><summary>Show solution</summary>

```c
enum InvResult inventory_remove(struct Inventory *inv, const char *code, int units) {
    if (units <= 0) {
        return INV_INVALID_ARGUMENT;
    }
    for (size_t i = 0; i < inv->count; i++) {
        struct Product *p = &inv->products[i];
        if (strcmp(p->code, code) == 0) {
            if (units > p->stock) {
                return INV_INVALID_ARGUMENT;
            }
            p->stock -= units;
            return INV_OK;
        }
    }
    return INV_NOT_FOUND;
}
```

Every check happens **before** anything is modified, so an error never leaves the stock half-updated.

</details>

### Exercise 4: by value or by pointer?

A classmate wrote `void rectangle_scale(struct Rectangle r, double factor)` and complains that the rectangle in `main` does not change. Explain why and fix it.

<details><summary>Show solution</summary>

C passes arguments by value: `r` is a copy of the rectangle in `main`. Scaling the copy does not affect the original, and the copy ceases to exist when the function returns. The fix is to receive the address:

```c
void rectangle_scale(struct Rectangle *r, double factor) {
    r->width *= factor;
    r->height *= factor;
}
```

and call it with `rectangle_scale(&rect, 2.0);`.

</details>
