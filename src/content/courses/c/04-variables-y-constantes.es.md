---
title: 'Variables y Constantes'
course: 'c'
slug: 'variables-y-constantes'
order: 4
lang: 'es'
published: true
---

Las **variables** y las **constantes** son la base de casi todo programa. Antes de pedir datos al usuario, antes de tomar decisiones y antes de repetir tareas, un programa necesita **guardar información** y darle un nombre.

## Objetivos

Al terminar esta lección podrás:

- explicar qué es una variable y qué significa declararla, inicializarla y asignarle un valor
- reconocer por qué leer una variable sin inicializar es un error
- elegir nombres válidos y claros para tus variables
- escribir literales enteros, de punto flotante, de carácter y de cadena, con sus sufijos `u`, `l` y `f`
- declarar constantes con `const` y con `#define`, y decidir cuándo conviene cada una

**Requisitos previos:** lecciones 1 (*Introducción y estructura*), 2 (*Procesos y estados*) y 3 (*Compilación y enlazado*). Todos los programas se compilan con el comando del curso:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
```

## ¿Qué es una variable?

Una **variable** es un espacio de memoria que tiene:

1. un **tipo de dato**, que indica qué clase de valor guarda
2. un **nombre**, con el que el programa lo encuentra
3. un **valor**, que puede cambiar mientras el programa se ejecuta

Piensa en una caja con una etiqueta: la etiqueta es el nombre, el contenido es el valor y el tipo indica qué cosas caben en la caja.

```c
int edad = 18;
```

- `int` indica que la variable guarda un número entero
- `edad` es el nombre
- `18` es el valor inicial

Un modelo mental útil para empezar:

```text
edad      → 18
precio    → 1499.50
inicial   → F
```

La memoria real no se ve así, pero la idea es correcta: **cada variable reserva un lugar para un dato y su nombre permite encontrarlo**.

## Declarar, inicializar y asignar

Estas tres ideas se parecen, pero no son lo mismo.

**Declarar** es anunciarle al compilador que la variable existe y qué tipo tiene:

```c
int edad;
```

**Inicializar** es darle un valor en el mismo momento en que se declara:

```c
int edad = 18;
```

**Asignar** es guardar un valor en una variable que ya existe, con el operador `=`:

```c
int edad;
edad = 18;
edad = 19;
```

Después de esas líneas, `edad` vale `19`. La variable es la misma; su contenido cambió. Por eso se llama *variable*.

Puedes declarar varias variables del mismo tipo en una línea, aunque una por línea suele leerse mejor:

```c
int ancho = 3, alto = 4;
```

## Variables sin inicializar: un error real

Esta es una de las reglas más importantes de la lección.

Una variable local que se declara sin inicializar tiene un **valor indeterminado**. No vale cero ni ningún valor "por defecto": contiene lo que haya quedado en esa zona de memoria. **Leer ese valor antes de asignarle uno es un error de programa**, aunque compile y a veces parezca funcionar.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int total;           // declarada, pero nunca inicializada
    total = total + 10;  // ERROR: lee un valor indeterminado
    printf("%d\n", total);
    return 0;
}
```

Con `-Wall` el compilador suele avisarte (`variable 'total' is uninitialized when used here`). Esa advertencia es un error de lógica: corrígela, no la ignores.

La solución es simple: **inicializa cada variable con un valor que tenga sentido** para tu programa.

```c
int total = 0;
double precio = 0.0;
char inicial = ' ';
```

No siempre el valor inicial será cero, pero el programa siempre debe saber con qué valor empieza.

## Reglas para nombrar variables

Un nombre (en C se dice **identificador**):

- puede usar letras, dígitos y guion bajo `_`
- debe comenzar con una letra o con `_`
- no puede comenzar con un dígito
- no puede tener espacios ni guiones medios
- no puede ser una palabra reservada (`int`, `float`, `return`, `const`...)
- distingue mayúsculas de minúsculas: `edad` y `Edad` son nombres distintos

Válidos:

```text
edad
edadAlumno
numero1
precio_final
```

Inválidos:

```text
1edad          (empieza con un dígito)
mi edad        (tiene un espacio)
float          (palabra reservada)
precio-final   (el guion medio es el operador resta)
```

> **Portabilidad:** los nombres que empiezan con guion bajo seguido de mayúscula (`_Total`) o con dos guiones bajos (`__total`) están reservados para el compilador y la biblioteca estándar. Evita empezar tus nombres con `_`.

### Buenos nombres

Que un nombre sea válido no significa que sea claro. Compara:

```c
int x;
float a;
```

con:

```c
int cantidadAlumnos;
float precioProducto;
```

Un buen nombre describe el dato y evita que quien lee tenga que adivinar. Elige un estilo (`cantidadAlumnos` o `cantidad_alumnos`) y mantenlo en todo el programa.

## Literales

Un **literal** es un valor escrito directamente en el código, como `18`, `3.5` o `'A'`. Cada literal tiene un tipo, y conocerlo evita sorpresas.

### Literales enteros

```c
int decimal = 255;
int hexadecimal = 0xFF;  // 255 en base 16
int octal = 0377;        // 255 en base 8: ¡el 0 inicial cambia la base!
```

Un `0` delante convierte el número en octal: `010` vale `8`, no `10`. No agregues ceros a la izquierda "para alinear".

Los **sufijos** cambian el tipo del literal:

| Literal | Tipo |
| --- | --- |
| `100` | `int` |
| `100u` | `unsigned int` |
| `100l` | `long` |
| `100ul` | `unsigned long` |
| `100ll` | `long long` |

Se pueden escribir en mayúscula (`100L`); de hecho `L` se recomienda porque `l` se confunde con `1`. Los tipos `unsigned` y `long` se estudian en la lección 5.

### Literales de punto flotante

```c
double pi = 3.14159;     // sin sufijo: es double
float gravedad = 9.81f;  // sufijo f: es float
double grande = 1.5e6;   // notación científica: 1 500 000
```

Un literal con punto decimal y sin sufijo es `double`. Si lo guardas en un `float`, escribe el sufijo `f` para que el tipo del literal coincida con el de la variable.

### Literales de carácter

Un carácter va entre **comillas simples**:

```c
char letra = 'A';
char salto = '\n';      // secuencia de escape: salto de línea
char comilla = '\'';    // una comilla simple
char barra = '\\';      // una barra invertida
```

`'7'` no es lo mismo que `7`: el primero es el carácter siete, el segundo es el número siete.

### Literales de cadena

Una cadena va entre **comillas dobles**: `"Hola, mundo\n"`. Ya la usaste con `printf`. Por ahora solo la usaremos para mostrar texto; cómo se guardan y manipulan las cadenas lo verás en la lección 21.

> **C moderno (C23):** puedes separar los dígitos de un número largo con apóstrofes para leerlo mejor: `1'000'000` es lo mismo que `1000000`. C23 también incorpora al estándar los literales binarios: `0b1010` vale `10`.
>
> **Portabilidad:** antes de C23, los literales binarios eran una extensión de GCC y Clang, no C estándar, y los separadores de dígitos no existían. Con `-std=c17` no los uses.

## Constantes

Una **constante** es un dato que no debe cambiar durante la ejecución: los días de la semana, la cantidad de meses del año, un IVA fijo. Darle un nombre en lugar de escribir el número suelto ("número mágico") hace el código más claro y más fácil de cambiar.

C ofrece dos herramientas: `const` y `#define`.

### Constantes con `const`

```c
const int DIAS_SEMANA = 7;
const double IVA = 0.21;
```

`const` crea un objeto con tipo que **no se puede modificar**. Si intentas asignarle un valor, el programa no compila:

<!-- c-check: skip -->
```c
int main(void) {
    const int DIAS_SEMANA = 7;
    DIAS_SEMANA = 8;   // error: cannot assign to variable with const-qualified type
    return 0;
}
```

Ese error es una ayuda: el compilador protege un valor que decidiste fijo.

### Constantes con `#define`

```c
#define MESES_ANIO 12
#define PI 3.14159
```

`#define` es una directiva del **preprocesador** (la viste en la lección 3). Antes de compilar, el preprocesador reemplaza cada aparición de `MESES_ANIO` por el texto `12`. No crea ninguna variable: es una sustitución de texto. Por eso no lleva `=` ni `;`.

Como es solo texto, una macro sin paréntesis puede dar resultados inesperados:

```c
#define LADO 2 + 3
int area = LADO * LADO;   // se convierte en 2 + 3 * 2 + 3, que vale 11, no 25
```

La regla: si el valor de una macro es una expresión, ponlo entre paréntesis: `#define LADO (2 + 3)`.

### ¿Cuándo conviene cada una?

| | `const` | `#define` |
| --- | --- | --- |
| Qué es | un objeto con tipo | texto que se reemplaza antes de compilar |
| Tipo | sí, el compilador lo verifica | no tiene tipo propio |
| Alcance | respeta las llaves `{}` donde se declara | vale desde la línea del `#define` hasta el final del archivo |
| Visible en el depurador | sí | no |

Regla práctica:

- prefiere **`const`** para valores con tipo que usa tu programa (`const double IVA = 0.21;`)
- usa **`#define`** cuando necesitas una constante que el preprocesador o el compilador deban conocer antes de ejecutar, como el tamaño de un arreglo (lección 19), o para configurar la compilación

Por convención, las constantes se escriben en MAYÚSCULAS con guiones bajos, sobre todo las macros, para que se distingan de las variables a simple vista.

> **C moderno (C23):** C23 agrega `constexpr`, que declara constantes con tipo que el compilador conoce en tiempo de compilación, y reemplaza muchos usos de `#define`. Lo verás en detalle en el módulo avanzado (*C moderno y C23*); en este curso básico usamos `const` y `#define`.

## Ejemplo completo

```c
#include <stdio.h>

#define MESES_ANIO 12

int main(void) {
    const double IVA = 0.21;
    int edad = 18;
    double precio = 1500.0;
    char inicial = 'F';

    edad = edad + 1;   // asignación: ahora vale 19

    printf("Edad: %d\n", edad);
    printf("Inicial: %c\n", inicial);
    printf("Precio con IVA: %f\n", precio + precio * IVA);
    printf("Meses del año: %d\n", MESES_ANIO);

    return 0;
}
```

`%d`, `%c` y `%f` le indican a `printf` cómo mostrar un entero, un carácter y un número con decimales. Los estudiarás a fondo en la lección 6.

## Errores comunes

1. **Leer una variable sin inicializar.** Su valor es indeterminado. Inicializa siempre.
2. **Confundir declarar con inicializar.** `int edad;` solo declara; `int edad = 18;` declara e inicializa.
3. **Escribir ceros a la izquierda.** `010` es octal y vale `8`.
4. **Guardar un literal `double` en un `float` sin sufijo.** Escribe `9.81f`.
5. **Macros sin paréntesis.** `#define LADO 2 + 3` rompe las cuentas.
6. **Números mágicos.** Si un valor fijo tiene significado, dale un nombre con `const` o `#define`.

## Resumen

- una **variable** tiene tipo, nombre y un valor que puede cambiar
- **declarar** crea la variable; **inicializar** le da valor al crearla; **asignar** le da valor después
- una variable local sin inicializar tiene un valor **indeterminado**: leerlo es un error
- los identificadores siguen reglas fijas y distinguen mayúsculas de minúsculas
- cada **literal** tiene un tipo; los sufijos `u`, `l`, `ll` y `f` lo cambian
- `const` crea una constante con tipo; `#define` hace una sustitución de texto
- C23 agrega separadores de dígitos, literales binarios estándar y `constexpr`

## Ejercicios prácticos

### Ejercicio 1: predice la salida

Sin ejecutarlo, ¿qué muestra este programa?

```c
#include <stdio.h>

#define BASE 4 + 1

int main(void) {
    int resultado = BASE * 2;
    printf("%d\n", resultado);
    return 0;
}
```

<details><summary>Ver solución</summary>

Muestra `6`, no `10`. El preprocesador reemplaza el texto y la expresión queda `4 + 1 * 2`, donde la multiplicación se resuelve primero: `4 + 2 = 6`. Corrección: `#define BASE (4 + 1)`, y así el resultado es `10`.

</details>

### Ejercicio 2: encuentra el error

Este programa debería sumar tres precios, pero a veces muestra un número absurdo. ¿Por qué?

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    double total;
    total = total + 120.5;
    total = total + 80.0;
    total = total + 49.5;
    printf("Total: %f\n", total);
    return 0;
}
```

<details><summary>Ver solución</summary>

`total` no está inicializada: su valor es indeterminado y la primera suma lo lee. Es un error aunque compile. Corrección:

```c
#include <stdio.h>

int main(void) {
    double total = 0.0;
    total = total + 120.5;
    total = total + 80.0;
    total = total + 49.5;
    printf("Total: %f\n", total);
    return 0;
}
```

Ahora muestra `Total: 250.000000`.

</details>

### Ejercicio 3: elige literales y constantes

Reescribe estas líneas para que el tipo de cada literal coincida con el de la variable y los números fijos tengan nombre:

```c
float temperatura = 36.5;
double precioFinal = 2000.0 + 2000.0 * 0.21;
int dias = 7 * 4;
```

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

#define DIAS_SEMANA 7

int main(void) {
    const double IVA = 0.21;
    const double PRECIO_BASE = 2000.0;

    float temperatura = 36.5f;
    double precioFinal = PRECIO_BASE + PRECIO_BASE * IVA;
    int dias = DIAS_SEMANA * 4;

    printf("%f %f %d\n", temperatura, precioFinal, dias);
    return 0;
}
```

El sufijo `f` hace que `36.5f` sea `float`. `IVA` y `PRECIO_BASE` son valores con tipo, por eso usan `const`; `DIAS_SEMANA` podría ser cualquiera de las dos.

</details>

### Ejercicio 4: nombres válidos

¿Cuáles de estos identificadores son válidos en C? `total2`, `2total`, `precio_final`, `precio-final`, `return`, `Return`.

<details><summary>Ver solución</summary>

Válidos: `total2`, `precio_final` y `Return` (C distingue mayúsculas, así que `Return` no es la palabra reservada `return`, aunque usarlo sería confuso). Inválidos: `2total` (empieza con un dígito), `precio-final` (el guion es el operador resta) y `return` (palabra reservada).

</details>
