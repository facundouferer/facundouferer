---
course: 'c'
lesson: 'variables-y-constantes'
slug: 'ticket-de-cafeteria'
title: 'Ticket de cafetería con constantes'
description: 'Programa que arma el ticket de una mesa con variables inicializadas, constantes con const y #define, y una reasignación que actualiza el pedido.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 30
objectives:
  - 'Declarar e inicializar variables de tipo int y char con nombres claros.'
  - 'Reemplazar números mágicos por constantes con const y con #define.'
  - 'Distinguir la inicialización de una asignación posterior.'
requirements:
  - 'Los precios son constantes con const: PRECIO_CAFE vale 1200 y PRECIO_MEDIALUNA vale 450.'
  - 'El nombre del local ("Cafetería La Esquina") y el descuento fijo (500) son macros con #define: NOMBRE_LOCAL y DESCUENTO_FIJO.'
  - 'Las variables mesa (7), turno (el carácter M), cafes (3), medialunas (4) y subtotal (0) se inicializan en su declaración; ninguna variable se lee sin inicializar.'
  - 'Después del primer subtotal, el programa agrega un café con una asignación a la misma variable cafes (no con una variable nueva) y recalcula el subtotal.'
  - 'Ningún precio ni cantidad aparece escrito como número suelto en los printf: todos salen de variables, constantes o macros.'
  - 'La salida coincide exactamente con la del ejemplo.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa
  === Cafetería La Esquina ===
  Mesa: 7
  Turno: M
  Cafés: 3 x 1200 = 3600
  Medialunas: 4 x 450 = 1800
  Subtotal: 5400
  Se agrega 1 café más.
  Cafés: 4 x 1200 = 4800
  Subtotal: 6600
  Descuento fijo: 500
  Total a pagar: 6100
extensionChallenges:
  - 'Agrega una constante const double con el peso de un café en kilogramos (0.25) y muestra el peso total del pedido con %f.'
  - 'Cambia DESCUENTO_FIJO a 450 + 50 sin paréntesis y explica por qué el total podría cambiar si la macro se usara dentro de una multiplicación.'
deliveryTips:
  - 'Para mostrar una macro de texto con printf puedes usar %s: printf("=== %s ===\n", NOMBRE_LOCAL);.'
  - 'Si el compilador avisa que una variable se usa sin inicializar, no es un detalle: corrígelo antes de seguir.'
---

## Contexto

Un ticket es un buen ejemplo de por qué conviene nombrar los datos: los precios no cambian durante la ejecución (son constantes), mientras que la cantidad de cafés sí puede cambiar si el cliente pide otro (es una variable).

En este proyecto vas a armar el ticket de una mesa sin leer datos del teclado: todos los valores están en el programa, pero cada uno tiene un nombre y un tipo adecuados.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   #define NOMBRE_LOCAL "Cafetería La Esquina"
   // define DESCUENTO_FIJO

   int main(void) {
       const int PRECIO_CAFE = 1200;
       // declara e inicializa las demás constantes y variables

       printf("=== %s ===\n", NOMBRE_LOCAL);
       // muestra la mesa, el turno, cada línea del pedido y el subtotal

       // agrega un café con una asignación y recalcula el subtotal

       // muestra el descuento y el total
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Ejecuta y compara con la salida de ejemplo. Después cambia el precio del café a 1300 en un solo lugar y comprueba que todo el ticket se actualiza (el total pasa a 6500).

## Criterios de evaluación

- [ ] La salida coincide exactamente con la de ejemplo.
- [ ] Cambiar un precio requiere editar una sola línea.
- [ ] Todas las variables se inicializan al declararse y `cafes` se actualiza con una asignación.
- [ ] Los precios usan `const` y el nombre del local y el descuento usan `#define`.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
