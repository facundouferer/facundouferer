---
title: 'Structures (struct)'
course: 'c'
slug: 'concepto-de-estructuras'
description: 'Group fields of different types into a record with struct, define enums, unions and typedef aliases, and understand alignment and padding.'
order: 22
lang: 'en'
published: true
---

Arrays work when every value has the same type: five grades, thirty temperatures, a 50-character name. But many real data are not like that. A student has a name (text), a student ID (integer) and an average (real number), and those three values **belong together**: splitting them into three parallel arrays is an invitation to mix them up.

That is what C **structures** are for: a type you define that groups several related values, even when they have different types.

> Key idea: a `struct` is a **record**. You give a name to a set of fields and from then on you treat it as a single thing: you declare it, initialize it, copy it, pass it to functions and store it in arrays.

## Objectives

- Design a `struct` that models a record of the problem.
- Declare, initialize (also with designated initializers) and access fields with `.`.
- Work with arrays of structures.
- Pass structures to functions and return them **by value**, understanding the cost of the copy.
- Give convenient names to types with `typedef`.
- Use `enum` for named constants.
- Recognize what a `union` is, when it is used with a tag field and what its risks are.
- Explain, at an introductory level, why the `sizeof` of a structure can be larger than the sum of its fields (padding).
- Compare structures field by field.

**Prerequisites:** [Data types](/en/courses/c/tipos-de-datos) (`sizeof`, `size_t`), [The switch statement](/en/courses/c/sentencia-switch-y-bloques-de-codigo), [Variables, parameters and passing](/en/courses/c/variables-parametros-y-pasaje) (C always passes arguments by value), [Arrays](/en/courses/c/arreglos-unidimensionales-y-multidimensionales) and [Strings](/en/courses/c/cadenas-de-caracteres-y-operaciones).

## Designing a record

Before writing code, think about what describes an entity of your problem. For a student in a course:

| Data | Type | Why |
| --- | --- | --- |
| id | `int` | an integer that identifies the student |
| name | `char[40]` | text of up to 39 characters plus the `\0` |
| average | `double` | it can have decimals |

That table translates almost literally into C:

```c
struct student {
    int id;
    char name[40];
    double average;
};
```

- `struct student` is the **type name** (the word `student` alone is called the *tag*).
- `id`, `name` and `average` are the **fields** or **members**.
- The definition ends with `;`. Forgetting it produces confusing errors on the next line.

Defining the type does **not** create any variable: it is the blueprint, not the house. Variables are declared afterwards:

```c
struct student a;
struct student b;
```

Each one has its own id, its own name and its own average.

## Initializing and accessing fields with `.`

Fields are used with the dot operator: `variable.field`. Each field behaves exactly like a variable of its type.

```c
#include <stdio.h>
#include <string.h>

struct student {
    int id;
    char name[40];
    double average;
};

int main(void) {
    struct student a = {1021, "Ana Gomez", 8.5};

    struct student b = {
        .id = 1022,
        .name = "Luis Perez",
        .average = 7.25,
    };

    struct student c = {.id = 1023};

    strcpy(c.name, "Marta Diaz");
    c.average = 9.0;
    b.average += 0.5;

    printf("%d %s %.2f\n", a.id, a.name, a.average);
    printf("%d %s %.2f\n", b.id, b.name, b.average);
    printf("%d %s %.2f\n", c.id, c.name, c.average);
    return 0;
}
```

Output:

```text
1021 Ana Gomez 8.50
1022 Luis Perez 7.75
1023 Marta Diaz 9.00
```

There are two ways to initialize:

- **By position** (`a`): the values are assigned in the order the fields were declared. It is short, but if someone reorders the fields of the `struct`, the initializer becomes wrong without anyone noticing.
- **Designated initializers** (`b` and `c`): `.field = value`. Order does not matter and the code explains itself. Fields you do not name are set to **zero** (`0`, `0.0`, empty string). That is why `c` starts with an empty name and an average of `0.0`.

A string field can be initialized with a literal, but afterwards it can **not** be assigned with `=` (it is an array): use `strcpy`, or better a copy that respects the capacity, as you saw in the strings lesson.

> **Basic C:** to set every field to zero, write `struct student a = {0};`.
>
> **Modern C (C23):** C23 accepts the empty initializer `struct student a = {};`, which sets every field to zero, just as with arrays.
>
> **Portability:** `{}` is not valid in C17 with `-Wpedantic`; if your code must compile with `-std=c17`, use `{0}`.

## Assigning a structure copies every field

Unlike arrays, structures **can** be assigned with `=`. The assignment copies field by field, including any arrays inside:

```c
struct student original = {1021, "Ana Gomez", 8.5};
struct student copy = original;

copy.name[0] = 'E';
copy.average = 10.0;
/* original is still "Ana Gomez" with 8.5: copy is another object */
```

After the assignment there are **two** independent records. Changing one does not change the other.

## Arrays of structures

An array of structures is the natural way to store a table: each element is a row and each field is a column.

```c
#include <stdio.h>

struct product {
    int code;
    char name[30];
    double price;
    int stock;
};

int main(void) {
    struct product inventory[] = {
        {.code = 10, .name = "Pencil", .price = 120.0, .stock = 40},
        {.code = 11, .name = "Notebook", .price = 950.0, .stock = 0},
        {.code = 12, .name = "Ruler", .price = 300.0, .stock = 15},
    };
    size_t n = sizeof inventory / sizeof inventory[0];

    double total_value = 0.0;
    for (size_t i = 0; i < n; i++) {
        if (inventory[i].stock == 0) {
            printf("Out of stock: %s\n", inventory[i].name);
        }
        total_value += inventory[i].price * inventory[i].stock;
    }
    printf("Inventory value: %.2f\n", total_value);
    return 0;
}
```

Output:

```text
Out of stock: Notebook
Inventory value: 9300.00
```

Read `inventory[i].stock` from left to right: element `i` of the array, and of that element, the field `stock`. The searching and sorting lessons work exactly with arrays like this one: finding a product by code or sorting students by average.

## Structures and functions: everything by value

A function can receive a structure and can also return one. In both cases the usual rule applies: **C passes arguments by value**. The function receives a **complete copy** of the record.

```c
#include <stdio.h>

struct point {
    double x;
    double y;
};

struct point translate(struct point p, double dx, double dy) {
    p.x += dx; /* changes the local copy */
    p.y += dy;
    return p;  /* returns another copy, with the changes */
}

void show(struct point p) {
    printf("(%.1f, %.1f)\n", p.x, p.y);
}

int main(void) {
    struct point a = {.x = 1.0, .y = 2.0};

    struct point b = translate(a, 3.0, -1.0);
    show(a); /* a did not change */
    show(b);

    a = translate(a, 10.0, 10.0); /* to change a, assign the result */
    show(a);
    return 0;
}
```

Output:

```text
(1.0, 2.0)
(4.0, 1.0)
(11.0, 12.0)
```

Notice the contrast with arrays: a function that receives an array reaches the caller's elements, but a function that receives a structure works on a copy, **even when the structure has an array inside**. If the function must change the caller's record, the pattern in this lesson is to return the modified structure and assign it.

**The cost of the copy.** Copying a `struct point` (two `double` values) is cheap. Copying a record with a 1000-character array on every call is not: every byte is copied, even if the function only reads one field. In the lesson [Pointers, arrays and structures](/en/courses/c/punteros-arreglos-y-estructuras) (26) you will see how to pass the **address** of the structure to avoid the copy (that address is also passed by value).

## `typedef`: a shorter name for the type

Writing `struct student` in every declaration is long. `typedef` creates an **alias** for an existing type:

```c
typedef struct student Student;  /* Student is another name for struct student */

typedef struct {
    double x;
    double y;
} Point;                         /* untagged struct, named only by the alias */

Student best = {.id = 1, .name = "Ana", .average = 9.5};
Point origin = {0};
```

`typedef` does not create a new type: `Student` and `struct student` are exactly the same type. It also works for simple types (`typedef int Grade;`), although structures are where it is used the most. In this course we capitalize the aliases of structures, and they usually live in the `.h` header together with the prototypes that use them (that is why headers have guards, as you saw in the modularization lesson).

> **Basic C:** the `_t` suffix (as in `size_t`) is reserved by POSIX for its types. Avoid it in your own `typedef` names.

## `enum`: named constants

Many fields take one of a few possible values: the status of an order, a day of the week, a color. Using bare numbers (`status == 2`) forces you to remember what each one means. An `enum` gives them names:

```c
#include <stdio.h>

enum status { PENDING, SHIPPED, DELIVERED, CANCELLED };

int main(void) {
    enum status order = SHIPPED;

    switch (order) {
    case PENDING:
        printf("Not sent yet\n");
        break;
    case SHIPPED:
        printf("On its way\n");
        break;
    case DELIVERED:
        printf("Received\n");
        break;
    case CANCELLED:
        printf("Cancelled\n");
        break;
    }
    printf("Numeric value: %d\n", order);
    return 0;
}
```

Output:

```text
On its way
Numeric value: 1
```

- The **enumerators** (`PENDING`, `SHIPPED`, ...) are integer constants: they are `0`, `1`, `2`, ... in order, unless you give them other values (`enum { LOW = 1, MEDIUM = 5, HIGH = 10 };`).
- They are constant expressions, so they work in `case` (something `const int` does not do, as you saw in the `switch` lesson).
- With `-Wall`, if a `switch` on an `enum` does not cover all its values, the compiler warns you. It is a free safety net.
- An `enum` does **not** restrict values: C lets you assign any integer to a variable of type `enum status`. The name documents the intent, it does not guarantee it.

> **Basic C:** the integer type the compiler uses to store an `enum` is chosen by each implementation (usually `int`).
>
> **Modern C (C23):** C23 lets you fix the **underlying type**: `enum color : unsigned char { RED, GREEN, BLUE };` guarantees that `sizeof(enum color)` is 1, which is useful for compact records or binary formats. The compiler rejects an enumerator that does not fit in that type.
>
> **Portability:** a fixed underlying type does not exist in C17; with `-std=c17`, use a plain `unsigned char` and the `enum` constants.

```c
#include <stdio.h>

enum color : unsigned char { RED, GREEN, BLUE };

int main(void) {
    enum color background = GREEN;
    printf("background = %d, size = %zu byte\n", background, sizeof background);
    return 0;
}
```

Output:

```text
background = 1, size = 1 byte
```

An `enum` inside a `struct` is the clear way to model a field with few values:

```c
typedef enum { PENDING, SHIPPED, DELIVERED } Status;

typedef struct {
    int number;
    Status status;
} Order;
```

## `union`: several fields in the same place

A `union` is declared like a `struct`, but its fields **share the same memory**: at any moment it holds **only one** of them. Its size is the size of the largest field (plus padding, if needed).

```c
union number {
    int integer;
    double real;
};
```

It is useful when a value can take **one** of several forms and you do not want to reserve space for all of them. The problem is obvious: the `union` does not remember which field you wrote last. That is why it almost always lives inside a `struct` with a **tag field** (an `enum`) that records it. This is called a *tagged union*:

```c
#include <stdio.h>

typedef enum { INTEGER, REAL } ValueKind;

typedef struct {
    ValueKind kind;          /* the tag: says which field is valid */
    union {
        int integer;
        double real;
    } data;
} Value;

Value make_integer(int x) {
    Value v = {.kind = INTEGER, .data.integer = x};
    return v;
}

Value make_real(double x) {
    Value v = {.kind = REAL, .data.real = x};
    return v;
}

void show(Value v) {
    switch (v.kind) {
    case INTEGER:
        printf("integer: %d\n", v.data.integer);
        break;
    case REAL:
        printf("real: %.3f\n", v.data.real);
        break;
    }
}

int main(void) {
    Value list[] = {make_integer(42), make_real(3.5), make_integer(-7)};
    for (size_t i = 0; i < sizeof list / sizeof list[0]; i++) {
        show(list[i]);
    }
    printf("sizeof(Value) = %zu\n", sizeof(Value));
    return 0;
}
```

Output on a typical 64-bit platform (the last number may vary):

```text
integer: 42
real: 3.500
integer: -7
sizeof(Value) = 16
```

**Risks of `union`:**

- **Reading a field other than the last one written.** If you write `data.integer` and read `data.real`, C reinterprets those bytes as a `double`: the result depends on the platform and is meaningless to the program; if the bytes do not form a valid value of the type, the behavior is undefined. The tag exists to prevent that.
- **Stale tag.** If you change the field but forget to change the tag, the rest of the program reads the wrong field. That is why it is better to create values only through functions such as `make_integer` and `make_real`, which write both together.
- **The saving is usually small.** For ordinary records, a `struct` with every field is simpler and safer. Use `union` when the saving matters or when the value really is "one of several".

## Size and padding

How much space does a structure take? The intuitive answer is "the sum of its fields", but `sizeof` usually gives more:

```c
#include <stdio.h>

struct unordered {
    char initial;
    int age;
    char group;
};

struct ordered {
    int age;
    char initial;
    char group;
};

int main(void) {
    printf("fields: %zu bytes\n", sizeof(char) + sizeof(int) + sizeof(char));
    printf("unordered: %zu bytes\n", sizeof(struct unordered));
    printf("ordered: %zu bytes\n", sizeof(struct ordered));
    return 0;
}
```

Output on a typical platform (with a 4-byte `int`):

```text
fields: 6 bytes
unordered: 12 bytes
ordered: 8 bytes
```

The difference is **padding**: unused bytes the compiler inserts between fields or at the end. Many processors read an `int` faster (or can only read it) when its address is a multiple of 4; that rule is called **alignment**. In `struct unordered`, after `initial` (1 byte) the compiler leaves 3 empty bytes so that `age` is aligned, and at the end it adds 3 more so that, in an array of these structures, the next element also starts aligned.

What you need to know for now:

- The `sizeof` of a `struct` is **at least** the sum of its fields, and it can be larger. Always use `sizeof(type)`, never a sum by hand.
- Fields are stored **in the order you declared them**; the compiler does not reorder them. Ordering them from largest to smallest usually reduces padding.
- Padding depends on the platform. That is why you should not write a whole `struct` to a binary file and expect to read it back the same way on another machine (you will see this in the files lesson).

> **Portability:** some compilers offer extensions such as `__attribute__((packed))` or `#pragma pack` to remove padding. **They are not standard C**: they vary between compilers and can make access slower or invalid on some processors. Do not use them in this course.

## Comparing structures: field by field

Structures can be assigned with `=`, but they can **not** be compared with `==`:

<!-- c-check: skip -->
```c
#include <stdio.h>

struct point {
    int x;
    int y;
};

int main(void) {
    struct point a = {1, 2};
    struct point b = {1, 2};
    if (a == b) { /* error: invalid operands to binary expression */
        printf("equal\n");
    }
    return 0;
}
```

The correct way is to write a function that compares the fields that define equality for **your** problem:

```c
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

typedef struct {
    int id;
    char name[40];
    double average;
} Student;

bool same_student(Student a, Student b) {
    return a.id == b.id && strcmp(a.name, b.name) == 0;
}

int main(void) {
    Student x = {.id = 7, .name = "Ana", .average = 8.0};
    Student y = {.id = 7, .name = "Ana", .average = 9.0};

    printf("%s\n", same_student(x, y) ? "same student" : "different student");
    return 0;
}
```

Output:

```text
same student
```

Notice two decisions:

- The string is compared with `strcmp`, not with `==` (which would compare something else, as you saw in the strings lesson).
- Here the average is **not** part of the student's identity: you decide what "equal" means. Besides, comparing `double` values with `==` is fragile because of rounding.

Comparing the bytes of two whole structures (for example with `memcmp`) is **not** reliable: padding bytes can hold any value, and so can the characters after the `\0` of a string.

## Common mistakes

- **Forgetting the `;` at the end of the `struct` definition.**
- **Assigning a string with `=`**: `a.name = "Ana";` does not compile; use `strcpy` or a safe copy.
- **Expecting a function to change the caller's structure** when it received it by value. Return the structure and assign it.
- **Comparing with `==`** or with `memcmp`. Compare field by field.
- **Adding sizes by hand** instead of using `sizeof`.
- **Reading a `union` field other than the one the tag indicates.**

## Summary

- A `struct` groups fields of different types into a record; fields are accessed with `.`.
- Designated initializers (`.field = value`) are clear and set to zero whatever you do not name.
- Assigning a structure copies all of its fields, including inner arrays.
- Passing or returning a structure copies the whole record: always by value. For large records, lesson 26 shows how to avoid the copy.
- `typedef` gives an alias to a type; it does not create a new type.
- `enum` names integer constants; in C23 its underlying type can be fixed.
- A `union` holds one field at a time; use it with a tag.
- The `sizeof` of a `struct` includes alignment padding.
- Structures are compared field by field.

## Practice exercises

### Exercise 1: design a record

Use `typedef` to define a `Book` type with a title (up to 59 characters), an author (up to 39), a publication year and the number of copies available. Declare an array of three books with designated initializers and show only the ones with copies available.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

typedef struct {
    char title[60];
    char author[40];
    int year;
    int available;
} Book;

int main(void) {
    Book library[] = {
        {.title = "Hopscotch", .author = "Julio Cortazar", .year = 1963, .available = 2},
        {.title = "Ficciones", .author = "Jorge Luis Borges", .year = 1944, .available = 0},
        {.title = "Pedro Paramo", .author = "Juan Rulfo", .year = 1955, .available = 1},
    };
    size_t n = sizeof library / sizeof library[0];

    for (size_t i = 0; i < n; i++) {
        if (library[i].available > 0) {
            printf("%s (%s, %d): %d available\n", library[i].title,
                   library[i].author, library[i].year, library[i].available);
        }
    }
    return 0;
}
```

The sizes are 60 and 40 to leave room for the `\0`.

</details>

### Exercise 2: predict the output

What does this program print? Explain why before running it.

```c
#include <stdio.h>

typedef struct {
    int values[3];
} Box;

void set_zeros(Box b) {
    for (int i = 0; i < 3; i++) {
        b.values[i] = 0;
    }
}

int main(void) {
    Box b = {.values = {4, 5, 6}};
    set_zeros(b);
    printf("%d %d %d\n", b.values[0], b.values[1], b.values[2]);
    return 0;
}
```

<details><summary>Show solution</summary>

It prints `4 5 6`. The function receives a **copy** of the structure, and that copy includes its own `values` array. The zeros are written into the copy, which disappears when `set_zeros` ends. To change `b`, the function should return the modified `Box` and `main` should assign it: `b = set_zeros(b);` with `Box set_zeros(Box b)`.

Compare it with an array passed directly to a function: there the function does reach the caller's elements.

</details>

### Exercise 3: a shape with a tagged `union`

Model a shape that can be a circle (radius) or a rectangle (width and height) with a `struct` that has an `enum` tag and a `union`. Write `double area(Shape s)` and show the area of a circle of radius 1 and of a 3 by 4 rectangle.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

typedef enum { CIRCLE, RECTANGLE } ShapeKind;

typedef struct {
    ShapeKind kind;
    union {
        double radius;
        struct {
            double width;
            double height;
        } rect;
    } size;
} Shape;

double area(Shape s) {
    switch (s.kind) {
    case CIRCLE:
        return 3.14159265358979 * s.size.radius * s.size.radius;
    case RECTANGLE:
        return s.size.rect.width * s.size.rect.height;
    }
    return 0.0;
}

int main(void) {
    Shape c = {.kind = CIRCLE, .size.radius = 1.0};
    Shape r = {.kind = RECTANGLE, .size.rect = {.width = 3.0, .height = 4.0}};

    printf("Circle area: %.2f\n", area(c));
    printf("Rectangle area: %.2f\n", area(r));
    return 0;
}
```

Output:

```text
Circle area: 3.14
Rectangle area: 12.00
```

The final `return 0.0;` covers a tag value that is neither of the two (remember that an `enum` does not restrict values).

</details>

### Exercise 4: reduce the padding

This structure takes 24 bytes on a typical 64-bit platform. Reorder its fields so it takes less space and check the result with `sizeof`.

```c
struct record {
    char active;
    double balance;
    char kind;
    int number;
};
```

<details><summary>Show solution</summary>

```c
#include <stdio.h>

struct record {
    char active;
    double balance;
    char kind;
    int number;
};

struct ordered_record {
    double balance;
    int number;
    char active;
    char kind;
};

int main(void) {
    printf("original: %zu\n", sizeof(struct record));
    printf("ordered: %zu\n", sizeof(struct ordered_record));
    return 0;
}
```

On a typical platform it prints `24` and `16`. Putting the 8-byte field first, then the 4-byte one and the 1-byte ones last leaves only 2 bytes of padding at the end instead of 10 spread around.

</details>
