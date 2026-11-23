---
course: 'c'
lesson: 'objetos-metodos-y-diseno-basado-en-struct'
slug: 'carrito-de-compras'
title: 'Carrito de compras con códigos de resultado'
description: 'Implementación de carrito.c a partir de una interfaz dada: un tipo opaco Carrito compuesto por un arreglo dinámico de ítems que crece con realloc, operaciones con el objeto como primer parámetro, consultas const y errores informados con un enum y parámetros de salida.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 75
objectives:
  - 'Implementar un módulo respetando un contrato ya escrito en el .h.'
  - 'Componer un tipo con un arreglo dinámico de estructuras del que es dueño.'
  - 'Informar errores con un código de resultado y entregar datos por parámetros de salida sin dejar el objeto en un estado inválido.'
  - 'Distinguir operaciones modificadoras (Carrito *) de consultas (const Carrito *).'
requirements:
  - 'carrito.h y main.c son exactamente los de la consigna; solo escribes carrito.c.'
  - 'En carrito.c, struct Carrito se compone de un puntero a un arreglo dinámico de struct Item (código de hasta 11 caracteres, cantidad y precio en centavos), la cantidad de ítems usados y la capacidad. El carrito es dueño del arreglo.'
  - 'carrito_crear devuelve un carrito vacío o NULL si no hay memoria; carrito_destruir libera el arreglo y el carrito, y acepta NULL.'
  - 'carrito_agregar valida todos los argumentos antes de modificar nada (código no vacío y de menos de 12 caracteres, cantidad y precio positivos). Si el código ya existe, suma la cantidad. Si no hay lugar, crece con realloc (capacidad inicial 2, luego el doble) guardando el resultado en un puntero auxiliar; si realloc falla, devuelve CARRITO_SIN_MEMORIA y el carrito conserva su arreglo.'
  - 'carrito_quitar devuelve CARRITO_ARGUMENTO_INVALIDO si la cantidad no es positiva o supera las unidades del ítem, y CARRITO_NO_ENCONTRADO si el código no existe, sin modificar el carrito en esos casos. Si un ítem queda en 0 unidades, desaparece del carrito.'
  - 'carrito_cantidad entrega las unidades por el parámetro de salida solo cuando devuelve CARRITO_OK. Las consultas (carrito_cantidad, carrito_items, carrito_total) no modifican el carrito.'
  - 'La búsqueda de un código está en una única función auxiliar static que reutilizan las demás operaciones.'
  - 'La salida coincide exactamente con la del ejemplo.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic y con -fsanitize=address la ejecución no muestra informes.'
exampleOutput: |
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -c carrito.c
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -c main.c
  $ gcc carrito.o main.o -o carrito
  $ ./carrito
  agregar YERBA x2           -> ok
  agregar LECHE x3           -> ok
  agregar PAN x1             -> ok
  agregar LECHE x1           -> ok
  agregar CAFE x0            -> argumento invalido
  agregar CODIGO-MUY-LARGO   -> argumento invalido
  Items: 3, total: $14201.75
  quitar YERBA x5            -> argumento invalido
  quitar YERBA x2            -> ok
  quitar ARROZ x1            -> no encontrado
  Unidades de LECHE: 4
  Unidades de YERBA: no encontrado
  Items: 2, total: $7300.75
extensionChallenges:
  - 'Agrega enum CarritoResultado carrito_aplicar_descuento(Carrito *carrito, const char *codigo, int porcentaje), que valida el porcentaje entre 1 y 90 y cambia el precio de un ítem sin modificar nada si falla.'
  - 'Agrega una operación que muestre el detalle del carrito (código, cantidad, subtotal) y decide si debe recibir Carrito * o const Carrito *.'
deliveryTips:
  - 'Escribe primero la auxiliar static que busca un código y devuelve un puntero al ítem o NULL; agregar, quitar y consultar la reutilizan.'
  - 'Para quitar un ítem del arreglo sin dejar huecos puedes copiar el último ítem en su lugar y restar uno a la cantidad: el orden no importa en este carrito.'
  - 'Haz todas las comprobaciones antes de la primera modificación: así un error nunca deja el carrito a medias.'
---

## Contexto

En un equipo, muchas veces la interfaz de un módulo se acuerda antes de escribirlo: alguien escribe el `.h` con el contrato y otra persona lo implementa. En este proyecto recibes `carrito.h` y un `main.c` que ya lo usa; tu trabajo es escribir `carrito.c` para que el programa funcione sin cambiar ni una línea de esos dos archivos.

El carrito reúne las técnicas de la lección: es un tipo opaco (lección anterior) compuesto por un arreglo dinámico de ítems del que es dueño, sus operaciones reciben el carrito como primer parámetro, las consultas usan `const` y cada operación que puede fallar devuelve un código de resultado.

## Consigna

1. Copia `carrito.h` tal cual:

   ```c
   #ifndef CARRITO_H
   #define CARRITO_H

   #include <stddef.h>

   enum CarritoResultado {
       CARRITO_OK,
       CARRITO_ARGUMENTO_INVALIDO,
       CARRITO_SIN_MEMORIA,
       CARRITO_NO_ENCONTRADO
   };

   /* Devuelve un texto fijo (no se libera) que describe el resultado. */
   const char *carrito_mensaje(enum CarritoResultado resultado);

   /* Tipo opaco: los campos solo se conocen en carrito.c. */
   typedef struct Carrito Carrito;

   /* Crea un carrito vacío. Propiedad: el llamador es dueño del resultado
      y lo libera con carrito_destruir. Devuelve NULL si no hay memoria. */
   Carrito *carrito_crear(void);

   /* Libera el carrito y todos sus ítems. Acepta NULL. */
   void carrito_destruir(Carrito *carrito);

   /* Agrega cantidad unidades del producto. Si el código ya está, suma la
      cantidad y conserva el precio original. Códigos de 1 a 11 caracteres,
      cantidad y precio mayores que cero. Si falla, el carrito no cambia. */
   enum CarritoResultado carrito_agregar(Carrito *carrito, const char *codigo, int cantidad,
                                         long long precio_centavos);

   /* Quita cantidad unidades; si quedan 0, el ítem desaparece.
      Si falla, el carrito no cambia. */
   enum CarritoResultado carrito_quitar(Carrito *carrito, const char *codigo, int cantidad);

   /* Entrega por *cantidad las unidades del producto. */
   enum CarritoResultado carrito_cantidad(const Carrito *carrito, const char *codigo, int *cantidad);

   size_t carrito_items(const Carrito *carrito);
   long long carrito_total(const Carrito *carrito);

   #endif
   ```

2. Copia `main.c` tal cual:

   ```c
   #include <stdio.h>

   #include "carrito.h"

   static void informar(const char *accion, enum CarritoResultado r) {
       printf("%-26s -> %s\n", accion, carrito_mensaje(r));
   }

   static void mostrar_total(const Carrito *carrito) {
       long long total = carrito_total(carrito);
       printf("Items: %zu, total: $%lld.%02lld\n", carrito_items(carrito), total / 100, total % 100);
   }

   int main(void) {
       Carrito *carrito = carrito_crear();
       if (carrito == NULL) {
           fprintf(stderr, "No se pudo crear el carrito\n");
           return 1;
       }

       informar("agregar YERBA x2", carrito_agregar(carrito, "YERBA", 2, 345050));
       informar("agregar LECHE x3", carrito_agregar(carrito, "LECHE", 3, 120000));
       informar("agregar PAN x1", carrito_agregar(carrito, "PAN", 1, 250075));
       informar("agregar LECHE x1", carrito_agregar(carrito, "LECHE", 1, 120000));
       informar("agregar CAFE x0", carrito_agregar(carrito, "CAFE", 0, 500000));
       informar("agregar CODIGO-MUY-LARGO", carrito_agregar(carrito, "CODIGO-MUY-LARGO", 1, 100));
       mostrar_total(carrito);

       informar("quitar YERBA x5", carrito_quitar(carrito, "YERBA", 5));
       informar("quitar YERBA x2", carrito_quitar(carrito, "YERBA", 2));
       informar("quitar ARROZ x1", carrito_quitar(carrito, "ARROZ", 1));

       int unidades = 0;
       enum CarritoResultado r = carrito_cantidad(carrito, "LECHE", &unidades);
       if (r == CARRITO_OK) {
           printf("Unidades de LECHE: %d\n", unidades);
       }
       r = carrito_cantidad(carrito, "YERBA", &unidades);
       printf("Unidades de YERBA: %s\n", carrito_mensaje(r));
       mostrar_total(carrito);

       carrito_destruir(carrito);
       return 0;
   }
   ```

3. Escribe `carrito.c` a partir de este esqueleto:

   ```c
   #include "carrito.h"

   #include <stdlib.h>
   #include <string.h>

   struct Item {
       char codigo[12];
       int cantidad;
       long long precio_centavos;
   };

   struct Carrito {
       struct Item *items;   /* el carrito es dueño de este arreglo */
       size_t cantidad;      /* invariante: cantidad <= capacidad */
       size_t capacidad;
   };

   static struct Item *buscar(const Carrito *carrito, const char *codigo) {
       // devuelve la dirección del ítem con ese código o NULL
   }

   // carrito_mensaje, carrito_crear, carrito_destruir y las demás operaciones
   ```

4. Compila cada archivo por separado y enlaza, como en la salida de ejemplo. Cada archivo debe **compilar sin advertencias**. Para compilar de una vez con el comando del curso (el equivalente de `gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa` para varios archivos) y comprobar la memoria:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address carrito.c main.c -o carrito
   ./carrito
   ```

   La salida debe ser la misma y `-fsanitize=address` no debe mostrar informes.

## Criterios de evaluación

- [ ] La salida coincide exactamente con la de ejemplo, con `carrito.h` y `main.c` sin cambios.
- [ ] El arreglo crece con `realloc` mediante un puntero auxiliar y un fallo no pierde el arreglo anterior.
- [ ] Ninguna operación que devuelve un error modifica el carrito.
- [ ] Las consultas reciben `const Carrito *`; la búsqueda está en una sola auxiliar `static`.
- [ ] `carrito_destruir` libera todo y acepta `NULL`; nadie fuera de `carrito.c` llama a `free` sobre el carrito o sus ítems.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic` y AddressSanitizer no informa errores.
