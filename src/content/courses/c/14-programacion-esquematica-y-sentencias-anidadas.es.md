---
title: 'Programación Esquemática'
course: 'c'
slug: 'programacion-esquematica-y-sentencias-anidadas'
order: 14
lang: 'es'
published: true
---

Ya viste secuencia, decisión e iteración. Ahora toca una idea más grande: **cómo pensar programas completos combinando esas estructuras sin perder claridad**.

Eso conecta con la **programación esquemática**, con el **refinamiento sucesivo** y con el uso controlado de **sentencias anidadas**.

## Objetivos

Al terminar esta lección podrás:

- reconocer en un problema los esquemas de secuencia, selección e iteración
- pasar de un enunciado a pseudocódigo y de pseudocódigo a C mediante refinamiento sucesivo
- escribir y hacer la traza de ciclos anidados y de decisiones dentro de ciclos
- elegir la estructura de control adecuada para cada parte de un problema
- revisar un ciclo con una lista de verificación de errores comunes

**Requisitos previos:** lecciones 8 a 13 (*If-else*, *Operador ternario*, *Switch y bloques de código*, *While*, *For*, *Do-While*).

## ¿Qué es programación esquemática?

La **programación esquemática** es una forma de diseñar programas a partir de esquemas de control bien conocidos. En vez de improvisar, piensas el problema con tres estructuras base:

1. **Secuencia**: una acción después de otra.
2. **Selección**: elegir entre caminos posibles (`if`, `switch`, el operador ternario).
3. **Iteración**: repetir acciones mientras una condición lo indique (`while`, `for`, `do-while`).

Una enorme cantidad de programas se construye combinando solo estos tres esquemas. No inventas la lógica desde cero cada vez: reconoces patrones.

## Refinamiento sucesivo

El **refinamiento sucesivo** consiste en resolver un problema de lo general a lo particular: primero una descripción con pocos pasos grandes, después cada paso se descompone en pasos más pequeños, hasta que cada uno se traduce directamente a una instrucción de C.

### Del enunciado al pseudocódigo

**Enunciado:** leer un entero `n` entre 2 y 1000 y mostrar todos los números primos desde 2 hasta `n`, y al final cuántos hay.

**Nivel 1** (qué hay que hacer):

```text
leer n y validarlo
para cada número de 2 a n
    si es primo, mostrarlo y contarlo
mostrar la cantidad
```

Ya se ven los esquemas: **secuencia** (leer, procesar, mostrar), **iteración** (para cada número) y **selección** (si es primo).

**Nivel 2** (cómo se decide "es primo"): un número `k` es primo si ningún `d` entre 2 y `k - 1` lo divide. Basta con probar mientras `d * d <= k`, porque si `k` tiene un divisor mayor que su raíz, también tiene uno menor.

```text
leer n
si la lectura falla o n no está entre 2 y 1000
    informar el error y terminar
primos ← 0
para k desde 2 hasta n
    es_primo ← verdadero
    para d desde 2 mientras d * d <= k
        si k es divisible por d
            es_primo ← falso
            dejar de probar divisores
    si es_primo
        mostrar k
        primos ← primos + 1
mostrar primos
```

### Del pseudocódigo a C

Cada línea del nivel 2 tiene una traducción directa:

```c
#include <stdio.h>

int main(void) {
    int n;

    printf("Mostrar primos hasta (2 a 1000): ");
    if (scanf("%d", &n) != 1 || n < 2 || n > 1000) {
        printf("Entrada inválida\n");
        return 1;
    }

    int primos = 0;
    for (int k = 2; k <= n; k++) {
        bool es_primo = true;

        for (int d = 2; d * d <= k; d++) {
            if (k % d == 0) {
                es_primo = false;
                break;              // dejar de probar divisores
            }
        }

        if (es_primo) {
            printf("%d ", k);
            primos++;
        }
    }

    printf("\nHay %d primos entre 2 y %d\n", primos, n);
    return 0;
}
```

El `break` sale **solo del ciclo interno** (el de `d`): el ciclo de `k` sigue con el número siguiente. Y `es_primo` se vuelve a poner en `true` al comienzo de **cada** vuelta externa: si se inicializara una sola vez antes del `for` externo, el primer número compuesto lo dejaría en `false` para siempre.

> **C moderno (C23):** `bool`, `true` y `false` son palabras clave. **C básico:** en C99 y C17, este programa necesita `#include <stdbool.h>`.

Escribir primero el pseudocódigo no es una pérdida de tiempo: separa **qué** hace el programa de **cómo** se escribe en C, y los errores de lógica aparecen antes de compilar.

## Sentencias anidadas

Una **sentencia anidada** es una estructura de control colocada dentro de otra:

- un `if` dentro de otro `if`
- un `if` dentro de un `while` (decidir algo en cada vuelta)
- un `for` dentro de otro `for` (ciclos anidados)
- un `switch` dentro de un `do-while` (los menús de la lección 13)

### Decisiones dentro de un ciclo

```c
#include <stdio.h>

int main(void) {
    int numero;
    int suma = 0;

    printf("Ingresa un número (0 para terminar): ");
    if (scanf("%d", &numero) != 1) {
        printf("Entrada inválida\n");
        return 1;
    }

    while (numero != 0) {
        if (numero > 0) {
            suma = suma + numero;
        }

        printf("Ingresa un número (0 para terminar): ");
        if (scanf("%d", &numero) != 1) {
            printf("Entrada inválida\n");
            return 1;
        }
    }

    printf("La suma de los positivos es %d\n", suma);
    return 0;
}
```

Secuencia para inicializar y mostrar, iteración con centinela para repetir la lectura, selección para decidir si se suma.

### Ciclos anidados: la tabla de multiplicar

En un ciclo anidado, el ciclo interno se ejecuta **completo** en cada vuelta del externo. El ejemplo clásico es una tabla: el ciclo externo recorre las filas y el interno, las columnas.

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= 5; j++) {
            printf("%d\t", i * j);
        }
        printf("\n");
    }
    return 0;
}
```

- el `printf("%d\t", ...)` del interno escribe una celda y un tabulador
- el `printf("\n")` está **después** del interno y **dentro** del externo: termina cada fila
- el cuerpo interno se ejecuta 5 × 5 = 25 veces

Si el interno da `m` vueltas por cada una de las `n` del externo, el cuerpo interno se ejecuta `n × m` veces. Con tamaños grandes, ese producto crece rápido: vale la pena calcularlo antes de anidar.

### Cuando el interno depende del externo

El límite del ciclo interno puede depender de la variable del externo:

```c
#include <stdio.h>

int main(void) {
    for (int fila = 1; fila <= 4; fila++) {
        for (int col = 1; col <= fila; col++) {
            printf("%d", col);
        }
        printf("\n");
    }
    return 0;
}
```

Salida:

```text
1
12
123
1234
```

En la fila 1 el interno da 1 vuelta; en la fila 4, 4 vueltas: 1 + 2 + 3 + 4 = 10 vueltas internas en total.

## Trazar ciclos anidados

Para seguir un ciclo anidado, la traza lleva una fila por cada vuelta **interna**, y la variable externa solo cambia cuando el interno terminó. Para la tabla reducida a `i` de 1 a 2 y `j` de 1 a 3:

| `i` | `j` | `i * j` | Salida acumulada de la fila |
| --- | --- | --- | --- |
| 1 | 1 | 1 | `1` |
| 1 | 2 | 2 | `1 2` |
| 1 | 3 | 3 | `1 2 3`, salto de línea |
| 2 | 1 | 2 | `2` |
| 2 | 2 | 4 | `2 4` |
| 2 | 3 | 6 | `2 4 6`, salto de línea |

Al cambiar `i`, `j` **vuelve a empezar desde 1**: la inicialización del `for` interno se ejecuta de nuevo en cada vuelta externa.

## Criterios para elegir una estructura de control

| Situación | Estructura |
| --- | --- |
| Dos caminos según una condición | `if` / `else` |
| Varios caminos según rangos o condiciones distintas | `if` / `else if` |
| Elegir un **valor** entre dos | operador ternario `? :` |
| Varios caminos según el valor exacto de un entero | `switch` |
| Repetir una cantidad conocida de veces o recorrer un rango | `for` |
| Repetir mientras se cumpla algo, posiblemente cero veces (centinela, fin de entrada) | `while` |
| Repetir al menos una vez (validar una entrada, menú) | `do-while` |
| Terminar una búsqueda en cuanto se encuentra el resultado | `break` dentro del ciclo |

Cuando dos estructuras sirven, elige la que deja **más visible** la intención: un `for` que muestra el rango completo en el encabezado, un `while` cuya condición dice exactamente cuándo terminar.

## ¿Cuándo anidar y cuándo es un problema?

Anidar es razonable cuando expresa una dependencia real: "para cada fila, para cada columna" o "en cada vuelta, decidir algo".

Empieza a ser un problema cuando hay tantos niveles que ya no se entiende qué controla a qué. Señales de alarma:

- más de tres niveles de llaves
- un `break` del que no está claro de qué ciclo sale
- tener que hacer scroll para encontrar el cierre de un bloque

La solución es extraer partes con nombre propio. En la lección 15 vas a aprender a escribir **funciones**, que son la herramienta para eso: el ciclo interno del ejemplo de primos se convertirá en una función `es_primo`.

### Salir de dos ciclos a la vez

`break` sale solo del ciclo más interno. Para terminar también el externo, usa una variable de control en su condición:

```c
#include <stdio.h>

int main(void) {
    int objetivo = 42;
    bool encontrado = false;
    int fila = 0;
    int col = 0;

    for (int i = 1; i <= 9 && !encontrado; i++) {
        for (int j = 1; j <= 9; j++) {
            if (i * j == objetivo) {
                encontrado = true;
                fila = i;
                col = j;
                break;              // sale del ciclo de j
            }
        }
    }                               // !encontrado corta el ciclo de i

    if (encontrado) {
        printf("%d = %d x %d\n", objetivo, fila, col);
    } else {
        printf("%d no está en la tabla del 1 al 9\n", objetivo);
    }
    return 0;
}
```

Muestra `42 = 6 x 7`.

## Lista de verificación de errores en ciclos

Antes de dar por terminado un ciclo, repasa esta lista:

1. **Inicialización:** ¿cada contador y acumulador tiene un valor inicial? ¿Está en el lugar correcto? Un acumulador que debe empezar de cero **en cada fila** va dentro del ciclo externo, no antes.
2. **Condición:** ¿`<` o `<=`? Haz la traza de la primera y la última vuelta.
3. **Actualización:** ¿existe, y acerca la condición a ser falsa? ¿Va en la dirección correcta?
4. **`;` después del encabezado:** `while (...);` y `for (...);` tienen cuerpo vacío.
5. **`continue` en `while` o `do-while`:** ¿se salta la actualización?
6. **Contador modificado dentro de un `for`:** el encabezado debe describir todo el recorrido.
7. **Misma variable en dos ciclos anidados:** si el interno también usa `i`, rompe el externo. Usa nombres distintos (`fila`, `col`).
8. **Contadores sin signo hacia abajo:** con `size_t`, `i >= 0` siempre es verdadero.
9. **Cero vueltas:** si el ciclo puede no ejecutarse, ¿qué pasa después? (por ejemplo, dividir por una cantidad que vale 0).
10. **`break` en ciclos anidados o en `switch`:** sale solo de la estructura más interna.
11. **Desbordamiento:** ¿el acumulador puede superar el máximo de su tipo? Valida la entrada o usa un tipo más amplio.
12. **Entrada:** ¿se comprueba el valor de `scanf`? Si no, una letra puede dejar el ciclo leyendo lo mismo para siempre.

## Buenas prácticas

- piensa el esquema y escribe el pseudocódigo antes del código
- indenta cada nivel y usa llaves siempre, aunque el bloque tenga una sola instrucción
- da a las variables de ciclos anidados nombres que digan qué recorren
- mantén cada bloque con una intención clara
- calcula cuántas veces se ejecuta el cuerpo más interno

## Resumen

- la programación esquemática organiza soluciones con secuencia, selección e iteración
- el **refinamiento sucesivo** baja de un enunciado a pseudocódigo y de ahí a C, de lo general a lo particular
- en un ciclo anidado, el interno se ejecuta completo en cada vuelta del externo y se reinicia cada vez
- cada estructura de control tiene su situación típica; elige la que deja visible la intención
- `break` sale solo del ciclo más interno; para salir de varios, usa una variable de control
- la lista de verificación atrapa la mayoría de los errores de ciclos antes de ejecutar

## Ejercicios prácticos

### Ejercicio 1: traza de un ciclo anidado

Sin ejecutarlo, escribe la salida y cuántas veces se ejecuta `total++`.

```c
#include <stdio.h>

int main(void) {
    int total = 0;

    for (int i = 3; i >= 1; i--) {
        for (int j = 0; j < i; j++) {
            printf("*");
            total++;
        }
        printf("\n");
    }

    printf("%d\n", total);
    return 0;
}
```

<details><summary>Ver solución</summary>

```text
***
**
*
6
```

Con `i = 3`, `j` toma 0, 1 y 2 (tres asteriscos); con `i = 2`, dos; con `i = 1`, uno. `total++` se ejecuta 3 + 2 + 1 = 6 veces.

</details>

### Ejercicio 2: promedio por estudiante (refinamiento sucesivo)

Enunciado: leer la cantidad de estudiantes (1 a 50); para cada uno, leer 3 notas enteras y mostrar su promedio con un decimal. Escribe primero el pseudocódigo de nivel 1 y de nivel 2, y después el programa. Si una lectura falla, muestra `Entrada inválida` y termina con `return 1;`.

<details><summary>Ver solución</summary>

Nivel 1:

```text
leer la cantidad de estudiantes
para cada estudiante
    leer sus 3 notas y mostrar el promedio
```

Nivel 2:

```text
leer cantidad; si falla o no está entre 1 y 50, terminar
para e desde 1 hasta cantidad
    suma ← 0
    para k desde 1 hasta 3
        leer nota; si falla, terminar
        suma ← suma + nota
    mostrar suma / 3 con un decimal
```

```c
#include <stdio.h>

int main(void) {
    int cantidad;

    printf("Cantidad de estudiantes (1 a 50): ");
    if (scanf("%d", &cantidad) != 1 || cantidad < 1 || cantidad > 50) {
        printf("Entrada inválida\n");
        return 1;
    }

    for (int e = 1; e <= cantidad; e++) {
        int suma = 0;                         // se reinicia para cada estudiante

        for (int k = 1; k <= 3; k++) {
            int nota;
            printf("Estudiante %d, nota %d: ", e, k);
            if (scanf("%d", &nota) != 1) {
                printf("Entrada inválida\n");
                return 1;
            }
            suma += nota;
        }

        printf("Promedio del estudiante %d: %.1f\n", e, suma / 3.0);
    }
    return 0;
}
```

`suma / 3.0` divide en `double`; `suma / 3` haría división entera (lección 7).

</details>

### Ejercicio 3: encuentra el error

Este programa debería mostrar la suma de cada fila de la tabla del 1 al 3 (`Fila 1: 6`, `Fila 2: 12`, `Fila 3: 18`), pero muestra 6, 18 y 36. ¿Qué punto de la lista de verificación falla? Corrígelo.

```c
#include <stdio.h>

int main(void) {
    int suma = 0;

    for (int fila = 1; fila <= 3; fila++) {
        for (int col = 1; col <= 3; col++) {
            suma += fila * col;
        }
        printf("Fila %d: %d\n", fila, suma);
    }
    return 0;
}
```

<details><summary>Ver solución</summary>

Falla el punto 1 (inicialización en el lugar correcto): `suma` se inicializa una sola vez, antes del ciclo externo, así que arrastra los valores de las filas anteriores. Debe reiniciarse al comienzo de cada fila:

```c
#include <stdio.h>

int main(void) {
    for (int fila = 1; fila <= 3; fila++) {
        int suma = 0;
        for (int col = 1; col <= 3; col++) {
            suma += fila * col;
        }
        printf("Fila %d: %d\n", fila, suma);
    }
    return 0;
}
```

</details>

### Ejercicio 4: elige la estructura

Para cada parte, indica qué estructura de control usarías y por qué.

1. Pedir una contraseña numérica hasta que sea correcta.
2. Mostrar los números del 100 al 1 de 10 en 10.
3. Sumar los precios que ingresa un cajero hasta que escribe `0`.
4. Mostrar el nombre del día a partir de un número del 1 al 7.
5. Dibujar un rectángulo de `alto` filas por `ancho` columnas de `#`.

<details><summary>Ver solución</summary>

1. `do-while`: hay que pedirla **al menos una vez** y repetir mientras sea incorrecta.
2. `for`: rango conocido con paso fijo, `for (int i = 100; i >= 1; i -= 10)`.
3. `while` con **centinela** y lectura adelantada: puede haber cero precios.
4. `switch`: varios caminos según el valor exacto de un entero.
5. Dos `for` anidados: el externo recorre las filas y el interno las columnas; el salto de línea va después del interno.

</details>
