---
course: 'c'
lesson: 'cadenas-de-caracteres-y-operaciones'
slug: 'normalizador-de-nombres'
title: 'Normalizador de nombres y usuarios'
description: 'Programa que lee un nombre completo con fgets, lo normaliza (un espacio entre palabras, mayúscula inicial), cuenta las palabras, arma las iniciales y genera un nombre de usuario sin desbordar ningún arreglo.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 60
objectives:
  - 'Leer una línea completa con fgets y quitar el salto de línea.'
  - 'Recorrer cadenas hasta el terminador y construir cadenas nuevas carácter por carácter, terminándolas siempre con el carácter nulo.'
  - 'Respetar la capacidad de cada arreglo destino y distinguirla de la longitud del texto.'
  - 'Contar palabras con el estado dentro o fuera de una palabra.'
requirements:
  - 'Lee el nombre con el mensaje Nombre completo: usando fgets(linea, sizeof linea, stdin) en un arreglo de capacidad 80; si fgets devuelve NULL, muestra No se pudo leer el nombre y termina con return 1;. Quita el salto de línea con strcspn.'
  - 'Una función normaliza el nombre en otro arreglo: elimina los espacios y tabulaciones sobrantes (al principio, al final y repetidos), deja un solo espacio entre palabras, pone la primera letra de cada palabra en mayúscula y el resto en minúscula (solo letras sin tilde, convirtiendo a mano con los rangos de caracteres) y devuelve la cantidad de palabras. Recibe la capacidad del destino y nunca la supera.'
  - 'Si no hay ninguna palabra, muestra No escribiste ningún nombre y termina con return 1;.'
  - 'Las iniciales son la primera letra de cada palabra seguida de un punto, por ejemplo A.L.B.'
  - 'El usuario es la inicial del primer nombre más la última palabra, todo en minúscula, guardado en un arreglo de capacidad 9 (#define MAX_USUARIO 8 y un arreglo de MAX_USUARIO + 1): si no cabe, se trunca a 8 caracteres. Se muestra con su longitud calculada con strlen y %zu.'
  - 'No se usan strcpy, strcat, sprintf ni gets.'
  - 'La salida coincide exactamente con la de los dos ejemplos.'
  - 'Compila sin advertencias con gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa.'
exampleOutput: |
  $ ./programa
  Nombre completo:   ada   LOVELACE byron
  Nombre normalizado: Ada Lovelace Byron
  Palabras: 3
  Iniciales: A.L.B.
  Usuario: abyron (6 caracteres)
  $ ./programa
  Nombre completo: JUAN carlos   santamaria
  Nombre normalizado: Juan Carlos Santamaria
  Palabras: 3
  Iniciales: J.C.S.
  Usuario: jsantama (8 caracteres)
extensionChallenges:
  - 'Si la línea no termina en salto de línea, el nombre era más largo que la capacidad: detéctalo y muestra Nombre demasiado largo en lugar de procesar un nombre cortado.'
  - 'Pide una segunda línea con un usuario existente y, si strcmp indica que coincide con el generado, agrega un 2 al final sin superar la capacidad.'
deliveryTips:
  - 'Prueba una línea con solo espacios, una sola palabra (Cher da el usuario ccher) y un apellido largo que obligue a truncar.'
  - 'Después de construir cada cadena carácter por carácter, escribe el terminador. Si te olvidas, printf seguirá leyendo fuera del texto.'
  - 'Compila también con -fsanitize=address: si alguna escritura supera la capacidad, el sanitizer lo informa.'
---

## Contexto

Los formularios reciben nombres escritos de cualquier manera: con espacios de más, todo en mayúsculas o todo en minúsculas. Antes de guardarlos o generar un nombre de usuario, un programa los **normaliza**.

El trabajo es recorrer una cadena y construir otras, carácter por carácter. Cada arreglo destino tiene una capacidad, y el texto que se escribe en él nunca puede superarla: el usuario, por ejemplo, tiene lugar para 8 caracteres más el `'\0'`.

## Consigna

1. Escribe `programa.c` a partir de este esqueleto:

   ```c
   #include <stdio.h>
   #include <string.h>

   #define CAPACIDAD 80
   #define MAX_USUARIO 8

   size_t normalizar(const char origen[], char destino[], size_t capacidad) {
       // copia las palabras con un solo espacio entre ellas y devuelve cuántas hay
   }

   void iniciales(const char nombre[], char destino[], size_t capacidad) {
       // primera letra de cada palabra seguida de un punto
   }

   void crear_usuario(const char nombre[], char usuario[], size_t capacidad) {
       // inicial del primer nombre más la última palabra, en minúscula
   }

   int main(void) {
       char linea[CAPACIDAD];
       char nombre[CAPACIDAD];
       char siglas[CAPACIDAD];
       char usuario[MAX_USUARIO + 1];

       printf("Nombre completo: ");
       // lee con fgets, quita el salto de línea, valida y muestra los resultados
       return 0;
   }
   ```

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ```

3. Ejecuta dos veces con las entradas de los ejemplos y compara. Después prueba los casos de las sugerencias de entrega.

## Criterios de evaluación

- [ ] La salida para las dos entradas de ejemplo coincide exactamente.
- [ ] Todas las cadenas construidas terminan en `'\0'` y ninguna escritura supera la capacidad de su arreglo; con `-fsanitize=address` no hay reportes.
- [ ] Las funciones reciben las cadenas que solo leen como `const char s[]` y la capacidad de cada destino como parámetro.
- [ ] Una línea vacía o con solo espacios se rechaza con código 1.
- [ ] No aparecen `strcpy`, `strcat`, `sprintf` ni `gets`; los tamaños se muestran con `%zu`.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
