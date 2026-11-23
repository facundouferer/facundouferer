---
title: 'Entrada y Salida'
course: 'c'
slug: 'entrada-y-salida'
description: 'Muestra datos con printf y sus especificadores de formato, lee entradas con scanf verificando su valor de retorno y limpia el búfer ante errores.'
order: 6
lang: 'es'
published: true
---

Un programa empieza a ser útil cuando puede **mostrar información** y **recibir datos**.

- **Salida:** el programa envía información hacia afuera, por ejemplo a la pantalla.
- **Entrada:** el programa recibe información desde afuera, por ejemplo del teclado.

En C, las dos herramientas básicas son `printf` (salida) y `scanf` (entrada), ambas de `<stdio.h>`.

## Objetivos

Al terminar esta lección podrás:

- mostrar texto y valores con `printf` usando el especificador correcto para cada tipo, incluido `%zu`
- controlar el ancho de campo y la precisión de la salida
- leer datos con `scanf` y explicar informalmente por qué lleva `&`
- usar el valor que devuelve `scanf` para **validar** la entrada (`if (scanf("%d", &edad) != 1)`)
- descartar la entrada inválida que queda pendiente con un ciclo de `getchar`

**Requisitos previos:** lecciones 1 a 5, en especial *Tipos de datos* (`int`, `double`, `char`, `size_t`, `unsigned`).

## Salida con `printf`

```c
#include <stdio.h>

int main(void) {
    printf("Hola, mundo\n");
    return 0;
}
```

El texto entre comillas dobles es una cadena literal. `\n` es una **secuencia de escape** que representa un salto de línea. Otras útiles:

| Escape | Significado |
| --- | --- |
| `\n` | salto de línea |
| `\t` | tabulación |
| `\"` | comilla doble |
| `\\` | barra invertida |

`printf` no agrega el salto de línea por sí solo: si no escribes `\n`, la siguiente salida continúa en la misma línea.

## Mostrar valores: especificadores de formato

Para mostrar el valor de una variable, dejas en el texto un **especificador de formato** que empieza con `%` y pasas el valor después de la cadena:

```c
int edad = 18;
printf("La edad es %d\n", edad);
```

`%d` reserva el lugar de un `int`; `printf` lo reemplaza por el valor de `edad` y muestra `La edad es 18`.

Puedes poner varios especificadores; los valores se usan en el mismo orden:

```c
printf("%d alumnos, promedio %f\n", cantidad, promedio);
```

### Tabla de especificadores

| Tipo | Especificador en `printf` |
| --- | --- |
| `int` | `%d` |
| `unsigned int` | `%u` |
| `long` | `%ld` |
| `long long` | `%lld` |
| `size_t` (resultado de `sizeof`) | `%zu` |
| `double` y `float` | `%f` (o `%e` en notación científica) |
| `char` | `%c` |
| cadena literal | `%s` |
| entero en hexadecimal | `%x` |
| el carácter `%` | `%%` |

**El especificador debe coincidir con el tipo.** Si no coincide, el resultado es impredecible: `printf` lee los bits del valor como si fueran de otro tipo. Con `-Wall` el compilador revisa la cadena de formato y avisa (`format specifies type 'double' but the argument has type 'int'`).

### Ancho de campo y precisión

Entre el `%` y la letra puedes indicar cómo se ve el valor:

- **ancho**: cantidad mínima de caracteres; se rellena con espacios a la izquierda. `%5d`
- **`-`**: alinea a la izquierda. `%-5d`
- **`0`**: rellena con ceros. `%05d`
- **precisión** (después de un punto): cantidad de decimales. `%.2f`
- ancho y precisión juntos: `%8.2f`

```c
#include <stdio.h>

int main(void) {
    printf("[%5d]\n", 42);
    printf("[%-5d]\n", 42);
    printf("[%05d]\n", 42);
    printf("[%.2f]\n", 3.14159);
    printf("[%8.2f]\n", 3.14159);
    printf("[%zu]\n", sizeof(double));
    return 0;
}
```

Salida:

```text
[   42]
[42   ]
[00042]
[3.14]
[    3.14]
[8]
```

El ancho sirve para armar tablas alineadas:

```c
#include <stdio.h>

int main(void) {
    printf("%-10s %6s\n", "Producto", "Precio");
    printf("%-10s %6.2f\n", "Pan", 1.5);
    printf("%-10s %6.2f\n", "Leche", 0.99);
    printf("%-10s %6.2f\n", "Queso", 12.75);
    return 0;
}
```

```text
Producto   Precio
Pan          1.50
Leche        0.99
Queso       12.75
```

## Entrada con `scanf`

`scanf` lee lo que el usuario escribe y lo guarda en variables:

```c
#include <stdio.h>

int main(void) {
    int edad = 0;

    printf("Ingrese su edad: ");
    scanf("%d", &edad);
    printf("Usted tiene %d años\n", edad);

    return 0;
}
```

La forma general es `scanf("especificadores", &variable1, &variable2, ...)`.

### ¿Por qué `&`?

`printf` solo necesita **el valor** de `edad` para mostrarlo. `scanf`, en cambio, tiene que **escribir** en `edad`, y para eso necesita saber dónde está guardada. `&edad` significa **"la dirección de la variable `edad`"**: el lugar de la memoria donde vive. Con esa dirección, `scanf` puede depositar ahí el número leído.

Por ahora alcanza con esta idea informal. En la lección 25 (*Punteros y direcciones*) verás qué es exactamente una dirección y cómo se trabaja con ella.

Olvidar el `&` es un error grave: `scanf` recibiría el valor de la variable en lugar de su dirección. `-Wall` lo detecta.

### Especificadores de `scanf`

Son casi los mismos que en `printf`, con una diferencia importante:

| Tipo | `scanf` | `printf` |
| --- | --- | --- |
| `int` | `%d` | `%d` |
| `float` | `%f` | `%f` |
| `double` | **`%lf`** | `%f` |
| `char` | `" %c"` | `%c` |

Para leer un `double` se usa `%lf`. Con `%f`, `scanf` escribiría un `float` en el lugar de un `double`.

## Validar la entrada: el valor de retorno de `scanf`

¿Qué pasa si el programa pide una edad y el usuario escribe `hola`? `scanf` no puede convertir `hola` en un entero, así que **no modifica la variable**. Si el programa sigue como si nada, trabaja con un dato que nunca se leyó.

Para darte cuenta, usa lo que **devuelve** `scanf`: la cantidad de variables que logró cargar.

- `scanf("%d", &edad)` devuelve `1` si leyó un entero
- devuelve `0` si lo que había no era un entero
- devuelve `EOF` (un valor negativo) si la entrada terminó

Así se **valida** la lectura:

```c
#include <stdio.h>

int main(void) {
    int edad = 0;

    printf("Ingrese su edad: ");
    if (scanf("%d", &edad) != 1) {
        printf("Error: se esperaba un número entero.\n");
        return 1;
    }

    printf("Usted tiene %d años\n", edad);
    return 0;
}
```

`if` ejecuta el bloque entre llaves solo cuando la condición es verdadera; lo estudiarás en la lección 8. Aquí la condición es "`scanf` no devolvió 1". En ese caso el programa avisa y termina con `return 1`, que le indica al sistema que hubo un error (`return 0` indica éxito).

La regla profesional es simple: **cada vez que llames a `scanf`, compara su resultado con la cantidad de valores que pediste**. Si lees dos números, compara con 2:

```c
if (scanf("%d %d", &ancho, &alto) != 2)
```

Validar la forma no es lo mismo que validar el contenido: `-5` es un entero válido para `scanf`, pero no una edad válida. Esa segunda validación la harás con `if` y operadores (lecciones 7 y 8).

## La entrada inválida queda en el búfer

Lo que escribes en el teclado no llega directo a `scanf`: se guarda en un **búfer de entrada**, una fila de caracteres que `scanf` va consumiendo. Al apretar Enter, también se agrega un `'\n'` al final.

Cuando `scanf("%d", ...)` encuentra `hola`, falla **sin consumir esos caracteres**. Quedan en el búfer, y el próximo `scanf("%d", ...)` vuelve a encontrarlos y vuelve a fallar. Si el programa pidiera el dato otra vez, fallaría para siempre.

La solución es **descartar el resto de la línea** antes de volver a leer, carácter por carácter, con `getchar`:

```c
int c;
while ((c = getchar()) != '\n' && c != EOF) {
    // descartar
}
```

`getchar()` lee un solo carácter del búfer y lo devuelve como `int` (para poder devolver también `EOF`). El ciclo `while` repite la lectura mientras el carácter no sea el salto de línea ni el fin de la entrada. Verás `while` en detalle en la lección 11; por ahora úsalo como una receta.

Programa completo: si la primera lectura falla, descarta la línea y da una segunda oportunidad.

```c
#include <stdio.h>

int main(void) {
    int cantidad = 0;
    int c;

    printf("Cantidad: ");
    if (scanf("%d", &cantidad) != 1) {
        while ((c = getchar()) != '\n' && c != EOF) {
            // descartar el resto de la línea inválida
        }
        printf("No es un número. Intente otra vez: ");
        if (scanf("%d", &cantidad) != 1) {
            printf("Entrada inválida.\n");
            return 1;
        }
    }

    printf("Cantidad: %d\n", cantidad);
    return 0;
}
```

Repetir la pregunta hasta que el dato sea válido requiere un ciclo; lo harás en el módulo de control de flujo.

Un caso sutil: si el usuario escribe `12abc`, `scanf("%d", ...)` lee `12`, devuelve `1` y deja `abc` en el búfer. La lectura fue exitosa, pero lo que sigue en la línea quedó pendiente.

## Leer un carácter: el espacio antes de `%c`

`%d` y `%lf` omiten automáticamente los espacios y saltos de línea previos. `%c` **no**: lee el siguiente carácter, sea cual sea. Por eso este programa parece saltarse la segunda pregunta:

```c
#include <stdio.h>

int main(void) {
    int ruedas = 0;
    char inicial = ' ';

    printf("Cantidad de ruedas: ");
    if (scanf("%d", &ruedas) != 1) {
        return 1;
    }

    printf("Inicial de la marca: ");
    if (scanf("%c", &inicial) != 1) {   // lee el '\n' que dejó el Enter
        return 1;
    }

    printf("Ruedas: %d, inicial: %c\n", ruedas, inicial);
    return 0;
}
```

Tras escribir `4` y Enter, el búfer contiene `4\n`. `%d` consume el `4`, y `%c` toma el `'\n'` sin esperar. La corrección es un espacio antes de `%c`, que le indica a `scanf` que descarte todos los espacios en blanco previos:

```c
scanf(" %c", &inicial);
```

## Ejemplo completo

```c
#include <stdio.h>

int main(void) {
    int edad = 0;
    double altura = 0.0;
    char inicial = ' ';

    printf("Edad: ");
    if (scanf("%d", &edad) != 1) {
        printf("Edad inválida.\n");
        return 1;
    }

    printf("Altura en metros: ");
    if (scanf("%lf", &altura) != 1) {
        printf("Altura inválida.\n");
        return 1;
    }

    printf("Inicial del nombre: ");
    if (scanf(" %c", &inicial) != 1) {
        printf("No se pudo leer la inicial.\n");
        return 1;
    }

    printf("%-8s %d\n", "Edad:", edad);
    printf("%-8s %.2f m\n", "Altura:", altura);
    printf("%-8s %c\n", "Inicial:", inicial);
    return 0;
}
```

## Errores comunes

1. **Especificador que no coincide con el tipo.** `printf("%d", 3.5)` o `printf("%d", sizeof(int))`. Usa `%f` y `%zu`.
2. **Leer un `double` con `%f`.** En `scanf`, `double` va con `%lf`.
3. **Olvidar `&` en `scanf`.** `scanf("%d", edad)` es un error grave.
4. **No revisar lo que devuelve `scanf`.** El programa sigue con datos que nunca se leyeron.
5. **No descartar la entrada inválida.** Queda en el búfer y hace fallar la próxima lectura.
6. **`%c` sin espacio delante** después de leer un número.

## Resumen

- `printf` muestra texto y valores; cada tipo tiene su especificador (`%d`, `%u`, `%zu`, `%f`, `%c`, `%s`)
- el ancho (`%5d`), la alineación (`%-5d`) y la precisión (`%.2f`) controlan cómo se ve la salida
- `scanf` necesita `&variable`, la dirección de la variable, para poder escribir en ella
- `scanf` devuelve cuántos valores leyó: compáralo siempre para **validar** la entrada
- la entrada inválida queda en el búfer; descártala con un ciclo de `getchar`
- `" %c"` evita leer el salto de línea pendiente

## Ejercicios prácticos

### Ejercicio 1: predice la salida

```c
#include <stdio.h>

int main(void) {
    int puntos = 7;
    double promedio = 8.456;

    printf("[%4d][%-4d][%03d]\n", puntos, puntos, puntos);
    printf("[%.1f][%7.2f]\n", promedio, promedio);
    printf("100%%\n");
    return 0;
}
```

<details><summary>Ver solución</summary>

```text
[   7][7   ][007]
[8.5][   8.46]
100%
```

`%.1f` redondea a un decimal (8.456 → 8.5). `%7.2f` ocupa 7 caracteres en total, contando el punto. `%%` muestra un `%`.

</details>

### Ejercicio 2: encuentra los errores

Este programa compila con advertencias y no funciona. Encuentra los tres errores.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    double precio = 0.0;
    int unidades = 0;

    printf("Precio: ");
    scanf("%f", &precio);
    printf("Unidades: ");
    scanf("%d", unidades);

    printf("Total: %d\n", precio * unidades);
    return 0;
}
```

<details><summary>Ver solución</summary>

1. `precio` es `double`: en `scanf` se lee con `%lf`.
2. Falta `&` en `scanf("%d", unidades)`.
3. `precio * unidades` es `double`: se muestra con `%f`, no con `%d`.

Además, conviene validar cada lectura:

```c
#include <stdio.h>

int main(void) {
    double precio = 0.0;
    int unidades = 0;

    printf("Precio: ");
    if (scanf("%lf", &precio) != 1) {
        return 1;
    }
    printf("Unidades: ");
    if (scanf("%d", &unidades) != 1) {
        return 1;
    }

    printf("Total: %.2f\n", precio * unidades);
    return 0;
}
```

</details>

### Ejercicio 3: suma validada

Escribe un programa que pida dos enteros en una sola lectura, verifique que se leyeron los dos y muestre su suma. Si la entrada no es válida, debe mostrar `Entrada inválida.` y terminar con `return 1`.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int main(void) {
    int a = 0;
    int b = 0;

    printf("Ingrese dos enteros: ");
    if (scanf("%d %d", &a, &b) != 2) {
        printf("Entrada inválida.\n");
        return 1;
    }

    printf("%d + %d = %d\n", a, b, a + b);
    return 0;
}
```

Se compara con `2` porque se pidieron dos valores. Si el usuario escribe `5 x`, `scanf` devuelve `1` y el programa lo detecta.

</details>

### Ejercicio 4: ¿qué devuelve `scanf`?

Para `scanf("%d", &n)`, con `n` inicializada en `0`, indica qué devuelve, cuánto vale `n` y qué queda en el búfer con cada entrada: (a) `25` y Enter; (b) `abc` y Enter; (c) `8kg` y Enter.

<details><summary>Ver solución</summary>

- (a) Devuelve `1`, `n` vale `25`, queda `\n` en el búfer.
- (b) Devuelve `0`, `n` sigue valiendo `0`, queda `abc\n` en el búfer: hay que descartarlo con el ciclo de `getchar`.
- (c) Devuelve `1`, `n` vale `8`, queda `kg\n` en el búfer.

</details>
