---
course: 'c'
lesson: 'operaciones-con-arreglos'
slug: 'autoevaluacion-operaciones-con-arreglos'
title: 'Autoevaluación: Operaciones con Arreglos'
description: 'Doce preguntas sobre recorrer hacia atrás con size_t, máximo y mínimo, búsqueda, inversión, inserción y eliminación corriendo elementos, capacidad y cantidad usada, y recorridos de matrices.'
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

      void invertir(int v[], size_t n) {
          for (size_t i = 0; i < n / 2; i++) {
              int aux = v[i];
              v[i] = v[n - 1 - i];
              v[n - 1 - i] = aux;
          }
      }

      int main(void) {
          int v[] = {1, 2, 3, 4, 5};

          invertir(v, 5);
          for (size_t i = 0; i < 5; i++) {
              printf("%d ", v[i]);
          }
          printf("\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`5 4 3 2 1`'
      - id: 'b'
        text: '`1 2 3 4 5`'
      - id: 'c'
        text: '`5 4 3 4 5`'
      - id: 'd'
        text: '`5 2 3 4 1`'
    correctOptionId: 'a'
    explanation: >-
      Con `n = 5` el ciclo da dos vueltas (`5 / 2` es 2): intercambia los
      extremos 1 y 5, después 2 y 4. El elemento del medio queda en su lugar.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'El ciclo `for (size_t i = n - 1; i >= 0; i--)` recorre un arreglo del último elemento al primero y termina.'
    correctAnswer: false
    explanation: >-
      Un `size_t` nunca es negativo, así que `i >= 0` siempre es verdadero. Cuando
      `i` vale 0, `i--` lo convierte en el `size_t` más grande y el ciclo lee
      fuera del límite. La forma correcta es `for (size_t i = n; i > 0; i--)` con
      `v[i - 1]`.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      #define CAPACIDAD 6

      bool insertar(int v[], size_t n, size_t capacidad, size_t pos, int valor) {
          if (n >= capacidad || pos > n) {
              return false;
          }
          for (size_t i = n; i > pos; i--) {
              v[i] = v[i - 1];
          }
          v[pos] = valor;
          return true;
      }

      int main(void) {
          int datos[CAPACIDAD] = {10, 20, 30, 40};
          size_t n = 4;

          if (insertar(datos, n, CAPACIDAD, 1, 99)) {
              n++;
          }
          if (insertar(datos, n, CAPACIDAD, 7, 50)) {
              n++;
          }
          for (size_t i = 0; i < n; i++) {
              printf("%d ", datos[i]);
          }
          printf("(n = %zu)\n", n);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`10 99 20 30 40 50 (n = 6)`'
      - id: 'b'
        text: '`10 99 20 30 40 (n = 5)`'
      - id: 'c'
        text: '`99 10 20 30 40 (n = 5)`'
      - id: 'd'
        text: '`10 99 30 40 (n = 4)`'
    correctOptionId: 'b'
    explanation: >-
      La primera inserción corre 40, 30 y 20 un lugar a la derecha y escribe 99
      en la posición 1. La segunda pide la posición 7, mayor que `n` (5), así que
      la función devuelve `false` sin tocar el arreglo y `n` no cambia.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Por qué `maximo` empieza con `int mayor = v[0];` y no con `int mayor = 0;`?'
    options:
      - id: 'a'
        text: 'Porque `0` no es un `int` válido como valor inicial.'
      - id: 'b'
        text: 'Porque si todos los elementos fueran negativos, empezar en 0 daría un máximo que ni siquiera está en el arreglo.'
      - id: 'c'
        text: 'Porque así el ciclo puede empezar en el índice `n`.'
    correctOptionId: 'b'
    explanation: >-
      El valor inicial tiene que ser un elemento real. Por eso la función exige la
      precondición `n > 0`: un arreglo vacío no tiene máximo.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      size_t buscar(const int v[], size_t n, int valor) {
          for (size_t i = 0; i < n; i++) {
              if (v[i] == valor) {
                  return i;
              }
          }
          return n;
      }

      int main(void) {
          int v[] = {4, 8, 15, 16, 8};

          printf("%zu %zu\n", buscar(v, 5, 8), buscar(v, 5, 23));
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1 5`'
      - id: 'b'
        text: '`4 5`'
      - id: 'c'
        text: '`1 -1`'
      - id: 'd'
        text: '`8 0`'
    correctOptionId: 'a'
    explanation: >-
      `buscar` devuelve la posición de la primera aparición: el 8 está primero en
      la posición 1. Como 23 no está, devuelve `n` (5), que nunca es una posición
      válida. Un `size_t` no puede ser -1.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Para insertar en la posición `pos`, los elementos se corren a la derecha empezando por `v[pos]` y avanzando hacia el final.'
    correctAnswer: false
    explanation: >-
      Al insertar se corre desde el final hacia `pos`. Si se empezara por
      `v[pos]`, ese valor pisaría a `v[pos + 1]` antes de moverlo y se perderían
      datos. Al eliminar es al revés: desde `pos` hacia el final.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Este programa elimina la posición 1 pero tiene un error. ¿Qué muestra?'
    code: |-
      #include <stdio.h>

      bool eliminar(int v[], size_t n, size_t pos) {
          if (pos >= n) {
              return false;
          }
          for (size_t i = pos; i + 1 < n; i++) {
              v[i] = v[i + 1];
          }
          return true;
      }

      int main(void) {
          int v[] = {10, 20, 30, 40};
          size_t n = 4;

          eliminar(v, n, 1);
          for (size_t i = 0; i < n; i++) {
              printf("%d ", v[i]);
          }
          printf("\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`10 30 40`'
      - id: 'b'
        text: '`10 30 40 40`'
      - id: 'c'
        text: '`10 20 30 40`'
      - id: 'd'
        text: '`20 30 40 40`'
    correctOptionId: 'b'
    explanation: >-
      `eliminar` corre 30 y 40 a la izquierda, pero el último 40 sigue en
      `v[3]`. El llamador olvidó actualizar la cantidad usada: después de una
      eliminación exitosa tiene que hacer `n--`, por ejemplo con
      `if (eliminar(v, n, 1)) { n--; }`.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Por qué `insertar` devuelve un `bool` en lugar de actualizar `n` ella misma?'
    options:
      - id: 'a'
        text: 'Porque `n` llega por valor: la función recibe una copia, y cambiarla no cambia la variable del llamador.'
      - id: 'b'
        text: 'Porque un `size_t` no se puede modificar dentro de una función.'
      - id: 'c'
        text: 'Porque los arreglos se pasan por valor y la función no puede modificar los elementos.'
    correctOptionId: 'a'
    explanation: >-
      La función sí modifica los elementos (trabaja sobre el arreglo del
      llamador), pero `n` es un parámetro común pasado por valor. Por eso informa
      si pudo insertar y el llamador hace `n++`.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      #define FILAS 3
      #define COLUMNAS 4

      int sumar_columna(int m[][COLUMNAS], size_t filas, size_t columna) {
          int suma = 0;
          for (size_t f = 0; f < filas; f++) {
              suma += m[f][columna];
          }
          return suma;
      }

      int main(void) {
          int ventas[FILAS][COLUMNAS] = {
              {5, 3, 8, 2},
              {4, 6, 1, 7},
              {9, 0, 3, 5},
          };

          printf("%d\n", sumar_columna(ventas, FILAS, 2));
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`18`'
      - id: 'b'
        text: '`12`'
      - id: 'c'
        text: '`9`'
      - id: 'd'
        text: '`11`'
    correctOptionId: 'b'
    explanation: >-
      La columna queda fija en 2 (la tercera) y avanza la fila: 8 + 1 + 3 = 12.
      La suma de la fila 2 sería 18.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'Si el ciclo de `invertir` llegara hasta `n` en lugar de `n / 2`, el arreglo terminaría igual que al principio.'
    correctAnswer: true
    explanation: >-
      En la segunda mitad del recorrido se vuelve a intercambiar cada par que ya
      se había intercambiado, y cada elemento regresa a su lugar.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      size_t contar_mayores(const int v[], size_t n, int umbral) {
          size_t cantidad = 0;
          for (size_t i = 0; i < n; i++) {
              if (v[i] > umbral) {
                  cantidad++;
              }
          }
          return cantidad;
      }

      int main(void) {
          int notas[] = {7, 4, 9, 6, 10, 6};
          size_t n = sizeof notas / sizeof notas[0];

          printf("%zu\n", contar_mayores(notas, n, 6));
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`5`'
      - id: 'b'
        text: '`3`'
      - id: 'c'
        text: '`4`'
      - id: 'd'
        text: '`6`'
    correctOptionId: 'b'
    explanation: >-
      Cuentan solo los mayores estrictos que 6: 7, 9 y 10. Los dos 6 no cuentan
      porque la condición es `>`, no `>=`.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'En `promedio`, el caso `n == 0` se trata aparte para no dividir por cero, y la conversión `(double)` evita la división entera.'
    correctAnswer: true
    explanation: >-
      Sin el caso especial, un arreglo vacío provocaría una división por cero.
      Sin `(double)`, `suma / n` sería una división entera y perdería los
      decimales.
---
