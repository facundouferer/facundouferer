---
title: 'Concurrencia: threads y atomics'
course: 'c'
slug: 'concurrencia-threads-y-atomics'
order: 40
lang: 'es'
published: true
---

> **Ruta opcional de profundización.** Esta lección cierra el módulo avanzado *C moderno y C23* y es una especialización: no hace falta para el resto del curso. La concurrencia es uno de los temas más difíciles de la programación; tómala cuando domines punteros, memoria y depuración.

Hasta ahora, cada programa hacía una cosa por vez: una instrucción después de otra. Un programa **concurrente** tiene varios hilos de ejecución que avanzan al mismo tiempo y **comparten la memoria**. Eso permite aprovechar varios núcleos del procesador, pero abre una clase de errores nueva: errores que aparecen una vez de cada mil, cambian de una ejecución a otra y desaparecen cuando intentas observarlos. En esta lección aprendes las herramientas de C para trabajar con hilos y, sobre todo, a evitar esos errores.

## Objetivos

- Distinguir concurrencia de paralelismo y entender qué comparten los hilos.
- Reconocer una **condición de carrera** y por qué una carrera de datos es comportamiento indefinido.
- Crear y esperar hilos con `<threads.h>` (C11, opcional) y con POSIX `pthread`.
- Proteger datos compartidos con un mutex y con operaciones atómicas (`<stdatomic.h>`).
- Conocer las variables de condición.
- Detectar carreras con ThreadSanitizer, evitar interbloqueos y decidir cuándo **no** usar hilos.

**Requisitos previos:** `punteros-arreglos-y-estructuras` (punteros a función y `void *`), `duracion-y-ciclo-de-vida`, `memoria-dinamica`, `depuracion-y-sanitizers` y `c23-moderno`.

## Concurrencia y paralelismo

- **Concurrencia:** varias tareas están **en curso** al mismo tiempo. Pueden turnarse en un solo núcleo: el sistema operativo ejecuta un poco de una, luego un poco de otra.
- **Paralelismo:** varias tareas se ejecutan **en el mismo instante**, en núcleos distintos.

La concurrencia es una forma de **organizar** el programa; el paralelismo es una forma de **ejecutarlo**. Un programa concurrente puede correr en paralelo si hay varios núcleos, pero debe ser correcto en ambos casos.

Un **hilo** (*thread*) es una secuencia de ejecución dentro de un proceso. Todos los hilos de un proceso **comparten** las variables globales, las variables `static` y la memoria dinámica. Cada hilo tiene **su propia pila**: sus variables locales y sus parámetros son suyos. Esa es la fuente de todo: lo que es compartido y se modifica necesita protección.

## Un ejemplo: la condición de carrera

Dos hilos incrementan un mismo contador un millón de veces cada uno. El resultado debería ser 2 000 000. Usamos POSIX `pthread`, disponible en Linux y macOS; más abajo verás la versión estándar.

```c
#include <stdio.h>
#include <pthread.h>

static long contador = 0; // compartido por los dos hilos

static void *incrementar(void *arg) {
    (void)arg;
    for (int i = 0; i < 1000000; i++) {
        contador++; // carrera de datos: dos hilos modifican sin protección
    }
    return NULL;
}

int main(void) {
    pthread_t a;
    pthread_t b;
    if (pthread_create(&a, NULL, incrementar, NULL) != 0) {
        return 1;
    }
    if (pthread_create(&b, NULL, incrementar, NULL) != 0) {
        pthread_join(a, NULL);
        return 1;
    }
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("contador = %ld\n", contador);
    return 0;
}
```

Compila con `-pthread`, que agrega lo necesario para hilos al compilar y al enlazar:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -pthread contador.c -o contador
```

Tres ejecuciones seguidas pueden mostrar `contador = 1328153`, `contador = 1117138` y `contador = 1786290`. Casi nunca 2 000 000.

¿Por qué? Porque `contador++` no es una sola operación. El procesador hace tres pasos: **leer** el valor, **sumarle** 1 y **escribirlo**. Si los dos hilos leen 41 a la vez, los dos escriben 42, y se perdió un incremento:

| Hilo A | Hilo B | `contador` |
| --- | --- | --- |
| lee 41 | | 41 |
| | lee 41 | 41 |
| suma: 42 | | 41 |
| | suma: 42 | 41 |
| escribe 42 | | 42 |
| | escribe 42 | 42 |

Una **condición de carrera** es un error en el que el resultado depende del orden (impredecible) en que se intercalan los hilos. Cuando además dos hilos acceden a la misma variable sin sincronización y al menos uno escribe, hay una **carrera de datos** (*data race*), y en C eso es **comportamiento indefinido**: no solo se pueden perder incrementos, el compilador puede optimizar el código suponiendo que la carrera no existe y producir cualquier resultado.

## Hilos estándar: `<threads.h>`

C11 agregó al estándar una biblioteca de hilos, `<threads.h>`:

| Función | Para qué |
| --- | --- |
| `thrd_create(&hilo, funcion, arg)` | crea un hilo que ejecuta `int funcion(void *arg)` |
| `thrd_join(hilo, &resultado)` | espera a que el hilo termine y recoge su valor de retorno |
| `mtx_init(&m, mtx_plain)` / `mtx_destroy(&m)` | crea y destruye un mutex |
| `mtx_lock(&m)` / `mtx_unlock(&m)` | toma y suelta el mutex |
| `cnd_wait`, `cnd_signal`, `cnd_broadcast` | variables de condición |

Las funciones devuelven `thrd_success` si todo salió bien. Este es el contador corregido con un **mutex** (*mutual exclusion*): solo un hilo a la vez puede tenerlo tomado, así que el incremento queda protegido.

<!-- c-check: skip -->
```c
#include <stdio.h>
#include <threads.h>

static long contador = 0;
static mtx_t candado;

static int incrementar(void *arg) {
    (void)arg;
    for (int i = 0; i < 1000000; i++) {
        mtx_lock(&candado);
        contador++; // sección crítica
        mtx_unlock(&candado);
    }
    return 0;
}

int main(void) {
    if (mtx_init(&candado, mtx_plain) != thrd_success) {
        return 1;
    }
    thrd_t a;
    thrd_t b;
    if (thrd_create(&a, incrementar, NULL) != thrd_success) {
        return 1;
    }
    if (thrd_create(&b, incrementar, NULL) != thrd_success) {
        thrd_join(a, NULL);
        return 1;
    }
    thrd_join(a, NULL);
    thrd_join(b, NULL);
    mtx_destroy(&candado);
    printf("contador = %ld\n", contador);
    return 0;
}
```

Este programa lleva la marca de ejemplo no compilado porque necesita `<threads.h>`, y no todas las plataformas lo tienen.

> **Portabilidad:** `<threads.h>` es **opcional** desde C11: una implementación puede no ofrecerlo, y en ese caso define la macro `__STDC_NO_THREADS__`. glibc lo incluye desde la versión 2.28 (Linux); macOS, al momento de escribir esta lección, **no** lo tiene (define `__STDC_NO_THREADS__`). Por eso, en la práctica, la alternativa más disponible es POSIX `pthread` en Linux y macOS, y la API de hilos de Windows en Windows. Puedes comprobarlo en el código con `#ifdef __STDC_NO_THREADS__` o `__has_include(<threads.h>)`.

## La misma solución con `pthread`

POSIX `pthread` no es parte del estándar C sino del estándar POSIX, pero está disponible en Linux, macOS y otros sistemas tipo Unix. Las ideas son las mismas; cambian los nombres:

| `<threads.h>` (C11) | `<pthread.h>` (POSIX) |
| --- | --- |
| `thrd_t`, `thrd_create`, `thrd_join` | `pthread_t`, `pthread_create`, `pthread_join` |
| función `int f(void *)` | función `void *f(void *)` |
| `mtx_t`, `mtx_lock`, `mtx_unlock` | `pthread_mutex_t`, `pthread_mutex_lock`, `pthread_mutex_unlock` |
| `cnd_t`, `cnd_wait`, `cnd_signal` | `pthread_cond_t`, `pthread_cond_wait`, `pthread_cond_signal` |

```c
#include <stdio.h>
#include <pthread.h>

static long contador = 0;
static pthread_mutex_t candado = PTHREAD_MUTEX_INITIALIZER;

static void *incrementar(void *arg) {
    (void)arg;
    for (int i = 0; i < 1000000; i++) {
        pthread_mutex_lock(&candado);
        contador++; // sección crítica
        pthread_mutex_unlock(&candado);
    }
    return NULL;
}

int main(void) {
    pthread_t a;
    pthread_t b;
    if (pthread_create(&a, NULL, incrementar, NULL) != 0) {
        return 1;
    }
    if (pthread_create(&b, NULL, incrementar, NULL) != 0) {
        pthread_join(a, NULL);
        return 1;
    }
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("contador = %ld\n", contador);
    return 0;
}
```

Ahora imprime siempre `contador = 2000000`. La parte del código entre `lock` y `unlock` se llama **sección crítica**: mantenla tan corta como puedas, porque mientras un hilo la ejecuta, los demás esperan.

## Pasar datos a un hilo

La función de un hilo recibe un único `void *`. Para pasarle varios datos, se agrupan en una estructura y se pasa su dirección. El mejor diseño es que cada hilo trabaje sobre **su propia parte** de los datos: si nada se comparte para escribir, no hace falta sincronizar.

```c
#include <stdio.h>
#include <pthread.h>

#define CANTIDAD 1000
#define HILOS 4

typedef struct {
    const int *datos;
    size_t desde;
    size_t hasta;
    long suma; // cada hilo escribe solo la suya
} Tramo;

static void *sumar_tramo(void *arg) {
    Tramo *t = arg;
    t->suma = 0;
    for (size_t i = t->desde; i < t->hasta; i++) {
        t->suma += t->datos[i];
    }
    return NULL;
}

int main(void) {
    static int numeros[CANTIDAD];
    for (size_t i = 0; i < CANTIDAD; i++) {
        numeros[i] = (int)i + 1;
    }

    pthread_t hilos[HILOS];
    Tramo tramos[HILOS];
    size_t paso = CANTIDAD / HILOS;
    for (size_t h = 0; h < HILOS; h++) {
        tramos[h] = (Tramo){ numeros, h * paso, (h == HILOS - 1) ? CANTIDAD : (h + 1) * paso, 0 };
        if (pthread_create(&hilos[h], NULL, sumar_tramo, &tramos[h]) != 0) {
            for (size_t k = 0; k < h; k++) {
                pthread_join(hilos[k], NULL);
            }
            return 1;
        }
    }

    long total = 0;
    for (size_t h = 0; h < HILOS; h++) {
        pthread_join(hilos[h], NULL);
        total += tramos[h].suma; // seguro: el hilo ya terminó
    }
    printf("total = %ld\n", total);
    return 0;
}
```

Imprime `total = 500500`. Dos detalles de vida útil, que viste en `duracion-y-ciclo-de-vida`: `tramos` debe seguir vivo mientras los hilos lo usan (aquí vive hasta el final de `main`), y leer `tramos[h].suma` es seguro solo **después** de `pthread_join`, que garantiza que el hilo terminó y que sus escrituras son visibles.

## Operaciones atómicas: `<stdatomic.h>`

Para algo tan simple como un contador, un mutex es demasiado. C11 agregó `<stdatomic.h>`: tipos y operaciones **atómicas**, que se ejecutan como un paso indivisible, sin que otro hilo vea un estado intermedio.

```c
#include <stdio.h>
#include <pthread.h>
#include <stdatomic.h>

static atomic_int contador = 0;

static void *incrementar(void *arg) {
    (void)arg;
    for (int i = 0; i < 1000000; i++) {
        atomic_fetch_add(&contador, 1); // leer, sumar y escribir en un solo paso
    }
    return NULL;
}

int main(void) {
    pthread_t a;
    pthread_t b;
    if (pthread_create(&a, NULL, incrementar, NULL) != 0) {
        return 1;
    }
    if (pthread_create(&b, NULL, incrementar, NULL) != 0) {
        pthread_join(a, NULL);
        return 1;
    }
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("contador = %d\n", atomic_load(&contador));
    return 0;
}
```

Imprime siempre `contador = 2000000`, sin mutex.

- `atomic_int` es un `int` atómico (también existen `atomic_long`, `atomic_bool` y `_Atomic(T)` para otros tipos).
- `atomic_fetch_add(&x, n)` suma `n` y devuelve el valor anterior; `atomic_load` y `atomic_store` leen y escriben de forma atómica.
- Sobre un `atomic_int`, incluso `contador++` es atómico. Escribir `atomic_fetch_add` hace la intención visible a quien lee.
- Por defecto, estas operaciones usan el orden de memoria más fuerte (`memory_order_seq_cst`), que es el más fácil de razonar. Los órdenes más débiles existen para optimizar, y son terreno de expertos.

Un atómico protege **una** variable. Si necesitas mantener coherentes **varias** variables a la vez (por ejemplo, el saldo de dos cuentas), necesitas un mutex.

> **Portabilidad:** `<stdatomic.h>` también es **opcional** desde C11 (si falta, se define `__STDC_NO_ATOMICS__`), pero GCC y Clang lo ofrecen en las plataformas comunes, y funciona igual con hilos de `<threads.h>` o de `pthread`.

## Variables de condición

A veces un hilo no necesita solo exclusión, sino **esperar a que algo ocurra**: que haya un elemento en una cola, que otro hilo termine una etapa. Hacerlo con un ciclo que pregunta sin parar desperdicia el procesador. Una **variable de condición** permite dormir hasta que otro hilo avise:

<!-- c-check: skip -->
```c
// Consumidor: espera hasta que haya datos.
mtx_lock(&candado);
while (cantidad == 0) {         // siempre en un while, no en un if
    cnd_wait(&hay_datos, &candado); // suelta el mutex, duerme, y lo vuelve a tomar al despertar
}
int dato = cola[--cantidad];
mtx_unlock(&candado);

// Productor: agrega un dato y avisa.
mtx_lock(&candado);
cola[cantidad++] = nuevo;
cnd_signal(&hay_datos);
mtx_unlock(&candado);
```

La condición se vuelve a comprobar en un `while` porque un hilo puede despertar sin que la condición se cumpla (*despertar espurio*) o porque otro hilo llegó antes. Con `pthread`, las funciones equivalentes son `pthread_cond_wait` y `pthread_cond_signal`.

## Detectar carreras: ThreadSanitizer

Una carrera de datos puede no manifestarse en tus pruebas y aparecer en producción. Igual que AddressSanitizer para la memoria (lo viste en `depuracion-y-sanitizers`), **ThreadSanitizer** instrumenta el programa y detecta carreras de datos **cuando ocurren** durante la ejecución:

```bash
gcc -std=c23 -Wall -Wextra -g -pthread -fsanitize=thread contador.c -o contador
./contador
```

Con el primer programa de la lección (el contador sin protección), el informe empieza con `WARNING: ThreadSanitizer: data race` y muestra las dos líneas en conflicto (`contador++` en los dos hilos) con la pila de llamadas de cada acceso.

- `-fsanitize=thread` no se puede combinar con `-fsanitize=address`: son dos compilaciones distintas.
- Hace el programa varias veces más lento y gasta más memoria; es para pruebas, no para producción.
- Solo detecta carreras que **ocurren** en esa ejecución: si un camino del código no se ejecuta, no se revisa.

> **Portabilidad:** ThreadSanitizer está disponible en GCC y Clang en Linux de 64 bits, y en Clang en macOS. No es parte del estándar C: es una herramienta del compilador.

## Interbloqueo y orden de los candados

Un **interbloqueo** (*deadlock*) ocurre cuando dos hilos se esperan mutuamente para siempre. El caso clásico: dos mutex tomados en orden opuesto.

<!-- c-check: skip -->
```c
// Hilo 1: transferir de A a B        // Hilo 2: transferir de B a A
mtx_lock(&cuenta_a.candado);          mtx_lock(&cuenta_b.candado);
mtx_lock(&cuenta_b.candado); // espera   mtx_lock(&cuenta_a.candado); // espera
```

El hilo 1 tiene A y espera B; el hilo 2 tiene B y espera A. Ninguno avanza nunca.

La regla que lo evita: **todos los hilos toman los candados en el mismo orden global**. Por ejemplo, siempre primero la cuenta de número menor:

<!-- c-check: skip -->
```c
void transferir(Cuenta *origen, Cuenta *destino, long monto) {
    Cuenta *primera = origen->numero < destino->numero ? origen : destino;
    Cuenta *segunda = origen->numero < destino->numero ? destino : origen;
    mtx_lock(&primera->candado);
    mtx_lock(&segunda->candado);
    origen->saldo -= monto;
    destino->saldo += monto;
    mtx_unlock(&segunda->candado);
    mtx_unlock(&primera->candado);
}
```

Otras reglas útiles: no llames a funciones desconocidas (callbacks) con un candado tomado, mantén las secciones críticas cortas, y si una función toma un candado, que lo suelte en **todos** sus caminos de salida, incluidos los de error.

## Cuándo no usar hilos

Los hilos agregan complejidad y errores difíciles de reproducir. Antes de usarlos, pregúntate:

- **¿El programa es lento por cálculo?** Si pasa la mayor parte del tiempo esperando disco o red, más hilos no lo aceleran tanto como esperas; a veces conviene E/S asíncrona o varios procesos.
- **¿El trabajo se puede dividir en partes independientes?** Si cada paso necesita el resultado del anterior, no hay nada que paralelizar.
- **¿La tarea es pequeña?** Crear un hilo cuesta tiempo; para sumar cien números, un ciclo simple es más rápido.
- **¿Mediste?** Optimiza solo lo que una medición señala como lento.
- **¿Hay una alternativa más simple?** Varios procesos independientes (cada uno con su memoria) o una biblioteca que ya resuelva el paralelismo evitan compartir memoria.

Si decides usarlos: comparte lo mínimo, prefiere que cada hilo trabaje sobre sus propios datos, protege todo lo compartido con un mutex o un atómico, y prueba con ThreadSanitizer.

## Errores comunes

- Modificar una variable compartida sin protección "porque es solo un `++`".
- Olvidar `pthread_join` (o `thrd_join`) y leer los resultados antes de que el hilo termine, o terminar `main` con hilos aún en marcha.
- Pasar a un hilo la dirección de una variable local que deja de existir antes de que el hilo la use.
- Usar un `if` en lugar de un `while` alrededor de `cnd_wait`.
- Tomar dos candados en distinto orden en distintos lugares del código.
- Usar `volatile` para sincronizar hilos: en C, `volatile` **no** hace atómica ninguna operación ni evita carreras de datos.
- Suponer que `<threads.h>` existe en todas las plataformas.

## Resumen

- Los hilos comparten globales, `static` y memoria dinámica; cada uno tiene su pila.
- Una **condición de carrera** hace que el resultado dependa del intercalado; una carrera de datos es **comportamiento indefinido**.
- `<threads.h>` (C11, **opcional**) ofrece `thrd_create`, `thrd_join`, `mtx_lock`, `mtx_unlock` y variables de condición; POSIX `pthread` es la alternativa más disponible (Linux y macOS), compilando con `-pthread`.
- Un mutex protege una sección crítica; `atomic_int` y `atomic_fetch_add` protegen una sola variable sin mutex.
- ThreadSanitizer (`-fsanitize=thread`) detecta carreras durante la ejecución.
- Evita interbloqueos tomando los candados siempre en el mismo orden.
- Usa hilos solo cuando el trabajo se divide en partes independientes y una medición lo justifica.

## Ejercicios prácticos

### Ejercicio 1: ¿cuánto puede valer?

En el primer programa de la lección (dos hilos, un millón de `contador++` cada uno, sin protección), ¿puede el resultado ser mayor que 2 000 000? ¿Y exactamente 2 000 000? ¿Qué dice el estándar C?

<details><summary>Ver solución</summary>

Con el modelo de "leer, sumar, escribir", los incrementos solo se pueden **perder**, así que en la práctica el resultado no supera 2 000 000 y a veces (rara vez) lo alcanza. Pero el estándar dice algo más fuerte: el programa tiene una carrera de datos, y eso es **comportamiento indefinido**. El estándar no garantiza ningún resultado, ni siquiera que el programa termine bien. Por eso no se razona "cuánto se pierde": se elimina la carrera.

</details>

### Ejercicio 2: protege el acumulador

Este programa suma los números del 1 al 1000 con cuatro hilos que acumulan en una variable global. Corrígelo con un mutex de `pthread`, y luego piensa una versión que no necesite ninguna sincronización dentro del ciclo.

<!-- c-check: skip -->
```c
static long total = 0;

static void *sumar(void *arg) {
    Tramo *t = arg;
    for (int i = t->desde; i <= t->hasta; i++) {
        total += i;
    }
    return NULL;
}
```

<details><summary>Ver solución</summary>

Con un mutex, la suma a `total` queda en una sección crítica:

<!-- c-check: skip -->
```c
static long total = 0;
static pthread_mutex_t candado = PTHREAD_MUTEX_INITIALIZER;

static void *sumar(void *arg) {
    Tramo *t = arg;
    for (int i = t->desde; i <= t->hasta; i++) {
        pthread_mutex_lock(&candado);
        total += i;
        pthread_mutex_unlock(&candado);
    }
    return NULL;
}
```

Funciona, pero los hilos pasan casi todo el tiempo esperando el candado. La versión mejor acumula en una variable **local** y toma el candado **una sola vez** al final, o, como en el ejemplo `sumar_tramo` de la lección, guarda la suma parcial en el `Tramo` de cada hilo y `main` las suma después de `pthread_join`, sin ningún mutex.

</details>

### Ejercicio 3: contador atómico de pares

Escribe un programa con `pthread` en el que dos hilos recorren cada uno la mitad de un arreglo de enteros y cuentan, en un `atomic_int` compartido, cuántos son pares. El arreglo tiene los números del 1 al 100. El resultado debe ser 50.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>
#include <pthread.h>
#include <stdatomic.h>

#define N 100

static int numeros[N];
static atomic_int pares = 0;

typedef struct {
    size_t desde;
    size_t hasta;
} Mitad;

static void *contar_pares(void *arg) {
    const Mitad *m = arg;
    for (size_t i = m->desde; i < m->hasta; i++) {
        if (numeros[i] % 2 == 0) {
            atomic_fetch_add(&pares, 1);
        }
    }
    return NULL;
}

int main(void) {
    for (size_t i = 0; i < N; i++) {
        numeros[i] = (int)i + 1;
    }
    Mitad primera = { 0, N / 2 };
    Mitad segunda = { N / 2, N };
    pthread_t a;
    pthread_t b;
    if (pthread_create(&a, NULL, contar_pares, &primera) != 0) {
        return 1;
    }
    if (pthread_create(&b, NULL, contar_pares, &segunda) != 0) {
        pthread_join(a, NULL);
        return 1;
    }
    pthread_join(a, NULL);
    pthread_join(b, NULL);
    printf("pares = %d\n", atomic_load(&pares));
    return 0;
}
```

El arreglo `numeros` también es compartido, pero los hilos solo lo **leen** después de que `main` lo llenó antes de crearlos: lecturas concurrentes sin escrituras no son una carrera de datos.

</details>

### Ejercicio 4: encuentra el interbloqueo

Un programa tiene dos funciones que pueden ejecutarse en hilos distintos. ¿Puede bloquearse? ¿Cómo lo corriges?

<!-- c-check: skip -->
```c
void registrar_venta(void) {
    mtx_lock(&candado_stock);
    mtx_lock(&candado_caja);
    // ...
    mtx_unlock(&candado_caja);
    mtx_unlock(&candado_stock);
}

void devolver_producto(void) {
    mtx_lock(&candado_caja);
    mtx_lock(&candado_stock);
    // ...
    mtx_unlock(&candado_stock);
    mtx_unlock(&candado_caja);
}
```

<details><summary>Ver solución</summary>

Sí. Si un hilo ejecuta `registrar_venta` y toma `candado_stock` mientras otro ejecuta `devolver_producto` y toma `candado_caja`, cada uno espera el candado que tiene el otro: interbloqueo. La corrección es fijar un orden global, por ejemplo "siempre `candado_stock` antes que `candado_caja`", y hacer que `devolver_producto` lo respete:

<!-- c-check: skip -->
```c
void devolver_producto(void) {
    mtx_lock(&candado_stock);
    mtx_lock(&candado_caja);
    // ...
    mtx_unlock(&candado_caja);
    mtx_unlock(&candado_stock);
}
```

</details>

### Ejercicio 5: ¿hilos o no?

Para cada caso, decide si usarías hilos y por qué: (a) un programa que lee un archivo de configuración de 20 líneas; (b) aplicar un filtro a cada píxel de una imagen de 8000 × 6000; (c) calcular los primeros mil términos de una sucesión donde cada término depende del anterior.

<details><summary>Ver solución</summary>

- (a) **No.** El trabajo es mínimo; crear hilos costaría más que leer el archivo, y agrega complejidad sin beneficio.
- (b) **Sí, probablemente.** Hay mucho cálculo y cada píxel (o cada franja de filas) es independiente: cada hilo procesa su franja sin compartir datos de escritura. Conviene medir para elegir la cantidad de hilos.
- (c) **No.** Cada término necesita el anterior: el trabajo es secuencial por naturaleza y no hay nada que repartir.

</details>
