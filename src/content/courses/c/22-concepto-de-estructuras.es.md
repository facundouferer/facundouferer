---
title: 'Estructuras (struct)'
course: 'c'
slug: 'concepto-de-estructuras'
order: 22
lang: 'es'
published: true
---

Los arreglos sirven cuando todos los datos son del mismo tipo: cinco notas, treinta temperaturas, un nombre de 50 caracteres. Pero muchos datos reales no son así. Un alumno tiene un nombre (texto), un legajo (entero) y un promedio (real), y esos tres valores **van juntos**: separarlos en tres arreglos paralelos es una invitación a mezclarlos.

Para eso C tiene las **estructuras**: un tipo que tú defines y que agrupa varios datos relacionados, aunque sean de tipos distintos.

> Idea clave: una `struct` es un **registro**. Le das un nombre a un conjunto de campos y a partir de ahí lo tratas como una sola cosa: lo declaras, lo inicializas, lo copias, lo pasas a funciones y lo guardas en arreglos.

## Objetivos

- Diseñar una `struct` que modele un registro del problema.
- Declarar, inicializar (también con inicializadores designados) y acceder a los campos con `.`.
- Trabajar con arreglos de estructuras.
- Pasar estructuras a funciones y devolverlas **por valor**, entendiendo el costo de la copia.
- Dar nombres cómodos a los tipos con `typedef`.
- Usar `enum` para constantes con nombre.
- Reconocer qué es una `union`, cuándo se usa con un campo etiqueta y qué riesgos tiene.
- Explicar, a nivel introductorio, por qué `sizeof` de una estructura puede ser mayor que la suma de sus campos (relleno).
- Comparar estructuras campo por campo.

**Requisitos previos:** [Tipos de datos](/cursos/c/tipos-de-datos) (`sizeof`, `size_t`), [Sentencia switch](/cursos/c/sentencia-switch-y-bloques-de-codigo), [Variables, parámetros y pasaje](/cursos/c/variables-parametros-y-pasaje) (C pasa los argumentos siempre por valor), [Arreglos](/cursos/c/arreglos-unidimensionales-y-multidimensionales) y [Cadenas](/cursos/c/cadenas-de-caracteres-y-operaciones).

## Diseñar un registro

Antes de escribir código, piensa qué describe una entidad de tu problema. Para un alumno de un curso:

| Dato | Tipo | Por qué |
| --- | --- | --- |
| legajo | `int` | número entero que identifica al alumno |
| nombre | `char[40]` | texto de hasta 39 caracteres más el `\0` |
| promedio | `double` | puede tener decimales |

Esa tabla se traduce casi literalmente a C:

```c
struct alumno {
    int legajo;
    char nombre[40];
    double promedio;
};
```

- `struct alumno` es el **nombre del tipo** (la palabra `alumno` sola se llama *etiqueta*).
- `legajo`, `nombre` y `promedio` son los **campos** o **miembros**.
- La definición termina con `;`. Olvidarlo produce errores confusos en la línea siguiente.

Definir el tipo **no** crea ninguna variable: es el plano, no la casa. Las variables se declaran después:

```c
struct alumno a;
struct alumno b;
```

Cada una tiene su propio legajo, su propio nombre y su propio promedio.

## Inicializar y acceder a los campos con `.`

Los campos se usan con el operador punto: `variable.campo`. Cada campo se comporta exactamente como una variable de su tipo.

```c
#include <stdio.h>
#include <string.h>

struct alumno {
    int legajo;
    char nombre[40];
    double promedio;
};

int main(void) {
    struct alumno a = {1021, "Ana Gomez", 8.5};

    struct alumno b = {
        .legajo = 1022,
        .nombre = "Luis Perez",
        .promedio = 7.25,
    };

    struct alumno c = {.legajo = 1023};

    strcpy(c.nombre, "Marta Diaz");
    c.promedio = 9.0;
    b.promedio += 0.5;

    printf("%d %s %.2f\n", a.legajo, a.nombre, a.promedio);
    printf("%d %s %.2f\n", b.legajo, b.nombre, b.promedio);
    printf("%d %s %.2f\n", c.legajo, c.nombre, c.promedio);
    return 0;
}
```

Salida:

```text
1021 Ana Gomez 8.50
1022 Luis Perez 7.75
1023 Marta Diaz 9.00
```

Hay dos formas de inicializar:

- **Por posición** (`a`): los valores se asignan en el orden en que se declararon los campos. Es breve, pero si alguien reordena los campos de la `struct`, el inicializador queda mal sin que nadie lo note.
- **Inicializadores designados** (`b` y `c`): `.campo = valor`. El orden no importa y el código se lee solo. Los campos que no nombras quedan en **cero** (`0`, `0.0`, cadena vacía). Por eso `c` empieza con nombre vacío y promedio `0.0`.

Un campo cadena se inicializa con un literal, pero después **no** se le puede asignar con `=` (es un arreglo): se usa `strcpy`, o mejor una copia que respete la capacidad, como viste en la lección de cadenas.

> **C básico:** para poner en cero todos los campos se escribe `struct alumno a = {0};`.
>
> **C moderno (C23):** C23 acepta el inicializador vacío `struct alumno a = {};`, que pone en cero todos los campos, igual que con arreglos.
>
> **Portabilidad:** `{}` no es válido en C17 con `-Wpedantic`; si tu código debe compilar con `-std=c17`, usa `{0}`.

## Asignar una estructura copia todos los campos

A diferencia de los arreglos, las estructuras **sí** se pueden asignar con `=`. La asignación copia campo por campo, incluidos los arreglos que estén dentro:

```c
struct alumno original = {1021, "Ana Gomez", 8.5};
struct alumno copia = original;

copia.nombre[0] = 'E';
copia.promedio = 10.0;
/* original sigue siendo "Ana Gomez" con 8.5: copia es otro objeto */
```

Después de la asignación hay **dos** registros independientes. Cambiar uno no cambia el otro.

## Arreglos de estructuras

Un arreglo de estructuras es la forma natural de guardar una tabla: cada elemento es una fila y cada campo es una columna.

```c
#include <stdio.h>

struct producto {
    int codigo;
    char nombre[30];
    double precio;
    int stock;
};

int main(void) {
    struct producto inventario[] = {
        {.codigo = 10, .nombre = "Lapiz", .precio = 120.0, .stock = 40},
        {.codigo = 11, .nombre = "Cuaderno", .precio = 950.0, .stock = 0},
        {.codigo = 12, .nombre = "Regla", .precio = 300.0, .stock = 15},
    };
    size_t n = sizeof inventario / sizeof inventario[0];

    double valor_total = 0.0;
    for (size_t i = 0; i < n; i++) {
        if (inventario[i].stock == 0) {
            printf("Sin stock: %s\n", inventario[i].nombre);
        }
        valor_total += inventario[i].precio * inventario[i].stock;
    }
    printf("Valor del inventario: %.2f\n", valor_total);
    return 0;
}
```

Salida:

```text
Sin stock: Cuaderno
Valor del inventario: 9300.00
```

Lee `inventario[i].stock` de izquierda a derecha: el elemento `i` del arreglo, y de ese elemento, el campo `stock`. Las lecciones de búsqueda y ordenación trabajan justamente con arreglos así: buscar un producto por código u ordenar alumnos por promedio.

## Estructuras y funciones: todo por valor

Una función puede recibir una estructura y también devolver una. En los dos casos se aplica la regla de siempre: **C pasa los argumentos por valor**. La función recibe una **copia completa** del registro.

```c
#include <stdio.h>

struct punto {
    double x;
    double y;
};

struct punto trasladar(struct punto p, double dx, double dy) {
    p.x += dx; /* modifica la copia local */
    p.y += dy;
    return p;  /* devuelve otra copia, con los cambios */
}

void mostrar(struct punto p) {
    printf("(%.1f, %.1f)\n", p.x, p.y);
}

int main(void) {
    struct punto a = {.x = 1.0, .y = 2.0};

    struct punto b = trasladar(a, 3.0, -1.0);
    mostrar(a); /* a no cambió */
    mostrar(b);

    a = trasladar(a, 10.0, 10.0); /* para cambiar a, se asigna el resultado */
    mostrar(a);
    return 0;
}
```

Salida:

```text
(1.0, 2.0)
(4.0, 1.0)
(11.0, 12.0)
```

Fíjate en el contraste con los arreglos: una función que recibe un arreglo llega a los elementos del llamador, pero una función que recibe una estructura trabaja sobre una copia, **aunque la estructura tenga un arreglo adentro**. Si la función tiene que cambiar el registro del llamador, el patrón de esta lección es devolver la estructura modificada y asignarla.

**El costo de la copia.** Copiar un `struct punto` (dos `double`) es barato. Copiar un registro con un arreglo de 1000 caracteres en cada llamada ya no lo es: se copian todos los bytes, aunque la función solo lea un campo. En la lección [Punteros, arreglos y estructuras](/cursos/c/punteros-arreglos-y-estructuras) (26) verás cómo pasar la **dirección** de la estructura para evitar la copia (esa dirección también se pasa por valor).

## `typedef`: un nombre más corto para el tipo

Escribir `struct alumno` en cada declaración es largo. `typedef` crea un **alias** para un tipo existente:

```c
typedef struct alumno Alumno;    /* Alumno es otro nombre de struct alumno */

typedef struct {
    double x;
    double y;
} Punto;                         /* struct sin etiqueta, nombrada solo por el alias */

Alumno mejor = {.legajo = 1, .nombre = "Ana", .promedio = 9.5};
Punto origen = {0};
```

`typedef` no crea un tipo nuevo: `Alumno` y `struct alumno` son exactamente el mismo tipo. También sirve para tipos simples (`typedef int Nota;`), aunque con estructuras es donde más se usa. En este curso usamos nombres con mayúscula inicial para los alias de estructuras, y es habitual ponerlos en el encabezado `.h` junto con los prototipos que los usan (por eso los encabezados llevan guardas, como viste en la lección de modularización).

> **C básico:** el sufijo `_t` (como en `size_t`) está reservado por POSIX para sus tipos. Evítalo en tus propios `typedef`.

## `enum`: constantes con nombre

Muchos campos toman uno de pocos valores posibles: el estado de un pedido, un día de la semana, un color. Usar números sueltos (`estado == 2`) obliga a recordar qué significa cada uno. Un `enum` les da nombre:

```c
#include <stdio.h>

enum estado { PENDIENTE, ENVIADO, ENTREGADO, CANCELADO };

int main(void) {
    enum estado pedido = ENVIADO;

    switch (pedido) {
    case PENDIENTE:
        printf("Todavía no salió\n");
        break;
    case ENVIADO:
        printf("En camino\n");
        break;
    case ENTREGADO:
        printf("Recibido\n");
        break;
    case CANCELADO:
        printf("Anulado\n");
        break;
    }
    printf("Valor numérico: %d\n", pedido);
    return 0;
}
```

Salida:

```text
En camino
Valor numérico: 1
```

- Los **enumeradores** (`PENDIENTE`, `ENVIADO`, ...) son constantes enteras: valen `0`, `1`, `2`, ... en orden, salvo que les asignes otro valor (`enum { BAJA = 1, MEDIA = 5, ALTA = 10 };`).
- Son expresiones constantes, así que sirven en `case` (cosa que `const int` no hace, como viste en la lección de `switch`).
- Con `-Wall`, si un `switch` sobre un `enum` no cubre todos sus valores, el compilador avisa. Es una red de seguridad gratis.
- Un `enum` **no** restringe los valores: C deja asignar cualquier entero a una variable `enum estado`. El nombre documenta la intención, no la garantiza.

> **C básico:** el tipo entero que usa el compilador para guardar un `enum` lo elige cada implementación (suele ser `int`).
>
> **C moderno (C23):** C23 permite fijar el **tipo subyacente**: `enum color : unsigned char { ROJO, VERDE, AZUL };` garantiza que `sizeof(enum color)` es 1, útil para registros compactos o formatos binarios. El compilador rechaza un enumerador que no entre en ese tipo.
>
> **Portabilidad:** el tipo subyacente fijo no existe en C17; con `-std=c17` usa un `unsigned char` común y constantes del `enum`.

```c
#include <stdio.h>

enum color : unsigned char { ROJO, VERDE, AZUL };

int main(void) {
    enum color fondo = VERDE;
    printf("fondo = %d, tamaño = %zu byte\n", fondo, sizeof fondo);
    return 0;
}
```

Salida:

```text
fondo = 1, tamaño = 1 byte
```

Un `enum` dentro de una `struct` es la forma clara de modelar un campo con pocos valores:

```c
typedef enum { PENDIENTE, ENVIADO, ENTREGADO } Estado;

typedef struct {
    int numero;
    Estado estado;
} Pedido;
```

## `union`: varios campos en el mismo lugar

Una `union` se declara como una `struct`, pero sus campos **comparten la misma memoria**: en cada momento guarda **uno solo** de ellos. Su tamaño es el del campo más grande (más relleno, si hace falta).

```c
union numero {
    int entero;
    double real;
};
```

Sirve cuando un dato puede ser de **una** entre varias formas y quieres no reservar espacio para todas. El problema es obvio: la `union` no recuerda cuál campo escribiste por última vez. Por eso casi siempre va dentro de una `struct` con un **campo etiqueta** (un `enum`) que lo indica. A esto se le llama *unión etiquetada*:

```c
#include <stdio.h>

typedef enum { ENTERO, REAL } TipoValor;

typedef struct {
    TipoValor tipo;          /* la etiqueta: dice qué campo es válido */
    union {
        int entero;
        double real;
    } dato;
} Valor;

Valor crear_entero(int x) {
    Valor v = {.tipo = ENTERO, .dato.entero = x};
    return v;
}

Valor crear_real(double x) {
    Valor v = {.tipo = REAL, .dato.real = x};
    return v;
}

void mostrar(Valor v) {
    switch (v.tipo) {
    case ENTERO:
        printf("entero: %d\n", v.dato.entero);
        break;
    case REAL:
        printf("real: %.3f\n", v.dato.real);
        break;
    }
}

int main(void) {
    Valor lista[] = {crear_entero(42), crear_real(3.5), crear_entero(-7)};
    for (size_t i = 0; i < sizeof lista / sizeof lista[0]; i++) {
        mostrar(lista[i]);
    }
    printf("sizeof(Valor) = %zu\n", sizeof(Valor));
    return 0;
}
```

Salida en una plataforma típica de 64 bits (el último número puede variar):

```text
entero: 42
real: 3.500
entero: -7
sizeof(Valor) = 16
```

**Riesgos de `union`:**

- **Leer un campo distinto del último escrito.** Si escribes `dato.entero` y lees `dato.real`, C reinterpreta esos bytes como un `double`: el resultado depende de la plataforma y no tiene sentido para el programa; si los bytes no forman un valor válido del tipo, el comportamiento es indefinido. La etiqueta existe para que eso no pase.
- **Etiqueta desactualizada.** Si cambias el campo pero olvidas cambiar la etiqueta, el resto del programa leerá el campo equivocado. Por eso conviene crear los valores solo con funciones como `crear_entero` y `crear_real`, que escriben las dos cosas juntas.
- **El ahorro suele ser pequeño.** Para registros comunes, una `struct` con todos los campos es más simple y segura. Usa `union` cuando el ahorro importa o cuando el dato realmente es "uno de varios".

## Tamaño y relleno

¿Cuánto ocupa una estructura? La respuesta intuitiva es "la suma de sus campos", pero `sizeof` suele dar más:

```c
#include <stdio.h>

struct desordenada {
    char inicial;
    int edad;
    char grupo;
};

struct ordenada {
    int edad;
    char inicial;
    char grupo;
};

int main(void) {
    printf("campos: %zu bytes\n", sizeof(char) + sizeof(int) + sizeof(char));
    printf("desordenada: %zu bytes\n", sizeof(struct desordenada));
    printf("ordenada: %zu bytes\n", sizeof(struct ordenada));
    return 0;
}
```

Salida en una plataforma típica (con `int` de 4 bytes):

```text
campos: 6 bytes
desordenada: 12 bytes
ordenada: 8 bytes
```

La diferencia es el **relleno** (*padding*): bytes sin uso que el compilador agrega entre campos o al final. Muchos procesadores leen un `int` más rápido (o solo pueden leerlo) si su dirección es múltiplo de 4; a esa regla se la llama **alineación**. En `struct desordenada`, después de `inicial` (1 byte) el compilador deja 3 bytes vacíos para que `edad` quede alineado, y al final agrega otros 3 para que, en un arreglo de estas estructuras, el siguiente elemento también empiece alineado.

Lo que necesitas saber por ahora:

- `sizeof` de una `struct` es **al menos** la suma de sus campos, y puede ser mayor. Usa siempre `sizeof(tipo)`, nunca la suma a mano.
- Los campos se guardan **en el orden en que los declaraste**; el compilador no los reordena. Ordenarlos de mayor a menor tamaño suele reducir el relleno.
- El relleno depende de la plataforma. Por eso no conviene escribir una `struct` completa a un archivo binario y esperar leerla igual en otra máquina (lo verás en la lección de archivos).

> **Portabilidad:** algunos compiladores ofrecen extensiones como `__attribute__((packed))` o `#pragma pack` para eliminar el relleno. **No son C estándar**: cambian según el compilador y pueden hacer el acceso más lento o inválido en algunos procesadores. No las uses en este curso.

## Comparar estructuras: campo por campo

Las estructuras se pueden asignar con `=`, pero **no** se pueden comparar con `==`:

<!-- c-check: skip -->
```c
#include <stdio.h>

struct punto {
    int x;
    int y;
};

int main(void) {
    struct punto a = {1, 2};
    struct punto b = {1, 2};
    if (a == b) { /* error: invalid operands to binary expression */
        printf("iguales\n");
    }
    return 0;
}
```

La forma correcta es escribir una función que compare los campos que definen la igualdad para **tu** problema:

```c
#include <stdbool.h>
#include <stdio.h>
#include <string.h>

typedef struct {
    int legajo;
    char nombre[40];
    double promedio;
} Alumno;

bool mismo_alumno(Alumno a, Alumno b) {
    return a.legajo == b.legajo && strcmp(a.nombre, b.nombre) == 0;
}

int main(void) {
    Alumno x = {.legajo = 7, .nombre = "Ana", .promedio = 8.0};
    Alumno y = {.legajo = 7, .nombre = "Ana", .promedio = 9.0};

    printf("%s\n", mismo_alumno(x, y) ? "mismo alumno" : "distinto alumno");
    return 0;
}
```

Salida:

```text
mismo alumno
```

Fíjate en dos decisiones:

- La cadena se compara con `strcmp`, no con `==` (que compararía otra cosa, como viste en la lección de cadenas).
- Aquí el promedio **no** forma parte de la identidad del alumno: tú decides qué significa "igual". Además, comparar `double` con `==` es frágil por el redondeo.

Comparar los bytes de dos estructuras completas (por ejemplo con `memcmp`) **no** es confiable: los bytes de relleno pueden contener cualquier valor, y los caracteres después del `\0` de una cadena también.

## Errores comunes

- **Olvidar el `;` al final de la definición** de la `struct`.
- **Asignar una cadena con `=`**: `a.nombre = "Ana";` no compila; usa `strcpy` o una copia segura.
- **Esperar que una función cambie la estructura del llamador** cuando la recibió por valor. Devuelve la estructura y asígnala.
- **Comparar con `==`** o con `memcmp`. Compara campo por campo.
- **Sumar tamaños a mano** en vez de usar `sizeof`.
- **Leer un campo de `union` distinto del que indica la etiqueta.**

## Resumen

- Una `struct` agrupa campos de distintos tipos en un registro; sus campos se acceden con `.`.
- Los inicializadores designados (`.campo = valor`) son claros y ponen en cero lo que no nombras.
- Asignar una estructura copia todos sus campos, incluidos los arreglos internos.
- Pasar o devolver una estructura copia el registro completo: siempre por valor. Para registros grandes, la lección 26 muestra cómo evitar la copia.
- `typedef` da un alias a un tipo; no crea un tipo nuevo.
- `enum` da nombre a constantes enteras; en C23 se le puede fijar el tipo subyacente.
- Una `union` guarda un solo campo a la vez; úsala con una etiqueta.
- `sizeof` de una `struct` incluye el relleno de alineación.
- Las estructuras se comparan campo por campo.

## Ejercicios prácticos

### Ejercicio 1: diseñar un registro

Define con `typedef` un tipo `Libro` con título (hasta 59 caracteres), autor (hasta 39), año de publicación y cantidad de ejemplares disponibles. Declara un arreglo con tres libros usando inicializadores designados y muestra solo los que tienen ejemplares disponibles.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

typedef struct {
    char titulo[60];
    char autor[40];
    int anio;
    int disponibles;
} Libro;

int main(void) {
    Libro biblioteca[] = {
        {.titulo = "Rayuela", .autor = "Julio Cortazar", .anio = 1963, .disponibles = 2},
        {.titulo = "Ficciones", .autor = "Jorge Luis Borges", .anio = 1944, .disponibles = 0},
        {.titulo = "Pedro Paramo", .autor = "Juan Rulfo", .anio = 1955, .disponibles = 1},
    };
    size_t n = sizeof biblioteca / sizeof biblioteca[0];

    for (size_t i = 0; i < n; i++) {
        if (biblioteca[i].disponibles > 0) {
            printf("%s (%s, %d): %d disponibles\n", biblioteca[i].titulo,
                   biblioteca[i].autor, biblioteca[i].anio, biblioteca[i].disponibles);
        }
    }
    return 0;
}
```

Los tamaños son 60 y 40 para dejar lugar al `\0`.

</details>

### Ejercicio 2: predecir la salida

¿Qué imprime este programa? Explica por qué antes de ejecutarlo.

```c
#include <stdio.h>

typedef struct {
    int valores[3];
} Caja;

void poner_ceros(Caja c) {
    for (int i = 0; i < 3; i++) {
        c.valores[i] = 0;
    }
}

int main(void) {
    Caja c = {.valores = {4, 5, 6}};
    poner_ceros(c);
    printf("%d %d %d\n", c.valores[0], c.valores[1], c.valores[2]);
    return 0;
}
```

<details><summary>Ver solución</summary>

Imprime `4 5 6`. La función recibe una **copia** de la estructura, y esa copia incluye su propio arreglo `valores`. Los ceros se escriben en la copia, que desaparece al terminar `poner_ceros`. Para cambiar `c`, la función debería devolver la `Caja` modificada y `main` debería asignarla: `c = poner_ceros(c);` con `Caja poner_ceros(Caja c)`.

Compáralo con un arreglo pasado directamente a una función: ahí la función sí llega a los elementos del llamador.

</details>

### Ejercicio 3: una figura con `union` etiquetada

Modela una figura que puede ser un círculo (radio) o un rectángulo (base y altura) con una `struct` que tenga una etiqueta `enum` y una `union`. Escribe `double area(Figura f)` y muestra el área de un círculo de radio 1 y de un rectángulo de 3 por 4.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

typedef enum { CIRCULO, RECTANGULO } TipoFigura;

typedef struct {
    TipoFigura tipo;
    union {
        double radio;
        struct {
            double base;
            double altura;
        } rect;
    } medidas;
} Figura;

double area(Figura f) {
    switch (f.tipo) {
    case CIRCULO:
        return 3.14159265358979 * f.medidas.radio * f.medidas.radio;
    case RECTANGULO:
        return f.medidas.rect.base * f.medidas.rect.altura;
    }
    return 0.0;
}

int main(void) {
    Figura c = {.tipo = CIRCULO, .medidas.radio = 1.0};
    Figura r = {.tipo = RECTANGULO, .medidas.rect = {.base = 3.0, .altura = 4.0}};

    printf("Área del círculo: %.2f\n", area(c));
    printf("Área del rectángulo: %.2f\n", area(r));
    return 0;
}
```

Salida:

```text
Área del círculo: 3.14
Área del rectángulo: 12.00
```

El `return 0.0;` final cubre un valor de etiqueta que no sea ninguno de los dos (recuerda que un `enum` no restringe los valores).

</details>

### Ejercicio 4: reducir el relleno

Esta estructura ocupa 24 bytes en una plataforma típica de 64 bits. Reordena sus campos para que ocupe menos y comprueba el resultado con `sizeof`.

```c
struct registro {
    char activo;
    double saldo;
    char tipo;
    int numero;
};
```

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

struct registro {
    char activo;
    double saldo;
    char tipo;
    int numero;
};

struct registro_ordenado {
    double saldo;
    int numero;
    char activo;
    char tipo;
};

int main(void) {
    printf("original: %zu\n", sizeof(struct registro));
    printf("ordenado: %zu\n", sizeof(struct registro_ordenado));
    return 0;
}
```

En una plataforma típica imprime `24` y `16`. Al poner primero el campo de 8 bytes, después el de 4 y al final los de 1, solo quedan 2 bytes de relleno al final en lugar de 10 repartidos.

</details>
