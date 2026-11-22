---
course: 'c'
lesson: 'sentencia-switch-y-bloques-de-codigo'
slug: 'conversor-de-unidades'
title: 'Conversor de unidades con menú'
description: 'Programa de consola que muestra un menú, lee una opción y un valor, y elige la conversión con switch, break y default.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 35
objectives:
  - 'Elegir entre varias opciones concretas de una misma variable con switch.'
  - 'Usar break para cortar cada caso y default para manejar opciones inválidas.'
  - 'Organizar el flujo en bloques claros y terminar el programa con return cuando un dato no es válido.'
requirements:
  - 'El programa muestra el menú exacto de la salida de ejemplo, con las opciones 1 a 4.'
  - 'Lee la opción y el valor con scanf("%d", ...) y comprueba que cada lectura devuelve 1. Si alguna falla, muestra Entrada inválida y termina con return 1;.'
  - 'Un único switch sobre la opción resuelve las cuatro conversiones: km a m (por 1000), m a cm (por 100), kg a g (por 1000) y horas a minutos (por 60).'
  - 'Cada case termina con break; ningún caso cae en el siguiente.'
  - 'El caso default muestra Opción inválida y termina con return 1; sin mostrar Conversión terminada.'
  - 'Cuando la conversión es válida, el programa muestra el resultado con el formato del ejemplo y, después del switch, la línea Conversión terminada.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa
  === Conversor de unidades ===
  1. Kilómetros a metros
  2. Metros a centímetros
  3. Kilogramos a gramos
  4. Horas a minutos
  Opción: 3
  Valor: 2
  2 kg = 2000 g
  Conversión terminada.
  $ ./programa
  === Conversor de unidades ===
  1. Kilómetros a metros
  2. Metros a centímetros
  3. Kilogramos a gramos
  4. Horas a minutos
  Opción: 9
  Valor: 5
  Opción inválida
extensionChallenges:
  - 'Quita a propósito el break del case 1, ejecuta con la opción 1 y explica en un comentario qué se mostró y por qué.'
  - 'Agrega la opción 5, Minutos a segundos, sin modificar los otros casos.'
deliveryTips:
  - 'Escribe primero el switch con los cuatro case y el default vacíos, compila, y después completa cada caso.'
  - 'Mantén la misma sangría en todos los case: así se ve de un vistazo dónde termina cada uno.'
---

## Contexto

Los programas de consola suelen empezar con un menú: el usuario elige un número y el programa ejecuta la acción que corresponde. Comparar una sola variable con varios valores concretos es exactamente el problema que resuelve `switch`.

El conversor también te obliga a pensar en lo que pasa cuando el dato no es el esperado: una lectura que falla o una opción que no existe.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   int main(void) {
       int opcion;
       int valor;

       printf("=== Conversor de unidades ===\n");
       // muestra el resto del menú

       printf("Opción: ");
       if (scanf("%d", &opcion) != 1) {
           printf("Entrada inválida\n");
           return 1;
       }
       // lee y valida el valor

       switch (opcion) {
           case 1:
               printf("%d km = %d m\n", valor, valor * 1000);
               break;
           // completa los casos 2, 3 y 4 y el default
       }
       printf("Conversión terminada.\n");
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Prueba las cuatro opciones, una opción inválida y una entrada no numérica.

## Criterios de evaluación

- [ ] Las ejecuciones de ejemplo producen exactamente la salida mostrada.
- [ ] Las opciones 1, 2 y 4 dan `1000 m`, `100 cm` y `60 min` por unidad.
- [ ] Cada `case` termina con `break` y el `default` maneja las opciones inválidas.
- [ ] Una entrada no numérica muestra `Entrada inválida` y termina con código 1.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
