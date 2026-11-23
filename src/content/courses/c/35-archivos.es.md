---
title: 'Archivos'
course: 'c'
slug: 'archivos'
order: 35
lang: 'es'
published: true
---

Hasta ahora trabajaste principalmente con datos en memoria. Pero cuando el programa termina, esa información desaparece.

Para conservar datos entre ejecuciones aparecen los **archivos**. En esta lección aprendes a abrirlos, leerlos y escribirlos tanto en formato de texto como binario, a comprobar el resultado de **cada** operación y a cerrar todo lo que abriste, también cuando algo sale mal.

## Objetivos

- Abrir un archivo con `fopen` eligiendo el modo correcto (lectura, escritura, agregado, texto o binario).
- Comprobar si `fopen` devolvió `NULL` e informar el motivo con `perror`.
- Cerrar cada archivo con `fclose` en todos los caminos, incluidos los de error.
- Escribir y leer texto con `fprintf`, `fputs`, `fgets`, `fgetc` y `fscanf`, revisando lo que devuelve cada una.
- Distinguir el fin de archivo de un error de lectura con `feof` y `ferror`.
- Guardar y cargar arreglos de estructuras en un archivo binario con `fwrite` y `fread`, verificando la cantidad devuelta.
- Conocer los límites de portabilidad de los archivos binarios (orden de bytes, relleno, tamaño de los tipos).
- Moverse dentro de un archivo con `fseek` y `ftell`.

**Requisitos previos:** `cadenas-de-caracteres-y-operaciones` (21), `concepto-de-estructuras` (22), `memoria-dinamica` (28), `propiedad-y-errores-de-memoria` (29) y `biblioteca-estandar-y-errores` (34).

## ¿Qué es un archivo?

Un archivo es una forma de guardar información en disco para que siga existiendo después de que el programa termine.

Eso permite, por ejemplo:

- guardar resultados
- cargar datos previamente guardados
- mantener información persistente

Para el programa, un archivo abierto es un **flujo** (*stream*) de bytes: se lee o se escribe desde una posición actual que avanza con cada operación. Los flujos que ya conoces, `stdin`, `stdout` y `stderr`, son del mismo tipo que un archivo abierto.

## El tipo `FILE *`

En C, los archivos se manejan mediante un puntero a `FILE`, un tipo declarado en `<stdio.h>`.

`FILE` es una estructura que guarda todo lo que la biblioteca necesita para operar sobre el archivo: la posición actual, un búfer, los indicadores de fin de archivo y de error. Tú nunca accedes a sus campos; solo pasas el `FILE *` a las funciones de `<stdio.h>`.

Además, las escrituras no van directo al disco: se acumulan en un **búfer** en memoria y se vuelcan en bloques. Por eso cerrar el archivo es fundamental: `fclose` vacía el búfer, entrega los datos pendientes y libera el recurso que el programa estaba usando. Si el programa necesita que los datos lleguen antes de cerrar, puede llamar a `fflush(archivo)`.

## Abrir un archivo: `fopen` y sus modos

```c
FILE *archivo = fopen("datos.txt", "w");
```

`fopen` recibe la ruta del archivo y un **modo**, y devuelve un `FILE *` o `NULL` si no pudo abrirlo.

| Modo | Significado | Si el archivo no existe | Si existe |
| --- | --- | --- | --- |
| `"r"` | leer | falla (`NULL`) | lee desde el principio |
| `"w"` | escribir | lo crea | **borra** su contenido |
| `"a"` | agregar al final | lo crea | escribe siempre al final |
| `"r+"` | leer y escribir | falla | conserva el contenido |
| `"w+"` | leer y escribir | lo crea | borra su contenido |
| `"a+"` | leer y agregar | lo crea | lee donde quieras, escribe al final |

Agregar una `b` al modo (`"rb"`, `"wb"`, `"ab"`, `"r+b"`) abre el archivo en modo **binario**: los bytes se leen y escriben exactamente como están. Sin la `b`, el archivo se abre en modo **texto**, y la biblioteca puede traducir los finales de línea: en Windows, `'\n'` se escribe como los dos bytes `\r\n` y se vuelve a convertir al leer. En Linux y macOS no hay diferencia, pero usa siempre `b` para datos binarios: tu programa será correcto en todas las plataformas.

> **Portabilidad:** desde C11 existe el sufijo `x` para los modos de escritura (`"wx"`, `"wbx"`): si el archivo ya existe, `fopen` falla en lugar de borrarlo. Es útil para no pisar datos por accidente.

## Comprobar la apertura e informar el error

`fopen` falla por muchos motivos: el archivo no existe, no tienes permiso, la carpeta no existe, el disco está lleno. No alcanza con llamar a `fopen`: **siempre** hay que comprobar si devolvió `NULL` antes de usar el puntero. Usar un `FILE *` nulo es comportamiento indefinido (casi siempre, un cierre abrupto).

Para decir **por qué** falló se usa `perror` (lección 34), que muestra la descripción de `errno`:

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    FILE *archivo = fopen("no-existe/datos.txt", "r");
    if (archivo == NULL) {
        perror("no-existe/datos.txt");  // por ejemplo: "no-existe/datos.txt: No such file or directory"
        return EXIT_FAILURE;
    }

    // ... usar el archivo ...

    fclose(archivo);
    return EXIT_SUCCESS;
}
```

Pasarle la ruta a `perror` es una buena costumbre: el mensaje dice qué archivo falló.

> **Portabilidad:** que `fopen` deje el motivo en `errno` lo garantiza POSIX (Linux, macOS) y lo hacen también Windows y la mayoría de los sistemas, pero el estándar ISO C no lo exige. En la práctica `perror` funciona; solo no supongas un código concreto de `errno`.

## Cerrar el archivo en todos los caminos

```c
fclose(archivo);
```

`fclose` devuelve `0` si todo salió bien y `EOF` si hubo un error. En un archivo de **escritura** ese valor importa: los últimos datos se escriben recién al vaciar el búfer, así que un disco lleno puede aparecer **al cerrar**. En un archivo de solo lectura no se pierde nada, y es habitual ignorarlo.

Cada `fopen` exitoso necesita exactamente un `fclose`, también en los caminos de error. Si una función abre un archivo y además reserva memoria, la salida única con `goto cleanup` de la lección 34 resuelve las dos cosas en un solo lugar. Después de `fclose`, el `FILE *` ya no es válido: no lo uses ni lo cierres otra vez.

## Escribir texto: `fprintf` y `fputs`

`fprintf` funciona como `printf`, pero recibe primero el archivo de destino. `fputs` escribe una cadena tal cual. Ambas informan los errores: `fprintf` devuelve un número negativo y `fputs` devuelve `EOF`.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    FILE *archivo = fopen("saludo.txt", "w");
    if (archivo == NULL) {
        perror("saludo.txt");
        return EXIT_FAILURE;
    }

    int ok = fprintf(archivo, "Hola Mundo!\n") >= 0
             && fputs("Segunda línea\n", archivo) != EOF;

    if (fclose(archivo) == EOF) {
        ok = 0;                     // los datos podrían no haber llegado al disco
    }
    if (!ok) {
        fprintf(stderr, "saludo.txt: error al escribir\n");
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}
```

## Leer texto y detectar el final

### Línea por línea con `fgets`

`fgets(linea, tamanio, archivo)` lee como máximo `tamanio - 1` caracteres, se detiene después del `'\n'` y siempre termina la cadena con `'\0'` (lección 21). Devuelve `NULL` cuando ya no pudo leer nada, ya sea porque llegó al final o por un error. El ciclo natural es:

```c
while (fgets(linea, sizeof linea, archivo) != NULL) {
    // procesar linea
}
```

### Fin de archivo frente a error: `feof` y `ferror`

Cuando una lectura falla, todavía no sabes **por qué**. Para eso cada flujo tiene dos indicadores:

- `feof(archivo)` es verdadero si una lectura **ya intentó** pasar el final del archivo.
- `ferror(archivo)` es verdadero si ocurrió un **error** de lectura o escritura (un disco que falla, un archivo de red que se desconecta).

El orden correcto es: **primero** leer, y **solo cuando la lectura falla**, preguntar cuál de los dos casos ocurrió. `feof` no predice el futuro: no se vuelve verdadero al leer la última línea, sino recién cuando una lectura posterior choca con el final. Este programa crea su propio archivo de prueba y después lo lee:

```c
#include <stdio.h>
#include <stdlib.h>

// Crea un archivo de texto de ejemplo. Devuelve true si pudo escribirlo completo.
bool crear_ejemplo(const char *ruta) {
    FILE *archivo = fopen(ruta, "w");
    if (archivo == NULL) {
        perror(ruta);
        return false;
    }
    bool ok = fputs("primera\nsegunda\ntercera\n", archivo) != EOF;
    if (fclose(archivo) == EOF) {
        ok = false;
    }
    return ok;
}

int main(void) {
    const char *ruta = "lineas.txt";
    if (!crear_ejemplo(ruta)) {
        return EXIT_FAILURE;
    }

    FILE *archivo = fopen(ruta, "r");
    if (archivo == NULL) {
        perror(ruta);
        return EXIT_FAILURE;
    }

    char linea[100];
    int numero = 0;
    while (fgets(linea, sizeof linea, archivo) != NULL) {
        numero++;
        printf("%d: %s", numero, linea);   // la línea ya trae su '\n'
    }

    int estado = EXIT_SUCCESS;
    if (ferror(archivo)) {                 // la lectura terminó por un error
        perror(ruta);
        estado = EXIT_FAILURE;
    } else if (feof(archivo)) {            // la lectura terminó por llegar al final
        printf("Fin del archivo: %d líneas\n", numero);
    }

    fclose(archivo);
    return estado;
}
```

Para leer carácter por carácter existe `fgetc(archivo)`, la versión de `getchar` para cualquier flujo: devuelve un `int` con el carácter o `EOF`, por el mismo motivo que viste en la lección 34. Su pareja de escritura es `fputc(c, archivo)`.

### Datos con formato: `fscanf`

`fscanf` es `scanf` para archivos, y se usa con la misma regla de la lección 6: **comparar lo que devuelve con la cantidad de valores esperados**. Devuelve cuántos valores asignó, o `EOF` si llegó al final (o hubo un error) antes de asignar el primero.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    const char *ruta = "notas.txt";

    // 1. Crear el archivo de datos para que el ejemplo funcione solo.
    FILE *salida = fopen(ruta, "w");
    if (salida == NULL) {
        perror(ruta);
        return EXIT_FAILURE;
    }
    fprintf(salida, "Ana 8\nLuis 6\nSofia 9\n");
    if (fclose(salida) == EOF) {
        perror(ruta);
        return EXIT_FAILURE;
    }

    // 2. Leer cada par nombre-nota y comprobar el resultado de fscanf.
    FILE *entrada = fopen(ruta, "r");
    if (entrada == NULL) {
        perror(ruta);
        return EXIT_FAILURE;
    }

    char nombre[32];
    int nota;
    int cantidad = 0;
    int suma = 0;
    while (fscanf(entrada, "%31s %d", nombre, &nota) == 2) {  // %31s: nunca más que la capacidad
        printf("%s: %d\n", nombre, nota);
        suma += nota;
        cantidad++;
    }

    int estado = EXIT_SUCCESS;
    if (ferror(entrada)) {
        perror(ruta);
        estado = EXIT_FAILURE;
    } else if (!feof(entrada)) {
        fprintf(stderr, "%s: formato inválido después de %d registros\n", ruta, cantidad);
        estado = EXIT_FAILURE;
    } else if (cantidad > 0) {
        printf("Promedio: %.2f\n", (double)suma / cantidad);
    }

    fclose(entrada);
    return estado;
}
```

Si el ciclo termina sin error y sin haber llegado al final, `fscanf` encontró algo que no coincide con el formato (por ejemplo una nota escrita con letras). Para archivos escritos por personas suele ser más robusto leer cada línea con `fgets` y convertirla con `strtol` (lección 34), así sabes exactamente en qué línea está el problema.

## Archivos binarios: `fwrite` y `fread`

Un archivo de texto guarda los números como caracteres: `3500` son cuatro bytes `'3' '5' '0' '0'`. Un archivo **binario** guarda la representación en memoria tal cual: un `int` ocupa `sizeof(int)` bytes, sea cual sea su valor. Es más compacto, no necesita conversiones y permite saltar directamente al registro número `i`, pero no se puede leer con un editor de texto.

```c
size_t fwrite(const void *datos, size_t tamanio, size_t cantidad, FILE *archivo);
size_t fread(void *destino, size_t tamanio, size_t cantidad, FILE *archivo);
```

- `datos` / `destino`: la dirección del primer elemento (un `void *`, lección 26, así que sirve para cualquier tipo).
- `tamanio`: el tamaño de **un** elemento, normalmente `sizeof arreglo[0]`.
- `cantidad`: cuántos elementos escribir o leer.
- Devuelven **cuántos elementos completos** transfirieron. Si es menor que `cantidad`, algo pasó: en `fwrite` es siempre un error; en `fread` puede ser el final del archivo o un error, y se distingue con `feof` y `ferror`.

La regla es la misma de siempre: **comparar el resultado con la cantidad pedida**.

```c
Producto productos[3] = { /* ... */ };

if (fwrite(productos, sizeof productos[0], 3, archivo) != 3) {
    // no se escribieron los 3 registros
}

Producto leidos[3];
size_t n = fread(leidos, sizeof leidos[0], 3, archivo);
if (n != 3) {
    // archivo más corto de lo esperado (feof) o error de lectura (ferror)
}
```

### Ejemplo de persistencia: guardar y cargar registros

Este programa guarda un inventario de productos en `productos.dat` y lo vuelve a cargar. El archivo empieza con una **cabecera**, la cantidad de registros, y después vienen los registros. Como la carga no sabe de antemano cuántos productos hay, reserva el arreglo con `malloc` y le transfiere la propiedad al llamador (lección 29).

```c
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int codigo;
    char nombre[24];
    double precio;
} Producto;

enum { MAX_PRODUCTOS = 10000 };  // límite para no confiar en un archivo dañado

// Guarda n productos en ruta: una cabecera uint32_t con la cantidad y luego los registros.
// Devuelve true si todo se escribió y el archivo se cerró sin errores.
bool guardar_productos(const char *ruta, const Producto *productos, size_t n) {
    if (n > MAX_PRODUCTOS) {
        return false;
    }
    FILE *archivo = fopen(ruta, "wb");
    if (archivo == NULL) {
        perror(ruta);
        return false;
    }

    uint32_t cantidad = (uint32_t)n;
    bool ok = fwrite(&cantidad, sizeof cantidad, 1, archivo) == 1
              && fwrite(productos, sizeof productos[0], n, archivo) == n;

    if (fclose(archivo) == EOF) {
        ok = false;
    }
    if (!ok) {
        fprintf(stderr, "%s: no se pudo guardar\n", ruta);
    }
    return ok;
}

// Carga los productos de ruta.
// Si devuelve true, *salida apunta a un arreglo nuevo de *cantidad elementos:
// el llamador es su dueño y debe liberarlo con free (puede ser NULL si no hay productos).
bool cargar_productos(const char *ruta, Producto **salida, size_t *cantidad) {
    bool ok = false;
    Producto *productos = NULL;
    uint32_t n = 0;

    FILE *archivo = fopen(ruta, "rb");
    if (archivo == NULL) {
        perror(ruta);
        return false;
    }

    if (fread(&n, sizeof n, 1, archivo) != 1 || n > MAX_PRODUCTOS) {
        goto limpiar;
    }
    if (n > 0) {
        productos = malloc(n * sizeof *productos);
        if (productos == NULL) {
            goto limpiar;
        }
        if (fread(productos, sizeof *productos, n, archivo) != n) {
            goto limpiar;
        }
    }

    *salida = productos;   // la propiedad pasa al llamador
    *cantidad = n;
    productos = NULL;      // para que la limpieza no lo libere
    ok = true;

limpiar:
    if (!ok) {
        fprintf(stderr, "%s: archivo incompleto, dañado o sin memoria\n", ruta);
    }
    free(productos);
    fclose(archivo);       // archivo de solo lectura: no hay datos pendientes
    return ok;
}

int main(void) {
    const char *ruta = "productos.dat";
    Producto iniciales[] = {
        {1, "Yerba", 3500.0},
        {2, "Azúcar", 1200.5},
        {3, "Café", 8900.0},
    };
    size_t n_iniciales = sizeof iniciales / sizeof iniciales[0];

    if (!guardar_productos(ruta, iniciales, n_iniciales)) {
        return EXIT_FAILURE;
    }

    Producto *cargados = NULL;
    size_t n = 0;
    if (!cargar_productos(ruta, &cargados, &n)) {
        return EXIT_FAILURE;
    }

    for (size_t i = 0; i < n; i++) {
        printf("%d  %-10s %10.2f\n", cargados[i].codigo, cargados[i].nombre, cargados[i].precio);
    }

    free(cargados);
    return EXIT_SUCCESS;
}
```

Observa cómo se combina todo lo del módulo:

- cada `fwrite` y `fread` compara su resultado con la cantidad pedida;
- `fclose` se revisa al **guardar**, porque ahí puede aparecer el error de escritura;
- en la carga hay dos recursos (el archivo y la memoria), así que se usa una sola salida con `goto cleanup` (aquí, la etiqueta `limpiar`);
- la cabecera usa `uint32_t` de `<stdint.h>` en lugar de `size_t`, cuyo tamaño cambia entre plataformas de 32 y 64 bits;
- el valor leído de la cabecera se **valida** antes de reservar memoria: un archivo dañado no debe poder pedir gigabytes.

### Portabilidad de los archivos binarios

Un archivo binario escrito con `fwrite` de una `struct` guarda los bytes **tal como están en la memoria de esa máquina**. Eso lo hace frágil fuera de ella:

- **Orden de bytes** (*endianness*): el entero `1` de 32 bits se guarda como `01 00 00 00` en una máquina *little endian* (x86, la mayoría de los ARM) y como `00 00 00 01` en una *big endian*. Otra máquina puede leer `16777216`.
- **Relleno** (lección 22): el compilador puede agregar bytes de relleno entre los campos. En una plataforma típica de 64 bits, `Producto` ocupa 40 bytes (4 + 24 + 4 de relleno + 8), pero otro compilador puede elegir otra disposición. Además, esos bytes de relleno tienen valores sin especificar y también van a parar al archivo.
- **Tamaño de los tipos**: `int`, `long` o `size_t` no miden lo mismo en todas las plataformas.

> **Portabilidad:** un archivo binario hecho con `fwrite` de estructuras solo es seguro para leerlo **con el mismo programa en el mismo tipo de máquina** (una caché, un archivo temporal, un guardado local). Para compartir datos entre sistemas tienes dos caminos: un formato de **texto** (líneas, CSV, JSON), o un formato binario definido byte por byte, escribiendo cada campo por separado con tipos de ancho fijo (`int32_t`, `uint16_t`) y un orden de bytes elegido.

## Moverse dentro del archivo: `fseek` y `ftell`

Cada flujo tiene una **posición actual**. Normalmente avanza sola con cada lectura o escritura, pero puedes moverla:

- `fseek(archivo, desplazamiento, origen)` mueve la posición. `origen` es `SEEK_SET` (desde el principio), `SEEK_CUR` (desde la posición actual) o `SEEK_END` (desde el final). Devuelve `0` si pudo.
- `ftell(archivo)` devuelve la posición actual como `long`, o `-1L` si falla.
- `rewind(archivo)` vuelve al principio.

En un archivo binario de registros del mismo tamaño, esto permite acceso directo: el registro `i` empieza en el byte `i * sizeof(Registro)`.

```c
// Leer directamente el tercer producto (índice 2) de un archivo sin cabecera
if (fseek(archivo, 2 * (long)sizeof(Producto), SEEK_SET) == 0
    && fread(&producto, sizeof producto, 1, archivo) == 1) {
    printf("%s\n", producto.nombre);
}

// Tamaño del archivo en bytes
if (fseek(archivo, 0, SEEK_END) == 0) {
    long bytes = ftell(archivo);
    rewind(archivo);
}
```

> **Portabilidad:** en archivos **de texto**, el valor de `ftell` no tiene por qué ser una cantidad de bytes (en Windows, la traducción de `\r\n` lo impide); solo sirve para volver a esa posición con `fseek`. Y el estándar no obliga a que `SEEK_END` funcione en archivos binarios, aunque en Linux, macOS y Windows funciona con archivos comunes.

## Errores comunes

### 1. No verificar si `fopen` devolvió `NULL`

Eso puede hacer que el programa intente usar un archivo que en realidad no se abrió, y termine abruptamente.

### 2. Olvidar `fclose`, sobre todo en los caminos de error

Cada archivo abierto ocupa un recurso del sistema, que tiene un límite. Y los datos que quedan en el búfer de un archivo de escritura que nunca se cierra pueden perderse.

### 3. Confundir los modos

No es lo mismo abrir con `"r"` que con `"w"`, y `"w"` **borra** el contenido anterior sin preguntar. Para agregar datos se usa `"a"`.

### 4. Usar `feof` como condición del ciclo

`while (!feof(archivo))` procesa una vez de más, porque `feof` solo se vuelve verdadero después de una lectura fallida. El ciclo correcto usa el resultado de la lectura: `while (fgets(...) != NULL)`, `while (fscanf(...) == 2)`, `while ((c = fgetc(archivo)) != EOF)`.

### 5. Ignorar lo que devuelven `fread`, `fwrite` y `fscanf`

Si leíste menos registros de los que pediste, los que faltan contienen basura. Compara siempre con la cantidad esperada.

### 6. Abrir un archivo binario sin `b`

Funciona en Linux y macOS, pero en Windows los bytes `\n` se transforman y el archivo queda dañado.

## Resumen

- un archivo permite guardar información de forma permanente
- en C se maneja con un `FILE *`, que devuelve `fopen` según un modo (`"r"`, `"w"`, `"a"`, con `+` y con `b` para binario)
- si `fopen` devuelve `NULL`, se informa con `perror` y no se usa el puntero
- `fclose` cierra el archivo en todos los caminos; al escribir, también se revisa su resultado
- `fprintf`, `fputs`, `fgets`, `fgetc` y `fscanf` operan sobre texto; cada lectura se usa como condición del ciclo
- cuando una lectura falla, `ferror` indica un error y `feof` indica el final
- `fwrite` y `fread` transfieren bloques binarios y devuelven cuántos elementos completaron
- los archivos binarios de estructuras no son portables entre máquinas (orden de bytes, relleno, tamaños)
- `fseek` y `ftell` mueven y consultan la posición dentro del archivo

## Idea final

Los archivos hacen que un programa deje de ser algo puramente momentáneo.

Gracias a ellos, los datos pueden sobrevivir a la ejecución y el software empieza a comportarse de una forma mucho más realista. A cambio, el programa pasa a depender del mundo exterior, que puede fallar en cualquier momento: por eso cada apertura, lectura, escritura y cierre se comprueba.

## Ejercicios prácticos

### Ejercicio 1: contar líneas y caracteres

Escribe un programa que cree `poema.txt` con tres o cuatro líneas y después lo lea con `fgetc` para contar cuántos caracteres y cuántas líneas tiene. Al terminar, informa si la lectura terminó por el final del archivo o por un error.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    const char *ruta = "poema.txt";

    FILE *salida = fopen(ruta, "w");
    if (salida == NULL) {
        perror(ruta);
        return EXIT_FAILURE;
    }
    fputs("Caminante, no hay camino,\nse hace camino al andar.\n", salida);
    if (fclose(salida) == EOF) {
        perror(ruta);
        return EXIT_FAILURE;
    }

    FILE *entrada = fopen(ruta, "r");
    if (entrada == NULL) {
        perror(ruta);
        return EXIT_FAILURE;
    }

    int c;                 // int, para poder recibir EOF
    long caracteres = 0;
    long lineas = 0;
    while ((c = fgetc(entrada)) != EOF) {
        caracteres++;
        if (c == '\n') {
            lineas++;
        }
    }

    int estado = EXIT_SUCCESS;
    if (ferror(entrada)) {
        perror(ruta);
        estado = EXIT_FAILURE;
    } else {
        printf("%ld caracteres, %ld líneas\n", caracteres, lineas);
    }
    fclose(entrada);
    return estado;
}
```

`caracteres` cuenta bytes: en UTF-8, cada letra con tilde ocupa dos.

</details>

### Ejercicio 2: guardar y promediar temperaturas

Escribe un programa que guarde las temperaturas de una semana (un arreglo de 7 `double`) en `temperaturas.txt`, una por línea, con `fprintf`. Después debe volver a abrir el archivo, leerlas con `fscanf` comprobando el resultado, y mostrar el promedio. Si alguna línea no es un número, debe informarlo.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    const char *ruta = "temperaturas.txt";
    double semana[7] = {21.5, 23.0, 19.8, 18.2, 22.4, 25.1, 24.0};

    FILE *salida = fopen(ruta, "w");
    if (salida == NULL) {
        perror(ruta);
        return EXIT_FAILURE;
    }
    int ok = 1;
    for (size_t i = 0; i < 7; i++) {
        if (fprintf(salida, "%.1f\n", semana[i]) < 0) {
            ok = 0;
        }
    }
    if (fclose(salida) == EOF || !ok) {
        fprintf(stderr, "%s: error al escribir\n", ruta);
        return EXIT_FAILURE;
    }

    FILE *entrada = fopen(ruta, "r");
    if (entrada == NULL) {
        perror(ruta);
        return EXIT_FAILURE;
    }
    double valor;
    double suma = 0.0;
    int cantidad = 0;
    while (fscanf(entrada, "%lf", &valor) == 1) {
        suma += valor;
        cantidad++;
    }

    int estado = EXIT_SUCCESS;
    if (ferror(entrada)) {
        perror(ruta);
        estado = EXIT_FAILURE;
    } else if (!feof(entrada)) {
        fprintf(stderr, "%s: dato inválido después de %d valores\n", ruta, cantidad);
        estado = EXIT_FAILURE;
    } else if (cantidad > 0) {
        printf("Promedio de %d días: %.2f\n", cantidad, suma / cantidad);
    }
    fclose(entrada);
    return estado;
}
```

</details>

### Ejercicio 3: encuentra los errores

Esta función debe mostrar un archivo línea por línea y devolver `false` si no puede. Tiene tres errores. ¿Cuáles son?

```c
bool mostrar(const char *ruta) {
    char linea[80];
    FILE *archivo = fopen(ruta, "r");
    while (!feof(archivo)) {
        fgets(linea, sizeof linea, archivo);
        printf("%s", linea);
    }
    return true;
}
```

<details><summary>Ver solución</summary>

1. No comprueba si `fopen` devolvió `NULL`: con un archivo inexistente, `feof(NULL)` es comportamiento indefinido.
2. Usa `feof` como condición del ciclo y no revisa el resultado de `fgets`. Después de la última línea, `feof` todavía es falso, `fgets` falla y `linea` conserva el contenido anterior: la última línea se muestra **dos veces** (y si el archivo está vacío, se muestra basura sin inicializar).
3. Nunca llama a `fclose`.

```c
bool mostrar(const char *ruta) {
    char linea[80];
    FILE *archivo = fopen(ruta, "r");
    if (archivo == NULL) {
        perror(ruta);
        return false;
    }
    while (fgets(linea, sizeof linea, archivo) != NULL) {
        printf("%s", linea);
    }
    bool ok = !ferror(archivo);
    fclose(archivo);
    return ok;
}
```

</details>

### Ejercicio 4: acceso directo en un archivo binario

Escribe un programa que guarde los enteros `10, 20, 30, 40, 50` en `numeros.dat` con un solo `fwrite`. Después, reabre el archivo en modo binario de lectura, usa `fseek` y `ftell` para calcular cuántos enteros contiene, y lee **solo** el tercero con `fseek` y `fread`.

<details><summary>Ver solución</summary>

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    const char *ruta = "numeros.dat";
    int numeros[] = {10, 20, 30, 40, 50};
    size_t n = sizeof numeros / sizeof numeros[0];

    FILE *archivo = fopen(ruta, "wb");
    if (archivo == NULL) {
        perror(ruta);
        return EXIT_FAILURE;
    }
    size_t escritos = fwrite(numeros, sizeof numeros[0], n, archivo);
    if (fclose(archivo) == EOF || escritos != n) {
        fprintf(stderr, "%s: error al escribir\n", ruta);
        return EXIT_FAILURE;
    }

    archivo = fopen(ruta, "rb");
    if (archivo == NULL) {
        perror(ruta);
        return EXIT_FAILURE;
    }

    int estado = EXIT_FAILURE;
    long bytes;            // declarados antes del primer goto
    int tercero;
    if (fseek(archivo, 0, SEEK_END) != 0) {
        goto limpiar;
    }
    bytes = ftell(archivo);
    if (bytes < 0) {
        goto limpiar;
    }
    printf("El archivo tiene %ld enteros\n", bytes / (long)sizeof(int));

    if (fseek(archivo, 2 * (long)sizeof(int), SEEK_SET) != 0
        || fread(&tercero, sizeof tercero, 1, archivo) != 1) {
        goto limpiar;
    }
    printf("El tercero es %d\n", tercero);
    estado = EXIT_SUCCESS;

limpiar:
    if (estado != EXIT_SUCCESS) {
        fprintf(stderr, "%s: error al leer\n", ruta);
    }
    fclose(archivo);
    return estado;
}
```

</details>

### Ejercicio 5: ¿texto o binario?

Para cada caso, elige formato de texto o binario de `fwrite` y justifica:

1. Una aplicación de escritorio guarda su configuración, que el usuario a veces edita a mano.
2. Un juego guarda una caché de 50 MB de datos ya procesados para arrancar más rápido en la misma computadora.
3. Un programa en una computadora con Linux envía registros de ventas a otro programa que corre en un servidor de otra arquitectura.

<details><summary>Ver solución</summary>

1. **Texto**: el usuario tiene que poder leerlo y modificarlo con un editor.
2. **Binario**: es grande, se lee y escribe en la misma máquina con el mismo programa, y la velocidad importa. Si la caché se daña o cambia de versión, se puede reconstruir.
3. **Texto** (o un binario definido campo por campo con tipos de ancho fijo y un orden de bytes acordado). Un `fwrite` de la `struct` tal cual depende del orden de bytes, del relleno y del tamaño de los tipos de cada máquina.

</details>
