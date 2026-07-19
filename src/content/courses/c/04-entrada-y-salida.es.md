---
title: 'Entrada y Salida'
course: 'c'
slug: 'entrada-y-salida'
order: 4
lang: 'es'
published: true
---

Hasta ahora viste que un programa puede guardar información en variables. Pero un programa realmente empieza a resultar útil cuando puede **mostrar información** y también **recibir datos**.

A eso lo llamamos **salida** y **entrada**.

- **Salida**: cuando el programa muestra información hacia afuera, por ejemplo en pantalla.
- **Entrada**: cuando el programa recibe información desde afuera, por ejemplo cuando una persona escribe con el teclado.

En esta lección vas a aprender:

- qué significa entrada y salida en un programa
- cómo mostrar mensajes y valores con `printf`
- qué son los especificadores de formato
- cómo leer datos simples con `scanf`
- por qué a veces aparece el símbolo `&`
- errores comunes al empezar con entrada y salida

> Idea clave: un programa sin entrada ni salida es como una persona que piensa pero no habla ni escucha. Puede tener datos adentro, pero no interactúa con nadie.

## ¿Qué es la salida de datos?

La **salida de datos** ocurre cuando el programa envía información hacia el exterior.

En los programas iniciales en C, la salida más común es mostrar texto o valores en la pantalla.

Por ejemplo, un programa puede mostrar:

- un mensaje de bienvenida
- el valor de una variable
- el resultado de un cálculo

En C, la función más usada para esto es `printf`.

## `printf`: mostrar información en pantalla

La función `printf()` sirve para imprimir texto en pantalla.

Ejemplo:

```c
#include <stdio.h>

int main() {
    printf("Hola, mundo\n");
    return 0;
}
```

Ese programa muestra el mensaje `Hola, mundo`.

### ¿Qué significa `\n`?

Dentro del texto aparece esto:

```c
\n
```

Eso representa un **salto de línea**.

Es decir, después de mostrar el texto, el cursor baja a la línea siguiente.

Por ejemplo:

```c
printf("Primera línea\n");
printf("Segunda línea\n");
```

La salida sería:

```text
Primera línea
Segunda línea
```

## `printf` mostrando solo texto

Al principio, `printf` puede usarse simplemente para mostrar mensajes.

```c
printf("Bienvenido al programa\n");
printf("C es un lenguaje poderoso\n");
```

Fijate que el texto va entre **comillas dobles**.

Eso indica que estamos escribiendo un mensaje literal para mostrar en pantalla.

## Mostrar el valor de una variable

`printf` no solo sirve para mostrar texto fijo. También puede mostrar el valor guardado en una variable.

Mirá este ejemplo:

```c
#include <stdio.h>

int main() {
    int edad = 18;
    printf("La edad es %d\n", edad);
    return 0;
}
```

Acá aparece algo nuevo:

```c
%d
```

Eso se llama **especificador de formato**.

## ¿Qué es un especificador de formato?

Un especificador de formato le indica a `printf` qué tipo de dato tiene que mostrar en ese lugar del texto.

Pensalo así: dentro del mensaje dejamos un espacio reservado para que después aparezca el valor de una variable.

En este ejemplo:

```c
printf("La edad es %d\n", edad);
```

- el texto es `La edad es `
- `%d` le dice a `printf` que ahí va un número entero
- `edad` es la variable cuyo valor se va a mostrar

Si `edad` vale `18`, la salida será:

```text
La edad es 18
```

## Especificadores más comunes al comenzar

Por ahora, los más importantes son estos:

### `%d`

Se usa para mostrar valores de tipo `int`.

```c
int cantidad = 25;
printf("Cantidad: %d\n", cantidad);
```

### `%f`

Se usa para mostrar valores de tipo `float`.

```c
float altura = 1.75;
printf("Altura: %f\n", altura);
```

### `%c`

Se usa para mostrar valores de tipo `char`.

```c
char inicial = 'F';
printf("Inicial: %c\n", inicial);
```

## Ejemplos separados por tipo de dato

### Mostrar un entero

```c
#include <stdio.h>

int main() {
    int edad = 20;
    printf("Edad: %d\n", edad);
    return 0;
}
```

### Mostrar un decimal

```c
#include <stdio.h>

int main() {
    float precio = 1499.50;
    printf("Precio: %f\n", precio);
    return 0;
}
```

### Mostrar un carácter

```c
#include <stdio.h>

int main() {
    char letra = 'A';
    printf("Letra: %c\n", letra);
    return 0;
}
```

## Mezclar texto y valores

Una de las cosas más útiles de `printf` es que permite combinar texto con valores.

```c
#include <stdio.h>

int main() {
    int edad = 18;
    float altura = 1.72;
    char inicial = 'F';

    printf("Edad: %d\n", edad);
    printf("Altura: %f\n", altura);
    printf("Inicial: %c\n", inicial);

    return 0;
}
```

Esto hace que la información del programa pueda verse de forma clara para quien lo usa.

## ¿Qué es la entrada de datos?

La **entrada de datos** ocurre cuando el programa recibe información desde el exterior.

En los programas básicos en C, eso suele pasar cuando el usuario escribe datos con el teclado.

Por ejemplo, el programa puede pedir:

- una edad
- un número
- una letra
- un precio

En C, una de las funciones más conocidas para leer datos básicos es `scanf()`.

## `scanf`: leer datos ingresados por el usuario

La función `scanf()` permite leer datos que el usuario escribe.

Ejemplo:

```c
#include <stdio.h>

int main() {
    int edad;

    printf("Ingrese su edad: ");
    scanf("%d", &edad);

    printf("Usted tiene %d años\n", edad);

    return 0;
}
```

## ¿Qué hace este programa?

Paso a paso:

1. declara una variable llamada `edad`
2. muestra el mensaje `Ingrese su edad:`
3. espera que el usuario escriba un número
4. guarda ese número en la variable `edad`
5. muestra el valor guardado

Esto ya permite interacción real entre el usuario y el programa.

## La estructura básica de `scanf`

La forma general es:

```c
scanf("especificador", &variable);
```

Por ejemplo:

```c
scanf("%d", &edad);
```

Acá:

- `%d` indica que se espera un entero
- `&edad` indica dónde se va a guardar el valor leído

## ¿Por qué aparece `&` en `scanf`?

Excelente pregunta. Y sí, esta parte suele confundir al principio.

Cuando usás `scanf`, el programa necesita saber **dónde guardar** el dato que el usuario escribió.

Por eso aparece el símbolo `&` antes del nombre de la variable.

En esta etapa, alcanza con esta idea:

> `&variable` le permite a `scanf` trabajar directamente con esa variable para guardar ahí el dato leído.

No hace falta meterse todavía con explicaciones más avanzadas.

Por ahora, quedate con esta regla práctica:

- con `scanf`, para leer `int`, `float` y `char`, normalmente vas a usar `&` antes de la variable

## Leer un entero con `scanf`

```c
#include <stdio.h>

int main() {
    int numero;

    printf("Ingrese un número entero: ");
    scanf("%d", &numero);

    printf("El número ingresado es %d\n", numero);

    return 0;
}
```

## Leer un decimal con `scanf`

```c
#include <stdio.h>

int main() {
    float precio;

    printf("Ingrese un precio: ");
    scanf("%f", &precio);

    printf("El precio ingresado es %f\n", precio);

    return 0;
}
```

## Leer un carácter con `scanf`

```c
#include <stdio.h>

int main() {
    char inicial;

    printf("Ingrese una letra: ");
    scanf(" %c", &inicial);

    printf("La letra ingresada es %c\n", inicial);

    return 0;
}
```

Fijate en este detalle:

```c
" %c"
```

Hay un espacio antes de `%c`.

Y no está puesto porque sí.

## Un problema muy común con `scanf` y `%c`

Cuando leemos primero un número y después un carácter, muchas veces pasa esto:

- el programa pide un número
- escribimos el número y apretamos Enter
- después el programa pide una letra
- pero parece que “se saltea” la lectura del carácter

Mirá este ejemplo:

```c
#include <stdio.h>

int main() {
    int ruedas;
    char inicialMarca;

    printf("Ingrese la cantidad de ruedas: ");
    scanf("%d", &ruedas);

    printf("Ingrese la inicial de la marca: ");
    scanf("%c", &inicialMarca);

    printf("Ruedas: %d\n", ruedas);
    printf("Inicial: %c\n", inicialMarca);

    return 0;
}
```

A simple vista parece correcto. Pero puede fallar.

## ¿Qué está pasando realmente?

Cuando escribís un número como `4` y después apretás Enter, no solo se ingresa el `4`.

También queda registrado el salto de línea que produce la tecla Enter.

Entonces, después de esto:

```c
scanf("%d", &ruedas);
```

el número se guarda en `ruedas`, pero el `\n` del Enter puede quedar en el buffer de entrada.

Luego, cuando hacés esto:

```c
scanf("%c", &inicialMarca);
```

`scanf` toma el siguiente carácter disponible.

Y ese siguiente carácter puede ser justamente el salto de línea `\n` que quedó pendiente.

Por eso parece que el programa “se saltea” el prompt, cuando en realidad sí leyó algo: leyó el Enter anterior como carácter válido.

## Solución simple

La solución práctica más común al empezar es escribir un espacio antes de `%c`.

Así:

```c
scanf(" %c", &inicialMarca);
```

Ese espacio le dice a `scanf` que ignore cualquier whitespace anterior antes de leer el carácter real.

### ¿Qué significa whitespace?

Significa caracteres en blanco, por ejemplo:

- espacios
- tabulaciones
- saltos de línea

Entonces, si quedó un `\n` del Enter anterior, ese espacio hace que `scanf` lo descarte y siga esperando una letra real.

## Ejemplo corregido

```c
#include <stdio.h>

int main() {
    int ruedas;
    char inicialMarca;

    printf("Ingrese la cantidad de ruedas: ");
    scanf("%d", &ruedas);

    printf("Ingrese la inicial de la marca: ");
    scanf(" %c", &inicialMarca);

    printf("Ruedas: %d\n", ruedas);
    printf("Inicial: %c\n", inicialMarca);

    return 0;
}
```

## Idea práctica para principiantes

Cuando uses `scanf` para leer un `char`, esta forma es una muy buena costumbre:

```c
scanf(" %c", &variableChar);
```

No porque siempre haya un problema, sino porque evita uno de los errores más comunes al empezar.

## Relación entre tipos y especificadores

Hay una relación directa entre el tipo de dato y el especificador que usás.

### Para mostrar con `printf`

- `int` → `%d`
- `float` → `%f`
- `char` → `%c`

### Para leer con `scanf`

- `int` → `%d`
- `float` → `%f`
- `char` → `%c`

Esto hay que aprenderlo bien, porque si mezclás tipos y especificadores, el programa deja de comportarse como esperás.

## Un ejemplo completo de entrada y salida

```c
#include <stdio.h>

int main() {
    int edad;
    float altura;
    char inicial;

    printf("Ingrese su edad: ");
    scanf("%d", &edad);

    printf("Ingrese su altura: ");
    scanf("%f", &altura);

    printf("Ingrese la inicial de su nombre: ");
    scanf(" %c", &inicial);

    printf("Edad: %d\n", edad);
    printf("Altura: %f\n", altura);
    printf("Inicial: %c\n", inicial);

    return 0;
}
```

Este programa:

- recibe datos del usuario
- los guarda en variables
- luego los muestra en pantalla

Ahí ya ves claramente cómo se conectan las lecciones:

- primero aprendiste variables
- ahora ves cómo cargarlas y cómo mostrar su contenido

## Errores comunes al empezar

### 1. Olvidar incluir `stdio.h`

Si usás `printf` o `scanf`, necesitás:

```c
#include <stdio.h>
```

### 2. Olvidar el punto y coma

```c
printf("Hola")
```

Eso está mal. En C, la sentencia debe terminar con `;`.

Correcto:

```c
printf("Hola");
```

### 3. Usar mal el especificador de formato

Esto está mal:

```c
int edad = 18;
printf("%f\n", edad);
```

¿Por qué? Porque `edad` es `int`, y `%f` se usa para `float`.

Lo correcto sería:

```c
printf("%d\n", edad);
```

### 4. Olvidar `&` en `scanf`

Esto está mal:

```c
scanf("%d", edad);
```

Lo correcto es:

```c
scanf("%d", &edad);
```

### 5. Querer leer texto completo antes de tiempo

Muchos principiantes quieren pasar enseguida a nombres completos o frases.

Pero eso conviene verlo con calma más adelante, cuando aparezca la lección de cadenas de caracteres.

En esta etapa, lo importante es dominar bien la entrada y salida de:

- enteros
- decimales
- caracteres

## Resumen

- la **salida** permite que el programa muestre información
- la **entrada** permite que el programa reciba información
- `printf()` se usa para mostrar texto y valores en pantalla
- `scanf()` se usa para leer datos simples ingresados por el usuario
- `%d`, `%f` y `%c` son especificadores fundamentales al comenzar
- en `scanf()`, normalmente aparece `&` antes de la variable
- entrada y salida conectan al programa con quien lo usa

## Idea final

Cuando un programa puede mostrar y recibir datos, deja de ser una secuencia cerrada de instrucciones y empieza a convertirse en una herramienta interactiva.

Y eso es un paso enorme.

Porque programar no es solo guardar cosas en memoria: también es poder comunicarse con el usuario de forma clara.