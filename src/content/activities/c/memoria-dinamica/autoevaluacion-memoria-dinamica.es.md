---
course: 'c'
lesson: 'memoria-dinamica'
slug: 'autoevaluacion-memoria-dinamica'
title: 'Autoevaluación: Memoria dinámica: malloc, calloc, realloc y free'
description: 'Doce preguntas sobre malloc, calloc, realloc y free, la comprobación de cada reserva, el cálculo de tamaños, el arreglo que crece y los errores de tamaño más frecuentes.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 18
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué devuelve `malloc` cuando no puede reservar la memoria pedida?'
    options:
      - id: 'a'
        text: 'Un puntero a un bloque de tamaño cero.'
      - id: 'b'
        text: '`NULL`.'
      - id: 'c'
        text: 'Termina el programa con un mensaje de error.'
      - id: 'd'
        text: 'Un puntero sin inicializar.'
    correctOptionId: 'b'
    explanation: >-
      `malloc`, `calloc` y `realloc` informan el fallo devolviendo `NULL`. Por
      eso cada reserva se comprueba antes de usar el puntero: desreferenciar
      `NULL` es comportamiento indefinido.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué le falta a este fragmento?'
    code: |-
      size_t n = 1000;
      int *v = malloc(n * sizeof *v);
      v[0] = 1;
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Convertir el resultado con `(int *)`, que es obligatorio en C.'
      - id: 'b'
        text: 'Comprobar que `v` no sea `NULL` antes de escribir `v[0]`.'
      - id: 'c'
        text: 'Escribir `sizeof(int *)` en lugar de `sizeof *v`.'
      - id: 'd'
        text: 'Nada: si `malloc` falla, `v[0] = 1` no hace nada.'
    correctOptionId: 'b'
    explanation: >-
      Si `malloc` falla devuelve `NULL`, y `v[0] = 1` escribiría a través de un
      puntero nulo. Lo correcto es `if (v == NULL) { ... }` antes de usarlo. En
      C la conversión del `void *` es automática y `sizeof *v` es la forma
      recomendada del tamaño.
  - kind: 'true-false'
    id: 'q3'
    prompt: '`calloc` reserva un bloque y lo deja con todos sus bytes en cero.'
    correctAnswer: true
    explanation: >-
      A diferencia de `malloc`, que deja el bloque sin inicializar, `calloc`
      lo llena de ceros. Para enteros eso significa que todos valen 0.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué problema tiene esta línea?'
    code: |-
      numeros = realloc(numeros, nueva_capacidad * sizeof *numeros);
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Ninguno: es la forma recomendada de usar `realloc`.'
      - id: 'b'
        text: 'Si `realloc` falla devuelve `NULL` y se pierde el único puntero al bloque original, que queda sin liberar. Hay que usar un puntero temporal.'
      - id: 'c'
        text: '`realloc` no conserva los datos, así que se pierden los números.'
      - id: 'd'
        text: '`realloc` solo puede achicar un bloque, nunca agrandarlo.'
    correctOptionId: 'b'
    explanation: >-
      Cuando `realloc` falla, el bloque original sigue siendo válido. Si
      sobrescribes `numeros` con `NULL`, ya no puedes usarlo ni liberarlo. El
      patrón es `int *nuevo = realloc(...); if (nuevo == NULL) { ... }` y solo
      después `numeros = nuevo;`.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué imprime este programa?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          size_t capacidad = 2;
          size_t cantidad = 0;
          int *v = malloc(capacidad * sizeof *v);
          if (v == NULL) {
              return 1;
          }
          for (int i = 1; i <= 5; i++) {
              if (cantidad == capacidad) {
                  int *nuevo = realloc(v, capacidad * 2 * sizeof *v);
                  if (nuevo == NULL) {
                      free(v);
                      return 1;
                  }
                  v = nuevo;
                  capacidad *= 2;
              }
              v[cantidad] = i * 10;
              cantidad++;
          }
          printf("cantidad %zu, capacidad %zu, ultimo %d\n", cantidad, capacidad, v[cantidad - 1]);
          free(v);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`cantidad 5, capacidad 5, ultimo 50`'
      - id: 'b'
        text: '`cantidad 5, capacidad 8, ultimo 50`'
      - id: 'c'
        text: '`cantidad 5, capacidad 10, ultimo 40`'
      - id: 'd'
        text: '`cantidad 4, capacidad 4, ultimo 40`'
    correctOptionId: 'b'
    explanation: >-
      La capacidad empieza en 2 y se duplica cada vez que el arreglo se llena:
      pasa a 4 al llegar el tercer número y a 8 al llegar el quinto. Se
      guardan 5 números y el último es `5 * 10`.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Llamar a `free(NULL)` es válido y no hace nada.'
    correctAnswer: true
    explanation: >-
      El estándar garantiza que `free` con un puntero nulo no hace nada. Eso
      simplifica los caminos de error: puedes liberar sin preguntar si la
      reserva llegó a hacerse.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Este fragmento quiere un arreglo de 4 `double`, pero escribe fuera del bloque reservado. ¿Dónde está el error?'
    code: |-
      size_t n = 4;
      double *v = malloc(n);
      if (v == NULL) {
          return 1;
      }
      for (size_t i = 0; i < n; i++) {
          v[i] = 1.5;
      }
      free(v);
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'En el `for`: debe ser `i <= n`.'
      - id: 'b'
        text: 'En `malloc(n)`: reserva 4 bytes, no 4 `double`. Debe ser `malloc(n * sizeof *v)`.'
      - id: 'c'
        text: 'En `free(v)`: hay que liberar cada elemento por separado.'
      - id: 'd'
        text: 'No hay error: `malloc` multiplica por el tamaño del tipo automáticamente.'
    correctOptionId: 'b'
    explanation: >-
      `malloc` recibe una cantidad de **bytes**. Con `malloc(n)` el bloque mide
      4 bytes y el primer `v[0] = 1.5` ya escribe fuera de él. El tamaño se
      escribe como `n * sizeof *v`.
  - kind: 'single-choice'
    id: 'q8'
    prompt: '¿Qué imprime este programa?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          int *v = calloc(4, sizeof *v);
          if (v == NULL) {
              return 1;
          }
          v[1] = 5;
          int suma = 0;
          for (size_t i = 0; i < 4; i++) {
              suma += v[i];
          }
          printf("%d\n", suma);
          free(v);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`5`'
      - id: 'b'
        text: 'Un valor impredecible, porque los otros tres elementos no se inicializaron.'
      - id: 'c'
        text: '`20`'
      - id: 'd'
        text: '`0`'
    correctOptionId: 'a'
    explanation: >-
      `calloc` deja los cuatro enteros en 0 y el programa solo cambia `v[1]`,
      así que la suma es 5. Con `malloc` en lugar de `calloc`, leer los otros
      elementos sí daría valores indeterminados.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'Después de `free(p);`, la variable `p` pasa a valer `NULL` automáticamente.'
    correctAnswer: false
    explanation: >-
      `free` recibe una copia del puntero y no puede cambiar tu variable: `p`
      sigue guardando la dirección vieja, que ya no es válida. Si `p` sigue en
      uso, conviene asignarle `NULL` a mano.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Este fragmento copia una cadena en memoria dinámica, pero escribe un byte fuera del bloque. ¿Cuál es la corrección?'
    code: |-
      const char *s = "hola";
      char *copia = malloc(strlen(s));
      if (copia == NULL) {
          return 1;
      }
      strcpy(copia, s);
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Usar `sizeof s` en lugar de `strlen(s)`.'
      - id: 'b'
        text: 'Reservar `strlen(s) + 1` bytes, para que entre también el terminador `\0`.'
      - id: 'c'
        text: 'Usar `calloc` en lugar de `malloc`, sin cambiar el tamaño.'
      - id: 'd'
        text: 'Llamar a `free(copia)` antes de `strcpy`.'
    correctOptionId: 'b'
    explanation: >-
      `strlen` cuenta los caracteres sin el terminador. `"hola"` necesita 5
      bytes y el bloque mide 4, así que `strcpy` escribe el `\0` fuera.
      `sizeof s` sería el tamaño de un puntero, no de la cadena.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Por qué un arreglo dinámico que crece suele duplicar su capacidad en lugar de sumarle 1?'
    options:
      - id: 'a'
        text: 'Porque `realloc` solo acepta tamaños que sean potencias de 2.'
      - id: 'b'
        text: 'Porque cada `realloc` puede copiar todo el arreglo: creciendo de a uno, leer `n` elementos cuesta del orden de `n²` copias; duplicando, del orden de `n`.'
      - id: 'c'
        text: 'Porque así nunca hace falta comprobar si `realloc` falló.'
      - id: 'd'
        text: 'Porque duplicar usa menos memoria que crecer de a uno.'
    correctOptionId: 'b'
    explanation: >-
      Duplicar reduce la cantidad de `realloc` y, con ellas, las copias. A
      cambio puede quedar capacidad sin usar, que se puede devolver al final
      achicando el bloque.
  - kind: 'true-false'
    id: 'q12'
    prompt: '`calloc(cantidad, tamaño)` comprueba que la multiplicación `cantidad * tamaño` no desborde, y en ese caso devuelve `NULL`.'
    correctAnswer: true
    explanation: >-
      Con `malloc(cantidad * tamaño)` la multiplicación la haces tú y puede
      desbordar en silencio, reservando un bloque mucho más chico. `calloc`
      recibe los dos factores por separado y detecta ese caso.
---
