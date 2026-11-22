---
course: 'c'
lesson: 'estructuras-dinamicas-listas'
slug: 'autoevaluacion-estructuras-dinamicas-listas'
title: 'Autoevaluación: Listas'
description: 'Once preguntas sobre nodos y enlaces, el puntero doble a la cabeza, inserción y eliminación, propiedad de los nodos, errores de liberación y el costo de una lista frente a un arreglo.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Por qué `insertar_al_inicio` recibe `Nodo **cabeza` y no `Nodo *cabeza`?'
    options:
      - id: 'a'
        text: 'Porque los nodos están en el heap y solo se pueden alcanzar con dos asteriscos.'
      - id: 'b'
        text: 'Porque debe cambiar la variable cabeza del llamador, y C pasa los argumentos por valor: necesita la dirección de esa variable.'
      - id: 'c'
        text: 'Porque así la función se vuelve dueña de la cabeza y debe liberarla.'
      - id: 'd'
        text: 'Porque `malloc` devuelve un `Nodo **`.'
    correctOptionId: 'b'
    explanation: >-
      Con `Nodo *cabeza` la función recibe una copia del puntero; asignarle el
      nodo nuevo cambia solo la copia, la cabeza de `main` queda igual y el nodo
      se pierde. Pasando `&cabeza`, `*cabeza` es la variable del llamador.
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

      bool insertar_al_inicio(Nodo **cabeza, int dato) {
          Nodo *nuevo = malloc(sizeof *nuevo);
          if (nuevo == NULL) {
              return false;
          }
          nuevo->dato = dato;
          nuevo->siguiente = *cabeza;
          *cabeza = nuevo;
          return true;
      }

      bool insertar_al_final(Nodo **cabeza, int dato) {
          Nodo *nuevo = malloc(sizeof *nuevo);
          if (nuevo == NULL) {
              return false;
          }
          nuevo->dato = dato;
          nuevo->siguiente = NULL;
          Nodo **enlace = cabeza;
          while (*enlace != NULL) {
              enlace = &(*enlace)->siguiente;
          }
          *enlace = nuevo;
          return true;
      }

      int main(void) {
          Nodo *cabeza = NULL;
          bool ok = insertar_al_inicio(&cabeza, 1) && insertar_al_inicio(&cabeza, 2) &&
                    insertar_al_inicio(&cabeza, 3) && insertar_al_final(&cabeza, 4);
          for (const Nodo *n = cabeza; n != NULL; n = n->siguiente) {
              printf("%d -> ", n->dato);
          }
          printf("NULL\n");
          while (cabeza != NULL) {
              Nodo *siguiente = cabeza->siguiente;
              free(cabeza);
              cabeza = siguiente;
          }
          return ok ? 0 : 1;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1 -> 2 -> 3 -> 4 -> NULL`'
      - id: 'b'
        text: '`3 -> 2 -> 1 -> 4 -> NULL`'
      - id: 'c'
        text: '`4 -> 3 -> 2 -> 1 -> NULL`'
      - id: 'd'
        text: '`3 -> 2 -> 1 -> NULL`'
    correctOptionId: 'b'
    explanation: >-
      Cada inserción al inicio deja el valor nuevo delante de los anteriores:
      después de 1, 2 y 3 la lista es 3, 2, 1. Insertar al final cuelga el 4
      después del último nodo.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'Los nodos de una lista enlazada ocupan posiciones contiguas de memoria, igual que los elementos de un arreglo.'
    correctAnswer: false
    explanation: >-
      Cada nodo es un bloque separado que devuelve `malloc`, en cualquier lugar
      del heap. Lo que los une es el campo `siguiente`, no la posición. Por eso
      llegar al elemento i exige recorrer los anteriores.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Esta función compila sin advertencias, pero AddressSanitizer informa `heap-use-after-free`. ¿Cuál es el error?'
    code: |-
      void destruir(Nodo *cabeza) {
          for (Nodo *actual = cabeza; actual != NULL; actual = actual->siguiente) {
              free(actual);
          }
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Falta comprobar que `cabeza` no sea `NULL` antes del ciclo.'
      - id: 'b'
        text: 'La actualización `actual = actual->siguiente` se ejecuta después de `free(actual)` y lee un nodo ya liberado; hay que guardar el siguiente antes de liberar.'
      - id: 'c'
        text: '`free` no se puede llamar dentro de un `for`.'
      - id: 'd'
        text: 'Hay que liberar los nodos desde el último hacia el primero.'
    correctOptionId: 'b'
    explanation: >-
      En un `for`, la actualización corre al final de cada vuelta, es decir,
      después del `free`. La versión correcta guarda `Nodo *siguiente =
      actual->siguiente;` antes de liberar y avanza con esa copia.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Cuando `buscar` devuelve un `const Nodo *` que apunta a un nodo de la lista, quien llama pasa a ser dueño de ese nodo y debe liberarlo.'
    correctAnswer: false
    explanation: >-
      `buscar` solo presta el nodo: sigue perteneciendo a la lista, que lo
      liberará en `destruir_lista`. Liberarlo desde afuera dejaría un puntero
      colgante dentro de la lista y provocaría un doble `free` al destruirla.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct Nodo {
          int dato;
          struct Nodo *siguiente;
      } Nodo;

      bool insertar_ordenado(Nodo **cabeza, int dato) {
          Nodo *nuevo = malloc(sizeof *nuevo);
          if (nuevo == NULL) {
              return false;
          }
          nuevo->dato = dato;
          Nodo **enlace = cabeza;
          while (*enlace != NULL && (*enlace)->dato < dato) {
              enlace = &(*enlace)->siguiente;
          }
          nuevo->siguiente = *enlace;
          *enlace = nuevo;
          return true;
      }

      int main(void) {
          Nodo *cabeza = NULL;
          int valores[] = {5, 1, 3, 3, 9};
          size_t cantidad = 0;
          for (size_t i = 0; i < 5; i++) {
              if (insertar_ordenado(&cabeza, valores[i])) {
                  cantidad++;
              }
          }
          for (const Nodo *n = cabeza; n != NULL; n = n->siguiente) {
              printf("%d ", n->dato);
          }
          printf("(%zu)\n", cantidad);
          while (cabeza != NULL) {
              Nodo *siguiente = cabeza->siguiente;
              free(cabeza);
              cabeza = siguiente;
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`5 1 3 3 9 (5)`'
      - id: 'b'
        text: '`1 3 5 9 (4)`'
      - id: 'c'
        text: '`1 3 3 5 9 (5)`'
      - id: 'd'
        text: '`9 5 3 3 1 (5)`'
    correctOptionId: 'c'
    explanation: >-
      Cada valor se inserta antes del primer nodo cuyo dato no es menor, así
      que la lista queda ordenada de menor a mayor. Los repetidos se guardan:
      nada en la función los descarta, y se insertaron cinco nodos.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Cuál es el costo de acceder al elemento en la posición i de una lista simplemente enlazada de n elementos?'
    options:
      - id: 'a'
        text: 'O(1), igual que en un arreglo.'
      - id: 'b'
        text: 'O(log n), porque se puede saltar a la mitad.'
      - id: 'c'
        text: 'O(n), porque hay que recorrer los nodos anteriores desde la cabeza.'
    correctOptionId: 'c'
    explanation: >-
      Un nodo solo conoce la dirección del siguiente: no hay forma de calcular
      dónde está el nodo i sin pasar por los anteriores. El acceso por
      posición es donde el arreglo gana.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Al eliminar un nodo del medio, primero hay que hacer `anterior->siguiente = actual->siguiente` y recién después `free(actual)`; en el orden inverso se lee memoria liberada.'
    correctAnswer: true
    explanation: >-
      Para enganchar el anterior con el siguiente hay que leer
      `actual->siguiente`. Después de `free(actual)` ese campo ya no se puede
      leer: sería un uso después de liberar. Desenganchar primero, liberar
      después.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'Cada tarea guarda su descripción en un bloque propio. ¿Qué error tiene esta función?'
    code: |-
      // Propiedad: el llamador es dueño de la tarea devuelta. NULL si no hay memoria.
      Tarea *crear_tarea(const char *descripcion) {
          Tarea *tarea = malloc(sizeof *tarea);
          if (tarea == NULL) {
              return NULL;
          }
          tarea->descripcion = malloc(strlen(descripcion) + 1);
          if (tarea->descripcion == NULL) {
              return NULL;
          }
          strcpy(tarea->descripcion, descripcion);
          tarea->siguiente = NULL;
          return tarea;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Si falla la segunda reserva, devuelve `NULL` sin liberar `tarea`: ese bloque queda sin dueño y es una fuga.'
      - id: 'b'
        text: 'Debería reservar `strlen(descripcion)` bytes, sin el `+ 1`.'
      - id: 'c'
        text: 'No se puede llamar a `malloc` dos veces en la misma función.'
      - id: 'd'
        text: 'Debería devolver `tarea` aunque la segunda reserva falle.'
    correctOptionId: 'a'
    explanation: >-
      Cuando la segunda reserva falla, la primera ya se hizo y nadie más tiene
      su dirección. Antes de `return NULL;` hay que hacer `free(tarea);`. El
      `+ 1` es necesario para el terminador `'\0'`.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'En una lista doblemente enlazada con punteros a `primero` y `ultimo`, ¿cuánto cuesta eliminar un nodo del que ya tienes la dirección?'
    options:
      - id: 'a'
        text: 'O(1): el nodo conoce a su anterior y a su siguiente, y basta con ajustar sus enlaces.'
      - id: 'b'
        text: 'O(n): siempre hay que recorrer desde `primero` para encontrar el anterior.'
      - id: 'c'
        text: 'O(log n): se busca el anterior por mitades.'
    correctOptionId: 'a'
    explanation: >-
      Ese es el beneficio del puntero `anterior`. En una lista simple hay que
      recorrer desde la cabeza para hallar el anterior, y la operación es
      O(n).
  - kind: 'true-false'
    id: 'q11'
    prompt: 'Con las funciones de la lección, este fragmento muestra `NULL` y no produce ningún informe de AddressSanitizer.'
    code: |-
      destruir_lista(&cabeza);
      imprimir_lista(cabeza);
    codeLanguage: 'c'
    correctAnswer: true
    explanation: >-
      `destruir_lista` libera todos los nodos y deja `*cabeza = NULL`. La
      cabeza describe una lista vacía válida, así que `imprimir_lista` no
      recorre nada y solo muestra `NULL`. Si no dejara la cabeza en `NULL`,
      imprimir leería nodos liberados.
---
