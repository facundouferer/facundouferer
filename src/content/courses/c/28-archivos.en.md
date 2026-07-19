---
title: 'Files'
course: 'c'
slug: 'archivos'
order: 28
lang: 'en'
published: true
---

Hasta ahora trabajaste principalmente con datos en memoria. Pero cuando el programa termina, esa información desaparece.

Para conservar datos entre ejecuciones aparecen los **archivos**.

En esta lección vas a aprender:

- qué es un archivo
- qué es `FILE*`
- cómo abrir, leer, escribir y cerrar archivos
- modos de apertura comunes
- por qué siempre hay que verificar y cerrar correctamente

## ¿Qué es un archivo?

Un archivo es una forma de guardar información en disco para que siga existiendo después de que el programa termine.

Eso permite, por ejemplo:

- guardar resultados
- cargar datos previamente guardados
- mantener información persistente

## Tipo `FILE*`

En C, los archivos se manejan mediante el tipo `FILE*`.

Ese tipo representa un archivo abierto sobre el que el programa puede operar.

## Abrir un archivo

Se usa `fopen`.

```c
FILE* archivo = fopen("datos.txt", "w");
```

## Modos comunes

- `"r"` → abrir para leer
- `"w"` → abrir para escribir
- `"a"` → abrir para agregar al final

## Importante: verificar si se abrió correctamente

No alcanza con llamar a `fopen`. Hay que verificar si el resultado es distinto de `NULL`.

```c
if (archivo != NULL) {
    /* usar archivo */
}
```

## Escribir en un archivo

```c
fprintf(archivo, "Hola Mundo!\n");
```

## Leer desde un archivo

### Con `fscanf`

```c
fscanf(archivo, "%d", &numero);
```

### Con `fgets`

```c
fgets(linea, 100, archivo);
```

## Cerrar el archivo

```c
fclose(archivo);
```

Cerrar el archivo es fundamental.

¿Por qué? Porque ayuda a asegurar que los datos se guarden correctamente y libera el recurso que el programa estaba usando.

## Ejemplo completo de escritura

```c
#include <stdio.h>

int main() {
    FILE* archivo = fopen("saludo.txt", "w");

    if (archivo != NULL) {
        fprintf(archivo, "Hola Mundo!\n");
        fclose(archivo);
    }

    return 0;
}
```

## Ejemplo conceptual de lectura

```c
#include <stdio.h>

int main() {
    FILE* archivo = fopen("datos.txt", "r");
    int numero;

    if (archivo != NULL) {
        fscanf(archivo, "%d", &numero);
        printf("Leído: %d\n", numero);
        fclose(archivo);
    }

    return 0;
}
```

## Errores comunes al empezar

### 1. No verificar si `fopen` devolvió `NULL`

Eso puede hacer que el programa intente usar un archivo que en realidad no se abrió.

### 2. Olvidar `fclose`

Es una muy mala práctica dejar archivos abiertos.

### 3. Confundir leer con escribir

No es lo mismo abrir con `"r"` que con `"w"`.

## Resumen

- un archivo permite guardar información de forma permanente
- en C se maneja con `FILE*`
- `fopen` abre el archivo
- `fprintf`, `fscanf` y `fgets` permiten operar sobre él
- `fclose` cierra el archivo
- siempre conviene verificar si el archivo se abrió correctamente

## Idea final

Los archivos hacen que un programa deje de ser algo puramente momentáneo.

Gracias a ellos, los datos pueden sobrevivir a la ejecución y el software empieza a comportarse de una forma mucho más realista.
