---
title: 'Array Sorting'
course: 'c'
slug: 'ordenacion-de-arreglos'
order: 20
lang: 'en'
published: true
---

Sorting data isn't just about aesthetics. It's a fundamental tool that allows our programs to process information in a logical and efficient way.

In this lesson we'll learn the three most common sorting methods for beginners.

---

## The Swap Concept

Before looking at the methods, you need to understand how to "swap places" of two numbers in C. Imagine you have a glass with **juice** and another with **water**, and you want to exchange their contents. You need a **third empty glass** (an auxiliary variable).

```c
int aux = a; // We save 'a' in the auxiliary glass
a = b;       // We put 'b' into 'a'
b = aux;     // We put the saved value from aux into 'b'
```

---

## 1. Bubble Sort

It's the most famous one for learning. It's called this because the largest numbers "float" to the end of the array like bubbles.

### How does it work?
It compares pairs of neighboring numbers. If the one on the left is greater than the one on the right, it swaps them. It repeats this process traversing the entire array several times until no more swaps are needed.

```c
void ordenarBurbuja(int arr[], int n) {
    int i, j, aux;
    for (i = 0; i < n - 1; i++) {
        for (j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap
                aux = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = aux;
            }
        }
    }
}
```

---

## 2. Selection Sort

This method is very intuitive: it consists of finding the smallest number and "selecting" it to put it at the beginning.

### How does it work?
1. Find the smallest element in the entire array.
2. Swap it with the element in the first position.
3. Then find the second smallest and put it in the second position, and so on.

```c
void ordenarSeleccion(int arr[], int n) {
    int i, j, min_idx, aux;
    for (i = 0; i < n - 1; i++) {
        min_idx = i; // Assume the current one is the minimum
        for (j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j; // Found a smaller one
            }
        }
        // Swap the found minimum with the current position
        aux = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = aux;
    }
}
```

---

## 3. Insertion Sort

This is how most people sort a hand of cards.

### How does it work?
You take one element at a time and "insert" it into its correct position by comparing it with the ones already on its left (which are already sorted).

```c
void ordenarInsercion(int arr[], int n) {
    int i, j, actual;
    for (i = 1; i < n; i++) {
        actual = arr[i];
        j = i - 1;

        // Shift elements that are greater than the current one
        while (j >= 0 && arr[j] > actual) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = actual; // Insert the element in its place
    }
}
```

---

## Summary: Which one to use?

- **Bubble:** Very easy to understand, but the slowest of all.
- **Selection:** Performs fewer data swaps than bubble, making it a bit more efficient in certain cases.
- **Insertion:** Very fast if the array is already "almost" sorted.

Mastering these methods gives you total control over how to organize information in your programs!
