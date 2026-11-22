---
course: 'c'
lesson: 'ordenacion-de-arreglos'
slug: 'autoevaluacion-ordenacion-de-arreglos'
title: 'Autoevaluación: Ordenación de arreglos'
description: 'Doce preguntas sobre el intercambio con variable auxiliar, burbuja con corte temprano, selección e inserción, su complejidad y cantidad de intercambios, estabilidad y ordenamiento de registros por un campo.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      void intercambiar(int v[], int i, int j) {
          v[i] = v[j];
          v[j] = v[i];
      }

      int main(void) {
          int v[] = {3, 8};

          intercambiar(v, 0, 1);
          printf("%d %d\n", v[0], v[1]);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`8 3`'
      - id: 'b'
        text: '`8 8`'
      - id: 'c'
        text: '`3 3`'
      - id: 'd'
        text: '`3 8`'
    correctOptionId: 'b'
    explanation: >-
      La primera asignación pisa el 3 con el 8 y el valor original se pierde;
      la segunda copia ese 8 sobre sí mismo. Para intercambiar hace falta una
      variable auxiliar: `int aux = v[i]; v[i] = v[j]; v[j] = aux;`.
  - kind: 'single-choice'
    id: 'q2'
    prompt: 'Este programa hace una sola pasada de burbuja. ¿Qué muestra?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int v[] = {4, 1, 3, 2};
          int n = 4;

          for (int j = 0; j < n - 1; j++) {
              if (v[j] > v[j + 1]) {
                  int aux = v[j];
                  v[j] = v[j + 1];
                  v[j + 1] = aux;
              }
          }
          for (int i = 0; i < n; i++) {
              printf("%d ", v[i]);
          }
          printf("\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1 2 3 4`'
      - id: 'b'
        text: '`1 3 2 4`'
      - id: 'c'
        text: '`1 4 3 2`'
      - id: 'd'
        text: '`4 3 2 1`'
    correctOptionId: 'b'
    explanation: >-
      El 4 se compara con cada vecino y "burbujea" hasta el final: `{1, 4, 3,
      2}`, `{1, 3, 4, 2}`, `{1, 3, 2, 4}`. Una pasada garantiza que el mayor
      quedó en su lugar, no que todo esté ordenado.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'El método de selección es estable: los elementos con la misma clave conservan su orden relativo.'
    correctAnswer: false
    explanation: >-
      Selección intercambia el mínimo con la primera posición de la parte
      desordenada, y ese intercambio de larga distancia puede saltar por
      encima de un elemento con la misma clave. Burbuja e inserción, con
      comparación estricta, sí son estables.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Cuántas comparaciones hace burbuja con corte temprano si el arreglo de `n` elementos ya está ordenado?'
    options:
      - id: 'a'
        text: '`n(n - 1) / 2`, es decir `O(n²)`.'
      - id: 'b'
        text: '`n - 1`, es decir `O(n)`: una pasada sin intercambios y corta.'
      - id: 'c'
        text: 'Ninguna.'
      - id: 'd'
        text: '`log₂ n`.'
    correctOptionId: 'b'
    explanation: >-
      La variable `hubo_intercambio` queda en `false` después de la primera
      pasada, que compara cada par de vecinos una vez, y el `break` termina el
      método. Sin esa variable, el mejor caso también sería `O(n²)`.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Esta inserción parece funcionar, pero con AddressSanitizer se reporta un acceso fuera del arreglo. ¿Cuál es el error?'
    code: |-
      void ordenar_insercion(int v[], int n) {
          for (int i = 1; i < n; i++) {
              int actual = v[i];
              int j = i - 1;
              while (v[j] > actual && j >= 0) {
                  v[j + 1] = v[j];
                  j--;
              }
              v[j + 1] = actual;
          }
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Las condiciones están en el orden equivocado: cuando `j` llega a -1 se evalúa `v[-1]` antes de comprobar `j >= 0`. Debe ser `j >= 0 && v[j] > actual`.'
      - id: 'b'
        text: 'El ciclo externo debe empezar en `i = 0`.'
      - id: 'c'
        text: 'Falta una variable auxiliar para intercambiar.'
      - id: 'd'
        text: 'La comparación debe ser `>=` en lugar de `>`.'
    correctOptionId: 'a'
    explanation: >-
      `&&` evalúa de izquierda a derecha y corta apenas algo es falso. Con
      `j >= 0` primero, cuando `j` vale -1 la condición es falsa y nunca se
      lee `v[-1]`. En el orden del código se lee fuera del arreglo:
      comportamiento indefinido.
  - kind: 'single-choice'
    id: 'q6'
    prompt: '¿Cuántos intercambios hace el método de selección sobre un arreglo de `n` elementos?'
    options:
      - id: 'a'
        text: 'Exactamente `n - 1`, uno por posición.'
      - id: 'b'
        text: '`n(n - 1) / 2`.'
      - id: 'c'
        text: 'Ninguno si el arreglo está invertido.'
      - id: 'd'
        text: 'Depende de cuántos elementos repetidos haya.'
    correctOptionId: 'a'
    explanation: >-
      Selección hace muchas comparaciones (`O(n²)` siempre), pero un solo
      intercambio por cada posición del ciclo externo. Por eso conviene cuando
      mover un elemento es caro, como con registros grandes.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Si en inserción se escribe `v[j] >= actual` en lugar de `v[j] > actual`, el arreglo queda ordenado igual, pero el método deja de ser estable.'
    correctAnswer: true
    explanation: >-
      Con `>=`, el elemento que se inserta pasa por delante de los que tienen
      su misma clave y cambia su orden relativo. El resultado sigue ordenado,
      pero se pierde la estabilidad.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'Este programa ejecuta solo las dos primeras vueltas de selección. ¿Qué muestra?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int v[] = {7, 3, 9, 1, 5};
          int n = 5;

          for (int i = 0; i < 2; i++) {
              int minimo = i;
              for (int j = i + 1; j < n; j++) {
                  if (v[j] < v[minimo]) {
                      minimo = j;
                  }
              }
              int aux = v[i];
              v[i] = v[minimo];
              v[minimo] = aux;
          }
          for (int i = 0; i < n; i++) {
              printf("%d ", v[i]);
          }
          printf("\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1 3 5 7 9`'
      - id: 'b'
        text: '`1 3 9 7 5`'
      - id: 'c'
        text: '`1 7 9 3 5`'
      - id: 'd'
        text: '`3 7 9 1 5`'
    correctOptionId: 'b'
    explanation: >-
      En la vuelta 0 el mínimo es 1 (posición 3) y se intercambia con el 7:
      `{1, 3, 9, 7, 5}`. En la vuelta 1 el mínimo de lo que queda es el 3, que
      ya está en su lugar. El resto todavía no se ordenó.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'Los alumnos están en orden alfabético. ¿Qué muestra el programa después de ordenarlos por nota con inserción?'
    code: |-
      #include <stdio.h>

      typedef struct {
          char nombre[10];
          int nota;
      } Alumno;

      int main(void) {
          Alumno v[] = {{"Ana", 7}, {"Beto", 9}, {"Ceci", 7}, {"Dani", 9}};
          int n = 4;

          for (int i = 1; i < n; i++) {
              Alumno actual = v[i];
              int j = i - 1;
              while (j >= 0 && v[j].nota > actual.nota) {
                  v[j + 1] = v[j];
                  j--;
              }
              v[j + 1] = actual;
          }
          for (int i = 0; i < n; i++) {
              printf("%s ", v[i].nombre);
          }
          printf("\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Ana Ceci Beto Dani`'
      - id: 'b'
        text: '`Ceci Ana Dani Beto`'
      - id: 'c'
        text: '`Ana Beto Ceci Dani`'
      - id: 'd'
        text: '`Beto Dani Ana Ceci`'
    correctOptionId: 'a'
    explanation: >-
      Inserción con comparación estricta es estable: entre los que tienen 7,
      Ana sigue antes que Ceci, y entre los que tienen 9, Beto sigue antes que
      Dani. Los registros se mueven completos porque la asignación copia
      todos los campos.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'Con un arreglo ya ordenado, inserción hace `n - 1` comparaciones y ningún desplazamiento.'
    correctAnswer: true
    explanation: >-
      Cada elemento se compara una vez con su vecino izquierdo, que es menor o
      igual, y el `while` no entra. Por eso inserción es `O(n)` en el mejor
      caso y muy rápida con arreglos casi ordenados.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Hay que ordenar 20 registros muy grandes, y copiar cada registro es caro. ¿Qué método de la lección conviene?'
    options:
      - id: 'a'
        text: 'Burbuja, porque intercambia vecinos.'
      - id: 'b'
        text: 'Selección, porque hace solo `n - 1` intercambios.'
      - id: 'c'
        text: 'Inserción, porque es `O(1)`.'
      - id: 'd'
        text: 'Cualquiera: todos mueven la misma cantidad de registros.'
    correctOptionId: 'b'
    explanation: >-
      Los tres son `O(n²)` en comparaciones, pero burbuja e inserción pueden
      mover registros muchas veces. Selección mueve cada registro a su lugar
      definitivo con un solo intercambio por posición. Si además hiciera falta
      estabilidad, habría que elegir inserción.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'El estándar de C garantiza que `qsort` es un ordenamiento estable.'
    correctAnswer: false
    explanation: >-
      El estándar no garantiza estabilidad para `qsort`: dos elementos que la
      comparación considera iguales pueden quedar en cualquier orden. Si la
      estabilidad importa, hay que asegurarla de otra forma.
---
