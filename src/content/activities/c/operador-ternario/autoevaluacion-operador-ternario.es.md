---
course: 'c'
lesson: 'operador-ternario'
slug: 'autoevaluacion-operador-ternario'
title: 'Autoevaluación: Operador ternario'
description: 'Once preguntas sobre la sintaxis del operador ternario, su equivalencia con if-else, el valor que produce, cuándo conviene usarlo y cómo detectar errores en expresiones ternarias.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 12
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Por qué el operador `? :` se llama ternario?'
    options:
      - id: 'a'
        text: 'Porque solo puede usarse tres veces en un programa.'
      - id: 'b'
        text: 'Porque trabaja con tres partes: la condición, el valor si es verdadera y el valor si es falsa.'
      - id: 'c'
        text: 'Porque siempre devuelve 0, 1 o 2.'
      - id: 'd'
        text: 'Porque necesita tres variables declaradas antes.'
    correctOptionId: 'b'
    explanation: >-
      Un operador ternario tiene tres operandos: `condicion ? valor_si_verdadero
      : valor_si_falso`. Así como `+` es binario (dos operandos), `? :` es
      ternario.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int a = 12;
          int b = 5;
          int menor = a < b ? a : b;
          int mayor = a > b ? a : b;

          printf("%d %d\n", menor, mayor);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`12 5`'
      - id: 'b'
        text: '`5 12`'
      - id: 'c'
        text: '`1 0`'
      - id: 'd'
        text: '`5 5`'
    correctOptionId: 'b'
    explanation: >-
      `12 < 5` es falso, así que `menor` recibe `b` (5). `12 > 5` es verdadero,
      así que `mayor` recibe `a` (12). El ternario devuelve uno de los dos
      valores, no el resultado de la comparación.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'El ternario es una estructura de control igual que `if-else`, por eso no produce ningún valor.'
    correctAnswer: false
    explanation: >-
      Es al revés: `if-else` es una estructura de control, mientras que el
      ternario es un operador que forma una expresión y produce un valor. Por
      eso puede usarse a la derecha de una asignación o como argumento de
      `printf`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int stock = 0;

          printf("%s\n", stock > 0 ? "Disponible" : "Agotado");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Disponible`'
      - id: 'b'
        text: '`Agotado`'
      - id: 'c'
        text: '`0`'
      - id: 'd'
        text: 'No compila: un ternario no puede ir dentro de `printf`.'
    correctOptionId: 'b'
    explanation: >-
      `0 > 0` es falso, así que la expresión vale `"Agotado"` y `printf` lo
      muestra con `%s`. Como el ternario produce un valor, puede usarse
      directamente como argumento.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué `if-else` es equivalente a `int signo = x >= 0 ? 1 : -1;`?'
    options:
      - id: 'a'
        text: '`int signo; if (x >= 0) { signo = -1; } else { signo = 1; }`'
      - id: 'b'
        text: '`int signo; if (x > 0) { signo = 1; } else { signo = -1; }`'
      - id: 'c'
        text: '`int signo; if (x >= 0) { signo = 1; } else { signo = -1; }`'
      - id: 'd'
        text: '`int signo; if (x >= 0) { signo = 1; }`'
    correctOptionId: 'c'
    explanation: >-
      El valor después de `?` corresponde a la condición verdadera y el valor
      después de `:` a la falsa. La opción b cambia la condición (con `x = 0`
      daría -1) y la d deja `signo` sin valor cuando `x` es negativo.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Este programa muestra `12`.'
    code: |-
      #include <stdio.h>

      int main(void) {
          int puntos = 7;
          int bonus = puntos >= 10 ? 5 : 0;

          printf("%d\n", puntos + bonus);
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: false
    explanation: >-
      `7 >= 10` es falso, así que `bonus` vale 0 y se muestra `7`. Para recibir
      el bonus de 5 hacen falta 10 puntos o más.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿En qué caso es mejor usar `if-else` en lugar del ternario?'
    options:
      - id: 'a'
        text: 'Cuando hay que elegir entre dos números para guardarlos en una variable.'
      - id: 'b'
        text: 'Cuando cada camino tiene varios pasos (mostrar mensajes, actualizar variables, validar).'
      - id: 'c'
        text: 'Cuando la condición es corta y clara.'
      - id: 'd'
        text: 'Nunca: el ternario siempre es más claro.'
    correctOptionId: 'b'
    explanation: >-
      El ternario sirve para elegir un valor entre dos. Si cada camino ejecuta
      varias acciones, `if-else` expresa mejor la lógica y se lee más fácil.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int nota = 5;

          printf("%s\n", nota >= 7 ? "Promociona" : nota >= 4 ? "Aprueba" : "Recursa");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Promociona`'
      - id: 'b'
        text: '`Aprueba`'
      - id: 'c'
        text: '`Recursa`'
      - id: 'd'
        text: 'No compila: no se puede poner un ternario dentro de otro.'
    correctOptionId: 'b'
    explanation: >-
      `5 >= 7` es falso, así que se evalúa el segundo ternario: `5 >= 4` es
      verdadero y el valor es `"Aprueba"`. Compila y funciona, pero un ternario
      dentro de otro se lee con dificultad; con tres caminos, un `if-else` es
      más claro.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'En `condicion ? x : y`, si la condición es falsa, el resultado es `x`.'
    correctAnswer: false
    explanation: >-
      El orden es condición, valor si es verdadera, valor si es falsa. Con la
      condición falsa, el resultado es `y`.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Esta línea no compila. ¿Cuál es el error?'
    code: |-
      int par = numero % 2 == 0 ? 1;
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Falta la parte `: valor_si_falso`; el ternario necesita sus tres partes, por ejemplo `numero % 2 == 0 ? 1 : 0`.'
      - id: 'b'
        text: 'La condición debe ir entre llaves.'
      - id: 'c'
        text: '`%` no puede usarse dentro de un ternario.'
      - id: 'd'
        text: 'El resultado de un ternario no puede guardarse en un `int`.'
    correctOptionId: 'a'
    explanation: >-
      A diferencia de `if`, que puede ir sin `else`, el ternario siempre
      necesita los dos valores: la expresión tiene que producir algo también
      cuando la condición es falsa.
  - kind: 'true-false'
    id: 'q11'
    prompt: 'Este programa muestra `1 artículo`.'
    code: |-
      #include <stdio.h>

      int main(void) {
          int cantidad = 1;

          printf("%d %s\n", cantidad, cantidad == 1 ? "artículo" : "artículos");
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: true
    explanation: >-
      `cantidad == 1` es verdadero, así que se elige `"artículo"`. Es un uso
      típico del ternario: elegir entre dos valores simples dentro de una
      expresión.
---
