---
title: 'Duración de almacenamiento y ciclo de vida'
course: 'c'
slug: 'duracion-y-ciclo-de-vida'
description: 'Distingue la duración de almacenamiento automática, estática y dinámica, el tiempo de vida de cada objeto y cómo evitar punteros colgantes.'
order: 27
lang: 'es'
published: true
---

En las dos lecciones anteriores aprendiste que un puntero guarda la dirección de un objeto. Falta una pregunta igual de importante: **¿durante cuánto tiempo existe ese objeto?** Un puntero solo es útil mientras el objeto al que apunta sigue vivo. Cuando el objeto deja de existir, la dirección sigue guardada en el puntero, pero ya no significa nada.

## Objetivos

- Entender qué es el **tiempo de vida** de un objeto.
- Distinguir la **duración automática**, la **duración estática**, la duración asignada y la duración de hilo.
- Usar la pila (stack) y el montículo (heap) como modelos para razonar sobre la memoria, sabiendo que el estándar no los exige.
- Reconocer un **puntero colgante** y explicar por qué usarlo es **comportamiento indefinido**.
- Elegir una alternativa correcta: devolver por valor, usar un búfer del llamador o, con cuidado, `static`.

**Requisitos previos:** `sentencia-switch-y-bloques-de-codigo` (bloques y alcance), `variables-parametros-y-pasaje` (variables locales y globales), `punteros-y-direcciones` y `punteros-arreglos-y-estructuras`.

## Objetos y tiempo de vida

En C, un **objeto** es una región de memoria que guarda un valor: una variable `int`, un arreglo, una estructura. Cada objeto tiene un **tiempo de vida**: el intervalo de la ejecución durante el cual el objeto existe, tiene una dirección fija y conserva el último valor que se le guardó.

El tiempo de vida depende de la **duración de almacenamiento** del objeto, y la duración depende de *dónde* y *cómo* se declara. C define cuatro:

| Duración | Qué objetos la tienen | Empieza | Termina |
| --- | --- | --- | --- |
| Automática | variables locales y parámetros | al entrar al bloque | al salir del bloque (la llave de cierre) |
| Estática | variables globales y locales `static` | antes de que empiece `main` | cuando termina el programa |
| Asignada | memoria pedida en tiempo de ejecución | al pedirla | al liberarla |
| De hilo | variables `thread_local` | al crear el hilo | al terminar el hilo |

No confundas **alcance** con **tiempo de vida**. El alcance es una idea del código fuente: *dónde* se puede escribir el nombre de una variable. El tiempo de vida es una idea de la ejecución: *cuándo* existe el objeto. Una variable local `static` tiene alcance de bloque (solo se nombra dentro de su función) pero vive todo el programa.

## Duración automática

Las variables declaradas dentro de un bloque, sin `static`, tienen **duración automática**. Se crean cuando la ejecución entra al bloque y dejan de existir en la llave de cierre `}`. Los parámetros de una función se comportan igual: viven mientras dura esa llamada.

```c
#include <stdio.h>

void mostrar_cuadrado(int n) {
    int cuadrado = n * n;          // nace al entrar a la función
    printf("%d al cuadrado es %d\n", n, cuadrado);
}                                  // n y cuadrado dejan de existir aquí

int main(void) {
    for (int i = 1; i <= 3; i++) {
        int doble = i * 2;         // un objeto nuevo en cada vuelta
        printf("doble de %d: %d\n", i, doble);
    }                              // doble termina al final de cada vuelta
    mostrar_cuadrado(4);
    mostrar_cuadrado(5);           // otra llamada, otros objetos
    return 0;
}
```

Cada llamada a `mostrar_cuadrado` crea su propio `n` y su propio `cuadrado`. Por eso la recursividad funciona: cada llamada recursiva tiene sus propias variables automáticas, independientes de las de las otras llamadas.

Una variable automática **sin inicializar** contiene un valor indeterminado. Leerla antes de asignarle algo es un error: inicializa siempre tus variables locales.

## Duración estática

Las variables globales y las variables locales declaradas con `static` tienen **duración estática**: existen durante toda la ejecución del programa. Se inicializan una sola vez, antes de que empiece `main`, y si no les das un valor inicial empiezan en cero.

```c
#include <stdio.h>

int llamadas_totales = 0;          // global: duración estática

int siguiente_turno(void) {
    static int turno = 0;          // local static: se inicializa una sola vez
    turno++;
    llamadas_totales++;
    return turno;
}

int main(void) {
    printf("Turno %d\n", siguiente_turno());
    printf("Turno %d\n", siguiente_turno());
    printf("Turno %d\n", siguiente_turno());
    printf("Llamadas: %d\n", llamadas_totales);
    return 0;
}
```

Salida:

```
Turno 1
Turno 2
Turno 3
Llamadas: 3
```

`turno` conserva su valor entre llamadas porque no se destruye al salir de la función. Su alcance, en cambio, sigue siendo el bloque de `siguiente_turno`: desde `main` no puedes escribir `turno`.

El inicializador de un objeto con duración estática debe ser una expresión constante: `static int turno = 0;` es válido, `static int turno = n;` (con `n` un parámetro) no lo es.

## Duración asignada

A veces el tamaño de los datos se conoce recién cuando el programa corre, o un objeto tiene que seguir vivo después de que termina la función que lo creó. Para eso existe la **duración asignada**: el programa pide memoria en tiempo de ejecución y decide cuándo devolverla. Las funciones de la biblioteca estándar que lo hacen (`malloc`, `calloc`, `realloc` y `free`) son el tema de la próxima lección, `memoria-dinamica`. Por ahora basta con saber que en esta duración el tiempo de vida no lo marca una llave, sino el propio programa.

## Duración de hilo

Un programa puede ejecutar varios hilos a la vez. Una variable declarada con `thread_local` tiene **duración de hilo**: cada hilo tiene su propia copia, que vive mientras vive ese hilo. La verás en el módulo avanzado de concurrencia; aquí solo la nombramos para completar el mapa.

> **C básico:** hasta C17 la palabra se escribe `_Thread_local` (o `thread_local` si incluyes `<threads.h>`).

> **C moderno (C23):** `thread_local` pasa a ser una palabra clave del lenguaje; no necesitas ningún encabezado.

> **Portabilidad:** `<threads.h>` es opcional en el estándar y no todas las plataformas lo traen; la concurrencia se estudia en el módulo avanzado.

## La pila y el montículo: modelos para razonar

Para explicar las duraciones se suelen usar dos imágenes:

- **La pila (stack):** una zona donde cada llamada a función apila un *marco* con sus variables automáticas y sus parámetros. Al volver de la función, el marco se desapila y esa memoria se reutiliza en la siguiente llamada.
- **El montículo (heap):** una zona de donde se toma la memoria de duración asignada. Los bloques se piden y se devuelven en cualquier orden.

Las variables de duración estática suelen ir en otra zona, preparada al cargar el programa.

<svg viewBox="0 0 640 260" role="img" aria-label="Modelo de memoria: zona estática, pila con marcos de llamadas y montículo con bloques" style="width:100%;height:auto;font-family:var(--font-body)">
  <rect x="10" y="20" width="190" height="220" rx="18" fill="var(--color-surface)" stroke="var(--color-text)" stroke-width="2"/>
  <text x="105" y="48" text-anchor="middle" fill="var(--color-text)" font-size="18">Estática</text>
  <rect x="30" y="70" width="150" height="40" rx="12" fill="var(--color-accent-2)" opacity="0.35"/>
  <text x="105" y="96" text-anchor="middle" fill="var(--color-text)" font-family="monospace" font-size="14">llamadas_totales</text>
  <rect x="30" y="120" width="150" height="40" rx="12" fill="var(--color-accent-2)" opacity="0.35"/>
  <text x="105" y="146" text-anchor="middle" fill="var(--color-text)" font-family="monospace" font-size="14">turno</text>
  <rect x="225" y="20" width="190" height="220" rx="18" fill="var(--color-surface)" stroke="var(--color-text)" stroke-width="2"/>
  <text x="320" y="48" text-anchor="middle" fill="var(--color-text)" font-size="18">Pila (stack)</text>
  <rect x="245" y="180" width="150" height="44" rx="12" fill="var(--color-accent)" opacity="0.3"/>
  <text x="320" y="207" text-anchor="middle" fill="var(--color-text)" font-family="monospace" font-size="14">main: i, doble</text>
  <rect x="245" y="128" width="150" height="44" rx="12" fill="var(--color-accent)" opacity="0.55"/>
  <text x="320" y="155" text-anchor="middle" fill="var(--color-text)" font-family="monospace" font-size="14">f: n, cuadrado</text>
  <text x="320" y="100" text-anchor="middle" fill="var(--color-text)" font-size="13">crece al llamar,</text>
  <text x="320" y="117" text-anchor="middle" fill="var(--color-text)" font-size="13">se libera al volver</text>
  <rect x="440" y="20" width="190" height="220" rx="18" fill="var(--color-surface)" stroke="var(--color-text)" stroke-width="2"/>
  <text x="535" y="48" text-anchor="middle" fill="var(--color-text)" font-size="18">Montículo (heap)</text>
  <rect x="460" y="70" width="70" height="40" rx="12" fill="var(--color-accent-2)" opacity="0.6"/>
  <rect x="540" y="70" width="70" height="40" rx="12" fill="var(--color-text)" opacity="0.12"/>
  <rect x="460" y="120" width="150" height="40" rx="12" fill="var(--color-accent-2)" opacity="0.6"/>
  <text x="535" y="200" text-anchor="middle" fill="var(--color-text)" font-size="13">bloques pedidos y</text>
  <text x="535" y="217" text-anchor="middle" fill="var(--color-text)" font-size="13">devueltos a pedido</text>
</svg>

Son **modelos explicativos**, no reglas del lenguaje. El estándar de C habla de duraciones y tiempos de vida; no exige que exista una pila ni un montículo. Un compilador puede guardar una variable automática solo en un registro, o eliminarla si no la necesita. Razona con la pila y el montículo, pero recuerda que la garantía real es la duración.

## Punteros colgantes

Un **puntero colgante** es un puntero que guarda la dirección de un objeto cuyo tiempo de vida ya terminó. El puntero no cambia, pero el objeto ya no existe: la memoria puede reutilizarse para otra cosa en cualquier momento.

### Devolver la dirección de una variable local

Este es el error más común. La función devuelve la dirección de `resultado`, pero `resultado` tiene duración automática y deja de existir en cuanto la función termina.

<!-- c-check: skip -->

```c
#include <stdio.h>

int *calcular_doble(int n) {
    int resultado = n * 2;
    return &resultado;             // ERROR: resultado muere al volver
}

int main(void) {
    int *p = calcular_doble(21);
    printf("%d\n", *p);            // usa un puntero colgante
    return 0;
}
```

Por suerte, el compilador suele detectarlo:

```
clang: warning: address of stack memory associated with local variable 'resultado' returned [-Wreturn-stack-address]
gcc:   warning: function returns address of local variable [-Wreturn-local-addr]
```

Con `-Werror` esa advertencia se vuelve un error y el programa ni siquiera compila. Es una buena razón para compilar siempre con las advertencias activadas.

### Usar un puntero después de que terminó el bloque

El compilador no siempre puede avisarte. En este programa el puntero sobrevive al bloque donde vivía la variable, y compila sin ninguna advertencia:

```c
#include <stdio.h>

int main(void) {
    int *p = NULL;
    {
        int temporal = 42;
        p = &temporal;
        printf("Dentro del bloque: %d\n", *p);   // correcto: temporal vive
    }                                            // temporal deja de existir
    printf("Fuera del bloque: %d\n", *p);        // ERROR: p es colgante
    return 0;
}
```

La segunda lectura de `*p` es incorrecta aunque compile. Lo mismo ocurre si guardas la dirección de una variable local en una variable global o en una estructura que vive más que esa variable.

## Comportamiento indefinido: por qué "funciona" hoy y falla mañana

Usar un puntero colgante es **comportamiento indefinido**: el estándar no dice qué tiene que pasar. El programa puede imprimir el valor viejo, imprimir basura, terminar con un error o hacer algo totalmente distinto.

Lo peligroso es que muchas veces *parece funcionar*. Si nadie reutilizó todavía esa memoria, el valor viejo sigue ahí y el programa imprime `42`. Pero basta con:

- agregar una llamada a función entre medio (su marco pisa la memoria),
- compilar con optimizaciones (`-O2`), que reorganizan las variables,
- cambiar de compilador o de plataforma,

para que el mismo programa imprima otra cosa. El compilador incluso puede asumir que el comportamiento indefinido nunca ocurre y optimizar en consecuencia. Por eso no se puede "probar" que un programa con comportamiento indefinido es correcto ejecutándolo: hay que razonar sobre los tiempos de vida.

> **Regla:** un puntero es válido solo mientras el objeto al que apunta está vivo. Antes de guardar una dirección, pregúntate quién vive más: el puntero o el objeto.

## Alternativas correctas

### 1. Devolver por valor

Si el resultado es pequeño, devuélvelo como valor. El valor se copia al llamador, así que no importa que la variable local muera. Las estructuras también se pueden devolver por valor:

```c
#include <stdio.h>

struct punto {
    int x;
    int y;
};

struct punto punto_medio(struct punto a, struct punto b) {
    struct punto medio = { (a.x + b.x) / 2, (a.y + b.y) / 2 };
    return medio;                  // se copia el valor, no la dirección
}

int main(void) {
    struct punto a = { 0, 0 };
    struct punto b = { 10, 4 };
    struct punto m = punto_medio(a, b);
    printf("(%d, %d)\n", m.x, m.y);
    return 0;
}
```

### 2. Un búfer que provee el llamador

Si el resultado es un arreglo o una cadena, el llamador crea el arreglo (que vive en *su* marco) y le pasa a la función un puntero y la capacidad. La función escribe allí:

```c
#include <stdio.h>

// Escribe en destino un saludo para nombre. destino debe tener capacidad
// para al menos capacidad caracteres. Devuelve false si no entra.
bool armar_saludo(char *destino, size_t capacidad, const char *nombre) {
    int escritos = snprintf(destino, capacidad, "Hola, %s", nombre);
    return escritos >= 0 && (size_t)escritos < capacidad;
}

int main(void) {
    char saludo[32];               // vive en main, mientras main lo use
    if (armar_saludo(saludo, sizeof saludo, "Ana")) {
        printf("%s\n", saludo);
    }
    return 0;
}
```

`snprintf` funciona como `printf`, pero escribe en un arreglo y nunca pasa de la capacidad indicada; devuelve cuántos caracteres *quería* escribir, así que si ese número no es menor que la capacidad, el texto quedó recortado.

Es el patrón que usan funciones de la biblioteca como `snprintf` y `fgets`: quien llama decide dónde vive el resultado y cuánto mide.

> **C básico:** hasta C17, `bool` requiere `#include <stdbool.h>`.

> **C moderno (C23):** `bool`, `true` y `false` son palabras clave; el encabezado ya no hace falta.

### 3. Una variable local `static` (con cuidado)

Una variable `static` vive todo el programa, así que devolver su dirección no deja un puntero colgante:

```c
#include <stdio.h>

const char *nombre_del_dia(int dia) {
    static char texto[16];
    snprintf(texto, sizeof texto, "Dia %d", dia);
    return texto;                  // válido: texto tiene duración estática
}

int main(void) {
    const char *a = nombre_del_dia(1);
    const char *b = nombre_del_dia(2);
    printf("%s / %s\n", a, b);     // imprime "Dia 2 / Dia 2"
    return 0;
}
```

Funciona, pero tiene desventajas serias:

- **Hay un solo objeto compartido:** cada llamada pisa el resultado anterior. En el ejemplo, `a` y `b` apuntan al mismo arreglo, así que ambos muestran `Dia 2`.
- **No es reentrante:** si dos hilos llaman a la función a la vez, se mezclan los resultados.
- **El tamaño es fijo** y queda reservado aunque no se use.

Úsala solo cuando esas limitaciones no importen. La tercera opción completa, crear un objeto nuevo en cada llamada, necesita duración asignada y la verás en la próxima lección.

## Resumen

- Todo objeto tiene un **tiempo de vida** determinado por su duración de almacenamiento.
- **Duración automática:** variables locales y parámetros; terminan en la llave de cierre de su bloque.
- **Duración estática:** globales y locales `static`; viven todo el programa y se inicializan una vez.
- **Duración asignada:** la decide el programa; próxima lección. **Duración de hilo:** módulo avanzado.
- La pila y el montículo son modelos útiles, no requisitos del estándar.
- Un **puntero colgante** apunta a un objeto muerto; usarlo es **comportamiento indefinido**, aunque parezca funcionar.
- Para devolver resultados: por valor, en un búfer del llamador o, con sus límites, en un `static`.

## Ejercicios prácticos

### Ejercicio 1: clasifica la duración

Indica la duración de almacenamiento de cada objeto: `total`, `contador`, `x`, `i` y `buffer`.

```c
int total = 0;

void procesar(int x) {
    static int contador = 0;
    char buffer[8] = "";
    for (int i = 0; i < x; i++) {
        contador++;
    }
    total += contador + buffer[0];
}
```

<details><summary>Ver solución</summary>

- `total`: duración estática (variable global).
- `contador`: duración estática (local `static`); se inicializa una sola vez y conserva su valor entre llamadas.
- `x`: duración automática (parámetro); vive mientras dura cada llamada.
- `i`: duración automática; vive solo dentro del `for`.
- `buffer`: duración automática; vive hasta la llave de cierre de `procesar`.

</details>

### Ejercicio 2: encuentra el error

La función debe devolver el mayor de un arreglo. ¿Qué está mal y cómo se corrige?

<!-- c-check: skip -->

```c
int *mayor(const int *valores, size_t n) {
    int maximo = valores[0];
    for (size_t i = 1; i < n; i++) {
        if (valores[i] > maximo) {
            maximo = valores[i];
        }
    }
    return &maximo;
}
```

<details><summary>Ver solución</summary>

Devuelve la dirección de `maximo`, que tiene duración automática: al volver, el llamador recibe un puntero colgante. Como el resultado es un solo `int`, lo correcto es devolverlo por valor:

```c
int mayor(const int *valores, size_t n) {
    int maximo = valores[0];
    for (size_t i = 1; i < n; i++) {
        if (valores[i] > maximo) {
            maximo = valores[i];
        }
    }
    return maximo;
}
```

Otra opción válida es devolver un puntero *al elemento del arreglo* (`&valores[i]`), porque el arreglo pertenece al llamador y sigue vivo.

</details>

### Ejercicio 3: predice la salida

¿Qué imprime este programa?

```c
#include <stdio.h>

int contar(void) {
    static int veces = 0;
    int local = 0;
    veces++;
    local++;
    return veces * 10 + local;
}

int main(void) {
    printf("%d\n", contar());
    printf("%d\n", contar());
    printf("%d\n", contar());
    return 0;
}
```

<details><summary>Ver solución</summary>

```
11
21
31
```

`veces` tiene duración estática y acumula 1, 2, 3. `local` tiene duración automática: se crea de nuevo en cada llamada con valor 0 y queda en 1.

</details>

### Ejercicio 4: repara la función

`formatear_precio` devuelve un texto con formato, pero el programa a veces imprime basura. Reescríbela con el patrón de búfer del llamador.

<!-- c-check: skip -->

```c
const char *formatear_precio(double precio) {
    char texto[32];
    snprintf(texto, sizeof texto, "$ %.2f", precio);
    return texto;
}
```

<details><summary>Ver solución</summary>

`texto` es automático y muere al volver. El llamador debe proveer el lugar:

```c
#include <stdio.h>

bool formatear_precio(char *destino, size_t capacidad, double precio) {
    int escritos = snprintf(destino, capacidad, "$ %.2f", precio);
    return escritos >= 0 && (size_t)escritos < capacidad;
}

int main(void) {
    char texto[32];
    if (formatear_precio(texto, sizeof texto, 1234.5)) {
        printf("%s\n", texto);
    }
    return 0;
}
```

</details>

### Ejercicio 5: ¿quién vive más?

Una estructura `struct registro { int *dato; };` se declara global. En una función se hace `int valor = 7; registro_global.dato = &valor;`. ¿Es correcto usar `*registro_global.dato` desde `main` después de llamar a esa función? Justifica con las duraciones.

<details><summary>Ver solución</summary>

No. `registro_global` tiene duración estática y vive todo el programa, pero `valor` tiene duración automática y deja de existir al salir de la función. El puntero guardado queda colgante y leerlo desde `main` es comportamiento indefinido. Un puntero nunca debe vivir más que el objeto al que apunta: habría que guardar el valor (`int dato;`) en lugar de su dirección, o apuntar a un objeto de duración estática.

</details>
