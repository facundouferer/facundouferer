---
course: 'c'
lesson: 'punteros-arreglos-y-estructuras'
slug: 'autoevaluacion-punteros-arreglos-y-estructuras'
title: 'Autoevaluación: Punteros, arreglos y estructuras'
description: 'Doce preguntas sobre aritmética de punteros, la relación entre arreglos y punteros, ptrdiff_t, punteros fuera de rango, cadenas, el operador ->, punteros dobles, void * y punteros a funciones.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 18
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué imprime este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int a[] = {10, 20, 30, 40};
          int *p = a + 1;
          printf("%d %d %d\n", *p, *(p + 2), *p + 2);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`20 40 22`'
      - id: 'b'
        text: '`20 22 22`'
      - id: 'c'
        text: '`10 30 12`'
      - id: 'd'
        text: '`20 40 40`'
    correctOptionId: 'a'
    explanation: >-
      `a + 1` apunta al segundo elemento, así que `*p` es 20. `*(p + 2)` avanza
      dos elementos y lee 40. En cambio, `*p + 2` primero lee `*p` (20) y
      después suma 2: la precedencia del `*` unario es mayor que la de la suma.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Si `a` es un arreglo, la expresión `a[i]` equivale a `*(a + i)`.'
    correctAnswer: true
    explanation: >-
      En una expresión, el nombre del arreglo se convierte en un puntero a su
      primer elemento. `a + i` avanza `i` elementos (no `i` bytes) y `*`
      accede a ese elemento. El operador `[]` está definido exactamente así.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'Una función recibe `int datos[]` y calcula `sizeof datos / sizeof datos[0]` para saber cuántos elementos hay. ¿Qué está mal?'
    code: |-
      int sumar(int datos[]) {
          size_t n = sizeof datos / sizeof datos[0];
          int suma = 0;
          for (size_t i = 0; i < n; i++) {
              suma += datos[i];
          }
          return suma;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Nada: `sizeof` siempre da el tamaño del arreglo original.'
      - id: 'b'
        text: '`datos` es en realidad un `int *`, así que `sizeof datos` da el tamaño de un puntero. La longitud debe llegar en un parámetro `size_t n`.'
      - id: 'c'
        text: 'Hay que escribir `sizeof(datos)` con paréntesis para que funcione.'
      - id: 'd'
        text: 'Falta declarar `datos` como `const`, y eso cambia el resultado de `sizeof`.'
    correctOptionId: 'b'
    explanation: >-
      Pasar un arreglo a una función es pasar un puntero a su primer elemento:
      el parámetro `int datos[]` se ajusta a `int *datos`. Dentro de la
      función ya no se conoce la longitud, por eso viaja aparte como `size_t`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué imprime este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int a[6] = {0};
          int *p = &a[1];
          int *q = &a[4];
          printf("%td\n", q - p);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3`'
      - id: 'b'
        text: '`12`, porque cada `int` ocupa 4 bytes.'
      - id: 'c'
        text: '`4`'
      - id: 'd'
        text: 'Una dirección de memoria.'
    correctOptionId: 'a'
    explanation: >-
      Restar dos punteros al mismo arreglo da la distancia en **elementos**,
      no en bytes, y el resultado es de tipo `ptrdiff_t` (se imprime con
      `%td`). De `a[1]` a `a[4]` hay 3 elementos.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Si `p` es un puntero a una estructura con un campo `nota`, ¿qué expresión equivale a `p->nota`?'
    options:
      - id: 'a'
        text: '`*p.nota`'
      - id: 'b'
        text: '`(*p).nota`'
      - id: 'c'
        text: '`&p.nota`'
      - id: 'd'
        text: '`p.nota`'
    correctOptionId: 'b'
    explanation: >-
      `p->nota` es una forma abreviada de `(*p).nota`: primero se desreferencia
      el puntero y después se accede al campo. Sin paréntesis, `*p.nota` se lee
      como `*(p.nota)`, porque el punto tiene mayor precedencia que el `*`.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Este fragmento suma los elementos de un arreglo, pero tiene un error. ¿Cuál?'
    code: |-
      int a[5] = {1, 2, 3, 4, 5};
      int suma = 0;
      for (int *p = a; p <= a + 5; p++) {
          suma += *p;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'No se puede comparar dos punteros con `<=`.'
      - id: 'b'
        text: 'La condición debe ser `p < a + 5`: con `<=` se desreferencia `a + 5`, una posición después del final (comportamiento indefinido).'
      - id: 'c'
        text: '`p++` avanza un byte, así que lee partes de cada `int`.'
      - id: 'd'
        text: 'Ninguno: `a + 5` es el último elemento del arreglo.'
    correctOptionId: 'b'
    explanation: >-
      Los elementos válidos van de `a + 0` a `a + 4`. Calcular `a + 5` (uno
      después del final) está permitido y sirve como límite, pero
      desreferenciarlo es salir del arreglo: comportamiento indefinido.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Está permitido calcular un puntero a la posición inmediatamente posterior al último elemento de un arreglo, pero no desreferenciarlo.'
    correctAnswer: true
    explanation: >-
      El estándar garantiza que el puntero "uno después del final" existe y se
      puede comparar, lo que permite recorridos como `for (p = a; p < a + n; p++)`.
      Leer o escribir en esa posición es comportamiento indefinido.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Qué imprime este programa?'
    code: |-
      #include <stdio.h>

      void avanzar(const char **p) {
          (*p)++;
      }

      int main(void) {
          const char *s = "hola";
          avanzar(&s);
          avanzar(&s);
          printf("%s\n", s);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`hola`, porque el puntero se pasa por valor.'
      - id: 'b'
        text: '`la`'
      - id: 'c'
        text: '`ola`'
      - id: 'd'
        text: '`jqla`'
    correctOptionId: 'b'
    explanation: >-
      `avanzar` recibe la dirección de `s` (un `const char **`). Con `(*p)++`
      modifica el puntero `s` de `main`, que avanza un carácter en cada
      llamada. Después de dos llamadas apunta a `"la"`. Un puntero doble
      permite que una función cambie a qué apunta un puntero de quien llama.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'Un `void *` se puede desreferenciar directamente con `*` para leer el valor al que apunta.'
    correctAnswer: false
    explanation: >-
      Un `void *` puede guardar la dirección de cualquier objeto, pero no dice
      qué tipo tiene ese objeto ni cuántos bytes ocupa. Antes de leer hay que
      convertirlo al tipo de puntero correcto, como hace una comparadora de
      `qsort`.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Qué imprime este programa?'
    code: |-
      #include <stdio.h>

      int sumar(int a, int b) { return a + b; }
      int restar(int a, int b) { return a - b; }

      int main(void) {
          int (*op)(int, int) = sumar;
          op = restar;
          printf("%d\n", op(10, 4) * 2);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`28`'
      - id: 'b'
        text: '`12`'
      - id: 'c'
        text: '`6`'
      - id: 'd'
        text: '`2`'
    correctOptionId: 'b'
    explanation: >-
      `op` es un puntero a función. Al final apunta a `restar`, así que
      `op(10, 4)` vale 6 y el resultado impreso es `6 * 2`, es decir, 12.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Este programa intenta poner en mayúscula la primera letra. ¿Cuál es el problema y cómo se corrige?'
    code: |-
      char *s = "hola";
      s[0] = 'H';
      printf("%s\n", s);
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Falta `\0` al final; se corrige escribiendo `"hola\0"`.'
      - id: 'b'
        text: '`s` apunta a una cadena literal, que es de solo lectura: modificarla es comportamiento indefinido. Se corrige con `char s[] = "hola";`, que crea un arreglo propio y modificable.'
      - id: 'c'
        text: 'Se debe usar `*s[0]` para escribir a través del puntero.'
      - id: 'd'
        text: 'No hay ningún problema: el programa imprime `Hola` en cualquier sistema.'
    correctOptionId: 'b'
    explanation: >-
      Las cadenas literales no se pueden modificar. Con `char s[] = "hola";` el
      compilador copia los caracteres en un arreglo de cinco elementos que te
      pertenece. Para recibir un puntero a una literal, lo correcto es
      `const char *`.
  - kind: 'single-choice'
    id: 'q12'
    prompt: '¿Qué imprime este programa?'
    code: |-
      #include <stdio.h>

      struct alumno {
          char nombre[20];
          int nota;
      };

      void aprobar(struct alumno *a) {
          if (a->nota < 6) {
              a->nota = 6;
          }
      }

      int main(void) {
          struct alumno grupo[3] = {{"Ana", 9}, {"Luis", 4}, {"Sol", 7}};
          for (size_t i = 0; i < 3; i++) {
              aprobar(grupo + i);
          }
          printf("%d %d %d\n", grupo[0].nota, grupo[1].nota, grupo[2].nota);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`9 4 7`, porque la estructura se pasa por valor.'
      - id: 'b'
        text: '`6 6 6`'
      - id: 'c'
        text: '`9 6 7`'
      - id: 'd'
        text: 'No compila: `grupo + i` no es la dirección de una estructura.'
    correctOptionId: 'c'
    explanation: >-
      `grupo + i` es un puntero al elemento `i` del arreglo (igual que
      `&grupo[i]`). `aprobar` recibe esa dirección y, con `->`, modifica la
      nota del alumno original. Solo Luis tenía menos de 6.
---
