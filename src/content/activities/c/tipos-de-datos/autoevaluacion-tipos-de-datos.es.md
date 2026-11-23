---
course: 'c'
lesson: 'tipos-de-datos'
slug: 'autoevaluacion-tipos-de-datos'
title: 'Autoevaluación: Tipos de Datos'
description: 'Doce preguntas sobre rangos garantizados, sizeof y size_t, punto flotante, char como entero, bool en C23, conversiones implícitas y explícitas, y desbordamiento con y sin signo.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuántos bits garantiza como mínimo el estándar de C para un `int`?'
    options:
      - id: 'a'
        text: '8 bits'
      - id: 'b'
        text: '16 bits'
      - id: 'c'
        text: '32 bits, en todas las plataformas'
      - id: 'd'
        text: '64 bits'
    correctOptionId: 'b'
    explanation: >-
      El estándar fija mínimos y un orden (`short` ≤ `int` ≤ `long` ≤
      `long long`), no tamaños exactos. Un `int` garantiza 16 bits, aunque en
      Linux y macOS de 64 bits suele medir 32. Para conocer los límites reales,
      consulta `<limits.h>`.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int a = 9;
          int b = 4;
          double x = a / b;
          double y = (double)a / b;
          printf("%.2f %.2f\n", x, y);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`2.25 2.25`'
      - id: 'b'
        text: '`2.00 2.00`'
      - id: 'c'
        text: '`2.00 2.25`'
      - id: 'd'
        text: '`2.25 2.00`'
    correctOptionId: 'c'
    explanation: >-
      `a / b` divide dos enteros: el resultado es `2`, que recién después se
      convierte a `2.0`. En `(double)a / b` el cast actúa antes de dividir, así
      que `b` también se convierte y la división conserva los decimales: `2.25`.
  - kind: 'true-false'
    id: 'q3'
    prompt: '`sizeof(char)` vale 1 en cualquier compilador y plataforma.'
    correctAnswer: true
    explanation: >-
      Por definición, `sizeof(char)` es 1: los demás tamaños se miden en
      "cantidad de `char`". Lo que puede variar es cuántos bits tiene un `char`
      (`CHAR_BIT`), que en las máquinas actuales es 8.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Con `-Wall`, esta línea produce una advertencia. ¿Cuál es la corrección?'
    code: |-
      printf("Un int ocupa %d bytes\n", sizeof(int));
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Usar `%zu`, porque `sizeof` da un `size_t`, que es un entero sin signo.'
      - id: 'b'
        text: 'Usar `%f`, porque el tamaño puede tener decimales.'
      - id: 'c'
        text: 'Escribir `sizeof int` sin paréntesis.'
      - id: 'd'
        text: 'Ninguna: `%d` sirve para cualquier entero.'
    correctOptionId: 'a'
    explanation: >-
      El resultado de `sizeof` es de tipo `size_t`, y su especificador es
      `%zu`. Usar `%d` es un error de formato. Con un tipo, los paréntesis son
      obligatorios: `sizeof(int)`.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué muestra este programa? (`-Wextra` avisa sobre la primera comparación.)'
    code: |-
      #include <stdio.h>

      int main(void) {
          int menosUno = -1;
          unsigned int uno = 1u;
          printf("%d\n", menosUno < uno);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1`, porque −1 es menor que 1.'
      - id: 'b'
        text: '`0`, porque `menosUno` se convierte a `unsigned int` y pasa a ser un valor enorme.'
      - id: 'c'
        text: '`-1`'
      - id: 'd'
        text: 'No compila: no se pueden comparar tipos distintos.'
    correctOptionId: 'b'
    explanation: >-
      Al mezclar `int` con `unsigned int`, las conversiones aritméticas usuales
      operan en `unsigned int`. −1 se convierte en `UINT_MAX` (4294967295), que
      no es menor que 1. La advertencia `comparison of integers of different
      signs` señala justamente esta trampa.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Qué muestra este programa en una máquina que usa ASCII?'
    code: |-
      #include <stdio.h>

      int main(void) {
          double nota = 7.9;
          int entera = nota;
          char letra = 'C';
          printf("%d %c %d\n", entera, letra + 2, letra);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`8 E 67`'
      - id: 'b'
        text: '`7 C2 C`'
      - id: 'c'
        text: '`7.9 E 67`'
      - id: 'd'
        text: '`7 E 67`'
    correctOptionId: 'd'
    explanation: >-
      Al asignar un `double` a un `int` se descarta la parte decimal (se trunca,
      no se redondea): 7. Un `char` es un entero pequeño: `'C'` vale 67, así que
      `letra + 2` vale 69, que con `%c` se muestra como `E`.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Si un `int` vale `INT_MAX` y le sumas 1, el estándar garantiza que el resultado da la vuelta a `INT_MIN`.'
    correctAnswer: false
    explanation: >-
      El desbordamiento de un entero con signo es comportamiento indefinido: el
      estándar no dice qué pasa. Solo los enteros sin signo dan la vuelta de
      forma garantizada (aritmética módulo 2ⁿ).
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <limits.h>

      int main(void) {
          unsigned int contador = UINT_MAX;
          contador = contador + 1u;
          bool activo = 25;
          printf("%u %d\n", contador, activo);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`0 1`'
      - id: 'b'
        text: '`4294967296 25`'
      - id: 'c'
        text: '`0 25`'
      - id: 'd'
        text: 'Es comportamiento indefinido: puede mostrar cualquier cosa.'
    correctOptionId: 'a'
    explanation: >-
      Los `unsigned` dan la vuelta: `UINT_MAX + 1u` vale 0, y eso está definido.
      Cualquier valor distinto de cero convertido a `bool` se vuelve `true`, que
      vale 1.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'En C23 puedes usar `bool`, `true` y `false` sin incluir `<stdbool.h>`.'
    correctAnswer: true
    explanation: >-
      En C23 son palabras clave del lenguaje. En C99 y C17 hay que incluir
      `<stdbool.h>`; si tu código también debe compilar con esos estándares,
      inclúyelo, porque en C23 es inofensivo.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Por qué `printf("%d\n", 0.1 + 0.2 == 0.3);` muestra `0`?'
    options:
      - id: 'a'
        text: 'Porque `==` no se puede usar con `double`.'
      - id: 'b'
        text: 'Porque `%d` no puede mostrar el resultado de una comparación.'
      - id: 'c'
        text: 'Porque `0.1` y `0.2` no tienen representación exacta en binario y su suma no es exactamente igual a `0.3`.'
      - id: 'd'
        text: 'Porque los literales decimales son `float` y pierden precisión.'
    correctOptionId: 'c'
    explanation: >-
      Los tipos de punto flotante son aproximados: `0.1 + 0.2` da
      `0.30000000000000004`. Por eso no se comparan con `==`, sino verificando
      que la diferencia sea muy pequeña. Para dinero exacto, usa enteros
      (centavos).
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Un programa debe guardar el valor 3 000 000 000 y compilar igual en cualquier plataforma. ¿Qué tipo con signo conviene?'
    options:
      - id: 'a'
        text: '`int`'
      - id: 'b'
        text: '`long`'
      - id: 'c'
        text: '`short`'
      - id: 'd'
        text: '`long long`'
    correctOptionId: 'd'
    explanation: >-
      `int` puede tener solo 16 bits y `long` 32 (por ejemplo, en Windows), y en
      ninguno de los dos casos alcanza. `long long` garantiza al menos 64 bits.
  - kind: 'single-choice'
    id: 'q12'
    prompt: 'Este cálculo del promedio de 17 puntos entre 4 personas debería dar `4.25`, pero da `4.00`. ¿Cuál es la corrección?'
    code: |-
      int suma = 17;
      int cantidad = 4;
      double promedio = (double)(suma / cantidad);
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`double promedio = (double)suma / cantidad;`'
      - id: 'b'
        text: '`int promedio = suma / cantidad;`'
      - id: 'c'
        text: '`double promedio = (int)suma / cantidad;`'
      - id: 'd'
        text: 'Mostrarlo con `%.2f` en lugar de `%f`.'
    correctOptionId: 'a'
    explanation: >-
      En `(double)(suma / cantidad)` el cast llega tarde: la división entera ya
      descartó los decimales. El cast tiene que convertir un operando antes de
      dividir, y la conversión aritmética usual convierte el otro.
---
