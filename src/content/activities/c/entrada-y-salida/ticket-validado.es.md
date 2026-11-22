---
course: 'c'
lesson: 'entrada-y-salida'
slug: 'ticket-validado'
title: 'Ticket de compra con entrada validada'
description: 'Programa que lee un precio, una cantidad y la inicial del cliente, valida cada lectura con el valor de retorno de scanf y muestra un ticket con columnas alineadas.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 35
objectives:
  - 'Leer valores de distintos tipos con el especificador correcto de scanf.'
  - 'Validar cada lectura comparando el valor de retorno de scanf.'
  - 'Dar formato a la salida con ancho de campo, alineación y precisión.'
requirements:
  - 'El precio se lee en una variable double con %lf, la cantidad en un int con %d y la inicial en un char con " %c" (con el espacio delante).'
  - 'Cada scanf se compara con 1. Si falla la lectura del precio, el programa muestra Error: precio inválido. y termina con return 1; lo mismo con Error: cantidad inválida. y Error: inicial inválida.'
  - 'Todas las variables se inicializan al declararse.'
  - 'El ticket tiene cuatro filas con la etiqueta alineada a la izquierda en 10 caracteres (%-10s) y el valor alineado a la derecha en 12 (%12c, %12.2f y %12d), entre dos líneas de 24 guiones.'
  - 'El total se calcula como precio * cantidad y se muestra con dos decimales.'
  - 'La salida coincide exactamente con la del ejemplo para las entradas 1250.5, 3 y m.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa
  Precio unitario: 1250.5
  Cantidad: 3
  Inicial del cliente: m
  ------------------------
  Cliente               m
  Precio          1250.50
  Cantidad              3
  Total           3751.50
  ------------------------
  $ ./programa
  Precio unitario: abc
  Error: precio inválido.
  $ echo $?
  1
extensionChallenges:
  - 'Si la lectura de la cantidad falla, descarta el resto de la línea con un ciclo de getchar y da una segunda oportunidad antes de terminar con return 1.'
  - 'Agrega una fila IVA (21 %) y una fila Total final, sin romper la alineación de las columnas.'
deliveryTips:
  - 'Antes de ejecutar, cuenta los caracteres de cada fila: 10 de la etiqueta, 1 espacio y 12 del valor.'
  - 'Prueba también con 7, Enter y una letra: sin el espacio en " %c", la inicial sería el salto de línea que dejó el Enter.'
---

## Contexto

Un programa que confía ciegamente en lo que escribe el usuario termina trabajando con datos que nunca se leyeron. La forma profesional de leer con `scanf` es mirar siempre lo que devuelve.

En este proyecto vas a combinar las dos mitades de la lección: leer y validar la entrada, y mostrar un resultado prolijo con columnas alineadas.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   int main(void) {
       double precio = 0.0;
       int cantidad = 0;
       char inicial = ' ';

       printf("Precio unitario: ");
       if (scanf("%lf", &precio) != 1) {
           printf("Error: precio inválido.\n");
           return 1;
       }
       // lee y valida la cantidad y la inicial

       printf("------------------------\n");
       printf("%-10s %12c\n", "Cliente", inicial);
       // muestra precio, cantidad y total
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Ejecuta con las entradas del ejemplo y compara. Prueba también una entrada inválida en cada lectura y comprueba con `echo $?` que el estado de salida es 1.

## Criterios de evaluación

- [ ] La salida coincide exactamente con la de ejemplo para las entradas 1250.5, 3 y m.
- [ ] Cada `scanf` se valida y una entrada inválida termina con el mensaje indicado y estado 1.
- [ ] Cada tipo usa su especificador (`%lf` para leer el `double`, `%f` para mostrarlo).
- [ ] Las columnas quedan alineadas con ancho de campo, sin espacios escritos a mano.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
