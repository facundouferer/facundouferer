---
course: 'c'
lesson: 'variables-parametros-y-pasaje'
slug: 'turnos-de-ventanilla'
title: 'Turnos de una ventanilla sin variables globales'
description: 'Programa que reparte turnos y estima la espera de cada cliente con funciones que usan variables locales static, devuelven sus resultados con return y demuestran que los argumentos se pasan por valor.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 40
objectives:
  - 'Usar variables locales static para conservar un estado entre llamadas sin recurrir a globales.'
  - 'Comunicar resultados con return en lugar de modificar variables de quien llama.'
  - 'Comprobar en la práctica que modificar un parámetro no modifica el argumento.'
  - 'Declarar cada variable en el bloque más chico donde se usa.'
requirements:
  - 'El programa no tiene variables globales; la única macro es MINUTOS_POR_CLIENTE (5).'
  - 'int siguiente_turno(void) usa una variable local static para devolver 1, 2, 3… en llamadas sucesivas.'
  - 'int espera_estimada(int turno) modifica su propio parámetro (turno = turno - 1;) y devuelve turno * MINUTOS_POR_CLIENTE; main muestra el número de turno después de llamarla, y ese número no cambió.'
  - 'int acumular_espera(int minutos) usa una variable local static para sumar las esperas y devuelve el total acumulado.'
  - 'main lee la cantidad de clientes validando scanf y el rango de 1 a 9; fuera de rango muestra Error: la cantidad debe estar entre 1 y 9. y termina con return 1.'
  - 'Las variables turno y espera se declaran dentro del cuerpo del for, no al comienzo de main.'
  - 'La salida coincide exactamente con la del ejemplo para 4 y para 12.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa
  Clientes a atender (1 a 9): 4
  Turno 1: espera estimada 0 min
  Turno 2: espera estimada 5 min
  Turno 3: espera estimada 10 min
  Turno 4: espera estimada 15 min
  Minutos totales de espera: 30
  $ ./programa
  Clientes a atender (1 a 9): 12
  Error: la cantidad debe estar entre 1 y 9.
extensionChallenges:
  - 'Agrega int espera_promedio(int total, int clientes), que devuelva el promedio entero de espera, y muestra Espera promedio: 7 min para 4 clientes.'
  - 'Compila con -Wshadow, declara a propósito una variable turno dentro de otro bloque anidado y explica la advertencia.'
deliveryTips:
  - 'Si los turnos salen todos con el número 1, a la variable de siguiente_turno le falta static.'
  - 'Escribe en un comentario, junto a cada variable, su alcance y su duración.'
---

## Contexto

Una ventanilla de atención reparte números en orden y estima cuánto esperará cada persona. El número de turno tiene que recordarse de una llamada a otra, pero eso no obliga a usar una variable global: una variable local `static` conserva su valor y, a la vez, nadie fuera de su función puede modificarla.

En este proyecto vas a practicar las tres preguntas de la lección: dónde se ve cada nombre, cuánto vive cada variable y cómo viajan los datos entre funciones.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   #define MINUTOS_POR_CLIENTE 5

   int siguiente_turno(void) {
       // variable local static
   }

   int espera_estimada(int turno) {
       turno = turno - 1;   // modifica la copia, no el turno de main
       return turno * MINUTOS_POR_CLIENTE;
   }

   int acumular_espera(int minutos) {
       // variable local static que acumula
   }

   int main(void) {
       int clientes = 0;
       int total = 0;

       // lee y valida la cantidad de clientes
       for (int i = 0; i < clientes; i++) {
           int turno = siguiente_turno();
           // calcula la espera, acumúlala y muestra la línea del turno
       }
       printf("Minutos totales de espera: %d\n", total);
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Ejecuta con 4 y con 12 y compara con la salida de ejemplo. Prueba también con 1 (una sola línea con espera 0) y con 9 (total 180).

## Criterios de evaluación

- [ ] La salida coincide exactamente con la de ejemplo.
- [ ] No hay variables globales; el estado entre llamadas vive en locales `static`.
- [ ] `espera_estimada` modifica su parámetro y, aun así, `main` muestra el turno original.
- [ ] Las funciones devuelven sus resultados con `return` y `main` decide qué hacer con ellos.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
