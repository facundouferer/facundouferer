---
course: 'c'
lesson: 'manejo-de-estructuras-secuenciales-de-datos'
slug: 'resumen-de-temperaturas'
title: 'Resumen de temperaturas'
description: 'Programa que lee una secuencia de temperaturas diarias con un ciclo, la procesa a medida que llega (máxima, mínima, promedio y días calurosos) y respeta una capacidad máxima de días.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 35
objectives:
  - 'Procesar una secuencia de datos en orden con un ciclo, sin una variable por cada dato.'
  - 'Calcular máximo, mínimo, promedio y un conteo en un solo recorrido.'
  - 'Respetar una capacidad máxima y validar la cantidad de datos antes de leerlos.'
  - 'Reconocer qué preguntas no se pueden responder sin guardar la secuencia.'
requirements:
  - 'Lee la cantidad con el mensaje Cantidad de días (1 a 31): y comprueba que scanf devuelve 1; si no, muestra Entrada inválida y termina con return 1;.'
  - 'Si la cantidad no está entre 1 y 31 (la capacidad, definida con #define MAX_DIAS 31), muestra La cantidad debe estar entre 1 y 31 y termina con return 1;.'
  - 'Un solo ciclo lee cada temperatura (un entero) con el mensaje Temperatura del día N:, numerando desde 1. Si la lectura falla o el valor no está entre -50 y 60, muestra Temperatura inválida y termina con return 1;.'
  - 'La máxima y la mínima empiezan con la primera temperatura leída, no con un número inventado, y se informa el día de cada una (si se repite, el primero).'
  - 'El promedio se muestra con dos decimales y sin división entera; los días por encima de 30 se cuentan en el mismo ciclo (30 no cuenta).'
  - 'El programa no usa una variable por día: funciona igual con 1 que con 31 días.'
  - 'La salida coincide exactamente con la del ejemplo para esa entrada.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa
  Cantidad de días (1 a 31): 5
  Temperatura del día 1: 28
  Temperatura del día 2: 31
  Temperatura del día 3: 25
  Temperatura del día 4: 33
  Temperatura del día 5: 30
  Máxima: 33 (día 4)
  Mínima: 25 (día 3)
  Promedio: 29.40
  Días por encima de 30: 2
extensionChallenges:
  - 'Muestra también cuántas veces la temperatura subió respecto del día anterior. Solo necesitas recordar un valor: el último leído.'
  - 'Mueve la validación de una temperatura a una función bool temperatura_valida(int t) y úsala dentro del ciclo.'
deliveryTips:
  - 'Prueba con un solo día: la máxima y la mínima tienen que ser ese valor, en el día 1. Prueba también con todas las temperaturas negativas.'
  - 'Intenta agregar "días por encima del promedio": verás que no se puede, porque el promedio se conoce recién al final y las temperaturas ya no están. Esa es justamente la razón de ser del arreglo de la lección siguiente.'
---

## Contexto

Una estación meteorológica envía una temperatura por día. Con lo visto hasta ahora no puedes declarar 31 variables (una por día del mes), pero tampoco hace falta: muchas preguntas sobre una secuencia se responden **procesándola en orden**, dato por dato, mientras llega.

El programa trabaja con dos números distintos, como en la lección: la **capacidad** (31 días como máximo, fija en el código) y la **cantidad usada** (los días que el usuario indica).

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   #define MAX_DIAS 31
   #define UMBRAL 30

   int main(void) {
       int cantidad;

       printf("Cantidad de días (1 a %d): ", MAX_DIAS);
       // lee y valida la cantidad

       // variables para la suma, la máxima, la mínima, sus días y el conteo
       for (int dia = 1; dia <= cantidad; dia++) {
           // lee y valida la temperatura del día
           // actualiza máxima, mínima, suma y conteo
       }

       // muestra el resumen
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Ejecuta con la entrada del ejemplo y compara. Prueba también con 1 día, con 0 y 32 días (deben rechazarse) y con una temperatura de 70.

## Criterios de evaluación

- [ ] La salida para la entrada del ejemplo coincide exactamente.
- [ ] Hay un solo ciclo y ninguna variable por día; el programa funciona con 1 y con 31 días.
- [ ] La máxima y la mínima parten del primer dato y son correctas con temperaturas negativas.
- [ ] El promedio no usa división entera.
- [ ] Las cantidades fuera de 1 a 31, las temperaturas fuera de -50 a 60 y las entradas no numéricas terminan con código 1.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
