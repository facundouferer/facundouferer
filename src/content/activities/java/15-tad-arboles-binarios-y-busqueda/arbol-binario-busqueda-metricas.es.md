---
course: 'java'
lesson: '15-tad-arboles-binarios-y-busqueda'
slug: 'arbol-binario-busqueda-metricas'
title: 'Implementación de Árbol Binario de Búsqueda (BST) y Métricas Estructurales'
description: 'Diseñá e implementá un Árbol Binario de Búsqueda (BST) genérico preservando sus invariantes de orden, algoritmos recursivos de recorrido y cálculo de métricas.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 65
objectives:
  - 'Comprender la estructura jerárquica no lineal del árbol binario y el invariante fundamental del BST.'
  - 'Implementar algoritmos recursivos de inserción, búsqueda y cálculo de altura y tamaño.'
  - 'Construir los recorridos canónicos en profundidad: In-Order, Pre-Order y Post-Order.'
  - 'Garantizar el tipado seguro exigiendo que los elementos implementen la interfaz `Comparable<T>`.'
requirements:
  - 'Definir la clase ArbolBinarioBusqueda<T extends Comparable<T>> con atributo privado raiz de tipo NodoArbol<T>.'
  - 'Crear la clase privada estática NodoArbol<T> con campos dato (T), izquierdo (NodoArbol<T>) y derecho (NodoArbol<T>).'
  - 'Implementar void insertar(T valor) respetando el invariante de BST (menores a la izquierda, mayores a la derecha; ignorar o rechazar duplicados).'
  - 'Implementar boolean contiene(T valor) con búsqueda eficiente O(h) donde h es la altura del árbol.'
  - 'Implementar recorridos recursivos que devuelvan listas o colecciones: List<T> inOrder(), List<T> preOrder(), List<T> postOrder().'
  - 'Implementar int calcularAltura() e int tamano() de forma recursiva y segura ante árboles vacíos.'
  - 'Implementar T obtenerMinimo() y T obtenerMaximo() explotando la navegación hasta las hojas extremas.'
  - 'En MainArbol.java, poblar un árbol de prueba, verificar el orden ascendente con In-Order, consultar existencia de claves y exhibir altura y tamaño.'
exampleOutput: |
  === Árbol Binario de Búsqueda (BST) ===
  Insertando valores: [50, 30, 70, 20, 40, 60, 80]
  [BST] Inserciones completadas sin duplicados.
  Tamaño total de nodos: 7
  Altura del árbol: 3
  Elemento mínimo: 20 | Elemento máximo: 80

  Recorrido In-Order (debe estar estrictamente ordenado):
  [20, 30, 40, 50, 60, 70, 80]

  Recorrido Pre-Order (raíz primero):
  [50, 30, 20, 40, 70, 60, 80]

  Recorrido Post-Order (hojas primero):
  [20, 40, 30, 60, 80, 70, 50]

  Búsqueda de valores:
  ¿Contiene 40?: true
  ¿Contiene 99?: false
deliveryTips:
  - 'Recordá que la altura de un árbol vacío se define convencionalmente como 0 (o -1 si se cuentan aristas; especificá con claridad tu convención).'
  - 'Aprovechá `valor.compareTo(actual.dato)` para decidir si navegar por la rama izquierda (< 0) o derecha (> 0).'
  - 'Modularizá cada operación pública delegando en un método recursivo privado que reciba la raíz del subárbol actual: `private NodoArbol<T> insertarRecursivo(NodoArbol<T> actual, T valor)`.'
---

## Contexto

A diferencia de las colecciones lineales donde la búsqueda secuencial cuesta **O(N)**, un **Árbol Binario de Búsqueda (BST)** organiza la información jerárquicamente imponiendo un **invariante de orden**:
Para cualquier nodo $X$ del árbol:
- Todos los elementos del subárbol izquierdo de $X$ son estrictamente menores que $X$.
- Todos los elementos del subárbol derecho de $X$ son estrictamente mayores que $X$.

Gracias a esta propiedad, en un árbol balanceado la búsqueda, inserción y consulta se reducen a tiempo logarítmico **$O(\log N)$**.

## Consigna

Vas a implementar un `ArbolBinarioBusqueda<T extends Comparable<T>>` completamente funcional en Java.

### 1. Estructura de Clases y Nodos

```java
public class ArbolBinarioBusqueda<T extends Comparable<T>> {
    
    private static class NodoArbol<T> {
        T dato;
        NodoArbol<T> izquierdo;
        NodoArbol<T> derecho;

        NodoArbol(T dato) {
            this.dato = dato;
        }
    }

    private NodoArbol<T> raiz;
    private int tamano;
    // ...
}
```

### 2. Operaciones Algorítmicas

1. **Inserción recursiva**:
   - Si la raíz es nula, el nuevo nodo se convierte en la raíz.
   - De lo contrario, descender comparando: si `valor.compareTo(actual.dato) < 0`, avanzar al subárbol izquierdo; si es mayor, al derecho.
2. **Búsqueda eficiente**:
   - `boolean contiene(T valor)` navega descartando la mitad del árbol en cada paso.
3. **Recorridos canónicos**:
   - **In-Order**: Subárbol izquierdo $\rightarrow$ Raíz $\rightarrow$ Subárbol derecho (produce la secuencia ordenada).
   - **Pre-Order**: Raíz $\rightarrow$ Subárbol izquierdo $\rightarrow$ Subárbol derecho.
   - **Post-Order**: Subárbol izquierdo $\rightarrow$ Subárbol derecho $\rightarrow$ Raíz.
4. **Métricas estructurales**:
   - Altura del árbol: $1 + \max(\text{altura}(izq), \text{altura}(der))$.
   - Mínimo y máximo: navegar persistentemente por el puntero izquierdo o derecho respectivamente.
