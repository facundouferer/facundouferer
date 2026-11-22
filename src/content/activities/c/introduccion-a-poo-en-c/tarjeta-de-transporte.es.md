---
course: 'c'
lesson: 'introduccion-a-poo-en-c'
slug: 'tarjeta-de-transporte'
title: 'Tarjeta de transporte: estado y operaciones'
description: 'Programa que modela una tarjeta de transporte con una struct y funciones que reciben un puntero a ella, protege sus reglas (sin saldo negativo, con tope de carga) dentro de las operaciones y procesa una lista de comandos leída de la entrada.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 45
objectives:
  - 'Diseñar un tipo a partir de sus operaciones antes de escribir sus campos.'
  - 'Escribir operaciones que reciben el puntero a la tarjeta como primer parámetro, con un prefijo común.'
  - 'Proteger las reglas del tipo (invariantes) dentro de las operaciones, no en main.'
  - 'Distinguir operaciones que modifican (struct Tarjeta *) de consultas (const struct Tarjeta *).'
requirements:
  - 'struct Tarjeta tiene solo dos campos: long long saldo_centavos e int viajes. El dinero se guarda en centavos con un entero, nunca en float o double.'
  - 'Existen exactamente estas operaciones: void tarjeta_iniciar(struct Tarjeta *t), bool tarjeta_cargar(struct Tarjeta *t, long long monto), bool tarjeta_viajar(struct Tarjeta *t), long long tarjeta_saldo(const struct Tarjeta *t) e int tarjeta_viajes(const struct Tarjeta *t).'
  - 'tarjeta_cargar devuelve false y no cambia nada si el monto no es positivo o si el saldo superaría el tope de 500000 centavos ($5000.00).'
  - 'tarjeta_viajar cobra la tarifa de 1250 centavos y suma un viaje; si el saldo no alcanza, devuelve false y no cambia nada. El saldo nunca queda negativo.'
  - 'main no lee ni escribe los campos de la tarjeta directamente: usa solo las cinco operaciones.'
  - 'main lee comandos hasta el fin de la entrada con scanf(" %c", &op): c seguido de un monto en centavos carga, v paga un viaje y cualquier otra letra muestra Comando desconocido. Si el monto de c no es un número, muestra Monto invalido y termina con return 1;.'
  - 'Los montos se muestran como $pesos.centavos con printf("$%lld.%02lld", ...) y la salida coincide exactamente con la del ejemplo para operaciones.txt.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa < operaciones.txt
  Carga aceptada. Saldo: $30.00
  Viaje pagado. Saldo: $17.50
  Viaje pagado. Saldo: $5.00
  Saldo insuficiente. Saldo: $5.00
  Carga rechazada. Saldo: $5.00
  Carga rechazada. Saldo: $5.00
  Comando desconocido: x
  Carga aceptada. Saldo: $15.00
  Viaje pagado. Saldo: $2.50
  Resumen: 3 viajes, saldo $2.50
extensionChallenges:
  - 'Agrega la operación bool tarjeta_viajar_con_descuento(struct Tarjeta *t, int porcentaje) para tarifas sociales, que valida el porcentaje entre 0 y 100 y reutiliza las mismas reglas de saldo.'
  - 'Cambia la representación interna (por ejemplo, guarda también el total gastado) sin modificar main, y comprueba que la salida no cambia.'
deliveryTips:
  - 'Escribe primero la lista de operaciones y las reglas que deben proteger; los campos vienen después.'
  - 'El espacio en " %c" hace que scanf saltee los saltos de línea entre comandos.'
  - 'Con 2.50 pesos, centavos % 100 vale 50 y %02lld muestra 50; con 5 pesos vale 0 y %02lld muestra 00.'
---

## Contexto

Una tarjeta de transporte es un buen ejemplo de entidad con **estado** (el saldo y la cantidad de viajes) y **comportamiento** (cargar, pagar un viaje, consultar). También tiene reglas: el saldo nunca puede quedar negativo y no se puede cargar por encima de un tope.

En este proyecto vas a aplicar la idea central de la lección: diseñar el tipo alrededor de sus operaciones y hacer que esas operaciones sean las únicas responsables de cuidar las reglas. C no te obliga a hacerlo (no tiene control de acceso), así que es una disciplina de diseño, no una garantía del lenguaje.

## Consigna

1. Crea el archivo `operaciones.txt` con estos comandos, uno por línea:

   ```text
   c 3000
   v
   v
   v
   c -50
   c 600000
   x
   c 1000
   v
   ```

2. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdbool.h>
   #include <stdio.h>

   #define TARIFA_CENTAVOS 1250
   #define TOPE_CENTAVOS 500000

   struct Tarjeta {
       long long saldo_centavos; /* regla: 0 <= saldo <= TOPE_CENTAVOS */
       int viajes;
   };

   void tarjeta_iniciar(struct Tarjeta *t) {
       // saldo y viajes en cero
   }

   bool tarjeta_cargar(struct Tarjeta *t, long long monto) {
       // valida el monto y el tope antes de modificar
   }

   // tarjeta_viajar, tarjeta_saldo y tarjeta_viajes

   int main(void) {
       struct Tarjeta tarjeta;
       tarjeta_iniciar(&tarjeta);
       char op;

       while (scanf(" %c", &op) == 1) {
           // c <monto>, v o comando desconocido
       }
       // muestra el resumen
       return 0;
   }
   ```

3. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

4. Ejecuta `./programa < operaciones.txt` y compara con la salida de ejemplo. Prueba también una entrada con `c abc` (debe mostrar `Monto invalido` y terminar con código 1).

## Criterios de evaluación

- [ ] La salida para `operaciones.txt` coincide exactamente con la de ejemplo.
- [ ] Las reglas (monto positivo, tope de carga, saldo suficiente) se comprueban solo dentro de las operaciones, antes de modificar la tarjeta.
- [ ] `main` usa únicamente las cinco operaciones y nunca escribe `tarjeta.saldo_centavos` ni `tarjeta.viajes`.
- [ ] Las consultas reciben `const struct Tarjeta *` y las modificadoras `struct Tarjeta *`.
- [ ] El dinero se maneja en centavos con enteros.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
