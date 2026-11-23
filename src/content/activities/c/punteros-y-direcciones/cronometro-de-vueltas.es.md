---
course: 'c'
lesson: 'punteros-y-direcciones'
slug: 'cronometro-de-vueltas'
title: 'Cronómetro de vueltas con parámetros de salida'
description: 'Programa que desglosa tiempos de vuelta en horas, minutos y segundos, y ordena tres tiempos, usando funciones que reciben direcciones.'
kind: 'project'
order: 2
lang: 'es'
published: true
estimatedMinutes: 35
objectives:
  - 'Escribir funciones que modifican variables de quien llama a través de punteros.'
  - 'Devolver varios resultados con parámetros de salida y usar el valor de retorno para informar si la operación tuvo éxito.'
  - 'Reconocer que el puntero se pasa por valor y que el cambio ocurre al desreferenciarlo.'
requirements:
  - 'La función `void intercambiar(int *a, int *b)` intercambia los valores de los dos enteros apuntados.'
  - 'La función `void ordenar_tres(int *a, int *b, int *c)` deja los tres valores en orden ascendente usando solo llamadas a `intercambiar`.'
  - 'La función `bool desglosar(int total, int *horas, int *minutos, int *segundos)` devuelve `false` sin escribir nada si `total` es negativo; si no, deja el desglose en los tres parámetros de salida y devuelve `true`.'
  - 'Los tiempos de vuelta están en un arreglo `int vueltas[] = {754, 3725, -5, 59};` y se recorren con un `for`.'
  - 'El total suma solo las vueltas válidas y se desglosa con la misma función `desglosar`.'
  - 'La línea `Ordenados` muestra el resultado de `ordenar_tres` aplicado a copias de la segunda, la cuarta y la primera vuelta, en ese orden.'
  - 'El programa no usa variables globales ni escribe resultados a mano: todo sale de las funciones.'
  - 'Compila sin advertencias con `gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa`.'
exampleOutput: |
  === Cronómetro ===
  Vuelta 1: 0 h 12 min 34 s
  Vuelta 2: 1 h 2 min 5 s
  Vuelta 3: tiempo inválido (-5)
  Vuelta 4: 0 h 0 min 59 s
  Total válido: 4538 s = 1 h 15 min 38 s
  Ordenados: 59 754 3725
extensionChallenges:
  - 'Agrega `bool vuelta_mas_rapida(const int vueltas[], size_t n, size_t *posicion)` que deje en `*posicion` el índice de la vuelta válida más corta y devuelva `false` si no hay ninguna válida.'
  - 'Escribe una versión de `reiniciar(int *p)` que intente hacer que `p` apunte a otra variable y comprueba en `main` que tu puntero no cambia. Explica el motivo en un comentario.'
deliveryTips:
  - 'Antes de escribir `desglosar`, haz a mano el desglose de 3725 segundos: 3725 / 3600 da las horas, y el resto de esa división se reparte en minutos y segundos.'
  - 'Dentro de una función con parámetros puntero, distingue siempre `p` (la dirección) de `*p` (el objeto). Solo `*p = ...` cambia la variable de quien llama.'
---

## Contexto

Una función de C devuelve un solo valor con `return`. Cuando necesitas más de un resultado, como las horas, los minutos y los segundos de un tiempo, la técnica habitual es que la función reciba las **direcciones** de las variables donde debe dejarlos. El valor de retorno queda libre para informar si la operación salió bien.

Recuerda que en `desglosar(t, &h, &m, &s)` no hay pasaje por referencia: se copian tres direcciones en los parámetros, y la función escribe en tus variables al desreferenciarlas.

## Consigna

1. Escribe `programa.c` con las funciones `intercambiar`, `ordenar_tres` y `desglosar` descritas en los requisitos, y un `int main(void)` que:
   - recorra el arreglo de vueltas y muestre cada una desglosada, o el aviso de tiempo inválido;
   - acumule y desglose el total de las vueltas válidas;
   - copie la segunda, la cuarta y la primera vuelta en tres variables `a`, `b` y `c`, llame a `ordenar_tres(&a, &b, &c)` e imprima el resultado.

2. Compila con el comando del curso. El programa debe **compilar sin advertencias**:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
   ./programa
   ```

3. Compara tu salida con la de ejemplo, línea por línea.

4. Prueba `ordenar_tres` con otros órdenes de entrada (por ejemplo `3 2 1`, `1 3 2` y `2 2 1`) y verifica que siempre deja los valores en orden ascendente.

## Criterios de evaluación

- [ ] La salida coincide exactamente con la de ejemplo.
- [ ] `desglosar` no escribe en los parámetros de salida cuando el tiempo es negativo, y `main` usa su valor de retorno.
- [ ] `ordenar_tres` funciona para cualquier orden de los tres valores y solo usa `intercambiar`.
- [ ] Cada función distingue correctamente el puntero (`p`) del objeto apuntado (`*p`).
- [ ] No hay variables globales ni punteros sin inicializar.
- [ ] Compila sin advertencias con `-std=c23 -Wall -Wextra -Wpedantic`.
