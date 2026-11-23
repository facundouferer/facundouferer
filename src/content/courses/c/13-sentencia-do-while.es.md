---
title: 'Do-While'
course: 'c'
slug: 'sentencia-do-while'
order: 13
lang: 'es'
published: true
---

La sentencia `do-while` también repite instrucciones, pero tiene una diferencia muy importante respecto de `while`: pregunta **al final**.

## Objetivos

Al terminar esta lección podrás:

- explicar por qué el cuerpo de un `do-while` se ejecuta **al menos una vez**
- elegir entre `while` y `do-while` según el momento en que conviene evaluar la condición
- validar entradas y construir menús repetitivos con `do-while`
- usar `break` y `continue` en los tres ciclos, sabiendo exactamente qué saltan
- decidir cuándo `break` y `continue` aclaran el código y cuándo lo oscurecen

**Requisitos previos:** lecciones 11 (*While*) y 12 (*For*), lección 10 (*Switch y bloques de código*: `break` en `switch`, alcance de bloque) y lección 6 (*Entrada y salida*: descartar la entrada inválida con `getchar`).

## Sintaxis

```c
do {
    instrucciones;
} while (condicion);
```

El `;` final forma parte de la sintaxis: sin él, el programa no compila.

## La diferencia fundamental

- En `while`, la condición se evalúa **antes** de entrar al cuerpo: puede haber cero vueltas.
- En `do-while`, el cuerpo se ejecuta y **después** se evalúa la condición: hay **al menos una vez**.

```c
#include <stdio.h>

int main(void) {
    int numero = 10;

    do {
        printf("El número es %d\n", numero);
    } while (numero < 5);

    return 0;
}
```

Aunque `numero < 5` es falso desde el principio, se muestra `El número es 10` una vez. Con un `while` y la misma condición, no se mostraría nada.

| | `while` | `do-while` |
| --- | --- | --- |
| Se evalúa la condición | antes del cuerpo | después del cuerpo |
| Mínimo de vueltas | 0 | 1 |
| Uso típico | centinela, fin de entrada | validar una entrada, menús |

## Validar una entrada

Pedir un dato **siempre** ocurre al menos una vez, y se repite **mientras** el dato sea inválido. Ese es exactamente el molde de `do-while`:

```c
#include <stdio.h>

int main(void) {
    int edad = 0;
    int leidos;

    do {
        printf("Edad (0 a 120): ");
        leidos = scanf("%d", &edad);

        if (leidos == EOF) {
            printf("\nNo hay más entrada\n");
            return 1;
        }
        if (leidos != 1) {
            int c;
            while ((c = getchar()) != '\n' && c != EOF) {
                // descarta el resto de la línea inválida
            }
            printf("Eso no es un número\n");
        } else if (edad < 0 || edad > 120) {
            printf("Fuera de rango\n");
        }
    } while (leidos != 1 || edad < 0 || edad > 120);

    printf("Edad registrada: %d\n", edad);
    return 0;
}
```

Fíjate en tres detalles:

- `leidos` y `edad` se declaran **fuera** del `do`, porque la condición `while (...)` está después de la llave de cierre del bloque y no ve las variables declaradas dentro (lección 10)
- la condición dice "repetir **mientras** sea inválido"; un error frecuente es escribirla al revés
- si la entrada es una letra, se descarta la línea con `getchar`; si no, `scanf` volvería a fallar con la misma letra para siempre

## Menús repetitivos

Un menú se muestra al menos una vez y se repite hasta que el usuario elige salir. `do-while` y `switch` se combinan de forma natural:

```c
#include <stdio.h>

int main(void) {
    int opcion = 0;
    int contador = 0;

    do {
        printf("[1] Sumar  [2] Restar  [3] Ver  [0] Salir\nOpción: ");
        if (scanf("%d", &opcion) != 1) {
            printf("Entrada inválida\n");
            return 1;
        }

        switch (opcion) {
            case 1:
                contador++;
                break;
            case 2:
                contador--;
                break;
            case 3:
                printf("Contador: %d\n", contador);
                break;
            case 0:
                printf("Hasta luego\n");
                break;
            default:
                printf("Opción inválida\n");
                break;
        }
    } while (opcion != 0);

    return 0;
}
```

Los `break` de este programa terminan el `switch`, **no** el ciclo. Lo que termina el menú es la condición `opcion != 0`. Este punto vuelve a aparecer más abajo.

> **C moderno (C23):** `bool`, `true` y `false` son palabras clave, útiles para condiciones de ciclo con nombre (`bool terminado = false;` y `} while (!terminado);`). **C básico:** en C99 y C17 hay que incluir `<stdbool.h>` para usarlos.

## `break` y `continue` en los tres ciclos

Ya los viste de pasada en `switch` (lección 10) y en `while` (lección 11). Ahora con precisión.

### `break`: salir del ciclo

`break` termina **inmediatamente el ciclo (o `switch`) más interno** que lo contiene. La ejecución sigue en la primera instrucción después de ese ciclo. Funciona igual en `while`, `for` y `do-while`.

```c
#include <stdio.h>

int main(void) {
    int n = 91;
    int divisor = 0;

    for (int d = 2; d < n; d++) {
        if (n % d == 0) {
            divisor = d;
            break;            // ya encontramos el primero: no tiene sentido seguir
        }
    }

    if (divisor != 0) {
        printf("%d no es primo: es divisible por %d\n", n, divisor);
    } else {
        printf("%d es primo\n", n);
    }
    return 0;
}
```

### `continue`: saltar a la siguiente vuelta

`continue` abandona **el resto del cuerpo** en la vuelta actual. A dónde salta depende del ciclo:

| Ciclo | Después de `continue` se ejecuta |
| --- | --- |
| `while` | la evaluación de la condición |
| `do-while` | la evaluación de la condición (al final) |
| `for` | la **actualización** y después la condición |

```c
#include <stdio.h>

int main(void) {
    int suma = 0;

    for (int i = 1; i <= 10; i++) {
        if (i % 3 == 0) {
            continue;         // salta los múltiplos de 3; i++ se ejecuta igual
        }
        suma += i;
    }

    printf("Suma de 1 a 10 sin múltiplos de 3: %d\n", suma);
    return 0;
}
```

Muestra `37` (55 menos 3, 6 y 9). En un `for`, `continue` es seguro porque la actualización está en el encabezado. En `while` y `do-while`, si la actualización está en el cuerpo **después** del `continue`, se salta y el ciclo puede volverse infinito.

### `break` dentro de un `switch` dentro de un ciclo

`break` sale del más interno. Si el más interno es un `switch`, sale del `switch` y el ciclo **continúa**. Por eso en el menú anterior no se puede salir con `case 0: break;`: hace falta la condición del ciclo (o una variable que la controle). `continue`, en cambio, no tiene significado para `switch`: dentro de un `switch` que está en un ciclo, `continue` se aplica al ciclo.

### Criterios de claridad

`break` y `continue` son herramientas legítimas, pero cada uno agrega una salida que no se ve en la condición del ciclo.

Úsalos cuando aclaran:

- `break` para terminar una **búsqueda** en cuanto se encuentra lo buscado
- `continue` al **principio** del cuerpo, como filtro ("si este dato no sirve, pasa al siguiente"), en lugar de envolver todo el cuerpo en un `if`

Evítalos cuando oscurecen:

- varios `break` y `continue` repartidos en un cuerpo largo: quien lee ya no puede saber cuándo termina el ciclo
- un `while (true)` con un `break` escondido cuando una condición con nombre lo diría mejor
- un `continue` en un `while` que salta la actualización

Si puedes expresar la salida en la condición sin complicarla, prefiere la condición.

## Errores comunes

### 1. Olvidar el `;` final

```c
do {
    x++;
} while (x < 10)    // falta ;
```

Es un error de compilación.

### 2. Declarar dentro del bloque lo que usa la condición

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    do {
        int valor = 0;
        if (scanf("%d", &valor) != 1) {
            return 1;
        }
    } while (valor < 0);   // error: 'valor' no está declarada en este alcance
    return 0;
}
```

La condición está **fuera** del bloque. Declara `valor` antes del `do`.

### 3. Invertir la condición

En la validación, la condición describe cuándo **repetir**, o sea, cuándo el dato es **inválido**: `while (nota < 0 || nota > 10)`. Escribir `while (nota >= 0 && nota <= 10)` repite justamente cuando el dato es correcto.

### 4. Usar `do-while` cuando puede haber cero vueltas

Si los datos pueden estar vacíos (un centinela que llega primero), `do-while` procesaría algo que no debía. En ese caso, el molde es `while`.

### 5. Esperar que `break` dentro de un `switch` termine el ciclo

Solo termina el `switch`.

## Resumen

- `do-while` evalúa la condición al final: el cuerpo se ejecuta **al menos una vez**
- es el molde natural para validar entradas y para menús
- las variables de la condición se declaran antes del `do`
- `break` sale del ciclo o `switch` más interno; `continue` salta al resto de la vuelta (en `for`, ejecuta la actualización)
- usa `break` para terminar búsquedas y `continue` como filtro al principio; si una condición lo dice mejor, prefiere la condición

## Ejercicios prácticos

### Ejercicio 1: predice la salida

```c
#include <stdio.h>

int main(void) {
    int i = 0;

    do {
        i++;
        if (i == 2) {
            continue;
        }
        if (i == 5) {
            break;
        }
        printf("%d ", i);
    } while (i < 8);

    printf("| i = %d\n", i);
    return 0;
}
```

<details><summary>Ver solución</summary>

```text
1 3 4 | i = 5
```

Cuando `i` vale `2`, `continue` salta el `printf` y va a la condición (`2 < 8`, sigue). Cuando vale `5`, `break` termina el ciclo antes de mostrarlo. Como `i++` está al principio del cuerpo, el `continue` no causa un ciclo infinito.

</details>

### Ejercicio 2: validar una nota

Escribe un programa que pida una nota entera entre 1 y 10 con `do-while` hasta que sea válida. Si `scanf` no lee un número, muestra `Entrada inválida` y termina con `return 1;`. Si está fuera de rango, muestra `Debe estar entre 1 y 10` y vuelve a pedir. Al final, muestra `Aprobado` (6 o más) o `Desaprobado`.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int main(void) {
    int nota = 0;

    do {
        printf("Nota (1 a 10): ");
        if (scanf("%d", &nota) != 1) {
            printf("Entrada inválida\n");
            return 1;
        }
        if (nota < 1 || nota > 10) {
            printf("Debe estar entre 1 y 10\n");
        }
    } while (nota < 1 || nota > 10);

    printf("%s\n", nota >= 6 ? "Aprobado" : "Desaprobado");
    return 0;
}
```

</details>

### Ejercicio 3: elimina el `break`

Este programa suma enteros hasta que llega un negativo. Reescríbelo **sin** `while (true)` ni `break`, de modo que la condición del ciclo diga cuándo termina.

```c
#include <stdio.h>

int main(void) {
    int valor;
    int suma = 0;

    while (true) {
        if (scanf("%d", &valor) != 1 || valor < 0) {
            break;
        }
        suma += valor;
    }

    printf("Suma: %d\n", suma);
    return 0;
}
```

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int main(void) {
    int valor;
    int suma = 0;

    while (scanf("%d", &valor) == 1 && valor >= 0) {
        suma += valor;
    }

    printf("Suma: %d\n", suma);
    return 0;
}
```

Gracias al cortocircuito de `&&` (lección 7), `valor >= 0` solo se evalúa si `scanf` leyó un número. Ahora la condición describe completa la salida del ciclo.

</details>

### Ejercicio 4: ¿dónde salta `continue`?

Este ciclo debería mostrar los impares del 1 al 9, pero no termina nunca. Explica por qué y corrígelo de dos formas: moviendo la actualización y usando un `for`.

```c
#include <stdio.h>

int main(void) {
    int i = 1;

    while (i <= 9) {
        if (i % 2 == 0) {
            continue;
        }
        printf("%d ", i);
        i++;
    }
    printf("\n");
    return 0;
}
```

<details><summary>Ver solución</summary>

Cuando `i` vale `2`, `continue` vuelve a la condición **sin** ejecutar `i++`: `i` queda en `2` para siempre. En un `while`, `continue` no ejecuta ninguna actualización.

```c
#include <stdio.h>

int main(void) {
    int i = 0;
    while (i < 9) {
        i++;                 // la actualización va primero
        if (i % 2 == 0) {
            continue;
        }
        printf("%d ", i);
    }
    printf("\n");

    for (int j = 1; j <= 9; j++) {   // en un for, continue ejecuta j++
        if (j % 2 == 0) {
            continue;
        }
        printf("%d ", j);
    }
    printf("\n");
    return 0;
}
```

Ambos muestran `1 3 5 7 9`.

</details>
