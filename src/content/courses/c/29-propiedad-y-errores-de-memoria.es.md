---
title: 'Propiedad de la memoria y errores frecuentes'
course: 'c'
slug: 'propiedad-y-errores-de-memoria'
order: 29
lang: 'es'
published: true
---

Saber llamar a `malloc` y `free` no alcanza. En un programa con muchas funciones, la pregunta difícil es otra: **¿quién libera este bloque, y cuándo?** Si nadie lo libera, hay una fuga; si lo liberan dos, el programa se rompe. En esta lección aprendes a responder esa pregunta con una idea simple, la **propiedad**, y a reconocer y detectar los errores de memoria más frecuentes.

## Objetivos

- Razonar sobre la **propiedad** de cada bloque: quién lo reserva, quién lo usa y quién lo libera.
- Documentar la propiedad en el comentario de cada función.
- Diseñar funciones que devuelven memoria (pares `crear_...` / `destruir_...`), que la toman prestada y que transfieren su propiedad.
- Reconocer, con un programa mínimo, su síntoma y su corrección: fuga de memoria, doble liberación, uso después de liberar, punteros colgantes, liberar memoria que no vino de `malloc`, desborde por uno en el heap y puntero perdido tras `realloc`.
- Detectar esos errores con AddressSanitizer y leer su informe.

**Requisitos previos:** `duracion-y-ciclo-de-vida` y `memoria-dinamica`.

## Propiedad: quién reserva, quién usa, quién libera

C no lleva la cuenta de qué bloques siguen en uso: esa responsabilidad es tuya. La forma de no perderse es asignar a cada bloque un **dueño**.

- El **dueño** de un bloque es la parte del programa (una función, una estructura, una variable) responsable de liberarlo exactamente una vez.
- Los demás pueden **tomarlo prestado**: leerlo o modificarlo mientras el dueño lo mantiene vivo, sin liberarlo nunca.
- La propiedad se puede **transferir**: el dueño anterior deja de ser responsable y el nuevo pasa a serlo.

La regla de oro: **en cada momento, cada bloque tiene exactamente un dueño**. Si tiene cero dueños, es una fuga. Si dos partes creen ser dueñas, habrá una doble liberación.

El lenguaje no tiene ninguna palabra clave para expresar esto, así que la propiedad se **documenta en el comentario** de cada función que recibe o devuelve memoria:

```c
// Devuelve una copia nueva de texto.
// Propiedad: el llamador es dueño del resultado y debe liberarlo con free.
// Devuelve NULL si no hay memoria.
char *duplicar(const char *texto);

// Muestra texto en pantalla.
// Propiedad: solo toma prestado texto; no lo guarda ni lo libera.
void mostrar(const char *texto);
```

Un parámetro `const T *` es una buena pista de préstamo: la función promete no modificar el objeto, y casi nunca tiene sentido liberarlo.

## Funciones que devuelven memoria: `crear_...` y `destruir_...`

Cuando un objeto tiene varias partes reservadas por separado, liberar con un simple `free` no alcanza. El patrón habitual es un par de funciones: una que crea y otra que destruye. El llamador nunca llama a `free` sobre el objeto directamente, sino a la función `destruir_...` correspondiente.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char *nombre;
    int edad;
} Persona;

// Crea una persona con una copia de nombre.
// Propiedad: el llamador es dueño del resultado y debe liberarlo con
// destruir_persona. Devuelve NULL si no hay memoria.
Persona *crear_persona(const char *nombre, int edad) {
    Persona *p = malloc(sizeof *p);
    if (p == NULL) {
        return NULL;
    }
    size_t largo = strlen(nombre) + 1;
    p->nombre = malloc(largo);
    if (p->nombre == NULL) {
        free(p);                   // deshacer lo que ya se reservó
        return NULL;
    }
    memcpy(p->nombre, nombre, largo);
    p->edad = edad;
    return p;
}

// Libera la persona y todo lo que le pertenece. Acepta NULL.
void destruir_persona(Persona *p) {
    if (p == NULL) {
        return;
    }
    free(p->nombre);               // primero las partes...
    free(p);                       // ...después el contenedor
}

// Propiedad: solo toma prestada p.
void imprimir_persona(const Persona *p) {
    printf("%s (%d)\n", p->nombre, p->edad);
}

int main(void) {
    Persona *ana = crear_persona("Ana", 31);
    if (ana == NULL) {
        fprintf(stderr, "No hay memoria suficiente\n");
        return 1;
    }
    imprimir_persona(ana);         // préstamo
    destruir_persona(ana);         // main era la dueña: main libera
    ana = NULL;
    return 0;
}
```

Observa tres decisiones:

1. Si falla la segunda reserva, `crear_persona` libera la primera antes de devolver `NULL`. Una función que falla no debe dejar memoria a medio reservar.
2. `destruir_persona` libera en orden inverso al de la creación: primero `nombre` (que pertenece a la persona) y después la persona. Si liberaras primero `p`, leer `p->nombre` sería un uso después de liberar.
3. `destruir_persona(NULL)` no hace nada, igual que `free(NULL)`. Eso simplifica los caminos de error.

## Transferir la propiedad

A veces una función recibe un bloque y **se queda con él**. Hay que documentarlo con precisión, incluyendo qué pasa si la función falla:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define CAPACIDAD_AGENDA 8

typedef struct {
    char *nombre;
    int edad;
} Persona;

typedef struct {
    Persona *personas[CAPACIDAD_AGENDA];
    size_t cantidad;
} Agenda;

Persona *crear_persona(const char *nombre, int edad) {
    Persona *p = malloc(sizeof *p);
    if (p == NULL) {
        return NULL;
    }
    size_t largo = strlen(nombre) + 1;
    p->nombre = malloc(largo);
    if (p->nombre == NULL) {
        free(p);
        return NULL;
    }
    memcpy(p->nombre, nombre, largo);
    p->edad = edad;
    return p;
}

void destruir_persona(Persona *p) {
    if (p == NULL) {
        return;
    }
    free(p->nombre);
    free(p);
}

// Agrega p a la agenda.
// Propiedad: si devuelve true, la agenda pasa a ser dueña de p y el llamador
// no debe liberarla. Si devuelve false, el llamador sigue siendo el dueño.
bool agenda_agregar(Agenda *a, Persona *p) {
    if (a->cantidad == CAPACIDAD_AGENDA) {
        return false;
    }
    a->personas[a->cantidad] = p;
    a->cantidad++;
    return true;
}

// Libera todas las personas que le pertenecen a la agenda.
void agenda_vaciar(Agenda *a) {
    for (size_t i = 0; i < a->cantidad; i++) {
        destruir_persona(a->personas[i]);
        a->personas[i] = NULL;
    }
    a->cantidad = 0;
}

int main(void) {
    Agenda agenda = { .cantidad = 0 };
    const char *nombres[] = { "Ana", "Luis", "Marta" };

    for (size_t i = 0; i < 3; i++) {
        Persona *p = crear_persona(nombres[i], 20 + (int)i);
        if (p == NULL) {
            agenda_vaciar(&agenda);
            return 1;
        }
        if (!agenda_agregar(&agenda, p)) {
            destruir_persona(p);   // la agenda no la aceptó: sigue siendo nuestra
        }
        // si se agregó, p ya no es nuestra: no la liberamos aquí
    }

    for (size_t i = 0; i < agenda.cantidad; i++) {
        printf("%s\n", agenda.personas[i]->nombre);
    }
    agenda_vaciar(&agenda);        // la agenda libera lo que le pertenece
    return 0;
}
```

Después de una transferencia, el puntero que conserva el llamador (`p`) sigue apuntando al bloque, pero ya es solo un **préstamo**: puede leerlo mientras la agenda lo mantenga vivo, nunca liberarlo.

## Errores frecuentes

Cada error se muestra con un programa mínimo, su síntoma y su corrección. Varios de estos programas **compilan sin advertencias**: el compilador no puede seguir la propiedad por ti. Por eso al final de la lección verás cómo detectarlos al ejecutar.

### 1. Fuga de memoria

Una **fuga de memoria** ocurre cuando se pierde la última dirección de un bloque sin haberlo liberado: el bloque queda reservado hasta que termina el programa.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    for (int i = 0; i < 3; i++) {
        char *linea = malloc(32);
        if (linea == NULL) {
            return 1;
        }
        snprintf(linea, 32, "Linea %d", i);
        printf("%s\n", linea);
    }                              // linea muere aquí; el bloque, no
    return 0;
}
```

**Síntoma:** ninguno visible en un programa corto. En un servidor o un programa que corre horas, el consumo de memoria crece sin parar hasta que el sistema lo termina.

**Corrección:** el dueño (aquí, cada vuelta del `for`) libera antes de perder la dirección: `free(linea);` al final del bloque. Otra fuga clásica es reasignar el puntero (`linea = malloc(...)` dos veces seguidas) o salir por un camino de error sin liberar.

### 2. Doble liberación

La **doble liberación** es llamar a `free` dos veces sobre el mismo bloque. Suele pasar cuando dos punteros apuntan al mismo bloque y los dos se creen dueños.

```c
#include <stdlib.h>

int main(void) {
    int *datos = malloc(4 * sizeof *datos);
    if (datos == NULL) {
        return 1;
    }
    int *alias = datos;            // dos punteros, un solo bloque
    free(datos);
    free(alias);                   // ERROR: el bloque ya estaba liberado
    return 0;
}
```

**Síntoma:** comportamiento indefinido. Muchas bibliotecas abortan con un mensaje como `free(): double free detected` o `pointer being freed was not allocated`; otras corrompen sus estructuras internas en silencio y el programa falla mucho después, lejos del error.

**Corrección:** decide un único dueño. Solo `datos` libera; `alias` es un préstamo. Asignar `datos = NULL;` después de `free` ayuda cuando es el mismo puntero el que se libera dos veces, pero no protege a los alias.

### 3. Uso después de liberar

El **uso después de liberar** (en inglés, *use after free*) es leer o escribir un bloque que ya fue liberado.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int *puntaje = malloc(sizeof *puntaje);
    if (puntaje == NULL) {
        return 1;
    }
    *puntaje = 100;
    free(puntaje);
    printf("%d\n", *puntaje);      // ERROR: el bloque ya no existe
    return 0;
}
```

**Síntoma:** a veces imprime `100`, a veces basura, a veces el programa termina. Como viste en `duracion-y-ciclo-de-vida`, que "funcione" no prueba nada. Es además uno de los errores más explotados en ataques de seguridad.

**Corrección:** usa el bloque antes de liberarlo y asigna `puntaje = NULL;` después del `free`, para que un uso posterior falle de forma predecible.

> **Portabilidad:** GCC 12 o posterior puede avisar de algunos casos simples con `-Wuse-after-free` (incluida en `-Wall`). Es una ayuda del compilador, no una garantía: la mayoría de los casos reales no se detectan al compilar.

### 4. Punteros colgantes después de `free`

Un caso más sutil: un préstamo que sobrevive al dueño. Aquí `nombre` toma prestado un bloque que pertenece a la persona, y la persona se destruye antes de usarlo.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char *nombre;
} Persona;

int main(void) {
    Persona *p = malloc(sizeof *p);
    if (p == NULL) {
        return 1;
    }
    p->nombre = malloc(4);
    if (p->nombre == NULL) {
        free(p);
        return 1;
    }
    strcpy(p->nombre, "Ana");

    char *nombre = p->nombre;      // préstamo
    free(p->nombre);
    free(p);                       // el dueño desaparece
    printf("%s\n", nombre);        // ERROR: nombre es colgante
    return 0;
}
```

**Síntoma:** el mismo que el uso después de liberar; es un uso después de liberar a través de otro puntero.

**Corrección:** un préstamo nunca debe vivir más que el dueño. Usa `nombre` antes de destruir la persona, o haz una copia propia (`duplicar(p->nombre)`) si la necesitas después, y libera esa copia cuando termines.

### 5. Liberar memoria que no vino de `malloc`

Solo se puede pasar a `free` lo que devolvieron `malloc`, `calloc` o `realloc` (o `NULL`). Liberar un arreglo local, una variable global, un literal de cadena o un puntero al *medio* de un bloque es comportamiento indefinido.

<!-- c-check: skip -->

```c
#include <stdlib.h>

int main(void) {
    int valores[3] = { 1, 2, 3 };
    free(valores);                 // ERROR: valores tiene duración automática
    return 0;
}
```

**Síntoma:** en este caso simple el compilador lo detecta: Clang muestra `attempt to call free on non-heap object 'valores' [-Wfree-nonheap-object]` (con `-Werror`, no compila). En casos menos evidentes, por ejemplo `free(p + 1)`, el programa suele abortar al ejecutar.

**Corrección:** libera solo lo que reservaste, y siempre con la dirección exacta que te devolvió la reserva. Si una función recibe un puntero que puede venir de cualquier lado, documenta que *no* lo libera.

### 6. Desborde por uno en el heap

Reservar un byte menos de lo necesario, o recorrer con `<=` en lugar de `<`, escribe fuera del bloque. El ejemplo más típico es olvidar el lugar del terminador `'\0'`.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    const char *nombre = "Ana";
    char *copia = malloc(strlen(nombre));    // ERROR: falta el lugar del '\0'
    if (copia == NULL) {
        return 1;
    }
    strcpy(copia, nombre);                   // escribe 4 bytes en un bloque de 3
    printf("%s\n", copia);
    free(copia);
    return 0;
}
```

**Síntoma:** casi siempre "funciona", porque el byte extra cae en memoria que nadie mira... hasta que pisa los datos internos del montículo y el programa falla en un `malloc` o `free` posterior, en otra parte del código.

**Corrección:** `malloc(strlen(nombre) + 1)`. Para arreglos, recorre con `i < n` y valida los índices.

### 7. Puntero perdido después de `realloc`

```c
#include <stdlib.h>

int main(void) {
    size_t capacidad = 4;
    int *datos = malloc(capacidad * sizeof *datos);
    if (datos == NULL) {
        return 1;
    }
    capacidad *= 2;
    datos = realloc(datos, capacidad * sizeof *datos);   // ERROR si falla
    if (datos == NULL) {
        return 1;                  // el bloque original quedó sin dueño
    }
    free(datos);
    return 0;
}
```

**Síntoma:** mientras `realloc` funciona, ninguno. Cuando falla, devuelve `NULL`, se pierde la única dirección del bloque original y queda una fuga, justo en el momento en que falta memoria.

**Corrección:** el patrón seguro de la lección anterior, con un puntero temporal:

```c
int *nuevo = realloc(datos, capacidad * sizeof *datos);
if (nuevo == NULL) {
    free(datos);                   // datos sigue siendo válido: lo liberamos
    return 1;
}
datos = nuevo;
```

## Detectar errores con AddressSanitizer

Como la mayoría de estos errores compilan, hace falta una herramienta que los busque **mientras el programa corre**. **AddressSanitizer** (ASan) agrega controles a cada acceso a memoria y avisa en el momento exacto del error. Se activa al compilar:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=address programa.c -o programa
./programa
```

- `-fsanitize=address` agrega los controles.
- `-g` agrega información de depuración, para que el informe muestre archivo y línea.

El programa corre más lento y usa más memoria, así que se usa durante el desarrollo y las pruebas, no en la versión que se entrega.

> **Portabilidad:** AddressSanitizer es una herramienta de GCC y Clang, no parte del estándar C. Funciona en Linux, macOS y Windows (con Clang o MSVC), con distinto grado de soporte.

### Leer el informe de un uso después de liberar

Con el programa del error 3, ASan detiene la ejecución e imprime algo así (las direcciones cambian en cada ejecución):

```
==1572==ERROR: AddressSanitizer: heap-use-after-free on address 0x602000000950
READ of size 4 at 0x602000000950 thread T0
    #0 0x0001021988dc in main programa.c:11

0x602000000950 is located 0 bytes inside of 4-byte region [0x602000000950,0x602000000954)
freed by thread T0 here:
    #0 0x000102911368 in free
    #1 0x00010219888c in main programa.c:10

previously allocated by thread T0 here:
    #0 0x000102911274 in malloc
    #1 0x000102198804 in main programa.c:5

SUMMARY: AddressSanitizer: heap-use-after-free programa.c:11 in main
```

Se lee de arriba hacia abajo y responde tres preguntas:

1. **Qué pasó:** `heap-use-after-free`, una lectura (`READ of size 4`) en `programa.c:11`.
2. **Cuándo se liberó:** la sección `freed by thread T0 here`, con la línea del `free` (10).
3. **Dónde se reservó:** la sección `previously allocated by`, con la línea del `malloc` (5).

Con esas tres líneas sabes qué bloque es, quién lo liberó y quién lo usó después: casi siempre alcanza para entender cuál de los dos violó la propiedad.

### Otros informes

- **Doble liberación** (error 2): `AddressSanitizer: attempting double-free on 0x...`, seguido de dónde se liberó la primera vez y dónde se reservó.
- **Desborde** (error 6): `AddressSanitizer: heap-buffer-overflow`, `WRITE of size 4` y la frase `located 0 bytes after 3-byte region`, que dice que escribiste justo después del final de un bloque de 3 bytes.
- **Fugas** (error 1): las detecta **LeakSanitizer**, que viene con ASan y revisa la memoria al terminar el programa:

```
==2210==ERROR: LeakSanitizer: detected memory leaks

Direct leak of 96 byte(s) in 3 object(s) allocated from:
    #0 0x7f3a2c4b in malloc
    #1 0x55d1a0e2 in main programa.c:6

SUMMARY: AddressSanitizer: 96 byte(s) leaked in 3 allocation(s).
```

`Direct leak` indica bloques cuya dirección ya no tiene nadie; la línea `programa.c:6` es el `malloc` que nunca se liberó, y `SUMMARY` da el total.

> **Portabilidad:** LeakSanitizer no está disponible en todas las plataformas. En Linux viene activado con ASan; en macOS, el Clang de Apple no lo soporta (`detect_leaks is not supported on this platform`). Alternativas: en Linux, `valgrind --leak-check=full ./programa` (sin recompilar con sanitizers); en macOS, la herramienta `leaks --atExit -- ./programa` que viene con las herramientas de desarrollo de Xcode.

Un sanitizer solo encuentra los errores de los caminos que efectivamente se ejecutan. Por eso conviene correrlo con varias entradas, incluyendo los casos de error.

## Resumen

- Cada bloque tiene **exactamente un dueño** en cada momento; los demás solo lo toman prestado.
- Documenta la propiedad en el comentario de cada función que recibe o devuelve memoria.
- Para objetos con partes, usa pares `crear_...` / `destruir_...`; `destruir_...` acepta `NULL` y libera en orden inverso.
- Una función que falla deshace lo que reservó; una función que transfiere la propiedad dice qué pasa en caso de fallo.
- Errores clásicos: fuga, doble liberación, uso después de liberar, préstamo colgante, liberar lo que no vino de `malloc`, desborde por uno, `p = realloc(p, ...)`.
- Compila tus pruebas con `-g -fsanitize=address` y aprende a leer el informe.

## Ejercicios prácticos

### Ejercicio 1: encuentra el error

¿Qué error de memoria tiene esta función y cómo se corrige?

```c
#include <stdlib.h>

// Devuelve la suma de los primeros n cuadrados.
long long suma_de_cuadrados(size_t n) {
    long long *cuadrados = malloc(n * sizeof *cuadrados);
    if (cuadrados == NULL) {
        return -1;
    }
    long long suma = 0;
    for (size_t i = 0; i < n; i++) {
        cuadrados[i] = (long long)(i * i);
        suma += cuadrados[i];
    }
    return suma;
}
```

<details><summary>Ver solución</summary>

Es una **fuga de memoria**: la función es dueña de `cuadrados` y nunca lo libera. Hay que llamar a `free(cuadrados);` antes del `return suma;`. Mejor aún: el arreglo no hace falta, porque la suma se puede acumular directamente sin reservar nada.

</details>

### Ejercicio 2: ¿quién debe liberar?

Para cada función, indica quién es el dueño del bloque al terminar la llamada y quién debe liberarlo.

1. `char *leer_linea(void);` — "Devuelve una línea nueva leída de la entrada."
2. `size_t contar_vocales(const char *texto);`
3. `bool lista_agregar(Lista *l, char *texto);` — "Si devuelve true, la lista se queda con texto."

<details><summary>Ver solución</summary>

1. El **llamador** es dueño de la línea devuelta y debe liberarla con `free` (o la función de destrucción que documente).
2. `contar_vocales` solo **toma prestado** `texto` (`const char *`); el dueño sigue siendo quien lo pasó.
3. Depende del resultado: con `true`, la **lista** es la nueva dueña y lo liberará al vaciarse; con `false`, el **llamador** sigue siendo dueño y debe liberarlo.

</details>

### Ejercicio 3: arregla la fuga en el camino de error

Esta función reserva dos arreglos. ¿Qué pasa si falla la segunda reserva? Corrígela.

<!-- c-check: skip -->

```c
bool preparar(size_t n, int **a, int **b) {
    *a = malloc(n * sizeof **a);
    *b = malloc(n * sizeof **b);
    if (*a == NULL || *b == NULL) {
        return false;
    }
    return true;
}
```

<details><summary>Ver solución</summary>

Si la primera reserva funciona y la segunda falla, la función devuelve `false` y el llamador, que entiende "falló", no libera `*a`: fuga. Una función que falla debe deshacer lo que reservó:

```c
bool preparar(size_t n, int **a, int **b) {
    *a = malloc(n * sizeof **a);
    if (*a == NULL) {
        return false;
    }
    *b = malloc(n * sizeof **b);
    if (*b == NULL) {
        free(*a);
        *a = NULL;
        return false;
    }
    return true;
}
```

</details>

### Ejercicio 4: interpreta el informe

AddressSanitizer imprime este resumen. ¿Qué tipo de error es y qué buscarías en las líneas 14 y 9?

```
ERROR: AddressSanitizer: heap-use-after-free on address 0x6020000000f0
READ of size 8 at 0x6020000000f0 thread T0
    #0 in imprimir_lista lista.c:14
freed by thread T0 here:
    #1 in eliminar_nodo lista.c:9
```

<details><summary>Ver solución</summary>

Es un **uso después de liberar**: en `lista.c:14`, `imprimir_lista` lee 8 bytes (probablemente un puntero al siguiente nodo) de un bloque que `eliminar_nodo` liberó en la línea 9. Hay que revisar si `eliminar_nodo` deja algún puntero (por ejemplo, el `siguiente` del nodo anterior) apuntando al nodo liberado, o si se libera el nodo antes de leer su campo `siguiente`.

</details>

### Ejercicio 5: escribe el par crear/destruir

Escribe `Vector *crear_vector(size_t capacidad)` y `void destruir_vector(Vector *v)` para `typedef struct { int *datos; size_t capacidad; } Vector;`. `crear_vector` reserva la estructura y el arreglo (en cero) y no deja fugas si algo falla; `destruir_vector` acepta `NULL`. Úsalas desde `main`.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int *datos;
    size_t capacidad;
} Vector;

// Propiedad: el llamador es dueño del resultado y lo libera con
// destruir_vector. Devuelve NULL si no hay memoria.
Vector *crear_vector(size_t capacidad) {
    Vector *v = malloc(sizeof *v);
    if (v == NULL) {
        return NULL;
    }
    v->datos = calloc(capacidad, sizeof *v->datos);
    if (v->datos == NULL) {
        free(v);
        return NULL;
    }
    v->capacidad = capacidad;
    return v;
}

void destruir_vector(Vector *v) {
    if (v == NULL) {
        return;
    }
    free(v->datos);
    free(v);
}

int main(void) {
    Vector *v = crear_vector(10);
    if (v == NULL) {
        return 1;
    }
    v->datos[3] = 7;
    printf("%d %d\n", v->datos[0], v->datos[3]);
    destruir_vector(v);
    return 0;
}
```

</details>
