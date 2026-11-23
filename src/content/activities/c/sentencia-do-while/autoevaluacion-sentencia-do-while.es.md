---
course: 'c'
lesson: 'sentencia-do-while'
slug: 'autoevaluacion-sentencia-do-while'
title: 'Autoevaluación: Do-While'
description: 'Once preguntas sobre do-while: cuándo se evalúa la condición, la ejecución garantizada del bloque, la comparación con while, la validación de entradas y los errores de sintaxis típicos.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuál es la diferencia fundamental entre `while` y `do-while`?'
    options:
      - id: 'a'
        text: '`do-while` repite más rápido que `while`.'
      - id: 'b'
        text: '`do-while` evalúa la condición después de ejecutar el bloque; `while` la evalúa antes.'
      - id: 'c'
        text: '`do-while` no admite condiciones con `&&` ni `||`.'
      - id: 'd'
        text: '`do-while` solo puede repetir el bloque una vez.'
    correctOptionId: 'b'
    explanation: >-
      La diferencia está en el momento de la evaluación. Como `do-while`
      pregunta al final, el bloque se ejecuta al menos una vez, aunque la
      condición sea falsa desde el principio.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Este programa no muestra nada, porque `numero < 5` es falso.'
    code: |-
      #include <stdio.h>

      int main(void) {
          int numero = 10;

          do {
              printf("El número es %d\n", numero);
          } while (numero < 5);
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: false
    explanation: >-
      El bloque se ejecuta antes de evaluar la condición, así que se muestra
      `El número es 10` una vez. Recién después se evalúa `10 < 5`, que es
      falso, y el ciclo termina.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int a = 5;
          int b = 5;

          while (a < 3) {
              a = a + 1;
          }
          do {
              b = b + 1;
          } while (b < 3);

          printf("%d %d\n", a, b);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`5 5`'
      - id: 'b'
        text: '`6 6`'
      - id: 'c'
        text: '`5 6`'
      - id: 'd'
        text: '`3 3`'
    correctOptionId: 'c'
    explanation: >-
      Con la misma condición falsa desde el inicio, el `while` no ejecuta su
      bloque (`a` queda en 5) y el `do-while` lo ejecuta una vez (`b` pasa a 6).
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Este fragmento no compila. ¿Cuál es el error?'
    code: |-
      int i = 1;

      do {
          printf("%d\n", i);
          i = i + 1;
      } while (i <= 3)
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Falta el `;` después de `while (i <= 3)`: en `do-while` forma parte de la sintaxis.'
      - id: 'b'
        text: 'El bloque del `do` no puede tener dos sentencias.'
      - id: 'c'
        text: 'La condición debe ir antes de `do`.'
      - id: 'd'
        text: 'Falta un `break` dentro del bloque.'
    correctOptionId: 'a'
    explanation: >-
      A diferencia de `while`, en `do-while` la condición va al final y la
      sentencia termina con `;`: `} while (i <= 3);`. Olvidarlo es un error de
      sintaxis.
  - kind: 'true-false'
    id: 'q5'
    prompt: '`do-while` garantiza que su bloque se ejecuta al menos una vez.'
    correctAnswer: true
    explanation: >-
      Como la condición se evalúa después del bloque, la primera ejecución
      ocurre siempre. Por eso es útil para menús y para pedir un dato hasta que
      sea válido.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i = 3;

          do {
              printf("%d ", i);
              i = i - 1;
          } while (i > 0);
          printf("¡Ya!\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3 2 1 0 ¡Ya!`'
      - id: 'b'
        text: '`3 2 1 ¡Ya!`'
      - id: 'c'
        text: '`2 1 0 ¡Ya!`'
      - id: 'd'
        text: '`3 ¡Ya!`'
    correctOptionId: 'b'
    explanation: >-
      Se muestran 3, 2 y 1. Después de mostrar 1, `i` pasa a 0 y `0 > 0` es
      falso, así que el ciclo termina y se muestra `¡Ya!`.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿En qué caso conviene más `do-while` que `while`?'
    options:
      - id: 'a'
        text: 'Cuando el bloque podría no necesitar ejecutarse nunca.'
      - id: 'b'
        text: 'Cuando hay que mostrar un menú y leer una opción al menos una vez antes de decidir si se repite.'
      - id: 'c'
        text: 'Cuando se conoce de antemano el número exacto de repeticiones.'
      - id: 'd'
        text: 'Cuando el ciclo no tiene condición.'
    correctOptionId: 'b'
    explanation: >-
      Un menú siempre se muestra al menos una vez y la decisión de repetir
      depende de lo que elige el usuario. Para una cantidad fija de pasos, `for`
      suele ser más claro.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Si el usuario escribe `12`, luego `-1` y luego `8`, ¿cuántas veces se muestra `Nota (0 a 10): `?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int nota;

          do {
              printf("Nota (0 a 10): ");
              if (scanf("%d", &nota) != 1) {
                  return 1;
              }
          } while (nota < 0 || nota > 10);

          printf("Nota registrada: %d\n", nota);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '1'
      - id: 'b'
        text: '2'
      - id: 'c'
        text: '3'
      - id: 'd'
        text: '4'
    correctOptionId: 'c'
    explanation: >-
      El mensaje se muestra antes de cada lectura. 12 y -1 hacen verdadera la
      condición (están fuera de rango) y el ciclo se repite; con 8 la condición
      es falsa y termina. Son tres lecturas, así que tres mensajes, y al final
      `Nota registrada: 8`.
  - kind: 'true-false'
    id: 'q9'
    prompt: '`break` también puede cortar un `do-while` antes de llegar a la condición.'
    correctAnswer: true
    explanation: >-
      `break` sale inmediatamente del ciclo que lo contiene, sea `while`, `for`
      o `do-while`. La condición del final ya no se evalúa.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int n = 0;
          int digitos = 0;

          do {
              digitos = digitos + 1;
              n = n / 10;
          } while (n > 0);

          printf("%d\n", digitos);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`0`'
      - id: 'b'
        text: '`1`'
      - id: 'c'
        text: '`10`'
      - id: 'd'
        text: 'Nada: es un ciclo infinito.'
    correctOptionId: 'b'
    explanation: >-
      El bloque se ejecuta una vez y cuenta un dígito; después `0 > 0` es falso.
      Es el resultado correcto: 0 tiene un dígito. Con un `while (n > 0)` el
      bloque no se ejecutaría y el resultado sería 0.
  - kind: 'true-false'
    id: 'q11'
    prompt: 'En `do-while` la condición se escribe antes del bloque.'
    correctAnswer: false
    explanation: >-
      La forma es `do { ... } while (condicion);`: primero el bloque y después
      la condición, que es justamente lo que hace que se evalúe al final.
---
