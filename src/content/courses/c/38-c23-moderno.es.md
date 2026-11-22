---
title: 'C moderno: novedades de C23'
course: 'c'
slug: 'c23-moderno'
order: 38
lang: 'es'
published: true
---

> **Ruta opcional de profundización.** Esta lección abre el módulo avanzado *C moderno y C23*. No es un requisito para el resto del curso: todo lo anterior funciona sin ella. Tómala cuando ya te sientas cómodo con punteros, memoria y la biblioteca estándar, o cuando necesites leer código C moderno.

A lo largo del curso viste recuadros **C moderno (C23)** dentro de cada tema. Aquí los reunimos, completamos lo que faltaba y, sobre todo, aprendes a responder una pregunta práctica: **¿esto es C estándar, es una extensión de mi compilador o es una parte opcional?** Esa distinción decide si tu programa compilará en otra máquina.

## Objetivos

- Ubicar C23 en la evolución del lenguaje: C89, C99, C11, C17 y C23.
- Distinguir una característica **estándar**, una **extensión** del compilador y una característica **opcional** de la implementación.
- Usar las novedades de C23 más útiles: `bool` como palabra clave, `nullptr`, `constexpr`, `typeof`, `auto`, atributos, `#embed`, `_BitInt(N)`, enumeraciones con tipo subyacente, `= {}`, `unreachable()` y `<stdckdint.h>`.
- Comprobar en el código qué estándar está activo con `__STDC_VERSION__`.

**Requisitos previos:** `compilacion-y-enlazado`, `tipos-de-datos`, `variables-y-constantes`, `punteros-y-direcciones`, `memoria-dinamica` y `biblioteca-estandar-y-errores`.

## Cómo evolucionó C

C es un lenguaje estandarizado por ISO. Cada versión agrega características y casi nunca rompe el código anterior:

| Versión | Año | Lo más importante que agregó |
| --- | --- | --- |
| C89/C90 | 1989/1990 | El primer estándar: prototipos de funciones, `const`, `void *`, la biblioteca estándar |
| C99 | 1999 | Comentarios `//`, declaraciones en cualquier lugar del bloque y en el `for`, `long long`, `_Bool` y `<stdbool.h>`, `<stdint.h>`, `inline`, inicializadores designados |
| C11 | 2011 | `_Generic`, `_Static_assert`, `_Alignas`, `_Noreturn`, hilos (`<threads.h>`) y atómicos (`<stdatomic.h>`) como partes opcionales; elimina `gets` |
| C17 | 2018 | Solo correcciones de defectos de C11, sin características nuevas |
| C23 | 2024 | ISO/IEC 9899:2024: lo que ves en esta lección |

Cada estándar define el valor de la macro `__STDC_VERSION__`, así que un programa puede saber con qué versión lo están compilando:

| Estándar | `__STDC_VERSION__` |
| --- | --- |
| C99 | `199901L` |
| C11 | `201112L` |
| C17 | `201710L` |
| C23 | `202311L` |

```c
#include <stdio.h>

int main(void) {
#if __STDC_VERSION__ >= 202311L
    puts("Compilado como C23");
#elif __STDC_VERSION__ >= 201710L
    puts("Compilado como C17");
#else
    puts("Compilado con un estándar anterior a C17");
#endif
    return 0;
}
```

Con `-std=c23` imprime `Compilado como C23`. Con `-std=c2x` (el nombre provisional que usan GCC 13 o Clang 17 y anteriores) el valor puede ser uno intermedio, como `202000L`, porque el estándar todavía no estaba cerrado.

## Estándar, extensión u opcional

Antes de usar algo "moderno", pregúntate a cuál de estas tres categorías pertenece:

- **Estándar:** lo exige ISO C23. Cualquier compilador que declare soporte completo de C23 lo acepta. Ejemplo: `nullptr`.
- **Extensión:** lo agrega un compilador por su cuenta, fuera del estándar. Funciona en ese compilador (y a veces en otros que lo imitan), pero no es C. Ejemplos: `__attribute__((packed))` de GCC y Clang, las funciones anidadas de GCC, `__builtin_expect`. Con `-Wpedantic` el compilador te avisa cuando usas una.
- **Opcional:** está en el estándar, pero el estándar permite que una implementación no lo ofrezca, siempre que lo anuncie con una macro. Ejemplos: `<threads.h>` (si falta, se define `__STDC_NO_THREADS__`), `<stdatomic.h>` (`__STDC_NO_ATOMICS__`), los números complejos (`__STDC_NO_COMPLEX__`) y los arreglos de longitud variable (`__STDC_NO_VLA__`).

Hay una cuarta situación frecuente: algo que **era una extensión y C23 lo volvió estándar**. Los literales binarios `0b1010`, `typeof` y el inicializador vacío `= {}` existían desde hace años en GCC y Clang, pero solo desde C23 son C estándar. Con `-std=c17 -Wpedantic`, el compilador los marca como extensión.

> **Portabilidad:** un compilador puede aceptar `-std=c23` y aun así no implementar todo C23, y la biblioteca estándar de tu sistema puede ir por detrás del compilador. GCC 14 y Clang 18 implementan la mayor parte de C23, pero no todo: por ejemplo, `constexpr` llegó a Clang en la versión 19 y `#embed` a GCC en la versión 15. Si usas otro compilador (por ejemplo MSVC), consulta su documentación. Todos los ejemplos que compilan en esta lección se probaron con Clang 21 y `-std=c23 -Wall -Wextra -Wpedantic`.

## Tipos y constantes

### `bool`, `true` y `false` son palabras clave

Lo viste en `tipos-de-datos`: en C99 y C17, `bool` viene de `<stdbool.h>`; en C23 son **palabras clave** y `true` y `false` tienen tipo `bool`. **Estándar** C23.

### `nullptr` y `nullptr_t`

Hasta C17, el puntero nulo se escribía `NULL`, una macro que puede valer `0` o `((void *)0)` según la implementación. Eso trae problemas sutiles: si `NULL` vale `0`, es un `int`, y pasarlo a una función con argumentos variables (como `printf`) o a una selección `_Generic` no se comporta como un puntero.

C23 agrega la constante **`nullptr`**, que siempre es un puntero nulo, y su tipo `nullptr_t` (declarado en `<stddef.h>`). Se convierte a cualquier tipo de puntero, y nunca a un entero. **Estándar** C23 (GCC 13, Clang 16).

```c
#include <stdio.h>

int main(void) {
    int *p = nullptr;
    if (p == nullptr) {
        puts("p no apunta a nada");
    }
    return 0;
}
```

> **C básico:** `NULL` sigue siendo válido y lo verás en casi todo el código existente. En C23 puedes usar cualquiera de los dos; `nullptr` es más claro sobre la intención.

### `constexpr`: constantes del tiempo de compilación

Un objeto `constexpr` es una constante cuyo valor el compilador **conoce y verifica** al compilar. A diferencia de `#define`, tiene tipo y respeta el alcance; a diferencia de `const`, se puede usar donde el lenguaje exige una expresión constante, por ejemplo en el tamaño de un arreglo con duración estática o en una etiqueta `case`. **Estándar** C23 (GCC 13, Clang 19).

```c
#include <stdio.h>

constexpr int CAPACIDAD = 8;
constexpr double PI = 3.14159;

static int buffer[CAPACIDAD];

int main(void) {
    buffer[0] = CAPACIDAD;
    printf("%zu elementos, el primero vale %d, pi = %.2f\n", sizeof buffer / sizeof buffer[0], buffer[0], PI);
    return 0;
}
```

El compilador rechaza un `constexpr` cuyo valor no puede calcular, o que no cabe exactamente en su tipo:

<!-- c-check: skip -->
```c
#include <stdlib.h>

int main(void) {
    constexpr int azar = rand();           // error: no es una expresión constante
    constexpr unsigned char chico = 300;   // error: 300 no cabe en unsigned char
    return azar + chico;
}
```

> **Portabilidad:** en C23, `constexpr` se aplica **solo a objetos**, no a funciones (a diferencia de C++). Un puntero `constexpr` solo puede ser nulo.

### `typeof` y `typeof_unqual`

`typeof(expresión)` es el tipo de una expresión, y se puede usar en una declaración. `typeof_unqual` hace lo mismo pero quita los calificadores como `const` y `volatile`. **Estándar** C23 (GCC 13, Clang 16). Antes de C23, `typeof` y `__typeof__` eran una **extensión** de GCC y Clang.

```c
#include <stdio.h>

int main(void) {
    const int limite = 10;
    typeof(limite) copia = 20;          // const int
    typeof_unqual(limite) contador = 0; // int, sin const: se puede modificar
    contador++;
    printf("%d %d\n", copia, contador);
    return 0;
}
```

Su uso más importante está en las macros genéricas, que verás en la próxima lección.

### `auto`: inferencia de tipo

En C23, si declaras un objeto con `auto` y lo inicializas, el compilador deduce el tipo a partir del inicializador. **Estándar** C23.

```c
#include <stdio.h>

int main(void) {
    auto total = 2.5;  // double
    auto cantidad = 3; // int
    printf("%.1f\n", total * cantidad);
    return 0;
}
```

> **C básico:** en C89 a C17, `auto` existía con otro significado: marcaba la duración automática de una variable local, que ya es la predeterminada, así que casi nadie lo escribía. Úsalo con moderación: un tipo explícito suele leerse mejor en C.

### Enumeraciones con tipo subyacente

En C17, el tipo entero que usa un `enum` lo elige el compilador. C23 permite fijarlo, lo que importa cuando el `enum` se guarda en un archivo o en un protocolo y su tamaño debe ser conocido. **Estándar** C23.

```c
#include <stdio.h>

enum Color : unsigned char { ROJO, VERDE, AZUL };

int main(void) {
    enum Color c = VERDE;
    printf("sizeof = %zu, valor = %d\n", sizeof c, c);
    return 0;
}
```

Imprime `sizeof = 1, valor = 1`. Si un enumerador no cabe en el tipo subyacente (por ejemplo, `256` con `unsigned char`), es un error de compilación.

### `_BitInt(N)`: enteros de ancho exacto

`_BitInt(N)` es un entero con signo de exactamente `N` bits, y `unsigned _BitInt(N)` uno sin signo. Sirven para hardware, criptografía o formatos con campos de ancho raro. **Estándar** C23, pero el ancho máximo depende de la implementación: lo indica la macro `BITINT_MAXWIDTH` de `<limits.h>`, que vale al menos el ancho de `unsigned long long`.

```c
#include <stdio.h>
#include <limits.h>

int main(void) {
    unsigned _BitInt(4) nibble = 15;
    nibble = nibble + 1; // 4 bits: vuelve a 0
    printf("nibble = %d\n", (int)nibble);
    printf("BITINT_MAXWIDTH = %d\n", (int)BITINT_MAXWIDTH);
    return 0;
}
```

Fíjate en dos detalles: los `_BitInt` **no** se promueven a `int` en las operaciones (por eso `nibble + 1` se calcula en 4 bits), y `printf` no tiene un especificador para ellos, así que se convierten antes de imprimir.

> **Portabilidad:** GCC 14 solo soporta `_BitInt` en algunas arquitecturas (por ejemplo, x86-64). Comprueba `BITINT_MAXWIDTH` antes de usar anchos grandes.

## Literales, inicialización y aserciones

### Separadores de dígitos y literales binarios

Los viste en `variables-y-constantes`: `1'000'000` y `0b1010`. Ambos son **estándar** en C23; antes, los binarios eran una **extensión** de GCC y Clang, y los separadores no existían.

C23 también agrega el especificador `%b` a `printf` para mostrar un número en binario.

> **Portabilidad:** `%b` depende de la **biblioteca**, no del compilador. glibc 2.35 o posterior lo implementa; la biblioteca de macOS, al momento de escribir esta lección, no (imprime una `b` literal). Si necesitas portabilidad, escribe tu propia función que imprima los bits.

### El inicializador vacío `= {}`

En C17, para poner en cero un arreglo o una estructura se escribía `= {0}`. C23 acepta `= {}`, que inicializa **todo** en cero (los punteros en nulo). **Estándar** C23; antes era una **extensión** de GCC.

```c
#include <stdio.h>

struct Punto {
    int x;
    int y;
};

int main(void) {
    struct Punto p = {};
    int conteos[5] = {};
    printf("%d %d %d\n", p.x, p.y, conteos[4]);
    return 0;
}
```

### `static_assert` sin mensaje

`static_assert` comprueba una condición **al compilar**: si es falsa, la compilación falla. En C11 se escribía `_Static_assert(condición, "mensaje")` (o `static_assert` incluyendo `<assert.h>`). En C23, `static_assert` es una palabra clave y el mensaje es opcional. **Estándar** C23.

```c
#include <stdio.h>

static_assert(sizeof(int) >= 4);
static_assert(sizeof(long long) == 8, "este programa supone long long de 64 bits");

int main(void) {
    puts("Las suposiciones sobre los tamaños se cumplen");
    return 0;
}
```

## Atributos

Un **atributo** es una anotación entre `[[` y `]]` que le da información extra al compilador. No cambia el significado del programa correcto, pero permite mejores advertencias. C23 estandariza la sintaxis y estos atributos (**estándar** C23):

| Atributo | Significado |
| --- | --- |
| `[[nodiscard]]` | Ignorar el valor de retorno probablemente es un error |
| `[[maybe_unused]]` | No avisar si esta variable o parámetro no se usa |
| `[[deprecated]]` | Avisar a quien use esta función: está obsoleta |
| `[[fallthrough]]` | En un `switch`, la caída al siguiente `case` es intencional |
| `[[noreturn]]` | La función nunca vuelve (reemplaza a `_Noreturn` de C11) |

```c
#include <stdio.h>
#include <stdlib.h>

[[nodiscard]] int abrir_recurso(void) {
    return 0; // 0: éxito
}

[[noreturn]] void abortar(const char *motivo) {
    fprintf(stderr, "Error fatal: %s\n", motivo);
    exit(EXIT_FAILURE);
}

int puntos_por_nivel(int nivel) {
    int puntos = 0;
    switch (nivel) {
    case 2:
        puntos += 20;
        [[fallthrough]];
    case 1:
        puntos += 10;
        break;
    default:
        break;
    }
    return puntos;
}

int main(void) {
    [[maybe_unused]] int depuracion = 1;
    if (abrir_recurso() != 0) {
        abortar("no se pudo abrir el recurso");
    }
    printf("%d\n", puntos_por_nivel(2));
    return 0;
}
```

Si llamas a `abrir_recurso();` sin usar el resultado, el compilador avisa. Y si alguien llama a una función marcada `[[deprecated("usa la versión nueva")]]`, ve ese mensaje en la advertencia.

> **Portabilidad:** los atributos con prefijo, como `[[gnu::packed]]` o `[[clang::...]]`, son **extensiones** de un compilador. Puedes preguntar si un atributo existe con `__has_c_attribute(nodiscard)` en un `#if`.

## `#embed`: incluir un archivo binario

Para meter un archivo (una imagen, un ícono, una tabla) dentro del programa, antes había que convertirlo a un arreglo con una herramienta externa. C23 agrega la directiva **`#embed`**, que el preprocesador reemplaza por la lista de bytes del archivo, separados por comas. **Estándar** C23 (Clang 19, GCC 15).

<!-- c-check: skip -->
```c
#include <stdio.h>

static const unsigned char icono[] = {
#embed "icono.png"
};

int main(void) {
    printf("El ícono ocupa %zu bytes\n", sizeof icono);
    return 0;
}
```

Este ejemplo necesita un archivo `icono.png` junto al código fuente. El siguiente se puede compilar en cualquier lugar, porque se incluye **a sí mismo** (`__FILE__` es el nombre del archivo fuente) y cuenta sus líneas:

```c
#include <stdio.h>

int main(void) {
    static const char fuente[] = {
#embed __FILE__
    };
    size_t lineas = 0;
    for (size_t i = 0; i < sizeof fuente; i++) {
        if (fuente[i] == '\n') {
            lineas++;
        }
    }
    printf("%zu bytes, %zu líneas\n", sizeof fuente, lineas);
    return 0;
}
```

`#embed` acepta parámetros, como `limit(n)` para incluir como mucho `n` bytes, y `__has_embed(...)` permite preguntar en un `#if` si el archivo existe.

> **Portabilidad:** si tu compilador es anterior a GCC 15 o Clang 19, `#embed` no existe; la alternativa clásica es generar el arreglo con una herramienta como `xxd -i archivo`.

## La biblioteca estándar en C23

### `unreachable()`

La macro `unreachable()` de `<stddef.h>` le dice al compilador que un punto del programa **nunca se alcanza**. El compilador puede optimizar suponiendo eso. Si en realidad se alcanza, es **comportamiento indefinido**, así que úsala solo cuando puedas demostrarlo. **Estándar** C23.

```c
#include <stdio.h>
#include <stddef.h>

// Precondición: dia está entre 0 y 2.
const char *turno(int dia) {
    switch (dia) {
    case 0:
        return "mañana";
    case 1:
        return "tarde";
    case 2:
        return "noche";
    default:
        unreachable();
    }
}

int main(void) {
    printf("%s\n", turno(1));
    return 0;
}
```

### `strdup`, `strndup` y `memccpy`

Estas funciones existían en POSIX desde hace décadas, pero no en C estándar. C23 las incorpora a `<string.h>`:

- `strdup(s)` devuelve una copia nueva de la cadena en memoria dinámica (el llamador es dueño y debe liberarla con `free`), o `NULL` si no hay memoria.
- `strndup(s, n)` copia como mucho `n` caracteres.
- `memccpy(destino, origen, c, n)` copia bytes hasta encontrar el byte `c` o completar `n`; devuelve un puntero al byte siguiente al `c` copiado, o `NULL` si no lo encontró.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char *copia = strdup("hola, mundo");
    if (copia == NULL) {
        return 1;
    }
    char primera[20];
    char *fin = memccpy(primera, copia, ',', sizeof primera);
    if (fin != NULL) {
        fin[-1] = '\0'; // reemplaza la coma por el fin de cadena
    }
    printf("[%s] [%s]\n", copia, primera);
    free(copia);
    return 0;
}
```

> **Portabilidad:** las bibliotecas POSIX (glibc, la de macOS) ya traían estas funciones; en Windows con MSVC, `strdup` se llama `_strdup`.

### Aritmética entera verificada: `<stdckdint.h>`

El desbordamiento de un entero con signo es comportamiento indefinido, y detectarlo **después** de que ocurrió ya es tarde. C23 agrega `<stdckdint.h>` con `ckd_add`, `ckd_sub` y `ckd_mul`: calculan la operación, guardan el resultado en el puntero que les pasas y devuelven `true` si el resultado **no cabía** en ese tipo. **Estándar** C23.

```c
#include <stdio.h>
#include <limits.h>
#include <stdckdint.h>

int main(void) {
    int resultado;
    if (ckd_add(&resultado, INT_MAX, 1)) {
        puts("INT_MAX + 1 desborda un int");
    }

    long long producto;
    if (!ckd_mul(&producto, 3LL, 1'000'000'000LL)) {
        printf("3 * 10^9 = %lld\n", producto);
    }
    return 0;
}
```

Aquí no hay comportamiento indefinido: `ckd_add` informa el desborde en lugar de producirlo.

## Resumen: qué es qué

| Característica | Estado en C23 | Antes de C23 |
| --- | --- | --- |
| `bool`, `true`, `false` como palabras clave | estándar | `<stdbool.h>` (C99) |
| `nullptr`, `nullptr_t` | estándar | no existía |
| `constexpr` (solo objetos) | estándar | no existía |
| `typeof`, `typeof_unqual` | estándar | `typeof` era extensión de GCC/Clang |
| `auto` con inferencia | estándar | `auto` significaba otra cosa |
| `[[nodiscard]]` y los demás atributos | estándar | `__attribute__` (extensión) |
| `static_assert` sin mensaje | estándar | `_Static_assert` con mensaje (C11) |
| `0b1010`, `1'000` | estándar | binarios: extensión; separadores: no |
| `#embed` | estándar | no existía |
| `_BitInt(N)` | estándar, ancho máximo según implementación | no existía |
| `enum E : tipo` | estándar | no existía |
| `= {}` | estándar | extensión de GCC |
| `unreachable()` | estándar | `__builtin_unreachable` (extensión) |
| `strdup`, `memccpy` | estándar | POSIX |
| `<stdckdint.h>` | estándar | `__builtin_add_overflow` (extensión) |
| `<threads.h>`, `<stdatomic.h>` | **opcionales** desde C11 | — |
| `%b` en `printf` | estándar, según la biblioteca | no existía |

## Errores comunes

- Creer que `-std=c23` garantiza todo C23: el compilador o la biblioteca pueden no tener alguna parte.
- Usar `__attribute__`, `__builtin_...` o `typeof` en código C17 creyendo que son estándar: son **extensiones**.
- Usar `unreachable()` como "esto no debería pasar": si puede pasar, es comportamiento indefinido. Para eso, usa una comprobación y un mensaje de error.
- Escribir `constexpr` en una función: en C23 solo vale para objetos.
- Abusar de `auto`: en C, un tipo explícito suele comunicar mejor.

## Resumen

- C evolucionó en C89, C99, C11, C17 y C23; `__STDC_VERSION__` vale `202311L` en C23.
- Cada característica es **estándar**, **extensión** de un compilador u **opcional**; `-Wpedantic` avisa de las extensiones.
- C23 agrega `nullptr`, `constexpr`, `typeof`, `auto`, atributos estándar, `#embed`, `_BitInt(N)`, enumeraciones con tipo subyacente, `= {}`, `unreachable()`, `strdup`/`memccpy` y `<stdckdint.h>`.
- El soporte depende de la versión del compilador y de la biblioteca: comprueba antes de usar.

## Ejercicios prácticos

### Ejercicio 1: clasifica

Para cada elemento, indica si es **estándar** C23, **extensión** de un compilador u **opcional**: `__attribute__((packed))`, `<threads.h>`, `typeof`, `[[gnu::always_inline]]`, `nullptr`, `__builtin_expect`.

<details><summary>Ver solución</summary>

- `__attribute__((packed))`: extensión de GCC y Clang.
- `<threads.h>`: opcional (desde C11); si falta, la implementación define `__STDC_NO_THREADS__`.
- `typeof`: estándar en C23 (antes, extensión).
- `[[gnu::always_inline]]`: la sintaxis `[[...]]` es estándar, pero el atributo con prefijo `gnu::` es una extensión.
- `nullptr`: estándar C23.
- `__builtin_expect`: extensión de GCC y Clang.

</details>

### Ejercicio 2: de `#define` a `constexpr`

Reescribe este fragmento con `constexpr` y explica qué ganas:

```c
#define FILAS 3
#define COLUMNAS 4
#define TOTAL FILAS * COLUMNAS
```

<details><summary>Ver solución</summary>

```c
constexpr int FILAS = 3;
constexpr int COLUMNAS = 4;
constexpr int TOTAL = FILAS * COLUMNAS;
```

Ganas un tipo (`int`), alcance como cualquier variable y una verificación al compilar. Además desaparece un error clásico de la versión con `#define`: `TOTAL` no tiene paréntesis, así que `100 / TOTAL` se expande a `100 / 3 * 4`, que vale `132` y no `8`. Con `constexpr`, `100 / TOTAL` vale `8`.

</details>

### Ejercicio 3: suma sin desborde

Escribe una función `bool sumar_seguro(int a, int b, int *resultado)` que devuelva `false` si la suma desborda, usando `<stdckdint.h>`. Pruébala con `INT_MAX` y `1`, y con `2` y `3`.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>
#include <limits.h>
#include <stdckdint.h>

bool sumar_seguro(int a, int b, int *resultado) {
    return !ckd_add(resultado, a, b);
}

int main(void) {
    int r;
    if (!sumar_seguro(INT_MAX, 1, &r)) {
        puts("INT_MAX + 1: desborda");
    }
    if (sumar_seguro(2, 3, &r)) {
        printf("2 + 3 = %d\n", r);
    }
    return 0;
}
```

</details>

### Ejercicio 4: detecta el estándar

Escribe un programa que imprima `C23`, `C17`, `C11`, `C99` o `anterior a C99` según `__STDC_VERSION__`. ¿Qué imprime si lo compilas con `-std=c17`? ¿Y con `-std=c23`?

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int main(void) {
#if __STDC_VERSION__ >= 202311L
    puts("C23");
#elif __STDC_VERSION__ >= 201710L
    puts("C17");
#elif __STDC_VERSION__ >= 201112L
    puts("C11");
#elif __STDC_VERSION__ >= 199901L
    puts("C99");
#else
    puts("anterior a C99");
#endif
    return 0;
}
```

Con `-std=c17` imprime `C17`; con `-std=c23`, `C23`. En C89 la macro no existe y, en un `#if`, un identificador no definido vale `0`, así que se imprime `anterior a C99`.

</details>

### Ejercicio 5: atributos que avisan

Marca esta función para que el compilador avise si alguien ignora su resultado, y para que avise también que está obsoleta y debe usarse `leer_entero_seguro`:

```c
int leer_entero(void);
```

<details><summary>Ver solución</summary>

```c
[[nodiscard]] [[deprecated("usa leer_entero_seguro")]] int leer_entero(void);
```

También puedes escribir los dos atributos en una sola lista: `[[nodiscard, deprecated("usa leer_entero_seguro")]]`.

</details>
