---
title: 'Polimorfismo y herencia simulados en C'
course: 'c'
slug: 'polimorfismo-y-herencia-simulados-en-c'
order: 44
lang: 'es'
published: true
---

Herencia y polimorfismo son las ideas más famosas de la POO, y C no tiene ninguna de las dos. Aun así, muchos programas grandes en C (el núcleo de Linux, bibliotecas gráficas, intérpretes) usan una técnica que las **simula**: una tabla de punteros a función y una estructura base como primer campo. En esta lección la construyes paso a paso y, sobre todo, aprendes sus límites, porque aquí el compilador deja de protegerte.

## Objetivos

- Entender el **polimorfismo** como "una misma operación, distinto comportamiento según el tipo real".
- Construir una interfaz de figuras con una tabla de operaciones de punteros a función (`area`, `perimetro`, `destruir`).
- Simular herencia incrustando una estructura base como primer campo.
- Explicar por qué las conversiones entre la base y el tipo concreto son delicadas.
- Conocer los límites de simular herencia y cuándo preferir un diseño más simple.

**Requisitos previos:** `punteros-arreglos-y-estructuras` (punteros a función), `memoria-dinamica`, `propiedad-y-errores-de-memoria`, `encapsulacion-y-abstraccion-en-c` y `objetos-metodos-y-diseno-basado-en-struct`.

## El problema

Quieres guardar círculos y rectángulos en el mismo arreglo y recorrerlo pidiéndole a cada figura su área. En un lenguaje orientado a objetos, cada clase define su método `area` y el lenguaje elige cuál ejecutar según el objeto (despacho virtual). En C hay que construir ese mecanismo a mano, con tres piezas:

1. una **tabla de operaciones**: una `struct` de punteros a función;
2. una **estructura base** que apunta a esa tabla;
3. **tipos concretos** que incrustan la base como primer campo.

## Pieza 1: la tabla de operaciones

En `punteros-arreglos-y-estructuras` viste que `double (*f)(double)` declara un puntero a función. Una `struct` de punteros a función describe una **interfaz**: qué operaciones tiene toda figura, sin decir cómo se hacen.

```c
typedef struct Figura Figura;

typedef struct {
    const char *nombre;
    double (*area)(const Figura *self);
    double (*perimetro)(const Figura *self);
    void (*destruir)(Figura *self);
} FiguraOps;
```

Los paréntesis en `(*area)` son imprescindibles: sin ellos, `double *area(const Figura *)` declararía una función que devuelve `double *`.

## Pieza 2: la estructura base

```c
struct Figura {
    const FiguraOps *ops;   /* qué operaciones usa este objeto */
};
```

Toda figura empieza con un puntero a su tabla. Para llamar a una operación, se busca en la tabla del objeto:

```c
double figura_area(const Figura *f) {
    return f->ops->area(f);
}
```

Eso es el **despacho**: `figura_area` no sabe si `f` es un círculo o un rectángulo; la tabla lo sabe.

## Pieza 3: tipos concretos con la base como primer campo

```c
typedef struct {
    Figura base;   /* SIEMPRE el primer campo */
    double radio;
} Circulo;
```

Como `base` es el primer campo, un puntero a un `Circulo`, convertido, apunta a su `Figura`, y un puntero a esa `Figura`, convertido, apunta al `Circulo`. El estándar de C lo garantiza: una estructura no tiene relleno antes de su primer campo. Esa garantía es todo lo que sostiene la técnica.

## El programa completo

```c
#include <stdio.h>
#include <stdlib.h>

#define PI 3.14159265358979323846

typedef struct Figura Figura;

typedef struct {
    const char *nombre;
    double (*area)(const Figura *self);
    double (*perimetro)(const Figura *self);
    void (*destruir)(Figura *self);
} FiguraOps;

struct Figura {
    const FiguraOps *ops;
};

/* Funciones de despacho: la interfaz pública. */
double figura_area(const Figura *f) { return f->ops->area(f); }
double figura_perimetro(const Figura *f) { return f->ops->perimetro(f); }
const char *figura_nombre(const Figura *f) { return f->ops->nombre; }
void figura_destruir(Figura *f) {
    if (f != NULL) {
        f->ops->destruir(f);
    }
}

/* ---- Circulo ---- */
typedef struct {
    Figura base;
    double radio;
} Circulo;

static double circulo_area(const Figura *self) {
    const Circulo *c = (const Circulo *)self;   /* válido: self apunta a un Circulo */
    return PI * c->radio * c->radio;
}

static double circulo_perimetro(const Figura *self) {
    const Circulo *c = (const Circulo *)self;
    return 2.0 * PI * c->radio;
}

static void circulo_destruir(Figura *self) {
    free(self);   /* self es la dirección del bloque del Circulo */
}

static const FiguraOps CIRCULO_OPS = {"circulo", circulo_area, circulo_perimetro, circulo_destruir};

/* Propiedad: el llamador libera el resultado con figura_destruir. */
Figura *circulo_crear(double radio) {
    if (radio <= 0.0) {
        return NULL;
    }
    Circulo *c = malloc(sizeof *c);
    if (c == NULL) {
        return NULL;
    }
    c->base.ops = &CIRCULO_OPS;
    c->radio = radio;
    return &c->base;
}

/* ---- Rectangulo ---- */
typedef struct {
    Figura base;
    double ancho;
    double alto;
} Rectangulo;

static double rectangulo_area(const Figura *self) {
    const Rectangulo *r = (const Rectangulo *)self;
    return r->ancho * r->alto;
}

static double rectangulo_perimetro(const Figura *self) {
    const Rectangulo *r = (const Rectangulo *)self;
    return 2.0 * (r->ancho + r->alto);
}

static void rectangulo_destruir(Figura *self) {
    free(self);
}

static const FiguraOps RECTANGULO_OPS = {"rectangulo", rectangulo_area, rectangulo_perimetro,
                                         rectangulo_destruir};

/* Propiedad: el llamador libera el resultado con figura_destruir. */
Figura *rectangulo_crear(double ancho, double alto) {
    if (ancho <= 0.0 || alto <= 0.0) {
        return NULL;
    }
    Rectangulo *r = malloc(sizeof *r);
    if (r == NULL) {
        return NULL;
    }
    r->base.ops = &RECTANGULO_OPS;
    r->ancho = ancho;
    r->alto = alto;
    return &r->base;
}

int main(void) {
    Figura *figuras[3] = {circulo_crear(1.0), rectangulo_crear(3.0, 2.0), circulo_crear(2.5)};
    int codigo = 0;

    for (size_t i = 0; i < 3; i++) {
        if (figuras[i] == NULL) {
            fprintf(stderr, "No se pudo crear la figura %zu\n", i);
            codigo = 1;
            continue;
        }
        printf("%-10s area %7.2f  perimetro %6.2f\n", figura_nombre(figuras[i]),
               figura_area(figuras[i]), figura_perimetro(figuras[i]));
    }

    for (size_t i = 0; i < 3; i++) {
        figura_destruir(figuras[i]);   /* acepta NULL */
    }
    return codigo;
}
```

Salida:

```text
circulo    area    3.14  perimetro   6.28
rectangulo area    6.00  perimetro  10.00
circulo    area   19.63  perimetro  15.71
```

Recorre lo que pasa en `figura_area(figuras[0])`:

1. `figuras[0]` apunta al campo `base` de un `Circulo`.
2. `f->ops` es `&CIRCULO_OPS`, que se guardó al crearlo.
3. `f->ops->area` es `circulo_area`, que convierte `self` de vuelta a `const Circulo *` y usa el radio.

El bucle de `main` no menciona círculos ni rectángulos: trabaja solo con la interfaz `Figura`. Agregar un triángulo no obliga a cambiarlo. Eso es **polimorfismo simulado**.

Algunos detalles de diseño:

- Hay **una sola tabla por tipo** (`static const`), compartida por todos los objetos de ese tipo; cada objeto solo guarda un puntero a ella.
- Las implementaciones son `static`: fuera del archivo solo se accede a ellas a través de la tabla.
- La destrucción también se despacha, porque solo el tipo concreto sabe qué liberar. Compilado con `-fsanitize=address`, el programa no informa fugas ni accesos inválidos.

## Herencia simulada: incrustar una base

Incrustar una estructura como primer campo también sirve para reutilizar datos, la idea que la POO llama herencia:

```c
struct Persona {
    char nombre[30];
    int edad;
};

struct Alumno {
    struct Persona persona;   /* primer campo: un Alumno "empieza" con una Persona */
    int legajo;
};

void persona_mostrar(const struct Persona *p);
```

Con un `struct Alumno a`, puedes llamar a `persona_mostrar(&a.persona)`, que es la forma segura y no necesita ninguna conversión. Escribir `persona_mostrar((const struct Persona *)&a)` también funciona porque `persona` es el primer campo, pero es una conversión que el compilador no verifica.

Fíjate en la diferencia con la composición de la lección anterior: allí un `Rectangulo` **tiene** una esquina; aquí se pretende que un `Alumno` **sea** una `Persona`. C solo entiende lo primero. Lo segundo es una convención que tú mantienes.

## Por qué las conversiones son delicadas

En `circulo_area`, la conversión `(const Circulo *)self` es correcta **solo** si `self` apunta realmente al campo `base` de un `Circulo`. El compilador no puede comprobarlo. Estos errores compilan sin advertencias y producen comportamiento indefinido:

<!-- c-check: skip -->
```c
Figura *f = rectangulo_crear(3.0, 2.0);
const Circulo *c = (const Circulo *)f;   /* f no apunta a un Circulo */
printf("%f\n", c->radio);                /* lee memoria con el tipo equivocado */

typedef struct {
    double radio;
    Figura base;   /* la base NO es el primer campo */
} CirculoMal;      /* convertir entre CirculoMal * y Figura * ya no es válido */

Figura falsa = {&CIRCULO_OPS};           /* tabla de círculo, pero no hay radio */
figura_area(&falsa);                     /* circulo_area lee un radio que no existe */
```

En todos los casos el programa puede mostrar basura, funcionar "por suerte" o terminar con un error. AddressSanitizer detecta algunos (lecturas fuera del bloque), pero no todos.

## Los límites de simular herencia

Esta técnica es útil, pero tiene límites que un lenguaje orientado a objetos no tiene:

- **Sin seguridad de tipos:** las conversiones de base a concreto son manuales; el compilador acepta cualquier conversión entre punteros.
- **Despacho manual:** cada operación necesita su función de despacho, su campo en la tabla y su inicialización. Olvidar un campo de la tabla deja un puntero nulo que falla en tiempo de ejecución.
- **Herencia de un solo nivel práctico:** una base dentro de otra base dentro de un tipo concreto funciona, pero cada nivel multiplica las conversiones y la disciplina necesaria. Heredar de dos bases a la vez no es posible de esta forma.
- **Costo de mantenimiento:** agregar una operación a la interfaz obliga a modificar todas las tablas de todos los tipos.
- **Memoria dinámica:** cada objeto suele crearse con `malloc` y destruirse con su función, con todas las responsabilidades de propiedad.
- **Costo de ejecución:** cada llamada pasa por dos punteros (`f->ops->area`) y el compilador normalmente no puede integrarla en línea.

## Cuándo preferir algo más simple

Si el conjunto de tipos es **cerrado y pequeño** (sabes que solo habrá círculos y rectángulos), una unión con etiqueta y un `switch` es más simple, más rápido y más fácil de leer:

```c
enum TipoFigura { FIG_CIRCULO, FIG_RECTANGULO };

struct FiguraSimple {
    enum TipoFigura tipo;
    union {
        double radio;
        struct { double ancho, alto; } rect;
    } datos;
};

double figura_simple_area(const struct FiguraSimple *f) {
    switch (f->tipo) {
    case FIG_CIRCULO:    return 3.14159265358979323846 * f->datos.radio * f->datos.radio;
    case FIG_RECTANGULO: return f->datos.rect.ancho * f->datos.rect.alto;
    }
    return 0.0;
}
```

No necesita memoria dinámica ni conversiones, y con `-Wall` el compilador avisa si un `switch` sobre el `enum` olvida un caso. Una regla práctica:

- **conjunto cerrado de tipos**, operaciones que cambian a menudo: unión con etiqueta y `switch`;
- **conjunto abierto de tipos** (otros módulos o complementos agregan tipos nuevos sin tocar tu código): tabla de operaciones;
- **una sola operación variable**: un único puntero a función como parámetro, como el comparador de `qsort`.

## Resumen

- C no tiene herencia ni polimorfismo; se simulan con una tabla de operaciones de punteros a función (`(*area)`) y una estructura base como primer campo.
- El despacho (`f->ops->area(f)`) elige la implementación según la tabla que se guardó al crear el objeto.
- La conversión entre base y tipo concreto es válida solo si la base es el primer campo y el objeto es realmente de ese tipo; el compilador no lo comprueba.
- Los límites: sin seguridad de tipos, despacho manual, mantenimiento costoso, memoria dinámica e indirección.
- Para conjuntos cerrados de tipos, una unión con etiqueta y un `switch` suele ser mejor.

## Ejercicios prácticos

### Ejercicio 1: agrega un triángulo

Agrega al programa de figuras un tipo `Triangulo` con tres lados (`a`, `b`, `c`). El área se calcula con la fórmula de Herón: con `s = (a + b + c) / 2`, el área es `sqrt(s * (s - a) * (s - b) * (s - c))` (incluye `<math.h>` y, en GCC, enlaza con `-lm`). `triangulo_crear` devuelve `NULL` si los lados no forman un triángulo. ¿Qué partes del programa tuviste que modificar?

<details><summary>Ver solución</summary>

```c
typedef struct {
    Figura base;
    double a;
    double b;
    double c;
} Triangulo;

static double triangulo_perimetro(const Figura *self) {
    const Triangulo *t = (const Triangulo *)self;
    return t->a + t->b + t->c;
}

static double triangulo_area(const Figura *self) {
    const Triangulo *t = (const Triangulo *)self;
    double s = triangulo_perimetro(self) / 2.0;
    return sqrt(s * (s - t->a) * (s - t->b) * (s - t->c));
}

static void triangulo_destruir(Figura *self) {
    free(self);
}

static const FiguraOps TRIANGULO_OPS = {"triangulo", triangulo_area, triangulo_perimetro,
                                        triangulo_destruir};

Figura *triangulo_crear(double a, double b, double c) {
    if (a <= 0.0 || b <= 0.0 || c <= 0.0 || a + b <= c || a + c <= b || b + c <= a) {
        return NULL;
    }
    Triangulo *t = malloc(sizeof *t);
    if (t == NULL) {
        return NULL;
    }
    t->base.ops = &TRIANGULO_OPS;
    t->a = a;
    t->b = b;
    t->c = c;
    return &t->base;
}
```

Solo se agregó código nuevo: el bucle de `main`, las funciones de despacho y los otros tipos no cambiaron. Un triángulo de lados 3, 4 y 5 tiene área 6 y perímetro 12.

</details>

### Ejercicio 2: encuentra el error

Este tipo compila sin advertencias, pero `figura_area` devuelve valores absurdos para él. ¿Por qué?

<!-- c-check: skip -->
```c
typedef struct {
    double lado;
    Figura base;
} Cuadrado;

static double cuadrado_area(const Figura *self) {
    const Cuadrado *q = (const Cuadrado *)self;
    return q->lado * q->lado;
}

Figura *cuadrado_crear(double lado) {
    Cuadrado *q = malloc(sizeof *q);
    if (q == NULL) {
        return NULL;
    }
    q->base.ops = &CUADRADO_OPS;
    q->lado = lado;
    return &q->base;
}
```

<details><summary>Ver solución</summary>

`base` no es el primer campo. `cuadrado_crear` devuelve la dirección de `q->base`, que está **después** de `lado`, así que no coincide con la dirección del `Cuadrado`. Cuando `cuadrado_area` convierte `self` a `const Cuadrado *`, el puntero queda desplazado y `q->lado` lee la memoria equivocada: comportamiento indefinido. Además, `free(self)` en la destrucción recibiría una dirección que no vino de `malloc`. La corrección es poner `Figura base;` como primer campo.

</details>

### Ejercicio 3: versión con unión y `switch`

Escribe un programa completo que use `struct FiguraSimple` (unión con etiqueta) para calcular el área y el perímetro de un círculo de radio 1 y un rectángulo de 3 por 2, sin memoria dinámica.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

#define PI 3.14159265358979323846

enum TipoFigura { FIG_CIRCULO, FIG_RECTANGULO };

struct FiguraSimple {
    enum TipoFigura tipo;
    union {
        double radio;
        struct { double ancho, alto; } rect;
    } datos;
};

double figura_simple_area(const struct FiguraSimple *f) {
    switch (f->tipo) {
    case FIG_CIRCULO:    return PI * f->datos.radio * f->datos.radio;
    case FIG_RECTANGULO: return f->datos.rect.ancho * f->datos.rect.alto;
    }
    return 0.0;
}

double figura_simple_perimetro(const struct FiguraSimple *f) {
    switch (f->tipo) {
    case FIG_CIRCULO:    return 2.0 * PI * f->datos.radio;
    case FIG_RECTANGULO: return 2.0 * (f->datos.rect.ancho + f->datos.rect.alto);
    }
    return 0.0;
}

int main(void) {
    struct FiguraSimple figuras[] = {
        {.tipo = FIG_CIRCULO, .datos.radio = 1.0},
        {.tipo = FIG_RECTANGULO, .datos.rect = {3.0, 2.0}},
    };
    for (size_t i = 0; i < 2; i++) {
        printf("area %.2f perimetro %.2f\n", figura_simple_area(&figuras[i]),
               figura_simple_perimetro(&figuras[i]));
    }
    return 0;
}
```

Muestra `area 3.14 perimetro 6.28` y `area 6.00 perimetro 10.00`. Para agregar un tipo hay que tocar el `enum`, la unión y cada `switch`; a cambio, no hay conversiones ni memoria que liberar.

</details>

### Ejercicio 4: elegir el diseño

Para cada caso elige tabla de operaciones, unión con etiqueta o un solo puntero a función: (a) un editor de dibujo con complementos que agregan nuevas herramientas; (b) una calculadora con cuatro operaciones fijas; (c) ordenar un arreglo de alumnos por distintos criterios.

<details><summary>Ver solución</summary>

(a) Tabla de operaciones: el conjunto de herramientas es abierto y cada complemento aporta su propia tabla sin modificar el editor. (b) Unión con etiqueta o un `enum` con `switch`: el conjunto es cerrado y pequeño. (c) Un solo puntero a función: solo varía la comparación, como en `qsort`.

</details>
