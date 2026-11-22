---
course: 'c'
lesson: 'estructuras-dinamicas-pilas'
slug: 'autoevaluacion-estructuras-dinamicas-pilas'
title: 'Autoevaluación: Pilas'
description: 'Once preguntas sobre la regla LIFO, la pila enlazada y la pila sobre arreglo dinámico, el error de desapilar una pila vacía, realloc seguro, paréntesis balanceados y el costo de cada operación.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué significa que una pila siga la regla LIFO?'
    options:
      - id: 'a'
        text: 'El primer elemento que entra es el primero que sale.'
      - id: 'b'
        text: 'El último elemento que entra es el primero que sale.'
      - id: 'c'
        text: 'Los elementos salen ordenados de menor a mayor.'
      - id: 'd'
        text: 'Se puede quitar cualquier elemento, pero solo agregar en el tope.'
    correctOptionId: 'b'
    explanation: >-
      LIFO (Last In, First Out): solo se trabaja sobre el tope, así que el
      último apilado es el primero en salir. La regla del primero que entra,
      primero que sale es la de las colas (FIFO).
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct Nodo {
          int dato;
          struct Nodo *siguiente;
      } Nodo;

      typedef struct {
          Nodo *tope;
          size_t cantidad;
      } Pila;

      bool pila_apilar(Pila *pila, int dato) {
          Nodo *nodo = malloc(sizeof *nodo);
          if (nodo == NULL) {
              return false;
          }
          nodo->dato = dato;
          nodo->siguiente = pila->tope;
          pila->tope = nodo;
          pila->cantidad++;
          return true;
      }

      bool pila_desapilar(Pila *pila, int *dato) {
          if (pila->tope == NULL) {
              return false;
          }
          Nodo *viejo = pila->tope;
          *dato = viejo->dato;
          pila->tope = viejo->siguiente;
          free(viejo);
          pila->cantidad--;
          return true;
      }

      int main(void) {
          Pila pila = {NULL, 0};
          int x;
          bool ok = pila_apilar(&pila, 1) && pila_apilar(&pila, 2) && pila_apilar(&pila, 3);
          pila_desapilar(&pila, &x);
          ok = ok && pila_apilar(&pila, 4);
          while (pila_desapilar(&pila, &x)) {
              printf("%d ", x);
          }
          printf("\n");
          return ok ? 0 : 1;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1 2 4`'
      - id: 'b'
        text: '`4 3 2 1`'
      - id: 'c'
        text: '`4 2 1`'
      - id: 'd'
        text: '`3 4 2 1`'
    correctOptionId: 'c'
    explanation: >-
      Tras apilar 1, 2 y 3, el primer desapilar quita el 3. Se apila el 4, que
      queda en el tope sobre 2 y 1. El ciclo vacía la pila de arriba hacia
      abajo: 4, 2, 1. Al vaciarla, el ciclo ya liberó todos los nodos.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'Con la pila de la lección, `pila_desapilar` sobre una pila vacía devuelve `false` y no modifica `*dato`.'
    correctAnswer: true
    explanation: >-
      Desapilar una pila vacía es un error de quien llama, pero la pila lo
      detecta antes de desreferenciar `NULL` y lo informa con `false`. El
      dato viaja por el puntero de salida solo cuando la operación tiene
      éxito.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'La pila sobre arreglo empieza con capacidad 0, pasa a 4 en la primera reserva y duplica la capacidad cada vez que se llena. ¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct {
          int *datos;
          size_t cantidad;
          size_t capacidad;
      } PilaArreglo;

      bool apilar(PilaArreglo *pila, int dato) {
          if (pila->cantidad == pila->capacidad) {
              size_t nueva = pila->capacidad == 0 ? 4 : pila->capacidad * 2;
              int *nuevos = realloc(pila->datos, nueva * sizeof *nuevos);
              if (nuevos == NULL) {
                  return false;
              }
              pila->datos = nuevos;
              pila->capacidad = nueva;
          }
          pila->datos[pila->cantidad] = dato;
          pila->cantidad++;
          return true;
      }

      int main(void) {
          PilaArreglo pila = {NULL, 0, 0};
          for (int i = 0; i < 9; i++) {
              if (!apilar(&pila, i)) {
                  free(pila.datos);
                  return 1;
              }
          }
          printf("%zu %zu\n", pila.cantidad, pila.capacidad);
          free(pila.datos);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`9 9`'
      - id: 'b'
        text: '`9 16`'
      - id: 'c'
        text: '`9 8`'
      - id: 'd'
        text: '`9 12`'
    correctOptionId: 'b'
    explanation: >-
      La capacidad pasa a 4 con el primer elemento, a 8 con el quinto y a 16
      con el noveno. Hay 9 elementos en un bloque de 16, y un solo `free`
      libera todo.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué problema tiene esta línea dentro de `apilar`?'
    code: |-
      pila->datos = realloc(pila->datos, nueva * sizeof *pila->datos);
      if (pila->datos == NULL) {
          return false;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Ninguno: si `realloc` falla, el bloque viejo se libera solo.'
      - id: 'b'
        text: 'Si `realloc` falla, devuelve `NULL` y pisa el único puntero al bloque viejo, que sigue reservado: se pierden los datos y hay una fuga.'
      - id: 'c'
        text: '`realloc` no se puede usar con un puntero que vale `NULL`.'
      - id: 'd'
        text: 'Hay que convertir el resultado con `(int *)`.'
    correctOptionId: 'b'
    explanation: >-
      Cuando `realloc` falla, el bloque original sigue siendo válido. Por eso
      el resultado se guarda primero en una variable auxiliar y solo se asigna
      a `pila->datos` si no es `NULL`.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Destruir una pila enlazada de n elementos cuesta O(1), igual que destruir una pila sobre arreglo dinámico.'
    correctAnswer: false
    explanation: >-
      La pila enlazada tiene un bloque por nodo, así que necesita n llamadas a
      `free`: O(n). La pila sobre arreglo guarda todo en un único bloque y se
      destruye con un solo `free`.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Al verificar paréntesis con una pila, ¿cuál de estas expresiones NO está balanceada?'
    options:
      - id: 'a'
        text: '`{[()]}`'
      - id: 'b'
        text: '`([)]`'
      - id: 'c'
        text: '`()[]{}`'
      - id: 'd'
        text: '`((a))`'
    correctOptionId: 'b'
    explanation: >-
      En `([)]`, al llegar el `)` el tope es `[`: el cierre no coincide con la
      última apertura. Una pila detecta exactamente eso, porque cada cierre
      debe corresponder a la apertura más reciente.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Qué error tiene esta versión de `pila_desapilar`?'
    code: |-
      bool pila_desapilar(Pila *pila, int *dato) {
          if (pila->tope == NULL) {
              return false;
          }
          Nodo *viejo = pila->tope;
          pila->tope = viejo->siguiente;
          free(viejo);
          *dato = viejo->dato;
          pila->cantidad--;
          return true;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Ninguno: `viejo` todavía guarda la dirección del nodo.'
      - id: 'b'
        text: 'Lee `viejo->dato` después de `free(viejo)`: es un uso después de liberar. Hay que copiar el dato antes de liberar.'
      - id: 'c'
        text: 'Debería liberar `pila->tope` en lugar de `viejo`.'
      - id: 'd'
        text: 'Falta un segundo `free` para el campo `dato`.'
    correctOptionId: 'b'
    explanation: >-
      `viejo` conserva la dirección, pero el bloque ya no pertenece al
      programa: leerlo es comportamiento indefinido y AddressSanitizer lo
      informa como `heap-use-after-free`. `dato` es un `int` dentro del nodo,
      no un bloque aparte.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'En una pila enlazada, el tope es la cabeza de la lista, y por eso apilar y desapilar son O(1).'
    correctAnswer: true
    explanation: >-
      Apilar es insertar al inicio y desapilar es quitar la cabeza: ninguna de
      las dos recorre la lista. Si el tope fuera el último nodo, cada operación
      tendría que recorrer todo.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'La función que verifica paréntesis encuentra un cierre que no coincide y termina con `return false;`. ¿Qué tiene que hacer antes?'
    options:
      - id: 'a'
        text: 'Nada: la pila es una variable local y desaparece al salir de la función.'
      - id: 'b'
        text: 'Destruir la pila, porque todavía puede tener nodos en el heap que nadie más podría liberar.'
      - id: 'c'
        text: 'Llamar a `free(&pila)`.'
    correctOptionId: 'b'
    explanation: >-
      La estructura `Pila` es local, pero sus nodos están en el heap y tienen
      duración asignada: no desaparecen al salir. Si la función sale sin
      destruirla, esos nodos son una fuga. `free(&pila)` sería un error, porque
      `pila` no vino de `malloc`.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Con las funciones de la lección, ¿qué muestra este fragmento?'
    code: |-
      Pila pila = {NULL, 0};
      int tope = 0;
      int x;
      if (pila_apilar(&pila, 5) && pila_apilar(&pila, 7) && pila_apilar(&pila, 9)) {
          pila_desapilar(&pila, &x);
          pila_desapilar(&pila, &x);
          pila_apilar(&pila, x * 2);
          pila_ver_tope(&pila, &tope);
      }
      printf("Tope: %d, cantidad: %zu\n", tope, pila.cantidad);
      pila_destruir(&pila);
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Tope: 14, cantidad: 2`'
      - id: 'b'
        text: '`Tope: 18, cantidad: 2`'
      - id: 'c'
        text: '`Tope: 14, cantidad: 3`'
      - id: 'd'
        text: '`Tope: 10, cantidad: 2`'
    correctOptionId: 'a'
    explanation: >-
      Los dos desapilar quitan 9 y después 7, que queda en `x`. Se apila 14
      sobre el 5: el tope es 14 y hay dos elementos. `pila_ver_tope` no quita
      nada.
---
