---
course: 'java'
lesson: '16-grafos-representacion-y-algoritmos'
slug: 'autoevaluacion-grafos-y-algoritmos'
title: 'Autoevaluación: Grafos, Representaciones, BFS, DFS y Dijkstra'
description: 'Evaluá tus conocimientos sobre teoría de grafos, matriz vs lista de adyacencia, recorridos BFS y DFS, y caminos mínimos con el algoritmo de Dijkstra.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Para un grafo disperso (con pocos aristas en relación a la cantidad de vértices), ¿por qué es preferible usar una Lista de Adyacencia en lugar de una Matriz de Adyacencia?'
    options:
      - id: 'a'
        text: 'Porque la matriz no permite guardar pesos numéricos.'
      - id: 'b'
        text: 'Porque la lista de adyacencia consume O(V + E) en memoria, mientras que la matriz consume O(V^2) desperdiciando espacio en ceros o celdas vacías.'
      - id: 'c'
        text: 'Porque la lista de adyacencia no necesita clases en Java.'
      - id: 'd'
        text: 'Porque la matriz de adyacencia solo admite grafos acíclicos.'
    correctOptionId: 'b'
    explanation: >-
      En redes del mundo real con miles de vértices y pocas conexiones (grafos dispersos), una matriz de $100.000 \times 100.000$ exigiría $10^{10}$ posiciones de memoria (inviable), mientras que la lista de adyacencia solo almacena las aristas existentes en espacio $O(V + E)$.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'La Búsqueda en Anchura (BFS) garantiza encontrar el camino más corto en cantidad de aristas (o saltos) entre dos nodos en cualquier grafo no ponderado.'
    correctAnswer: true
    explanation: >-
      Verdadero. Al explorar exhaustivamente por niveles concéntricos (primero a distancia 1, luego distancia 2, etc.) mediante una Cola FIFO, el primer momento en que BFS alcanza el nodo destino corresponde necesariamente al camino con menor número de saltos.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué estructura de datos es el motor fundamental para implementar el algoritmo de Dijkstra de forma eficiente?'
    options:
      - id: 'a'
        text: 'Una Pila (Stack) LIFO.'
      - id: 'b'
        text: 'Una Cola de Prioridad (PriorityQueue / Min-Heap).'
      - id: 'c'
        text: 'Un arreglo estático de booleanos.'
      - id: 'd'
        text: 'Un Árbol N-ario.'
    correctOptionId: 'b'
    explanation: >-
      Dijkstra es un algoritmo codicioso (*greedy*) que en cada paso extrae el nodo no visitado con la menor distancia acumulada hasta el momento. La Cola de Prioridad permite extraer este mínimo en tiempo $O(\log V)$.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'El algoritmo de Dijkstra funciona correctamente y garantiza la ruta óptima incluso si el grafo contiene aristas con pesos negativos.'
    correctAnswer: false
    explanation: >-
      Falso. Dijkstra asume que una vez que un nodo es extraído de la cola de prioridad con la distancia mínima actual, su costo nunca podrá reducirse en el futuro. Si existen aristas negativas, esta premisa se rompe (pudiendo existir ciclos de costo negativo). Para aristas negativas se debe recurrir al algoritmo de Bellman-Ford.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Cuál es la principal diferencia funcional entre BFS (Búsqueda en Anchura) y DFS (Búsqueda en Profundidad)?'
    options:
      - id: 'a'
        text: 'BFS explora nivel por nivel usando una Cola; DFS desciende por una rama hasta el fondo antes de retroceder (backtracking) usando una Pila o recursión.'
      - id: 'b'
        text: 'BFS solo funciona en árboles y DFS solo en grafos dirigidos.'
      - id: 'c'
        text: 'DFS siempre encuentra el camino más corto y BFS no.'
      - id: 'd'
        text: 'BFS requiere que las aristas tengan pesos mayores a 100.'
    correctOptionId: 'a'
    explanation: >-
      BFS se expande radialmente en amplitud mediante una Cola (FIFO), mientras que DFS profundiza por un camino hasta no poder avanzar más utilizando la pila de llamadas o una estructura Pila explícita (LIFO).
  - kind: 'true-false'
    id: 'q6'
    prompt: 'En un grafo no dirigido, si existe una arista entre el nodo A y el nodo B, la lista de adyacencia debe registrar a B como vecino de A, y también a A como vecino de B.'
    correctAnswer: true
    explanation: >-
      Verdadero. En un grafo no dirigido la relación es simétrica y bidireccional; por ende, la conexión debe representarse en las listas de vecinos de ambos vértices.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Qué mecanismo es indispensable incluir en BFS y DFS al recorrer un grafo con ciclos para evitar bucles infinitos?'
    options:
      - id: 'a'
        text: 'Un contador regresivo de llamadas.'
      - id: 'b'
        text: 'Una colección de nodos visitados (`Set<Vertice> visitados`) para no volver a encolar o procesar vértices ya explorados.'
      - id: 'c'
        text: 'Eliminar las aristas del grafo a medida que se recorren.'
      - id: 'd'
        text: 'Convertir el grafo a una matriz estática antes de comenzar.'
    correctOptionId: 'b'
    explanation: >-
      Como los grafos pueden tener ciclos o múltiples caminos hacia un mismo vértice, registrar los nodos visitados en un `Set` impide entrar en un bucle infinito y garantiza que cada vértice se procese una sola vez.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'En un grafo dirigido, el "grado de entrada" de un vértice es la cantidad de aristas que llegan a él, y el "grado de salida" es la cantidad de aristas que parten de él.'
    correctAnswer: true
    explanation: >-
      Verdadero. A diferencia de un grafo no dirigido donde solo existe el concepto de grado (total de aristas incidentes), en grafos dirigidos se distingue entre grado de entrada (*in-degree*) y grado de salida (*out-degree*).
---
