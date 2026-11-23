---
course: 'c'
lesson: 'estructuras-dinamicas-colas'
slug: 'cola-de-impresion'
title: 'Cola de impresión'
description: 'Simulador de una impresora compartida: los trabajos se encolan con malloc, se imprimen en orden de llegada con un límite de páginas por turno y se liberan al terminar, manteniendo el invariante entre frente y final.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 90
objectives:
  - 'Implementar una cola enlazada con punteros al frente y al final, con encolar y desencolar en O(1).'
  - 'Mantener el invariante de la cola: al desencolar el último trabajo, final también vuelve a NULL.'
  - 'Transferir la propiedad de un nodo al desencolarlo y liberarlo exactamente una vez.'
requirements:
  - 'Cada trabajo es un nodo Trabajo con nombre (char *, copia propia de strlen(nombre) + 1 bytes), paginas (las que faltan imprimir) y siguiente. La cola es dueña de cada trabajo y cada trabajo es dueño de su nombre; crear_trabajo comprueba las dos reservas.'
  - 'cola_desencolar devuelve el nodo del frente (o NULL si la cola está vacía) y transfiere su propiedad a quien llama; si la cola queda vacía, pone final en NULL.'
  - 'El programa lee comandos hasta salir o el fin de la entrada: enviar <nombre> <páginas> encola y muestra En cola: <nombre> (<n> páginas), posición <p>; estado muestra Cola: seguido de cada <nombre>(<páginas>) en orden, o Cola vacía.'
  - 'imprimir <n> imprime hasta n páginas en orden de llegada: cada trabajo que entra completo se desencola, se muestra como Impreso: <nombre> (<n> páginas) y se libera; si el siguiente no entra, se le descuentan las páginas restantes, se muestra Parcial: <nombre>, faltan <n> páginas y sigue en el frente. Con la cola vacía muestra Nada para imprimir.'
  - 'Se escribe página (singular) cuando la cantidad es 1. Una cantidad de páginas menor o igual que 0 se rechaza con Error: la cantidad de páginas debe ser mayor que 0.'
  - 'Si scanf no puede leer lo que espera, el programa muestra Error: entrada inválida, libera la cola y termina con código 1. Al terminar, cola_destruir libera los trabajos que quedaron y main muestra Trabajos descartados: <n>.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa y la versión con -fsanitize=address no produce ningún informe.'
exampleOutput: |
  $ ./programa < trabajos.txt
  En cola: informe.pdf (3 páginas), posición 1
  En cola: foto.png (4 páginas), posición 2
  En cola: notas.txt (1 página), posición 3
  Cola: informe.pdf(3) foto.png(4) notas.txt(1)
  Impreso: informe.pdf (3 páginas)
  Parcial: foto.png, faltan 2 páginas
  Cola: foto.png(2) notas.txt(1)
  Error: la cantidad de páginas debe ser mayor que 0
  Impreso: foto.png (2 páginas)
  Impreso: notas.txt (1 página)
  Nada para imprimir
  Cola vacía
  En cola: carta.txt (2 páginas), posición 1
  En cola: menu.pdf (1 página), posición 2
  Cola: carta.txt(2) menu.pdf(1)
  Trabajos descartados: 2
extensionChallenges:
  - 'Agrega cancelar <nombre>, que quite un trabajo de cualquier posición de la cola. Cuida el caso en que el cancelado es el último: final debe apuntar al nuevo último.'
  - 'Agrega prioridad urgente: enviar-urgente <nombre> <páginas> pone el trabajo en el frente. ¿Sigue siendo una cola FIFO?'
  - 'Reescribe la cola sobre el arreglo circular de la lección con capacidad 4 y muestra Error: cola llena cuando no hay lugar.'
deliveryTips:
  - 'La secuencia imprimir 10 (que vacía la cola) seguida de enviar carta.txt 2 es la prueba del invariante: si desencolar no pone final en NULL, AddressSanitizer informa heap-use-after-free en ese enviar.'
  - 'Escribe destruir_trabajo y cola_destruir antes que imprimir, y úsalas en todos los caminos de salida.'
  - 'Una función que devuelva "página" o "páginas" según la cantidad evita repetir el operador condicional en cada printf.'
  - 'En macOS, AddressSanitizer no detecta fugas: comprueba que la cantidad de trabajos creados sea igual a los impresos más los descartados, o usa leaks --atExit -- ./programa < trabajos.txt sobre la versión compilada sin -fsanitize.'
---

## Contexto

Una impresora compartida atiende los trabajos en el orden en que llegan: es una cola FIFO. En este proyecto la impresora tiene, además, un límite de páginas por turno. Un trabajo largo puede quedar a medias en el frente y terminar en el turno siguiente, sin perder su lugar.

Cada trabajo ocupa dos bloques del heap: el nodo y la copia de su nombre. Mientras espera, la cola es su dueña. Cuando termina de imprimirse, `cola_desencolar` **transfiere** el nodo a quien llama, que lo libera. Al final, lo que quedó en la cola se descarta y se libera.

## Consigna

1. Crea el archivo de entrada `trabajos.txt`:

   ```text
   enviar informe.pdf 3
   enviar foto.png 4
   enviar notas.txt 1
   estado
   imprimir 5
   estado
   enviar tesis.pdf 0
   imprimir 10
   imprimir 1
   estado
   enviar carta.txt 2
   enviar menu.pdf 1
   estado
   salir
   ```

2. Escribe `programa.c` a partir de estas declaraciones (los nombres de archivo tienen como máximo 31 caracteres y no tienen espacios, así que se leen con `scanf("%31s", nombre)`):

   ```c
   // Propiedad: la cola es dueña de cada Trabajo, y cada Trabajo de su nombre.
   typedef struct Trabajo {
       char *nombre;
       int paginas;                // páginas que faltan imprimir
       struct Trabajo *siguiente;
   } Trabajo;

   // Invariante: frente y final son ambos NULL o ambos no NULL.
   typedef struct {
       Trabajo *frente;
       Trabajo *final;
       size_t cantidad;
   } Cola;

   // Propiedad: el llamador es dueño del trabajo devuelto. NULL si no hay memoria.
   Trabajo *crear_trabajo(const char *nombre, int paginas);
   void destruir_trabajo(Trabajo *trabajo);

   // Toma la propiedad de trabajo y lo agrega al final.
   void cola_encolar(Cola *cola, Trabajo *trabajo);

   // Quita el trabajo del frente y transfiere su propiedad al llamador.
   // Devuelve NULL si la cola está vacía.
   Trabajo *cola_desencolar(Cola *cola);

   // Libera todos los trabajos y devuelve cuántos había.
   size_t cola_destruir(Cola *cola);
   ```

3. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

4. Compila con AddressSanitizer y ejecuta las dos pruebas. Ninguna debe producir **ningún informe**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address programa.c -o programa
   ./programa < trabajos.txt
   printf "enviar a.txt dos\n" | ./programa
   ```

   La primera debe producir la salida de ejemplo. La segunda muestra `Error: entrada inválida` y `Trabajos descartados: 0`, y termina con código 1.

## Criterios de evaluación

- [ ] La salida para `trabajos.txt` coincide exactamente con la de ejemplo, incluido el singular `página`.
- [ ] Encolar y desencolar son O(1): ninguna de las dos recorre la cola.
- [ ] Al vaciarse la cola, `final` vuelve a `NULL`, y encolar después de vaciarla funciona sin informes de AddressSanitizer.
- [ ] Cada nombre y cada nodo se reservan con comprobación y se liberan una sola vez: al imprimirse por completo o al descartarse.
- [ ] La entrada inválida se detecta con el valor de retorno de `scanf` y termina con código 1 sin fugas.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
