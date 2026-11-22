---
title: 'Array Operations'
course: 'c'
slug: 'operaciones-con-arreglos'
order: 20
lang: 'en'
published: true
---

Declaring an array is only the first step. Real programs always perform the same operations on it: they **traverse** it to print it or compute something, search for a value, insert and delete elements, copy it or reverse it. In this lesson you write each operation as a reusable **function** that receives the array and its number of elements.

## Objectives

- Traverse an array with `size_t` indexes, forward and backward.
- Compute the sum, average, maximum and minimum, and count elements that meet a condition.
- Search for a value and return its position.
- Insert and delete elements by shifting the others, respecting the capacity.
- Copy and reverse arrays.
- Write each operation as a function `(const int v[], size_t n)`.

**Prerequisites:** `arreglos-unidimensionales-y-multidimensionales` (indexes, bounds, arrays as parameters), `variables-parametros-y-pasaje` (pass by value), `sentencia-for`.

## The shape of the functions

Every operation in this lesson follows the same pattern, which you saw in the previous lesson:

```c
type operation(const int v[], size_t n);
```

- `const int v[]` if the function only **reads** the array; `int v[]` (without `const`) if it **modifies** it. In both cases the function works on the caller's array; the `punteros-arreglos-y-estructuras` lesson (26) explains why.
- `size_t n` is the number of elements **holding valid data**. The function cannot compute it on its own.
- Indexes are `size_t`, the same type as `n`, so unsigned values are compared with unsigned values.

## Traversing an array

To **traverse** is to visit the elements one by one. It is the basis of almost every other operation:

```c
void print_all(const int v[], size_t n) {
    for (size_t i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");
}
```

### Traversing backward with `size_t`

Going from the last element to the first has a trap. This loop looks right and **never ends**:

```c
for (size_t i = n - 1; i >= 0; i--) {   /* WRONG: i >= 0 is always true */
    printf("%d ", v[i]);
}
```

A `size_t` is unsigned: it is never negative. When `i` is `0` and `i--` runs, it becomes the largest possible `size_t`, the condition is still true and the program reads out of bounds. (GCC with `-Wextra` warns that the comparison is always true; Clang only does with `-Wtype-limits`.) Also, if `n` is `0`, `n - 1` is already huge.

The right way is to count from `n` down to `1` and use `i - 1` as the index:

```c
void print_backward(const int v[], size_t n) {
    for (size_t i = n; i > 0; i--) {
        printf("%d ", v[i - 1]);
    }
    printf("\n");
}
```

## Sum and average

```c
int sum(const int v[], size_t n) {
    int total = 0;
    for (size_t i = 0; i < n; i++) {
        total += v[i];
    }
    return total;
}

double average(const int v[], size_t n) {
    if (n == 0) {
        return 0.0;
    }
    return (double)sum(v, n) / n;
}
```

The explicit `(double)` conversion avoids integer division. The `n == 0` case is handled separately so we never divide by zero.

## Maximum and minimum

```c
/* Precondition: n > 0. */
int maximum(const int v[], size_t n) {
    int largest = v[0];
    for (size_t i = 1; i < n; i++) {
        if (v[i] > largest) {
            largest = v[i];
        }
    }
    return largest;
}

/* Precondition: n > 0. Returns the position, not the value. */
size_t position_of_minimum(const int v[], size_t n) {
    size_t pos = 0;
    for (size_t i = 1; i < n; i++) {
        if (v[i] < v[pos]) {
            pos = i;
        }
    }
    return pos;
}
```

Two details:

- The starting value is **the first element**, not `0`. If every number were negative, starting with `0` would give a maximum that is not even in the array.
- An empty array has no maximum. The function states it as a **precondition** in a comment, and the caller checks `n > 0` first.

## Counting

Counting is traversing with a counter that only moves when a condition holds:

```c
size_t count_greater(const int v[], size_t n, int threshold) {
    size_t count = 0;
    for (size_t i = 0; i < n; i++) {
        if (v[i] > threshold) {
            count++;
        }
    }
    return count;
}
```

## Searching for a value

The simplest search checks the positions in order until it finds the value:

```c
/* Returns the position of the first occurrence of value, or n if it is not there. */
size_t find(const int v[], size_t n, int value) {
    for (size_t i = 0; i < n; i++) {
        if (v[i] == value) {
            return i;
        }
    }
    return n;
}
```

Since a `size_t` cannot be `-1`, the function uses `n` to say "not found": it is never a valid position. The caller compares `if (pos < n)`. The `busqueda-en-arreglos` lesson (23) compares this search with faster ones.

## Copying

An array cannot be assigned with `=`; it is copied element by element. The destination must have room for `n` elements:

```c
void copy(int destination[], const int source[], size_t n) {
    for (size_t i = 0; i < n; i++) {
        destination[i] = source[i];
    }
}
```

`source` is `const` (it is only read) and `destination` is not (it is written).

## Reversing

Reversing in place means swapping the first with the last, the second with the second to last, and so on up to the middle:

```c
void reverse(int v[], size_t n) {
    for (size_t i = 0; i < n / 2; i++) {
        int tmp = v[i];
        v[i] = v[n - 1 - i];
        v[n - 1 - i] = tmp;
    }
}
```

The loop only goes up to `n / 2`: if it went on to `n`, it would swap every pair again and the array would end up as it started.

## Inserting by shifting elements

An array has a fixed **capacity** and a **used count** `n` that can be smaller. Inserting at position `pos` forces every element from `pos` to the end to shift one place to the right:

```text
capacity 6, n = 4, insert 99 at position 1

before:         [10][20][30][40][  ][  ]
shift v[3]:     [10][20][30][40][40][  ]
shift v[2]:     [10][20][30][30][40][  ]
shift v[1]:     [10][20][20][30][40][  ]
write v[1]:     [10][99][20][30][40][  ]    n = 5
```

The shift goes **from the end toward `pos`**. The other way around, `v[1]` would overwrite `v[2]` before moving it and data would be lost.

```c
bool insert(int v[], size_t n, size_t capacity, size_t pos, int value) {
    if (n >= capacity || pos > n) {
        return false;
    }
    for (size_t i = n; i > pos; i--) {
        v[i] = v[i - 1];
    }
    v[pos] = value;
    return true;
}
```

The function checks two things before touching the array: that there is room left (`n < capacity`) and that the position is valid (`pos` may be `n`, meaning "at the end", but not more).

Why does it return a `bool` instead of updating `n`? Because `n` arrives **by value**: the function gets a copy, and changing it would not change the caller's variable. So the function reports whether it could insert and the caller updates its count:

```c
if (insert(data, n, CAPACITY, 1, 99)) {
    n++;
}
```

The `punteros-y-direcciones` lesson (25) shows how a function can modify a variable of its caller.

## Deleting by shifting elements

Deleting is the inverse operation: the elements after `pos` shift one place to the left, **from `pos` toward the end**:

```text
n = 5, delete position 1

before:         [10][99][20][30][40]
v[1] = v[2]:    [10][20][20][30][40]
v[2] = v[3]:    [10][20][30][30][40]
v[3] = v[4]:    [10][20][30][40][40]    n = 4 (the last 40 no longer counts)
```

```c
bool delete_at(int v[], size_t n, size_t pos) {
    if (pos >= n) {
        return false;
    }
    for (size_t i = pos; i + 1 < n; i++) {
        v[i] = v[i + 1];
    }
    return true;
}
```

The condition `i + 1 < n` avoids reading `v[n]`. After deleting, the caller does `n--`.

Inserting or deleting at the front of an array of one million elements shifts one million values. That is the drawback of direct access you saw in lesson 18, and the reason the linked lists of module 7 exist.

## Complete program

All the operations together, with their `main`:

```c
#include <stdio.h>

#define CAPACITY 10

void print_all(const int v[], size_t n) {
    for (size_t i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");
}

void print_backward(const int v[], size_t n) {
    for (size_t i = n; i > 0; i--) {
        printf("%d ", v[i - 1]);
    }
    printf("\n");
}

int sum(const int v[], size_t n) {
    int total = 0;
    for (size_t i = 0; i < n; i++) {
        total += v[i];
    }
    return total;
}

double average(const int v[], size_t n) {
    if (n == 0) {
        return 0.0;
    }
    return (double)sum(v, n) / n;
}

int maximum(const int v[], size_t n) {
    int largest = v[0];
    for (size_t i = 1; i < n; i++) {
        if (v[i] > largest) {
            largest = v[i];
        }
    }
    return largest;
}

size_t position_of_minimum(const int v[], size_t n) {
    size_t pos = 0;
    for (size_t i = 1; i < n; i++) {
        if (v[i] < v[pos]) {
            pos = i;
        }
    }
    return pos;
}

size_t count_greater(const int v[], size_t n, int threshold) {
    size_t count = 0;
    for (size_t i = 0; i < n; i++) {
        if (v[i] > threshold) {
            count++;
        }
    }
    return count;
}

size_t find(const int v[], size_t n, int value) {
    for (size_t i = 0; i < n; i++) {
        if (v[i] == value) {
            return i;
        }
    }
    return n;
}

void copy(int destination[], const int source[], size_t n) {
    for (size_t i = 0; i < n; i++) {
        destination[i] = source[i];
    }
}

void reverse(int v[], size_t n) {
    for (size_t i = 0; i < n / 2; i++) {
        int tmp = v[i];
        v[i] = v[n - 1 - i];
        v[n - 1 - i] = tmp;
    }
}

bool insert(int v[], size_t n, size_t capacity, size_t pos, int value) {
    if (n >= capacity || pos > n) {
        return false;
    }
    for (size_t i = n; i > pos; i--) {
        v[i] = v[i - 1];
    }
    v[pos] = value;
    return true;
}

bool delete_at(int v[], size_t n, size_t pos) {
    if (pos >= n) {
        return false;
    }
    for (size_t i = pos; i + 1 < n; i++) {
        v[i] = v[i + 1];
    }
    return true;
}

int main(void) {
    int data[CAPACITY] = {10, 20, 30, 40};
    size_t n = 4;

    printf("Data: ");
    print_all(data, n);
    printf("Backward: ");
    print_backward(data, n);
    printf("Sum: %d, average: %.2f\n", sum(data, n), average(data, n));
    printf("Maximum: %d, position of minimum: %zu\n", maximum(data, n), position_of_minimum(data, n));
    printf("Greater than 15: %zu\n", count_greater(data, n, 15));

    size_t pos = find(data, n, 30);
    if (pos < n) {
        printf("30 is at position %zu\n", pos);
    }

    if (insert(data, n, CAPACITY, 1, 99)) {
        n++;
    }
    printf("After inserting: ");
    print_all(data, n);

    if (delete_at(data, n, 0)) {
        n--;
    }
    printf("After deleting: ");
    print_all(data, n);

    int copied[CAPACITY] = {0};
    copy(copied, data, n);
    reverse(copied, n);
    printf("Reversed copy: ");
    print_all(copied, n);
    printf("Original untouched: ");
    print_all(data, n);
    return 0;
}
```

Output:

```text
Data: 10 20 30 40
Backward: 40 30 20 10
Sum: 100, average: 25.00
Maximum: 40, position of minimum: 0
Greater than 15: 3
30 is at position 2
After inserting: 10 99 20 30 40
After deleting: 99 20 30 40
Reversed copy: 40 30 20 99
Original untouched: 99 20 30 40
```

> **Basic C:** in C17 and earlier, `bool`, `true` and `false` need `#include <stdbool.h>`.

> **Modern C (C23):** they are keywords, which is why the program does not include `<stdbool.h>`.

## Traversing a matrix

The same ideas apply to a two-dimensional array, with two nested loops: rows outside, columns inside.

```c
#include <stdio.h>

#define ROWS 3
#define COLUMNS 4

int column_sum(int m[][COLUMNS], size_t rows, size_t column) {
    int total = 0;
    for (size_t r = 0; r < rows; r++) {
        total += m[r][column];
    }
    return total;
}

int main(void) {
    int sales[ROWS][COLUMNS] = {
        {5, 3, 8, 2},
        {4, 6, 1, 7},
        {9, 0, 3, 5},
    };

    int total = 0;
    for (size_t r = 0; r < ROWS; r++) {
        for (size_t c = 0; c < COLUMNS; c++) {
            total += sales[r][c];
        }
    }
    printf("Total: %d\n", total);

    for (size_t c = 0; c < COLUMNS; c++) {
        printf("Column %zu: %d\n", c, column_sum(sales, ROWS, c));
    }
    return 0;
}
```

To add up a column, the column stays fixed and the row is what advances.

## Common mistakes

- **Traversing backward with `i >= 0` on a `size_t`.** It never ends; use `for (size_t i = n; i > 0; i--)` with `v[i - 1]`.
- **Starting the maximum at `0`.** Start at `v[0]`, and require `n > 0`.
- **Shifting in the wrong direction.** When inserting, from the end toward `pos`; when deleting, from `pos` toward the end.
- **Forgetting to update `n`.** After inserting `n++`, after deleting `n--`.
- **Inserting without checking the capacity.** Writing to `v[capacity]` goes out of bounds.
- **Confusing position and value.** `find` returns where the value is, not what is there.

## Summary

- Traversing is the basis of every operation; indexes are `size_t`.
- Backward traversal uses `i > 0` and `v[i - 1]`.
- Sum, average, maximum, minimum and counting are traversals with an accumulating variable.
- `find` returns the position, or `n` if the value is not there.
- Inserting and deleting shift elements and respect capacity and used count; the function reports the result and the caller updates `n`.
- Copying goes element by element; reversing swaps pairs up to the middle.

## Practice exercises

### Exercise 1: count even numbers

Write `size_t count_even(const int v[], size_t n)` and a `main` that uses it with `{3, 8, 12, 7, 6, 1}`. It must print `Even: 3`.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

size_t count_even(const int v[], size_t n) {
    size_t even = 0;
    for (size_t i = 0; i < n; i++) {
        if (v[i] % 2 == 0) {
            even++;
        }
    }
    return even;
}

int main(void) {
    int numbers[] = {3, 8, 12, 7, 6, 1};
    size_t n = sizeof numbers / sizeof numbers[0];

    printf("Even: %zu\n", count_even(numbers, n));
    return 0;
}
```

</details>

### Exercise 2: trace an insertion

An array of capacity 5 has `n = 3` and holds `[3][5][8][ ][ ]`. Write how it looks after each step of `insert(v, 3, 5, 0, 1)` and the final value of `n` in the caller.

<details><summary>Show solution</summary>

```text
before:         [3][5][8][ ][ ]
v[3] = v[2]:    [3][5][8][8][ ]
v[2] = v[1]:    [3][5][5][8][ ]
v[1] = v[0]:    [3][3][5][8][ ]
v[0] = 1:       [1][3][5][8][ ]
```

The function returns `true` and the caller does `n++`: `n` becomes 4. Inserting at position 0 forces **every** element to shift.

</details>

### Exercise 3: delete every occurrence

Write `size_t delete_all(int v[], size_t n, int value)`, which removes every occurrence of `value` while keeping the order of the others, and returns the new count. Do it in a single traversal. Test it with `{4, 7, 4, 1, 4, 9}` removing `4`.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

size_t delete_all(int v[], size_t n, int value) {
    size_t write = 0;
    for (size_t read = 0; read < n; read++) {
        if (v[read] != value) {
            v[write] = v[read];
            write++;
        }
    }
    return write;
}

int main(void) {
    int data[] = {4, 7, 4, 1, 4, 9};
    size_t n = sizeof data / sizeof data[0];

    n = delete_all(data, n, 4);
    for (size_t i = 0; i < n; i++) {
        printf("%d ", data[i]);
    }
    printf("\n");
    return 0;
}
```

Output: `7 1 9`. There are two indexes: `read` goes through everything and `write` marks where the next kept element goes. Here the function returns the new count and the caller stores it in `n`.

</details>

### Exercise 4: is it a palindrome?

Write `bool is_palindrome(const int v[], size_t n)`, which returns `true` if the array reads the same left to right as right to left (for example `{1, 2, 3, 2, 1}`), without modifying or copying it.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

bool is_palindrome(const int v[], size_t n) {
    for (size_t i = 0; i < n / 2; i++) {
        if (v[i] != v[n - 1 - i]) {
            return false;
        }
    }
    return true;
}

int main(void) {
    int a[] = {1, 2, 3, 2, 1};
    int b[] = {1, 2, 3, 4};

    printf("a: %s\n", is_palindrome(a, sizeof a / sizeof a[0]) ? "palindrome" : "not a palindrome");
    printf("b: %s\n", is_palindrome(b, sizeof b / sizeof b[0]) ? "palindrome" : "not a palindrome");
    return 0;
}
```

It compares the same pairs that `reverse` swaps. An empty or one-element array is a palindrome: the loop does not run.

</details>
