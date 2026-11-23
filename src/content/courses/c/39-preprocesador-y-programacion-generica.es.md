---
title: 'Preprocesador y programación genérica'
course: 'c'
slug: 'preprocesador-y-programacion-generica'
description: 'Domina macros parametrizadas y variádicas sin trampas de doble evaluación, funciones static inline y selección por tipo en compilación con _Generic.'
order: 39
lang: 'es'
published: true
---

> **Ruta opcional de profundización.** Esta lección pertenece al módulo avanzado *C moderno y C23*. No es un requisito para el resto del curso; tómala cuando quieras escribir código reutilizable para varios tipos o entender las macros que encuentras en bibliotecas reales.

En `compilacion-y-enlazado` viste que el **preprocesador** trabaja antes que el compilador: copia los `#include`, reemplaza las macros y elige qué partes del código se compilan. Hasta ahora lo usaste para constantes y guardas de inclusión. Aquí aprendes a usarlo bien, a reconocer sus trampas y a combinarlo con otras herramientas del lenguaje para escribir código **genérico**: código que sirve para varios tipos sin copiarlo a mano.

## Objetivos

- Escribir macros con parámetros sin caer en las trampas de paréntesis, doble evaluación y sentencias múltiples.
- Usar los operadores `#` (convertir en cadena) y `##` (pegar tokens).
- Escribir macros variádicas con `__VA_ARGS__` y `__VA_OPT__`.
- Usar la compilación condicional para adaptar el código al estándar y a la plataforma.
- Elegir entre una función `inline` y una macro.
- Escribir funciones genéricas por tipo con `_Generic`.
- Comparar dos formas de hacer contenedores genéricos: `void *` con tamaño y callbacks, o código tipado generado por macros.

**Requisitos previos:** `compilacion-y-enlazado`, `modularizacion-subprogramas-y-funciones`, `punteros-arreglos-y-estructuras` (punteros a función y `qsort`), `memoria-dinamica` y `c23-moderno`.

## Qué es una macro

Una **macro** es un nombre que el preprocesador reemplaza por un texto antes de compilar. Hay dos clases:

```c
#define CAPACIDAD 100               // macro tipo objeto
#define CUADRADO(x) ((x) * (x))     // macro tipo función
```

La clave para entenderlas es esta: **el preprocesador no conoce C**. No sabe de tipos, ni de precedencia, ni de cuántas veces se evalúa algo. Solo reemplaza tokens. Puedes ver el resultado con `gcc -E programa.c` (o `cc -E`), como hiciste en `compilacion-y-enlazado`.

## Las tres trampas de las macros

### Trampa 1: los paréntesis

<!-- c-check: skip -->
```c
#include <stdio.h>

#define CUADRADO_MAL(x) x * x
#define DOBLE_MAL(x) (x) + (x)

int main(void) {
    printf("%d\n", CUADRADO_MAL(2 + 1)); // se expande a 2 + 1 * 2 + 1 = 5, no 9
    printf("%d\n", 10 * DOBLE_MAL(3));   // se expande a 10 * (3) + (3) = 33, no 60
    return 0;
}
```

La regla: **pon entre paréntesis cada parámetro y la expresión completa**: `#define CUADRADO(x) ((x) * (x))`.

### Trampa 2: la doble evaluación

Aunque tenga todos sus paréntesis, una macro copia el argumento tantas veces como aparece. Si el argumento tiene un efecto secundario, ese efecto ocurre varias veces:

```c
#include <stdio.h>

#define MAXIMO(a, b) ((a) > (b) ? (a) : (b))

int main(void) {
    int i = 5;
    int j = 3;
    int m = MAXIMO(i++, j); // ((i++) > (j) ? (i++) : (j))
    printf("m = %d, i = %d\n", m, i);
    return 0;
}
```

Imprime `m = 6, i = 7`: `i` se incrementó **dos veces**. Con `CUADRADO(i++)` sería peor: `((i++) * (i++))` modifica `i` dos veces sin un punto de secuencia entre ellas, y eso es **comportamiento indefinido**. La regla: no pases a una macro argumentos con efectos secundarios (`++`, asignaciones, llamadas a funciones que cambian algo). Mejor aún: si puedes, usa una función.

### Trampa 3: varias sentencias

Una macro que expande a varias sentencias se rompe dentro de un `if` sin llaves:

<!-- c-check: skip -->
```c
#define INTERCAMBIAR_MAL(a, b) int t = a; a = b; b = t;

if (x > y)
    INTERCAMBIAR_MAL(x, y)   // solo "int t = x;" queda dentro del if
```

La solución estándar es envolver el cuerpo en `do { ... } while (0)`: es **una sola sentencia**, se ejecuta exactamente una vez, crea un bloque propio para las variables auxiliares y exige el `;` al usarla, como una llamada a función:

```c
#include <stdio.h>

#define INTERCAMBIAR_INT(a, b) \
    do {                       \
        int tmp_ = (a);        \
        (a) = (b);             \
        (b) = tmp_;            \
    } while (0)

int main(void) {
    int x = 8;
    int y = 3;
    if (x > y)
        INTERCAMBIAR_INT(x, y);
    else
        puts("ya estaban en orden");
    printf("%d %d\n", x, y);
    return 0;
}
```

La barra invertida `\` al final de cada línea continúa la macro en la línea siguiente.

## `#` y `##`: cadenas y pegado de tokens

Dentro de una macro con parámetros, `#parametro` convierte el argumento en una **cadena literal**, y `a ## b` **pega** dos tokens en uno:

```c
#include <stdio.h>

#define MOSTRAR_INT(expr) printf(#expr " = %d\n", (expr))
#define CAMPO(n) campo_ ## n

int main(void) {
    int ancho = 4;
    int alto = 3;
    MOSTRAR_INT(ancho * alto); // imprime: ancho * alto = 12

    int CAMPO(1) = 10; // declara campo_1
    int CAMPO(2) = 20; // declara campo_2
    printf("%d\n", campo_1 + campo_2);
    return 0;
}
```

Así funciona `assert` por dentro: muestra el texto de la condición que falló usando `#`.

Un detalle: `#` convierte el argumento **sin expandirlo**. Para convertir en cadena el **valor** de otra macro hace falta un segundo nivel:

```c
#include <stdio.h>

#define CADENA(x) #x
#define CADENA_EXPANDIDA(x) CADENA(x)
#define VERSION 3

int main(void) {
    puts(CADENA(VERSION));          // VERSION
    puts(CADENA_EXPANDIDA(VERSION)); // 3
    return 0;
}
```

## Macros variádicas: `__VA_ARGS__` y `__VA_OPT__`

Una macro con `...` en sus parámetros acepta cualquier cantidad de argumentos; dentro, `__VA_ARGS__` representa esos argumentos (desde C99). El uso clásico es una macro de registro que agrega información a cada mensaje:

<!-- c-check: skip -->
```c
#define REGISTRAR(fmt, ...) fprintf(stderr, "[%s:%d] " fmt "\n", __FILE__, __LINE__, __VA_ARGS__)

REGISTRAR("valor = %d", x); // bien
REGISTRAR("inicio");        // error: queda una coma suelta antes del )
```

Si no pasas argumentos variables, la expansión termina en `..., __LINE__, )`, que no compila. C23 resuelve esto con **`__VA_OPT__(contenido)`**, que se expande a `contenido` solo si hay argumentos variables:

```c
#include <stdio.h>

#define REGISTRAR(fmt, ...) \
    fprintf(stderr, "[%s:%d] " fmt "\n", __FILE__, __LINE__ __VA_OPT__(,) __VA_ARGS__)

int main(void) {
    int intentos = 3;
    REGISTRAR("inicio");
    REGISTRAR("intentos = %d", intentos);
    return 0;
}
```

> **C básico:** en C99 a C17 la forma portable era exigir al menos un argumento después de `fmt`, o meter el formato dentro de `...`. GCC y Clang ofrecían `, ## __VA_ARGS__` para borrar la coma, pero es una **extensión**.

> **C moderno (C23):** `__VA_OPT__` es estándar en C23 (y ya existía en C++20).

## Compilación condicional y comprobación de características

Las directivas `#if`, `#ifdef`, `#ifndef`, `#elif`, `#else` y `#endif` eligen qué código llega al compilador. Ya las usaste en las guardas de inclusión. También sirven para adaptar el programa al estándar o a la plataforma:

```c
#include <stdio.h>

#if __STDC_VERSION__ >= 202311L
    #define PUNTERO_NULO nullptr
#else
    #define PUNTERO_NULO NULL
#endif

#if defined(__has_include)
    #if __has_include(<threads.h>)
        #define TIENE_THREADS_H 1
    #endif
#endif

int main(void) {
    int *p = PUNTERO_NULO;
    printf("p es nulo: %d\n", p == PUNTERO_NULO);
#ifdef TIENE_THREADS_H
    puts("<threads.h> disponible");
#else
    puts("<threads.h> no disponible");
#endif
    return 0;
}
```

- `__has_include(<archivo>)` vale 1 si el encabezado existe. Es **estándar** en C23; antes era una extensión de GCC y Clang (por eso se comprueba con `defined(__has_include)`).
- `__STDC_VERSION__` dice qué estándar está activo (lo viste en `c23-moderno`).
- Las macros `__STDC_NO_THREADS__`, `__STDC_NO_ATOMICS__` y `__STDC_NO_VLA__` anuncian partes opcionales que faltan.
- Para una plataforma concreta, los compiladores definen macros como `_WIN32`, `__linux__` o `__APPLE__` (no son del estándar, pero son una convención muy extendida).

> **C moderno (C23):** C23 agrega `#elifdef` y `#elifndef` (abreviaturas de `#elif defined(...)`), y `#warning "mensaje"`, que muestra una advertencia sin detener la compilación.

Usa la compilación condicional con mesura: cada rama es código que solo se compila en algunas máquinas, y un error en ella puede pasar inadvertido. Concentra las diferencias de plataforma en un solo archivo.

## `inline` o macro

Una macro tipo función evita el costo de una llamada, pero tiene todas las trampas que viste. Desde C99, una función **`inline`** le sugiere al compilador que reemplace la llamada por el cuerpo, y conserva todo lo bueno de una función: tipos verificados, cada argumento evaluado una sola vez, se puede depurar.

```c
#include <stdio.h>

static inline int maximo(int a, int b) {
    return a > b ? a : b;
}

int main(void) {
    int i = 5;
    int m = maximo(i++, 3); // i++ se evalúa una sola vez
    printf("m = %d, i = %d\n", m, i);
    return 0;
}
```

Imprime `m = 5, i = 6`, lo esperable. Dos detalles:

- `inline` es una **sugerencia**: con optimización (`-O2`), los compiladores deciden por su cuenta qué funciones expandir, con o sin `inline`.
- En C, una función `inline` sin `static` definida en un encabezado tiene reglas de enlace sutiles: si el compilador decide no expandirla, el enlazador busca una definición externa que no existe y falla con *undefined symbol*. La forma simple y segura es **`static inline`** en el encabezado.

¿Cuándo sigue haciendo falta una macro? Cuando necesitas algo que una función no puede hacer: usar `#` o `##`, conocer `__FILE__` y `__LINE__` del lugar de la llamada, recibir un **tipo** como argumento o trabajar con cualquier tipo. Para todo lo demás, prefiere una función.

## `_Generic`: una función para varios tipos

C no tiene sobrecarga de funciones: no puede haber dos funciones `valor_absoluto`, una para `int` y otra para `double`. C11 agregó **`_Generic`**, una selección **en tiempo de compilación** según el tipo de una expresión:

```c
_Generic(expresion, tipo1: resultado1, tipo2: resultado2, default: resultado_por_defecto)
```

El compilador mira el tipo de `expresion` (sin evaluarla) y se queda con el resultado de la rama que coincide. Combinado con una macro, permite una **interfaz genérica por tipo**:

```c
#include <stdio.h>
#include <stdlib.h>
#include <math.h>

#define VALOR_ABSOLUTO(x) _Generic((x), \
    int: abs,                           \
    long: labs,                         \
    double: fabs                        \
)(x)

#define FORMATO(x) _Generic((x), \
    int: "%d",                   \
    long: "%ld",                 \
    double: "%g",                \
    char *: "%s",                \
    const char *: "%s"           \
)

#define IMPRIMIR(x) (printf(FORMATO(x), (x)), putchar('\n'))

int main(void) {
    IMPRIMIR(VALOR_ABSOLUTO(-4));
    IMPRIMIR(VALOR_ABSOLUTO(-7L));
    IMPRIMIR(VALOR_ABSOLUTO(-2.5));
    IMPRIMIR("hola");
    return 0;
}
```

Imprime `4`, `7`, `2.5` y `hola`. `VALOR_ABSOLUTO` elige **la función** (`abs`, `labs` o `fabs`) y luego la llama con `(x)`. Así está hecho `<tgmath.h>`, el encabezado estándar de matemática genérica por tipo.

Reglas que conviene saber:

- La expresión de control **no se evalúa**; solo importa su tipo. Por eso en `VALOR_ABSOLUTO`, aunque `x` aparece dos veces, se evalúa una sola vez: en la llamada `(x)`.
- El tipo se toma después de la conversión de lvalor: `const int` cuenta como `int`, y un arreglo como puntero (la cadena `"hola"` es `char *`).
- Si ningún tipo coincide y no hay `default`, es un error de compilación: una buena forma de rechazar tipos no previstos.
- `char`, `signed char` y `unsigned char` son tres tipos distintos, igual que `int` y `long`.

## Contenedores genéricos: dos estrategias

Imagina un **vector dinámico** (un arreglo que crece) que sirva para cualquier tipo. En C hay dos formas clásicas de escribirlo.

### Estrategia 1: `void *`, tamaño del elemento y callbacks

Es la estrategia de `qsort`, que viste en `punteros-arreglos-y-estructuras`: el contenedor guarda **bytes** sin saber qué son. Para eso necesita tres cosas: un `void *` a los datos, el **tamaño de cada elemento** y, para las operaciones que dependen del tipo (comparar, imprimir), **funciones callback** que le pasa el usuario.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    void *datos;
    size_t tam_elemento;
    size_t cantidad;
    size_t capacidad;
} Vector;

// Propiedad: el llamador es dueño del vector y lo libera con vector_destruir.
bool vector_iniciar(Vector *v, size_t tam_elemento) {
    v->tam_elemento = tam_elemento;
    v->cantidad = 0;
    v->capacidad = 4;
    v->datos = malloc(v->capacidad * tam_elemento);
    return v->datos != NULL;
}

// Copia tam_elemento bytes desde elemento al final del vector.
bool vector_agregar(Vector *v, const void *elemento) {
    if (v->cantidad == v->capacidad) {
        size_t nueva = v->capacidad * 2;
        void *otro = realloc(v->datos, nueva * v->tam_elemento);
        if (otro == NULL) {
            return false; // el vector original sigue intacto
        }
        v->datos = otro;
        v->capacidad = nueva;
    }
    char *destino = (char *)v->datos + v->cantidad * v->tam_elemento;
    memcpy(destino, elemento, v->tam_elemento);
    v->cantidad++;
    return true;
}

void *vector_en(const Vector *v, size_t i) {
    return (char *)v->datos + i * v->tam_elemento;
}

void vector_para_cada(const Vector *v, void (*accion)(const void *)) {
    for (size_t i = 0; i < v->cantidad; i++) {
        accion(vector_en(v, i));
    }
}

void vector_destruir(Vector *v) {
    free(v->datos);
    v->datos = NULL;
    v->cantidad = 0;
    v->capacidad = 0;
}

void imprimir_double(const void *p) {
    printf("%.1f ", *(const double *)p);
}

int main(void) {
    Vector v;
    if (!vector_iniciar(&v, sizeof(double))) {
        return 1;
    }
    for (int i = 1; i <= 6; i++) {
        double x = i * 1.5;
        if (!vector_agregar(&v, &x)) {
            vector_destruir(&v);
            return 1;
        }
    }
    vector_para_cada(&v, imprimir_double);
    putchar('\n');
    vector_destruir(&v);
    return 0;
}
```

La aritmética se hace con `char *` porque un `char` ocupa exactamente un byte: `(char *)v->datos + i * tam_elemento` es la dirección del elemento `i`.

**Ventajas:** un solo código compilado para todos los tipos; funciona en cualquier versión de C. **Desventajas:** el compilador **no verifica tipos** (si agregas un `int` a un vector de `double`, nadie avisa), cada acceso necesita una conversión, y las llamadas a través de punteros a función son más difíciles de optimizar.

### Estrategia 2: código tipado generado por macros

La otra estrategia es usar el preprocesador como una **plantilla**: una macro que, para cada tipo, genera la estructura y sus funciones con nombres propios gracias a `##`.

```c
#include <stdio.h>
#include <stdlib.h>

#define DEFINIR_PILA(T, NOMBRE)                                   \
    typedef struct {                                              \
        T *datos;                                                 \
        size_t cantidad;                                          \
        size_t capacidad;                                         \
    } NOMBRE;                                                     \
                                                                  \
    static inline bool NOMBRE##_apilar(NOMBRE *p, T valor) {      \
        if (p->cantidad == p->capacidad) {                        \
            size_t nueva = p->capacidad == 0 ? 4 : p->capacidad * 2; \
            T *otro = realloc(p->datos, nueva * sizeof(T));       \
            if (otro == NULL) {                                   \
                return false;                                     \
            }                                                     \
            p->datos = otro;                                      \
            p->capacidad = nueva;                                 \
        }                                                         \
        p->datos[p->cantidad++] = valor;                          \
        return true;                                              \
    }                                                             \
                                                                  \
    static inline T NOMBRE##_desapilar(NOMBRE *p) {               \
        return p->datos[--p->cantidad];                           \
    }                                                             \
                                                                  \
    static inline void NOMBRE##_liberar(NOMBRE *p) {              \
        free(p->datos);                                           \
        p->datos = NULL;                                          \
        p->cantidad = 0;                                          \
        p->capacidad = 0;                                         \
    }

DEFINIR_PILA(int, PilaInt)
DEFINIR_PILA(double, PilaDouble)

int main(void) {
    PilaInt enteros = {};
    PilaDouble reales = {};
    for (int i = 1; i <= 5; i++) {
        if (!PilaInt_apilar(&enteros, i) || !PilaDouble_apilar(&reales, i / 2.0)) {
            PilaInt_liberar(&enteros);
            PilaDouble_liberar(&reales);
            return 1;
        }
    }
    while (enteros.cantidad > 0) {
        printf("%d ", PilaInt_desapilar(&enteros));
    }
    putchar('\n');
    printf("tope real: %.1f\n", PilaDouble_desapilar(&reales));
    PilaInt_liberar(&enteros);
    PilaDouble_liberar(&reales);
    return 0;
}
```

`DEFINIR_PILA(int, PilaInt)` genera el tipo `PilaInt` y las funciones `PilaInt_apilar`, `PilaInt_desapilar` y `PilaInt_liberar`, todas con `int` de verdad.

**Ventajas:** el compilador **verifica los tipos** (apilar un `char *` en una `PilaInt` es un error), no hay conversiones ni callbacks, y el código es tan rápido como uno escrito a mano. **Desventajas:** un código compilado por cada tipo, los errores de compilación señalan la línea de la macro y no la del problema, y la macro es difícil de leer y de depurar.

| | `void *` + tamaño + callbacks | Macros que generan código |
| --- | --- | --- |
| Verificación de tipos | no | sí |
| Código compilado | uno para todos los tipos | uno por tipo |
| Facilidad de depuración | buena | mala |
| Rendimiento | llamadas indirectas | igual que código escrito a mano |
| Ejemplo en la biblioteca | `qsort`, `bsearch` | `<tgmath.h>` (con `_Generic`) |

Ninguna es siempre mejor. Para una biblioteca pequeña y clara suele bastar `void *`; cuando el rendimiento o la seguridad de tipos importan mucho, se prefiere la generación por macros.

## `typeof` en macros

Con `typeof` (estándar en C23, lo viste en `c23-moderno`) una macro puede declarar variables **del tipo de su argumento**. Eso resuelve el intercambio genérico:

```c
#include <stdio.h>

#define INTERCAMBIAR(a, b)      \
    do {                        \
        typeof(a) tmp_ = (a);   \
        (a) = (b);              \
        (b) = tmp_;             \
    } while (0)

int main(void) {
    int x = 1;
    int y = 2;
    double p = 1.5;
    double q = 2.5;
    INTERCAMBIAR(x, y);
    INTERCAMBIAR(p, q);
    printf("%d %d %.1f %.1f\n", x, y, p, q);
    return 0;
}
```

Para un `MAXIMO` que evalúe cada argumento una sola vez, habría que guardar cada argumento en una variable `typeof` y devolver un valor desde un bloque; eso requiere las *expresiones-sentencia* `({ ... })`, que son una **extensión** de GCC y Clang, no C estándar. En C estándar, la respuesta es una función `static inline` por tipo, elegida con `_Generic`.

> **Portabilidad:** antes de C23, `typeof` era una extensión (`__typeof__` en GCC y Clang). Si tu código debe compilar con C17, usa `__typeof__` sabiendo que no es estándar, o evita `typeof`.

## Errores comunes

- Olvidar los paréntesis en los parámetros o en el cuerpo de una macro.
- Pasar `i++` o una llamada con efectos a una macro que repite su argumento.
- Escribir macros de varias sentencias sin `do { } while (0)`.
- Poner `;` al final de la definición de una macro: la sentencia que la usa termina con `;;` o rompe un `if`/`else`.
- Usar `inline` sin `static` en un encabezado y recibir un error del enlazador.
- Creer que `_Generic` evalúa su expresión de control, o esperar que distinga `const int` de `int`.
- Usar `({ ... })` o `, ## __VA_ARGS__` creyendo que son estándar.

## Resumen

- Una macro reemplaza texto: paréntesis en todo, cuidado con la doble evaluación y `do { } while (0)` para varias sentencias.
- `#` convierte un argumento en cadena; `##` pega tokens.
- `__VA_ARGS__` recibe argumentos variables; `__VA_OPT__` (C23) agrega texto solo si los hay.
- `#if`, `__has_include` y `__STDC_VERSION__` adaptan el código al estándar y la plataforma.
- Prefiere `static inline` a una macro siempre que una función alcance.
- `_Generic` elige una expresión según el tipo, en tiempo de compilación.
- Contenedores genéricos: `void *` + tamaño + callbacks (simple, sin verificación de tipos) o código generado por macros (tipado, más difícil de mantener).

## Ejercicios prácticos

### Ejercicio 1: arregla la macro

¿Qué imprime este código? Corrige la macro.

<!-- c-check: skip -->
```c
#define PROMEDIO(a, b) a + b / 2

printf("%d\n", PROMEDIO(4, 8));
```

<details><summary>Ver solución</summary>

Imprime `8`, no `6`: se expande a `4 + 8 / 2`, y la división se hace antes que la suma. La versión correcta pone paréntesis en cada parámetro y en la expresión completa:

```c
#define PROMEDIO(a, b) (((a) + (b)) / 2)
```

</details>

### Ejercicio 2: una macro de verificación

Escribe una macro `VERIFICAR(cond)` que, si `cond` es falsa, imprima en `stderr` el texto de la condición, el archivo y la línea, y termine el programa con `EXIT_FAILURE`. Debe poder usarse en un `if` sin llaves.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>
#include <stdlib.h>

#define VERIFICAR(cond)                                            \
    do {                                                           \
        if (!(cond)) {                                             \
            fprintf(stderr, "%s:%d: falló la verificación: %s\n",  \
                    __FILE__, __LINE__, #cond);                    \
            exit(EXIT_FAILURE);                                    \
        }                                                          \
    } while (0)

int main(void) {
    int divisor = 4;
    if (divisor != 0)
        VERIFICAR(divisor > 0);
    else
        puts("divisor nulo");
    printf("%d\n", 100 / divisor);
    return 0;
}
```

`#cond` convierte la condición en cadena; `do { } while (0)` la hace segura dentro del `if`.

</details>

### Ejercicio 3: `_Generic` para nombres de tipo

Escribe una macro `NOMBRE_TIPO(x)` que devuelva la cadena `"int"`, `"double"`, `"char *"` u `"otro"` según el tipo de `x`. ¿Qué devuelve con `'a'`? ¿Y con `3.0f`?

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

#define NOMBRE_TIPO(x) _Generic((x), \
    int: "int",                      \
    double: "double",                \
    char *: "char *",                \
    default: "otro"                  \
)

int main(void) {
    printf("%s\n", NOMBRE_TIPO(42));
    printf("%s\n", NOMBRE_TIPO(2.5));
    printf("%s\n", NOMBRE_TIPO("hola"));
    printf("%s\n", NOMBRE_TIPO('a'));
    printf("%s\n", NOMBRE_TIPO(3.0f));
    return 0;
}
```

`'a'` devuelve `"int"`: en C, una constante de carácter tiene tipo `int`. `3.0f` es `float`, que no tiene rama, así que devuelve `"otro"`.

</details>

### Ejercicio 4: busca con callbacks

Agrega al `Vector` genérico de la lección una función `size_t vector_buscar(const Vector *v, const void *clave, int (*comparar)(const void *, const void *))` que devuelva el índice del primer elemento igual a `clave` (cuando `comparar` devuelve 0), o `v->cantidad` si no lo encuentra. Escribe la comparadora para `double`.

<details><summary>Ver solución</summary>

```c
size_t vector_buscar(const Vector *v, const void *clave,
                     int (*comparar)(const void *, const void *)) {
    for (size_t i = 0; i < v->cantidad; i++) {
        if (comparar(vector_en(v, i), clave) == 0) {
            return i;
        }
    }
    return v->cantidad;
}

int comparar_double(const void *a, const void *b) {
    double x = *(const double *)a;
    double y = *(const double *)b;
    return (x > y) - (x < y);
}
```

Uso: `double clave = 4.5; size_t i = vector_buscar(&v, &clave, comparar_double);`. La comparadora sigue la misma convención que la de `qsort`, así que puedes reutilizarla para ordenar.

</details>

### Ejercicio 5: ¿macro o función?

Para cada caso, decide si conviene una macro o una función `static inline`, y explica por qué: (a) calcular el área de un círculo de radio `r`; (b) imprimir un mensaje con el archivo y la línea donde se llamó; (c) declarar un arreglo de tamaño fijo y su contador para cualquier tipo.

<details><summary>Ver solución</summary>

- (a) **Función** `static inline double area_circulo(double r)`: tiene tipos, evalúa `r` una vez y se puede depurar. No necesita nada que solo una macro haga.
- (b) **Macro**: solo una macro conoce `__FILE__` y `__LINE__` **del lugar de la llamada**; dentro de una función, darían siempre la línea de la función.
- (c) **Macro**: recibe un **tipo** como argumento (`DECLARAR_LISTA(int, 10)`), algo que una función no puede recibir.

</details>
