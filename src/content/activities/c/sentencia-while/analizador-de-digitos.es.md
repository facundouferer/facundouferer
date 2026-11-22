---
course: 'c'
lesson: 'sentencia-while'
slug: 'analizador-de-digitos'
title: 'Analizador de dígitos'
description: 'Programa que lee un entero y, con un ciclo while que separa sus dígitos uno por uno, cuenta cuántos tiene, los suma, construye el número invertido y decide si es capicúa.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 40
objectives:
  - 'Diseñar un ciclo while a partir de su estado inicial, su condición de continuación y su actualización.'
  - 'Usar % 10 y / 10 para recorrer los dígitos de un entero cuando no se sabe de antemano cuántos tiene.'
  - 'Acumular varios resultados en la misma iteración y tratar el caso borde del número 0.'
requirements:
  - 'Lee el número con el mensaje Número entero no negativo: y comprueba que scanf devuelve 1; si no, muestra Entrada inválida y termina con return 1;.'
  - 'Si el número es menor que 0 o mayor que 999999999, muestra El número debe estar entre 0 y 999999999 y termina con return 1;.'
  - 'Un único ciclo while trabaja sobre una copia del número (por ejemplo, resto) y en cada iteración toma el último dígito con % 10, actualiza la cantidad de dígitos, la suma y el número invertido, y descarta ese dígito con / 10.'
  - 'El número original no se modifica, porque se necesita al final para compararlo con el invertido.'
  - 'El número 0 se informa con 1 dígito, suma 0 e invertido 0.'
  - 'La última línea indica si el número es capicúa (se lee igual al derecho y al revés) con sí o no.'
  - 'La salida respeta el formato exacto del ejemplo.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa
  Número entero no negativo: 40719
  Cantidad de dígitos: 5
  Suma de dígitos: 21
  Número invertido: 91704
  ¿Es capicúa?: no
  $ ./programa
  Número entero no negativo: 12321
  Cantidad de dígitos: 5
  Suma de dígitos: 9
  Número invertido: 12321
  ¿Es capicúa?: sí
  $ ./programa
  Número entero no negativo: 0
  Cantidad de dígitos: 1
  Suma de dígitos: 0
  Número invertido: 0
  ¿Es capicúa?: sí
extensionChallenges:
  - 'Agrega el conteo de dígitos pares e impares dentro del mismo ciclo, sin agregar otro while.'
  - 'Escribe en un comentario la traza de resto, digitos, suma e invertido para la entrada 407, iteración por iteración.'
deliveryTips:
  - 'Antes de programar, haz en papel la traza de 40719: resto pasa por 40719, 4071, 407, 40, 4 y 0. ¿Cuántas iteraciones hay?'
  - 'El límite de 999999999 existe porque el número invertido debe entrar en un int: invertir un número de diez dígitos puede superar el máximo de int.'
  - 'Construye el invertido así: invertido = invertido * 10 + ultimo.'
---

## Contexto

No sabes cuántos dígitos tiene un número hasta que lo recorres. Ese es el terreno de `while`: repetir mientras quede algo por procesar. Con `% 10` obtienes el último dígito y con `/ 10` lo descartas; cuando el número llega a 0, ya no quedan dígitos.

En cada iteración vas a actualizar varias variables a la vez. Esa es la habilidad central del proyecto: saber en todo momento cuál es el estado del ciclo.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   int main(void) {
       int numero;
       int resto;
       int digitos = 0;
       int suma = 0;
       int invertido = 0;

       printf("Número entero no negativo: ");
       if (scanf("%d", &numero) != 1) {
           printf("Entrada inválida\n");
           return 1;
       }
       // valida el rango

       resto = numero;
       // trata el caso del 0

       while (resto > 0) {
           // toma el último dígito, actualiza digitos, suma e invertido
           // descarta el último dígito
       }

       // muestra los cuatro resultados
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Prueba al menos las entradas del ejemplo, un número negativo y un texto.

## Criterios de evaluación

- [ ] Las tres ejecuciones de ejemplo producen exactamente la salida mostrada.
- [ ] Un solo `while` calcula los cuatro resultados y su actualización garantiza que termina.
- [ ] El caso del 0 y las entradas inválidas están resueltos.
- [ ] El número original no se pierde.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
