---
course: 'c'
lesson: 'pruebas-estilo-y-portabilidad'
slug: 'autoevaluacion-pruebas-estilo-y-portabilidad'
title: 'Autoevaluación: Pruebas, estilo y portabilidad'
description: 'Doce preguntas sobre pruebas unitarias con assert, ejecutores de pruebas, casos límite, estilo, enteros de ancho fijo, orden de bytes, Makefile y control de versiones, con código para leer y errores para detectar.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Compilas tus pruebas unitarias, escritas con `assert`, agregando `-DNDEBUG`. ¿Qué ocurre?'
    options:
      - id: 'a'
        text: 'Las pruebas se ejecutan igual, pero sin mostrar el mensaje de error.'
      - id: 'b'
        text: 'Cada assert desaparece del programa: las pruebas "pasan" sin comprobar nada.'
      - id: 'c'
        text: 'El programa no compila, porque NDEBUG es incompatible con assert.h.'
      - id: 'd'
        text: 'Solo se desactivan los assert que están dentro de funciones static.'
    correctOptionId: 'b'
    explanation: >-
      `NDEBUG` convierte cada `assert` en una sentencia vacía. Por eso las
      pruebas se compilan sin esa opción: de lo contrario nunca fallarían.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Una regla `test` de un Makefile que ejecuta un programa de pruebas que termina con un código distinto de cero hace que `make` se detenga con un error.'
    correctAnswer: true
    explanation: >-
      `make` interpreta un código de salida distinto de cero como un fallo del
      comando. Por eso el ejecutor de pruebas devuelve `EXIT_FAILURE` cuando
      alguna comprobación falla.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué muestra este programa en cualquier plataforma que lo compile?'
    code: |-
      #include <stdint.h>
      #include <stdio.h>

      int main(void) {
          printf("%zu %zu\n", sizeof(int16_t), sizeof(uint64_t));
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`2 8`'
      - id: 'b'
        text: '`4 8`'
      - id: 'c'
        text: '`2 4`'
      - id: 'd'
        text: 'Depende de la plataforma.'
    correctOptionId: 'a'
    explanation: >-
      Los tipos de `<stdint.h>` tienen un ancho exacto: `int16_t` ocupa 2
      bytes y `uint64_t` ocupa 8, en cualquier plataforma donde existan. En
      cambio, el tamaño de `int` o de `long` sí varía.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Este programa inspecciona el primer byte de un entero de 32 bits con valor 1. ¿Qué muestra en una máquina little-endian, como casi todas las actuales?'
    code: |-
      #include <stdint.h>
      #include <stdio.h>

      int main(void) {
          uint32_t n = 1;
          unsigned char *p = (unsigned char *)&n;

          printf("%d\n", p[0]);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1`, porque el byte menos significativo se guarda primero; en una máquina big-endian mostraría `0`.'
      - id: 'b'
        text: '`0`, porque el byte menos significativo se guarda último; en una máquina big-endian mostraría `1`.'
      - id: 'c'
        text: '`1` en cualquier máquina: el estándar fija el orden de los bytes.'
      - id: 'd'
        text: 'Un error de compilación: no se puede convertir uint32_t a unsigned char *.'
    correctOptionId: 'a'
    explanation: >-
      El orden de bytes depende de la arquitectura. Por eso un archivo binario
      que guarda enteros directamente puede no entenderse en otra máquina, y
      los formatos portables fijan el orden de forma explícita.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'En este fragmento, `char` es el mismo tipo con signo en todas las plataformas, así que el mensaje se muestra siempre.'
    code: |-
      char c = 200;

      if (c > 100) {
          puts("mayor");
      }
    codeLanguage: 'c'
    correctAnswer: false
    explanation: >-
      Si `char` tiene signo, 200 no cabe y el valor es dependiente de la
      implementación (negativo en la práctica), y no se muestra nada; si no
      tiene signo, sí. Para bytes se usa `unsigned char` o `uint8_t`.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Al ejecutar `make`, aparece `*** missing separator.  Stop.` en la línea 2. ¿Cuál es la causa más probable?'
    code: |-
      hola:
          echo hola
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Falta la palabra .PHONY antes de la regla.'
      - id: 'b'
        text: 'La línea del comando empieza con espacios y debe empezar con un tabulador.'
      - id: 'c'
        text: 'El objetivo hola no puede coincidir con un nombre de comando.'
      - id: 'd'
        text: 'Falta declarar la variable CC al principio del archivo.'
    correctOptionId: 'b'
    explanation: >-
      Los comandos de una regla deben empezar con un tabulador. Es el error más
      común al escribir un Makefile, y muchos editores lo convierten en espacios
      sin avisar.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Vas a probar `maximo(const int v[], size_t n)`. ¿Qué conjunto de casos es el más útil?'
    options:
      - id: 'a'
        text: 'Tres arreglos distintos con cinco valores positivos cada uno.'
      - id: 'b'
        text: 'Un arreglo de un solo elemento, uno con todos los valores negativos, uno con el máximo al principio y otro con el máximo al final.'
      - id: 'c'
        text: 'Solo el arreglo del enunciado de ejemplo.'
      - id: 'd'
        text: 'Cien arreglos aleatorios sin comprobar el resultado.'
    correctOptionId: 'b'
    explanation: >-
      Los errores viven en los bordes: un solo elemento, el primero y el último,
      los negativos. Un caso extra es equivalente a otro si ejercita el mismo
      camino del código; los casos límite no lo son.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Esta prueba pasa siempre que `sumar` devuelva algo distinto de cero. ¿Qué problema tiene y cómo se corrige?'
    code: |-
      #include <assert.h>
      #include <stdio.h>

      static int sumar(int a, int b) { return a + b; }

      int main(void) {
          assert(sumar(2, 3));
          printf("ok\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Ninguno: assert siempre compara el resultado con el esperado.'
      - id: 'b'
        text: 'Falla porque 5 es distinto de cero; hay que escribir assert(sumar(2, 3) == 0).'
      - id: 'c'
        text: 'Comprueba solo que el resultado sea verdadero; hay que comparar con el valor esperado: assert(sumar(2, 3) == 5).'
      - id: 'd'
        text: 'Debe llamarse dentro de un if para que se ejecute.'
    correctOptionId: 'c'
    explanation: >-
      `assert(expresion)` solo exige que la expresión sea verdadera. Un 5, un 7 o
      un -1 la cumplen por igual, así que esta prueba no distingue un `sumar`
      correcto de uno roto. El programa muestra `ok`.
  - kind: 'true-false'
    id: 'q9'
    prompt: '`size_t` es el tipo adecuado para el tamaño de un objeto o la cantidad de elementos de un arreglo.'
    correctAnswer: true
    explanation: >-
      `size_t` es el tipo sin signo que usan `sizeof`, `strlen` y `malloc`, y es
      lo bastante grande para cualquier tamaño de objeto en esa plataforma. Se
      imprime con `%zu`.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Preparas el repositorio del proyecto con Git. ¿Qué archivos corresponde registrar?'
    options:
      - id: 'a'
        text: 'Los .c, .h, las pruebas, el Makefile y el README; los ejecutables y .o se listan en .gitignore.'
      - id: 'b'
        text: 'Solo el ejecutable, porque es lo que usa el cliente.'
      - id: 'c'
        text: 'Todo lo que genera el compilador, y el código fuente se descarta.'
      - id: 'd'
        text: 'Nada hasta que el programa esté terminado.'
    correctOptionId: 'a'
    explanation: >-
      Se guarda el código fuente y lo necesario para reconstruir el proyecto; los
      binarios se regeneran con `make` y dependen de cada máquina.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Qué muestra este ejecutor de pruebas?'
    code: |-
      #include <stdio.h>

      #define VERIFICAR(cond)                          \
          do {                                         \
              total++;                                 \
              if (!(cond)) {                           \
                  fallidas++;                          \
                  printf("FALLA: %s\n", #cond);        \
              }                                        \
          } while (0)

      int main(void) {
          int total = 0;
          int fallidas = 0;

          VERIFICAR(2 + 2 == 4);
          VERIFICAR(10 / 3 == 4);
          VERIFICAR(-7 / 2 == -3);
          printf("%d pruebas, %d fallidas\n", total, fallidas);
          return fallidas != 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3 pruebas, 0 fallidas`'
      - id: 'b'
        text: '`FALLA: 10 / 3 == 4` y después `3 pruebas, 1 fallidas`'
      - id: 'c'
        text: '`FALLA: -7 / 2 == -3` y después `3 pruebas, 1 fallidas`'
      - id: 'd'
        text: '`FALLA: 10 / 3 == 4` y después `1 pruebas, 1 fallidas`'
    correctOptionId: 'b'
    explanation: >-
      `10 / 3` es `3` en la división entera, así que la segunda comprobación
      falla. La tercera pasa: C trunca hacia cero y `-7 / 2` es `-3`. El
      operador `#` imprime el texto de la condición y el programa termina con
      código 1.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'Antes de reescribir una función para que sea más rápida, conviene medir el programa para saber dónde se va realmente el tiempo.'
    correctAnswer: true
    explanation: >-
      Casi siempre el tiempo se va en un lugar distinto del que se imagina.
      Medir antes de optimizar evita complicar código que no es el cuello de
      botella.
---
