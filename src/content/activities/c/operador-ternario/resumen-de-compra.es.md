---
course: 'c'
lesson: 'operador-ternario'
slug: 'resumen-de-compra'
title: 'Resumen de compra con decisiones ternarias'
description: 'Programa que arma el resumen de una compra y toma todas sus decisiones simples (descuento, envío, plural, medio de pago, cuotas) con el operador ternario.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 30
objectives:
  - 'Usar el operador ternario para elegir entre dos valores y guardar el resultado en una variable.'
  - 'Usar el ternario como argumento de printf para elegir un texto.'
  - 'Reconocer cuándo una decisión es lo bastante simple para un ternario.'
requirements:
  - 'Los datos de la compra son variables int inicializadas en el código: cantidad = 3, precioUnitario = 1800, esSocio = 1 y pagaConTarjeta = 1.'
  - 'El descuento se calcula con un ternario: si esSocio vale 1, es subtotal / 10; si no, 0.'
  - 'El envío se calcula con un ternario sobre el importe con descuento: 0 si es 4000 o más, 800 si es menor.'
  - 'printf usa ternarios para elegir artículo o artículos según la cantidad, gratis o con cargo según el envío, tarjeta o efectivo según pagaConTarjeta, y sí o no para las cuotas (solo con tarjeta y un total de 4000 o más).'
  - 'El programa no usa ninguna sentencia if: todas las decisiones son ternarios (al menos seis).'
  - 'La salida coincide exactamente con la de ejemplo para los datos dados.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  === Resumen de compra ===
  Pedido: 3 artículos
  Subtotal: 5400
  Descuento de socio: 540
  Envío: 0 (gratis)
  Total: 4860
  Medio de pago: tarjeta
  Cuotas sin interés: sí
extensionChallenges:
  - 'Agrega una variable esFeriado y un recargo de 200 en el envío los feriados, otra vez con un ternario. Decide si sigue siendo legible o si conviene un if-else, y justifica tu decisión en un comentario.'
  - 'Calcula con un ternario el mayor entre precioUnitario y un segundo precio, y muéstralo.'
deliveryTips:
  - 'Lee cada ternario en voz alta: si la condición es verdadera, este valor; si es falsa, este otro.'
  - 'Calcula primero el importe con descuento en su propia variable: así la condición del envío queda corta y clara.'
---

## Contexto

Muchas decisiones de un programa real son simples: elegir un número u otro, una palabra u otra. Para esas decisiones, el operador ternario permite escribir la idea en una sola expresión que produce un valor.

En este proyecto armas el resumen de una compra en el que **todas** las decisiones son de ese tipo, así que puedes resolverlas sin ningún `if`.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   int main(void) {
       int cantidad = 3;
       int precioUnitario = 1800;
       int esSocio = 1;
       int pagaConTarjeta = 1;

       int subtotal = cantidad * precioUnitario;
       // descuento, importe con descuento, envío y total con ternarios

       printf("=== Resumen de compra ===\n");
       printf("Pedido: %d %s\n", cantidad, cantidad == 1 ? "artículo" : "artículos");
       // completa el resto de las líneas

       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Verifica la salida con los datos dados. Después cambia los datos a `cantidad = 1`, `esSocio = 0` y `pagaConTarjeta = 0`: la salida debe ser `Pedido: 1 artículo`, `Subtotal: 1800`, `Descuento de socio: 0`, `Envío: 800 (con cargo)`, `Total: 2600`, `Medio de pago: efectivo` y `Cuotas sin interés: no`.

## Criterios de evaluación

- [ ] La salida coincide con la de ejemplo y con la del segundo juego de datos.
- [ ] Hay al menos seis ternarios y ninguna sentencia `if`.
- [ ] Cada ternario tiene una condición corta y legible.
- [ ] Ningún resultado está escrito a mano: todos salen de las variables.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
