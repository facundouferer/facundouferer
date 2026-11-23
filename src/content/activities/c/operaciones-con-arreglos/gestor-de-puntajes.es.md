---
course: 'c'
lesson: 'operaciones-con-arreglos'
slug: 'gestor-de-puntajes'
title: 'Gestor de puntajes'
description: 'Programa con menú que mantiene una lista de puntajes en un arreglo de capacidad fija: agregar, insertar y eliminar corriendo elementos, invertir y mostrar suma, promedio, máximo y mínimo.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 60
objectives:
  - 'Llevar por separado la capacidad del arreglo y la cantidad usada, y actualizar la cantidad en el llamador.'
  - 'Implementar inserción y eliminación corriendo elementos en el sentido correcto.'
  - 'Escribir cada operación como una función que recibe el arreglo y su cantidad, con const cuando solo lee.'
  - 'Calcular suma, promedio, máximo y posición del mínimo con recorridos.'
requirements:
  - 'Los puntajes se guardan en un arreglo de int de capacidad 6 (#define CAPACIDAD 6) y una variable size_t n con la cantidad usada, que empieza en 0.'
  - 'Un ciclo muestra Opción: y lee un entero. 1 valor agrega al final; 2 posición valor inserta en esa posición (desde 0); 3 posición elimina; 4 muestra la lista y las estadísticas; 5 invierte la lista; 0 muestra Fin y termina. Otra opción muestra Opción inválida. Si una lectura falla, muestra Entrada inválida y termina con return 1;.'
  - 'Las operaciones son funciones con la forma de la lección: mostrar, sumar, maximo, posicion_del_minimo (const int v[], size_t n); insertar(int v[], size_t n, size_t capacidad, size_t pos, int valor) y eliminar(int v[], size_t n, size_t pos) devuelven bool; invertir(int v[], size_t n). Ninguna usa variables globales.'
  - 'Si no se puede agregar porque no hay lugar, muestra Lista llena. Si no se puede insertar, muestra No se pudo insertar en la posición P. Si la posición a eliminar no existe, muestra Posición inválida: P. Las posiciones negativas se rechazan antes de convertirlas a size_t.'
  - 'La opción 4 muestra Lista (n): y los valores; si la lista no está vacía, también la suma, el promedio con dos decimales, el máximo y el mínimo con su posición (si se repite, la primera).'
  - 'La salida coincide exactamente con la del ejemplo para esa entrada.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa
  Opción: 1 10
  Agregado: 10
  Opción: 1 25
  Agregado: 25
  Opción: 1 30
  Agregado: 30
  Opción: 2 1 15
  Insertado 15 en la posición 1
  Opción: 3 2
  Eliminado el 25 de la posición 2
  Opción: 2 9 5
  No se pudo insertar en la posición 9
  Opción: 1 8
  Agregado: 8
  Opción: 4
  Lista (4): 10 15 30 8
  Suma: 63, promedio: 15.75
  Máximo: 30, mínimo: 8 (posición 3)
  Opción: 5
  Lista invertida
  Opción: 4
  Lista (4): 8 30 15 10
  Suma: 63, promedio: 15.75
  Máximo: 30, mínimo: 8 (posición 0)
  Opción: 0
  Fin
extensionChallenges:
  - 'Agrega la opción 6 valor, que elimina todas las apariciones de un valor en una sola pasada, sin llamar a eliminar dentro de un ciclo.'
  - 'Agrega la opción 7, que muestra la lista del último al primero con un ciclo hacia atrás correcto sobre size_t.'
deliveryTips:
  - 'Llena la lista con seis valores y prueba agregar un séptimo: debe aparecer Lista llena. Después elimina la posición 0 y la posición 5 (que ya no existe).'
  - 'Prueba insertar en la posición n (al final) y en la posición n + 1 (inválida).'
  - 'Compila también con -fsanitize=address y repite las pruebas: si algún corrimiento lee o escribe fuera del arreglo, el sanitizer lo informa.'
---

## Contexto

Un arreglo tiene una capacidad fija, pero la lista que guarda crece y se achica: se agregan puntajes, se insertan en el medio, se eliminan. Este proyecto reúne todas las operaciones de la lección en un programa con menú y obliga a mantener coherentes los dos números de siempre: la **capacidad** (6) y la **cantidad usada** `n`.

Las funciones trabajan sobre el arreglo del llamador, pero reciben `n` por valor: por eso `insertar` y `eliminar` informan si pudieron hacer su trabajo y es `main` quien actualiza `n`.

## Consigna

1. Escribe `programa.c` con las funciones pedidas y un `main` con esta estructura:

   ```c
   #include <stdio.h>

   #define CAPACIDAD 6

   // mostrar, sumar, maximo, posicion_del_minimo, insertar, eliminar, invertir

   int main(void) {
       int puntajes[CAPACIDAD] = {0};
       size_t n = 0;
       int opcion;

       do {
           printf("Opción: ");
           if (scanf("%d", &opcion) != 1) {
               printf("Entrada inválida\n");
               return 1;
           }
           switch (opcion) {
           // un case por opción: lee los datos que falten, llama a la función
           // y actualiza n solo si la operación tuvo éxito
           }
       } while (opcion != 0);
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Ejecuta con la entrada del ejemplo y compara. Después recorre las pruebas de las sugerencias de entrega.

## Criterios de evaluación

- [ ] La salida para la entrada del ejemplo coincide exactamente.
- [ ] Insertar corre desde el final hacia la posición y eliminar desde la posición hacia el final; ningún valor se pierde.
- [ ] `n` solo cambia en `main` y solo cuando la operación tuvo éxito; nunca supera la capacidad.
- [ ] Las funciones que solo leen reciben `const int v[]`; el máximo parte de `v[0]` y solo se calcula con `n > 0`.
- [ ] Las posiciones inválidas y la lista llena se informan sin tocar el arreglo; con `-fsanitize=address` no hay reportes.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
