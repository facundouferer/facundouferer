---
title: 'Variables, Parameters, and Passing'
course: 'c'
slug: 'variables-parametros-y-pasaje'
order: 26
lang: 'en'
published: true
---

Una vez que empezás a trabajar con funciones, aparece una pregunta central:

> ¿qué datos conoce cada función y cómo se le pasan esos datos?

Acá entran en juego las variables locales, las variables globales y el pasaje de parámetros.

En esta lección vas a aprender:

- qué son variables locales y globales
- qué son parámetros nominales y efectivos
- qué es el pasaje por valor
- qué es el pasaje por referencia
- cómo cambian los datos dentro y fuera de una función

## Variables locales

Una **variable local** es una variable declarada dentro de una función.

Solo existe dentro de esa función y solo ahí puede usarse directamente.

### Ejemplo

```c
void saludar() {
    int veces = 1;
    printf("Hola %d\n", veces);
}
```

La variable `veces` es local a `saludar`.

## Variables globales

Una **variable global** se declara fuera de todas las funciones.

Puede ser utilizada por varias funciones del programa.

### Ejemplo

```c
int contador = 0;

void aumentar() {
    contador = contador + 1;
}
```

## Diferencia conceptual

- la variable local pertenece a una función
- la variable global pertenece al programa completo o a una región mucho más amplia

## ¿Conviene usar variables globales?

Pueden ser útiles en algunos casos, pero hay que usarlas con criterio.

¿Por qué? Porque si muchas funciones modifican una misma variable global, el programa puede volverse más difícil de entender y controlar.

Para principiantes, una buena regla es esta:

> preferí variables locales salvo que haya una razón clara para compartir el dato.

## ¿Qué es un parámetro?

Un **parámetro** es un dato que una función recibe para poder trabajar.

### Ejemplo

```c
int sumar(int a, int b) {
    return a + b;
}
```

Acá, `a` y `b` son parámetros de la función.

## Parámetros nominales y efectivos

Esta distinción es importantísima.

### Parámetros nominales

Son los nombres que aparecen en la definición de la función.

```c
int sumar(int a, int b)
```

Acá, `a` y `b` son parámetros nominales.

### Parámetros efectivos

Son los valores o variables reales que se pasan cuando la función se invoca.

```c
resultado = sumar(5, 3);
```

Acá, `5` y `3` son parámetros efectivos.

## Pasaje por valor

En el **pasaje por valor**, la función recibe una copia del dato.

Eso significa que si la función modifica ese parámetro, el original no cambia.

### Ejemplo

```c
#include <stdio.h>

void cambiar(int x) {
    x = 100;
}

int main() {
    int numero = 5;
    cambiar(numero);
    printf("%d\n", numero);
    return 0;
}
```

El valor mostrado seguirá siendo `5`.

¿Y por qué? Porque `cambiar` recibió una copia de `numero`, no el original.

## Pasaje por referencia

En C no existe “pasaje por referencia” nativo como en otros lenguajes, pero se puede lograr el mismo efecto práctico usando **punteros**.

Esto es importante decirlo bien para no enseñar mal.

Cuando en cursos introductorios se habla de “pasaje por referencia” en C, normalmente se está hablando de pasar la dirección de una variable mediante punteros, para que la función pueda modificar el dato original.

### Ejemplo conceptual

```c
void cambiar(int *x) {
    *x = 100;
}
```

Y la llamada:

```c
cambiar(&numero);
```

## ¿Qué cambia acá?

Ahora la función no trabaja sobre una simple copia del valor, sino sobre la dirección del dato original.

Eso permite modificar la variable real.

## Ejemplo completo

```c
#include <stdio.h>

void cambiar(int *x) {
    *x = 100;
}

int main() {
    int numero = 5;
    cambiar(&numero);
    printf("%d\n", numero);
    return 0;
}
```

Ahora el valor mostrado será `100`.

## Comparación entre ambos pasajes

### Por valor

- la función recibe una copia
- el original no cambia

### Por referencia simulada con punteros

- la función trabaja sobre la dirección del dato
- el original sí puede cambiar

## ¿Cuándo conviene cada uno?

### Pasaje por valor

Conviene cuando solo querés usar el dato para calcular o consultar algo.

### Pasaje por referencia con punteros

Conviene cuando querés que la función pueda modificar el dato original.

## Errores comunes al empezar

### 1. Creer que cambiar un parámetro por valor modifica el original

No. Si se pasó por valor, lo que se modifica es la copia.

### 2. Usar demasiadas variables globales

Eso vuelve más difícil entender de dónde salen y quién modifica los datos.

### 3. Confundir parámetros nominales con efectivos

Uno pertenece a la definición de la función. El otro pertenece a la llamada.

## Resumen

- una variable local vive dentro de una función
- una variable global tiene alcance más amplio
- los parámetros nominales aparecen en la definición
- los parámetros efectivos aparecen en la invocación
- por valor se pasa una copia
- en C, el efecto de pasaje por referencia se logra usando punteros

## Idea final

Entender alcance y pasaje de parámetros te cambia por completo la forma de leer funciones.

Porque a partir de acá ya no solo importa qué hace una función, sino también **con qué datos trabaja y qué datos puede llegar a modificar**.
