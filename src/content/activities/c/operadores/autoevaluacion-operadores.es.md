---
course: 'c'
lesson: 'operadores'
slug: 'autoevaluacion-operadores'
title: 'Autoevaluación: Operadores'
description: 'Doce preguntas sobre división entera y resto, incremento prefijo y posfijo, precedencia, asignación compuesta, cortocircuito, orden de evaluación, comportamiento indefinido y operadores a nivel de bits.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué muestra esta línea?'
    code: |-
      printf("%d %d\n", 17 / 5, -17 % 5);
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3 2`'
      - id: 'b'
        text: '`3 -2`'
      - id: 'c'
        text: '`3.4 -2`'
      - id: 'd'
        text: '`4 3`'
    correctOptionId: 'b'
    explanation: >-
      Entre enteros, `/` trunca hacia cero: `17 / 5` es 3. El resto tiene el
      signo del dividendo: `-17 % 5` es −2. Se cumple siempre
      `(a / b) * b + a % b == a`: `(-3) * 5 + (-2) == -17`.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int a = 4;
          int b = a++ * 3;
          int c = ++a + 1;
          printf("a=%d b=%d c=%d\n", a, b, c);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`a=6 b=15 c=7`'
      - id: 'b'
        text: '`a=5 b=12 c=6`'
      - id: 'c'
        text: '`a=6 b=12 c=7`'
      - id: 'd'
        text: '`a=6 b=12 c=6`'
    correctOptionId: 'c'
    explanation: >-
      `a++` vale el valor anterior (4), así que `b` es 12 y `a` pasa a 5. `++a`
      incrementa primero y vale el valor nuevo (6), así que `c` es 7. Al final,
      `a` vale 6.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'En `a && b`, si `a` es falso, `b` no se evalúa.'
    correctAnswer: true
    explanation: >-
      Es la evaluación en cortocircuito, una garantía del lenguaje: si el
      operando izquierdo de `&&` es falso, el resultado ya es falso. Con `||`
      ocurre lo mismo cuando el izquierdo es verdadero.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Esta línea debería evitar dividir por cero, pero falla cuando `personas` vale 0. ¿Cuál es la corrección?'
    code: |-
      int caro = total / personas > 10 && personas != 0;
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`int caro = personas != 0 && total / personas > 10;`'
      - id: 'b'
        text: '`int caro = total / personas > 10 || personas != 0;`'
      - id: 'c'
        text: '`int caro = total / personas > 10 & personas != 0;`'
      - id: 'd'
        text: '`int caro = (total / personas > 10) && (personas != 0);`'
    correctOptionId: 'a'
    explanation: >-
      `&&` evalúa de izquierda a derecha, así que la protección tiene que ir
      primero. Si `personas != 0` es falso, la división nunca se calcula. Agregar
      paréntesis no cambia el orden, y `&` no hace cortocircuito.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué puedes decir de la instrucción `i = i++ + 1;`?'
    options:
      - id: 'a'
        text: 'Suma 2 a `i`, igual que `i += 2;`.'
      - id: 'b'
        text: 'Suma 1 a `i`, porque el `++` se aplica después.'
      - id: 'c'
        text: 'Es comportamiento indefinido: modifica `i` dos veces en la misma expresión sin un orden definido.'
      - id: 'd'
        text: 'No compila.'
    correctOptionId: 'c'
    explanation: >-
      `++` y `=` modifican `i` en la misma expresión sin que el estándar ordene
      esas modificaciones. El programa es incorrecto aunque parezca funcionar;
      Clang avisa con `multiple unsequenced modifications`. La versión correcta
      es `i += 2;`.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Cuánto vale `2 + 3 * 4 - 6 / 4`?'
    options:
      - id: 'a'
        text: '`13`'
      - id: 'b'
        text: '`12.5`'
      - id: 'c'
        text: '`5`'
      - id: 'd'
        text: '`14`'
    correctOptionId: 'a'
    explanation: >-
      `*` y `/` tienen más precedencia que `+` y `-`: `3 * 4` es 12 y `6 / 4`
      es 1 (división entera). Después, de izquierda a derecha: `2 + 12 - 1`
      vale 13.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'En `f() + g()`, el estándar garantiza que `f()` se evalúa antes que `g()`.'
    correctAnswer: false
    explanation: >-
      La precedencia dice cómo se agrupan los operandos, no en qué orden se
      calculan. En `+` el orden de evaluación no está especificado; solo `&&`,
      `||`, `?:` y la coma garantizan izquierda a derecha.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          printf("%u %u %u\n", 12u | 3u, 12u ^ 10u, 1u << 4);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1 1 5`'
      - id: 'b'
        text: '`0 6 16`'
      - id: 'c'
        text: '`15 22 4`'
      - id: 'd'
        text: '`15 6 16`'
    correctOptionId: 'd'
    explanation: >-
      `12u | 3u` es `1100 | 0011 = 1111`, es decir 15. `12u ^ 10u` es
      `1100 ^ 1010 = 0110`, es decir 6. `1u << 4` desplaza un 1 cuatro lugares:
      16.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int x = 5;
          x *= 2 + 1;
          printf("%d\n", x);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`11`'
      - id: 'b'
        text: '`15`'
      - id: 'c'
        text: '`10`'
      - id: 'd'
        text: '`6`'
    correctOptionId: 'b'
    explanation: >-
      La asignación compuesta tiene casi la menor precedencia: `x *= 2 + 1`
      equivale a `x = x * (2 + 1)`, que vale 15, no a `x = x * 2 + 1`.
  - kind: 'true-false'
    id: 'q10'
    prompt: '`-7 % 3` vale `2`.'
    correctAnswer: false
    explanation: >-
      Como la división entera trunca hacia cero, el resto tiene el signo del
      dividendo: `-7 % 3` vale −1. Por eso, para saber si un número es impar,
      conviene comparar `numero % 2 != 0` en lugar de `numero % 2 == 1`.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Cuál de estos es un ejemplo de comportamiento **definido por la implementación**?'
    options:
      - id: 'a'
        text: 'El resultado de `7 / 2`.'
      - id: 'b'
        text: 'Dividir un entero por cero.'
      - id: 'c'
        text: 'El tamaño de un `int`, que cada compilador elige y documenta.'
      - id: 'd'
        text: 'El orden en que se evalúan los operandos de `+`.'
    correctOptionId: 'c'
    explanation: >-
      `7 / 2` está definido (vale 3). Dividir por cero es comportamiento
      indefinido. El orden de los operandos de `+` no está especificado: el
      compilador no tiene que documentarlo. El tamaño de `int` lo elige cada
      implementación y debe documentarlo.
  - kind: 'single-choice'
    id: 'q12'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int a = 0;
          int r1 = a > 5 && ++a;
          int r2 = a < 5 || ++a;
          printf("%d %d %d\n", r1, r2, a);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`0 1 2`'
      - id: 'b'
        text: '`0 1 1`'
      - id: 'c'
        text: '`1 1 2`'
      - id: 'd'
        text: '`0 1 0`'
    correctOptionId: 'd'
    explanation: >-
      `a > 5` es falso, así que `&&` no evalúa `++a`: `r1` es 0. `a < 5` es
      verdadero, así que `||` tampoco evalúa `++a`: `r2` es 1. Ningún `++` se
      ejecutó y `a` sigue en 0.
---
