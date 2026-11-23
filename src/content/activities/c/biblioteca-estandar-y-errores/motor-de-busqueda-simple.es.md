---
course: 'c'
lesson: 'biblioteca-estandar-y-errores'
slug: 'motor-de-busqueda-simple'
title: 'Proyecto integrador: Motor de búsqueda simple'
description: 'Proyecto integrador de algoritmos, estructuras y complejidad: un programa que indexa las palabras de un texto en un arreglo dinámico de estructuras, las ordena con qsort, responde búsquedas con bsearch, valida sus argumentos con strtol e informa cada error con códigos de retorno.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 150
objectives:
  - 'Separar un texto en palabras con <ctype.h>, normalizándolas a minúsculas sin caer en comportamiento indefinido.'
  - 'Construir un índice en un arreglo dinámico de estructuras que crece con realloc, y liberarlo en todos los caminos.'
  - 'Ordenar con qsort y buscar con bsearch usando comparadoras correctas, y justificar la complejidad de cada operación.'
  - 'Validar los argumentos con strtol e informar los errores con códigos de retorno, stderr y EXIT_FAILURE.'
requirements:
  - 'El programa se usa como ./buscador <cantidad> [palabra...]: indexa el texto fijo TEXTO del esqueleto, muestra las <cantidad> palabras más frecuentes y después busca cada palabra recibida.'
  - 'Una palabra es una secuencia de letras según isalpha; todo lo demás separa palabras. Cada letra se convierte con tolower después de pasarla a unsigned char. Las palabras de más de 31 letras se recortan a 31.'
  - 'El índice es un arreglo dinámico de Entrada (palabra y apariciones) dentro de un struct Indice con cantidad y capacidad; crece duplicando la capacidad con realloc a través de un puntero temporal, y cada reserva se comprueba.'
  - 'Las funciones que pueden fallar devuelven un código de retorno de un enum (por ejemplo INDICE_OK e INDICE_SIN_MEMORIA) o un bool con parámetro de salida, y main revisa cada uno.'
  - 'Las palabras repetidas se agrupan ordenando el índice alfabéticamente con qsort y recorriéndolo una vez para sumar las apariciones; las búsquedas usan bsearch con la misma comparadora.'
  - 'El ranking de más frecuentes se arma sobre una copia del índice ordenada con qsort por apariciones de mayor a menor y, en caso de empate, alfabéticamente; cada fila se muestra con printf("  %-10s %2d\n", ...).'
  - 'La cantidad se convierte con strtol y debe ser un entero entre 1 y la cantidad de palabras distintas, sin basura al final; si no, se muestra en stderr Cantidad inválida: "<texto>" (debe ser un entero entre 1 y N) y el programa termina con EXIT_FAILURE. Sin argumentos muestra Uso: ./buscador <cantidad> [palabra...] y también termina con EXIT_FAILURE.'
  - 'Las palabras buscadas se normalizan igual que el texto (Datos y datos son la misma palabra) y se informa N aparición, N apariciones o no aparece.'
  - 'Toda la memoria se libera en todos los caminos con una salida única (goto limpiar); el programa compila sin advertencias y AddressSanitizer no informa ningún error.'
  - 'La salida coincide exactamente con la del ejemplo.'
exampleOutput: |
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -fsanitize=address -g buscador.c -o buscador
  $ ./buscador 5 Datos error gato
  Texto: 38 palabras, 24 distintas
  Las 5 más frecuentes:
    programa    5
    datos       4
    memoria     4
    el          3
    la          2
  Búsquedas:
    datos: 4 apariciones
    error: 1 aparición
    gato: no aparece
  $ ./buscador tres
  Cantidad inválida: "tres" (debe ser un entero entre 1 y 24)
  $ echo $?
  1
extensionChallenges:
  - 'Agrega la opción de leer el texto de la entrada estándar con getchar hasta EOF cuando el primer argumento sea -, de modo que ./buscador - 3 < notas.txt indexe un archivo redirigido.'
  - 'Agrega un tercer modo que muestre todas las palabras que empiezan con un prefijo: aprovecha que el índice está ordenado para encontrar la primera con una búsqueda binaria propia y recorrer desde ahí.'
  - 'Mide con clock() cuánto tarda indexar un texto repetido mil veces y compara el resultado con una versión que busca cada palabra nueva recorriendo el índice de forma lineal.'
deliveryTips:
  - 'Las letras acentuadas y la ñ no son letras para isalpha en la configuración regional "C": por eso el texto de prueba no tiene acentos. Si usas otro texto, recuerda que esas letras van a cortar las palabras.'
  - 'La clave de bsearch es un puntero a una Entrada, igual que los elementos que recibe la comparadora: arma una Entrada con la palabra buscada ya normalizada y pasa su dirección.'
  - 'Para comprobar los caminos de error, prueba ./buscador, ./buscador 0, ./buscador 25, ./buscador 3x y ./buscador 99999999999999999999 y revisa con echo $? que el código de salida sea 1.'
---

## Contexto

Un buscador de verdad no recorre todos los documentos cada vez que alguien hace una consulta: primero arma un **índice** con las palabras y cuántas veces aparecen, y después responde cada pregunta consultando ese índice. Este proyecto construye una versión pequeña de esa idea con las herramientas de la biblioteca estándar: `<ctype.h>` para separar las palabras, un arreglo dinámico para guardarlas, `qsort` para ordenarlas, `bsearch` para encontrarlas y `strtol` para validar lo que escribe el usuario.

También es un ejercicio de **complejidad**: la forma en que se arma el índice decide si el programa sigue siendo rápido cuando el texto crece.

## Consigna

1. Escribe `buscador.c` a partir de este esqueleto. Puedes agregar las funciones auxiliares que necesites, pero mantén los tipos y la forma de informar errores:

   ```c
   #include <ctype.h>
   #include <errno.h>
   #include <stdio.h>
   #include <stdlib.h>
   #include <string.h>

   enum { MAX_PALABRA = 32 };

   typedef struct {
       char palabra[MAX_PALABRA];
       int apariciones;
   } Entrada;

   typedef struct {
       Entrada *entradas;   // arreglo dinámico, propiedad del índice
       size_t cantidad;     // entradas usadas
       size_t capacidad;    // entradas reservadas
       size_t total;        // palabras leídas, con repeticiones
   } Indice;

   typedef enum {
       INDICE_OK,
       INDICE_SIN_MEMORIA
   } EstadoIndice;

   static const char TEXTO[] =
       "La memoria de un programa guarda datos. El programa lee datos, "
       "ordena los datos y busca datos en la memoria. Si el programa pide "
       "memoria, el programa libera esa memoria al final. Un buen programa "
       "revisa cada error.";

   // Agrega una palabra al final del índice; crece con realloc si hace falta.
   static EstadoIndice agregar(Indice *indice, const char *palabra);

   // Separa el texto en palabras en minúsculas, las ordena y agrupa las repetidas.
   static EstadoIndice indexar(const char *texto, Indice *indice);

   // Comparadoras para qsort y bsearch.
   static int comparar_palabra(const void *a, const void *b);
   static int comparar_frecuencia(const void *a, const void *b);

   // Convierte el texto completo; devuelve false si no es un entero entre minimo y maximo.
   static bool leer_cantidad(const char *texto, long minimo, long maximo, int *resultado);

   int main(int argc, char *argv[]) {
       int estado = EXIT_FAILURE;
       Indice indice = {NULL, 0, 0, 0};
       Entrada *ranking = NULL;

       // 1. valida los argumentos e indexa TEXTO
       // 2. copia el índice en ranking y ordénalo por frecuencia
       // 3. muestra el resumen, el ranking y las búsquedas
       estado = EXIT_SUCCESS;

   limpiar:
       free(ranking);
       free(indice.entradas);
       return estado;
   }
   ```

2. Arma el índice en dos pasos: primero agrega **todas** las palabras con una aparición cada una; después ordénalas con `qsort` y recórrelas una sola vez, juntando las repetidas (quedan contiguas) y sumando sus apariciones.

3. Compila con el comando del curso. El programa debe **compilar sin advertencias**, y durante el desarrollo agrega `-fsanitize=address -g` para que AddressSanitizer revise cada acceso:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   gcc -std=c23 -Wall -Wextra -Wpedantic -fsanitize=address -g buscador.c -o buscador
   ```

   Ejecuta el programa con `-fsanitize=address` en todos los casos de prueba (los correctos y los de error): no debe aparecer ningún informe.

4. Ejecuta `./buscador 5 Datos error gato` y compara con la salida de ejemplo. Prueba también los casos de error de los consejos de entrega.

5. Escribe en un comentario al principio de `buscador.c` la complejidad de cada operación, con *n* palabras en el texto y *m* palabras distintas.

## Criterios de evaluación

Este proyecto integra los módulos de algoritmos, estructuras y complejidad, y se evalúa con la rúbrica general del curso:

| Criterio | Peso | Qué se evalúa |
| --- | --- | --- |
| Correctitud funcional | 25 % | La salida coincide con la del ejemplo; las repetidas se agrupan bien, los empates del ranking se ordenan alfabéticamente y las búsquedas no distinguen mayúsculas de minúsculas. |
| Diseño y organización | 20 % | Funciones cortas con una responsabilidad (separar, agregar, indexar, comparar, convertir, mostrar); `main` solo coordina; sin variables globales modificables. |
| Uso apropiado del lenguaje | 15 % | `<ctype.h>` con `unsigned char`, `strtol` en lugar de `atoi`, `size_t` para tamaños, comparadoras sin restas que puedan desbordar, `qsort` y `bsearch` con la misma comparadora. |
| Gestión de memoria y recursos | 15 % | `realloc` con puntero temporal, cada reserva comprobada, una salida única que libera todo en orden inverso; AddressSanitizer no informa errores ni fugas. |
| Validación y manejo de errores | 10 % | Códigos de retorno revisados, cantidad validada con `strtol` (vacía, con basura, fuera de rango), mensajes en `stderr` y `EXIT_FAILURE` en cada error. |
| Pruebas y depuración | 10 % | Se probaron los casos del ejemplo, los errores de los consejos de entrega y un texto vacío, todos con `-fsanitize=address`. |
| Documentación y legibilidad | 5 % | Comentario de complejidad, comentarios que indican qué devuelve cada función y quién es dueño de cada bloque, nombres claros. |

La complejidad esperada, que el comentario del paso 5 debe justificar:

| Operación | Complejidad | Por qué |
| --- | --- | --- |
| Separar el texto y agregar cada palabra | O(*n*) amortizado | Se recorre el texto una vez; duplicar la capacidad hace que `realloc` copie en total O(*n*) elementos. |
| Ordenar el índice con `qsort` | O(*n* log *n*) | Ordenamiento por comparación de las *n* palabras (cada comparación con `strcmp` cuesta a lo sumo 31 caracteres). |
| Agrupar las repetidas | O(*n*) | Un solo recorrido, porque las iguales quedan contiguas. |
| Ordenar el ranking | O(*m* log *m*) | Se ordena una copia de las *m* palabras distintas. |
| Buscar una palabra con `bsearch` | O(log *m*) | Búsqueda binaria sobre el índice ordenado; una búsqueda lineal costaría O(*m*). |

Lista de control:

- [ ] La salida coincide exactamente con la de ejemplo.
- [ ] `./buscador`, `./buscador 0`, `./buscador 25`, `./buscador 3x` y `./buscador 99999999999999999999` terminan con código 1 y un mensaje en `stderr`.
- [ ] Ninguna función usa `atoi`, y cada `char` pasa por `unsigned char` antes de `<ctype.h>`.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic` y AddressSanitizer no informa ningún error en ninguna de las pruebas.
