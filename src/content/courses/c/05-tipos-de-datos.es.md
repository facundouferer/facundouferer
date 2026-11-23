---
title: 'Tipos de Datos'
course: 'c'
slug: 'tipos-de-datos'
description: 'Domina los tipos enteros, de punto flotante y bool en C23, mide su tamaño con sizeof y size_t, y controla las conversiones implícitas y explícitas.'
order: 5
lang: 'es'
published: true
---

En la lección anterior guardaste valores en variables. Ahora aparece una pregunta fundamental:

> ¿Qué clase de dato estoy guardando realmente, y qué puede pasarle?

En C no alcanza con decir "quiero guardar un número". Hay que decir **qué tipo de número**, porque el tipo decide qué valores caben, cuánta memoria se usa y qué resultado dan las operaciones.

## Objetivos

Al terminar esta lección podrás:

- distinguir los tipos enteros con signo (`signed`) y sin signo (`unsigned`)
- diferenciar los rangos mínimos que garantiza el estándar de los tamaños reales de tu máquina
- consultar límites con `<limits.h>` (`INT_MAX`) y tamaños con `sizeof`, cuyo resultado es un `size_t` que se muestra con `%zu`
- elegir entre `float` y `double` sabiendo que son aproximados
- usar `bool` tanto en C básico como en C23
- predecir una **conversión implícita** y escribir una **conversión explícita** con un cast como `(double)`
- reconocer el desbordamiento de enteros con y sin signo

**Requisitos previos:** lecciones 1 a 4, en especial *Variables y constantes* (literales y sus sufijos).

## ¿Qué es un tipo de dato?

Un **tipo de dato** le indica al compilador:

- qué valores puede guardar una variable (su **dominio** o **rango**)
- cuánta memoria ocupa
- cómo se interpretan sus bits
- qué operaciones tienen sentido y qué resultado producen

Los tipos básicos de C son los **enteros** (`char`, `short`, `int`, `long`, `long long`), los de **punto flotante** (`float`, `double`, `long double`) y el **booleano** (`bool`).

## Tipos enteros

Los enteros guardan números sin parte decimal. C ofrece varios tamaños:

```c
short       pasos = 1200;
int         edad = 18;
long        poblacion = 46000000L;
long long   bytesDisco = 512000000000LL;
```

### Con signo y sin signo

Cada tipo entero existe en dos versiones:

- **con signo** (`signed`, el valor por omisión): guarda negativos, cero y positivos
- **sin signo** (`unsigned`): solo guarda cero y positivos, pero llega al doble de alto

```c
int temperatura = -5;           // puede ser negativa
unsigned int visitas = 3000u;   // nunca es negativa
```

`unsigned` sirve para cantidades que nunca son negativas y para trabajar con bits. Para cuentas comunes, `int` es la opción natural: mezclar con y sin signo trae sorpresas, como verás más abajo.

### Rangos garantizados y tamaños reales

El estándar de C **no fija** el tamaño exacto de cada tipo: fija un **mínimo garantizado** y un orden (`short` ≤ `int` ≤ `long` ≤ `long long`). Cada compilador y cada plataforma eligen el tamaño real.

| Tipo | Mínimo garantizado | Tamaño típico en Linux/macOS de 64 bits |
| --- | --- | --- |
| `char` | 8 bits | 8 bits |
| `short` | 16 bits | 16 bits |
| `int` | 16 bits | 32 bits |
| `long` | 32 bits | 64 bits (32 bits en Windows) |
| `long long` | 64 bits | 64 bits |

Consecuencia práctica: un programa que necesita guardar 3 000 000 000 no debería confiar en `int` ni en `long`, porque en algunas plataformas no alcanzan. `long long` sí está garantizado.

> **C moderno (C23):** C23 exige que los enteros con signo se representen en **complemento a dos**, que es lo que ya usaban todas las máquinas actuales. Así, un `int` de 32 bits va de −2 147 483 648 a 2 147 483 647 en cualquier compilador C23.

### `<limits.h>`: los límites de tu máquina

En lugar de memorizar números, consúltalos. El encabezado `<limits.h>` define constantes con los límites reales:

```c
#include <stdio.h>
#include <limits.h>

int main(void) {
    printf("int:          de %d a %d\n", INT_MIN, INT_MAX);
    printf("unsigned int: de 0 a %u\n", UINT_MAX);
    printf("long long:    hasta %lld\n", LLONG_MAX);
    printf("bits por char: %d\n", CHAR_BIT);
    return 0;
}
```

En una máquina típica de 64 bits muestra:

```text
int:          de -2147483648 a 2147483647
unsigned int: de 0 a 4294967295
long long:    hasta 9223372036854775807
bits por char: 8
```

Fíjate en los especificadores: `%d` para `int`, `%u` para `unsigned int`, `%lld` para `long long`. Cada tipo tiene el suyo; la lección 6 los reúne en una tabla.

## `sizeof` y `size_t`

El operador **`sizeof`** devuelve cuántos bytes ocupa un tipo o una variable. Se calcula al compilar, no al ejecutar.

```c
#include <stdio.h>

int main(void) {
    double altura = 1.75;

    printf("char:      %zu byte\n", sizeof(char));
    printf("int:       %zu bytes\n", sizeof(int));
    printf("long long: %zu bytes\n", sizeof(long long));
    printf("altura:    %zu bytes\n", sizeof altura);
    return 0;
}
```

Detalles importantes:

- `sizeof(char)` vale **siempre 1**, por definición. Los demás tamaños se miden en "cantidad de `char`".
- Con un tipo se usan paréntesis: `sizeof(int)`. Con una variable son opcionales: `sizeof altura`.
- El resultado es de tipo **`size_t`**: un entero sin signo pensado para tamaños y cantidades. Se muestra con **`%zu`**. Usar `%d` es un error de formato, y `-Wall` te avisa.

```c
size_t bytes = sizeof(int);
```

Vas a ver `size_t` en todos lados: en tamaños de arreglos, en longitudes de cadenas y en la memoria dinámica.

## Tipos de punto flotante

`float`, `double` y `long double` guardan números con parte decimal, de forma **aproximada**.

| Tipo | Precisión típica | Literal |
| --- | --- | --- |
| `float` | unos 6-7 dígitos decimales | `1.5f` |
| `double` | unos 15-16 dígitos decimales | `1.5` |
| `long double` | igual o más que `double` | `1.5L` |

Usa `double` salvo que tengas un motivo para ahorrar memoria: es el tipo de los literales decimales y el que usan las funciones matemáticas.

Que sean aproximados tiene consecuencias. `0.1` no tiene representación exacta en binario:

```c
#include <stdio.h>

int main(void) {
    double suma = 0.1 + 0.2;
    printf("%.17f\n", suma);
    return 0;
}
```

Muestra `0.30000000000000004`. Por eso **no compares números de punto flotante con `==`**: compara si su diferencia es muy pequeña. Y nunca uses `float` o `double` para dinero exacto: trabaja en centavos con enteros.

## `char`: un entero pequeño

Un `char` guarda un carácter, pero en realidad es un **entero pequeño**: el código numérico del carácter. En ASCII, `'A'` vale 65.

```c
#include <stdio.h>

int main(void) {
    char letra = 'A';
    char siguiente = letra + 1;

    printf("%c vale %d\n", letra, letra);
    printf("La siguiente es %c\n", siguiente);
    return 0;
}
```

Muestra `A vale 65` y `La siguiente es B`. Con `%c` ves el carácter; con `%d`, su número.

> **Portabilidad:** si `char` a secas tiene signo o no depende del compilador. Cuando lo uses como número pequeño, escribe explícitamente `signed char` o `unsigned char`.

## `bool`: verdadero o falso

Un booleano guarda solo dos valores: verdadero o falso. En C, `false` vale `0` y `true` vale `1`. Cualquier valor distinto de cero que conviertas a `bool` se vuelve `true`.

> **C básico:** C89 no tenía tipo booleano; se usaba `int` con 0 y 1. C99 agregó el tipo `_Bool` y el encabezado `<stdbool.h>`, que define los nombres `bool`, `true` y `false`. En C99 y C17 hay que incluirlo:
>
> ```c
> #include <stdbool.h>
>
> bool aprobado = true;
> ```
>
> **C moderno (C23):** `bool`, `true` y `false` son **palabras clave** del lenguaje. Funcionan sin incluir nada, y `true` y `false` tienen tipo `bool`.
>
> **Portabilidad:** si tu código también debe compilar con `-std=c17` o anterior, incluye `<stdbool.h>`. En C23 incluirlo es inofensivo.

```c
#include <stdio.h>

int main(void) {
    bool aprobado = true;
    bool conDeuda = 0;
    bool algo = 25;   // cualquier valor distinto de cero se convierte en true

    printf("%d %d %d\n", aprobado, conDeuda, algo);
    return 0;
}
```

Muestra `1 0 1`.

## Conversiones entre tipos

Cuando una expresión mezcla tipos distintos, C convierte los valores a un tipo común. Hay dos clases de conversión.

### Conversión implícita

Una **conversión implícita** la hace el compilador sin que la escribas. Ocurre en tres situaciones principales.

**1. Al asignar.** El valor se convierte al tipo de la variable que lo recibe. De `double` a `int` se **descarta la parte decimal** (se trunca hacia cero, no se redondea):

```c
double precio = 9.99;
int entero = precio;   // entero vale 9
double real = 7;       // real vale 7.0
```

Si escribes el literal directamente (`int entero = 9.99;`), Clang avisa que el valor cambia: es una pista de que probablemente no querías perder los decimales.

**2. Promociones enteras.** Antes de operar, los tipos más chicos que `int` (`char`, `short`, `bool`) se convierten a `int`. Por eso `'A' + 1` da un `int` (66).

**3. Conversiones aritméticas usuales.** Si los dos operandos tienen tipos distintos, el de menor rango se convierte al de mayor rango:

- `int` con `double` → se opera en `double`: `5 + 2.5` es `7.5`
- `int` con `long` → se opera en `long`
- `int` con `unsigned int` → **se opera en `unsigned int`**

Esta última regla es la trampa clásica.

### La trampa de mezclar con signo y sin signo

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int menosUno = -1;
    unsigned int uno = 1u;

    printf("%d\n", menosUno < uno);   // muestra 0: "falso"
    return 0;
}
```

Matemáticamente −1 es menor que 1, pero el programa dice que no. Para comparar, `menosUno` se convierte a `unsigned int`, y −1 se transforma en el valor sin signo más grande (`UINT_MAX`, 4 294 967 295). Con `-Wextra` el compilador avisa: `comparison of integers of different signs`. Tómalo en serio: **no mezcles enteros con signo y sin signo en una comparación**.

### Conversión explícita (cast)

Una **conversión explícita** la pides tú escribiendo el tipo entre paréntesis delante del valor. Se llama **cast**:

```c
(double)suma
(int)3.75     // vale 3
```

Su uso más frecuente es evitar la **división entera**. Cuando los dos operandos son enteros, `/` descarta los decimales:

```c
#include <stdio.h>

int main(void) {
    int suma = 17;
    int cantidad = 4;

    double mal = suma / cantidad;              // 17 / 4 es 4 (entero), luego 4.0
    double bien = (double)suma / cantidad;     // 17.0 / 4 es 4.25
    double tarde = (double)(suma / cantidad);  // el cast llega tarde: 4.0

    printf("%f %f %f\n", mal, bien, tarde);
    return 0;
}
```

Muestra `4.000000 4.250000 4.000000`. El cast tiene que actuar **antes** de dividir: `(double)suma / cantidad` convierte `suma`, y entonces la conversión aritmética usual convierte también a `cantidad`.

## Desbordamiento: cuando el valor no cabe

Cada tipo entero tiene un rango. ¿Qué pasa si una cuenta se sale de él?

- **Enteros sin signo:** el resultado **da la vuelta** (aritmética módulo 2ⁿ). Está definido por el estándar: `UINT_MAX + 1u` vale `0`.
- **Enteros con signo:** el desbordamiento es **comportamiento indefinido**. El estándar no dice qué pasa: el programa puede mostrar un número negativo, seguir con un valor absurdo o comportarse de forma distinta al optimizar. Es un error de programa.

```c
#include <stdio.h>
#include <limits.h>

int main(void) {
    unsigned int contador = UINT_MAX;
    contador = contador + 1u;
    printf("%u\n", contador);   // 0: los unsigned dan la vuelta
    return 0;
}
```

Para un `int`, la solución es elegir un tipo con rango suficiente (`long long`) o comprobar antes de operar. En la lección 7 verás qué significa exactamente "comportamiento indefinido".

## Más allá de los tipos básicos

Con estos tipos se construyen **tipos derivados**: arreglos (lección 19), cadenas (lección 21) y estructuras (lección 22), que agrupan varios valores. Todos se apoyan en lo que viste aquí: cada elemento tiene un tipo, un tamaño y un rango.

## Errores comunes

1. **Suponer que `int` mide 32 bits en todas partes.** El estándar garantiza 16. Consulta `<limits.h>`.
2. **Mostrar `sizeof` con `%d`.** El resultado es `size_t`: usa `%zu`.
3. **Dividir enteros esperando decimales.** `7 / 2` es `3`. Usa `(double)7 / 2`.
4. **Comparar con signo y sin signo.** `-1 < 1u` es falso.
5. **Comparar `double` con `==`.** `0.1 + 0.2 == 0.3` es falso.
6. **Desbordar un `int`.** Es comportamiento indefinido, no "da la vuelta".

## Resumen

- los enteros pueden ser con signo o `unsigned`; el estándar garantiza rangos mínimos, no tamaños exactos
- `<limits.h>` informa los límites reales (`INT_MAX`, `UINT_MAX`)
- `sizeof` da el tamaño en bytes como un `size_t`, que se muestra con `%zu`
- `float` y `double` son aproximados; prefiere `double`
- `char` es un entero pequeño
- `bool` viene de `<stdbool.h>` en C99/C17 y es palabra clave en C23
- una **conversión implícita** ocurre al asignar, en las promociones enteras y en las conversiones aritméticas usuales
- una **conversión explícita** se escribe con un cast, como `(double)`
- el desbordamiento sin signo da la vuelta; el desbordamiento con signo es comportamiento indefinido

## Ejercicios prácticos

### Ejercicio 1: predice la salida

```c
#include <stdio.h>

int main(void) {
    int a = 7;
    int b = 2;

    double x = a / b;
    double y = (double)a / b;
    double nota = 9.9;
    int z = nota;

    printf("%f %f %d\n", x, y, z);
    return 0;
}
```

<details><summary>Ver solución</summary>

Muestra `3.000000 3.500000 9`.

- `a / b` es una división entera: `3`, que luego se convierte a `3.0`.
- `(double)a / b` convierte `a` antes de dividir: `3.5`.
- Asignar `nota` (9.9) a un `int` descarta la parte decimal: `9`.

</details>

### Ejercicio 2: encuentra el error

Este programa calcula el promedio de tres notas, pero con 7, 8 y 8 muestra `7.000000` en lugar de `7.666667`. Además, el compilador da una advertencia. Corrige los dos problemas.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int n1 = 7, n2 = 8, n3 = 8;
    double promedio = (n1 + n2 + n3) / 3;
    printf("Promedio: %f\n", promedio);
    printf("Tamaño de int: %d bytes\n", sizeof(int));
    return 0;
}
```

<details><summary>Ver solución</summary>

1. `(n1 + n2 + n3) / 3` es una división entera (`23 / 3` es `7`). Hay que convertir antes de dividir.
2. `sizeof` devuelve un `size_t`, que se muestra con `%zu`, no con `%d`.

```c
#include <stdio.h>

int main(void) {
    int n1 = 7, n2 = 8, n3 = 8;
    double promedio = (double)(n1 + n2 + n3) / 3;
    printf("Promedio: %f\n", promedio);
    printf("Tamaño de int: %zu bytes\n", sizeof(int));
    return 0;
}
```

</details>

### Ejercicio 3: predice la comparación

¿Qué muestra cada línea? Explica por qué.

```c
printf("%d\n", -1 < 1);
printf("%d\n", -1 < 1u);
printf("%d\n", (bool)-3);
```

<details><summary>Ver solución</summary>

- `-1 < 1` muestra `1`: los dos son `int`, la comparación es la esperada.
- `-1 < 1u` muestra `0`: por la conversión aritmética usual, `-1` se convierte a `unsigned int` y se vuelve `UINT_MAX`, que no es menor que 1.
- `(bool)-3` muestra `1`: cualquier valor distinto de cero se convierte en `true`.

</details>

### Ejercicio 4: el tipo correcto

Elige el tipo más adecuado para cada dato y justifica: (a) la cantidad de habitantes del planeta (más de 8 000 millones); (b) si un usuario está conectado; (c) el precio de un producto con centavos, para mostrarlo; (d) la cantidad de bytes que ocupa una variable.

<details><summary>Ver solución</summary>

- (a) `long long`: 8 000 millones no cabe en un `int` de 32 bits y `long` puede medir 32 bits en Windows.
- (b) `bool`.
- (c) `double` para mostrarlo; si hay que hacer cuentas exactas de dinero, conviene guardar los centavos en un entero (`long long`).
- (d) `size_t`, el tipo que devuelve `sizeof`.

</details>
