---
course: 'c'
lesson: 'preprocesador-y-programacion-generica'
slug: 'autoevaluacion-preprocesador-y-programacion-generica'
title: 'Autoevaluación: Preprocesador y programación genérica'
description: 'Doce preguntas sobre las trampas de las macros, # y ##, compilación condicional, inline y _Generic, con código cuya salida debes predecir y macros que debes corregir.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      #define CUADRADO(x) x * x

      int main(void) {
          printf("%d\n", CUADRADO(2 + 1));
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`9`'
      - id: 'b'
        text: '`5`'
      - id: 'c'
        text: '`7`'
      - id: 'd'
        text: '`6`'
    correctOptionId: 'b'
    explanation: >-
      El preprocesador reemplaza texto: `2 + 1 * 2 + 1` vale 2 + 2 + 1 = 5.
      La corrección es poner paréntesis: `#define CUADRADO(x) ((x) * (x))`.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Con `#define CUADRADO(x) ((x) * (x))`, la llamada `CUADRADO(i++)` incrementa `i` una sola vez.'
    correctAnswer: false
    explanation: >-
      El argumento se copia dos veces en el texto: `((i++) * (i++))`. Evalúa el
      incremento dos veces sobre la misma variable sin orden definido, lo que es
      comportamiento indefinido. Una función `static inline` evalúa el argumento una vez.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué muestra este programa? Recuerda el tipo de una constante de carácter en C.'
    code: |-
      #include <stdio.h>

      #define TIPO(x) _Generic((x), int: "int", double: "double", default: "otro")

      int main(void) {
          printf("%s %s %s %s\n", TIPO(1), TIPO(1.0), TIPO('a'), TIPO(1.0f));
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`int double char float`'
      - id: 'b'
        text: '`int double int otro`'
      - id: 'c'
        text: '`int double char otro`'
      - id: 'd'
        text: '`int double int double`'
    correctOptionId: 'b'
    explanation: >-
      En C, la constante `'a'` es de tipo `int`, no `char`. Un `float` no coincide
      con `int` ni con `double` y cae en `default`, así que `1.0f` da `otro`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      #define MOSTRAR(x) printf("[%d]", x); printf("\n")

      int main(void) {
          int n = 3;

          if (n > 5)
              MOSTRAR(n);
          printf("fin\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Solo `fin`.'
      - id: 'b'
        text: 'Una línea vacía y después `fin`.'
      - id: 'c'
        text: '`[3]` y después `fin`.'
      - id: 'd'
        text: 'Un error de compilación.'
    correctOptionId: 'b'
    explanation: >-
      La macro se expande a dos sentencias; el `if` solo gobierna la primera. El
      segundo `printf("\n")` se ejecuta siempre. Para evitarlo, el cuerpo de la
      macro se envuelve en `do { ... } while (0)`.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      #define NOMBRE(x) #x
      #define PEGAR(a, b) a##b

      int main(void) {
          int xy = 5;

          printf("%s %d\n", NOMBRE(a+b), PEGAR(x, y));
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`a+b 5`'
      - id: 'b'
        text: '`0 5`'
      - id: 'c'
        text: '`a+b xy`'
      - id: 'd'
        text: 'Un error de compilación: a y b no están definidas.'
    correctOptionId: 'a'
    explanation: >-
      `#x` convierte el argumento en una cadena sin evaluarlo, y `a##b` pega los
      dos tokens para formar el identificador `xy`, que es la variable de valor 5.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Una macro variádica puede usar `__VA_OPT__(,)` para escribir una coma solo cuando se pasaron argumentos variádicos.'
    correctAnswer: true
    explanation: >-
      `__VA_OPT__(contenido)` se expande al contenido únicamente si hay
      argumentos variádicos; si no, no genera nada. Resuelve el problema de la
      coma sobrante en macros de tipo `printf`.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Esta macro debería devolver el mayor de dos números, pero el programa muestra `9` en lugar de `10`. ¿Cómo se corrige?'
    code: |-
      #include <stdio.h>

      #define MAX(a, b) a > b ? a : b

      int main(void) {
          int x = 9;
          int y = 2;

          printf("%d\n", MAX(x, y) + 1);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Cambiar el + 1 por + 0.'
      - id: 'b'
        text: 'Poner paréntesis al cuerpo y a los parámetros: #define MAX(a, b) (((a) > (b)) ? (a) : (b)).'
      - id: 'c'
        text: 'Declarar x e y como double.'
      - id: 'd'
        text: 'Escribir el nombre de la macro en minúsculas.'
    correctOptionId: 'b'
    explanation: >-
      Se expande a `9 > 2 ? 9 : 2 + 1`, y el `+ 1` queda dentro de la rama falsa.
      La condición es verdadera, así que el resultado es 9. Con los paréntesis se
      convierte en `(9 > 2 ? 9 : 2) + 1`, que vale 10.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Cuándo sigue siendo preferible una macro a una función `static inline`?'
    options:
      - id: 'a'
        text: 'Siempre: las macros son más rápidas y seguras.'
      - id: 'b'
        text: 'Cuando necesitas algo que una función no puede hacer, como # o ##, o conocer __FILE__ y __LINE__ del lugar de la llamada.'
      - id: 'c'
        text: 'Cuando el argumento tiene efectos secundarios.'
      - id: 'd'
        text: 'Nunca: C moderno prohíbe las macros con argumentos.'
    correctOptionId: 'b'
    explanation: >-
      Una función `static inline` tiene tipos verificados y evalúa cada argumento
      una vez. Las macros se reservan para lo que solo ellas pueden hacer: pegar
      tokens, convertir a texto o conocer el lugar de la llamada.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'Este programa muestra `1 1`.'
    code: |-
      #include <stdio.h>

      int main(void) {
          int i = 0;
          int t = _Generic(i++, int: 1, default: 0);

          printf("%d %d\n", t, i);
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: false
    explanation: >-
      La expresión de control de `_Generic` no se evalúa: solo importa su tipo.
      `i++` nunca se ejecuta, así que el programa muestra `1 0`. (Algunos
      compiladores advierten que la expresión tiene efectos que no se evalúan.)
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Compilas este programa con `-DDEPURAR`. ¿Qué muestra?'
    code: |-
      #include <stdio.h>

      int main(void) {
      #ifdef DEPURAR
          printf("depurando\n");
      #endif
          printf("fin\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Solo `fin`.'
      - id: 'b'
        text: '`depurando` y después `fin`.'
      - id: 'c'
        text: 'Solo `depurando`.'
      - id: 'd'
        text: 'Un error: DEPURAR no está definida en el archivo.'
    correctOptionId: 'b'
    explanation: >-
      `-DDEPURAR` define la macro desde la línea de compilación, así que
      `#ifdef` conserva el bloque. Sin la opción, el bloque desaparece antes de
      compilar y solo se muestra `fin`.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Una lista genérica con `void *` almacena también el tamaño de cada elemento. ¿Por qué?'
    options:
      - id: 'a'
        text: 'Porque void * no tiene tamaño, y malloc exige conocerlo.'
      - id: 'b'
        text: 'Para poder copiar y comparar elementos de un tipo que la lista desconoce: memcpy y la reserva necesitan el tamaño en bytes.'
      - id: 'c'
        text: 'Porque el compilador lo exige para evitar advertencias.'
      - id: 'd'
        text: 'Para que _Generic elija la función correcta.'
    correctOptionId: 'b'
    explanation: >-
      Un `void *` no dice qué hay detrás ni cuánto ocupa. La lista guarda
      `sizeof` del tipo al crearla y, junto con funciones de comparación o de
      impresión (callbacks), opera sobre los bytes de cada elemento.
  - kind: 'true-false'
    id: 'q12'
    prompt: '`_Generic` elige la rama en tiempo de ejecución, según el valor que tenga la expresión de control en ese momento.'
    correctAnswer: false
    explanation: >-
      La selección ocurre en tiempo de compilación y depende solo del tipo de la
      expresión. Dos llamadas con tipos distintos generan código distinto, y no
      hay costo adicional al ejecutar.
---
