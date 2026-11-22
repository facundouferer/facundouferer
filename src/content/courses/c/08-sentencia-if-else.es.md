---
title: 'If-Else'
course: 'c'
slug: 'sentencia-if-else'
order: 8
lang: 'es'
published: true
---

Hasta ahora tus programas fueron **secuenciales**: las instrucciones se ejecutan una detrás de otra, siempre en el mismo orden. Pero un programa útil necesita **elegir** qué hacer según los datos. La primera herramienta para eso es la sentencia `if` con su compañera `else`.

## Objetivos

Al terminar esta lección podrás:

- ejecutar un bloque solo cuando una **condición** es verdadera, con `if`
- elegir entre dos caminos con `if-else` y entre varios con cadenas `else if`
- anidar decisiones cuando una depende de otra, sin perder legibilidad
- explicar cómo C evalúa una condición: cero es falso, cualquier otro valor es verdadero
- reconocer los errores clásicos: `=` en lugar de `==`, el `;` suelto después del `if`, el `else` colgante y comparar valores de punto flotante con `==`
- proteger una operación peligrosa con el cortocircuito de `&&`
- decidir cuándo conviene una cadena `else if` y cuándo un `switch`

**Requisitos previos:** lecciones 1 a 7, en especial *Tipos de datos* (`bool`, `double`) y *Operadores* (relacionales, lógicos y cortocircuito).

> Idea clave: `if-else` rompe la secuencia lineal. El programa evalúa una condición y ejecuta **un solo** camino de los posibles.

## ¿Qué es una condición?

Una **condición** es una expresión cuyo resultado se interpreta como verdadero o falso. Normalmente la escribes con los operadores relacionales y lógicos de la lección anterior:

```c
edad >= 18
numero == 0
nota >= 6 && nota <= 10
```

### Cómo decide C qué es verdadero

C no exige que la condición sea de tipo `bool`. La regla es numérica:

- si la condición vale **0**, es **falsa**
- si vale **cualquier otro valor**, es **verdadera**

Los operadores relacionales y lógicos producen un `int` que vale `0` o `1`. Por eso puedes usar como condición un número, una variable `bool` o una comparación:

```c
#include <stdio.h>

int main(void) {
    int cantidad = 3;
    bool hayStock = cantidad > 0;

    if (cantidad) {
        printf("cantidad es distinta de cero\n");
    }

    if (hayStock) {
        printf("Hay stock\n");
    }

    return 0;
}
```

> **C básico:** antes de C99 no existía `bool`; las condiciones se guardaban en un `int` con `0` y `1`. En C99 y C17 `bool` existe, pero hay que incluir `<stdbool.h>`.
>
> **C moderno (C23):** `bool`, `true` y `false` son palabras clave. Guardar una condición en una variable `bool` con un nombre claro (`hayStock`, `esValido`) hace que el `if` se lea casi como una frase.
>
> **Portabilidad:** si tu código debe compilar también con `-std=c17`, agrega `#include <stdbool.h>`; en C23 es inofensivo.

Escribir `if (cantidad)` es válido, pero `if (cantidad != 0)` suele ser más claro cuando la variable es un número y no un booleano.

## Sentencia `if`

La sentencia `if` ejecuta un bloque solo si la condición es verdadera. Si es falsa, el bloque se salta y el programa sigue después de la llave de cierre.

```c
if (condicion) {
    instrucciones;
}
```

```c
#include <stdio.h>

int main(void) {
    int edad = 20;

    if (edad >= 18) {
        printf("Es mayor de edad\n");
    }

    printf("Fin del programa\n");
    return 0;
}
```

## Sentencia `if-else`

Con `else` agregas el camino alternativo: un bloque para cuando la condición es verdadera y otro para cuando es falsa. Siempre se ejecuta exactamente uno de los dos.

```c
#include <stdio.h>

int main(void) {
    int numero = 5;

    if (numero % 2 == 0) {
        printf("El número es par\n");
    } else {
        printf("El número es impar\n");
    }

    return 0;
}
```

### El papel de las llaves

Las llaves `{}` delimitan el **bloque** que pertenece al `if` o al `else`. Si omites las llaves, el `if` controla **una sola** sentencia, la siguiente:

<!-- c-check: skip -->
```c
if (edad >= 18)
    printf("Mayor de edad\n");
    printf("Puede continuar\n");   // se ejecuta SIEMPRE: no pertenece al if
```

La sangría engaña a quien lee, pero al compilador no le importa. Por eso en este curso usamos llaves siempre, aunque el bloque tenga una sola línea.

## Cadenas `else if`

Cuando hay más de dos casos, encadenas condiciones con `else if`. C las evalúa **en orden**, de arriba hacia abajo, y ejecuta el bloque de la **primera** que sea verdadera; las demás ya no se evalúan. El `else` final, opcional, cubre todo lo que no coincidió.

```c
#include <stdio.h>

int main(void) {
    int nota = 8;

    if (nota < 0 || nota > 10) {
        printf("Nota inválida\n");
    } else if (nota >= 9) {
        printf("Sobresaliente\n");
    } else if (nota >= 6) {
        printf("Aprobado\n");
    } else {
        printf("Desaprobado\n");
    }

    return 0;
}
```

Como la evaluación se detiene en la primera condición verdadera, el **orden importa**. Si pusieras `nota >= 6` antes que `nota >= 9`, un 10 mostraría "Aprobado" y nunca llegaría a "Sobresaliente". Ordena los rangos de forma que cada condición pueda dar por sentado que las anteriores fueron falsas.

`else if` no es una palabra clave nueva: es un `else` cuyo cuerpo es otro `if`. Escribirlo en una sola línea es solo una convención de formato que evita una escalera de sangrías.

## Sentencias anidadas

Una sentencia **anidada** es una sentencia de control dentro de otra, por ejemplo un `if` dentro de otro `if`. Conviene cuando la segunda decisión solo tiene sentido si la primera ya se cumplió:

```c
#include <stdio.h>

int main(void) {
    int numero = 0;

    if (numero >= 0) {
        if (numero == 0) {
            printf("El número es cero\n");
        } else {
            printf("El número es positivo\n");
        }
    } else {
        printf("El número es negativo\n");
    }

    return 0;
}
```

Cada nivel de anidación obliga a quien lee a recordar más condiciones a la vez. Si pasas de dos o tres niveles, prueba con una cadena `else if` o con condiciones combinadas con `&&`. Este ejemplo, por ejemplo, se puede escribir como `if (numero < 0) ... else if (numero == 0) ... else ...`.

## Proteger una operación con cortocircuito

En la lección de operadores viste que `&&` no evalúa su lado derecho si el izquierdo ya es falso. Eso te permite **proteger** una operación peligrosa dentro de la misma condición:

```c
#include <stdio.h>

int main(void) {
    int total = 120;
    int personas = 0;

    if (personas != 0 && total / personas > 50) {
        printf("Cada persona paga más de 50\n");
    } else {
        printf("No hay personas o cada una paga 50 o menos\n");
    }

    return 0;
}
```

Si `personas` vale `0`, la división nunca se ejecuta, así que no hay división por cero (que sería comportamiento indefinido). El orden es esencial: la guarda va **a la izquierda**.

## Errores comunes

### 1. `=` en lugar de `==`

<!-- c-check: skip -->
```c
if (edad = 18) {
    printf("Tiene 18\n");
}
```

`edad = 18` es una **asignación**: guarda 18 en `edad` y la expresión vale 18, que es distinto de cero, así que la condición es siempre verdadera. Compila, pero `-Wall` te avisa ("using the result of an assignment as a condition"). Para comparar se usa `==`. Por eso compilar siempre con advertencias activadas es tan importante.

### 2. Un `;` suelto después del `if`

<!-- c-check: skip -->
```c
if (saldo < 0);
{
    printf("Saldo negativo\n");
}
```

El `;` termina el `if` con una **sentencia vacía**. El bloque de abajo ya no pertenece al `if` y se ejecuta siempre. Clang avisa con `-Wempty-body`; con GCC, `-Wextra` también lo detecta.

### 3. El `else` colgante

Un `else` pertenece al `if` **más cercano** que todavía no tenga `else`, sin importar la sangría:

<!-- c-check: skip -->
```c
if (a > 0)
    if (b > 0)
        printf("ambos positivos\n");
else
    printf("a no es positivo\n");   // en realidad pertenece a if (b > 0)
```

Con `a = 5` y `b = -1` se muestra "a no es positivo", que es falso. Las llaves eliminan la ambigüedad:

```c
#include <stdio.h>

int main(void) {
    int a = 5;
    int b = -1;

    if (a > 0) {
        if (b > 0) {
            printf("ambos positivos\n");
        }
    } else {
        printf("a no es positivo\n");
    }

    return 0;
}
```

### 4. Comparar valores de punto flotante con `==`

Los `double` guardan aproximaciones binarias, así que dos cálculos que en matemática dan lo mismo pueden diferir en el último bit:

```c
#include <stdio.h>

int main(void) {
    double suma = 0.1 + 0.2;

    if (suma == 0.3) {
        printf("iguales\n");
    } else {
        printf("distintos\n");   // esto es lo que se muestra
    }

    return 0;
}
```

En lugar de `==`, compara si la diferencia es menor que una **tolerancia** adecuada a tu problema:

```c
#include <stdio.h>

int main(void) {
    double suma = 0.1 + 0.2;
    double diferencia = suma - 0.3;
    const double tolerancia = 1e-9;

    if (diferencia < 0) {
        diferencia = -diferencia;
    }

    if (diferencia < tolerancia) {
        printf("prácticamente iguales\n");
    } else {
        printf("distintos\n");
    }

    return 0;
}
```

### 5. Rangos escritos como en matemática

`if (1 <= n <= 10)` compila pero no hace lo que parece: primero calcula `1 <= n` (0 o 1) y compara **ese** resultado con 10, que siempre es verdadero. Escríbelo con `&&`: `if (n >= 1 && n <= 10)`.

## ¿`else if` o `switch`?

En la lección 10 verás `switch`, que elige entre varios casos según el valor de una expresión entera. Un criterio práctico:

| Situación | Herramienta |
| --- | --- |
| Rangos (`nota >= 6`), varias variables, condiciones combinadas con `&&` o `\|\|` | cadena `else if` |
| Valores de punto flotante o comparaciones con tolerancia | cadena `else if` |
| Una sola expresión entera (o un `char`) comparada con varios valores constantes concretos | `switch` |
| Varios valores que comparten el mismo código (un menú, un código de comando) | `switch` |

## Resumen

- `if` ejecuta un bloque solo si la condición es verdadera; `else` cubre el caso contrario
- en C, una condición es falsa si vale 0 y verdadera con cualquier otro valor; `bool` hace explícita la intención
- una cadena `else if` evalúa en orden y ejecuta solo la primera condición verdadera, así que el orden importa
- anida solo cuando una decisión depende de otra, y usa llaves siempre
- `&&` en cortocircuito protege operaciones peligrosas si la guarda va a la izquierda
- cuidado con `=` vs `==`, el `;` después del `if`, el `else` colgante y `==` con `double`
- rangos y condiciones combinadas: `else if`; un valor entero contra constantes: `switch`

## Ejercicios prácticos

### Ejercicio 1: clasificar una temperatura

Escribe un programa que lea una temperatura entera con `scanf` (valida que la lectura funcione) y muestre "Frío" si es menor que 15, "Templado" si está entre 15 y 25 inclusive, y "Calor" si es mayor que 25.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int main(void) {
    int temperatura;

    printf("Temperatura: ");
    if (scanf("%d", &temperatura) != 1) {
        printf("Entrada inválida\n");
        return 1;
    }

    if (temperatura < 15) {
        printf("Frío\n");
    } else if (temperatura <= 25) {
        printf("Templado\n");
    } else {
        printf("Calor\n");
    }

    return 0;
}
```

En la segunda condición no hace falta escribir `temperatura >= 15`: si llegamos ahí, la primera ya fue falsa.

</details>

### Ejercicio 2: encuentra los errores

Este programa debería mostrar "Puede votar" solo para edades de 16 en adelante, pero se comporta mal. Encuentra los dos errores.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int edad = 12;

    if (edad = 16);
    {
        printf("Puede votar\n");
    }

    return 0;
}
```

<details><summary>Ver solución</summary>

1. `edad = 16` asigna en lugar de comparar; además la condición correcta es `edad >= 16`.
2. El `;` después del `if` lo termina con una sentencia vacía, así que el bloque se ejecuta siempre.

```c
#include <stdio.h>

int main(void) {
    int edad = 12;

    if (edad >= 16) {
        printf("Puede votar\n");
    }

    return 0;
}
```

</details>

### Ejercicio 3: división segura

Lee dos enteros `a` y `b`. Si `b` no es cero y el cociente `a / b` es mayor que 10, muestra "Cociente grande"; en cualquier otro caso muestra "Cociente chico o división imposible". Usa una sola condición con cortocircuito.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int main(void) {
    int a;
    int b;

    printf("Ingresa a y b: ");
    if (scanf("%d %d", &a, &b) != 2) {
        printf("Entrada inválida\n");
        return 1;
    }

    if (b != 0 && a / b > 10) {
        printf("Cociente grande\n");
    } else {
        printf("Cociente chico o división imposible\n");
    }

    return 0;
}
```

Si `b` vale 0, `b != 0` es falso y `&&` no evalúa `a / b`.

</details>

### Ejercicio 4: ¿qué muestra?

Predice la salida con `x = 7` y explica a qué `if` pertenece el `else`.

<!-- c-check: skip -->
```c
if (x > 5)
    if (x > 10)
        printf("A\n");
else
    printf("B\n");
```

<details><summary>Ver solución</summary>

Muestra `B`. El `else` pertenece al `if` más cercano sin `else`, que es `if (x > 10)`. Con `x = 7`, `x > 5` es verdadero, `x > 10` es falso, y se ejecuta su `else`. La sangría sugiere otra cosa; por eso conviene usar llaves siempre.

</details>
