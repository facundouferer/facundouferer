---
course: 'c'
lesson: 'introduccion-y-estructura'
slug: 'autoevaluacion-introduccion-y-estructura'
title: 'Autoevaluación: Introducción a C'
description: 'Once preguntas sobre qué es un programa, lenguajes y paradigmas, la estructura de un programa en C, comentarios y errores de sintaxis frecuentes.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 12
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Qué es un programa?'
    options:
      - id: 'a'
        text: 'Un archivo de texto cualquiera guardado en la computadora.'
      - id: 'b'
        text: 'Un conjunto de instrucciones ordenadas para que una computadora realice una tarea.'
      - id: 'c'
        text: 'Una idea general de cómo resolver un problema, sin pasos concretos.'
      - id: 'd'
        text: 'El idioma con el que nos comunicamos con la computadora.'
    correctOptionId: 'b'
    explanation: >-
      Un programa es una secuencia precisa de instrucciones. La computadora no
      completa pasos que faltan: necesita instrucciones claras, concretas y
      ordenadas. El idioma con el que las escribimos es el lenguaje de
      programación, no el programa.
  - kind: 'true-false'
    id: 'q2'
    prompt: 'Un paradigma de programación es lo mismo que un lenguaje de programación.'
    correctAnswer: false
    explanation: >-
      Un lenguaje es la herramienta formal con la que escribimos instrucciones
      (C, Java, Python). Un paradigma es una forma de pensar y organizar la
      solución (imperativo, procedural, orientado a objetos, funcional). Un mismo
      lenguaje puede usarse con más de un paradigma.
  - kind: 'single-choice'
    id: 'q3'
    prompt: '¿Con qué paradigmas se asocia principalmente C?'
    options:
      - id: 'a'
        text: 'Imperativo y procedural.'
      - id: 'b'
        text: 'Orientado a objetos y funcional.'
      - id: 'c'
        text: 'Solo funcional.'
      - id: 'd'
        text: 'Ninguno: C no sigue ningún paradigma.'
    correctOptionId: 'a'
    explanation: >-
      En C indicas paso a paso qué hace la computadora (imperativo) y organizas
      esos pasos en partes con tareas concretas (procedural). C no es un
      lenguaje orientado a objetos.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Qué muestra este programa en la pantalla?'
    code: |-
      #include <stdio.h>

      int main(void) {
          printf("Hola, ");
          printf("mundo\n");
          printf("C\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Tres líneas: `Hola,`, `mundo` y `C`.'
      - id: 'b'
        text: 'Una sola línea: `Hola, mundo C`.'
      - id: 'c'
        text: 'Dos líneas: `Hola, mundo` y `C`.'
      - id: 'd'
        text: 'Nada, porque hay más de un `printf` en `main`.'
    correctOptionId: 'c'
    explanation: >-
      Cada `printf` escribe exactamente el texto que recibe. El primero no
      termina en `\n`, así que `mundo` sigue en la misma línea. El salto de línea
      llega con `\n` al final de `mundo` y `C` se escribe en la línea siguiente.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Este programa no compila. ¿Cuál es el error?'
    code: |-
      #include <stdio.h>

      int main(void) {
          printf("Bienvenida al curso\n")
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Falta un comentario que explique el `printf`.'
      - id: 'b'
        text: 'Falta el `;` al final de la sentencia `printf`.'
      - id: 'c'
        text: 'Sobra el `return 0;`, porque `main` termina sola.'
      - id: 'd'
        text: '`#include` debe escribirse dentro de `main`.'
    correctOptionId: 'b'
    explanation: >-
      En C las sentencias terminan con `;`. Sin él, el compilador no sabe dónde
      termina la llamada a `printf` y reporta un error de sintaxis. El punto y
      coma no es decorativo: forma parte de la sintaxis.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Este programa muestra `Paso 1` y luego `Paso 2`.'
    code: |-
      #include <stdio.h>

      int main(void) {
          printf("Paso 1\n");
          // printf("Paso 2\n");
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: false
    explanation: >-
      La segunda línea empieza con `//`, así que es un comentario de una línea y
      el compilador la ignora. El programa solo muestra `Paso 1`.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Qué es `#include <stdio.h>`?'
    options:
      - id: 'a'
        text: 'Una sentencia que muestra texto en la pantalla.'
      - id: 'b'
        text: 'Una directiva de preprocesador que incorpora lo necesario para usar herramientas de entrada y salida como `printf`.'
      - id: 'c'
        text: 'Un comentario especial que el compilador ignora.'
      - id: 'd'
        text: 'La función donde empieza la ejecución del programa.'
    correctOptionId: 'b'
    explanation: >-
      Las líneas que empiezan con `#` son directivas de preprocesador.
      `#include <stdio.h>` incorpora la biblioteca estándar de entrada y salida,
      que es la que nos permite usar `printf`.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'La ejecución de un programa en C comienza en la función `main`.'
    correctAnswer: true
    explanation: >-
      `main` es el punto de entrada: cuando el programa se ejecuta, empieza por
      la primera sentencia del bloque de `main`.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'Este programa no compila. ¿Por qué?'
    code: |-
      #include <stdio.h>

      Int main(void) {
          printf("Hola\n");
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Porque `printf` debe ir antes de `main`.'
      - id: 'b'
        text: 'Porque falta un comentario de varias líneas.'
      - id: 'c'
        text: 'Porque C distingue mayúsculas de minúsculas: `Int` no es lo mismo que `int`.'
      - id: 'd'
        text: 'Porque `return 0;` solo se permite en programas largos.'
    correctOptionId: 'c'
    explanation: >-
      En C las mayúsculas y minúsculas importan. `int` es una palabra reservada
      del lenguaje; `Int` es un nombre desconocido y el compilador lo rechaza.
      "Casi igual" en programación suele significar incorrecto.
  - kind: 'single-choice'
    id: 'q10'
    prompt: '¿Qué significa `return 0;` al final de `main`?'
    options:
      - id: 'a'
        text: 'Que el programa vuelve a empezar desde la primera línea.'
      - id: 'b'
        text: 'Que el programa muestra el número 0 en la pantalla.'
      - id: 'c'
        text: 'Que `main` terminó y devolvió 0, el valor que indica que la ejecución finalizó correctamente.'
      - id: 'd'
        text: 'Que el programa tuvo un error.'
    correctOptionId: 'c'
    explanation: >-
      `main` devuelve un `int` al terminar. Devolver `0` es la convención para
      decir que todo salió bien. `return` no muestra nada en la pantalla.
  - kind: 'true-false'
    id: 'q11'
    prompt: 'Un buen comentario repite con palabras lo que hace cada línea del código.'
    correctAnswer: false
    explanation: >-
      Un comentario útil aclara una intención que el código no deja ver. Repetir
      lo obvio no agrega información; si el código necesita comentarios para
      explicarlo todo, suele ser mejor elegir nombres más claros y ordenarlo.
---
