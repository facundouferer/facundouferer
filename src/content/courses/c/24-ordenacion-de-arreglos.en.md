---
title: 'Sorting Arrays'
course: 'c'
slug: 'ordenacion-de-arreglos'
order: 24
lang: 'en'
published: true
---

Sorting data is not about looks. A sorted array lets you use binary search (previous lesson), find the minimum and the maximum at its ends, detect duplicates because they end up next to each other and show listings a person can read.

In this lesson we study the three classic methods to start with: **bubble**, **selection** and **insertion** sort. All three are short and easy to follow by hand, and they help us learn how to compare algorithms: how many comparisons they make, how much extra memory they use and whether they keep equal elements in their original order.

> Key idea: all three methods are `O(n²)` in the worst case, but they are not the same. Bubble sort (with early exit) and insertion sort finish quickly when the array is already almost sorted; selection sort always does the same work, but very few swaps.

## Objectives

- Swap two elements of an array with an auxiliary variable.
- Implement and trace bubble, selection and insertion sort.
- Compute the time complexity of each method (`O(n²)`, and `O(n)` in the best case where it applies) and its space complexity.
- Explain what a **stable** sort is and why it matters.
- Sort arrays of structures by a field.
- Choose a method depending on the data.

**Prerequisites:** [The for statement](/en/courses/c/sentencia-for), [Variables, parameters and passing](/en/courses/c/variables-parametros-y-pasaje), [Arrays](/en/courses/c/arreglos-unidimensionales-y-multidimensionales), [Strings](/en/courses/c/cadenas-de-caracteres-y-operaciones) (`strcmp`), [Structures](/en/courses/c/concepto-de-estructuras) and [Searching in arrays](/en/courses/c/busqueda-en-arreglos) (complexity).

## The swap

All three methods move elements around. The basic operation is to **swap** two positions. Picture one glass with juice and another with water: to swap their contents you need a **third, empty glass**. In C, that glass is an auxiliary variable:

```c
int tmp = v[i]; /* keep v[i] in the spare glass */
v[i] = v[j];    /* put v[j] in position i */
v[j] = tmp;     /* put what we kept in position j */
```

If you only write `v[i] = v[j]; v[j] = v[i];`, the first line loses the original value of `v[i]` and you end up with two copies of `v[j]`.

It is worth writing it once as a function. Since it receives the **array**, the function reaches the caller's elements:

```c
void swap(int v[], int i, int j) {
    int tmp = v[i];
    v[i] = v[j];
    v[j] = tmp;
}
```

On the other hand, `void swap(int a, int b)` would **not** work: C passes arguments by value, so the function would receive copies of the two numbers and swap the copies. To swap two standalone variables you need to pass their addresses, which you will see in [Pointers and addresses](/en/courses/c/punteros-y-direcciones) (25).

## 1. Bubble sort

It gets its name because large values "bubble up" towards the end of the array.

**Idea:** walk through the array comparing each pair of **neighbors**. If the left one is greater than the right one, swap them. At the end of the first pass, the largest value is in the last position. The second pass brings the second largest to the second-to-last position, and so on.

**Early exit:** if a whole pass makes no swaps, the array is already sorted and there is no need to continue. A `bool` variable records it.

```c
void bubble_sort(int v[], int n) {
    for (int pass = 0; pass < n - 1; pass++) {
        bool swapped = false;
        /* the last 'pass' elements are already in place */
        for (int j = 0; j < n - 1 - pass; j++) {
            if (v[j] > v[j + 1]) {
                swap(v, j, j + 1);
                swapped = true;
            }
        }
        if (!swapped) {
            break;
        }
    }
}
```

Trace with `{5, 1, 4, 2, 8}`:

| Pass | Array at the end of the pass | Any swaps? |
| --- | --- | --- |
| 1 | `{1, 4, 2, 5, 8}` | yes (the 5 bubbled up to just before the 8) |
| 2 | `{1, 2, 4, 5, 8}` | yes |
| 3 | `{1, 2, 4, 5, 8}` | no: early exit |

**Complexity:**

- **Worst case** (reversed array): pass 1 makes `n - 1` comparisons, pass 2 makes `n - 2`, ..., the last one makes 1. In total `n(n - 1) / 2`, which is `O(n²)`.
- **Best case** (already sorted array): a single pass with no swaps and it stops: `n - 1` comparisons, `O(n)`. Without the `swapped` variable, the best case would also be `O(n²)`.

## 2. Selection sort

**Idea:** the array is split into a sorted part (at the beginning, initially empty) and an unsorted part. At each step, the minimum of the unsorted part is **selected** and swapped with the first position of that part.

```c
void selection_sort(int v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min = i;                     /* assume the minimum is at i */
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[min]) {
                min = j;                 /* found a smaller one */
            }
        }
        swap(v, i, min);                 /* move it to its final place */
    }
}
```

Trace with `{29, 10, 14, 37, 13}`:

| `i` | Minimum of the unsorted part | Array after the swap |
| --- | --- | --- |
| 0 | 10 (position 1) | `{10, 29, 14, 37, 13}` |
| 1 | 13 (position 4) | `{10, 13, 14, 37, 29}` |
| 2 | 14 (position 2) | `{10, 13, 14, 37, 29}` |
| 3 | 29 (position 4) | `{10, 13, 14, 29, 37}` |

**Complexity:**

- It always makes `n(n - 1) / 2` comparisons, whatever the array looks like: it is `O(n²)` in the best, average and worst case. To know which one is the minimum you have to look at the whole unsorted part.
- It makes exactly `n - 1` swaps (one per position). That is its big advantage when moving an element is expensive, for example with large records.

## 3. Insertion sort

It is how many people sort the cards in their hand: you pick up a new card and **insert** it in its place among the cards you already have in order.

**Idea:** the left part `v[0..i-1]` is already sorted. Take `v[i]`, shift every element greater than it one position to the right, and place it in the gap that is left.

```c
void insertion_sort(int v[], int n) {
    for (int i = 1; i < n; i++) {
        int key = v[i];
        int j = i - 1;
        /* shift to the right the elements greater than 'key' */
        while (j >= 0 && v[j] > key) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = key;                  /* insert it in the gap */
    }
}
```

It is the same shifting you used to insert in the middle of an array in the array operations lesson. The condition `j >= 0` comes **first**: thanks to the short-circuit of `&&`, when `j` reaches `-1`, `v[-1]` is not evaluated.

Trace with `{5, 2, 4, 6, 1}`:

| `i` | `key` | Array after inserting |
| --- | --- | --- |
| 1 | 2 | `{2, 5, 4, 6, 1}` |
| 2 | 4 | `{2, 4, 5, 6, 1}` |
| 3 | 6 | `{2, 4, 5, 6, 1}` (nothing shifts) |
| 4 | 1 | `{1, 2, 4, 5, 6}` |

**Complexity:**

- **Worst case** (reversed array): each element shifts all the way to the start: `n(n - 1) / 2` comparisons, `O(n²)`.
- **Best case** (already sorted): each element is compared once with its neighbor and does not move: `n - 1` comparisons, `O(n)`.
- With an **almost** sorted array it is very close to the best case. That is why, in practice, insertion sort is the best of the three for small or nearly sorted arrays.

## The three methods in one program

```c
#include <stdbool.h>
#include <stdio.h>

void swap(int v[], int i, int j) {
    int tmp = v[i];
    v[i] = v[j];
    v[j] = tmp;
}

void bubble_sort(int v[], int n) {
    for (int pass = 0; pass < n - 1; pass++) {
        bool swapped = false;
        for (int j = 0; j < n - 1 - pass; j++) {
            if (v[j] > v[j + 1]) {
                swap(v, j, j + 1);
                swapped = true;
            }
        }
        if (!swapped) {
            break;
        }
    }
}

void selection_sort(int v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[min]) {
                min = j;
            }
        }
        swap(v, i, min);
    }
}

void insertion_sort(int v[], int n) {
    for (int i = 1; i < n; i++) {
        int key = v[i];
        int j = i - 1;
        while (j >= 0 && v[j] > key) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = key;
    }
}

void show(const char title[], const int v[], int n) {
    printf("%-10s", title);
    for (int i = 0; i < n; i++) {
        printf(" %d", v[i]);
    }
    printf("\n");
}

int main(void) {
    int a[] = {29, 10, 14, 37, 13, 5};
    int b[] = {29, 10, 14, 37, 13, 5};
    int c[] = {29, 10, 14, 37, 13, 5};
    int n = (int)(sizeof a / sizeof a[0]);

    show("original:", a, n);
    bubble_sort(a, n);
    selection_sort(b, n);
    insertion_sort(c, n);
    show("bubble:", a, n);
    show("selection:", b, n);
    show("insertion:", c, n);
    return 0;
}
```

Output:

```text
original:  29 10 14 37 13 5
bubble:    5 10 13 14 29 37
selection: 5 10 13 14 29 37
insertion: 5 10 13 14 29 37
```

## Counting comparisons

As with searching, we can check the complexity by counting. If you add a counter to each method's comparison and run them with `n = 100`, you get:

| Method | Already sorted array | Reversed array |
| --- | --- | --- |
| Bubble (with early exit) | 99 | 4950 |
| Selection | 4950 | 4950 |
| Insertion | 99 | 4950 |

`4950` is `100 · 99 / 2`. If you double `n` to 200, the worst case becomes 19,900: **four times** the work for twice the data. That is what `O(n²)` means, and why these methods stop being practical with hundreds of thousands of elements.

## Space complexity

**Space complexity** measures how much **extra** memory the algorithm uses besides the array itself. All three methods sort **in place**: they only use a few variables (`tmp`, `min`, `key`, `j`), regardless of the size of the array. Their space complexity is `O(1)`.

Other, faster algorithms, such as *merge sort*, need an auxiliary array of the same size: `O(n)` extra memory in exchange for `O(n log n)` time.

## Stability

A sort is **stable** if elements with the **same key** keep the relative order they had before sorting.

With plain numbers you cannot tell: one 7 is the same as another 7. But when sorting **records** it matters. Suppose a list of students already sorted alphabetically, which you now sort by grade. With a stable method, students with the same grade stay in alphabetical order among themselves. With an unstable one, that order can be lost.

- **Bubble sort** is stable: it only swaps neighbors when the left one is **strictly greater** (`>`). Two equal elements never cross.
- **Insertion sort** is stable for the same reason: it stops shifting when it finds one that is **equal or smaller** (the condition is `v[j] > key`, not `>=`).
- **Selection sort is not stable**: its long-distance swap can jump over an equal element.

Here is the counterexample for selection sort with records:

```c
#include <stdio.h>

typedef struct {
    char name[20];
    int grade;
} Student;

void selection_sort_by_grade(Student v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j].grade < v[min].grade) {
                min = j;
            }
        }
        Student tmp = v[i];
        v[i] = v[min];
        v[min] = tmp;
    }
}

void insertion_sort_by_grade(Student v[], int n) {
    for (int i = 1; i < n; i++) {
        Student key = v[i];
        int j = i - 1;
        while (j >= 0 && v[j].grade > key.grade) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = key;
    }
}

void show(const char title[], const Student v[], int n) {
    printf("%s", title);
    for (int i = 0; i < n; i++) {
        printf(" %s(%d)", v[i].name, v[i].grade);
    }
    printf("\n");
}

int main(void) {
    Student a[] = {{"Bea", 7}, {"Ana", 7}, {"Ciro", 5}};
    Student b[] = {{"Bea", 7}, {"Ana", 7}, {"Ciro", 5}};
    int n = (int)(sizeof a / sizeof a[0]);

    selection_sort_by_grade(a, n);
    insertion_sort_by_grade(b, n);
    show("selection:", a, n);
    show("insertion:", b, n);
    return 0;
}
```

Output:

```text
selection: Ciro(5) Ana(7) Bea(7)
insertion: Ciro(5) Bea(7) Ana(7)
```

At the start Bea came before Ana, and both have a 7. In the first step, selection sort swaps position 0 (Bea) with the minimum, Ciro, who was at position 2: Bea jumps over Ana. Insertion sort, on the other hand, keeps the original order of the two.

## Sorting arrays of structures by a field

The previous program already shows how an array of structures is sorted. There are only two differences from an array of integers:

1. **The comparison uses a field** (`v[j].grade > key.grade`). To sort by text, use `strcmp`: `strcmp(v[j].name, key.name) > 0` means "comes later in alphabetical order".
2. **Swapping and shifting copy whole records** (`Student tmp = v[i];`). As you saw in the structures lesson, assignment copies every field. With large records each move costs more, and that is where the small number of swaps of selection sort is an advantage.

To sort from largest to smallest, just invert the comparison (`<` instead of `>`), and keep using a strict comparison so you do not lose stability.

## Comparing the three methods

| Method | Best case | Average | Worst case | Swaps | Extra space | Stable |
| --- | --- | --- | --- | --- | --- | --- |
| Bubble (with early exit) | `O(n)` | `O(n²)` | `O(n²)` | many, `O(n²)` | `O(1)` | yes |
| Selection | `O(n²)` | `O(n²)` | `O(n²)` | `n - 1`, `O(n)` | `O(1)` | no |
| Insertion | `O(n)` | `O(n²)` | `O(n²)` | shifts, `O(n²)` | `O(1)` | yes |

Which one should you use?

- **Insertion**: the best general choice of the three for small or nearly sorted arrays. Stable.
- **Selection**: when moving elements is expensive and stability does not matter.
- **Bubble**: mostly for teaching; with early exit it quickly detects an array that is already sorted.

For large arrays there are `O(n log n)` algorithms (such as *merge sort* or *quicksort*). The C standard library ships one ready to use: **`qsort`**, in `<stdlib.h>`, which sorts arrays of any type. Using it requires passing a function that compares two elements, and that needs pointers: you will see it after the lesson [Pointers, arrays and structures](/en/courses/c/punteros-arreglos-y-estructuras) (26). The standard does **not** guarantee that `qsort` is stable.

## Common mistakes

- **Swapping without an auxiliary variable** and losing a value.
- **Going too far**: in bubble sort the inner loop compares `v[j]` with `v[j + 1]`, so it must stop at `j < n - 1 - pass`. With `j < n`, when `j` is `n - 1` it reads `v[n]`, outside the array. (Subtracting `pass` is not needed for a correct result, but it avoids comparing elements that are already in place.)
- **Reversing the order of the condition in insertion sort**: `v[j] > key && j >= 0` evaluates `v[-1]` before checking `j`.
- **Using `>=`** in bubble or insertion sort: the result is still sorted, but the method stops being stable (and bubble sort makes unnecessary swaps).
- **Sorting by one field and using binary search on another.**

## Summary

- A swap needs an auxiliary variable; a function that receives the array can swap its elements.
- Bubble sort compares neighbors; selection sort picks the minimum; insertion sort inserts each element into the already sorted part.
- All three have `O(n²)` time complexity in the worst case; bubble sort with early exit and insertion sort are `O(n)` in the best case.
- All three have `O(1)` space complexity: they sort in place.
- Bubble and insertion sort are stable; selection sort is not.
- To sort structures you compare a field and move whole records.
- `qsort` is the standard tool; you will see it after pointers.

## Practice exercises

### Exercise 1: trace bubble sort

Write down how the array `{4, 3, 2, 1}` looks after each pass of bubble sort with early exit. How many comparisons and swaps does it make in total? Why is this the worst case?

<details><summary>Show solution</summary>

| Pass | Array | Comparisons | Swaps |
| --- | --- | --- | --- |
| 1 | `{3, 2, 1, 4}` | 3 | 3 |
| 2 | `{2, 1, 3, 4}` | 2 | 2 |
| 3 | `{1, 2, 3, 4}` | 1 | 1 |

In total 6 comparisons and 6 swaps, which is `4 · 3 / 2`. It is the worst case because the array is reversed: every comparison finds an out-of-order pair, so every one causes a swap, and the early exit never triggers (after the third pass the loop ends by itself).

</details>

### Exercise 2: check whether an array is sorted

Write `bool is_sorted(const int v[], int n)` that returns `true` if the array is in ascending order. What is its complexity? Use it to check the result of `insertion_sort`.

<details><summary>Show solution</summary>

```c
#include <stdbool.h>
#include <stdio.h>

bool is_sorted(const int v[], int n) {
    for (int i = 1; i < n; i++) {
        if (v[i - 1] > v[i]) {
            return false;
        }
    }
    return true;
}

void insertion_sort(int v[], int n) {
    for (int i = 1; i < n; i++) {
        int key = v[i];
        int j = i - 1;
        while (j >= 0 && v[j] > key) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = key;
    }
}

int main(void) {
    int v[] = {8, 3, 9, 1, 4};
    int n = (int)(sizeof v / sizeof v[0]);

    printf("before: %s\n", is_sorted(v, n) ? "sorted" : "unsorted");
    insertion_sort(v, n);
    printf("after: %s\n", is_sorted(v, n) ? "sorted" : "unsorted");
    return 0;
}
```

Output:

```text
before: unsorted
after: sorted
```

It is `O(n)`: in the worst case it compares each pair of neighbors once. It is much cheaper than sorting, so it is worth using to check your algorithms.

</details>

### Exercise 3: sort products by name

With the type:

```c
typedef struct {
    int code;
    char name[30];
    double price;
} Product;
```

sort an array of products alphabetically by name with insertion sort and print it. Then explain which method you would choose if the records also had a 2000-character description and stability did not matter.

<details><summary>Show solution</summary>

```c
#include <stdio.h>
#include <string.h>

typedef struct {
    int code;
    char name[30];
    double price;
} Product;

void sort_by_name(Product v[], int n) {
    for (int i = 1; i < n; i++) {
        Product key = v[i];
        int j = i - 1;
        while (j >= 0 && strcmp(v[j].name, key.name) > 0) {
            v[j + 1] = v[j];
            j--;
        }
        v[j + 1] = key;
    }
}

int main(void) {
    Product catalog[] = {
        {77, "Coffee", 4800.0},
        {12, "Tea", 2500.0},
        {35, "Sugar", 1200.0},
        {90, "Cocoa", 900.0},
    };
    int n = (int)(sizeof catalog / sizeof catalog[0]);

    sort_by_name(catalog, n);
    for (int i = 0; i < n; i++) {
        printf("%-8s %3d %8.2f\n", catalog[i].name, catalog[i].code, catalog[i].price);
    }
    return 0;
}
```

Output:

```text
Cocoa     90   900.00
Coffee    77  4800.00
Sugar     35  1200.00
Tea       12  2500.00
```

With records of more than 2000 bytes, every shift or swap copies the whole record. Selection sort makes only `n - 1` swaps, against the `O(n²)` shifts of insertion sort in the worst case, so it would be the best of the three if stability did not matter. (With pointers, in lesson 26, you will see another solution: sorting an array of addresses instead of moving the records.)

</details>

### Exercise 4: sort, then search

Write a program that sorts `{42, 7, 19, 3, 25, 11}` with selection sort and then uses binary search to report the position of 19 in the sorted array. Explain why binary search cannot be used before sorting.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

void selection_sort(int v[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int min = i;
        for (int j = i + 1; j < n; j++) {
            if (v[j] < v[min]) {
                min = j;
            }
        }
        int tmp = v[i];
        v[i] = v[min];
        v[min] = tmp;
    }
}

int binary_search(const int v[], int n, int key) {
    int low = 0;
    int high = n - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (v[mid] == key) {
            return mid;
        }
        if (v[mid] < key) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}

int main(void) {
    int v[] = {42, 7, 19, 3, 25, 11};
    int n = (int)(sizeof v / sizeof v[0]);

    selection_sort(v, n);
    printf("19 ended up at position %d\n", binary_search(v, n, 19));
    return 0;
}
```

Output:

```text
19 ended up at position 3
```

The sorted array is `{3, 7, 11, 19, 25, 42}`. Binary search discards one half assuming that everything to the left of the middle is smaller and everything to the right is larger; in the original array that is not true. For example, in `{42, 7, 19, 3, 25, 11}` the first middle is position 2 (the 19) and it would find it by luck, but when searching for 3 it would compare with 19, go left (`{42, 7}`) and answer `-1` even though 3 is at position 3.

</details>
