---
title: 'Cadenas'
course: 'c'
slug: 'cadenas-de-caracteres-y-operaciones'
order: 17
lang: 'es'
published: true
---

En muchos programas no alcanza con trabajar solo con números. También necesitamos trabajar con texto: nombres, apellidos, ciudades, mensajes, contraseñas, frases y mucho más.

En C, ese texto no se maneja con un tipo especial llamado `string`, como pasa en otros lenguajes. En C, una cadena de caracteres se representa como un **arreglo de caracteres**.

Y esto es CLAVE entenderlo desde el comienzo.

> Una cadena en C no es magia. Es un arreglo de `char` con una marca de final.

En esta lección vas a aprender:

- qué es una cadena de caracteres
- cómo se relaciona con los arreglos
- qué significa `\0`
- cómo declarar e inicializar cadenas
- cómo leer cadenas desde el teclado
- cómo recorrer una cadena carácter por carácter
- operaciones comunes con cadenas
- funciones útiles de `<string.h>`

Antes de empezar, quedate con esta idea: **si entendés los índices y el `\0`, entendés cadenas en C**. Si no entendés eso, vas a terminar copiando funciones de memoria sin saber por qué funcionan. Y ahí es donde después aparecen los errores raros.

## El problema: guardar texto no es guardar un número

Guardar un número es directo:

```c
int edad = 18;
```

Guardar un carácter también:

```c
char inicial = 'A';
```

Pero un nombre como `"Ana"` no entra en un solo `char`, porque un `char` guarda **un carácter**, no una palabra completa.

Esto está mal:

```c
char nombre = 'Ana'; /* incorrecto */
```

¿Por qué? Porque `'Ana'` no es un carácter. Son varios caracteres. Para guardar varios valores del mismo tipo usamos un arreglo.

Entonces, para guardar texto en C, usamos un arreglo de `char`:

```c
char nombre[10];
```

Eso reserva 10 posiciones de memoria para guardar caracteres.

## ¿Qué es una cadena de caracteres?

Una **cadena de caracteres** es una secuencia de caracteres guardada en un arreglo de tipo `char`.

Por ejemplo:

```c
char nombre[] = "Juan";
```

Acá parece que guardamos una sola cosa, pero en realidad se guardan varios caracteres:

- `J`
- `u`
- `a`
- `n`
- y un carácter especial más: `\0`

## ¿Qué significa `\0`?

`\0` se llama **carácter nulo**.

No es una letra, no es un número visible, no se imprime como texto común. Su función es marcar el final de la cadena.

Eso significa que una cadena como `"Juan"` en memoria se representa así:

```text
J u a n \0
```

También podemos verlo con índices:

```text
Indice:      0    1    2    3    4
Contenido:  'J'  'u'  'a'  'n'  '\0'
```

Esto es exactamente igual a pensar en un arreglo común. La diferencia es que, cuando hablamos de cadenas, el `\0` le dice al programa: “hasta acá llega el texto”.

## ¿Por qué `\0` es tan importante?

Porque muchas funciones en C no saben cuántos caracteres querés usar. Entonces leen carácter por carácter hasta encontrar `\0`.

Si ese carácter de final no está donde corresponde, el programa puede leer basura o comportarse mal.

Y eso, hermano, es una de las cosas que más confunden al que recién empieza.

Pensalo así: el arreglo puede tener más espacio del que usa la palabra.

```c
char nombre[10] = "Ana";
```

En memoria queda conceptualmente así:

```text
Indice:      0    1    2    3    4    5    6    7    8    9
Contenido:  'A'  'n'  'a'  '\0' ...  ...  ...  ...  ...  ...
```

La cadena no ocupa necesariamente todo el arreglo. La cadena termina en el primer `\0`.

Eso significa que el **tamaño del arreglo** y la **longitud real del texto** no son lo mismo.

- `char nombre[10]` tiene 10 posiciones disponibles
- `"Ana"` tiene 3 caracteres visibles
- además necesita 1 posición extra para `\0`

## Una cadena es un arreglo de `char`

Como una cadena es un arreglo, podemos acceder a sus posiciones igual que con cualquier otro arreglo.

```c
char nombre[] = "Ana";
```

Entonces:

- `nombre[0]` es `'A'`
- `nombre[1]` es `'n'`
- `nombre[2]` es `'a'`
- `nombre[3]` es `\0`

Fijate algo importante:

- `'A'` con comillas simples representa un **carácter**
- `"Ana"` con comillas dobles representa una **cadena**

No es lo mismo.

## Declaración de cadenas

Cuando declarás una cadena, tenés que pensar en dos cosas:

- cuántos caracteres visibles querés guardar
- una posición extra para el `\0`

Esto es FUNDAMENTAL. Si querés guardar una palabra de 4 letras, necesitás como mínimo 5 posiciones.

### Declaración con tamaño fijo

```c
char ciudad[20];
```

Esto reserva espacio para guardar hasta 19 caracteres visibles y el `\0` final.

No significa que ya haya una palabra guardada. Solo significa que existe espacio reservado.

### Declaración con inicialización directa

```c
char nombre[] = "Lucia";
```

En este caso, el compilador calcula automáticamente el tamaño necesario.

Como `"Lucia"` tiene 5 letras, el arreglo necesita 6 posiciones:

```text
L u c i a \0
```

### Declaración indicando tamaño e inicialización

```c
char apellido[10] = "Perez";
```

Acá se reserva espacio para 10 caracteres, aunque la palabra use menos.

Conceptualmente queda así:

```text
P e r e z \0 ... ... ... ...
```

El texto termina en `\0`; el resto del arreglo queda disponible.

## Caracteres vs cadenas

Esto parece un detalle, pero no lo es:

```c
char letra = 'A';
char palabra[] = "A";
```

No son lo mismo.

`'A'` es un solo carácter.

`"A"` es una cadena. Aunque tenga una sola letra visible, internamente guarda:

```text
'A' '\0'
```

O sea, `"A"` necesita dos posiciones.

Esta diferencia te evita muchísimos errores.

## Ejemplo: mostrar una cadena

```c
#include <stdio.h>

int main() {
    char nombre[] = "Martina";

    printf("Nombre: %s\n", nombre);

    return 0;
}
```

### ¿Qué significa `%s`?

`%s` es el especificador de formato que se usa en `printf` para mostrar cadenas.

## Acceder a caracteres individuales

Como la cadena es un arreglo, podemos leer cada carácter por separado.

```c
#include <stdio.h>

int main() {
    char palabra[] = "Sol";

    printf("Primer caracter: %c\n", palabra[0]);
    printf("Segundo caracter: %c\n", palabra[1]);
    printf("Tercer caracter: %c\n", palabra[2]);

    return 0;
}
```

### Salida esperada

```text
Primer caracter: S
Segundo caracter: o
Tercer caracter: l
```

Fijate que ahora usamos `%c`, porque mostramos un solo carácter cada vez.

## Recorrer una cadena carácter por carácter

También podemos recorrer una cadena con un ciclo.

Esta es una operación clave porque confirma la idea central: una cadena se procesa igual que un arreglo, posición por posición.

```c
#include <stdio.h>

int main() {
    char palabra[] = "Hola";
    int i;

    for (i = 0; palabra[i] != '\0'; i = i + 1) {
        printf("Caracter %d: %c\n", i, palabra[i]);
    }

    return 0;
}
```

## ¿Por qué la condición es `palabra[i] != '\0'`?

Porque no siempre necesitamos saber el tamaño exacto del arreglo completo. Lo que nos importa es recorrer la cadena hasta su final real.

El final real de la cadena está marcado por `\0`.

Entonces el ciclo dice:

> seguí mientras el carácter actual no sea el carácter nulo.

Fantástico. Esa es la idea correcta.

### Salida esperada

```text
Caracter 0: H
Caracter 1: o
Caracter 2: l
Caracter 3: a
```

El `\0` no se imprime porque el ciclo se detiene justo antes de llegar a él.

## Contar caracteres manualmente

Antes de usar funciones de biblioteca, conviene saber hacer una operación manual. No porque siempre vayas a escribirla así, sino porque te obliga a entender el mecanismo.

Por ejemplo, podemos contar cuántos caracteres visibles tiene una cadena:

```c
#include <stdio.h>

int main() {
    char palabra[] = "perro";
    int i = 0;

    while (palabra[i] != '\0') {
        i = i + 1;
    }

    printf("Cantidad de caracteres: %d\n", i);

    return 0;
}
```

### ¿Qué pasa paso a paso?

- `i` empieza en `0`
- se revisa `palabra[0]`
- si no es `\0`, se suma 1
- se repite hasta encontrar el final de la cadena

Cuando el ciclo termina, `i` contiene la cantidad de caracteres visibles.

Para `"perro"`, el resultado es `5`.

¿Ves la idea? No contamos el tamaño total del arreglo. Contamos hasta llegar al `\0`.

## Entrada de cadenas

Leer texto desde el teclado requiere más cuidado que leer un número.

## Leer una palabra con `scanf`

```c
#include <stdio.h>

int main() {
    char nombre[20];

    printf("Ingresa tu nombre: ");
    scanf("%19s", nombre);

    printf("Hola, %s\n", nombre);

    return 0;
}
```

### ¿Qué hace bien este ejemplo?

- `nombre` tiene espacio reservado
- `scanf` guarda allí la palabra ingresada
- `%s` indica que vamos a leer una cadena
- `%19s` limita la lectura a 19 caracteres visibles

### ¿Por qué usamos `%19s` y no solo `%s`?

Porque `nombre` tiene 20 posiciones:

```c
char nombre[20];
```

Pero una posición debe quedar para el `\0` final.

Entonces podemos leer como máximo 19 caracteres visibles.

Esto:

```c
scanf("%19s", nombre);
```

le dice a `scanf`: “leé una palabra, pero no más de 19 caracteres”.

Ponete las pilas con esto: usar `scanf("%s", nombre)` sin límite puede escribir más caracteres de los que entran en el arreglo. Eso se llama desbordamiento de buffer y es una fuente clásica de errores en C.

### Limitación importante de `scanf("%s", ...)`

Lee solo hasta el primer espacio.

Entonces:

- si escribís `Ana`, lee `Ana`
- si escribís `Ana Maria`, solo lee `Ana`

Además, `scanf` deja de leer cuando encuentra un espacio, una tabulación o un salto de línea.

## Leer una línea completa con `fgets`

Cuando necesitamos leer texto con espacios, usamos `fgets`.

```c
#include <stdio.h>

int main() {
    char frase[100];

    printf("Escribi una frase: ");
    fgets(frase, 100, stdin);

    printf("La frase ingresada fue: %s", frase);

    return 0;
}
```

### ¿Qué recibe `fgets`?

```c
fgets(frase, 100, stdin);
```

- `frase`: dónde se guarda el texto
- `100`: cantidad máxima de caracteres a leer
- `stdin`: entrada estándar, o sea, el teclado

### Detalle importante: `fgets` puede guardar el salto de línea

Si escribís:

```text
Hola mundo
```

y apretás Enter, `fgets` puede guardar también ese Enter como `\n`, siempre que haya espacio en el arreglo.

Por eso, muchas veces conviene quitar ese `\n` al final.

Podemos hacerlo recorriendo la cadena:

```c
#include <stdio.h>

int main() {
    char frase[100];
    int i;

    printf("Escribi una frase: ");
    fgets(frase, 100, stdin);

    for (i = 0; frase[i] != '\0'; i = i + 1) {
        if (frase[i] == '\n') {
            frase[i] = '\0';
        }
    }

    printf("Frase limpia: %s\n", frase);

    return 0;
}
```

### ¿Qué hicimos?

- recorrimos la cadena carácter por carácter
- buscamos el carácter `\n`
- cuando lo encontramos, lo reemplazamos por `\0`

Eso convierte el salto de línea en el final real de la cadena.

No memorices esto como receta ciega. Entendé el concepto: **modificamos un carácter del arreglo**.

## Diferencia entre `scanf` y `fgets`

### `scanf("%s", cadena)`

- sirve para una sola palabra
- se detiene en el primer espacio
- es simple, pero limitada

### `fgets(cadena, tamanio, stdin)`

- permite leer una línea completa
- acepta espacios
- suele ser más útil para frases

## Operaciones comunes con cadenas

Como una cadena es un arreglo, muchas operaciones podrían hacerse manualmente con ciclos. Pero C también ofrece funciones en la biblioteca `<string.h>`.

Primero entendamos qué significa cada operación:

- medir: contar caracteres hasta `\0`
- copiar: pasar caracteres de una cadena a otra
- comparar: revisar si dos cadenas tienen los mismos caracteres en el mismo orden
- concatenar: agregar una cadena al final de otra

Las funciones de `<string.h>` hacen estas tareas por nosotros, pero internamente la idea sigue siendo la misma: recorrer caracteres.

## Copiar manualmente una cadena

Antes de usar `strcpy`, mirá cómo sería copiar una cadena a mano:

```c
#include <stdio.h>

int main() {
    char origen[] = "Hola";
    char destino[20];
    int i = 0;

    while (origen[i] != '\0') {
        destino[i] = origen[i];
        i = i + 1;
    }

    destino[i] = '\0';

    printf("Destino: %s\n", destino);

    return 0;
}
```

### La línea más importante

```c
destino[i] = '\0';
```

Esa línea pone el final de la cadena copiada.

Si te olvidás de copiar o agregar el `\0`, el programa no sabe dónde termina el texto. Y ahí empieza la locura cósmica: caracteres basura, salidas raras y bugs difíciles de entender.

## Comparar manualmente dos cadenas

También podemos comparar dos cadenas carácter por carácter.

```c
#include <stdio.h>

int main() {
    char a[] = "sol";
    char b[] = "sol";
    int i = 0;
    int iguales = 1;

    while (a[i] != '\0' || b[i] != '\0') {
        if (a[i] != b[i]) {
            iguales = 0;
        }

        i = i + 1;
    }

    if (iguales == 1) {
        printf("Son iguales.\n");
    } else {
        printf("Son diferentes.\n");
    }

    return 0;
}
```

No te preocupes si después usás `strcmp`. Está perfecto. Pero este ejemplo te muestra la idea de fondo: comparar cadenas no es comparar una sola cosa, sino comparar posiciones.

## Longitud de una cadena: `strlen`

`strlen` devuelve la cantidad de caracteres de la cadena, sin contar el `\0`.

Es decir: hace por nosotros algo muy parecido al ejemplo manual donde contábamos caracteres hasta encontrar el final.

```c
#include <stdio.h>
#include <string.h>

int main() {
    char palabra[] = "computadora";

    printf("Longitud: %d\n", strlen(palabra));

    return 0;
}
```

### Resultado

La longitud es `11`, porque la palabra tiene 11 letras. El `\0` no se cuenta.

Ojo con este punto: `strlen` no devuelve el tamaño total del arreglo. Devuelve la longitud real de la cadena hasta `\0`.

```c
char texto[20] = "Hola";
```

En este caso:

- el arreglo tiene 20 posiciones
- `strlen(texto)` devuelve 4

Son conceptos distintos.

## Copiar una cadena: `strcpy`

No podemos copiar cadenas con el signo `=` como si fueran números.

Esto NO es correcto para copiar contenido:

```c
/* destino = origen; */
```

Para copiar una cadena usamos `strcpy`.

```c
#include <stdio.h>
#include <string.h>

int main() {
    char origen[] = "Hola";
    char destino[20];

    strcpy(destino, origen);

    printf("Destino: %s\n", destino);

    return 0;
}
```

### Idea importante

- `origen` contiene el texto original
- `destino` debe tener espacio suficiente
- `strcpy` copia carácter por carácter, incluyendo el `\0`

Si `destino` no tiene espacio suficiente, `strcpy` puede escribir fuera del arreglo. C no te salva automáticamente. Por eso, antes de copiar, tenés que pensar si el destino tiene lugar para el texto y para el `\0`.

## Comparar cadenas: `strcmp`

Para comparar si dos cadenas son iguales no debemos usar `==`.

Eso sería un error conceptual.

Con arreglos, `==` no compara el contenido carácter por carácter. Para comparar texto, necesitás una función que recorra ambas cadenas y revise sus caracteres.

Para comparar contenido usamos `strcmp`.

```c
#include <stdio.h>
#include <string.h>

int main() {
    char clave1[] = "casa";
    char clave2[] = "casa";

    if (strcmp(clave1, clave2) == 0) {
        printf("Las cadenas son iguales.\n");
    } else {
        printf("Las cadenas son diferentes.\n");
    }

    return 0;
}
```

### ¿Por qué se compara con `0`?

Porque `strcmp`:

- devuelve `0` si las cadenas son iguales
- devuelve otro valor si son diferentes

Para este nivel, con entender que `0` significa “son iguales” alcanza perfecto.

Pensalo así:

```c
if (strcmp(clave1, clave2) == 0)
```

se lee como:

> si el contenido de `clave1` y `clave2` es igual...

## Concatenar cadenas: `strcat`

**Concatenar** significa unir una cadena con otra.

```c
#include <stdio.h>
#include <string.h>

int main() {
    char nombre[30] = "Ana";

    strcat(nombre, " Maria");

    printf("Nombre completo: %s\n", nombre);

    return 0;
}
```

### Resultado

La variable `nombre` pasa a contener:

```text
Ana Maria
```

### Cuidado

El arreglo destino debe tener espacio suficiente para guardar:

- su contenido original
- la cadena que agregamos
- el `\0` final

En este ejemplo `nombre` tiene 30 posiciones, por eso entra `"Ana Maria"` sin problema.

## Ejemplo completo con varias operaciones

```c
#include <stdio.h>
#include <string.h>

int main() {
    char nombre[20] = "Juan";
    char apellido[20] = "Perez";
    char completo[50] = "";

    strcpy(completo, nombre);
    strcat(completo, " ");
    strcat(completo, apellido);

    printf("Nombre completo: %s\n", completo);
    printf("Longitud: %d\n", strlen(completo));

    if (strcmp(nombre, "Juan") == 0) {
        printf("El nombre guardado es Juan.\n");
    }

    return 0;
}
```

## Recorrer una cadena para contar vocales

Además de usar funciones de biblioteca, también podemos resolver problemas recorriendo la cadena manualmente.

```c
#include <stdio.h>

int main() {
    char palabra[] = "murcielago";
    int i;
    int cantidadVocales = 0;

    for (i = 0; palabra[i] != '\0'; i = i + 1) {
        if (palabra[i] == 'a' || palabra[i] == 'e' || palabra[i] == 'i' || palabra[i] == 'o' || palabra[i] == 'u') {
            cantidadVocales = cantidadVocales + 1;
        }
    }

    printf("Cantidad de vocales: %d\n", cantidadVocales);

    return 0;
}
```

Este ejemplo es muy valioso porque muestra algo clave:

> una cadena no solo se imprime o se copia; también puede procesarse carácter por carácter.

### Mejora posible

Este ejemplo cuenta vocales minúsculas. Si la palabra tuviera mayúsculas, como `"Murcielago"`, la `M` no importa porque no es vocal, pero si tuviera `"Avion"`, la `A` no se contaría con este código.

Para este nivel está bien. Más adelante podrías ampliar la condición para incluir `A`, `E`, `I`, `O`, `U`.

Lo importante ahora es entender el recorrido.

## Errores comunes al trabajar con cadenas

### Confundir carácter con cadena

- `'A'` es un carácter
- `"A"` es una cadena

No son lo mismo.

### No dejar espacio suficiente

```c
char nombre[4] = "Juan";
```

Esto está mal, porque `"Juan"` necesita:

- `J`
- `u`
- `a`
- `n`
- `\0`

O sea, necesita 5 posiciones.

La versión correcta sería:

```c
char nombre[5] = "Juan";
```

o mejor todavía, dejar que el compilador calcule:

```c
char nombre[] = "Juan";
```

### Comparar cadenas con `==`

Para comparar contenido, usá `strcmp`.

```c
if (strcmp(a, b) == 0) {
    printf("Son iguales.\n");
}
```

### Olvidarse de que `scanf("%s", ...)` no lee espacios

Si necesitás leer una frase completa, usá `fgets`.

### Usar `scanf("%s", cadena)` sin límite

Si el arreglo tiene 20 posiciones, usá un ancho máximo:

```c
scanf("%19s", cadena);
```

Ese `19` deja lugar para el `\0`.

### Olvidarse del `\n` que puede dejar `fgets`

Si después de leer una frase aparecen saltos de línea raros, revisá si `fgets` guardó el `\n`.

Podés reemplazarlo por `\0` recorriendo la cadena.

### Pensar que el tamaño del arreglo y la longitud de la cadena son iguales

No necesariamente.

```c
char texto[50] = "Hola";
```

Acá el arreglo tiene 50 posiciones, pero la cadena tiene 4 caracteres visibles.

## Resumen

- una cadena en C es un arreglo de `char`
- toda cadena termina en `\0`
- el `\0` marca el final real del texto
- el tamaño del arreglo y la longitud de la cadena no son lo mismo
- `%s` se usa para mostrar cadenas completas
- `%c` se usa para mostrar un solo carácter
- una cadena puede recorrerse con un ciclo como cualquier arreglo
- `scanf("%s", ...)` lee una palabra, pero conviene limitar el ancho
- `fgets` permite leer frases con espacios
- `fgets` puede guardar el `\n`, y podemos reemplazarlo por `\0`
- `strlen` mide longitud
- `strcpy` copia
- `strcmp` compara
- `strcat` concatena

## Qué deberías poder explicar antes de seguir

Antes de pasar a la próxima lección, deberías poder responder estas preguntas:

- ¿por qué `"Ana"` necesita 4 posiciones y no 3?
- ¿qué diferencia hay entre `'A'` y `"A"`?
- ¿por qué una cadena se puede recorrer con un `for` o un `while`?
- ¿por qué `scanf("%s", nombre)` no lee `Ana Maria` completo?
- ¿por qué `strcmp(a, b) == 0` significa que dos cadenas son iguales?
- ¿qué puede pasar si te olvidás del `\0`?

Si podés explicar eso, no estás memorizando: estás entendiendo. Y eso vale muchísimo más.

## Idea final

Si entendés que una cadena en C es un arreglo de caracteres con un final marcado por `\0`, se ordena TODO.

Y cuando eso se entiende de verdad, dejás de memorizar funciones sueltas y empezás a comprender qué está pasando en memoria y en el programa.