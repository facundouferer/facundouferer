---
course: 'c'
lesson: 'memoria-dinamica'
slug: 'registro-de-temperaturas'
title: 'Registro de temperaturas que crece'
description: 'Programa que lee una cantidad desconocida de temperaturas en un arreglo dinámico que se duplica con realloc, cuenta rangos con calloc y devuelve en un bloque nuevo las que superan el promedio.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 50
objectives:
  - 'Reservar, agrandar y liberar memoria con `malloc`, `calloc`, `realloc` y `free`, comprobando cada reserva.'
  - 'Hacer crecer un arreglo duplicando su capacidad con un puntero temporal para `realloc`.'
  - 'Liberar cada bloque exactamente una vez en todos los caminos de salida, y comprobarlo con AddressSanitizer.'
requirements:
  - 'La estructura `typedef struct { double *valores; size_t cantidad; size_t capacidad; } Registro;` guarda las temperaturas.'
  - '`bool registro_iniciar(Registro *r)` reserva con `malloc` una capacidad inicial de 2 y devuelve `false` si la reserva falla.'
  - '`bool registro_agregar(Registro *r, double valor)` duplica la capacidad con `realloc` cuando el arreglo está lleno, usando un puntero temporal, y devuelve `false` si no hay memoria (el registro queda intacto).'
  - '`void registro_liberar(Registro *r)` libera el arreglo y deja `valores` en `NULL` y los contadores en 0.'
  - 'El programa lee temperaturas con `scanf("%lf", ...)` hasta que la lectura falla o termina la entrada.'
  - 'Los tres rangos (menos de 20, de 20 a menos de 25, 25 o más) se cuentan en un arreglo de 3 `size_t` reservado con `calloc`.'
  - '`double *sobre_promedio(const Registro *r, double promedio, size_t *cantidad)` devuelve un bloque nuevo, del tamaño justo, con las temperaturas mayores al promedio (o `NULL` si no hay ninguna) y deja su tamaño en `*cantidad`; `main` lo libera.'
  - 'Si no se lee ninguna temperatura, el programa imprime `No se leyeron temperaturas` y termina con código 0 sin fugas.'
  - 'Compila sin advertencias con `gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa` y se ejecuta con `-fsanitize=address` sin informes.'
exampleOutput: |
  Leídas: 5 temperaturas (capacidad 8)
  Promedio: 22.80
  Máxima: 30.0
  Rangos: menos de 20: 2 | 20 a 25: 1 | 25 o más: 2
  Sobre el promedio: 25.5 30.0
extensionChallenges:
  - 'Al terminar la lectura, achica el bloque con `realloc` para que la capacidad sea igual a la cantidad, sin perder el bloque si `realloc` falla.'
  - 'Agrega la mediana: copia los valores en un bloque nuevo, ordénalo con `qsort` y libéralo al terminar.'
deliveryTips:
  - 'Escribe los tamaños como `n * sizeof *p`: si mañana cambias el tipo de `p`, el tamaño sigue siendo correcto.'
  - 'Antes de entregar, cuenta los caminos de salida de `main` y verifica que en cada uno se libera todo lo que ya se reservó.'
  - 'Para probar el crecimiento, ingresa diez números: la capacidad debe pasar por 2, 4, 8 y 16.'
---

## Contexto

Un sensor envía temperaturas durante el día y el programa no sabe de antemano cuántas llegarán. Un arreglo de tamaño fijo se queda corto o desperdicia memoria; con memoria dinámica el arreglo **crece** a medida que llegan los datos.

En este proyecto usas las cuatro funciones de la lección: `malloc` para la reserva inicial, `realloc` para crecer, `calloc` para un contador que debe empezar en cero y `free` para devolver cada bloque.

## Consigna

1. Escribe `programa.c` con la estructura `Registro`, las funciones de los requisitos y un `int main(void)` que lea, calcule e imprima la salida de ejemplo. Cada reserva se comprueba antes de usarla; si alguna falla, el programa muestra `No hay memoria suficiente` en `stderr`, libera lo que ya reservó y termina con código 1.

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Prueba con los datos de ejemplo:

   ```bash
   echo "18.5 21.0 25.5 19.0 30.0" | ./programa
   ```

4. Compila también con AddressSanitizer, una herramienta del compilador que detiene el programa e imprime un informe cuando lee o escribe fuera de un bloque, o usa uno ya liberado (aprenderás a leer sus informes en la próxima lección). Ejecuta las mismas pruebas, más una entrada vacía y una de diez números. No debe aparecer **ningún informe**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address programa.c -o programa
   echo "18.5 21.0 25.5 19.0 30.0" | ./programa
   printf "" | ./programa
   echo "1 2 3 4 5 6 7 8 9 30" | ./programa
   ```

   Con la entrada de diez números, la primera línea debe ser `Leídas: 10 temperaturas (capacidad 16)`.

## Criterios de evaluación

- [ ] La salida coincide exactamente con la de ejemplo y la entrada vacía muestra `No se leyeron temperaturas`.
- [ ] Cada `malloc`, `calloc` y `realloc` se comprueba antes de usar el puntero.
- [ ] `realloc` usa un puntero temporal y el registro queda válido si falla.
- [ ] Cada bloque se libera exactamente una vez, también en los caminos de error.
- [ ] Los tamaños se calculan con `sizeof *p` y se guardan en `size_t`.
- [ ] Compila sin advertencias y AddressSanitizer no informa ningún error.
