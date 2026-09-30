---
course: 'java'
lesson: '26-arboles-n-arios-y-representacion-con-vectores'
slug: 'autoevaluacion-arboles-n-arios'
title: 'Autoevaluación: Árboles N-arios, Jerarquías y Representación con Vectores'
description: 'Validá tus conocimientos sobre árboles generales, invariantes estructurales, transformación primer hijo / siguiente hermano y representación contigua en memoria.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'En un árbol N-ario válido con N nodos no vacíos, ¿cuántas relaciones padre-hijo (aristas) existen exactamente?'
    options:
      - id: 'a'
        text: 'N * 2'
      - id: 'b'
        text: 'N - 1'
      - id: 'c'
        text: 'N'
      - id: 'd'
        text: 'Depende de cuántos hijos tenga cada nodo en promedio.'
    correctOptionId: 'b'
    explanation: >-
      Todo árbol válido es conexo y acíclico; dado que cada nodo excepto la raíz posee exactamente un único padre, un árbol con N nodos contiene siempre exactamente N - 1 aristas o relaciones padre-hijo.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'En la transformación de un árbol N-ario a su representación binaria de "Primer Hijo / Siguiente Hermano", el enlace derecho de la raíz resultante DEBE ser estrictamente null en una estructura bien formada.'
    correctAnswer: true
    explanation: >-
      Verdadero. El enlace derecho representa el "siguiente hermano". Como la raíz de un árbol no tiene hermanos que compartan su nivel y padre, su enlace derecho debe ser nulo. Si existiera, representaría múltiples raíces o una estructura malformada.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Cómo opera el recorrido en Preorden sobre un árbol N-ario?'
    options:
      - id: 'a'
        text: 'Visita primero todas las hojas de izquierda a derecha y al final la raíz.'
      - id: 'b'
        text: 'Visita el nodo actual y luego ejecuta recursivamente el recorrido sobre cada uno de sus subárboles hijos de izquierda a derecha.'
      - id: 'c'
        text: 'Solo visita los nodos que tienen un número par de hijos.'
      - id: 'd'
        text: 'Visita primero el hijo izquierdo, luego la raíz y luego el hijo derecho.'
    correctOptionId: 'b'
    explanation: >-
      El preorden en árboles generales procesa la clave del nodo actual (padre) antes de descender a procesar los subárboles de sus descendientes en orden secuencial.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'La transformación "Primer Hijo / Siguiente Hermano" convierte el árbol N-ario en un Árbol Binario de Búsqueda (BST) donde los nodos menores van a la izquierda.'
    correctAnswer: false
    explanation: >-
      Falso. La transformación produce un árbol binario estructural donde los enlaces izquierdo y derecho codifican relaciones genealógicas (primer descendiente y hermano inmediato), no relaciones de orden o comparación numérica (`<` o `>`).
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué ventaja arquitectónica ofrece representar un árbol N-ario mediante vectores/arreglos de índices contiguos en lugar de grafos de referencias dispersas?'
    options:
      - id: 'a'
        text: 'Elimina la necesidad de conocer la raíz del árbol.'
      - id: 'b'
        text: 'Mejora drásticamente la localidad de referencia en la memoria caché del procesador y facilita la serialización directa de la estructura.'
      - id: 'c'
        text: 'Permite que un nodo tenga múltiples padres sin romper la definición de árbol.'
      - id: 'd'
        text: 'Reduce el tiempo de ejecución a O(0).'
    correctOptionId: 'b'
    explanation: >-
      Al almacenar los nodos en un vector contiguo e indexar las relaciones con enteros, se minimizan los saltos de memoria (*cache misses*) que ocurren al seguir punteros dispersos en el Heap, facilitando además guardar o transmitir el árbol de forma compacta.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Si un nodo en un árbol N-ario no posee ningún hijo en su lista de descendientes, se clasifica formalmente como un nodo hoja.'
    correctAnswer: true
    explanation: >-
      Verdadero. Por definición en teoría de árboles, una hoja (*leaf node*) es cualquier nodo cuyo grado de salida es 0 (no tiene hijos).
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Al modelar un sistema de archivos con carpetas y archivos mediante un árbol N-ario, ¿cómo se calcula el tamaño total de un directorio de forma orientada a objetos?'
    options:
      - id: 'a'
        text: 'Sumando el tamaño del directorio actual más la suma recursiva del tamaño de todos sus elementos hijos (patrón Composite).'
      - id: 'b'
        text: 'Multiplicando la profundidad del nodo por la cantidad de archivos.'
      - id: 'c'
        text: 'Solo consultando el tamaño declarado en la raíz.'
      - id: 'd'
        text: 'Contando únicamente la cantidad de carpetas sin considerar archivos.'
    correctOptionId: 'a'
    explanation: >-
      El patrón Composite modela hojas (archivos) y compuestos (directorios) bajo una misma interfaz; el tamaño de un directorio es la agregación recursiva del tamaño de sus hijos directos e indirectos.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'En una estructura de árbol, la presencia de un ciclo (un camino que partiendo de un nodo regresa a sí mismo a través de sus descendientes) es válida siempre que esté documentada.'
    correctAnswer: false
    explanation: >-
      Falso. Un árbol es por definición matemática un grafo acíclico y conexo. La presencia de un ciclo rompe la invariante de árbol, provocando bucles infinitos en cualquier algoritmo recursivo de recorrido.
---
