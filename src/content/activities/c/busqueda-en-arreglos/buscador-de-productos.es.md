---
course: 'c'
lesson: 'busqueda-en-arreglos'
slug: 'buscador-de-productos'
title: 'Buscador de productos'
description: 'Programa que busca productos de un catálogo ordenado por código con búsqueda binaria, cuenta las comparaciones de la búsqueda binaria y de la lineal para compararlas, y busca además un producto por nombre con búsqueda lineal.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 50
objectives:
  - 'Implementar la búsqueda binaria sobre un arreglo de estructuras ordenado por una clave, con el medio calculado sin desbordamiento.'
  - 'Implementar la búsqueda lineal por un campo de texto con strcmp.'
  - 'Medir el costo de cada método contando comparaciones y relacionarlo con O(n) y O(log n).'
requirements:
  - 'Define typedef struct Producto con codigo (int), nombre (char[30]), precio (double) y stock (int), y un arreglo catalogo con los ocho productos de la tabla de la consigna, ordenados por código; la cantidad se calcula con sizeof.'
  - 'int buscar_por_codigo(const Producto v[], int n, int codigo) es una búsqueda binaria que devuelve el índice o -1, con medio = inicio + (fin - inicio) / 2 y el ciclo while (inicio <= fin).'
  - 'int pasos_binaria(const Producto v[], int n, int codigo) e int pasos_lineal(const Producto v[], int n, int codigo) devuelven cuántos elementos revisa cada método hasta encontrar el código o descartarlo.'
  - 'int buscar_por_nombre(const Producto v[], int n, const char nombre[]) es una búsqueda lineal con strcmp que devuelve el índice o -1.'
  - 'main repite la pregunta Código a buscar (0 para terminar): hasta que se ingresa 0. Cada scanf se valida: si no devuelve 1, muestra Entrada inválida y termina con return 1;. Ningún resultado se usa como índice sin comprobar antes que no sea -1.'
  - 'Después lee un nombre con scanf("%29s", nombre) y muestra su código o el mensaje No hay ningún producto llamado seguido del nombre.'
  - 'La salida coincide exactamente con la del ejemplo para la misma secuencia de entradas.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa
  Catálogo: 8 productos ordenados por código
  Código a buscar (0 para terminar): 1068
  Compas: precio 1200.00, stock 5 (comparaciones: binaria 2, lineal 6)
  Código a buscar (0 para terminar): 1010
  Lapiz: precio 120.00, stock 40 (comparaciones: binaria 3, lineal 1)
  Código a buscar (0 para terminar): 1050
  No existe el código 1050 (comparaciones: binaria 3, lineal 8)
  Código a buscar (0 para terminar): 1089
  Marcador: precio 450.00, stock 30 (comparaciones: binaria 4, lineal 8)
  Código a buscar (0 para terminar): 0
  Nombre a buscar: Regla
  Regla tiene código 1033
extensionChallenges:
  - 'Agrega un modo que busque todos los códigos del 1000 al 1100 y muestre el total de comparaciones de cada método. Explica la diferencia con la tabla de complejidad de la lección.'
  - 'Escribe una versión recursiva de buscar_por_codigo que reciba inicio y fin, y comprueba que devuelve lo mismo que la iterativa para todos los códigos del catálogo y para algunos que no están.'
  - 'Cambia buscar_por_nombre para que no distinga mayúsculas de minúsculas, comparando carácter por carácter y pasando a minúscula las letras entre ''A'' y ''Z'' con aritmética de caracteres.'
deliveryTips:
  - 'Sigue a mano la búsqueda de 1068 con una tabla de inicio, fin y medio antes de programar: deben salir 2 comparaciones.'
  - 'Un código que no está también tiene un costo: la búsqueda lineal revisa los ocho productos y la binaria solo hasta que la zona queda vacía.'
  - 'Si la búsqueda binaria no encuentra un código que sí está, revisa que el catálogo esté ordenado por código y que la condición sea inicio <= fin.'
---

## Contexto

Una librería tiene su catálogo de productos ordenado por código. El mostrador recibe consultas todo el día: "¿cuánto sale el 1068?", "¿hay stock del 1010?". Con un catálogo ordenado, la búsqueda binaria responde mirando muy pocos productos. Para comprobarlo, el programa cuenta cuántos productos revisa cada método.

Pero a veces el cliente no sabe el código, solo el nombre. Como el catálogo no está ordenado por nombre, ahí no queda otra que la búsqueda lineal.

## Consigna

1. Usa este catálogo, ya ordenado por código:

   | Código | Nombre | Precio | Stock |
   | --- | --- | --- | --- |
   | 1010 | Lapiz | 120.00 | 40 |
   | 1025 | Goma | 80.00 | 25 |
   | 1033 | Regla | 300.00 | 15 |
   | 1047 | Cuaderno | 950.00 | 0 |
   | 1052 | Tijera | 640.00 | 8 |
   | 1068 | Compas | 1200.00 | 5 |
   | 1071 | Carpeta | 700.00 | 12 |
   | 1089 | Marcador | 450.00 | 30 |

2. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>
   #include <string.h>

   typedef struct {
       int codigo;
       char nombre[30];
       double precio;
       int stock;
   } Producto;

   // Requiere v ordenado por codigo. Devuelve el índice o -1.
   int buscar_por_codigo(const Producto v[], int n, int codigo) {
       // búsqueda binaria
   }

   int pasos_binaria(const Producto v[], int n, int codigo) {
       // misma búsqueda, pero cuenta los elementos revisados
   }

   int pasos_lineal(const Producto v[], int n, int codigo) {
       // recorre desde el principio y cuenta los elementos revisados
   }

   int buscar_por_nombre(const Producto v[], int n, const char nombre[]) {
       // búsqueda lineal con strcmp
   }

   int main(void) {
       Producto catalogo[] = {
           {1010, "Lapiz", 120.0, 40},
           // los otros siete productos
       };
       int n = (int)(sizeof catalogo / sizeof catalogo[0]);

       printf("Catálogo: %d productos ordenados por código\n", n);
       // ciclo de consultas por código y búsqueda por nombre
       return 0;
   }
   ```

3. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

4. Ejecuta con la secuencia de entradas del ejemplo y compara. Prueba también un código menor que todos (900), uno mayor que todos (2000), el nombre `Tiza` y una letra en lugar de un código.

## Criterios de evaluación

- [ ] La salida coincide exactamente con la de ejemplo para la misma secuencia de entradas.
- [ ] La búsqueda binaria usa `inicio <= fin`, `medio + 1`, `medio - 1` y el medio sin desbordamiento.
- [ ] La búsqueda por nombre es lineal y compara con `strcmp`, no con `==`.
- [ ] Los contadores de comparaciones coinciden con el seguimiento a mano.
- [ ] Ningún índice se usa sin comprobar que no sea `-1`, y las entradas no numéricas terminan con código 1.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
