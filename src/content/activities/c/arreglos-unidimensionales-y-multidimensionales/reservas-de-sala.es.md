---
course: 'c'
lesson: 'arreglos-unidimensionales-y-multidimensionales'
slug: 'reservas-de-sala'
title: 'Reservas en una sala de cine'
description: 'Programa que guarda las butacas de una sala en una matriz de 4 filas por 6 asientos, valida cada reserva contra los límites de la matriz, rechaza asientos ocupados y muestra el mapa de la sala.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 45
objectives:
  - 'Declarar e inicializar en cero un arreglo bidimensional con tamaños definidos por constantes.'
  - 'Validar índices que vienen del usuario antes de usarlos, convirtiendo la numeración desde 1 en índices desde 0.'
  - 'Recorrer una matriz por filas y pasarla a funciones con la cantidad de columnas en el parámetro.'
requirements:
  - 'La sala es una matriz de enteros de FILAS por ASIENTOS (#define FILAS 4 y #define ASIENTOS 6) inicializada con = {0}; un 1 marca un asiento ocupado.'
  - 'Un ciclo pide Reserva (fila asiento, 0 0 para terminar): y lee dos enteros; si scanf no devuelve 2, muestra Entrada inválida y termina con return 1;. La entrada 0 0 termina las reservas.'
  - 'El usuario numera filas y asientos desde 1. Si la fila no está entre 1 y FILAS o el asiento no está entre 1 y ASIENTOS, muestra Fuera de la sala: fila F, asiento A y no toca la matriz.'
  - 'Si el asiento ya está ocupado muestra El asiento F-A ya está ocupado; si no, lo marca y muestra Reservado: fila F, asiento A.'
  - 'Una función void mostrar_sala(int sala[][ASIENTOS], size_t filas) imprime el mapa con L para libre y X para ocupado, con el formato del ejemplo.'
  - 'Una función int ocupados_en_fila(int sala[][ASIENTOS], size_t fila) cuenta los ocupados de una fila; con ella se muestran el total y la fila con más ocupados (si hay empate, la de número menor).'
  - 'La salida coincide exactamente con la del ejemplo para esa entrada.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa
  Reserva (fila asiento, 0 0 para terminar): 1 2
  Reservado: fila 1, asiento 2
  Reserva (fila asiento, 0 0 para terminar): 3 5
  Reservado: fila 3, asiento 5
  Reserva (fila asiento, 0 0 para terminar): 1 2
  El asiento 1-2 ya está ocupado
  Reserva (fila asiento, 0 0 para terminar): 5 1
  Fuera de la sala: fila 5, asiento 1
  Reserva (fila asiento, 0 0 para terminar): 3 4
  Reservado: fila 3, asiento 4
  Reserva (fila asiento, 0 0 para terminar): 3 6
  Reservado: fila 3, asiento 6
  Reserva (fila asiento, 0 0 para terminar): 0 0
  Mapa de la sala (L libre, X ocupado):
      1 2 3 4 5 6
  F1  L X L L L L
  F2  L L L L L L
  F3  L L L X X X
  F4  L L L L L L
  Ocupados: 4 de 24
  Fila con más ocupados: 3 (3)
extensionChallenges:
  - 'Agrega la opción de cancelar una reserva con un asiento negativo (por ejemplo, 3 -4 libera la fila 3, asiento 4), validando igual los límites.'
  - 'Muestra al final el porcentaje de ocupación de cada fila con un decimal.'
deliveryTips:
  - 'Prueba los bordes: 1 1, 4 6, 0 3, 4 7 y -1 2. Los dos primeros son válidos y los otros tres deben rechazarse sin tocar la matriz.'
  - 'El usuario dice "fila 1" y la matriz usa el índice 0: resta 1 solo después de validar.'
  - 'Compila también con -fsanitize=address: si algún índice se sale de la matriz, el sanitizer lo informa.'
---

## Contexto

Una sala de cine es una matriz natural: filas de butacas, y en cada fila asientos numerados. Guardarla en un arreglo bidimensional permite consultar cualquier butaca con dos índices, en un paso.

El riesgo es el mismo que en cualquier arreglo: los números los escribe el usuario, y C no comprueba los límites. Una reserva para la fila 5 en una sala de 4 filas tiene que rechazarse **antes** de tocar la matriz.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   #define FILAS 4
   #define ASIENTOS 6

   void mostrar_sala(int sala[][ASIENTOS], size_t filas) {
       // imprime el encabezado y una línea por fila
   }

   int ocupados_en_fila(int sala[][ASIENTOS], size_t fila) {
       // cuenta los asientos ocupados de esa fila
   }

   int main(void) {
       int sala[FILAS][ASIENTOS] = {0};
       int fila, asiento;

       while (true) {
           printf("Reserva (fila asiento, 0 0 para terminar): ");
           // lee, valida límites y ocupación, y reserva
       }

       mostrar_sala(sala, FILAS);
       // total de ocupados y fila con más ocupados
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Ejecuta con la entrada del ejemplo y compara. Prueba también los bordes de las sugerencias de entrega y una entrada con letras.

## Criterios de evaluación

- [ ] La salida para la entrada del ejemplo coincide exactamente.
- [ ] Ninguna fila ni asiento fuera de rango llega a usarse como índice; con `-fsanitize=address` no hay reportes.
- [ ] Un asiento ocupado no se vuelve a reservar.
- [ ] Los tamaños aparecen solo en los `#define`: cambiar `FILAS` o `ASIENTOS` no exige tocar los ciclos.
- [ ] Las dos funciones reciben la matriz como `int sala[][ASIENTOS]` y la cantidad de filas o la fila aparte.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
