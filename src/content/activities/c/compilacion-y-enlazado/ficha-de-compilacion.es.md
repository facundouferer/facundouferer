---
course: 'c'
lesson: 'compilacion-y-enlazado'
slug: 'ficha-de-compilacion'
title: 'Ficha de compilación paso a paso'
description: 'Programa que muestra una ficha armada con macros y termina con un estado de salida definido, compilado etapa por etapa con el comando del curso y acompañado de un registro de errores provocados a propósito.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 30
objectives:
  - 'Recorrer las cuatro etapas de la compilación deteniendo gcc después de cada una.'
  - 'Distinguir archivo fuente, archivo objeto y ejecutable.'
  - 'Reconocer en qué etapa falla un programa leyendo el mensaje del compilador.'
  - 'Usar macros con #define y el estado de salida de main.'
requirements:
  - 'El programa se llama programa.c y define con #define las macros PROGRAMA ("Ficha de compilación"), ESTANDAR ("ISO C23") y ESTADO_OK (0).'
  - 'Cada línea de la ficha se muestra con printf uniendo cadenas literales y macros, por ejemplo printf("Estándar: " ESTANDAR "\n");, sin escribir a mano el texto de las macros.'
  - 'main termina con return ESTADO_OK; y echo $? muestra 0 después de ejecutarlo.'
  - 'La salida del programa coincide exactamente con la del ejemplo.'
  - 'Se genera primero programa.o con gcc -std=c23 -Wall -Wextra -Wpedantic -c programa.c y después el ejecutable con gcc programa.o -o programa.'
  - 'Un archivo errores.txt registra tres errores provocados a propósito (un #include mal escrito, un punto y coma que falta y una llamada a prinft compilada con -std=c89), con el mensaje obtenido y la etapa que falló en cada caso.'
  - 'La versión final compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ gcc -std=c23 -Wall -Wextra -Wpedantic -c programa.c
  $ gcc programa.o -o programa
  $ ./programa
  === Ficha de compilación ===
  Estándar: ISO C23
  1. Preprocesado: gcc -E
  2. Compilación: gcc -S
  3. Ensamblado: gcc -c
  4. Enlazado: gcc programa.o -o programa
  Advertencias: 0
  $ echo $?
  0
extensionChallenges:
  - 'Agrega la macro ESTADO_ERROR con el valor 2, haz que main la devuelva y comprueba el cambio con echo $?.'
  - 'Ejecuta gcc -std=c23 -E programa.c y anota en errores.txt cómo quedó la línea del título después del preprocesado.'
deliveryTips:
  - 'Dos cadenas literales seguidas, como "Estándar: " ESTANDAR "\n", se unen en una sola después del preprocesado: no hace falta ningún operador entre ellas.'
  - 'Corrige siempre el primer error de la lista: muchas veces los siguientes son consecuencia de él.'
---

## Contexto

Cuando escribes `gcc programa.c -o programa` parece que ocurre una sola cosa, pero detrás hay cuatro etapas: preprocesado, compilación, ensamblado y enlazado. Saber en qué etapa estás es lo que te permite leer un mensaje de error y corregirlo en el lugar correcto.

En este proyecto vas a escribir un programa mínimo que use macros, compilarlo deteniéndote en el archivo objeto, enlazarlo por separado y, después, romperlo a propósito para reconocer cada tipo de error.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>

   #define PROGRAMA "Ficha de compilación"
   // define ESTANDAR y ESTADO_OK

   int main(void) {
       printf("=== " PROGRAMA " ===\n");
       // muestra el resto de las líneas de la ficha
       return ESTADO_OK;
   }
   ```

2. Compila hasta el objeto, enlaza y ejecuta como en la salida de ejemplo. Comprueba el estado de salida con `echo $?`.

3. Compila también en un solo paso con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

4. Provoca los tres errores del requisito, uno por vez, y registra en `errores.txt` el mensaje que obtuviste y la etapa que falló (preprocesado, compilación o enlazado). Vuelve a dejar el programa correcto antes de entregarlo.

## Criterios de evaluación

- [ ] La salida coincide exactamente con la de ejemplo y el estado de salida es 0.
- [ ] Los textos de la ficha usan las macros, no copias escritas a mano.
- [ ] Se entregan `programa.c` y `errores.txt`; los tres errores están clasificados en la etapa correcta.
- [ ] La explicación del error de `prinft` distingue lo que pasa con `-std=c23` (error de compilación) de lo que pasa con `-std=c89` (error de enlazado).
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
