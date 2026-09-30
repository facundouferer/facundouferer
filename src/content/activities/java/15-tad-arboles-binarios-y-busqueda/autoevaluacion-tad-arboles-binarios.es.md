---
course: 'java'
lesson: '15-tad-arboles-binarios-y-busqueda'
slug: 'autoevaluacion-tad-arboles-binarios'
title: 'Autoevaluación: TAD Árboles Binarios y Árboles Binarios de Búsqueda (BST)'
description: 'Comprobá tus conocimientos sobre árboles binarios, invariantes de orden en BST, recorridos recursivos y análisis de complejidad temporal y espacial.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuál es el invariante esencial que define a un Árbol Binario de Búsqueda (BST)?'
    options:
      - id: 'a'
        text: 'Cada nodo tiene exactamente dos hijos siempre.'
      - id: 'b'
        text: 'Para cada nodo, todos los valores en su subárbol izquierdo son menores que él, y todos los de su subárbol derecho son mayores.'
      - id: 'c'
        text: 'Los nodos se insertan estrictamente de izquierda a derecha por nivel.'
      - id: 'd'
        text: 'La altura del árbol nunca puede superar 3.'
    correctOptionId: 'b'
    explanation: >-
      El invariante de orden del BST establece que para cualquier nodo, toda clave en el subárbol izquierdo es menor y toda clave en el subárbol derecho es mayor.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué tipo de recorrido sobre un BST visita los nodos en orden estrictamente ascendente (de menor a mayor)?'
    options:
      - id: 'a'
        text: 'Pre-Order'
      - id: 'b'
        text: 'Post-Order'
      - id: 'c'
        text: 'In-Order (Inorden)'
      - id: 'd'
        text: 'Por niveles (BFS)'
    correctOptionId: 'c'
    explanation: >-
      El recorrido In-Order visita recursivamente: primero el subárbol izquierdo (menores), luego la raíz (nodo actual), y finalmente el subárbol derecho (mayores), produciendo la secuencia ordenada.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'En el peor de los casos, si insertamos elementos que ya vienen ordenados (por ejemplo: 1, 2, 3, 4, 5) en un BST simple sin auto-balanceo, el árbol se degenera en una lista enlazada con complejidad de búsqueda O(N).'
    correctAnswer: true
    explanation: >-
      Verdadero. Al insertar elementos en orden monótono en un BST no balanceado, cada nuevo nodo se inserta siempre como hijo derecho, generando una estructura lineal de altura N y arruinando el beneficio logarítmico.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'En un BST perfectamente balanceado con N nodos, ¿cuál es la complejidad temporal de la operación de búsqueda `contiene(x)`?'
    options:
      - id: 'a'
        text: 'O(1)'
      - id: 'b'
        text: 'O(log N)'
      - id: 'c'
        text: 'O(N)'
      - id: 'd'
        text: 'O(N log N)'
    correctOptionId: 'b'
    explanation: >-
      Al estar balanceado, cada comparación en un nodo descarta la mitad de los elementos restantes del árbol, reduciendo el espacio de búsqueda a la altura del árbol $h = \lfloor \log_2 N \rfloor$.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Para encontrar el elemento mínimo en un BST, alcanza con descender iterativa o recursivamente por los punteros `izquierdo` hasta alcanzar un nodo cuyo hijo izquierdo sea `null`.'
    correctAnswer: true
    explanation: >-
      Verdadero. Debido al invariante de orden, el valor más pequeño de todo el árbol o subárbol siempre reside en el nodo más a la izquierda posible.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Para qué suele utilizarse frecuentemente el recorrido Post-Order (subárbol izquierdo, subárbol derecho, raíz)?'
    options:
      - id: 'a'
        text: 'Para clonar el árbol exactamente con la misma jerarquía de inserción.'
      - id: 'b'
        text: 'Para imprimir los datos ordenados alfabéticamente.'
      - id: 'c'
        text: 'Para liberar memoria, eliminar subárboles de abajo hacia arriba o evaluar expresiones matemáticas representadas en árboles de sintaxis.'
      - id: 'd'
        text: 'Para buscar el nodo raíz más rápidamente.'
    correctOptionId: 'c'
    explanation: >-
      Post-Order procesa primero los hijos antes que el padre, lo cual es ideal cuando el cálculo del padre depende enteramente del resultado consolidado de sus descendientes (como calcular el tamaño de carpetas o evaluar operadores aritméticos).
  - kind: 'true-false'
    id: 'q7'
    prompt: 'En Java, para que una clase genérica pueda usarse como clave en un BST sin requerir comparadores externos, debe implementar la interfaz `Comparable<T>` y definir `compareTo`.'
    correctAnswer: true
    explanation: >-
      Verdadero. El método `compareTo` provee el orden natural necesario para decidir hacia qué rama descender durante inserciones y búsquedas.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Cuál es la relación matemática entre el número de aristas de un árbol de N nodos y su cantidad de vértices?'
    options:
      - id: 'a'
        text: 'Tiene exactamente N + 1 aristas.'
      - id: 'b'
        text: 'Tiene exactamente N - 1 aristas.'
      - id: 'c'
        text: 'Tiene N * 2 aristas.'
      - id: 'd'
        text: 'Depende de si el árbol está balanceado o no.'
    correctOptionId: 'b'
    explanation: >-
      Todo árbol (como grafo conexo y acíclico) de N nodos contiene exactamente N - 1 aristas, dado que cada nodo excepto la raíz posee exactamente un único padre.
---
