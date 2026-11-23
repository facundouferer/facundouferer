---
course: 'c'
lesson: 'polimorfismo-y-herencia-simulados-en-c'
slug: 'liquidacion-de-sueldos'
title: 'Liquidación de sueldos con una tabla de operaciones'
description: 'Programa que calcula los sueldos de empleados mensuales, por hora y comisionistas con una interfaz Empleado: una tabla de punteros a función por tipo, una estructura base como primer campo con los datos comunes y un bucle que solo conoce la interfaz.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 75
objectives:
  - 'Definir una interfaz con una tabla de operaciones de punteros a función.'
  - 'Simular herencia con una estructura base, que guarda los datos comunes, como primer campo de cada tipo concreto.'
  - 'Despachar las operaciones, incluida la destrucción, sin que el código cliente conozca los tipos concretos.'
  - 'Crear y destruir objetos dinámicos con la propiedad documentada y comprobarlo con AddressSanitizer.'
requirements:
  - 'EmpleadoOps es una struct con const char *tipo y dos punteros a función: long long (*sueldo)(const Empleado *self) y void (*destruir)(Empleado *self). Hay una sola tabla static const por tipo.'
  - 'struct Empleado (la base) tiene el puntero a su tabla y el nombre en un arreglo char nombre[24]. Mensual, PorHora y Comisionista tienen Empleado base; como primer campo y agregan sus datos: sueldo mensual; horas y valor por hora; básico, ventas y porcentaje de comisión. Todo el dinero se maneja en centavos con long long.'
  - 'El sueldo de un comisionista es básico + ventas * porcentaje / 100; el de un empleado por hora, horas * valor por hora.'
  - 'Cada función de creación (mensual_crear, por_hora_crear, comisionista_crear) valida sus datos (nombre no vacío de menos de 24 caracteres, montos y horas no negativos, sueldo mensual y valor por hora positivos, porcentaje de 0 a 100), reserva con malloc y devuelve la dirección de la base, o NULL. Un comentario indica que el llamador libera el resultado con empleado_destruir.'
  - 'Las funciones de despacho empleado_sueldo, empleado_tipo, empleado_nombre y empleado_destruir son la única interfaz que usa main; empleado_destruir acepta NULL. Las implementaciones de cada tipo son static.'
  - 'main crea Ana (mensual, 85000000), Bruno (por hora, 120 horas a 250050), Carla (comisionista, básico 40000000, ventas 300000000, 5 %) y Dario (por hora, -5 horas, que debe fallar) en un arreglo Empleado *plantel[4]; el bucle que muestra sueldos y suma el total no menciona ningún tipo concreto. Si alguna creación falló, el programa termina con código 1 después de destruir todo.'
  - 'Cada fila se muestra con printf("%-8s %-9s", ...) seguido del monto con printf("%10lld.%02lld", ...); la fila del total usa printf("%-18s", "Total"). La salida coincide exactamente con la del ejemplo.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa y con -fsanitize=address la ejecución no muestra informes.'
exampleOutput: |
  $ ./programa
  Ana      mensual      850000.00
  Bruno    por hora     300060.00
  Carla    comision     550000.00
  Empleado 4: datos invalidos
  Total                1700060.00
extensionChallenges:
  - 'Agrega un tipo Pasante (asignación fija más un bono por asistencia perfecta) sin modificar el bucle de main, las funciones de despacho ni los otros tipos. Anota qué partes del programa tuviste que tocar.'
  - 'Agrega a la tabla la operación void (*describir)(const Empleado *self), que muestra los datos propios de cada tipo, y cuenta cuántos lugares del programa cambiaste: es el costo de mantenimiento que describe la lección.'
  - 'Escribe una versión con una unión con etiqueta y un switch, y compara qué es más fácil de extender: agregar un tipo o agregar una operación.'
deliveryTips:
  - 'Una función auxiliar static que inicializa la base (tabla y nombre) evita repetir el mismo código en las tres funciones de creación.'
  - 'Si los tres tipos solo reservan un bloque, pueden compartir la misma función destruir que hace free(self). Sigue siendo necesario despacharla: otro tipo podría tener partes dinámicas propias.'
  - 'Con 120 horas a 250050 centavos el sueldo es 30006000 centavos, es decir 300060.00: comprueba que tus cuentas se hacen con enteros.'
---

## Contexto

Una empresa paga de tres maneras distintas: sueldo mensual fijo, por hora trabajada o un básico más una comisión sobre las ventas. La liquidación, sin embargo, siempre hace lo mismo: recorre el plantel, pide a cada empleado su sueldo y suma el total.

Es el problema que resuelve la técnica de la lección: una **interfaz** `Empleado` con una tabla de operaciones por tipo y una estructura base con los datos comunes (el nombre). El bucle de liquidación trabaja solo con esa interfaz, así que agregar una nueva forma de pago no obliga a cambiarlo. Recuerda que C no tiene herencia ni métodos virtuales: todo el mecanismo lo construyes tú, y el compilador no verifica las conversiones.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>
   #include <stdlib.h>
   #include <string.h>

   #define NOMBRE_MAX 24

   typedef struct Empleado Empleado;

   typedef struct {
       const char *tipo;
       long long (*sueldo)(const Empleado *self);
       void (*destruir)(Empleado *self);
   } EmpleadoOps;

   struct Empleado {
       const EmpleadoOps *ops;
       char nombre[NOMBRE_MAX];
   };

   /* Funciones de despacho: la interfaz pública. */
   long long empleado_sueldo(const Empleado *e) { return e->ops->sueldo(e); }
   // empleado_tipo, empleado_nombre y empleado_destruir (acepta NULL)

   /* ---- Mensual ---- */
   typedef struct {
       Empleado base;   /* SIEMPRE el primer campo */
       long long mensual;
   } Mensual;

   // mensual_sueldo, la tabla MENSUAL_OPS y mensual_crear

   /* ---- PorHora y Comisionista ---- */

   int main(void) {
       Empleado *plantel[4] = {
           mensual_crear("Ana", 85000000),
           por_hora_crear("Bruno", 120, 250050),
           comisionista_crear("Carla", 40000000, 300000000, 5),
           por_hora_crear("Dario", -5, 250000),
       };
       // muestra cada sueldo, suma el total y destruye todo
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Ejecuta y compara con la salida de ejemplo; el código de salida debe ser 1 porque Dario no se pudo crear. Después comprueba la memoria:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address programa.c -o programa
   ./programa
   ```

   La salida debe ser la misma y `-fsanitize=address` no debe mostrar informes.

## Criterios de evaluación

- [ ] La salida coincide exactamente con la de ejemplo y el programa termina con código 1.
- [ ] Cada tipo concreto tiene `Empleado base;` como primer campo y una única tabla `static const`.
- [ ] El bucle de `main` usa solo las funciones de despacho; no menciona `Mensual`, `PorHora` ni `Comisionista`.
- [ ] Las conversiones de `const Empleado *` al tipo concreto aparecen solo dentro de las implementaciones de ese tipo.
- [ ] Las funciones de creación validan los datos y devuelven `NULL` sin reservar memoria cuando fallan; la destrucción se despacha y acepta `NULL`.
- [ ] El dinero se calcula en centavos con enteros.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic` y AddressSanitizer no informa errores.
