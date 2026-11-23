---
title: 'Punteros, arreglos y estructuras'
course: 'c'
slug: 'punteros-arreglos-y-estructuras'
description: 'Recorre arreglos con aritmética de punteros, accede a campos con el operador ->, y utiliza punteros dobles, punteros genéricos void * y punteros a función.'
order: 26
lang: 'es'
published: true
---

En la lección anterior un puntero apuntaba a una sola variable. Pero los punteros muestran todo su poder cuando apuntan **dentro de un arreglo**: ahí pueden moverse de un elemento al siguiente. En esta lección vas a descubrir que muchas cosas que ya usabas (los índices, las cadenas, pasar un arreglo a una función) eran punteros disfrazados.

> Idea clave: el nombre de un arreglo, en casi todas las expresiones, se convierte en un puntero a su primer elemento, y `a[i]` es solo otra forma de escribir `*(a + i)`.

## Objetivos

- Usar la aritmética de punteros: sumar, restar y comparar punteros dentro de un arreglo.
- Explicar la relación entre arreglos y punteros, y también sus diferencias.
- Pasar arreglos a funciones sabiendo que lo que viaja es un puntero, junto con la longitud.
- Distinguir qué punteros se pueden calcular y cuáles se pueden desreferenciar.
- Recorrer cadenas con un `char *`.
- Acceder a estructuras a través de punteros con `->`.
- Usar punteros dobles, punteros genéricos `void *` y punteros a funciones.

**Requisitos previos:** [Punteros y direcciones de memoria](/cursos/c/punteros-y-direcciones), [Arreglos](/cursos/c/arreglos-unidimensionales-y-multidimensionales), [Cadenas de caracteres](/cursos/c/cadenas-de-caracteres-y-operaciones), [Estructuras](/cursos/c/concepto-de-estructuras) y [Ordenación de arreglos](/cursos/c/ordenacion-de-arreglos).

## Aritmética de punteros

Los elementos de un arreglo están **contiguos** en memoria: uno pegado al otro. Si un puntero apunta a un elemento, sumarle 1 lo lleva al **siguiente elemento**, no al siguiente byte.

```c
int a[4] = {10, 20, 30, 40};
int *p = &a[0];
```

Con `sizeof(int)` igual a 4 y el arreglo empezando en la dirección `1000`:

| Expresión | Apunta a | Dirección | Valor apuntado |
| --- | --- | --- | --- |
| `p` | `a[0]` | 1000 | 10 |
| `p + 1` | `a[1]` | 1004 | 20 |
| `p + 2` | `a[2]` | 1008 | 30 |
| `p + 3` | `a[3]` | 1012 | 40 |

La regla de la **aritmética de punteros**: `p + n` avanza `n` elementos, es decir, `n * sizeof(*p)` bytes. El compilador hace la multiplicación por ti, porque conoce el tipo apuntado. Por eso el tipo del puntero importa tanto.

<svg viewBox="0 0 600 190" role="img" aria-label="Arreglo a de cuatro enteros en las direcciones 1000, 1004, 1008 y 1012; p apunta a a[0] y p + 1 apunta a a[1]" style="max-width: 100%; height: auto; font-family: var(--font-body);">
  <rect x="40" y="70" width="120" height="60" rx="14" fill="var(--color-surface)" stroke="var(--color-accent)" stroke-width="3"/>
  <rect x="170" y="70" width="120" height="60" rx="14" fill="var(--color-surface)" stroke="var(--color-accent-2)" stroke-width="3"/>
  <rect x="300" y="70" width="120" height="60" rx="14" fill="var(--color-surface)" stroke="var(--color-accent-2)" stroke-width="3"/>
  <rect x="430" y="70" width="120" height="60" rx="14" fill="var(--color-surface)" stroke="var(--color-accent-2)" stroke-width="3"/>
  <text x="100" y="108" text-anchor="middle" fill="var(--color-text)" font-size="20" font-family="monospace">10</text>
  <text x="230" y="108" text-anchor="middle" fill="var(--color-text)" font-size="20" font-family="monospace">20</text>
  <text x="360" y="108" text-anchor="middle" fill="var(--color-text)" font-size="20" font-family="monospace">30</text>
  <text x="490" y="108" text-anchor="middle" fill="var(--color-text)" font-size="20" font-family="monospace">40</text>
  <text x="100" y="155" text-anchor="middle" fill="var(--color-text)" font-size="14" font-family="monospace">1000</text>
  <text x="230" y="155" text-anchor="middle" fill="var(--color-text)" font-size="14" font-family="monospace">1004</text>
  <text x="360" y="155" text-anchor="middle" fill="var(--color-text)" font-size="14" font-family="monospace">1008</text>
  <text x="490" y="155" text-anchor="middle" fill="var(--color-text)" font-size="14" font-family="monospace">1012</text>
  <text x="100" y="30" text-anchor="middle" fill="var(--color-accent)" font-size="17" font-family="monospace">p</text>
  <path d="M100 38 L 100 62" stroke="var(--color-accent)" stroke-width="3" stroke-linecap="round"/>
  <text x="230" y="30" text-anchor="middle" fill="var(--color-text)" font-size="17" font-family="monospace">p + 1</text>
  <path d="M230 38 L 230 62" stroke="var(--color-accent-2)" stroke-width="3" stroke-linecap="round"/>
  <text x="300" y="182" text-anchor="middle" fill="var(--color-text)" font-size="14">cada paso avanza sizeof(int) bytes</text>
</svg>

Puedes comprobarlo imprimiendo las direcciones. Para medir la distancia en bytes, el programa convierte los punteros a `char *`, porque un `char` ocupa exactamente un byte:

```c
#include <stdio.h>

int main(void) {
    int a[4] = {10, 20, 30, 40};
    int *p = a;

    printf("p     = %p, *p       = %d\n", (void *)p, *p);
    printf("p + 1 = %p, *(p + 1) = %d\n", (void *)(p + 1), *(p + 1));
    printf("bytes entre p y p + 1: %td\n", (char *)(p + 1) - (char *)p);

    return 0;
}
```

Con enteros de 4 bytes, la última línea imprime `bytes entre p y p + 1: 4`. Si cambias `int` por `double`, imprimirá 8.

Las operaciones permitidas son pocas y tienen sentido solo **dentro de un mismo arreglo**:

| Operación | Ejemplo | Resultado |
| --- | --- | --- |
| puntero + entero | `p + 2` | puntero dos elementos más adelante |
| puntero − entero | `q - 1` | puntero un elemento más atrás |
| `++` y `--` | `p++` | avanza o retrocede un elemento |
| puntero − puntero | `q - p` | cantidad de elementos entre ellos |
| comparación | `p < q` | cuál está antes en el arreglo |

Sumar dos punteros no tiene sentido y no compila.

## El nombre del arreglo se convierte en puntero

Observa la línea `int *p = a;` del programa anterior: asignamos el arreglo entero a un puntero, sin `&`. Funciona porque, en casi todas las expresiones, **el nombre de un arreglo se convierte en un puntero a su primer elemento**. Se dice que el arreglo *decae* a puntero. Así, `a` en una expresión vale lo mismo que `&a[0]`.

De ahí sale la equivalencia central de esta lección:

```c
a[i]  ==  *(a + i)
```

El operador `[]` está **definido** como aritmética de punteros más desreferenciación. Por eso los índices empiezan en 0: `a[0]` es `*(a + 0)`, el primer elemento, sin desplazamiento. Y por eso también puedes usar `[]` con un puntero: si `p` apunta a `a[0]`, `p[2]` es `a[2]`.

Con esto puedes recorrer un arreglo moviendo un puntero en lugar de un índice:

```c
#include <stdio.h>

int main(void) {
    int notas[5] = {7, 4, 9, 6, 8};
    int suma = 0;

    for (int *p = notas; p < notas + 5; p++) {
        suma += *p;
    }
    printf("suma = %d\n", suma);   /* suma = 34 */

    return 0;
}
```

`notas + 5` apunta justo **después** del último elemento. El ciclo se detiene al llegarle, sin desreferenciarlo. Ese puntero especial vuelve a aparecer más abajo.

### Predice el valor

```c
int v[5] = {2, 4, 6, 8, 10};
int *p = v + 1;
int x = *p + 1;
int y = *(p + 1);
int z = p[2];
p += 3;
int w = *p;
```

Calcula `x`, `y`, `z` y `w` antes de seguir.

Respuesta: `p` empieza en `v[1]` (vale 4). `x = 4 + 1 = 5` (el `*` se aplica antes que el `+`); `y = v[2] = 6`; `z = p[2] = v[3] = 8`; después de `p += 3`, `p` apunta a `v[4]`, así que `w = 10`. Compara `*p + 1` con `*(p + 1)`: los paréntesis cambian todo.

## Arreglos y punteros no son lo mismo

Que un arreglo se convierta en puntero no significa que **sea** un puntero. Hay diferencias importantes:

```c
int a[5] = {1, 2, 3, 4, 5};
int *p = a;

sizeof a;   /* 5 * sizeof(int): por ejemplo 20, el arreglo completo */
sizeof p;   /* el tamaño de un puntero: por ejemplo 8 */
```

| | Arreglo `int a[5]` | Puntero `int *p` |
| --- | --- | --- |
| Qué es | 5 objetos `int` contiguos | una variable que guarda una dirección |
| `sizeof` | tamaño de todos los elementos | tamaño de un puntero |
| ¿Se puede asignar? | no: `a = p;` no compila | sí: `p = otra_direccion;` |
| `&` | `&a` es la dirección del arreglo entero | `&p` es la dirección de la variable puntero |

Los arreglos **no son asignables**: no puedes copiar un arreglo con `=` ni hacer que su nombre apunte a otro lado. La conversión a puntero no ocurre en tres casos: con `sizeof`, con `&` y cuando una cadena literal inicializa un arreglo de `char`.

## Pasar un arreglo a una función es pasar un puntero

Cuando escribes `promedio(notas, 5)`, el arreglo decae a puntero y lo que se copia en el parámetro es **la dirección del primer elemento**. Por eso estas dos declaraciones son exactamente equivalentes:

```c
double promedio(const int v[], size_t n);
double promedio(const int *v, size_t n);
```

Consecuencias que ya conocías sin saber por qué:

- La función puede modificar los elementos del arreglo original (si el parámetro no es `const`): tiene su dirección.
- La función **no puede saber cuántos elementos hay**: dentro de ella, `sizeof v` es el tamaño de un puntero. Por eso la longitud viaja siempre como un parámetro aparte, idealmente de tipo `size_t`.

```c
#include <stddef.h>
#include <stdio.h>

double promedio(const int *v, size_t n) {
    int suma = 0;
    for (size_t i = 0; i < n; i++) {
        suma += v[i];
    }
    return n > 0 ? (double)suma / (double)n : 0.0;
}

int main(void) {
    int notas[] = {7, 4, 9, 6, 8};
    size_t n = sizeof notas / sizeof notas[0];   /* aquí sí: notas es un arreglo */

    printf("promedio = %.2f\n", promedio(notas, n));   /* promedio = 6.80 */

    return 0;
}
```

El cálculo `sizeof notas / sizeof notas[0]` solo funciona donde se declaró el arreglo. Dentro de `promedio`, `v` ya es un puntero.

## Restar punteros: `ptrdiff_t`

Restar dos punteros que apuntan dentro del mismo arreglo da la **cantidad de elementos** que los separa. El resultado es de tipo `ptrdiff_t` (un entero con signo definido en `<stddef.h>`) y se imprime con `%td`.

```c
#include <stddef.h>
#include <stdio.h>

int main(void) {
    int v[6] = {5, 8, 3, 9, 1, 7};
    int *inicio = v;
    int *mayor = v;

    for (int *p = v + 1; p < v + 6; p++) {
        if (*p > *mayor) {
            mayor = p;
        }
    }

    ptrdiff_t posicion = mayor - inicio;
    printf("el mayor es %d, en la posicion %td\n", *mayor, posicion);

    return 0;
}
```

Imprime `el mayor es 9, en la posicion 3`. Restar punteros de **arreglos distintos** es comportamiento indefinido: el resultado no significa nada.

## Punteros fuera de rango

Desreferenciar un puntero que sale del arreglo es **comportamiento indefinido**, igual que usar un índice fuera de rango (de hecho, es lo mismo: `a[5]` es `*(a + 5)`). El estándar hace una sola excepción útil:

- Puedes **calcular** y **comparar** el puntero que apunta **una posición después del último elemento** (`a + n`). Por eso los ciclos `p < a + n` son correctos.
- **No** puedes desreferenciarlo: `*(a + n)` es comportamiento indefinido.
- Cualquier otro puntero fuera del arreglo (`a - 1`, `a + n + 1`) es comportamiento indefinido aunque solo lo calcules.

```c
int a[3] = {1, 2, 3};
int *fin = a + 3;      /* bien: una posición después del final */
int x = *fin;          /* comportamiento indefinido: no hay elemento ahí */
int *antes = a - 1;    /* comportamiento indefinido: ni siquiera se puede calcular */
```

## Cadenas y `char *`

Una cadena es un arreglo de `char` terminado en `'\0'`. Como cualquier arreglo, decae a un `char *` que apunta al primer carácter. Por eso las funciones de `<string.h>` reciben `char *` o `const char *`.

Recorrer una cadena con un puntero es muy natural: se avanza hasta encontrar el terminador.

```c
#include <stddef.h>
#include <stdio.h>

size_t mi_strlen(const char *s) {
    const char *p = s;
    while (*p != '\0') {
        p++;
    }
    return (size_t)(p - s);   /* elementos recorridos = longitud */
}

int main(void) {
    char saludo[] = "hola";
    printf("%zu\n", mi_strlen(saludo));   /* 4 */

    for (const char *c = saludo; *c != '\0'; c++) {
        printf("[%c]", *c);
    }
    printf("\n");                          /* [h][o][l][a] */

    return 0;
}
```

Hay dos formas de tener una cadena, y no son equivalentes:

```c
char palabra[] = "hola";        /* arreglo propio de 5 char: puedes modificarlo */
const char *literal = "hola";   /* puntero a una cadena literal: solo lectura */
```

Modificar una cadena literal es comportamiento indefinido. Por eso un puntero a un literal se declara `const char *`: así el compilador te frena si intentas escribir en él.

## Punteros a estructuras y el operador `->`

Las estructuras suelen ser grandes, así que en lugar de copiarlas se pasa su dirección. Con un puntero `p` a una estructura, accedes a un campo con `(*p).campo`. Los paréntesis son obligatorios, porque `.` tiene más precedencia que `*`. Como esa forma es incómoda, C ofrece el operador **flecha**:

```c
p->campo   /* es exactamente lo mismo que (*p).campo */
```

```c
#include <stdio.h>

struct Punto {
    int x;
    int y;
};

void mover(struct Punto *p, int dx, int dy) {
    p->x += dx;
    p->y += dy;
}

void mostrar(const struct Punto *p) {
    printf("(%d, %d)\n", p->x, p->y);
}

int main(void) {
    struct Punto a = {1, 2};

    mover(&a, 3, -1);
    mostrar(&a);          /* (4, 1) */

    struct Punto *pa = &a;
    (*pa).x = 0;          /* lo mismo que pa->x = 0 */
    mostrar(pa);          /* (0, 1) */

    return 0;
}
```

Regla práctica: con una **variable** estructura usas `.`; con un **puntero** a estructura usas `->`. `mostrar` recibe `const struct Punto *` porque solo lee: no copia la estructura y además promete no modificarla.

También puedes recorrer un arreglo de estructuras con un puntero:

```c
#include <stdio.h>

struct Alumno {
    char nombre[20];
    int nota;
};

int main(void) {
    struct Alumno curso[3] = {{"Ana", 8}, {"Luis", 5}, {"Sofia", 9}};

    for (struct Alumno *a = curso; a < curso + 3; a++) {
        if (a->nota >= 6) {
            printf("%s aprobo con %d\n", a->nombre, a->nota);
        }
    }

    return 0;
}
```

## Punteros dobles

Un puntero es una variable, así que tiene dirección, y esa dirección se puede guardar en otro puntero. Un `int **` es un **puntero a un puntero a `int`**.

```c
int x = 5;
int *p = &x;
int **pp = &p;

**pp = 6;   /* pp -> p -> x: cambia x */
```

| Expresión | Tipo | Valor |
| --- | --- | --- |
| `pp` | `int **` | dirección de `p` |
| `*pp` | `int *` | el valor de `p`, es decir, la dirección de `x` |
| `**pp` | `int` | el valor de `x` |

¿Para qué sirve? Para el caso que quedó pendiente en la lección anterior: una función que cambie **a qué apunta** un puntero de quien llama. Como el puntero se pasa por valor, la función necesita su dirección.

```c
#include <stddef.h>
#include <stdio.h>

/* Deja en *resultado un puntero al primer elemento igual a buscado,
   o NULL si no está. Devuelve 1 si lo encontró y 0 si no. */
int buscar(int *v, size_t n, int buscado, int **resultado) {
    for (size_t i = 0; i < n; i++) {
        if (v[i] == buscado) {
            *resultado = &v[i];
            return 1;
        }
    }
    *resultado = NULL;
    return 0;
}

int main(void) {
    int datos[] = {4, 7, 1, 7};
    int *encontrado = NULL;

    if (buscar(datos, 4, 7, &encontrado)) {
        *encontrado = 70;   /* cambia el elemento dentro del arreglo */
    }
    printf("%d %d %d %d\n", datos[0], datos[1], datos[2], datos[3]);   /* 4 70 1 7 */

    return 0;
}
```

El segundo uso típico ya lo tienes a la vista desde esta lección: `int main(int argc, char *argv[])`. `argv` es un arreglo de punteros a `char` (las palabras escritas en la línea de comandos) y, como parámetro, es un `char **`.

## `void *`: el puntero genérico

Un `void *` puede guardar la dirección de un objeto de **cualquier** tipo. A cambio, no sabe qué hay del otro lado: **no se puede desreferenciar** ni usar en aritmética de punteros. Para usar el objeto, primero hay que convertirlo al tipo correcto.

```c
int n = 42;
void *g = &n;              /* cualquier puntero a objeto se convierte a void * */

/* printf("%d", *g);         error: no se puede desreferenciar un void * */
int *pi = g;               /* de vuelta a int *: conversión implícita válida en C */
printf("%d\n", *pi);       /* 42 */
printf("%d\n", *(int *)g); /* lo mismo, con una conversión explícita */
```

Ya lo usaste con `%p`, que recibe un `void *`. Su utilidad real son las funciones genéricas, que trabajan con datos sin conocer su tipo. Este intercambio funciona con cualquier tipo porque copia byte por byte, usando `unsigned char *`:

```c
#include <stddef.h>
#include <stdio.h>

void intercambiar_bytes(void *a, void *b, size_t tamanio) {
    unsigned char *x = a;
    unsigned char *y = b;
    for (size_t i = 0; i < tamanio; i++) {
        unsigned char aux = x[i];
        x[i] = y[i];
        y[i] = aux;
    }
}

int main(void) {
    double d1 = 1.5;
    double d2 = 2.5;
    intercambiar_bytes(&d1, &d2, sizeof d1);
    printf("%.1f %.1f\n", d1, d2);   /* 2.5 1.5 */

    return 0;
}
```

Con un `void *` la responsabilidad de usar el tipo correcto pasa a ser tuya: el compilador ya no puede verificarlo.

## Punteros a funciones

Las funciones también tienen dirección, y se puede guardar en un **puntero a función**. La declaración se lee así:

```c
int (*operacion)(int, int);   /* operacion es un puntero a una función
                                 que recibe dos int y devuelve int */
```

Los paréntesis en `(*operacion)` son imprescindibles: sin ellos, `int *operacion(int, int);` declara una función que devuelve `int *`.

Con un puntero a función, el programa puede **elegir en tiempo de ejecución** qué función llamar:

```c
#include <stdio.h>

int sumar(int a, int b) { return a + b; }
int restar(int a, int b) { return a - b; }
int multiplicar(int a, int b) { return a * b; }

int aplicar(int (*f)(int, int), int a, int b) {
    return f(a, b);   /* también vale (*f)(a, b) */
}

int main(void) {
    int (*operaciones[3])(int, int) = {sumar, restar, multiplicar};
    const char *nombres[3] = {"suma", "resta", "producto"};

    for (int i = 0; i < 3; i++) {
        printf("%s: %d\n", nombres[i], aplicar(operaciones[i], 6, 3));
    }

    return 0;
}
```

Salida:

```text
suma: 9
resta: 3
producto: 18
```

Igual que un arreglo, el nombre de una función se convierte en un puntero a ella: por eso `sumar` aparece sin `&` en la inicialización.

### `qsort`: ordenar con una función comparadora

La biblioteca estándar combina las dos últimas ideas en `qsort` (de `<stdlib.h>`): ordena un arreglo de **cualquier tipo** (lo recibe como `void *`) y, para saber qué elemento va antes, llama a una **función comparadora** que tú le pasas por puntero. La comparadora recibe dos `const void *`, los convierte al tipo real y devuelve un número negativo, cero o positivo.

```c
#include <stdio.h>
#include <stdlib.h>

int comparar_enteros(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);   /* -1, 0 o 1 sin riesgo de desbordamiento */
}

int main(void) {
    int v[] = {42, 7, 19, 3, 25};
    size_t n = sizeof v / sizeof v[0];

    qsort(v, n, sizeof v[0], comparar_enteros);

    for (size_t i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");   /* 3 7 19 25 42 */

    return 0;
}
```

En la lección de ordenación escribiste tus propios algoritmos; `qsort` es la versión de la biblioteca, que sirve para cualquier tipo gracias a `void *` y a los punteros a funciones.

> **Portabilidad:** el estándar no obliga a que `qsort` use un algoritmo concreto ni a que sea estable (elementos iguales pueden cambiar de orden entre sí). Si necesitas estabilidad, debes garantizarla tú, por ejemplo agregando un segundo criterio a la comparadora.

## Resumen

- `p + n` avanza `n` elementos (`n * sizeof(*p)` bytes): eso es la aritmética de punteros.
- El nombre de un arreglo decae a un puntero a su primer elemento; `a[i]` es `*(a + i)`.
- Arreglos y punteros difieren en `sizeof`, en asignación y en `&`.
- Pasar un arreglo a una función pasa un puntero: la longitud viaja aparte, como `size_t`.
- Restar punteros del mismo arreglo da un `ptrdiff_t` (`%td`).
- Calcular el puntero una posición después del final está permitido; desreferenciarlo, no. Salir del arreglo es comportamiento indefinido.
- Una cadena se recorre con un `char *` hasta `'\0'`; las cadenas literales son de solo lectura.
- `p->campo` equivale a `(*p).campo`.
- `int **` permite que una función cambie a qué apunta un puntero de quien llama.
- `void *` guarda cualquier dirección pero no se desreferencia sin convertirlo.
- Los punteros a funciones permiten elegir qué función llamar, como hace `qsort` con su comparadora.

## Ejercicios prácticos

### Ejercicio 1: sigue los punteros

Sin ejecutarlo, indica qué imprime el programa. Supón que `v` empieza en la dirección `2000` y que `sizeof(int)` vale 4: ¿qué dirección guarda `q` al final?

```c
#include <stdio.h>

int main(void) {
    int v[5] = {3, 6, 9, 12, 15};
    int *p = v;
    int *q = v + 4;

    p++;
    *p = *p + *q;
    q -= 2;
    printf("%d %d %d %td\n", v[1], *q, q[1], q - p);

    return 0;
}
```

<details><summary>Ver solución</summary>

- `p++` deja a `p` apuntando a `v[1]`.
- `*p = *p + *q` hace `v[1] = 6 + 15 = 21`.
- `q -= 2` lleva a `q` de `v[4]` a `v[2]`, dirección `2000 + 2 * 4 = 2008`.
- `*q` es `v[2] = 9`; `q[1]` es `v[3] = 12`; `q - p` es `2 - 1 = 1` elemento.

Imprime `21 9 12 1`.

</details>

### Ejercicio 2: encuentra el error

Esta función debería devolver el último elemento del arreglo, pero a veces devuelve basura. ¿Qué está mal?

```c
int ultimo(const int *v, size_t n) {
    const int *fin = v + n;
    return *fin;
}
```

<details><summary>Ver solución</summary>

`v + n` es el puntero **una posición después** del último elemento. Calcularlo está permitido, pero desreferenciarlo es comportamiento indefinido: ahí no hay ningún elemento del arreglo. El último elemento está en `v + n - 1`. Además, si `n` es 0 no hay último elemento, así que conviene exigir `n > 0`:

```c
#include <stddef.h>
#include <stdio.h>

int ultimo(const int *v, size_t n) {
    return *(v + n - 1);   /* requiere n > 0 */
}

int main(void) {
    int datos[] = {4, 8, 15};
    printf("%d\n", ultimo(datos, 3));   /* 15 */

    return 0;
}
```

</details>

### Ejercicio 3: contar un carácter con punteros

Escribe `size_t contar(const char *s, char c)` que cuente cuántas veces aparece `c` en la cadena `s`, recorriéndola con un puntero y **sin usar índices ni `strlen`**.

<details><summary>Ver solución</summary>

```c
#include <stddef.h>
#include <stdio.h>

size_t contar(const char *s, char c) {
    size_t veces = 0;
    for (const char *p = s; *p != '\0'; p++) {
        if (*p == c) {
            veces++;
        }
    }
    return veces;
}

int main(void) {
    printf("%zu\n", contar("banana", 'a'));   /* 3 */

    return 0;
}
```

</details>

### Ejercicio 4: el alumno con mejor nota

Con la estructura `struct Alumno { char nombre[20]; int nota; };`, escribe `const struct Alumno *mejor(const struct Alumno *v, size_t n)` que devuelva un puntero al alumno con la nota más alta (o `NULL` si `n` es 0). Imprime su nombre desde `main` usando `->`.

<details><summary>Ver solución</summary>

```c
#include <stddef.h>
#include <stdio.h>

struct Alumno {
    char nombre[20];
    int nota;
};

const struct Alumno *mejor(const struct Alumno *v, size_t n) {
    if (n == 0) {
        return NULL;
    }
    const struct Alumno *m = v;
    for (const struct Alumno *a = v + 1; a < v + n; a++) {
        if (a->nota > m->nota) {
            m = a;
        }
    }
    return m;
}

int main(void) {
    struct Alumno curso[] = {{"Ana", 8}, {"Luis", 5}, {"Sofia", 9}};
    const struct Alumno *m = mejor(curso, 3);

    if (m != NULL) {
        printf("%s (%d)\n", m->nombre, m->nota);   /* Sofia (9) */
    }

    return 0;
}
```

Devolver un puntero a un elemento del arreglo es seguro porque el arreglo sigue existiendo en `main`. La función no copia ninguna estructura.

</details>

### Ejercicio 5: avanzar un puntero desde una función

Escribe `void saltar_espacios(const char **s)` que avance el puntero de quien llama hasta el primer carácter que no sea un espacio. Por ejemplo, si `texto` apunta a `"   hola"`, después de `saltar_espacios(&texto)` debe apuntar a `"hola"`. ¿Por qué el parámetro tiene que ser `const char **` y no `const char *`?

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

void saltar_espacios(const char **s) {
    while (**s == ' ') {
        (*s)++;   /* avanza el puntero de quien llama */
    }
}

int main(void) {
    const char *texto = "   hola";

    saltar_espacios(&texto);
    printf("[%s]\n", texto);   /* [hola] */

    return 0;
}
```

La función tiene que cambiar **el valor del puntero** `texto` de `main`. Si recibiera un `const char *`, recibiría una copia y avanzaría solo la copia. Recibiendo la dirección de `texto` (`const char **`), `*s` es el propio `texto` y `(*s)++` lo mueve. Los paréntesis importan: `*s++` avanzaría `s`, no `*s`.

</details>

### Ejercicio 6: elegir la operación

Usando un puntero a función, escribe `void aplicar_a_todos(int *v, size_t n, int (*f)(int))` que reemplace cada elemento por `f(elemento)`. Pruébala con una función `doble` y otra `cuadrado`.

<details><summary>Ver solución</summary>

```c
#include <stddef.h>
#include <stdio.h>

int doble(int x) { return 2 * x; }
int cuadrado(int x) { return x * x; }

void aplicar_a_todos(int *v, size_t n, int (*f)(int)) {
    for (int *p = v; p < v + n; p++) {
        *p = f(*p);
    }
}

void mostrar(const int *v, size_t n) {
    for (size_t i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");
}

int main(void) {
    int v[] = {1, 2, 3, 4};

    aplicar_a_todos(v, 4, doble);
    mostrar(v, 4);            /* 2 4 6 8 */
    aplicar_a_todos(v, 4, cuadrado);
    mostrar(v, 4);            /* 4 16 36 64 */

    return 0;
}
```

</details>
