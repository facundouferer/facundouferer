---
course: 'c'
lesson: 'procesos-y-estados'
slug: 'traza-de-una-compra'
title: 'Traza de una compra paso a paso'
description: 'Diseña con refinamiento sucesivo un programa secuencial que calcula una compra y muestra cómo cambia el estado de sus variables después de cada acción.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 30
objectives:
  - 'Aplicar el refinamiento sucesivo antes de escribir código, de un esquema general a pasos concretos.'
  - 'Construir un proceso puramente secuencial donde cada acción modifica el estado.'
  - 'Hacer visible el estado intermedio después de cada acción y el estado final del proceso.'
requirements:
  - 'El programa declara siete variables int: precio, cantidad, subtotal, descuento, total, pago y vuelto.'
  - 'Las acciones se ejecutan en este orden: asignar precio = 1250; asignar cantidad = 3; calcular subtotal = precio * cantidad; calcular descuento = subtotal / 10; calcular total = subtotal - descuento; asignar pago = 5000 y calcular vuelto = pago - total.'
  - 'Después de cada paso, el programa muestra con printf el valor que acaba de cambiar, con el formato exacto de la salida de ejemplo.'
  - 'Al final muestra una línea Estado final con el valor de las siete variables.'
  - 'Ningún valor calculado se escribe a mano: subtotal, descuento, total y vuelto salen de operaciones sobre otras variables.'
  - 'Al principio del archivo, un comentario de varias líneas muestra los tres niveles de refinamiento que usaste para diseñar la solución.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  === Traza de una compra ===
  Paso 1: precio = 1250
  Paso 2: cantidad = 3
  Paso 3: subtotal = 3750
  Paso 4: descuento = 375
  Paso 5: total = 3375
  Paso 6: pago = 5000, vuelto = 1625
  Estado final: precio=1250 cantidad=3 subtotal=3750 descuento=375 total=3375 pago=5000 vuelto=1625
extensionChallenges:
  - 'Cambia cantidad = 3 por cantidad = 4 y predice en papel toda la traza antes de ejecutar. Después compara tu predicción con la salida.'
  - 'Mueve la línea que calcula subtotal debajo de la que calcula descuento. Compila, observa qué avisa el compilador y explica en un comentario por qué el orden de las acciones importa.'
deliveryTips:
  - 'Antes de programar, escribe en papel una tabla con una columna por variable y una fila por paso. Esa tabla es la traza que tu programa debe reproducir.'
  - 'Recuerda que la división entre dos int descarta la parte decimal: 3750 / 10 da 375.'
---

## Contexto

Un programa secuencial es un proceso: parte de un estado inicial, ejecuta acciones en orden y llega a un estado final. Lo difícil no es escribir cada línea, sino saber en todo momento qué valor tiene cada variable.

En este proyecto vas a hacer visible ese recorrido. El programa calcula una compra sencilla y, después de cada acción, muestra el valor que acaba de cambiar. Así la salida se convierte en la traza del proceso.

## Consigna

1. Diseña la solución con refinamiento sucesivo y escríbela como comentario al principio del archivo:
   - **Nivel 1:** preparar los datos, calcular el total, calcular el vuelto, mostrar el estado final.
   - **Nivel 2 y 3:** complétalos tú, hasta llegar a una acción por línea.
2. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   /*
      Nivel 1: preparar datos, calcular el total, calcular el vuelto, mostrar.
      Nivel 2: ...
      Nivel 3: ...
   */
   int main(void) {
       int precio;
       int cantidad;
       // declara aquí el resto de las variables

       printf("=== Traza de una compra ===\n");
       precio = 1250;
       printf("Paso 1: precio = %d\n", precio);

       // continúa la secuencia, un paso por vez

       return 0;
   }
   ```

3. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

4. Ejecuta `./programa` y verifica que cada línea coincide con la salida de ejemplo.

## Criterios de evaluación

- [ ] El comentario inicial muestra tres niveles de refinamiento coherentes con el código.
- [ ] Las acciones siguen el orden pedido y cada una cambia el estado de una sola variable (salvo el paso 6).
- [ ] La salida coincide exactamente con la de ejemplo.
- [ ] Ningún resultado está escrito a mano: todos salen de operaciones.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
