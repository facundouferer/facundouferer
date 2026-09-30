---
course: 'java'
lesson: '12-tad-pilas-y-colas'
slug: 'procesador-expresiones-pila-cola'
title: 'Implementación de TAD Pila y Cola Enlazadas con Verificación de Invariantes'
description: 'Construí desde cero las estructuras fundamentales Pila (LIFO) y Cola (FIFO) utilizando nodos enlazados genéricos y aplicalas en la validación de sintaxis y despacho de tareas.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 60
objectives:
  - 'Comprender y contrastar las semánticas de acceso LIFO (Last-In, First-Out) y FIFO (First-In, First-Out).'
  - 'Implementar las especificaciones de los TAD Pila y Cola garantizando operaciones de inserción y extracción en tiempo O(1).'
  - 'Diseñar tipos de datos abstractos desacoplados mediante interfaces y clases genéricas autorreferenciales.'
  - 'Aplicar la estructura Pila en un caso práctico de validación de delimitadores balanceados.'
requirements:
  - 'Definir la interfaz genérica Pila<T> con métodos: void push(T elemento), T pop(), T peek(), boolean estaVacia(), int tamano().'
  - 'Definir la interfaz genérica Cola<T> con métodos: void enqueue(T elemento), T dequeue(), T peek(), boolean estaVacia(), int tamano().'
  - 'Implementar PilaEnlazada<T> implements Pila<T> manteniendo una referencia al tope y el conteo de elementos.'
  - 'Implementar ColaEnlazada<T> implements Cola<T> manteniendo referencias eficientes al frente (cabeza) y al final (cola) para asegurar encolado y desencolado en O(1).'
  - 'Lanzar excepciones controladas (NoSuchElementException o IllegalStateException) al intentar desapilar o desencolar de estructuras vacías.'
  - 'Crear la clase ValidadorSintaxis con un método boolean esBalanceada(String expresion) que utilice PilaEnlazada<Character> para verificar delimitadores (), [], {}.'
  - 'En MainPilasColas.java, demostrar el flujo completo: apilar/desapilar, encolar/desencolar y validar expresiones válidas e inválidas.'
exampleOutput: |
  === TAD Pila (LIFO) y Cola (FIFO) ===
  [PILA] Apilando tokens: A -> B -> C
  [PILA] Tope actual: C | Tamaño: 3
  [PILA] Desapilando: C
  [PILA] Desapilando: B
  [PILA] Estado final: vacia=false, restante=A

  [COLA] Encolando pedidos: Pedido#101 -> Pedido#102 -> Pedido#103
  [COLA] Frente actual: Pedido#101 | Tamaño: 3
  [COLA] Despachando: Pedido#101
  [COLA] Despachando: Pedido#102
  [COLA] Frente tras despachos: Pedido#103

  === Validador de Delimitadores con Pila ===
  Expresión: "{ [ 2 * (3 + 1) ] / 5 }" -> ¿Balanceada? true
  Expresión: "{ [ 2 * (3 + 1) ) ] }"   -> ¿Balanceada? false
  Expresión: "( [ { } ]"               -> ¿Balanceada? false
deliveryTips:
  - 'En ColaEnlazada, asegurate de actualizar tanto el puntero cabeza como el puntero cola al insertar en una cola vacía o al remover el último elemento.'
  - 'En el validador de sintaxis, ignorá los caracteres que no sean delimitadores de apertura o cierre.'
  - 'Validá los invariantes: el tamaño nunca debe ser negativo y las referencias deben liberarse para evitar retenciones indebidas en memoria.'
---

## Contexto

Las estructuras lineales restringidas son piezas angulares de la ingeniería de software:
- Una **Pila (Stack)** restringe las operaciones al principio **LIFO** (*Last-In, First-Out*): el último elemento ingresado es el primero en salir. Modela la pila de llamadas de la JVM, el mecanismo de deshacer (*undo*) y la evaluación de expresiones sintácticas.
- Una **Cola (Queue)** impone la semántica **FIFO** (*First-In, First-Out*): el primer elemento ingresado es el primero en ser procesado. Modela colas de mensajes, spoolers de impresión y algoritmos de recorrido en anchura.

Ambas estructuras exigen que sus operaciones primordiales se ejecuten en tiempo constante **O(1)**.

## Consigna

Vas a construir desde cero las implementaciones enlazadas de ambos TADs en Java, garantizando contratos de interfaz, encapsulamiento estricto y resolución algorítmica.

### 1. Interfaz y Especificación

1. **`Pila.java`**:
   ```java
   public interface Pila<T> {
       void push(T elemento);
       T pop();
       T peek();
       boolean estaVacia();
       int tamano();
   }
   ```

2. **`Cola.java`**:
   ```java
   public interface Cola<T> {
       void enqueue(T elemento);
       T dequeue();
       T peek();
       boolean estaVacia();
       int tamano();
   }
   ```

### 2. Implementaciones con Nodos Enlazados

- Diseñá una clase privada `Nodo<T>` con su carga útil `T dato` y su enlace `Nodo<T> siguiente`.
- En `PilaEnlazada<T>`:
  - El puntero `tope` debe referenciar siempre al último nodo ingresado.
  - `push(T elemento)` inserta un nuevo nodo que pasa a ser el nuevo tope en O(1).
  - `pop()` desvincula el nodo del tope, actualiza la referencia y devuelve su dato en O(1).
- En `ColaEnlazada<T>`:
  - Mantené dos punteros: `cabeza` (para extracciones) y `cola` o `fin` (para inserciones).
  - Ambos métodos, `enqueue` y `dequeue`, deben operar estrictamente en O(1).

### 3. Caso de Uso: Validador de Delimitadores

Implementá la clase `ValidadorSintaxis` con la firma:
```java
public static boolean esBalanceada(String expresion);
```

**Reglas de validación**:
1. Recorrer la cadena carácter por carácter.
2. Si se encuentra un delimitador de apertura (`(`, `[`, `{`), apilarlo.
3. Si se encuentra un delimitador de cierre (`)`, `]`, `}`):
   - Si la pila está vacía, no hay apertura correspondiente $\rightarrow$ inválida.
   - Si la cima de la pila no coincide con el tipo de delimitador $\rightarrow$ inválida.
   - Si coincide, desapilar el correspondiente.
4. Al finalizar la cadena, la expresión solo es válida si la pila quedó totalmente vacía.
