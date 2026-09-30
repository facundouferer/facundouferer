---
course: 'java'
lesson: '23-algoritmia-verificacion-y-complejidad'
slug: 'autoevaluacion-algoritmia-y-complejidad'
title: 'Autoevaluación: Especificación, Verificación y Complejidad Asintótica'
description: 'Comprobá tus conocimientos sobre contratos de algoritmos, cálculo de Big O, búsqueda binaria e invariantes de bucle.'
kind: 'quiz'
order: 2
lang: 'es'
published: true
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuál es la función de una precondición en el contrato formal de un algoritmo?'
    options:
      - id: 'a'
        text: 'Garantizar el tiempo exacto en milisegundos que demorará la ejecución.'
      - id: 'b'
        text: 'Establecer los requisitos que los datos de entrada deben cumplir antes de ejecutar el algoritmo para garantizar un resultado válido.'
      - id: 'c'
        text: 'Definir el tipo de retorno que la función debe devolver en caso de éxito.'
      - id: 'd'
        text: 'Obligar a que el algoritmo utilice recursión en lugar de bucles.'
    correctOptionId: 'b'
    explanation: >-
      Una precondición define el estado o propiedades que las entradas deben satisfacer obligatoriamente antes de la ejecución (por ejemplo, que un array no sea null o esté ordenado). Si el llamador viola la precondición, el algoritmo no garantiza la postcondición.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Por qué la expresión `(inicio + fin) / 2` puede provocar un fallo al calcular el punto medio en un array muy grande?'
    options:
      - id: 'a'
        text: 'Porque Java no permite divisiones enteras entre variables de tipo int.'
      - id: 'b'
        text: 'Porque si la suma `inicio + fin` supera `Integer.MAX_VALUE`, desborda a un número negativo produciendo un `ArrayIndexOutOfBoundsException`.'
      - id: 'c'
        text: 'Porque la JVM siempre redondea hacia arriba en las divisiones de enteros.'
      - id: 'd'
        text: 'Porque la notación Big O prohíbe realizar operaciones aritméticas dentro de un bucle while.'
    correctOptionId: 'b'
    explanation: >-
      Si los índices son suficientemente grandes, su suma puede desbordar el rango de un `int` de 32 bits con signo y dar un valor negativo. La fórmula `inicio + (fin - inicio) / 2` calcula exactamente el mismo punto medio matemático pero previene el desbordamiento.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'La precondición indispensable para que la búsqueda binaria funcione correctamente sobre un array es que sus elementos se encuentren previamente ordenados.'
    correctAnswer: true
    explanation: >-
      Verdadero. La búsqueda binaria se basa en descartar la mitad del espacio de búsqueda en cada paso comparando el valor medio. Si los elementos no están ordenados, esta premisa se rompe y el algoritmo puede descartar la mitad donde realmente reside el objetivo.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Cuál es la complejidad temporal asintótica en el peor caso de la búsqueda binaria sobre un array ordenado de tamaño $n$?'
    options:
      - id: 'a'
        text: 'O(1)'
      - id: 'b'
        text: 'O(log n)'
      - id: 'c'
        text: 'O(n)'
      - id: 'd'
        text: 'O(n^2)'
    correctOptionId: 'b'
    explanation: >-
      En cada iteración, el espacio de búsqueda se divide por la mitad ($n, n/2, n/4, \dots$). El número máximo de divisiones posibles hasta llegar a un solo elemento es $\log_2(n)$, lo que da una complejidad temporal $O(\log n)$.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Un algoritmo con complejidad $O(n)$ siempre se ejecuta en menos milisegundos reales que uno con complejidad $O(n^2)$, sin importar el tamaño de la entrada $n$.'
    correctAnswer: false
    explanation: >-
      Falso. La notación Big O modela el comportamiento cuando $n$ tiende a infinito (asintótico). Para valores de $n$ muy pequeños, factores constantes u operaciones de inicialización pueden hacer que un algoritmo $O(n^2)$ termine en menos milisegundos que uno $O(n)$.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'En el análisis de algoritmos, ¿qué representa un "invariante de bucle"?'
    options:
      - id: 'a'
        text: 'Una variable que nunca puede ser modificada por ningún método de la clase.'
      - id: 'b'
        text: 'Una propiedad lógica que es verdadera antes y después de cada iteración del bucle, y que ayuda a demostrar formalmente su corrección.'
      - id: 'c'
        text: 'Un bucle infinito provocado por una condición de parada mal diseñada.'
      - id: 'd'
        text: 'El número de veces que el recolector de basura de la JVM suspende la ejecución.'
    correctOptionId: 'b'
    explanation: >-
      Un invariante de bucle es una afirmación sobre el estado del cómputo que se mantiene invariablemente cierta al inicio y al final de cada iteración, permitiendo deducir la postcondición final cuando el bucle concluye.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Cuál es la complejidad temporal en el peor caso del siguiente método para verificar duplicados en un array?'
    code: |
      public static boolean tieneDuplicados(int[] datos) {
          for (int i = 0; i < datos.length; i++) {
              for (int j = i + 1; j < datos.length; j++) {
                  if (datos[i] == datos[j]) {
                      return true;
                  }
              }
          }
          return false;
      }
    options:
      - id: 'a'
        text: 'O(1)'
      - id: 'b'
        text: 'O(log n)'
      - id: 'c'
        text: 'O(n)'
      - id: 'd'
        text: 'O(n^2)'
    correctOptionId: 'd'
    explanation: >-
      El método utiliza dos bucles anidados donde el bucle externo corre $n$ veces y el interno corre aproximadamente $n/2$ veces en promedio. La cantidad total de comparaciones es $\frac{n(n-1)}{2}$, lo cual corresponde a una complejidad asintótica $O(n^2)$.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'La complejidad espacial auxiliar de un algoritmo mide la memoria adicional que este requiere durante su ejecución, sin incluir el espacio ocupado por los datos de entrada originales.'
    correctAnswer: true
    explanation: >-
      Verdadero. El espacio auxiliar contabiliza únicamente las estructuras y variables locales adicionales asignadas durante el cómputo. Por ejemplo, una búsqueda binaria iterativa utiliza $O(1)$ de memoria auxiliar.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Por qué las pruebas unitarias basadas en ejemplos particulares no demuestran de forma definitiva la corrección total de un algoritmo?'
    options:
      - id: 'a'
        text: 'Porque las pruebas unitarias solo funcionan en entornos con bases de datos.'
      - id: 'b'
        text: 'Porque las pruebas confirman la presencia de errores en los casos probados, pero no pueden demostrar su ausencia en todo el espacio de posibles entradas.'
      - id: 'c'
        text: 'Porque la JVM altera los algoritmos en tiempo de ejecución al optimizarlos con el JIT.'
      - id: 'd'
        text: 'Porque solo la recursión garantiza matemáticamente la ausencia de fallos.'
    correctOptionId: 'b'
    explanation: >-
      Como formuló Edsger Dijkstra: las pruebas muestran la presencia de errores, pero nunca pueden demostrar su ausencia absoluta. La especificación formal y el razonamiento por invariantes complementan las pruebas aportando garantías sobre propiedades generales.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'Un valor centinela es una respuesta especial (como `-1` en una búsqueda de índice) utilizada para señalar una condición excepcional o dato ausente cuando se documenta explícitamente en el contrato.'
    correctAnswer: true
    explanation: >-
      Verdadero. Cuando un método no utiliza excepciones, un centinela documentado (cuyo valor se sabe que no colisiona con una respuesta válida, como un índice negativo) permite al llamador comprobar de forma determinista si la operación tuvo éxito o no.
---
