---
title: 'Simulated Polymorphism and Inheritance in C'
course: 'c'
slug: 'polimorfismo-y-herencia-simulados-en-c'
order: 44
lang: 'en'
published: true
---

Inheritance and polymorphism are the most famous ideas of OOP, and C has neither. Even so, many large C programs (the Linux kernel, graphics libraries, interpreters) use a technique that **simulates** them: a table of function pointers and a base structure as the first field. In this lesson you build it step by step and, above all, you learn its limits, because here the compiler stops protecting you.

## Objectives

- Understand **polymorphism** as "the same operation, different behavior depending on the real type".
- Build a shape interface with an operation table of function pointers (`area`, `perimeter`, `destroy`).
- Simulate inheritance by embedding a base structure as the first field.
- Explain why casts between the base and the concrete type are delicate.
- Know the limits of simulating inheritance and when to prefer a simpler design.

**Prerequisites:** `punteros-arreglos-y-estructuras` (function pointers), `memoria-dinamica`, `propiedad-y-errores-de-memoria`, `encapsulacion-y-abstraccion-en-c` and `objetos-metodos-y-diseno-basado-en-struct`.

## The problem

You want to keep circles and rectangles in the same array and loop over it asking each shape for its area. In an object-oriented language, each class defines its `area` method and the language picks which one to run based on the object (virtual dispatch). In C you build that mechanism by hand, with three pieces:

1. an **operation table**: a `struct` of function pointers;
2. a **base structure** that points to that table;
3. **concrete types** that embed the base as their first field.

## Piece 1: the operation table

In `punteros-arreglos-y-estructuras` you saw that `double (*f)(double)` declares a function pointer. A `struct` of function pointers describes an **interface**: which operations every shape has, without saying how they are done.

```c
typedef struct Shape Shape;

typedef struct {
    const char *name;
    double (*area)(const Shape *self);
    double (*perimeter)(const Shape *self);
    void (*destroy)(Shape *self);
} ShapeOps;
```

The parentheses in `(*area)` are essential: without them, `double *area(const Shape *)` would declare a function that returns `double *`.

## Piece 2: the base structure

```c
struct Shape {
    const ShapeOps *ops;   /* which operations this object uses */
};
```

Every shape starts with a pointer to its table. To call an operation, you look it up in the object's table:

```c
double shape_area(const Shape *s) {
    return s->ops->area(s);
}
```

That is **dispatch**: `shape_area` does not know whether `s` is a circle or a rectangle; the table knows.

## Piece 3: concrete types with the base as first field

```c
typedef struct {
    Shape base;   /* ALWAYS the first field */
    double radius;
} Circle;
```

Since `base` is the first field, a pointer to a `Circle`, suitably converted, points to its `Shape`, and a pointer to that `Shape`, converted, points to the `Circle`. The C standard guarantees it: a structure has no padding before its first field. That guarantee is all that holds the technique together.

## The complete program

```c
#include <stdio.h>
#include <stdlib.h>

#define PI 3.14159265358979323846

typedef struct Shape Shape;

typedef struct {
    const char *name;
    double (*area)(const Shape *self);
    double (*perimeter)(const Shape *self);
    void (*destroy)(Shape *self);
} ShapeOps;

struct Shape {
    const ShapeOps *ops;
};

/* Dispatch functions: the public interface. */
double shape_area(const Shape *s) { return s->ops->area(s); }
double shape_perimeter(const Shape *s) { return s->ops->perimeter(s); }
const char *shape_name(const Shape *s) { return s->ops->name; }
void shape_destroy(Shape *s) {
    if (s != NULL) {
        s->ops->destroy(s);
    }
}

/* ---- Circle ---- */
typedef struct {
    Shape base;
    double radius;
} Circle;

static double circle_area(const Shape *self) {
    const Circle *c = (const Circle *)self;   /* valid: self points to a Circle */
    return PI * c->radius * c->radius;
}

static double circle_perimeter(const Shape *self) {
    const Circle *c = (const Circle *)self;
    return 2.0 * PI * c->radius;
}

static void circle_destroy(Shape *self) {
    free(self);   /* self is the address of the Circle's block */
}

static const ShapeOps CIRCLE_OPS = {"circle", circle_area, circle_perimeter, circle_destroy};

/* Ownership: the caller frees the result with shape_destroy. */
Shape *circle_create(double radius) {
    if (radius <= 0.0) {
        return NULL;
    }
    Circle *c = malloc(sizeof *c);
    if (c == NULL) {
        return NULL;
    }
    c->base.ops = &CIRCLE_OPS;
    c->radius = radius;
    return &c->base;
}

/* ---- Rectangle ---- */
typedef struct {
    Shape base;
    double width;
    double height;
} Rectangle;

static double rectangle_area(const Shape *self) {
    const Rectangle *r = (const Rectangle *)self;
    return r->width * r->height;
}

static double rectangle_perimeter(const Shape *self) {
    const Rectangle *r = (const Rectangle *)self;
    return 2.0 * (r->width + r->height);
}

static void rectangle_destroy(Shape *self) {
    free(self);
}

static const ShapeOps RECTANGLE_OPS = {"rectangle", rectangle_area, rectangle_perimeter,
                                       rectangle_destroy};

/* Ownership: the caller frees the result with shape_destroy. */
Shape *rectangle_create(double width, double height) {
    if (width <= 0.0 || height <= 0.0) {
        return NULL;
    }
    Rectangle *r = malloc(sizeof *r);
    if (r == NULL) {
        return NULL;
    }
    r->base.ops = &RECTANGLE_OPS;
    r->width = width;
    r->height = height;
    return &r->base;
}

int main(void) {
    Shape *shapes[3] = {circle_create(1.0), rectangle_create(3.0, 2.0), circle_create(2.5)};
    int status = 0;

    for (size_t i = 0; i < 3; i++) {
        if (shapes[i] == NULL) {
            fprintf(stderr, "Could not create shape %zu\n", i);
            status = 1;
            continue;
        }
        printf("%-10s area %7.2f  perimeter %6.2f\n", shape_name(shapes[i]),
               shape_area(shapes[i]), shape_perimeter(shapes[i]));
    }

    for (size_t i = 0; i < 3; i++) {
        shape_destroy(shapes[i]);   /* accepts NULL */
    }
    return status;
}
```

Output:

```text
circle     area    3.14  perimeter   6.28
rectangle  area    6.00  perimeter  10.00
circle     area   19.63  perimeter  15.71
```

Trace what happens in `shape_area(shapes[0])`:

1. `shapes[0]` points to the `base` field of a `Circle`.
2. `s->ops` is `&CIRCLE_OPS`, stored when it was created.
3. `s->ops->area` is `circle_area`, which converts `self` back to `const Circle *` and uses the radius.

The loop in `main` never mentions circles or rectangles: it works only with the `Shape` interface. Adding a triangle does not force you to change it. That is **simulated polymorphism**.

Some design details:

- There is **one table per type** (`static const`), shared by every object of that type; each object only stores a pointer to it.
- The implementations are `static`: outside the file they are reachable only through the table.
- Destruction is dispatched too, because only the concrete type knows what to free. Built with `-fsanitize=address`, the program reports no leaks or invalid accesses.

## Simulated inheritance: embedding a base

Embedding a structure as the first field also works for reusing data, the idea OOP calls inheritance:

```c
struct Person {
    char name[30];
    int age;
};

struct Student {
    struct Person person;   /* first field: a Student "starts" with a Person */
    int id;
};

void person_print(const struct Person *p);
```

With a `struct Student s`, you can call `person_print(&s.person)`, which is the safe form and needs no cast. Writing `person_print((const struct Person *)&s)` also works because `person` is the first field, but it is a cast the compiler does not check.

Note the difference with the composition of the previous lesson: there a `Rectangle` **has** a corner; here we pretend that a `Student` **is** a `Person`. C only understands the first. The second is a convention you maintain.

## Why casts are delicate

In `circle_area`, the cast `(const Circle *)self` is correct **only** if `self` really points to the `base` field of a `Circle`. The compiler cannot check it. These mistakes compile without warnings and produce undefined behavior:

<!-- c-check: skip -->
```c
Shape *s = rectangle_create(3.0, 2.0);
const Circle *c = (const Circle *)s;   /* s does not point to a Circle */
printf("%f\n", c->radius);             /* reads memory with the wrong type */

typedef struct {
    double radius;
    Shape base;    /* the base is NOT the first field */
} BadCircle;       /* converting between BadCircle * and Shape * is no longer valid */

Shape fake = {&CIRCLE_OPS};            /* circle table, but there is no radius */
shape_area(&fake);                     /* circle_area reads a radius that does not exist */
```

In every case the program may print garbage, work "by luck" or crash. AddressSanitizer catches some of them (reads outside the block), but not all.

## The limits of simulating inheritance

This technique is useful, but it has limits that an object-oriented language does not have:

- **No type safety:** casts from base to concrete type are manual; the compiler accepts any cast between pointers.
- **Manual dispatch:** every operation needs its dispatch function, its field in the table and its initialization. Forgetting a table field leaves a null pointer that fails at run time.
- **One practical level of inheritance:** a base inside another base inside a concrete type works, but every level multiplies the casts and the discipline required. Inheriting from two bases at once is not possible this way.
- **Maintenance cost:** adding an operation to the interface forces you to modify every table of every type.
- **Dynamic memory:** each object is usually created with `malloc` and destroyed with its function, with all the ownership responsibilities.
- **Run-time cost:** every call goes through two pointers (`s->ops->area`) and the compiler usually cannot inline it.

## When to prefer something simpler

If the set of types is **closed and small** (you know there will only be circles and rectangles), a tagged union and a `switch` is simpler, faster and easier to read:

```c
enum ShapeKind { SHAPE_CIRCLE, SHAPE_RECTANGLE };

struct SimpleShape {
    enum ShapeKind kind;
    union {
        double radius;
        struct { double width, height; } rect;
    } data;
};

double simple_shape_area(const struct SimpleShape *s) {
    switch (s->kind) {
    case SHAPE_CIRCLE:    return 3.14159265358979323846 * s->data.radius * s->data.radius;
    case SHAPE_RECTANGLE: return s->data.rect.width * s->data.rect.height;
    }
    return 0.0;
}
```

It needs no dynamic memory and no casts, and with `-Wall` the compiler warns if a `switch` over the `enum` misses a case. A practical rule:

- **closed set of types**, operations that change often: tagged union and `switch`;
- **open set of types** (other modules or plugins add new types without touching your code): operation table;
- **a single varying operation**: a single function pointer as a parameter, like the `qsort` comparator.

## Summary

- C has no inheritance or polymorphism; they are simulated with an operation table of function pointers (`(*area)`) and a base structure as first field.
- Dispatch (`s->ops->area(s)`) picks the implementation from the table stored when the object was created.
- Casting between base and concrete type is valid only if the base is the first field and the object really is of that type; the compiler does not check it.
- The limits: no type safety, manual dispatch, costly maintenance, dynamic memory and indirection.
- For closed sets of types, a tagged union and a `switch` is usually better.

## Practice exercises

### Exercise 1: add a triangle

Add a `Triangle` type with three sides (`a`, `b`, `c`) to the shapes program. The area is computed with Heron's formula: with `s = (a + b + c) / 2`, the area is `sqrt(s * (s - a) * (s - b) * (s - c))` (include `<math.h>` and, with GCC, link with `-lm`). `triangle_create` returns `NULL` if the sides do not form a triangle. Which parts of the program did you have to modify?

<details><summary>Show solution</summary>

```c
typedef struct {
    Shape base;
    double a;
    double b;
    double c;
} Triangle;

static double triangle_perimeter(const Shape *self) {
    const Triangle *t = (const Triangle *)self;
    return t->a + t->b + t->c;
}

static double triangle_area(const Shape *self) {
    const Triangle *t = (const Triangle *)self;
    double s = triangle_perimeter(self) / 2.0;
    return sqrt(s * (s - t->a) * (s - t->b) * (s - t->c));
}

static void triangle_destroy(Shape *self) {
    free(self);
}

static const ShapeOps TRIANGLE_OPS = {"triangle", triangle_area, triangle_perimeter,
                                      triangle_destroy};

Shape *triangle_create(double a, double b, double c) {
    if (a <= 0.0 || b <= 0.0 || c <= 0.0 || a + b <= c || a + c <= b || b + c <= a) {
        return NULL;
    }
    Triangle *t = malloc(sizeof *t);
    if (t == NULL) {
        return NULL;
    }
    t->base.ops = &TRIANGLE_OPS;
    t->a = a;
    t->b = b;
    t->c = c;
    return &t->base;
}
```

Only new code was added: the loop in `main`, the dispatch functions and the other types did not change. A triangle with sides 3, 4 and 5 has area 6 and perimeter 12.

</details>

### Exercise 2: find the bug

This type compiles without warnings, but `shape_area` returns absurd values for it. Why?

<!-- c-check: skip -->
```c
typedef struct {
    double side;
    Shape base;
} Square;

static double square_area(const Shape *self) {
    const Square *q = (const Square *)self;
    return q->side * q->side;
}

Shape *square_create(double side) {
    Square *q = malloc(sizeof *q);
    if (q == NULL) {
        return NULL;
    }
    q->base.ops = &SQUARE_OPS;
    q->side = side;
    return &q->base;
}
```

<details><summary>Show solution</summary>

`base` is not the first field. `square_create` returns the address of `q->base`, which comes **after** `side`, so it does not match the address of the `Square`. When `square_area` casts `self` to `const Square *`, the pointer is shifted and `q->side` reads the wrong memory: undefined behavior. Besides, `free(self)` in the destroy function would receive an address that did not come from `malloc`. The fix is to make `Shape base;` the first field.

</details>

### Exercise 3: tagged union and `switch` version

Write a complete program that uses `struct SimpleShape` (a tagged union) to compute the area and perimeter of a circle of radius 1 and a 3 by 2 rectangle, with no dynamic memory.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

#define PI 3.14159265358979323846

enum ShapeKind { SHAPE_CIRCLE, SHAPE_RECTANGLE };

struct SimpleShape {
    enum ShapeKind kind;
    union {
        double radius;
        struct { double width, height; } rect;
    } data;
};

double simple_shape_area(const struct SimpleShape *s) {
    switch (s->kind) {
    case SHAPE_CIRCLE:    return PI * s->data.radius * s->data.radius;
    case SHAPE_RECTANGLE: return s->data.rect.width * s->data.rect.height;
    }
    return 0.0;
}

double simple_shape_perimeter(const struct SimpleShape *s) {
    switch (s->kind) {
    case SHAPE_CIRCLE:    return 2.0 * PI * s->data.radius;
    case SHAPE_RECTANGLE: return 2.0 * (s->data.rect.width + s->data.rect.height);
    }
    return 0.0;
}

int main(void) {
    struct SimpleShape shapes[] = {
        {.kind = SHAPE_CIRCLE, .data.radius = 1.0},
        {.kind = SHAPE_RECTANGLE, .data.rect = {3.0, 2.0}},
    };
    for (size_t i = 0; i < 2; i++) {
        printf("area %.2f perimeter %.2f\n", simple_shape_area(&shapes[i]),
               simple_shape_perimeter(&shapes[i]));
    }
    return 0;
}
```

It prints `area 3.14 perimeter 6.28` and `area 6.00 perimeter 10.00`. Adding a type means touching the `enum`, the union and every `switch`; in exchange, there are no casts and no memory to free.

</details>

### Exercise 4: choose the design

For each case choose an operation table, a tagged union or a single function pointer: (a) a drawing editor with plugins that add new tools; (b) a calculator with four fixed operations; (c) sorting an array of students by different criteria.

<details><summary>Show solution</summary>

(a) Operation table: the set of tools is open and each plugin provides its own table without modifying the editor. (b) A tagged union, or an `enum` with a `switch`: the set is closed and small. (c) A single function pointer: only the comparison varies, as in `qsort`.

</details>
