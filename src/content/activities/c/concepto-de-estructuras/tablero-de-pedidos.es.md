---
course: 'c'
lesson: 'concepto-de-estructuras'
slug: 'tablero-de-pedidos'
title: 'Tablero de pedidos'
description: 'Programa que modela pedidos con una struct y un enum de estados, los guarda en un arreglo de estructuras, los hace avanzar con una función que recibe y devuelve el registro por valor y resume cuántos hay en cada estado.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 45
objectives:
  - 'Diseñar un registro con typedef struct y un campo enum para un dato que toma pocos valores.'
  - 'Inicializar un arreglo de estructuras con inicializadores designados y recorrerlo con su cantidad calculada con sizeof.'
  - 'Cambiar un registro con una función que lo recibe por valor y devuelve la copia modificada.'
  - 'Usar un enumerador como índice de un arreglo de contadores.'
requirements:
  - 'Define typedef enum { PENDIENTE, ENVIADO, ENTREGADO, CANCELADO } Estado; y un typedef struct Pedido con los campos numero (int), cliente (char[30]), importe (double) y estado (Estado).'
  - 'main declara un arreglo de cinco pedidos con inicializadores designados (los datos de la salida de ejemplo) y calcula su cantidad con sizeof, sin escribir 5 a mano.'
  - 'Lee la cantidad de rondas con el mensaje Rondas de avance (0 a 3): y comprueba que scanf devuelve 1; si no, muestra Entrada inválida y termina con return 1;. Si el valor no está entre 0 y 3, muestra Las rondas deben estar entre 0 y 3 y termina con return 1;.'
  - 'La función Pedido avanzar(Pedido p) devuelve el pedido con el estado siguiente (PENDIENTE pasa a ENVIADO y ENVIADO a ENTREGADO; ENTREGADO y CANCELADO no cambian) usando un switch sobre p.estado que cubre los cuatro enumeradores. main aplica cada ronda con pedidos[i] = avanzar(pedidos[i]);.'
  - 'La función void mostrar_pedido(Pedido p) muestra una línea con printf("%d %-12s %8.2f ", ...) seguida del nombre del estado, elegido con un switch.'
  - 'El resumen cuenta los pedidos de cada estado en un arreglo int cantidad[4] indexado por el enumerador (cantidad[pedidos[i].estado]++) y suma el importe de los pedidos entregados.'
  - 'La salida coincide exactamente con la del ejemplo para la entrada 1.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa
  Rondas de avance (0 a 3): 1
  --- Antes ---
  101 Ana Gomez     1500.00 Pendiente
  102 Luis Perez     820.50 Enviado
  103 Marta Diaz    2300.00 Entregado
  104 Juan Ruiz      640.00 Cancelado
  105 Sofia Lopez    990.00 Pendiente
  --- Después de 1 ronda(s) ---
  101 Ana Gomez     1500.00 Enviado
  102 Luis Perez     820.50 Entregado
  103 Marta Diaz    2300.00 Entregado
  104 Juan Ruiz      640.00 Cancelado
  105 Sofia Lopez    990.00 Enviado
  Pendientes: 0 | Enviados: 2 | Entregados: 2 | Cancelados: 1
  Importe entregado: 3120.50
extensionChallenges:
  - 'Agrega una función Pedido cancelar(Pedido p) que cancele solo los pedidos pendientes o enviados, y aplícala al pedido 105 antes de las rondas.'
  - 'Escribe bool mismo_pedido(Pedido a, Pedido b) que compare por número y por cliente (con strcmp) y úsala para detectar un pedido cargado dos veces.'
  - 'Con un tipo subyacente fijo de C23 (enum : unsigned char), muestra cuánto ocupa un Estado y cuánto un Pedido, y explica la diferencia con la suma de los campos.'
deliveryTips:
  - 'Si mostrar_pedido o avanzar parecen no cambiar nada, revisa que el resultado de avanzar se asigne: la función trabaja sobre una copia.'
  - 'Con -Wall, el compilador avisa si un switch sobre un Estado no cubre los cuatro enumeradores. Aprovecha ese aviso en lugar de usar default.'
  - 'Prueba con 0 (las dos tablas son iguales), con 2 (cuatro entregados por 5610.50) y con 5 (debe rechazarse).'
---

## Contexto

Un pedido de una tienda en línea es un registro típico: tiene un número, un cliente, un importe y un estado que solo puede tomar unos pocos valores. Con una `struct` esos datos viajan juntos, y con un `enum` el estado deja de ser un número mágico (`estado == 2`) para tener nombre.

El programa simula el paso del tiempo: en cada ronda, cada pedido avanza al estado siguiente. Al final muestra un resumen por estado.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   typedef enum { PENDIENTE, ENVIADO, ENTREGADO, CANCELADO } Estado;

   typedef struct {
       int numero;
       char cliente[30];
       double importe;
       Estado estado;
   } Pedido;

   Pedido avanzar(Pedido p) {
       // switch sobre p.estado con los cuatro casos
       return p;
   }

   void mostrar_pedido(Pedido p) {
       printf("%d %-12s %8.2f ", p.numero, p.cliente, p.importe);
       // switch que muestra el nombre del estado y el salto de línea
   }

   int main(void) {
       Pedido pedidos[] = {
           {.numero = 101, .cliente = "Ana Gomez", .importe = 1500.0, .estado = PENDIENTE},
           // los otros cuatro pedidos del ejemplo
       };
       size_t n = sizeof pedidos / sizeof pedidos[0];

       // lee y valida las rondas
       // muestra la tabla, aplica las rondas, muestra la tabla y el resumen
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Ejecuta con 1 y compara con la salida de ejemplo. Prueba también con 0, 2, 3, 5 y una letra.

## Criterios de evaluación

- [ ] La salida para 1 coincide exactamente con la de ejemplo; con 2 hay cuatro entregados por 5610.50.
- [ ] Los pedidos se declaran con inicializadores designados y su cantidad se calcula con `sizeof`.
- [ ] `avanzar` recibe y devuelve el pedido por valor, y `main` asigna el resultado.
- [ ] Los `switch` sobre `Estado` cubren los cuatro enumeradores y no hay números mágicos para los estados.
- [ ] El conteo usa el enumerador como índice de `cantidad`.
- [ ] Las entradas fuera de rango o no numéricas se rechazan con código 1.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
