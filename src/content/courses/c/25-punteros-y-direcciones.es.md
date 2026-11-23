---
title: 'Punteros y direcciones de memoria'
course: 'c'
slug: 'punteros-y-direcciones'
order: 25
lang: 'es'
published: true
---

Hasta ahora trabajaste con variables por su **nombre**: `edad`, `notas[3]`, `alumno.nombre`. Pero la computadora no conoce nombres: conoce **posiciones de memoria**. Cada dato vive en algún lugar, y ese lugar tiene un número.

En esta lección vas a mirar debajo de los nombres. Ese es el paso que distingue a C de casi todos los lenguajes que conociste antes, y es la base de todo lo que viene: arreglos y cadenas por dentro, memoria dinámica, listas, pilas y árboles.

> Idea clave: un **puntero** es una variable cuyo valor es la **dirección** de otro objeto. Con la dirección puedes llegar al objeto y leerlo o modificarlo, aunque no tengas su nombre a mano.

## Objetivos

- Explicar qué es un objeto en memoria y qué es su dirección.
- Obtener direcciones con `&` e imprimirlas con `%p`.
- Declarar, inicializar y desreferenciar punteros con `*`.
- Reconocer cuándo un puntero es válido y cuándo no (`NULL`, punteros sin inicializar).
- Modificar variables de quien llama pasando direcciones, sabiendo que el puntero también se pasa **por valor**.
- Devolver varios resultados desde una función mediante parámetros puntero.
- Leer declaraciones con `const` y punteros.

**Requisitos previos:** [Tipos de datos](/cursos/c/tipos-de-datos) (`sizeof`), [Modularización, subprogramas y funciones](/cursos/c/modularizacion-subprogramas-y-funciones), [Variables, parámetros y pasaje](/cursos/c/variables-parametros-y-pasaje) (C pasa los argumentos siempre por valor), [Arreglos](/cursos/c/arreglos-unidimensionales-y-multidimensionales) y [Estructuras](/cursos/c/concepto-de-estructuras).

## La memoria como una fila de celdas numeradas

Un modelo útil para pensar la memoria es una fila muy larga de celdas de un byte. Cada celda tiene un número único: su **dirección**.

Cuando declaras una variable, el compilador reserva para ella tantas celdas consecutivas como indique su tipo. A esa región de memoria que guarda un valor el estándar de C la llama **objeto** (no tiene nada que ver con la programación orientada a objetos).

```c
int x = 42;
char letra = 'A';
```

Si `sizeof(int)` vale 4 en tu máquina, el resultado podría verse así (las direcciones son inventadas, pero el modelo es el real):

| Dirección | Contenido | Pertenece a |
| --- | --- | --- |
| `1000` | byte de `x` | `x` (4 bytes) |
| `1001` | byte de `x` | |
| `1002` | byte de `x` | |
| `1003` | byte de `x` | |
| `1004` | `'A'` | `letra` (1 byte) |

La **dirección de un objeto** es la dirección de su primer byte. En la tabla, la dirección de `x` es `1000` y la de `letra` es `1004`.

Dos ideas que conviene separar desde el principio:

- el **valor** de `x` es `42`;
- la **dirección** de `x` es `1000`.

Un puntero trabaja con la segunda.

## El operador `&`: la dirección de un objeto

El operador unario `&` (dirección de) devuelve la dirección de un objeto. Ya lo usaste sin nombrarlo formalmente: en `scanf("%d", &x)` le pasabas a `scanf` **la dirección de `x`**, para que pudiera escribir ahí el número leído. Ahora sabes por qué hacía falta: `scanf` no puede cambiar tu variable si solo recibe una copia de su valor.

Para imprimir una dirección se usa el especificador `%p`, que espera un `void *` (un puntero genérico, lo verás a fondo en la próxima lección). Por eso la dirección se convierte con `(void *)`:

```c
#include <stdio.h>

int main(void) {
    int x = 42;
    double precio = 9.5;

    printf("valor de x:        %d\n", x);
    printf("direccion de x:    %p\n", (void *)&x);
    printf("direccion precio:  %p\n", (void *)&precio);
    printf("sizeof x: %zu, sizeof precio: %zu\n", sizeof x, sizeof precio);

    return 0;
}
```

Una salida posible:

```text
valor de x:        42
direccion de x:    0x7ffd5e8a3b4c
direccion precio:  0x7ffd5e8a3b40
sizeof x: 4, sizeof precio: 8
```

> **Portabilidad:** el formato que imprime `%p` lo decide cada implementación (suele ser hexadecimal) y las direcciones cambian entre ejecuciones, porque los sistemas operativos modernos ubican el programa en posiciones distintas cada vez. Nunca escribas un programa que dependa de un valor concreto de dirección.

## Declarar e inicializar un puntero

Un puntero se declara con el tipo del objeto al que va a apuntar, seguido de `*`:

```c
int x = 42;
int *p = &x;   /* p es un puntero a int y guarda la dirección de x */
```

Se lee de derecha a izquierda: "`p` es un puntero (`*`) a `int`". Después de esa línea decimos que **`p` apunta a `x`**.

<svg viewBox="0 0 560 170" role="img" aria-label="Diagrama de memoria: p, en la dirección 2000, guarda 1000; x, en la dirección 1000, guarda 42; una flecha va de p a x" style="max-width: 100%; height: auto; font-family: var(--font-body);">
  <rect x="20" y="40" width="160" height="70" rx="16" fill="var(--color-surface)" stroke="var(--color-accent-2)" stroke-width="3"/>
  <text x="100" y="30" text-anchor="middle" fill="var(--color-text)" font-size="16">p (dirección 2000)</text>
  <text x="100" y="82" text-anchor="middle" fill="var(--color-text)" font-size="22" font-family="monospace">1000</text>
  <rect x="380" y="40" width="160" height="70" rx="16" fill="var(--color-surface)" stroke="var(--color-accent)" stroke-width="3"/>
  <text x="460" y="30" text-anchor="middle" fill="var(--color-text)" font-size="16">x (dirección 1000)</text>
  <text x="460" y="82" text-anchor="middle" fill="var(--color-text)" font-size="22" font-family="monospace">42</text>
  <path d="M180 75 C 260 75, 300 75, 372 75" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
  <path d="M362 66 L 374 75 L 362 84" fill="none" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <text x="280" y="140" text-anchor="middle" fill="var(--color-text)" font-size="15">el valor de p es la dirección de x</text>
</svg>

Observa que `p` es una variable como cualquier otra: ocupa memoria, tiene su propia dirección (`2000` en el diagrama) y su valor es un número, que en este caso es una dirección.

Un detalle de sintaxis que confunde a muchos: el `*` pertenece a cada nombre, no al tipo.

```c
int *p, q;   /* p es int *, pero q es un int común */
int *r, *s;  /* r y s son punteros a int */
```

Para evitar errores, declara un puntero por línea.

## Desreferenciar: leer y escribir a través del puntero

El operador unario `*` aplicado a un puntero se llama **desreferenciar**: `*p` es el objeto al que apunta `p`. Puedes usarlo para leer y también para escribir.

```c
#include <stdio.h>

int main(void) {
    int x = 42;
    int *p = &x;

    printf("x = %d, *p = %d\n", x, *p);

    *p = 50;              /* escribe en x a través de p */
    printf("x = %d\n", x);

    *p = *p + 1;          /* lee x, suma 1 y lo vuelve a guardar en x */
    printf("x = %d\n", x);

    return 0;
}
```

Salida:

```text
x = 42, *p = 42
x = 50
x = 51
```

Sigamos el programa paso a paso con un diagrama de memoria (direcciones inventadas):

| Paso | `x` (en 1000) | `p` (en 2000) | `*p` |
| --- | --- | --- | --- |
| `int x = 42;` | 42 | — | — |
| `int *p = &x;` | 42 | 1000 | 42 |
| `*p = 50;` | **50** | 1000 | 50 |
| `*p = *p + 1;` | **51** | 1000 | 51 |

Fíjate en que `p` nunca cambió: siempre vale `1000`. Lo que cambió fue el objeto al que apunta.

El símbolo `*` tiene tres significados según dónde aparece:

| Dónde | Ejemplo | Significado |
| --- | --- | --- |
| En una declaración | `int *p;` | `p` es un puntero a `int` |
| Delante de un puntero en una expresión | `*p = 5;` | el objeto apuntado (desreferenciar) |
| Entre dos operandos | `a * b` | multiplicación |

Y `&` con `*` son operaciones inversas: `*&x` es `x`, y si `p` apunta a algo, `&*p` es `p`.

### Predice el valor

```c
int a = 3;
int b = 7;
int *p = &a;
*p = *p * 2;
p = &b;
*p = *p + a;
```

¿Cuánto valen `a` y `b` al final? Piénsalo antes de seguir.

Respuesta: `a` vale `6` (se duplicó a través de `p`) y `b` vale `13` (`7 + 6`). La línea `p = &b;` no copia ningún entero: hace que `p` **apunte a otro objeto**.

## Los tipos de puntero deben coincidir

Un `int *` apunta a un `int`, un `double *` apunta a un `double`, un `char *` apunta a un `char`. El tipo le dice al compilador cuántos bytes leer y cómo interpretarlos al desreferenciar.

```c
int edad = 20;
double *pd = &edad;   /* ERROR: tipos de puntero incompatibles */
```

Con las opciones del curso (`-Wall -Wextra -Wpedantic`), el compilador avisa que `int *` y `double *` son incompatibles. Si lo forzaras, `*pd` leería 8 bytes donde hay 4 y los interpretaría como un `double`: comportamiento indefinido. Si el compilador se queja de los tipos de un puntero, casi siempre tiene razón.

## El puntero nulo: `NULL`

A veces un puntero todavía no tiene un objeto al que apuntar. Para expresar "no apunta a nada" existe el **puntero nulo**, que se escribe `NULL` (definido en `<stddef.h>`, `<stdio.h>` y otros encabezados).

```c
int *p = NULL;

if (p != NULL) {
    printf("%d\n", *p);   /* solo se desreferencia si apunta a algo */
}
```

`NULL` es un valor que puedes **comparar**, nunca **desreferenciar**. Muchas funciones de la biblioteca estándar devuelven `NULL` para avisar que algo falló; lo verás en memoria dinámica y en archivos.

> **C básico:** inicializa todo puntero, aunque sea con `NULL`. Un puntero inicializado con `NULL` se puede comprobar; uno sin inicializar, no.

> **C moderno (C23):** C23 agrega la constante `nullptr` (de tipo `nullptr_t`), que representa el puntero nulo sin ambigüedad: `int *p = nullptr;`. `NULL` sigue siendo válido y es lo que verás en casi todo el código existente.

> **Portabilidad:** `nullptr` no existe en C17 ni en compiladores anteriores; si tu código debe compilar con `-std=c17`, usa `NULL`. En este curso usamos `NULL` en los ejemplos para que funcionen en ambos.

## Cuándo un puntero es válido

Antes de escribir `*p`, `p` tiene que apuntar a un **objeto válido**: una variable que existe, un elemento dentro de un arreglo. Si no, desreferenciar es **comportamiento indefinido**: el estándar no dice qué pasa. El programa puede terminar con un error de segmentación, puede parecer que funciona o puede corromper otros datos en silencio.

Los dos casos clásicos:

```c
int *p;          /* sin inicializar: su valor es basura */
*p = 10;         /* comportamiento indefinido: escribe en una dirección cualquiera */

int *q = NULL;
printf("%d\n", *q);   /* comportamiento indefinido: q no apunta a ningún objeto */
```

El primero es el más peligroso, porque un puntero sin inicializar no se distingue a simple vista de uno válido. Por eso la regla de oro: **todo puntero nace apuntando a algo válido o a `NULL`**. (Hay un tercer caso, el puntero que apunta a un objeto que ya dejó de existir; lo estudiarás en la lección de duración y ciclo de vida.)

## Modificar una variable de quien llama

En la lección de parámetros viste que C pasa los argumentos **siempre por valor**: la función recibe una copia. Por eso esta versión de `intercambiar` no funciona:

```c
void intercambiar_copias(int a, int b) {
    int aux = a;
    a = b;
    b = aux;     /* cambia las copias; las variables de main quedan igual */
}
```

La técnica para que una función modifique variables de quien la llama es **pasarle sus direcciones**:

```c
#include <stdio.h>

void intercambiar(int *a, int *b) {
    int aux = *a;
    *a = *b;
    *b = aux;
}

int main(void) {
    int x = 3;
    int y = 8;

    intercambiar(&x, &y);
    printf("x = %d, y = %d\n", x, y);

    return 0;
}
```

Salida:

```text
x = 8, y = 3
```

Sigamos la memoria durante la llamada (direcciones inventadas):

| Momento | `x` (1000) | `y` (1004) | `a` | `b` | `aux` |
| --- | --- | --- | --- | --- | --- |
| antes de llamar | 3 | 8 | — | — | — |
| al entrar | 3 | 8 | 1000 | 1004 | — |
| `aux = *a;` | 3 | 8 | 1000 | 1004 | 3 |
| `*a = *b;` | **8** | 8 | 1000 | 1004 | 3 |
| `*b = aux;` | 8 | **3** | 1000 | 1004 | 3 |
| al volver | 8 | 3 | — | — | — |

### El puntero también se pasa por valor

Esto es importante y suele explicarse mal. En `intercambiar(&x, &y)` **no hay un mecanismo especial de "pasaje por referencia"**. Se evalúan `&x` y `&y`, que son dos valores (dos direcciones), y esos valores se **copian** en los parámetros `a` y `b`. Es pasaje por valor, igual que siempre; lo que se copia es una dirección.

Lo que cambia la variable de `main` no es la llamada, sino la desreferenciación `*a = ...` dentro de la función. La prueba: si la función cambia **el puntero mismo**, quien llama no se entera.

```c
#include <stdio.h>

void redirigir(int *p) {
    static int otro = 99;
    p = &otro;      /* cambia la copia local del puntero */
    *p = 100;       /* escribe en otro, no en x */
}

int main(void) {
    int x = 5;
    int *px = &x;

    redirigir(px);
    printf("x = %d, px apunta a x: %s\n", x, px == &x ? "si" : "no");

    return 0;
}
```

Salida:

```text
x = 5, px apunta a x: si
```

`px` sigue apuntando a `x`, porque `redirigir` recibió una copia de `px`. (La palabra `static` hace que `otro` siga existiendo después de que la función termina; la verás en detalle en la lección de duración. Si quisieras cambiar a qué apunta `px` desde una función, necesitarías pasar la dirección de `px`: un puntero a puntero, que aparece en la próxima lección.)

## Devolver varios resultados

Una función de C devuelve un solo valor con `return`. Cuando necesitas más de un resultado, la técnica habitual es recibir punteros a las variables donde la función debe dejarlos. Estos parámetros se llaman **parámetros de salida**.

```c
#include <stdio.h>

/* Devuelve 0 si b es 0 (no se puede dividir) y 1 si todo salió bien. */
int dividir(int a, int b, int *cociente, int *resto) {
    if (b == 0) {
        return 0;
    }
    *cociente = a / b;
    *resto = a % b;
    return 1;
}

int main(void) {
    int c = 0;
    int r = 0;

    if (dividir(17, 5, &c, &r)) {
        printf("17 / 5 = %d, resto %d\n", c, r);
    }
    if (!dividir(4, 0, &c, &r)) {
        printf("no se puede dividir por cero\n");
    }

    return 0;
}
```

Salida:

```text
17 / 5 = 3, resto 2
no se puede dividir por cero
```

Este patrón es muy común en C: el valor de retorno informa si la operación tuvo éxito y los resultados viajan por los parámetros puntero. Lo vas a ver en `scanf`, que devuelve cuántos datos leyó y deja los datos en las direcciones que le diste.

## `const` y punteros

Cuando una función recibe un puntero solo para **leer**, conviene declararlo `const`. Así el compilador te impide modificar el objeto por error y quien llama sabe que su dato no cambiará.

Hay dos lugares donde puede ir `const`, y significan cosas distintas:

```c
int x = 1;
int y = 2;

const int *p = &x;   /* puntero a int constante: no puedes cambiar *p */
p = &y;              /* bien: p puede apuntar a otro objeto */
/* *p = 5;              error: *p es de solo lectura */

int *const q = &x;   /* puntero constante a int: no puedes cambiar q */
*q = 5;              /* bien: puedes cambiar el objeto */
/* q = &y;              error: q siempre apunta a x */
```

Regla para leerlo: mira de qué lado del `*` está el `const`. Si está a la izquierda (`const int *`), protege el **objeto apuntado**; si está a la derecha (`int *const`), protege el **puntero**.

```c
void mostrar(const int *valor) {
    printf("%d\n", *valor);   /* leer está permitido */
}
```

## Resumen

- La memoria se puede pensar como celdas numeradas; la dirección de un objeto es la de su primer byte.
- `&x` da la dirección de `x`; `%p` la imprime, convirtiéndola con `(void *)`.
- `int *p = &x;` declara un puntero a `int` que apunta a `x`; `*p` es el objeto apuntado, para leer y escribir.
- El tipo del puntero debe coincidir con el del objeto.
- `NULL` (o `nullptr` en C23) significa "no apunta a nada": se compara, no se desreferencia.
- Desreferenciar un puntero sin inicializar o nulo es comportamiento indefinido.
- C pasa los argumentos siempre por valor; pasar una dirección permite modificar el objeto de quien llama, pero el puntero mismo llega como copia.
- Los parámetros puntero permiten devolver varios resultados.
- `const int *` protege el objeto; `int *const` protege el puntero.

## Ejercicios prácticos

### Ejercicio 1: sigue los valores

Sin ejecutarlo, completa la tabla con los valores de `a`, `b`, `*p` y `*q` después de cada línea. Luego indica qué imprime.

```c
#include <stdio.h>

int main(void) {
    int a = 10;
    int b = 20;
    int *p = &a;
    int *q = &b;

    *p = *q;
    q = p;
    *q = 5;
    printf("%d %d %d %d\n", a, b, *p, *q);

    return 0;
}
```

<details><summary>Ver solución</summary>

| Línea | `a` | `b` | `p` apunta a | `q` apunta a |
| --- | --- | --- | --- | --- |
| inicio | 10 | 20 | `a` | `b` |
| `*p = *q;` | 20 | 20 | `a` | `b` |
| `q = p;` | 20 | 20 | `a` | `a` |
| `*q = 5;` | 5 | 20 | `a` | `a` |

Imprime `5 20 5 5`. Después de `q = p;` los dos punteros apuntan a `a`, así que escribir en `*q` cambia `a`, y `b` queda en `20`.

</details>

### Ejercicio 2: encuentra el error

Este programa a veces imprime un número raro y a veces termina con un error de segmentación. Explica por qué y corrígelo.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int total;
    int *p;

    total = 0;
    *p = 7;
    total = total + *p;
    printf("%d\n", total);

    return 0;
}
```

<details><summary>Ver solución</summary>

`p` se declara sin inicializar, así que su valor es basura: `*p = 7;` escribe en una dirección cualquiera. Es comportamiento indefinido, por eso el resultado cambia entre ejecuciones (con las opciones del curso, el compilador incluso suele advertir que `p` se usa sin inicializar).

El puntero tiene que apuntar a un objeto válido antes de desreferenciarlo:

```c
#include <stdio.h>

int main(void) {
    int total = 0;
    int valor = 0;
    int *p = &valor;

    *p = 7;
    total = total + *p;
    printf("%d\n", total);

    return 0;
}
```

</details>

### Ejercicio 3: ordenar dos variables

Escribe `void ordenar_dos(int *a, int *b)` que deje en `*a` el menor y en `*b` el mayor de los dos valores. Pruébala desde `main` con `x = 9` e `y = 4`.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

void ordenar_dos(int *a, int *b) {
    if (*a > *b) {
        int aux = *a;
        *a = *b;
        *b = aux;
    }
}

int main(void) {
    int x = 9;
    int y = 4;

    ordenar_dos(&x, &y);
    printf("x = %d, y = %d\n", x, y);   /* x = 4, y = 9 */

    return 0;
}
```

La función recibe copias de las direcciones de `x` e `y`; a través de ellas modifica los objetos de `main`.

</details>

### Ejercicio 4: mínimo y máximo de un arreglo

Escribe `int min_max(const int v[], int n, int *minimo, int *maximo)` que deje en `*minimo` y `*maximo` el menor y el mayor elemento de `v`. Si `n` es menor que 1, debe devolver `0` sin tocar los resultados; si no, devuelve `1`. ¿Por qué `v` puede ser `const` y `minimo` no?

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int min_max(const int v[], int n, int *minimo, int *maximo) {
    if (n < 1) {
        return 0;
    }
    *minimo = v[0];
    *maximo = v[0];
    for (int i = 1; i < n; i++) {
        if (v[i] < *minimo) {
            *minimo = v[i];
        }
        if (v[i] > *maximo) {
            *maximo = v[i];
        }
    }
    return 1;
}

int main(void) {
    int notas[] = {7, 3, 9, 5, 8};
    int menor = 0;
    int mayor = 0;

    if (min_max(notas, 5, &menor, &mayor)) {
        printf("menor = %d, mayor = %d\n", menor, mayor);   /* 3 y 9 */
    }

    return 0;
}
```

`v` solo se lee, así que `const` documenta y garantiza que la función no lo modifica. `minimo` y `maximo` son parámetros de salida: la función escribe a través de ellos, por eso no pueden apuntar a objetos `const`.

</details>

### Ejercicio 5: ¿qué línea no compila?

Indica cuáles de las líneas marcadas producen un error de compilación y por qué.

```c
int a = 1;
int b = 2;
const int *p = &a;
int *const q = &a;

*p = 10;   /* (1) */
p = &b;    /* (2) */
*q = 10;   /* (3) */
q = &b;    /* (4) */
```

<details><summary>Ver solución</summary>

- (1) **Error:** `p` es un puntero a `int` constante; no se puede escribir a través de él.
- (2) Bien: el puntero `p` no es constante, puede apuntar a otro objeto.
- (3) Bien: `q` apunta a un `int` modificable.
- (4) **Error:** `q` es un puntero constante; siempre apunta a `a`.

</details>
