---
course: 'java'
lesson: '23-algoritmia-verificacion-y-complejidad'
slug: 'verificador-algoritmos-busqueda'
title: 'Diseño, Verificación y Comparación de Algoritmos de Búsqueda'
description: 'Implementá búsqueda lineal y binaria segura especificando contratos formales, demostrando invariantes de bucle y analizando la complejidad Big O.'
kind: 'project'
order: 1
lang: 'es'
published: true
estimatedMinutes: 45
objectives:
  - 'Especificar contratos formales con entradas, precondiciones, postcondiciones y valores centinela ante errores.'
  - 'Implementar búsqueda lineal O(n) y búsqueda binaria segura O(log n).'
  - 'Formular y justificar un invariante de bucle que argumente la corrección del algoritmo.'
  - 'Analizar la complejidad temporal en el mejor y peor caso junto a la memoria auxiliar O(1).'
  - 'Construir pruebas sistemáticas sobre casos normales, fronteras y entradas inválidas.'
requirements:
  - 'Crear la clase BusquedaSegura.java con métodos estáticos dedicados a la búsqueda y verificación.'
  - 'Implementar busquedaLineal(int[] valores, int objetivo): validar entrada null o vacía retornando -1 como centinela documentado; recorrer linealmente y retornar el índice de la primera coincidencia o -1 si no existe.'
  - 'Implementar busquedaBinaria(int[] ordenados, int objetivo): precondición documentada de orden ascendente; cálculo de punto medio seguro evitando desbordamiento (medio = inicio + (fin - inicio) / 2); retornar índice o -1.'
  - 'Escribir en la cabecera de busquedaBinaria el contrato formal y el invariante de bucle: "si el objetivo está en el array, se encuentra en el rango [inicio, fin]".'
  - 'En MainVerificacion.java, ejecutar pruebas cubriendo: array null, array vacío, coincidencia en índice 0, en el centro, en la última posición y búsqueda de elemento ausente.'
  - 'Implementar un método compararComplejidad(int n) que compare analíticamente el número de comparaciones en el peor caso entre O(n) y O(log n) para n = 10, n = 1000 y n = 1000000.'
  - 'Preservar código limpio: métodos concisos, nombres autodescriptivos, sin números mágicos y separación nítida entre algoritmo y pruebas.'
exampleOutput: |
  === Verificación de Contratos y Búsquedas ===
  [OK] Prueba array null: centinela -1 retornado correctamente.
  [OK] Prueba array vacío: centinela -1 retornado correctamente.
  [OK] Búsqueda lineal de 42: encontrado en índice 3.
  [OK] Búsqueda binaria de 42: encontrado en índice 3 (4 comparaciones).
  [OK] Búsqueda binaria ausente 99: centinela -1 retornado.
  === Análisis Asintótico (Peor Caso) ===
  Entrada n = 10      | Lineal: 10 op     | Binaria: 4 op
  Entrada n = 1000    | Lineal: 1000 op   | Binaria: 10 op
  Entrada n = 1000000 | Lineal: 1000000 op| Binaria: 20 op
deliveryTips:
  - 'Compilá con javac BusquedaSegura.java MainVerificacion.java y ejecutá con java MainVerificacion.'
  - 'No uses excepciones todavía; ante entradas que violan precondiciones o datos ausentes devolvé el centinela -1 debidamente documentado.'
  - 'Calculá el punto medio con inicio + (fin - inicio) / 2 para evitar un potencial desbordamiento de enteros (integer overflow).'
---

## Contexto

En ingeniería de software no alcanza con que un algoritmo "parezca andar bien" en un par de ejemplos. Hace falta demostrar que produce el resultado correcto bajo cualquier condición y entender cómo escala su consumo de tiempo y memoria a medida que el volumen de datos crece.

Un contrato riguroso (entradas, precondiciones, postcondiciones y tratamiento de errores) y la notación **Big O** son los cimientos que diferencian un parche improvisado de una solución técnica sólida.

## Consigna

Vas a implementar dos clases:
1. `BusquedaSegura.java`: implementa los algoritmos de búsqueda lineal y binaria junto con su análisis teórico.
2. `MainVerificacion.java`: suite de pruebas que comprueba el cumplimiento del contrato en casos felices, límites y erróneos.

### 1. Especificación del contrato formal

Para cada algoritmo debés dejar documentado en su cabecera:
- **Entradas**: qué parámetros recibe.
- **Precondición**: qué condiciones deben cumplirse antes de invocarlo (por ejemplo, en búsqueda binaria: el array debe estar ordenado ascendentemente y no ser `null`).
- **Postcondición**: qué garantiza el método al terminar (el índice retornado contiene el valor buscado).
- **Error / Casos especiales**: qué ocurre si la entrada es `null`, está vacía o el elemento no existe (retornar el valor centinela `-1`).

### 2. Búsqueda binaria e invariante de bucle

En `busquedaBinaria(int[] ordenados, int objetivo)`:
- Calculá el índice medio con `medio = inicio + (fin - inicio) / 2`.
- El **invariante de bucle** establece que: *si `objetivo` está presente en el array, entonces necesariamente se encuentra dentro del subrango actual `[inicio, fin]`*.
- En cada paso, al comparar `ordenados[medio]` con `objetivo`, descartá de forma segura la mitad del espacio sin romper el invariante.

### 3. Comparativa asintótica y código limpio

Implementá `compararComplejidad(int n)` para ilustrar de forma numérica por qué un algoritmo $O(\log n)$ es exponencialmente superior a uno $O(n)$ en conjuntos de datos grandes, demostrando que optimizar el orden asintótico rinde órdenes de magnitud más que cualquier microoptimización sintáctica.
