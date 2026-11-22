---
course: 'c'
lesson: 'concurrencia-threads-y-atomics'
slug: 'autoevaluacion-concurrencia-threads-y-atomics'
title: 'Autoevaluación: Concurrencia, threads y atomics'
description: 'Doce preguntas sobre condiciones de carrera, hilos, mutex, operaciones atómicas, interbloqueo y ThreadSanitizer, con código cuyo resultado debes predecir y errores que debes detectar.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuál es la diferencia entre concurrencia y paralelismo?'
    options:
      - id: 'a'
        text: 'Son sinónimos: los dos significan ejecutar instrucciones al mismo tiempo en varios núcleos.'
      - id: 'b'
        text: 'La concurrencia es manejar varias tareas que progresan de forma intercalada; el paralelismo es ejecutarlas realmente a la vez en varios núcleos.'
      - id: 'c'
        text: 'El paralelismo exige un solo núcleo y la concurrencia exige varios.'
      - id: 'd'
        text: 'La concurrencia solo existe con procesos, y el paralelismo solo con hilos.'
    correctOptionId: 'b'
    explanation: >-
      Un programa concurrente puede correr en un solo núcleo, alternando tareas.
      El paralelismo requiere varios núcleos. Los hilos permiten ambos, y los
      mismos problemas de sincronización aparecen en los dos casos.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Si dos hilos ejecutan `contador++` sobre un `int` global sin protección, el resultado final siempre es correcto porque la operación es una sola línea de C.'
    correctAnswer: false
    explanation: >-
      `contador++` son tres pasos (leer, sumar, escribir). Dos hilos pueden leer el
      mismo valor y pisarse: es una condición de carrera, y se pierden
      incrementos de forma impredecible.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <pthread.h>
      #include <stdio.h>

      static void *duplicar(void *arg) {
          int *p = arg;

          *p *= 2;
          return NULL;
      }

      int main(void) {
          int v = 21;
          pthread_t t;

          pthread_create(&t, NULL, duplicar, &v);
          pthread_join(t, NULL);
          printf("%d\n", v);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`21`, porque el hilo trabaja con una copia de v.'
      - id: 'b'
        text: '`42`'
      - id: 'c'
        text: '`21` o `42`, según quién termine primero.'
      - id: 'd'
        text: 'Un error: no se puede pasar la dirección de una variable local a un hilo.'
    correctOptionId: 'b'
    explanation: >-
      El hilo recibe la dirección de `v` y la modifica. `pthread_join` espera a
      que termine antes del `printf`, de modo que el resultado es siempre 42.
      Pasar la dirección de una variable local es válido mientras la variable viva
      hasta el `join`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa de un solo hilo?'
    code: |-
      #include <stdatomic.h>
      #include <stdio.h>

      int main(void) {
          atomic_int c = 0;

          atomic_fetch_add(&c, 5);
          atomic_fetch_add(&c, 3);
          printf("%d\n", atomic_load(&c));
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3`'
      - id: 'b'
        text: '`5`'
      - id: 'c'
        text: '`8`'
      - id: 'd'
        text: 'Un valor impredecible: las operaciones atómicas no dan resultados fijos.'
    correctOptionId: 'c'
    explanation: >-
      `atomic_fetch_add` suma de forma indivisible. Con un solo hilo la
      secuencia es predecible: 0 + 5 + 3 = 8. La ventaja de lo atómico aparece
      cuando varios hilos actualizan el mismo contador.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'Este código es seguro: cada hilo recibe su propio valor de `i`.'
    code: |-
      for (int i = 0; i < 3; i++) {
          pthread_create(&h[i], NULL, mostrar, &i);
      }
    codeLanguage: 'c'
    correctAnswer: false
    explanation: >-
      Todos los hilos reciben la dirección de la misma variable `i`, que sigue
      cambiando y deja de existir al salir del ciclo. Cada hilo puede leer un
      valor distinto del esperado. La solución es pasar un elemento de un
      arreglo propio de cada hilo.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Estos dos hilos bloquean los mismos candados. ¿Qué puede ocurrir y cómo se evita?'
    code: |-
      static void *hilo1(void *arg) {
          (void)arg;
          pthread_mutex_lock(&a);
          pthread_mutex_lock(&b);
          /* ... */
          pthread_mutex_unlock(&b);
          pthread_mutex_unlock(&a);
          return NULL;
      }

      static void *hilo2(void *arg) {
          (void)arg;
          pthread_mutex_lock(&b);
          pthread_mutex_lock(&a);
          /* ... */
          pthread_mutex_unlock(&a);
          pthread_mutex_unlock(&b);
          return NULL;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Una condición de carrera sobre los candados; se evita usando atómicos.'
      - id: 'b'
        text: 'Un interbloqueo (cada hilo espera el candado que tiene el otro); se evita bloqueando siempre en el mismo orden.'
      - id: 'c'
        text: 'Nada: dos candados distintos nunca interfieren.'
      - id: 'd'
        text: 'Un desborde de pila; se evita llamando a pthread_exit.'
    correctOptionId: 'b'
    explanation: >-
      Si `hilo1` toma `a` y `hilo2` toma `b` al mismo tiempo, cada uno espera el
      candado del otro para siempre. Con un orden global (primero `a`, luego `b`
      en los dos hilos) el problema desaparece.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Qué hace esta opción de compilación?'
    code: |-
      gcc -std=c23 -g -pthread -fsanitize=thread programa.c -o programa
    codeLanguage: 'bash'
    options:
      - id: 'a'
        text: 'Instrumenta el programa para detectar condiciones de carrera entre hilos mientras se ejecuta.'
      - id: 'b'
        text: 'Hace que el compilador reordene el código para que use más hilos.'
      - id: 'c'
        text: 'Detecta errores de memoria, como un desborde de un bloque reservado.'
      - id: 'd'
        text: 'Convierte automáticamente los accesos a variables globales en atómicos.'
    correctOptionId: 'a'
    explanation: >-
      ThreadSanitizer informa los accesos concurrentes a la misma dirección sin
      sincronización. Los errores de memoria los detecta AddressSanitizer, y
      ninguna opción cambia el código para hacerlo seguro por sí sola.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'AddressSanitizer y ThreadSanitizer se pueden activar a la vez en el mismo ejecutable.'
    correctAnswer: false
    explanation: >-
      Son incompatibles: cada uno instrumenta la memoria de forma distinta. Se
      ejecuta el programa dos veces, una compilada con cada sanitizer.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'En `main`, lanzas un hilo y de inmediato haces `return 0;` sin llamar a `pthread_join`. ¿Qué pasa?'
    options:
      - id: 'a'
        text: 'El hilo termina de todos modos antes de que main devuelva.'
      - id: 'b'
        text: 'Al terminar main termina el proceso y el hilo puede quedar a medias, sin completar su trabajo.'
      - id: 'c'
        text: 'El programa espera automáticamente a cualquier hilo creado.'
      - id: 'd'
        text: 'El sistema operativo reinicia el hilo cuando se vuelve a ejecutar el programa.'
    correctOptionId: 'b'
    explanation: >-
      Cuando `main` devuelve, el proceso termina y se detienen todos sus hilos.
      `pthread_join` es la forma de esperar el resultado del hilo.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Varios hilos suman un valor a un único contador. Otro caso: varios hilos actualizan a la vez un total y una lista, y esos dos datos deben cambiar juntos. ¿Qué conviene en cada caso?'
    options:
      - id: 'a'
        text: 'Contador: variable atómica. Total y lista: un mutex que proteja la operación completa.'
      - id: 'b'
        text: 'Contador: mutex. Total y lista: dos variables atómicas separadas.'
      - id: 'c'
        text: 'En los dos casos, una variable volatile.'
      - id: 'd'
        text: 'En los dos casos no hace falta nada si el programa corre rápido.'
    correctOptionId: 'a'
    explanation: >-
      Una operación atómica protege un solo dato. Cuando varias variables deben
      mantenerse consistentes entre sí, hace falta una sección crítica que
      agrupe los cambios, y eso es un mutex. `volatile` no sincroniza hilos.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Qué muestra este programa, compilado con `-pthread`?'
    code: |-
      #include <pthread.h>
      #include <stdio.h>

      static int total = 0;
      static pthread_mutex_t candado = PTHREAD_MUTEX_INITIALIZER;

      static void *sumar(void *arg) {
          (void)arg;
          for (int i = 0; i < 1000; i++) {
              pthread_mutex_lock(&candado);
              total++;
              pthread_mutex_unlock(&candado);
          }
          return NULL;
      }

      int main(void) {
          pthread_t hilos[3];

          for (int i = 0; i < 3; i++) {
              pthread_create(&hilos[i], NULL, sumar, NULL);
          }
          for (int i = 0; i < 3; i++) {
              pthread_join(hilos[i], NULL);
          }
          printf("%d\n", total);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1000`'
      - id: 'b'
        text: 'Un valor entre 1000 y 3000, según la ejecución.'
      - id: 'c'
        text: '`3000`'
      - id: 'd'
        text: 'Un interbloqueo: el programa nunca termina.'
    correctOptionId: 'c'
    explanation: >-
      Cada incremento ocurre dentro de la sección crítica, así que no se pierde
      ninguno: 3 hilos por 1000 vueltas dan 3000 siempre. Sin el mutex habría una
      carrera y el resultado variaría.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'El encabezado `<threads.h>` de C11 está disponible en todas las implementaciones de C, por eso conviene usarlo siempre en lugar de `pthread`.'
    correctAnswer: false
    explanation: >-
      `<threads.h>` es una característica opcional: algunas implementaciones,
      como macOS, no la incluyen. `pthread` funciona en macOS y Linux, así que es
      la opción práctica para un programa que debe compilar en ambos.
---
