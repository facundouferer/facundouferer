---
title: 'Files'
course: 'c'
slug: 'archivos'
order: 28
lang: 'en'
published: true
---

So far you've worked mainly with data in memory. But when the program ends, that information disappears.

To preserve data between executions, **files** come into play.

In this lesson you'll learn:

- what a file is
- what `FILE*` is
- how to open, read, write, and close files
- common opening modes
- why you should always check and close properly

## What is a file?

A file is a way to store information on disk so that it continues to exist after the program ends.

This allows, for example:

- saving results
- loading previously saved data
- maintaining persistent information

## The `FILE*` type

In C, files are handled through the `FILE*` type.

This type represents an open file that the program can operate on.

## Opening a file

`fopen` is used.

```c
FILE* archivo = fopen("datos.txt", "w");
```

## Common modes

- `"r"` → open for reading
- `"w"` → open for writing
- `"a"` → open for appending

## Important: check if it opened correctly

It's not enough to call `fopen`. You must check if the result is different from `NULL`.

```c
if (archivo != NULL) {
    /* use file */
}
```

## Writing to a file

```c
fprintf(archivo, "Hello World!\n");
```

## Reading from a file

### With `fscanf`

```c
fscanf(archivo, "%d", &numero);
```

### With `fgets`

```c
fgets(linea, 100, archivo);
```

## Closing the file

```c
fclose(archivo);
```

Closing the file is essential.

Why? Because it helps ensure the data is saved correctly and frees the resource the program was using.

## Complete writing example

```c
#include <stdio.h>

int main() {
    FILE* archivo = fopen("saludo.txt", "w");

    if (archivo != NULL) {
        fprintf(archivo, "Hello World!\n");
        fclose(archivo);
    }

    return 0;
}
```

## Conceptual reading example

```c
#include <stdio.h>

int main() {
    FILE* archivo = fopen("datos.txt", "r");
    int numero;

    if (archivo != NULL) {
        fscanf(archivo, "%d", &numero);
        printf("Read: %d\n", numero);
        fclose(archivo);
    }

    return 0;
}
```

## Common mistakes when starting

### 1. Not checking if `fopen` returned `NULL`

This can cause the program to try using a file that wasn't actually opened.

### 2. Forgetting `fclose`

Leaving files open is a very bad practice.

### 3. Confusing reading with writing

Opening with `"r"` is not the same as opening with `"w"`.

## Summary

- a file allows storing information permanently
- in C it's handled with `FILE*`
- `fopen` opens the file
- `fprintf`, `fscanf`, and `fgets` let you operate on it
- `fclose` closes the file
- always check if the file opened correctly

## Final thought

Files make a program stop being purely momentary.

Thanks to them, data can survive execution and software starts behaving in a much more realistic way.
