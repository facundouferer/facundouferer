---
course: 'c'
lesson: 'propiedad-y-errores-de-memoria'
slug: 'autoevaluacion-propiedad-y-errores-de-memoria'
title: 'Autoevaluación: Propiedad de la memoria y errores frecuentes'
description: 'Doce preguntas sobre propiedad y préstamo de memoria, pares crear y destruir, transferencia de propiedad, fugas, doble liberación, uso después de liberar y lectura de informes de AddressSanitizer.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 18
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Una función está documentada así: "Propiedad: el llamador es dueño del resultado y debe liberarlo con `destruir_persona`". ¿Quién libera la persona creada?'
    options:
      - id: 'a'
        text: 'La propia función que la creó, antes de devolverla.'
      - id: 'b'
        text: 'Quien llamó a la función, usando `destruir_persona` y no un `free` directo.'
      - id: 'c'
        text: 'Nadie: el sistema operativo la libera al terminar cada función.'
      - id: 'd'
        text: 'Cualquier función que la reciba prestada.'
    correctOptionId: 'b'
    explanation: >-
      Cada bloque tiene exactamente un dueño. El comentario dice que la
      propiedad pasa a quien llama, y que debe liberarla con la función
      `destruir_...` correspondiente, porque la persona tiene partes
      reservadas por separado.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué error de memoria tiene esta función?'
    code: |-
      int *copiar_positivos(const int *v, size_t n, size_t *cantidad) {
          int *res = malloc(n * sizeof *res);
          if (res == NULL) {
              return NULL;
          }
          *cantidad = 0;
          for (size_t i = 0; i < n; i++) {
              if (v[i] < 0) {
                  return NULL;          /* entrada inválida */
              }
              res[(*cantidad)++] = v[i];
          }
          return res;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Una doble liberación.'
      - id: 'b'
        text: 'Una fuga: el camino de error devuelve `NULL` sin liberar `res`, y nadie más tiene ese puntero.'
      - id: 'c'
        text: 'Un uso después de liberar.'
      - id: 'd'
        text: 'Ninguno: el sistema libera `res` al devolver `NULL`.'
    correctOptionId: 'b'
    explanation: >-
      Una función que falla debe deshacer lo que reservó. Antes de
      `return NULL;` dentro del `for` falta `free(res);`. Si no, el bloque
      queda reservado y sin ningún puntero que permita liberarlo.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'Al ejecutar este programa compilado con `-fsanitize=address`, ¿qué tipo de informe aparece?'
    code: |-
      #include <stdlib.h>

      int main(void) {
          int *p = malloc(sizeof *p);
          if (p == NULL) {
              return 1;
          }
          int *q = p;
          free(p);
          free(q);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`heap-buffer-overflow`'
      - id: 'b'
        text: '`attempting double-free`'
      - id: 'c'
        text: '`heap-use-after-free`'
      - id: 'd'
        text: 'Ninguno: `q` es otra variable, así que liberarla es correcto.'
    correctOptionId: 'b'
    explanation: >-
      `p` y `q` guardan la misma dirección: hay un solo bloque. Liberarlo por
      segunda vez a través de `q` es una doble liberación. Copiar un puntero no
      copia el bloque.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué error tiene este fragmento y qué informe de AddressSanitizer produce?'
    code: |-
      int *p = malloc(sizeof *p);
      if (p == NULL) {
          return 1;
      }
      *p = 42;
      free(p);
      printf("%d\n", *p);
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Una fuga de memoria (`detected memory leaks`).'
      - id: 'b'
        text: 'Un uso después de liberar: lee `*p` cuando el bloque ya fue devuelto (`heap-use-after-free`).'
      - id: 'c'
        text: 'Ninguno: imprime `42`, porque `free` no borra el contenido.'
      - id: 'd'
        text: 'Un desborde por uno (`heap-buffer-overflow`).'
    correctOptionId: 'b'
    explanation: >-
      Después de `free(p)` el bloque ya no existe, aunque `p` conserve la
      dirección. Leerlo es comportamiento indefinido; AddressSanitizer lo
      detecta e informa `heap-use-after-free` con la línea del acceso.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Una función `destruir_...` debe liberar primero el contenedor y después las partes que le pertenecen.'
    correctAnswer: false
    explanation: >-
      Es al revés: primero las partes y después el contenedor, en orden
      inverso al de la creación. Si liberas primero el contenedor, leer
      `p->nombre` para liberarlo sería un uso después de liberar.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Qué problema tiene este fragmento?'
    code: |-
      char *nombre = malloc(4);
      if (nombre == NULL) {
          return 1;
      }
      strcpy(nombre, "Luis");
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Un desborde por uno en el heap: `"Luis"` necesita 5 bytes con el `\0` y el bloque mide 4.'
      - id: 'b'
        text: 'Una fuga, porque `nombre` no se inicializó con `calloc`.'
      - id: 'c'
        text: 'Una doble liberación.'
      - id: 'd'
        text: 'Ninguno: `strcpy` solo copia las letras.'
    correctOptionId: 'a'
    explanation: >-
      `strcpy` copia también el terminador. El quinto byte cae fuera del
      bloque, y AddressSanitizer lo informa como `heap-buffer-overflow`. El
      tamaño correcto es `strlen(texto) + 1`.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Una función que recibe un puntero prestado (por ejemplo `void imprimir_persona(const Persona *p)`) no debe liberarlo.'
    correctAnswer: true
    explanation: >-
      Tomar prestado significa usar el bloque sin ser su dueño. Si la función
      lo liberara, el dueño se quedaría con un puntero colgante y al
      liberarlo de nuevo habría una doble liberación.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '`agenda_agregar` está documentada así: "si devuelve true, la agenda pasa a ser dueña de p; si devuelve false, el llamador sigue siendo el dueño". ¿Qué debe hacer quien llama si recibe `false`?'
    options:
      - id: 'a'
        text: 'Nada: la agenda liberará la persona más tarde.'
      - id: 'b'
        text: 'Liberar la persona con `destruir_persona`, porque sigue siendo suya.'
      - id: 'c'
        text: 'Llamar otra vez a `agenda_agregar` hasta que devuelva `true`.'
      - id: 'd'
        text: 'Liberar la agenda completa.'
    correctOptionId: 'b'
    explanation: >-
      Una función que transfiere la propiedad dice qué pasa si falla. Con
      `false` la agenda no se quedó con `p`, así que si quien llama no la
      destruye, se produce una fuga.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Qué imprime este programa?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      int *crear_contador(int inicio) {
          int *c = malloc(sizeof *c);
          if (c != NULL) {
              *c = inicio;
          }
          return c;
      }

      int main(void) {
          int *a = crear_contador(5);
          if (a == NULL) {
              return 1;
          }
          int *b = a;
          *b += 3;
          printf("%d\n", *a);
          free(a);
          a = NULL;
          b = NULL;
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`5`'
      - id: 'b'
        text: '`8`'
      - id: 'c'
        text: '`3`'
      - id: 'd'
        text: 'Comportamiento indefinido, porque `b` y `a` apuntan al mismo bloque.'
    correctOptionId: 'b'
    explanation: >-
      `b = a` copia la dirección, no el bloque: los dos punteros llegan al
      mismo entero, que pasa de 5 a 8. Que dos punteros compartan un bloque es
      válido; lo importante es liberarlo una sola vez y no usar ninguno de los
      dos después.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'AddressSanitizer solo detecta los errores que ocurren durante las ejecuciones que pruebas; un camino de error que nunca se ejecutó puede seguir teniendo una fuga.'
    correctAnswer: true
    explanation: >-
      AddressSanitizer instrumenta el programa y vigila los accesos mientras
      corre. Si una prueba no recorre un camino, no puede informar lo que
      pasa allí. Por eso conviene probar también las entradas inválidas y los
      casos de error.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'En este fragmento, después de la última línea, ¿cuál afirmación es correcta?'
    code: |-
      char *a = duplicar("sol");    /* devuelve una copia en el heap */
      if (a == NULL) {
          return 1;
      }
      char *b = a;
      free(a);
      a = NULL;
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`b` también vale `NULL`, porque apuntaba al mismo bloque.'
      - id: 'b'
        text: '`b` quedó colgante: guarda la dirección de un bloque ya liberado y no se debe usar ni liberar.'
      - id: 'c'
        text: '`b` sigue siendo válido, porque es una copia independiente de la cadena.'
      - id: 'd'
        text: 'Hay una fuga, porque `b` todavía no se liberó.'
    correctOptionId: 'b'
    explanation: >-
      Asignar `NULL` a `a` no cambia `b`. Los dos apuntaban al mismo bloque y
      ese bloque ya no existe: `b` es un préstamo colgante. No hay fuga,
      porque el único bloque se liberó una vez.
  - kind: 'single-choice'
    id: 'q12'
    prompt: '¿Qué conviene que haga `destruir_planilla(NULL)`?'
    options:
      - id: 'a'
        text: 'Terminar el programa con un error.'
      - id: 'b'
        text: 'No hacer nada, igual que `free(NULL)`.'
      - id: 'c'
        text: 'Reservar una planilla vacía.'
      - id: 'd'
        text: 'Desreferenciar el puntero para liberar sus partes.'
    correctOptionId: 'b'
    explanation: >-
      Una función `destruir_...` que acepta `NULL` simplifica los caminos de
      error: puedes llamarla aunque la creación haya fallado, sin preguntar
      antes.
---
