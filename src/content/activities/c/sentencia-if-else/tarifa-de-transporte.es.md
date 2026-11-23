---
course: 'c'
lesson: 'sentencia-if-else'
slug: 'tarifa-de-transporte'
title: 'Calculadora de tarifa de transporte'
description: 'Programa que lee la edad de un pasajero y si viaja en hora pico, valida los datos y calcula la tarifa con decisiones if-else encadenadas y anidadas.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 40
objectives:
  - 'Elegir entre varios caminos con una cadena if / else if / else ordenada correctamente.'
  - 'Anidar una decisión que solo tiene sentido dentro de otra.'
  - 'Validar la entrada antes de usarla: comprobar el resultado de scanf y el rango de los datos.'
requirements:
  - 'El programa pide la edad con el mensaje Edad del pasajero: y la lee con scanf("%d", &edad), comprobando que scanf devuelve 1. Si no, muestra Entrada inválida y termina con return 1;.'
  - 'Si la edad es menor que 0 o mayor que 120, muestra Edad fuera de rango y termina con return 1; sin pedir el segundo dato.'
  - 'Pide la hora pico con el mensaje ¿Viaja en hora pico? (1 = sí, 0 = no): y la valida igual: si scanf falla muestra Entrada inválida; si el valor no es 0 ni 1 muestra Respuesta inválida. En ambos casos termina con return 1;.'
  - 'Clasifica con una cadena if / else if / else: menor de 12 es Infantil (tarifa base 500); de 12 a 17, Estudiante (800); de 18 a 64, General (1500); 65 o más, Jubilado (600).'
  - 'Solo la categoría General paga un recargo de 300 en hora pico. Esa decisión es un if anidado dentro del bloque de General; las demás categorías tienen recargo 0.'
  - 'Muestra la categoría, la tarifa base, el recargo y el total con el formato exacto de la salida de ejemplo.'
  - 'Todos los bloques usan llaves, aunque tengan una sola sentencia.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa
  Edad del pasajero: 30
  ¿Viaja en hora pico? (1 = sí, 0 = no): 1
  Categoría: General
  Tarifa base: 1500
  Recargo por hora pico: 300
  Total a pagar: 1800
  $ ./programa
  Edad del pasajero: 70
  ¿Viaja en hora pico? (1 = sí, 0 = no): 1
  Categoría: Jubilado
  Tarifa base: 600
  Recargo por hora pico: 0
  Total a pagar: 600
  $ ./programa
  Edad del pasajero: 130
  Edad fuera de rango
extensionChallenges:
  - 'Prueba los bordes de cada categoría (11, 12, 17, 18, 64 y 65) y anota en un comentario qué categoría obtuviste en cada caso.'
  - 'Invierte el orden de la cadena (empieza por edad < 65) y explica en un comentario por qué la clasificación deja de funcionar.'
deliveryTips:
  - 'Ordena la cadena de la condición más restrictiva a la más amplia: la primera condición verdadera gana y las demás ya no se evalúan.'
  - 'Guarda la tarifa base y el recargo en variables y calcula el total una sola vez al final, en lugar de repetir printf en cada rama.'
---

## Contexto

Una empresa de transporte cobra distinto según la edad del pasajero y, para la categoría General, según si viaja en hora pico. Es un caso típico de decisiones: hay varios caminos excluyentes y uno de ellos contiene una decisión propia.

El programa también tiene que defenderse de datos incorrectos. Un `if` que valida la entrada antes de usarla es tan importante como el cálculo.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   int main(void) {
       int edad;
       int pico;
       int base;
       int recargo = 0;

       printf("Edad del pasajero: ");
       if (scanf("%d", &edad) != 1) {
           printf("Entrada inválida\n");
           return 1;
       }

       // 1. Valida el rango de la edad
       // 2. Lee y valida la hora pico
       // 3. Clasifica con if / else if / else (con el if anidado de General)
       // 4. Muestra tarifa base, recargo y total

       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Ejecuta `./programa` con las entradas de la salida de ejemplo y con al menos una entrada no numérica (por ejemplo `hola`).

## Criterios de evaluación

- [ ] Las tres ejecuciones de ejemplo producen exactamente la salida mostrada.
- [ ] Una entrada no numérica muestra `Entrada inválida` y el programa termina con código 1.
- [ ] La cadena `if / else if / else` está ordenada para que cada edad caiga en una sola categoría.
- [ ] El recargo se decide con un `if` anidado dentro de la rama General.
- [ ] Todos los bloques usan llaves y la sangría refleja la estructura.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
