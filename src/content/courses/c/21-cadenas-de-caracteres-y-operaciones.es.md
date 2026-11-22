---
title: 'Cadenas'
course: 'c'
slug: 'cadenas-de-caracteres-y-operaciones'
order: 21
lang: 'es'
published: true
---

Nombres, mensajes, contraseñas, líneas de un archivo: casi todo programa maneja texto. C no tiene un tipo `string` como otros lenguajes. Una **cadena** en C es algo que ya conoces: un **arreglo de `char`**, con una marca especial que indica dónde termina el texto. Si entiendes los índices de la lección 19 y esa marca, entiendes las cadenas; y también entiendes por qué son la fuente más famosa de errores de seguridad en C.

## Objetivos

- Explicar qué es una cadena: un arreglo de `char` terminado en `'\0'`.
- Distinguir la **capacidad** del arreglo de la **longitud** del texto, y calcular cada una.
- Recorrer una cadena y usar `strlen`, `strcmp`, `strchr` y `strcspn`.
- Leer palabras con `scanf("%19s", ...)` y líneas con `fgets`, quitando el salto de línea.
- Copiar y concatenar sin desbordar el arreglo: los riesgos de `strcpy` y `strcat`, las alternativas `snprintf` y `strncat`, y las trampas de `strncpy`.
- Convertir entre números y texto.

**Requisitos previos:** `arreglos-unidimensionales-y-multidimensionales` (índices, límite, `sizeof`, arreglos como parámetros), `operaciones-con-arreglos` (recorrer, copiar), `entrada-y-salida` (`scanf`, `printf`, validar con `!= 1`).

## Una cadena es un arreglo de `char` con terminador

```c
char nombre[] = "Ana";
```

El literal `"Ana"` tiene tres letras, pero el arreglo tiene **cuatro** elementos. El compilador agrega al final el carácter nulo `'\0'`, el **terminador**:

```text
índice:    0     1     2     3
nombre:  ['A'] ['n'] ['a'] ['\0']
```

`'\0'` es el carácter de código 0. No es el dígito `'0'` (que tiene código 48) ni un espacio. Su única función es decir "aquí termina el texto". Todas las funciones de cadenas (`printf` con `%s`, `strlen`, `strcmp`...) avanzan carácter por carácter **hasta encontrar `'\0'`**. Una cadena sin terminador no es una cadena: esas funciones seguirían leyendo más allá del límite del arreglo.

Comillas simples y dobles no son lo mismo:

- `'A'` es **un carácter** (un `char`).
- `"A"` es **una cadena**: un arreglo de dos `char`, `'A'` y `'\0'`.

## Capacidad y longitud

Dos números describen una cadena, y confundirlos es el origen de casi todos los errores:

- **Capacidad**: cuántos `char` tiene el arreglo. Se fija al declararlo. Se obtiene con `sizeof`, donde el arreglo está declarado.
- **Longitud**: cuántos caracteres hay **antes** del `'\0'`. Cambia según el texto guardado. Se obtiene con `strlen`.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char saludo[10] = "Hola";

    printf("Texto: %s\n", saludo);
    printf("Capacidad: %zu\n", sizeof saludo);
    printf("Longitud: %zu\n", strlen(saludo));
    printf("Primer carácter: %c\n", saludo[0]);
    printf("¿saludo[4] es el terminador? %s\n", saludo[4] == '\0' ? "sí" : "no");
    return 0;
}
```

```text
índice:   0    1    2    3    4     5     6     7     8     9
saludo: ['H']['o']['l']['a']['\0']['\0']['\0']['\0']['\0']['\0']
         |---- longitud 4 ---|
         |----------------------- capacidad 10 --------------------|
```

La regla que hay que recordar: **una cadena de longitud `L` necesita capacidad `L + 1`**. En un arreglo de capacidad 10 cabe un texto de hasta 9 caracteres.

`strlen` devuelve un `size_t`, por eso se muestra con `%zu`. Usar `%d` es un error: el tipo no coincide y el compilador lo avisa.

## Recorrer una cadena

Como una cadena es un arreglo, se recorre con índices. La diferencia es la condición de corte: en lugar de comparar con una cantidad `n`, se avanza **hasta el terminador**.

```c
#include <stdio.h>

size_t longitud(const char s[]) {
    size_t n = 0;
    while (s[n] != '\0') {
        n++;
    }
    return n;
}

void a_mayusculas(char s[]) {
    for (size_t i = 0; s[i] != '\0'; i++) {
        if (s[i] >= 'a' && s[i] <= 'z') {
            s[i] = s[i] - 'a' + 'A';
        }
    }
}

int main(void) {
    char palabra[] = "cadena";

    printf("Longitud calculada a mano: %zu\n", longitud(palabra));
    a_mayusculas(palabra);
    printf("En mayúsculas: %s\n", palabra);
    return 0;
}
```

Observa que las funciones que reciben una cadena **no necesitan la cantidad de elementos** como parámetro: el `'\0'` cumple ese papel. Esa es la gran ventaja del terminador, y también su gran riesgo: si falta, nada detiene el recorrido.

`longitud` hace exactamente lo que hace `strlen`: recorre todo el texto. Por eso `strlen` no es gratis, y escribir `for (size_t i = 0; i < strlen(s); i++)` vuelve a medir la cadena en cada vuelta. Mide una vez y guarda el resultado, o usa `s[i] != '\0'` como condición.

## Leer cadenas

### Una palabra con `scanf`

```c
#include <stdio.h>

int main(void) {
    char nombre[20];

    printf("¿Cómo te llamas? ");
    if (scanf("%19s", nombre) != 1) {
        printf("No se pudo leer el nombre.\n");
        return 1;
    }
    printf("Hola, %s\n", nombre);
    return 0;
}
```

- `%s` lee una **palabra**: se detiene en el primer espacio, tabulación o salto de línea.
- El `19` es el **ancho máximo**: `scanf` guarda como mucho 19 caracteres más el `'\0'`. El ancho es siempre **capacidad − 1**. Sin ancho, `scanf("%s", nombre)` escribe todo lo que el usuario escriba, aunque no quepa: desbordamiento del arreglo.
- Aquí `nombre` va **sin `&`**. Con un `int` escribías `&edad` para indicarle a `scanf` dónde guardar; el nombre de un arreglo ya indica dónde está. La lección `punteros-arreglos-y-estructuras` (26) explica por qué.

### Una línea completa con `fgets`

Para leer texto con espacios (un nombre completo, una frase) se usa `fgets`:

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char linea[50];

    printf("Escribe una frase: ");
    if (fgets(linea, sizeof linea, stdin) == NULL) {
        printf("No se pudo leer.\n");
        return 1;
    }
    linea[strcspn(linea, "\n")] = '\0';
    printf("Leíste \"%s\" (%zu caracteres)\n", linea, strlen(linea));
    return 0;
}
```

`fgets(linea, sizeof linea, stdin)`:

- recibe la **capacidad** del arreglo y nunca escribe más: guarda como mucho `capacidad − 1` caracteres y siempre agrega `'\0'`;
- guarda también el `'\n'` que el usuario escribió al presionar Enter, si cabe;
- devuelve `NULL` si no pudo leer nada (por ejemplo, porque se terminó la entrada). Por ahora, `NULL` es simplemente el valor que indica "no hubo resultado"; la lección `punteros-y-direcciones` (25) explica qué es.

Para quitar el salto de línea se usa `strcspn(linea, "\n")`, que devuelve la **posición** del primer `'\n'` o, si no hay ninguno, la longitud de la cadena. En los dos casos escribir `'\0'` en esa posición es seguro. La versión equivalente con `strlen`:

```c
size_t largo = strlen(linea);
if (largo > 0 && linea[largo - 1] == '\n') {
    linea[largo - 1] = '\0';
}
```

Si la línea escrita no cabe, `fgets` guarda solo el comienzo y el resto queda esperando en la entrada para la próxima lectura. En ese caso la cadena leída **no** termina en `'\n'`, y eso sirve para detectarlo.

> **Portabilidad:** nunca uses `gets`. Leía una línea sin recibir la capacidad, así que cualquier entrada larga desbordaba el arreglo. Se declaró obsoleta en una corrección de C99 y fue **eliminada del estándar en C11**; con `-std=c23` los compiladores la rechazan o advierten. Su reemplazo es `fgets`.

## Copiar cadenas

Una cadena no se asigna con `=` (es un arreglo). Se copia con `strcpy(destino, origen)`, de `<string.h>`, que copia los caracteres y el `'\0'`.

El problema: **`strcpy` no conoce la capacidad del destino**. Si el origen no cabe, escribe fuera del límite:

```c
char destino[6];
strcpy(destino, "Bienvenido");   /* 11 char en un arreglo de 6: desbordamiento */
```

Es comportamiento indefinido y, en programas reales, una vulnerabilidad clásica (*buffer overflow*). Hay dos formas seguras.

**1. Comprobar antes de copiar.**

```c
if (strlen(origen) < sizeof destino) {
    strcpy(destino, origen);
}
```

**2. Usar `snprintf`**, que recibe la capacidad, nunca escribe de más, **siempre** termina con `'\0'` y devuelve cuántos caracteres **habría** escrito. Si ese número es mayor o igual que la capacidad, el texto se truncó:

```c
#include <stdio.h>

int main(void) {
    char origen[] = "Programar en C";
    char corto[8];

    int escritos = snprintf(corto, sizeof corto, "%s", origen);
    if (escritos < 0 || (size_t)escritos >= sizeof corto) {
        printf("Se truncó: \"%s\" (hacían falta %d caracteres)\n", corto, escritos);
    } else {
        printf("Copia completa: \"%s\"\n", corto);
    }
    return 0;
}
```

Salida: `Se truncó: "Program" (hacían falta 14 caracteres)`.

### La trampa de `strncpy`

`strncpy(destino, origen, n)` parece la versión segura de `strcpy`, pero no lo es: si el origen tiene `n` caracteres o más, copia `n` y **no agrega `'\0'`**. El resultado no es una cadena.

```c
char codigo[4];
strncpy(codigo, "ABCDEF", sizeof codigo);   /* copia 'A','B','C','D' y ningún '\0' */
codigo[sizeof codigo - 1] = '\0';           /* hay que terminarla a mano: "ABC" */
```

Además, cuando el origen es corto, rellena con ceros todo el resto del destino. Fue pensada para campos de ancho fijo, no para copiar texto. Para copiar con límite, prefiere `snprintf`.

> **Portabilidad:** `strlcpy` y `strlcat` existen en BSD, macOS y POSIX, pero **no son C estándar**. El Anexo K de C11 define `strcpy_s` y `strcat_s`, pero es opcional y casi ningún compilador lo implementa. Con C estándar, usa `snprintf` o comprueba la longitud antes de copiar.

## Concatenar cadenas

`strcat(destino, origen)` agrega `origen` al final de `destino`. Tiene el mismo problema que `strcpy`: no sabe cuánto lugar queda.

`strncat(destino, origen, n)` agrega como mucho `n` caracteres y **siempre** pone el `'\0'`. El `n` correcto es el lugar libre: `sizeof destino - strlen(destino) - 1`.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char completo[16] = "Ada";

    strncat(completo, " ", sizeof completo - strlen(completo) - 1);
    strncat(completo, "Lovelace", sizeof completo - strlen(completo) - 1);
    printf("%s (%zu de %zu)\n", completo, strlen(completo), sizeof completo);

    char ficha[32];
    snprintf(ficha, sizeof ficha, "%s, nacida en %d", completo, 1815);
    printf("%s\n", ficha);
    return 0;
}
```

Salida:

```text
Ada Lovelace (12 de 16)
Ada Lovelace, nacida en 1815
```

Cuando hay que armar un texto con varias partes, `snprintf` suele ser lo más claro: un solo formato, una sola capacidad.

## Comparar cadenas

`==` no sirve para comparar el contenido de dos cadenas: compara si son **el mismo arreglo**, no si tienen las mismas letras. Para comparar el texto se usa `strcmp(a, b)`, que devuelve:

- `0` si son iguales;
- un número negativo si `a` va antes que `b`;
- un número positivo si `a` va después que `b`.

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char clave[] = "secreto";

    if (strcmp(clave, "secreto") == 0) {
        printf("Clave correcta\n");
    }
    printf("manzana vs pera: %s\n", strcmp("manzana", "pera") < 0 ? "manzana va antes" : "pera va antes");
    printf("Zeta vs abeja: %s\n", strcmp("Zeta", "abeja") < 0 ? "Zeta va antes" : "abeja va antes");
    return 0;
}
```

El orden es el de los **códigos** de los caracteres, no el del diccionario: todas las mayúsculas van antes que las minúsculas, por eso `"Zeta"` va antes que `"abeja"`. Compara solo el signo del resultado, nunca su valor exacto.

## Buscar un carácter

Buscar un carácter es un recorrido que se detiene al encontrarlo. Con índices:

```c
size_t posicion_de(const char s[], char c) {
    size_t i = 0;
    while (s[i] != '\0' && s[i] != c) {
        i++;
    }
    return i;   /* si c no está, i es la longitud y s[i] es '\0' */
}
```

La biblioteca ofrece dos funciones para lo mismo:

- `strchr(s, c)` recorre `s` buscando `c`. Si no lo encuentra devuelve `NULL`; si lo encuentra devuelve la ubicación del carácter dentro del arreglo. Qué es exactamente esa ubicación lo verás en la lección `punteros-y-direcciones` (25); por ahora úsala para preguntar **si** el carácter está: `strchr(s, c) != NULL`.
- `strcspn(s, "c")` devuelve la **posición** del primer carácter de `s` que aparece en el segundo texto, o la longitud si no hay ninguno. Es la versión con índice.

```c
#include <stdio.h>
#include <string.h>

size_t posicion_de(const char s[], char c) {
    size_t i = 0;
    while (s[i] != '\0' && s[i] != c) {
        i++;
    }
    return i;
}

int main(void) {
    char correo[] = "ana@ejemplo.com";

    if (strchr(correo, '@') != NULL) {
        printf("Tiene arroba\n");
    }
    printf("Posición del @ (a mano): %zu\n", posicion_de(correo, '@'));
    printf("Posición del @ (strcspn): %zu\n", strcspn(correo, "@"));

    size_t pos = strcspn(correo, "#");
    if (correo[pos] == '\0') {
        printf("No hay #\n");
    }
    return 0;
}
```

## Números y texto

`"12"` es una cadena de dos caracteres, no el número 12. "Sumar" dos cadenas con `snprintf` las **une**; para sumar sus valores hay que **convertirlas**:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char a[] = "12";
    char b[] = "30";

    char unidos[8];
    snprintf(unidos, sizeof unidos, "%s%s", a, b);

    int suma = atoi(a) + atoi(b);

    char texto[12];
    snprintf(texto, sizeof texto, "%d", suma);

    printf("Unidos como texto: %s\n", unidos);
    printf("Sumados como números: %d\n", suma);
    printf("La suma como texto: \"%s\" (%zu caracteres)\n", texto, strlen(texto));
    return 0;
}
```

```text
Unidos como texto: 1230
Sumados como números: 42
La suma como texto: "42" (2 caracteres)
```

- `atoi` (de `<stdlib.h>`) convierte texto en `int`.
- `snprintf` con `%d` convierte un número en texto, con la capacidad como límite. Existe también `sprintf`, sin capacidad: tiene el mismo riesgo que `strcpy`.

> **C básico:** `atoi` no informa errores: `atoi("hola")` devuelve `0`, igual que `atoi("0")`, y un número demasiado grande es comportamiento indefinido. Sirve para ejemplos con datos conocidos. La lección `biblioteca-estandar-y-errores` (34) enseña `strtol`, que detecta texto inválido y desbordes.

## Contar palabras

Un problema clásico que reúne todo: recorrer la cadena recordando si estamos **dentro** o **fuera** de una palabra. Cada vez que se pasa de fuera a dentro, empieza una palabra nueva.

```c
#include <stdio.h>

size_t contar_palabras(const char s[]) {
    size_t palabras = 0;
    bool dentro = false;

    for (size_t i = 0; s[i] != '\0'; i++) {
        bool separador = s[i] == ' ' || s[i] == '\t' || s[i] == '\n';
        if (separador) {
            dentro = false;
        } else if (!dentro) {
            dentro = true;
            palabras++;
        }
    }
    return palabras;
}

int main(void) {
    char frase[] = "  Hola   mundo en   C  ";

    printf("Palabras: %zu\n", contar_palabras(frase));
    return 0;
}
```

Salida: `Palabras: 4`. Contar espacios no funcionaría: hay espacios repetidos, al principio y al final. La función `isspace` de `<ctype.h>` (lección 34) reconoce todos los separadores sin escribirlos a mano.

> **C moderno (C23):** C23 incorpora al estándar `strdup` y `strndup`, que crean una copia nueva de una cadena en memoria pedida en ejecución. Las verás junto con la lección `memoria-dinamica` (28).

## Errores comunes

- **Olvidar el lugar del `'\0'`.** Para guardar `"Hola"` hace falta capacidad 5. Ojo: `char s[4] = "Hola";` compila en C, pero el arreglo queda **sin terminador**.
- **Usar `strcpy`, `strcat` o `sprintf` sin comprobar la capacidad.** Prefiere `snprintf`, o mide antes con `strlen`.
- **Creer que `strncpy` siempre termina la cadena.** No lo hace si el origen es largo.
- **`scanf("%s", s)` sin ancho.** Escribe `%19s` para una capacidad de 20.
- **Usar `gets`.** Ya no existe en el estándar; usa `fgets`.
- **Olvidar el `'\n'` que guarda `fgets`.** Quítalo con `s[strcspn(s, "\n")] = '\0';`.
- **Comparar cadenas con `==`.** Usa `strcmp(a, b) == 0`.
- **Mostrar `strlen` con `%d`.** Es `size_t`: usa `%zu`.
- **Confundir capacidad y longitud.** `sizeof` mide el arreglo; `strlen` mide el texto.

## Resumen

- Una cadena es un arreglo de `char` terminado en `'\0'`; `"A"` ocupa dos `char`.
- Capacidad (`sizeof`, fija) y longitud (`strlen`, variable) son distintas; longitud `L` necesita capacidad `L + 1`.
- Las cadenas se recorren hasta `'\0'`, sin necesidad de pasar la cantidad.
- `scanf("%19s", ...)` lee una palabra con límite; `fgets` lee una línea con límite y guarda el `'\n'`.
- `strcpy` y `strcat` no comprueban la capacidad: usa `snprintf`, `strncat` con el lugar libre, o comprueba antes.
- `strcmp` compara el contenido; `strchr` y `strcspn` buscan caracteres.
- `atoi` y `snprintf` convierten entre texto y números.

## Ejercicios prácticos

### Ejercicio 1: capacidad y longitud

¿Qué muestran `sizeof` y `strlen` para cada arreglo?

```c
char a[] = "C23";
char b[10] = "C23";
char c[10] = "";
```

<details><summary>Ver solución</summary>

| | `sizeof` | `strlen` |
| --- | --- | --- |
| `a` | 4 | 3 |
| `b` | 10 | 3 |
| `c` | 10 | 0 |

`a` toma la capacidad del literal (3 letras más `'\0'`). `b` y `c` tienen capacidad 10 declarada; `c` guarda solo el terminador, así que su longitud es 0.

</details>

### Ejercicio 2: saludo con nombre completo

Escribe un programa que lea un nombre completo con `fgets` (capacidad 40), quite el salto de línea, rechace una línea vacía y arme con `snprintf` el saludo `Hola, <nombre>. Tu nombre tiene N caracteres.`

<details><summary>Ver solución</summary>

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char nombre[40];

    printf("Nombre completo: ");
    if (fgets(nombre, sizeof nombre, stdin) == NULL) {
        printf("No se pudo leer.\n");
        return 1;
    }
    nombre[strcspn(nombre, "\n")] = '\0';
    if (nombre[0] == '\0') {
        printf("El nombre no puede estar vacío.\n");
        return 1;
    }

    char saludo[80];
    snprintf(saludo, sizeof saludo, "Hola, %s. Tu nombre tiene %zu caracteres.", nombre, strlen(nombre));
    printf("%s\n", saludo);
    return 0;
}
```

La línea vacía se detecta después de quitar el `'\n'`: el primer carácter ya es el terminador.

</details>

### Ejercicio 3: corregir un desbordamiento

Este fragmento desborda el arreglo. Explica por qué y corrígelo con `snprintf` de modo que avise si el texto no entra.

```c
char destino[6];
strcpy(destino, "Bienvenido");
```

<details><summary>Ver solución</summary>

`"Bienvenido"` tiene 10 letras: necesita capacidad 11, y `destino` tiene 6. `strcpy` no conoce la capacidad y escribe 5 bytes fuera del límite (comportamiento indefinido).

```c
#include <stdio.h>

int main(void) {
    char destino[6];

    int escritos = snprintf(destino, sizeof destino, "%s", "Bienvenido");
    if (escritos < 0 || (size_t)escritos >= sizeof destino) {
        printf("No entra completo; se guardó \"%s\"\n", destino);
    }
    return 0;
}
```

Salida: `No entra completo; se guardó "Bienv"`.

</details>

### Ejercicio 4: contar vocales

Escribe `size_t contar_vocales(const char s[])`, que cuente las vocales sin tilde, mayúsculas o minúsculas, y pruébala con `"Programacion en C"`.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

bool es_vocal(char c) {
    return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u' ||
           c == 'A' || c == 'E' || c == 'I' || c == 'O' || c == 'U';
}

size_t contar_vocales(const char s[]) {
    size_t vocales = 0;
    for (size_t i = 0; s[i] != '\0'; i++) {
        if (es_vocal(s[i])) {
            vocales++;
        }
    }
    return vocales;
}

int main(void) {
    printf("Vocales: %zu\n", contar_vocales("Programacion en C"));
    return 0;
}
```

Salida: `Vocales: 6`. La función no necesita la cantidad de elementos: se detiene en `'\0'`.

</details>

### Ejercicio 5: agregar sin desbordar

Escribe `bool agregar(char destino[], size_t capacidad, const char extra[])`, que agregue `extra` al final de `destino` solo si el resultado entra completo, y devuelva si pudo hacerlo.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>
#include <string.h>

bool agregar(char destino[], size_t capacidad, const char extra[]) {
    size_t usado = strlen(destino);
    size_t falta = strlen(extra);
    if (usado + falta + 1 > capacidad) {
        return false;
    }
    strcat(destino, extra);
    return true;
}

int main(void) {
    char ruta[12] = "/home";

    printf("%s\n", agregar(ruta, sizeof ruta, "/ana") ? ruta : "No entra");
    printf("%s\n", agregar(ruta, sizeof ruta, "/documentos") ? ruta : "No entra");
    return 0;
}
```

Salida: `/home/ana` y `No entra`. Aquí `strcat` es seguro porque la función comprobó antes que hay lugar para el texto **y** para el `'\0'` (el `+ 1`). La capacidad viaja como parámetro porque dentro de la función `sizeof destino` no la daría.

</details>
