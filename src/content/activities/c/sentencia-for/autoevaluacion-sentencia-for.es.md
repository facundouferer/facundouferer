---
course: 'c'
lesson: 'sentencia-for'
slug: 'autoevaluacion-sentencia-for'
title: 'Autoevaluación: For'
description: 'Once preguntas sobre las tres partes del for y su orden de ejecución, seguimiento de contadores, equivalencia con while, errores de límite y el punto y coma después del encabezado.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'En `for (inicializacion; condicion; actualizacion)`, ¿en qué orden se ejecutan las partes?'
    options:
      - id: 'a'
        text: 'Las tres partes se ejecutan una vez antes de cada iteración.'
      - id: 'b'
        text: 'La inicialización una sola vez al comienzo; la condición antes de cada iteración; la actualización al final de cada vuelta.'
      - id: 'c'
        text: 'La actualización primero, después la condición y por último la inicialización.'
      - id: 'd'
        text: 'La condición una sola vez al comienzo; la inicialización y la actualización en cada vuelta.'
    correctOptionId: 'b'
    explanation: >-
      `for` concentra en una línea los tres elementos de cualquier ciclo, pero
      cada uno tiene su momento: preparar el estado una vez, decidir antes de
      cada vuelta si se repite y actualizar al terminar cada vuelta.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i;

          for (i = 10; i > 0; i = i - 3) {
              printf("%d ", i);
          }
          printf("\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`10 7 4 1`'
      - id: 'b'
        text: '`10 7 4 1 -2`'
      - id: 'c'
        text: '`10 7 4`'
      - id: 'd'
        text: '`7 4 1`'
    correctOptionId: 'a'
    explanation: >-
      El contador baja de 3 en 3: 10, 7, 4, 1. La siguiente actualización deja
      `i` en -2 y la condición `-2 > 0` es falsa, así que -2 no se muestra.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'La inicialización de un `for` se ejecuta antes de cada iteración.'
    correctAnswer: false
    explanation: >-
      La inicialización se ejecuta una sola vez, al comienzo. Lo que se evalúa
      antes de cada iteración es la condición.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i;

          for (i = 1; i <= 6; i = i + 1) {
              if (i % 2 == 0) {
                  continue;
              }
              printf("%d ", i);
          }
          printf("\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`2 4 6`'
      - id: 'b'
        text: '`1 3 5`'
      - id: 'c'
        text: '`1`'
      - id: 'd'
        text: '`1 2 3 4 5 6`'
    correctOptionId: 'b'
    explanation: >-
      Con los pares, `continue` salta el `printf`. En un `for`, después del
      `continue` igual se ejecuta la actualización, así que el ciclo sigue
      normalmente con el número siguiente.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Este programa debería mostrar los números del 1 al 5, pero muestra `1 2 3 4`. ¿Cómo se corrige?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i;

          for (i = 1; i < 5; i = i + 1) {
              printf("%d ", i);
          }
          printf("\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Cambiando la inicialización a `i = 0`.'
      - id: 'b'
        text: 'Cambiando la condición a `i <= 5`.'
      - id: 'c'
        text: 'Cambiando la actualización a `i = i + 2`.'
      - id: 'd'
        text: 'Agregando un `break` dentro del bloque.'
    correctOptionId: 'b'
    explanation: >-
      Es un error de límite: con `i < 5` la última vuelta es con `i = 4`. Para
      incluir el 5 la condición tiene que ser `i <= 5`. Empezar en 0 mostraría
      `0 1 2 3 4`.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Este programa muestra `3`.'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i;
          int vueltas = 0;

          for (i = 0; i < 3; i = i + 1) {
              vueltas = vueltas + 1;
          }
          printf("%d\n", i);
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: true
    explanation: >-
      El ciclo da tres vueltas (con `i` igual a 0, 1 y 2). Después de la última
      actualización `i` vale 3, la condición `3 < 3` es falsa y el ciclo
      termina con `i = 3`.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Qué `while` es equivalente a `for (i = 1; i <= 5; i = i + 1) { printf("%d\n", i); }`?'
    options:
      - id: 'a'
        text: '`i = 1; while (i <= 5) { printf("%d\n", i); i = i + 1; }`'
      - id: 'b'
        text: '`i = 1; while (i <= 5) { i = i + 1; printf("%d\n", i); }`'
      - id: 'c'
        text: '`while (i <= 5) { i = 1; printf("%d\n", i); i = i + 1; }`'
      - id: 'd'
        text: '`i = 1; while (i <= 5) { printf("%d\n", i); }`'
    correctOptionId: 'a'
    explanation: >-
      La inicialización va antes del ciclo, la condición en el `while` y la
      actualización al final del bloque. La opción b muestra 2 a 6; la c
      reinicia `i` en cada vuelta y nunca termina; la d no actualiza y tampoco
      termina.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i;

          for (i = 1; i <= 3; i = i + 1);
          {
              printf("%d\n", i);
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1`, `2` y `3`, en tres líneas.'
      - id: 'b'
        text: 'Solo `4`, una vez.'
      - id: 'c'
        text: 'Solo `3`, una vez.'
      - id: 'd'
        text: 'Nada: el bloque nunca se ejecuta.'
    correctOptionId: 'b'
    explanation: >-
      El `;` después del encabezado es el cuerpo del ciclo: una sentencia
      vacía. El ciclo da sus tres vueltas sin hacer nada y deja `i` en 4.
      Después, el bloque entre llaves se ejecuta una sola vez y muestra `4`.
      La corrección es quitar ese `;`.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'Este programa muestra `5`.'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i;

          for (i = 1; i <= 10; i = i + 1) {
              if (i * i > 20) {
                  break;
              }
          }
          printf("%d\n", i);
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: true
    explanation: >-
      Los cuadrados son 1, 4, 9, 16 y 25. Con `i = 5`, `25 > 20` es verdadero y
      `break` sale del ciclo sin ejecutar la actualización, así que `i` queda
      en 5.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i;
          int suma = 0;

          for (i = 1; i <= 5; i = i + 1) {
              suma = suma + i * i;
          }
          printf("%d\n", suma);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`15`'
      - id: 'b'
        text: '`25`'
      - id: 'c'
        text: '`55`'
      - id: 'd'
        text: '`225`'
    correctOptionId: 'c'
    explanation: >-
      Se acumulan los cuadrados de 1 a 5: 1 + 4 + 9 + 16 + 25 = 55. 15 sería la
      suma de los números sin elevar y 225 el cuadrado de esa suma.
  - kind: 'true-false'
    id: 'q11'
    prompt: 'Todo lo que se escribe con `for` puede escribirse también con `while`.'
    correctAnswer: true
    explanation: >-
      Los dos comparten la misma lógica de repetición: estado inicial,
      condición y actualización. `for` las junta en una línea y conviene cuando
      hay un contador claro; `while` conviene cuando la repetición depende de
      una condición.
---
