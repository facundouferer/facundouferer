---
course: 'java'
lesson: '11-tad-listas-estaticas-y-dinamicas'
slug: 'tad-lista-enlazada-generica'
title: 'Implementación de TAD Lista Simplemente Enlazada con Nodos Genéricos'
description: 'Construí una lista enlazada desde cero implementando la especificación del Tipo Abstracto de Datos (TAD) Lista, encapsulando referencias y preservando invariantes.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 55
objectives:
  - 'Diferenciar con claridad la especificación abstracta de un TAD de su implementación concreta en memoria.'
  - 'Construir una clase de nodo genérico autorreferencial protegiendo su encapsulamiento.'
  - 'Implementar algoritmos de inserción, eliminación y búsqueda manipulando punteros/referencias.'
  - 'Preservar los invariantes de estructura (puntero a la cabeza `primero`, tamaño de la lista y terminación en `null`).'
requirements:
  - 'Definir la interfaz genérica Lista<T> con operaciones: void agregarAlFinal(T elemento), void insertarEn(int indice, T elemento), T obtener(int indice), T eliminarEn(int indice), int longitud(), boolean estaVacia(), void limpiar().'
  - 'Crear la clase interna o estática privada Nodo<T> con campos dato (T) y siguiente (Nodo<T>).'
  - 'Implementar ListaEnlazada<T> implements Lista<T> con atributos privados primero (Nodo<T>) y tamano (int).'
  - 'Validar rigurosamente los índices en insertarEn, obtener y eliminarEn lanzando IndexOutOfBoundsException cuando indice < 0 o indice >= tamano (o indice > tamano en inserción).'
  - 'Tratar exhaustivamente los casos borde: lista vacía, inserción/eliminación en la cabeza (índice 0) e inserción en la cola.'
  - 'Sobrescribir toString() para representar la lista en formato visual amigable: [elem1 -> elem2 -> null].'
  - 'En MainLista.java, demostrar la inserción en distintas posiciones, eliminación del primer elemento, recuperación de datos e impresión de la estructura.'
exampleOutput: |
  === TAD Lista Simplemente Enlazada ===
  [OK] Creando lista vacía. Longitud inicial: 0
  Insertando elementos al final:
  Estado actual: [10 -> 20 -> 30 -> null] | Tamaño: 3
  Insertando 99 en el índice 0 (nueva cabeza):
  Estado actual: [99 -> 10 -> 20 -> 30 -> null] | Tamaño: 4
  Insertando 55 en el índice 2:
  Estado actual: [99 -> 10 -> 55 -> 20 -> 30 -> null] | Tamaño: 5
  Eliminando elemento en índice 0 (removiendo cabeza):
  [AUDITORÍA] Elemento eliminado: 99
  Estado actual: [10 -> 55 -> 20 -> 30 -> null] | Tamaño: 4
  Recuperando elemento en índice 1: 55
  [OK] Validación de invariantes: tamaño coincide con nodos enlazados.
deliveryTips:
  - 'Compilá con javac *.java y ejecutá con java MainLista.'
  - 'Dibujá en papel las referencias antes y después de cada reconexión de punteros para no perder la referencia al resto de la lista.'
  - 'Asegurate de decrementar o incrementar el atributo tamano en cada operación que altere la cantidad de nodos.'
---

## Contexto

Un **Tipo Abstracto de Datos (TAD)** define un modelo matemático de comportamiento: qué operaciones pueden realizarse sobre los datos y qué contratos deben cumplirse, sin prescribir cómo se almacenan físicamente en la memoria.

Una lista puede implementarse mediante un arreglo contiguo en memoria (**lista estática o dinámica contigua**) o mediante bloques dispersos interconectados por referencias (**lista enlazada**). La comprensión profunda de cómo se manipulan los nodos enlazados es la base fundamental para dominar estructuras más complejas como árboles y grafos.

## Consigna

Vas a implementar desde cero una **Lista Simplemente Enlazada Genérica**, sin utilizar ninguna clase del paquete `java.util`.

### 1. Especificación del TAD Lista

- **`Lista.java`**:
  ```java
  public interface Lista<T> {
      void agregarAlFinal(T elemento);
      void insertarEn(int indice, T elemento);
      T obtener(int indice);
      T eliminarEn(int indice);
      int longitud();
      boolean estaVacia();
      void limpiar();
  }
  ```

### 2. Implementación de `ListaEnlazada`

- **Estructura del Nodo**:
  - Clase estática privada `private static class Nodo<E>` dentro de `ListaEnlazada<T>` para no filtrar detalles de implementación hacia afuera.
  - Atributos: `E dato;` y `Nodo<E> siguiente;`.
- **Invariantes de Clase**:
  - `private Nodo<T> primero;` (referencia al primer nodo o `null` si está vacía).
  - `private int tamano;` (cantidad de elementos contenidos).
  - En todo momento, recorrer desde `primero` hasta encontrar `null` debe contabilizar exactamente `tamano` nodos.
- **Lógica de Operaciones**:
  - `insertarEn(int indice, T elemento)`:
    - Validación: `if (indice < 0 || indice > tamano) throw new IndexOutOfBoundsException();`.
    - Si `indice == 0`: el nuevo nodo apunta al actual `primero`, y `primero` pasa a ser el nuevo nodo.
    - Si `indice > 0`: se avanza hasta el nodo en posición `indice - 1`, se reconectan los punteros (`nuevoNodo.siguiente = anterior.siguiente; anterior.siguiente = nuevoNodo;`).
    - Incrementa `tamano`.
  - `eliminarEn(int indice)`:
    - Validación: `if (indice < 0 || indice >= tamano) throw new IndexOutOfBoundsException();`.
    - Si `indice == 0`: se guarda el dato de `primero`, `primero = primero.siguiente;`, decrementa `tamano` y retorna el dato.
    - Si `indice > 0`: se busca el nodo anterior, se desconecta el nodo objetivo (`anterior.siguiente = anterior.siguiente.siguiente;`), decrementa `tamano` y retorna el dato.
  - `obtener(int indice)`: avanza hasta el nodo solicitado y retorna su dato.
  - `toString()`: genera la cadena `[elem1 -> elem2 -> null]`.

### 3. Programa de Verificación en `MainLista`

En `MainLista.java`:
1. Instanciá `ListaEnlazada<Integer>`.
2. Agregá elementos y mostrá el estado de la lista.
3. Insertá en posición 0 (caso borde: nueva cabeza).
4. Insertá en una posición intermedia.
5. Eliminá el primer elemento y comprobá que la nueva cabeza sea el segundo.
6. Intentá acceder a un índice fuera de rango dentro de un bloque `try-catch` y verificá que se lance `IndexOutOfBoundsException`.
