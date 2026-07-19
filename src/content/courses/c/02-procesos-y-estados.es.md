---
title: 'Secuencia de Acciones'
course: 'c'
slug: 'procesos-y-estados'
order: 2
lang: 'es'
published: true
---

Antes de que un programa tome decisiones o repita acciones, hay una idea todavía más básica que tenés que dominar: **la composición secuencial de acciones**.

Programar no empieza con `if` ni con `while`. Empieza entendiendo que un programa es un **proceso** que avanza paso a paso, y que cada paso puede cambiar el **estado** del sistema.

En esta lección vas a aprender:

- qué es un proceso en programación
- qué es una acción
- qué es un estado
- qué significa composición secuencial de acciones
- qué son los estados iniciales, intermedios y finales
- qué significa refinamiento sucesivo

> Idea clave: antes de controlar el flujo de un programa, primero tenés que entender cómo evoluciona su estado paso a paso.

## ¿Qué es un proceso?

Un **proceso** es una secuencia ordenada de acciones orientadas a lograr un objetivo.

En programación, un proceso describe qué le ocurre al programa desde que empieza hasta que termina.

Todo proceso tiene, al menos:

- un **estado inicial**
- una o más **acciones**
- un **estado final**

## ¿Qué es una acción?

Una **acción** es una operación concreta que realiza el programa.

Por ejemplo:

- leer un valor
- mostrar un mensaje
- calcular un resultado
- asignar un valor a una variable

Cada acción puede modificar la situación del programa.

## ¿Qué es un estado?

Un **estado** es la situación del programa en un momento determinado.

En una primera aproximación, el estado está dado principalmente por los valores que tienen las variables en ese instante.

Por ejemplo:

```c
int edad = 18;
float altura = 1.72;
```

En ese momento, el estado puede describirse así:

```text
edad = 18
altura = 1.72
```

## Composición secuencial de acciones

La **composición secuencial de acciones** significa que las instrucciones se ejecutan una después de otra, en el orden en que aparecen.

Eso es el flujo más básico de un programa.

Por ejemplo:

```c
int numero;
int cuadrado;

numero = 4;
cuadrado = numero * numero;
```

¿Qué ocurre secuencialmente?

1. se declara `numero`
2. se declara `cuadrado`
3. se asigna `4` a `numero`
4. se calcula `numero * numero`
5. se guarda el resultado en `cuadrado`

No hay decisiones, no hay repeticiones. Solo hay una secuencia ordenada.

## ¿Por qué esta idea es tan importante?

Porque incluso cuando más adelante uses `if`, `switch`, `while` o `for`, dentro de cada bloque sigue habiendo secuencia.

O sea: el control del flujo se construye sobre una base secuencial.

Primero entendés la secuencia.
Después entendés cómo desviarla o repetirla.

## Estados iniciales, intermedios y finales

### Estado inicial

Es la situación del programa antes de ejecutar las acciones principales.

Por ejemplo:

```c
int numero;
int doble;
```

Todavía no hay un valor útil asignado por nuestra lógica. El programa recién empieza a prepararse.

### Estado intermedio

Es cualquier estado que aparece durante la ejecución, después de algunas acciones pero antes del resultado final.

```c
numero = 6;
```

Ahora ya hay un estado intermedio:

```text
numero = 6
doble = ?
```

Todavía no llegamos al final del proceso, pero el estado ya cambió.

### Estado final

Es la situación del programa después de completar las acciones principales del proceso.

```c
doble = numero * 2;
```

Ahora el estado final podría describirse así:

```text
numero = 6
doble = 12
```

## Ejemplo completo paso a paso

```c
#include <stdio.h>

int main() {
    int numero;
    int resultado;

    numero = 5;
    resultado = numero + 3;

    printf("Resultado: %d\n", resultado);

    return 0;
}
```

### Estado inicial

```text
numero = sin valor asignado por nuestra lógica
resultado = sin valor asignado por nuestra lógica
```

### Después de `numero = 5;`

```text
numero = 5
resultado = sin valor asignado por nuestra lógica
```

### Después de `resultado = numero + 3;`

```text
numero = 5
resultado = 8
```

### Estado final observable

El programa muestra:

```text
Resultado: 8
```

## Refinamiento sucesivo

El **refinamiento sucesivo** es una técnica para pensar soluciones de manera gradual.

En vez de intentar escribir todo el programa de una sola vez, vas descomponiendo el problema en pasos cada vez más precisos.

### Primer nivel de refinamiento

Supongamos que querés hacer un programa que calcule el promedio de dos números.

Primero lo pensás así:

1. leer dos números
2. calcular el promedio
3. mostrar el resultado

Eso todavía es muy general, pero ya organiza la solución.

### Segundo nivel de refinamiento

Ahora detallás mejor:

1. declarar variables
2. leer el primer número
3. leer el segundo número
4. sumarlos
5. dividir el resultado por 2
6. mostrar el promedio

### Tercer nivel de refinamiento

Recién ahí lo llevás a código.

```c
#include <stdio.h>

int main() {
    float numero1;
    float numero2;
    float promedio;

    printf("Ingrese el primer número: ");
    scanf("%f", &numero1);

    printf("Ingrese el segundo número: ");
    scanf("%f", &numero2);

    promedio = (numero1 + numero2) / 2;

    printf("El promedio es %f\n", promedio);

    return 0;
}
```

## ¿Por qué conviene refinar sucesivamente?

Porque te obliga a pensar antes de escribir código.

Y eso te ahorra errores.

Un principiante apurado suele hacer esto:

- abre el editor
- empieza a tipear cosas al azar
- se pierde
- no entiende por qué el programa falla

La forma correcta es:

- entender el problema
- descomponerlo
- refinar la solución
- recién después codificar

## Secuencia y cambio de estado

Cada vez que ejecutás una acción, el estado puede cambiar.

Mirá este ejemplo:

```c
int x;

x = 2;
x = x + 5;
x = x * 3;
```

### Evolución del estado

Después de `x = 2;`

```text
x = 2
```

Después de `x = x + 5;`

```text
x = 7
```

Después de `x = x * 3;`

```text
x = 21
```

Esto es programación secuencial pura: una acción lleva a otra, y cada una transforma el estado.

## Errores comunes al empezar

### 1. Querer saltar directamente a estructuras más complejas

Si no entendés secuencia y estado, después `if` y `while` se vuelven magia negra.

### 2. Pensar el programa como texto en vez de pensarlo como proceso

El programa no es solo “código escrito”. Es una secuencia de acciones que cambia estados.

### 3. No distinguir entre estado inicial, intermedio y final

Si no sabés en qué estado está tu programa, no sabés realmente qué está pasando.

### 4. Escribir código sin refinar la solución

Primero se piensa el problema. Después se escribe la implementación.

## Resumen

- un programa puede entenderse como un **proceso**
- un proceso está formado por **acciones**
- las acciones modifican el **estado** del programa
- la forma más básica de organizar un programa es la **composición secuencial de acciones**
- un proceso puede analizarse en **estado inicial**, **estados intermedios** y **estado final**
- el **refinamiento sucesivo** ayuda a pasar de una idea general a una solución concreta

## Idea final

Controlar el flujo de un programa no significa empezar por `if` o `for`.

Significa entender primero cómo una secuencia de acciones transforma un estado inicial en un estado final.

Ese es el cimiento. Si esto está firme, después las estructuras de control empiezan a tener sentido de verdad.