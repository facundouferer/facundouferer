---
title: 'Recursividad'
course: 'c'
slug: 'recursividad'
order: 17
lang: 'es'
published: true
---

La recursividad parece "mágica" la primera vez que se ve, pero deja de serlo en cuanto miras qué ocurre en la memoria mientras se ejecuta. En su definición más simple:

> Una **función recursiva** es una función que se llama a sí misma.

Funciona porque cada llamada resuelve una versión **más pequeña** del mismo problema, hasta llegar a una tan pequeña que se responde sin volver a llamarse.

## Objetivos

- Reconocer el **caso base** y el **caso recursivo** de una función recursiva.
- Seguir paso a paso la **pila de llamadas** de una función recursiva.
- Escribir funciones recursivas con datos escalares: factorial, potencia, suma de dígitos, máximo común divisor y Fibonacci.
- Comparar recursión e iteración y estimar el costo de una solución recursiva.
- Explicar el límite de profundidad y el desbordamiento de pila, y decidir cuándo no conviene usar recursión.

**Requisitos previos:** `modularizacion-subprogramas-y-funciones` (funciones, `return`, funciones que llaman a funciones) y `variables-parametros-y-pasaje` (variables locales, duración automática, pasaje por valor).

## Una analogía: cajas dentro de cajas

Te regalan una caja. Al abrirla encuentras otra caja más chica, y dentro de esa otra, y así. En alguna está la llave. Una forma de buscarla:

```text
buscar_llave(caja):
    abrir la caja
    si adentro está la llave: terminar           (caso base)
    si adentro hay otra caja: buscar_llave(esa caja)   (caso recursivo)
```

Cada vez que abres una caja haces **exactamente lo mismo** con un problema más chico. Y no necesitas anotar en qué caja estabas: al terminar con la caja de adentro, vuelves a la de afuera. En un programa, de eso se encarga la pila de llamadas.

## Las dos partes de toda función recursiva

1. **Caso base**: una condición en la que la función responde **sin llamarse**. Es la salida.
2. **Caso recursivo**: la función se llama a sí misma con un argumento **más cercano al caso base**.

Las dos son obligatorias. Sin caso base, la función se llama para siempre. Con caso base pero sin acercarse a él (por ejemplo, llamándose siempre con el mismo valor), tampoco termina nunca.

### Primer ejemplo: factorial

El factorial de un entero `n >= 0` es el producto de todos los enteros de 1 a `n`, y por definición `0! = 1`. Por ejemplo, `4! = 4 * 3 * 2 * 1 = 24`.

La definición tiene forma recursiva: `n! = n * (n - 1)!`. Pasada a C:

```c
#include <stdio.h>

// Requiere n >= 0. Con long long, el resultado es correcto hasta n = 20.
long long factorial(int n) {
    if (n <= 1) {
        return 1;                     // caso base: 0! = 1! = 1
    }
    return n * factorial(n - 1);      // caso recursivo: n - 1 se acerca a 1
}

int main(void) {
    for (int i = 0; i <= 5; i++) {
        printf("%d! = %lld\n", i, factorial(i));
    }
    return 0;
}
```

Fíjate en el comentario: `21!` ya no entra en un `long long`, y desbordar un entero con signo es comportamiento indefinido. Documentar el rango válido es parte de escribir bien la función.

## La pila de llamadas

Para entender la recursión hay que entender cómo se ejecuta **cualquier** llamada a función.

Cada vez que se llama a una función, el programa reserva un **marco** (en inglés, *stack frame*) con sus parámetros, sus variables locales y el punto al que debe volver cuando termine. Los marcos se apilan como platos: el de la función que se está ejecutando siempre está arriba. Esa estructura es la **pila de llamadas** (*call stack*).

- Cuando `A` llama a `B`, el marco de `B` se apila sobre el de `A`, y `A` queda en pausa.
- Solo se ejecuta la función del marco de arriba.
- Cuando `B` hace `return`, su marco se retira y `A` continúa exactamente donde había quedado, con el valor devuelto.

Esto conecta con la lección anterior: las variables locales tienen duración automática porque viven en el marco, y desaparecen cuando el marco se retira. En una función recursiva, **cada llamada tiene su propio marco** y su propia copia de `n`: no hay una sola `n` que se va modificando.

### `factorial(4)` paso a paso

**Fase de ida (se apilan llamadas).** Cada llamada queda esperando el resultado de la siguiente:

| Paso | Llamada que se ejecuta | ¿Caso base? | Queda pendiente | Pila (arriba a la izquierda) |
|---|---|---|---|---|
| 1 | `factorial(4)` | no | `4 * factorial(3)` | `f(4)` |
| 2 | `factorial(3)` | no | `3 * factorial(2)` | `f(3)` · `f(4)` |
| 3 | `factorial(2)` | no | `2 * factorial(1)` | `f(2)` · `f(3)` · `f(4)` |
| 4 | `factorial(1)` | **sí** | nada: devuelve `1` | `f(1)` · `f(2)` · `f(3)` · `f(4)` |

**Fase de vuelta (se desapilan y se completan las multiplicaciones pendientes):**

| Paso | Marco que se retira | Cálculo | Devuelve | Pila restante |
|---|---|---|---|---|
| 5 | `f(1)` | — | `1` | `f(2)` · `f(3)` · `f(4)` |
| 6 | `f(2)` | `2 * 1` | `2` | `f(3)` · `f(4)` |
| 7 | `f(3)` | `3 * 2` | `6` | `f(4)` |
| 8 | `f(4)` | `4 * 6` | `24` | vacía: vuelve a `main` |

En el punto más profundo (paso 4) hay **cuatro marcos de `factorial`** en la pila al mismo tiempo, cada uno con su propia `n`. La profundidad de la recursión es la cantidad máxima de marcos simultáneos: para `factorial(n)` es `n`.

Las multiplicaciones no se hacen a la ida: se hacen **a la vuelta**, cuando cada llamada recibe el resultado de la que llamó.

## Más ejemplos con números

### Potencia

`base` elevado a `exponente` (con `exponente >= 0`): `b^0 = 1` y `b^e = b * b^(e-1)`.

```c
// Requiere exponente >= 0.
long long potencia(long long base, int exponente) {
    if (exponente == 0) {
        return 1;                                   // caso base
    }
    return base * potencia(base, exponente - 1);    // caso recursivo
}
```

### Suma de dígitos

La suma de los dígitos de `1234` es `4` (el último dígito, `1234 % 10`) más la suma de los dígitos de `123` (`1234 / 10`).

```c
// Requiere n >= 0.
int suma_digitos(int n) {
    if (n < 10) {
        return n;                                   // caso base: un solo dígito
    }
    return n % 10 + suma_digitos(n / 10);           // caso recursivo
}
```

### Máximo común divisor (algoritmo de Euclides)

El máximo común divisor de `a` y `b` es igual al de `b` y `a % b`, y el de `a` y `0` es `a`. Cada paso achica el segundo número, así que siempre se llega al caso base.

```c
// Requiere a >= 0 y b >= 0, no ambos cero.
int mcd(int a, int b) {
    if (b == 0) {
        return a;                                   // caso base
    }
    return mcd(b, a % b);                           // caso recursivo
}
```

Traza de `mcd(48, 18)`: `mcd(48, 18)` → `mcd(18, 12)` → `mcd(12, 6)` → `mcd(6, 0)` → devuelve `6`. En este caso la llamada recursiva es lo último que hace la función (no queda ninguna operación pendiente a la vuelta): se llama **recursión de cola**.

### Un programa que los usa

```c
#include <stdio.h>

long long potencia(long long base, int exponente);
int suma_digitos(int n);
int mcd(int a, int b);

int main(void) {
    printf("2^10 = %lld\n", potencia(2, 10));                 // 1024
    printf("suma de dígitos de 1234 = %d\n", suma_digitos(1234)); // 10
    printf("mcd(48, 18) = %d\n", mcd(48, 18));                // 6
    return 0;
}

long long potencia(long long base, int exponente) {
    if (exponente == 0) {
        return 1;
    }
    return base * potencia(base, exponente - 1);
}

int suma_digitos(int n) {
    if (n < 10) {
        return n;
    }
    return n % 10 + suma_digitos(n / 10);
}

int mcd(int a, int b) {
    if (b == 0) {
        return a;
    }
    return mcd(b, a % b);
}
```

## Fibonacci y el costo exponencial

La sucesión de Fibonacci empieza con `0` y `1`, y cada término es la suma de los dos anteriores: `0, 1, 1, 2, 3, 5, 8, 13, ...`. La definición es naturalmente recursiva:

```c
// Requiere n >= 0.
long long fibonacci(int n) {
    if (n < 2) {
        return n;                                   // casos base: fib(0) = 0, fib(1) = 1
    }
    return fibonacci(n - 1) + fibonacci(n - 2);     // dos llamadas recursivas
}
```

Es correcta, pero muy ineficiente. Cada llamada genera **dos** llamadas, y forman un árbol:

```text
fib(5)
├── fib(4)
│   ├── fib(3)
│   │   ├── fib(2)
│   │   │   ├── fib(1)
│   │   │   └── fib(0)
│   │   └── fib(1)
│   └── fib(2)
│       ├── fib(1)
│       └── fib(0)
└── fib(3)
    ├── fib(2)
    │   ├── fib(1)
    │   └── fib(0)
    └── fib(1)
```

Son 15 llamadas para calcular `fib(5)`: `fib(3)` se calcula 2 veces, `fib(2)` 3 veces, y cada vez desde cero. La cantidad de llamadas crece aproximadamente como `1.6^n`: es un **costo exponencial**. `fibonacci(40)` hace más de 330 millones de llamadas para un resultado que un ciclo obtiene en 40 pasos:

```c
// Requiere n >= 0. Misma respuesta, n pasos y memoria constante.
long long fibonacci_iterativo(int n) {
    long long anterior = 0;
    long long actual = 1;
    if (n == 0) {
        return 0;
    }
    for (int i = 1; i < n; i++) {
        long long siguiente = anterior + actual;
        anterior = actual;
        actual = siguiente;
    }
    return actual;
}
```

La lección: que una definición sea recursiva no significa que la mejor implementación lo sea. Antes de elegir, piensa **cuántas llamadas** hace tu función.

## Límite de profundidad y desbordamiento de pila

La pila de llamadas tiene un tamaño limitado. Cada llamada que todavía no terminó ocupa un marco. Si la recursión es demasiado profunda (o infinita), la pila se llena y el programa termina abruptamente: es un **desbordamiento de pila** (*stack overflow*). En Linux y macOS suele verse como `Segmentation fault`.

```c
// ERROR: no tiene caso base. Cada llamada apila un marco nuevo hasta agotar la pila.
void sin_fin(int n) {
    sin_fin(n + 1);
}
```

Las causas típicas son:

- **olvidar el caso base**;
- **no acercarse al caso base**: por ejemplo, `factorial(-3)` con una condición `n == 1` nunca llega (por eso nuestra versión usa `n <= 1` y documenta que requiere `n >= 0`);
- **una profundidad legítima pero enorme**: sumar de 1 a 10 millones recursivamente necesita 10 millones de marcos simultáneos, aunque la función sea correcta.

> **Portabilidad:** el estándar de C no fija el tamaño de la pila ni una profundidad máxima de recursión. Dependen del sistema y de la configuración: es común que el hilo principal tenga unos 8 MB en Linux y macOS y 1 MB en Windows. Tampoco garantiza que el compilador transforme la recursión de cola en un ciclo; algunos lo hacen al optimizar (`-O2`), pero un programa correcto no debe depender de eso.

## Recursión o iteración

Todo lo que se resuelve con recursión se puede resolver con ciclos, y viceversa. La pregunta es cuál expresa mejor el problema con un costo razonable.

| Criterio | Recursión | Iteración (`for`, `while`) |
|---|---|---|
| Claridad | muy clara cuando el problema se define a sí mismo (estructuras ramificadas, divide y vencerás) | muy clara para recorridos y acumulaciones lineales |
| Memoria | un marco por cada llamada pendiente: crece con la profundidad | constante: las mismas variables en cada vuelta |
| Riesgo | desbordamiento de pila si la profundidad es grande | ninguno de pila |
| Velocidad | cada llamada tiene un costo extra (crear y retirar el marco) | sin ese costo |

### Cuándo no usar recursión

- Cuando el problema es un **recorrido lineal** simple (contar, sumar de 1 a `n`, recorrer una secuencia): un ciclo es igual de claro y no consume pila.
- Cuando la **profundidad** puede ser grande o depende de datos externos que no controlas.
- Cuando la recursión **recalcula** los mismos subproblemas, como Fibonacci ingenuo.

Y cuándo sí: cuando la solución se describe naturalmente como "resolver lo mismo en partes más chicas" y la profundidad es pequeña. Lo verás en algoritmos de ordenación eficientes y en estructuras como los árboles binarios, más adelante en el curso.

## Errores comunes

1. **Olvidar el caso base** o escribirlo de forma que nunca se cumple.
2. **No reducir el problema** en la llamada recursiva (llamar con el mismo argumento).
3. **Olvidar el `return`** delante de la llamada recursiva en una función que devuelve un valor: la llamada se hace, pero su resultado se pierde.
4. **No documentar el rango válido** (por ejemplo, `n >= 0`) ni el límite de desbordamiento del tipo de retorno.
5. **Usar recursión donde un ciclo es más simple** o donde la profundidad puede ser enorme.

## Resumen

- Una función recursiva se llama a sí misma con un problema más pequeño.
- Necesita un **caso base** (responde sin llamarse) y un **caso recursivo** que se acerque a él.
- Cada llamada tiene su propio marco en la **pila de llamadas**, con sus propios parámetros y variables locales.
- Las operaciones pendientes se resuelven a la vuelta, al desapilarse los marcos.
- La profundidad está limitada por el tamaño de la pila; superarla provoca un desbordamiento de pila.
- Fibonacci recursivo ingenuo tiene costo exponencial; un ciclo lo resuelve en `n` pasos.

## Ejercicios prácticos

### Ejercicio 1: contar dígitos

Escribe una función recursiva `int contar_digitos(int n)` que devuelva cuántos dígitos tiene un entero `n >= 0` (`0` tiene un dígito). Identifica el caso base y el caso recursivo.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

// Requiere n >= 0.
int contar_digitos(int n) {
    if (n < 10) {
        return 1;                           // caso base: un solo dígito
    }
    return 1 + contar_digitos(n / 10);      // caso recursivo: un dígito menos
}

int main(void) {
    printf("%d\n", contar_digitos(0));       // 1
    printf("%d\n", contar_digitos(7));       // 1
    printf("%d\n", contar_digitos(2026));    // 4
    return 0;
}
```

Cada llamada quita el último dígito con `n / 10`, así que `n` se acerca a un número de un solo dígito.

</details>

### Ejercicio 2: traza de la pila

Dibuja la pila de llamadas de `suma_digitos(472)` (la función de la lección): qué llamadas se apilan, cuál es el caso base y qué devuelve cada una a la vuelta.

<details><summary>Ver solución</summary>

Ida:

| Llamada | Queda pendiente |
|---|---|
| `suma_digitos(472)` | `2 + suma_digitos(47)` |
| `suma_digitos(47)` | `7 + suma_digitos(4)` |
| `suma_digitos(4)` | caso base: devuelve `4` |

Vuelta:

| Marco que se retira | Cálculo | Devuelve |
|---|---|---|
| `suma_digitos(4)` | — | `4` |
| `suma_digitos(47)` | `7 + 4` | `11` |
| `suma_digitos(472)` | `2 + 11` | `13` |

La profundidad máxima es 3: un marco por dígito.

</details>

### Ejercicio 3: recursiva e iterativa

Escribe dos versiones de una función que sume los enteros de 1 a `n` (`n >= 0`): `suma_recursiva` y `suma_iterativa`. Comprueba que dan lo mismo para varios valores y explica cuál elegirías para `n = 10000000` y por qué.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

// Requiere n >= 0.
long long suma_recursiva(int n) {
    if (n == 0) {
        return 0;
    }
    return n + suma_recursiva(n - 1);
}

// Requiere n >= 0.
long long suma_iterativa(int n) {
    long long suma = 0;
    for (int i = 1; i <= n; i++) {
        suma = suma + i;
    }
    return suma;
}

int main(void) {
    for (int n = 0; n <= 100; n = n + 25) {
        printf("n = %d: %lld %lld\n", n, suma_recursiva(n), suma_iterativa(n));
    }
    return 0;
}
```

Para `n = 10000000` conviene la iterativa: la recursiva necesitaría diez millones de marcos simultáneos en la pila y probablemente la desbordaría, mientras que la iterativa usa siempre las mismas dos variables.

</details>

### Ejercicio 4: encontrar el error

Esta función debería calcular `base` elevado a `exponente`, pero con `potencia_mal(2, 3)` el programa termina con un desbordamiento de pila. ¿Por qué? Corrígela.

```c
long long potencia_mal(long long base, int exponente) {
    if (exponente == 0) {
        return 1;
    }
    return base * potencia_mal(base, exponente);
}
```

<details><summary>Ver solución</summary>

El caso recursivo llama con el **mismo** `exponente`, así que nunca se acerca al caso base: la recursión es infinita y cada llamada apila un marco hasta agotar la pila. Hay que reducir el exponente:

```c
long long potencia(long long base, int exponente) {
    if (exponente == 0) {
        return 1;
    }
    return base * potencia(base, exponente - 1);
}
```

Además, conviene documentar que requiere `exponente >= 0`: con un exponente negativo tampoco se llegaría nunca a `0`.

</details>
