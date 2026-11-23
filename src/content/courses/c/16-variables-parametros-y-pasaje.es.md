---
title: 'Variables y Parámetros'
course: 'c'
slug: 'variables-parametros-y-pasaje'
description: 'Comprende por qué C pasa todos los argumentos siempre por valor, cómo funcionan las copias en la pila de llamadas y el alcance y duración de las variables.'
order: 16
lang: 'es'
published: true
---

Una vez que trabajas con funciones aparece una pregunta central:

> ¿qué datos conoce cada función, cuánto tiempo existen y cómo le llegan?

Esta lección responde esas tres preguntas: **dónde** se ve un nombre (alcance), **cuánto** vive una variable (duración) y **cómo** viajan los datos de una llamada a una función (pasaje de argumentos).

## Objetivos

- Distinguir variables locales y globales.
- Reconocer el alcance de un nombre: de bloque, de función y de archivo.
- Distinguir la duración automática de la duración estática, y usar una variable local `static`.
- Explicar el ocultamiento de nombres.
- Explicar por qué C pasa los argumentos **siempre por valor** y qué consecuencias tiene.

**Requisitos previos:** `modularizacion-subprogramas-y-funciones` (funciones, parámetros, `return`, `static` en funciones) y `sentencia-switch-y-bloques-de-codigo` (bloques).

## Variables locales

Una **variable local** se declara dentro de una función (o dentro de cualquier bloque `{ }`). Solo se puede usar ahí.

```c
#include <stdio.h>

void saludar(void) {
    int veces = 3;              // local a saludar
    for (int i = 0; i < veces; i++) {
        printf("Hola\n");
    }
}

int main(void) {
    saludar();
    // printf("%d\n", veces);   // error: veces no existe en main
    return 0;
}
```

Dos funciones pueden tener variables locales con el mismo nombre sin ningún conflicto: son variables distintas.

Cada vez que se llama a una función, sus variables locales se crean de nuevo. Por eso una variable local **no recuerda** el valor de la llamada anterior, y una local sin inicializar tiene un valor indeterminado: leerla antes de asignarle algo es un error. Inicializa siempre tus variables locales.

## Variables globales

Una **variable global** se declara fuera de todas las funciones. Todas las funciones del archivo que aparecen después de la declaración pueden usarla.

```c
#include <stdio.h>

int total_ventas = 0;           // global

void registrar_venta(int monto) {
    total_ventas = total_ventas + monto;
}

int main(void) {
    registrar_venta(100);
    registrar_venta(250);
    printf("Total: %d\n", total_ventas);   // Total: 350
    return 0;
}
```

Funciona, pero tiene un precio. Si muchas funciones leen y modifican la misma global, para entender su valor hay que revisar **todo** el programa; cualquier función puede ser la culpable de un valor incorrecto, y esas funciones dejan de poder probarse por separado.

> Regla práctica: prefiere variables locales y pasa los datos como argumentos y valores de retorno. Usa una global solo cuando haya una razón clara para compartir el dato.

Una global que solo usa un archivo puede declararse `static`: igual que con las funciones de la lección anterior, `static` en el nivel de archivo oculta el nombre a los demás archivos del programa.

## Alcance: dónde se ve un nombre

El **alcance** de un nombre es la parte del código donde ese nombre se puede usar. En C hay tres alcances que te importan ahora:

- **Alcance de bloque**: un nombre declarado dentro de `{ }` se ve desde su declaración hasta la llave que cierra ese bloque. Incluye las variables de un `if`, de un `for` (el `i` de `for (int i = 0; ...)` solo existe dentro del ciclo) y de cualquier bloque.
- **Alcance de función**: el cuerpo de una función es su bloque más externo, así que sus variables locales y sus **parámetros** se ven en toda la función y en ningún otro lugar. (El estándar llama técnicamente "alcance de función" solo al de las etiquetas de `goto`; parámetros y locales tienen alcance de bloque del cuerpo. En la práctica se habla de "alcance de la función" en este sentido.)
- **Alcance de archivo**: un nombre declarado fuera de toda función (una global o una función) se ve desde su declaración hasta el final del archivo.

```c
#include <stdio.h>

int limite = 10;                    // alcance de archivo

int sumar_hasta(int n) {            // n: visible en toda la función
    int suma = 0;                   // suma: visible en toda la función
    for (int i = 1; i <= n; i++) {  // i: solo dentro del for
        if (i <= limite) {
            int doble = i * 2;      // doble: solo dentro del if
            suma = suma + doble;
        }
    }
    return suma;
}

int main(void) {
    printf("%d\n", sumar_hasta(4));   // 2 + 4 + 6 + 8 = 20
    return 0;
}
```

Declarar cada variable en el bloque más chico donde se usa hace el código más fácil de leer: quien lee sabe que fuera de ese bloque la variable no influye.

## Ocultamiento de nombres

Si un bloque interno declara un nombre que ya existe en un alcance externo, el nombre interno **oculta** al externo dentro de ese bloque:

```c
#include <stdio.h>

int x = 1;                          // global

int main(void) {
    printf("%d\n", x);              // 1: la global
    int x = 2;                      // oculta a la global
    printf("%d\n", x);              // 2
    {
        int x = 3;                  // oculta a la anterior
        printf("%d\n", x);          // 3
    }
    printf("%d\n", x);              // 2: la del bloque interno ya no existe
    return 0;
}
```

Es legal, pero confunde: al leer `x` hay que averiguar cuál de las tres es. Evita reutilizar nombres en alcances anidados. Con la opción `-Wshadow`, GCC y Clang te avisan cuando ocurre.

## Duración: cuánto vive una variable

El alcance dice **dónde** se ve un nombre; la **duración** dice **cuándo existe** la variable en memoria. Son ideas distintas.

- **Duración automática**: las variables locales comunes nacen cuando la ejecución entra en su bloque y desaparecen cuando sale. Cada llamada a la función tiene las suyas.
- **Duración estática**: las variables globales existen durante toda la ejecución del programa. Se inicializan una sola vez, antes de que empiece `main`, y si no les das un valor inicial empiezan en cero.

### Variables locales `static`

Una variable local declarada con `static` combina las dos ideas: **alcance** de bloque (solo se ve dentro de la función) y **duración** estática (conserva su valor entre llamadas).

```c
#include <stdio.h>

int siguiente_turno(void) {
    static int contador = 0;    // se inicializa una sola vez
    contador = contador + 1;
    return contador;
}

int main(void) {
    printf("Turno %d\n", siguiente_turno());   // Turno 1
    printf("Turno %d\n", siguiente_turno());   // Turno 2
    printf("Turno %d\n", siguiente_turno());   // Turno 3
    return 0;
}
```

Sin `static`, `contador` se crearía en cada llamada con valor `0` y la función devolvería siempre `1`. Con `static`, la línea `= 0` se aplica una única vez y el valor sobrevive entre llamadas; aun así, ninguna otra función puede tocarlo.

Fíjate que `static` tiene dos significados según dónde se use: en una función o variable del nivel de archivo, **oculta el nombre** a otros archivos; en una variable local, le da **duración estática**.

El tratamiento completo de la duración (automática, estática y asignada), del tiempo de vida de los objetos y de los errores asociados llega en `duracion-y-ciclo-de-vida`, después de los punteros.

## Parámetros y argumentos

Recuerda la diferencia de la lección anterior:

- los **parámetros** son las variables de la definición: `int sumar(int a, int b)`;
- los **argumentos** son los valores de cada llamada: `sumar(5, 3)`.

Un parámetro es, en todo sentido, **una variable local de la función** que empieza con el valor del argumento: tiene alcance de función y duración automática.

## C pasa los argumentos siempre por valor

Esta es la regla más importante de la lección:

> En C, los argumentos se pasan **siempre por valor**. Al llamar a una función, cada argumento se evalúa y su **valor** se copia en el parámetro. La función trabaja con esa copia.

Por eso una función no puede modificar una variable de quien la llamó a través de un parámetro:

```c
#include <stdio.h>

void duplicar(int x) {
    x = x * 2;                                  // modifica la copia
    printf("Dentro de duplicar: x = %d\n", x);
}

int main(void) {
    int numero = 5;
    duplicar(numero);
    printf("En main: numero = %d\n", numero);
    return 0;
}
```

Salida:

```text
Dentro de duplicar: x = 10
En main: numero = 5
```

Paso a paso:

| Momento | `numero` (en `main`) | `x` (en `duplicar`) |
|---|---|---|
| antes de la llamada | 5 | no existe |
| al entrar en `duplicar` | 5 | 5 (copia del valor) |
| después de `x = x * 2` | 5 | 10 |
| al volver a `main` | 5 | ya no existe |

`numero` y `x` son dos variables distintas. Lo único que viajó de una a la otra fue el número `5`. Tampoco importaría que el parámetro se llamara `numero`: seguiría siendo otra variable, local a `duplicar`.

### La forma correcta hoy: devolver el resultado

Si quieres que `main` obtenga el valor duplicado, la función debe **devolverlo** y quien llama decide qué hacer con él:

```c
#include <stdio.h>

int duplicado(int x) {
    return x * 2;
}

int main(void) {
    int numero = 5;
    numero = duplicado(numero);         // quien llama decide modificar su variable
    printf("numero = %d\n", numero);    // numero = 10
    return 0;
}
```

Esto tiene una ventaja: al leer `main` se ve claramente que `numero` cambia, y dónde.

### ¿Y el "pasaje por referencia"?

En otros lenguajes existe el **pasaje por referencia**: el parámetro pasa a ser otro nombre de la variable original, y modificarlo modifica el original. **C no tiene ese mecanismo.**

Cuando en C se necesita que una función modifique una variable de quien la llama (por ejemplo, para devolver dos resultados, o para intercambiar dos valores), se usa una técnica: se le pasa a la función la **dirección** de la variable mediante un **puntero**, y la función accede a la variable original a través de esa dirección. Pero el puntero **también se pasa por valor**: la función recibe una copia de la dirección. La regla no tiene excepciones.

Ya usaste una función que funciona así: `scanf("%d", &n)` puede guardar un valor en `n` porque recibe su dirección (`&n`, "la dirección de `n`"), no su valor.

Cómo declarar punteros y escribir tus propias funciones con esta técnica lo aprendes en `punteros-y-direcciones`. Hasta entonces, comunica resultados con `return`.

## Errores comunes

1. **Creer que asignar a un parámetro cambia el argumento.** Se modifica la copia; el original queda igual.
2. **Esperar que una variable local recuerde su valor** entre llamadas sin declararla `static`.
3. **Leer una variable local sin inicializar.** Su valor es indeterminado.
4. **Abusar de las globales.** Cualquier función puede cambiarlas y el programa se vuelve difícil de seguir y de probar.
5. **Reutilizar nombres en bloques anidados**, ocultando variables sin querer.
6. **Decir que C pasa argumentos "por referencia".** C los pasa siempre por valor; la técnica con punteros pasa una dirección, y esa dirección también se copia.

## Resumen

- Una variable local se ve solo en su bloque; una global, desde su declaración hasta el fin del archivo.
- El **alcance** puede ser de bloque, de función (locales y parámetros en todo el cuerpo) o de archivo.
- La **duración** automática dura lo que dura el bloque; la estática, toda la ejecución. `static int contador` en una función conserva su valor entre llamadas.
- Un nombre interno oculta a uno externo del mismo nombre.
- C pasa los argumentos **siempre por valor**: la función recibe copias. Para comunicar un resultado, usa `return`; la técnica con punteros llega en `punteros-y-direcciones`.

## Ejercicios prácticos

### Ejercicio 1: predecir la salida

¿Qué imprime este programa? Justifica cada línea.

```c
#include <stdio.h>

int valor = 10;

int incrementar(int valor) {
    valor = valor + 1;
    return valor;
}

int main(void) {
    int resultado = incrementar(valor);
    printf("%d %d\n", valor, resultado);
    {
        int valor = 50;
        printf("%d\n", incrementar(valor));
    }
    printf("%d\n", valor);
    return 0;
}
```

<details><summary>Ver solución</summary>

```text
10 11
51
10
```

- El parámetro `valor` de `incrementar` oculta a la global y recibe una **copia** de `10`; la función devuelve `11` sin tocar la global, que sigue en `10`.
- En el bloque, la local `valor = 50` oculta a la global; `incrementar` recibe una copia de `50` y devuelve `51`.
- Al salir del bloque, `valor` vuelve a ser la global: `10`.

</details>

### Ejercicio 2: contar llamadas

Escribe una función `void registrar_visita(void)` que, cada vez que se llama, imprima `Visita número N`, con `N` empezando en 1. No uses variables globales. Llámala cuatro veces desde `main`.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

void registrar_visita(void) {
    static int visitas = 0;
    visitas = visitas + 1;
    printf("Visita número %d\n", visitas);
}

int main(void) {
    for (int i = 0; i < 4; i++) {
        registrar_visita();
    }
    return 0;
}
```

`visitas` tiene alcance de bloque (nadie fuera de la función puede modificarla) y duración estática (conserva su valor entre llamadas).

</details>

### Ejercicio 3: arreglar una función que no hace efecto

Este programa debería aplicar un descuento del 10 % a un precio, pero siempre muestra el precio original. Explica por qué y corrígelo sin usar variables globales.

```c
#include <stdio.h>

void aplicar_descuento(double precio) {
    precio = precio * 0.9;
}

int main(void) {
    double precio = 200.0;
    aplicar_descuento(precio);
    printf("Precio final: %.2f\n", precio);
    return 0;
}
```

<details><summary>Ver solución</summary>

C pasa los argumentos siempre por valor: `aplicar_descuento` modifica su copia de `precio`, que desaparece al terminar la función. La variable de `main` nunca cambia. La función debe devolver el nuevo precio:

```c
#include <stdio.h>

double con_descuento(double precio) {
    return precio * 0.9;
}

int main(void) {
    double precio = 200.0;
    precio = con_descuento(precio);
    printf("Precio final: %.2f\n", precio);   // Precio final: 180.00
    return 0;
}
```

</details>

### Ejercicio 4: identificar alcance y duración

Para cada variable de este fragmento, indica su alcance y su duración.

```c
int intentos = 0;

int validar(int codigo) {
    static int fallos = 0;
    int correcto = codigo == 1234;
    if (!correcto) {
        int penalizacion = 1;
        fallos = fallos + penalizacion;
    }
    intentos = intentos + 1;
    return correcto;
}
```

<details><summary>Ver solución</summary>

| Variable | Alcance | Duración |
|---|---|---|
| `intentos` | de archivo (desde su declaración hasta el final) | estática |
| `codigo` | de la función `validar` (es un parámetro) | automática |
| `fallos` | de bloque: el cuerpo de `validar` | estática (por `static`) |
| `correcto` | de bloque: el cuerpo de `validar` | automática |
| `penalizacion` | de bloque: solo dentro del `if` | automática |

</details>
