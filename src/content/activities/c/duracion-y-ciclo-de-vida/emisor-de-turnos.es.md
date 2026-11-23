---
course: 'c'
lesson: 'duracion-y-ciclo-de-vida'
slug: 'emisor-de-turnos'
title: 'Emisor de turnos sin punteros colgantes'
description: 'Programa que emite turnos numerados con un contador static, devuelve estructuras por valor y arma el texto de cada turno en un búfer que provee quien llama.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 35
objectives:
  - 'Usar una variable local `static` para conservar un valor entre llamadas.'
  - 'Devolver resultados sin punteros colgantes: por valor y en un búfer del llamador.'
  - 'Identificar la duración de almacenamiento de cada variable del programa.'
requirements:
  - '`int proximo_turno(void)` devuelve 1, 2, 3… en llamadas sucesivas usando una variable local `static`; no hay variables globales.'
  - '`struct turno crear_turno(char sector)` devuelve **por valor** una estructura `struct turno { char sector; int numero; }` con el número obtenido de `proximo_turno`.'
  - '`bool formatear_turno(char *destino, size_t capacidad, struct turno t)` escribe el texto con el formato `A-001` usando `snprintf` y devuelve `false` si no entra en la capacidad.'
  - '`main` emite turnos para los sectores `A`, `B` y `A` en un búfer de 16 caracteres, y después intenta formatear un turno del sector `C` en un búfer de 4 caracteres para mostrar el aviso de búfer chico.'
  - 'La última línea muestra el número que devolvería la próxima llamada a `proximo_turno`.'
  - 'Ninguna función devuelve la dirección de una variable automática, y cada función tiene un comentario que indica la duración de almacenamiento de sus variables.'
  - 'Compila sin advertencias con `gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa`.'
exampleOutput: |
  === Turnos ===
  Turno emitido: A-001
  Turno emitido: B-002
  Turno emitido: A-003
  Búfer chico: no entra el turno 4
  Siguiente número: 5
extensionChallenges:
  - 'Agrega `const char *nombre_sector(char sector)` que devuelva `"Cajas"`, `"Consultas"` o `"Reclamos"`. Explica en un comentario por qué devolver la dirección de una cadena literal no deja un puntero colgante.'
  - 'Escribe una versión `formatear_turno_static(struct turno t)` que devuelva la dirección de un arreglo `static`. Llámala dos veces, guarda ambos punteros e imprime los dos textos: explica en un comentario lo que observas.'
deliveryTips:
  - '`snprintf` devuelve cuántos caracteres quería escribir: si ese número no es menor que la capacidad, el texto quedó recortado.'
  - 'El formato `%03d` completa el número con ceros a la izquierda hasta tres dígitos.'
  - 'Pasa la capacidad con `sizeof texto` desde `main`, donde `texto` todavía es un arreglo.'
---

## Contexto

Un turnero tiene que recordar el último número entregado entre una llamada y otra, y tiene que devolver a quien lo llama un texto como `A-001`. Las dos cosas tocan el tiempo de vida de los objetos:

- el contador no puede ser una variable automática, porque moriría al salir de la función;
- el texto no puede vivir en un arreglo local de la función que lo arma, porque quien llama recibiría un puntero colgante.

En este proyecto resuelves ambos problemas con las herramientas de la lección: una local `static`, la devolución por valor y un búfer que provee quien llama.

## Consigna

1. Escribe `programa.c` con `struct turno`, `proximo_turno`, `crear_turno`, `formatear_turno` y un `int main(void)` que produzca la salida de ejemplo.

2. Antes de escribir `formatear_turno`, lee esta versión incorrecta y explica en un comentario de tu programa por qué no sirve:

   ```c
   const char *texto_del_turno(struct turno t) {
       char texto[16];
       snprintf(texto, sizeof texto, "%c-%03d", t.sector, t.numero);
       return texto;
   }
   ```

3. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ./programa
   ```

4. Compara tu salida con la de ejemplo, línea por línea.

## Criterios de evaluación

- [ ] La salida coincide exactamente con la de ejemplo.
- [ ] El contador es una local `static` y no hay variables globales.
- [ ] `crear_turno` devuelve la estructura por valor.
- [ ] `formatear_turno` nunca escribe fuera del búfer y detecta el texto recortado.
- [ ] Ninguna función devuelve la dirección de un objeto automático.
- [ ] El comentario sobre `texto_del_turno` explica el puntero colgante con precisión.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
