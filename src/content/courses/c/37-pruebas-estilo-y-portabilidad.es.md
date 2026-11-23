---
title: 'Pruebas, estilo y portabilidad'
course: 'c'
slug: 'pruebas-estilo-y-portabilidad'
description: 'Verifica tus módulos con pruebas unitarias basadas en assert, documenta precondiciones e invariantes en cabeceras y escribe código C portable y mantenible.'
order: 37
lang: 'es'
published: true
---

Un programa que "anduvo una vez" no es lo mismo que un programa del que puedes confiar. En `depuracion-y-sanitizers` aprendiste a encontrar errores; en esta lección aprendes a **evitar que vuelvan**: con pruebas automáticas, con un estilo que haga el código fácil de leer, con código que compile igual en otras máquinas y con un proyecto organizado que cualquiera pueda compilar y probar con un solo comando.

## Objetivos

- Escribir una **prueba unitaria** con `assert(` y entender por qué `NDEBUG` la desactiva.
- Construir un pequeño ejecutor de pruebas con una macro contadora y un código de salida.
- Escribir pruebas de integración que ejecutan el programa con archivos de entrada y comparan la salida con `diff`.
- Elegir casos límite.
- Aplicar convenciones de estilo: nombres, una responsabilidad por función, `const`, comentarios que documentan interfaces y formato automático.
- Escribir código portable: C estándar frente a extensiones, enteros de ancho fijo, `size_t`, orden de bytes, signo de `char` y comportamiento definido por la implementación.
- Organizar un repositorio con `src/`, `include/`, `tests/` y un `Makefile`, usar control de versiones y medir el rendimiento antes de optimizar.

**Requisitos previos:** `modularizacion-subprogramas-y-funciones` (el módulo `calculadora`, `.h` y `.c`), `tipos-de-datos` (`size_t`, conversiones), `archivos` (archivos binarios) y `depuracion-y-sanitizers` (`assert`, sanitizers, comprobaciones de regresión).

## Pruebas unitarias con `assert`

Una **prueba unitaria** comprueba una unidad pequeña del programa (normalmente una función) de forma aislada: le da entradas conocidas y verifica que el resultado sea el esperado. Se escribe una vez y se ejecuta cada vez que cambias el código.

Vamos a probar el módulo `calculadora` de `modularizacion-subprogramas-y-funciones`. Las pruebas van en un archivo aparte, `test_calculadora.c`, con su propio `main`: así el programa real no cambia.

```c
#include <assert.h>
#include <stdio.h>
#include "calculadora.h"

int main(void) {
    assert(sumar(2, 3) == 5);
    assert(restar(2, 3) == -1);
    assert(multiplicar(-4, 5) == -20);
    assert(dividir(7, 2) == 3);
    assert(se_puede_dividir(0) == false);
    assert(suma_de_cuadrados(3, 4) == 25);
    printf("Todas las pruebas pasaron.\n");
    return 0;
}
```

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g calculadora.c test_calculadora.c -o test_calculadora
./test_calculadora
```

Si todas las condiciones son verdaderas, el programa imprime el mensaje final. Si una falla, `assert` detiene el programa e indica cuál (como viste en `depuracion-y-sanitizers`):

```
Assertion failed: (dividir(7, 2) == 3), function main, file test_calculadora.c, line 9.
```

### Por qué `NDEBUG` desactiva `assert`

`assert` es una macro de `<assert.h>`, y el estándar define que, si el nombre `NDEBUG` está definido antes de incluir `<assert.h>`, cada `assert(...)` se reemplaza por nada. Se define desde la línea de compilación:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -DNDEBUG calculadora.c test_calculadora.c -o test_calculadora
```

La idea es que en la versión que se entrega las comprobaciones internas no cuesten tiempo. Tiene dos consecuencias importantes:

1. **Las pruebas nunca se compilan con `-DNDEBUG`.** Con esa opción, el programa de arriba imprime "Todas las pruebas pasaron." **sin comprobar nada**.
2. **Nunca pongas un efecto dentro de un `assert`.** Con `assert(fgets(linea, sizeof linea, archivo) != NULL);` la lectura desaparece al compilar con `NDEBUG`, y el programa deja de leer. Primero haz la operación y guarda su resultado; después comprueba el resultado.

Por eso, y porque `assert` se detiene en la **primera** falla sin decir cuántas más hay, para las pruebas conviene un mecanismo propio.

## Un ejecutor de pruebas mínimo

Un **ejecutor de pruebas** (*test runner*) cuenta cuántas comprobaciones se hicieron y cuántas fallaron, informa cada falla sin detenerse y termina con un código de salida que otros programas (como `make`) pueden leer: `0` si todo pasó, distinto de cero si algo falló.

Lo construimos con una macro:

```c
#include <stdio.h>
#include <stdlib.h>
#include "calculadora.h"

static int pruebas_ejecutadas = 0;
static int pruebas_fallidas = 0;

#define VERIFICAR(condicion)                                        \
    do {                                                            \
        pruebas_ejecutadas++;                                       \
        if (!(condicion)) {                                         \
            pruebas_fallidas++;                                     \
            fprintf(stderr, "%s:%d: falló: %s\n",                   \
                    __FILE__, __LINE__, #condicion);                \
        }                                                           \
    } while (0)

static void probar_sumar_y_restar(void) {
    VERIFICAR(sumar(2, 3) == 5);
    VERIFICAR(sumar(-2, 2) == 0);
    VERIFICAR(restar(2, 3) == -1);
}

static void probar_dividir(void) {
    VERIFICAR(dividir(7, 2) == 3);
    VERIFICAR(dividir(-7, 2) == -3);     // C trunca hacia cero
    VERIFICAR(dividir(0, 5) == 0);
    VERIFICAR(se_puede_dividir(0) == false);
    VERIFICAR(se_puede_dividir(-1) == true);
}

static void probar_suma_de_cuadrados(void) {
    VERIFICAR(suma_de_cuadrados(3, 4) == 25);
    VERIFICAR(suma_de_cuadrados(0, 0) == 0);
    VERIFICAR(suma_de_cuadrados(-3, 4) == 25);
}

int main(void) {
    probar_sumar_y_restar();
    probar_dividir();
    probar_suma_de_cuadrados();

    printf("%d pruebas, %d fallidas\n", pruebas_ejecutadas, pruebas_fallidas);
    return pruebas_fallidas == 0 ? EXIT_SUCCESS : EXIT_FAILURE;
}
```

```
11 pruebas, 0 fallidas
```

Cómo funciona la macro:

- Las barras invertidas `\` al final de cada línea continúan la definición en la línea siguiente.
- `#condicion` convierte el **texto** del argumento en una cadena: si la prueba `dividir(7, 2) == 4` falla, el mensaje muestra exactamente esa expresión: `test_calculadora.c:25: falló: dividir(7, 2) == 4`.
- `__FILE__` y `__LINE__` son macros predefinidas con el archivo y la línea de cada uso.
- `do { ... } while (0)` agrupa todo en una sola sentencia, para que `VERIFICAR(...);` se comporte bien incluso dentro de un `if` sin llaves. Verás estas técnicas en detalle en `preprocesador-y-programacion-generica`.
- `EXIT_SUCCESS` y `EXIT_FAILURE`, de `<stdlib.h>`, son los códigos de salida estándar de éxito y falla.

Cada función `probar_...` agrupa las pruebas de una parte del módulo. Las variables contadoras son `static` globales: solo existen dentro de este archivo de pruebas.

> **Portabilidad:** este ejecutor usa solo C estándar, así que funciona con cualquier compilador. En proyectos grandes se usan bibliotecas de pruebas (Unity, cmocka, Check, entre otras) que agregan comparaciones con mensajes más detallados; la idea es la misma.

### Casos límite

Una prueba con `2 + 3` encuentra pocos errores. Los errores viven en los **bordes**. Al elegir casos, piensa en:

- **Cero y vacío:** `0`, una cadena `""`, un arreglo o una lista sin elementos.
- **Un solo elemento**, y el primero y el último de una colección (ahí aparecen los errores por uno).
- **Negativos** y la mezcla de signos: `dividir(-7, 2)` es `-3`, porque C trunca la división entera hacia cero.
- **Los extremos del tipo:** `INT_MAX`, `INT_MIN`, `SIZE_MAX`; sumar o multiplicar cerca de ellos desborda.
- **Entradas inválidas:** lo que el usuario puede escribir mal, un archivo que no existe, una reserva de memoria que falla.

Cada error que corriges merece una prueba con la entrada que lo provocaba: esa es la **comprobación de regresión** del método de `depuracion-y-sanitizers`.

Ejecuta las pruebas con los sanitizers (`-fsanitize=address,undefined`): una prueba que pasa "por casualidad" leyendo fuera de un arreglo así deja de pasar.

### Probar una estructura dinámica

Lo mismo sirve para módulos con memoria dinámica, como la lista de `estructuras-dinamicas-listas`. Una prueba arma una lista, comprueba su estado y la destruye; con `-fsanitize=address` también verifica que no haya fugas ni accesos inválidos:

```c
static void probar_insertar_en_lista_vacia(void) {
    Nodo *cabeza = NULL;                       // caso límite: lista vacía
    VERIFICAR(longitud(cabeza) == 0);
    VERIFICAR(insertar_al_final(&cabeza, 7));
    VERIFICAR(longitud(cabeza) == 1);
    VERIFICAR(cabeza->dato == 7);
    destruir_lista(&cabeza);
    VERIFICAR(cabeza == NULL);
}
```

(Las funciones son las de `estructuras-dinamicas-listas`: `insertar_al_final`, `longitud` y `destruir_lista`, que deja la cabeza en `NULL`. Lo importante es probar el estado antes y después de cada operación, empezando por los casos límite.)

## Pruebas de integración

Una prueba unitaria comprueba una función. Una **prueba de integración** comprueba el programa **entero**, como lo usaría una persona: le da una entrada y compara su salida con la esperada.

Con este `main.c` para la calculadora:

```c
#include <stdio.h>
#include "calculadora.h"

int main(void) {
    int a = 0;
    int b = 0;
    if (scanf("%d %d", &a, &b) != 2) {
        printf("Entrada inválida.\n");
        return 1;
    }
    printf("%d + %d = %d\n", a, b, sumar(a, b));
    if (se_puede_dividir(b)) {
        printf("%d / %d = %d\n", a, b, dividir(a, b));
    } else {
        printf("No se puede dividir por cero.\n");
    }
    return 0;
}
```

cada caso es un par de archivos: la entrada y la salida esperada.

```
tests/casos/division.entrada     7 2
tests/casos/division.esperado    7 + 2 = 9
                                 7 / 2 = 3
tests/casos/cero.entrada         5 0
tests/casos/cero.esperado        5 + 0 = 5
                                 No se puede dividir por cero.
tests/casos/invalida.entrada     hola
tests/casos/invalida.esperado    Entrada inválida.
```

La terminal hace el resto: `<` redirige el archivo a la entrada estándar del programa y `diff` compara dos textos. `diff` no muestra nada y termina con código `0` si son iguales; si difieren, muestra las líneas distintas y termina con `1`.

```bash
./calculadora < tests/casos/division.entrada > salida.txt
diff -u tests/casos/division.esperado salida.txt
```

Para no repetirlo a mano, un pequeño script recorre todos los casos (`tests/integracion.sh`):

```sh
#!/bin/sh
# Ejecuta ./calculadora con cada archivo de entrada y compara su salida
# con la esperada. Termina con código 1 ante la primera diferencia.
for entrada in tests/casos/*.entrada; do
    esperado="${entrada%.entrada}.esperado"
    if ./calculadora < "$entrada" | diff -u "$esperado" -; then
        echo "ok      $entrada"
    else
        echo "FALLÓ   $entrada"
        exit 1
    fi
done
```

`${entrada%.entrada}` quita la extensión `.entrada` del nombre, y el `-` final de `diff` significa "lee el segundo texto de la entrada estándar", es decir, la salida del programa. Si cambias el programa y la división pasa a imprimir otra cosa, el script lo muestra:

```
ok      tests/casos/cero.entrada
--- tests/casos/division.esperado
+++ -
@@ -1,2 +1,2 @@
 7 + 2 = 9
-7 / 2 = 3.5
+7 / 2 = 3
FALLÓ   tests/casos/division.entrada
```

Las líneas con `-` son las esperadas y las líneas con `+` las que produjo el programa.

> **Portabilidad:** `diff` y los scripts `sh` existen en Linux y macOS. En Windows están disponibles con Git Bash o WSL; PowerShell tiene `Compare-Object`, con otro formato.

## Estilo y convenciones

El compilador acepta casi cualquier forma de escribir; las personas que leen tu código, no. Una **convención** es un acuerdo del equipo sobre cómo escribir; lo importante es elegir una y aplicarla **siempre**. Las de este curso:

| Elemento | Convención | Ejemplos |
| --- | --- | --- |
| Variables y funciones | minúsculas con guion bajo (`snake_case`), verbos para funciones | `cantidad`, `suma_de_cuadrados`, `insertar_al_final` |
| Tipos (`typedef`) | inicial mayúscula | `Persona`, `Nodo`, `Agenda` |
| Constantes y macros | mayúsculas | `CAPACIDAD_AGENDA`, `VERIFICAR` |
| Funciones de un módulo | prefijo común | `lista_crear`, `lista_insertar`, `lista_destruir` |
| Booleanos | se leen como pregunta | `se_puede_dividir`, `esta_vacia` |

Además del nombre:

- **Una responsabilidad por función.** Si para describir una función necesitas la palabra "y" ("lee los datos **y** calcula el promedio **y** lo imprime"), divídela. Las funciones chicas se prueban por separado.
- **Sin números mágicos.** `if (edad >= MAYORIA_DE_EDAD)` dice más que `if (edad >= 18)`.
- **`const` donde no se modifica.** Un parámetro `const int notas[]` o `const char *texto` promete que la función solo lee; el compilador lo hace cumplir y quien llama lo sabe sin leer el código. Es la "corrección de `const`": todo lo que no se modifica se marca `const`.
- **Comentarios que explican el porqué y la interfaz,** no que repiten el código. `i++; // incrementa i` no aporta nada.

### Documentar la interfaz

El comentario de cada función del `.h` es un **contrato**: lo que la función requiere, lo que devuelve, cómo informa los errores y, si maneja memoria, quién es el dueño (`propiedad-y-errores-de-memoria`):

```c
// Calcula el promedio de las primeras cantidad notas.
// Requiere: cantidad > 0.
// Devuelve: el promedio como double.
double promedio(const int notas[], size_t cantidad);

// Lee un archivo de productos con el formato de inventario.txt.
// Devuelve: true si pudo leer todo; false si no pudo abrir o leer el
//           archivo, o si una línea tiene formato inválido (en ese caso
//           *cantidad queda en 0 y no se reserva memoria).
// Propiedad: si devuelve true, *productos apunta a un bloque nuevo; el
//            llamador es su dueño y debe liberarlo con free.
bool leer_productos(const char *ruta, Producto **productos, size_t *cantidad);
```

Con el contrato, quien usa la función no necesita leer su implementación; y las pruebas unitarias verifican exactamente lo que el contrato promete.

### Formato automático

Discutir dónde va la llave o cuántos espacios se usan es una pérdida de tiempo: una herramienta formatea el código y todos usan el mismo resultado. La más común para C es **clang-format**, que lee las reglas de un archivo `.clang-format` en la raíz del proyecto:

```yaml
BasedOnStyle: LLVM
IndentWidth: 4
ColumnLimit: 100
```

```bash
clang-format -i src/*.c include/*.h tests/*.c
```

`-i` reescribe los archivos en su lugar. Úsalo antes de cada commit. (clang-format se instala junto con Clang o desde el gestor de paquetes; no es parte del compilador ni del estándar.)

## Portabilidad

Un programa es **portable** cuando compila y se comporta igual en otros compiladores, sistemas operativos y procesadores. La **portabilidad** no es automática en C: el estándar deja varias cosas en manos de cada implementación.

### C estándar frente a extensiones

GCC y Clang aceptan **extensiones**: cosas que no son C estándar, como `__attribute__((...))`, las expresiones entre llaves `({ ... })` o `#pragma once`. Funcionan en esos compiladores, pero no en otros. `-Wpedantic` avisa cuando usas una. Regla del curso: C estándar por defecto; si necesitas una extensión, márcala con un comentario y, si puedes, aíslala en un solo archivo.

> **C moderno (C23):** varias extensiones populares pasaron a ser estándar en C23 (por ejemplo `typeof` y los atributos `[[...]]`). Si compilas con un estándar anterior (`-std=c17`), siguen siendo extensiones. Lo verás en `c23-moderno`.

### Enteros de ancho fijo: `<stdint.h>`

El estándar solo garantiza tamaños **mínimos**: `int` tiene al menos 16 bits, `long` al menos 32. En la mayoría de las computadoras actuales `int` tiene 32 bits, pero `long` tiene 64 en Linux y macOS y 32 en Windows. Cuando el tamaño exacto importa (formatos de archivo, protocolos, operaciones con bits), usa los tipos de `<stdint.h>`:

```c
#include <inttypes.h>
#include <stdint.h>
#include <stdio.h>

int main(void) {
    int32_t saldo = -1500;          // exactamente 32 bits, con signo
    uint8_t brillo = 255;           // exactamente 8 bits, sin signo
    uint64_t visitas = 4000000000;  // exactamente 64 bits, sin signo

    printf("saldo: %" PRId32 "\n", saldo);
    printf("brillo: %" PRIu8 "\n", brillo);
    printf("visitas: %" PRIu64 "\n", visitas);
    printf("tamaños: %zu %zu %zu\n", sizeof saldo, sizeof brillo, sizeof visitas);
    return 0;
}
```

- `int8_t`, `int16_t`, `int32_t`, `int64_t` (con signo) y sus versiones `uint..._t` (sin signo) tienen exactamente esa cantidad de bits.
- Para imprimirlos de forma portable, `<inttypes.h>` define macros como `PRId32` o `PRIu64`, que se pegan al resto del formato: `"%" PRId32`.
- Para tamaños de objetos e índices, sigue usando `size_t` (con `%zu`), como en `tipos-de-datos`: es el tipo que devuelve `sizeof` y su ancho se adapta a cada plataforma.

### Orden de bytes y archivos binarios

Un entero de varios bytes se guarda en memoria en algún **orden**. En el orden *little-endian* (x86, ARM en casi todos los sistemas) el byte menos significativo va primero; en *big-endian*, el más significativo.

```c
#include <stdint.h>
#include <stdio.h>

int main(void) {
    uint32_t valor = 0x01020304;
    const unsigned char *bytes = (const unsigned char *)&valor;
    for (size_t i = 0; i < sizeof valor; i++) {
        printf("%02x ", bytes[i]);
    }
    printf("\n");
    return 0;
}
```

En una máquina *little-endian* imprime `04 03 02 01`; en una *big-endian*, `01 02 03 04`.

Esto importa con los archivos binarios de `archivos`: si haces `fwrite(&valor, sizeof valor, 1, archivo)`, el archivo guarda los bytes **en el orden de tu máquina**, y otra máquina puede leer otro número. La solución portable es fijar el orden del formato y escribir byte por byte:

```c
#include <stdint.h>
#include <stdio.h>

// Escribe valor en el archivo en orden little-endian (byte menos
// significativo primero). Devuelve true si pudo escribir los 4 bytes.
bool escribir_u32_le(FILE *archivo, uint32_t valor) {
    unsigned char bytes[4] = {
        (unsigned char)(valor & 0xFF),
        (unsigned char)((valor >> 8) & 0xFF),
        (unsigned char)((valor >> 16) & 0xFF),
        (unsigned char)((valor >> 24) & 0xFF),
    };
    return fwrite(bytes, 1, sizeof bytes, archivo) == sizeof bytes;
}

// Lee un uint32_t guardado en orden little-endian. Devuelve true si pudo leer.
bool leer_u32_le(FILE *archivo, uint32_t *valor) {
    unsigned char bytes[4];
    if (fread(bytes, 1, sizeof bytes, archivo) != sizeof bytes) {
        return false;
    }
    *valor = (uint32_t)bytes[0]
           | ((uint32_t)bytes[1] << 8)
           | ((uint32_t)bytes[2] << 16)
           | ((uint32_t)bytes[3] << 24);
    return true;
}

int main(void) {
    FILE *archivo = fopen("numero.bin", "wb");
    if (archivo == NULL || !escribir_u32_le(archivo, 0x01020304)) {
        fprintf(stderr, "No se pudo escribir numero.bin\n");
        return 1;
    }
    fclose(archivo);

    archivo = fopen("numero.bin", "rb");
    uint32_t leido = 0;
    if (archivo == NULL || !leer_u32_le(archivo, &leido)) {
        fprintf(stderr, "No se pudo leer numero.bin\n");
        return 1;
    }
    fclose(archivo);
    printf("Leído: 0x%08x\n", (unsigned int)leido);
    return 0;
}
```

Los desplazamientos (`>>`, `<<`) trabajan sobre el **valor**, no sobre la memoria, así que el resultado es el mismo en cualquier máquina. Por la misma razón, no escribas un `struct` entero con `fwrite` si otra máquina lo va a leer: el relleno entre campos (`concepto-de-estructuras`) también cambia entre compiladores.

### El signo de `char`

El estándar no dice si `char` (sin `signed` ni `unsigned`) tiene signo: lo decide cada implementación.

```c
#include <stdio.h>

int main(void) {
    char c = (char)200;
    printf("%d\n", c);
    return 0;
}
```

En x86 y en macOS con procesadores Apple imprime `-56` (`char` tiene signo); en Linux sobre ARM imprime `200` (`char` no tiene signo). Si guardas bytes o números pequeños, usa `unsigned char`, `uint8_t` o `int8_t`; deja `char` para texto. Por eso las funciones de `<ctype.h>` se llaman con `(unsigned char)c`, como viste en `biblioteca-estandar-y-errores`.

### Comportamiento definido por la implementación

En `operadores` distinguiste lo **indefinido** (prohibido: el programa no tiene sentido) de lo **no especificado**. Hay una tercera categoría: el comportamiento **definido por la implementación**, que es válido pero cada compilador lo elige y lo documenta. Ejemplos:

- el tamaño de `int`, `long` y los punteros;
- si `char` tiene signo;
- el resultado de desplazar a la derecha un número negativo (`-8 >> 1`);
- el valor de convertir a un tipo con signo un número que no entra.

Un programa portable no depende de ninguno de ellos: usa tipos de ancho fijo cuando el tamaño importa, `unsigned` para operar con bits y comprueba los rangos antes de convertir.

> **Portabilidad:** la prueba más simple de portabilidad es compilar con **dos compiladores**: `gcc` y `clang` con las mismas opciones. Cada uno detecta advertencias distintas, y una diferencia de comportamiento entre los dos casi siempre señala un comportamiento indefinido o definido por la implementación. (En macOS, `gcc` es Clang; para tener GCC de verdad hay que instalarlo, por ejemplo con Homebrew como `gcc-14`.)

## Organización del repositorio

Cuando un proyecto tiene más de un archivo, una estructura fija ayuda a encontrar las cosas:

```
calculadora/
├── include/
│   └── calculadora.h        interfaz pública
├── src/
│   ├── calculadora.c        implementación
│   └── main.c               programa
├── tests/
│   ├── test_calculadora.c   pruebas unitarias
│   ├── integracion.sh       pruebas de integración
│   └── casos/               entradas y salidas esperadas
├── .gitignore
├── .clang-format
├── Makefile
└── README.md                qué hace, cómo compilarlo y probarlo
```

### Un `Makefile` simple

`make` lee un archivo `Makefile` con **reglas**: qué archivo se genera, de qué depende y con qué comando. Solo rehace lo que cambió.

```makefile
CC = gcc
CFLAGS = -std=c23 -Wall -Wextra -Wpedantic -g -Iinclude
SANITIZERS = -fsanitize=address,undefined

.PHONY: all test clean

all: calculadora

calculadora: src/main.c src/calculadora.c include/calculadora.h
	$(CC) $(CFLAGS) src/main.c src/calculadora.c -o calculadora

test_calculadora: tests/test_calculadora.c src/calculadora.c include/calculadora.h
	$(CC) $(CFLAGS) $(SANITIZERS) tests/test_calculadora.c src/calculadora.c -o test_calculadora

test: calculadora test_calculadora
	./test_calculadora
	./tests/integracion.sh

clean:
	rm -f calculadora test_calculadora
```

- `CFLAGS` tiene las opciones del curso; `-Iinclude` le dice al compilador que busque los `#include "..."` también en `include/`.
- Cada regla es `objetivo: dependencias` y, debajo, el comando. **La línea del comando empieza con un tabulador**, no con espacios: es el error más común al escribir un `Makefile`.
- Las pruebas se compilan con los sanitizers.
- `.PHONY` marca los objetivos que no son archivos.

```bash
make          # compila el programa
make test     # compila y ejecuta todas las pruebas
make clean    # borra lo generado
```

```
./test_calculadora
11 pruebas, 0 fallidas
./tests/integracion.sh
ok      tests/casos/cero.entrada
ok      tests/casos/division.entrada
ok      tests/casos/invalida.entrada
```

Si una prueba falla, el comando termina con código distinto de cero y `make` se detiene con un error: por eso el ejecutor devuelve `EXIT_FAILURE`.

### Control de versiones

Un sistema de control de versiones, como Git, guarda la historia del proyecto y permite volver atrás. Dos reglas básicas:

- **Se guarda el código fuente**, no lo que se genera a partir de él: `.c`, `.h`, pruebas, casos, `Makefile`, `README.md`.
- **Se ignoran los binarios** (ejecutables, `.o`), porque se regeneran con `make` y dependen de cada máquina. Se listan en `.gitignore`:

```
*.o
calculadora
test_calculadora
*.dSYM/
```

```bash
git init
git add include src tests Makefile README.md .gitignore .clang-format
git commit -m "Calculadora con pruebas unitarias y de integración"
```

Antes de cada commit: `make test` en verde. Un commit con las pruebas fallando rompe la comprobación de regresión para todos.

## Medir el rendimiento

"Este código es lento" es una hipótesis, y como en la depuración, se comprueba antes de cambiar nada. **Mide antes de optimizar**: casi siempre el tiempo se va en un lugar distinto del que imaginabas.

La forma más simple es medir el programa entero con el comando `time` de la terminal:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -O2 programa.c -o programa
time ./programa
```

```
real    0m0.412s
user    0m0.405s
sys     0m0.004s
```

`real` es el tiempo de reloj; `user`, el tiempo de procesador usado por tu programa; `sys`, el usado por el sistema operativo en su nombre.

Para medir una parte, `clock()` de `<time.h>` devuelve el tiempo de procesador consumido; la diferencia entre dos llamadas, dividida por `CLOCKS_PER_SEC`, da segundos:

```c
#include <stdio.h>
#include <time.h>

long long suma_hasta(long long n) {
    long long suma = 0;
    for (long long i = 1; i <= n; i++) {
        suma += i;
    }
    return suma;
}

int main(void) {
    clock_t inicio = clock();
    long long resultado = suma_hasta(200000000);
    clock_t fin = clock();

    double segundos = (double)(fin - inicio) / CLOCKS_PER_SEC;
    printf("Resultado: %lld\n", resultado);
    printf("Tiempo: %.3f s\n", segundos);
    return 0;
}
```

Reglas para que la medición sirva:

- **Mide con optimizaciones** (`-O2`) y **sin sanitizers**: con `-O0` o con ASan medirías otro programa.
- **Usa el resultado** (aquí se imprime): si no se usa, el compilador puede eliminar el cálculo entero y medirías cero.
- **Repite** la medición varias veces y con datos de tamaño realista; una sola ejecución puede variar.
- **Compara algoritmos antes que detalles:** pasar de búsqueda lineal a binaria (`busqueda-en-arreglos`) gana más que cualquier truco de bajo nivel.

> **Portabilidad:** `clock()` es C estándar, pero mide tiempo de **procesador**, no de reloj; en un programa que espera entrada o disco, los dos difieren. `time` es un comando de la terminal (Linux y macOS), no parte de C.

## Resumen

- Una **prueba unitaria** verifica una función con entradas conocidas; `assert(` sirve para empezar, pero `NDEBUG` lo desactiva: las pruebas nunca se compilan con `-DNDEBUG` y nunca se pone un efecto dentro de un `assert`.
- Un ejecutor mínimo con una macro contadora informa todas las fallas y devuelve un código de salida.
- Las pruebas de integración ejecutan el programa con archivos de entrada y comparan la salida con `diff`.
- Los errores viven en los casos límite: vacío, uno, extremos, negativos, entradas inválidas.
- Una **convención** consistente, una responsabilidad por función, `const` y contratos en los comentarios hacen el código legible; clang-format resuelve el formato.
- **Portabilidad:** C estándar antes que extensiones, `<stdint.h>` y `size_t`, orden de bytes fijo en archivos binarios, `unsigned char` para bytes, nada que dependa de la implementación, y dos compiladores.
- Un repositorio con `src/`, `include/`, `tests/` y un `Makefile` con objetivo `test`; en Git se guarda el código, no los binarios.
- Mide antes de optimizar, con `-O2` y sin sanitizers.

## Ejercicios prácticos

### Ejercicio 1: pruebas para `es_bisiesto`

Un año es bisiesto si es divisible por 4, salvo los divisibles por 100, que solo lo son si también son divisibles por 400. Escribe `es_bisiesto(int anio)` y un ejecutor de pruebas con la macro `VERIFICAR` que cubra los casos límite de la regla. El programa debe terminar con `EXIT_FAILURE` si alguna prueba falla.

<details><summary>Ver solución</summary>

Los casos límite son uno por cada rama de la regla: divisible por 4 (2024), no divisible por 4 (2023), divisible por 100 pero no por 400 (1900) y divisible por 400 (2000).

```c
#include <stdio.h>
#include <stdlib.h>

static int pruebas_ejecutadas = 0;
static int pruebas_fallidas = 0;

#define VERIFICAR(condicion)                                        \
    do {                                                            \
        pruebas_ejecutadas++;                                       \
        if (!(condicion)) {                                         \
            pruebas_fallidas++;                                     \
            fprintf(stderr, "%s:%d: falló: %s\n",                   \
                    __FILE__, __LINE__, #condicion);                \
        }                                                           \
    } while (0)

bool es_bisiesto(int anio) {
    return (anio % 4 == 0 && anio % 100 != 0) || anio % 400 == 0;
}

static void probar_es_bisiesto(void) {
    VERIFICAR(es_bisiesto(2024));     // divisible por 4
    VERIFICAR(!es_bisiesto(2023));    // no divisible por 4
    VERIFICAR(!es_bisiesto(1900));    // divisible por 100, no por 400
    VERIFICAR(es_bisiesto(2000));     // divisible por 400
}

int main(void) {
    probar_es_bisiesto();
    printf("%d pruebas, %d fallidas\n", pruebas_ejecutadas, pruebas_fallidas);
    return pruebas_fallidas == 0 ? EXIT_SUCCESS : EXIT_FAILURE;
}
```

</details>

### Ejercicio 2: la prueba que no prueba nada

Un equipo compila sus pruebas con el mismo comando que la versión final: `gcc -std=c23 -O2 -DNDEBUG ...`. Las pruebas usan `assert` y siempre pasan, incluso después de introducir un error evidente. Además, en el programa hay esta línea:

```c
assert(fscanf(archivo, "%d", &cantidad) == 1);
```

Explica los dos problemas y cómo corregirlos.

<details><summary>Ver solución</summary>

1. Con `-DNDEBUG`, todos los `assert` desaparecen: las pruebas no comprueban nada y por eso "pasan". Las pruebas se compilan sin `NDEBUG` (o con un ejecutor propio como `VERIFICAR`, que no depende de `NDEBUG`), idealmente con `-g -fsanitize=address,undefined`.
2. La lectura está **dentro** del `assert`: con `NDEBUG` el `fscanf` no se ejecuta y `cantidad` nunca se lee. Además, un archivo con formato inválido es un error de la entrada, no del programa, así que no corresponde un `assert` sino un control:

```c
if (fscanf(archivo, "%d", &cantidad) != 1) {
    fprintf(stderr, "Formato inválido\n");
    return false;
}
```

</details>

### Ejercicio 3: hazlo portable

Este programa guarda un registro de temperatura en un archivo binario que después se lee en otra computadora. Señala los problemas de portabilidad y corrígelos.

```c
#include <stdio.h>

int main(void) {
    long medicion = -1250;            // centésimas de grado
    FILE *archivo = fopen("temp.bin", "wb");
    if (archivo == NULL) {
        return 1;
    }
    fwrite(&medicion, sizeof medicion, 1, archivo);
    fclose(archivo);
    return 0;
}
```

<details><summary>Ver solución</summary>

- `long` tiene 64 bits en Linux y macOS y 32 en Windows: el archivo tiene distinto tamaño según dónde se generó. Hay que usar un tipo de ancho fijo: `int32_t`.
- `fwrite(&medicion, ...)` escribe los bytes en el orden de la máquina: una computadora con otro orden lee otro número. Hay que fijar el orden y escribir byte por byte.
- No se comprueba el resultado de `fwrite`.

```c
#include <stdint.h>
#include <stdio.h>

// Escribe valor en orden little-endian. Devuelve true si escribió 4 bytes.
bool escribir_u32_le(FILE *archivo, uint32_t valor) {
    unsigned char bytes[4] = {
        (unsigned char)(valor & 0xFF),
        (unsigned char)((valor >> 8) & 0xFF),
        (unsigned char)((valor >> 16) & 0xFF),
        (unsigned char)((valor >> 24) & 0xFF),
    };
    return fwrite(bytes, 1, sizeof bytes, archivo) == sizeof bytes;
}

int main(void) {
    int32_t medicion = -1250;         // centésimas de grado
    FILE *archivo = fopen("temp.bin", "wb");
    if (archivo == NULL) {
        return 1;
    }
    // La conversión de int32_t a uint32_t está definida (módulo 2^32);
    // al leer, se convierte de vuelta comprobando el rango.
    bool ok = escribir_u32_le(archivo, (uint32_t)medicion);
    if (fclose(archivo) != 0 || !ok) {
        fprintf(stderr, "No se pudo escribir temp.bin\n");
        return 1;
    }
    return 0;
}
```

</details>

### Ejercicio 4: un caso de integración nuevo

Al corregir un error, descubriste que la calculadora fallaba con la entrada `-7 2` (mostraba `-4` como cociente). Ya lo arreglaste. Agrega la comprobación de regresión como prueba de integración y escribe el comando para ejecutar todas las pruebas.

<details><summary>Ver solución</summary>

Dos archivos nuevos en `tests/casos/`:

```
tests/casos/negativo.entrada     -7 2
tests/casos/negativo.esperado    -7 + 2 = -5
                                 -7 / 2 = -3
```

El script `integracion.sh` recorre todos los `*.entrada`, así que no hace falta cambiarlo:

```bash
make test
```

Conviene agregar también la prueba unitaria `VERIFICAR(dividir(-7, 2) == -3);`: la de integración dice que el programa falla, y la unitaria dice qué función.

</details>

### Ejercicio 5: mejora el estilo

Reescribe esta función siguiendo las convenciones de la lección: nombres, una responsabilidad, `const`, sin números mágicos y con el contrato documentado.

```c
#include <stdio.h>

int f(int a[], int n) {
    int x = 0;
    for (int i = 0; i < n; i++) {
        if (a[i] >= 6) {
            x++;
        }
    }
    printf("%d\n", x);
    return x;
}

int main(void) {
    int a[] = {4, 6, 9, 5};
    f(a, 4);
    return 0;
}
```

<details><summary>Ver solución</summary>

La función hacía dos cosas (contar e imprimir), no modificaba el arreglo pero no lo prometía con `const`, y tenía un número mágico (`6`). Separada:

```c
#include <stdio.h>

#define NOTA_MINIMA_APROBACION 6

// Cuenta cuántas de las primeras cantidad notas están aprobadas.
// Devuelve: un número entre 0 y cantidad. Acepta cantidad == 0.
size_t contar_aprobadas(const int notas[], size_t cantidad) {
    size_t aprobadas = 0;
    for (size_t i = 0; i < cantidad; i++) {
        if (notas[i] >= NOTA_MINIMA_APROBACION) {
            aprobadas++;
        }
    }
    return aprobadas;
}

int main(void) {
    int notas[] = {4, 6, 9, 5};
    size_t cantidad = sizeof notas / sizeof notas[0];
    printf("Aprobadas: %zu\n", contar_aprobadas(notas, cantidad));
    return 0;
}
```

Imprimir queda en `main`, y `contar_aprobadas` se puede probar con `VERIFICAR(contar_aprobadas(notas, 0) == 0)` y otros casos límite sin mirar la pantalla.

</details>
