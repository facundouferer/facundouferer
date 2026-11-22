---
course: 'c'
lesson: 'punteros-arreglos-y-estructuras'
slug: 'planilla-de-alumnos-con-punteros'
title: 'Planilla de alumnos con punteros, -> y qsort'
description: 'Programa que muestra, modifica, promedia, filtra y ordena una planilla de alumnos recorriéndola con punteros, usando el operador ->, un puntero a función como criterio y qsort con una comparadora.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 45
objectives:
  - 'Acceder a los campos de una estructura a través de un puntero con el operador `->`.'
  - 'Recorrer un arreglo con aritmética de punteros, usando el puntero uno después del final como límite.'
  - 'Pasar funciones como argumentos: un criterio propio y una comparadora para `qsort`.'
requirements:
  - 'La estructura es `typedef struct { char nombre[20]; int nota; } Alumno;` y los datos son `{"Ana", 7}, {"Bruno", 5}, {"Carla", 9}, {"Diego", 5}, {"Elena", 8}` en un arreglo local de `main`.'
  - '`void mostrar(const Alumno *a)` imprime `nombre: nota` usando `->`.'
  - '`void subir_nota(Alumno *a, int puntos)` suma los puntos sin pasar de 10; `main` la usa para subir 3 puntos a Bruno.'
  - '`double promedio(const Alumno *inicio, const Alumno *fin)` recorre con un puntero desde `inicio` hasta `fin` (uno después del último alumno, sin desreferenciarlo) y divide por `fin - inicio`.'
  - '`size_t contar_si(const Alumno *grupo, size_t n, bool (*criterio)(const Alumno *))` cuenta los alumnos que cumplen el criterio; `main` la llama con una función `aprobado` (nota 6 o más).'
  - '`int comparar_por_nota(const void *a, const void *b)` ordena por nota de mayor a menor y, si empatan, por nombre en orden alfabético con `strcmp`; el ranking se obtiene con `qsort`.'
  - 'La salida coincide exactamente con la de ejemplo.'
  - 'Compila sin advertencias con `gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa`.'
exampleOutput: |
  === Planilla ===
  Ana: 7
  Bruno: 5
  Carla: 9
  Diego: 5
  Elena: 8
  Bruno sube 3 puntos: 8
  Promedio: 7.40
  Aprobados: 4 de 5
  === Ranking ===
  1. Carla: 9
  2. Bruno: 8
  3. Elena: 8
  4. Ana: 7
  5. Diego: 5
extensionChallenges:
  - 'Agrega un segundo criterio, `bool destacado(const Alumno *a)` (nota 9 o más), y muestra cuántos alumnos lo cumplen sin modificar `contar_si`.'
  - 'Escribe `void buscar_mejor(const Alumno *grupo, size_t n, const Alumno **mejor)` que deje en `*mejor` la dirección del alumno con nota más alta (o `NULL` si `n` es 0). Explica en un comentario por qué hace falta un puntero doble.'
deliveryTips:
  - 'En la comparadora, convierte primero los `const void *` a `const Alumno *` en variables locales; después compara con `->`.'
  - 'Para el promedio, convierte la suma a `double` antes de dividir: si divides dos enteros, pierdes los decimales.'
  - 'Calcula `fin` en `main` como `grupo + n`, donde `n` sale de `sizeof grupo / sizeof grupo[0]`, que funciona porque ahí `grupo` todavía es un arreglo.'
---

## Contexto

En la lección viste que pasar un arreglo a una función es pasar un puntero, que `p->campo` equivale a `(*p).campo` y que una función también puede recibir otra función como argumento. En este proyecto juntas esas tres ideas en una planilla de alumnos.

Las funciones trabajan siempre sobre los alumnos **originales** a través de punteros: no copian estructuras. Por eso las que solo leen reciben `const Alumno *` y las que modifican reciben `Alumno *`.

## Consigna

1. Escribe `programa.c` con la estructura `Alumno` y las funciones de los requisitos. Este esqueleto muestra la firma de `main` y el orden de las salidas:

   ```c
   #include <stdio.h>
   #include <stdlib.h>
   #include <string.h>

   typedef struct {
       char nombre[20];
       int nota;
   } Alumno;

   /* mostrar, subir_nota, promedio, aprobado, contar_si y comparar_por_nota */

   int main(void) {
       Alumno grupo[] = {{"Ana", 7}, {"Bruno", 5}, {"Carla", 9}, {"Diego", 5}, {"Elena", 8}};
       size_t n = sizeof grupo / sizeof grupo[0];

       /* 1. mostrar la planilla
          2. subir 3 puntos a Bruno
          3. promedio y aprobados
          4. ordenar con qsort y mostrar el ranking */
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ./programa
   ```

3. Compara tu salida con la de ejemplo. Observa el empate entre Bruno y Elena: el ranking los muestra en orden alfabético porque así lo decide tu comparadora.

## Criterios de evaluación

- [ ] La salida coincide exactamente con la de ejemplo.
- [ ] Los campos se acceden con `->` dentro de las funciones que reciben punteros.
- [ ] `promedio` recorre con aritmética de punteros y nunca desreferencia `fin`.
- [ ] `contar_si` no conoce el criterio: lo recibe como puntero a función.
- [ ] La comparadora devuelve negativo, cero o positivo según el orden pedido, incluido el desempate por nombre.
- [ ] Las funciones que solo leen usan `const`.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
