---
course: 'c'
lesson: 'sentencia-do-while'
slug: 'billetera-con-menu'
title: 'Billetera con menú repetitivo'
description: 'Programa de consola que muestra un menú con do-while hasta que el usuario elige salir, y permite depositar, retirar y consultar un saldo validando cada operación.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 45
objectives:
  - 'Usar do-while para un menú que debe mostrarse al menos una vez y repetirse hasta que el usuario elige salir.'
  - 'Combinar un switch dentro del ciclo para despachar cada opción.'
  - 'Mantener y validar un estado (el saldo) a lo largo de muchas iteraciones.'
requirements:
  - 'El menú se muestra con un ciclo do-while cuya condición es opcion != 0; no se usa while ni for para repetirlo.'
  - 'Cada iteración muestra la línea de menú [1] Depositar  [2] Retirar  [3] Ver saldo  [0] Salir (con dos espacios entre opciones) y pide Opción: .'
  - 'Cada scanf comprueba que devuelve 1; si falla, el programa muestra Entrada inválida y termina con return 1;.'
  - 'Un switch dentro del ciclo resuelve las opciones. Depositar y retirar piden Monto: y rechazan montos menores o iguales a 0 con El monto debe ser positivo.'
  - 'Un retiro mayor que el saldo no se realiza y muestra Saldo insuficiente. Saldo: seguido del saldo actual.'
  - 'Una opción que no existe muestra Opción inválida y el menú se vuelve a mostrar.'
  - 'Al salir, el programa muestra Hasta luego., la cantidad de operaciones realizadas con éxito (depósitos y retiros) y el saldo final.'
  - 'Con las entradas 1, 5000, 2, 7000, 2, 1500, 7, 3 y 0, la salida coincide exactamente con la de ejemplo.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  === Billetera ===
  [1] Depositar  [2] Retirar  [3] Ver saldo  [0] Salir
  Opción: 1
  Monto: 5000
  Depósito realizado. Saldo: 5000
  [1] Depositar  [2] Retirar  [3] Ver saldo  [0] Salir
  Opción: 2
  Monto: 7000
  Saldo insuficiente. Saldo: 5000
  [1] Depositar  [2] Retirar  [3] Ver saldo  [0] Salir
  Opción: 2
  Monto: 1500
  Retiro realizado. Saldo: 3500
  [1] Depositar  [2] Retirar  [3] Ver saldo  [0] Salir
  Opción: 7
  Opción inválida
  [1] Depositar  [2] Retirar  [3] Ver saldo  [0] Salir
  Opción: 3
  Saldo actual: 3500
  [1] Depositar  [2] Retirar  [3] Ver saldo  [0] Salir
  Opción: 0
  Hasta luego.
  Operaciones realizadas: 2
  Saldo final: 3500
extensionChallenges:
  - 'Agrega la opción 4, Ver cantidad de operaciones, sin cambiar la condición del ciclo.'
  - 'Pon un límite de 10000 por retiro y muestra Supera el límite por operación cuando se exceda.'
deliveryTips:
  - 'Los case 1 y 2 comparten la lectura del monto: puedes agruparlos y decidir dentro con un if según la opción.'
  - 'Prueba el programa escribiendo todas las entradas de una vez, por ejemplo con printf "1\n5000\n2\n7000\n2\n1500\n7\n3\n0\n" | ./programa. En ese caso los números que escribes no se ven en la salida.'
---

## Contexto

Un menú de consola tiene una forma fija: mostrar las opciones, leer una, hacer lo que corresponde y volver a empezar, hasta que el usuario elige salir. Como el menú tiene que aparecer al menos una vez, `do-while` es la estructura natural: la decisión de repetir se toma al final, después de procesar la opción.

La billetera agrega un estado que vive a lo largo de todas las iteraciones: el saldo. Cada operación debe dejarlo en un valor válido.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   int main(void) {
       int opcion;
       int monto;
       int saldo = 0;
       int operaciones = 0;

       printf("=== Billetera ===\n");
       do {
           printf("[1] Depositar  [2] Retirar  [3] Ver saldo  [0] Salir\n");
           printf("Opción: ");
           if (scanf("%d", &opcion) != 1) {
               printf("Entrada inválida\n");
               return 1;
           }

           switch (opcion) {
               // casos 1 y 2: leer y validar el monto, depositar o retirar
               // caso 3: mostrar el saldo
               // caso 0: despedirse
               // default: opción inválida
           }
       } while (opcion != 0);

       // muestra operaciones realizadas y saldo final
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Ejecuta el programa con la secuencia de entradas del ejemplo y compara la salida. Prueba también un monto negativo y una letra en lugar de un número.

## Criterios de evaluación

- [ ] La salida para la secuencia de ejemplo coincide exactamente.
- [ ] El menú se repite con `do-while` y la única forma normal de salir es la opción 0.
- [ ] El saldo nunca queda negativo y los montos no positivos se rechazan.
- [ ] Solo se cuentan las operaciones realizadas con éxito.
- [ ] Una entrada no numérica termina el programa con `Entrada inválida` y código 1.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
