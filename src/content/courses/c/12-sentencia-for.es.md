---
title: 'For'
course: 'c'
slug: 'sentencia-for'
order: 12
lang: 'es'
published: true
---

Después de aprender `while`, aparece una estructura muy usada cuando la repetición tiene una forma compacta y controlada: `for`.

## Objetivos

Al terminar esta lección podrás:

- explicar las tres partes de un `for` y en qué momento se ejecuta cada una
- declarar la variable del ciclo dentro del `for` y saber hasta dónde llega su alcance
- contar hacia arriba, hacia abajo y de a pasos
- aplicar el patrón **contador** y el acumulador dentro de un `for`
- reescribir un `for` como `while` y elegir cuál conviene
- evitar los errores típicos: `;` después del paréntesis, modificar el contador dentro del cuerpo, `<=` contra `<` y contadores sin signo que cuentan hacia abajo

**Requisitos previos:** lección 11 (*While*: estado inicial, condición, actualización, errores por uno) y lección 5 (*Tipos de datos*: `size_t`, desbordamiento de enteros sin signo).

## ¿Qué hace `for`?

La sentencia `for` repite un bloque y concentra en una sola línea los tres elementos de cualquier ciclo:

```c
for (inicializacion; condicion; actualizacion) {
    instrucciones;
}
```

Orden de ejecución:

1. **inicialización**: se ejecuta **una sola vez**, al comienzo
2. **condición**: se evalúa **antes de cada vuelta**; si es falsa, el ciclo termina
3. **cuerpo**: se ejecuta si la condición fue verdadera
4. **actualización**: se ejecuta **al final de cada vuelta**, y se vuelve al paso 2

Igual que en `while`, si la condición es falsa desde el principio, el cuerpo se ejecuta cero veces.

## Ejemplo básico

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 5; i++) {
        printf("%d\n", i);
    }
    return 0;
}
```

- inicialización: `int i = 1` (declara y da valor al contador)
- condición: `i <= 5`
- actualización: `i++`, que equivale a `i = i + 1` (lección 7)

Traza: la condición se evalúa con `i` = 1, 2, 3, 4, 5 (verdadera, se imprime) y con `i` = 6 (falsa, termina). Cinco vueltas, seis evaluaciones de la condición.

## La variable declarada en el `for` y su alcance

Desde C99, la inicialización puede **declarar** la variable del ciclo. Esa variable existe solo dentro del `for`: su **alcance** es el encabezado y el cuerpo. Al salir del ciclo, deja de existir.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    for (int i = 0; i < 3; i++) {
        printf("%d\n", i);
    }
    printf("%d\n", i);   // error: 'i' no está declarada en este alcance
    return 0;
}
```

Esto es una ventaja: el contador no "se escapa" y no puede usarse por accidente más adelante. Si necesitas el valor final después del ciclo, declara la variable **antes**:

```c
#include <stdio.h>

int main(void) {
    int n = 37;
    int divisor;

    for (divisor = 2; n % divisor != 0; divisor++) {
        // no hace falta cuerpo: la condición busca el primer divisor
    }

    printf("El menor divisor de %d mayor que 1 es %d\n", n, divisor);
    return 0;
}
```

Como `divisor` se declaró fuera, su valor sigue disponible al terminar el ciclo (aquí `37`, porque 37 es primo).

> **Portabilidad:** declarar la variable dentro del `for` es válido desde C99 y, por supuesto, en C17 y C23. Solo los compiladores en modo C89 (`-std=c89`) lo rechazan; por eso en código muy antiguo verás todas las variables declaradas al principio de la función.

## Contar hacia arriba, hacia abajo y de a pasos

La actualización puede ser cualquier expresión. La condición tiene que ser coherente con ella:

```c
#include <stdio.h>

int main(void) {
    // hacia arriba: 0 1 2 3 4
    for (int i = 0; i < 5; i++) {
        printf("%d ", i);
    }
    printf("\n");

    // hacia abajo: 5 4 3 2 1
    for (int i = 5; i > 0; i--) {
        printf("%d ", i);
    }
    printf("\n");

    // de a pasos: 0 5 10 15 20
    for (int i = 0; i <= 20; i += 5) {
        printf("%d ", i);
    }
    printf("\n");

    // potencias de 2 menores que 100: 1 2 4 8 16 32 64
    for (int p = 1; p < 100; p *= 2) {
        printf("%d ", p);
    }
    printf("\n");
    return 0;
}
```

Cada `for` declara su propia `i`: como el alcance termina con el ciclo, no hay conflicto entre ellas.

Evita usar `double` como contador: `0.1` no se representa exactamente (lección 5), y un ciclo como `for (double x = 0.0; x != 1.0; x += 0.1)` puede no terminar nunca. Cuenta con enteros y calcula el `double` dentro del cuerpo.

## El patrón contador

La variable del `for` **recorre** valores; un **contador** aparte **cuenta** cuántos de ellos cumplen algo. No hay que confundirlos.

```c
#include <stdio.h>

int main(void) {
    int n;

    printf("Límite: ");
    if (scanf("%d", &n) != 1 || n < 1) {
        printf("Ingresa un entero positivo\n");
        return 1;
    }

    int multiplos = 0;        // contador
    long long suma = 0;       // acumulador

    for (int i = 1; i <= n; i++) {
        if (i % 3 == 0) {
            multiplos++;
            suma += i;
        }
    }

    printf("Entre 1 y %d hay %d múltiplos de 3; suman %lld\n", n, multiplos, suma);
    return 0;
}
```

- `i` va de 1 a `n`: dice **qué número se está mirando**
- `multiplos` empieza en 0 y crece solo cuando la condición se cumple
- `suma` es `long long` para tener más margen antes de un desbordamiento

## `for` y `while`: la misma idea

Todo `for` puede escribirse como `while`:

```c
for (int i = 1; i <= 5; i++) {
    printf("%d\n", i);
}
```

equivale a:

```c
{
    int i = 1;
    while (i <= 5) {
        printf("%d\n", i);
        i++;
    }
}
```

Las llaves externas reproducen el alcance: `i` no existe fuera. Hay una sola diferencia práctica: en un `for`, `continue` salta al final del cuerpo y **ejecuta la actualización**; en el `while` equivalente, si `continue` aparece antes de `i++`, la salta (lo viste en la lección 11).

¿Cuál elegir?

- `for`, cuando hay una variable que **recorre** un rango conocido: de 1 a n, de n a 0, de a pasos
- `while`, cuando la repetición depende de una condición y no de contar: un centinela, el fin de la entrada, "hasta que el número sea 1"

## Errores comunes

### 1. Un `;` después del paréntesis

```c
for (int i = 0; i < 5; i++);
{
    printf("Hola\n");
}
```

El `;` es el cuerpo del ciclo (la instrucción vacía). El `for` da cinco vueltas sin hacer nada y después el bloque se ejecuta **una sola vez**. Además, dentro de ese bloque `i` ya no existe.

### 2. Modificar el contador dentro del cuerpo

```c
for (int i = 0; i < 10; i++) {
    printf("%d\n", i);
    i = i + 1;     // ahora el ciclo avanza de a 2 y nadie lo nota en el encabezado
}
```

Quien lee un `for` espera que el encabezado describa todo el recorrido. Si el paso cambia, cámbialo en la actualización (`i += 2`). Si el recorrido depende de lo que pasa dentro, probablemente era un `while`.

### 3. `<=` contra `<`

| Encabezado | Valores de `i` | Vueltas |
| --- | --- | --- |
| `for (int i = 0; i < n; i++)` | 0 … n-1 | n |
| `for (int i = 1; i <= n; i++)` | 1 … n | n |
| `for (int i = 0; i <= n; i++)` | 0 … n | n + 1 |

La forma `0` y `< n` es la habitual en C (la usarás con arreglos más adelante en el curso). Mezclar `0` con `<= n` da una vuelta de más: es el error por uno más frecuente.

### 4. Contadores sin signo que cuentan hacia abajo

`size_t` (lección 5) es un tipo **sin signo**: no tiene valores negativos. Cuando vale `0` y se le resta 1, **da la vuelta** al valor máximo (`SIZE_MAX`). Por eso este ciclo nunca termina:

<!-- c-check: skip -->
```c
#include <stddef.h>
#include <stdio.h>

int main(void) {
    size_t n = 3;

    for (size_t i = n; i >= 0; i--) {   // i >= 0 es SIEMPRE verdadero
        printf("%zu\n", i);
    }
    return 0;
}
```

Después de mostrar `0`, `i--` deja `i` en un número enorme, que sigue siendo `>= 0`. Con `-Wextra`, GCC advierte que la comparación siempre es verdadera. Dos formas correctas:

```c
#include <stddef.h>
#include <stdio.h>

int main(void) {
    size_t n = 3;

    // 1. La condición nunca necesita llegar a un valor negativo
    for (size_t i = n; i > 0; i--) {
        printf("%zu ", i - 1);       // muestra 2 1 0
    }
    printf("\n");

    // 2. Se compara y se decrementa en la condición
    for (size_t i = n; i-- > 0; ) {
        printf("%zu ", i);           // muestra 2 1 0
    }
    printf("\n");
    return 0;
}
```

En la segunda forma, `i-- > 0` compara el valor **anterior** y después lo decrementa, así que el cuerpo ve `2`, `1` y `0`. Cualquier parte del encabezado puede quedar vacía; aquí la actualización ya está en la condición.

## Resumen

- `for (inicialización; condición; actualización)`: la inicialización corre una vez, la condición antes de cada vuelta, la actualización al final de cada vuelta
- la variable declarada en el `for` (C99+) solo existe dentro del ciclo
- la variable del ciclo recorre valores; un **contador** aparte cuenta los que cumplen algo
- todo `for` equivale a un `while`, salvo el detalle de `continue` y la actualización
- cuidado con `;` tras el paréntesis, con modificar el contador en el cuerpo, con `<=` contra `<` y con contadores sin signo que bajan hasta 0

## Ejercicios prácticos

### Ejercicio 1: predice la salida

```c
#include <stdio.h>

int main(void) {
    for (int i = 20; i > 0; i -= 6) {
        printf("%d ", i);
    }
    printf("\n");

    int vueltas = 0;
    for (int j = 1; j <= 100; j *= 3) {
        vueltas++;
    }
    printf("%d\n", vueltas);
    return 0;
}
```

<details><summary>Ver solución</summary>

```text
20 14 8 2
5
```

El primer ciclo baja de 6 en 6; después de `2` la actualización deja `i` en `-4` y la condición falla. El segundo recorre `j` = 1, 3, 9, 27, 81 (cinco vueltas); el siguiente valor, `243`, ya no cumple `j <= 100`.

</details>

### Ejercicio 2: divisores de un número

Escribe un programa que lea un entero `n` entre 1 y 100000, muestre todos sus divisores en una línea y, con un contador, informe cuántos son. Si tiene exactamente 2 divisores, informa además que es primo.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int main(void) {
    int n;

    printf("Número (1 a 100000): ");
    if (scanf("%d", &n) != 1 || n < 1 || n > 100000) {
        printf("Entrada inválida\n");
        return 1;
    }

    int divisores = 0;
    for (int d = 1; d <= n; d++) {
        if (n % d == 0) {
            printf("%d ", d);
            divisores++;
        }
    }
    printf("\nCantidad de divisores: %d\n", divisores);

    if (divisores == 2) {
        printf("%d es primo\n", n);
    }
    return 0;
}
```

`d` recorre los candidatos; `divisores` cuenta solo los que dividen a `n`.

</details>

### Ejercicio 3: de while a for

Reescribe este ciclo como un `for` equivalente, con la variable declarada en el encabezado.

```c
#include <stdio.h>

int main(void) {
    int k = 10;
    while (k >= 0) {
        printf("%d ", k);
        k = k - 2;
    }
    printf("\n");
    return 0;
}
```

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int main(void) {
    for (int k = 10; k >= 0; k -= 2) {
        printf("%d ", k);
    }
    printf("\n");
    return 0;
}
```

Ambos muestran `10 8 6 4 2 0`. La única diferencia es que ahora `k` no existe después del ciclo.

</details>

### Ejercicio 4: cuenta regresiva con `size_t`

Un compañero escribió esta cuenta regresiva y el programa no termina nunca. Explica por qué y corrígelo sin cambiar el tipo de `i`.

<!-- c-check: skip -->
```c
#include <stddef.h>
#include <stdio.h>

int main(void) {
    for (size_t i = 5; i >= 0; i--) {
        printf("%zu...\n", i);
    }
    printf("¡Despegue!\n");
    return 0;
}
```

<details><summary>Ver solución</summary>

`size_t` no tiene negativos: cuando `i` vale `0`, `i--` da la vuelta a `SIZE_MAX` y `i >= 0` sigue siendo verdadero. Hay que lograr que el `0` se muestre sin que la condición dependa de pasar por debajo de 0:

```c
#include <stddef.h>
#include <stdio.h>

int main(void) {
    for (size_t i = 6; i-- > 0; ) {
        printf("%zu...\n", i);
    }
    printf("¡Despegue!\n");
    return 0;
}
```

Muestra de `5...` a `0...` y luego `¡Despegue!`. Otra opción válida es `for (size_t i = 6; i > 0; i--)` mostrando `i - 1`.

</details>
