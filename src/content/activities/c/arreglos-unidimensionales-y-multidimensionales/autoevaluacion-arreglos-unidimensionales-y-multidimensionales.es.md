---
course: 'c'
lesson: 'arreglos-unidimensionales-y-multidimensionales'
slug: 'autoevaluacion-arreglos-unidimensionales-y-multidimensionales'
title: 'Autoevaluación: Arreglos'
description: 'Doce preguntas sobre índices de 0 a n − 1, inicialización parcial y designada, el límite del arreglo, sizeof v / sizeof v[0], arreglos como parámetros con const y matrices en orden por filas.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'En un arreglo declarado como `int v[10];`, ¿cuál es el último índice válido?'
    options:
      - id: 'a'
        text: '`10`'
      - id: 'b'
        text: '`9`'
      - id: 'c'
        text: '`11`'
      - id: 'd'
        text: '`1`'
    correctOptionId: 'b'
    explanation: >-
      Los índices van de `0` a `n - 1`. Con 10 elementos, el último índice es 9;
      la cantidad (10) no es un índice válido.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int parcial[5] = {10, 20};
          int designado[5] = {[1] = 7, [4] = 9};

          printf("%d %d %d %d\n", parcial[1], parcial[3], designado[0], designado[4]);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`20 0 0 9`'
      - id: 'b'
        text: '`10 20 7 9`'
      - id: 'c'
        text: 'Valores impredecibles en `parcial[3]` y `designado[0]`.'
      - id: 'd'
        text: '`20 0 7 9`'
    correctOptionId: 'a'
    explanation: >-
      Con una lista parcial, los elementos que faltan valen 0: `parcial[3]` es 0.
      Un inicializador designado elige la posición y los elementos no nombrados
      también valen 0: `designado[0]` es 0 y `designado[4]` es 9. No hay basura
      porque los dos arreglos están inicializados.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'Si un programa accede a `v[5]` en un arreglo de 5 elementos, C detecta el error y termina el programa con un mensaje.'
    correctAnswer: false
    explanation: >-
      C no comprueba los límites. Acceder fuera del arreglo es comportamiento
      indefinido: puede no notarse nada, cambiar otra variable o terminar el
      programa. Validar los índices es responsabilidad de quien programa.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Este programa quiere sumar los cuatro elementos de `v`. ¿Cuál es el error?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int v[4] = {3, 5, 7, 9};
          int suma = 0;

          for (size_t i = 0; i <= 4; i++) {
              suma += v[i];
          }
          printf("%d\n", suma);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Ninguno: muestra `24`.'
      - id: 'b'
        text: 'La condición `i <= 4` lee `v[4]`, fuera del límite. Debe ser `i < 4`.'
      - id: 'c'
        text: 'El índice tendría que empezar en `1`.'
      - id: 'd'
        text: '`suma` tendría que ser un `size_t`.'
    correctOptionId: 'b'
    explanation: >-
      Los índices válidos son 0 a 3. Con `<=` el ciclo hace una vuelta de más y
      lee `v[4]`: comportamiento indefinido (con `-fsanitize=address` se ve como
      `stack-buffer-overflow`). La condición correcta usa `<` estricto.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          double temperaturas[] = {21.5, 23.0, 19.8, 25.1, 22.4, 20.0, 18.7};
          size_t cantidad = sizeof temperaturas / sizeof temperaturas[0];

          printf("%zu %.1f\n", cantidad, temperaturas[cantidad - 1]);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`56 18.7`'
      - id: 'b'
        text: '`7 18.7`'
      - id: 'c'
        text: '`8 18.7`'
      - id: 'd'
        text: '`7 21.5`'
    correctOptionId: 'b'
    explanation: >-
      `sizeof temperaturas` es el tamaño total en bytes; dividido por el tamaño de
      un elemento da la cantidad: 7. El último índice es `cantidad - 1`, es decir
      6, que guarda 18.7.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Una función recibe `const int v[]`. ¿Por qué necesita además un parámetro `size_t n`?'
    options:
      - id: 'a'
        text: 'Porque dentro de la función `sizeof v / sizeof v[0]` no da la cantidad de elementos del arreglo del llamador.'
      - id: 'b'
        text: 'Porque sin `n` el compilador no acepta el `const`.'
      - id: 'c'
        text: 'No lo necesita: `sizeof v / sizeof v[0]` funciona igual dentro de la función.'
    correctOptionId: 'a'
    explanation: >-
      La fórmula con `sizeof` solo funciona donde el arreglo está declarado. Dentro
      de la función da otro número (GCC y Clang lo advierten), así que la cantidad
      se calcula en el llamador y viaja como argumento.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Este programa muestra `9`.'
    code: |-
      #include <stdio.h>

      void sumar_a_todos(int v[], size_t n, int cantidad) {
          for (size_t i = 0; i < n; i++) {
              v[i] += cantidad;
          }
      }

      int main(void) {
          int puntos[] = {8, 6, 10};

          sumar_a_todos(puntos, 3, 1);
          printf("%d\n", puntos[0]);
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: true
    explanation: >-
      Con arreglos no se copian los elementos: la función trabaja sobre el arreglo
      del llamador, así que `puntos[0]` pasa de 8 a 9. El argumento se sigue
      pasando por valor; la lección `punteros-arreglos-y-estructuras` explica qué
      valor se copia.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Si `a` y `b` son arreglos de 5 `int`, la sentencia `a = b;` copia todos los elementos de `b` en `a`.'
    correctAnswer: false
    explanation: >-
      Un arreglo no se puede asignar entero: `a = b;` no compila. Hay que copiar
      elemento por elemento con un ciclo.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int m[3][4] = {
              {1, 2, 3, 4},
              {5, 6, 7, 8},
              {9, 10, 11, 12},
          };

          printf("%d %zu\n", m[2][1], sizeof m / sizeof m[0]);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`7 4`'
      - id: 'b'
        text: '`10 3`'
      - id: 'c'
        text: '`6 12`'
      - id: 'd'
        text: '`10 12`'
    correctOptionId: 'b'
    explanation: >-
      `m[2][1]` es fila 2 (la tercera), columna 1 (la segunda): 10. `sizeof m[0]`
      es el tamaño de una fila completa, así que `sizeof m / sizeof m[0]` da la
      cantidad de filas: 3.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'En `int m[3][4]`, ¿qué elemento está en memoria inmediatamente después de `m[0][3]`?'
    options:
      - id: 'a'
        text: '`m[1][3]`'
      - id: 'b'
        text: '`m[0][4]`, que es un elemento válido.'
      - id: 'c'
        text: '`m[1][0]`'
    correctOptionId: 'c'
    explanation: >-
      C guarda las matrices en orden por filas: las filas quedan una detrás de
      otra. Después del último elemento de la fila 0 viene el primero de la fila
      1. `m[0][4]` no es un índice válido: las columnas van de 0 a 3.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Una función recibe una matriz de `FILAS` por `COLUMNAS` y la recorre. ¿Cuál es el parámetro correcto?'
    options:
      - id: 'a'
        text: '`int m[][]`, con las dos cantidades como parámetros aparte.'
      - id: 'b'
        text: '`int m[][COLUMNAS]`, con la cantidad de filas como parámetro aparte.'
      - id: 'c'
        text: '`int m[FILAS][]`, con la cantidad de columnas como parámetro aparte.'
    correctOptionId: 'b'
    explanation: >-
      El compilador necesita la cantidad de columnas para saber dónde empieza cada
      fila en la memoria continua. La cantidad de filas viaja aparte, igual que la
      cantidad de elementos de un arreglo común.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'Si una función recibe `const int v[]` y por error escribe `v[0] = 0;`, el compilador rechaza el programa.'
    correctAnswer: true
    explanation: >-
      `const` promete que la función solo lee el arreglo. Asignar a un elemento
      rompe esa promesa y es un error de compilación. Usa `const` siempre que la
      función no deba modificar el arreglo.
---
