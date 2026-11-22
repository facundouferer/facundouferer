---
course: 'c'
lesson: 'estructuras-dinamicas-listas'
slug: 'lista-de-tareas'
title: 'Lista de tareas ordenada por prioridad'
description: 'Proyecto integrador de punteros y listas enlazadas: un gestor de tareas que agrega, completa, elimina y lista tareas ordenadas por prioridad, con cada nodo y cada descripción reservados con malloc y liberados exactamente una vez.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 120
objectives:
  - 'Mantener una lista simplemente enlazada ordenada por prioridad, insertando cada tarea en su lugar con un puntero doble.'
  - 'Reservar con malloc cada nodo y cada descripción, comprobar cada reserva y documentar quién es dueño de cada bloque.'
  - 'Eliminar nodos de la cabeza, del medio y del final desenganchando primero y liberando después.'
  - 'Liberar la lista completa en todos los caminos de salida, también cuando la entrada es inválida.'
requirements:
  - 'Cada tarea es un nodo Tarea con id, prioridad, completada (bool), descripcion (char *) y siguiente. La descripción se copia en un bloque propio de strlen(descripcion) + 1 bytes: la tarea es dueña de ese bloque y la lista es dueña de cada tarea.'
  - 'crear_tarea comprueba las dos reservas; si falla la segunda, libera la primera antes de devolver NULL.'
  - 'El programa lee comandos de la entrada estándar hasta salir o el fin de la entrada: agregar <prioridad> <descripción>, completar <id>, eliminar <id> y listar. Los id se asignan desde 1 en orden de llegada y no se reutilizan.'
  - 'agregar inserta la tarea en orden de prioridad ascendente (1 es la más urgente); a igual prioridad, la que llegó antes queda primero. Una prioridad fuera de 1 a 5 se rechaza con Error: la prioridad debe estar entre 1 y 5 y el programa sigue.'
  - 'completar y eliminar con un id que no existe muestran Error: no existe la tarea #<id>; un comando desconocido muestra Error: comando desconocido: <comando> y se descarta el resto de su línea.'
  - 'Si scanf no puede leer un número donde se espera uno, el programa muestra Error: entrada inválida, libera la lista y termina con código 1.'
  - 'Al terminar, destruir_lista libera cada descripción y cada nodo, deja la cabeza en NULL y devuelve cuántas tareas liberó; main muestra Tareas liberadas: <n>.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa y la versión con -fsanitize=address no produce ningún informe con las entradas de la consigna.'
exampleOutput: |
  $ ./programa < tareas.txt
  Agregada #1: Estudiar punteros (prioridad 2)
  Agregada #2: Entregar el trabajo práctico (prioridad 1)
  Agregada #3: Ordenar apuntes (prioridad 3)
  Agregada #4: Pagar la cuota (prioridad 1)
  Error: la prioridad debe estar entre 1 y 5
  --- Tareas ---
  [ ] #2 (p1) Entregar el trabajo práctico
  [ ] #4 (p1) Pagar la cuota
  [ ] #1 (p2) Estudiar punteros
  [ ] #3 (p3) Ordenar apuntes
  Pendientes: 4 de 4
  Completada #2
  Error: no existe la tarea #9
  Eliminada #3
  Error: comando desconocido: mostrar
  --- Tareas ---
  [x] #2 (p1) Entregar el trabajo práctico
  [ ] #4 (p1) Pagar la cuota
  [ ] #1 (p2) Estudiar punteros
  Pendientes: 2 de 3
  Tareas liberadas: 3
extensionChallenges:
  - 'Agrega el comando prioridad <id> <nueva> que cambie la prioridad de una tarea y la mueva a su nuevo lugar sin crear ni liberar nodos: desengánchala y vuelve a insertarla.'
  - 'Agrega limpiar, que elimine de una sola pasada todas las tareas completadas y muestre cuántas quitó.'
  - 'Convierte la lista en doblemente enlazada con un puntero al último nodo y agrega listar-al-reves.'
deliveryTips:
  - 'Escribe destruir_tarea y destruir_lista antes que agregar: así puedes usarlas desde el principio en todos los caminos de error.'
  - 'Recorrer con un Tarea **enlace (ejercicio 3 de la lección) resuelve la inserción y la eliminación en la cabeza sin casos especiales.'
  - 'Para que los empates respeten el orden de llegada, avanza mientras la prioridad del nodo sea menor o igual que la de la tarea nueva.'
  - 'En macOS, AddressSanitizer no incluye el detector de fugas. Allí puedes comprobarlas con leaks --atExit -- ./programa < tareas.txt (sobre la versión compilada sin -fsanitize), o contar cuántas tareas creaste y compararlo con el número que devuelve destruir_lista.'
---

## Contexto

Este proyecto integra lo que estudiaste sobre punteros y memoria dinámica en una aplicación pequeña pero completa. Un gestor de tareas cambia todo el tiempo: entran tareas nuevas en cualquier posición según su urgencia, otras se quitan del medio, y no sabes cuántas habrá. Una lista enlazada ordenada resuelve justo eso: insertar o quitar en un punto conocido es cambiar un par de punteros, sin correr datos.

Cada tarea ocupa **dos** bloques del heap: el nodo y la copia de su descripción. La regla de propiedad es una cadena: `main` es dueña de la lista, la lista es dueña de cada nodo y cada nodo es dueño de su descripción. Liberar es recorrer esa cadena al revés: primero la descripción, después el nodo.

## Consigna

1. Crea el archivo de entrada `tareas.txt`:

   ```text
   agregar 2 Estudiar punteros
   agregar 1 Entregar el trabajo práctico
   agregar 3 Ordenar apuntes
   agregar 1 Pagar la cuota
   agregar 7 Viajar a la Luna
   listar
   completar 2
   completar 9
   eliminar 3
   mostrar todo
   listar
   salir
   ```

2. Escribe `programa.c` a partir de este esqueleto. La función `leer_descripcion` ya está resuelta: lee el resto de la línea después de la prioridad.

   ```c
   #include <stdio.h>
   #include <stdlib.h>
   #include <string.h>

   // Propiedad: main es dueña de la lista, la lista es dueña de cada Tarea
   // y cada Tarea es dueña de su descripción.
   typedef struct Tarea {
       int id;
       int prioridad;               // 1 (más urgente) a 5
       bool completada;
       char *descripcion;           // bloque propio, liberado por destruir_tarea
       struct Tarea *siguiente;
   } Tarea;

   // Lee el resto de la línea en destino, sin espacios iniciales ni '\n'.
   // Devuelve false si no hay línea, si está vacía o si no entra en capacidad.
   bool leer_descripcion(char destino[], size_t capacidad) {
       char linea[128];
       if (fgets(linea, sizeof linea, stdin) == NULL) {
           return false;
       }
       linea[strcspn(linea, "\n")] = '\0';
       size_t inicio = 0;
       while (linea[inicio] == ' ') {
           inicio++;
       }
       if (linea[inicio] == '\0' || strlen(linea + inicio) >= capacidad) {
           return false;
       }
       strcpy(destino, linea + inicio);
       return true;
   }

   // Propiedad: el llamador es dueño de la tarea devuelta (la libera con
   // destruir_tarea o la entrega a la lista). Devuelve NULL si no hay memoria.
   Tarea *crear_tarea(int id, int prioridad, const char *descripcion);

   // Libera la descripción y el nodo.
   void destruir_tarea(Tarea *tarea);

   // Toma la propiedad de nueva y la enlaza en su lugar según la prioridad.
   void insertar_por_prioridad(Tarea **cabeza, Tarea *nueva);

   // Devuelve la tarea con ese id, o NULL. La tarea sigue siendo de la lista.
   Tarea *buscar_tarea(Tarea *cabeza, int id);

   // Desengancha y libera la tarea con ese id. false si no existe.
   bool eliminar_tarea(Tarea **cabeza, int id);

   // Muestra la lista y la cantidad de pendientes. Solo lee.
   void listar(const Tarea *cabeza);

   // Libera todas las tareas, deja *cabeza en NULL y devuelve cuántas liberó.
   size_t destruir_lista(Tarea **cabeza);

   int main(void) {
       Tarea *lista = NULL;
       int proximo_id = 1;
       char comando[16];

       while (scanf("%15s", comando) == 1) {
           // salir, agregar, completar, eliminar, listar o comando desconocido
       }
       printf("Tareas liberadas: %zu\n", destruir_lista(&lista));
       return 0;
   }
   ```

3. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

4. Compila con AddressSanitizer y ejecuta las tres pruebas. Ninguna debe producir **ningún informe**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address programa.c -o programa
   ./programa < tareas.txt
   printf "agregar 2 Algo\nagregar dos Algo\n" | ./programa
   printf "listar\n" | ./programa
   ```

   La primera debe producir la salida de ejemplo. La segunda agrega la tarea #1, muestra `Error: entrada inválida`, después `Tareas liberadas: 1` y termina con código 1. La tercera muestra la lista vacía (`Pendientes: 0 de 0`) y `Tareas liberadas: 0`.

5. Escribe al principio del archivo un comentario breve que explique quién es dueño de cada bloque y en qué función se libera.

## Criterios de evaluación

| Criterio | Peso | Qué se evalúa |
| --- | --- | --- |
| Correctitud funcional | 25 % | La salida coincide con la de ejemplo; el orden por prioridad respeta los empates por llegada; las otras dos pruebas dan lo pedido. |
| Diseño y organización | 20 % | Una función por operación de la lista; `main` solo interpreta comandos y llama a esas funciones; `crear_tarea` y `destruir_tarea` son simétricas. |
| Uso apropiado del lenguaje | 15 % | `Tarea **` en las funciones que pueden cambiar la cabeza, `const` en las que solo leen, `size_t` para cantidades, `sizeof *p` en cada reserva, `bool` para informar éxito o fallo. |
| Gestión de memoria y recursos | 15 % | Cada `malloc` se comprueba; cada descripción y cada nodo se liberan una sola vez, desenganchando antes de liberar; la lista se destruye también en el camino de error. |
| Validación y manejo de errores | 10 % | Prioridad fuera de rango, id inexistente, comando desconocido y número mal formado se detectan con el mensaje pedido; código 1 ante entrada inválida. |
| Pruebas y depuración | 10 % | Las tres pruebas de la consigna se ejecutan con AddressSanitizer sin informes, y se comprobó que no hay fugas (por ejemplo, con el número de `Tareas liberadas`). |
| Documentación y legibilidad | 5 % | Comentario de propiedad en cada función que reserva, recibe o libera memoria; nombres claros; párrafo de propiedad al inicio. |
