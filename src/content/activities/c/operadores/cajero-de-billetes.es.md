---
course: 'c'
lesson: 'operadores'
slug: 'cajero-de-billetes'
title: 'Cajero automático: desglose de billetes'
description: 'Programa que lee un monto y calcula cuántos billetes de cada valor entrega un cajero usando división entera, resto y asignación compuesta, y evalúa con operadores lógicos si el monto es válido.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 35
objectives:
  - 'Usar la división entera y el operador resto para descomponer una cantidad.'
  - 'Actualizar una variable con asignación compuesta (%=).'
  - 'Combinar condiciones con && y operadores relacionales, y mostrar su resultado 1 o 0.'
requirements:
  - 'El monto se lee en un int y se valida con if (scanf("%d", &monto) != 1); ante una entrada inválida se muestra Error: se esperaba un número entero. y el programa termina con return 1.'
  - 'Una variable resto empieza con el monto; para cada billete (1000, 500, 100, 50 y 10) se muestra resto / valor y después se actualiza con resto %= valor.'
  - 'La línea Resto sin entregar muestra lo que queda después del billete de 10.'
  - 'La línea Monto válido muestra el valor de una sola expresión que combina con && tres condiciones: el monto está entre 100 y 50000, ambos incluidos, y es múltiplo de 10.'
  - 'El programa no usa if, salvo para validar la lectura, ni el operador ternario.'
  - 'La salida coincide exactamente con la del ejemplo para 3780 y para 125.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa
  Monto a retirar: 3780
  Billetes de 1000: 3
  Billetes de 500: 1
  Billetes de 100: 2
  Billetes de 50: 1
  Billetes de 10: 3
  Resto sin entregar: 0
  Monto válido: 1
  $ ./programa
  Monto a retirar: 125
  Billetes de 1000: 0
  Billetes de 500: 0
  Billetes de 100: 1
  Billetes de 50: 0
  Billetes de 10: 2
  Resto sin entregar: 5
  Monto válido: 0
extensionChallenges:
  - 'Define los valores de los billetes con #define y comprueba que cambiar uno (por ejemplo, 200 en lugar de 500) solo requiere editar una línea.'
  - 'Agrega la línea Total de billetes con la suma de todas las cantidades, calculada sin volver a dividir.'
deliveryTips:
  - 'Verifica a mano la identidad (monto / 1000) * 1000 + monto % 1000 == monto para el primer paso: es la garantía del lenguaje que hace funcionar el desglose.'
  - 'Recuerda la precedencia: monto % 10 == 0 ya se agrupa como (monto % 10) == 0, pero los paréntesis lo hacen más legible.'
---

## Contexto

Un cajero automático no entrega "3780 pesos": entrega una cantidad de billetes de cada valor. Calcular ese desglose es un uso clásico de la división entera y el resto: la división dice cuántos billetes caben y el resto dice cuánto falta repartir.

En este proyecto no necesitas decisiones ni ciclos: todo se resuelve con operadores. Hasta la pregunta "¿el monto es válido?" se responde con una expresión lógica que vale 1 o 0.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   int main(void) {
       int monto = 0;
       int resto = 0;

       printf("Monto a retirar: ");
       if (scanf("%d", &monto) != 1) {
           printf("Error: se esperaba un número entero.\n");
           return 1;
       }
       resto = monto;
       printf("Billetes de 1000: %d\n", resto / 1000);
       resto %= 1000;
       // continúa con 500, 100, 50 y 10

       // muestra el resto y la validez del monto
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Ejecuta con 3780 y con 125 y compara con la salida de ejemplo. Prueba también con 50000 (válido) y con 50010 (no válido).

## Criterios de evaluación

- [ ] La salida coincide exactamente con la de ejemplo para 3780 y 125.
- [ ] El desglose usa `/` y `%=` sobre una sola variable `resto`, sin restas escritas a mano.
- [ ] La validez es una única expresión con `&&`, con los límites incluidos.
- [ ] La entrada no numérica se rechaza con el mensaje indicado y estado 1.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
