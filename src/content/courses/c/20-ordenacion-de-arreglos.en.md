---
title: 'Array Sorting'
course: 'c'
slug: 'ordenacion-de-arreglos'
order: 20
lang: 'en'
published: true
---

Ordenar datos no es solo una cuestión de estética. Es una herramienta fundamental que permite que nuestros programas procesen información de manera lógica y eficiente.

En esta lección aprenderemos los tres métodos de ordenación más comunes para principiantes.

---

## El concepto de Intercambio (Swap)

Antes de ver los métodos, tenés que entender cómo "cambiamos de lugar" dos números en C. Imagina que tenés una copa con **jugo** y otra con **agua**, y querés intercambiar sus contenidos. Necesitás una **tercera copa vacía** (una variable auxiliar).

```c
int aux = a; // Guardamos el valor de 'a' en la copa auxiliar
a = b;       // Ponemos el valor de 'b' en 'a'
b = aux;     // Ponemos el valor guardado en la auxiliar en 'b'
```

---

## 1. Método de la Burbuja (Bubble Sort)

Es el más famoso para aprender. Se llama así porque los números más grandes "flotan" hacia el final del arreglo como burbujas.

### ¿Cómo funciona?
Compara parejas de números vecinos. Si el de la izquierda es mayor que el de la derecha, los intercambia. Repite este proceso recorriendo todo el arreglo varias veces hasta que no queden intercambios por hacer.

```c
void ordenarBurbuja(int arr[], int n) {
    int i, j, aux;
    for (i = 0; i < n - 1; i++) {
        for (j = 0; j < n - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // Intercambio
                aux = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = aux;
            }
        }
    }
}
```

---

## 2. Método de Selección (Selection Sort)

Este método es muy intuitivo: consiste en buscar el número más pequeño y "seleccionarlo" para ponerlo al principio.

### ¿Cómo funciona?
1. Busca el elemento más pequeño de todo el arreglo.
2. Lo intercambia con el elemento de la primera posición.
3. Luego busca el segundo más pequeño y lo pone en la segunda posición, y así sucesivamente.

```c
void ordenarSeleccion(int arr[], int n) {
    int i, j, min_idx, aux;
    for (i = 0; i < n - 1; i++) {
        min_idx = i; // Suponemos que el actual es el mínimo
        for (j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j; // Encontramos uno más chico
            }
        }
        // Intercambiamos el mínimo encontrado con el de la posición actual
        aux = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = aux;
    }
}
```

---

## 3. Método de Inserción (Insertion Sort)

Es la forma en la que la mayoría de las personas ordenan una mano de cartas.

### ¿Cómo funciona?
Vas tomando un elemento a la vez y lo "insertás" en su posición correcta comparándolo con los que ya tenés a su izquierda (que ya están ordenados).

```c
void ordenarInsercion(int arr[], int n) {
    int i, j, actual;
    for (i = 1; i < n; i++) {
        actual = arr[i];
        j = i - 1;

        // Desplazamos los elementos que son mayores que el actual
        while (j >= 0 && arr[j] > actual) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = actual; // Insertamos el elemento en su lugar
    }
}
```

---

## Resumen: ¿Cuál usar?

- **Burbuja:** Muy fácil de entender, pero el más lento de todos.
- **Selección:** Realiza menos intercambios de datos que la burbuja, lo que lo hace un poquito más eficiente en ciertos casos.
- **Inserción:** Es muy rápido si el arreglo ya está "casi" ordenado.

¡Dominar estos métodos te da el control total sobre cómo organizar la información en tus programas!
