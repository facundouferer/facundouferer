---
course: 'c'
lesson: 'sentencia-while'
slug: 'autoevaluacion-sentencia-while'
title: 'Autoevaluación: While'
description: 'Once preguntas sobre iteración con while: estado inicial, condición y actualización, seguimiento de ciclos, ciclos infinitos, break y continue.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuáles son los tres elementos que hay que pensar para diseñar bien un `while`?'
    options:
      - id: 'a'
        text: 'Estado inicial, condición de continuación y actualización del estado.'
      - id: 'b'
        text: '`break`, `continue` y `return`.'
      - id: 'c'
        text: 'Una variable `int`, un `printf` y un `scanf`.'
      - id: 'd'
        text: 'La condición, el `else` y el `default`.'
    correctOptionId: 'a'
    explanation: >-
      Antes del ciclo, las variables tienen un estado inicial; la condición
      decide si se repite; dentro del bloque, una actualización acerca el
      estado al final del ciclo. Si falta alguno, el ciclo suele estar mal
      pensado.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i = 1;

          while (i <= 10) {
              printf("%d ", i);
              i = i * 2;
          }
          printf("\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1 2 3 4 5 6 7 8 9 10`'
      - id: 'b'
        text: '`1 2 4 8`'
      - id: 'c'
        text: '`1 2 4 8 16`'
      - id: 'd'
        text: '`2 4 8`'
    correctOptionId: 'b'
    explanation: >-
      La actualización duplica `i`: 1, 2, 4, 8. Cuando `i` pasa a 16, la
      condición `16 <= 10` es falsa y el ciclo termina antes de mostrarlo.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'Este ciclo termina después de mostrar cinco números.'
    code: |-
      int i = 1;

      while (i <= 5) {
          printf("%d\n", i);
      }
    codeLanguage: 'c'
    correctAnswer: false
    explanation: >-
      Dentro del bloque nada cambia `i`, así que la condición `1 <= 5` es
      verdadera para siempre: es un ciclo infinito que muestra `1` sin parar.
      Falta la actualización `i = i + 1;`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i = 1;

          while (i <= 10) {
              if (i == 4) {
                  break;
              }
              printf("%d ", i);
              i = i + 1;
          }
          printf("\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1 2 3`'
      - id: 'b'
        text: '`1 2 3 4`'
      - id: 'c'
        text: '`1 2 3 5 6 7 8 9 10`'
      - id: 'd'
        text: '`4`'
    correctOptionId: 'a'
    explanation: >-
      Cuando `i` llega a 4, `break` sale del ciclo antes del `printf`. Por eso
      se muestran 1, 2 y 3, y el 4 no.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i = 1;

          while (i <= 5) {
              i = i + 1;
              if (i == 3) {
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
        text: '`1 2 4 5`'
      - id: 'b'
        text: '`2 4 5`'
      - id: 'c'
        text: '`2 4 5 6`'
      - id: 'd'
        text: '`2 3 4 5 6`'
    correctOptionId: 'c'
    explanation: >-
      La actualización está antes del `printf`, así que el primer valor
      mostrado es 2. Con `i == 3`, `continue` salta a la siguiente iteración sin
      mostrarlo. En la última vuelta `i` vale 5 al entrar, pasa a 6 y se
      muestra 6; después `6 <= 5` es falso.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Si la condición de un `while` es falsa desde el comienzo, el bloque no se ejecuta ninguna vez.'
    correctAnswer: true
    explanation: >-
      `while` evalúa la condición antes de cada iteración, incluida la
      primera. Si ya es falsa, el bloque se salta por completo.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int n = 20;
          int pasos = 0;

          while (n > 1) {
              n = n / 2;
              pasos = pasos + 1;
          }
          printf("%d\n", pasos);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3`'
      - id: 'b'
        text: '`4`'
      - id: 'c'
        text: '`5`'
      - id: 'd'
        text: '`10`'
    correctOptionId: 'b'
    explanation: >-
      `n` pasa por 20, 10, 5, 2 y 1 (la división entera descarta decimales: 5 /
      2 es 2). Son cuatro iteraciones; con `n = 1` la condición es falsa.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Este programa muestra `0` y `1` y después se queda colgado. ¿Cuál es el error?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i = 0;

          while (i < 5) {
              if (i == 2) {
                  continue;
              }
              printf("%d\n", i);
              i = i + 1;
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'La condición debería ser `i <= 5`.'
      - id: 'b'
        text: 'Con `i == 2`, `continue` salta la actualización `i = i + 1;`, así que `i` queda en 2 para siempre. Hay que actualizar `i` antes del `continue`.'
      - id: 'c'
        text: '`continue` no puede usarse dentro de un `while`.'
      - id: 'd'
        text: '`printf` debería ir después de la actualización.'
    correctOptionId: 'b'
    explanation: >-
      `continue` vuelve directamente a la condición. Si la actualización está
      después, no se ejecuta, el estado no cambia y la condición sigue siendo
      verdadera: ciclo infinito. Una corrección es `if (i == 2) { i = i + 1;
      continue; }`.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'Una iteración es cada repetición del bloque de un ciclo.'
    correctAnswer: true
    explanation: >-
      Si un ciclo ejecuta su bloque cinco veces, hubo cinco iteraciones. Seguir
      el estado iteración por iteración es la forma de entender un ciclo.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int suma = 0;
          int i = 1;

          while (i <= 4) {
              suma = suma + i;
              i = i + 1;
          }
          printf("%d %d\n", suma, i);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`10 4`'
      - id: 'b'
        text: '`10 5`'
      - id: 'c'
        text: '`6 4`'
      - id: 'd'
        text: '`15 5`'
    correctOptionId: 'b'
    explanation: >-
      `suma` acumula 1 + 2 + 3 + 4 = 10. El ciclo termina cuando `i` vale 5,
      porque es el primer valor que no cumple `i <= 4`; por eso `i` queda en 5,
      no en 4.
  - kind: 'true-false'
    id: 'q11'
    prompt: '`while` solo puede usarse cuando conoces de antemano el número exacto de repeticiones.'
    correctAnswer: false
    explanation: >-
      Es al revés: `while` es especialmente útil cuando la repetición depende
      de una condición y no sabes cuántas vueltas habrá, como dividir un número
      hasta llegar a 1 o leer datos hasta un valor de corte.
---
