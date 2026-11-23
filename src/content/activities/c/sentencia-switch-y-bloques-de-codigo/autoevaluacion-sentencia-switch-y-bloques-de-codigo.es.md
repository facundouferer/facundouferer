---
course: 'c'
lesson: 'sentencia-switch-y-bloques-de-codigo'
slug: 'autoevaluacion-sentencia-switch-y-bloques-de-codigo'
title: 'Autoevaluación: Switch y Bloques'
description: 'Once preguntas sobre switch, case, break y default, la caída al caso siguiente, casos agrupados, bloques de código y las instrucciones que alteran el flujo.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int opcion = 2;

          switch (opcion) {
              case 1:
                  printf("Uno\n");
              case 2:
                  printf("Dos\n");
              case 3:
                  printf("Tres\n");
                  break;
              default:
                  printf("Otro\n");
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Solo `Dos`.'
      - id: 'b'
        text: '`Dos` y `Tres`, en dos líneas.'
      - id: 'c'
        text: '`Dos`, `Tres` y `Otro`, en tres líneas.'
      - id: 'd'
        text: '`Uno`, `Dos` y `Tres`, en tres líneas.'
    correctOptionId: 'b'
    explanation: >-
      El `switch` salta a `case 2` y muestra `Dos`. Como no hay `break`, sigue
      con las sentencias de `case 3` y muestra `Tres`. Ahí el `break` corta el
      `switch`, así que `Otro` no se muestra. `case 1` no se ejecuta porque el
      salto entra directamente en `case 2`.
  - kind: 'true-false'
    id: 'q2'
    prompt: '`default` se ejecuta cuando ningún `case` coincide con el valor evaluado.'
    correctAnswer: true
    explanation: >-
      `default` es el caso por defecto. No es obligatorio, pero casi siempre
      conviene tenerlo para manejar valores inesperados.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué hace `break` dentro de un `switch`?'
    options:
      - id: 'a'
        text: 'Termina el programa.'
      - id: 'b'
        text: 'Salta al siguiente `case`.'
      - id: 'c'
        text: 'Sale del `switch` y la ejecución sigue con la primera sentencia después de él.'
      - id: 'd'
        text: 'Vuelve a evaluar la variable del `switch`.'
    correctOptionId: 'c'
    explanation: >-
      `break` corta el `switch` cuando ya se ejecutó el caso que correspondía.
      Sin él, la ejecución continúa con las sentencias del caso siguiente.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int dia = 7;

          switch (dia) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                  printf("Día hábil\n");
                  break;
              case 6:
              case 7:
                  printf("Fin de semana\n");
                  break;
              default:
                  printf("Día inválido\n");
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Día hábil`'
      - id: 'b'
        text: '`Fin de semana`'
      - id: 'c'
        text: '`Día inválido`'
      - id: 'd'
        text: '`Fin de semana` y `Día inválido`, en dos líneas.'
    correctOptionId: 'b'
    explanation: >-
      Varios `case` seguidos sin sentencias entre ellos comparten el mismo
      bloque. Con `dia = 7` el salto entra en `case 7`, muestra `Fin de semana`
      y el `break` impide llegar a `default`. Aquí la caída al caso siguiente es
      intencional.
  - kind: 'true-false'
    id: 'q5'
    prompt: '`switch` conviene cuando comparas una misma variable con varios valores concretos.'
    correctAnswer: true
    explanation: >-
      Ese es su uso natural: una opción de menú, un número de día, un código.
      Para rangos o condiciones combinadas, `if-else` es la herramienta
      adecuada.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Con `nivel = 3` el programa muestra una línea de más. ¿Cómo se corrige?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int nivel = 3;

          switch (nivel) {
              case 1:
                  printf("Básico\n");
                  break;
              case 2:
                  printf("Intermedio\n");
                  break;
              case 3:
                  printf("Avanzado\n");
              default:
                  printf("Nivel desconocido\n");
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Borrando el `default`.'
      - id: 'b'
        text: 'Agregando `break;` después de `printf("Avanzado\n");`.'
      - id: 'c'
        text: 'Cambiando `case 3:` por `case 3;`.'
      - id: 'd'
        text: 'Moviendo `default` al principio del `switch`.'
    correctOptionId: 'b'
    explanation: >-
      Sin `break` al final de `case 3`, la ejecución cae en `default` y muestra
      `Avanzado` y `Nivel desconocido`. Borrar `default` ocultaría el síntoma,
      pero dejaría sin manejar los valores inválidos.
  - kind: 'true-false'
    id: 'q7'
    prompt: '`continue` sirve para saltar al siguiente `case` de un `switch`.'
    correctAnswer: false
    explanation: >-
      `continue` es una instrucción de los ciclos: salta a la siguiente
      iteración. En un `switch`, lo que hace pasar al caso siguiente es la
      ausencia de `break`.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Qué es un bloque de código?'
    options:
      - id: 'a'
        text: 'Un conjunto de sentencias encerradas entre llaves `{}`.'
      - id: 'b'
        text: 'Cualquier línea que termina en `;`.'
      - id: 'c'
        text: 'Un comentario de varias líneas.'
      - id: 'd'
        text: 'Solo el cuerpo de la función `main`.'
    correctOptionId: 'a'
    explanation: >-
      Un bloque agrupa sentencias entre llaves. Aparece en `if`, `else`,
      `switch`, `while`, `for`, `do-while` y en el cuerpo de `main`, y deja
      claro qué instrucciones pertenecen a cada parte del flujo.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int a = 8;
          int b = 2;
          int operacion = 3;

          switch (operacion) {
              case 1:
                  printf("%d\n", a + b);
                  break;
              case 2:
                  printf("%d\n", a - b);
                  break;
              case 3:
                  printf("%d\n", a * b);
                  break;
              case 4:
                  printf("%d\n", a / b);
                  break;
              default:
                  printf("Operación inválida\n");
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`10`'
      - id: 'b'
        text: '`16`'
      - id: 'c'
        text: '`4`'
      - id: 'd'
        text: '`16` y `4`, en dos líneas.'
    correctOptionId: 'b'
    explanation: >-
      `operacion` vale 3, así que se ejecuta `a * b`, que es 16, y el `break`
      termina el `switch`.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'Si no hay `default` y ningún `case` coincide, el `switch` no ejecuta nada y el programa continúa después de él.'
    correctAnswer: true
    explanation: >-
      Sin coincidencias y sin `default`, no se ejecuta ninguna sentencia del
      `switch`. No es un error: el flujo sigue con la sentencia siguiente.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Dentro de `main`, ¿qué instrucción termina la ejecución del programa aunque esté dentro de un `case`?'
    options:
      - id: 'a'
        text: '`break;`'
      - id: 'b'
        text: '`default;`'
      - id: 'c'
        text: '`return 0;`'
      - id: 'd'
        text: '`continue;`'
    correctOptionId: 'c'
    explanation: >-
      `return` finaliza la función actual; en `main`, eso termina el programa.
      `break` solo sale del `switch` y `continue` pertenece a los ciclos.
---
