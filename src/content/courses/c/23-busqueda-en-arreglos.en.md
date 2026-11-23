---
title: 'Searching Data in Arrays'
course: 'c'
slug: 'busqueda-en-arreglos'
description: 'Compare O(n) linear search with O(log n) binary search, their sorting preconditions and the number of comparisons in each case.'
order: 23
lang: 'en'
published: true
---

Storing data is only half the job. The other half, often the more important one, is **finding** it: the student with ID 1042, the product with code 77, the word in a dictionary.

In the array operations lesson you already searched for a value by walking through the array. Here we turn that idea into reusable functions, learn a much faster method for sorted arrays and, above all, learn to **measure** how much work each one does.

> Key idea: linear search always works but, in the worst case, looks at every element. Binary search discards half of the elements at each step, but it requires the array to be **sorted**.

## Objectives

- Write a linear search function that returns the index of the element or `-1`.
- Count the steps of an algorithm and express them with the complexity notation `O(n)` and `O(log n)`.
- Implement binary search on a sorted array, computing the middle without overflow.
- Search for records by a key in arrays of structures.
- Choose the right method depending on the data and the number of searches.

**Prerequisites:** [The while statement](/en/courses/c/sentencia-while), [Modularization, subprograms and functions](/en/courses/c/modularizacion-subprogramas-y-funciones), [Recursion](/en/courses/c/recursividad), [Arrays](/en/courses/c/arreglos-unidimensionales-y-multidimensionales), [Array operations](/en/courses/c/operaciones-con-arreglos), [Strings](/en/courses/c/cadenas-de-caracteres-y-operaciones) (`strcmp`) and [Structures](/en/courses/c/concepto-de-estructuras).

## The contract of a search function

Before writing the algorithm, let us decide what a search function receives and returns:

- It receives the array (read-only, with `const`), the number of elements and the value we are looking for (the **key**).
- It returns the **index** where the key is, or `-1` if it is not there.

Why `-1`? Because no valid index is negative, so `-1` cannot be mistaken for a real position. That is why this lesson uses `int` for indices and counts: we need a signed type to be able to return `-1`. (With `size_t`, which is unsigned, we would need another convention.)

The caller must **always** check the result before using it as an index:

```c
int pos = linear_search(v, n, 42);
if (pos != -1) {
    printf("%d\n", v[pos]); /* safe: pos is a valid index */
}
```

Using `v[pos]` without checking would access `v[-1]`, outside the array: undefined behavior.

## Linear (or sequential) search

Picture a list of names written on a sheet of paper in no particular order. To find "John" there is no shortcut: you start with the first one and look at them one by one until you find it or reach the end.

```c
#include <stdio.h>

int linear_search(const int v[], int n, int key) {
    for (int i = 0; i < n; i++) {
        if (v[i] == key) {
            return i; /* found it: no need to keep going */
        }
    }
    return -1; /* we went through everything and it was not there */
}

int main(void) {
    int numbers[] = {10, 5, 8, 2, 7};
    int n = (int)(sizeof numbers / sizeof numbers[0]);

    int pos = linear_search(numbers, n, 8);
    if (pos != -1) {
        printf("8 is at position %d\n", pos);
    }

    if (linear_search(numbers, n, 4) == -1) {
        printf("4 is not in the array\n");
    }
    return 0;
}
```

Output:

```text
8 is at position 2
4 is not in the array
```

The `return i;` inside the `for` plays the role of the `break` you used in the array operations lesson: it ends the function as soon as it finds the key. If there are repeated elements, it returns the **first** occurrence.

The count is computed with `sizeof` as in the arrays lesson; the `(int)` cast makes explicit that we go from `size_t` to `int`, which is safe because the array is small.

## How long does it take? Counting steps

Measuring in seconds depends on the computer. What we can measure independently is **how many comparisons** the algorithm makes as a function of the number of elements `n`.

For linear search in an array of `n` elements:

| Case | When it happens | Comparisons |
| --- | --- | --- |
| Best case | the key is in `v[0]` | 1 |
| Worst case | the key is at the end or missing | `n` |
| Average case | the key is at a random position | about `n / 2` |

What matters most is the **worst case**, because it is the guarantee: "it never takes longer than this". And in the worst case, if the array has twice as many elements, the search makes twice as many comparisons.

### Complexity notation

That relationship between the size of the input and the work is called the **complexity** of the algorithm, and it is written with *big O* notation:

- **`O(n)`** (linear): the work grows in proportion to `n`. Linear search is `O(n)`.
- **`O(log n)`** (logarithmic): the work grows very slowly; doubling `n` adds **a single step**. This is the complexity of binary search.
- **`O(1)`** (constant): the work does not depend on `n`. Accessing `v[i]` is `O(1)`.

The notation ignores constants: an algorithm that makes `n / 2` comparisons is also `O(n)`. What it describes is **how the work grows** as the data grows, which is what decides whether a program is still usable with a million items.

## Binary search

Binary search is much faster, but it has a requirement: the array **must be sorted**. If it is not, the result is wrong (the program does not crash: it simply gives the wrong answer).

### The dictionary analogy

To look up "program" in a paper dictionary you do not start at the first page. You open it in the middle:

1. If the word you see comes **after** "program", you discard the whole second half.
2. If it comes **before**, you discard the first half.
3. You repeat with the remaining half until you find it or nothing is left.

Every time you look at a page, you discard half of what was left.

### The algorithm

We keep two indices, `low` and `high`, that mark the zone where the key **can still be**. At the start it is the whole array.

```c
#include <stdio.h>

int binary_search(const int v[], int n, int key) {
    int low = 0;
    int high = n - 1;

    while (low <= high) {                 /* while the zone is not empty */
        int mid = low + (high - low) / 2;

        if (v[mid] == key) {
            return mid;
        }
        if (v[mid] < key) {
            low = mid + 1;                 /* the key can only be to the right */
        } else {
            high = mid - 1;                /* the key can only be to the left */
        }
    }
    return -1;                             /* the zone became empty */
}

int main(void) {
    int v[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = (int)(sizeof v / sizeof v[0]);

    printf("23 is at position %d\n", binary_search(v, n, 23));
    printf("40 returns %d\n", binary_search(v, n, 40));
    return 0;
}
```

Output:

```text
23 is at position 5
40 returns -1
```

### Step-by-step trace

Let us search for `23` in `{2, 5, 8, 12, 16, 23, 38, 56, 72, 91}`:

| Step | `low` | `high` | `mid` | `v[mid]` | Decision |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 9 | 4 | 16 | 16 < 23: `low = 5` |
| 2 | 5 | 9 | 7 | 56 | 56 > 23: `high = 6` |
| 3 | 5 | 6 | 5 | 23 | found at 5 |

Three comparisons instead of six. And if we search for `40`:

| Step | `low` | `high` | `mid` | `v[mid]` | Decision |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 9 | 4 | 16 | 16 < 40: `low = 5` |
| 2 | 5 | 9 | 7 | 56 | 56 > 40: `high = 6` |
| 3 | 5 | 6 | 5 | 23 | 23 < 40: `low = 6` |
| 4 | 6 | 6 | 6 | 38 | 38 < 40: `low = 7` |
| 5 | 7 | 6 | | | `low > high`: empty zone, returns `-1` |

The details that make the algorithm correct:

- **`low <= high`, not `<`**: when `low == high` there is still one element to check.
- **`mid + 1` and `mid - 1`**: `v[mid]` was already compared, so it is excluded. If you wrote `low = mid`, in some cases the zone would stop shrinking and the loop would never end.

### The middle without overflow

Why `low + (high - low) / 2` and not the obvious formula `(low + high) / 2`? Mathematically they are the same, but in C the sum `low + high` is computed as an `int`, and if both indices are large the sum can exceed `INT_MAX`. Signed integer overflow is **undefined behavior** (you saw it in the operators lesson).

With a 32-bit `int`, `INT_MAX` is 2,147,483,647. If `low` is 1,500,000,000 and `high` is 2,000,000,000, the sum does not fit in an `int`. In contrast, `high - low` (500,000,000) always fits, and adding half of it to `low` never goes past `high`.

With small arrays you will not notice it, but this bug lived for years in implementations of widely used libraries. Always write the safe form.

### Why it is `O(log n)`

Each comparison halves the zone. Starting with `n` elements, after `k` steps about `n / 2^k` remain. The search ends when one element is left, that is, after about `log₂ n` steps. That is `O(log n)`.

Let us count the worst case of each method:

| Elements `n` | Linear search `O(n)` | Binary search `O(log n)` |
| --- | --- | --- |
| 10 | 10 | 4 |
| 1,000 | 1,000 | 10 |
| 1,000,000 | 1,000,000 | 20 |
| 1,000,000,000 | 1,000,000,000 | 30 |

With a billion items, binary search makes at most 30 comparisons. You can check it by counting steps in a program:

```c
#include <stdio.h>

#define N 1024

int linear_steps(const int v[], int n, int key) {
    int steps = 0;
    for (int i = 0; i < n; i++) {
        steps++;
        if (v[i] == key) {
            break;
        }
    }
    return steps;
}

int binary_steps(const int v[], int n, int key) {
    int steps = 0;
    int low = 0;
    int high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        steps++;
        if (v[mid] == key) {
            break;
        }
        if (v[mid] < key) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return steps;
}

int main(void) {
    int v[N];
    for (int i = 0; i < N; i++) {
        v[i] = 2 * i; /* 0, 2, 4, ...: sorted */
    }

    int key = v[N - 1]; /* the last one: worst case for linear */
    printf("n = %d\n", N);
    printf("linear: %d steps\n", linear_steps(v, N, key));
    printf("binary: %d steps\n", binary_steps(v, N, key));
    return 0;
}
```

Output:

```text
n = 1024
linear: 1024 steps
binary: 11 steps
```

Try changing `N` to 2048: linear doubles its steps and binary adds only one.

## Searching in arrays of structures

In practice we almost never search for a bare number: we search for a **record** by a **key**, such as a student's ID or a product's code. The algorithm is the same; the only change is which field is compared.

```c
#include <stdio.h>
#include <string.h>

typedef struct {
    int id;
    char name[40];
    double average;
} Student;

/* Linear search by name: works even if the array is not sorted. */
int find_by_name(const Student v[], int n, const char name[]) {
    for (int i = 0; i < n; i++) {
        if (strcmp(v[i].name, name) == 0) {
            return i;
        }
    }
    return -1;
}

/* Binary search by id: the array must be sorted by id. */
int find_by_id(const Student v[], int n, int id) {
    int low = 0;
    int high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (v[mid].id == id) {
            return mid;
        }
        if (v[mid].id < id) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}

int main(void) {
    Student course[] = {
        {.id = 1003, .name = "Ana", .average = 8.5},
        {.id = 1010, .name = "Luis", .average = 6.0},
        {.id = 1021, .name = "Marta", .average = 9.25},
        {.id = 1042, .name = "Pedro", .average = 7.5},
    };
    int n = (int)(sizeof course / sizeof course[0]);

    int pos = find_by_id(course, n, 1021);
    if (pos != -1) {
        printf("ID 1021: %s, average %.2f\n", course[pos].name, course[pos].average);
    }

    pos = find_by_name(course, n, "Pedro");
    if (pos != -1) {
        printf("Pedro has ID %d\n", course[pos].id);
    }

    if (find_by_id(course, n, 2000) == -1) {
        printf("No student with ID 2000\n");
    }
    return 0;
}
```

Output:

```text
ID 1021: Marta, average 9.25
Pedro has ID 1042
No student with ID 2000
```

Notice that the array is sorted **by ID**, not by name. Binary search only works with the key the array was sorted by. To search by name in this array you need linear search (or another copy sorted by name).

The function returns the **index**, not the record. That way the caller decides what to do with it: read fields, modify them in the array or simply know whether it exists.

## Which one should you use?

- **Unsorted data and few searches:** linear search. Sorting first costs more than you would save.
- **Many searches on the same data:** sort once (next lesson) and then use binary search. The cost of sorting is spread over all the searches.
- **Data that changes all the time:** keeping the array sorted forces you to shift elements on every insertion (as you saw in array operations). Later you will see structures that handle that case better, such as binary search trees.

The standard library also has a generic binary search, `bsearch` (in `<stdlib.h>`). Using it requires passing a comparison function, so you will see it together with `qsort` after the lesson [Pointers, arrays and structures](/en/courses/c/punteros-arreglos-y-estructuras) (26).

## Common mistakes

- **Using binary search on an unsorted array.** There is no compile error: it simply returns `-1` for elements that are there.
- **Sorting by one field and searching by another.**
- **Using the result without checking for `-1`** (`v[pos]` with `pos == -1` accesses outside the array).
- **`while (low < high)`** instead of `<=`: it skips the last candidate element.
- **`low = mid` or `high = mid`**: the zone may stop shrinking and the loop never ends.
- **`(low + high) / 2`** with large indices: `int` overflow.

## Summary

- A search function returns the index of the key or `-1`; the caller checks the result.
- Linear search works on any array and makes `n` comparisons in the worst case: `O(n)`.
- Binary search requires a sorted array and discards half at each step: `O(log n)`.
- The middle is computed as `low + (high - low) / 2` to avoid overflow.
- In arrays of structures you search by a key field; binary search only works with the key the array was sorted by.
- Complexity describes how the work grows with the size of the data.

## Practice exercises

### Exercise 1: trace binary search

Build the trace table (`low`, `high`, `mid`, `v[mid]`, decision) to search for `72` and then `3` in the array `{2, 5, 8, 12, 16, 23, 38, 56, 72, 91}`. How many comparisons does each search make?

<details><summary>Show solution</summary>

Searching for `72`:

| Step | `low` | `high` | `mid` | `v[mid]` | Decision |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 9 | 4 | 16 | 16 < 72: `low = 5` |
| 2 | 5 | 9 | 7 | 56 | 56 < 72: `low = 8` |
| 3 | 8 | 9 | 8 | 72 | found at 8 |

Three comparisons.

Searching for `3`:

| Step | `low` | `high` | `mid` | `v[mid]` | Decision |
| --- | --- | --- | --- | --- | --- |
| 1 | 0 | 9 | 4 | 16 | 16 > 3: `high = 3` |
| 2 | 0 | 3 | 1 | 5 | 5 > 3: `high = 0` |
| 3 | 0 | 0 | 0 | 2 | 2 < 3: `low = 1` |
| 4 | 1 | 0 | | | empty zone: `-1` |

Three comparisons, and the fourth round only checks that the zone is empty. With 10 elements you never need more than 4 comparisons (`log₂ 10` is a little more than 3).

</details>

### Exercise 2: count occurrences

Write `int count(const int v[], int n, int key)` that returns how many times `key` appears in an unsorted array. What is its complexity? Why can you not stop at the first match here?

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int count(const int v[], int n, int key) {
    int total = 0;
    for (int i = 0; i < n; i++) {
        if (v[i] == key) {
            total++;
        }
    }
    return total;
}

int main(void) {
    int dice[] = {3, 6, 1, 6, 2, 6, 5};
    int n = (int)(sizeof dice / sizeof dice[0]);
    printf("6 came up %d times\n", count(dice, n, 6));
    printf("4 came up %d times\n", count(dice, n, 4));
    return 0;
}
```

Output:

```text
6 came up 3 times
4 came up 0 times
```

It is `O(n)` and it always goes through all `n` elements (there is no shorter best case): an occurrence can be at any position, so you cannot know there are no more without looking at all of them.

</details>

### Exercise 3: find a product by code

With this type:

```c
typedef struct {
    int code;
    char name[30];
    double price;
} Product;
```

write a binary search `int find_product(const Product v[], int n, int code)` for an array sorted by code, and a program that shows the name and price of product 77, or a message if it does not exist.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

typedef struct {
    int code;
    char name[30];
    double price;
} Product;

int find_product(const Product v[], int n, int code) {
    int low = 0;
    int high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (v[mid].code == code) {
            return mid;
        }
        if (v[mid].code < code) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}

int main(void) {
    Product catalog[] = {
        {12, "Tea", 2500.0},
        {35, "Sugar", 1200.0},
        {77, "Coffee", 4800.0},
        {90, "Cocoa", 900.0},
    };
    int n = (int)(sizeof catalog / sizeof catalog[0]);

    int pos = find_product(catalog, n, 77);
    if (pos != -1) {
        printf("%s: %.2f\n", catalog[pos].name, catalog[pos].price);
    } else {
        printf("Product 77 does not exist\n");
    }
    return 0;
}
```

Output:

```text
Coffee: 4800.00
```

</details>

### Exercise 4: recursive binary search

Write a recursive version `int binary_rec(const int v[], int low, int high, int key)`, using what you learned in the recursion lesson. What is the base case? At most how many calls are stacked for an array of 1000 elements?

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int binary_rec(const int v[], int low, int high, int key) {
    if (low > high) {
        return -1; /* base case: empty zone */
    }
    int mid = low + (high - low) / 2;
    if (v[mid] == key) {
        return mid; /* base case: found */
    }
    if (v[mid] < key) {
        return binary_rec(v, mid + 1, high, key);
    }
    return binary_rec(v, low, mid - 1, key);
}

int main(void) {
    int v[] = {1, 4, 9, 16, 25, 36, 49};
    int n = (int)(sizeof v / sizeof v[0]);
    printf("%d\n", binary_rec(v, 0, n - 1, 36));
    printf("%d\n", binary_rec(v, 0, n - 1, 10));
    return 0;
}
```

Output:

```text
5
-1
```

There are two base cases: the empty zone (`low > high`) and the key found. Each recursive call works on half of the zone, so for 1000 elements there are at most about 10 or 11 stacked calls: the recursion depth is also `O(log n)`, which is why this recursion does not put the stack at risk.

</details>
