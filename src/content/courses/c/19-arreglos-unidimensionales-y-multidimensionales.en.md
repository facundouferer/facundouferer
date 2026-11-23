---
title: 'One-Dimensional and Multi-Dimensional Arrays'
course: 'c'
slug: 'arreglos-unidimensionales-y-multidimensionales'
order: 19
lang: 'en'
published: true
---

In the previous lesson you saw why many values need to be kept in order under a single name. In C, the structure that does it is the **array**: a row of elements of the same type, stored next to each other in memory, reached through their **index**. It is the direct-access, static-size structure of the module map.

## Objectives

- Declare and initialize arrays, including `= {0}` and designated initializers.
- Access elements by index, knowing that the first one is `0`.
- Respect the array **bound**, validate indexes and recognize that going outside the array is undefined behavior.
- Compute the number of elements with `sizeof v / sizeof v[0]` and know where it works.
- Declare and traverse two-dimensional arrays such as `int m[3][4]` and understand their row-major layout in memory.
- Pass arrays to functions together with their number of elements.

**Prerequisites:** `manejo-de-estructuras-secuenciales-de-datos` (sequences, capacity), `tipos-de-datos` (`sizeof`, `size_t`, `%zu`), `operadores` (undefined behavior), `sentencia-for`, `modularizacion-subprogramas-y-funciones` and `variables-parametros-y-pasaje` (arguments are passed by value).

## Declaring an array

```c
int grades[5];
```

The declaration has three parts:

- `int` is the type of **each** element. All the elements of an array have the same type.
- `grades` is the name of the array.
- `5` is the number of elements, which is also its **capacity**. It must be a positive integer constant.

It is a good idea to name that number with `#define`, so you write it only once:

```c
#include <stdio.h>

#define COUNT 5

int main(void) {
    int grades[COUNT];

    grades[0] = 8;
    grades[1] = 6;
    grades[2] = 10;
    grades[3] = 7;
    grades[4] = 9;

    printf("First grade: %d\n", grades[0]);
    printf("Last grade: %d\n", grades[COUNT - 1]);
    return 0;
}
```

> **Portability:** C99 allowed arrays whose size is a variable (`int v[n];`, called VLAs). Since C11 they are an **optional** feature that some compilers do not implement, and a large `n` can exhaust memory with no warning. In this course sizes are constants; for sizes known only at run time there is the `memoria-dinamica` lesson.

## Indexes: from 0 to n − 1

Each element is identified by its **index**, which in C starts at `0`:

```text
index:     0    1    2    3    4
grades:  [ 8 ][ 6 ][10 ][ 7 ][ 9 ]
```

The index says **how many elements come before** the one you want: `grades[0]` is the first one because nothing comes before it. So, in an array of `n` elements:

- the first index is `0`;
- the last index is `n - 1`;
- the count (`5`) is **not** a valid index.

Reading and writing an element use the same notation:

```c
int third = grades[2];   /* reads the element at index 2 */
grades[1] = 7;           /* replaces the element at index 1 */
```

## Initializing an array

A local array that is not initialized holds **indeterminate values**: garbage left over in that memory. Reading them before assigning them is a bug. The safest choice is to initialize at declaration:

```c
#include <stdio.h>

int main(void) {
    int full[5] = {10, 20, 30, 40, 50};
    int partial[5] = {10, 20};
    int zeros[5] = {0};
    int designated[5] = {[1] = 7, [4] = 9};

    for (size_t i = 0; i < 5; i++) {
        printf("%2d %2d %2d %2d\n", full[i], partial[i], zeros[i], designated[i]);
    }
    return 0;
}
```

Output:

```text
10 10  0  0
20 20  0  7
30  0  0  0
40  0  0  0
50  0  0  9
```

The rules:

- With a full list, each value goes to its position.
- With a **partial** list, the missing elements are `0`. That is why `= {0}` is the usual way to set everything to zero.
- A **designated initializer** (`[1] = 7`) chooses the position. Elements that are not named are `0`.
- If you leave out the size, the compiler counts the values: `int primes[] = {2, 3, 5, 7};` has 4 elements.

> **Modern C (C23):** C23 accepts an empty list: `int v[5] = {};` sets every element to zero.

> **Portability:** before C23, `= {}` was a GCC and Clang extension, not standard C; with `-std=c17 -Wpedantic` it produces a warning. `= {0}` works in every version.

An array **cannot be assigned** as a whole: if `a` and `b` are arrays, `a = b;` does not compile. You copy element by element, as the next lesson shows.

## The array bound

The valid indexes of `grades` go from `0` to `4`. That is the array's **bound**, and respecting it is your job: **C does not check it**.

```c
int grades[5] = {8, 6, 10, 7, 9};
grades[5] = 4;      /* out of bounds: undefined behavior */
int x = grades[-1];   /* also out of bounds */
```

Accessing outside the array is **undefined behavior** (you saw it in `operadores`): the standard does not say what happens. In practice nothing may show, the value of another variable that was next to it in memory may change, or the program may crash. The first case is the worst: the program "works" until one day it does not. The tools of the `depuracion-y-sanitizers` lesson help detect these accesses.

### Validating indexes

When an index comes from the user or from a computation, validate it **before** using it:

```c
#include <stdio.h>

#define COUNT 5

int main(void) {
    int grades[COUNT] = {8, 6, 10, 7, 9};
    int position;

    printf("Which position do you want to see (0 to %d)? ", COUNT - 1);
    if (scanf("%d", &position) != 1) {
        printf("Invalid input.\n");
        return 1;
    }
    if (position < 0 || position >= COUNT) {
        printf("Position %d is outside the array bound.\n", position);
        return 1;
    }
    printf("grades[%d] = %d\n", position, grades[position]);
    return 0;
}
```

The valid condition is `0 <= position && position < COUNT`. Note the strict `<`: `COUNT` itself is already outside.

## How many elements: `sizeof v / sizeof v[0]`

`sizeof` applied to an array gives its **total size in bytes**. Divided by the size of one element, it gives the number of elements:

```c
#include <stdio.h>

int main(void) {
    double temperatures[] = {21.5, 23.0, 19.8, 25.1, 22.4, 20.0, 18.7};
    size_t count = sizeof temperatures / sizeof temperatures[0];

    printf("Bytes in the array: %zu\n", sizeof temperatures);
    printf("Bytes in one element: %zu\n", sizeof temperatures[0]);
    printf("Number of elements: %zu\n", count);

    for (size_t i = 0; i < count; i++) {
        printf("Day %zu: %.1f\n", i + 1, temperatures[i]);
    }
    return 0;
}
```

The result is a `size_t` (printed with `%zu`), which is why the loop indexes are `size_t` too: two unsigned values of the same type are compared.

This formula **only works where the array is declared**. Inside a function that receives the array as a parameter it gives a different number, as explained next.

## Arrays and functions

A function receives an array with the notation `type name[]` and, always, a second parameter with the number of elements:

```c
#include <stdio.h>

double average(const int v[], size_t n) {
    if (n == 0) {
        return 0.0;
    }
    int sum = 0;
    for (size_t i = 0; i < n; i++) {
        sum += v[i];
    }
    return (double)sum / n;
}

void add_to_all(int v[], size_t n, int amount) {
    for (size_t i = 0; i < n; i++) {
        v[i] += amount;
    }
}

int main(void) {
    int points[] = {8, 6, 10, 7, 9};
    size_t n = sizeof points / sizeof points[0];

    printf("Average: %.2f\n", average(points, n));
    add_to_all(points, n, 1);
    printf("First element after adding: %d\n", points[0]);
    printf("Average: %.2f\n", average(points, n));
    return 0;
}
```

Output:

```text
Average: 8.00
First element after adding: 9
Average: 9.00
```

Three important points:

1. **The function works on the caller's array.** In `variables-parametros-y-pasaje` you saw that C always passes arguments by value: a function that modifies an `int` parameter does not change the original variable. With arrays the elements are not copied; what the function receives lets it reach the original array, which is why `add_to_all` does change `points`. The argument is still passed by value; the `punteros-arreglos-y-estructuras` lesson (26) explains exactly which value is copied.
2. **`const` promises not to modify.** `average` declares `const int v[]`: if it writes `v[i] = 0;` by mistake, the compiler rejects it. Use `const` whenever the function only reads.
3. **The count travels separately.** The function cannot find out how many elements the array has. `sizeof v` inside `average` does **not** give the size of the caller's array (Clang and GCC report a warning). So `n` is computed where the array is declared and passed as an argument.

## Two-dimensional arrays

A **two-dimensional array** (or matrix) arranges data in rows and columns. `int m[3][4]` declares 3 rows of 4 columns: 12 integers in total. Each element needs two indexes, first the row and then the column.

```c
int m[3][4] = {
    {1, 2, 3, 4},
    {5, 6, 7, 8},
    {9, 10, 11, 12},
};
```

```text
          col 0  col 1  col 2  col 3
row 0       1      2      3      4
row 1       5      6      7      8
row 2       9     10     11     12
```

`m[1][2]` is `7`: row 1 (the second one), column 2 (the third one). Bounds apply to each index: rows from `0` to `2`, columns from `0` to `3`.

### Row-major order in memory

`int m[3][4]` is really an array of 3 elements, and each element is a row of 4 `int`. In memory the rows are stored one after another (**row-major** order):

```text
memory: [ 1 ][ 2 ][ 3 ][ 4 ][ 5 ][ 6 ][ 7 ][ 8 ][ 9 ][10 ][11 ][12 ]
        |------ row 0 -----||------ row 1 -----||------ row 2 -----|
```

That is why `sizeof m[0]` is the size of a whole row, and why traversing the matrix row by row (row loop outside, column loop inside) visits memory in order, which is the fastest way.

### Traversing a matrix and passing it to a function

```c
#include <stdio.h>

#define ROWS 3
#define COLUMNS 4

void print_matrix(int m[][COLUMNS], size_t rows) {
    for (size_t r = 0; r < rows; r++) {
        for (size_t c = 0; c < COLUMNS; c++) {
            printf("%4d", m[r][c]);
        }
        printf("\n");
    }
}

int main(void) {
    int m[ROWS][COLUMNS] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12},
    };

    m[1][2] = 70;
    print_matrix(m, ROWS);
    printf("Rows: %zu, columns: %zu\n", sizeof m / sizeof m[0], sizeof m[0] / sizeof m[0][0]);
    return 0;
}
```

When passing a matrix, the number of **columns** must appear in the parameter (`m[][COLUMNS]`): the compiler needs it to know where each row starts in that contiguous memory. The number of rows travels separately, just like the number of elements of an ordinary array.

## Common mistakes

- **Using `<=` in the loop.** `for (size_t i = 0; i <= n; i++)` visits `v[n]`, which is out of bounds. The right condition is `i < n`.
- **Confusing the count with the last index.** In `int v[10]`, the last index is `9`.
- **Reading uninitialized elements.** Initialize with `= {0}` or assign before reading.
- **Computing `sizeof v / sizeof v[0]` inside the function that receives the array.** It does not give the count there; pass it as a parameter.
- **Trying `a = b;` between arrays.** It does not compile; copy element by element.

## Summary

- An array holds a fixed number of elements of the same type, contiguous in memory.
- Indexes go from `0` to `n - 1`. Going past the bound is undefined behavior and C does not check it: validate indexes.
- `= {0}` sets everything to zero; designated initializers choose positions; C23 adds `= {}`.
- `sizeof v / sizeof v[0]` gives the number of elements, but only where the array is declared.
- A function receives the array as `const int v[]` (or `int v[]` if it modifies it) plus a `size_t n`; it works on the caller's array.
- `int m[3][4]` is 3 rows of 4 columns stored row after row.

## Practice exercises

### Exercise 1: predict the initialization

What value does each element of this array have?

```c
int v[6] = {[2] = 5, 1, [0] = 3};
```

<details><summary>Show solution</summary>

```text
v[0] = 3, v[1] = 0, v[2] = 5, v[3] = 1, v[4] = 0, v[5] = 0
```

`[2] = 5` puts the 5 at index 2; the `1` that follows without a designator goes to the next position, 3; `[0] = 3` puts the 3 at the start. The rest are 0.

</details>

### Exercise 2: find the bugs

This program wants to add five numbers, but it has two bugs. Find and fix them.

```c
int numbers[5] = {4, 8, 15, 16, 23};
int sum;
for (int i = 0; i <= 5; i++) {
    sum += numbers[i];
}
```

<details><summary>Show solution</summary>

1. `sum` is not initialized: it starts with an indeterminate value.
2. `i <= 5` visits `numbers[5]`, out of bounds (undefined behavior).

```c
#include <stdio.h>

int main(void) {
    int numbers[5] = {4, 8, 15, 16, 23};
    size_t n = sizeof numbers / sizeof numbers[0];
    int sum = 0;

    for (size_t i = 0; i < n; i++) {
        sum += numbers[i];
    }
    printf("Sum: %d\n", sum);
    return 0;
}
```

</details>

### Exercise 3: look up a day of the week

Write a program that reads the temperatures of 7 days (validating each read) and then asks for a day number from 1 to 7. If the number is outside that range, it prints an error message; otherwise, the temperature of that day. Careful: the user counts from 1 and the array from 0.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

#define DAYS 7

int main(void) {
    double temperatures[DAYS] = {0};

    for (size_t i = 0; i < DAYS; i++) {
        printf("Temperature of day %zu: ", i + 1);
        if (scanf("%lf", &temperatures[i]) != 1) {
            printf("Invalid input.\n");
            return 1;
        }
    }

    int day;
    printf("Which day do you want to look up (1 to %d)? ", DAYS);
    if (scanf("%d", &day) != 1 || day < 1 || day > DAYS) {
        printf("Day out of bounds.\n");
        return 1;
    }
    printf("Day %d had %.1f degrees.\n", day, temperatures[day - 1]);
    return 0;
}
```

Day `day` is at index `day - 1`. The validation is done on the number the user types, before turning it into an index.

</details>

### Exercise 4: sum by rows

Write a function `int row_sum(int m[][4], size_t row)` that returns the sum of one row of an `int m[3][4]` matrix, and a `main` that prints the sum of every row.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

#define ROWS 3
#define COLUMNS 4

int row_sum(int m[][COLUMNS], size_t row) {
    int sum = 0;
    for (size_t c = 0; c < COLUMNS; c++) {
        sum += m[row][c];
    }
    return sum;
}

int main(void) {
    int m[ROWS][COLUMNS] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12},
    };

    for (size_t r = 0; r < ROWS; r++) {
        printf("Row %zu: %d\n", r, row_sum(m, r));
    }
    return 0;
}
```

Output: `Row 0: 10`, `Row 1: 26`, `Row 2: 42`.

</details>
