---
title: 'Operador ternario'
course: 'c'
slug: 'operador-ternario'
order: 9
lang: 'es'
published: true
---

Con `if-else` eliges qué **instrucciones** ejecutar. A veces lo único que necesitas es elegir un **valor** entre dos. Para eso C tiene el **operador condicional** `? :`, conocido como operador **ternario** porque es el único operador de C con tres operandos.

## Objetivos

Al terminar esta lección podrás:

- escribir y leer el operador condicional `condicion ? a : b`
- explicar por qué el ternario es una **expresión** que produce un valor y no una sentencia
- traducir entre un ternario y un `if-else` equivalente
- predecir el tipo del resultado cuando las dos ramas tienen tipos distintos
- reconocer los problemas de precedencia y de ternarios anidados
- decidir cuándo el ternario aclara el código y cuándo lo empeora

**Requisitos previos:** lecciones 1 a 8, en especial *Operadores* (precedencia, conversiones aritméticas) y *If-Else*.

> Idea clave: el ternario elige entre **dos valores** según una condición. `if-else` elige entre **dos bloques de instrucciones**.

## Sintaxis

```c
condicion ? valor_si_verdadero : valor_si_falso
```

Se lee así: "si la condición es verdadera, el resultado es el primer valor; si no, el segundo". La condición sigue la misma regla que en `if`: 0 es falso y cualquier otro valor es verdadero.

```c
int edad = 20;
int esMayor = edad >= 18 ? 1 : 0;
```

1. se evalúa `edad >= 18`
2. como es verdadera, el resultado de toda la expresión es `1`
3. ese valor se guarda en `esMayor`

Las tres partes son obligatorias. A diferencia de `if`, que puede ir sin `else`, el ternario siempre necesita el valor para el caso falso: `edad >= 18 ? 1;` no compila.

## Una expresión, no una sentencia

Esta es la diferencia fundamental. `if-else` es una **sentencia** de control: decide qué se ejecuta, pero no produce ningún valor. El ternario es un **operador**, y toda la construcción forma una **expresión** que produce un valor. Por eso puede aparecer donde se espera un valor: a la derecha de una asignación, como argumento de `printf`, dentro de otra expresión o en un `return`.

```c
#include <stdio.h>

int main(void) {
    int a = 12;
    int b = 5;
    int menor = a < b ? a : b;

    printf("El menor es: %d\n", menor);
    printf("El mayor es: %d\n", a > b ? a : b);

    return 0;
}
```

Además, **solo se evalúa una de las dos ramas**. En `x != 0 ? 100 / x : 0` la división nunca se ejecuta cuando `x` vale 0, igual que con el cortocircuito de `&&`.

## Equivalencia con `if-else`

Este ternario:

```c
int signo = numero >= 0 ? 1 : -1;
```

expresa lo mismo que este `if-else`:

```c
int signo;

if (numero >= 0) {
    signo = 1;
} else {
    signo = -1;
}
```

La versión con ternario tiene una ventaja concreta: `signo` se declara y se inicializa en la misma línea, sin quedar un instante sin valor. Como el resultado es un valor, incluso puedes declarar la variable `const`:

```c
const int signo = numero >= 0 ? 1 : -1;
```

## Elegir un texto para mostrar

Un uso muy común es elegir entre dos textos dentro de un `printf`. En la lección de entrada y salida viste que `%s` muestra una cadena literal; el ternario elige cuál:

```c
#include <stdio.h>

int main(void) {
    int nota = 7;
    int cantidad = 1;

    printf("%s\n", nota >= 6 ? "Aprobado" : "Desaprobado");
    printf("%d %s\n", cantidad, cantidad == 1 ? "artículo" : "artículos");

    return 0;
}
```

Por ahora las cadenas aparecen solo como literales pasadas directamente a `printf`. Guardar un texto en una variable requiere arreglos o punteros, que verás más adelante en el curso.

## El tipo del resultado

El resultado de un ternario tiene **un solo tipo**, aunque las ramas tengan tipos distintos. Si las dos ramas son aritméticas, C aplica las **conversiones aritméticas habituales** que viste en *Tipos de datos*, como si las fueras a sumar:

```c
#include <stdio.h>

int main(void) {
    bool conDescuento = true;
    double precio = conDescuento ? 90 : 99.5;

    printf("%.1f\n", precio);
    printf("%.1f\n", conDescuento ? 1 : 2.5);   // el resultado es double, aunque se elija el 1

    return 0;
}
```

En la segunda línea, aunque se elige el `1`, el resultado es `1.0` de tipo `double`, porque la otra rama es `double`. Si escribieras `printf("%d\n", conDescuento ? 1 : 2.5);`, el especificador no coincidiría con el tipo y el resultado sería comportamiento indefinido (con `-Wall` el compilador avisa).

Lo mismo ocurre con `int` y `unsigned int`: mezclar `-1` con un `unsigned` en las dos ramas convierte el `-1` en un número enorme. Mantén las dos ramas del mismo tipo siempre que puedas.

> **C moderno (C23):** con `auto` (inferencia de tipo, nueva en C23) o `typeof`, el tipo de la variable sale del tipo del ternario. Por eso entender qué tipo produce importa todavía más: `auto x = c ? 1 : 2.5;` declara `x` como `double`.

## Precedencia: pon paréntesis

El ternario tiene una precedencia muy baja: solo la asignación y la coma están por debajo. Por eso, en una expresión más grande, casi siempre necesitas paréntesis:

<!-- c-check: skip -->
```c
int total = base + conEnvio ? 500 : 0;   // se lee como (base + conEnvio) ? 500 : 0
```

La intención era sumar el envío a la base, pero `+` se aplica antes que `?:`. Lo correcto:

```c
int total = base + (conEnvio ? 500 : 0);
```

Regla práctica: si el ternario no está solo a la derecha de un `=` o como argumento entero de una función, enciérralo entre paréntesis.

## Ternarios anidados

El ternario se agrupa de derecha a izquierda, así que `a ? b : c ? d : e` significa `a ? b : (c ? d : e)`. Funciona, pero se lee mal enseguida:

```c
#include <stdio.h>

int main(void) {
    int numero = -4;

    printf("%s\n", numero > 0 ? "positivo" : numero < 0 ? "negativo" : "cero");

    return 0;
}
```

Un nivel de anidación en forma de cadena, como este, todavía se puede seguir si lo formateas en varias líneas. Un ternario dentro de la rama **verdadera** de otro, o tres niveles, ya es un acertijo. En ese punto una cadena `else if` es más clara.

## Cuándo conviene y cuándo no

Conviene usar el ternario cuando:

- eliges entre **dos valores** simples
- quieres inicializar una variable (incluso `const`) con uno u otro valor
- la línea completa se entiende de un vistazo

Es mejor usar `if-else` cuando:

- cada camino tiene **varias instrucciones** o efectos (mostrar, modificar variables)
- la condición es larga o hay más de dos casos
- necesitarías anidar ternarios o llenarlos de paréntesis

No uses el ternario solo para llamar funciones por sus efectos, como `x > 0 ? printf("a") : printf("b");`. Compila, pero oculta una decisión de control detrás de una expresión. Eso es trabajo de `if-else`.

## Errores comunes

1. **Olvidar la rama falsa.** El ternario siempre tiene tres partes.
2. **Confundir el orden.** Primero la condición, después el valor si es verdadera, al final el valor si es falsa.
3. **Olvidar los paréntesis** dentro de expresiones más grandes.
4. **Mezclar tipos** en las ramas y sorprenderse con el tipo del resultado.
5. **Querer ser demasiado ingenioso.** Si el ternario complica la lectura, ya perdiste su beneficio.

## Resumen

- `condicion ? a : b` es una expresión que vale `a` si la condición es verdadera y `b` si es falsa
- solo se evalúa la rama elegida
- es un operador que produce un valor; `if-else` es una sentencia que elige instrucciones
- el resultado tiene un solo tipo, obtenido con las conversiones aritméticas habituales entre las dos ramas
- su precedencia es muy baja: usa paréntesis dentro de expresiones más grandes
- se agrupa de derecha a izquierda; evita anidar más de una vez
- úsalo para elegir valores simples; para varios pasos, `if-else`

## Ejercicios prácticos

### Ejercicio 1: valor absoluto

Lee un entero con `scanf` (valida la lectura) y guarda su valor absoluto en una variable `const int absoluto` usando un ternario. Muéstralo.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int main(void) {
    int numero;

    printf("Número: ");
    if (scanf("%d", &numero) != 1) {
        printf("Entrada inválida\n");
        return 1;
    }

    const int absoluto = numero < 0 ? -numero : numero;
    printf("Valor absoluto: %d\n", absoluto);

    return 0;
}
```

</details>

### Ejercicio 2: predice la salida

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int base = 1000;
    int conEnvio = 1;
    int total1 = base + (conEnvio ? 500 : 0);
    int total2 = base + conEnvio ? 500 : 0;

    printf("%d %d\n", total1, total2);
    return 0;
}
```

<details><summary>Ver solución</summary>

Muestra `1500 500`. `total1` suma el envío como se esperaba. En `total2`, `+` tiene más precedencia que `?:`, así que la expresión es `(base + conEnvio) ? 500 : 0`: `1001` es distinto de cero, y el resultado es `500`. Con `-Wall`, Clang incluso avisa que `?:` tiene menos precedencia que `+`.

</details>

### Ejercicio 3: par o impar

Escribe un programa que lea un entero y muestre "par" o "impar" con un único `printf` que use un ternario para elegir el texto.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int main(void) {
    int numero;

    printf("Número: ");
    if (scanf("%d", &numero) != 1) {
        printf("Entrada inválida\n");
        return 1;
    }

    printf("%d es %s\n", numero, numero % 2 == 0 ? "par" : "impar");
    return 0;
}
```

Funciona también con negativos: en C, `-3 % 2` vale `-1`, que es distinto de 0.

</details>

### Ejercicio 4: de ternario anidado a `else if`

Reescribe esta línea con una cadena `else if` y explica cuál versión te parece más clara.

<!-- c-check: skip -->
```c
int categoria = edad < 13 ? 1 : edad < 18 ? 2 : edad < 65 ? 3 : 4;
```

<details><summary>Ver solución</summary>

```c
int categoria;

if (edad < 13) {
    categoria = 1;
} else if (edad < 18) {
    categoria = 2;
} else if (edad < 65) {
    categoria = 3;
} else {
    categoria = 4;
}
```

Las dos son equivalentes porque el ternario se agrupa de derecha a izquierda. Con cuatro casos, la cadena `else if` se lee mejor y es más fácil de modificar; el ternario solo tiene a su favor que permite declarar `categoria` como `const`.

</details>
