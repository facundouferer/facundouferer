---
course: 'c'
lesson: 'procesos-y-estados'
slug: 'autoevaluacion-procesos-y-estados'
title: 'Autoevaluación: Secuencia de Acciones'
description: 'Once preguntas sobre procesos, acciones y estados, composición secuencial, seguimiento del estado de las variables paso a paso y refinamiento sucesivo.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: 'En una primera aproximación, ¿qué es el estado de un programa?'
    options:
      - id: 'a'
        text: 'El texto del código fuente tal como está escrito.'
      - id: 'b'
        text: 'Los valores que tienen sus variables en un momento determinado.'
      - id: 'c'
        text: 'La lista de instrucciones que faltan ejecutar.'
      - id: 'd'
        text: 'El mensaje final que el programa muestra en la pantalla.'
    correctOptionId: 'b'
    explanation: >-
      El estado es la situación del programa en un instante, y está dado
      principalmente por el valor de cada variable en ese momento. Cada acción
      puede cambiarlo.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int a = 4;
          int b = a + 1;
          a = b * 2;
          b = a - b;
          printf("a = %d, b = %d\n", a, b);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`a = 10, b = 5`'
      - id: 'b'
        text: '`a = 8, b = 3`'
      - id: 'c'
        text: '`a = 10, b = 6`'
      - id: 'd'
        text: '`a = 4, b = 5`'
    correctOptionId: 'a'
    explanation: >-
      Sigue el estado línea por línea: `a = 4`; luego `b = 5`; luego
      `a = 5 * 2 = 10`; por último `b = 10 - 5 = 5`. Cada asignación usa los
      valores que hay en ese momento, no los iniciales.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'En la composición secuencial, las instrucciones se ejecutan una después de otra, en el orden en que aparecen.'
    correctAnswer: true
    explanation: >-
      Es el flujo más básico de un programa: sin decisiones ni repeticiones, cada
      instrucción se ejecuta después de la anterior. Incluso dentro de un `if` o
      de un ciclo, cada bloque sigue siendo una secuencia.
  - kind: 'single-choice'
    id: 'q4'
    prompt: 'Se quería intercambiar los valores de `x` e `y`. ¿Qué muestra el programa y por qué falla?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int x = 3;
          int y = 8;
          x = y;
          y = x;
          printf("x = %d, y = %d\n", x, y);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`x = 8, y = 3`: el intercambio funciona.'
      - id: 'b'
        text: '`x = 3, y = 3`: la segunda asignación se ejecuta primero.'
      - id: 'c'
        text: '`x = 8, y = 8`: después de `x = y;` el valor original de `x` se perdió, así que `y = x;` copia 8.'
      - id: 'd'
        text: 'No compila, porque una variable no puede recibir el valor de otra.'
    correctOptionId: 'c'
    explanation: >-
      Después de `x = y;` el estado es `x = 8, y = 8`: el 3 ya no está en
      ninguna variable. Para intercambiar hace falta guardar antes el valor de
      `x` en una variable auxiliar (`int auxiliar = x;`).
  - kind: 'single-choice'
    id: 'q5'
    prompt: '¿Qué es el refinamiento sucesivo?'
    options:
      - id: 'a'
        text: 'Escribir todo el programa de una vez y corregirlo hasta que compile.'
      - id: 'b'
        text: 'Descomponer el problema en pasos cada vez más precisos, de lo general a lo particular, y recién al final escribir el código.'
      - id: 'c'
        text: 'Repetir una instrucción muchas veces hasta obtener el resultado.'
      - id: 'd'
        text: 'Borrar las variables que ya no se usan.'
    correctOptionId: 'b'
    explanation: >-
      Primero planteas pasos generales (leer, calcular, mostrar), después los
      detallas (declarar, leer cada dato, sumar, dividir) y por último los
      traduces a C. Pensar antes de escribir ahorra errores.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'Justo después de ejecutar `total = total * 4;`, el estado es `total = 20`.'
    code: |-
      int total = 0;
      total = total + 5;
      total = total * 4;
      total = total - 2;
    codeLanguage: 'c'
    correctAnswer: true
    explanation: >-
      El estado evoluciona así: `total = 0`, luego `5`, luego `5 * 4 = 20`
      (estado intermedio) y al final `18`. La pregunta pide el estado justo
      después de la tercera línea, no el estado final.
  - kind: 'single-choice'
    id: 'q7'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int n = 7;
          int doble = n * 2;
          n = n + 1;
          printf("%d %d\n", n, doble);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`8 16`'
      - id: 'b'
        text: '`7 14`'
      - id: 'c'
        text: '`8 14`'
      - id: 'd'
        text: '`7 16`'
    correctOptionId: 'c'
    explanation: >-
      `doble` se calcula una sola vez, cuando `n` vale 7, y guarda 14. Cambiar `n`
      después no recalcula `doble`: una asignación guarda un valor, no una
      fórmula.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Cuando cambias el valor de una variable, las variables que se calcularon antes a partir de ella se actualizan solas.'
    correctAnswer: false
    explanation: >-
      Cada asignación copia el valor del momento en que se ejecuta. Si quieres
      que otra variable refleje el cambio, tienes que volver a asignarla
      después.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'Para un programa que calcula el promedio de dos números, ¿cuál es el primer nivel de refinamiento?'
    options:
      - id: 'a'
        text: '`promedio = (numero1 + numero2) / 2;`'
      - id: 'b'
        text: 'Leer dos números, calcular el promedio, mostrar el resultado.'
      - id: 'c'
        text: 'Declarar `numero1`, `numero2` y `promedio` como `float`.'
      - id: 'd'
        text: 'Compilar el programa y ver qué errores aparecen.'
    correctOptionId: 'b'
    explanation: >-
      El primer nivel es el más general: organiza la solución en pocos pasos
      grandes. Las declaraciones y las fórmulas aparecen en niveles posteriores,
      cuando se detalla cada paso.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Este fragmento quiere mostrar `8`. ¿Cuál es el problema?'
    code: |-
      int resultado;
      int numero;

      resultado = numero + 3;
      numero = 5;
      printf("%d\n", resultado);
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: 'Las acciones están en el orden equivocado: `numero` se usa antes de recibir un valor. Hay que asignar `numero = 5;` primero.'
      - id: 'b'
        text: 'Falta un `if` que decida cuándo sumar.'
      - id: 'c'
        text: 'No se pueden declarar dos variables seguidas.'
      - id: 'd'
        text: 'No hay ningún problema: C ordena las asignaciones automáticamente.'
    correctOptionId: 'a'
    explanation: >-
      En una secuencia, el orden importa. Cuando se calcula `resultado`,
      `numero` todavía no tiene un valor asignado por nuestra lógica, así que el
      resultado es impredecible. El compilador con `-Wall` avisa que la variable
      se usa sin inicializar.
  - kind: 'true-false'
    id: 'q11'
    prompt: 'Un estado intermedio es cualquier estado que aparece después de algunas acciones y antes de completar el proceso.'
    correctAnswer: true
    explanation: >-
      Entre el estado inicial y el final, cada acción deja al programa en un
      estado intermedio. Saber en qué estado está el programa en cada paso es lo
      que te permite entender qué está pasando.
---
