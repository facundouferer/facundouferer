---
course: 'c'
lesson: 'propiedad-y-errores-de-memoria'
slug: 'planilla-dinamica-de-notas'
title: 'Proyecto integrador: planilla dinámica de notas'
description: 'Mini proyecto que cierra el módulo de memoria: una planilla de alumnos que crece, con funciones crear, agregar y destruir, propiedad documentada, validación de la entrada y cero errores en AddressSanitizer.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 90
objectives:
  - 'Diseñar un tipo con partes reservadas por separado y su par de funciones `crear_...` / `destruir_...`.'
  - 'Documentar la propiedad de cada bloque: quién reserva, quién usa y quién libera.'
  - 'Validar la entrada y deshacer las reservas en todos los caminos de error.'
  - 'Comprobar con AddressSanitizer que el programa no tiene fugas, dobles liberaciones ni usos después de liberar.'
requirements:
  - 'Los tipos son `typedef struct { char *nombre; double nota; } Alumno;` y `typedef struct { Alumno *alumnos; size_t cantidad; size_t capacidad; } Planilla;`. Cada nombre es una copia propia en el heap.'
  - '`Planilla *crear_planilla(size_t capacidad_inicial)` reserva la planilla y su arreglo; si la segunda reserva falla, libera la primera y devuelve `NULL`. `main` la crea con capacidad 2.'
  - '`bool planilla_agregar(Planilla *p, const char *nombre, double nota)` copia el nombre, duplica la capacidad con `realloc` y un puntero temporal cuando hace falta, y devuelve `false` sin dejar memoria a medio reservar si algo falla.'
  - '`void destruir_planilla(Planilla *p)` acepta `NULL` y libera primero cada nombre, después el arreglo y por último la planilla.'
  - '`double planilla_promedio(const Planilla *p)` y `const Alumno *planilla_mejor(const Planilla *p)` solo toman prestada la planilla; la segunda devuelve un préstamo (o `NULL` si está vacía) que quien llama no libera.'
  - 'El programa lee pares `nombre nota` con `scanf("%31s %lf", ...)` hasta el fin de la entrada. Una nota fuera de 0 a 10 se rechaza con un mensaje y no se agrega. Si un dato no tiene el formato esperado, imprime `Entrada inválida`, libera todo y termina con código 1.'
  - 'Cada función que recibe o devuelve memoria tiene un comentario `Propiedad:` que dice quién es el dueño y quién libera.'
  - 'Compila sin advertencias con `gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa` y se ejecuta con `-fsanitize=address` sin informes en todas las pruebas de la consigna.'
exampleOutput: |
  Agregado: Ana (8.50)
  Agregado: Bruno (6.00)
  Rechazado: Carla (nota fuera de rango: 11.00)
  Agregado: Diego (9.50)
  Agregado: Elena (4.00)
  === Resumen ===
  Alumnos: 4 (capacidad 4)
  Promedio: 7.00
  Mejor: Diego (9.50)
  Aprobados: 3
extensionChallenges:
  - 'Agrega `bool planilla_quitar(Planilla *p, const char *nombre)` que libere el nombre del alumno quitado y corra los siguientes una posición. Pruébalo con AddressSanitizer.'
  - 'Separa el código en `planilla.h`, `planilla.c` y `main.c`, de modo que `main.c` no acceda a los campos de `Planilla` directamente.'
  - 'Escribe `Planilla *planilla_aprobados(const Planilla *p)` que devuelva una planilla nueva con copias de los alumnos aprobados. Documenta la propiedad del resultado.'
deliveryTips:
  - 'Dibuja la memoria antes de programar: una caja para la planilla, una para el arreglo de alumnos y una por cada nombre. Cada caja necesita exactamente un `free`.'
  - 'Escribe `destruir_planilla` antes que `planilla_agregar`: así puedes usarla en todos los caminos de error desde el principio.'
  - 'Para probar el camino de error de `scanf`, usa una entrada como `Ana 8` seguida de `Bruno siete`.'
---

## Contexto

Este proyecto cierra el módulo de memoria dinámica. Integra lo que estudiaste en las lecciones de punteros, duración de almacenamiento, memoria dinámica y propiedad: una estructura con partes reservadas por separado, un arreglo que crece, préstamos y un dueño claro para cada bloque.

La planilla guarda alumnos con su nota. No sabes cuántos llegarán, y cada nombre puede tener un largo distinto, así que nada de esto entra en un arreglo de tamaño fijo. A cambio, cada bloque que reserves tiene que tener un dueño y liberarse exactamente una vez, también cuando la entrada es inválida.

## Consigna

1. Escribe `programa.c` con los tipos `Alumno` y `Planilla`, las funciones de los requisitos y un `int main(void)` que lea la entrada, muestre una línea por dato y, al final, el resumen. Un alumno está aprobado con nota 6 o más.

2. Antes de cada función que reserve, reciba o devuelva memoria, escribe su comentario de propiedad. Por ejemplo:

   ```c
   // Crea una planilla vacía con la capacidad indicada.
   // Propiedad: el llamador es dueño del resultado y debe liberarlo con
   // destruir_planilla. Devuelve NULL si no hay memoria.
   Planilla *crear_planilla(size_t capacidad_inicial);
   ```

3. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

4. Compila con AddressSanitizer y ejecuta las tres pruebas. Ninguna debe producir **ningún informe**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address programa.c -o programa
   printf "Ana 8.5\nBruno 6\nCarla 11\nDiego 9.5\nElena 4\n" | ./programa
   printf "" | ./programa
   printf "Ana 8\nBruno siete\n" | ./programa
   ```

   La primera debe producir la salida de ejemplo. La segunda muestra `Alumnos: 0 (capacidad 2)` y no muestra la línea `Mejor`. La tercera agrega a Ana, imprime `Entrada inválida` y termina con código 1.

5. Escribe un párrafo breve al principio del archivo, en un comentario, que explique quién es el dueño de cada bloque del programa.

## Criterios de evaluación

| Criterio | Peso | Qué se evalúa |
| --- | --- | --- |
| Correctitud funcional | 25 % | La salida coincide con la de ejemplo y con lo pedido para la entrada vacía y la entrada inválida. |
| Diseño y organización | 20 % | Funciones pequeñas con una responsabilidad; `main` solo usa la planilla a través de sus funciones; el par crear/destruir es simétrico. |
| Uso apropiado del lenguaje | 15 % | `const` en los préstamos, `size_t` para tamaños y cantidades, `sizeof *p` en cada reserva, `bool` para informar éxito o fallo. |
| Gestión de memoria y recursos | 15 % | Cada reserva se comprueba; `realloc` usa un puntero temporal; cada bloque se libera una sola vez, en orden inverso, también en los caminos de error. |
| Validación y manejo de errores | 10 % | Notas fuera de rango rechazadas; entrada mal formada detectada con el valor de retorno de `scanf`; código de salida 1 ante errores. |
| Pruebas y depuración | 10 % | Las tres pruebas de la consigna se ejecutan con AddressSanitizer sin informes. |
| Documentación y legibilidad | 5 % | Comentarios `Propiedad:` en cada función que reserva, recibe o devuelve memoria; nombres claros; párrafo de propiedad al inicio. |
