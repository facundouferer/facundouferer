---
course: 'c'
lesson: 'recursividad'
slug: 'autoevaluacion-recursividad'
title: 'Autoevaluación: Recursividad'
description: 'Doce preguntas sobre caso base y caso recursivo, la pila de llamadas, trazas de funciones recursivas, errores que impiden terminar, el costo de Fibonacci, el desbordamiento de pila y cuándo preferir un ciclo.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué dos partes necesita toda función recursiva para terminar?'
    options:
      - id: 'a'
        text: 'Un ciclo `for` y un `return`.'
      - id: 'b'
        text: 'Un caso base que responde sin llamarse y un caso recursivo que se llama con un problema más cercano al caso base.'
      - id: 'c'
        text: 'Una variable global y una variable `static`.'
      - id: 'd'
        text: 'Dos llamadas recursivas, como Fibonacci.'
    correctOptionId: 'b'
    explanation: >-
      Sin caso base, la función se llama para siempre. Con caso base pero sin
      acercarse a él, tampoco termina. Las dos partes son obligatorias.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      long long factorial(int n) {
          if (n <= 1) {
              return 1;
          }
          return n * factorial(n - 1);
      }

      int main(void) {
          printf("%lld\n", factorial(5));
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`5`'
      - id: 'b'
        text: '`15`'
      - id: 'c'
        text: '`120`'
      - id: 'd'
        text: '`24`'
    correctOptionId: 'c'
    explanation: >-
      `factorial(5)` queda esperando `5 * factorial(4)`, y así hasta
      `factorial(1)`, que devuelve 1. A la vuelta se resuelven las
      multiplicaciones pendientes: `2 * 1`, `3 * 2`, `4 * 6` y `5 * 24 = 120`.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué devuelve `suma_digitos(9071)`?'
    code: |-
      int suma_digitos(int n) {
          if (n < 10) {
              return n;
          }
          return n % 10 + suma_digitos(n / 10);
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`17`'
      - id: 'b'
        text: '`16`'
      - id: 'c'
        text: '`9071`'
      - id: 'd'
        text: '`1`'
    correctOptionId: 'a'
    explanation: >-
      Cada llamada separa el último dígito con `% 10` y llama con el resto del
      número (`/ 10`): `1 + suma_digitos(907)`, `7 + suma_digitos(90)`,
      `0 + suma_digitos(9)`, y el caso base devuelve 9. A la vuelta:
      `9 + 0 + 7 + 1 = 17`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Esta función cuenta cuántos pasos de 2 hay hasta llegar a 0. Con `contar(5)` el programa termina con `Segmentation fault`. ¿Cuál es el error y su corrección?'
    code: |-
      // Requiere n >= 0.
      int contar(int n) {
          if (n == 0) {
              return 0;
          }
          return 1 + contar(n - 2);
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Falta `static` en `n`; con `static int n` termina bien.'
      - id: 'b'
        text: 'La función debería ser `void`.'
      - id: 'c'
        text: 'Con un `n` impar, `n` pasa de 1 a −1 y nunca vale 0: el caso base nunca se cumple. Se corrige con `if (n <= 0)`.'
      - id: 'd'
        text: 'El error está en `1 +`: hay que quitarlo.'
    correctOptionId: 'c'
    explanation: >-
      Que exista un caso base no alcanza: las llamadas tienen que llegar a él.
      Con 5 los valores son 5, 3, 1, −1, −3… y cada llamada apila un marco hasta
      agotar la pila. Una condición `n <= 0` atrapa también los valores que se
      pasan de largo.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'En una función recursiva, todas las llamadas comparten una misma variable `n` que se va modificando.'
    correctAnswer: false
    explanation: >-
      Cada llamada tiene su propio marco en la pila de llamadas, con su propia
      copia de los parámetros y de las variables locales. En el punto más
      profundo de `factorial(4)` hay cuatro `n` distintas al mismo tiempo.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Durante `factorial(4)`, ¿cuántos marcos de `factorial` hay en la pila en el momento más profundo?'
    options:
      - id: 'a'
        text: '1, porque cada llamada reemplaza a la anterior.'
      - id: 'b'
        text: '4: `f(4)`, `f(3)`, `f(2)` y `f(1)`, todos en la pila al mismo tiempo.'
      - id: 'c'
        text: '24, uno por cada unidad del resultado.'
      - id: 'd'
        text: '2: el de `main` y el de `factorial`.'
    correctOptionId: 'b'
    explanation: >-
      Las llamadas se apilan en la fase de ida y cada una queda en pausa
      esperando el resultado de la siguiente. La profundidad de `factorial(n)`
      es `n` marcos (además del de `main`).
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Esta función compila con una advertencia y su resultado no es confiable. ¿Qué le falta?'
    code: |-
      int mcd(int a, int b) {
          if (b == 0) {
              return a;
          }
          mcd(b, a % b);
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Un segundo caso base para `a == 0`.'
      - id: 'b'
        text: 'Declarar `a` y `b` como `static`.'
      - id: 'c'
        text: 'Cambiar `a % b` por `a / b`.'
      - id: 'd'
        text: 'El `return` delante de la llamada recursiva: `return mcd(b, a % b);`. Sin él, el resultado de la llamada se pierde.'
    correctOptionId: 'd'
    explanation: >-
      La llamada se hace, pero su valor se descarta y la función termina sin
      ejecutar un `return` en ese camino. Usar ese resultado es comportamiento
      indefinido; `-Wall` avisa que el control llega al final de una función que
      no es `void`.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Con la versión recursiva ingenua de Fibonacci (dos llamadas por cada `n >= 2`), ¿cuántas llamadas en total hace `fibonacci(5)`?'
    options:
      - id: 'a'
        text: '5'
      - id: 'b'
        text: '6'
      - id: 'c'
        text: '15'
      - id: 'd'
        text: '32'
    correctOptionId: 'c'
    explanation: >-
      Las llamadas forman un árbol en el que `fib(3)` se calcula 2 veces y
      `fib(2)` 3 veces, siempre desde cero. En total son 15 llamadas, y la
      cantidad crece aproximadamente como `1.6^n`: un costo exponencial que un
      ciclo resuelve en `n` pasos.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'El estándar de C fija una profundidad máxima de recursión igual en todos los sistemas.'
    correctAnswer: false
    explanation: >-
      El tamaño de la pila depende del sistema y de la configuración (es común
      que el hilo principal tenga unos 8 MB en Linux y macOS y 1 MB en Windows).
      El estándar no fija ni el tamaño ni una profundidad máxima.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      void cuenta(int n) {
          if (n == 0) {
              return;
          }
          printf("%d ", n);
          cuenta(n - 1);
          printf("%d ", n);
      }

      int main(void) {
          cuenta(3);
          printf("\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3 2 1`'
      - id: 'b'
        text: '`3 2 1 1 2 3`'
      - id: 'c'
        text: '`3 2 1 0 1 2 3`'
      - id: 'd'
        text: '`1 2 3 3 2 1`'
    correctOptionId: 'b'
    explanation: >-
      El primer `printf` se ejecuta a la ida (3, 2, 1). `cuenta(0)` llega al caso
      base y no muestra nada. El segundo `printf` de cada marco se ejecuta a la
      vuelta, cuando los marcos se retiran en orden inverso: 1, 2, 3.
  - kind: 'true-false'
    id: 'q11'
    prompt: 'El estándar de C garantiza que el compilador transforma la recursión de cola en un ciclo, así que una función con recursión de cola nunca desborda la pila.'
    correctAnswer: false
    explanation: >-
      Algunos compiladores lo hacen al optimizar (por ejemplo, con `-O2`), pero
      el estándar no lo garantiza. Un programa correcto no debe depender de esa
      optimización.
  - kind: 'single-choice'
    id: 'q12'
    prompt: '¿En cuál de estos casos conviene **no** usar recursión?'
    options:
      - id: 'a'
        text: 'Sumar los números de 1 a 10 millones.'
      - id: 'b'
        text: 'Calcular el máximo común divisor de dos números pequeños con el algoritmo de Euclides.'
      - id: 'c'
        text: 'Calcular `2^10`.'
      - id: 'd'
        text: 'Contar los dígitos de un `int`.'
    correctOptionId: 'a'
    explanation: >-
      Es un recorrido lineal y necesitaría 10 millones de marcos simultáneos:
      con mucha probabilidad desbordaría la pila, aunque la función fuera
      correcta. Un ciclo es igual de claro y usa memoria constante. En los otros
      casos la profundidad es pequeña.
---
