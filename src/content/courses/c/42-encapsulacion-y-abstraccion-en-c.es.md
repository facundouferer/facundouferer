---
title: 'Encapsulación y tipos opacos'
course: 'c'
slug: 'encapsulacion-y-abstraccion-en-c'
description: 'Oculta los detalles internos de una estructura mediante declaraciones adelantadas y punteros opacos en el archivo .h, exponiendo únicamente su interfaz pública.'
order: 42
lang: 'es'
published: true
---

En la lección anterior la cuenta tenía un problema: cualquier código que viera la definición de `struct Cuenta` podía escribir `cuenta.saldo_centavos = -500;` y saltarse las reglas. C no tiene `private`. Lo que sí tiene es una técnica muy usada en bibliotecas reales: el **tipo opaco**. Con ella, quien usa el tipo **no puede** tocar sus campos, porque ni siquiera los conoce.

## Objetivos

- Definir **encapsulación** y **abstracción** en términos de diseño en C.
- Declarar un **tipo opaco** con `typedef struct Cuenta Cuenta;` en el `.h` y definir la estructura solo en el `.c`.
- Escribir funciones de creación y destrucción y documentar la propiedad del objeto.
- Hacer que la interfaz garantice los **invariantes** del tipo.
- Ocultar funciones auxiliares con `static`.
- Conocer el costo de esta técnica.

**Requisitos previos:** `modularizacion-subprogramas-y-funciones` (`.h`/`.c`, guardas de inclusión, `static`), `introduccion-a-poo-en-c`, `memoria-dinamica` y `propiedad-y-errores-de-memoria`.

## Encapsulación y abstracción

- **Encapsulación:** agrupar los datos y las operaciones que los modifican, y hacer que **solo** esas operaciones puedan modificarlos.
- **Abstracción:** que quien usa el tipo piense en **qué puede hacer** con él, no en **cómo está hecho**.

En C las dos se logran con la separación que ya conoces de la lección 15: la **interfaz** en el `.h` y la **implementación** en el `.c`. El paso nuevo es ocultar también la definición de la `struct`.

## Tipos incompletos

C permite declarar una estructura sin decir qué campos tiene:

```c
struct Cuenta;   /* declaración: existe, pero no se sabe qué contiene */
```

Hasta que aparezca la definición, `struct Cuenta` es un **tipo incompleto**. Con un tipo incompleto puedes:

- declarar punteros: `struct Cuenta *c;`
- pasar y devolver esos punteros en funciones.

Pero **no** puedes:

- declarar variables de ese tipo (`struct Cuenta c;`), porque el compilador no sabe cuánto ocupa;
- usar `sizeof(struct Cuenta)`;
- acceder a sus campos (`c->saldo`).

Esa limitación es justamente lo que queremos: quien solo vea la declaración puede manejar cuentas a través de punteros, pero no puede mirar adentro.

## Una cuenta con tipo opaco

El ejemplo tiene tres archivos. Es un programa de varios archivos, así que se compila como en la lección 15.

### La interfaz: `cuenta.h`

```c
#ifndef CUENTA_H
#define CUENTA_H

#include <stdbool.h>

/* Tipo opaco: los campos solo se conocen en cuenta.c. */
typedef struct Cuenta Cuenta;

/* Crea una cuenta con una copia de titular y saldo_inicial en centavos.
   Propiedad: el llamador es dueño del resultado y debe liberarlo
   con cuenta_destruir. Devuelve NULL si los datos no son válidos
   o si no hay memoria. */
Cuenta *cuenta_crear(const char *titular, long long saldo_inicial);

/* Libera la cuenta y todo lo que contiene. Acepta NULL. */
void cuenta_destruir(Cuenta *cuenta);

/* Devuelven false (y no cambian nada) si el monto no es válido. */
bool cuenta_depositar(Cuenta *cuenta, long long monto);
bool cuenta_extraer(Cuenta *cuenta, long long monto);

long long cuenta_saldo(const Cuenta *cuenta);

/* Devuelve un puntero prestado: válido mientras la cuenta exista.
   No lo liberes. */
const char *cuenta_titular(const Cuenta *cuenta);

#endif
```

`typedef struct Cuenta Cuenta;` hace dos cosas a la vez: declara `struct Cuenta` como tipo incompleto y le da el nombre corto `Cuenta`. Quien incluye este encabezado solo puede usar `Cuenta *`.

Cada función documenta su **propiedad**, como aprendiste en `propiedad-y-errores-de-memoria`: quién libera el resultado de `cuenta_crear` (el llamador, con `cuenta_destruir`) y qué es solo un préstamo (`cuenta_titular`).

### La implementación: `cuenta.c`

```c
#include "cuenta.h"

#include <stdlib.h>
#include <string.h>

/* La definición completa vive solo aquí. */
struct Cuenta {
    char *titular;
    long long saldo_centavos;   /* invariante: nunca es negativo */
};

/* Auxiliar privada: static la hace invisible fuera de este archivo. */
static bool monto_valido(long long monto) {
    return monto > 0;
}

static char *copiar_texto(const char *texto) {
    size_t largo = strlen(texto) + 1;
    char *copia = malloc(largo);
    if (copia != NULL) {
        memcpy(copia, texto, largo);
    }
    return copia;
}

Cuenta *cuenta_crear(const char *titular, long long saldo_inicial) {
    if (titular == NULL || saldo_inicial < 0) {
        return NULL;
    }
    Cuenta *cuenta = malloc(sizeof *cuenta);
    if (cuenta == NULL) {
        return NULL;
    }
    cuenta->titular = copiar_texto(titular);
    if (cuenta->titular == NULL) {
        free(cuenta);   /* no dejar la cuenta a medio construir */
        return NULL;
    }
    cuenta->saldo_centavos = saldo_inicial;
    return cuenta;
}

void cuenta_destruir(Cuenta *cuenta) {
    if (cuenta == NULL) {
        return;
    }
    free(cuenta->titular);   /* primero lo que contiene */
    free(cuenta);            /* después el objeto */
}

bool cuenta_depositar(Cuenta *cuenta, long long monto) {
    if (!monto_valido(monto)) {
        return false;
    }
    cuenta->saldo_centavos += monto;
    return true;
}

bool cuenta_extraer(Cuenta *cuenta, long long monto) {
    if (!monto_valido(monto) || monto > cuenta->saldo_centavos) {
        return false;
    }
    cuenta->saldo_centavos -= monto;
    return true;
}

long long cuenta_saldo(const Cuenta *cuenta) {
    return cuenta->saldo_centavos;
}

const char *cuenta_titular(const Cuenta *cuenta) {
    return cuenta->titular;
}
```

> **C básico:** copiar una cadena con `malloc`, `strlen` y `memcpy` funciona en cualquier versión del estándar.
>
> **C moderno (C23):** `strdup` pasó a ser parte de `<string.h>` en C23 y hace esa misma copia.
>
> **Portabilidad:** antes de C23, `strdup` era de POSIX, no de ISO C; algunos compiladores no la declaran en modo estricto. Por eso el ejemplo usa su propia función `copiar_texto`.

### El programa: `main.c`

```c
#include <stdio.h>

#include "cuenta.h"

int main(void) {
    Cuenta *cuenta = cuenta_crear("Ana", 10000);
    if (cuenta == NULL) {
        fprintf(stderr, "No se pudo crear la cuenta\n");
        return 1;
    }

    cuenta_depositar(cuenta, 2550);
    if (!cuenta_extraer(cuenta, 50000)) {
        printf("Extraccion rechazada\n");
    }
    printf("%s tiene %lld centavos\n", cuenta_titular(cuenta), cuenta_saldo(cuenta));

    cuenta_destruir(cuenta);
    return 0;
}
```

### Compilar y comprobar la memoria

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -c cuenta.c
gcc -std=c23 -Wall -Wextra -Wpedantic -g -c main.c
gcc cuenta.o main.o -o cuenta
./cuenta
```

Salida:

```text
Extraccion rechazada
Ana tiene 12550 centavos
```

Para verificar que no hay fugas ni accesos inválidos, compila todo junto con AddressSanitizer:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address cuenta.c main.c -o cuenta
./cuenta
```

Si todo está bien, la salida es la misma y AddressSanitizer no informa nada.

## Lo que el compilador ya no permite

Si en `main.c` intentas mirar adentro de la cuenta, el programa no compila:

<!-- c-check: skip -->
```c
#include "cuenta.h"

int main(void) {
    Cuenta copia;                    /* error: tipo incompleto */
    Cuenta *c = cuenta_crear("Ana", 0);
    c->saldo_centavos = -500;        /* error: tipo incompleto */
    cuenta_destruir(c);
    return 0;
}
```

Ahora la regla "el saldo nunca es negativo" no depende de la buena voluntad de quien usa el tipo: el compilador impide el acceso directo y todas las modificaciones pasan por `cuenta_depositar` y `cuenta_extraer`, que la comprueban.

## Invariantes garantizados por la interfaz

Un **invariante** es una condición que se cumple siempre que el objeto está disponible para quien lo usa. Para `Cuenta`:

- `titular` apunta a una cadena válida propia de la cuenta;
- `saldo_centavos >= 0`.

Con un tipo opaco, para garantizar un invariante alcanza con revisar **un solo archivo**:

1. `cuenta_crear` lo establece (rechaza un saldo inicial negativo y no devuelve una cuenta a medio construir).
2. Cada operación lo mantiene (rechaza montos que lo romperían).
3. `cuenta_destruir` libera todo, en orden inverso a como se reservó.

Si mañana cambias `saldo_centavos` por otra representación, solo cambia `cuenta.c`. `main.c` no se entera: esa es la abstracción.

## `static`: funciones privadas del módulo

`monto_valido` y `copiar_texto` son detalles internos. Declararlas `static` les da **enlace interno**: solo existen dentro de `cuenta.c`, no aparecen en el `.h` y otro archivo puede tener su propia función con el mismo nombre sin conflicto en el enlazado. Es lo más cercano a un "método privado" que tiene C.

## El costo de los tipos opacos

Esta técnica no es gratis:

- **Memoria dinámica obligatoria:** como el usuario no conoce el tamaño, no puede declarar una `Cuenta` en la pila; cada objeto pasa por `malloc` y necesita su `cuenta_destruir`.
- **Una llamada por cada acceso:** incluso leer el saldo requiere una función. El compilador normalmente no puede integrarla en línea (*inline*) desde otro archivo.
- **Más código:** creación, destrucción, consultas.

Vale la pena cuando el tipo tiene invariantes que proteger o cuando su representación puede cambiar. Para un `struct Punto { double x, y; }` sin reglas, una estructura visible es más simple y más rápida.

## Resumen

- **Encapsulación**: los datos solo cambian a través de sus operaciones. **Abstracción**: quien usa el tipo ve qué hace, no cómo.
- Un **tipo opaco** se declara con `typedef struct Cuenta Cuenta;` en el `.h`; la definición completa queda en el `.c`.
- Con un tipo incompleto solo se manejan punteros: no hay variables, `sizeof` ni acceso a campos.
- Las funciones de creación y destrucción documentan la propiedad; la destrucción acepta `NULL` y libera en orden inverso.
- La interfaz garantiza los invariantes; las auxiliares `static` quedan privadas del módulo.
- El costo: memoria dinámica, una llamada por acceso y más código.

## Ejercicios prácticos

### Ejercicio 1: ¿qué compila?

Un archivo `main.c` incluye solo `cuenta.h`. ¿Cuáles de estas líneas compilan?

1. `Cuenta *c = NULL;`
2. `Cuenta c;`
3. `size_t n = sizeof(Cuenta);`
4. `printf("%lld\n", cuenta_saldo(c));` (con `c` de tipo `Cuenta *`)

<details><summary>Ver solución</summary>

Compilan la 1 y la 4: con un tipo incompleto se pueden declarar punteros y pasarlos a funciones. La 2 y la 3 no compilan porque el compilador no conoce el tamaño de `struct Cuenta` fuera de `cuenta.c`.

</details>

### Ejercicio 2: encuentra el error

¿Qué está mal en este uso de la cuenta y cómo se corrige?

```c
#include <stdio.h>
#include <stdlib.h>

#include "cuenta.h"

int main(void) {
    Cuenta *c = cuenta_crear("Luis", 500);
    if (c == NULL) {
        return 1;
    }
    const char *nombre = cuenta_titular(c);
    free(c);
    printf("%s\n", nombre);
    return 0;
}
```

<details><summary>Ver solución</summary>

`free(c)` libera solo el bloque de la cuenta y deja sin liberar la copia del titular: una fuga. Quien usa un tipo opaco no sabe qué contiene, así que nunca debe liberarlo con `free`; para eso existe `cuenta_destruir`.

Pero cambiar `free(c)` por `cuenta_destruir(c)` sin mover nada introduce otro error: `nombre` es un puntero **prestado** que deja de ser válido cuando la cuenta se destruye, y el `printf` posterior sería un uso después de liberar. La corrección completa es usar `nombre` antes y destruir con la función del módulo:

```c
    const char *nombre = cuenta_titular(c);
    printf("%s\n", nombre);
    cuenta_destruir(c);
```

</details>

### Ejercicio 3: un contador opaco

Escribe un módulo `contador.h`/`contador.c` con un tipo opaco `Contador` que cuente de 0 a un máximo fijado al crearlo. Operaciones: `contador_crear(maximo)` (devuelve `NULL` si `maximo <= 0`), `contador_destruir`, `contador_incrementar` (devuelve `false` si ya llegó al máximo) y `contador_valor`.

<details><summary>Ver solución</summary>

`contador.h`:

```c
#ifndef CONTADOR_H
#define CONTADOR_H

#include <stdbool.h>

typedef struct Contador Contador;

/* Propiedad: el llamador libera el resultado con contador_destruir. */
Contador *contador_crear(int maximo);
void contador_destruir(Contador *contador);
bool contador_incrementar(Contador *contador);
int contador_valor(const Contador *contador);

#endif
```

`contador.c`:

```c
#include "contador.h"

#include <stdlib.h>

struct Contador {
    int valor;    /* invariante: 0 <= valor <= maximo */
    int maximo;
};

Contador *contador_crear(int maximo) {
    if (maximo <= 0) {
        return NULL;
    }
    Contador *contador = malloc(sizeof *contador);
    if (contador == NULL) {
        return NULL;
    }
    contador->valor = 0;
    contador->maximo = maximo;
    return contador;
}

void contador_destruir(Contador *contador) {
    free(contador);   /* free(NULL) no hace nada */
}

bool contador_incrementar(Contador *contador) {
    if (contador->valor >= contador->maximo) {
        return false;
    }
    contador->valor++;
    return true;
}

int contador_valor(const Contador *contador) {
    return contador->valor;
}
```

`main.c`:

```c
#include <stdio.h>

#include "contador.h"

int main(void) {
    Contador *c = contador_crear(3);
    if (c == NULL) {
        return 1;
    }
    for (int i = 0; i < 5; i++) {
        if (!contador_incrementar(c)) {
            printf("Maximo alcanzado\n");
        }
    }
    printf("Valor: %d\n", contador_valor(c));
    contador_destruir(c);
    return 0;
}
```

Se compila con `gcc -std=c23 -Wall -Wextra -Wpedantic contador.c main.c -o contador` y muestra dos veces `Maximo alcanzado` y luego `Valor: 3`.

</details>

### Ejercicio 4: elegir la representación

Quieres que `cuenta_titular` devuelva siempre el nombre en mayúsculas, pero sin cambiar `main.c`. ¿Qué archivos tienes que modificar y por qué?

<details><summary>Ver solución</summary>

Solo `cuenta.c`: por ejemplo, convertir la copia a mayúsculas dentro de `cuenta_crear`. La interfaz de `cuenta.h` no cambia, y como `main.c` no conoce la representación, sigue funcionando sin cambios. Esa independencia es el beneficio de la abstracción.

</details>
