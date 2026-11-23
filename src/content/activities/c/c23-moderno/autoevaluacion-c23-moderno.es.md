---
course: 'c'
lesson: 'c23-moderno'
slug: 'autoevaluacion-c23-moderno'
title: 'Autoevaluación: C moderno y C23'
description: 'Doce preguntas sobre constexpr, nullptr, auto, typeof, inicializador vacío, atributos, aritmética verificada y cómo comprobar el estándar activo, con código para leer.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Una característica del lenguaje que tu compilador acepta pero que no figura en la norma ISO es...'
    options:
      - id: 'a'
        text: 'una característica estándar.'
      - id: 'b'
        text: 'una extensión del compilador: puede no existir en otro.'
      - id: 'c'
        text: 'una característica opcional de la biblioteca estándar.'
      - id: 'd'
        text: 'un error del compilador que hay que informar.'
    correctOptionId: 'b'
    explanation: >-
      Las extensiones, como las expresiones-sentencia de GCC y Clang, funcionan
      en ese compilador pero no están garantizadas en otros. Una característica
      opcional sí está en la norma, pero una implementación puede no ofrecerla.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'En C23, `nullptr` tiene su propio tipo (`nullptr_t`) y puede usarse como constante de puntero nulo.'
    correctAnswer: true
    explanation: >-
      `nullptr` reemplaza a `NULL` con un tipo propio, de modo que no se
      confunde con el entero 0 en expresiones genéricas o en llamadas a
      funciones.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          constexpr int N = 4;
          int a[N] = {};

          printf("%d %zu\n", a[N - 1], sizeof a / sizeof a[0]);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`0 4`'
      - id: 'b'
        text: '`4 4`'
      - id: 'c'
        text: 'Un valor indeterminado y `4`, porque el arreglo no se inicializa.'
      - id: 'd'
        text: 'No compila: constexpr no puede usarse como tamaño de un arreglo.'
    correctOptionId: 'a'
    explanation: >-
      `constexpr` define una constante del tiempo de compilación y puede dar
      tamaño a un arreglo. El inicializador vacío `= {}` pone todos los
      elementos en cero.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          auto x = 7 / 2;
          auto y = 7 / 2.0;

          printf("%d %.2f\n", x, y);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3 3.50`'
      - id: 'b'
        text: '`3.5 3.50`'
      - id: 'c'
        text: '`3 3.00`'
      - id: 'd'
        text: 'No compila: auto no puede usarse en C.'
    correctOptionId: 'a'
    explanation: >-
      `auto` toma el tipo de la expresión inicial: `7 / 2` es un `int` (división
      entera, 3) y `7 / 2.0` es un `double` (3.5).
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Este programa muestra `1`.'
    code: |-
      #include <limits.h>
      #include <stdckdint.h>
      #include <stdio.h>

      int main(void) {
          int r;
          bool desborde = ckd_add(&r, INT_MAX, 1);

          printf("%d\n", desborde);
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: true
    explanation: >-
      `ckd_add` guarda el resultado en `r` y devuelve `true` si la suma
      desborda. `INT_MAX + 1` desborda un `int`, así que `desborde` vale 1. Es
      la forma estándar de detectar un desborde sin comportamiento indefinido.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Compilas este programa con `-std=c17`. ¿Qué muestra?'
    code: |-
      #include <stdio.h>

      int main(void) {
      #if __STDC_VERSION__ >= 202311L
          printf("C23 o posterior\n");
      #else
          printf("antes de C23\n");
      #endif
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`C23 o posterior`'
      - id: 'b'
        text: '`antes de C23`'
      - id: 'c'
        text: 'No compila: __STDC_VERSION__ no existe en C17.'
      - id: 'd'
        text: 'Muestra las dos líneas.'
    correctOptionId: 'b'
    explanation: >-
      Con `-std=c17`, `__STDC_VERSION__` vale `201710L`, menor que `202311L`. El
      preprocesador descarta la primera rama y compila solo la segunda.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Compilas este programa con `-std=c23 -Wall`. ¿Qué ocurre?'
    code: |-
      [[nodiscard]] int leer_sensor(void) {
          return 42;
      }

      int main(void) {
          leer_sensor();
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Error de compilación: nodiscard no es un atributo válido.'
      - id: 'b'
        text: 'Compila sin avisar: el atributo es solo un comentario.'
      - id: 'c'
        text: 'El compilador advierte que se ignora el valor devuelto por leer_sensor.'
      - id: 'd'
        text: 'El programa se detiene al ejecutar la llamada.'
    correctOptionId: 'c'
    explanation: >-
      `[[nodiscard]]` pide al compilador que avise cuando se descarta el valor
      de retorno. No cambia la ejecución: es una ayuda para quien llama a la
      función.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'En C23, `auto n = 5;` declara una variable del mismo tipo que `typeof(5) n = 5;`.'
    correctAnswer: true
    explanation: >-
      En los dos casos `n` es un `int`: `auto` infiere el tipo de la expresión
      inicial y `typeof` lo toma de la expresión que se le da.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Cuál de estas construcciones NO es C estándar, sino una extensión de GCC y Clang?'
    options:
      - id: 'a'
        text: '`nullptr`'
      - id: 'b'
        text: 'La expresión-sentencia `({ ... })`'
      - id: 'c'
        text: 'El encabezado `<stdckdint.h>`'
      - id: 'd'
        text: '`_Generic`'
    correctOptionId: 'b'
    explanation: >-
      `nullptr` y `<stdckdint.h>` son de C23 y `_Generic` es de C11. Las
      expresiones-sentencia solo existen en GCC y Clang; con `-Wpedantic`
      aparece una advertencia al usarlas.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int v[3] = {};
          double d[2] = {};

          printf("%d %.1f\n", v[2], d[1]);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`0 0.0`'
      - id: 'b'
        text: 'Valores indeterminados: `= {}` no inicializa nada.'
      - id: 'c'
        text: 'No compila: las llaves no pueden estar vacías en C.'
      - id: 'd'
        text: '`0 0.0` solo con -O2; sin optimización los valores son basura.'
    correctOptionId: 'a'
    explanation: >-
      C23 permite el inicializador vacío: todos los elementos quedan en cero, en
      cualquier nivel de optimización. Antes de C23 había que escribir `= {0}`.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Para qué sirve la directiva `#embed` de C23?'
    options:
      - id: 'a'
        text: 'Para incluir el contenido de un archivo binario como una lista de valores en tiempo de compilación.'
      - id: 'b'
        text: 'Para incluir otro archivo de código C, igual que #include pero sin protección contra duplicados.'
      - id: 'c'
        text: 'Para leer un archivo mientras el programa se ejecuta.'
      - id: 'd'
        text: 'Para incrustar código ensamblador en una función.'
    correctOptionId: 'a'
    explanation: >-
      `#embed` es una directiva del preprocesador que convierte el contenido de
      un archivo en una secuencia de enteros, por ejemplo para inicializar un
      arreglo con una imagen o un recurso. Es parte de C23, pero puede no estar
      disponible en compiladores antiguos.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'Si un compilador acepta una característica sin advertencias, esa característica es C estándar y compilará en cualquier otro compilador.'
    correctAnswer: false
    explanation: >-
      Muchos compiladores aceptan extensiones sin avisar a menos que se pida con
      `-Wpedantic` o con un estándar estricto. Para comprobar la portabilidad se
      compila con `-std=c23 -Wpedantic` y se prueba en más de un compilador.
---
