---
course: 'c'
lesson: 'modularizacion-subprogramas-y-funciones'
slug: 'modulo-de-geometria'
title: 'Módulo de geometría en varios archivos'
description: 'Programa dividido en geometria.h, geometria.c y main.c que calcula medidas de un rectángulo con funciones, separa interfaz de implementación y se compila por partes antes de enlazar.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 45
objectives:
  - 'Separar la interfaz (.h con guardas de inclusión) de la implementación (.c).'
  - 'Escribir funciones con una sola responsabilidad que calculan y devuelven un valor.'
  - 'Compilar cada archivo por separado con -c y enlazar los objetos.'
  - 'Ocultar una función auxiliar con static.'
requirements:
  - 'geometria.h tiene guardas de inclusión (#ifndef GEOMETRIA_H, #define GEOMETRIA_H, #endif) y solo los prototipos de area_rectangulo, perimetro_rectangulo, diagonal_al_cuadrado y es_cuadrado; no contiene cuerpos de funciones.'
  - 'geometria.c incluye "geometria.h" y define las cuatro funciones; diagonal_al_cuadrado usa una función auxiliar static int cuadrado(int x) que no aparece en el encabezado.'
  - 'es_cuadrado devuelve un bool; ninguna función del módulo usa printf ni scanf.'
  - 'main.c lee base y altura en una sola lectura validada con != 2 y rechaza medidas que no sean positivas con Error: las medidas deben ser positivas. y return 1.'
  - 'Cada archivo .c se compila por separado con -c y los objetos se enlazan en el ejecutable geometria, como en la salida de ejemplo.'
  - 'La salida coincide exactamente con la del ejemplo para 6 4 y para 0 3.'
  - 'Cada archivo compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic.'
exampleOutput: |
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -c geometria.c
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -c main.c
  $ gcc geometria.o main.o -o geometria
  $ ./geometria
  Base y altura (enteros positivos): 6 4
  Área: 24
  Perímetro: 20
  Diagonal al cuadrado: 52
  ¿Es un cuadrado? no
  $ ./geometria
  Base y altura (enteros positivos): 0 3
  Error: las medidas deben ser positivas.
extensionChallenges:
  - 'Agrega al módulo int area_triangulo_doble(int base, int altura), que devuelve el doble del área para no perder decimales, y úsala desde main sin tocar las funciones existentes.'
  - 'Cambia solo geometria.c (por ejemplo, calcula el perímetro como base + base + altura + altura) y comprueba que basta con recompilar ese archivo y volver a enlazar.'
deliveryTips:
  - 'Si el enlazador informa undefined reference o Undefined symbols, revisa que el comando de enlazado reciba los dos .o.'
  - 'Para mostrar sí o no puedes usar el operador ternario: es_cuadrado(base, altura) ? "sí" : "no".'
---

## Contexto

Hasta ahora cada programa vivía en un único archivo. En proyectos reales, el código se reparte en módulos: un encabezado `.h` que dice **qué** ofrece el módulo y un `.c` que dice **cómo** lo hace. Quien usa el módulo solo necesita leer la interfaz.

En este proyecto vas a escribir un pequeño módulo de geometría y un `main.c` que lo usa, y vas a recorrer a mano el camino que ya conoces: compilar cada archivo a su objeto y enlazarlos.

## Consigna

1. Escribe `geometria.h`:

   ```c
   #ifndef GEOMETRIA_H
   #define GEOMETRIA_H

   int area_rectangulo(int base, int altura);
   // agrega los demás prototipos

   #endif
   ```

2. Escribe `geometria.c` con las definiciones, incluida la función auxiliar `static int cuadrado(int x)`.

3. Escribe `main.c`, que incluye `<stdio.h>` y `"geometria.h"`, lee y valida las medidas y muestra los resultados.

4. Compila cada archivo por separado y enlaza, como en la salida de ejemplo. Cada archivo debe **compilar sin advertencias**. Para comprobarlo de una sola vez también puedes usar el comando del curso con los dos fuentes (el equivalente de `gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa` para un proyecto de varios archivos):

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic main.c geometria.c -o geometria
   ```

5. Ejecuta con las entradas del ejemplo y compara. Prueba también con `5 5` (debe mostrar `¿Es un cuadrado? sí`) y con una entrada no numérica.

## Criterios de evaluación

- [ ] La salida coincide exactamente con la de ejemplo.
- [ ] `geometria.h` tiene guardas y solo prototipos; `cuadrado` es `static` y no figura en él.
- [ ] Las funciones del módulo calculan y devuelven valores, sin entrada ni salida.
- [ ] Los archivos se compilan por separado y se enlazan sin errores.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
