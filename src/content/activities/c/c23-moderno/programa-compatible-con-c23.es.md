---
course: 'c'
lesson: 'c23-moderno'
slug: 'programa-compatible-con-c23'
title: 'Un programa que usa C23 y compila sin él'
description: 'Programa de control de lotes que usa constexpr, nullptr, atributos y aritmética verificada cuando el compilador es C23 y conserva una alternativa equivalente para estándares anteriores.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 40
objectives:
  - 'Usar varias novedades de C23 en un mismo programa: constexpr, nullptr, [[nodiscard]] y <stdckdint.h>.'
  - 'Detectar el estándar activo con __STDC_VERSION__ y escribir una alternativa equivalente para compiladores anteriores.'
  - 'Comprobar que el programa produce el mismo resultado con -std=c23 y con -std=c11.'
requirements:
  - 'Una macro ESTANDAR vale "C23" cuando __STDC_VERSION__ >= 202311L y "anterior a C23" en caso contrario.'
  - 'El límite 100 es un constexpr int LIMITE en C23 y un #define en el caso alternativo.'
  - 'La función sumar_seguro(int a, int b, int *resultado) devuelve bool: usa ckd_add en C23 y una comprobación manual con INT_MAX e INT_MIN en el caso alternativo. En C23 lleva el atributo [[nodiscard]]; en el otro caso, una macro vacía.'
  - 'El programa suma los lotes {40, 35, 20, 0, 0} con sumar_seguro, informa si el total está dentro del límite y comprueba que INT_MAX + 1 se detecta como desborde.'
  - 'Un puntero vacío se inicializa con nullptr en C23 y con NULL en el caso alternativo, y se compara con la misma constante.'
  - 'Compila sin advertencias con -std=c23 y también con -std=c11, y la salida es la del ejemplo salvo la línea del estándar.'
exampleOutput: |
  $ gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
  $ ./programa
  Estándar: C23
  Límite: 100
  Total de 5 lotes: 95
  Total dentro del límite: sí
  Suma 2147483647 + 1: desborde detectado
  Puntero vacío: sí
  $ gcc -std=c11 -Wall -Wextra -Wpedantic programa.c -o programa11
  $ ./programa11
  Estándar: anterior a C23
  Límite: 100
  Total de 5 lotes: 95
  Total dentro del límite: sí
  Suma 2147483647 + 1: desborde detectado
  Puntero vacío: sí
extensionChallenges:
  - 'Agrega una función que use typeof para intercambiar dos valores de cualquier tipo y una alternativa con __typeof__ para C17.'
  - 'Usa [[maybe_unused]] en un parámetro que solo se usa en una de las dos ramas y comprueba que desaparece la advertencia.'
deliveryTips:
  - 'Agrupa todo lo que depende del estándar en un solo bloque #if al principio del archivo, para que el resto del programa no lo mencione.'
  - 'En la comprobación manual, compara contra INT_MAX - b antes de sumar: calcular a + b primero ya es comportamiento indefinido si desborda.'
  - 'En el caso alternativo necesitas incluir <stdbool.h>; en C23 bool es una palabra clave y no hace falta.'
---

## Contexto

Los equipos no siempre pueden elegir el compilador: una librería nueva puede estar en C23 mientras el sistema de integración todavía compila con C11. La solución habitual es escribir el código para el estándar nuevo y dejar una **alternativa** para el anterior, elegida con el preprocesador.

Este programa controla cuántas unidades hay en una serie de lotes. Usa lo mejor de C23 y sigue funcionando sin él.

## Consigna

1. Escribe `programa.c` con este orden: los `#include` comunes (`<limits.h>` y `<stdio.h>`), un bloque `#if __STDC_VERSION__ >= 202311L ... #else ... #endif` que defina `ESTANDAR`, `NADA`, `NODISCARD` y `LIMITE` y, solo cuando haga falta, incluya `<stdckdint.h>` o `<stdbool.h>`, y luego el resto del programa:

   ```c
   #include <limits.h>
   #include <stdio.h>

   #if __STDC_VERSION__ >= 202311L
   // C23: ESTANDAR, NADA (nullptr), NODISCARD ([[nodiscard]]) y constexpr int LIMITE
   #else
   // alternativa: ESTANDAR, NADA (NULL), NODISCARD vacío y #define LIMITE
   #endif

   NODISCARD static bool sumar_seguro(int a, int b, int *resultado) {
       // ckd_add en C23; comprobación manual en la alternativa
   }

   int main(void) {
       // suma los lotes, prueba INT_MAX + 1 y muestra el informe
       return 0;
   }
   ```

2. Compila con las dos opciones. El programa debe **compilar sin advertencias** en ambos casos:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   gcc -std=c11 -Wall -Wextra -Wpedantic programa.c -o programa11
   ```

3. Ejecuta los dos binarios y compara: solo la línea `Estándar:` debe cambiar. Si tu compilador no tiene `<stdckdint.h>`, puedes verificar la rama alternativa con `-std=c11` y revisar la de C23 con la documentación; indica en un comentario cuál no pudiste ejecutar.

## Criterios de evaluación

- [ ] La salida con `-std=c23` coincide con el ejemplo, y con `-std=c11` coincide salvo la línea del estándar.
- [ ] Ninguna rama usa una característica del otro estándar: nada de `constexpr`, `nullptr` ni `ckd_add` fuera del bloque de C23.
- [ ] `sumar_seguro` detecta el desborde de `INT_MAX + 1` sin ejecutar nunca una suma que desborda.
- [ ] Compila sin advertencias con `-Wall -Wextra -Wpedantic` en los dos estándares.
- [ ] Todo lo que depende del estándar está agrupado en un solo bloque `#if` al principio.
