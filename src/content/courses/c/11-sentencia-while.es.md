---
title: 'While'
course: 'c'
slug: 'sentencia-while'
description: 'Repite instrucciones mientras se cumpla una condición con while, controla ciclos con contadores, acumuladores y valores centinela sin caer en bucles infinitos.'
order: 11
lang: 'es'
published: true
---

Hasta ahora viste cómo un programa ejecuta acciones en secuencia y cómo elige entre distintos caminos. Ahora aparece otro problema fundamental: **repetir acciones**.

Ahí entran en juego las sentencias de iteración. La primera que vas a estudiar es `while`.

## Objetivos

Al terminar esta lección podrás:

- explicar qué es una iteración y por qué `while` evalúa la condición **antes** de cada vuelta
- diseñar un ciclo a partir de su estado inicial, su condición y su actualización
- usar contadores y acumuladores dentro de un ciclo
- escribir ciclos con **centinela** y ciclos que leen datos hasta que `scanf` falla
- reconocer y evitar ciclos infinitos y errores por uno (off-by-one)

**Requisitos previos:** lecciones 6 (*Entrada y salida*, validación con `scanf(...) != 1`), 7 (*Operadores*) y 8 a 10 (*If-else*, *Operador ternario*, *Switch y bloques de código*).

## ¿Qué es una iteración?

Una **iteración** es cada repetición de un conjunto de instrucciones. Si un ciclo imprime cinco números, hubo cinco iteraciones (o "vueltas").

Repetir no es copiar el mismo código muchas veces: es controlar cómo cambia un **estado** mientras una condición siga cumpliéndose.

## ¿Qué hace `while`?

La sentencia `while` repite un bloque **mientras una condición sea verdadera** (distinta de cero).

```c
while (condicion) {
    instrucciones;
}
```

El orden de ejecución es siempre el mismo:

1. se evalúa la condición
2. si es falsa, el ciclo termina y el programa sigue después de la llave de cierre
3. si es verdadera, se ejecuta el bloque completo
4. se vuelve al paso 1

Como la condición se evalúa **primero**, el bloque de un `while` puede ejecutarse **cero veces**.

## Los tres elementos de un ciclo

Todo ciclo bien pensado tiene tres elementos:

1. **estado inicial**: el valor de las variables antes de entrar
2. **condición de continuación**: lo que se pregunta antes de cada vuelta
3. **actualización del estado**: lo que cambia dentro del bloque y acerca el ciclo a su final

Si olvidas alguno de los tres, el ciclo casi siempre queda mal.

```c
#include <stdio.h>

int main(void) {
    int i = 1;              // estado inicial

    while (i <= 5) {        // condición
        printf("%d\n", i);
        i = i + 1;          // actualización
    }

    printf("Al salir, i vale %d\n", i);
    return 0;
}
```

### Traza del ciclo

Una **traza** es una tabla con el valor de las variables en cada paso. Es la mejor herramienta para entender (y depurar) un ciclo:

| Vuelta | `i` al evaluar | `i <= 5` | Se imprime | `i` al final |
| --- | --- | --- | --- | --- |
| 1 | 1 | verdadero | `1` | 2 |
| 2 | 2 | verdadero | `2` | 3 |
| 3 | 3 | verdadero | `3` | 4 |
| 4 | 4 | verdadero | `4` | 5 |
| 5 | 5 | verdadero | `5` | 6 |
| — | 6 | falso | — | — |

La condición se evaluó **seis** veces para cinco vueltas, y al salir `i` vale `6`: el primer valor que no cumple la condición.

### Cero iteraciones

```c
#include <stdio.h>

int main(void) {
    int saldo = 0;

    while (saldo > 0) {
        printf("Todavía hay saldo\n");
        saldo = saldo - 100;
    }

    printf("Fin\n");
    return 0;
}
```

Solo se muestra `Fin`: la condición fue falsa desde el principio y el bloque nunca se ejecutó. Es lo correcto, porque no tiene sentido descontar de un saldo vacío.

## Contadores y acumuladores

Dos patrones aparecen en casi todos los ciclos:

- un **contador** cuenta cuántas veces pasa algo: empieza en 0 y suma 1 (`cantidad = cantidad + 1;`)
- un **acumulador** junta valores: empieza en el elemento neutro de la operación (0 para sumar, 1 para multiplicar) y en cada vuelta incorpora un valor (`suma = suma + valor;`)

```c
#include <stdio.h>

int main(void) {
    int n;

    printf("Sumar de 1 hasta: ");
    if (scanf("%d", &n) != 1 || n < 1 || n > 10000) {
        printf("Ingresa un entero entre 1 y 10000\n");
        return 1;
    }

    int i = 1;
    int suma = 0;      // acumulador
    int pares = 0;     // contador

    while (i <= n) {
        suma = suma + i;
        if (i % 2 == 0) {
            pares = pares + 1;
        }
        i = i + 1;
    }

    printf("Suma de 1 a %d: %d\n", n, suma);
    printf("Números pares en el rango: %d\n", pares);
    return 0;
}
```

El límite de 10000 no es un capricho: la suma de 1 a n crece rápido, y desbordar un `int` es **comportamiento indefinido** (lección 7). Validar el rango de la entrada protege al acumulador.

## Ciclos con centinela

Muchas veces no sabes cuántos datos va a ingresar el usuario. Una solución clásica es acordar un **valor centinela** (o valor de corte): un valor especial que no es un dato, sino la señal de "terminé".

El patrón se llama **lectura adelantada**: se lee una vez antes del ciclo y otra vez al final del bloque, de modo que la condición siempre pregunta por el último valor leído.

```c
#include <stdio.h>

int main(void) {
    int nota;
    int cantidad = 0;
    int suma = 0;

    printf("Nota (-1 para terminar): ");
    if (scanf("%d", &nota) != 1) {
        printf("Entrada inválida\n");
        return 1;
    }

    while (nota != -1) {            // -1 es el centinela
        suma = suma + nota;
        cantidad = cantidad + 1;

        printf("Nota (-1 para terminar): ");
        if (scanf("%d", &nota) != 1) {
            printf("Entrada inválida\n");
            return 1;
        }
    }

    if (cantidad > 0) {
        printf("Promedio de %d notas: %.2f\n", cantidad, (double) suma / cantidad);
    } else {
        printf("No se ingresaron notas\n");
    }
    return 0;
}
```

Detalles que importan:

- el centinela **no se procesa**: cuando llega `-1`, la condición falla antes de sumarlo
- el centinela debe ser un valor que nunca sea un dato válido (una nota no puede ser `-1`)
- si el primer valor ya es el centinela, el ciclo hace cero vueltas, y por eso el promedio se calcula solo si `cantidad > 0`: dividir por cero sería un error

## Leer hasta que `scanf` falle

Otra forma de terminar es usar el valor que devuelve `scanf`. Como viste en la lección 6, `scanf("%d", &x)` devuelve `1` si leyó un entero, `0` si encontró algo que no es un número y `EOF` si se terminó la entrada. Entonces la propia lectura puede ser la condición:

```c
#include <stdio.h>

int main(void) {
    int valor;
    int cantidad = 0;
    int maximo = 0;

    printf("Ingresa enteros (termina con una letra o con fin de entrada):\n");
    while (scanf("%d", &valor) == 1) {
        if (cantidad == 0 || valor > maximo) {
            maximo = valor;
        }
        cantidad = cantidad + 1;
    }

    if (cantidad > 0) {
        printf("Leídos: %d, máximo: %d\n", cantidad, maximo);
    } else {
        printf("No se leyó ningún número\n");
    }
    return 0;
}
```

La condición `scanf(...) == 1` lee **y** pregunta en el mismo paso. El fin de entrada se indica con `Ctrl+D` en Linux y macOS, o con `Ctrl+Z` seguido de Enter en Windows. Este patrón es ideal cuando los datos vienen de un archivo redirigido (`./programa < datos.txt`).

Fíjate en cómo se inicializa `maximo`: el primer valor leído lo establece (`cantidad == 0`). Inicializarlo en `0` fallaría si todos los números fueran negativos.

## Ciclos infinitos

Un **ciclo infinito** ocurre cuando la condición nunca se vuelve falsa. Si te pasa al ejecutar, detén el programa con `Ctrl+C`.

Causas típicas:

```c
// 1. Falta la actualización: i siempre vale 1
int i = 1;
while (i <= 5) {
    printf("%d\n", i);
}

// 2. La actualización va en la dirección equivocada
int j = 1;
while (j <= 5) {
    printf("%d\n", j);
    j = j - 1;
}

// 3. La condición usa != y el valor la "salta": k pasa por 1, 3, 5, ..., nunca por 10
int k = 1;
while (k != 10) {
    k = k + 2;
}

// 4. Un punto y coma después del paréntesis: el cuerpo del while es la instrucción vacía
int m = 1;
while (m <= 5);
{
    m = m + 1;
}
```

El cuarto es el más traicionero: `while (m <= 5);` repite la instrucción vacía `;` para siempre, y el bloque de abajo es un bloque suelto que nunca se alcanza.

Antes de escribir un ciclo, pregúntate:

> ¿Qué instrucción del bloque acerca el estado al final del ciclo, y es seguro que la condición se volverá falsa?

A veces un ciclo infinito es intencional (un servidor, un menú) y se escribe `while (true)` o `while (1)`; en ese caso **debe** tener una salida explícita con `break` o `return` dentro del bloque.

> **C moderno (C23):** `true` y `false` son palabras clave, así que `while (true)` compila sin incluir nada. **C básico:** en C99 y C17 necesitas `#include <stdbool.h>` para usar `true`; por eso en código antiguo verás `while (1)`.

## Errores por uno (off-by-one)

Un **error por uno** es un ciclo que da una vuelta de más o de menos. Es el error de ciclos más común en cualquier lenguaje.

```c
// Se quieren 10 vueltas
int i = 0;
while (i <= 10) {   // 11 vueltas: 0, 1, ..., 10
    i = i + 1;
}

int j = 0;
while (j < 10) {    // 10 vueltas: 0, 1, ..., 9
    j = j + 1;
}

int k = 1;
while (k <= 10) {   // 10 vueltas: 1, 2, ..., 10
    k = k + 1;
}
```

Regla práctica: con `i` desde `a` y condición `i < b` se hacen `b - a` vueltas; con `i <= b`, se hacen `b - a + 1`. Para comprobarlo, haz la traza de la **primera** y la **última** vuelta: ahí se esconden casi todos estos errores.

## `break` y `continue` (adelanto)

Dentro de cualquier ciclo, `break` sale inmediatamente del ciclo y `continue` salta a la siguiente evaluación de la condición. Los verás en detalle, con criterios de uso, en la lección 13. Aquí basta una advertencia propia de `while`:

```c
int i = 0;
while (i < 5) {
    if (i == 2) {
        continue;      // salta la actualización: i queda en 2 para siempre
    }
    printf("%d\n", i);
    i = i + 1;
}
```

En un `while`, la actualización es una instrucción más del bloque. Si `continue` la salta, el ciclo se vuelve infinito. La corrección es actualizar **antes** del `continue`, o reorganizar con un `if`.

## ¿Cuándo conviene usar `while`?

`while` es la elección natural cuando la repetición depende de una condición y **no sabes de antemano cuántas vueltas habrá**: leer hasta un centinela, procesar hasta que se acabe la entrada, separar los dígitos de un número, repetir hasta alcanzar un objetivo.

Cuando la cantidad de vueltas se conoce (contar de 1 a n), `for` (lección 12) suele expresarlo mejor.

## Errores comunes

1. **Olvidar la actualización** o escribirla en la dirección equivocada: ciclo infinito.
2. **Poner `;` después de `while (...)`**: el cuerpo pasa a ser la instrucción vacía.
3. **Usar `<=` donde iba `<`** (o al revés): una vuelta de más o de menos.
4. **No inicializar** el contador o el acumulador: arranca con un valor indeterminado.
5. **Procesar el centinela** como si fuera un dato, o dividir por la cantidad sin verificar que sea mayor que 0.
6. **Ignorar el valor de `scanf`**: si el usuario escribe una letra, `scanf` falla siempre y el ciclo puede no terminar nunca.

## Resumen

- `while` evalúa la condición **antes** de cada vuelta; por eso puede ejecutarse cero veces
- todo ciclo tiene estado inicial, condición y actualización
- un contador cuenta ocurrencias; un acumulador junta valores; ambos se inicializan antes del ciclo
- un ciclo con **centinela** usa lectura adelantada y no procesa el valor de corte
- `while (scanf("%d", &x) == 1)` lee hasta que la entrada termina o no es un número
- la traza de la primera y la última vuelta detecta ciclos infinitos y errores por uno

## Ejercicios prácticos

### Ejercicio 1: haz la traza

Sin ejecutarlo, escribe la traza de `n` y `pasos` y la salida del programa.

```c
#include <stdio.h>

int main(void) {
    int n = 6;
    int pasos = 0;

    while (n != 1) {
        if (n % 2 == 0) {
            n = n / 2;
        } else {
            n = 3 * n + 1;
        }
        pasos = pasos + 1;
    }

    printf("Pasos: %d\n", pasos);
    return 0;
}
```

<details><summary>Ver solución</summary>

| Vuelta | `n` al empezar | `n` al terminar | `pasos` |
| --- | --- | --- | --- |
| 1 | 6 | 3 | 1 |
| 2 | 3 | 10 | 2 |
| 3 | 10 | 5 | 3 |
| 4 | 5 | 16 | 4 |
| 5 | 16 | 8 | 5 |
| 6 | 8 | 4 | 6 |
| 7 | 4 | 2 | 7 |
| 8 | 2 | 1 | 8 |

Cuando `n` vale `1`, la condición `n != 1` es falsa. La salida es `Pasos: 8`. No se conoce de antemano la cantidad de vueltas: por eso es un caso típico de `while`.

</details>

### Ejercicio 2: máximo y cantidad con centinela

Escribe un programa que lea enteros positivos hasta que se ingrese `0` (el centinela) y muestre cuántos se ingresaron y cuál fue el mayor. Si el usuario escribe algo que no es un número, muestra `Entrada inválida` y termina con `return 1;`. Si se ingresa un negativo, muestra `Se ignora` y no lo cuentes. Si no hubo ningún positivo, muestra `Sin datos`.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int main(void) {
    int numero;
    int cantidad = 0;
    int mayor = 0;

    printf("Número (0 para terminar): ");
    if (scanf("%d", &numero) != 1) {
        printf("Entrada inválida\n");
        return 1;
    }

    while (numero != 0) {
        if (numero < 0) {
            printf("Se ignora\n");
        } else {
            if (cantidad == 0 || numero > mayor) {
                mayor = numero;
            }
            cantidad = cantidad + 1;
        }

        printf("Número (0 para terminar): ");
        if (scanf("%d", &numero) != 1) {
            printf("Entrada inválida\n");
            return 1;
        }
    }

    if (cantidad > 0) {
        printf("Cantidad: %d, mayor: %d\n", cantidad, mayor);
    } else {
        printf("Sin datos\n");
    }
    return 0;
}
```

La lectura adelantada aparece dos veces: antes del ciclo y al final del bloque. El `0` nunca se procesa como dato.

</details>

### Ejercicio 3: encuentra los errores

Este programa debería mostrar `10 8 6 4 2` y luego la suma `30`. Tiene tres errores. Encuéntralos y corrígelos.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int i = 10;
    int suma;

    while (i >= 0);
    {
        printf("%d ", i);
        suma = suma + i;
        i = i - 2;
    }
    printf("\nSuma: %d\n", suma);
    return 0;
}
```

<details><summary>Ver solución</summary>

1. `while (i >= 0);` tiene un `;` que deja el ciclo con cuerpo vacío: como `i` nunca cambia, es un ciclo infinito.
2. `suma` no está inicializada: hay que escribir `int suma = 0;`.
3. `i >= 0` incluye el `0`, que no debe mostrarse (error por uno): la condición correcta es `i > 0`.

```c
#include <stdio.h>

int main(void) {
    int i = 10;
    int suma = 0;

    while (i > 0) {
        printf("%d ", i);
        suma = suma + i;
        i = i - 2;
    }
    printf("\nSuma: %d\n", suma);
    return 0;
}
```

</details>

### Ejercicio 4: leer hasta el fin de la entrada

Escribe un programa que lea enteros hasta que `scanf` deje de devolver `1` y muestre cuántos fueron pares y cuántos impares. Pruébalo escribiendo números y terminando con `Ctrl+D` (o `Ctrl+Z` y Enter en Windows).

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int main(void) {
    int valor;
    int pares = 0;
    int impares = 0;

    while (scanf("%d", &valor) == 1) {
        if (valor % 2 == 0) {
            pares = pares + 1;
        } else {
            impares = impares + 1;
        }
    }

    printf("Pares: %d, impares: %d\n", pares, impares);
    return 0;
}
```

Con valores negativos, `valor % 2` puede dar `-1`, por eso se compara con `== 0` y no con `== 1`.

</details>
