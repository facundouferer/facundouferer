---
course: 'c'
lesson: 'ordenacion-de-arreglos'
slug: 'sistema-de-calificaciones'
title: 'Proyecto integrador: Sistema de calificaciones'
description: 'Proyecto integrador del módulo 4: carga validada de un curso en un arreglo de estructuras, cálculo de promedios y condición, ranking estable por promedio con inserción, copia ordenada por legajo con selección y búsqueda binaria de alumnos.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 150
objectives:
  - 'Integrar arreglos, cadenas, estructuras, enum, funciones, búsqueda y ordenación en un programa completo.'
  - 'Elegir el método de ordenación según lo que se necesita: inserción para un ranking estable y selección para una copia ordenada por clave.'
  - 'Mantener dos vistas de los mismos datos (por promedio y por legajo) y buscar con búsqueda binaria en la que está ordenada por la clave.'
  - 'Validar toda la entrada y respetar los límites de cada arreglo.'
requirements:
  - 'Define MAX_ALUMNOS (30) y CANT_NOTAS (3) con #define, typedef enum { LIBRE, REGULAR, PROMOCIONADO } Condicion; y un typedef struct Alumno con legajo (int), nombre (char[30]), notas (int[CANT_NOTAS]), promedio (double) y condicion (Condicion). Los arreglos de alumnos se declaran con MAX_ALUMNOS elementos y nunca se accede fuera de los primeros n.'
  - 'Una función int leer_entero(const char mensaje[], int minimo, int maximo) muestra el mensaje y repite la pregunta hasta obtener un entero en rango. Si la entrada no es numérica, descarta el resto de la línea con un ciclo de getchar y muestra Error: ingresa un número entero.; si está fuera de rango, muestra Error: el valor debe estar entre minimo y maximo.; si la entrada terminó (EOF), devuelve -1 y el programa termina con return 1;.'
  - 'La carga pide la cantidad de alumnos (1 a 30) y, por cada alumno, el legajo (1 a 99999, sin repetir: si ya existe, muestra Error: el legajo N ya está cargado. y vuelve a preguntar), el nombre con scanf("%29s", ...) y las tres notas en una línea; si alguna nota no está entre 0 y 10, muestra Error: cada nota debe estar entre 0 y 10. y vuelve a pedir las tres.'
  - 'El promedio se calcula con una función que recibe el arreglo de notas y divide como double; la condición es PROMOCIONADO con promedio de 8 o más, REGULAR de 6 a menos de 8 y LIBRE por debajo de 6.'
  - 'El ranking ordena el arreglo de mayor a menor promedio con inserción y comparación estricta, de modo que los empates conservan el orden de carga (Ana antes que Sofia en el ejemplo). Muestra la posición, el legajo, el nombre, el promedio con dos decimales y la condición, el promedio del curso y la cantidad de alumnos por condición, contada en un arreglo indexado por el enum.'
  - 'Antes de ordenar por promedio, el programa copia el arreglo en por_legajo y lo ordena por legajo con selección. La búsqueda por legajo es binaria sobre esa copia y se repite hasta que se ingresa 0.'
  - 'No hay variables globales; las funciones que no se usan fuera del archivo son static.'
  - 'La salida coincide exactamente con la del ejemplo para la misma secuencia de entradas.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic calificaciones.c -o calificaciones.'
exampleOutput: |
  $ ./calificaciones
  === Sistema de calificaciones ===
  Cantidad de alumnos (1 a 30): 40
  Error: el valor debe estar entre 1 y 30.
  Cantidad de alumnos (1 a 30): 5
  -- Alumno 1 --
  Legajo (1 a 99999): 1042
  Nombre: Pedro
  Notas (3, de 0 a 10): 7 8 6
  -- Alumno 2 --
  Legajo (1 a 99999): 1003
  Nombre: Ana
  Notas (3, de 0 a 10): 9 8 11
  Error: cada nota debe estar entre 0 y 10.
  Notas (3, de 0 a 10): 9 8 10
  -- Alumno 3 --
  Legajo (1 a 99999): 1042
  Error: el legajo 1042 ya está cargado.
  Legajo (1 a 99999): 1021
  Nombre: Marta
  Notas (3, de 0 a 10): 5 6 4
  -- Alumno 4 --
  Legajo (1 a 99999): abc
  Error: ingresa un número entero.
  Legajo (1 a 99999): 1010
  Nombre: Luis
  Notas (3, de 0 a 10): 8 7 9
  -- Alumno 5 --
  Legajo (1 a 99999): 1035
  Nombre: Sofia
  Notas (3, de 0 a 10): 9 10 8

  === Ranking por promedio ===
   1. 1003 Ana           9.00 Promocionado
   2. 1035 Sofia         9.00 Promocionado
   3. 1010 Luis          8.00 Promocionado
   4. 1042 Pedro         7.00 Regular
   5. 1021 Marta         5.00 Libre
  Promedio del curso: 7.60
  Promocionados: 3 | Regulares: 1 | Libres: 1

  === Búsqueda por legajo ===
  Legajo a buscar (0 para terminar): 1010
  1010 Luis: notas 8 7 9, promedio 8.00 (Promocionado)
  Legajo a buscar (0 para terminar): 2000
  No hay alumno con legajo 2000.
  Legajo a buscar (0 para terminar): 0
  Fin del programa.
extensionChallenges:
  - 'Agrega una búsqueda por nombre (lineal, con strcmp) y explica por qué no puede ser binaria sobre ninguno de los dos arreglos.'
  - 'Agrega un segundo criterio al ranking: a igual promedio, ordena por nombre. Comprueba que el resultado ya no depende del orden de carga.'
  - 'Cuenta las comparaciones que hacen la inserción y la selección con tus datos y con un curso de 30 alumnos cargados de menor a mayor promedio. Relaciona los números con O(n²) y con el mejor caso de inserción.'
deliveryTips:
  - 'Escribe y prueba las funciones por partes: primero leer_entero con un main pequeño, después el promedio y la condición, después cada ordenamiento con datos escritos en el código.'
  - 'La búsqueda binaria solo es correcta sobre por_legajo. Si buscas en el arreglo ordenado por promedio, a veces no encontrará alumnos que sí están.'
  - 'Para repetir la prueba completa sin escribir cada vez, guarda las entradas en un archivo y ejecuta ./calificaciones < entradas.txt (los datos ingresados no se ven en pantalla, pero los mensajes y resultados sí).'
  - 'Copiar un Alumno con = copia también su arreglo de notas y su nombre: es justo lo que necesitas para armar por_legajo.'
---

## Contexto

Este es el proyecto integrador del módulo 4. Vas a construir el sistema de calificaciones de un curso: carga los alumnos con sus notas, calcula promedios y condiciones, arma un ranking y permite consultar a cualquier alumno por su legajo.

Es un programa pequeño, pero con las decisiones de uno real. Los datos vienen del teclado y pueden estar mal escritos. Hay que elegir qué método de ordenación usar para cada vista: el ranking necesita estabilidad (dos alumnos con el mismo promedio no deben cambiar de orden sin motivo) y la búsqueda necesita el arreglo ordenado por la clave que se busca.

No necesitas nada que no hayas visto: arreglos, cadenas, estructuras con `enum`, funciones, `scanf` validado, búsqueda lineal y binaria, e inserción y selección. Todavía no hay memoria dinámica, así que el curso tiene un máximo fijo de alumnos.

## Consigna

1. Escribe `calificaciones.c` a partir de este esqueleto:

   ```c
   #include <stdbool.h>
   #include <stdio.h>

   #define MAX_ALUMNOS 30
   #define CANT_NOTAS 3
   #define LEGAJO_MAX 99999

   typedef enum { LIBRE, REGULAR, PROMOCIONADO } Condicion;

   typedef struct {
       int legajo;
       char nombre[30];
       int notas[CANT_NOTAS];
       double promedio;
       Condicion condicion;
   } Alumno;

   static void descartar_linea(void) {
       int c;
       while ((c = getchar()) != '\n' && c != EOF) {
       }
   }

   // Devuelve un entero entre minimo y maximo (minimo >= 0), o -1 si la entrada terminó.
   static int leer_entero(const char mensaje[], int minimo, int maximo);

   // Lee CANT_NOTAS notas entre 0 y 10. Devuelve false si la entrada terminó.
   static bool leer_notas(int notas[]);

   static double calcular_promedio(const int notas[]);
   static Condicion condicion_de(double promedio);
   static void ordenar_por_promedio(Alumno v[], int n); // inserción, de mayor a menor, estable
   static void ordenar_por_legajo(Alumno v[], int n);   // selección, de menor a mayor
   static int buscar_por_legajo(const Alumno v[], int n, int legajo); // binaria; requiere v ordenado por legajo

   int main(void) {
       Alumno curso[MAX_ALUMNOS];
       Alumno por_legajo[MAX_ALUMNOS];

       printf("=== Sistema de calificaciones ===\n");
       // 1. carga validada
       // 2. copia en por_legajo y ordénala por legajo
       // 3. ordena curso por promedio y muestra el ranking y el resumen
       // 4. búsquedas por legajo hasta 0
       return 0;
   }
   ```

   Puedes agregar las funciones auxiliares que necesites (por ejemplo, una búsqueda lineal para detectar legajos repetidos durante la carga, o una función que muestre la condición con un `switch`).

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**. El comando general (`gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa`) aplicado a este proyecto es:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic calificaciones.c -o calificaciones
   ```

3. Ejecuta con la secuencia de entradas del ejemplo y compara. Prueba además: un solo alumno; treinta alumnos; una nota con letras (`8 x 9`); cortar la entrada con Ctrl+D en medio de la carga (el programa debe terminar con código 1, sin ciclar); y buscar el primer y el último legajo del curso.

4. Entrega `calificaciones.c` y un archivo `pruebas.txt` con las entradas que probaste, la salida esperada y la obtenida.

## Criterios de evaluación

Además de la lista de requisitos, el proyecto se evalúa con esta rúbrica (adaptada de la rúbrica general del curso: todavía no hay memoria dinámica, así que el criterio de memoria evalúa los límites de los arreglos y su tamaño correcto):

| Criterio | Peso | Qué se evalúa |
| --- | --- | --- |
| Correctitud funcional | 25 % | Promedios, condiciones, ranking, resumen y búsquedas correctos; la salida coincide con la del ejemplo; los empates respetan el orden de carga. |
| Diseño y organización | 20 % | Funciones cortas con una responsabilidad (leer, calcular, ordenar, buscar, mostrar); `main` solo coordina; ayudantes `static`; sin variables globales. |
| Uso apropiado del lenguaje | 15 % | `struct` con `typedef` y `enum` para la condición; constantes con `#define`; división como `double`; `const` en los parámetros de solo lectura; `strcmp` y no `==` para cadenas; copia de registros con `=`. |
| Gestión de memoria y recursos | 15 % | Arreglos dimensionados con `MAX_ALUMNOS` y `CANT_NOTAS`; ningún acceso fuera de los primeros `n` elementos ni a `v[-1]` (en inserción, `j >= 0` va primero); `scanf("%29s", ...)` con ancho para no desbordar `nombre`; ningún índice devuelto por una búsqueda se usa sin comprobar `-1`. |
| Validación y manejo de errores | 10 % | Cada `scanf` validado; línea inválida descartada; rangos, notas y legajos repetidos comprobados con los mensajes pedidos; fin de la entrada manejado sin ciclos infinitos. |
| Pruebas y depuración | 10 % | `pruebas.txt` cubre la carga válida, cada error, los empates, el primer y el último legajo, un legajo inexistente y el fin de la entrada. |
| Documentación y legibilidad | 5 % | Cada función documenta qué hace y qué requiere (por ejemplo, que el arreglo esté ordenado por legajo); nombres claros; formato consistente. |

Lista de control:

- [ ] La salida coincide exactamente con la de ejemplo para la misma secuencia de entradas.
- [ ] El ranking usa inserción estable y la copia por legajo usa selección.
- [ ] La búsqueda binaria trabaja sobre `por_legajo` y encuentra el primer y el último legajo.
- [ ] Ningún acceso sale de los límites de los arreglos.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
