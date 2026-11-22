---
course: 'c'
lesson: 'biblioteca-estandar-y-errores'
slug: 'autoevaluacion-biblioteca-estandar-y-errores'
title: 'Autoevaluación: Biblioteca estándar y manejo de errores'
description: 'Once preguntas sobre las cabeceras de la biblioteca estándar, <ctype.h>, getchar y EOF, strtol, errno, códigos de salida, la limpieza con goto cleanup y qsort con bsearch.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué cabecera tienes que incluir para usar `strtol`, `qsort`, `bsearch` y `EXIT_FAILURE`?'
    options:
      - id: 'a'
        text: '`<string.h>`'
      - id: 'b'
        text: '`<stdlib.h>`'
      - id: 'c'
        text: '`<stdio.h>`'
      - id: 'd'
        text: '`<ctype.h>`'
    correctOptionId: 'b'
    explanation: >-
      `<stdlib.h>` reúne las utilidades generales: memoria (`malloc`, `free`),
      conversiones (`strtol`, `strtod`), ordenamiento y búsqueda (`qsort`,
      `bsearch`) y la salida del programa (`exit`, `EXIT_SUCCESS`,
      `EXIT_FAILURE`).
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <ctype.h>
      #include <stdio.h>

      int main(void) {
          const char texto[] = "Hola, C23!";
          int letras = 0;
          int digitos = 0;
          int otros = 0;

          for (size_t i = 0; texto[i] != '\0'; i++) {
              unsigned char c = (unsigned char)texto[i];
              if (isalpha(c)) {
                  letras++;
              } else if (isdigit(c)) {
                  digitos++;
              } else if (!isspace(c)) {
                  otros++;
              }
          }
          printf("%d %d %d\n", letras, digitos, otros);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`5 2 3`'
      - id: 'b'
        text: '`6 1 2`'
      - id: 'c'
        text: '`5 2 2`'
      - id: 'd'
        text: '`4 2 2`'
    correctOptionId: 'c'
    explanation: >-
      Las letras son H, o, l, a y C (5); los dígitos, 2 y 3 (2). El espacio no
      se cuenta porque `isspace` es verdadero, así que en `otros` quedan solo la
      coma y el signo de exclamación (2).
  - kind: 'true-false'
    id: 'q3'
    prompt: 'Pasar a `isalpha` un `char` con valor negativo (por ejemplo, un byte de la `ñ` en UTF-8 en una plataforma donde `char` tiene signo) es comportamiento indefinido; por eso se convierte primero a `unsigned char`.'
    correctAnswer: true
    explanation: >-
      Las funciones de `<ctype.h>` solo aceptan un valor representable como
      `unsigned char` o `EOF`. Un `char` negativo no es ninguna de las dos
      cosas, y el resultado no está definido. El cast a `unsigned char` antes de
      llamarlas evita el problema.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          const char *texto = "  42abc";
          char *fin;
          long valor = strtol(texto, &fin, 10);

          printf("%ld [%s]\n", valor, fin);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`42 [abc]`'
      - id: 'b'
        text: '`0 [  42abc]`'
      - id: 'c'
        text: '`42 []`'
      - id: 'd'
        text: '`42abc [abc]`'
    correctOptionId: 'a'
    explanation: >-
      `strtol` salta los espacios iniciales, convierte `42` y se detiene en el
      primer carácter que no usó. Deja en `fin` la dirección de ese carácter,
      así que `fin` apunta a `"abc"`. Revisar `*fin` es la forma de detectar la
      basura al final que `atoi` descartaría en silencio.
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          long a = strtol("0x1F", NULL, 0);
          long b = strtol("ff", NULL, 16);
          long c = strtol("017", NULL, 0);

          printf("%ld %ld %ld\n", a, b, c);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`0 255 17`'
      - id: 'b'
        text: '`31 255 17`'
      - id: 'c'
        text: '`31 0 15`'
      - id: 'd'
        text: '`31 255 15`'
    correctOptionId: 'd'
    explanation: >-
      Con base `0`, `strtol` deduce la base del prefijo: `0x1F` es hexadecimal
      (31) y `017` es octal (15). Con base `16`, `ff` vale 255 aunque no lleve
      prefijo. Pasar `NULL` como segundo argumento es válido cuando no te
      interesa saber dónde terminó la conversión.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Este filtro quiere copiar la entrada en la salida hasta el final. ¿Cuál es el error?'
    code: |-
      char c;
      while ((c = getchar()) != EOF) {
          putchar(c);
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`putchar` necesita un segundo argumento con el flujo de salida.'
      - id: 'b'
        text: '`c` debería ser `int`: `getchar` puede devolver los 256 bytes posibles más `EOF`, y un `char` no alcanza para distinguirlos.'
      - id: 'c'
        text: '`getchar` devuelve `NULL` al final de la entrada, no `EOF`.'
      - id: 'd'
        text: 'No hay error: `EOF` siempre entra en un `char`.'
    correctOptionId: 'b'
    explanation: >-
      Si `char` tiene signo, el byte `0xFF` se confunde con `EOF` y el ciclo
      termina antes de tiempo; si no tiene signo, `EOF` se convierte en 255 y el
      ciclo nunca termina. Declarar `int c;` corrige los dos casos.
  - kind: 'true-false'
    id: 'q7'
    prompt: 'Una llamada exitosa a una función de la biblioteca pone `errno` en `0`, así que basta con leer `errno` después de cualquier llamada para saber si falló.'
    correctAnswer: false
    explanation: >-
      Ninguna función de la biblioteca vuelve `errno` a `0` por sí sola, y una
      llamada exitosa puede dejarle cualquier valor. Lo correcto es ponerlo en
      `0` antes de la llamada y consultarlo solo si la función indicó que falló
      (o cuando su documentación lo pide, como en `strtol` con `ERANGE`).
  - kind: 'single-choice'
    id: 'q8'
    prompt: 'El programa reserva dos bloques y usa la salida única con `goto limpiar`. ¿Qué muestra?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>
      #include <string.h>

      int duplicar(const char *texto, char **salida) {
          int estado = -1;
          char *copia = NULL;
          char *doble = NULL;

          copia = malloc(strlen(texto) + 1);
          if (copia == NULL) {
              goto limpiar;
          }
          strcpy(copia, texto);
          doble = malloc(2 * strlen(texto) + 1);
          if (doble == NULL) {
              goto limpiar;
          }
          strcpy(doble, copia);
          strcat(doble, copia);
          *salida = doble;
          doble = NULL;
          estado = 0;

      limpiar:
          free(doble);
          free(copia);
          return estado;
      }

      int main(void) {
          char *resultado = NULL;
          if (duplicar("ab", &resultado) != 0) {
              return EXIT_FAILURE;
          }
          printf("%s %zu\n", resultado, strlen(resultado));
          free(resultado);
          return EXIT_SUCCESS;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`abab 4`, sin errores de memoria: `doble = NULL` evita que la limpieza libere el bloque que pasó al llamador.'
      - id: 'b'
        text: 'Nada útil: la limpieza libera `doble` y `main` lee memoria ya liberada.'
      - id: 'c'
        text: '`ab 2`, porque `strcat` no modifica `doble`.'
      - id: 'd'
        text: 'No compila: `goto` no puede saltar a una etiqueta dentro de la misma función.'
    correctOptionId: 'a'
    explanation: >-
      La propiedad de `doble` pasa al llamador por `*salida`; poner el puntero
      local en `NULL` hace que `free(doble)` no haga nada, porque `free(NULL)`
      es seguro. `copia` sí se libera en la limpieza, y `main` libera
      `resultado` al final. La cadena es `"abab"`, de longitud 4.
  - kind: 'true-false'
    id: 'q9'
    prompt: 'Una comparadora para `qsort` escrita como `return x->codigo - y->codigo;` puede desbordar con valores grandes de signo opuesto; `(x->codigo > y->codigo) - (x->codigo < y->codigo)` evita ese problema.'
    correctAnswer: true
    explanation: >-
      La resta de dos `int` puede superar `INT_MAX` (por ejemplo, `INT_MAX - (-1)`),
      y el desborde de enteros con signo es comportamiento indefinido. La forma
      con dos comparaciones devuelve siempre `-1`, `0` o `1`.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Un programa busca un código con `bsearch` y a veces no encuentra productos que sí están en el arreglo. ¿Cuál es la causa más probable?'
    code: |-
      qsort(productos, n, sizeof productos[0], comparar_nombre);

      Producto clave = {20, ""};
      Producto *p = bsearch(&clave, productos, n, sizeof productos[0],
                            comparar_codigo);
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`bsearch` solo funciona con arreglos de enteros.'
      - id: 'b'
        text: 'La clave tendría que pasarse como `clave` y no como `&clave`.'
      - id: 'c'
        text: 'El arreglo está ordenado por nombre, pero la búsqueda compara por código: `bsearch` exige que el arreglo esté ordenado con el mismo criterio que su comparadora.'
      - id: 'd'
        text: '`bsearch` devuelve el índice del elemento, no un puntero.'
    correctOptionId: 'c'
    explanation: >-
      La búsqueda binaria descarta la mitad del arreglo en cada paso suponiendo
      que está ordenado según la comparadora que recibe. Si se ordenó con otro
      criterio, puede descartar justo la mitad donde estaba el elemento. Hay que
      ordenar con `comparar_codigo` antes de buscar con `comparar_codigo`.
  - kind: 'true-false'
    id: 'q11'
    prompt: '`assert` sirve para validar la entrada del usuario, porque sigue activo aunque el programa se compile con `-DNDEBUG`.'
    correctAnswer: false
    explanation: >-
      Con `-DNDEBUG` todos los `assert` desaparecen del programa. Por eso se usan
      solo para errores de programación (algo que nunca debería pasar). La
      entrada del usuario y los fallos del entorno se validan con `if` y se
      informan con un código de retorno o un mensaje en `stderr`.
---
