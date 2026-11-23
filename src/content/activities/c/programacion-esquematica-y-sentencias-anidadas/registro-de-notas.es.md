---
course: 'c'
lesson: 'programacion-esquematica-y-sentencias-anidadas'
slug: 'registro-de-notas'
title: 'Registro de notas con histograma'
description: 'Proyecto de cierre del control de flujo: lee notas hasta un valor de corte, descarta las inválidas, dibuja una barra por nota con un ciclo anidado y muestra un resumen estadístico.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 60
objectives:
  - 'Diseñar un programa con refinamiento sucesivo, identificando antes de programar dónde hay secuencia, selección e iteración.'
  - 'Combinar un ciclo con valor de corte, decisiones dentro del ciclo y un ciclo anidado.'
  - 'Mantener varios acumuladores (cantidad, suma, aprobadas, máxima y mínima) y tratar el caso en que no hay datos.'
requirements:
  - 'Al principio del archivo, un comentario muestra el esquema general y al menos un nivel de refinamiento de la solución.'
  - 'El programa lee notas enteras con el mensaje Nota (0 a 10, -1 para terminar): hasta que se ingresa -1. Cada scanf comprueba que devuelve 1; si falla, muestra Entrada inválida y termina con return 1;.'
  - 'Una nota fuera del rango de 0 a 10 (distinta de -1) muestra Nota fuera de rango, no se registra y no cuenta para ninguna estadística.'
  - 'Cada nota válida se muestra con printf("%3d | ", nota) seguida de tantos asteriscos como su valor, dibujados con un ciclo for anidado dentro del ciclo de lectura.'
  - 'Al terminar se muestra --- Resumen --- y, si hubo notas válidas, la cantidad, las aprobadas (6 o más), la máxima, la mínima y el promedio con dos decimales.'
  - 'Si no se registró ninguna nota válida, el resumen muestra No se registraron notas. y no calcula el promedio (no se divide por 0).'
  - 'Con las entradas 7, 10, 4, 11, 6 y -1, la salida coincide exactamente con la de ejemplo.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  === Registro de notas ===
  Nota (0 a 10, -1 para terminar): 7
    7 | *******
  Nota (0 a 10, -1 para terminar): 10
   10 | **********
  Nota (0 a 10, -1 para terminar): 4
    4 | ****
  Nota (0 a 10, -1 para terminar): 11
  Nota fuera de rango, no se registra
  Nota (0 a 10, -1 para terminar): 6
    6 | ******
  Nota (0 a 10, -1 para terminar): -1
  --- Resumen ---
  Notas registradas: 4
  Aprobadas (6 o más): 3
  Nota máxima: 10
  Nota mínima: 4
  Promedio: 6.75
extensionChallenges:
  - 'Al final, dibuja una línea de resumen con una A por cada aprobada y una D por cada desaprobada, usando dos ciclos for.'
  - 'Agrega una segunda condición de corte: el programa también termina después de 20 notas válidas.'
deliveryTips:
  - 'Inicializa la máxima en 0 y la mínima en 10 (los extremos del rango): así la primera nota válida siempre las reemplaza.'
  - 'Para el promedio con decimales convierte la suma antes de dividir: (double) suma / cantidad. Si divides dos int, se pierde la parte decimal.'
  - 'Lee la primera nota antes del ciclo y la siguiente al final de cada iteración: es el esquema de lectura con valor de corte de la lección.'
---

## Contexto

Este proyecto cierra el módulo de control de flujo. No hay ninguna estructura nueva: el desafío es combinar las que ya conoces sin perder claridad.

Antes de escribir código, identifica los esquemas: hay una **iteración** que lee notas hasta un valor de corte; dentro de ella, una **selección** que decide si la nota es válida; dentro de esa selección, otra **iteración** que dibuja la barra; y alrededor de todo, la **secuencia** de inicializar, procesar y resumir.

## Consigna

1. Escribe el esquema en un comentario y refínalo hasta que cada paso sea una o pocas sentencias. Por ejemplo:

   ```text
   1. inicializar acumuladores
   2. leer la primera nota
   3. mientras la nota no sea -1:
      3.1 si está fuera de rango, avisar
      3.2 si no, actualizar acumuladores y dibujar su barra
      3.3 leer la siguiente nota
   4. mostrar el resumen (o el aviso de que no hubo notas)
   ```

2. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   /*
      Esquema y refinamiento de la solución.
   */
   int main(void) {
       int nota;
       int i;
       int cantidad = 0;
       int aprobadas = 0;
       int suma = 0;
       int maxima = 0;
       int minima = 10;

       printf("=== Registro de notas ===\n");
       printf("Nota (0 a 10, -1 para terminar): ");
       if (scanf("%d", &nota) != 1) {
           printf("Entrada inválida\n");
           return 1;
       }
       while (nota != -1) {
           // valida, acumula y dibuja la barra con un for anidado
           // lee la siguiente nota
       }

       // muestra el resumen
       return 0;
   }
   ```

3. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

4. Prueba la secuencia del ejemplo, una ejecución que termina con -1 de entrada y una nota 0 (su barra no tiene asteriscos).

## Criterios de evaluación

- [ ] El comentario inicial muestra el esquema y el refinamiento, y el código lo sigue.
- [ ] La salida para la secuencia de ejemplo coincide exactamente.
- [ ] Las notas inválidas no afectan ninguna estadística.
- [ ] El caso sin notas válidas muestra `No se registraron notas.` y no divide por 0.
- [ ] La anidación no supera los tres niveles y cada bloque tiene una intención clara.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
