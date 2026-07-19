---
title: 'Árboles Binarios'
course: 'c'
slug: 'arboles-binarios'
order: 24
lang: 'es'
published: true
---

Hasta ahora, aprendiste a organizar tus datos en estructuras **lineales**: listas, pilas y colas. En ellas, cada elemento tiene un único sucesor (como una fila de supermercado). Pero el mundo real no siempre es una fila recta. A veces los datos se organizan de forma **jerárquica**, como el organigrama de una empresa, los archivos en tu computadora o las ramas de un árbol.

Ahí es donde entra el **árbol binario**.

En esta lección vas a aprender:
- Qué es un árbol binario y por qué es tan poderoso.
- La anatomía de un árbol (raíz, hojas, subárboles).
- Cómo definir un nodo en C utilizando estructuras y punteros.
- Qué es un Árbol Binario de Búsqueda (BST) y cómo organizar datos en él.
- Cómo insertar, buscar y recorrer elementos utilizando la magia de la **recursividad**.

---

## ¿Por qué necesitamos Árboles Binarios?

Imaginá que tenés una lista enlazada con 1.000.000 de números ordenados de menor a mayor y querés buscar el número `999.999`. Vas a tener que recorrer casi todo el millón de nodos, uno por uno, para encontrarlo. ¡Eso es lento!

Un **árbol binario de búsqueda** nos permite partir el problema a la mitad en cada paso. Es como buscar una palabra en el diccionario: si abrís el libro a la mitad y ves que la palabra empieza con 'Z', descartás toda la mitad izquierda inmediatamente. En lugar de hacer un millón de preguntas, en un árbol bien balanceado podés encontrar tu dato en aproximadamente **20 pasos**.

---

## Anatomía de un Árbol

Visualizá un árbol al revés (con la raíz arriba y las ramas creciendo hacia abajo):

```text
       [ Raíz: 50 ]          <-- El nodo principal, donde todo empieza
       /          \
  [ 30 ]          [ 70 ]     <-- Nodos internos (tienen padre e hijos)
  /    \          /    \
[20]  [40]      [60]  [80]   <-- Hojas (nodos finales, no tienen hijos)
```

Conceptos clave para recordar:
- **Raíz (Root)**: El nodo superior del árbol. No tiene "padre".
- **Hijo (Child)**: Nodo que cuelga de otro superior. En un árbol **binario**, cada nodo puede tener como máximo **dos hijos** (hijo izquierdo e hijo derecho).
- **Padre (Parent)**: Nodo que tiene ramas hacia nodos inferiores.
- **Hoja (Leaf)**: Nodos que no tienen hijos (sus punteros izquierdo y derecho apuntan a `NULL`).
- **Subárbol (Subtree)**: Cada hijo de un nodo puede considerarse a su vez la raíz de su propio árbol más chico. ¡Esta es la base de la recursividad!

---

## Definiendo un Nodo en C

Para construir esta estructura en C, necesitamos definir un `struct` que guarde el valor (el dato) y dos punteros: uno para el hijo izquierdo y otro para el hijo derecho.

```c
#include <stdio.h>
#include <stdlib.h> // Para usar malloc y free

// Definición de la estructura de un Nodo
struct Nodo {
    int dato;                  // El valor que almacena el nodo
    struct Nodo* izquierdo;    // Puntero al subárbol izquierdo
    struct Nodo* derecho;      // Puntero al subárbol derecho
};
```

> [!NOTE]
> Prestá atención a esto: `struct Nodo*` es un puntero a otro nodo del mismo tipo. Es una estructura autorreferenciada. Así es como logramos enlazar los nodos entre sí.

---

## Creación de un Nuevo Nodo

Para agregar elementos al árbol, primero debemos poder crear nodos en la memoria del sistema (el *Heap*) usando `malloc`.

```c
// Función auxiliar para crear un nuevo nodo
struct Nodo* crearNodo(int valor) {
    // 1. Reservamos memoria para el nodo
    struct Nodo* nuevoNodo = (struct Nodo*)malloc(sizeof(struct Nodo));
    
    // 2. Asignamos el valor
    nuevoNodo->dato = valor;
    
    // 3. Inicializamos los hijos como vacíos (NULL)
    nuevoNodo->izquierdo = NULL;
    nuevoNodo->derecho = NULL;
    
    return nuevoNodo;
}
```

---

## La Regla de Oro: Árbol Binario de Búsqueda (BST)

Un árbol binario común y corriente no tiene un orden establecido. Pero para buscar datos rápido, usamos el **Árbol Binario de Búsqueda (BST)**. Su regla es muy sencilla y estricta:

Para cualquier nodo del árbol:
1. Todos los valores en su **subárbol izquierdo** deben ser **menores** que el valor del nodo.
2. Todos los valores en su **subárbol derecho** deben ser **mayores** que el valor del nodo.

### Inserción de Datos

Para insertar un elemento respetando esta regla, usamos **recursividad**:

```c
// Función para insertar un valor en el árbol
struct Nodo* insertar(struct Nodo* raiz, int valor) {
    // Caso base: si el árbol (o subárbol) está vacío, creamos el nodo ahí
    if (raiz == NULL) {
        return crearNodo(valor);
    }
    
    // Si el valor es menor, va al subárbol izquierdo
    if (valor < raiz->dato) {
        raiz->izquierdo = insertar(raiz->izquierdo, valor);
    }
    // Si el valor es mayor, va al subárbol derecho
    else if (valor > raiz->dato) {
        raiz->derecho = insertar(raiz->derecho, valor);
    }
    
    // Devolvemos el puntero del nodo (sin cambios)
    return raiz;
}
```

---

## Búsqueda de un Elemento

Buscar en un BST es sumamente eficiente porque en cada nodo decidimos si ir a la izquierda o a la derecha, descartando la otra mitad del árbol.

```c
// Función para buscar un valor en el árbol
struct Nodo* buscar(struct Nodo* raiz, int valorBuscado) {
    // Caso base: si el árbol está vacío o si encontramos el valor
    if (raiz == NULL || raiz->dato == valorBuscado) {
        return raiz;
    }
    
    // Si el valor es menor, buscamos en la izquierda
    if (valorBuscado < raiz->dato) {
        return buscar(raiz->izquierdo, valorBuscado);
    }
    
    // Si el valor es mayor, buscamos en la derecha
    return buscar(raiz->derecho, valorBuscado);
}
```

---

## Recorridos (Cómo leer el árbol)

En una lista lineal, leés de principio a fin. En un árbol, tenés distintas formas de visitarlo. Las tres principales son recursivas:

1. **Preorden (Pre-order)**: Visita primero la raíz, luego el subárbol izquierdo y después el derecho. (Raíz -> Izquierda -> Derecha).
2. **Inorden (In-order)**: Visita primero el subárbol izquierdo, luego la raíz y después el derecho. (Izquierda -> Raíz -> Derecha).
   > [!TIP]
   > ¡En un BST, el recorrido **inorden** siempre te va a mostrar los números ordenados de menor a mayor!
3. **Postorden (Post-order)**: Visita primero el subárbol izquierdo, luego el derecho y por último la raíz. (Izquierda -> Derecha -> Raíz).

### Implementación del Recorrido Inorden en C

```c
// Función para imprimir el árbol en inorden
void inorden(struct Nodo* raiz) {
    if (raiz != NULL) {
        inorden(raiz->izquierdo);     // 1. Recorrer subárbol izquierdo
        printf("%d ", raiz->dato);    // 2. Visitar el nodo actual (raíz)
        inorden(raiz->derecho);       // 3. Recorrer subárbol derecho
    }
}
```

---

## Un Ejemplo Completo para Probar

Aquí tenés un programa de C completo y funcional que podés compilar y ejecutar. Este programa crea un árbol, inserta algunos valores, los imprime ordenados y realiza una búsqueda:

```c
#include <stdio.h>
#include <stdlib.h>

struct Nodo {
    int dato;
    struct Nodo* izquierdo;
    struct Nodo* derecho;
};

struct Nodo* crearNodo(int valor) {
    struct Nodo* nuevoNodo = (struct Nodo*)malloc(sizeof(struct Nodo));
    nuevoNodo->dato = valor;
    nuevoNodo->izquierdo = NULL;
    nuevoNodo->derecho = NULL;
    return nuevoNodo;
}

struct Nodo* insertar(struct Nodo* raiz, int valor) {
    if (raiz == NULL) return crearNodo(valor);
    
    if (valor < raiz->dato) {
        raiz->izquierdo = insertar(raiz->izquierdo, valor);
    } else if (valor > raiz->dato) {
        raiz->derecho = insertar(raiz->derecho, valor);
    }
    return raiz;
}

void inorden(struct Nodo* raiz) {
    if (raiz != NULL) {
        inorden(raiz->izquierdo);
        printf("%d ", raiz->dato);
        inorden(raiz->derecho);
    }
}

struct Nodo* buscar(struct Nodo* raiz, int valor) {
    if (raiz == NULL || raiz->dato == valor) return raiz;
    if (valor < raiz->dato) return buscar(raiz->izquierdo, valor);
    return buscar(raiz->derecho, valor);
}

int main() {
    struct Nodo* raiz = NULL;
    
    // Insertamos elementos
    raiz = insertar(raiz, 50);
    insertar(raiz, 30);
    insertar(raiz, 70);
    insertar(raiz, 20);
    insertar(raiz, 40);
    insertar(raiz, 60);
    insertar(raiz, 80);
    
    // Imprimimos el recorrido inorden (debe salir ordenado de menor a mayor)
    printf("Elementos en el arbol (recorrido Inorden): ");
    inorden(raiz);
    printf("\n");
    
    // Buscamos un elemento
    int numeroABuscar = 40;
    struct Nodo* encontrado = buscar(raiz, numeroABuscar);
    if (encontrado != NULL) {
        printf("El numero %d fue encontrado en el arbol.\n", numeroABuscar);
    } else {
        printf("El numero %d no existe en el arbol.\n", numeroABuscar);
    }
    
    return 0;
}
```

---

## Resumen de Aprendizajes

- El **árbol binario** organiza la información en jerarquías, no en filas.
- Un nodo se compone de un valor y **dos punteros autorreferenciados** (`izquierdo` y `derecho`).
- En un **BST**, los menores van a la izquierda del nodo y los mayores a la derecha, logrando búsquedas ultrarrápidas.
- La **recursividad** es la herramienta natural para trabajar con árboles, ya que cada subárbol es a su vez un árbol independiente.