---
course: 'c'
lesson: 'encapsulacion-y-abstraccion-en-c'
slug: 'caja-fuerte-opaca'
title: 'Caja fuerte con tipo opaco'
description: 'Módulo caja.h/caja.c con un tipo opaco Caja que guarda un PIN que nadie fuera del módulo puede leer, se bloquea después de tres intentos fallidos y documenta la propiedad de cada objeto; main.c lo usa con una lista de intentos.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 60
objectives:
  - 'Declarar un tipo opaco en el .h y definir la estructura solo en el .c.'
  - 'Escribir un par de funciones de creación y destrucción con la propiedad documentada.'
  - 'Hacer que la interfaz garantice los invariantes del tipo y ocultar las auxiliares con static.'
  - 'Compilar un programa de varios archivos y comprobarlo con AddressSanitizer.'
requirements:
  - 'caja.h tiene guardas de inclusión, declara typedef struct Caja Caja; y solo los prototipos de caja_crear, caja_destruir, caja_abrir, caja_cerrar, caja_bloqueada, caja_intentos_restantes y caja_duenio; cada uno lleva un comentario con su contrato y la propiedad (quién libera qué, qué puntero es prestado).'
  - 'La definición de struct Caja (dueño, PIN, fallos consecutivos y si está abierta) aparece solo en caja.c; main.c no puede leer el PIN ni los fallos.'
  - 'caja_crear(const char *duenio, int pin) guarda una copia propia del nombre con malloc y devuelve NULL si el nombre es NULL o vacío, si el PIN no está entre 0 y 9999 o si no hay memoria, sin dejar memoria reservada en ningún caso de error.'
  - 'caja_destruir libera primero la copia del nombre y después la caja, y acepta NULL.'
  - 'caja_abrir con el PIN correcto abre la caja y pone los fallos en cero; con uno incorrecto suma un fallo; con tres fallos consecutivos la caja queda bloqueada y rechaza cualquier PIN, incluso el correcto.'
  - 'Las funciones auxiliares de caja.c (por ejemplo, la que valida el PIN y la que copia el nombre) son static. Las consultas reciben const Caja *.'
  - 'main.c comprueba que caja_crear("", 1234) y caja_crear("Luis", 12345) devuelven NULL, crea la caja de Marta con PIN 2468, lee PINs con scanf hasta el fin de la entrada (si lee algo que no es un número, muestra Entrada invalida, destruye la caja y termina con return 1;) y la destruye al final.'
  - 'La salida coincide exactamente con la del ejemplo para intentos.txt.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic y con -fsanitize=address la ejecución no muestra informes.'
exampleOutput: |
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -c caja.c
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -c main.c
  $ gcc caja.o main.o -o caja
  $ ./caja < intentos.txt
  Datos invalidos rechazados
  PIN 1111: incorrecto, intentos restantes: 2
  PIN 2468: abierta
  PIN 1234: incorrecto, intentos restantes: 2
  PIN 0000: incorrecto, intentos restantes: 1
  PIN 9999: incorrecto, intentos restantes: 0
  PIN 2468: caja bloqueada
  Caja de Marta: bloqueada
extensionChallenges:
  - 'Agrega bool caja_cambiar_pin(Caja *caja, int actual, int nuevo), que solo cambia el PIN si la caja no está bloqueada y actual es correcto, sin tocar main.c para las operaciones existentes.'
  - 'Cambia la representación del PIN en caja.c (por ejemplo, guarda sus cuatro dígitos en un arreglo de char) y comprueba que main.c compila y produce la misma salida sin cambios.'
deliveryTips:
  - 'Si en main.c escribes caja->pin, el compilador debe rechazarlo por tipo incompleto: es la prueba de que el encapsulamiento funciona.'
  - 'En caja_crear, si falla la copia del nombre, libera la caja antes de devolver NULL: nunca entregues un objeto a medio construir.'
  - 'printf("%04d", pin) completa con ceros a la izquierda, por eso 0 se muestra como 0000.'
---

## Contexto

Una caja fuerte tiene un dato que **nadie** debería poder leer desde afuera: su PIN. También tiene una regla de seguridad: después de tres intentos fallidos seguidos, se bloquea. Si `main.c` pudiera ver la definición de la estructura, podría leer el PIN o poner los fallos en cero y saltarse el bloqueo.

Con un **tipo opaco**, el compilador lo impide: `main.c` solo maneja punteros `Caja *` y todo pasa por las operaciones del módulo, que son las responsables de cuidar las reglas.

## Consigna

1. Crea `intentos.txt` con un PIN por línea:

   ```text
   1111
   2468
   1234
   0
   9999
   2468
   ```

2. Escribe `caja.h` a partir de este esqueleto, con un comentario de contrato y propiedad sobre cada prototipo:

   ```c
   #ifndef CAJA_H
   #define CAJA_H

   #include <stdbool.h>

   /* Tipo opaco: los campos solo se conocen en caja.c. */
   typedef struct Caja Caja;

   /* Crea una caja con una copia de duenio y un PIN de 0 a 9999.
      Propiedad: el llamador libera el resultado con caja_destruir.
      Devuelve NULL si los datos no son válidos o si no hay memoria. */
   Caja *caja_crear(const char *duenio, int pin);

   // caja_destruir, caja_abrir, caja_cerrar, caja_bloqueada,
   // caja_intentos_restantes y caja_duenio (puntero prestado)

   #endif
   ```

3. Escribe `caja.c` con la definición de `struct Caja`, las auxiliares `static` y las operaciones. Escribe `main.c`, que incluye `"caja.h"` y muestra los mensajes del ejemplo.

4. Compila cada archivo por separado y enlaza, como en la salida de ejemplo. Cada archivo debe **compilar sin advertencias**. Para compilar de una vez con el comando del curso (el equivalente de `gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa` para varios archivos) y comprobar la memoria con AddressSanitizer:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address caja.c main.c -o caja
   ./caja < intentos.txt
   ```

   La salida debe ser la misma y `-fsanitize=address` no debe mostrar informes.

5. Prueba también `printf '12 ab\n' | ./caja`: debe mostrar el intento con `0012` y luego `Entrada invalida`, y terminar con código 1 sin fugas.

## Criterios de evaluación

- [ ] La salida para `intentos.txt` coincide exactamente con la de ejemplo.
- [ ] `struct Caja` se define solo en `caja.c`; `main.c` no puede acceder a sus campos.
- [ ] `caja_crear` rechaza datos inválidos y no deja memoria reservada en ningún camino de error.
- [ ] `caja_destruir` libera el nombre y la caja, en ese orden, y acepta `NULL`.
- [ ] El bloqueo funciona: tres fallos seguidos bloquean la caja y un acierto intermedio reinicia la cuenta.
- [ ] Las auxiliares son `static`, las consultas reciben `const Caja *` y cada prototipo documenta su propiedad.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic` y AddressSanitizer no informa errores.
