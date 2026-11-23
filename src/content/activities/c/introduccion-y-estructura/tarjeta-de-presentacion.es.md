---
course: 'c'
lesson: 'introduccion-y-estructura'
slug: 'tarjeta-de-presentacion'
title: 'Tarjeta de presentación en la consola'
description: 'Escribe tu primer programa completo en C: una tarjeta de presentación dibujada con printf, con la estructura básica de main, sentencias y comentarios.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 25
objectives:
  - 'Reconocer y escribir la estructura básica de un programa en C: directiva de preprocesador, función main, bloque entre llaves, sentencias y return 0.'
  - 'Usar printf y la secuencia \n para controlar qué se muestra en cada línea.'
  - 'Documentar la intención del programa con comentarios de una y de varias líneas.'
requirements:
  - 'El archivo se llama programa.c e incluye #include <stdio.h> como primera línea de código.'
  - 'La función principal se declara exactamente como int main(void) y termina con return 0;.'
  - 'El programa usa al menos 8 sentencias printf, cada una terminada en ;.'
  - 'La tarjeta tiene un borde superior, un título, tres líneas de datos (nombre, curso y meta) y un borde inferior, alineados como en la salida de ejemplo.'
  - 'Después de la tarjeta, el programa muestra la línea Programa terminado.'
  - 'El código contiene al menos un comentario de varias líneas (/* ... */) que explica qué hace el programa y al menos un comentario de una línea (//).'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  +------------------------------+
  |   TARJETA DE PRESENTACION    |
  +------------------------------+
  | Nombre: Ana Torres           |
  | Curso:  C de Cero a Pro      |
  | Meta:   escribir codigo claro|
  +------------------------------+
  Programa terminado.
extensionChallenges:
  - 'Agrega una cuarta línea de datos (por ejemplo, tu ciudad) sin romper la alineación del borde derecho.'
  - 'Elimina a propósito un ; o cambia int por Int, compila y lee el mensaje de error. Anota en un comentario qué te dijo el compilador.'
deliveryTips:
  - 'Escribe los textos sin tildes dentro de la tarjeta: algunas consolas muestran las letras acentuadas con un ancho distinto y el borde derecho se desalinea.'
  - 'Cuenta los caracteres de cada línea: todas las líneas de la tarjeta tienen 32 caracteres, incluidos los bordes.'
---

## Contexto

Todo programa en C, por grande que sea, comparte la misma estructura que viste en la lección: una directiva `#include`, la función `main` donde empieza la ejecución, un bloque entre llaves con sentencias terminadas en `;` y un `return 0;` que indica que todo terminó bien.

En este proyecto vas a escribir ese esqueleto completo y a usarlo para dibujar una tarjeta de presentación en la consola. El objetivo no es la tarjeta en sí, sino practicar la precisión: cada carácter, cada `\n` y cada `;` cuentan.

## Consigna

1. Crea el archivo `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   /*
      Explica aquí, en dos o tres líneas, qué hace el programa.
   */
   int main(void) {
       // Borde superior
       printf("+------------------------------+\n");

       // Completa el título, los datos y el borde inferior

       return 0;
   }
   ```

2. Completa la tarjeta con tu nombre, el curso y una meta personal, respetando el formato de la salida de ejemplo.
3. Compila con el comando del curso:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

   La regla del curso es que el programa **compila sin advertencias**. Si el compilador muestra un aviso, corrígelo antes de entregar.
4. Ejecuta `./programa` y compara tu salida con la de ejemplo, línea por línea.

## Criterios de evaluación

- [ ] La estructura es la de la lección: `#include`, `int main(void)`, llaves, sentencias y `return 0;`.
- [ ] La salida coincide en formato con el ejemplo (bordes alineados, una línea por dato).
- [ ] Hay un comentario de varias líneas que explica la intención y al menos uno de una línea.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
- [ ] El código está indentado de forma consistente.
