---
course: 'c'
lesson: 'archivos'
slug: 'agenda-de-contactos'
title: 'Proyecto integrador: Agenda de contactos'
description: 'Proyecto integrador de cadenas, estructuras y archivos: una agenda que agrega, lista, busca y borra contactos en un arreglo dinámico de estructuras y los conserva entre ejecuciones en un archivo de texto, comprobando cada operación y cerrando el archivo en todos los caminos.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 180
objectives:
  - 'Integrar cadenas, estructuras, memoria dinámica y archivos en un programa que conserva sus datos entre ejecuciones.'
  - 'Cargar y guardar un arreglo dinámico de estructuras en un archivo de texto, validando cada línea leída.'
  - 'Comprobar el resultado de cada operación con archivos y cerrar cada archivo en todos los caminos, incluidos los de error.'
  - 'Elegir y justificar un formato de archivo (texto o binario) según sus ventajas y su portabilidad.'
requirements:
  - 'El programa se usa como ./agenda agregar <nombre> <teléfono> <correo>, ./agenda listar, ./agenda buscar <texto> y ./agenda borrar <nombre>. Cada ejecución carga agenda.txt, hace la operación y, si la operación cambió la agenda, la vuelve a guardar.'
  - 'Los contactos se guardan en un arreglo dinámico de Contacto (nombre de hasta 39 caracteres, teléfono de hasta 19 y correo de hasta 47) dentro de un struct Agenda con cantidad y capacidad, que crece con realloc a través de un puntero temporal.'
  - 'agenda.txt es un archivo de texto con un contacto por línea, en la forma nombre;teléfono;correo. Si no existe (fopen devuelve NULL y errno vale ENOENT), la agenda empieza vacía; cualquier otro error al abrirlo se informa con perror y el programa termina con EXIT_FAILURE.'
  - 'La carga lee línea por línea con fgets y valida cada una (tres campos no vacíos, que entran en su arreglo y terminan en un salto de línea); una línea inválida se informa como agenda.txt: línea N inválida y el programa termina con EXIT_FAILURE sin modificar el archivo. Después del ciclo se revisa ferror.'
  - 'El guardado abre el archivo con "w", informa con perror si fopen falla, comprueba el resultado de cada fprintf y el de fclose, y si alguno falla muestra agenda.txt: no se pudo guardar. En ambos casos el programa termina con EXIT_FAILURE.'
  - 'agregar rechaza los campos vacíos, demasiado largos o que contienen ; con un mensaje en stderr, y rechaza un nombre que ya existe con Ya existe el contacto: <nombre>. borrar informa No existe el contacto: <nombre> si no lo encuentra. Ambos errores terminan con EXIT_FAILURE.'
  - 'listar muestra los contactos ordenados por nombre con qsort, cada uno con printf("%-14s %-14s %s\n", ...), o La agenda está vacía. si no hay ninguno. buscar muestra los contactos cuyo nombre contiene el texto, sin distinguir mayúsculas de minúsculas, y al final la línea N contacto(s) con "<texto>".'
  - 'Cada archivo abierto se cierra exactamente una vez en todos los caminos y la memoria se libera antes de terminar; el programa compila sin advertencias y AddressSanitizer no informa ningún error.'
  - 'La salida coincide exactamente con la del ejemplo, que empieza sin agenda.txt.'
exampleOutput: |
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -fsanitize=address -g agenda.c -o agenda
  $ rm -f agenda.txt
  $ ./agenda listar
  La agenda está vacía.
  $ ./agenda agregar "Luis Gomez" 11-4555-0101 luis@correo.com
  Contacto agregado: Luis Gomez (1 en total)
  $ ./agenda agregar "Ana Paz" 3624-111222 ana@correo.com
  Contacto agregado: Ana Paz (2 en total)
  $ ./agenda agregar "Carla Diaz" 351-600-7788 carla@correo.com
  Contacto agregado: Carla Diaz (3 en total)
  $ ./agenda agregar "Ana Paz" 0000 otra@correo.com
  Ya existe el contacto: Ana Paz
  $ ./agenda listar
  Ana Paz        3624-111222    ana@correo.com
  Carla Diaz     351-600-7788   carla@correo.com
  Luis Gomez     11-4555-0101   luis@correo.com
  $ ./agenda buscar DI
  Carla Diaz     351-600-7788   carla@correo.com
  1 contacto(s) con "DI"
  $ ./agenda borrar "Luis Gomez"
  Contacto borrado: Luis Gomez (2 en total)
  $ ./agenda borrar "Luis Gomez"
  No existe el contacto: Luis Gomez
  $ echo $?
  1
  $ cat agenda.txt
  Ana Paz;3624-111222;ana@correo.com
  Carla Diaz;351-600-7788;carla@correo.com
extensionChallenges:
  - 'Guarda primero en agenda.tmp y, solo si el guardado y el cierre salieron bien, reemplaza agenda.txt con rename (de <stdio.h>): así un error a mitad del guardado nunca deja la agenda a medio escribir.'
  - 'Agrega la orden editar <nombre> <teléfono> <correo>, que cambia los datos de un contacto existente.'
  - 'Escribe una segunda versión que guarde en agenda.dat con fwrite y una cabecera uint32_t con la cantidad, como en la lección, y compara los dos archivos: tamaño, si puedes leerlos con un editor y qué pasaría al copiarlos a otra máquina.'
deliveryTips:
  - 'Para separar los campos de una línea, busca cada ; con strchr, reemplázalo por un carácter nulo y avanza: los tres campos quedan dentro del mismo arreglo de la línea.'
  - 'Si una línea no termina en salto de línea, o fue más larga que el arreglo de fgets o el archivo quedó cortado: trátala como inválida.'
  - 'Prueba los caminos de error a mano: escribe una línea sin ; en agenda.txt con un editor, agrega un nombre de 50 caracteres y quita el permiso de escritura con chmod -w agenda.txt antes de agregar (devuélvelo después con chmod +w agenda.txt).'
---

## Contexto

Hasta ahora, todo lo que tus programas guardaban desaparecía al terminar. Una agenda es el ejemplo clásico de datos que tienen que **sobrevivir** entre ejecuciones: agregas un contacto hoy y lo buscas mañana. Este proyecto junta lo que aprendiste sobre cadenas, estructuras, memoria dinámica y manejo de errores con lo nuevo de esta lección: leer y escribir un archivo comprobando cada paso.

Cada orden es una ejecución distinta del programa, así que el archivo es la única memoria que tiene la agenda. Si se guarda mal, o si se carga sin validar, los datos se pierden.

## Consigna

1. Escribe `agenda.c` a partir de este esqueleto. Puedes agregar funciones auxiliares, pero mantén los tipos y las responsabilidades de cada función:

   ```c
   #include <ctype.h>
   #include <errno.h>
   #include <stdio.h>
   #include <stdlib.h>
   #include <string.h>

   enum { MAX_NOMBRE = 40, MAX_TELEFONO = 20, MAX_CORREO = 48, MAX_LINEA = 128 };

   typedef struct {
       char nombre[MAX_NOMBRE];
       char telefono[MAX_TELEFONO];
       char correo[MAX_CORREO];
   } Contacto;

   typedef struct {
       Contacto *contactos;   // arreglo dinámico, propiedad de la agenda
       size_t cantidad;
       size_t capacidad;
   } Agenda;

   // Agrega un contacto al final; devuelve false si no hay memoria.
   static bool agregar_contacto(Agenda *agenda, const char *nombre,
                                const char *telefono, const char *correo);

   // Carga la agenda desde ruta. Un archivo inexistente es una agenda vacía.
   // Devuelve false si no se pudo abrir por otro motivo o si una línea es inválida.
   static bool cargar(const char *ruta, Agenda *agenda);

   // Guarda la agenda en ruta, una línea por contacto.
   // Devuelve true solo si todas las escrituras y el cierre salieron bien.
   static bool guardar(const char *ruta, const Agenda *agenda);

   // Devuelve true si texto contiene buscado, sin distinguir mayúsculas.
   static bool contiene(const char *texto, const char *buscado);

   int main(int argc, char *argv[]) {
       Agenda agenda = {NULL, 0, 0};
       int estado = EXIT_FAILURE;

       // 1. valida la orden y la cantidad de argumentos
       // 2. carga agenda.txt
       // 3. ejecuta la orden y guarda si la agenda cambió
       estado = EXIT_SUCCESS;

   limpiar:
       free(agenda.contactos);
       return estado;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**, y durante el desarrollo agrega `-fsanitize=address -g` para que AddressSanitizer revise cada acceso a memoria:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   gcc -std=c23 -Wall -Wextra -Wpedantic -fsanitize=address -g agenda.c -o agenda
   ```

   Ejecuta todas las pruebas con `-fsanitize=address`, también las de error: no debe aparecer ningún informe.

3. Borra `agenda.txt` y ejecuta la secuencia de la salida de ejemplo: el programa debe manejar el archivo que todavía no existe y crearlo al primer `agregar`.

4. Escribe en un comentario al principio de `agenda.c` por qué elegiste un archivo de **texto** en lugar de uno binario con `fwrite`. Ten en cuenta que puedes abrirlo y corregirlo con cualquier editor, que no depende del tamaño de los tipos, del relleno de la estructura ni del orden de los bytes de la máquina, y qué precio pagas a cambio (hay que separar y validar cada línea, y el separador `;` no puede aparecer dentro de los campos).

## Criterios de evaluación

Este proyecto integra los módulos de cadenas, estructuras y archivos, y se evalúa con la rúbrica general del curso:

| Criterio | Peso | Qué se evalúa |
| --- | --- | --- |
| Correctitud funcional | 25 % | Las cuatro órdenes funcionan, los datos se conservan entre ejecuciones, el archivo inexistente se maneja como una agenda vacía y la salida coincide con la del ejemplo. |
| Diseño y organización | 20 % | Cargar, guardar, buscar, mostrar y modificar están en funciones separadas; `main` solo interpreta la orden y coordina; las funciones de archivo no mezclan la lógica de la agenda. |
| Uso apropiado del lenguaje | 15 % | Modos de `fopen` correctos, `fgets` con `sizeof`, cadenas siempre terminadas en `'\0'`, `size_t` para tamaños, `<ctype.h>` con `unsigned char`, `qsort` con una comparadora por nombre. |
| Gestión de memoria y recursos | 15 % | Cada `fopen` exitoso tiene exactamente un `fclose` en todos los caminos; `realloc` con puntero temporal; la memoria se libera en todos los caminos; AddressSanitizer no informa errores ni fugas. |
| Validación y manejo de errores | 10 % | Se comprueban `fopen`, cada `fprintf`, `fclose` al guardar y `ferror` al cargar; las líneas inválidas y los argumentos incorrectos se rechazan con mensajes en `stderr` y `EXIT_FAILURE`. |
| Pruebas y depuración | 10 % | Se probaron la secuencia del ejemplo, un archivo con una línea inválida, campos demasiado largos y un archivo sin permiso de escritura, todos con `-fsanitize=address`. |
| Documentación y legibilidad | 5 % | Comentario que justifica el formato del archivo, comentarios que indican qué devuelve cada función y quién es dueño de cada bloque, nombres claros. |

Lista de control:

- [ ] La salida coincide exactamente con la de ejemplo, empezando sin `agenda.txt`.
- [ ] Una línea sin `;` en `agenda.txt` produce `agenda.txt: línea N inválida`, código 1, y el archivo no se modifica.
- [ ] Con `agenda.txt` sin permiso de escritura, `agregar` informa el error y termina con código 1.
- [ ] Ningún camino de error deja un archivo abierto ni memoria sin liberar.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic` y AddressSanitizer no informa ningún error en ninguna de las pruebas.
