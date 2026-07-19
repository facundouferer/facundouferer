---
title: 'Operador ternario'
course: 'c'
slug: 'operador-ternario'
order: 8
lang: 'es'
published: true
---

Después de aprender `if-else`, aparece una herramienta muy útil para resolver **decisiones simples** de una manera más corta: el **operador ternario**.

Se llama “ternario” porque trabaja con **tres partes**.

En esta lección vas a aprender:

- qué es el operador ternario
- cuál es su sintaxis
- cómo se relaciona con `if-else`
- cuándo conviene usarlo
- errores comunes al empezar

> Idea clave: el operador ternario sirve para elegir entre dos valores según una condición. Es útil cuando la decisión es simple, pero no reemplaza a `if-else` en todos los casos.

## ¿Qué problema resuelve?

A veces querés guardar un valor distinto según una condición.

Por ejemplo:

- si la nota es 6 o más, guardar “aprobado”
- si un número es par, guardar “par”
- si la edad es 18 o más, guardar `1`, y si no, guardar `0`

Eso se puede hacer con `if-else`, claro.

Pero cuando solo necesitás **elegir un valor entre dos opciones**, el operador ternario puede escribir esa idea de forma más directa.

## Sintaxis general

La forma general es esta:

```c
condicion ? valor_si_verdadero : valor_si_falso
```

Leelo así:

> si la condición es verdadera, usar este valor; si es falsa, usar este otro

## Ejemplo simple

```c
int edad = 20;
int esMayor = edad >= 18 ? 1 : 0;
```

### ¿Qué pasa acá?

1. se evalúa la condición `edad >= 18`
2. como es verdadera, se usa el valor `1`
3. ese valor se guarda en `esMayor`

Si `edad` fuera menor que `18`, entonces se guardaría `0`.

## Equivalencia con `if-else`

Este código con ternario:

```c
int numero = 8;
char* tipo = numero % 2 == 0 ? "par" : "impar";
```

expresa la misma idea que este código con `if-else`:

```c
int numero = 8;
char* tipo;

if (numero % 2 == 0) {
    tipo = "par";
} else {
    tipo = "impar";
}
```

La diferencia no está en **lo que resuelve**, sino en **cómo se escribe**.

## Ejemplo completo en C

```c
#include <stdio.h>

int main() {
    int nota = 7;
    char* resultado = nota >= 6 ? "Aprobado" : "Desaprobado";

    printf("%s\n", resultado);

    return 0;
}
```

Si `nota` vale `7`, se muestra `Aprobado`.
Si `nota` valiera `4`, se mostraría `Desaprobado`.

## ¿Por qué se llama operador?

Y acá está una diferencia FUNDAMENTAL que mucha gente principiante no entiende al comienzo.

`if-else` es una **estructura de control**.

En cambio, el ternario es un **operador** que forma una **expresión**.

Eso significa que el ternario **produce un valor**.

Por eso podés usarlo, por ejemplo, al asignar una variable:

```c
int menor = a < b ? a : b;
```

Acá el resultado de toda la expresión ternaria es un valor: `a` o `b`.

## Otro ejemplo útil: elegir el menor de dos números

```c
#include <stdio.h>

int main() {
    int a = 12;
    int b = 5;
    int menor = a < b ? a : b;

    printf("El menor es: %d\n", menor);

    return 0;
}
```

Si `a` es menor que `b`, `menor` guarda `a`.
Si no, guarda `b`.

## ¿Cuándo conviene usarlo?

Conviene usar el operador ternario cuando:

- la condición es clara
- solo hay dos posibles resultados
- querés obtener un valor
- la expresión sigue siendo fácil de leer

## ¿Cuándo NO conviene usarlo?

No conviene usarlo cuando la lógica empieza a enredarse.

Por ejemplo, si la condición es muy larga o si querés meter un ternario dentro de otro, el código se vuelve más difícil de leer.

Y si el código se vuelve difícil de leer, ya perdiste el beneficio.

Mirá esta idea:

```c
int resultado = edad >= 18 ? 1 : 0;
```

Eso está bien.

Pero si empezás a escribir cosas demasiado complejas en una sola línea, ya conviene volver a `if-else`.

## Errores comunes al empezar

### 1. Creer que reemplaza siempre a `if-else`

No. Sirve para decisiones simples que devuelven un valor.

Si tenés varios pasos dentro de cada camino, `if-else` suele ser mejor opción.

### 2. No entender qué parte corresponde a cada caso

Recordá el orden:

```c
condicion ? verdadero : falso
```

Primero va la condición, después el valor si se cumple, y al final el valor si no se cumple.

### 3. Querer hacerlo demasiado “inteligente”

El objetivo del código no es parecer sofisticado. El objetivo es que se entienda.

Si el ternario complica la lectura, no lo uses.

## Resumen

- el operador ternario permite elegir entre dos valores
- su forma general es `condicion ? valor_si_verdadero : valor_si_falso`
- se parece a un `if-else`, pero produce un valor
- conviene para decisiones simples y claras
- si la expresión se vuelve confusa, es mejor usar `if-else`

## Idea final

El operador ternario es una herramienta chica, pero muy útil.

Bien usado, te permite escribir decisiones simples de una forma compacta y clara.

Mal usado, convierte una idea simple en una línea difícil de entender.

Y en programación, hermano, **claridad siempre le gana a la viveza**.