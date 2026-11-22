---
title: 'Operadores'
course: 'c'
slug: 'operadores'
order: 7
lang: 'es'
published: true
---

Ya sabes guardar datos, conocer su tipo y mostrarlos. El siguiente paso es **operar** con ellos: calcular, comparar y combinar condiciones. Para eso están los **operadores**.

## Objetivos

Al terminar esta lección podrás:

- usar los operadores aritméticos, incluido `%`, y predecir el signo de su resultado
- comparar valores con los operadores relacionales
- combinar condiciones con `&&`, `||` y `!`, y aprovechar la evaluación en **cortocircuito**
- usar la asignación compuesta y los operadores de incremento y decremento, prefijos y posfijos
- leer expresiones aplicando precedencia y asociatividad
- distinguir comportamiento definido, no especificado y **comportamiento indefinido**
- reconocer los operadores a nivel de bits

**Requisitos previos:** lecciones 1 a 6, en especial *Tipos de datos* (división entera, conversiones, desbordamiento) y *Entrada y salida* (`printf`).

## Expresiones

Una **expresión** es una combinación de valores, variables y operadores que produce un resultado: `5 + 3`, `edad + 1`, `nota >= 6`. Un **operador** es el símbolo que indica la operación; los valores sobre los que actúa se llaman **operandos**.

## Operadores aritméticos

| Operador | Operación | Ejemplo | Resultado |
| --- | --- | --- | --- |
| `+` | suma | `10 + 5` | `15` |
| `-` | resta | `10 - 5` | `5` |
| `*` | multiplicación | `4 * 3` | `12` |
| `/` | división | `10 / 4` | `2` |
| `%` | resto de la división entera | `10 % 4` | `2` |

### División entera

Si los dos operandos son enteros, `/` hace una **división entera**: descarta la parte decimal, truncando hacia cero. `7 / 2` es `3` y `-7 / 2` es `-3`. Si al menos uno es de punto flotante, la división conserva los decimales: `7 / 2.0` es `3.5`. Ya lo viste en la lección 5 con `(double)suma / cantidad`.

### El resto `%` y su signo

`%` solo funciona con enteros y devuelve lo que sobra de la división entera. C garantiza que siempre se cumple:

```text
(a / b) * b + a % b == a
```

Como la división trunca hacia cero, **el resto tiene el signo del dividendo** (el operando de la izquierda):

| Expresión | Resultado |
| --- | --- |
| `7 % 3` | `1` |
| `-7 % 3` | `-1` |
| `7 % -3` | `1` |
| `-7 % -3` | `-1` |

Uso típico: `numero % 2` vale `0` si el número es par. Pero cuidado: para un impar negativo vale `-1`, no `1`. Para saber si un número es impar, compara `numero % 2 != 0`.

> **Portabilidad:** antes de C99 el redondeo de `/` con negativos dependía del compilador. Desde C99, y por supuesto en C23, la división entera siempre trunca hacia cero.

Dividir un entero por cero (`x / 0` o `x % 0`) es comportamiento indefinido; más abajo verás qué significa eso.

## Operadores relacionales

Comparan dos valores y dan `1` si la comparación es verdadera o `0` si es falsa. El resultado es un `int`.

| Operador | Significado |
| --- | --- |
| `==` | igual a |
| `!=` | distinto de |
| `<` | menor que |
| `>` | mayor que |
| `<=` | menor o igual que |
| `>=` | mayor o igual que |

```c
#include <stdio.h>

int main(void) {
    int nota = 7;

    printf("%d\n", nota >= 6);   // 1
    printf("%d\n", nota == 10);  // 0
    return 0;
}
```

No confundas `=` (asigna) con `==` (compara). `nota = 10` guarda 10 en `nota`; `nota == 10` pregunta si vale 10.

## Operadores lógicos

Combinan condiciones. Tratan cualquier valor distinto de cero como verdadero y el cero como falso; su resultado es `1` o `0`.

| Operador | Significado | Es verdadero cuando |
| --- | --- | --- |
| `&&` | "y" | los dos operandos son verdaderos |
| `\|\|` | "o" | al menos uno es verdadero |
| `!` | "no" | el operando es falso |

```c
edad >= 18 && edad <= 65     // entre 18 y 65 inclusive
letra == 'a' || letra == 'A' // es la letra a, mayúscula o minúscula
!(edad >= 18)                // no es mayor de edad
```

### Evaluación en cortocircuito

`&&` y `||` evalúan **primero el operando izquierdo** y solo evalúan el derecho si hace falta:

- en `a && b`, si `a` es falso, el resultado ya es falso: **`b` no se evalúa**
- en `a || b`, si `a` es verdadero, el resultado ya es verdadero: **`b` no se evalúa**

A esto se le llama evaluación en **cortocircuito**, y es una garantía del lenguaje, no una optimización opcional. Su uso práctico más importante es **proteger una operación peligrosa** con una condición previa:

```c
#include <stdio.h>

int main(void) {
    int total = 50;
    int personas = 0;

    // Si personas es 0, la división nunca se ejecuta.
    int esCaro = personas != 0 && total / personas > 20;

    printf("¿Más de 20 por persona? %d\n", esCaro);
    return 0;
}
```

Como `personas != 0` es falso, `&&` se detiene y `total / personas` no se calcula: no hay división por cero. **El orden importa**: `total / personas > 20 && personas != 0` dividiría primero.

## Asignación

`=` guarda el valor de la derecha en la variable de la izquierda. Se lee "guarda en", no "es igual a":

```c
int edad = 18;
edad = edad + 1;   // toma el valor actual, suma 1 y lo guarda: 19
```

En C la asignación también es una expresión: su valor es el valor asignado. Por eso `a = b = 0;` funciona (guarda 0 en `b` y luego en `a`).

### Asignación compuesta

| Forma corta | Equivale a |
| --- | --- |
| `x += 5` | `x = x + 5` |
| `x -= 3` | `x = x - 3` |
| `x *= 2` | `x = x * 2` |
| `x /= 4` | `x = x / 4` |
| `x %= 3` | `x = x % 3` |

## Incremento y decremento

`++` suma 1 a una variable y `--` le resta 1. Cada uno tiene dos formas:

- **prefija** (`++x`): primero incrementa, y la expresión vale el valor **nuevo**
- **posfija** (`x++`): la expresión vale el valor **anterior**, y la variable se incrementa igual

```c
#include <stdio.h>

int main(void) {
    int a = 5;
    int b = 5;

    int x = ++a;   // a pasa a 6, x recibe 6
    int y = b++;   // y recibe 5, b pasa a 6

    printf("a=%d x=%d\n", a, x);
    printf("b=%d y=%d\n", b, y);
    return 0;
}
```

Salida:

```text
a=6 x=6
b=6 y=5
```

Si solo quieres incrementar (`contador++;` en una línea sola), las dos formas dan lo mismo. La diferencia aparece cuando usas el valor de la expresión.

## Precedencia y asociatividad

Cuando una expresión tiene varios operadores, la **precedencia** decide cuál se agrupa primero, como en matemática: `2 + 3 * 4` es `2 + (3 * 4)`, que vale `14`.

Si dos operadores tienen la misma precedencia, decide la **asociatividad**: la mayoría se agrupa de izquierda a derecha (`10 - 4 - 3` es `(10 - 4) - 3`, que vale `3`), pero los unarios y la asignación se agrupan de derecha a izquierda (`a = b = 0` es `a = (b = 0)`).

De mayor a menor precedencia, los que usarás:

| Nivel | Operadores | Asociatividad |
| --- | --- | --- |
| 1 | `x++` `x--` (posfijos) | izquierda a derecha |
| 2 | `++x` `--x` `!` `~` `-` unario, cast `(tipo)`, `sizeof` | derecha a izquierda |
| 3 | `*` `/` `%` | izquierda a derecha |
| 4 | `+` `-` | izquierda a derecha |
| 5 | `<<` `>>` | izquierda a derecha |
| 6 | `<` `<=` `>` `>=` | izquierda a derecha |
| 7 | `==` `!=` | izquierda a derecha |
| 8 | `&` (bits) | izquierda a derecha |
| 9 | `^` | izquierda a derecha |
| 10 | `\|` (bits) | izquierda a derecha |
| 11 | `&&` | izquierda a derecha |
| 12 | `\|\|` | izquierda a derecha |
| 13 | `?:` (lección 9) | derecha a izquierda |
| 14 | `=` `+=` `-=` y demás asignaciones | derecha a izquierda |

No hace falta memorizarla entera. Recuerda tres cosas: la aritmética va antes que las comparaciones, las comparaciones antes que `&&` y `||`, y la asignación va casi al final. **Ante la duda, usa paréntesis**: `(2 + 3) * 4` vale `20` y además se lee mejor.

## Orden de evaluación: lo que la precedencia no dice

La precedencia dice **cómo se agrupan** los operandos, no **en qué orden se calculan**. En `a * b + c * d`, la precedencia asegura que se suman los dos productos, pero el estándar no dice cuál de los dos productos se calcula primero. En la mayoría de los operadores, el orden de evaluación de los operandos **no está especificado**: cada compilador puede elegir.

Las excepciones garantizan izquierda a derecha: `&&`, `||` (por eso existe el cortocircuito), `?:` y la coma.

Mientras los operandos no tengan efectos secundarios, el orden no cambia el resultado. El problema aparece cuando una misma expresión **modifica** una variable y además la usa.

## Definido, no especificado e indefinido

El estándar de C clasifica lo que hace un programa en cuatro categorías:

- **Definido:** el estándar dice exactamente qué pasa. `7 / 2` vale `3` en todos lados.
- **Definido por la implementación:** cada compilador elige, pero debe documentarlo. El tamaño de `int` o si `char` tiene signo.
- **No especificado:** hay varias opciones válidas y el compilador no tiene que avisar cuál toma. El orden de evaluación de los operandos de `+`.
- **Comportamiento indefinido:** el estándar **no impone ningún requisito**. El programa puede dar un resultado absurdo, funcionar hoy y fallar mañana, o comportarse distinto con otra opción de optimización. Un programa con comportamiento indefinido es un programa incorrecto, aunque parezca funcionar.

Ejemplos de comportamiento indefinido que ya puedes escribir:

<!-- c-check: skip -->
```c
#include <stdio.h>
#include <limits.h>

int main(void) {
    int i = 1;
    i = i++ + 1;          // modifica i dos veces sin un orden definido

    int grande = INT_MAX;
    grande = grande + 1;  // desbordamiento de un entero con signo

    int cero = 0;
    int r = 10 / cero;    // división entera por cero

    printf("%d %d %d\n", i, grande, r);
    return 0;
}
```

- `i = i++ + 1;` modifica `i` dos veces (con `++` y con `=`) sin que el estándar ordene esas modificaciones. Con `-Wall`, Clang avisa: `multiple unsequenced modifications to 'i'`. La versión correcta es simplemente `i = i + 2;` o `i += 2;`.
- `INT_MAX + 1` desborda un `int`. A diferencia de los `unsigned`, no "da la vuelta" de forma garantizada.
- Dividir por cero puede terminar el programa con un error.

La regla práctica: **no modifiques una variable más de una vez en la misma expresión, ni la leas en la misma expresión donde la modificas** (salvo con `&&`, `||`, `?:` o la coma de por medio). En la lección *Depuración y sanitizers* verás herramientas que detectan estos errores al ejecutar.

## Operadores a nivel de bits

Trabajan sobre los bits individuales de un entero. Úsalos con tipos `unsigned`:

| Operador | Operación | Ejemplo con `a = 12u` (1100) y `b = 10u` (1010) |
| --- | --- | --- |
| `&` | Y bit a bit | `a & b` es `8` (1000) |
| `\|` | O bit a bit | `a \| b` es `14` (1110) |
| `^` | O exclusivo | `a ^ b` es `6` (0110) |
| `~` | complemento | invierte todos los bits |
| `<<` | desplazamiento a la izquierda | `1u << 3` es `8` |
| `>>` | desplazamiento a la derecha | `a >> 2` es `3` |

Un uso típico es consultar un bit: `numero & 1u` vale `1` si `numero` es impar.

No confundas `&` con `&&` ni `|` con `||`: los primeros operan bit a bit y **no** hacen cortocircuito; los segundos combinan condiciones.

## Errores comunes

1. **Confundir `=` con `==`.**
2. **Esperar decimales de una división entera.** `7 / 2` es `3`.
3. **Suponer que `%` siempre es positivo.** `-7 % 3` es `-1`.
4. **Poner la protección después de la operación.** `a / b > 2 && b != 0` divide antes de comprobar.
5. **Modificar una variable dos veces en una expresión.** `i = i++ + 1;` es comportamiento indefinido.
6. **Confiar en la precedencia en vez de usar paréntesis.** `x & 1 == 0` es `x & (1 == 0)`.

## Resumen

- `/` entre enteros trunca hacia cero; `%` da el resto con el signo del dividendo
- los relacionales y lógicos dan `1` o `0`
- `&&` y `||` evalúan de izquierda a derecha en **cortocircuito**: sirven para proteger operaciones
- `++x` vale el valor nuevo; `x++` vale el valor anterior
- la precedencia y la asociatividad deciden cómo se agrupa una expresión; los paréntesis la aclaran
- el orden de evaluación de los operandos casi nunca está especificado
- el **comportamiento indefinido** (como `i = i++ + 1;` o desbordar un `int`) hace incorrecto al programa

## Ejercicios prácticos

### Ejercicio 1: predice la salida

```c
#include <stdio.h>

int main(void) {
    int a = 3;
    int b = a++ * 2;
    int c = --a + 10 % 4;
    int d = -9 / 2;
    int e = -9 % 2;

    printf("%d %d %d %d %d\n", a, b, c, d, e);
    return 0;
}
```

<details><summary>Ver solución</summary>

Muestra `3 6 5 -4 -1`.

- `b = a++ * 2`: usa el valor anterior (3), `b` es `6`, y `a` pasa a 4.
- `c = --a + 10 % 4`: `a` vuelve a 3; `10 % 4` es `2` (el `%` va antes que el `+`); `c` es `5`.
- `-9 / 2` trunca hacia cero: `-4`.
- `-9 % 2` tiene el signo del dividendo: `-1`. Comprobación: `(-4) * 2 + (-1) == -9`.

</details>

### Ejercicio 2: encuentra el error

Esta línea debería calcular si el promedio por persona supera 100 sin dividir nunca por cero, pero falla cuando `personas` vale 0. Corrígela.

```c
int supera = total / personas > 100 && personas > 0;
```

<details><summary>Ver solución</summary>

`&&` evalúa de izquierda a derecha, así que la división se hace antes de comprobar `personas`. Hay que invertir el orden para que el cortocircuito proteja la división:

```c
#include <stdio.h>

int main(void) {
    int total = 500;
    int personas = 0;

    int supera = personas > 0 && total / personas > 100;

    printf("%d\n", supera);
    return 0;
}
```

Si `personas` es 0, `personas > 0` es falso y `total / personas` no se evalúa.

</details>

### Ejercicio 3: encuentra el error de precedencia

Se quiere mostrar `1` cuando `numero` es par, usando el bit menos significativo. ¿Por qué esta versión muestra siempre `0`?

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    unsigned int numero = 8u;
    printf("%d\n", numero & 1u == 0u);
    return 0;
}
```

<details><summary>Ver solución</summary>

`==` tiene más precedencia que `&`, así que la expresión es `numero & (1u == 0u)`, es decir `numero & 0`, que siempre vale `0`. El compilador incluso avisa con `-Wall`. Corrección con paréntesis:

```c
#include <stdio.h>

int main(void) {
    unsigned int numero = 8u;
    printf("%d\n", (numero & 1u) == 0u);
    return 0;
}
```

</details>

### Ejercicio 4: ¿definido o indefinido?

Clasifica cada línea (supón `int i = 2;` antes de cada una) como comportamiento definido o indefinido, y da el valor final de `i` cuando esté definido: (a) `i = i + 1;` (b) `i++;` (c) `i = i++;` (d) `i += i * 3;`

<details><summary>Ver solución</summary>

- (a) Definido: `i` vale `3`.
- (b) Definido: `i` vale `3`.
- (c) Indefinido: `i` se modifica dos veces (con `++` y con `=`) sin un orden definido.
- (d) Definido: `i` se lee en la expresión `i * 3` y se modifica una sola vez con `+=`; `i` vale `2 + 6 = 8`.

</details>
