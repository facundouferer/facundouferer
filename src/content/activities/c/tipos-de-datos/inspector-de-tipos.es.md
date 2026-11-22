---
course: 'c'
lesson: 'tipos-de-datos'
slug: 'inspector-de-tipos'
title: 'Inspector de tipos de tu máquina'
description: 'Programa que informa los tamaños y límites reales de los tipos básicos con sizeof y <limits.h>, y demuestra la división entera, el cast, la conversión a bool y la vuelta de un unsigned.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 35
objectives:
  - 'Consultar tamaños con sizeof y mostrarlos correctamente con %zu.'
  - 'Distinguir los rangos que garantiza el estándar de los límites reales de la máquina.'
  - 'Predecir conversiones implícitas y escribir conversiones explícitas con un cast.'
  - 'Diferenciar el desbordamiento sin signo (definido) del desbordamiento con signo (indefinido).'
requirements:
  - 'Los tamaños de char, short, int, long long y double se obtienen con sizeof y se muestran con %zu; ningún tamaño está escrito a mano.'
  - 'Los límites se toman de <limits.h> (INT_MIN, INT_MAX, UINT_MAX y LLONG_MAX) y cada uno se muestra con su especificador: %d, %u o %lld.'
  - 'La línea de la división entera usa dos variables int (suma = 17 y cantidad = 4); la del cast usa (double)suma / cantidad y se muestra con %f.'
  - 'La línea (int)9.99 muestra el resultado de un cast explícito de double a int.'
  - 'Una variable bool inicializada con 25 se muestra con %d, sin incluir <stdbool.h> (C23).'
  - 'Una variable unsigned int que vale UINT_MAX recibe una asignación con + 1u y se muestra con %u.'
  - 'El programa no desborda ningún entero con signo.'
  - 'En Linux o macOS de 64 bits, la salida coincide exactamente con la del ejemplo; compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa
  === Inspector de tipos ===
  Tamaños en bytes:
  char: 1
  short: 2
  int: 4
  long long: 8
  double: 8
  Límites:
  int: de -2147483648 a 2147483647
  unsigned int: de 0 a 4294967295
  long long: hasta 9223372036854775807
  Conversiones:
  17 / 4 como enteros: 4
  17 / 4 con cast: 4.250000
  (int)9.99: 9
  bool de 25: 1
  UINT_MAX + 1u: 0
extensionChallenges:
  - 'Agrega long y long double a la tabla de tamaños y compara el resultado en Linux y en Windows (si tienes acceso a ambos).'
  - 'Agrega la línea -17 / 4 como enteros y explica por qué el resultado es -4 y no -5.'
deliveryTips:
  - 'Los tamaños y límites dependen de la plataforma: en Windows, por ejemplo, long mide 4 bytes. Si tu salida difiere del ejemplo solo por eso, explícalo en un comentario.'
  - 'Con -Wall, un especificador que no coincide con el tipo produce una advertencia: léela, te dice qué tipo esperaba.'
---

## Contexto

En C, el tamaño de un `int` no está escrito en piedra: el estándar garantiza mínimos y cada plataforma elige el tamaño real. Por eso un programador de C no memoriza números, los consulta.

En este proyecto vas a escribir una pequeña herramienta de diagnóstico que informe cómo son los tipos en tu máquina y que muestre, con ejemplos concretos, las conversiones que más errores causan.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>
   #include <limits.h>

   int main(void) {
       int suma = 17;
       int cantidad = 4;
       unsigned int vueltas = UINT_MAX;
       bool aprobado = 25;

       printf("=== Inspector de tipos ===\n");
       printf("Tamaños en bytes:\n");
       printf("char: %zu\n", sizeof(char));
       // completa los tamaños, los límites y las conversiones
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Ejecuta y compara con la salida de ejemplo. Antes de ejecutar, anota qué esperas en cada línea de la sección `Conversiones` y comprueba tus predicciones.

## Criterios de evaluación

- [ ] La salida coincide con la de ejemplo (o las diferencias se explican por la plataforma).
- [ ] Ningún tamaño ni límite está escrito a mano: todos salen de `sizeof` o de `<limits.h>`.
- [ ] Cada valor usa el especificador correcto (`%zu`, `%d`, `%u`, `%lld`, `%f`).
- [ ] El cast se aplica antes de dividir y no hay desbordamiento de enteros con signo.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
