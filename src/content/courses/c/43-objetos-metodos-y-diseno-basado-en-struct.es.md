---
title: 'Objetos y operaciones: diseño basado en struct'
course: 'c'
slug: 'objetos-metodos-y-diseno-basado-en-struct'
description: 'Diseña módulos coherentes pasando un puntero al struct como primer parámetro, modela relaciones mediante composición de estructuras y maneja errores explícitamente.'
order: 43
lang: 'es'
published: true
---

En un lenguaje orientado a objetos escribes `rectangulo.escalar(2)` y el lenguaje le pasa el objeto al método sin que lo veas. En C no hay métodos: hay funciones. Pero con una convención simple (el objeto va siempre como primer parámetro) puedes escribir módulos que se leen y se usan como si los tuvieran. En esta lección aprendes esa convención, cómo armar objetos a partir de otros (composición) y cómo informar errores sin que el programa se rompa.

## Objetivos

- Escribir operaciones que reciben el puntero al objeto como primer parámetro y nombrarlas con un prefijo común.
- Elegir entre pasar una estructura por valor, por puntero o por puntero a `const`.
- Escribir consultas (*getters*) correctas respecto de `const`.
- Construir tipos por **composición** y decidir quién es dueño de cada parte.
- Informar errores con códigos de retorno y parámetros de salida.

**Requisitos previos:** `concepto-de-estructuras`, `punteros-arreglos-y-estructuras` (`->`), `memoria-dinamica`, `biblioteca-estandar-y-errores` (códigos de retorno) y `encapsulacion-y-abstraccion-en-c`.

## Estado + comportamiento

Una `struct` representa el **estado** de una entidad:

```c
struct Rectangulo {
    double base;
    double altura;
};
```

Y las funciones que operan sobre ella representan su **comportamiento**:

```c
double rectangulo_area(struct Rectangulo r) {
    return r.base * r.altura;
}
```

En C la operación no está "dentro" de la estructura, pero conceptualmente `rectangulo_area` es una operación de `Rectangulo`. El prefijo `rectangulo_` lo deja claro y evita choques de nombres, porque C no tiene espacios de nombres.

## El objeto como primer parámetro

`rectangulo_area` recibe una **copia** del rectángulo: C siempre pasa los argumentos por valor. Para una estructura de dos campos está bien, pero tiene dos problemas: copiar estructuras grandes cuesta, y una función que recibe una copia no puede modificar el original.

La convención de diseño basado en `struct` es pasar **la dirección del objeto como primer parámetro**:

```c
void rectangulo_escalar(struct Rectangulo *r, double factor) {
    r->base *= factor;
    r->altura *= factor;
}
```

El puntero también se pasa por valor (se copia la dirección), pero a través de él la función llega al rectángulo original. Ese primer parámetro cumple el papel de `this` o `self` en otros lenguajes, solo que aquí es explícito. La biblioteca estándar sigue la misma idea: `fprintf(archivo, ...)`, `fgets(buffer, n, archivo)` y `fclose(archivo)` reciben el `FILE *` sobre el que operan.

## Consultas correctas respecto de `const`

Una operación que solo **lee** el objeto debe recibir un puntero a `const`:

```c
double rectangulo_area(const struct Rectangulo *r) {
    return r->base * r->altura;
}
```

Así obtienes tres cosas:

- **Documentación:** la firma promete que la función no modifica el objeto.
- **Comprobación:** si por error escribes `r->base = 0;`, el compilador lo rechaza.
- **Usabilidad:** la consulta se puede llamar desde otra función que solo tiene un `const struct Rectangulo *`. Si la consulta recibiera un puntero sin `const`, esa llamada no compilaría sin una conversión.

La regla práctica: **modificadoras** reciben `T *`; **consultas** reciben `const T *`.

| Forma | Cuándo usarla |
| --- | --- |
| `T valor` | estructuras pequeñas que solo se leen (un punto, una fecha) |
| `const T *` | consultas sobre estructuras medianas o grandes, y sobre tipos opacos |
| `T *` | operaciones que modifican el objeto |

## Composición: objetos hechos de objetos

La **composición** consiste en construir un tipo con otros tipos como campos. Un rectángulo ubicado en el plano **tiene** una esquina, que es un punto:

```c
struct Punto {
    double x;
    double y;
};

struct Rectangulo {
    struct Punto esquina;   /* inferior izquierda */
    double base;
    double altura;
};
```

Cada tipo conserva sus propias operaciones, y las del tipo compuesto **delegan** en las de sus partes:

```c
#include <stdbool.h>
#include <stdio.h>

struct Punto {
    double x;
    double y;
};

void punto_mover(struct Punto *p, double dx, double dy) {
    p->x += dx;
    p->y += dy;
}

struct Rectangulo {
    struct Punto esquina;
    double base;
    double altura;
};

void rectangulo_mover(struct Rectangulo *r, double dx, double dy) {
    punto_mover(&r->esquina, dx, dy);   /* delega en la parte */
}

bool rectangulo_contiene(const struct Rectangulo *r, struct Punto p) {
    return p.x >= r->esquina.x && p.x <= r->esquina.x + r->base
        && p.y >= r->esquina.y && p.y <= r->esquina.y + r->altura;
}

double rectangulo_area(const struct Rectangulo *r) {
    return r->base * r->altura;
}

int main(void) {
    struct Rectangulo r = {.esquina = {0.0, 0.0}, .base = 4.0, .altura = 2.0};
    struct Punto p = {5.0, 1.0};

    printf("Area: %.1f\n", rectangulo_area(&r));
    printf("Contiene (5, 1): %s\n", rectangulo_contiene(&r, p) ? "si" : "no");
    rectangulo_mover(&r, 2.0, 0.0);
    printf("Despues de mover: %s\n", rectangulo_contiene(&r, p) ? "si" : "no");
    return 0;
}
```

Salida:

```text
Area: 8.0
Contiene (5, 1): no
Despues de mover: si
```

`&r->esquina` es la dirección del campo `esquina` dentro de `r` (`->` tiene más precedencia que `&`). `rectangulo_mover` no repite la lógica de mover un punto: la reutiliza.

### Composición con partes dinámicas: quién es dueño

Cuando una parte vive en memoria dinámica, la composición implica **propiedad**: el objeto contenedor es dueño de sus partes, las crea en su función de creación y las libera en su función de destrucción. Quien usa el contenedor nunca libera las partes por su cuenta.

## Errores con códigos de retorno

En `biblioteca-estandar-y-errores` viste que las funciones de C informan errores con su valor de retorno (`EOF`, `NULL`, un código). En un diseño basado en `struct` conviene que cada operación que puede fallar devuelva un **código de resultado** y entregue los datos por un **parámetro de salida**. Así el llamador distingue *por qué* falló.

Este inventario compone un arreglo dinámico de productos, crece con `realloc` y usa códigos de resultado en todas sus operaciones:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

enum InvResultado {
    INV_OK,
    INV_ARGUMENTO_INVALIDO,
    INV_SIN_MEMORIA,
    INV_NO_ENCONTRADO
};

const char *inv_mensaje(enum InvResultado r) {
    switch (r) {
    case INV_OK:                 return "ok";
    case INV_ARGUMENTO_INVALIDO: return "argumento invalido";
    case INV_SIN_MEMORIA:        return "sin memoria";
    case INV_NO_ENCONTRADO:      return "no encontrado";
    }
    return "resultado desconocido";
}

struct Producto {
    char codigo[16];
    int stock;
};

struct Inventario {
    struct Producto *productos;   /* el inventario es dueño de este arreglo */
    size_t cantidad;
    size_t capacidad;
};

void inventario_iniciar(struct Inventario *inv) {
    inv->productos = NULL;
    inv->cantidad = 0;
    inv->capacidad = 0;
}

void inventario_liberar(struct Inventario *inv) {
    free(inv->productos);
    inventario_iniciar(inv);   /* queda vacío y reutilizable */
}

enum InvResultado inventario_agregar(struct Inventario *inv, const char *codigo, int stock) {
    if (codigo == NULL || strlen(codigo) >= sizeof inv->productos[0].codigo || stock < 0) {
        return INV_ARGUMENTO_INVALIDO;
    }
    if (inv->cantidad == inv->capacidad) {
        size_t nueva = inv->capacidad == 0 ? 4 : inv->capacidad * 2;
        struct Producto *mas = realloc(inv->productos, nueva * sizeof *mas);
        if (mas == NULL) {
            return INV_SIN_MEMORIA;   /* el arreglo anterior sigue intacto */
        }
        inv->productos = mas;
        inv->capacidad = nueva;
    }
    struct Producto *p = &inv->productos[inv->cantidad];
    strcpy(p->codigo, codigo);   /* cabe: se comprobó el largo */
    p->stock = stock;
    inv->cantidad++;
    return INV_OK;
}

enum InvResultado inventario_stock(const struct Inventario *inv, const char *codigo, int *stock) {
    for (size_t i = 0; i < inv->cantidad; i++) {
        if (strcmp(inv->productos[i].codigo, codigo) == 0) {
            *stock = inv->productos[i].stock;
            return INV_OK;
        }
    }
    return INV_NO_ENCONTRADO;
}

int main(void) {
    struct Inventario inv;
    inventario_iniciar(&inv);

    const char *codigos[] = {"A-100", "B-200", "codigo-demasiado-largo", "C-300"};
    for (size_t i = 0; i < 4; i++) {
        enum InvResultado r = inventario_agregar(&inv, codigos[i], 10 * (int)(i + 1));
        if (r != INV_OK) {
            printf("No se agrego %s: %s\n", codigos[i], inv_mensaje(r));
        }
    }

    int stock = 0;
    enum InvResultado r = inventario_stock(&inv, "C-300", &stock);
    if (r == INV_OK) {
        printf("Stock de C-300: %d\n", stock);
    }
    r = inventario_stock(&inv, "Z-999", &stock);
    printf("Z-999: %s\n", inv_mensaje(r));

    inventario_liberar(&inv);
    return 0;
}
```

Salida:

```text
No se agrego codigo-demasiado-largo: argumento invalido
Stock de C-300: 40
Z-999: no encontrado
```

Detalles de diseño que vale la pena notar:

- **El resultado va por el retorno, el dato por un parámetro de salida** (`int *stock`). Una consulta que puede no encontrar nada no necesita inventar un valor especial como `-1`.
- **Ninguna operación deja el objeto roto:** si `realloc` falla, el inventario conserva su arreglo anterior y el llamador recibe `INV_SIN_MEMORIA`.
- **`inv_mensaje` traduce el código a texto**, como `strerror` hace con `errno`.
- **El inventario es dueño de su arreglo:** `main` solo llama a `inventario_liberar`, nunca a `free(inv.productos)`. Pasarle este AddressSanitizer (`-fsanitize=address`) no informa fugas ni accesos inválidos.

Aquí `Inventario` es visible y vive en la pila de `main`; si quisieras proteger sus invariantes (por ejemplo, `cantidad <= capacidad`), lo convertirías en un tipo opaco como en la lección anterior.

## Resumen

- En C las "operaciones de un objeto" son funciones que reciben el puntero al objeto como primer parámetro y comparten un prefijo (`rectangulo_`, `inventario_`).
- C pasa ese puntero por valor; a través de la dirección copiada la función modifica el original.
- Las consultas reciben `const T *`; las modificadoras, `T *`; las estructuras pequeñas pueden ir por valor.
- La **composición** arma tipos con otros tipos; el contenedor delega en las operaciones de sus partes y es dueño de las partes dinámicas.
- Las operaciones que pueden fallar devuelven un código de resultado y entregan los datos por parámetros de salida, sin dejar el objeto en un estado inválido.

## Ejercicios prácticos

### Ejercicio 1: ¿`const` o no?

Escribe la firma correcta de cada operación de un tipo `struct Alumno`: (a) consultar el promedio; (b) agregar una nota; (c) mostrar el alumno en pantalla; (d) cambiar el nombre.

<details><summary>Ver solución</summary>

```c
double alumno_promedio(const struct Alumno *a);
bool alumno_agregar_nota(struct Alumno *a, int nota);
void alumno_mostrar(const struct Alumno *a);
bool alumno_cambiar_nombre(struct Alumno *a, const char *nombre);
```

Las consultas (a) y (c) solo leen, así que reciben `const struct Alumno *`. Las modificadoras (b) y (d) reciben un puntero sin `const` y devuelven `bool` porque pueden rechazar datos inválidos. El nombre nuevo se recibe como `const char *` porque la función no lo modifica.

</details>

### Ejercicio 2: composición con delegación

Define `struct Fecha { int dia, mes, anio; }` con la consulta `fecha_es_anterior(const struct Fecha *a, const struct Fecha *b)`, y `struct Prestamo` que se compone de una fecha de salida y una de devolución. Escribe `prestamo_es_valido` que delegue en `fecha_es_anterior` y pruébalo.

<details><summary>Ver solución</summary>

```c
#include <stdbool.h>
#include <stdio.h>

struct Fecha {
    int dia;
    int mes;
    int anio;
};

bool fecha_es_anterior(const struct Fecha *a, const struct Fecha *b) {
    if (a->anio != b->anio) {
        return a->anio < b->anio;
    }
    if (a->mes != b->mes) {
        return a->mes < b->mes;
    }
    return a->dia < b->dia;
}

struct Prestamo {
    struct Fecha salida;
    struct Fecha devolucion;
};

bool prestamo_es_valido(const struct Prestamo *p) {
    return fecha_es_anterior(&p->salida, &p->devolucion);
}

int main(void) {
    struct Prestamo bien = {{3, 5, 2026}, {17, 5, 2026}};
    struct Prestamo mal = {{3, 5, 2026}, {1, 4, 2026}};
    printf("Primero: %s\n", prestamo_es_valido(&bien) ? "valido" : "invalido");
    printf("Segundo: %s\n", prestamo_es_valido(&mal) ? "valido" : "invalido");
    return 0;
}
```

Muestra `Primero: valido` y `Segundo: invalido`.

</details>

### Ejercicio 3: quitar con códigos de resultado

Agrega al inventario la operación `enum InvResultado inventario_quitar(struct Inventario *inv, const char *codigo, int unidades)`, que descuenta unidades del stock. Debe devolver `INV_ARGUMENTO_INVALIDO` si `unidades <= 0` o si no hay stock suficiente, y `INV_NO_ENCONTRADO` si el código no existe, sin modificar el inventario en esos casos.

<details><summary>Ver solución</summary>

```c
enum InvResultado inventario_quitar(struct Inventario *inv, const char *codigo, int unidades) {
    if (unidades <= 0) {
        return INV_ARGUMENTO_INVALIDO;
    }
    for (size_t i = 0; i < inv->cantidad; i++) {
        struct Producto *p = &inv->productos[i];
        if (strcmp(p->codigo, codigo) == 0) {
            if (unidades > p->stock) {
                return INV_ARGUMENTO_INVALIDO;
            }
            p->stock -= unidades;
            return INV_OK;
        }
    }
    return INV_NO_ENCONTRADO;
}
```

Todas las comprobaciones ocurren **antes** de modificar algo, así que un error nunca deja el stock a medias.

</details>

### Ejercicio 4: ¿por valor o por puntero?

Un compañero escribió `void rectangulo_escalar(struct Rectangulo r, double factor)` y se queja de que el rectángulo de `main` no cambia. Explica por qué y corrígelo.

<details><summary>Ver solución</summary>

C pasa los argumentos por valor: `r` es una copia del rectángulo de `main`, escalar la copia no afecta al original, y la copia deja de existir cuando la función termina. La corrección es recibir la dirección:

```c
void rectangulo_escalar(struct Rectangulo *r, double factor) {
    r->base *= factor;
    r->altura *= factor;
}
```

y llamarla con `rectangulo_escalar(&rect, 2.0);`.

</details>
