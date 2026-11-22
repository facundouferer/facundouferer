---
course: 'c'
lesson: 'sentencia-if-else'
slug: 'autoevaluacion-sentencia-if-else'
title: 'Autoevaluación: If-Else'
description: 'Once preguntas sobre if, if-else, bloques con llaves, decisiones anidadas y los errores clásicos: = en lugar de ==, punto y coma después de la condición y sangría engañosa.'
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
          int nota = 6;

          if (nota >= 7) {
              printf("Promociona\n");
          } else {
              if (nota >= 4) {
                  printf("Aprueba\n");
              } else {
                  printf("Recursa\n");
              }
          }
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
        text: '`Aprueba` y `Recursa`, en dos líneas.'
    correctOptionId: 'b'
    explanation: >-
      `6 >= 7` es falso, así que se ejecuta el `else`. Dentro, `6 >= 4` es
      verdadero y se muestra `Aprueba`. El `else` interno no se ejecuta: en cada
      `if-else` el programa elige un solo camino.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'En un `if-else`, cuando la condición es verdadera se ejecutan el bloque del `if` y luego el del `else`.'
    correctAnswer: false
    explanation: >-
      `if-else` elige uno de los dos caminos: el bloque del `if` cuando la
      condición es verdadera, o el del `else` cuando es falsa. Nunca los dos.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué muestra este programa y por qué?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int edad = 15;

          if (edad = 18) {
              printf("Mayor\n");
          } else {
              printf("Menor\n");
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Menor`, porque 15 es menor que 18.'
      - id: 'b'
        text: '`Mayor`, porque `edad = 18` asigna 18 y ese valor, distinto de cero, cuenta como verdadero.'
      - id: 'c'
        text: 'No muestra nada: la condición es inválida y se saltean los dos bloques.'
      - id: 'd'
        text: 'No compila: `=` está prohibido dentro de un `if`.'
    correctOptionId: 'b'
    explanation: >-
      `=` asigna, `==` compara. La condición guarda 18 en `edad` y vale 18; en
      C cualquier valor distinto de cero es verdadero, así que siempre entra al
      `if`. Compila, pero con `-Wall` el compilador avisa que se usa una
      asignación como condición. La corrección es `edad >= 18`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Cuándo conviene anidar un `if` dentro de otro?'
    options:
      - id: 'a'
        text: 'Siempre que sea posible, porque más niveles hacen el código más seguro.'
      - id: 'b'
        text: 'Cuando la segunda decisión solo tiene sentido si la primera ya se cumplió.'
      - id: 'c'
        text: 'Nunca: C no permite un `if` dentro de otro.'
      - id: 'd'
        text: 'Solo cuando el `if` exterior no tiene `else`.'
    correctOptionId: 'b'
    explanation: >-
      La anidación expresa una dependencia: por ejemplo, distinguir entre cero y
      positivo solo después de saber que el número no es negativo. Abusar de
      ella vuelve el código difícil de leer.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Este programa no muestra nada, porque `x` no es mayor que 10.'
    code: |-
      #include <stdio.h>

      int main(void) {
          int x = 5;

          if (x > 10)
              printf("Grande\n");
              printf("Fin del if\n");
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: false
    explanation: >-
      Sin llaves, el `if` controla solo la sentencia siguiente. La sangría
      engaña: `printf("Fin del if\n");` está fuera del `if` y se ejecuta
      siempre, así que se muestra `Fin del if`. Por eso conviene usar llaves
      siempre.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int n = 15;

          if (n % 3 == 0) {
              if (n % 5 == 0) {
                  printf("Múltiplo de 3 y de 5\n");
              } else {
                  printf("Múltiplo de 3\n");
              }
          } else {
              printf("No es múltiplo de 3\n");
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Múltiplo de 3`'
      - id: 'b'
        text: '`Múltiplo de 3 y de 5`'
      - id: 'c'
        text: '`No es múltiplo de 3`'
      - id: 'd'
        text: '`Múltiplo de 3 y de 5` y `Múltiplo de 3`, en dos líneas.'
    correctOptionId: 'b'
    explanation: >-
      `15 % 3` es 0, así que entra al primer bloque. Ahí `15 % 5` también es 0
      y se muestra `Múltiplo de 3 y de 5`. El `else` interno no se ejecuta.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Qué condición es verdadera solo cuando `n` está entre 1 y 10, ambos incluidos?'
    options:
      - id: 'a'
        text: '`1 <= n <= 10`'
      - id: 'b'
        text: '`n >= 1 || n <= 10`'
      - id: 'c'
        text: '`n >= 1 && n <= 10`'
      - id: 'd'
        text: '`n > 1 && n < 10`'
    correctOptionId: 'c'
    explanation: >-
      Hacen falta las dos comparaciones unidas con `&&`. Con `||` cualquier
      número cumple al menos una. `1 <= n <= 10` se evalúa como `(1 <= n) <= 10`,
      que compara 0 o 1 con 10 y siempre es verdadero. Con `>` y `<` se excluyen
      el 1 y el 10.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'La condición `numero % 2 == 0` es verdadera cuando `numero` es par.'
    correctAnswer: true
    explanation: >-
      `%` da el resto de la división entera. Un número par dividido por 2 tiene
      resto 0, así que la comparación con `== 0` es verdadera.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'Este programa muestra `Saldo negativo` aunque el saldo es 100. ¿Cuál es el error?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int saldo = 100;

          if (saldo < 0);
          {
              printf("Saldo negativo\n");
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'La condición debería ser `saldo > 0`.'
      - id: 'b'
        text: 'Sobra el `;` después de la condición: el `if` controla una sentencia vacía y el bloque siguiente se ejecuta siempre.'
      - id: 'c'
        text: 'Falta un `else` después del bloque.'
      - id: 'd'
        text: 'Las llaves deben ir en la misma línea que el `if`.'
    correctOptionId: 'b'
    explanation: >-
      `if (saldo < 0);` termina en el `;`: si la condición es verdadera se
      ejecuta una sentencia vacía. El bloque entre llaves queda fuera del `if` y
      se ejecuta siempre. Quitando ese `;` el programa no muestra nada.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'Un `else` siempre pertenece a un `if` que aparece antes que él.'
    correctAnswer: true
    explanation: >-
      `else` no puede ir solo: es el camino alternativo de un `if`. Si escribes
      un `else` sin su `if`, el programa no compila.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Qué muestra este programa con `temp = 35`?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int temp = 35;

          if (temp > 20) {
              printf("Templado\n");
          } else if (temp > 30) {
              printf("Caluroso\n");
          } else {
              printf("Frío\n");
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Caluroso`'
      - id: 'b'
        text: '`Templado` y `Caluroso`, en dos líneas.'
      - id: 'c'
        text: '`Templado`'
      - id: 'd'
        text: '`Frío`'
    correctOptionId: 'c'
    explanation: >-
      Las condiciones se evalúan en orden y se ejecuta solo el primer camino
      verdadero. `35 > 20` ya es verdadero, así que `Caluroso` nunca se alcanza
      con este orden. Para corregirlo, la condición más exigente (`temp > 30`)
      tiene que ir primero.
---
