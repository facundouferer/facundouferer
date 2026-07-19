---
title: 'Sequential Data Structures'
course: 'c'
slug: 'manejo-de-estructuras-secuenciales-de-datos'
order: 14
lang: 'en'
published: true
---

Hasta ahora trabajaste con variables individuales. Pero cuando un programa necesita manejar muchos datos relacionados, hace falta una forma mejor de organizarlos.

Ahí aparece el manejo de **estructuras secuenciales de datos**.

En esta lección vas a aprender:

- qué es una estructura secuencial de datos
- por qué no alcanza con variables sueltas
- qué significa que los datos estén ordenados en una secuencia
- qué operaciones suelen hacerse sobre una secuencia

> Idea clave: una estructura secuencial permite pensar varios datos como un conjunto ordenado y no como variables aisladas.

## ¿Qué es una estructura secuencial de datos?

Una **estructura secuencial de datos** es una organización en la que los elementos se disponen uno detrás de otro siguiendo un orden.

Por ejemplo, una secuencia de notas puede verse así:

```text
8, 6, 10, 7, 9
```

Acá no pensás en cinco variables separadas, sino en una colección ordenada de cinco valores.

## ¿Por qué no alcanza con variables sueltas?

Mirá este ejemplo:

```c
int nota1 = 8;
int nota2 = 6;
int nota3 = 10;
int nota4 = 7;
int nota5 = 9;
```

Esto puede funcionar para muy pocos datos, pero tiene problemas:

- cuesta recorrerlos de forma ordenada
- cuesta aplicar la misma operación sobre todos
- no escala bien si la cantidad aumenta
- vuelve el programa rígido y desprolijo

## Relación entre secuencia y operaciones

Cuando los datos están organizados secuencialmente, aparecen operaciones muy importantes:

- **recorrido**: visitar uno por uno los elementos
- **búsqueda**: encontrar un valor dentro de la secuencia
- **inserción**: agregar un nuevo elemento
- **actualización**: cambiar un elemento existente

## Ejemplo conceptual

Supongamos que tenés las edades de cuatro personas:

```text
20, 18, 25, 19
```

El programa puede hacerse preguntas como:

- ¿cuál es la primera edad?
- ¿cuál es la tercera?
- ¿está la edad 25 dentro de la secuencia?
- ¿cuál es la mayor?

## ¿Qué estructuras secuenciales vas a estudiar?

En esta parte del curso vas a trabajar principalmente con:

- arreglos
- cadenas de caracteres
- listas
- pilas
- colas

No todas funcionan igual, pero todas organizan datos de forma secuencial.

## Resumen

- una estructura secuencial organiza varios datos siguiendo un orden
- permite tratar una colección como un conjunto
- facilita recorrido, búsqueda e inserción
- es la base para entender arreglos, cadenas y varias estructuras dinámicas

## Idea final

Cuando pasás de variables sueltas a estructuras secuenciales, tu programa empieza a manejar datos de verdad y no solo valores aislados.
