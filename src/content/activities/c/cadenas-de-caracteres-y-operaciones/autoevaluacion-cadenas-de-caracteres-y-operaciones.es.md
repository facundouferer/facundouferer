---
course: 'c'
lesson: 'cadenas-de-caracteres-y-operaciones'
slug: 'autoevaluacion-cadenas-de-caracteres-y-operaciones'
title: 'Autoevaluación: Cadenas de Caracteres'
description: 'Doce preguntas sobre el terminador, capacidad y longitud, lectura con scanf y fgets, copia y concatenación sin desbordar, comparación con strcmp y conversión entre números y texto.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué capacidad mínima necesita un arreglo de `char` para guardar la cadena `"Hola"`?'
    options:
      - id: 'a'
        text: '4'
      - id: 'b'
        text: '5'
      - id: 'c'
        text: '3'
      - id: 'd'
        text: '8'
    correctOptionId: 'b'
    explanation: >-
      Una cadena de longitud `L` necesita capacidad `L + 1`: los cuatro
      caracteres más el terminador `'\0'`.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <string.h>

      int main(void) {
          char saludo[10] = "Hola";

          printf("%zu %zu\n", sizeof saludo, strlen(saludo));
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`4 4`'
      - id: 'b'
        text: '`5 4`'
      - id: 'c'
        text: '`10 4`'
      - id: 'd'
        text: '`10 5`'
    correctOptionId: 'c'
    explanation: >-
      `sizeof` mide la capacidad del arreglo (10 `char`), que es fija.
      `strlen` cuenta los caracteres antes del `'\0'`: 4. El terminador no
      cuenta en la longitud.
  - kind: 'true-false'
    id: 'q3'
    prompt: '`''A''` y `"A"` son lo mismo en C: los dos ocupan un solo `char`.'
    correctAnswer: false
    explanation: >-
      `'A'` es un carácter. `"A"` es una cadena: un arreglo de dos `char`, `'A'`
      y el terminador `'\0'`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          char corto[6];

          int escritos = snprintf(corto, sizeof corto, "%s", "Bienvenido");
          printf("%s %d\n", corto, escritos);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Bienve 6`'
      - id: 'b'
        text: '`Bienv 10`'
      - id: 'c'
        text: '`Bienvenido 10`'
      - id: 'd'
        text: '`Bienv 5`'
    correctOptionId: 'b'
    explanation: >-
      `snprintf` nunca escribe más que la capacidad y siempre termina con `'\0'`:
      guarda 5 caracteres y el terminador. Devuelve cuántos caracteres habría
      escrito (10). Como 10 es mayor o igual que la capacidad, el texto se
      truncó.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Para leer una palabra en `char nombre[20];` con `scanf`, ¿qué formato evita desbordar el arreglo?'
    options:
      - id: 'a'
        text: '`scanf("%s", nombre)`'
      - id: 'b'
        text: '`scanf("%20s", nombre)`'
      - id: 'c'
        text: '`scanf("%19s", nombre)`'
      - id: 'd'
        text: '`scanf("%s", &nombre[20])`'
    correctOptionId: 'c'
    explanation: >-
      El ancho es siempre capacidad − 1: `scanf` guarda como mucho 19 caracteres
      y agrega el `'\0'`. Con `%20s` no queda lugar para el terminador, y sin
      ancho no hay ningún límite.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'Este programa muestra `Clave incorrecta` aunque el usuario escriba `secreto`. ¿Cuál es el error?'
    code: |-
      #include <stdio.h>

      int main(void) {
          char clave[20];

          if (scanf("%19s", clave) != 1) {
              return 1;
          }
          if (clave == "secreto") {
              printf("Clave correcta\n");
          } else {
              printf("Clave incorrecta\n");
          }
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Falta el `&` antes de `clave` en `scanf`.'
      - id: 'b'
        text: '`==` compara si son el mismo arreglo, no el texto. Hay que usar `strcmp(clave, "secreto") == 0`.'
      - id: 'c'
        text: 'El ancho `%19s` corta la palabra.'
    correctOptionId: 'b'
    explanation: >-
      `clave` y el literal son arreglos distintos, así que `==` es falso aunque
      tengan las mismas letras (el compilador lo advierte). El contenido se
      compara con `strcmp`, de `<string.h>`. El nombre de un arreglo va sin `&`
      en `scanf`.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'El usuario escribe `Hola` y presiona Enter. ¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <string.h>

      int main(void) {
          char linea[50];

          if (fgets(linea, sizeof linea, stdin) == NULL) {
              return 1;
          }
          printf("[%s] %zu\n", linea, strlen(linea));
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`[Hola] 4`'
      - id: 'b'
        text: '`[Hola` en una línea y `] 5` en la siguiente.'
      - id: 'c'
        text: '`[Hola] 50`'
      - id: 'd'
        text: '`[Hola] 5`'
    correctOptionId: 'b'
    explanation: >-
      `fgets` guarda también el `'\n'` del Enter, así que la longitud es 5 y el
      corchete de cierre sale en la línea siguiente. Se quita con
      `linea[strcspn(linea, "\n")] = '\0';`.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Este programa muestra `Zeta va antes`.'
    code: |-
      #include <stdio.h>
      #include <string.h>

      int main(void) {
          printf("%s\n", strcmp("Zeta", "abeja") < 0 ? "Zeta va antes" : "abeja va antes");
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: true
    explanation: >-
      `strcmp` compara los códigos de los caracteres, no el orden del
      diccionario: todas las mayúsculas van antes que las minúsculas, así que
      `"Zeta"` va antes que `"abeja"`.
  - kind: 'true-false'
    id: 'q9'
    prompt: '`strncpy(destino, origen, sizeof destino)` siempre deja en `destino` una cadena terminada en `''\0''`.'
    correctAnswer: false
    explanation: >-
      Si el origen tiene `sizeof destino` caracteres o más, `strncpy` copia esa
      cantidad y no agrega el terminador: el resultado no es una cadena. Para
      copiar con límite, prefiere `snprintf`.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      size_t contar(const char s[], char c) {
          size_t cantidad = 0;
          for (size_t i = 0; s[i] != '\0'; i++) {
              if (s[i] == c) {
                  cantidad++;
              }
          }
          return cantidad;
      }

      int main(void) {
          char fruta[] = "banana";

          printf("%zu %zu\n", contar(fruta, 'a'), sizeof fruta);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3 6`'
      - id: 'b'
        text: '`3 7`'
      - id: 'c'
        text: '`2 7`'
      - id: 'd'
        text: '`3 8`'
    correctOptionId: 'b'
    explanation: >-
      La función recorre hasta el terminador, sin necesitar la cantidad como
      parámetro, y encuentra tres `a`. El arreglo tiene seis letras más el
      `'\0'` que agrega el compilador: `sizeof fruta` es 7.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          char a[] = "12";
          char b[] = "30";
          char unidos[8];

          snprintf(unidos, sizeof unidos, "%s%s", a, b);
          printf("%s %d\n", unidos, atoi(a) + atoi(b));
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`42 42`'
      - id: 'b'
        text: '`1230 1230`'
      - id: 'c'
        text: '`1230 42`'
      - id: 'd'
        text: '`42 1230`'
    correctOptionId: 'c'
    explanation: >-
      Unir dos cadenas con `snprintf` las pega como texto: `"1230"`. Para sumar
      sus valores hay que convertirlas con `atoi`: 12 + 30 = 42.
  - kind: 'true-false'
    id: 'q12'
    prompt: 'Para agregar texto con `strncat` sin desbordar `destino`, el límite correcto es `sizeof destino - strlen(destino) - 1`.'
    correctAnswer: true
    explanation: >-
      Ese es el lugar libre: la capacidad menos lo que ya está ocupado y menos un
      lugar para el `'\0'`, que `strncat` siempre agrega.
---
