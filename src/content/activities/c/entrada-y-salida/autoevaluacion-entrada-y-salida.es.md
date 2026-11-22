---
course: 'c'
lesson: 'entrada-y-salida'
slug: 'autoevaluacion-entrada-y-salida'
title: 'Autoevaluación: Entrada y Salida'
description: 'Once preguntas sobre especificadores de printf y scanf, ancho y precisión, el & de scanf, la validación con el valor de retorno, el búfer de entrada y el espacio antes de %c.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Con qué especificador se lee un `double` usando `scanf`?'
    options:
      - id: 'a'
        text: '`%f`'
      - id: 'b'
        text: '`%d`'
      - id: 'c'
        text: '`%lf`'
      - id: 'd'
        text: '`%zu`'
    correctOptionId: 'c'
    explanation: >-
      En `scanf`, `%f` escribe un `float` y `%lf` un `double`. En `printf`, en
      cambio, `%f` sirve para los dos. Usar `%f` para leer un `double` deja la
      variable con un valor incorrecto.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          printf("[%5d][%-4d][%03d]\n", 42, 7, 5);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`[42][7][5]`'
      - id: 'b'
        text: '`[   42][7   ][005]`'
      - id: 'c'
        text: '`[42   ][   7][500]`'
      - id: 'd'
        text: '`[00042][7   ][  5]`'
    correctOptionId: 'b'
    explanation: >-
      `%5d` ocupa al menos 5 caracteres y rellena con espacios a la izquierda.
      `%-4d` alinea a la izquierda en 4 caracteres. `%03d` rellena con ceros
      hasta 3 caracteres.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          printf("[%.2f][%8.3f]\n", 3.14159, 2.5);
          printf("Descuento: 15%%\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`[3.14][   2.500]` y `Descuento: 15%`'
      - id: 'b'
        text: '`[3.14159][2.500]` y `Descuento: 15%%`'
      - id: 'c'
        text: '`[3.14][2.500   ]` y `Descuento: 15`'
      - id: 'd'
        text: '`[3.15][    2.50]` y `Descuento: 15%`'
    correctOptionId: 'a'
    explanation: >-
      `%.2f` muestra dos decimales (3.14). `%8.3f` muestra tres decimales en un
      campo de 8 caracteres contando el punto, así que `2.500` queda con tres
      espacios delante. `%%` muestra un solo `%`.
  - kind: 'true-false'
    id: 'q4'
    prompt: '`scanf` devuelve la cantidad de variables que logró cargar, o `EOF` si la entrada terminó.'
    correctAnswer: true
    explanation: >-
      Por eso se valida comparando con la cantidad pedida: `if (scanf("%d",
      &edad) != 1)`. Si lees dos valores, compara con 2.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Este fragmento compila con una advertencia y no funciona. ¿Cuál es el error?'
    code: |-
      int unidades = 0;
      printf("Unidades: ");
      scanf("%d", unidades);
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Falta `\n` al final de la cadena de formato.'
      - id: 'b'
        text: 'Debería usarse `%u` porque las unidades no son negativas.'
      - id: 'c'
        text: '`unidades` debería inicializarse con 1.'
      - id: 'd'
        text: 'Falta el `&`: `scanf` necesita la dirección de `unidades` para poder escribir en ella.'
    correctOptionId: 'd'
    explanation: >-
      `scanf` tiene que escribir en la variable, y para eso necesita saber dónde
      está guardada: `&unidades`. Sin el `&` recibe su valor (0), no su
      dirección. `-Wall` detecta este error.
  - kind: 'single-choice'
    id: 'q6'
    prompt: 'El programa ejecuta `scanf("%d", &edad)` y el usuario escribe `hola`. ¿Qué ocurre?'
    options:
      - id: 'a'
        text: '`scanf` guarda 0 en `edad` y devuelve 1.'
      - id: 'b'
        text: 'El programa se cierra con un error.'
      - id: 'c'
        text: '`scanf` devuelve 0, no modifica `edad` y deja `hola` en el búfer de entrada.'
      - id: 'd'
        text: '`scanf` descarta `hola` y espera otro número.'
    correctOptionId: 'c'
    explanation: >-
      `scanf` no puede convertir `hola` en un entero, así que no modifica la
      variable y devuelve 0. Los caracteres quedan en el búfer: el próximo
      `scanf("%d", ...)` volvería a fallar si no los descartas con un ciclo de
      `getchar`.
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'El usuario escribe `4`, Enter. ¿Por qué el programa no espera la inicial y qué carácter queda en `inicial`?'
    code: |-
      int ruedas = 0;
      char inicial = ' ';

      printf("Cantidad de ruedas: ");
      if (scanf("%d", &ruedas) != 1) {
          return 1;
      }
      printf("Inicial de la marca: ");
      if (scanf("%c", &inicial) != 1) {
          return 1;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Porque `%c` no omite espacios: lee el salto de línea (`\n`) que dejó el Enter. Se corrige con `" %c"`.'
      - id: 'b'
        text: 'Porque `scanf` no puede leer dos veces en el mismo programa.'
      - id: 'c'
        text: 'Porque `inicial` está inicializada con un espacio; hay que dejarla sin inicializar.'
      - id: 'd'
        text: 'Porque `%c` lee el `4` otra vez.'
    correctOptionId: 'a'
    explanation: >-
      Después de `4` y Enter, el búfer contiene `4\n`. `%d` consume el `4` y
      `%c` toma el `\n` sin esperar. El espacio en `" %c"` le indica a `scanf`
      que descarte los espacios en blanco previos.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Si el usuario escribe `12abc`, `scanf("%d", &n)` devuelve 1, guarda 12 en `n` y deja `abc` pendiente en el búfer.'
    correctAnswer: true
    explanation: >-
      `%d` lee los dígitos mientras puede y se detiene en la `a`. La lectura fue
      exitosa, pero el resto de la línea quedó pendiente para la próxima
      lectura.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'Un programa pide ancho y alto en una sola lectura. ¿Cuál es la validación correcta?'
    options:
      - id: 'a'
        text: '`if (scanf("%d %d", &ancho, &alto) != 1)`'
      - id: 'b'
        text: '`if (scanf("%d %d", &ancho, &alto) != 2)`'
      - id: 'c'
        text: '`if (scanf("%d %d", &ancho, &alto) == 0)`'
      - id: 'd'
        text: 'No hace falta validar si el programa avisa qué ingresar.'
    correctOptionId: 'b'
    explanation: >-
      Se compara con la cantidad de valores pedidos. Con `== 0` no detectarías
      el caso en que solo se leyó el ancho (devuelve 1), ni el fin de la entrada
      (`EOF`).
  - kind: 'true-false'
    id: 'q10'
    prompt: '`printf("%d\n", 3.5);` muestra `3`, porque `%d` descarta la parte decimal.'
    correctAnswer: false
    explanation: >-
      Si el especificador no coincide con el tipo, el resultado es
      impredecible: `printf` interpreta los bits como si fueran de otro tipo.
      `-Wall` avisa. Para un `double` se usa `%f`; si quieres el entero, conviértelo
      con un cast: `(int)3.5`.
  - kind: 'single-choice'
    id: 'q11'
    prompt: 'Este programa lee un precio y una cantidad. ¿Qué tres correcciones necesita?'
    code: |-
      #include <stdio.h>

      int main(void) {
          double precio = 0.0;
          int cantidad = 0;

          scanf("%f", &precio);
          scanf("%d", &cantidad);
          printf("Total: %d\n", precio * cantidad);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Agregar `&` a `printf`, usar `%lf` en `printf` e inicializar `cantidad` con 1.'
      - id: 'b'
        text: 'Cambiar `double` por `float`, quitar el `&` y usar `%d` en ambas lecturas.'
      - id: 'c'
        text: 'Leer el precio con `%lf`, mostrar el total (un `double`) con `%f` o `%.2f`, y validar el resultado de cada `scanf`.'
      - id: 'd'
        text: 'Solo agregar `\n` en las cadenas de `scanf`.'
    correctOptionId: 'c'
    explanation: >-
      `precio` es `double`, así que en `scanf` va `%lf`. `precio * cantidad` es
      un `double` y en `printf` se muestra con `%f`. Además, cada `scanf` debe
      compararse con la cantidad de valores pedidos para no seguir con datos que
      nunca se leyeron.
---
