---
course: 'c'
lesson: 'depuracion-y-sanitizers'
slug: 'autoevaluacion-depuracion-y-sanitizers'
title: 'Autoevaluación: Depuración y sanitizers'
description: 'Doce preguntas sobre el método de depuración, las advertencias del compilador, el depurador, AddressSanitizer, UndefinedBehaviorSanitizer y assert, con código para leer y errores para detectar.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Un programa falla solo a veces. Según el método de depuración, ¿cuál es el primer paso?'
    options:
      - id: 'a'
        text: 'Cambiar condiciones y operadores hasta que el error desaparezca.'
      - id: 'b'
        text: 'Encontrar una entrada y una forma de ejecutarlo que muestre el error siempre.'
      - id: 'c'
        text: 'Agregar una llamada a printf en cada función.'
      - id: 'd'
        text: 'Compilar con -O3 para ver si el compilador lo corrige.'
    correctOptionId: 'b'
    explanation: >-
      Un error que no puedes reproducir no lo puedes confirmar como corregido.
      Primero se reproduce, después se aísla, se formula una hipótesis, se
      corrige y se verifica.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Compilar con `-Wall -Wextra -Wpedantic` basta para detectar un ciclo que lee una posición de más por usar `<=` en lugar de `<`.'
    correctAnswer: false
    explanation: >-
      Las advertencias detectan patrones sospechosos, no la lógica del
      programa. Un límite mal elegido es sintácticamente válido: para
      encontrarlo hacen falta el depurador, un sanitizer o una prueba.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'Este programa se compila con `-Wall`. ¿Qué ocurre?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int x = 3;

          if (x = 5) {
              printf("cinco\n");
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Compila sin advertencias y no muestra nada, porque x vale 3.'
      - id: 'b'
        text: 'No compila: asignar dentro de un if es un error de sintaxis.'
      - id: 'c'
        text: 'Advierte que se usa una asignación como condición y, al ejecutarlo, muestra `cinco`.'
      - id: 'd'
        text: 'Advierte y, al ejecutarlo, no muestra nada.'
    correctOptionId: 'c'
    explanation: >-
      `x = 5` asigna 5 y el valor de la expresión es 5, distinto de cero, así
      que la condición es verdadera. El compilador lo advierte porque casi
      siempre se quiso escribir `x == 5`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Compilas este programa con `-g -fsanitize=address` y lo ejecutas. ¿Qué informa AddressSanitizer?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          int *v = malloc(3 * sizeof *v);
          if (v == NULL) {
              return 1;
          }
          for (int i = 0; i <= 3; i++) {
              v[i] = i;
          }
          printf("%d\n", v[0]);
          free(v);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Un heap-buffer-overflow: se escribe una posición después del final del bloque reservado.'
      - id: 'b'
        text: 'Una fuga de memoria, porque el ciclo no libera cada posición.'
      - id: 'c'
        text: 'Un use-after-free, porque free(v) se llama antes del printf.'
      - id: 'd'
        text: 'Nada: escribir una posición de más dentro de un bloque grande es válido.'
    correctOptionId: 'a'
    explanation: >-
      Se reservan 3 enteros (posiciones 0 a 2), pero el ciclo escribe también
      `v[3]`. AddressSanitizer marca la escritura y señala la línea del ciclo
      y la de `malloc`. El `free` está después del `printf` y libera el bloque
      completo.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Para que un ejecutable ya compilado informe errores de memoria, basta con ejecutarlo con la variable `ASAN_OPTIONS`; no hace falta recompilarlo.'
    correctAnswer: false
    explanation: >-
      El sanitizer instrumenta el código al compilar: hay que volver a
      compilar con `-fsanitize=address`. `ASAN_OPTIONS` solo ajusta cómo se
      comporta un programa que ya fue compilado con esa opción.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Compilas con `-fsanitize=undefined` y ejecutas este programa. ¿Qué informa UndefinedBehaviorSanitizer?'
    code: |-
      #include <limits.h>
      #include <stdio.h>

      int main(void) {
          int x = INT_MAX;

          x = x + 1;
          printf("%d\n", x);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Un desborde de entero con signo: INT_MAX + 1 no se puede representar en int.'
      - id: 'b'
        text: 'Nada: el entero da la vuelta y el programa muestra el valor mínimo de int.'
      - id: 'c'
        text: 'Un acceso fuera de límites de un arreglo.'
      - id: 'd'
        text: 'Un puntero nulo desreferenciado.'
    correctOptionId: 'a'
    explanation: >-
      El desborde de enteros con signo es comportamiento indefinido en C. En
      un caso concreto puede parecer que "da la vuelta", pero el estándar no
      lo garantiza; UBSan lo informa con el mensaje `signed integer overflow`.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Estás detenido en una función durante una sesión de depuración y quieres ver qué funciones llamaron a esta. ¿Qué comando de GDB muestra la pila de llamadas?'
    code: |-
      (gdb) break promedio
      (gdb) run
      (gdb) next
      (gdb) print suma
      (gdb) ???
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: '`backtrace`'
      - id: 'b'
        text: '`watch suma`'
      - id: 'c'
        text: '`continue`'
      - id: 'd'
        text: '`break main`'
    correctOptionId: 'a'
    explanation: >-
      `backtrace` (o `bt`) lista las llamadas activas desde `main` hasta la
      función actual. `watch` detiene el programa cuando cambia una variable,
      `continue` sigue la ejecución y `break` crea un punto de parada.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Compilado sin `-DNDEBUG`, este programa muestra `fin`.'
    code: |-
      #include <assert.h>
      #include <stdio.h>

      int main(void) {
          int suma = 0;

          for (int i = 1; i <= 4; i++) {
              suma += i;
          }
          assert(suma == 11);
          printf("fin\n");
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: false
    explanation: >-
      La suma de 1 a 4 es 10, no 11. Con las comprobaciones activas, `assert`
      detiene el programa con un mensaje que nombra la condición y la línea,
      y `fin` no se muestra. Solo con `-DNDEBUG` la comprobación desaparece y
      el programa muestra `fin`.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'AddressSanitizer informa un heap-buffer-overflow en el ciclo de `copiar`. ¿Cuál es la causa y la corrección?'
    code: |-
      int *copiar(const int *origen, int n) {
          int *destino = malloc(n);
          if (destino == NULL) {
              return NULL;
          }
          for (int i = 0; i < n; i++) {
              destino[i] = origen[i];
          }
          return destino;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'El ciclo debería ir hasta n - 1; se corrige con i < n - 1.'
      - id: 'b'
        text: '`malloc(n)` reserva n bytes y no n enteros; se corrige con `malloc(n * sizeof *destino)`.'
      - id: 'c'
        text: 'Falta comprobar origen; se corrige con if (origen == NULL).'
      - id: 'd'
        text: 'Falta liberar destino dentro de la función; se corrige con free(destino) antes del return.'
    correctOptionId: 'b'
    explanation: >-
      El ciclo es correcto, pero el bloque tiene solo `n` bytes y cada `int`
      ocupa varios. La corrección multiplica por el tamaño del elemento.
      Liberar `destino` dentro de la función dejaría al llamador con un
      puntero inválido.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Qué muestra este programa y qué advierte `-Wshadow`?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int total = 10;

          for (int i = 0; i < 3; i++) {
              int total = 0;
              total += i;
          }
          printf("%d\n", total);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Muestra `3`; `-Wshadow` no dice nada.'
      - id: 'b'
        text: 'Muestra `10`; `-Wshadow` advierte que la declaración interna oculta a la externa.'
      - id: 'c'
        text: 'Muestra `0`; `-Wshadow` advierte que i no se usa.'
      - id: 'd'
        text: 'No compila: no se puede declarar total dos veces.'
    correctOptionId: 'b'
    explanation: >-
      La variable declarada dentro del ciclo es otra, distinta de la de
      `main`: las sumas se pierden en cada vuelta y el `printf` final muestra
      el 10 original. `-Wshadow` señala ese ocultamiento.
  - kind: 'true-false'
    id: 'q11'
    prompt: 'Si el sanitizer no informa nada al ejecutar el programa, está demostrado que el código no tiene errores de memoria.'
    correctAnswer: false
    explanation: >-
      Un sanitizer solo ve lo que se ejecuta. Una rama que nunca corre con
      tus entradas, o un error que depende de otros datos, no se detecta.
      Por eso conviene ejecutar también casos límite.
  - kind: 'single-choice'
    id: 'q12'
    prompt: 'Corregiste un error y ahora el caso que lo reproducía da el resultado esperado. ¿Cuál es el último paso del método?'
    options:
      - id: 'a'
        text: 'Borrar el caso de prueba para no ensuciar el proyecto.'
      - id: 'b'
        text: 'Quitar las advertencias del compilador para que no aparezcan más.'
      - id: 'c'
        text: 'Convertir ese caso en una comprobación de regresión que se ejecute cada vez que cambies el programa.'
      - id: 'd'
        text: 'Dar el trabajo por terminado: ya se verificó.'
    correctOptionId: 'c'
    explanation: >-
      Verificar una vez no basta: el mismo error puede volver con un cambio
      futuro. La comprobación de regresión, por ejemplo con `assert`, lo
      detecta cada vez.
---
