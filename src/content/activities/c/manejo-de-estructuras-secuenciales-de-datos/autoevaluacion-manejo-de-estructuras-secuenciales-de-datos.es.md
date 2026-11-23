---
course: 'c'
lesson: 'manejo-de-estructuras-secuenciales-de-datos'
slug: 'autoevaluacion-manejo-de-estructuras-secuenciales-de-datos'
title: 'Autoevaluación: Estructuras Secuenciales'
description: 'Doce preguntas sobre por qué las variables sueltas no escalan, acceso directo y secuencial, tamaño estático y dinámico, capacidad y cantidad usada, y el procesamiento secuencial de datos con ciclos.'
kind: 'quiz'
order: 1
lang: 'es'
published: true
estimatedMinutes: 15
questions:
  - kind: 'single-choice'
    id: 'q1'
    prompt: '¿Cuál es el problema principal de guardar cinco notas en `nota1`, `nota2`, ..., `nota5`?'
    options:
      - id: 'a'
        text: 'El programa no compila con más de cuatro variables del mismo tipo.'
      - id: 'b'
        text: 'Son nombres distintos: un ciclo no puede pasar de una a otra y la cantidad de notas queda fija en el código.'
      - id: 'c'
        text: 'Cada variable ocupa más memoria que si estuvieran juntas.'
      - id: 'd'
        text: 'El promedio da un resultado incorrecto.'
    correctOptionId: 'b'
    explanation: >-
      El programa es correcto, pero no escala: con 30 notas harían falta 30
      variables y una suma de 30 términos. Lo que falta es un solo nombre para
      todo el conjunto y una posición numérica que un ciclo pueda generar.
  - kind: 'single-choice'
    id: 'q2'
    prompt: '¿Qué muestra este programa?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int nota1 = 8;
          int nota2 = 6;
          int nota3 = 10;
          int nota4 = 7;
          int nota5 = 9;

          double promedio = (nota1 + nota2 + nota3 + nota4 + nota5) / 5.0;
          printf("Promedio: %.2f\n", promedio);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Promedio: 8.00`'
      - id: 'b'
        text: '`Promedio: 8`'
      - id: 'c'
        text: '`Promedio: 40.00`'
      - id: 'd'
        text: '`Promedio: 7.00`'
    correctOptionId: 'a'
    explanation: >-
      La suma es 40 y se divide por `5.0`, un `double`, así que no hay división
      entera: el resultado es 8.0 y `%.2f` lo muestra con dos decimales.
  - kind: 'true-false'
    id: 'q3'
    prompt: 'En "acceso aleatorio", la palabra "aleatorio" significa que el elemento que se obtiene se elige al azar.'
    correctAnswer: false
    explanation: >-
      "Aleatorio" significa que puedes pedir cualquier posición, en el orden que
      quieras, y llegar con el mismo costo. Por eso también se lo llama acceso
      directo.
  - kind: 'single-choice'
    id: 'q4'
    prompt: '¿Cuántos pasos hacen falta para llegar al elemento de la posición `k` con cada tipo de acceso?'
    options:
      - id: 'a'
        text: 'Directo: `k` pasos. Secuencial: un paso.'
      - id: 'b'
        text: 'Los dos necesitan `k` pasos.'
      - id: 'c'
        text: 'Directo: un paso, cualquiera sea `k`. Secuencial: `k` pasos desde el inicio.'
      - id: 'd'
        text: 'Los dos llegan en un paso.'
    correctOptionId: 'c'
    explanation: >-
      Con acceso directo se sabe dónde está cada elemento y se va a él sin mirar
      los anteriores. Con acceso secuencial solo se conoce el primero y cada uno
      lleva al siguiente, así que hay que pasar por todos los anteriores.
  - kind: 'single-choice'
    id: 'q5'
    prompt: 'Una lista de inscriptos tiene capacidad 40 y ya tiene 27 alumnos. ¿Qué muestra este programa, que registra tres inscripciones más?'
    code: |-
      #include <stdio.h>

      #define CAPACIDAD 40

      int main(void) {
          int usados = 27;

          usados = usados + 3;
          printf("Libres: %d de %d\n", CAPACIDAD - usados, CAPACIDAD);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Libres: 13 de 40`'
      - id: 'b'
        text: '`Libres: 10 de 40`'
      - id: 'c'
        text: '`Libres: 10 de 37`'
      - id: 'd'
        text: '`Libres: 30 de 40`'
    correctOptionId: 'b'
    explanation: >-
      La cantidad usada pasa de 27 a 30; la capacidad sigue siendo 40, porque en
      una estructura de tamaño estático no cambia. Quedan 40 − 30 = 10 lugares.
  - kind: 'true-false'
    id: 'q6'
    prompt: 'En una estructura de tamaño estático, la capacidad puede crecer mientras el programa se ejecuta si llegan más datos.'
    correctAnswer: false
    explanation: >-
      Con tamaño estático la capacidad se fija al escribir el programa. Crecer en
      ejecución es lo que hace una estructura de tamaño dinámico, que pide
      memoria al sistema mientras corre (lección `memoria-dinamica`).
  - kind: 'single-choice'
    id: 'q7'
    prompt: 'Este programa procesa una secuencia de datos a medida que llegan. ¿Qué muestra si la entrada es `4 7 2 -1 9`?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int valor;
          int cantidad = 0;
          int suma = 0;

          while (scanf("%d", &valor) == 1 && valor != -1) {
              cantidad++;
              suma += valor;
          }
          printf("Cantidad: %d, suma: %d\n", cantidad, suma);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`Cantidad: 5, suma: 21`'
      - id: 'b'
        text: '`Cantidad: 4, suma: 12`'
      - id: 'c'
        text: '`Cantidad: 3, suma: 13`'
      - id: 'd'
        text: '`Cantidad: 4, suma: 22`'
    correctOptionId: 'c'
    explanation: >-
      El `-1` es un valor centinela: marca el fin de la secuencia y no se cuenta.
      Se procesan 4, 7 y 2 (suma 13) y el `9` nunca se lee. El programa recorre
      los datos en orden, pero no los guarda: para volver a usarlos haría falta
      una estructura como el arreglo de la lección siguiente.
  - kind: 'true-false'
    id: 'q8'
    prompt: 'Este programa debe mostrar el mayor de tres números. Con la entrada `-5 -2 -9` muestra `Mayor: -2`.'
    code: |-
      #include <stdio.h>

      int main(void) {
          int valor;
          int mayor = 0;

          for (int i = 0; i < 3; i++) {
              if (scanf("%d", &valor) != 1) {
                  return 1;
              }
              if (valor > mayor) {
                  mayor = valor;
              }
          }
          printf("Mayor: %d\n", mayor);
          return 0;
      }
    codeLanguage: 'c'
    correctAnswer: false
    explanation: >-
      Muestra `Mayor: 0`, un valor que ni siquiera está en la secuencia: ningún
      número negativo supera el 0 inicial. La corrección es empezar con el primer
      valor leído (por ejemplo, asignar `mayor = valor` cuando `i == 0`), nunca
      con un número inventado.
  - kind: 'single-choice'
    id: 'q9'
    prompt: 'Un programa inserta elementos al principio de una secuencia muy a menudo y casi nunca pide un elemento por su posición. ¿Qué estructura conviene?'
    options:
      - id: 'a'
        text: 'Un arreglo, porque el acceso directo hace barata cualquier operación.'
      - id: 'b'
        text: 'Una lista enlazada, porque insertar consiste en enganchar un elemento nuevo sin correr los demás.'
      - id: 'c'
        text: 'Variables sueltas, una por elemento.'
    correctOptionId: 'b'
    explanation: >-
      En un arreglo, insertar al principio obliga a correr todos los elementos.
      En una lista enlazada (lección 30) es inmediato. Su desventaja, el acceso
      secuencial, casi no importa porque la consulta por posición es rara.
  - kind: 'single-choice'
    id: 'q10'
    prompt: 'Este programa simula el acceso secuencial: para llegar a un vagón hay que atravesar los anteriores. ¿Qué muestra?'
    code: |-
      #include <stdio.h>

      int main(void) {
          int destino = 5;
          int pasos = 0;

          for (int vagon = 1; vagon < destino; vagon++) {
              printf("%d ", vagon);
              pasos++;
          }
          printf("hasta el vagón %d en %d pasos\n", destino, pasos);
          return 0;
      }
    codeLanguage: 'c'
    options:
      - id: 'a'
        text: '`1 2 3 4 5 hasta el vagón 5 en 5 pasos`'
      - id: 'b'
        text: '`hasta el vagón 5 en 1 pasos`'
      - id: 'c'
        text: '`1 2 3 4 hasta el vagón 5 en 4 pasos`'
      - id: 'd'
        text: '`0 1 2 3 4 hasta el vagón 5 en 5 pasos`'
    correctOptionId: 'c'
    explanation: >-
      La condición `vagon < destino` deja afuera al 5: se atraviesan los vagones
      1 a 4, uno por paso. Con acceso directo se llegaría al vagón 5 en un solo
      paso, sin pasar por los anteriores.
  - kind: 'true-false'
    id: 'q11'
    prompt: 'En C, las posiciones de una estructura secuencial como el arreglo empiezan en 0.'
    correctAnswer: true
    explanation: >-
      El primer elemento está en la posición 0, el segundo en la 1, y así. La
      lección siguiente explica por qué y cómo se escribe.
  - kind: 'single-choice'
    id: 'q12'
    prompt: 'Un programa tiene capacidad para 10 pedidos y la cantidad usada ya es 10. Llega un pedido nuevo. ¿Qué debe hacer?'
    options:
      - id: 'a'
        text: 'Guardarlo en la posición siguiente a la última: C agranda la estructura sola.'
      - id: 'b'
        text: 'Rechazarlo y avisar, porque no hay lugar.'
      - id: 'c'
        text: 'Aumentar la capacidad a 11 en ese momento.'
    correctOptionId: 'b'
    explanation: >-
      Una estructura de tamaño estático no crece. Escribir más allá de la
      capacidad no es una opción: en C es un error grave (comportamiento
      indefinido) que verás en la lección 19. Lo correcto es rechazar el dato e
      informarlo.
---
