---
course: 'c'
lesson: 'depuracion-y-sanitizers'
slug: 'depura-el-informe-de-temperaturas'
title: 'Depura el informe de temperaturas'
description: 'Recibes un programa con cuatro errores y debes diagnosticarlos con las advertencias del compilador, una sesión de depurador y AddressSanitizer, corregirlos uno por uno y verificar que el programa queda limpio.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 60
objectives:
  - 'Aplicar el método de depuración: reproducir, aislar, formular una hipótesis, corregir una sola cosa y verificar.'
  - 'Leer una advertencia del compilador y un informe de AddressSanitizer para localizar un error.'
  - 'Inspeccionar una función con un depurador o con printf y justificar cada corrección con evidencia.'
  - 'Dejar el programa sin advertencias, sin informes de sanitizers y con la memoria liberada.'
requirements:
  - 'Compilas el programa original con -Wall -Wextra -Wpedantic y anotas la advertencia que muestra, con su línea.'
  - 'Compilas con -g -fsanitize=address,undefined, ejecutas y anotas el tipo de error, la línea de la escritura inválida y la línea donde se reservó el bloque.'
  - 'Corriges los cuatro errores uno por uno, ejecutando el programa después de cada corrección, y registras en un archivo notas.txt, por cada error, la línea, el síntoma, la hipótesis y el cambio.'
  - 'El programa corregido muestra exactamente la salida del ejemplo.'
  - 'El programa corregido compila sin advertencias y se ejecuta con -fsanitize=address,undefined sin ningún informe.'
  - 'Libera con free todo bloque reservado con malloc.'
  - 'Agregas dos assert en main que comprueban el resultado esperado de maximo y de sobre_promedio para estos datos.'
exampleOutput: |
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address,undefined programa.c -o programa
  $ ./programa
  Temperaturas (4): -3 -1 -4 -2
  Máxima: -1
  Promedio: -2.50
  Sobre el promedio: 2
extensionChallenges:
  - 'Compila también con -Wconversion y -Wshadow, interpreta cada advertencia nueva y decide si corresponde corregirla o no.'
  - 'Escribe una función verificar_resultados que compruebe el promedio con una tolerancia y agrégala a tus assert, de modo que un regreso del error de la división entera sea detectado.'
deliveryTips:
  - 'Corrige un error por vez y vuelve a ejecutar: así sabes cuál cambio arregló cuál síntoma.'
  - 'El programa con el error de memoria puede cerrarse de golpe, mostrar basura o parecer funcionar según la máquina: confía en el sanitizer, no en lo que ves al ejecutarlo sin él.'
  - 'Después de corregir el error de memoria, los otros tres errores se ven en la salida: el máximo y el promedio no coinciden con lo que calculas a mano.'
---

## Contexto

Un programa calcula la temperatura máxima, el promedio y cuántas mediciones superan el promedio. Su autor lo probó con datos de invierno, todos bajo cero, y nada de lo que imprime tiene sentido. Además, a veces se cierra sin mostrar nada.

Tu trabajo no es reescribirlo, sino **depurarlo**: encontrar cada error con una herramienta, entender por qué ocurre y corregirlo con el cambio mínimo.

## Consigna

1. Guarda este programa como `programa.c` **sin modificarlo todavía**:

   ```c
   #include <stdio.h>
   #include <stdlib.h>

   #define MAX 8

   int *copiar(const int datos[], int n) {
       int *copia = malloc(n * sizeof(int));
       if (copia == NULL) {
           return NULL;
       }
       for (int i = 0; i <= n; i++) {
           copia[i] = datos[i];
       }
       return copia;
   }

   int maximo(const int v[], int n) {
       int max = 0;
       for (int i = 0; i < n; i++) {
           if (v[i] > max) {
               max = v[i];
           }
       }
       return max;
   }

   double promedio(const int v[], int n) {
       int suma = 0;
       for (int i = 0; i < n; i++) {
           suma += v[i];
       }
       return suma / n;
   }

   int sobre_promedio(const int v[], int n, double prom) {
       int cuenta = 0;
       int sin_usar;
       for (int i = 0; i < n; i++) {
           if (v[i] > prom) {
               cuenta++;
           }
       }
       return cuenta;
   }

   int main(void) {
       int datos[MAX] = {-3, -1, -4, -2};
       int n = 4;
       int *temps = copiar(datos, n);
       if (temps == NULL) {
           return 1;
       }
       printf("Temperaturas (%d):", n);
       for (int i = 0; i < n; i++) {
           printf(" %d", temps[i]);
       }
       printf("\n");
       double prom = promedio(temps, n);
       printf("Máxima: %d\n", maximo(temps, n));
       printf("Promedio: %.2f\n", prom);
       printf("Sobre el promedio: %d\n", sobre_promedio(temps, n, prom));
       return 0;
   }
   ```

2. **Reproduce y aísla.** Compila con las advertencias del curso y anota lo que dice el compilador:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Compila con los sanitizers, ejecuta y anota el informe (tipo de error, línea de la escritura y línea de la reserva):

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address,undefined programa.c -o programa
   ./programa
   ```

4. **Corrige un error por vez**, en este orden: el de memoria que informa AddressSanitizer, la advertencia del compilador, el valor equivocado de la máxima y el del promedio. Después de cada cambio, vuelve a compilar y ejecutar. Para el máximo y el promedio, calcula a mano el resultado correcto con los datos `-3 -1 -4 -2` y ayúdate de un depurador (`break maximo`, `next`, `print max`) o de un `printf` temporal que luego borras.

5. Agrega a `main`, antes del `return`, dos `assert` que comprueben `maximo(temps, n) == -1` y `sobre_promedio(temps, n, prom) == 2`, e incluye `<assert.h>`.

6. Escribe en `notas.txt` una entrada por error con: línea, síntoma, hipótesis y cambio. Verifica el resultado final con el comando del paso 3: el programa debe **compilar sin advertencias**, ejecutar con `-fsanitize=address,undefined` **sin reportes** y mostrar la salida de ejemplo.

## Criterios de evaluación

- [ ] `notas.txt` registra los cuatro errores con línea, síntoma, hipótesis y cambio, y las hipótesis se apoyan en una advertencia, un informe o una sesión del depurador.
- [ ] La salida coincide exactamente con la del ejemplo.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
- [ ] Ejecuta con `-fsanitize=address,undefined` sin ningún informe.
- [ ] Todo bloque reservado con `malloc` se libera, y cada corrección cambia una sola cosa.
- [ ] Los dos `assert` están en `main` y pasan.
