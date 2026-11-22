---
title: 'Depuración, advertencias y sanitizers'
course: 'c'
slug: 'depuracion-y-sanitizers'
order: 36
lang: 'es'
published: true
---

Todo programa real tiene errores. La diferencia entre perder una tarde y perder diez minutos no está en "tener suerte", sino en tener un **método** y saber usar las herramientas que el compilador ya te da: las advertencias, el depurador y los sanitizers. En esta lección aprendes las tres cosas, en ese orden.

## Objetivos

- Aplicar un método de depuración: **reproducir**, **aislar**, formular una hipótesis, corregir y verificar con una comprobación de regresión.
- Usar las advertencias del compilador como primer depurador (`-Wall -Wextra -Wpedantic`, `-Werror` y extras útiles como `-Wconversion` y `-Wshadow`).
- Compilar con `-g` y recorrer un programa con GDB o LLDB: puntos de parada, avanzar línea por línea, inspeccionar variables, la pila de llamadas y puntos de observación.
- Detectar errores de memoria con AddressSanitizer y comportamiento indefinido con UndefinedBehaviorSanitizer, y leer sus informes.
- Usar `printf` y `assert` como complementos.

**Requisitos previos:** `compilacion-y-enlazado` (advertencias y la línea de compilación del curso), `operadores` (comportamiento indefinido), `recursividad` (la pila de llamadas), `propiedad-y-errores-de-memoria` (AddressSanitizer) y `biblioteca-estandar-y-errores` (códigos de retorno y `errno`).

## Un método antes que una herramienta

Cambiar líneas al azar "a ver si anda" es la forma más lenta de depurar. El método profesional tiene cinco pasos:

1. **Reproducir.** Encuentra una entrada y una forma de ejecutar el programa que muestre el error **siempre**. Un error que no puedes reproducir no lo puedes confirmar como corregido. Anota la entrada exacta, los argumentos y el resultado esperado frente al obtenido.
2. **Aislar.** Reduce el problema: elimina entradas, funciones y líneas que no influyen hasta tener el caso más chico que todavía falla. Muchas veces, al aislarlo, el error se vuelve evidente.
3. **Formular una hipótesis.** "Creo que el ciclo lee una posición de más porque la condición usa `<=`." Una hipótesis concreta se puede comprobar con el depurador, un `printf` o un sanitizer.
4. **Corregir.** Cambia **una** cosa, la que la hipótesis señala. Si cambias cinco cosas a la vez, no sabrás cuál arregló el error (ni cuál rompió otra cosa).
5. **Verificar.** Vuelve a ejecutar el caso que reproducía el error y comprueba que ahora da el resultado esperado. Después conviértelo en una **comprobación de regresión**: un caso que se ejecuta cada vez que cambias el programa, para que el error no vuelva sin que te enteres. En `pruebas-estilo-y-portabilidad` verás cómo automatizarlo.

Las herramientas de esta lección sirven sobre todo en los pasos 2 y 3: te muestran **dónde** y **por qué** falla el programa.

## Las advertencias: el primer depurador

El compilador lee cada línea de tu programa. Cuando algo es legal pero sospechoso, lo dice con una **advertencia**. En `compilacion-y-enlazado` adoptaste la línea del curso:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic programa.c -o programa
```

- `-Wall` activa las advertencias más útiles (a pesar del nombre, no son "todas").
- `-Wextra` agrega otro grupo, como comparar enteros con y sin signo o parámetros sin usar.
- `-Wpedantic` avisa cuando usas algo que no es C estándar (extensiones del compilador).

Este programa compila, pero tiene tres errores:

<!-- c-check: skip -->
```c
#include <stdio.h>

int contar_dieces(int notas[], int cantidad) {
    int dieces;
    for (int i = 0; i < cantidad; i++) {
        if (notas[i] = 10) {
            dieces++;
        }
    }
    return dieces;
}

int main(void) {
    int notas[] = {4, 10, 7};
    size_t cantidad = sizeof notas / sizeof notas[0];
    for (int i = 0; i < cantidad; i++) {
        printf("%d\n", notas[i]);
    }
    printf("Dieces: %d\n", contar_dieces(notas, 3));
    return 0;
}
```

Clang los encuentra todos sin ejecutar nada:

```
avisos.c:6:22: warning: using the result of an assignment as a condition without parentheses [-Wparentheses]
avisos.c:7:13: warning: variable 'dieces' is uninitialized when used here [-Wuninitialized]
avisos.c:16:23: warning: comparison of integers of different signs: 'int' and 'size_t' (aka 'unsigned long') [-Wsign-compare]
```

1. `notas[i] = 10` **asigna** en lugar de comparar: cada nota se convierte en 10 y la condición siempre es verdadera. Debía ser `==`.
2. `dieces` empieza con un valor indeterminado: falta `= 0`.
3. `i` es `int` y `cantidad` es `size_t`: la comparación convierte `i` a sin signo. Aquí no falla, pero con números negativos daría resultados sorprendentes. La corrección es declarar `size_t i`.

Cada advertencia apunta a archivo, línea y columna, y entre corchetes dice qué opción la activó. Léelas **de la primera a la última**: a veces una sola causa produce varias.

### `-Werror`: que una advertencia no pase de largo

Con `-Werror` cada advertencia se convierte en error y el programa no se genera. Es la forma de no acostumbrarse a ignorarlas. En este curso, la comprobación automática de los ejemplos usa exactamente `-std=c23 -Wall -Wextra -Wpedantic -Werror`.

### Extras útiles: `-Wconversion` y `-Wshadow`

No forman parte de `-Wall -Wextra`, pero detectan errores frecuentes:

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    double precio = 19.99;
    int pesos = precio;            // se pierden los decimales sin avisar
    int total = 0;
    {
        int total = pesos * 2;     // otra variable con el mismo nombre
        printf("%d\n", total);
    }
    printf("%d\n", total);         // imprime 0: el total "de afuera"
    return 0;
}
```

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -Wconversion -Wshadow conv.c -o conv
```

```
conv.c:5:17: warning: implicit conversion turns floating-point number into integer: 'double' to 'int' [-Wfloat-conversion]
conv.c:8:13: warning: declaration shadows a local variable [-Wshadow]
```

- `-Wconversion` avisa de conversiones implícitas que pueden perder información (lo viste en `tipos-de-datos`). La corrección es hacer la conversión explícita, `(int)precio`, si es lo que quieres.
- `-Wshadow` avisa cuando una variable **oculta** a otra con el mismo nombre de un bloque exterior (`sentencia-switch-y-bloques-de-codigo`).

`-Wconversion` puede ser ruidoso en código existente; conviene activarlo desde el principio de un proyecto nuevo.

> **Portabilidad:** las opciones `-W...` son de GCC y Clang, no del estándar C, y cada compilador tiene su conjunto (algunos mensajes y nombres difieren entre ambos). MSVC usa otra sintaxis (`/W4`, `/WX`). El estándar solo exige un **diagnóstico** para ciertos errores; todo lo demás es una ayuda del compilador.

Las advertencias no lo encuentran todo. El siguiente programa compila **sin ninguna advertencia** y sin embargo está mal.

## Un error que el compilador no ve

```c
#include <stdio.h>

double promedio(const int notas[], size_t cantidad) {
    int suma = 0;
    for (size_t i = 0; i <= cantidad; i++) {
        suma += notas[i];
    }
    return (double)suma / cantidad;
}

int main(void) {
    int notas[] = {7, 8, 10, 6};
    size_t cantidad = sizeof notas / sizeof notas[0];
    printf("Promedio: %.2f\n", promedio(notas, cantidad));
    return 0;
}
```

El promedio de 7, 8, 10 y 6 es 7.75, pero el programa imprime algo como:

```
Promedio: -43413400.25
```

El valor cambia de una ejecución a otra y de una máquina a otra. **Reproducir** es fácil: falla siempre con estas cuatro notas. **Aislar** también: `main` solo llama a `promedio`, así que el problema está ahí. Para encontrar la línea exacta usamos el depurador.

## El depurador: GDB y LLDB

Un **depurador** ejecuta tu programa bajo su control: puedes detenerlo en una línea, avanzar de a una instrucción, mirar el valor de cada variable y la pila de llamadas. Los dos más usados con C son:

- **GDB**, del proyecto GNU, habitual en Linux.
- **LLDB**, del proyecto LLVM, el que viene con las herramientas de desarrollo de Apple en macOS (y también existe en Linux).

### Compilar para depurar: `-g` y `-O0`

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -O0 promedio.c -o promedio
```

- `-g` guarda **información de depuración** dentro del ejecutable: qué instrucción corresponde a qué línea y dónde vive cada variable. Sin `-g`, el depurador solo ve direcciones de máquina.
- `-O0` desactiva las optimizaciones. Con optimizaciones, el compilador reordena o elimina código y variables, y el depurador muestra saltos raros o `<optimized out>`. Para depurar, conviene `-O0`.

### Los comandos esenciales

| Para... | GDB | LLDB |
| --- | --- | --- |
| Abrir el programa | `gdb ./promedio` | `lldb ./promedio` |
| Poner un punto de parada en una función | `break promedio` | `break set --name promedio` (o `b promedio`) |
| Punto de parada en una línea | `break promedio.c:6` | `break set --file promedio.c --line 6` (o `b promedio.c:6`) |
| Ejecutar | `run` | `run` |
| Siguiente línea, sin entrar en funciones | `next` (`n`) | `next` (`n`) |
| Siguiente línea, entrando en funciones | `step` (`s`) | `step` (`s`) |
| Ver una variable o expresión | `print i` (`p i`) | `print i` (`p i`) |
| Ver la pila de llamadas | `backtrace` (`bt`) | `thread backtrace` (`bt`) |
| Subir / bajar de marco | `up` / `down` / `frame 1` | `up` / `down` / `frame select 1` |
| Avisar cuando una variable cambia | `watch suma` | `watchpoint set variable suma` |
| Terminar la función actual y ver qué devuelve | `finish` | `finish` |
| Seguir hasta el próximo punto de parada | `continue` (`c`) | `continue` (`c`) |
| Salir | `quit` | `quit` |

La diferencia entre `next` y `step` importa: en una línea que llama a una función, `next` la ejecuta entera y se detiene en la línea siguiente; `step` **entra** en la función.

Cada llamada activa ocupa un **marco** (*frame*) en la pila, como viste en `recursividad`. `backtrace` los lista del más reciente al más antiguo; `up` y `down` te mueven entre ellos para inspeccionar las variables locales de quien llamó.

### Sesión guiada con GDB

Hipótesis inicial: "el ciclo suma algo que no es una nota". Para comprobarla, nos detenemos en la línea de la suma solo cuando `i` llega a `cantidad`, que es justo el valor que no debería alcanzar. Eso es un **punto de parada condicional**:

```
$ gdb ./promedio
(gdb) break promedio.c:6 if i == cantidad
Breakpoint 1 at 0x1175: file promedio.c, line 6.
(gdb) run
Starting program: /home/ana/promedio

Breakpoint 1, promedio (notas=0x7fffffffe0b0, cantidad=4) at promedio.c:6
6	        suma += notas[i];
(gdb) print i
$1 = 4
(gdb) print notas[0]@cantidad
$2 = {7, 8, 10, 6}
(gdb) print notas[i]
$3 = -43413431
```

El programa llegó a la línea 6 con `i == 4`. El arreglo tiene cuatro elementos (`notas[0]@cantidad` muestra `cantidad` elementos a partir de `notas[0]`), así que `notas[4]` está **fuera de los límites**: el valor que se suma es basura. La hipótesis se confirma, y apunta a la condición `i <= cantidad`.

Podemos ver también quién llamó y con qué datos:

```
(gdb) backtrace
#0  promedio (notas=0x7fffffffe0b0, cantidad=4) at promedio.c:6
#1  0x00005555555551d4 in main () at promedio.c:14
(gdb) up
#1  0x00005555555551d4 in main () at promedio.c:14
14	    printf("Promedio: %.2f\n", promedio(notas, cantidad));
(gdb) print notas
$4 = {7, 8, 10, 6}
(gdb) down
#0  promedio (notas=0x7fffffffe0b0, cantidad=4) at promedio.c:6
6	        suma += notas[i];
(gdb) finish
Run till exit from #0  promedio (notas=0x7fffffffe0b0, cantidad=4) at promedio.c:6
0x00005555555551d4 in main () at promedio.c:14
14	    printf("Promedio: %.2f\n", promedio(notas, cantidad));
Value returned is $5 = -10853350.25
(gdb) quit
```

`finish` termina `promedio` y muestra el valor devuelto: confirma que el resultado ya sale mal de la función. Las direcciones y el valor basura cambian en cada máquina; lo que importa es `i = 4` frente a un arreglo de 4 elementos.

Un **punto de observación** (*watchpoint*) detiene el programa cada vez que una variable cambia, sin que sepas de antemano en qué línea:

```
(gdb) break promedio
(gdb) run
(gdb) watch suma
Hardware watchpoint 2: suma
(gdb) continue
Hardware watchpoint 2: suma

Old value = 0
New value = 7
promedio (notas=0x7fffffffe0b0, cantidad=4) at promedio.c:5
```

Sirve cuando "algo" modifica una variable y no sabes qué.

### La misma sesión con LLDB

```
$ lldb ./promedio
(lldb) break set --file promedio.c --line 6 --condition 'i == cantidad'
Breakpoint 1: where = promedio`promedio + 52 at promedio.c:6:16
(lldb) run
Process 51302 stopped
* thread #1, stop reason = breakpoint 1.1
    frame #0: promedio`promedio(notas=0x000000016fdff0e0, cantidad=4) at promedio.c:6:16
(lldb) print i
(size_t) 4
(lldb) print notas[i]
(const int) -43413431
(lldb) bt
* thread #1, stop reason = breakpoint 1.1
  * frame #0: promedio`promedio(notas=0x000000016fdff0e0, cantidad=4) at promedio.c:6:16
    frame #1: promedio`main at promedio.c:14:32
(lldb) up
(lldb) print notas
(int[4]) ([0] = 7, [1] = 8, [2] = 10, [3] = 6)
(lldb) quit
```

Los comandos cortos (`b`, `n`, `s`, `p`, `bt`, `c`) son iguales en ambos depuradores, así que lo que aprendes en uno sirve en el otro.

> **Portabilidad:** en macOS, `gcc` es en realidad Clang y GDB no viene instalado; usa LLDB. La primera vez que depuras, macOS puede pedir permiso para que el depurador controle procesos. En Linux, GDB suele estar en el gestor de paquetes (`gdb`) y LLDB también (`lldb`). Ninguno de los dos es parte del estándar C.

### La corrección y la verificación

La línea 5 debe recorrer los índices `0` a `cantidad - 1`:

```c
for (size_t i = 0; i < cantidad; i++) {
```

Verificar: compilar de nuevo, ejecutar con las mismas notas y comprobar `Promedio: 7.75`. Comprobación de regresión: guardar este caso (cuatro notas, promedio 7.75) para volver a ejecutarlo después de cada cambio. Y un caso límite que la corrección revela: con `cantidad == 0`, `promedio` dividiría por cero; la función debería documentar que requiere `cantidad > 0` o tratar ese caso.

## AddressSanitizer: errores de memoria al ejecutar

En `propiedad-y-errores-de-memoria` usaste **AddressSanitizer** (ASan) para encontrar usos después de liberar, dobles liberaciones y fugas en el heap. También detecta accesos fuera de límites en arreglos **automáticos** (en la pila). Con el programa original de `promedio`:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -O0 -fsanitize=address promedio.c -o promedio
./promedio
```

```
==51267==ERROR: AddressSanitizer: stack-buffer-overflow on address 0x00016eef9e30 at pc 0x000100f04884 bp 0x00016eef9d90 sp 0x00016eef9d88
READ of size 4 at 0x00016eef9e30 thread T0
    #0 0x000100f04880 in promedio promedio.c:6
    #1 0x000100f04a1c in main promedio.c:14

Address 0x00016eef9e30 is located in stack of thread T0 at offset 48 in frame
    #0 0x000100f048e8 in main promedio.c:11

  This frame has 1 object(s):
    [32, 48) 'notas' (line 12) <== Memory access at offset 48 overflows this variable
SUMMARY: AddressSanitizer: stack-buffer-overflow promedio.c:6 in promedio
```

Sin depurador y sin hipótesis previa, el informe dice:

1. **Qué:** `stack-buffer-overflow`, una lectura (`READ of size 4`, un `int`) fuera de un arreglo de la pila.
2. **Dónde:** en `promedio`, `promedio.c:6`, llamada desde `main`, línea 14.
3. **Sobre qué objeto:** `notas`, declarado en la línea 12, que ocupa los bytes `[32, 48)` del marco de `main`; el acceso fue en el byte 48, **justo después del final**.

Debajo aparece un mapa de "shadow bytes" que puedes ignorar al principio: es la representación interna que ASan usa para saber qué bytes son válidos.

Los informes de ASan que más vas a ver:

| Informe | Significa |
| --- | --- |
| `heap-buffer-overflow` | lectura o escritura fuera de un bloque de `malloc` |
| `stack-buffer-overflow` | fuera de un arreglo local |
| `global-buffer-overflow` | fuera de un arreglo global o `static` |
| `heap-use-after-free` | uso de un bloque ya liberado |
| `attempting double-free` | `free` dos veces del mismo bloque |
| `detected memory leaks` | fuga (LeakSanitizer, al terminar) |

### `ASAN_OPTIONS`

El comportamiento de ASan se ajusta con la variable de entorno `ASAN_OPTIONS`, sin recompilar:

```bash
ASAN_OPTIONS=detect_leaks=1 ./promedio            # pedir el control de fugas
ASAN_OPTIONS=halt_on_error=0 ./promedio           # seguir después del primer error (requiere compilar con -fsanitize-recover=address)
ASAN_OPTIONS=detect_stack_use_after_return=1 ./promedio
```

Las opciones se separan con `:` (por ejemplo `ASAN_OPTIONS=detect_leaks=1:abort_on_error=1`).

> **Portabilidad:** AddressSanitizer funciona con GCC y Clang en Linux y macOS, y con Clang o MSVC en Windows. **LeakSanitizer** (las fugas) está activado por defecto con ASan en Linux, pero no existe en macOS: allí `ASAN_OPTIONS=detect_leaks=1` responde `detect_leaks is not supported on this platform`, y la alternativa es `leaks --atExit -- ./programa`. En Linux, **Valgrind** (`valgrind --leak-check=full ./programa`) encuentra errores de memoria y fugas sin recompilar con sanitizers, aunque es mucho más lento.

## UndefinedBehaviorSanitizer: comportamiento indefinido al ejecutar

En `operadores` viste que algunas operaciones tienen **comportamiento indefinido**: el estándar no dice qué pasa, y el compilador puede suponer que nunca ocurren. El programa puede "funcionar" en tu máquina y fallar en otra. **UndefinedBehaviorSanitizer** (UBSan) agrega controles para muchos de esos casos:

```c
#include <limits.h>
#include <stdio.h>

int main(void) {
    int grande = INT_MAX;
    int siguiente = grande + 1;              // desbordamiento con signo
    printf("%d\n", siguiente);

    int bits = 32;
    unsigned int mascara = 1u << bits;       // desplazamiento fuera de rango
    printf("%u\n", mascara);

    char bytes[16] = {0};
    int *mal_alineado = (int *)(bytes + 1);  // dirección no alineada para int
    printf("%d\n", *mal_alineado);

    int *nulo = nullptr;
    printf("%d\n", *nulo);                   // desreferenciar un puntero nulo
    return 0;
}
```

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -fsanitize=undefined ub.c -o ub
./ub
```

```
ub.c:6:28: runtime error: signed integer overflow: 2147483647 + 1 cannot be represented in type 'int'
ub.c:10:31: runtime error: shift exponent 32 is too large for 32-bit type 'unsigned int'
ub.c:15:20: runtime error: load of misaligned address 0x00016f709ee9 for type 'int', which requires 4 byte alignment
ub.c:18:20: runtime error: load of null pointer of type 'int'
```

Cada línea tiene el formato `archivo:línea:columna: runtime error: descripción`:

- **Desbordamiento con signo:** sumar 1 a `INT_MAX` no "da la vuelta" en C; es indefinido. (Con `unsigned` sí está definido: da la vuelta módulo 2ⁿ.)
- **Desplazamiento fuera de rango:** desplazar un entero de 32 bits en 32 posiciones o más (o en una cantidad negativa) es indefinido.
- **Acceso desalineado:** muchos tipos exigen que su dirección sea múltiplo de su tamaño (alineación). Convertir una dirección cualquiera a `int *` y leerla es indefinido; en algunos procesadores, el programa se cae.
- **Puntero nulo:** desreferenciar `nullptr` (o `NULL`) es indefinido; normalmente el programa termina con una violación de segmento, pero el compilador puede optimizar suponiendo que nunca pasa.

Por defecto UBSan informa y **sigue ejecutando**. Para que se detenga en el primer error (útil en pruebas automáticas), compila con `-fno-sanitize-recover=undefined` o ejecuta con `UBSAN_OPTIONS=halt_on_error=1` si tu compilador lo permite.

### Combinar sanitizers

ASan y UBSan se pueden usar a la vez. Es la combinación recomendada para desarrollar y probar:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -O0 -fsanitize=address,undefined programa.c -o programa
```

Recuerda sus límites:

- Solo encuentran errores en los caminos que **se ejecutan**: prueba con varias entradas, incluyendo las de error y los casos límite.
- El programa corre más lento y usa más memoria: se usan durante el desarrollo y las pruebas, no en la versión que se entrega.
- No detectan todo el comportamiento indefinido (por ejemplo, no ven lecturas de variables sin inicializar; para eso, en Clang existe MemorySanitizer, solo en Linux).

> **Portabilidad:** UBSan es de GCC y Clang (Linux y macOS). Los mensajes son parecidos pero no idénticos entre compiladores. Un programa sin informes de los sanitizers no queda "probado como correcto": solo no tuvo esos errores en las ejecuciones que hiciste.

## `printf` y `assert` como complementos

### Depurar con `printf`

Imprimir valores intermedios es una técnica legítima y rápida, sobre todo para ver la evolución de un ciclo. Dos reglas la hacen útil:

- Imprime en `stderr`, no en `stdout`: no se mezcla con la salida normal del programa y no queda en un búfer si el programa se cae.
- Incluye dónde estás: la línea y los valores relevantes.

```c
fprintf(stderr, "[promedio:%d] i=%zu suma=%d\n", __LINE__, i, suma);
```

`__LINE__` es una macro predefinida que vale el número de línea actual. Cuando termines, **borra** esas líneas: no forman parte del programa.

### `assert`: comprobar lo que debe ser verdad

`assert(condicion)`, de `<assert.h>`, detiene el programa con un mensaje si la condición es falsa. Sirve para escribir en el código las **suposiciones** que, si fallan, indican un error del programador (no un error de la entrada del usuario):

```c
#include <assert.h>
#include <stdio.h>

double promedio(const int notas[], size_t cantidad) {
    assert(cantidad > 0);          // requisito: al menos una nota
    int suma = 0;
    for (size_t i = 0; i < cantidad; i++) {
        suma += notas[i];
    }
    return (double)suma / cantidad;
}

int main(void) {
    int notas[] = {7, 8, 10, 6};
    printf("Promedio: %.2f\n", promedio(notas, 4));
    printf("Promedio: %.2f\n", promedio(notas, 0));
    return 0;
}
```

La segunda llamada viola el requisito y el programa termina con un mensaje como este (el formato depende de la biblioteca):

```
Promedio: 7.75
Assertion failed: (cantidad > 0), function promedio, file promedio.c, line 5.
```

El mensaje dice qué condición falló y dónde, que es el punto exacto en que se violó la suposición, no veinte líneas después cuando aparece el síntoma. `assert` no reemplaza la validación de la entrada (eso es `scanf(...) != 1`, códigos de retorno, `errno`): un dato inválido del usuario se informa y se trata; un `assert` que falla es un error del programa. En `pruebas-estilo-y-portabilidad` verás cómo se desactiva y cómo usarlo para escribir pruebas.

## Resumen

- Depura con método: **reproducir**, **aislar**, hipótesis, corregir una cosa, verificar y dejar una comprobación de regresión.
- Las advertencias son el primer depurador: `-Wall -Wextra -Wpedantic`, `-Werror` para no ignorarlas, y `-Wconversion` y `-Wshadow` como extras.
- Compila con `-g -O0` para depurar. En GDB y LLDB: `break`, `run`, `next`, `step`, `print`, `backtrace`, `up`/`down`, `watch`, `finish`, `continue`.
- `-fsanitize=address` encuentra accesos fuera de límites (pila, heap, globales), usos después de liberar, dobles liberaciones y (en Linux) fugas.
- `-fsanitize=undefined` encuentra desbordamientos con signo, desplazamientos fuera de rango, accesos desalineados y punteros nulos, entre otros.
- `printf` a `stderr` y `assert` complementan a las herramientas.

## Ejercicios prácticos

### Ejercicio 1: lee el informe de ASan

Este programa copia un texto en un bloque nuevo:

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char *copiar(const char *texto) {
    char *copia = malloc(strlen(texto));
    if (copia == NULL) {
        return NULL;
    }
    strcpy(copia, texto);
    return copia;
}

int main(void) {
    char *saludo = copiar("hola");
    if (saludo == NULL) {
        return 1;
    }
    printf("%s\n", saludo);
    free(saludo);
    return 0;
}
```

Con `-fsanitize=address` se obtiene:

```
==3120==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x602000000014
WRITE of size 5 at 0x602000000014 thread T0
    #0 0x... in strcpy
    #1 0x... in copiar copia.c:10
    #2 0x... in main copia.c:15
0x602000000014 is located 0 bytes after 4-byte region [0x602000000010,0x602000000014)
allocated by thread T0 here:
    #0 0x... in malloc
    #1 0x... in copiar copia.c:6
```

¿Qué error es, en qué línea se produce, en qué línea está la causa y cómo se corrige?

<details><summary>Ver solución</summary>

Es una escritura fuera de un bloque del heap (`heap-buffer-overflow`): `strcpy` escribe 5 bytes (`WRITE of size 5`: las cuatro letras más el `'\0'`) en un bloque de 4 (`4-byte region`). El síntoma está en la línea 10 (`strcpy`), pero la causa está en la línea 6: `malloc(strlen(texto))` no reserva lugar para el terminador. La corrección:

```c
char *copia = malloc(strlen(texto) + 1);
```

</details>

### Ejercicio 2: lee el informe de UBSan

Una función calcula el área de un cuadrado:

```c
int area(int lado) {
    return lado * lado;
}
```

Con `-fsanitize=undefined` y la entrada `50000`, el programa imprime:

```
area.c:2:17: runtime error: signed integer overflow: 50000 * 50000 cannot be represented in type 'int'
```

Explica qué pasa y propone una corrección.

<details><summary>Ver solución</summary>

50000 × 50000 = 2 500 000 000, que supera `INT_MAX` (2 147 483 647 en un `int` de 32 bits). El desbordamiento de un entero **con signo** es comportamiento indefinido, por eso UBSan lo informa. Dos correcciones posibles: calcular en un tipo más ancho, o rechazar los lados que desbordarían.

```c
#include <limits.h>
#include <stdio.h>

long long area(int lado) {
    return (long long)lado * lado;
}

int main(void) {
    printf("%lld\n", area(50000));
    printf("%d\n", INT_MAX);
    return 0;
}
```

La conversión `(long long)lado` se aplica antes de multiplicar, así que la multiplicación se hace en `long long` (al menos 64 bits).

</details>

### Ejercicio 3: escribe la sesión del depurador

En este programa, `suma_hasta` debería devolver 1 + 2 + ... + n, pero para `n = 10` devuelve un valor incorrecto.

```c
#include <stdio.h>

int suma_hasta(int n) {
    int suma = 0;
    for (int i = 1; i < n; i++) {
        suma += i;
    }
    return suma;
}

int main(void) {
    printf("%d\n", suma_hasta(10));
    return 0;
}
```

Escribe los comandos de GDB (y sus equivalentes de LLDB) para: compilar para depurar, detenerte dentro del ciclo cuando `i` vale 9, ver `suma`, avanzar una línea por vez hasta salir del ciclo y ver qué devuelve la función. ¿Cuál es el error?

<details><summary>Ver solución</summary>

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g -O0 suma.c -o suma
```

| Paso | GDB | LLDB |
| --- | --- | --- |
| Abrir | `gdb ./suma` | `lldb ./suma` |
| Parada condicional en la línea 6 | `break suma.c:6 if i == 9` | `break set --file suma.c --line 6 --condition 'i == 9'` |
| Ejecutar | `run` | `run` |
| Ver la suma | `print suma` | `print suma` |
| Avanzar | `next` (varias veces) | `next` (varias veces) |
| Ver el valor devuelto | `finish` | `finish` |

Al detenerse con `i == 9`, `suma` vale 36. Con `next`, después de sumar 9 el ciclo evalúa `i < n` con `i == 10` y sale: el 10 nunca se suma, y `finish` muestra que la función devuelve 45 en lugar de 55. La condición debe ser `i <= n`.

</details>

### Ejercicio 4: corrige las advertencias

Compila este programa con `-Wall -Wextra -Wpedantic -Wshadow` y corrige cada advertencia sin cambiar lo que el programa debe hacer (mostrar el máximo de las edades).

<!-- c-check: skip -->
```c
#include <stdio.h>

int maximo(int valores[], int cantidad) {
    int mayor;
    for (int i = 0; i < cantidad; i++) {
        if (i == 0 || valores[i] > mayor) {
            int mayor = valores[i];
        }
    }
    return mayor;
}

int main(void) {
    int edades[] = {31, 17, 45, 22};
    size_t cantidad = sizeof edades / sizeof edades[0];
    for (int i = 0; i < cantidad; i++) {
        printf("%d ", edades[i]);
    }
    printf("\nMáximo: %d\n", maximo(edades, 4));
    return 0;
}
```

<details><summary>Ver solución</summary>

Advertencias: `int mayor` dentro del `if` **oculta** a la variable de la función (`-Wshadow`) y además no se usa (`-Wunused-variable`); por eso la `mayor` de afuera nunca recibe valor y se compara y devuelve sin inicializar (`-Wuninitialized`); `i < cantidad` compara `int` con `size_t` (`-Wsign-compare`). Versión corregida, que además usa `const` y `size_t`:

```c
#include <stdio.h>

// Requiere cantidad > 0.
int maximo(const int valores[], size_t cantidad) {
    int mayor = valores[0];
    for (size_t i = 1; i < cantidad; i++) {
        if (valores[i] > mayor) {
            mayor = valores[i];
        }
    }
    return mayor;
}

int main(void) {
    int edades[] = {31, 17, 45, 22};
    size_t cantidad = sizeof edades / sizeof edades[0];
    for (size_t i = 0; i < cantidad; i++) {
        printf("%d ", edades[i]);
    }
    printf("\nMáximo: %d\n", maximo(edades, cantidad));
    return 0;
}
```

</details>

### Ejercicio 5: reproducir y aislar

Un programa de 300 líneas lee una lista de productos de un archivo y a veces se cae al final. Describe, en pasos concretos, cómo **reproducirías** el error y cómo lo **aislarías** antes de abrir el depurador.

<details><summary>Ver solución</summary>

Reproducir: guardar el archivo exacto con el que se cayó; ejecutar varias veces con ese archivo para confirmar que falla siempre; si solo falla "a veces", compilar con `-g -fsanitize=address,undefined`, porque un acceso fuera de límites o un uso de memoria liberada suele volverse un error determinista con los sanitizers.

Aislar: recortar el archivo de entrada (quitar la mitad de los productos y probar; repetir con la mitad que falla) hasta tener el archivo más chico que provoca el error; después desactivar o saltear partes del programa que no intervienen (por ejemplo, el informe final) hasta quedarse con la función responsable. Con ese caso mínimo, el informe del sanitizer o una sesión corta del depurador muestran la línea exacta, y ese archivo mínimo queda como comprobación de regresión.

</details>
