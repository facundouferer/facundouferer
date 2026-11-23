---
course: 'c'
lesson: 'compilacion-y-enlazado'
slug: 'autoevaluacion-compilacion-y-enlazado'
title: 'Autoevaluación: Compilación, enlazado y advertencias'
description: 'Once preguntas sobre las cuatro etapas de la compilación, archivos objeto y ejecutables, lectura de mensajes del compilador, errores de enlazado, advertencias, la política C23 del curso y el estado de salida.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Cuando ejecutas `gcc programa.c -o programa`, ¿en qué orden ocurren las etapas?'
    options:
      - id: 'a'
        text: 'Compilación, preprocesado, enlazado y ensamblado.'
      - id: 'b'
        text: 'Preprocesado, compilación, ensamblado y enlazado.'
      - id: 'c'
        text: 'Enlazado, preprocesado, compilación y ensamblado.'
      - id: 'd'
        text: 'Una sola etapa: `gcc` traduce el texto directamente a un ejecutable.'
    correctOptionId: 'b'
    explanation: >-
      `gcc` coordina cuatro herramientas en orden: el preprocesador resuelve las
      directivas `#`, el compilador traduce a ensamblador, el ensamblador genera
      el archivo objeto y el enlazador lo une con las bibliotecas para producir
      el ejecutable.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué produce este comando y qué puedes hacer con el resultado?'
    code: |-
      gcc -std=c23 -Wall -Wextra -Wpedantic -c programa.c
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Un ejecutable `programa` listo para correr con `./programa`.'
      - id: 'b'
        text: 'El texto preprocesado, que se muestra en la terminal.'
      - id: 'c'
        text: 'Un archivo objeto `programa.o` con código máquina que todavía no se puede ejecutar porque falta enlazarlo.'
      - id: 'd'
        text: 'Un archivo `programa.s` con instrucciones en ensamblador.'
    correctOptionId: 'c'
    explanation: >-
      `-c` significa "compila pero no enlaces": ejecuta preprocesado,
      compilación y ensamblado y se detiene con `programa.o`. Ese objeto hace
      referencia a funciones como `printf` sin saber dónde está su código; el
      enlazador lo resuelve en el paso siguiente (`gcc programa.o -o programa`).
  - kind: 'true-false'
    id: 'q3'
    prompt: 'El compilador recibe las macros definidas con `#define` y las reemplaza mientras traduce a ensamblador.'
    correctAnswer: false
    explanation: >-
      Las macros las resuelve el preprocesador, antes de que el compilador lea
      el archivo. Con `gcc -E` puedes ver que la directiva `#define` desapareció
      y que cada aparición de la macro ya fue sustituida por su texto. El
      compilador nunca ve las macros.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa y con qué estado de salida termina?'
    code: |-
      #include <stdio.h>

      #define MENSAJE "Hola"
      #define CIERRE "!\n"

      int main(void) {
          printf(MENSAJE ", C" CIERRE);
          return 4;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Muestra `Hola, C!` y termina con estado de salida 4.'
      - id: 'b'
        text: 'Muestra `MENSAJE, C CIERRE` y termina con estado de salida 0.'
      - id: 'c'
        text: 'No compila: `printf` no acepta varias cadenas seguidas.'
      - id: 'd'
        text: 'Muestra `Hola, C!` y termina con estado de salida 0, porque `printf` funcionó bien.'
    correctOptionId: 'a'
    explanation: >-
      El preprocesador reemplaza `MENSAJE` por `"Hola"` y `CIERRE` por `"!\n"`, y
      las cadenas literales seguidas se unen en una sola: `"Hola, C!\n"`. El
      valor del `return` de `main` es el estado de salida, así que `echo $?`
      mostraría `4`.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Compilaste `notas.c` y obtuviste este mensaje. ¿Qué significa?'
    code: |-
      notas.c:7:12: error: expected ';' after expression
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Hay un error en la línea 12, columna 7; el ejecutable se generó igual.'
      - id: 'b'
        text: 'Hay un error en la línea 7, columna 12, de `notas.c`; no se generó ningún archivo y hay que agregar el `;` que falta.'
      - id: 'c'
        text: 'Es una advertencia: el programa compila, pero conviene revisarlo.'
      - id: 'd'
        text: 'Es un error de enlazado: falta el archivo objeto de `notas.c`.'
    correctOptionId: 'b'
    explanation: >-
      El formato es `archivo:línea:columna: tipo: descripción`. Como el tipo es
      `error` (no `warning`), la compilación se detuvo sin generar el archivo.
      Es un error de sintaxis, propio de la etapa de compilación.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿En qué etapa falló este comando y cómo lo reconoces?'
    code: |-
      $ gcc programa.o -o programa
      /usr/bin/ld: programa.o: in function `main':
      programa.c:(.text+0x10): undefined reference to `calcular'
      collect2: error: ld returned 1 exit status
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'En el preprocesado: no encontró el archivo de cabecera de `calcular`.'
      - id: 'b'
        text: 'En la compilación: `calcular` tiene un error de sintaxis en la línea 10.'
      - id: 'c'
        text: 'En el enlazado: lo informa `ld`, no indica una línea de tu código y habla de una referencia no definida.'
      - id: 'd'
        text: 'En la ejecución: el programa se cerró al llamar a `calcular`.'
    correctOptionId: 'c'
    explanation: >-
      `ld` es el enlazador. `undefined reference` significa que el objeto usa
      `calcular`, pero el enlazador no encontró su código ni en los objetos ni en
      las bibliotecas. El `+0x10` es una posición dentro del código máquina, no
      una línea del fuente.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Con el comando del curso, este programa compila pero muestra dos advertencias. ¿Cuál es la corrección adecuada?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int total = 10;
          printf("Precio: %d\n", 2.5);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Ninguna: si el ejecutable se genera, las advertencias se pueden ignorar.'
      - id: 'b'
        text: 'Quitar `-Wall` del comando para que no aparezcan.'
      - id: 'c'
        text: 'Cambiar `2.5` por `"2.5"` para que `%d` lo acepte.'
      - id: 'd'
        text: 'Usar `%f` para mostrar el `double` `2.5` y borrar la variable `total`, que nunca se usa.'
    correctOptionId: 'd'
    explanation: >-
      `%d` espera un `int` y recibe un `double`: el resultado de ese `printf` es
      comportamiento indefinido (`-Wformat`). La variable `total` está declarada
      y nunca se usa (`-Wunused-variable`). En el curso, un programa está
      terminado cuando compila sin ninguna advertencia.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Cuando el compilador emite solo advertencias (`warning`), igualmente genera el archivo de salida.'
    correctAnswer: true
    explanation: >-
      Una advertencia no detiene la compilación, y por eso es peligrosa: el
      programa se genera y falla después. Si quieres que el compilador no genere
      nada hasta corregirlas, agrega `-Werror`, que convierte cada advertencia en
      un error.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Para qué sirve la opción `-Wpedantic` en el comando del curso?'
    options:
      - id: 'a'
        text: 'Activa absolutamente todas las advertencias que conoce el compilador.'
      - id: 'b'
        text: 'Advierte cuando el código usa algo que no pertenece al estándar elegido, como una extensión del compilador.'
      - id: 'c'
        text: 'Guarda información de depuración para usar GDB o LLDB.'
      - id: 'd'
        text: 'Elige el estándar ISO C23.'
    correctOptionId: 'b'
    explanation: >-
      `-Wpedantic` señala lo que no es C estándar. `-std=c23` elige el estándar,
      `-g` guarda información de depuración, y ni siquiera `-Wall` activa
      "todas" las advertencias: por eso el curso suma `-Wextra`.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'Si un compilador acepta la opción `-std=c23`, eso garantiza que implementa todas las características de C23.'
    correctAnswer: false
    explanation: >-
      La opción elige el estándar, pero algunas características de C23 pueden
      faltar en un compilador o en su biblioteca estándar. Además, los
      compiladores anteriores a GCC 14 o Clang 18 usan el nombre provisional
      `-std=c2x`.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'El programa empieza con `#include <stdoi.h>` (con un error de tipeo). ¿Qué ocurre al compilarlo?'
    options:
      - id: 'a'
        text: 'Falla el preprocesado: el preprocesador no encuentra `stdoi.h` y se detiene con un `fatal error`.'
      - id: 'b'
        text: 'Compila bien y falla el enlazado, porque falta la biblioteca `stdoi`.'
      - id: 'c'
        text: 'Compila con una advertencia y el programa funciona normalmente.'
      - id: 'd'
        text: 'El programa compila, pero falla al ejecutarse.'
    correctOptionId: 'a'
    explanation: >-
      `#include` es una directiva del preprocesador, la primera etapa. Si el
      archivo no existe, el proceso se detiene ahí con un mensaje como
      `fatal error: stdoi.h: No such file or directory`, y las etapas siguientes
      nunca llegan a ejecutarse.
---
