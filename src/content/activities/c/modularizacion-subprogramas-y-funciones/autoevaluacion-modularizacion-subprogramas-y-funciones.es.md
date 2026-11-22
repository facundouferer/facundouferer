---
course: 'c'
lesson: 'modularizacion-subprogramas-y-funciones'
slug: 'autoevaluacion-modularizacion-subprogramas-y-funciones'
title: 'Autoevaluación: Modularización, subprogramas y funciones'
description: 'Doce preguntas sobre declaración y definición, prototipos, funciones void y return, encabezados con guardas de inclusión, compilación separada, errores de enlazado y funciones static.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué es la línea `int sumar(int a, int b);`?'
    options:
      - id: 'a'
        text: 'La definición de `sumar`.'
      - id: 'b'
        text: 'Una llamada a `sumar` con dos argumentos.'
      - id: 'c'
        text: 'Un prototipo: una declaración que anuncia el nombre, los parámetros y el tipo de retorno, sin el cuerpo.'
      - id: 'd'
        text: 'Una macro del preprocesador.'
    correctOptionId: 'c'
    explanation: >-
      Termina en punto y coma y no tiene cuerpo: es una declaración con los
      tipos de los parámetros, es decir, un prototipo. La definición es la
      función completa con su cuerpo, y hay exactamente una en todo el programa.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'En un proyecto de varios archivos, los `.h` se pasan al compilador igual que los `.c`: `gcc main.c calculadora.c calculadora.h`.'
    correctAnswer: false
    explanation: >-
      Los encabezados no se compilan por separado: entran en cada `.c` a través
      de `#include`. Al compilador se le pasan solo los `.c` (o sus `.o`).
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int doble(int n);
      int sumar_dobles(int a, int b);

      int main(void) {
          printf("%d\n", sumar_dobles(3, 4));
          printf("%d\n", doble(sumar_dobles(1, 1)));
          return 0;
      }

      int doble(int n) {
          return 2 * n;
      }

      int sumar_dobles(int a, int b) {
          return doble(a) + doble(b);
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`14` y `8`'
      - id: 'b'
        text: '`7` y `4`'
      - id: 'c'
        text: '`14` y `4`'
      - id: 'd'
        text: 'No compila, porque `doble` y `sumar_dobles` están definidas después de `main`.'
    correctOptionId: 'a'
    explanation: >-
      Los prototipos permiten definir las funciones después de `main`.
      `sumar_dobles(3, 4)` es `6 + 8 = 14`. `sumar_dobles(1, 1)` es 4, y su doble
      es 8.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '`main.c` y `calculadora.c` compilaron sin errores, pero este comando falla. ¿Por qué?'
    code: |-
      $ gcc main.o -o calculadora
      Undefined symbols for architecture arm64:
        "_sumar", referenced from:
            _main in main.o
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Falta `#include "calculadora.h"` en `main.c`.'
      - id: 'b'
        text: 'Es un error de enlazado: falta pasarle `calculadora.o`, donde está la definición de `sumar`. Se corrige con `gcc main.o calculadora.o -o calculadora`.'
      - id: 'c'
        text: 'El prototipo de `sumar` no coincide con su definición.'
      - id: 'd'
        text: 'Hay que compilar `calculadora.h` con `-c`.'
    correctOptionId: 'b'
    explanation: >-
      `main.o` tiene una referencia pendiente a `sumar`, que el compilador
      aceptó gracias al prototipo. El enlazador busca su definición en los
      objetos que recibe y no la encuentra porque `calculadora.o` no está en el
      comando.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Para qué sirven estas tres líneas en `calculadora.h`?'
    code: |-
      #ifndef CALCULADORA_H
      #define CALCULADORA_H
      // prototipos
      #endif
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Para que el enlazador encuentre `calculadora.c`.'
      - id: 'b'
        text: 'Para que el contenido del encabezado se copie una sola vez aunque llegue dos veces a la misma unidad de compilación.'
      - id: 'c'
        text: 'Para definir una constante `CALCULADORA_H` que usa `main`.'
      - id: 'd'
        text: 'Para que las funciones del módulo sean `static`.'
    correctOptionId: 'b'
    explanation: >-
      Son guardas de inclusión: la primera vez, `CALCULADORA_H` no está definido
      y el contenido se copia; si el encabezado vuelve a incluirse, el nombre ya
      existe y el contenido se salta. Son indispensables cuando el encabezado
      tenga definiciones que no se pueden repetir.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'El cuerpo de `sumar` está escrito dentro de `calculadora.h`, y ese encabezado se incluye desde `main.c` y desde `calculadora.c`. ¿Qué error aparece al enlazar?'
    code: |-
      // calculadora.h
      #ifndef CALCULADORA_H
      #define CALCULADORA_H

      int sumar(int a, int b) {
          return a + b;
      }

      #endif
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Ninguno: las guardas de inclusión lo evitan.'
      - id: 'b'
        text: '`undefined reference to sumar`.'
      - id: 'c'
        text: '`multiple definition of sumar`: cada `.c` tiene su propia definición y el enlazador encuentra dos.'
      - id: 'd'
        text: 'Un error del preprocesador, porque los `.h` no admiten llaves.'
    correctOptionId: 'c'
    explanation: >-
      Las guardas solo evitan la repetición dentro de una misma unidad de
      compilación. `main.c` y `calculadora.c` se compilan por separado y cada
      uno recibe una copia de la definición. Regla: en el `.h` van
      declaraciones, en el `.c` van definiciones.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Una función declarada `static` en `calculadora.c` solo es visible dentro de ese archivo.'
    correctAnswer: true
    explanation: >-
      Aplicado a una función, `static` hace que el enlazador no la ofrezca a
      otras unidades de compilación. Sirve para ocultar ayudantes internos y
      evitar choques de nombres. Regla práctica: lo que no está en el `.h`
      debería ser `static`.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Este programa no compila con `-std=c23`. ¿Cuál es la corrección que no mueve ninguna función?'
    code: |-
      #include <stdio.h>

      int main(void) {
          printf("%d\n", triple(5));
          return 0;
      }

      int triple(int n) {
          return 3 * n;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Agregar `#include "triple.h"` sin crear el archivo.'
      - id: 'b'
        text: 'Cambiar `int triple` por `void triple`.'
      - id: 'c'
        text: 'Compilar con `-c` para saltear el error.'
      - id: 'd'
        text: 'Agregar el prototipo `int triple(int n);` antes de `main`.'
    correctOptionId: 'd'
    explanation: >-
      El compilador lee de arriba hacia abajo y, al llegar a la llamada, todavía
      no conoce `triple`. Desde C99 llamar a una función no declarada es un
      error. El prototipo la anuncia y además permite comprobar los argumentos.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'En C23, `int leer()` significa lo mismo que `int leer(void)`: una función sin parámetros.'
    correctAnswer: true
    explanation: >-
      Desde C23 una lista vacía significa "sin parámetros". En C17 y anteriores
      significaba "parámetros sin especificar" y el compilador no comprobaba los
      argumentos; por eso `(void)` es la forma que vale en todos los
      estándares.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Qué problema tiene esta función?'
    code: |-
      int signo(int n) {
          if (n > 0) {
              return 1;
          } else if (n < 0) {
              return -1;
          }
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Ninguno: si `n` vale 0, devuelve 0 automáticamente.'
      - id: 'b'
        text: 'Cuando `n` vale 0 termina sin ejecutar ningún `return`; usar ese resultado es comportamiento indefinido. Hay que agregar `return 0;` al final.'
      - id: 'c'
        text: 'Una función no puede tener dos `return`.'
      - id: 'd'
        text: 'Debería ser `void` porque usa `if`.'
    correctOptionId: 'b'
    explanation: >-
      Una función que no es `void` debe devolver un valor en todos sus caminos.
      Con `-Wall` el compilador avisa que el control puede llegar al final sin
      `return`.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Qué diferencia hay entre `#include "calculadora.h"` y `#include <stdio.h>`?'
    options:
      - id: 'a'
        text: 'Ninguna: las comillas y los ángulos son intercambiables siempre.'
      - id: 'b'
        text: 'Las comillas incluyen el `.c` además del `.h`.'
      - id: 'c'
        text: 'Las comillas buscan primero en la carpeta del proyecto; los ángulos buscan en las carpetas del sistema.'
      - id: 'd'
        text: 'Los ángulos solo funcionan con C23.'
    correctOptionId: 'c'
    explanation: >-
      Por convención, tus propios encabezados se incluyen con comillas y los de
      la biblioteca estándar con ángulos. `#include` nunca trae el `.c`: la
      implementación se agrega al enlazar.
  - kind: 'single-choice'
    id: 'q12'
    prompt: 'Una función `leer_calcular_y_mostrar_promedio` lee los datos, calcula y además imprime. ¿Cuál es la mejor reorganización?'
    options:
      - id: 'a'
        text: 'Dejarla así y declararla `static`.'
      - id: 'b'
        text: 'Moverla a un `.h` para que todos la usen.'
      - id: 'c'
        text: 'Copiar su cuerpo dentro de `main` para que el programa sea más corto.'
      - id: 'd'
        text: 'Separarla en funciones con una responsabilidad cada una: una que calcula y devuelve el promedio, y otras que leen y muestran.'
    correctOptionId: 'd'
    explanation: >-
      Si el nombre necesita varios "y", probablemente son varias funciones. La
      que calcula, separada de la entrada y la salida, se puede reutilizar y
      probar en cualquier contexto.
---
