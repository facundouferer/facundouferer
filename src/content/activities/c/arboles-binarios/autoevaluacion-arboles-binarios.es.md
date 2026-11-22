---
course: 'c'
lesson: 'arboles-binarios'
slug: 'autoevaluacion-arboles-binarios'
title: 'Autoevaluación: Árboles Binarios'
description: 'Doce preguntas sobre la regla del árbol binario de búsqueda, inserción con puntero doble, recorridos, liberación en postorden, altura, eliminación y el costo en árboles balanceados y degenerados.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 25
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué condición cumple un árbol binario de búsqueda?'
    options:
      - id: 'a'
        text: 'Cada nodo es menor que sus dos hijos.'
      - id: 'b'
        text: 'Para cada nodo, todos los valores de su subárbol izquierdo son menores y todos los de su subárbol derecho son mayores.'
      - id: 'c'
        text: 'Solo el hijo izquierdo de la raíz es menor que la raíz.'
      - id: 'd'
        text: 'Todas las hojas están en el mismo nivel.'
    correctOptionId: 'b'
    explanation: >-
      La regla vale para cada nodo y para todo su subárbol, no solo para sus
      hijos directos. Eso permite descartar un subárbol entero en cada paso de
      una búsqueda.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct Nodo {
          int dato;
          struct Nodo *izquierdo;
          struct Nodo *derecho;
      } Nodo;

      bool insertar(Nodo **raiz, int dato) {
          if (*raiz == NULL) {
              Nodo *nodo = malloc(sizeof *nodo);
              if (nodo == NULL) {
                  return false;
              }
              nodo->dato = dato;
              nodo->izquierdo = NULL;
              nodo->derecho = NULL;
              *raiz = nodo;
              return true;
          }
          if (dato < (*raiz)->dato) {
              return insertar(&(*raiz)->izquierdo, dato);
          }
          if (dato > (*raiz)->dato) {
              return insertar(&(*raiz)->derecho, dato);
          }
          return true;
      }

      void preorden(const Nodo *raiz) {
          if (raiz != NULL) {
              printf("%d ", raiz->dato);
              preorden(raiz->izquierdo);
              preorden(raiz->derecho);
          }
      }

      void destruir(Nodo *raiz) {
          if (raiz != NULL) {
              destruir(raiz->izquierdo);
              destruir(raiz->derecho);
              free(raiz);
          }
      }

      int main(void) {
          Nodo *raiz = NULL;
          int valores[] = {50, 30, 70, 20, 40, 60, 80};
          for (size_t i = 0; i < 7; i++) {
              if (!insertar(&raiz, valores[i])) {
                  destruir(raiz);
                  return 1;
              }
          }
          preorden(raiz);
          printf("\n");
          destruir(raiz);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`20 30 40 50 60 70 80`'
      - id: 'b'
        text: '`50 30 20 40 70 60 80`'
      - id: 'c'
        text: '`20 40 30 60 80 70 50`'
      - id: 'd'
        text: '`50 30 70 20 40 60 80`'
    correctOptionId: 'b'
    explanation: >-
      Preorden visita el nodo antes que sus subárboles: 50, después todo el
      subárbol izquierdo (30, 20, 40) y por último el derecho (70, 60, 80). La
      opción d es el orden por niveles, que no es un recorrido en
      profundidad.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'El recorrido inorden de un árbol binario de búsqueda visita los valores de menor a mayor.'
    correctAnswer: true
    explanation: >-
      Inorden visita primero el subárbol izquierdo (todos menores), después el
      nodo y después el derecho (todos mayores), y eso se repite en cada
      subárbol.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Por qué el árbol se libera en postorden?'
    options:
      - id: 'a'
        text: 'Porque es el recorrido más rápido.'
      - id: 'b'
        text: 'Porque cada nodo se libera después de sus dos subárboles, cuando ya no hace falta leer sus punteros a los hijos.'
      - id: 'c'
        text: 'Porque `free` exige liberar primero las hojas.'
      - id: 'd'
        text: 'Porque inorden liberaría los valores en desorden.'
    correctOptionId: 'b'
    explanation: >-
      Si se libera primero el padre, leer `raiz->izquierdo` después es un uso
      después de liberar; y si no se leen, los subárboles quedan
      inalcanzables. En postorden el padre es lo último que se libera.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué muestra este programa? (Altura: árbol vacío 0, un solo nodo 1).'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      typedef struct Nodo {
          int dato;
          struct Nodo *izquierdo;
          struct Nodo *derecho;
      } Nodo;

      bool insertar(Nodo **raiz, int dato) {
          if (*raiz == NULL) {
              Nodo *nodo = malloc(sizeof *nodo);
              if (nodo == NULL) {
                  return false;
              }
              nodo->dato = dato;
              nodo->izquierdo = NULL;
              nodo->derecho = NULL;
              *raiz = nodo;
              return true;
          }
          if (dato < (*raiz)->dato) {
              return insertar(&(*raiz)->izquierdo, dato);
          }
          if (dato > (*raiz)->dato) {
              return insertar(&(*raiz)->derecho, dato);
          }
          return true;
      }

      size_t altura(const Nodo *raiz) {
          if (raiz == NULL) {
              return 0;
          }
          size_t izquierda = altura(raiz->izquierdo);
          size_t derecha = altura(raiz->derecho);
          return 1 + (izquierda > derecha ? izquierda : derecha);
      }

      void destruir(Nodo *raiz) {
          if (raiz != NULL) {
              destruir(raiz->izquierdo);
              destruir(raiz->derecho);
              free(raiz);
          }
      }

      int main(void) {
          Nodo *raiz = NULL;
          for (int i = 1; i <= 4; i++) {
              if (!insertar(&raiz, i)) {
                  destruir(raiz);
                  return 1;
              }
          }
          printf("Altura: %zu\n", altura(raiz));
          destruir(raiz);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Altura: 2`'
      - id: 'b'
        text: '`Altura: 3`'
      - id: 'c'
        text: '`Altura: 4`'
      - id: 'd'
        text: '`Altura: 1`'
    correctOptionId: 'c'
    explanation: >-
      Con los valores en orden creciente, cada nodo nuevo va a la derecha del
      anterior: el árbol degenera en una lista de cuatro nodos y su altura es
      4. Con 3, 1, 2, 4 (por ejemplo), la altura sería 3.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'En un árbol binario de búsqueda degenerado (cada nodo con un solo hijo), buscar un valor cuesta O(log n).'
    correctAnswer: false
    explanation: >-
      El costo de buscar es proporcional a la altura. En un árbol degenerado
      la altura es n, así que la búsqueda es O(n), como en una lista. O(log n)
      solo vale si el árbol está balanceado.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Esta versión de `destruir_arbol` compila sin advertencias. ¿Qué error tiene?'
    code: |-
      void destruir_arbol(Nodo *raiz) {
          if (raiz == NULL) {
              return;
          }
          free(raiz);
          destruir_arbol(raiz->izquierdo);
          destruir_arbol(raiz->derecho);
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Ninguno: libera todos los nodos igual que la versión en postorden.'
      - id: 'b'
        text: 'Lee `raiz->izquierdo` y `raiz->derecho` después de `free(raiz)`: es un uso después de liberar.'
      - id: 'c'
        text: 'Le falta un caso base.'
      - id: 'd'
        text: 'Libera cada nodo dos veces.'
    correctOptionId: 'b'
    explanation: >-
      Es un recorrido en preorden: el nodo se libera antes de visitar sus
      hijos, y los punteros a los hijos se leen de un bloque ya liberado.
      AddressSanitizer lo informa como `heap-use-after-free`. La versión
      correcta libera el nodo al final.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Para eliminar un nodo que tiene dos hijos, la lección usa su sucesor. ¿Cuál es?'
    options:
      - id: 'a'
        text: 'Su hijo izquierdo.'
      - id: 'b'
        text: 'El menor valor de su subárbol derecho, que se copia en el nodo y después se elimina de ese subárbol.'
      - id: 'c'
        text: 'La raíz del árbol.'
      - id: 'd'
        text: 'El mayor valor de su subárbol derecho.'
    correctOptionId: 'b'
    explanation: >-
      El mínimo del subárbol derecho es el siguiente valor en inorden: al
      ponerlo en lugar del eliminado, la regla de búsqueda se sigue cumpliendo.
      Ese sucesor no tiene hijo izquierdo, así que quitarlo es el caso de una
      hoja o de un solo hijo.
  - kind: 'true-false'
    id: 'q9'
    prompt: '`insertar` recibe `Nodo **raiz` porque tiene que modificar un puntero: la raíz si el árbol está vacío, o el campo `izquierdo` o `derecho` de algún nodo.'
    correctAnswer: true
    explanation: >-
      El nodo nuevo se cuelga de un puntero que hoy vale `NULL`. Como C pasa
      los argumentos por valor, la función necesita la dirección de ese
      puntero para cambiarlo; por eso la llamada recursiva pasa
      `&(*raiz)->izquierdo`.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Se insertan 8, 3, 10, 1 y 6, en ese orden, en un árbol binario de búsqueda vacío. ¿Qué muestra este recorrido?'
    code: |-
      void postorden(const Nodo *raiz) {
          if (raiz != NULL) {
              postorden(raiz->izquierdo);
              postorden(raiz->derecho);
              printf("%d ", raiz->dato);
          }
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1 3 6 8 10`'
      - id: 'b'
        text: '`8 3 1 6 10`'
      - id: 'c'
        text: '`1 6 3 10 8`'
      - id: 'd'
        text: '`1 3 6 10 8`'
    correctOptionId: 'c'
    explanation: >-
      El árbol tiene 8 en la raíz, 3 a su izquierda (con hijos 1 y 6) y 10 a
      su derecha. Postorden visita el subárbol izquierdo completo (1, 6, 3),
      después el derecho (10) y por último la raíz (8).
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Con la convención de la lección, ¿qué altura tiene un árbol de un solo nodo?'
    options:
      - id: 'a'
        text: '0'
      - id: 'b'
        text: '1'
      - id: 'c'
        text: '2'
    correctOptionId: 'b'
    explanation: >-
      La lección cuenta nodos del camino más largo: un árbol vacío mide 0 y
      uno con un solo nodo, 1. Algunos libros cuentan aristas y obtienen uno
      menos; lo importante es ser consistente.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'Con la función `insertar` de la lección, insertar un valor que ya está en el árbol agrega un segundo nodo con ese valor.'
    correctAnswer: false
    explanation: >-
      Cuando el valor es igual al del nodo, `insertar` devuelve `true` sin
      reservar nada: el árbol no cambia. La lección no guarda repetidos.
---
