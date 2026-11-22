---
course: 'c'
lesson: 'punteros-y-direcciones'
slug: 'autoevaluacion-punteros-y-direcciones'
title: 'Autoevaluación: Punteros y direcciones de memoria'
description: 'Doce preguntas sobre direcciones y el operador &, declaración y desreferencia de punteros, NULL y punteros inválidos, parámetros puntero pasados por valor y const.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué es un puntero en C?'
    options:
      - id: 'a'
        text: 'Un alias del nombre de otra variable, que no ocupa memoria propia.'
      - id: 'b'
        text: 'Una variable cuyo valor es la dirección de otro objeto.'
      - id: 'c'
        text: 'Una copia del valor de otra variable que se actualiza sola.'
      - id: 'd'
        text: 'Un número de línea del programa al que se puede saltar.'
    correctOptionId: 'b'
    explanation: >-
      Un puntero es una variable como cualquier otra: ocupa memoria y tiene su
      propia dirección. Lo particular es su valor, que es la dirección de otro
      objeto. Con `*` se llega a ese objeto para leerlo o modificarlo.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué imprime este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int a = 4;
          int b = 10;
          int *p = &a;
          *p = *p + 5;
          p = &b;
          *p = *p - a;
          printf("%d %d\n", a, b);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`4 10`'
      - id: 'b'
        text: '`9 10`'
      - id: 'c'
        text: '`9 1`'
      - id: 'd'
        text: '`4 6`'
    correctOptionId: 'c'
    explanation: >-
      Primero `p` apunta a `a`, así que `*p = *p + 5` deja `a` en 9. Después
      `p = &b` cambia a qué objeto apunta `p` (no copia ningún entero), y
      `*p = *p - a` deja `b` en `10 - 9`, es decir, 1.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'La declaración `int *p, q;` declara dos punteros a `int`: `p` y `q`.'
    correctAnswer: false
    explanation: >-
      El `*` pertenece a cada nombre, no al tipo. `p` es un `int *`, pero `q` es
      un `int` común. Para evitar esta confusión conviene declarar un puntero
      por línea.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Este programa quiere intercambiar `x` e `y`, pero imprime `x = 3, y = 8`. ¿Cuál es la corrección?'
    code: |-
      #include <stdio.h>

      void intercambiar(int a, int b) {
          int aux = a;
          a = b;
          b = aux;
      }

      int main(void) {
          int x = 3;
          int y = 8;
          intercambiar(x, y);
          printf("x = %d, y = %d\n", x, y);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Declarar `aux` como `static` para que conserve el valor entre llamadas.'
      - id: 'b'
        text: 'Recibir `int *a, int *b`, intercambiar `*a` y `*b`, y llamar con `intercambiar(&x, &y)`.'
      - id: 'c'
        text: 'Agregar `return a;` al final de la función.'
      - id: 'd'
        text: 'Escribir `intercambiar(x, y)` antes de declarar `x` e `y`.'
    correctOptionId: 'b'
    explanation: >-
      C pasa los argumentos por valor: `a` y `b` son copias, así que cambiarlas
      no toca `x` ni `y`. Si la función recibe las direcciones de `x` e `y`,
      puede modificar esos objetos desreferenciando los punteros.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué imprime este programa?'
    code: |-
      #include <stdio.h>

      void reiniciar(int *p) {
          int cero = 0;
          *p = *p * 2;
          p = &cero;
          *p = 7;
      }

      int main(void) {
          int x = 5;
          int *px = &x;
          reiniciar(px);
          printf("x = %d, px apunta a x: %s\n", x, px == &x ? "si" : "no");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`x = 7, px apunta a x: no`'
      - id: 'b'
        text: '`x = 10, px apunta a x: si`'
      - id: 'c'
        text: '`x = 5, px apunta a x: si`'
      - id: 'd'
        text: '`x = 0, px apunta a x: no`'
    correctOptionId: 'b'
    explanation: >-
      `p` recibe una copia de `px`. `*p = *p * 2` escribe en `x`, que pasa a 10.
      Después `p = &cero` cambia solo la copia local: `*p = 7` escribe en `cero`,
      no en `x`. En `main`, `px` sigue apuntando a `x`. El puntero también se
      pasa por valor.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Al escribir `intercambiar(&x, &y)`, C usa un mecanismo especial de pasaje por referencia distinto del pasaje por valor.'
    correctAnswer: false
    explanation: >-
      C pasa los argumentos siempre por valor. `&x` y `&y` son dos valores (dos
      direcciones) que se copian en los parámetros. Lo que modifica las
      variables de quien llama es la desreferenciación dentro de la función,
      no la llamada.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Un programa ejecuta `int *q = NULL;` y después `printf("%d\n", *q);`. ¿Qué ocurre?'
    options:
      - id: 'a'
        text: 'Imprime `0`, porque `NULL` vale cero.'
      - id: 'b'
        text: 'El compilador siempre rechaza el programa.'
      - id: 'c'
        text: 'Es comportamiento indefinido: `q` no apunta a ningún objeto, así que no se puede desreferenciar.'
      - id: 'd'
        text: 'Imprime la dirección guardada en `q`.'
    correctOptionId: 'c'
    explanation: >-
      `NULL` significa "no apunta a nada": se puede comparar, nunca
      desreferenciar. El estándar no dice qué pasa al hacerlo; suele terminar
      con un error de segmentación, pero no hay ninguna garantía.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Este fragmento compila, pero es incorrecto. ¿Cuál es el problema?'
    code: |-
      int *p;
      *p = 10;
      printf("%d\n", *p);
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Falta convertir `p` con `(void *)` antes de usarlo.'
      - id: 'b'
        text: '`p` no está inicializado: su valor es basura y `*p = 10` escribe en una dirección cualquiera (comportamiento indefinido).'
      - id: 'c'
        text: 'No se puede asignar un número a `*p`; solo se puede leer.'
      - id: 'd'
        text: 'Ninguno: un puntero sin inicializar apunta a `NULL` automáticamente.'
    correctOptionId: 'b'
    explanation: >-
      Una variable local sin inicializar tiene un valor indeterminado, y un
      puntero no es la excepción. La corrección es que nazca apuntando a algo
      válido (`int x; int *p = &x;`) o a `NULL`, y comprobarlo antes de
      desreferenciar.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Qué imprime este programa?'
    code: |-
      #include <stdio.h>

      void min_max(const int datos[], size_t n, int *minimo, int *maximo) {
          *minimo = datos[0];
          *maximo = datos[0];
          for (size_t i = 1; i < n; i++) {
              if (datos[i] < *minimo) {
                  *minimo = datos[i];
              }
              if (datos[i] > *maximo) {
                  *maximo = datos[i];
              }
          }
      }

      int main(void) {
          int notas[] = {7, 3, 9, 5};
          int menor = 0;
          int mayor = 0;
          min_max(notas, 4, &menor, &mayor);
          printf("%d %d\n", menor, mayor);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`0 0`'
      - id: 'b'
        text: '`7 7`'
      - id: 'c'
        text: '`3 9`'
      - id: 'd'
        text: '`9 3`'
    correctOptionId: 'c'
    explanation: >-
      `minimo` y `maximo` son parámetros de salida: reciben las direcciones de
      `menor` y `mayor`, y la función deja allí los resultados. Así una función
      puede devolver más de un resultado.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Cuál de las líneas marcadas no compila?'
    code: |-
      int x = 1;
      int y = 2;
      const int *p = &x;
      int *const q = &x;
      p = &y;   /* línea A */
      *q = 5;   /* línea B */
      *p = 3;   /* línea C */
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'La línea A, porque `p` es constante.'
      - id: 'b'
        text: 'La línea B, porque `q` es constante.'
      - id: 'c'
        text: 'La línea C, porque `p` apunta a un `int` de solo lectura.'
      - id: 'd'
        text: 'Las tres compilan sin errores.'
    correctOptionId: 'c'
    explanation: >-
      En `const int *p` el `const` está a la izquierda del `*`: protege el
      objeto apuntado, así que `*p = 3` es un error, pero `p` puede apuntar a
      otro objeto. En `int *const q` protege el puntero: `*q = 5` es válido.
  - kind: 'true-false'
    id: 'q11'
    prompt: 'Para imprimir una dirección se usa `%p` con el puntero convertido a `void *`, y un programa correcto no debe depender del valor concreto que se imprime.'
    correctAnswer: true
    explanation: >-
      `%p` espera un `void *`. El formato lo decide cada implementación y las
      direcciones cambian entre ejecuciones, porque el sistema operativo ubica
      el programa en posiciones distintas cada vez.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'Si `edad` es un `int`, la línea `double *pd = &edad;` es correcta y `*pd` lee la edad como un número decimal.'
    correctAnswer: false
    explanation: >-
      Los tipos de puntero deben coincidir. Con las opciones del curso el
      compilador avisa que `int *` y `double *` son incompatibles; si se
      forzara, `*pd` leería más bytes de los que tiene `edad` y los
      interpretaría mal: comportamiento indefinido.
---
