---
title: 'Modularización y Funciones'
course: 'c'
slug: 'modularizacion-subprogramas-y-funciones'
order: 15
lang: 'es'
published: true
---

Cuando un programa empieza a crecer, escribir todo dentro de `main` deja de ser una buena idea. Funciona para ejemplos mínimos, pero en cuanto el problema crece necesitas dividir el programa en partes más pequeñas, comprensibles y reutilizables.

A eso se le llama **modularizar**.

## Objetivos

- Explicar por qué conviene dividir un programa en subprogramas.
- Distinguir **declaración**, **definición** y **llamada** de una función.
- Escribir prototipos, parámetros, valores de retorno y funciones `void`.
- Organizar un programa en varios archivos: un `.h` con la interfaz y un `.c` con la implementación.
- Proteger un encabezado con guardas de inclusión.
- Compilar cada archivo por separado y enlazarlos en un ejecutable.
- Ocultar funciones auxiliares con `static`.

**Requisitos previos:** `compilacion-y-enlazado` (preprocesador, `-c`, archivos `.o`, enlazador), `entrada-y-salida` y el módulo de control de flujo (`sentencia-if-else` a `programacion-esquematica-y-sentencias-anidadas`).

> Idea clave: modularizar es dividir un problema grande en partes pequeñas, cada una con una responsabilidad clara, para poder pensarlo, probarlo y mantenerlo mejor.

## ¿Por qué modularizar?

Imagina un programa que lee datos, los valida, calcula resultados y los muestra, todo mezclado en un solo bloque de `main`. Cada cambio obliga a releer todo, y un error en el cálculo queda escondido entre lecturas y `printf`.

Dividirlo en partes mejora varias cosas a la vez:

- cada parte tiene **una** responsabilidad y se entiende por sí sola;
- la lógica que se repite se escribe una vez y se reutiliza;
- cada parte se puede probar por separado;
- el programa crece con orden: agregar algo nuevo no obliga a tocar todo lo anterior.

En la lección de programación esquemática dividiste problemas en pasos (refinamiento sucesivo). Las funciones son la forma de llevar esos pasos al código.

## Subprogramas: funciones y procedimientos

Un **subprograma** es un bloque de código con nombre propio que realiza una tarea concreta. El programa lo invoca cada vez que necesita esa tarea.

Muchos libros distinguen dos tipos:

- una **función** calcula y **devuelve** un resultado (por ejemplo, la suma de dos números);
- un **procedimiento** realiza una **acción** y no devuelve nada útil (por ejemplo, mostrar un mensaje).

En C esa diferencia es solo conceptual: el lenguaje tiene un único mecanismo, la función. Lo que en otros lenguajes se llama procedimiento, en C es una función cuyo tipo de retorno es `void`.

## Anatomía de una función

```c
tipo_retorno nombre(parametros) {
    instrucciones;
}
```

- **tipo de retorno**: el tipo del valor que devuelve (`int`, `double`, `bool`, `char`) o `void` si no devuelve nada;
- **nombre**: cómo se la invoca;
- **parámetros**: los datos que recibe, cada uno con su tipo;
- **cuerpo**: las instrucciones entre llaves.

### Devolver un valor con `return`

```c
int sumar(int a, int b) {
    return a + b;
}
```

`return` termina la función en ese momento y entrega el valor a quien la llamó. Una función que no es `void` debe ejecutar un `return` con un valor en todos sus caminos: si un `if` devuelve algo y el `else` no, la función puede terminar sin valor, y usar ese resultado es comportamiento indefinido. Con `-Wall` el compilador te avisa.

### Funciones `void`

```c
void mostrar_linea(void) {
    printf("--------------------\n");
}
```

Una función `void` no devuelve valor. Puede usar `return;` (sin valor) para terminar antes, pero no es obligatorio: termina al llegar a la llave de cierre.

Fíjate en el `(void)` de la lista de parámetros: significa "esta función no recibe parámetros".

> **C básico:** escribe siempre `(void)` cuando una función no recibe parámetros, como en `int main(void)`.
>
> **C moderno (C23):** desde C23, `int f()` también significa "sin parámetros", igual que `int f(void)`.
>
> **Portabilidad:** en C17 y anteriores, `int f()` significaba "parámetros sin especificar": el compilador no comprobaba los argumentos de las llamadas. Si tu código debe compilar con estándares anteriores, `(void)` es la forma que significa lo mismo en todos.

## Parámetros y argumentos

Los **parámetros** son las variables que aparecen en la definición de la función. Los **argumentos** son los valores concretos que se pasan en cada llamada (algunos libros los llaman parámetros formales y parámetros reales, o nominales y efectivos).

```c
int area_rectangulo(int base, int altura) {   // base y altura: parámetros
    return base * altura;
}

int resultado = area_rectangulo(4, 7);        // 4 y 7: argumentos
```

Cada argumento se evalúa y su valor se copia en el parámetro correspondiente, en orden. El tipo debe ser compatible: si pasas un `int` a un parámetro `double`, se convierte automáticamente, como cualquier asignación. Cómo se comporta esa copia lo estudias a fondo en la próxima lección, `variables-parametros-y-pasaje`.

## Un primer programa con funciones

```c
#include <stdio.h>

int sumar(int a, int b) {
    return a + b;
}

void mostrar_resultado(int resultado) {
    printf("El resultado es %d\n", resultado);
}

int main(void) {
    int total = sumar(5, 3);
    mostrar_resultado(total);
    return 0;
}
```

La lógica quedó separada: una función calcula, otra muestra, y `main` coordina. Además, separar **calcular** de **mostrar** hace que `sumar` sirva en cualquier otro contexto, no solo para imprimir.

## Declaración, definición y prototipos

El compilador lee el archivo de arriba hacia abajo. Para compilar una llamada necesita saber, **antes** de esa línea, el nombre de la función, el tipo de sus parámetros y su tipo de retorno.

En el ejemplo anterior eso se cumple porque las funciones están definidas antes de `main`. Pero si `main` va primero:

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    printf("%d\n", sumar(5, 3));   // error: sumar todavía no fue declarada
    return 0;
}

int sumar(int a, int b) {
    return a + b;
}
```

Desde C99, llamar a una función no declarada es un error (en C antiguo se suponía que devolvía `int`; hoy eso ya no es válido).

La solución es separar dos ideas:

- **Definición**: la función completa, con su cuerpo. Hay exactamente una por función en todo el programa.
- **Declaración**: anuncia que la función existe y cómo se usa, sin el cuerpo. Puede repetirse.

La declaración de una función con los tipos de sus parámetros se llama **prototipo**:

```c
int sumar(int a, int b);   // prototipo: termina en punto y coma, no tiene cuerpo
```

Con prototipos, el orden de las definiciones deja de importar:

```c
#include <stdio.h>

// Prototipos: la "lista de contenidos" del archivo
int sumar(int a, int b);
void mostrar_resultado(int resultado);

int main(void) {
    mostrar_resultado(sumar(5, 3));
    return 0;
}

// Definiciones
int sumar(int a, int b) {
    return a + b;
}

void mostrar_resultado(int resultado) {
    printf("El resultado es %d\n", resultado);
}
```

Además de permitir cualquier orden, el prototipo deja que el compilador **compruebe** cada llamada: si pasas tres argumentos a `sumar`, o un argumento de un tipo incompatible, lo detecta en la compilación.

En el prototipo los nombres de los parámetros son opcionales (`int sumar(int, int);` es válido), pero conviene escribirlos: documentan qué significa cada uno.

## Funciones que llaman a funciones

Una función puede llamar a otras. Así se construyen soluciones grandes a partir de piezas pequeñas:

```c
#include <stdio.h>

bool es_par(int n);
int mayor(int a, int b);
int mayor_de_tres(int a, int b, int c);

int main(void) {
    int x = 0;
    int y = 0;
    int z = 0;

    printf("Ingresa tres enteros: ");
    if (scanf("%d %d %d", &x, &y, &z) != 3) {
        printf("Entrada inválida.\n");
        return 1;
    }

    int m = mayor_de_tres(x, y, z);
    printf("El mayor es %d y %s\n", m, es_par(m) ? "es par" : "es impar");
    return 0;
}

bool es_par(int n) {
    return n % 2 == 0;
}

int mayor(int a, int b) {
    return a > b ? a : b;
}

int mayor_de_tres(int a, int b, int c) {
    return mayor(mayor(a, b), c);
}
```

`mayor_de_tres` no repite la comparación: reutiliza `mayor`. Si algún día cambia la forma de comparar, se corrige en un solo lugar.

Cuando una función termina, la ejecución vuelve **exactamente** al punto desde donde fue llamada. Cada llamada tiene sus propios parámetros y variables locales; en la lección `recursividad` verás cómo se organizan esas llamadas en la pila de llamadas.

## Programas en varios archivos

Cuando el programa crece, también conviene repartirlo en archivos. La convención en C es:

- un archivo **`.h`** (encabezado o cabecera) con la **interfaz**: los prototipos de lo que el módulo ofrece;
- un archivo **`.c`** con la **implementación**: las definiciones de esas funciones;
- un `main.c` que **usa** el módulo incluyendo su encabezado.

Vamos a construir un módulo `calculadora`.

### El encabezado: `calculadora.h`

```c
#ifndef CALCULADORA_H
#define CALCULADORA_H

// Interfaz del módulo calculadora.

int sumar(int a, int b);
int restar(int a, int b);
int multiplicar(int a, int b);

// Devuelve true si se puede dividir por divisor.
bool se_puede_dividir(int divisor);

// Requiere divisor != 0 (compruébalo antes con se_puede_dividir).
int dividir(int dividendo, int divisor);

// Devuelve a*a + b*b.
int suma_de_cuadrados(int a, int b);

#endif
```

Las tres líneas del preprocesador son las **guardas de inclusión**:

- `#ifndef CALCULADORA_H`: "si el nombre `CALCULADORA_H` todavía no está definido...";
- `#define CALCULADORA_H`: "...defínelo ahora...";
- `#endif`: "...y fin de la parte condicional".

La primera vez que el preprocesador incluye el archivo, el nombre no existe y el contenido se copia. Si el mismo encabezado llega otra vez a la misma unidad de compilación (por ejemplo, porque otro encabezado también lo incluye), el nombre ya está definido y el contenido se salta.

Repetir un prototipo es legal, así que en este encabezado las guardas todavía no evitan un error. Pero los encabezados pronto contendrán definiciones de tipos (verás `struct` y `typedef` en `concepto-de-estructuras`), y esas **no** se pueden repetir. Por eso todo encabezado lleva guardas desde el primer día. El nombre suele ser el del archivo en mayúsculas, con `_H` al final.

### La implementación: `calculadora.c`

```c
#include "calculadora.h"

// Función auxiliar: solo existe dentro de este archivo.
static int cuadrado(int x) {
    return x * x;
}

int sumar(int a, int b) {
    return a + b;
}

int restar(int a, int b) {
    return a - b;
}

int multiplicar(int a, int b) {
    return a * b;
}

bool se_puede_dividir(int divisor) {
    return divisor != 0;
}

int dividir(int dividendo, int divisor) {
    return dividendo / divisor;
}

int suma_de_cuadrados(int a, int b) {
    return cuadrado(a) + cuadrado(b);
}
```

La implementación incluye su propio encabezado: así el compilador comprueba que cada definición coincide con su prototipo.

Fíjate en las comillas: `#include "calculadora.h"` busca el archivo primero en la carpeta del proyecto; `#include <stdio.h>` busca en las carpetas del sistema.

### El programa: `main.c`

```c
#include <stdio.h>
#include "calculadora.h"

int main(void) {
    int a = 0;
    int b = 0;

    printf("Ingresa dos enteros: ");
    if (scanf("%d %d", &a, &b) != 2) {
        printf("Entrada inválida.\n");
        return 1;
    }

    printf("%d + %d = %d\n", a, b, sumar(a, b));
    printf("%d - %d = %d\n", a, b, restar(a, b));
    printf("%d * %d = %d\n", a, b, multiplicar(a, b));

    if (se_puede_dividir(b)) {
        printf("%d / %d = %d\n", a, b, dividir(a, b));
    } else {
        printf("No se puede dividir por cero.\n");
    }

    printf("%d^2 + %d^2 = %d\n", a, b, suma_de_cuadrados(a, b));
    return 0;
}
```

`main.c` no sabe **cómo** está hecha la calculadora: solo conoce sus prototipos. Eso es todo lo que el compilador necesita para compilarlo.

### Compilar por separado y enlazar

En `compilacion-y-enlazado` viste que `-c` compila un archivo hasta el código objeto (`.o`) sin enlazar. En un proyecto de varios archivos eso se hace con cada `.c`:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -c calculadora.c    # produce calculadora.o
gcc -std=c23 -Wall -Wextra -Wpedantic -c main.c           # produce main.o
gcc calculadora.o main.o -o calculadora                   # enlaza el ejecutable
./calculadora
```

Cada `.c` es una **unidad de compilación** independiente: el compilador traduce `main.c` sin mirar `calculadora.c`. La llamada a `sumar` queda en `main.o` como una referencia pendiente; el **enlazador** la resuelve al enlazar, buscando la definición de `sumar` en `calculadora.o`.

Para proyectos chicos, un solo comando hace todo (compila cada `.c` y enlaza):

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic main.c calculadora.c -o calculadora
```

Los `.h` **no** se compilan ni se pasan al compilador: entran en cada `.c` a través de `#include`.

¿Por qué compilar por separado? Porque si cambias solo `main.c`, basta con recompilar `main.c` y volver a enlazar. En proyectos con cientos de archivos, eso ahorra mucho tiempo (y es lo que automatizan herramientas como `make`).

### Errores típicos de enlazado

Si olvidas un archivo al enlazar:

```bash
gcc main.o -o calculadora
```

el compilador no se queja (`main.o` se compiló bien), pero el enlazador sí: informa algo como `undefined reference to 'sumar'` (en Clang, `Undefined symbols ... _sumar`). Hay una referencia sin definición.

El error contrario aparece si **defines** una función en el `.h` en lugar de declararla. Si dos `.c` incluyen ese encabezado, la función queda definida dos veces y el enlazador informa `multiple definition of 'sumar'`. Regla práctica: en el `.h` van declaraciones, en el `.c` van definiciones.

## Interfaz e implementación

Esta separación es la idea más importante de la lección:

- la **interfaz** (`calculadora.h`) es un contrato: qué funciones hay, qué reciben, qué devuelven y qué condiciones exigen (como `divisor != 0`);
- la **implementación** (`calculadora.c`) es cómo se cumple ese contrato.

Quien usa el módulo lee la interfaz, no la implementación. Si mañana cambias cómo se calcula algo dentro de `calculadora.c` sin tocar los prototipos, `main.c` no cambia: solo se recompila `calculadora.c` y se vuelve a enlazar.

Por eso conviene documentar en el `.h` lo que el usuario necesita saber, como hicimos con la precondición de `dividir`.

## Ocultar funciones auxiliares con `static`

En `calculadora.c`, `cuadrado` está marcada como `static`. Aplicado a una función, `static` significa que su nombre solo es visible **dentro de ese archivo**: el enlazador no la ofrece a otras unidades de compilación.

Eso sirve para dos cosas:

- **ocultar detalles**: `cuadrado` es un ayudante interno, no parte de la interfaz, así que no aparece en el `.h`;
- **evitar choques de nombres**: otro archivo puede tener su propia función `cuadrado` sin que el enlazador vea dos definiciones.

Si `main.c` intentara llamar a `cuadrado`, no compilaría (no hay prototipo) y, aunque agregaras uno a mano, el enlazador no la encontraría.

Regla práctica: toda función que no figura en el `.h` debería ser `static`.

(La palabra `static` también se usa con variables, con otro significado; lo verás en la próxima lección.)

## ¿Cuándo conviene crear una función?

- cuando una tarea tiene sentido por sí misma y se puede nombrar con un verbo claro (`calcular_promedio`, `mostrar_menu`);
- cuando una lógica se repite;
- cuando un bloque de `main` creció demasiado para leerlo de una vez;
- cuando quieres probar una parte por separado.

## Errores comunes

1. **Meter todo en `main`.** El código se vuelve difícil de leer, probar y modificar.
2. **Funciones sin una responsabilidad clara.** Si el nombre necesita un "y" (`leer_y_calcular_y_mostrar`), probablemente son varias funciones.
3. **Mezclar cálculo con entrada y salida.** Una función que calcula y además imprime no se puede reutilizar donde no se quiere imprimir.
4. **Olvidar el prototipo** de una función definida más abajo, o declarar uno que no coincide con la definición.
5. **Olvidar un `return`** en algún camino de una función que no es `void`.
6. **Definir funciones en un `.h`**, o pasar los `.h` al compilador como si fueran `.c`.

## Resumen

- Modularizar es dividir un programa en partes con responsabilidades claras.
- En C, todos los subprogramas son funciones; los "procedimientos" son funciones `void`.
- La **definición** tiene el cuerpo y es única; la **declaración** (prototipo) anuncia nombre, parámetros y tipo de retorno.
- Un proyecto modular separa la **interfaz** (`.h`, con guardas `#ifndef`/`#define`/`#endif`) de la **implementación** (`.c`).
- Cada `.c` se compila con `-c` a un `.o`, y el enlazador une los `.o` en un ejecutable.
- `static` en una función la oculta dentro de su archivo.

## Ejercicios prácticos

### Ejercicio 1: ordenar con prototipos

Este programa no compila porque `main` llama a funciones definidas más abajo. Corrígelo **sin mover** ninguna función.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    mostrar_titulo();
    printf("El doble de 21 es %d\n", doble(21));
    return 0;
}

void mostrar_titulo(void) {
    printf("== Dobles ==\n");
}

int doble(int n) {
    return 2 * n;
}
```

<details><summary>Ver solución</summary>

Basta con agregar los prototipos antes de `main`:

```c
#include <stdio.h>

void mostrar_titulo(void);
int doble(int n);

int main(void) {
    mostrar_titulo();
    printf("El doble de 21 es %d\n", doble(21));
    return 0;
}

void mostrar_titulo(void) {
    printf("== Dobles ==\n");
}

int doble(int n) {
    return 2 * n;
}
```

</details>

### Ejercicio 2: funciones que se apoyan en otras

Escribe `bool es_divisible(int a, int b)` (devuelve si `a` es divisible por `b`, con `b` distinto de cero) y, usándola, `bool es_bisiesto(int anio)`: un año es bisiesto si es divisible por 4, salvo que sea divisible por 100 y no por 400. Lee un año en `main` y muestra si es bisiesto.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

bool es_divisible(int a, int b);
bool es_bisiesto(int anio);

int main(void) {
    int anio = 0;

    printf("Año: ");
    if (scanf("%d", &anio) != 1) {
        printf("Entrada inválida.\n");
        return 1;
    }

    printf("%d %s bisiesto\n", anio, es_bisiesto(anio) ? "es" : "no es");
    return 0;
}

bool es_divisible(int a, int b) {
    return a % b == 0;
}

bool es_bisiesto(int anio) {
    if (es_divisible(anio, 400)) {
        return true;
    }
    if (es_divisible(anio, 100)) {
        return false;
    }
    return es_divisible(anio, 4);
}
```

`es_bisiesto` devuelve un valor en todos sus caminos, y la regla de divisibilidad se escribe una sola vez.

</details>

### Ejercicio 3: un módulo de temperaturas

Crea un módulo `temperatura` con dos funciones públicas, `double celsius_a_fahrenheit(double c)` y `double fahrenheit_a_celsius(double f)`, y un `main.c` que lea una temperatura en grados Celsius y muestre su equivalente en Fahrenheit. Escribe los tres archivos y los comandos para compilar cada uno por separado y enlazarlos.

<details><summary>Ver solución</summary>

`temperatura.h`:

```c
#ifndef TEMPERATURA_H
#define TEMPERATURA_H

double celsius_a_fahrenheit(double c);
double fahrenheit_a_celsius(double f);

#endif
```

`temperatura.c`:

```c
#include "temperatura.h"

double celsius_a_fahrenheit(double c) {
    return c * 9.0 / 5.0 + 32.0;
}

double fahrenheit_a_celsius(double f) {
    return (f - 32.0) * 5.0 / 9.0;
}
```

`main.c`:

```c
#include <stdio.h>
#include "temperatura.h"

int main(void) {
    double c = 0.0;

    printf("Grados Celsius: ");
    if (scanf("%lf", &c) != 1) {
        printf("Entrada inválida.\n");
        return 1;
    }

    printf("%.1f °C = %.1f °F\n", c, celsius_a_fahrenheit(c));
    return 0;
}
```

Compilación y enlazado:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -c temperatura.c
gcc -std=c23 -Wall -Wextra -Wpedantic -c main.c
gcc temperatura.o main.o -o temperatura
```

</details>

### Ejercicio 4: diagnosticar el enlazado

Un compañero compila así y obtiene `undefined reference to 'celsius_a_fahrenheit'`:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic main.c -o temperatura
```

¿En qué etapa falla, por qué, y cómo se corrige? ¿Qué error obtendría si, en cambio, hubiera escrito el **cuerpo** de las funciones dentro de `temperatura.h` y lo incluyera desde dos archivos `.c`?

<details><summary>Ver solución</summary>

Falla en el **enlazado**, no en la compilación: `main.c` compila bien porque el prototipo de `temperatura.h` alcanza para comprobar la llamada, pero nadie le entrega al enlazador la **definición** de `celsius_a_fahrenheit`, que está en `temperatura.c`. Se corrige agregando ese archivo (o su `.o`) al comando:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic main.c temperatura.c -o temperatura
```

Si las definiciones estuvieran en el `.h` y dos `.c` lo incluyeran, cada `.o` tendría su propia copia de la función y el enlazador informaría `multiple definition`. En el `.h` van declaraciones; en el `.c`, definiciones.

</details>
