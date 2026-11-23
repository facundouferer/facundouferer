---
title: 'Operaciones con Arreglos'
course: 'c'
slug: 'operaciones-con-arreglos'
description: 'Recorre, busca, inserta y elimina elementos en arreglos manteniendo un tamaño lógico con size_t sin cruzar la capacidad reservada.'
order: 20
lang: 'es'
published: true
---

Declarar un arreglo es solo el primer paso. Los programas reales hacen siempre las mismas operaciones sobre él: lo **recorren** para mostrarlo o calcular algo, buscan un valor, insertan y eliminan elementos, lo copian o lo invierten. En esta lección escribes cada operación como una **función** reutilizable que recibe el arreglo y su cantidad de elementos.

## Objetivos

- Recorrer un arreglo con índices de tipo `size_t`, hacia adelante y hacia atrás.
- Calcular suma, promedio, máximo y mínimo, y contar elementos que cumplen una condición.
- Buscar un valor y devolver su posición.
- Insertar y eliminar elementos corriendo los demás, respetando la capacidad.
- Copiar e invertir arreglos.
- Escribir cada operación como una función `(const int v[], size_t n)`.

**Requisitos previos:** `arreglos-unidimensionales-y-multidimensionales` (índices, límite, arreglos como parámetros), `variables-parametros-y-pasaje` (pasaje por valor), `sentencia-for`.

## La forma de las funciones

Todas las operaciones de esta lección siguen el mismo molde, que viste en la lección anterior:

```c
tipo operacion(const int v[], size_t n);
```

- `const int v[]` si la función solo **lee** el arreglo; `int v[]` (sin `const`) si lo **modifica**. En los dos casos la función trabaja sobre el arreglo del llamador; la lección `punteros-arreglos-y-estructuras` (26) explica por qué.
- `size_t n` es la cantidad de elementos **con datos válidos**. La función no puede calcularla por su cuenta.
- Los índices son `size_t`, el mismo tipo que `n`, para comparar valores sin signo con valores sin signo.

## Recorrer un arreglo

**Recorrer** es visitar los elementos uno por uno. Es la base de casi todas las demás operaciones:

```c
void mostrar(const int v[], size_t n) {
    for (size_t i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");
}
```

### Recorrer hacia atrás con `size_t`

Para recorrer del último al primero hay una trampa. Este ciclo parece correcto y **no termina nunca**:

```c
for (size_t i = n - 1; i >= 0; i--) {   /* MAL: i >= 0 siempre es verdadero */
    printf("%d ", v[i]);
}
```

Un `size_t` no tiene signo: nunca es negativo. Cuando `i` vale `0` y se ejecuta `i--`, pasa a valer el `size_t` más grande posible, la condición sigue siendo verdadera y el programa lee fuera del límite. (GCC con `-Wextra` avisa que la comparación siempre es verdadera; Clang solo lo hace con `-Wtype-limits`.) Además, si `n` es `0`, `n - 1` ya es enorme.

La forma correcta es contar de `n` a `1` y usar `i - 1` como índice:

```c
void mostrar_al_reves(const int v[], size_t n) {
    for (size_t i = n; i > 0; i--) {
        printf("%d ", v[i - 1]);
    }
    printf("\n");
}
```

## Suma y promedio

```c
int sumar(const int v[], size_t n) {
    int suma = 0;
    for (size_t i = 0; i < n; i++) {
        suma += v[i];
    }
    return suma;
}

double promedio(const int v[], size_t n) {
    if (n == 0) {
        return 0.0;
    }
    return (double)sumar(v, n) / n;
}
```

La conversión explícita `(double)` evita la división entera. El caso `n == 0` se trata aparte para no dividir por cero.

## Máximo y mínimo

```c
/* Precondición: n > 0. */
int maximo(const int v[], size_t n) {
    int mayor = v[0];
    for (size_t i = 1; i < n; i++) {
        if (v[i] > mayor) {
            mayor = v[i];
        }
    }
    return mayor;
}

/* Precondición: n > 0. Devuelve la posición, no el valor. */
size_t posicion_del_minimo(const int v[], size_t n) {
    size_t pos = 0;
    for (size_t i = 1; i < n; i++) {
        if (v[i] < v[pos]) {
            pos = i;
        }
    }
    return pos;
}
```

Dos detalles:

- El valor inicial es **el primer elemento**, no `0`. Si todos los números fueran negativos, empezar con `0` daría un máximo que ni siquiera está en el arreglo.
- Un arreglo vacío no tiene máximo. La función lo declara como **precondición** en un comentario, y quien la llama comprueba `n > 0` antes.

## Contar

Contar es recorrer con un contador que solo avanza cuando se cumple una condición:

```c
size_t contar_mayores(const int v[], size_t n, int umbral) {
    size_t cantidad = 0;
    for (size_t i = 0; i < n; i++) {
        if (v[i] > umbral) {
            cantidad++;
        }
    }
    return cantidad;
}
```

## Buscar un valor

La búsqueda más simple revisa las posiciones en orden hasta encontrar el valor:

```c
/* Devuelve la posición de la primera aparición de valor, o n si no está. */
size_t buscar(const int v[], size_t n, int valor) {
    for (size_t i = 0; i < n; i++) {
        if (v[i] == valor) {
            return i;
        }
    }
    return n;
}
```

Como `size_t` no puede ser `-1`, la función usa `n` para decir "no está": nunca es una posición válida. Quien llama compara `if (pos < n)`. La lección `busqueda-en-arreglos` (23) compara esta búsqueda con otras más rápidas.

## Copiar

Un arreglo no se puede asignar con `=`; se copia elemento por elemento. El destino tiene que tener lugar para `n` elementos:

```c
void copiar(int destino[], const int origen[], size_t n) {
    for (size_t i = 0; i < n; i++) {
        destino[i] = origen[i];
    }
}
```

`origen` es `const` (solo se lee) y `destino` no (se escribe).

## Invertir

Invertir en el mismo arreglo es intercambiar el primero con el último, el segundo con el anteúltimo, y así hasta la mitad:

```c
void invertir(int v[], size_t n) {
    for (size_t i = 0; i < n / 2; i++) {
        int aux = v[i];
        v[i] = v[n - 1 - i];
        v[n - 1 - i] = aux;
    }
}
```

El ciclo llega solo hasta `n / 2`: si siguiera hasta `n`, volvería a intercambiar cada par y el arreglo quedaría como al principio.

## Insertar corriendo elementos

Un arreglo tiene una **capacidad** fija y una **cantidad usada** `n` que puede ser menor. Insertar en la posición `pos` obliga a correr un lugar a la derecha todos los elementos desde `pos` hasta el final:

```text
capacidad 6, n = 4, insertar 99 en la posición 1

antes:          [10][20][30][40][  ][  ]
correr v[3]:    [10][20][30][40][40][  ]
correr v[2]:    [10][20][30][30][40][  ]
correr v[1]:    [10][20][20][30][40][  ]
escribir v[1]:  [10][99][20][30][40][  ]    n = 5
```

El corrimiento va **desde el final hacia `pos`**. Si fuera al revés, `v[1]` pisaría a `v[2]` antes de moverlo y se perderían datos.

```c
bool insertar(int v[], size_t n, size_t capacidad, size_t pos, int valor) {
    if (n >= capacidad || pos > n) {
        return false;
    }
    for (size_t i = n; i > pos; i--) {
        v[i] = v[i - 1];
    }
    v[pos] = valor;
    return true;
}
```

La función comprueba dos cosas antes de tocar el arreglo: que quede lugar (`n < capacidad`) y que la posición sea válida (`pos` puede ser `n`, que significa "al final", pero no más).

¿Por qué devuelve `bool` en lugar de actualizar `n`? Porque `n` llega **por valor**: la función recibe una copia y cambiarla no cambiaría la variable del llamador. Entonces la función informa si pudo insertar y el llamador actualiza su cantidad:

```c
if (insertar(datos, n, CAPACIDAD, 1, 99)) {
    n++;
}
```

La lección `punteros-y-direcciones` (25) muestra cómo una función puede modificar una variable del llamador.

## Eliminar corriendo elementos

Eliminar es la operación inversa: los elementos que están después de `pos` se corren un lugar a la izquierda, **desde `pos` hacia el final**:

```text
n = 5, eliminar la posición 1

antes:          [10][99][20][30][40]
v[1] = v[2]:    [10][20][20][30][40]
v[2] = v[3]:    [10][20][30][30][40]
v[3] = v[4]:    [10][20][30][40][40]    n = 4 (el último 40 ya no cuenta)
```

```c
bool eliminar(int v[], size_t n, size_t pos) {
    if (pos >= n) {
        return false;
    }
    for (size_t i = pos; i + 1 < n; i++) {
        v[i] = v[i + 1];
    }
    return true;
}
```

La condición `i + 1 < n` evita leer `v[n]`. Después de eliminar, el llamador hace `n--`.

Insertar o eliminar al principio de un arreglo de un millón de elementos corre un millón de valores. Esa es la desventaja del acceso directo que viste en la lección 18, y la razón de ser de las listas enlazadas del módulo 7.

## Programa completo

Todas las operaciones juntas, con su `main`:

```c
#include <stdio.h>

#define CAPACIDAD 10

void mostrar(const int v[], size_t n) {
    for (size_t i = 0; i < n; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");
}

void mostrar_al_reves(const int v[], size_t n) {
    for (size_t i = n; i > 0; i--) {
        printf("%d ", v[i - 1]);
    }
    printf("\n");
}

int sumar(const int v[], size_t n) {
    int suma = 0;
    for (size_t i = 0; i < n; i++) {
        suma += v[i];
    }
    return suma;
}

double promedio(const int v[], size_t n) {
    if (n == 0) {
        return 0.0;
    }
    return (double)sumar(v, n) / n;
}

int maximo(const int v[], size_t n) {
    int mayor = v[0];
    for (size_t i = 1; i < n; i++) {
        if (v[i] > mayor) {
            mayor = v[i];
        }
    }
    return mayor;
}

size_t posicion_del_minimo(const int v[], size_t n) {
    size_t pos = 0;
    for (size_t i = 1; i < n; i++) {
        if (v[i] < v[pos]) {
            pos = i;
        }
    }
    return pos;
}

size_t contar_mayores(const int v[], size_t n, int umbral) {
    size_t cantidad = 0;
    for (size_t i = 0; i < n; i++) {
        if (v[i] > umbral) {
            cantidad++;
        }
    }
    return cantidad;
}

size_t buscar(const int v[], size_t n, int valor) {
    for (size_t i = 0; i < n; i++) {
        if (v[i] == valor) {
            return i;
        }
    }
    return n;
}

void copiar(int destino[], const int origen[], size_t n) {
    for (size_t i = 0; i < n; i++) {
        destino[i] = origen[i];
    }
}

void invertir(int v[], size_t n) {
    for (size_t i = 0; i < n / 2; i++) {
        int aux = v[i];
        v[i] = v[n - 1 - i];
        v[n - 1 - i] = aux;
    }
}

bool insertar(int v[], size_t n, size_t capacidad, size_t pos, int valor) {
    if (n >= capacidad || pos > n) {
        return false;
    }
    for (size_t i = n; i > pos; i--) {
        v[i] = v[i - 1];
    }
    v[pos] = valor;
    return true;
}

bool eliminar(int v[], size_t n, size_t pos) {
    if (pos >= n) {
        return false;
    }
    for (size_t i = pos; i + 1 < n; i++) {
        v[i] = v[i + 1];
    }
    return true;
}

int main(void) {
    int datos[CAPACIDAD] = {10, 20, 30, 40};
    size_t n = 4;

    printf("Datos: ");
    mostrar(datos, n);
    printf("Al revés: ");
    mostrar_al_reves(datos, n);
    printf("Suma: %d, promedio: %.2f\n", sumar(datos, n), promedio(datos, n));
    printf("Máximo: %d, posición del mínimo: %zu\n", maximo(datos, n), posicion_del_minimo(datos, n));
    printf("Mayores que 15: %zu\n", contar_mayores(datos, n, 15));

    size_t pos = buscar(datos, n, 30);
    if (pos < n) {
        printf("El 30 está en la posición %zu\n", pos);
    }

    if (insertar(datos, n, CAPACIDAD, 1, 99)) {
        n++;
    }
    printf("Después de insertar: ");
    mostrar(datos, n);

    if (eliminar(datos, n, 0)) {
        n--;
    }
    printf("Después de eliminar: ");
    mostrar(datos, n);

    int copia[CAPACIDAD] = {0};
    copiar(copia, datos, n);
    invertir(copia, n);
    printf("Copia invertida: ");
    mostrar(copia, n);
    printf("Original intacto: ");
    mostrar(datos, n);
    return 0;
}
```

Salida:

```text
Datos: 10 20 30 40
Al revés: 40 30 20 10
Suma: 100, promedio: 25.00
Máximo: 40, posición del mínimo: 0
Mayores que 15: 3
El 30 está en la posición 2
Después de insertar: 10 99 20 30 40
Después de eliminar: 99 20 30 40
Copia invertida: 40 30 20 99
Original intacto: 99 20 30 40
```

> **C básico:** en C17 y anteriores, `bool`, `true` y `false` requieren `#include <stdbool.h>`.

> **C moderno (C23):** son palabras clave, por eso el programa no incluye `<stdbool.h>`.

## Recorrer una matriz

Las mismas ideas valen para un arreglo bidimensional, con dos ciclos anidados: el de las filas afuera y el de las columnas adentro.

```c
#include <stdio.h>

#define FILAS 3
#define COLUMNAS 4

int sumar_columna(int m[][COLUMNAS], size_t filas, size_t columna) {
    int suma = 0;
    for (size_t f = 0; f < filas; f++) {
        suma += m[f][columna];
    }
    return suma;
}

int main(void) {
    int ventas[FILAS][COLUMNAS] = {
        {5, 3, 8, 2},
        {4, 6, 1, 7},
        {9, 0, 3, 5},
    };

    int total = 0;
    for (size_t f = 0; f < FILAS; f++) {
        for (size_t c = 0; c < COLUMNAS; c++) {
            total += ventas[f][c];
        }
    }
    printf("Total: %d\n", total);

    for (size_t c = 0; c < COLUMNAS; c++) {
        printf("Columna %zu: %d\n", c, sumar_columna(ventas, FILAS, c));
    }
    return 0;
}
```

Para sumar una columna, la columna queda fija y lo que avanza es la fila.

## Errores comunes

- **Recorrer hacia atrás con `i >= 0` sobre un `size_t`.** No termina nunca; usa `for (size_t i = n; i > 0; i--)` con `v[i - 1]`.
- **Empezar el máximo en `0`.** Empieza en `v[0]`, y exige `n > 0`.
- **Correr en el sentido equivocado.** Al insertar, desde el final hacia `pos`; al eliminar, desde `pos` hacia el final.
- **Olvidar actualizar `n`.** Después de insertar `n++`, después de eliminar `n--`.
- **Insertar sin comprobar la capacidad.** Escribir en `v[capacidad]` es salirse del límite.
- **Confundir posición con valor.** `buscar` devuelve dónde está, no qué hay.

## Resumen

- Recorrer es la base de todas las operaciones; los índices son `size_t`.
- Hacia atrás se recorre con `i > 0` y `v[i - 1]`.
- Suma, promedio, máximo, mínimo y conteo son recorridos con una variable que acumula.
- `buscar` devuelve la posición o `n` si el valor no está.
- Insertar y eliminar corren elementos y respetan capacidad y cantidad usada; la función informa el resultado y el llamador actualiza `n`.
- Copiar es elemento por elemento; invertir intercambia pares hasta la mitad.

## Ejercicios prácticos

### Ejercicio 1: contar pares

Escribe `size_t contar_pares(const int v[], size_t n)` y un `main` que la use con `{3, 8, 12, 7, 6, 1}`. Debe mostrar `Pares: 3`.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

size_t contar_pares(const int v[], size_t n) {
    size_t pares = 0;
    for (size_t i = 0; i < n; i++) {
        if (v[i] % 2 == 0) {
            pares++;
        }
    }
    return pares;
}

int main(void) {
    int numeros[] = {3, 8, 12, 7, 6, 1};
    size_t n = sizeof numeros / sizeof numeros[0];

    printf("Pares: %zu\n", contar_pares(numeros, n));
    return 0;
}
```

</details>

### Ejercicio 2: seguir una inserción

Un arreglo de capacidad 5 tiene `n = 3` y contiene `[3][5][8][ ][ ]`. Escribe cómo queda después de cada paso de `insertar(v, 3, 5, 0, 1)` y el valor final de `n` en el llamador.

<details><summary>Ver solución</summary>

```text
antes:          [3][5][8][ ][ ]
v[3] = v[2]:    [3][5][8][8][ ]
v[2] = v[1]:    [3][5][5][8][ ]
v[1] = v[0]:    [3][3][5][8][ ]
v[0] = 1:       [1][3][5][8][ ]
```

La función devuelve `true` y el llamador hace `n++`: `n` pasa a valer 4. Insertar en la posición 0 obliga a correr **todos** los elementos.

</details>

### Ejercicio 3: eliminar todas las apariciones

Escribe `size_t eliminar_todos(int v[], size_t n, int valor)`, que quite todas las apariciones de `valor` conservando el orden de los demás y devuelva la nueva cantidad. Hazlo en un solo recorrido. Prueba con `{4, 7, 4, 1, 4, 9}` eliminando `4`.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

size_t eliminar_todos(int v[], size_t n, int valor) {
    size_t escritura = 0;
    for (size_t lectura = 0; lectura < n; lectura++) {
        if (v[lectura] != valor) {
            v[escritura] = v[lectura];
            escritura++;
        }
    }
    return escritura;
}

int main(void) {
    int datos[] = {4, 7, 4, 1, 4, 9};
    size_t n = sizeof datos / sizeof datos[0];

    n = eliminar_todos(datos, n, 4);
    for (size_t i = 0; i < n; i++) {
        printf("%d ", datos[i]);
    }
    printf("\n");
    return 0;
}
```

Salida: `7 1 9`. Hay dos índices: `lectura` recorre todo y `escritura` marca dónde va el próximo elemento que se conserva. Aquí la función devuelve la nueva cantidad y el llamador la guarda en `n`.

</details>

### Ejercicio 4: ¿es capicúa?

Escribe `bool es_capicua(const int v[], size_t n)`, que devuelva `true` si el arreglo se lee igual de izquierda a derecha que al revés (por ejemplo `{1, 2, 3, 2, 1}`), sin modificarlo ni copiarlo.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

bool es_capicua(const int v[], size_t n) {
    for (size_t i = 0; i < n / 2; i++) {
        if (v[i] != v[n - 1 - i]) {
            return false;
        }
    }
    return true;
}

int main(void) {
    int a[] = {1, 2, 3, 2, 1};
    int b[] = {1, 2, 3, 4};

    printf("a: %s\n", es_capicua(a, sizeof a / sizeof a[0]) ? "capicúa" : "no capicúa");
    printf("b: %s\n", es_capicua(b, sizeof b / sizeof b[0]) ? "capicúa" : "no capicúa");
    return 0;
}
```

Se comparan los mismos pares que intercambia `invertir`. Un arreglo vacío o de un elemento es capicúa: el ciclo no se ejecuta.

</details>
