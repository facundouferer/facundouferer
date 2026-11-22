---
title: 'Switch y Bloques'
course: 'c'
slug: 'sentencia-switch-y-bloques-de-codigo'
order: 10
lang: 'es'
published: true
---

Una cadena `else if` sirve para cualquier decisión, pero cuando comparas **una misma expresión entera** contra varios valores concretos, C ofrece una herramienta más directa: `switch`. Esta lección también es el momento de mirar con detalle los **bloques de código** `{}` y una consecuencia importante: el **alcance** de las variables.

## Objetivos

Al terminar esta lección podrás:

- escribir un `switch` sobre un entero o un `char`, con `case`, `break` y `default`
- explicar qué valores admite un `case` y cuáles no
- predecir qué pasa cuando falta `break` (la caída al siguiente caso) y marcar una caída deliberada con `[[fallthrough]]` en C23
- agrupar varios valores en un mismo caso
- declarar variables dentro de un `case` usando un bloque
- explicar qué es un bloque, qué es el alcance de una variable y qué es el ocultamiento (*shadowing*)
- describir cuándo nace y cuándo muere una variable declarada en un bloque

**Requisitos previos:** lecciones 1 a 9, en especial *Variables y constantes* (`const`, `#define`) e *If-Else* (cadenas `else if` y el criterio para elegir entre `else if` y `switch`).

## La sentencia `switch`

```c
switch (expresion) {
    case CONSTANTE_1:
        instrucciones;
        break;
    case CONSTANTE_2:
        instrucciones;
        break;
    default:
        instrucciones;
        break;
}
```

Funciona así:

1. se evalúa **una vez** la expresión entre paréntesis
2. el programa **salta** a la etiqueta `case` cuyo valor coincide
3. ejecuta las instrucciones desde ahí hasta encontrar un `break` (o el final del `switch`)
4. si ningún `case` coincide, salta a `default`; si no hay `default`, no ejecuta nada y sigue después del `switch`

```c
#include <stdio.h>

int main(void) {
    int dia = 3;

    switch (dia) {
        case 1:
            printf("Lunes\n");
            break;
        case 2:
            printf("Martes\n");
            break;
        case 3:
            printf("Miércoles\n");
            break;
        default:
            printf("Valor no válido\n");
            break;
    }

    return 0;
}
```

## Qué puede ir en un `switch` y en un `case`

- La expresión del `switch` debe ser de **tipo entero**: `int`, `long`, `unsigned`, `bool` o `char`. No puedes hacer `switch` sobre un `double` ni sobre una cadena.
- Cada `case` necesita una **expresión constante entera**: un literal (`3`, `'s'`), una constante de `#define` o una expresión entre ellas (`2 * 4`). El valor debe conocerse al compilar.
- No puede haber dos `case` con el mismo valor.
- Un `case` compara por **igualdad** con un valor. No admite rangos como `nota >= 6`; para eso usa una cadena `else if`.

Como `char` es un tipo entero, un menú de letras es un uso clásico:

```c
#include <stdio.h>

int main(void) {
    char opcion;

    printf("(a)gregar, (b)orrar, (s)alir: ");
    if (scanf(" %c", &opcion) != 1) {
        printf("Entrada inválida\n");
        return 1;
    }

    switch (opcion) {
        case 'a':
        case 'A':
            printf("Agregando...\n");
            break;
        case 'b':
        case 'B':
            printf("Borrando...\n");
            break;
        case 's':
        case 'S':
            printf("Hasta luego\n");
            break;
        default:
            printf("Opción desconocida: %c\n", opcion);
            break;
    }

    return 0;
}
```

Fíjate en `case 'a': case 'A':`. Dos etiquetas seguidas, sin instrucciones entre ellas, comparten el mismo código. Es la forma de agrupar varios valores.

### Nombres para los valores

Escribir `case 1:` y `case 2:` obliga a recordar qué significa cada número. Es mejor darles nombre con `#define`:

```c
#include <stdio.h>

#define OPCION_ALTA 1
#define OPCION_BAJA 2
#define OPCION_SALIR 3

int main(void) {
    int opcion = OPCION_BAJA;

    switch (opcion) {
        case OPCION_ALTA:
            printf("Alta\n");
            break;
        case OPCION_BAJA:
            printf("Baja\n");
            break;
        case OPCION_SALIR:
            printf("Salir\n");
            break;
        default:
            printf("Opción desconocida\n");
            break;
    }

    return 0;
}
```

> **C básico:** una variable `const int` **no** es una expresión constante en C (a diferencia de C++), así que `case LIMITE:` con `const int LIMITE = 3;` no es C estándar. Usa `#define`. En la lección de estructuras verás `enum`, la herramienta pensada para dar nombre a un conjunto de valores enteros.
>
> **C moderno (C23):** una constante declarada con `constexpr int` sí es una expresión constante y puede usarse en un `case`.
>
> **Portabilidad:** GCC y Clang aceptan rangos como `case 1 ... 5:`, pero es una **extensión**, no C23 estándar; con `-Wpedantic` el compilador avisa.

## `break` y la caída al siguiente caso

`break` termina el `switch` y el programa sigue después de su llave de cierre. Si falta, la ejecución **cae** en el código del siguiente `case`, aunque su valor no coincida, porque las etiquetas `case` son solo puntos de entrada:

<!-- c-check: skip -->
```c
switch (nivel) {
    case 1:
        printf("Nivel 1\n");
    case 2:
        printf("Nivel 2\n");
        break;
    default:
        printf("Otro nivel\n");
        break;
}
```

Con `nivel = 1` se muestran "Nivel 1" y "Nivel 2". Es el error más común con `switch`. GCC lo detecta con `-Wextra` (`-Wimplicit-fallthrough`).

Regla práctica: termina cada `case` con `break`, incluido el último, aunque no haga falta: así nadie lo olvida al agregar un caso nuevo.

### Caída deliberada con `[[fallthrough]]`

A veces la caída es justo lo que quieres, por ejemplo cuando cada caso hace un poco más que el siguiente. Para decirlo explícitamente (al compilador y a quien lee), C23 tiene el **atributo** `[[fallthrough]]`:

```c
#include <stdio.h>

int main(void) {
    int plan = 2;   // 1 = completo, 2 = intermedio, 3 = básico

    printf("Tu plan incluye:\n");

    switch (plan) {
        case 1:
            printf("- soporte prioritario\n");
            [[fallthrough]];
        case 2:
            printf("- copias de seguridad\n");
            [[fallthrough]];
        case 3:
            printf("- correo\n");
            break;
        default:
            printf("- nada: plan desconocido\n");
            break;
    }

    return 0;
}
```

Con `plan = 2` se muestran "copias de seguridad" y "correo". `[[fallthrough]];` va justo antes de la siguiente etiqueta y silencia la advertencia de caída.

> **C básico:** antes de C23 no había forma estándar de marcar la caída; se usaba un comentario como `/* fall through */`, que GCC reconoce (en inglés), o la extensión `__attribute__((fallthrough));` de GCC y Clang.
>
> **C moderno (C23):** `[[fallthrough]];` es un atributo estándar. Úsalo cada vez que la caída sea intencional.
>
> **Portabilidad:** la sintaxis `[[...]]` de atributos requiere `-std=c23` (o `-std=c2x` en GCC 10+ y Clang 9+). Si tu código debe compilar con `-std=c17`, usa el comentario o la extensión, sabiendo que esta última no es C estándar.

### `default`

`default` cubre todos los valores que no coinciden con ningún `case`. No es obligatorio y puede ir en cualquier posición, pero lo habitual es ponerlo al final. Conviene incluirlo casi siempre, aunque sea para informar un valor inesperado.

### Otras formas de salir de un `case`

- `return` dentro de un `case` termina **toda la función**, no solo el `switch`. En `main`, termina el programa.
- `continue` **no** sirve para pasar al siguiente `case`: pertenece a los ciclos, que verás en las próximas lecciones.

## Bloques de código

Un **bloque** (o sentencia compuesta) es un grupo de sentencias y declaraciones encerradas entre llaves `{}`. Ya los usaste en `main`, en `if` y en `else`; el cuerpo de un `switch` también es un bloque. Donde C espera una sentencia, puedes poner un bloque.

### Alcance: dónde se ve una variable

El **alcance** de una variable es la parte del programa donde su nombre se puede usar. Una variable declarada dentro de un bloque tiene **alcance de bloque**: existe desde su declaración hasta la llave que cierra ese bloque, y es invisible fuera de él.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int total = 100;

    if (total > 50) {
        int descuento = 10;   // solo existe dentro de este bloque
        printf("%d\n", total - descuento);
    }

    printf("%d\n", descuento);   // error: 'descuento' no está declarado aquí
    return 0;
}
```

Las variables del bloque exterior (`total`) sí se ven desde los bloques interiores. Declarar las variables en el bloque más chico donde se usan es una buena práctica: quien lee sabe que no afectan al resto del programa.

### Ocultamiento (*shadowing*)

Si en un bloque interior declaras una variable con el **mismo nombre** que una exterior, la interior **oculta** a la exterior mientras dure el bloque:

```c
#include <stdio.h>

int main(void) {
    int x = 1;

    {
        int x = 2;   // otra variable, que oculta a la de afuera
        printf("adentro: %d\n", x);
    }

    printf("afuera: %d\n", x);
    return 0;
}
```

Muestra `adentro: 2` y `afuera: 1`. Es válido, pero confunde: parece que se modificó `x` y no fue así. Evítalo; la opción `-Wshadow` del compilador lo detecta.

### Tiempo de vida de una variable de bloque

Una variable local de un bloque **nace** cuando la ejecución entra en el bloque y llega a su declaración, y **muere** cuando la ejecución sale del bloque. Si el bloque se vuelve a ejecutar, la variable se crea de nuevo y su valor anterior se pierde. Si no la inicializas, su valor inicial es indeterminado: inicialízala siempre. En la lección 16 verás el alcance de las funciones y las variables `static`, y en la lección 27 el tiempo de vida (duración de almacenamiento) en detalle.

## Declarar variables dentro de un `case`

Las etiquetas `case` no crean un bloque: todo el cuerpo del `switch` es **un único** bloque. Si declaras una variable en un `case`, su alcance se extiende a los `case` siguientes, donde existiría sin haber sido inicializada. Por eso, cuando un `case` necesita variables propias, envuelve su código en un bloque:

```c
#include <stdio.h>

int main(void) {
    int operacion = 2;
    int a = 17;
    int b = 5;

    switch (operacion) {
        case 1: {
            int suma = a + b;
            printf("Suma: %d\n", suma);
            break;
        }
        case 2: {
            int cociente = a / b;
            int resto = a % b;
            printf("Cociente: %d, resto: %d\n", cociente, resto);
            break;
        }
        default:
            printf("Operación desconocida\n");
            break;
    }

    return 0;
}
```

> **C básico:** en C17 y anteriores, una etiqueta debe ir seguida de una **sentencia**, y una declaración no lo es: `case 1: int suma = a + b;` es un error de compilación.
>
> **C moderno (C23):** C23 permite una declaración justo después de una etiqueta, pero el alcance de esa variable sigue llegando a los `case` siguientes. El bloque sigue siendo la forma correcta de darle a cada caso sus propias variables.

## Errores comunes

1. **Olvidar `break`** y caer sin querer en el siguiente caso.
2. **Usar `switch` con rangos o con `double`.** Para eso está `else if`.
3. **Usar una variable como valor de `case`.** Debe ser una constante conocida al compilar.
4. **Declarar variables en un `case` sin bloque.**
5. **Usar una variable fuera del bloque donde se declaró**, o reutilizar su nombre en un bloque interior.

## Resumen

- `switch` evalúa una expresión entera una vez y salta al `case` que coincide; `default` cubre el resto
- cada `case` necesita una constante entera; varias etiquetas seguidas comparten código
- `break` termina el `switch`; sin él, la ejecución cae al siguiente caso
- una caída intencional se marca con `[[fallthrough]];` en C23
- un bloque `{}` agrupa sentencias; una variable declarada en él solo se ve dentro (alcance de bloque) y muere al salir
- una variable interior con el mismo nombre oculta a la exterior: evítalo
- las variables propias de un `case` van dentro de un bloque

## Ejercicios prácticos

### Ejercicio 1: calculadora de cuatro operaciones

Lee dos enteros y un carácter de operación (`+`, `-`, `*`, `/`) y muestra el resultado con un `switch`. Si la operación es `/` y el divisor es 0, muestra un mensaje de error; si el carácter no es una operación conocida, también.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int main(void) {
    int a;
    int b;
    char operacion;

    printf("Ingresa a, operación y b (por ejemplo 7 * 3): ");
    if (scanf("%d %c %d", &a, &operacion, &b) != 3) {
        printf("Entrada inválida\n");
        return 1;
    }

    switch (operacion) {
        case '+':
            printf("%d\n", a + b);
            break;
        case '-':
            printf("%d\n", a - b);
            break;
        case '*':
            printf("%d\n", a * b);
            break;
        case '/':
            if (b == 0) {
                printf("No se puede dividir por cero\n");
            } else {
                printf("%d\n", a / b);
            }
            break;
        default:
            printf("Operación desconocida: %c\n", operacion);
            break;
    }

    return 0;
}
```

</details>

### Ejercicio 2: días del mes

Lee un número de mes (1 a 12) y muestra cuántos días tiene (considera febrero con 28). Agrupa los meses que comparten cantidad de días con etiquetas seguidas.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int main(void) {
    int mes;

    printf("Mes: ");
    if (scanf("%d", &mes) != 1) {
        printf("Entrada inválida\n");
        return 1;
    }

    switch (mes) {
        case 1: case 3: case 5: case 7: case 8: case 10: case 12:
            printf("31 días\n");
            break;
        case 4: case 6: case 9: case 11:
            printf("30 días\n");
            break;
        case 2:
            printf("28 días\n");
            break;
        default:
            printf("Mes inválido\n");
            break;
    }

    return 0;
}
```

</details>

### Ejercicio 3: predice la salida

```c
#include <stdio.h>

int main(void) {
    int x = 5;

    {
        int x = 10;
        x = x + 1;
        printf("%d\n", x);
    }

    printf("%d\n", x);

    switch (x) {
        case 5:
            printf("cinco\n");
            [[fallthrough]];
        case 6:
            printf("seis\n");
            break;
        default:
            printf("otro\n");
            break;
    }

    return 0;
}
```

<details><summary>Ver solución</summary>

```text
11
5
cinco
seis
```

La `x` del bloque interior es otra variable que oculta a la exterior; al cerrar el bloque desaparece y la exterior sigue valiendo 5. En el `switch`, el `case 5` cae deliberadamente en el `case 6`, y el `break` detiene la ejecución antes de `default`.

</details>

### Ejercicio 4: encuentra el error

Este programa no compila con `-std=c17`. Explica por qué y corrígelo de forma que funcione en C17 y en C23.

<!-- c-check: skip -->
```c
switch (opcion) {
    case 1:
        int doble = valor * 2;
        printf("%d\n", doble);
        break;
    default:
        printf("nada\n");
        break;
}
```

<details><summary>Ver solución</summary>

En C17 una etiqueta debe ir seguida de una sentencia, y `int doble = ...;` es una declaración. Además, aunque C23 lo acepte, el alcance de `doble` se extendería hasta `default`. La corrección es encerrar el caso en un bloque:

```c
switch (opcion) {
    case 1: {
        int doble = valor * 2;
        printf("%d\n", doble);
        break;
    }
    default:
        printf("nada\n");
        break;
}
```

</details>
