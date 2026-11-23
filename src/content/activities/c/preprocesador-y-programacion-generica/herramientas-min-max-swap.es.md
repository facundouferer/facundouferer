---
course: 'c'
lesson: 'preprocesador-y-programacion-generica'
slug: 'herramientas-min-max-swap'
title: 'Herramientas genéricas MIN, MAX y SWAP'
description: 'Un pequeño encabezado de macros genéricas con _Generic y typeof, comprobado con pruebas que evitan las trampas clásicas de las macros: paréntesis, doble evaluación y varias sentencias.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 45
objectives:
  - 'Construir macros genéricas MIN, MAX, SWAP y NOMBRE_TIPO con _Generic y typeof.'
  - 'Evitar las tres trampas de las macros: paréntesis, doble evaluación y varias sentencias.'
  - 'Escribir pruebas con assert que demuestran que cada trampa quedó resuelta.'
requirements:
  - 'MIN y MAX eligen con _Generic una función static inline para int, long y double (seis funciones en total) y evalúan cada argumento una sola vez.'
  - 'SWAP intercambia dos variables de cualquier tipo con typeof y se envuelve en do { ... } while (0), de modo que funciona dentro de un if sin llaves seguido de else.'
  - 'NOMBRE_TIPO devuelve "int", "long", "double", "char *" o "otro" según el tipo de la expresión.'
  - 'La función probar_trampas comprueba con assert que MAX(i++, 0) incrementa i una sola vez, que MIN(2 + 1, 5) * 2 vale 6 y que SWAP dentro de un if sin llaves seguido de else funciona.'
  - 'El programa muestra exactamente la salida del ejemplo y compila sin advertencias con -std=c23 -Wall -Wextra -Wpedantic.'
exampleOutput: |
  $ ./programa
  MIN(3, 7) = 3
  MAX(10, 7) = 10
  MAX(2.5, 1.5) = 2.5
  Tras SWAP: x = 7, y = 3, d1 = 1.5, d2 = 2.5
  Tipos: int, long, double, char *
  Pruebas de trampas: OK
extensionChallenges:
  - 'Agrega CLAMP(x, lo, hi) con las mismas garantías y pruebas.'
  - 'Haz que NOMBRE_TIPO distinga también float, char y unsigned int, y compruébalo con assert sobre strcmp.'
deliveryTips:
  - 'Elige la función con _Generic sobre (a) + (b): así una llamada con long e int usa la versión de long, igual que la aritmética del lenguaje.'
  - 'Dentro de _Generic, la expresión de control no se evalúa: solo se evalúan los argumentos de la llamada resultante, y eso es lo que garantiza la evaluación única.'
  - 'Recuerda que una constante de carácter como ''a'' tiene tipo int en C.'
---

## Contexto

Las macros son la herramienta más afilada del preprocesador: permiten escribir una sola operación para varios tipos, pero cada una de sus trampas produce errores silenciosos. Aquí vas a construir un pequeño kit de macros y, sobre todo, las **pruebas** que demuestran que cada trampa quedó resuelta.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <assert.h>
   #include <stdio.h>

   static inline int min_int(int a, int b) { return a < b ? a : b; }
   // min_long, min_double, max_int, max_long, max_double

   #define MIN(a, b) /* _Generic sobre (a) + (b) que elige min_int, min_long o min_double */
   #define MAX(a, b) /* igual con max_* */
   #define SWAP(a, b) /* do { ... } while (0) con typeof */
   #define NOMBRE_TIPO(x) /* _Generic con int, long, double, char * y default */

   static void probar_trampas(void) {
       // tres comprobaciones con assert
   }

   int main(void) {
       // muestra las líneas del ejemplo y llama a probar_trampas
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Ejecuta y compara con la salida de ejemplo. Para ver que las pruebas sirven, reemplaza temporalmente una macro por una versión sin paréntesis o sin `do { ... } while (0)` y confirma que un `assert` falla; luego restaura la versión correcta.

## Criterios de evaluación

- [ ] La salida coincide exactamente con la del ejemplo.
- [ ] Cada argumento de `MIN` y `MAX` se evalúa una sola vez (`MAX(i++, 0)` deja `i` incrementado en 1).
- [ ] `SWAP` funciona dentro de un `if` sin llaves seguido de `else`.
- [ ] `_Generic` elige las funciones y `NOMBRE_TIPO` reconoce los cinco casos.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
