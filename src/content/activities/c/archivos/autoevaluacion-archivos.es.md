---
course: 'c'
lesson: 'archivos'
slug: 'autoevaluacion-archivos'
title: 'Autoevaluación: Archivos'
description: 'Once preguntas sobre los modos de fopen, la comprobación de NULL, fclose en todos los caminos, el ciclo de lectura correcto, feof y ferror, fscanf, fread y fwrite, fseek y ftell y la portabilidad de los archivos binarios.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 20
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'Quieres sumar líneas al final de `registro.txt` sin perder lo que ya tiene, y crearlo si no existe. ¿Qué modo usas en `fopen`?'
    options:
      - id: 'a'
        text: '`"w"`'
      - id: 'b'
        text: '`"r"`'
      - id: 'c'
        text: '`"a"`'
      - id: 'd'
        text: '`"r+"`'
    correctOptionId: 'c'
    explanation: >-
      `"a"` (agregar) crea el archivo si no existe y escribe siempre al final.
      `"w"` borra el contenido anterior sin preguntar, `"r"` solo lee y `"r+"`
      falla si el archivo no existe.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Si el archivo no existe, `fopen("datos.txt", "r")` devuelve `NULL`, y usar ese puntero sin comprobarlo es comportamiento indefinido.'
    correctAnswer: true
    explanation: >-
      En modo lectura `fopen` no crea el archivo: devuelve `NULL`. Por eso cada
      `fopen` va seguido de un `if (archivo == NULL)` que informa el motivo con
      `perror` y no usa el puntero.
  - kind: 'single-choice'
    id: 'q3'
    prompt: 'El archivo tiene dos líneas. ¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          FILE *archivo = fopen("dos.txt", "w");
          if (archivo == NULL) {
              perror("dos.txt");
              return EXIT_FAILURE;
          }
          fputs("uno\ndos\n", archivo);
          fclose(archivo);

          archivo = fopen("dos.txt", "r");
          if (archivo == NULL) {
              perror("dos.txt");
              return EXIT_FAILURE;
          }
          char linea[32];
          int vueltas = 0;
          while (!feof(archivo)) {
              fgets(linea, sizeof linea, archivo);
              vueltas++;
          }
          fclose(archivo);
          printf("Vueltas: %d\n", vueltas);
          return EXIT_SUCCESS;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Vueltas: 2`'
      - id: 'b'
        text: '`Vueltas: 3`'
      - id: 'c'
        text: '`Vueltas: 1`'
      - id: 'd'
        text: 'El ciclo no termina nunca.'
    correctOptionId: 'b'
    explanation: >-
      `feof` no predice el final: se vuelve verdadero recién cuando una lectura
      choca con él. Después de leer `dos` todavía es falso, así que hay una
      tercera vuelta en la que `fgets` devuelve `NULL` y el contador sube igual.
      El ciclo correcto es `while (fgets(linea, sizeof linea, archivo) != NULL)`.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          FILE *archivo = fopen("notas.txt", "w");
          if (archivo == NULL) {
              perror("notas.txt");
              return EXIT_FAILURE;
          }
          fputs("Ana 8\nLuis siete\nSofia 9\n", archivo);
          fclose(archivo);

          archivo = fopen("notas.txt", "r");
          if (archivo == NULL) {
              perror("notas.txt");
              return EXIT_FAILURE;
          }
          char nombre[32];
          int nota;
          int leidos = 0;
          while (fscanf(archivo, "%31s %d", nombre, &nota) == 2) {
              leidos++;
          }
          printf("%d %s\n", leidos, feof(archivo) ? "fin" : "formato");
          fclose(archivo);
          return EXIT_SUCCESS;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3 fin`'
      - id: 'b'
        text: '`2 fin`'
      - id: 'c'
        text: '`1 formato`'
      - id: 'd'
        text: '`1 fin`'
    correctOptionId: 'c'
    explanation: >-
      El primer par se lee bien. En el segundo, `%31s` toma `Luis` pero `%d` no
      puede convertir `siete`, así que `fscanf` devuelve 1 y el ciclo termina.
      No se llegó al final del archivo, por eso `feof` es falso: es un error de
      formato, no el fin de los datos.
  - kind: 'true-false'
    id: 'q5'
    prompt: 'En un archivo abierto para escritura, revisar lo que devuelve `fclose` es importante, porque los últimos datos se escriben al vaciar el búfer y un error (como un disco lleno) puede aparecer recién al cerrar.'
    correctAnswer: true
    explanation: >-
      Las escrituras se acumulan en un búfer en memoria. `fclose` lo vacía, y si
      eso falla devuelve `EOF`. En un archivo de solo lectura no hay datos
      pendientes, por eso es habitual ignorar su resultado allí.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'El archivo tiene tres `int` y se piden diez. ¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          int datos[3] = {4, 8, 15};
          FILE *archivo = fopen("datos.bin", "wb");
          if (archivo == NULL) {
              perror("datos.bin");
              return EXIT_FAILURE;
          }
          if (fwrite(datos, sizeof datos[0], 3, archivo) != 3 || fclose(archivo) == EOF) {
              fprintf(stderr, "datos.bin: no se pudo guardar\n");
              return EXIT_FAILURE;
          }

          archivo = fopen("datos.bin", "rb");
          if (archivo == NULL) {
              perror("datos.bin");
              return EXIT_FAILURE;
          }
          int leidos[10];
          size_t n = fread(leidos, sizeof leidos[0], 10, archivo);
          printf("%zu %s\n", n, feof(archivo) ? "fin" : "error");
          fclose(archivo);
          return EXIT_SUCCESS;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3 fin`'
      - id: 'b'
        text: '`10 fin`'
      - id: 'c'
        text: '`12 fin` (la cantidad de bytes, si `int` mide 4)'
      - id: 'd'
        text: '`0 error`'
    correctOptionId: 'a'
    explanation: >-
      `fread` devuelve cuántos **elementos completos** leyó, no cuántos bytes:
      3. Como es menor que los 10 pedidos, se pregunta por qué, y `feof` es
      verdadero porque la lectura llegó al final del archivo.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Esta función tiene un error en el manejo de recursos. ¿Cuál es?'
    code: |-
      bool contar_lineas(const char *ruta, int *total) {
          FILE *archivo = fopen(ruta, "r");
          if (archivo == NULL) {
              perror(ruta);
              return false;
          }
          char linea[100];
          int n = 0;
          while (fgets(linea, sizeof linea, archivo) != NULL) {
              n++;
          }
          if (ferror(archivo)) {
              perror(ruta);
              return false;
          }
          fclose(archivo);
          *total = n;
          return true;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Falta comprobar si `fopen` devolvió `NULL`.'
      - id: 'b'
        text: 'Cuando `ferror` es verdadero, la función sale sin cerrar el archivo: cada `fopen` exitoso necesita un `fclose` también en los caminos de error.'
      - id: 'c'
        text: 'El ciclo debería ser `while (!feof(archivo))`.'
      - id: 'd'
        text: '`perror` solo puede usarse después de `fclose`.'
    correctOptionId: 'b'
    explanation: >-
      El camino de error de `ferror` devuelve `false` y deja el archivo abierto.
      La corrección es cerrar antes de salir (por ejemplo, guardar el resultado
      en una variable, llamar a `fclose` una sola vez y devolver al final).
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Un archivo escrito con `fwrite` de un arreglo de `struct` se puede leer sin problemas con otro programa en cualquier otra máquina, porque los bytes son los mismos en todas las plataformas.'
    correctAnswer: false
    explanation: >-
      `fwrite` guarda los bytes tal como están en la memoria de esa máquina: el
      tamaño de los tipos, el relleno de la estructura y el orden de los bytes
      pueden cambiar. Para compartir datos se usa un formato de texto o un
      formato binario definido campo por campo con tipos de ancho fijo.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'En una plataforma donde `int` mide 4 bytes, ¿qué muestra este programa?'
    code: |-
      #include <stdio.h>
      #include <stdlib.h>

      int main(void) {
          int datos[5] = {1, 2, 3, 4, 5};
          FILE *archivo = fopen("cinco.bin", "w+b");
          if (archivo == NULL) {
              perror("cinco.bin");
              return EXIT_FAILURE;
          }
          if (fwrite(datos, sizeof datos[0], 5, archivo) != 5) {
              fclose(archivo);
              return EXIT_FAILURE;
          }
          int x;
          if (fseek(archivo, 3 * (long)sizeof x, SEEK_SET) == 0
              && fread(&x, sizeof x, 1, archivo) == 1) {
              printf("%d %ld\n", x, ftell(archivo));
          }
          fclose(archivo);
          return EXIT_SUCCESS;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`3 12`'
      - id: 'b'
        text: '`4 16`'
      - id: 'c'
        text: '`4 12`'
      - id: 'd'
        text: '`5 20`'
    correctOptionId: 'b'
    explanation: >-
      `fseek` mueve la posición al byte 12, donde empieza el cuarto `int` (el
      índice 3, que vale 4). Después de leerlo, la posición avanzó 4 bytes más,
      así que `ftell` devuelve 16.
  - kind: 'true-false'
    id: 'q10'
    prompt: 'El resultado de `fgetc` se guarda en un `int` y no en un `char`, por el mismo motivo que el de `getchar`: además de cualquier byte, puede devolver `EOF`.'
    correctAnswer: true
    explanation: >-
      `fgetc` es la versión de `getchar` para cualquier flujo y devuelve 257
      valores posibles: los 256 bytes y `EOF`. Un `char` no alcanza para
      distinguirlos.
  - kind: 'single-choice'
    id: 'q11'
    prompt: '¿Por qué se recomienda abrir los archivos binarios con `"rb"` y `"wb"` en lugar de `"r"` y `"w"`?'
    options:
      - id: 'a'
        text: 'Porque sin la `b`, `fread` y `fwrite` no compilan.'
      - id: 'b'
        text: 'Porque en modo texto la biblioteca puede traducir los finales de línea (en Windows, `\n` se escribe como `\r\n`) y alterar los bytes de los datos binarios.'
      - id: 'c'
        text: 'Porque la `b` comprime el archivo.'
      - id: 'd'
        text: 'Porque con `"w"` no se puede escribir más de una línea.'
    correctOptionId: 'b'
    explanation: >-
      En Linux y macOS no hay diferencia, pero en Windows el modo texto traduce
      los finales de línea al escribir y al leer. Con `b` los bytes se leen y
      escriben exactamente como están, así que el programa es correcto en todas
      las plataformas.
---
