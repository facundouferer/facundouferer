---
title: 'Array Searching'
course: 'c'
slug: 'busqueda-en-arreglos'
order: 19
lang: 'en'
published: true
---

When working with lots of data, storing it is only half the job. The other half, and perhaps the most important one, is knowing how to **find it** quickly.

In this lesson we'll learn how to search for elements in an array and how the order of data influences the speed of our program.

---

## 1. Linear (or Sequential) Search

Imagine you have a list of names written on a piece of paper without any order. If you're looking for "Juan," you have to start from the first one and check one by one until you find it or reach the end.

### How does it work?
We traverse the array from position `0` to the last one, comparing each element with what we're looking for.

```c
#include <stdio.h>

int main() {
    int numeros[] = {10, 5, 8, 2, 7};
    int n = 5;
    int buscado = 8;
    int posicion = -1; // Using -1 to indicate "not found"

    for (int i = 0; i < n; i++) {
        if (numeros[i] == buscado) {
            posicion = i; // We found it!
            break; // No need to keep searching
        }
    }

    if (posicion != -1) {
        printf("Element found at position %d\n", posicion);
    } else {
        printf("Element not found\n");
    }

    return 0;
}
```

*   **Advantage:** Works for any array, whether sorted or not.
*   **Disadvantage:** Slow for large lists.

---

## 2. Binary Search

**Binary Search** is extremely fast, but it has a fundamental requirement: the array **must be sorted**.

### The Dictionary Analogy
If you look for the word "Programming" in a dictionary, you open the book in the middle:
1.  If the word you see comes "after" the one you're looking for, you discard the entire second half.
2.  If it comes "before," you discard the first half.
3.  You repeat the process with the remaining half until you find it.

### Implementation in C

```c
int busquedaBinaria(int arr[], int n, int buscado) {
    int inicio = 0;
    int fin = n - 1;

    while (inicio <= fin) {
        int medio = inicio + (fin - inicio) / 2;

        if (arr[medio] == buscado) {
            return medio;
        }

        if (arr[medio] < buscado) {
            inicio = medio + 1;
        } else {
            fin = medio - 1;
        }
    }

    return -1; // Not found
}
```

---

## Key Idea

If your data is unsorted, you're forced to use linear search. If you want to use binary search to be more efficient, you first need to go through a **Sorting** process, which we'll see in the next lesson.
