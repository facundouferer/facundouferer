---
course: 'c'
lesson: 'sentencia-for'
slug: 'tabla-de-multiplicar'
title: 'Tabla de multiplicar con estadísticas'
description: 'Programa que lee un número del 1 al 12, imprime su tabla de multiplicar alineada con un ciclo for y calcula la suma de los resultados y cuántos son pares.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 30
objectives:
  - 'Escribir un ciclo for con contador cuyas tres partes (inicialización, condición y actualización) son correctas en los límites.'
  - 'Acumular y contar dentro del mismo ciclo.'
  - 'Dar formato de columnas a la salida con el ancho de campo de printf.'
requirements:
  - 'Lee el número con el mensaje Tabla del número (1 a 12): y comprueba que scanf devuelve 1; si no, muestra Entrada inválida y termina con return 1;.'
  - 'Si el número no está entre 1 y 12, muestra El número debe estar entre 1 y 12 y termina con return 1;.'
  - 'Un ciclo for con el contador de 1 a 10, ambos incluidos, muestra cada fila con printf("%2d x %2d = %3d\n", ...), de modo que las columnas queden alineadas como en el ejemplo.'
  - 'En el mismo ciclo se acumula la suma de los resultados y se cuentan los resultados pares.'
  - 'Después del ciclo se muestran las líneas Suma de los resultados y Resultados pares con el formato del ejemplo.'
  - 'La salida coincide exactamente con la del ejemplo para la entrada 7.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa
  Tabla del número (1 a 12): 7
  --- Tabla del 7 ---
   7 x  1 =   7
   7 x  2 =  14
   7 x  3 =  21
   7 x  4 =  28
   7 x  5 =  35
   7 x  6 =  42
   7 x  7 =  49
   7 x  8 =  56
   7 x  9 =  63
   7 x 10 =  70
  Suma de los resultados: 385
  Resultados pares: 5 de 10
extensionChallenges:
  - 'Agrega una segunda lectura con el límite de la tabla (por ejemplo, hasta 15 en lugar de 10) y valida que esté entre 1 y 20.'
  - 'Usa continue para que la tabla omita las filas cuyo resultado es múltiplo de 10, sin que eso cambie la suma.'
deliveryTips:
  - 'En %3d, el 3 es el ancho mínimo del campo: printf completa con espacios a la izquierda para que los números ocupen siempre tres columnas.'
  - 'Comprueba los límites del ciclo: la primera fila es x 1 y la última x 10. Si ves 9 u 11 filas, revisa la condición.'
---

## Contexto

Una tabla de multiplicar es el ejemplo clásico de repetición con una cantidad de pasos conocida: siempre son diez filas. En ese caso, `for` permite ver en una sola línea dónde empieza el contador, hasta dónde llega y cómo avanza.

Además de mostrar la tabla, el programa va a acumular y contar mientras recorre las filas, sin volver a recorrerlas.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   int main(void) {
       int n;
       int i;
       int suma = 0;
       int pares = 0;

       printf("Tabla del número (1 a 12): ");
       if (scanf("%d", &n) != 1) {
           printf("Entrada inválida\n");
           return 1;
       }
       // valida el rango

       printf("--- Tabla del %d ---\n", n);
       for (/* inicialización */; /* condición */; /* actualización */) {
           // muestra la fila, acumula y cuenta
       }

       // muestra la suma y la cantidad de pares
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Ejecuta con 7 y compara con la salida de ejemplo. Prueba también con 12 (la suma es 660 y los diez resultados son pares) y con 0.

## Criterios de evaluación

- [ ] La salida para 7 coincide exactamente con la de ejemplo y la de 12 da suma 660 y 10 pares.
- [ ] El ciclo `for` tiene exactamente diez iteraciones.
- [ ] La suma y el conteo se calculan en el mismo ciclo, sin valores escritos a mano.
- [ ] Las entradas fuera de rango o no numéricas se rechazan con código 1.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
