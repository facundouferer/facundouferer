---
title: 'Array Searching'
course: 'c'
slug: 'busqueda-en-arreglos'
order: 19
lang: 'en'
published: true
---

Cuando trabajamos con muchos datos, guardarlos es solo la mitad del trabajo. La otra mitad, y quizás la más importante, es saber **encontrarlos** rápido.

En esta lección vamos a aprender cómo buscar elementos en un arreglo y cómo el orden de los datos influye en la velocidad de nuestro programa.

---

## 1. Búsqueda Lineal (o Secuencial)

Imaginá que tenés una lista de nombres anotados en un papel sin ningún orden. Si buscás a "Juan", tenés que empezar desde el primero y mirar uno por uno hasta encontrarlo o llegar al final.

### ¿Cómo funciona?
Recorremos el arreglo desde la posición `0` hasta la última, comparando cada elemento con el que buscamos.

```c
#include <stdio.h>

int main() {
    int numeros[] = {10, 5, 8, 2, 7};
    int n = 5;
    int buscado = 8;
    int posicion = -1; // Usamos -1 para indicar "no encontrado"

    for (int i = 0; i < n; i++) {
        if (numeros[i] == buscado) {
            posicion = i; // ¡Lo encontramos!
            break; // No hace falta seguir buscando
        }
    }

    if (posicion != -1) {
        printf("Elemento encontrado en la posicion %d\n", posicion);
    } else {
        printf("Elemento no encontrado\n");
    }

    return 0;
}
```

*   **Ventaja:** Sirve para cualquier arreglo, esté ordenado o no.
*   **Desventaja:** Es lenta para listas grandes.

---

## 2. Búsqueda Binaria

La **Búsqueda Binaria** es extremadamente rápida, pero tiene un requisito fundamental: el arreglo **tiene que estar ordenado**.

### La analogía del Diccionario
Si buscás la palabra "Programación" en un diccionario, abrís el libro por la mitad:
1.  Si la palabra que ves está "después" de la que buscás, descartás toda la segunda mitad.
2.  Si está "antes", descartás la primera mitad.
3.  Repetís el proceso con la mitad que te queda hasta encontrarla.

### Implementación en C

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

    return -1; // No se encontró
}
```

---

## Idea Clave

Si tus datos están desordenados, estás obligado a usar la búsqueda lineal. Si querés usar la búsqueda binaria para ser más eficiente, primero debés pasar por un proceso de **Ordenación**, que veremos en la próxima lección.
