---
course: 'c'
lesson: 'busqueda-en-arreglos'
slug: 'autoevaluacion-busqueda-en-arreglos'
title: 'Autoevaluación: Búsqueda en arreglos'
description: 'Doce preguntas sobre el contrato de una función de búsqueda, búsqueda lineal y binaria, seguimiento de índices, cálculo del medio sin desbordamiento, complejidad O(n) y O(log n) y búsqueda de registros por clave.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Por qué una función de búsqueda suele devolver `-1` cuando la clave no está?'
    options:
      - id: 'a'
        text: 'Porque `-1` es el último elemento del arreglo.'
      - id: 'b'
        text: 'Porque ningún índice válido es negativo, así que `-1` no se confunde con una posición real.'
      - id: 'c'
        text: 'Porque el compilador exige que las funciones de búsqueda devuelvan un número negativo.'
      - id: 'd'
        text: 'Porque `v[-1]` es una posición segura que siempre vale cero.'
    correctOptionId: 'b'
    explanation: >-
      Los índices válidos van de 0 a `n - 1`, así que `-1` sirve como señal de
      "no está". Por eso se usa un tipo con signo (`int`) y quien llama debe
      comprobar el resultado antes de usarlo: `v[-1]` está fuera del arreglo.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int buscar_lineal(const int v[], int n, int clave) {
          for (int i = 0; i < n; i++) {
              if (v[i] == clave) {
                  return i;
              }
          }
          return -1;
      }

      int main(void) {
          int v[] = {4, 9, 2, 9, 7};
          int n = (int)(sizeof v / sizeof v[0]);

          printf("%d %d\n", buscar_lineal(v, n, 9), buscar_lineal(v, n, 5));
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3 -1`'
      - id: 'b'
        text: '`1 -1`'
      - id: 'c'
        text: '`1 0`'
      - id: 'd'
        text: '`2 -1`'
    correctOptionId: 'b'
    explanation: >-
      El `return i;` termina la función en la primera aparición: el 9 está en
      las posiciones 1 y 3, y se devuelve 1. El 5 no está, así que el ciclo
      termina y se devuelve -1.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'Si se usa búsqueda binaria sobre un arreglo desordenado, el compilador muestra un error.'
    correctAnswer: false
    explanation: >-
      El compilador no puede saber si los datos están ordenados. El programa
      compila y se ejecuta, pero responde mal: puede devolver -1 para
      elementos que sí están. Ordenar es una precondición que cuida quien
      llama.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Este fragmento hace una búsqueda binaria de 13 y muestra cada `medio` que revisa. ¿Qué muestra?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int v[] = {1, 3, 5, 7, 9, 11, 13};
          int inicio = 0;
          int fin = 6;
          int clave = 13;

          while (inicio <= fin) {
              int medio = inicio + (fin - inicio) / 2;
              printf("%d ", medio);
              if (v[medio] == clave) {
                  break;
              }
              if (v[medio] < clave) {
                  inicio = medio + 1;
              } else {
                  fin = medio - 1;
              }
          }
          printf("\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3 5 6`'
      - id: 'b'
        text: '`0 1 2 3 4 5 6`'
      - id: 'c'
        text: '`3 4 5 6`'
      - id: 'd'
        text: '`3 6`'
    correctOptionId: 'a'
    explanation: >-
      Primero `medio = 0 + 6 / 2 = 3` (7 < 13, `inicio = 4`); después
      `medio = 4 + 2 / 2 = 5` (11 < 13, `inicio = 6`); por último
      `medio = 6`, donde está el 13. Tres comparaciones en lugar de siete.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Por qué se calcula el medio como `inicio + (fin - inicio) / 2` y no como `(inicio + fin) / 2`?'
    options:
      - id: 'a'
        text: 'Porque `(inicio + fin) / 2` da un resultado distinto aun con índices pequeños.'
      - id: 'b'
        text: 'Porque con índices grandes la suma `inicio + fin` puede superar `INT_MAX`, y el desbordamiento de un `int` es comportamiento indefinido.'
      - id: 'c'
        text: 'Porque la división entera solo funciona con restas.'
      - id: 'd'
        text: 'Porque así la búsqueda pasa a ser `O(1)`.'
    correctOptionId: 'b'
    explanation: >-
      Matemáticamente las dos fórmulas son iguales, pero en C la suma se hace
      con `int`. `fin - inicio` siempre entra en un `int`, y sumarle su mitad a
      `inicio` nunca pasa de `fin`.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Este programa muestra `-1` aunque el 8 está en el arreglo. ¿Cuál es el error?'
    code: |-
      #include <stdio.h>

      int buscar_binaria(const int v[], int n, int clave) {
          int inicio = 0;
          int fin = n - 1;

          while (inicio < fin) {
              int medio = inicio + (fin - inicio) / 2;
              if (v[medio] == clave) {
                  return medio;
              }
              if (v[medio] < clave) {
                  inicio = medio + 1;
              } else {
                  fin = medio - 1;
              }
          }
          return -1;
      }

      int main(void) {
          int v[] = {2, 4, 6, 8};

          printf("%d\n", buscar_binaria(v, 4, 8));
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'La condición debe ser `inicio <= fin`: cuando `inicio == fin` todavía queda un elemento por revisar, y aquí es justo el 8.'
      - id: 'b'
        text: 'El arreglo no está ordenado.'
      - id: 'c'
        text: 'Hay que escribir `inicio = medio` en lugar de `inicio = medio + 1`.'
      - id: 'd'
        text: '`fin` debe empezar en `n`, no en `n - 1`.'
    correctOptionId: 'a'
    explanation: >-
      Se revisan `medio = 1` (4 < 8) y `medio = 2` (6 < 8), y queda
      `inicio = fin = 3`. Con `<`, el ciclo termina sin mirar `v[3]`. Con
      `<=` se revisa esa última posición y se devuelve 3.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'En la búsqueda binaria, escribir `inicio = medio` en lugar de `inicio = medio + 1` puede hacer que el ciclo no termine nunca.'
    correctAnswer: true
    explanation: >-
      `v[medio]` ya se comparó, así que hay que excluirlo. Si `inicio` queda en
      `medio`, en algunos casos (por ejemplo, con dos elementos) la zona deja
      de achicarse y se repite el mismo `medio` para siempre.
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'En el peor caso, ¿cuántas comparaciones hacen la búsqueda lineal y la binaria en un arreglo ordenado de 1000 elementos?'
    options:
      - id: 'a'
        text: 'Lineal unas 500; binaria unas 500.'
      - id: 'b'
        text: 'Lineal 1000; binaria unas 10.'
      - id: 'c'
        text: 'Lineal 1000; binaria 1.'
      - id: 'd'
        text: 'Lineal unas 10; binaria 1000.'
    correctOptionId: 'b'
    explanation: >-
      La lineal puede tener que mirar todos los elementos: `O(n)`. La binaria
      descarta la mitad en cada paso, y 1000 se reduce a 1 en unos 10 pasos
      (2 elevado a 10 es 1024): `O(log n)`.
  - kind: 'single-choice'
    id: 'q9'
    prompt: '¿Qué significa que un algoritmo sea `O(n)`?'
    options:
      - id: 'a'
        text: 'Que tarda exactamente `n` segundos.'
      - id: 'b'
        text: 'Que su trabajo crece en proporción a la cantidad de datos: con el doble de elementos, hace del orden del doble de pasos.'
      - id: 'c'
        text: 'Que su trabajo no depende de la cantidad de datos.'
      - id: 'd'
        text: 'Que duplicar los datos agrega un solo paso.'
    correctOptionId: 'b'
    explanation: >-
      La notación O describe cómo crece el trabajo con el tamaño de la
      entrada, no un tiempo en segundos, e ignora las constantes: `n / 2`
      también es `O(n)`. Agregar un paso al duplicar los datos es `O(log n)`.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'Si un arreglo de alumnos está ordenado por legajo, se puede usar búsqueda binaria para encontrar un alumno por su nombre.'
    correctAnswer: false
    explanation: >-
      La búsqueda binaria solo funciona con la clave por la que se ordenó. Si
      el arreglo está ordenado por legajo, los nombres están en cualquier
      orden: para buscar por nombre hay que usar búsqueda lineal (u ordenar
      otra copia por nombre).
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <string.h>

      typedef struct {
          int codigo;
          char nombre[20];
          int stock;
      } Producto;

      int buscar_por_nombre(const Producto v[], int n, const char nombre[]) {
          for (int i = 0; i < n; i++) {
              if (strcmp(v[i].nombre, nombre) == 0) {
                  return i;
              }
          }
          return -1;
      }

      int main(void) {
          Producto v[] = {{30, "Regla", 15}, {10, "Lapiz", 40}, {20, "Goma", 0}};
          int pos = buscar_por_nombre(v, 3, "Goma");

          if (pos != -1) {
              printf("%d %d %d\n", pos, v[pos].codigo, v[pos].stock);
          }
          if (buscar_por_nombre(v, 3, "goma") == -1) {
              printf("sin resultado\n");
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Dos líneas: `2 20 0` y `sin resultado`'
      - id: 'b'
        text: 'Solo `2 20 0`'
      - id: 'c'
        text: 'Dos líneas: `20 2 0` y `sin resultado`'
      - id: 'd'
        text: 'Solo `sin resultado`'
    correctOptionId: 'a'
    explanation: >-
      "Goma" está en la posición 2, con código 20 y stock 0. `strcmp`
      distingue mayúsculas de minúsculas, así que "goma" no coincide con
      ningún nombre y la segunda búsqueda devuelve -1.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'Si hay que hacer muchas búsquedas sobre los mismos datos, conviene ordenarlos una vez y después usar búsqueda binaria.'
    correctAnswer: true
    explanation: >-
      Ordenar cuesta, pero ese costo se paga una sola vez y se reparte entre
      todas las búsquedas, que pasan de `O(n)` a `O(log n)`. Con pocos datos
      desordenados y pocas búsquedas, la búsqueda lineal alcanza.
---
