---
title: 'Biblioteca estándar y manejo de errores'
course: 'c'
slug: 'biblioteca-estandar-y-errores'
order: 34
lang: 'es'
published: true
---

C es un lenguaje pequeño: casi todo lo útil que hace un programa real (leer texto, convertir números, ordenar, medir el tiempo, informar errores) viene de su **biblioteca estándar**. En esta lección recorres el mapa de esa biblioteca, aprendes a clasificar caracteres, a leer y escribir carácter por carácter, a convertir texto en números sin aceptar basura y, sobre todo, a **manejar errores** de forma ordenada: detectar cada falla, informarla y liberar lo que ya reservaste.

## Objetivos

- Saber qué ofrece cada cabecera principal de la biblioteca estándar y cuándo incluirla.
- Clasificar y convertir caracteres con `<ctype.h>` sin caer en comportamiento indefinido.
- Leer y escribir carácter por carácter con `getchar` y `putchar`, y entender por qué `EOF` exige un `int`.
- Convertir texto en números con `strtol` y `strtod`, rechazando entradas vacías, basura al final y valores fuera de rango, en lugar de usar `atoi`.
- Elegir un estilo de manejo de errores: código de retorno, `bool` con parámetro de salida, `errno` con `perror` y `strerror`.
- Terminar el programa con `EXIT_SUCCESS` o `EXIT_FAILURE` y limpiar los recursos en todos los caminos de error, incluido el idioma `goto cleanup`.
- Ordenar y buscar con `qsort` y `bsearch` usando funciones comparadoras.

**Requisitos previos:** `entrada-y-salida` (lección 6), `cadenas-de-caracteres-y-operaciones` (21), `concepto-de-estructuras` (22), `punteros-arreglos-y-estructuras` (26, punteros a funciones y `qsort`) y `memoria-dinamica` (28).

## El mapa de la biblioteca estándar

La biblioteca se divide en **cabeceras**. Cada una declara un grupo de funciones, tipos y macros; incluyes solo las que usas. Estas son las que vas a necesitar con más frecuencia:

| Cabecera | Para qué sirve | Ejemplos |
| --- | --- | --- |
| `<stdio.h>` | Entrada y salida: consola y archivos | `printf`, `scanf`, `fgets`, `getchar`, `putchar`, `perror`, `fopen` |
| `<stdlib.h>` | Utilidades generales: memoria, conversiones, ordenamiento, salida del programa | `malloc`, `free`, `strtol`, `strtod`, `qsort`, `bsearch`, `exit`, `EXIT_SUCCESS` |
| `<string.h>` | Cadenas y bloques de memoria | `strlen`, `strcmp`, `strncpy`, `memcpy`, `memset`, `strerror` |
| `<ctype.h>` | Clasificar y convertir caracteres | `isdigit`, `isalpha`, `isspace`, `toupper`, `tolower` |
| `<math.h>` | Funciones matemáticas | `sqrt`, `pow`, `fabs`, `floor` |
| `<limits.h>` | Límites de los tipos enteros | `INT_MAX`, `INT_MIN`, `LONG_MAX`, `CHAR_BIT` |
| `<stdint.h>` | Enteros de ancho exacto | `int32_t`, `uint8_t`, `int64_t`, `SIZE_MAX` |
| `<stdbool.h>` | El tipo `bool` (antes de C23) | `bool`, `true`, `false` |
| `<errno.h>` | El indicador de error `errno` y sus códigos | `errno`, `ERANGE`, `EDOM` |
| `<assert.h>` | Verificar suposiciones durante el desarrollo | `assert` |
| `<time.h>` | Fecha, hora y tiempo de procesador | `time`, `clock`, `CLOCKS_PER_SEC` |

Algunos detalles que conviene saber desde el principio:

- `<math.h>` declara las funciones, pero en Linux su código vive en una biblioteca aparte, `libm`, que hay que **enlazar** con `-lm` (recuerda la etapa de enlace de la lección 3):

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic raiz.c -o raiz -lm
```

> **Portabilidad:** con glibc (Linux) olvidar `-lm` produce un error de enlace como `undefined reference to 'sqrt'`. En macOS y con MSVC la biblioteca matemática ya va incluida y `-lm` no hace falta, aunque tampoco molesta. Ponlo siempre en tus órdenes de compilación si usas `<math.h>`.

- `<stdint.h>` es la herramienta para cuando el tamaño importa (archivos binarios, protocolos, hardware): `int32_t` mide exactamente 32 bits en cualquier plataforma que lo ofrezca, mientras que `int` solo garantiza al menos 16.

> **C moderno (C23):** `bool`, `true` y `false` son **palabras clave** del lenguaje, así que no necesitas incluir `<stdbool.h>`; la cabecera se conserva solo por compatibilidad. Lo mismo pasa con `static_assert`, que ya no requiere `<assert.h>`. C23 también agregó `strdup` y `strndup` a `<string.h>` (antes eran de POSIX) y la cabecera `<stdckdint.h>`, con operaciones aritméticas que detectan el desbordamiento.

> **C básico:** con un compilador en modo C17 (`-std=c17`) tienes que escribir `#include <stdbool.h>` para usar `bool`. Si tu código debe compilar en ambos estándares, incluirla no hace daño.

- `assert(condicion)` detiene el programa con un mensaje si la condición es falsa. Sirve para **errores de programación** (algo que nunca debería pasar), no para errores del usuario o del entorno: si compilas con `-DNDEBUG`, todos los `assert` desaparecen.

```c
#include <assert.h>
#include <stdio.h>
#include <time.h>

int main(void) {
    time_t ahora = time(NULL);
    clock_t inicio = clock();

    long suma = 0;
    for (long i = 0; i < 1000000; i++) {
        suma += i % 7;
    }

    clock_t fin = clock();
    assert(fin >= inicio);  // una suposición, no una validación de entrada

    printf("Segundos desde 1970: %lld\n", (long long)ahora);
    printf("Suma: %ld\n", suma);
    printf("Tiempo de CPU: %.3f s\n", (double)(fin - inicio) / CLOCKS_PER_SEC);
    return 0;
}
```

## Clasificar y convertir caracteres con `<ctype.h>`

`<ctype.h>` responde preguntas sobre un carácter: ¿es una letra?, ¿un dígito?, ¿un espacio? Y convierte entre mayúsculas y minúsculas.

| Función | Devuelve distinto de cero si el carácter es... |
| --- | --- |
| `isalpha(c)` | una letra |
| `isdigit(c)` | un dígito decimal `0`-`9` |
| `isalnum(c)` | una letra o un dígito |
| `isspace(c)` | espacio, tabulador, salto de línea u otro blanco |
| `isupper(c)` / `islower(c)` | mayúscula / minúscula |
| `ispunct(c)` | un signo de puntuación |

`toupper(c)` y `tolower(c)` devuelven el carácter convertido, o el mismo si no tiene versión en mayúscula o minúscula. Todas reciben y devuelven `int`.

Hay una trampa importante: estas funciones solo aceptan un valor representable como `unsigned char` o `EOF`. En muchas plataformas `char` es con signo, y los bytes de texto que no son ASCII (por ejemplo los de `ñ` o `á` en UTF-8) quedan **negativos**. Pasar un `char` negativo a `isalpha` es **comportamiento indefinido**. La regla es convertir primero a `unsigned char`:

```c
#include <ctype.h>
#include <stdio.h>

int main(void) {
    const char texto[] = "Hola, Mundo 2026!";
    int letras = 0;
    int digitos = 0;
    int blancos = 0;
    int otros = 0;

    for (size_t i = 0; texto[i] != '\0'; i++) {
        unsigned char c = (unsigned char)texto[i];  // siempre antes de <ctype.h>
        if (isalpha(c)) {
            letras++;
        } else if (isdigit(c)) {
            digitos++;
        } else if (isspace(c)) {
            blancos++;
        } else {
            otros++;
        }
    }

    printf("Letras: %d, dígitos: %d, blancos: %d, otros: %d\n",
           letras, digitos, blancos, otros);
    return 0;
}
```

> **Portabilidad:** el resultado de `<ctype.h>` depende de la **configuración regional** (*locale*). Con la configuración `"C"`, que es la que tiene todo programa al empezar, solo las letras ASCII cuentan como letras: `ñ` no es `isalpha`. Para texto UTF-8 de verdad hacen falta otras herramientas (`<wctype.h>` o bibliotecas externas).

## Entrada y salida carácter por carácter

En la lección 6 usaste `getchar` como receta para descartar la entrada inválida. Ahora lo estudias en serio, junto con su pareja `putchar`:

- `int getchar(void)` lee el siguiente carácter de la entrada estándar y lo devuelve como un valor `unsigned char` convertido a `int`. Si ya no quedan datos (o hubo un error), devuelve **`EOF`**.
- `int putchar(int c)` escribe un carácter en la salida estándar.

`EOF` es una macro de `<stdio.h>` con un valor **negativo** (casi siempre `-1`). Por eso **el resultado de `getchar` se guarda en un `int`, nunca en un `char`**: `getchar` puede devolver 257 valores distintos (los 256 bytes posibles más `EOF`), y un `char` solo tiene lugar para 256.

- Si `char` es con signo, el byte `0xFF` se confunde con `EOF` y el programa se detiene antes de tiempo.
- Si `char` es sin signo, `EOF` se convierte en 255, la comparación con `EOF` nunca es verdadera y el ciclo no termina.

Este programa es un **filtro**: copia la entrada en la salida pasando las letras a mayúsculas, hasta encontrar `EOF`:

```c
#include <ctype.h>
#include <stdio.h>

int main(void) {
    int c;  // int, no char: tiene que poder guardar EOF

    while ((c = getchar()) != EOF) {
        putchar(toupper(c));  // c ya es un unsigned char o EOF: no hace falta convertir
    }
    return 0;
}
```

Para probarlo, escribe texto y marca el fin de la entrada con `Ctrl+D` (Linux y macOS) o `Ctrl+Z` y Enter (Windows). También puedes redirigir un archivo: `./mayusculas < notas.txt`.

## Convertir texto en números: de `atoi` a `strtol`

`atoi` (de `<stdlib.h>`) parece cómodo, pero no sirve para datos reales:

- `atoi("abc")` devuelve `0`, igual que `atoi("0")`: no puedes distinguir un error de un cero.
- `atoi("12abc")` devuelve `12` y descarta la basura en silencio.
- Si el número no entra en un `int`, el comportamiento es indefinido.

La alternativa robusta es `strtol` ("*string to long*"):

```c
long strtol(const char *texto, char **fin, int base);
```

- `texto` es la cadena a convertir. Se saltan los espacios iniciales y se acepta un signo.
- `fin` es un **parámetro de salida**: `strtol` deja en `*fin` la dirección del primer carácter que **no** usó. Si `*fin == texto`, no había ningún número.
- `base` es la base numérica: `10` para decimal, `16` para hexadecimal, `2` para binario. Con `0` la base se deduce del prefijo (`0x1F` es hexadecimal, `017` es octal).
- Si el valor no entra en un `long`, devuelve `LONG_MAX` o `LONG_MIN` y pone `errno` en `ERANGE`.

Con esas tres señales (puntero de fin, resto de la cadena y `errno`) se arma una conversión que rechaza todo lo dudoso:

```c
#include <ctype.h>
#include <errno.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

// Convierte el texto completo a int.
// Devuelve true y deja el valor en *resultado si el texto es un entero válido;
// devuelve false (sin tocar *resultado) si está vacío, tiene basura o no entra en un int.
bool leer_entero(const char *texto, int *resultado) {
    char *fin;
    errno = 0;                          // strtol solo lo modifica si hay error
    long valor = strtol(texto, &fin, 10);

    if (fin == texto) {
        return false;                   // no había ningún dígito
    }
    while (isspace((unsigned char)*fin)) {
        fin++;                          // se toleran blancos al final, como un '\n'
    }
    if (*fin != '\0') {
        return false;                   // basura al final: "12abc"
    }
    if (errno == ERANGE || valor < INT_MIN || valor > INT_MAX) {
        return false;                   // no entra en un long, o no entra en un int
    }
    *resultado = (int)valor;
    return true;
}

int main(void) {
    const char *pruebas[] = {"42", "  -17 ", "12abc", "", "abc", "99999999999999999999"};
    size_t n = sizeof pruebas / sizeof pruebas[0];

    for (size_t i = 0; i < n; i++) {
        int valor;
        if (leer_entero(pruebas[i], &valor)) {
            printf("\"%s\" -> %d\n", pruebas[i], valor);
        } else {
            printf("\"%s\" -> no es un entero válido\n", pruebas[i]);
        }
    }
    return 0;
}
```

La salida es:

```text
"42" -> 42
"  -17 " -> -17
"12abc" -> no es un entero válido
"" -> no es un entero válido
"abc" -> no es un entero válido
"99999999999999999999" -> no es un entero válido
```

Combinado con `fgets` (lección 21), `leer_entero` reemplaza a `scanf("%d", ...)` cuando necesitas validar **la línea completa**: lees la línea con `fgets` y la conviertes con `strtol`.

Para números con decimales existe `strtod` ("*string to double*"), con la misma idea pero sin base:

```c
char *fin;
errno = 0;
double x = strtod("3.75kg", &fin);
// x vale 3.75 y fin apunta a "kg": hay basura al final
```

Si el valor es demasiado grande, `strtod` devuelve `HUGE_VAL` (de `<math.h>`) y pone `errno` en `ERANGE`. También existen `strtoul` y `strtoll` para `unsigned long` y `long long`.

## Manejo de errores en C

C no tiene excepciones. Cuando una función puede fallar, tiene que **avisarle al llamador** por algún canal, y el llamador tiene que **mirar** ese aviso. Ya viste varios en la biblioteca: `scanf` devuelve cuántos valores leyó, `malloc` devuelve `NULL`, `getchar` devuelve `EOF`. Hay cuatro estilos habituales.

### 1. Código de retorno

La función devuelve un número que indica cómo terminó: un **código de retorno**. Una convención frecuente es `0` para éxito y un valor distinto (a menudo negativo) para cada error. Con un `enum` (lección 22) los códigos tienen nombre y el compilador puede avisarte si un `switch` olvida alguno:

```c
typedef enum {
    CONVERSION_OK,
    CONVERSION_SIN_DIGITOS,
    CONVERSION_BASURA,
    CONVERSION_FUERA_DE_RANGO
} EstadoConversion;

EstadoConversion convertir_entero(const char *texto, int *resultado);
```

La ventaja frente a un simple `bool` es que el llamador sabe **qué** falló y puede mostrar un mensaje preciso.

### 2. `bool` y un parámetro de salida

Cuando solo importa si salió bien o mal, la función devuelve `bool` y entrega el resultado por un **parámetro de salida**: un puntero, pasado por valor, a la variable del llamador (lección 25). Es lo que hace `leer_entero`. La regla que conviene documentar: si devuelve `false`, el parámetro de salida no se modifica.

### 3. Un valor especial

Algunas funciones devuelven un valor que no puede ser un resultado válido: `NULL` en `malloc` o `strchr`, `EOF` en `getchar`, `-1` en un índice de búsqueda. Es cómodo, pero solo funciona si existe ese valor imposible.

### 4. `errno`, `perror` y `strerror`

`errno` (de `<errno.h>`) es un indicador global en el que algunas funciones de la biblioteca guardan un **código** que describe el último error, como `ERANGE` (resultado fuera de rango) o `EDOM` (argumento fuera del dominio, por ejemplo `sqrt(-1.0)` en muchas implementaciones). Las reglas para usarlo bien:

- Ponlo en `0` **antes** de la llamada: ninguna función de la biblioteca lo vuelve a `0` por sí sola.
- Consúltalo **solo** si la función indicó que falló (o, como en `strtol`, cuando la documentación dice que es la forma de detectar el error). Una llamada exitosa puede dejar en `errno` cualquier valor.
- Léelo enseguida: la próxima llamada a la biblioteca puede cambiarlo.

Para mostrar el error hay dos funciones:

- `perror("contexto")` (de `<stdio.h>`) escribe en la salida de errores `stderr` el texto que le pasas, dos puntos y la descripción del valor actual de `errno`.
- `strerror(codigo)` (de `<string.h>`) devuelve la descripción como cadena, para armar tu propio mensaje.

```c
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char *fin;
    errno = 0;
    long valor = strtol("99999999999999999999", &fin, 10);

    if (errno == ERANGE) {
        int codigo = errno;  // se guarda antes de llamar a otras funciones
        perror("strtol");    // por ejemplo: "strtol: Result too large"
        fprintf(stderr, "Valor recortado a %ld (%s)\n", valor, strerror(codigo));
        return EXIT_FAILURE;
    }

    printf("Valor: %ld\n", valor);
    return EXIT_SUCCESS;
}
```

Los mensajes de error se escriben en `stderr` y no en `stdout`: así no se mezclan con los datos cuando rediriges la salida a un archivo (`./programa > resultado.txt` sigue mostrando los errores en la pantalla).

> **Portabilidad:** el texto de `perror` y `strerror` depende del sistema y del idioma configurado; no compares esas cadenas en tu programa. Además, el estándar ISO C solo obliga a unas pocas funciones a usar `errno` (las conversiones como `strtol` y las matemáticas); que `fopen` o `fclose` lo actualicen lo garantiza POSIX (Linux, macOS), no el estándar.

### El código de salida del programa: `EXIT_SUCCESS` y `EXIT_FAILURE`

El valor que devuelve `main` es el **código de salida** del programa, el código de retorno que recibe el sistema operativo o el script que lo ejecutó. `<stdlib.h>` define dos nombres portables:

- `EXIT_SUCCESS` (equivale a `return 0;`): terminó bien.
- `EXIT_FAILURE`: algo falló.

En la terminal puedes consultarlo justo después de ejecutar el programa con `echo $?` (Linux y macOS). La función `exit(codigo)` termina el programa desde cualquier función con ese mismo código, después de vaciar y cerrar los flujos de `<stdio.h>`; aun así, en funciones reutilizables es mejor devolver un error y dejar que el llamador decida.

## Limpiar en todos los caminos de error

Los errores rara vez llegan solos: una función reserva memoria, después reserva más, después hace su trabajo, y **cualquiera de esos pasos** puede fallar. Si un paso falla, hay que liberar todo lo que los pasos anteriores ya reservaron. Con varios recursos, repetir la limpieza en cada `if` produce código largo y fácil de romper:

```c
// Frágil: cada salida repite una limpieza distinta
int *datos = malloc(n * sizeof *datos);
if (datos == NULL) {
    return -1;
}
char *texto = malloc(n + 1);
if (texto == NULL) {
    free(datos);    // si mañana agregas un tercer recurso, hay que tocar todos los if
    return -1;
}
```

El idioma más usado en C para esto es la **salida única con `goto cleanup`**: todas las variables de recurso se inicializan en `NULL` al principio, cada error salta a una etiqueta al final de la función, y ahí se libera todo en orden inverso. Funciona porque `free(NULL)` no hace nada.

```c
#include <stdio.h>
#include <stdlib.h>

// Arma un texto y un arreglo de n elementos y los muestra.
// Código de retorno: 0 si todo salió bien, -1 si falló alguna reserva.
int procesar(size_t n) {
    int estado = -1;     // se supone el fracaso hasta llegar al final
    int *datos = NULL;
    char *texto = NULL;

    if (n == 0) {
        goto limpiar;
    }
    datos = malloc(n * sizeof *datos);
    if (datos == NULL) {
        goto limpiar;
    }
    texto = malloc(n + 1);
    if (texto == NULL) {
        goto limpiar;
    }

    for (size_t i = 0; i < n; i++) {
        datos[i] = (int)(i * i);
        texto[i] = (char)('a' + i % 26);
    }
    texto[n] = '\0';
    printf("%s, último dato: %d\n", texto, datos[n - 1]);
    estado = 0;          // solo aquí sabemos que todo salió bien

limpiar:
    free(texto);         // en orden inverso a la reserva; free(NULL) es seguro
    free(datos);
    return estado;
}

int main(void) {
    if (procesar(5) != 0) {
        fprintf(stderr, "No se pudo procesar\n");
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}
```

`goto etiqueta;` salta a la línea marcada con `etiqueta:` dentro de la **misma función**. Usado sin control vuelve el código imposible de seguir, por eso este idioma se limita a reglas claras:

- solo se salta **hacia adelante**, y solo a la etiqueta de limpieza;
- la limpieza es única y está al final;
- todos los recursos se declaran al principio y empiezan en `NULL` (así el salto no pasa por encima de ninguna inicialización).

Si una función tiene uno o dos recursos, los `if` anidados o una función auxiliar suelen ser igual de claros; usa `goto cleanup` cuando la cantidad de recursos lo justifique. En la próxima lección vas a usar el mismo patrón con archivos, que también hay que cerrar en todos los caminos.

## Ordenar y buscar: `qsort` y `bsearch`

En la lección 26 usaste `qsort` para ordenar enteros pasándole una **función comparadora** por puntero. Su compañera es `bsearch`, que hace una **búsqueda binaria** (lección 23) sobre un arreglo **ya ordenado** con la misma comparadora:

```c
void *bsearch(const void *clave, const void *base, size_t cantidad,
              size_t tamanio, int (*comparar)(const void *, const void *));
```

Devuelve un puntero al elemento encontrado, o `NULL` si no está. La clave es un puntero a un objeto del mismo tipo que los elementos (o a algo que la comparadora sepa comparar con ellos).

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int codigo;
    char nombre[20];
} Producto;

// Ordena por código ascendente. Devuelve negativo, cero o positivo.
int comparar_codigo(const void *a, const void *b) {
    const Producto *x = a;
    const Producto *y = b;
    return (x->codigo > y->codigo) - (x->codigo < y->codigo);
}

int main(void) {
    Producto productos[] = {
        {30, "Yerba"},
        {10, "Azúcar"},
        {20, "Café"},
        {40, "Harina"},
    };
    size_t n = sizeof productos / sizeof productos[0];

    qsort(productos, n, sizeof productos[0], comparar_codigo);

    Producto clave = {20, ""};
    Producto *encontrado = bsearch(&clave, productos, n, sizeof productos[0], comparar_codigo);
    if (encontrado != NULL) {
        printf("Código %d: %s\n", encontrado->codigo, encontrado->nombre);
    } else {
        printf("Código %d: no existe\n", clave.codigo);
    }
    return 0;
}
```

Dos detalles de la comparadora:

- `(x > y) - (x < y)` da `-1`, `0` o `1`. La forma corta `x->codigo - y->codigo` puede **desbordar** con valores grandes de signo opuesto, y el desborde de enteros con signo es comportamiento indefinido (lección 7).
- `bsearch` solo funciona si el arreglo está ordenado **con el mismo criterio** que usa la comparadora de la búsqueda. Ordenar por nombre y buscar por código da resultados sin sentido.

## Resumen

- La biblioteca estándar se organiza en cabeceras: `<stdio.h>` para E/S, `<stdlib.h>` para memoria, conversiones y `qsort`, `<string.h>`, `<ctype.h>`, `<math.h>` (enlazando con `-lm`), `<limits.h>`, `<stdint.h>`, `<errno.h>`, `<assert.h>` y `<time.h>`. En C23 `bool` es palabra clave y `<stdbool.h>` ya no hace falta.
- Antes de pasar un `char` a `<ctype.h>`, conviértelo a `unsigned char`.
- `getchar` devuelve `int` porque además de cualquier byte puede devolver `EOF`.
- Usa `strtol` y `strtod` en lugar de `atoi`: revisa el puntero de fin, la basura al final y `errno == ERANGE`.
- Una función que puede fallar lo comunica con un código de retorno, un `bool` con parámetro de salida, un valor especial o `errno`; el llamador siempre lo revisa.
- `perror` y `strerror` describen el valor de `errno`; los mensajes de error van a `stderr`.
- `main` devuelve `EXIT_SUCCESS` o `EXIT_FAILURE`.
- Cada camino de error libera lo que ya se reservó; con varios recursos, la salida única con `goto cleanup` lo hace en un solo lugar.
- `qsort` ordena y `bsearch` busca en un arreglo ordenado, ambos con la misma comparadora.

## Ejercicios prácticos

### Ejercicio 1: contar vocales y consonantes

Escribe un programa que lea la entrada estándar con `getchar` hasta `EOF` y cuente cuántas vocales y cuántas consonantes (letras que no son vocales) contiene, sin distinguir mayúsculas de minúsculas. Usa `<ctype.h>`.

<details><summary>Ver solución</summary>

```c
#include <ctype.h>
#include <stdio.h>

int main(void) {
    int c;
    int vocales = 0;
    int consonantes = 0;

    while ((c = getchar()) != EOF) {
        if (!isalpha(c)) {
            continue;
        }
        int minuscula = tolower(c);
        if (minuscula == 'a' || minuscula == 'e' || minuscula == 'i' ||
            minuscula == 'o' || minuscula == 'u') {
            vocales++;
        } else {
            consonantes++;
        }
    }

    printf("Vocales: %d\nConsonantes: %d\n", vocales, consonantes);
    return 0;
}
```

`c` es `int` para poder recibir `EOF`, y como viene de `getchar` ya es un valor válido para `<ctype.h>` sin convertirlo.

</details>

### Ejercicio 2: `leer_decimal` con `strtod`

Escribe `bool leer_decimal(const char *texto, double *resultado)`, con las mismas reglas que `leer_entero`: rechaza el texto vacío, la basura al final y el desborde. Pruébala con `"3.5"`, `" -0.25\n"`, `"2,5"` y `"1e999"`.

<details><summary>Ver solución</summary>

```c
#include <ctype.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>

bool leer_decimal(const char *texto, double *resultado) {
    char *fin;
    errno = 0;
    double valor = strtod(texto, &fin);

    if (fin == texto) {
        return false;
    }
    while (isspace((unsigned char)*fin)) {
        fin++;
    }
    if (*fin != '\0' || errno == ERANGE) {
        return false;
    }
    *resultado = valor;
    return true;
}

int main(void) {
    const char *pruebas[] = {"3.5", " -0.25\n", "2,5", "1e999"};
    size_t n = sizeof pruebas / sizeof pruebas[0];

    for (size_t i = 0; i < n; i++) {
        double valor;
        if (leer_decimal(pruebas[i], &valor)) {
            printf("Prueba %zu: %g\n", i + 1, valor);
        } else {
            printf("Prueba %zu: inválida\n", i + 1);
        }
    }
    return 0;
}
```

`"2,5"` es inválida porque, con la configuración regional `"C"`, el separador decimal es el punto: `strtod` se detiene en la coma y queda basura. `"1e999"` no entra en un `double`, así que `errno` vale `ERANGE`.

</details>

### Ejercicio 3: encuentra los errores

Este fragmento quiere pasar a mayúsculas cada línea que escribe el usuario. Tiene dos errores relacionados con lo que viste en esta lección. ¿Cuáles son y cómo se corrigen?

```c
char c;
while ((c = getchar()) != EOF) {
    putchar(toupper(c));
}
```

<details><summary>Ver solución</summary>

1. `c` es `char`, pero `getchar` devuelve `int`. Si `char` es con signo, un byte `0xFF` se confunde con `EOF` y el ciclo termina antes; si es sin signo, la comparación con `EOF` nunca es verdadera y el ciclo no termina. Hay que declarar `int c;`.
2. Si `char` es con signo, los bytes que no son ASCII (por ejemplo los de `á` en UTF-8) quedan negativos, y pasarlos a `toupper` es comportamiento indefinido. Con `int c` el problema desaparece, porque `getchar` ya devuelve un valor de `unsigned char` o `EOF`.

```c
int c;
while ((c = getchar()) != EOF) {
    putchar(toupper(c));
}
```

</details>

### Ejercicio 4: códigos de retorno con nombre

Implementa la función `convertir_entero` del `enum EstadoConversion` de la lección: debe devolver `CONVERSION_SIN_DIGITOS`, `CONVERSION_BASURA` o `CONVERSION_FUERA_DE_RANGO` según el caso, o `CONVERSION_OK` y el valor en `*resultado`. Agrega `const char *describir(EstadoConversion estado)` con un `switch` y úsalas para informar cada caso de prueba; si alguna prueba falla, el programa termina con `EXIT_FAILURE`.

<details><summary>Ver solución</summary>

```c
#include <ctype.h>
#include <errno.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

typedef enum {
    CONVERSION_OK,
    CONVERSION_SIN_DIGITOS,
    CONVERSION_BASURA,
    CONVERSION_FUERA_DE_RANGO
} EstadoConversion;

EstadoConversion convertir_entero(const char *texto, int *resultado) {
    char *fin;
    errno = 0;
    long valor = strtol(texto, &fin, 10);

    if (fin == texto) {
        return CONVERSION_SIN_DIGITOS;
    }
    while (isspace((unsigned char)*fin)) {
        fin++;
    }
    if (*fin != '\0') {
        return CONVERSION_BASURA;
    }
    if (errno == ERANGE || valor < INT_MIN || valor > INT_MAX) {
        return CONVERSION_FUERA_DE_RANGO;
    }
    *resultado = (int)valor;
    return CONVERSION_OK;
}

const char *describir(EstadoConversion estado) {
    switch (estado) {
        case CONVERSION_OK:
            return "correcto";
        case CONVERSION_SIN_DIGITOS:
            return "no hay ningún número";
        case CONVERSION_BASURA:
            return "hay caracteres de más al final";
        case CONVERSION_FUERA_DE_RANGO:
            return "el número no entra en un int";
    }
    return "estado desconocido";
}

int main(void) {
    const char *pruebas[] = {"128", "x9", "7 días", "3000000000"};
    size_t n = sizeof pruebas / sizeof pruebas[0];
    int codigo_salida = EXIT_SUCCESS;

    for (size_t i = 0; i < n; i++) {
        int valor = 0;
        EstadoConversion estado = convertir_entero(pruebas[i], &valor);
        if (estado == CONVERSION_OK) {
            printf("\"%s\": %d\n", pruebas[i], valor);
        } else {
            fprintf(stderr, "\"%s\": %s\n", pruebas[i], describir(estado));
            codigo_salida = EXIT_FAILURE;
        }
    }
    return codigo_salida;
}
```

Como el `switch` cubre todos los valores del `enum` sin `default`, `-Wall` te avisa si mañana agregas un código nuevo y olvidas describirlo.

</details>

### Ejercicio 5: buscar una palabra con `bsearch`

Tienes un arreglo de palabras `const char *palabras[]`. Ordénalo alfabéticamente con `qsort` y `strcmp`, y después usa `bsearch` para saber si `"pera"` y `"kiwi"` están en la lista. Pista: los elementos del arreglo son `const char *`, así que la comparadora recibe **punteros a punteros**.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// a y b apuntan a elementos del arreglo, que son const char *.
int comparar_palabras(const void *a, const void *b) {
    const char *const *x = a;
    const char *const *y = b;
    return strcmp(*x, *y);
}

int main(void) {
    const char *palabras[] = {"manzana", "pera", "banana", "uva", "durazno"};
    size_t n = sizeof palabras / sizeof palabras[0];

    qsort(palabras, n, sizeof palabras[0], comparar_palabras);

    const char *buscadas[] = {"pera", "kiwi"};
    for (size_t i = 0; i < 2; i++) {
        const char *clave = buscadas[i];
        const char **encontrada = bsearch(&clave, palabras, n, sizeof palabras[0],
                                          comparar_palabras);
        printf("%s: %s\n", clave, encontrada != NULL ? "está" : "no está");
    }
    return 0;
}
```

La clave se pasa como `&clave` (un `const char **`), igual que los elementos que recibe la comparadora. Pasar `clave` directamente haría que la comparadora interpretara los caracteres de la palabra como si fueran un puntero.

</details>
