---
title: 'Polymorphism and Inheritance Simulated in C'
course: 'c'
slug: 'polimorfismo-y-herencia-simulados-en-c'
order: 32
lang: 'en'
published: true
---

Dos de las ideas más famosas de la POO son la **herencia** y el **polimorfismo**.

C no las ofrece de forma nativa, pero sí se pueden simular ciertos comportamientos con diseño y punteros a función.

En esta lección vas a aprender:

- por qué herencia y polimorfismo no son nativos en C
- cómo pueden aproximarse conceptualmente
- qué papel cumplen los punteros a función

## Herencia simulada

Una forma simple de aproximar herencia en C es componer estructuras relacionadas.

### Ejemplo conceptual

```c
struct Persona {
    char nombre[30];
};

struct Alumno {
    struct Persona persona;
    int legajo;
};
```

Acá `Alumno` contiene una `Persona` y agrega más información.

No es herencia nativa, pero se parece a una extensión de comportamiento o estructura.

## Polimorfismo simulado con punteros a función

Los punteros a función permiten elegir qué comportamiento ejecutar.

### Ejemplo conceptual

```c
typedef void (*AccionSaludo)();
```

Y luego distintas funciones podrían cumplir distintos comportamientos bajo una misma idea general.

## ¿Por qué esto importa?

Porque muestra que las ideas de diseño pueden sobrevivir aunque el lenguaje no tenga la sintaxis específica.

Pero también hay que ser honestos:

- no es lo mismo que POO nativa
- exige más trabajo manual
- requiere más disciplina de diseño

## Resumen

- C no tiene herencia ni polimorfismo nativos
- algunas ideas pueden aproximarse con composición y punteros a función
- esto permite construir diseños más flexibles dentro de los límites reales del lenguaje

## Idea final

Aprender POO en C es aprender a separar el concepto de la sintaxis.

Y eso te hace mejor programador, porque dejás de depender de “palabras mágicas” del lenguaje y empezás a entender el diseño que hay detrás.
