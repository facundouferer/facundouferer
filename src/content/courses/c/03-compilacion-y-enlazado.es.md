---
title: 'Compilación, enlazado y advertencias'
course: 'c'
slug: 'compilacion-y-enlazado'
description: 'Recorre las cuatro etapas desde el código fuente hasta el ejecutable (preprocesador, compilador, ensamblador y enlazador) y activa las advertencias de C23.'
order: 3
lang: 'es'
published: true
---

Ya sabes cómo se ve un programa en C: un `#include <stdio.h>`, una función `main` y algunas llamadas a `printf`. Pero la computadora no ejecuta ese texto. Antes de que el programa corra, varias herramientas lo transforman paso a paso hasta convertirlo en un **ejecutable**.

Entender ese camino es lo que te permite leer los mensajes del compilador sin miedo, saber qué etapa falló y corregir el problema en el lugar correcto.

**Objetivos**

- Describir las cuatro etapas que llevan del código fuente al ejecutable: preprocesado, compilación, ensamblado y enlazado.
- Distinguir archivo fuente, archivo objeto y ejecutable.
- Diferenciar un error de compilación de un error de enlazado y leer un mensaje del compilador (archivo, línea y columna).
- Usar las advertencias (`-Wall`, `-Wextra`, `-Wpedantic`) y tratarlas como errores que hay que corregir.
- Conocer la política de estándares del curso: ISO C23 y el comando de compilación que usaremos siempre.
- Consultar el estado de salida de un programa.

**Requisitos previos:** [Introducción a C](/cursos/c/introduccion-y-estructura) y [Secuencia de acciones](/cursos/c/procesos-y-estados).

## Del código fuente al ejecutable

Partamos de un programa mínimo guardado en `programa.c`:

```c
#include <stdio.h>

#define SALUDO "Hola, C"

int main(void) {
    printf(SALUDO "\n");
    return 0;
}
```

Cuando escribes `gcc programa.c -o programa`, parece que ocurre una sola cosa. En realidad `gcc` coordina cuatro etapas, una detrás de otra:

```text
programa.c ──► preprocesador ──► compilador ──► ensamblador ──► enlazador ──► programa
 (fuente)       (texto C)        (ensamblador)   (programa.o)   (+ biblioteca)  (ejecutable)
```

Puedes detener el proceso después de cada etapa para ver qué produjo. Hacerlo una vez es la mejor manera de entenderlo.

### 1. Preprocesado (`-E`)

El **preprocesador** trabaja sobre el texto antes de que el compilador lo lea. Atiende las líneas que empiezan con `#`, llamadas **directivas**:

- `#include <stdio.h>` se reemplaza por el contenido completo del archivo de cabecera `stdio.h`, que declara `printf` entre muchas otras cosas.
- `#define SALUDO "Hola, C"` define una **macro**: a partir de esa línea, cada aparición de `SALUDO` se sustituye por `"Hola, C"`.

Con la opción `-E`, `gcc` se detiene después del preprocesado y muestra el resultado:

```bash
gcc -E programa.c
```

La salida tiene cientos de líneas (todo lo que trajo `stdio.h`) y termina así:

```text
int main(void) {
    printf("Hola, C" "\n");
    return 0;
}
```

Observa dos cosas: la directiva `#define` desapareció y `SALUDO` ya fue reemplazado. El compilador nunca ve las macros, solo el texto que dejó el preprocesador. Dos cadenas literales seguidas, como `"Hola, C" "\n"`, se unen en una sola.

### 2. Compilación (`-S`)

El **compilador** analiza el texto preprocesado: comprueba que respete las reglas del lenguaje (sintaxis y tipos) y lo traduce a lenguaje ensamblador, las instrucciones de bajo nivel de tu procesador.

```bash
gcc -S programa.c
```

Esto genera `programa.s`, un archivo de texto con instrucciones como `mov`, `call` o `ret`. No necesitas leer ensamblador en este curso; basta con saber que existe y que depende del procesador (x86-64, ARM, etc.).

Esta es la etapa donde aparecen la mayoría de los **errores** y **advertencias** que vas a ver.

### 3. Ensamblado (`-c`)

El **ensamblador** convierte el ensamblador en código máquina y lo guarda en un **archivo objeto** (`.o` en Linux y macOS, `.obj` en Windows):

```bash
gcc -std=c23 -c programa.c
```

La opción `-c` significa "compila pero no enlaces": ejecuta preprocesado, compilación y ensamblado, y se detiene con `programa.o`. Ese archivo ya contiene código máquina, pero **todavía no se puede ejecutar**: hace referencia a `printf` sin saber dónde está su código.

### 4. Enlazado

El **enlazador** (en inglés, *linker*) toma uno o más archivos objeto y los une con las bibliotecas que necesitan. En nuestro caso, encuentra el código de `printf` en la biblioteca estándar de C y produce el ejecutable:

```bash
gcc programa.o -o programa
```

La opción `-o programa` le da nombre al resultado. Sin ella, el ejecutable se llamaría `a.out`.

### Ejecutar el programa

En Linux o macOS se ejecuta indicando la ruta, porque el directorio actual no se busca automáticamente:

```bash
./programa
```

```text
Hola, C
```

En Windows el ejecutable se llama `programa.exe` y se ejecuta con `.\programa.exe`.

### Fuente, objeto y ejecutable

| Archivo | Qué contiene | ¿Se puede leer? | ¿Se puede ejecutar? |
| --- | --- | --- | --- |
| `programa.c` | código fuente en C | sí, es texto | no |
| `programa.o` | código máquina sin enlazar | no, es binario | no |
| `programa` | código máquina enlazado con las bibliotecas | no, es binario | sí |

Separar las etapas tiene una ventaja práctica que vas a aprovechar en el módulo de funciones: cuando un programa tiene varios archivos `.c`, cada uno se compila por separado a su `.o` y el enlazador los une al final. Si cambias un archivo, solo recompilas ese.

## Errores de compilación y errores de enlazado

Un error puede aparecer en distintas etapas, y el mensaje te dice cuál. Mira este programa con un error de tipeo:

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    prinft("Hola\n");
    return 0;
}
```

### En C23: error de compilación

Con el comando del curso, el compilador se detiene antes de generar el objeto. GCC 14 informa algo así:

```text
programa.c: In function 'main':
programa.c:4:5: error: implicit declaration of function 'prinft'; did you mean 'printf'? [-Wimplicit-function-declaration]
    4 |     prinft("Hola\n");
      |     ^~~~~~
      |     printf
```

Clang dice lo mismo con otras palabras (`use of undeclared identifier 'prinft'; did you mean 'printf'?`). El compilador no conoce ninguna función llamada `prinft`: no está declarada en `stdio.h` ni en ningún otro lugar.

### Cómo leer un mensaje del compilador

Cada mensaje sigue el formato `archivo:línea:columna: tipo: descripción`:

- `programa.c` es el archivo donde está el problema.
- `4` es la línea y `5` la columna (el carácter donde empieza `prinft`).
- `error` indica que no se generó ningún archivo; si dice `warning`, el archivo sí se generó.
- La descripción explica el problema y, a veces, sugiere la corrección (`did you mean 'printf'?`).
- Entre corchetes aparece la opción que controla ese diagnóstico, por ejemplo `[-Wimplicit-function-declaration]`.

Debajo, el compilador copia la línea y marca la columna con `^`. Corrige siempre **el primer error** de la lista: muchas veces los siguientes son consecuencia de él.

### En C antiguo: error de enlazado

Las versiones antiguas de C (C89) permitían llamar a una función no declarada: el compilador emitía solo una advertencia y suponía que la función existiría en algún lado. Si compilas el mismo programa con un estándar antiguo (por ejemplo, `gcc -std=c89 programa.c -o programa`), la compilación termina y el error aparece **en el enlazado**, cuando el enlazador busca `prinft` en los objetos y en las bibliotecas y no la encuentra. En Linux con GCC:

```text
/usr/bin/ld: /tmp/ccA1b2C3.o: in function `main':
programa.c:(.text+0x10): undefined reference to `prinft'
collect2: error: ld returned 1 exit status
```

En macOS con Clang:

```text
Undefined symbols for architecture arm64:
  "_prinft", referenced from:
      _main in programa-1a2b3c.o
ld: symbol(s) not found for architecture arm64
```

Reconoces un error de enlazado porque lo informa `ld` (el enlazador), no menciona una línea de tu código y habla de símbolos o referencias no definidas (`undefined reference`, `Undefined symbols`). Significa: "algo que usaste está declarado o se supone que existe, pero no encontré su código".

| Etapa | Ejemplo de causa | Cómo se ve el mensaje |
| --- | --- | --- |
| Preprocesado | `#include <stdoi.h>` | `fatal error: stdoi.h: No such file or directory` |
| Compilación | falta un `;`, función no declarada | `archivo:línea:columna: error: ...` |
| Enlazado | se usa una función cuyo código no aparece | `undefined reference to ...` / `Undefined symbols` |

## Advertencias

Una **advertencia** (*warning*) indica algo que el lenguaje permite pero que casi seguro es un error o un descuido. El compilador genera el archivo igual, y por eso las advertencias son peligrosas: el programa compila y falla después.

Por defecto, los compiladores muestran pocas advertencias. Estas opciones activan las que usaremos siempre:

- `-Wall`: activa un conjunto amplio de advertencias comunes (variables sin usar, formatos de `printf` incorrectos, etc.). A pesar del nombre, no son "todas".
- `-Wextra`: agrega advertencias adicionales que `-Wall` no incluye.
- `-Wpedantic`: advierte cuando el código usa algo que no pertenece al estándar elegido, como extensiones propias del compilador.

Este programa compila, pero tiene dos problemas:

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int sin_usar = 0;
    printf("%d\n", 3.5);
    return 0;
}
```

Con `-Wall -Wextra -Wpedantic`, GCC informa:

```text
programa.c:5:14: warning: format '%d' expects argument of type 'int', but argument 2 has type 'double' [-Wformat=]
programa.c:4:9: warning: unused variable 'sin_usar' [-Wunused-variable]
```

La primera advertencia es grave: `%d` espera un entero y `3.5` es un número con decimales (`double`). El resultado de ese `printf` es **comportamiento indefinido**: puede imprimir cualquier cosa. La corrección es usar `%f` para un `double`. La segunda advertencia indica una variable declarada que nunca se usa; aquí basta con borrarla.

```c
#include <stdio.h>

int main(void) {
    printf("%f\n", 3.5);
    return 0;
}
```

La regla del curso es simple: **una advertencia es un error que todavía no te mordió**. Un programa del curso se considera terminado cuando compila sin ninguna advertencia. Si quieres que el compilador te obligue, agrega `-Werror`, que convierte cada advertencia en un error y no genera el ejecutable hasta que la corrijas. Es opcional, pero muy útil mientras aprendes.

## La política de estándares del curso

C no es un único lenguaje congelado: el comité ISO publica versiones revisadas del estándar. Las más importantes hoy son:

- **C99** y **C11**: versiones que todavía vas a encontrar en mucho código existente.
- **C17**: una revisión de C11 que corrigió defectos sin agregar características nuevas. Es el estándar por defecto de muchos compiladores y el que usa gran parte del código actual.
- **C23**: la versión más reciente (ISO/IEC 9899:2024). Incorpora mejoras como `bool`, `true` y `false` como palabras clave, `nullptr`, `constexpr` y otras que verás a lo largo del curso.

**Este curso usa ISO C23.** Todos los programas se compilan con este comando:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g programa.c -o programa
```

Cada opción tiene un propósito:

| Opción | Para qué sirve |
| --- | --- |
| `gcc` | el compilador; con Clang, escribe `clang` y las mismas opciones |
| `-std=c23` | compila según el estándar ISO C23 |
| `-Wall` | activa las advertencias comunes |
| `-Wextra` | activa advertencias adicionales |
| `-Wpedantic` | advierte sobre todo lo que no es C estándar |
| `-g` | guarda información de depuración, que usarás más adelante con un depurador (GDB o LLDB) para ejecutar el programa paso a paso |
| `programa.c` | el archivo fuente |
| `-o programa` | el nombre del ejecutable |

Versiones recomendadas: **GCC 14 o posterior** o **Clang 18 o posterior**. Puedes consultar la tuya con `gcc --version` o `clang --version`. En macOS, el comando `gcc` en realidad ejecuta Clang.

> **C básico:** muchos cursos y libros compilan simplemente con `gcc programa.c`. Eso usa el estándar por defecto del compilador (a menudo C17 con extensiones de GNU) y muestra muy pocas advertencias.

> **C moderno (C23):** con `-std=c23` eliges el estándar de forma explícita, y con `-Wall -Wextra -Wpedantic` el compilador te avisa de los errores más comunes y de lo que no es C estándar.

> **Portabilidad:** los compiladores anteriores a GCC 14 o Clang 18 no reconocen `-std=c23`; usa `-std=c2x`, el nombre provisional de C23. Aun así, una opción no garantiza soporte completo: algunas características de C23 pueden faltar en un compilador o en su biblioteca estándar. Cuando una lección use algo de C23 que no exista en C17, lo señalará en un recuadro como este.

### Extensiones del compilador

GCC y Clang aceptan cosas que **no son C estándar**, llamadas **extensiones** (por ejemplo, algunas palabras reservadas que empiezan con `__`). Un programa que depende de extensiones puede no compilar en otro compilador. Por eso el curso usa `-Wpedantic` y, cuando aparezca una extensión, la nombrará como tal. Si una opción o una construcción solo funciona en un compilador, no es C estándar.

## El estado de salida de un programa

Cuando `main` termina, el valor de su `return` se entrega al sistema operativo como **estado de salida** (*exit status*). Por convención, `0` significa "terminé bien" y cualquier otro valor indica algún problema.

```c
#include <stdio.h>

int main(void) {
    printf("Algo salió mal\n");
    return 3;
}
```

En la terminal de Linux o macOS, la variable `$?` guarda el estado de salida del último comando:

```bash
./programa
echo $?
```

```text
Algo salió mal
3
```

En PowerShell, el equivalente es `$LASTEXITCODE`. Las herramientas que ejecutan programas (scripts, sistemas de integración continua, el propio `gcc`) usan este número para saber si algo falló. Cuando `gcc` encuentra un error, termina con un estado distinto de `0`.

> **C básico:** desde C99, si `main` llega a su `}` final sin `return`, se comporta como si devolviera `0`. En este curso escribimos `return 0;` igual, para que la intención quede explícita.

## Resumen

- El **preprocesador** resuelve las directivas `#include` y `#define` (`gcc -E`).
- El **compilador** verifica las reglas del lenguaje y traduce a ensamblador (`gcc -S`).
- El **ensamblador** genera el archivo objeto `.o` (`gcc -c`).
- El **enlazador** une los objetos con las bibliotecas y produce el ejecutable.
- Un error de compilación indica `archivo:línea:columna`; un error de enlazado habla de símbolos no definidos.
- Las **advertencias** se corrigen siempre; `-Werror` las convierte en errores.
- El curso usa ISO C23 con `gcc -std=c23 -Wall -Wextra -Wpedantic -g programa.c -o programa`.
- El `return` de `main` es el estado de salida; `echo $?` lo muestra.

## Ejercicios prácticos

### Ejercicio 1: ¿qué etapa falla?

Para cada caso, indica en qué etapa se detiene `gcc` (preprocesado, compilación o enlazado):

1. El programa empieza con `#include <stdoi.h>`.
2. A la línea `printf("Hola\n")` le falta el punto y coma.
3. Con un estándar antiguo, el programa llama a `prinft` y el compilador solo emite una advertencia.

<details><summary>Ver solución</summary>

1. **Preprocesado.** El preprocesador no encuentra el archivo `stdoi.h` y se detiene con `fatal error: stdoi.h: No such file or directory`.
2. **Compilación.** Es un error de sintaxis: `error: expected ';' before 'return'` (Clang: `expected ';' after expression`).
3. **Enlazado.** El objeto se genera, pero el enlazador no encuentra el código de `prinft`: `undefined reference to 'prinft'`.

</details>

### Ejercicio 2: leer un mensaje del compilador

Compilaste `saludo.c` y obtuviste:

```text
saludo.c:6:21: error: expected ';' after expression
```

¿En qué archivo, línea y columna está el problema? ¿Se generó el ejecutable? ¿Qué tienes que hacer?

<details><summary>Ver solución</summary>

El problema está en el archivo `saludo.c`, línea `6`, columna `21`. Como es un `error` (no un `warning`), **no** se generó el ejecutable. Hay que agregar el `;` que falta al final de la instrucción de la línea 6 y volver a compilar.

</details>

### Ejercicio 3: cero advertencias

Este programa genera advertencias con el comando del curso. Encuéntralas y corrígelas para que compile sin ninguna.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int total = 10;
    printf("Precio: %d\n", 2.5);
    printf("Fin\n");
    return 0;
}
```

<details><summary>Ver solución</summary>

Hay dos advertencias: `%d` recibe un `double` (`-Wformat`) y `total` nunca se usa (`-Wunused-variable`). Se corrige usando `%f` y eliminando la variable:

```c
#include <stdio.h>

int main(void) {
    printf("Precio: %f\n", 2.5);
    printf("Fin\n");
    return 0;
}
```

</details>

### Ejercicio 4: las etapas una por una

Escribe los comandos para obtener, a partir de `programa.c`: (a) el texto preprocesado, (b) el archivo objeto, (c) el ejecutable a partir del objeto, y (d) ejecutar el programa y ver su estado de salida.

<details><summary>Ver solución</summary>

```bash
gcc -std=c23 -E programa.c
gcc -std=c23 -Wall -Wextra -Wpedantic -g -c programa.c
gcc programa.o -o programa
./programa
echo $?
```

El paso (b) genera `programa.o`; el paso (c) solo enlaza, por eso no necesita las opciones de advertencias.

</details>

### Ejercicio 5: un estado de salida a elección

Escribe un programa que muestre `Proceso terminado` y finalice con estado de salida `2`. Comprueba el valor con `echo $?`.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>

int main(void) {
    printf("Proceso terminado\n");
    return 2;
}
```

Después de `./programa`, el comando `echo $?` muestra `2`.

</details>
