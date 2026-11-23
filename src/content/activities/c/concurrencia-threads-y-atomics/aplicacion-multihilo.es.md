---
course: 'c'
lesson: 'concurrencia-threads-y-atomics'
slug: 'aplicacion-multihilo'
title: 'Proyecto integrador: Aplicación multihilo'
description: 'Programa que reparte un millón de datos en cuatro hilos, suma cada tramo, acumula el total con un mutex y cuenta con un contador atómico, y verifica el resultado contra la fórmula conocida.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 90
objectives:
  - 'Dividir un trabajo en tramos independientes y repartirlo entre hilos creados con pthread_create.'
  - 'Proteger un total compartido con un mutex y contar con una variable atómica.'
  - 'Esperar a todos los hilos con pthread_join y verificar el resultado contra un valor calculado de otra forma.'
  - 'Comprobar que el programa no tiene carreras con ThreadSanitizer y que no tiene errores de memoria con AddressSanitizer.'
requirements:
  - 'Reserva con malloc un arreglo de 1000000 enteros con los valores 1, 2, 3, ... hasta 1000000, comprueba el resultado de malloc y lo libera al final.'
  - 'Crea 4 hilos con pthread_create; cada uno recibe una estructura Tarea con su número, un puntero a los datos, el rango de su tramo (inicio y fin exclusivo) y un campo para su suma parcial. Cada hilo trabaja con su propia estructura.'
  - 'Cada hilo suma su tramo en una variable local (long long), cuenta con atomic_fetch_add cuántos valores son múltiplos de 7 y suma su parcial al total global dentro de una sección crítica protegida con un mutex.'
  - 'main espera a los cuatro hilos con pthread_join y, por cada uno, muestra su suma parcial en orden.'
  - 'Verifica el total con la fórmula n * (n + 1) / 2 y muestra correcta o incorrecta; el programa devuelve 0 solo si es correcta.'
  - 'Compila sin advertencias con -pthread, y ejecuta sin reportes con -fsanitize=thread y por separado con -fsanitize=address.'
exampleOutput: |
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -pthread programa.c -o programa
  $ ./programa
  Hilo 0: suma parcial 31250125000
  Hilo 1: suma parcial 93750125000
  Hilo 2: suma parcial 156250125000
  Hilo 3: suma parcial 218750125000
  Suma total: 500000500000
  Múltiplos de 7: 142857
  Verificación: correcta
extensionChallenges:
  - 'Recibe el número de hilos como argumento de línea de comandos (1 a 16) y reparte el resto de la división en los primeros tramos si TOTAL no es múltiplo del número de hilos.'
  - 'Reemplaza el mutex por un atómico para el total y compara con ThreadSanitizer; explica por qué el mutex era suficiente y cuándo un atómico es mejor.'
  - 'Escribe una versión con <threads.h> (thrd_create y mtx_lock) para sistemas que la incluyen y mantenla separada de la de pthread.'
deliveryTips:
  - 'Compila con -pthread, no solo con -lpthread: la opción configura tanto la compilación como el enlace y funciona igual en macOS y Linux.'
  - 'Cada hilo debe recibir la dirección de su propia estructura, nunca la de la variable del ciclo: &tareas[i], no &i.'
  - 'Acumula en una variable local y toma el mutex una sola vez por hilo: así casi no hay espera y el programa es mucho más rápido que bloquear en cada suma.'
  - 'Si el total no da lo esperado, ejecuta con -fsanitize=thread antes de añadir printf: un printf cambia los tiempos y puede ocultar la carrera.'
---

## Contexto

Sumar un millón de números es un trabajo diminuto, pero sirve para practicar lo esencial de la programación con hilos: repartir el trabajo en partes independientes, esperar a que terminen y combinar los resultados sin pisarse.

La forma más segura de combinar es **evitar** compartir: cada hilo trabaja sobre su tramo con variables locales y solo toca un dato compartido al final, dentro de una sección crítica.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <pthread.h>
   #include <stdatomic.h>
   #include <stdio.h>
   #include <stdlib.h>

   #define HILOS 4
   #define TOTAL 1000000

   typedef struct {
       int id;
       const int *datos;
       size_t inicio;
       size_t fin;          /* exclusivo */
       long long parcial;
   } Tarea;

   static long long total = 0;
   static pthread_mutex_t candado = PTHREAD_MUTEX_INITIALIZER;
   static atomic_long multiplos_de_7 = 0;

   static void *trabajar(void *arg) {
       Tarea *t = arg;
       // suma el tramo y cuenta los múltiplos de 7
       // suma el parcial al total global con el candado
       return NULL;
   }

   int main(void) {
       // reserva y llena los datos, crea los hilos, espera a todos,
       // muestra los parciales y verifica el total
       return 0;
   }
   ```

2. Compila con el comando del curso más `-pthread`. El programa debe **compilar sin advertencias** y debe poder ejecutarse con `-fsanitize=address` sin reportes:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic -pthread programa.c -o programa
   gcc -std=c23 -g -pthread -fsanitize=address programa.c -o programa_asan
   ```

3. Comprueba que no hay carreras compilando con ThreadSanitizer. Esta ejecución también debe terminar **sin reportes**:

   ```bash
   gcc -std=c23 -g -pthread -fsanitize=thread programa.c -o programa_tsan
   ./programa_tsan
   ```

4. Para convencerte de que el mutex hace falta, quita temporalmente las dos líneas de `lock` y `unlock`, ejecuta con ThreadSanitizer y lee el informe de carrera; después restaura el programa. Los hilos de este proyecto usan `pthread` para que funcione en macOS y Linux; la alternativa del estándar C11 es `<threads.h>` (`thrd_create`, `mtx_lock`), disponible solo en algunas implementaciones.

## Criterios de evaluación

El proyecto integrador se califica con esta rúbrica, que suma 100 %:

| Criterio | Peso | Qué se evalúa |
| --- | --- | --- |
| Correctitud funcional | 25 % | Los parciales, el total y los múltiplos de 7 coinciden con el ejemplo y la verificación da correcta. |
| Diseño y organización | 20 % | Cada hilo trabaja sobre su propia `Tarea`, con una función `trabajar` clara y tramos que no se solapan. |
| Uso apropiado del lenguaje | 15 % | `pthread_create` y `pthread_join` correctos, `atomic_long` con `atomic_fetch_add`, `size_t` para los índices y `long long` para el total. |
| Gestión de memoria y recursos | 15 % | `malloc` comprobado y liberado, y ningún informe de AddressSanitizer. |
| Validación y manejo de errores | 10 % | Se comprueba el resultado de `malloc` y de `pthread_create`, y el código de salida refleja el resultado de la verificación. |
| Pruebas y depuración | 10 % | Ejecución sin reportes con ThreadSanitizer, y evidencia de que sin el mutex aparece el informe de carrera. |
| Documentación y legibilidad | 5 % | Comentarios breves que explican qué protege el mutex y por qué se acumula en una variable local. |

- [ ] La salida coincide con la del ejemplo y el programa devuelve 0.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic -pthread`.
- [ ] Sin reportes con `-fsanitize=thread` y con `-fsanitize=address`.
