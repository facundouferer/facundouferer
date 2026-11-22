---
title: 'Secuencia de Acciones'
course: 'c'
slug: 'procesos-y-estados'
order: 2
lang: 'es'
published: true
---

Antes de que un programa tome decisiones o repita acciones, hay una idea todavía más básica que tienes que dominar: **la composición secuencial de acciones**.

Programar no empieza con `if` ni con `while`. Empieza entendiendo que un programa es un **proceso** que avanza paso a paso, y que cada paso puede cambiar el **estado** del programa.

**Objetivos**

- Definir qué es un algoritmo y reconocer sus propiedades.
- Distinguir entrada, proceso y salida en un problema.
- Explicar qué son un proceso, una acción y un estado.
- Seguir la evolución del estado de un programa con una tabla de traza.
- Distinguir estado inicial, estados intermedios y estado final.
- Diseñar una solución con refinamiento sucesivo antes de escribir código.

**Requisitos previos:** [Introducción a C](/cursos/c/introduccion-y-estructura).

> Idea clave: antes de controlar el flujo de un programa, primero tienes que entender cómo evoluciona su estado paso a paso.

En esta lección usamos muy poco C: algunas variables enteras (`int`), asignaciones con `=` y `printf`. Los detalles de cada una llegan en las próximas lecciones; aquí lo importante es la forma de pensar.

## ¿Qué es un algoritmo?

Un **algoritmo** es una secuencia finita y ordenada de acciones precisas que resuelve un problema.

Una receta de cocina es un ejemplo cotidiano de algoritmo:

1. calentar el agua
2. agregar el arroz
3. esperar 18 minutos
4. colar

Para que una computadora pueda ejecutarlo, un algoritmo tiene que cumplir algunas propiedades:

- **preciso**: cada acción dice exactamente qué hacer, sin ambigüedad ("agregar un poco de sal" no es preciso; "agregar 5 gramos de sal" sí)
- **ordenado**: las acciones tienen un orden y ese orden importa
- **finito**: termina después de una cantidad finita de pasos
- **definido**: con los mismos datos de entrada, produce siempre el mismo resultado

Un **programa** es un algoritmo escrito en un lenguaje de programación. Primero se piensa el algoritmo; después se traduce a C.

## Entrada, proceso y salida

Casi todo algoritmo puede describirse en tres partes:

- **entrada**: los datos que recibe (por ejemplo, lo que escribe el usuario)
- **proceso**: las acciones que transforman esos datos
- **salida**: el resultado que entrega (por ejemplo, lo que muestra en pantalla)

Por ejemplo, para calcular el precio total de una compra:

| Parte | Contenido |
| --- | --- |
| Entrada | precio unitario y cantidad |
| Proceso | multiplicar precio por cantidad |
| Salida | mostrar el total |

Identificar estas tres partes es el primer paso para entender cualquier problema: qué tengo, qué tengo que hacer y qué tengo que obtener.

## ¿Qué es un proceso?

Un **proceso** es la ejecución de un algoritmo: una secuencia ordenada de acciones que ocurre en el tiempo, orientada a lograr un objetivo.

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

En una primera aproximación, el estado está dado por los valores que tienen las variables en ese instante. Una **variable** es un espacio con nombre donde el programa guarda un valor; la verás en detalle en la lección de [variables y constantes](/cursos/c/variables-y-constantes).

Por ejemplo:

```c
int edad = 18;
int puntos = 120;
```

En ese momento, el estado puede describirse así:

```text
edad = 18
puntos = 120
```

## Composición secuencial de acciones

La **composición secuencial de acciones** significa que las instrucciones se ejecutan una después de otra, en el orden en que aparecen.

Es el flujo más básico de un programa.

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

Primero entiendes la secuencia.
Después entiendes cómo desviarla o repetirla.

## Estados iniciales, intermedios y finales

### Estado inicial

Es la situación del programa antes de ejecutar las acciones principales.

```c
int numero;
int doble;
```

Las variables existen, pero todavía no recibieron un valor de nuestra lógica. En C, una variable declarada dentro de `main` sin valor inicial tiene un **valor indeterminado**: puede contener cualquier cosa. Usarla antes de asignarle un valor es un error, y el compilador con `-Wall` suele advertirlo.

### Estado intermedio

Es cualquier estado que aparece durante la ejecución, después de algunas acciones pero antes de completar el proceso.

```c
numero = 6;
```

Ahora hay un estado intermedio:

```text
numero = 6
doble = ?
```

Todavía no llegamos al final del proceso, pero el estado ya cambió.

### Estado final

Es la situación del programa después de completar las acciones del proceso.

```c
doble = numero * 2;
```

Ahora el estado final es:

```text
numero = 6
doble = 12
```

## Tablas de traza: seguir el estado paso a paso

Describir el estado después de cada acción, como hicimos arriba, funciona. Pero cuando hay varias variables y varios pasos, conviene una herramienta más ordenada: la **tabla de traza**.

Una tabla de traza tiene una columna por variable y una fila por acción. En cada fila escribes el valor de cada variable **después** de ejecutar esa acción. `?` indica un valor indeterminado o una variable que todavía no se declaró.

Tomemos esta secuencia:

```c
int x;

x = 2;
x = x + 5;
x = x * 3;
```

| Paso | Acción | `x` |
| --- | --- | --- |
| 0 | `int x;` | ? |
| 1 | `x = 2;` | 2 |
| 2 | `x = x + 5;` | 7 |
| 3 | `x = x * 3;` | 21 |

Fíjate en el paso 2: `x = x + 5;` usa el valor que `x` tiene **en ese momento** (2), calcula 7 y guarda 7 en `x`. El valor anterior se pierde. Una asignación primero calcula el lado derecho y después guarda el resultado en la variable de la izquierda.

### Una asignación guarda un valor, no una fórmula

```c
int n = 7;
int doble = n * 2;
n = n + 1;
```

| Paso | Acción | `n` | `doble` |
| --- | --- | --- | --- |
| 1 | `int n = 7;` | 7 | ? |
| 2 | `int doble = n * 2;` | 7 | 14 |
| 3 | `n = n + 1;` | 8 | 14 |

`doble` se calculó cuando `n` valía 7. Cambiar `n` después **no** recalcula `doble`: la asignación copió el valor 14, no la fórmula `n * 2`. Si quieres que `doble` refleje el cambio, tienes que volver a asignarlo.

### Ejemplo: intercambiar dos valores

Un problema clásico: intercambiar los valores de `x` e `y`. El primer intento suele ser este:

```c
int x = 3;
int y = 8;

x = y;
y = x;
```

| Paso | Acción | `x` | `y` |
| --- | --- | --- | --- |
| 1 | `int x = 3;` | 3 | ? |
| 2 | `int y = 8;` | 3 | 8 |
| 3 | `x = y;` | 8 | 8 |
| 4 | `y = x;` | 8 | 8 |

La traza muestra el problema: después del paso 3, el 3 ya no está en ninguna variable. La solución es guardarlo antes en una variable **auxiliar**:

```c
int x = 3;
int y = 8;
int auxiliar;

auxiliar = x;
x = y;
y = auxiliar;
```

| Paso | Acción | `x` | `y` | `auxiliar` |
| --- | --- | --- | --- | --- |
| 1 | `int x = 3;` | 3 | ? | ? |
| 2 | `int y = 8;` | 3 | 8 | ? |
| 3 | `int auxiliar;` | 3 | 8 | ? |
| 4 | `auxiliar = x;` | 3 | 8 | 3 |
| 5 | `x = y;` | 8 | 8 | 3 |
| 6 | `y = auxiliar;` | 8 | 3 | 3 |

Ahora sí: `x = 8` e `y = 3`. Sin la tabla, este error es muy fácil de pasar por alto.

## Ejemplo completo paso a paso

```c
#include <stdio.h>

int main(void) {
    int numero;
    int resultado;

    numero = 5;
    resultado = numero + 3;

    printf("Resultado: %d\n", resultado);

    return 0;
}
```

`%d` dentro del texto de `printf` indica dónde se escribe el valor de un `int`; lo verás en detalle en la lección de entrada y salida.

| Paso | Acción | `numero` | `resultado` | Pantalla |
| --- | --- | --- | --- | --- |
| 0 | declaraciones | ? | ? | |
| 1 | `numero = 5;` | 5 | ? | |
| 2 | `resultado = numero + 3;` | 5 | 8 | |
| 3 | `printf(...)` | 5 | 8 | `Resultado: 8` |

La salida en pantalla es la parte **observable** del estado final:

```text
Resultado: 8
```

### El orden importa

Si invertimos dos acciones, el resultado cambia:

```c
resultado = numero + 3;
numero = 5;
```

Ahora `resultado` se calcula cuando `numero` todavía tiene un valor indeterminado. El resultado es impredecible, y el compilador con `-Wall` avisa que `numero` se usa sin inicializar. En una secuencia, cada acción depende de las anteriores.

## Refinamiento sucesivo

El **refinamiento sucesivo** es una técnica para diseñar algoritmos de manera gradual.

En vez de intentar escribir todo el programa de una sola vez, vas descomponiendo el problema en pasos cada vez más precisos, de lo general a lo particular.

### Primer nivel de refinamiento

Supongamos que quieres hacer un programa que calcule el promedio de dos números.

Primero lo piensas así, en términos de entrada, proceso y salida:

1. leer dos números
2. calcular el promedio
3. mostrar el resultado

Eso todavía es muy general, pero ya organiza la solución.

### Segundo nivel de refinamiento

Ahora detallas mejor:

1. declarar variables
2. leer el primer número
3. leer el segundo número
4. sumarlos
5. dividir el resultado por 2
6. mostrar el promedio

### Tercer nivel de refinamiento

Recién ahí lo llevas a código.

```c
#include <stdio.h>

int main(void) {
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

Aquí aparecen dos cosas nuevas que solo necesitas reconocer: `float` es un tipo para números con decimales, y `scanf("%f", &numero1)` lee un número escrito por el usuario y lo guarda en `numero1` (el `&` indica la dirección de la variable, es decir, dónde guardarlo). Los verás en detalle en las lecciones de [tipos de datos](/cursos/c/tipos-de-datos) y [entrada y salida](/cursos/c/entrada-y-salida), donde además aprenderás a comprobar que la lectura funcionó.

## ¿Por qué conviene refinar sucesivamente?

Porque te obliga a pensar antes de escribir código. Y eso te ahorra errores.

Un principiante apurado suele hacer esto:

- abre el editor
- empieza a tipear cosas al azar
- se pierde
- no entiende por qué el programa falla

La forma correcta es:

- entender el problema (entrada, proceso, salida)
- descomponerlo
- refinar la solución
- recién después codificar
- verificar con una tabla de traza que cada paso deja el estado esperado

## Errores comunes al empezar

### 1. Querer saltar directamente a estructuras más complejas

Si no entiendes secuencia y estado, después `if` y `while` se vuelven magia.

### 2. Pensar el programa como texto en vez de pensarlo como proceso

El programa no es solo "código escrito". Es una secuencia de acciones que cambia estados.

### 3. Creer que una variable recuerda una fórmula

Una asignación guarda el valor del momento. Si una variable de la que dependía cambia después, el resultado no se actualiza solo.

### 4. Usar una variable antes de darle un valor

El orden de las acciones importa: primero se asigna, después se usa.

### 5. Escribir código sin refinar la solución

Primero se piensa el algoritmo. Después se escribe la implementación.

## Resumen

- un **algoritmo** es una secuencia finita, ordenada y precisa de acciones que resuelve un problema
- casi todo algoritmo se describe como **entrada**, **proceso** y **salida**
- un **proceso** es la ejecución de un algoritmo; está formado por **acciones**
- las acciones modifican el **estado** del programa: los valores de sus variables en cada paso
- la forma más básica de organizar un programa es la **composición secuencial de acciones**
- un proceso puede analizarse en **estado inicial**, **estados intermedios** y **estado final**
- una **tabla de traza** registra el valor de cada variable después de cada acción
- una asignación guarda un valor, no una fórmula; para intercambiar dos valores hace falta una variable auxiliar
- el **refinamiento sucesivo** ayuda a pasar de una idea general a una solución concreta

## Idea final

Controlar el flujo de un programa no significa empezar por `if` o `for`.

Significa entender primero cómo una secuencia de acciones transforma un estado inicial en un estado final.

Ese es el cimiento. Si esto está firme, después las estructuras de control empiezan a tener sentido de verdad.

## Ejercicios prácticos

### Ejercicio 1: completa la tabla de traza

Completa la tabla de traza de esta secuencia y di qué muestra el `printf` final.

```c
int a = 4;
int b = a + 1;
a = b * 2;
b = a - b;
printf("a = %d, b = %d\n", a, b);
```

<details><summary>Ver solución</summary>

| Paso | Acción | `a` | `b` |
| --- | --- | --- | --- |
| 1 | `int a = 4;` | 4 | ? |
| 2 | `int b = a + 1;` | 4 | 5 |
| 3 | `a = b * 2;` | 10 | 5 |
| 4 | `b = a - b;` | 10 | 5 |

Muestra `a = 10, b = 5`. En el paso 4, `a - b` es `10 - 5 = 5`: cada asignación usa los valores de ese momento, no los iniciales.

</details>

### Ejercicio 2: entrada, proceso y salida

Queremos un programa que calcule el perímetro y el área de un rectángulo a partir de su base y su altura (números enteros).

1. Identifica la entrada, el proceso y la salida.
2. Escribe dos niveles de refinamiento.
3. Escribe el programa en C.

<details><summary>Ver solución</summary>

1. **Entrada:** base y altura. **Proceso:** perímetro = 2 × base + 2 × altura; área = base × altura. **Salida:** mostrar el perímetro y el área.
2. Nivel 1: leer las medidas, calcular, mostrar. Nivel 2: declarar variables; leer la base; leer la altura; calcular el perímetro; calcular el área; mostrar ambos resultados.
3. Programa:

```c
#include <stdio.h>

int main(void) {
    int base;
    int altura;
    int perimetro;
    int area;

    printf("Base: ");
    scanf("%d", &base);
    printf("Altura: ");
    scanf("%d", &altura);

    perimetro = 2 * base + 2 * altura;
    area = base * altura;

    printf("Perímetro: %d\n", perimetro);
    printf("Área: %d\n", area);

    return 0;
}
```

Con base 5 y altura 3, muestra `Perímetro: 16` y `Área: 15`.

</details>

### Ejercicio 3: rotar tres valores

Las variables `primero = 1`, `segundo = 2` y `tercero = 3` deben terminar con `primero = 2`, `segundo = 3` y `tercero = 1`. Escribe la secuencia de asignaciones y verifícala con una tabla de traza.

<details><summary>Ver solución</summary>

Hace falta una sola variable auxiliar para no perder el valor de `primero`:

```c
int primero = 1;
int segundo = 2;
int tercero = 3;
int auxiliar;

auxiliar = primero;
primero = segundo;
segundo = tercero;
tercero = auxiliar;
```

| Paso | Acción | `primero` | `segundo` | `tercero` | `auxiliar` |
| --- | --- | --- | --- | --- | --- |
| 1 | `auxiliar = primero;` | 1 | 2 | 3 | 1 |
| 2 | `primero = segundo;` | 2 | 2 | 3 | 1 |
| 3 | `segundo = tercero;` | 2 | 3 | 3 | 1 |
| 4 | `tercero = auxiliar;` | 2 | 3 | 1 | 1 |

</details>

### Ejercicio 4: corrige el orden

Este fragmento quiere mostrar `Total: 30`, pero el resultado es impredecible. Explica por qué y corrígelo.

```c
int precio;
int cantidad;
int total;

total = precio * cantidad;
precio = 10;
cantidad = 3;
printf("Total: %d\n", total);
```

<details><summary>Ver solución</summary>

`total` se calcula cuando `precio` y `cantidad` todavía tienen valores indeterminados. Las acciones están en el orden equivocado: primero hay que asignar los datos y después calcular.

```c
precio = 10;
cantidad = 3;
total = precio * cantidad;
printf("Total: %d\n", total);
```

</details>
