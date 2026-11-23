---
course: 'c'
lesson: 'recursividad'
slug: 'calculadora-de-consola'
title: 'Proyecto integrador: Calculadora de consola'
description: 'Proyecto integrador de los módulos 1 a 3: una calculadora con menú, dividida en calculadora.h, calculadora.c y main.c, que combina variables, operadores, decisiones, ciclos, entrada validada y funciones recursivas.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 120
objectives:
  - 'Integrar variables, tipos, operadores, entrada validada, control de flujo y funciones en un programa completo.'
  - 'Organizar el programa en módulos: interfaz en calculadora.h, implementación en calculadora.c y la interacción con el usuario en main.c.'
  - 'Implementar potencia, factorial y máximo común divisor de forma recursiva, con su caso base y su rango válido documentados.'
  - 'Evitar el comportamiento indefinido: división por cero, desbordamiento de enteros con signo y lecturas no validadas.'
requirements:
  - 'calculadora.h tiene guardas de inclusión y solo prototipos, cada uno con un comentario que indica qué devuelve y qué requiere (por ejemplo, Requiere divisor != 0).'
  - 'calculadora.c implementa sumar, restar, multiplicar, cociente y resto recibiendo dos int y devolviendo long long, de modo que ningún resultado desborde (por ejemplo, multiplicar convierte un operando con (long long) antes de operar).'
  - 'calculadora.c implementa bool se_puede_dividir(int divisor) y las funciones recursivas long long potencia(int base, int exponente), long long factorial(int n) e int mcd(int a, int b), sin ciclos.'
  - 'Ninguna función de calculadora.c usa printf ni scanf; toda la entrada y salida está en main.c.'
  - 'main.c muestra el menú una vez y repite la pregunta Opción: con un ciclo do-while hasta que el usuario elige 0; la opción se procesa con switch.'
  - 'Cada scanf se valida. Si la entrada no es numérica, el programa descarta el resto de la línea con un ciclo de getchar en una función static void descartar_linea(void) de main.c, muestra el error correspondiente y vuelve a preguntar. Si la entrada termina (EOF), el programa termina sin ciclar para siempre.'
  - 'Se validan los rangos antes de llamar a cada función: divisor distinto de cero; base entre -10 y 10 y exponente entre 0 y 18; factorial entre 0 y 20; MCD con dos enteros no negativos que no sean ambos cero.'
  - 'El programa no tiene variables globales.'
  - 'La salida coincide exactamente con la del ejemplo para la misma secuencia de entradas.'
  - 'Cada archivo compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic, por separado con -c, y los objetos se enlazan en el ejecutable calculadora.'
exampleOutput: |
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -c calculadora.c
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -c main.c
  $ gcc calculadora.o main.o -o calculadora
  $ ./calculadora
  === Calculadora de consola ===
  1) Sumar  2) Restar  3) Multiplicar  4) Dividir
  5) Potencia  6) Factorial  7) MCD  0) Salir
  Opción: 1
  Dos enteros: 12 30
  Resultado: 42
  Opción: 4
  Dos enteros: 17 5
  Resultado: 3 (resto 2)
  Opción: 4
  Dos enteros: 8 0
  Error: no se puede dividir por cero.
  Opción: 5
  Base (-10 a 10) y exponente (0 a 18): 2 10
  Resultado: 1024
  Opción: 6
  Número (0 a 20): 20
  Resultado: 2432902008176640000
  Opción: 6
  Número (0 a 20): 25
  Error: el número debe estar entre 0 y 20.
  Opción: 7
  Dos enteros no negativos: 48 18
  Resultado: 6
  Opción: x
  Error: opción inválida.
  Opción: 9
  Error: opción inválida.
  Opción: 0
  Hasta luego.
extensionChallenges:
  - 'Agrega la opción 8) Suma de dígitos con una función recursiva int suma_digitos(int n) que requiera n >= 0, sin modificar las funciones existentes.'
  - 'Escribe una versión iterativa de potencia en calculadora.c, compara sus resultados con la recursiva para todos los exponentes de 0 a 18 con base 3 y explica cuál usarías y por qué.'
  - 'Agrega la opción 9) Fibonacci con una versión iterativa y explica en un comentario por qué la recursiva ingenua no es adecuada para n = 50.'
deliveryTips:
  - 'Empieza por calculadora.h: escribir primero los prototipos con sus comentarios te obliga a decidir qué recibe, qué devuelve y qué exige cada función.'
  - 'Prueba cada función de calculadora.c con un main de prueba pequeño antes de escribir el menú.'
  - 'Los límites de rango no son arbitrarios: 10 elevado a 18 y 20! todavía entran en un long long; 10 elevado a 19 y 21! ya no.'
  - 'Para probar la salida completa sin escribir cada vez, puedes redirigir un archivo de entradas: ./calculadora < entradas.txt.'
---

## Contexto

Este es el proyecto integrador de los módulos 1 a 3. Vas a construir una calculadora de consola completa: un programa pequeño, pero con las mismas decisiones que un programa real. Tiene que leer datos que pueden estar mal escritos, evitar operaciones que el lenguaje no define (dividir por cero, desbordar un entero con signo), organizarse en módulos y usar recursión donde el problema se define a sí mismo.

No necesitas nada que no hayas visto: variables y tipos, operadores, `printf` y `scanf` validado, `if`, `switch`, ciclos, funciones, encabezados con guardas, compilación separada y recursividad.

## Consigna

1. Escribe `calculadora.h` con guardas de inclusión y los prototipos documentados:

   ```c
   #ifndef CALCULADORA_H
   #define CALCULADORA_H

   long long sumar(int a, int b);
   // restar, multiplicar, cociente y resto

   // Devuelve true si se puede dividir por divisor.
   bool se_puede_dividir(int divisor);

   // Requiere -10 <= base <= 10 y 0 <= exponente <= 18.
   long long potencia(int base, int exponente);

   // factorial y mcd, con su precondición

   #endif
   ```

2. Escribe `calculadora.c` con las definiciones. Las funciones recursivas deben tener un caso base claro y un caso recursivo que se acerque a él.

3. Escribe `main.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>
   #include "calculadora.h"

   static void descartar_linea(void) {
       int c;
       while ((c = getchar()) != '\n' && c != EOF) {
           // descartar
       }
   }

   static void mostrar_menu(void) {
       printf("=== Calculadora de consola ===\n");
       // dos líneas con las opciones
   }

   int main(void) {
       int opcion = -1;

       mostrar_menu();
       do {
           printf("Opción: ");
           // lee la opción: si la entrada terminó, sale; si no es un número,
           // descarta la línea, muestra el error y vuelve a preguntar
           switch (opcion) {
               case 0:
                   printf("Hasta luego.\n");
                   break;
               // un case por cada operación, con su lectura y su validación
               default:
                   printf("Error: opción inválida.\n");
                   break;
           }
       } while (opcion != 0);
       return 0;
   }
   ```

4. Compila cada archivo por separado y enlaza, como en la salida de ejemplo. Cada archivo debe **compilar sin advertencias**. El equivalente para varios archivos del comando del curso (`gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa`) es:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic main.c calculadora.c -o calculadora
   ```

5. Ejecuta con la secuencia de entradas del ejemplo y compara. Prueba además los casos límite: `3` con `2147483647 2147483647` (el resultado debe ser `4611686014132420609`), `4` con `-2147483648 -1` (cociente `2147483648`), `5` con `10 18` y `7` con `0 0`.

6. Entrega los tres archivos y un archivo `pruebas.txt` con las entradas que probaste, la salida esperada y la obtenida.

## Criterios de evaluación

Además de la lista de requisitos, el proyecto se evalúa con esta rúbrica (adaptada de la rúbrica general del curso: todavía no hay memoria dinámica, así que el criterio de memoria evalúa el tiempo de vida de las variables y la ausencia de comportamiento indefinido):

| Criterio | Peso | Qué se evalúa |
| --- | --- | --- |
| Correctitud funcional | 25 % | Todas las operaciones dan el resultado correcto, incluidos los casos límite, y la salida coincide con la del ejemplo. |
| Diseño y organización | 20 % | Interfaz en `calculadora.h` con guardas y solo prototipos; implementación en `calculadora.c`; entrada y salida solo en `main.c`; funciones cortas con una responsabilidad; ayudantes de `main.c` marcados `static`. |
| Uso apropiado del lenguaje | 15 % | Tipos adecuados (`long long` para resultados que pueden crecer, `bool` para condiciones), casts antes de operar, `switch` y `do-while` donde corresponden, recursión con caso base claro. |
| Gestión de memoria y recursos | 15 % | Sin variables globales; cada variable declarada en el bloque más chico donde se usa e inicializada antes de leerse; ningún comportamiento indefinido (división por cero, desbordamiento con signo, función que no devuelve valor); profundidad de recursión acotada por los rangos validados. |
| Validación y manejo de errores | 10 % | Cada `scanf` validado, línea inválida descartada, rangos comprobados antes de llamar a las funciones, mensajes de error claros y fin de la entrada manejado sin ciclos infinitos. |
| Pruebas y depuración | 10 % | `pruebas.txt` cubre cada opción, los casos límite y las entradas inválidas, con la salida esperada y la obtenida. |
| Documentación y legibilidad | 5 % | Cada prototipo documenta qué devuelve y qué requiere; nombres claros; formato consistente. |

Lista de control:

- [ ] La salida coincide exactamente con la de ejemplo para la misma secuencia de entradas.
- [ ] Los casos límite del paso 5 dan el resultado indicado.
- [ ] `potencia`, `factorial` y `mcd` son recursivas y no usan ciclos.
- [ ] Cada archivo compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic` y los objetos se enlazan sin errores.
