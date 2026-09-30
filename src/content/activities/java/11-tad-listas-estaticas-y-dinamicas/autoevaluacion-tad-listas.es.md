---
course: 'java'
lesson: '11-tad-listas-estaticas-y-dinamicas'
slug: 'autoevaluacion-tad-listas'
title: 'Autoevaluación: TAD Lista, Estructuras Estáticas y Dinámicas Enlazadas'
description: 'Validá tus conocimientos sobre la especificación formal del TAD Lista, manipulación de referencias, inserciones y borrados en listas estáticas vs enlazadas.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuál es la diferencia conceptual entre un "Tipo Abstracto de Datos" (TAD) y una "Estructura de Datos" concreta?'
    options:
      - id: 'a'
        text: 'El TAD define el contrato lógico (qué operaciones se pueden hacer y sus pre/postcondiciones); la Estructura de Datos es la implementación física en memoria (cómo se almacenan y enlazan los bytes).'
      - id: 'b'
        text: 'El TAD solo existe en C++ y las estructuras de datos en Java.'
      - id: 'c'
        text: 'No hay diferencia; son exactamente lo mismo.'
      - id: 'd'
        text: 'Un TAD es siempre estático y una estructura de datos es siempre dinámica.'
    correctOptionId: 'a'
    explanation: >-
      Un TAD es una especificación matemática abstracta independiente del lenguaje. La estructura de datos concreta es la decisión técnica de implementación (por ejemplo, implementar el TAD Lista mediante un arreglo contiguo o una lista enlazada con nodos).
  - kind: 'true-false'
    id: 'q2'
    prompt: 'En una lista simplemente enlazada que solo mantiene un puntero al primer nodo (`primero`), la operación de insertar un nuevo elemento al inicio (en el índice 0) tiene una complejidad temporal de O(1).'
    correctAnswer: true
    explanation: >-
      Verdadero. Solo requiere instanciar el nuevo nodo, hacer que apunte al actual `primero` y actualizar `primero` para que apunte al nuevo nodo, sin importar cuántos elementos tenga la lista.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Cuál es la complejidad temporal de acceder por índice posicional (`obtener(i)`) en una lista simplemente enlazada de N elementos?'
    options:
      - id: 'a'
        text: 'O(1) directo gracias al cálculo de offset en memoria.'
      - id: 'b'
        text: 'O(log N) utilizando búsqueda binaria.'
      - id: 'c'
        text: 'O(N) en el peor y caso promedio, ya que se debe recorrer secuencialmente la cadena de punteros desde la cabeza hasta la posición i.'
      - id: 'd'
        text: 'O(N^2) debido a la memoria dinámica.'
    correctOptionId: 'c'
    explanation: >-
      A diferencia de un arreglo contiguo donde la posición de memoria se calcula directamente como `base + i * tamaño`, en una lista enlazada los nodos están dispersos en el Heap, obligando a recorrerlos uno a uno a través de sus referencias.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'Al insertar un nuevo nodo entre dos nodos existentes (nodo A y nodo B), el orden correcto es: primero hacer que el nuevo nodo apunte a B, y luego hacer que A apunte al nuevo nodo.'
    correctAnswer: true
    explanation: >-
      Verdadero. Si primero hiciéramos que A apunte al nuevo nodo antes de enlazarlo con B, perderíamos la referencia a B y al resto de la lista (Memory Leak o referencia huérfana).
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué ventaja de memoria ofrece una lista basada en arreglos (como `ArrayList`) frente a una lista enlazada (`LinkedList`) para almacenar 1.000.000 de enteros?'
    options:
      - id: 'a'
        text: 'No tiene ninguna ventaja.'
      - id: 'b'
        text: 'El arreglo contiguo tiene mucho menor overhead de memoria por elemento, ya que no necesita almacenar punteros de referencia extra por cada nodo ni crear un objeto envoltorio por cada celda.'
      - id: 'c'
        text: 'El arreglo enlazado consume menos porque no tiene celdas vacías.'
      - id: 'd'
        text: 'Los arreglos no utilizan la memoria RAM.'
    correctOptionId: 'b'
    explanation: >-
      Cada nodo en una lista enlazada requiere memoria extra para el puntero a la siguiente posición (y anterior si es doblemente enlazada), además del encabezado de objeto de la JVM, generando un overhead sustancial comparado con un arreglo contiguo.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'En una lista doblemente enlazada, cada nodo almacena tanto una referencia al siguiente nodo como una referencia al nodo anterior.'
    correctAnswer: true
    explanation: >-
      Verdadero. Esto permite recorrer la lista en ambos sentidos (hacia adelante y hacia atrás) y realizar eliminaciones en O(1) cuando ya se tiene la referencia directa al nodo a eliminar.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Por qué se aconseja definir la clase `Nodo<T>` como `private static class` dentro de la implementación de la lista en lugar de una clase pública independiente?'
    options:
      - id: 'a'
        text: 'Para evitar que el código cliente dependa de los detalles de implementación interna de los nodos, preservando el principio de encapsulamiento del TAD.'
      - id: 'b'
        text: 'Porque Java no permite que dos clases compartan el mismo paquete.'
      - id: 'c'
        text: 'Para que los nodos se creen en la memoria de solo lectura.'
      - id: 'd'
        text: 'Porque las clases estáticas se ejecutan más rápido.'
    correctOptionId: 'a'
    explanation: >-
      El usuario del TAD Lista solo debe interactuar con los métodos del contrato (`agregar`, `obtener`, `eliminar`). La existencia y manejo de los nodos es un detalle privado de implementación que no debe exponerse.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Una lista circular es aquella cuyo último nodo contiene una referencia `null` en su puntero `siguiente`.'
    correctAnswer: false
    explanation: >-
      Falso. En una lista circular, el último nodo apunta de regreso al primer nodo de la lista, formando un ciclo continuo sin ningún puntero a `null`.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Cuál es el caso borde más crítico a considerar al implementar la operación de eliminación en una lista simplemente enlazada?'
    options:
      - id: 'a'
        text: 'Cuando el índice a eliminar es negativo.'
      - id: 'b'
        text: 'Eliminar el nodo cabeza (índice 0), ya que requiere actualizar la referencia principal primero de la lista.'
      - id: 'c'
        text: 'Eliminar cuando la lista tiene exactamente 100 elementos.'
      - id: 'd'
        text: 'Eliminar elementos de tipo String.'
    correctOptionId: 'b'
    explanation: >-
      Eliminar la cabeza no tiene un "nodo anterior" que reconectar; la referencia raíz de la estructura (`primero`) debe actualizarse directamente para apuntar a `primero.siguiente`. Si la lista queda vacía, `primero` pasa a ser `null`.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'Un invariante de clase de una estructura de datos es una condición que debe ser verdadera antes y después de la ejecución de cualquier método público de la clase.'
    correctAnswer: true
    explanation: >-
      Verdadero. Por ejemplo, en una lista enlazada, que el atributo `tamano` refleje con exactitud la cantidad de nodos alcanzables desde `primero` es un invariante fundamental de integridad.
---
