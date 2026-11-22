---
course: 'c'
lesson: 'programacion-esquematica-y-sentencias-anidadas'
slug: 'autoevaluacion-programacion-esquematica-y-sentencias-anidadas'
title: 'Autoevaluación: Programación Esquemática'
description: 'Once preguntas sobre secuencia, selección e iteración, refinamiento sucesivo, ciclos anidados, decisiones dentro de ciclos y errores típicos al combinar estructuras.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 18
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuáles son los tres esquemas básicos con los que se construye un programa?'
    options:
      - id: 'a'
        text: 'Variables, constantes y operadores.'
      - id: 'b'
        text: 'Secuencia, selección e iteración.'
      - id: 'c'
        text: '`if`, `switch` y `return`.'
      - id: 'd'
        text: 'Entrada, compilación y ejecución.'
    correctOptionId: 'b'
    explanation: >-
      Una acción después de otra (secuencia), elegir entre caminos (selección) y
      repetir mientras se cumpla una condición (iteración). Combinando estos
      tres esquemas se puede expresar una enorme cantidad de programas.
  - kind: 'single-choice'
    id: 'q2'
    prompt: 'Un programa debe leer números hasta que se ingrese 0 y contar cuántos son pares. ¿Qué esquemas necesita?'
    options:
      - id: 'a'
        text: 'Solo secuencia.'
      - id: 'b'
        text: 'Solo iteración.'
      - id: 'c'
        text: 'Iteración para leer varias veces, selección para decidir si cada número es par y secuencia para inicializar y mostrar el resultado.'
      - id: 'd'
        text: 'Selección para leer y secuencia para contar.'
    correctOptionId: 'c'
    explanation: >-
      Reconocer los esquemas antes de escribir código ordena la solución: un
      ciclo con un valor de corte, un `if` dentro del ciclo y las acciones
      secuenciales de preparación y cierre.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i;
          int j;

          for (i = 1; i <= 3; i = i + 1) {
              for (j = 1; j <= i; j = j + 1) {
                  printf("*");
              }
              printf("\n");
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Tres líneas con `***` cada una.'
      - id: 'b'
        text: 'Tres líneas: `*`, `**` y `***`.'
      - id: 'c'
        text: 'Una sola línea con seis asteriscos.'
      - id: 'd'
        text: 'Tres líneas: `***`, `**` y `*`.'
    correctOptionId: 'b'
    explanation: >-
      El ciclo interno se repite `i` veces, y `i` crece en cada vuelta del
      externo: 1, 2 y 3 asteriscos. El `printf("\n")` está en el ciclo externo,
      así que cierra cada fila.
  - kind: 'true-false'
    id: 'q4'
    prompt: 'Al terminar este fragmento, `contador` vale 7.'
    code: |-
      int i;
      int j;
      int contador = 0;

      for (i = 0; i < 4; i = i + 1) {
          for (j = 0; j < 3; j = j + 1) {
              contador = contador + 1;
          }
      }
    codeLanguage: 'c'
    correctAnswer: false
    explanation: >-
      En ciclos anidados las iteraciones se multiplican: el interno da 3 vueltas
      por cada una de las 4 del externo, así que `contador` vale 4 × 3 = 12. Se
      suman (4 + 3 = 7) solo si los ciclos van uno después del otro.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Si el usuario escribe `4`, `-2`, `7` y `0`, ¿qué muestra al final este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int numero;
          int suma = 0;

          printf("Número (0 para terminar): ");
          if (scanf("%d", &numero) != 1) {
              return 1;
          }
          while (numero != 0) {
              if (numero > 0) {
                  suma = suma + numero;
              }
              printf("Número (0 para terminar): ");
              if (scanf("%d", &numero) != 1) {
                  return 1;
              }
          }
          printf("La suma es %d\n", suma);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`La suma es 9`'
      - id: 'b'
        text: '`La suma es 11`'
      - id: 'c'
        text: '`La suma es 13`'
      - id: 'd'
        text: '`La suma es 4`'
    correctOptionId: 'b'
    explanation: >-
      El `if` dentro del `while` solo acumula los positivos: 4 + 7 = 11. El -2
      se lee pero no se suma, y el 0 corta el ciclo sin procesarse.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Cuál es el orden correcto para diseñar un programa con refinamiento sucesivo?'
    options:
      - id: 'a'
        text: 'Escribir el código, compilarlo y después pensar qué esquemas usa.'
      - id: 'b'
        text: 'Plantear un esquema general, refinarlo en pasos cada vez más precisos y recién después escribir el código.'
      - id: 'c'
        text: 'Elegir primero cuántos ciclos anidados va a tener y adaptar el problema a eso.'
      - id: 'd'
        text: 'Copiar un programa parecido y cambiar los nombres de las variables.'
    correctOptionId: 'b'
    explanation: >-
      Se va de lo general a lo particular: inicializar, repetir, decidir,
      mostrar; después se detalla cada paso hasta que cada uno es una o pocas
      sentencias. El código es el último nivel del refinamiento.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Cuantos más niveles de anidación tiene un programa, mejor diseñado está.'
    correctAnswer: false
    explanation: >-
      La anidación está bien cuando expresa una dependencia real (repetir y,
      dentro de cada repetición, decidir). Demasiados niveles hacen que no se
      entienda qué controla a qué; suele ser señal de que el diseño necesita
      simplificarse.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Este programa debería mostrar la suma de 1 hasta i para cada fila (1, 3 y 6), pero muestra 1, 4 y 10. ¿Cuál es la corrección?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i;
          int j;
          int suma = 0;

          for (i = 1; i <= 3; i = i + 1) {
              for (j = 1; j <= i; j = j + 1) {
                  suma = suma + j;
              }
              printf("Fila %d: %d\n", i, suma);
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Cambiar la condición del ciclo interno a `j < i`.'
      - id: 'b'
        text: 'Poner `suma = 0;` al comienzo del bloque del ciclo externo, antes del ciclo interno.'
      - id: 'c'
        text: 'Mover el `printf` dentro del ciclo interno.'
      - id: 'd'
        text: 'Poner `suma = 0;` dentro del ciclo interno, antes de acumular.'
    correctOptionId: 'b'
    explanation: >-
      El acumulador se inicializa una sola vez, fuera de todo, así que cada fila
      arrastra la suma de las anteriores (1, 1 + 3, 4 + 6). Cada fila es un
      cálculo nuevo: su estado inicial tiene que prepararse en cada vuelta del
      ciclo externo. Reiniciarlo dentro del interno dejaría solo el último `j`.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'La programación esquemática consiste en reconocer patrones de construcción (secuencia, selección, iteración) en lugar de improvisar la lógica cada vez.'
    correctAnswer: true
    explanation: >-
      Ese es su objetivo: pensar el problema con esquemas conocidos, combinarlos
      con criterio y refinarlos hasta llegar al código.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int n;
          int multiplosDeTres = 0;
          int pares = 0;

          for (n = 1; n <= 10; n = n + 1) {
              if (n % 3 == 0) {
                  multiplosDeTres = multiplosDeTres + 1;
              } else if (n % 2 == 0) {
                  pares = pares + 1;
              }
          }
          printf("%d %d\n", multiplosDeTres, pares);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3 5`'
      - id: 'b'
        text: '`3 4`'
      - id: 'c'
        text: '`4 3`'
      - id: 'd'
        text: '`3 3`'
    correctOptionId: 'b'
    explanation: >-
      Los múltiplos de 3 son 3, 6 y 9. El 6 es par, pero como la primera
      condición ya fue verdadera, el `else if` no se evalúa. Quedan como pares
      2, 4, 8 y 10: cuatro.
  - kind: 'true-false'
    id: 'q11'
    prompt: 'Este programa muestra `ABC`.'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i;

          for (i = 1; i <= 3; i = i + 1) {
              switch (i) {
                  case 1:
                      printf("A");
                      break;
                  case 2:
                      printf("B");
                  case 3:
                      printf("C");
                      break;
              }
          }
          printf("\n");
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: false
    explanation: >-
      Muestra `ABCC`. Con `i = 2` falta el `break`, así que después de `B` cae en
      `case 3` y muestra `C`. Con `i = 3` vuelve a mostrar `C`. Un `break`
      dentro de un `switch` solo sale del `switch`, no del `for`.
---
