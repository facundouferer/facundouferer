---
course: 'c'
lesson: 'estructuras-dinamicas-colas'
slug: 'autoevaluacion-estructuras-dinamicas-colas'
title: 'Autoevaluación: Colas'
description: 'Once preguntas sobre la regla FIFO, la cola enlazada con frente y final, el invariante al vaciarse, el arreglo circular, la transferencia de propiedad y la planificación por turnos.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué describe la regla FIFO de una cola?'
    options:
      - id: 'a'
        text: 'Se encola por el final y se desencola por el frente: el primero que entra es el primero que sale.'
      - id: 'b'
        text: 'Se agrega y se quita por el mismo extremo.'
      - id: 'c'
        text: 'Sale primero el elemento más grande.'
      - id: 'd'
        text: 'Se puede quitar cualquier elemento si se conoce su posición.'
    correctOptionId: 'a'
    explanation: >-
      FIFO (First In, First Out) es la regla de la fila del banco. Agregar y
      quitar por el mismo extremo es la regla LIFO de la pila.
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
          Nodo *frente;
          Nodo *final;
          size_t cantidad;
      } Cola;

      bool encolar(Cola *cola, int dato) {
          Nodo *nodo = malloc(sizeof *nodo);
          if (nodo == NULL) {
              return false;
          }
          nodo->dato = dato;
          nodo->siguiente = NULL;
          if (cola->final == NULL) {
              cola->frente = nodo;
          } else {
              cola->final->siguiente = nodo;
          }
          cola->final = nodo;
          cola->cantidad++;
          return true;
      }

      bool desencolar(Cola *cola, int *dato) {
          if (cola->frente == NULL) {
              return false;
          }
          Nodo *viejo = cola->frente;
          *dato = viejo->dato;
          cola->frente = viejo->siguiente;
          if (cola->frente == NULL) {
              cola->final = NULL;
          }
          free(viejo);
          cola->cantidad--;
          return true;
      }

      int main(void) {
          Cola cola = {NULL, NULL, 0};
          int x;
          bool ok = encolar(&cola, 1) && encolar(&cola, 2) && encolar(&cola, 3);
          desencolar(&cola, &x);
          ok = ok && encolar(&cola, 4);
          while (desencolar(&cola, &x)) {
              printf("%d ", x);
          }
          printf("\n");
          return ok ? 0 : 1;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`4 3 2`'
      - id: 'b'
        text: '`2 3 4`'
      - id: 'c'
        text: '`1 2 3 4`'
      - id: 'd'
        text: '`3 2 4`'
    correctOptionId: 'b'
    explanation: >-
      El primer desencolar quita el 1, que llegó primero. El 4 se agrega
      detrás del 3. Los que quedan salen en orden de llegada: 2, 3, 4.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'Si una cola enlazada guardara solo un puntero al frente, encolar costaría O(n), porque habría que recorrer hasta el último nodo.'
    correctAnswer: true
    explanation: >-
      Sin el puntero `final`, la única forma de llegar al último nodo es
      recorrer desde el frente. Guardar `final` hace que encolar sea O(1).
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Este `desencolar` funciona mientras hay varios elementos, pero un programa que vacía la cola y vuelve a encolar falla con AddressSanitizer. ¿Por qué?'
    code: |-
      bool desencolar(Cola *cola, int *dato) {
          if (cola->frente == NULL) {
              return false;
          }
          Nodo *viejo = cola->frente;
          *dato = viejo->dato;
          cola->frente = viejo->siguiente;
          free(viejo);
          cola->cantidad--;
          return true;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Porque copia el dato antes de liberar el nodo.'
      - id: 'b'
        text: 'Porque al salir el último elemento `final` sigue apuntando al nodo liberado, y el siguiente `encolar` escribe en él.'
      - id: 'c'
        text: 'Porque no comprueba el resultado de `free`.'
      - id: 'd'
        text: 'Porque `cantidad` puede quedar negativa.'
    correctOptionId: 'b'
    explanation: >-
      Falta restablecer el invariante: si `frente` queda en `NULL`, `final`
      también debe pasar a `NULL`. Si no, `encolar` ve `final != NULL`,
      ejecuta `cola->final->siguiente = nodo` sobre memoria liberada
      (`heap-use-after-free`) y el nodo nuevo queda inalcanzable.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Una cola sobre un arreglo circular tiene `capacidad = 5`, `inicio = 3` y `cantidad = 3`. ¿En qué índice se guarda el próximo elemento que se encola?'
    options:
      - id: 'a'
        text: '6'
      - id: 'b'
        text: '1'
      - id: 'c'
        text: '0'
      - id: 'd'
        text: 'En ninguno: la cola está llena.'
    correctOptionId: 'b'
    explanation: >-
      El lugar libre es `(inicio + cantidad) % capacidad`, es decir,
      `(3 + 3) % 5 = 1`. La cola ocupa los índices 3, 4 y 0, y todavía quedan
      dos lugares.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'En un arreglo circular, llevar la `cantidad` además de `inicio` permite distinguir la cola llena de la cola vacía.'
    correctAnswer: true
    explanation: >-
      Con solo dos índices (inicio y fin), la cola llena y la vacía tienen los
      índices en la misma posición. Con `cantidad`, vacía es `cantidad == 0` y
      llena es `cantidad == capacidad`.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int datos[4] = {0};
          size_t inicio = 0;
          size_t cantidad = 0;
          const size_t capacidad = 4;

          for (int valor = 1; valor <= 3; valor++) {          // encola 1, 2, 3
              datos[(inicio + cantidad) % capacidad] = valor;
              cantidad++;
          }
          for (int i = 0; i < 2; i++) {                       // desencola dos
              inicio = (inicio + 1) % capacidad;
              cantidad--;
          }
          for (int valor = 4; valor <= 5; valor++) {          // encola 4, 5
              datos[(inicio + cantidad) % capacidad] = valor;
              cantidad++;
          }
          printf("inicio=%zu cantidad=%zu datos[0]=%d\n", inicio, cantidad, datos[0]);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`inicio=2 cantidad=3 datos[0]=5`'
      - id: 'b'
        text: '`inicio=0 cantidad=3 datos[0]=1`'
      - id: 'c'
        text: '`inicio=2 cantidad=3 datos[0]=1`'
      - id: 'd'
        text: '`inicio=2 cantidad=5 datos[0]=5`'
    correctOptionId: 'a'
    explanation: >-
      Después de encolar tres y desencolar dos, `inicio` es 2 y queda un
      elemento. El 4 va a `(2 + 1) % 4 = 3` y el 5 da la vuelta a
      `(2 + 2) % 4 = 0`, donde pisa el 1 que ya había salido.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Si `cola_desencolar` devuelve el nodo del frente en lugar de copiar su dato, la propiedad del nodo pasa a quien llama, que debe liberarlo o volver a encolarlo.'
    correctAnswer: true
    explanation: >-
      Es lo que hace el ejemplo de planificación por turnos: desencolar
      transfiere el nodo al bucle, que lo libera si el proceso terminó o lo
      devuelve a la cola si no. Esa transferencia debe quedar escrita en el
      comentario de la función.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'En la planificación por turnos (round robin) con un quantum de 3, el proceso del frente necesita 5 unidades. ¿Qué pasa en su turno?'
    options:
      - id: 'a'
        text: 'Usa 5 unidades y termina.'
      - id: 'b'
        text: 'Usa 3 unidades y vuelve al final de la cola con 2 pendientes.'
      - id: 'c'
        text: 'Usa 3 unidades y vuelve al frente de la cola.'
      - id: 'd'
        text: 'No puede ejecutarse porque necesita más que el quantum.'
    correctOptionId: 'b'
    explanation: >-
      Cada proceso usa como máximo un quantum. Si no terminó, se vuelve a
      encolar al final y espera a que los demás tengan su turno.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Al depurar una cola encuentras `frente == NULL` y `final != NULL`. ¿Qué significa?'
    options:
      - id: 'a'
        text: 'Que la cola tiene un solo elemento.'
      - id: 'b'
        text: 'Que la cola está vacía, y es un estado válido.'
      - id: 'c'
        text: 'Que alguna operación rompió el invariante: es un error del programa, y `final` probablemente apunta a un nodo liberado.'
    correctOptionId: 'c'
    explanation: >-
      El invariante dice que `frente` y `final` son ambos `NULL` o ambos no
      `NULL`. Con un solo elemento los dos apuntan al mismo nodo. El estado
      mezclado es exactamente el que deja un `desencolar` que olvida
      `cola->final = NULL`.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Con las funciones `encolar` y `desencolar` de la pregunta 2, ¿qué muestra este fragmento?'
    code: |-
      Cola cola = {NULL, NULL, 0};
      int x = 0;
      bool ok = encolar(&cola, 8);
      ok = ok && desencolar(&cola, &x);
      ok = ok && desencolar(&cola, &x);
      printf("%s %d %zu %s\n", ok ? "ok" : "fallo", x, cola.cantidad,
             cola.final == NULL ? "vacia" : "con datos");
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`ok 8 0 vacia`'
      - id: 'b'
        text: '`fallo 8 0 vacia`'
      - id: 'c'
        text: '`fallo 0 0 vacia`'
      - id: 'd'
        text: '`fallo 8 1 con datos`'
    correctOptionId: 'b'
    explanation: >-
      El primer `desencolar` saca el 8 y deja la cola vacía, con `final` en
      `NULL`. El segundo falla y no toca `x`, que conserva el 8. No queda
      ningún nodo, así que tampoco hay nada que liberar.
---
