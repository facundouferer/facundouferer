---
title: 'Concept of Structures'
course: 'c'
slug: 'concepto-de-estructuras'
order: 18
lang: 'en'
published: true
---

Los arreglos sirven cuando todos los datos son del mismo tipo. Pero en muchos problemas reales necesitás agrupar datos distintos que pertenecen a una misma entidad.

Ahí aparece el concepto de **estructura**.

En esta lección vas a aprender:

- qué es una estructura
- cómo se declara en C
- cómo se crean variables de ese tipo
- cómo se accede a sus campos

## ¿Qué es una estructura?

Una **estructura** es un tipo de dato compuesto que agrupa varios datos relacionados, aunque sean de tipos distintos.

### Ejemplo conceptual

Una persona podría tener:

- nombre
- edad
- altura

## Declaración con `struct`

```c
struct Persona {
    char nombre[30];
    int edad;
    float altura;
};
```

## Crear una variable estructura

```c
struct Persona alumno;
```

## Acceso a los campos

```c
alumno.edad = 20;
alumno.altura = 1.75;
```

## Ejemplo completo

```c
#include <stdio.h>

struct Persona {
    char nombre[30];
    int edad;
    float altura;
};

int main() {
    struct Persona alumno = {"Facu", 20, 1.75};

    printf("Nombre: %s\n", alumno.nombre);
    printf("Edad: %d\n", alumno.edad);
    printf("Altura: %f\n", alumno.altura);

    return 0;
}
```

## ¿Por qué importan tanto las estructuras?

Porque muchas estructuras dinámicas se construyen a partir de nodos representados con `struct`.

## Resumen

- una estructura agrupa datos relacionados de distintos tipos
- se declara con `struct`
- sus campos se acceden con `.`
- es clave para modelar entidades y crear estructuras más complejas

## Idea final

Las estructuras son el paso que te permite modelar información con sentido y no solo guardar valores aislados.
