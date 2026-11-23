---
title: 'Files'
course: 'c'
slug: 'archivos'
description: 'Persist data in text and binary files with fopen, fprintf, fgets, fread and fwrite, distinguishing end-of-file from errors with feof/ferror and closing with fclose.'
order: 35
lang: 'en'
published: true
---

So far you've worked mainly with data in memory. But when the program ends, that information disappears.

To preserve data between executions, **files** come into play. In this lesson you learn to open, read and write them in both text and binary format, to check the result of **every** operation and to close everything you opened, also when something goes wrong.

## Objectives

- Open a file with `fopen`, choosing the right mode (read, write, append, text or binary).
- Check whether `fopen` returned `NULL` and report the reason with `perror`.
- Close every file with `fclose` on all paths, including error paths.
- Write and read text with `fprintf`, `fputs`, `fgets`, `fgetc` and `fscanf`, checking what each one returns.
- Tell end of file apart from a read error with `feof` and `ferror`.
- Save and load arrays of structs in a binary file with `fwrite` and `fread`, checking the returned count.
- Know the portability limits of binary files (byte order, padding, type sizes).
- Move inside a file with `fseek` and `ftell`.

**Prerequisites:** `cadenas-de-caracteres-y-operaciones` (21), `concepto-de-estructuras` (22), `memoria-dinamica` (28), `propiedad-y-errores-de-memoria` (29) and `biblioteca-estandar-y-errores` (34).

## What is a file?

A file is a way to store information on disk so that it keeps existing after the program ends.

This allows, for example:

- saving results
- loading previously saved data
- keeping persistent information

To the program, an open file is a **stream** of bytes: it is read or written from a current position that advances with each operation. The streams you already know, `stdin`, `stdout` and `stderr`, have the same type as an open file.

## The `FILE *` type

In C, files are handled through a pointer to `FILE`, a type declared in `<stdio.h>`.

`FILE` is a structure that holds everything the library needs to operate on the file: the current position, a buffer, the end-of-file and error indicators. You never access its fields; you only pass the `FILE *` to the `<stdio.h>` functions.

Also, writes do not go straight to disk: they pile up in a memory **buffer** and are flushed in blocks. That is why closing the file is essential: `fclose` flushes the buffer, hands over the pending data and releases the resource the program was using. If the program needs the data to arrive before closing, it can call `fflush(file)`.

## Opening a file: `fopen` and its modes

```c
FILE *file = fopen("data.txt", "w");
```

`fopen` takes the file path and a **mode**, and returns a `FILE *`, or `NULL` if it could not open it.

| Mode | Meaning | If the file does not exist | If it exists |
| --- | --- | --- | --- |
| `"r"` | read | fails (`NULL`) | reads from the start |
| `"w"` | write | creates it | **erases** its content |
| `"a"` | append at the end | creates it | always writes at the end |
| `"r+"` | read and write | fails | keeps the content |
| `"w+"` | read and write | creates it | erases its content |
| `"a+"` | read and append | creates it | reads anywhere, writes at the end |

Adding a `b` to the mode (`"rb"`, `"wb"`, `"ab"`, `"r+b"`) opens the file in **binary** mode: bytes are read and written exactly as they are. Without the `b`, the file is opened in **text** mode, and the library may translate line endings: on Windows, `'\n'` is written as the two bytes `\r\n` and converted back when reading. On Linux and macOS there is no difference, but always use `b` for binary data: your program will be correct on every platform.

> **Portability:** since C11 there is an `x` suffix for write modes (`"wx"`, `"wbx"`): if the file already exists, `fopen` fails instead of erasing it. It is useful to avoid overwriting data by accident.

## Checking the open and reporting the error

`fopen` fails for many reasons: the file does not exist, you lack permission, the folder does not exist, the disk is full. Calling `fopen` is not enough: you **always** have to check whether it returned `NULL` before using the pointer. Using a null `FILE *` is undefined behavior (almost always, a crash).

To say **why** it failed, use `perror` (lesson 34), which prints the description of `errno`:

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    FILE *file = fopen("missing/data.txt", "r");
    if (file == NULL) {
        perror("missing/data.txt");  // for example: "missing/data.txt: No such file or directory"
        return EXIT_FAILURE;
    }

    // ... use the file ...

    fclose(file);
    return EXIT_SUCCESS;
}
```

Passing the path to `perror` is a good habit: the message says which file failed.

> **Portability:** that `fopen` stores the reason in `errno` is guaranteed by POSIX (Linux, macOS) and also done by Windows and most systems, but ISO C does not require it. In practice `perror` works; just do not assume a specific `errno` code.

## Closing the file on every path

```c
fclose(file);
```

`fclose` returns `0` if everything went well and `EOF` on error. For a file you **wrote**, that value matters: the last data is only written when the buffer is flushed, so a full disk may show up **at close time**. For a read-only file nothing is lost, and ignoring it is common.

Every successful `fopen` needs exactly one `fclose`, also on error paths. If a function opens a file and also allocates memory, the single exit with `goto cleanup` from lesson 34 handles both in one place. After `fclose`, the `FILE *` is no longer valid: do not use it or close it again.

## Writing text: `fprintf` and `fputs`

`fprintf` works like `printf`, but first takes the destination file. `fputs` writes a string as is. Both report errors: `fprintf` returns a negative number and `fputs` returns `EOF`.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    FILE *file = fopen("greeting.txt", "w");
    if (file == NULL) {
        perror("greeting.txt");
        return EXIT_FAILURE;
    }

    int ok = fprintf(file, "Hello World!\n") >= 0
             && fputs("Second line\n", file) != EOF;

    if (fclose(file) == EOF) {
        ok = 0;                     // the data may not have reached the disk
    }
    if (!ok) {
        fprintf(stderr, "greeting.txt: write error\n");
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}
```

## Reading text and detecting the end

### Line by line with `fgets`

`fgets(line, size, file)` reads at most `size - 1` characters, stops after the `'\n'` and always terminates the string with `'\0'` (lesson 21). It returns `NULL` when it could not read anything, either because it reached the end or because of an error. The natural loop is:

```c
while (fgets(line, sizeof line, file) != NULL) {
    // process line
}
```

### End of file versus error: `feof` and `ferror`

When a read fails, you do not know **why** yet. For that, every stream has two indicators:

- `feof(file)` is true if a read **already tried** to go past the end of the file.
- `ferror(file)` is true if a read or write **error** happened (a failing disk, a network file that disconnects).

The correct order is: read **first**, and **only when the read fails**, ask which of the two cases happened. `feof` does not predict the future: it does not become true when the last line is read, but only when a later read hits the end. This program creates its own test file and then reads it:

```c
#include <stdio.h>
#include <stdlib.h>

// Creates a sample text file. Returns true if it could write it completely.
bool create_sample(const char *path) {
    FILE *file = fopen(path, "w");
    if (file == NULL) {
        perror(path);
        return false;
    }
    bool ok = fputs("first\nsecond\nthird\n", file) != EOF;
    if (fclose(file) == EOF) {
        ok = false;
    }
    return ok;
}

int main(void) {
    const char *path = "lines.txt";
    if (!create_sample(path)) {
        return EXIT_FAILURE;
    }

    FILE *file = fopen(path, "r");
    if (file == NULL) {
        perror(path);
        return EXIT_FAILURE;
    }

    char line[100];
    int number = 0;
    while (fgets(line, sizeof line, file) != NULL) {
        number++;
        printf("%d: %s", number, line);   // the line already has its '\n'
    }

    int status = EXIT_SUCCESS;
    if (ferror(file)) {                   // reading stopped because of an error
        perror(path);
        status = EXIT_FAILURE;
    } else if (feof(file)) {              // reading stopped at the end of the file
        printf("End of file: %d lines\n", number);
    }

    fclose(file);
    return status;
}
```

To read one character at a time there is `fgetc(file)`, the version of `getchar` for any stream: it returns an `int` holding the character or `EOF`, for the same reason you saw in lesson 34. Its writing partner is `fputc(c, file)`.

### Formatted data: `fscanf`

`fscanf` is `scanf` for files, and it follows the same rule as in lesson 6: **compare what it returns with the number of values expected**. It returns how many values it assigned, or `EOF` if it reached the end (or an error happened) before assigning the first one.

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    const char *path = "grades.txt";

    // 1. Create the data file so the example works on its own.
    FILE *out = fopen(path, "w");
    if (out == NULL) {
        perror(path);
        return EXIT_FAILURE;
    }
    fprintf(out, "Ann 8\nLuke 6\nSophie 9\n");
    if (fclose(out) == EOF) {
        perror(path);
        return EXIT_FAILURE;
    }

    // 2. Read each name-grade pair and check fscanf's result.
    FILE *in = fopen(path, "r");
    if (in == NULL) {
        perror(path);
        return EXIT_FAILURE;
    }

    char name[32];
    int grade;
    int count = 0;
    int sum = 0;
    while (fscanf(in, "%31s %d", name, &grade) == 2) {  // %31s: never more than the capacity
        printf("%s: %d\n", name, grade);
        sum += grade;
        count++;
    }

    int status = EXIT_SUCCESS;
    if (ferror(in)) {
        perror(path);
        status = EXIT_FAILURE;
    } else if (!feof(in)) {
        fprintf(stderr, "%s: invalid format after %d records\n", path, count);
        status = EXIT_FAILURE;
    } else if (count > 0) {
        printf("Average: %.2f\n", (double)sum / count);
    }

    fclose(in);
    return status;
}
```

If the loop ends without an error and without reaching the end, `fscanf` found something that does not match the format (for example a grade written in letters). For files written by people it is usually more robust to read each line with `fgets` and convert it with `strtol` (lesson 34), so you know exactly which line has the problem.

## Binary files: `fwrite` and `fread`

A text file stores numbers as characters: `3500` is four bytes `'3' '5' '0' '0'`. A **binary** file stores the in-memory representation as is: an `int` takes `sizeof(int)` bytes, whatever its value. It is more compact, needs no conversions and lets you jump straight to record number `i`, but it cannot be read with a text editor.

```c
size_t fwrite(const void *data, size_t size, size_t count, FILE *file);
size_t fread(void *dest, size_t size, size_t count, FILE *file);
```

- `data` / `dest`: the address of the first element (a `void *`, lesson 26, so it works for any type).
- `size`: the size of **one** element, usually `sizeof array[0]`.
- `count`: how many elements to write or read.
- They return **how many complete elements** they transferred. If it is less than `count`, something happened: for `fwrite` it is always an error; for `fread` it may be the end of the file or an error, told apart with `feof` and `ferror`.

The rule is the same as always: **compare the result with the count you asked for**.

```c
Product products[3] = { /* ... */ };

if (fwrite(products, sizeof products[0], 3, file) != 3) {
    // the 3 records were not written
}

Product loaded[3];
size_t n = fread(loaded, sizeof loaded[0], 3, file);
if (n != 3) {
    // file shorter than expected (feof) or read error (ferror)
}
```

### Persistence example: saving and loading records

This program saves an inventory of products to `products.dat` and loads it back. The file starts with a **header**, the number of records, followed by the records. Since loading does not know in advance how many products there are, it allocates the array with `malloc` and transfers ownership to the caller (lesson 29).

```c
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int code;
    char name[24];
    double price;
} Product;

enum { MAX_PRODUCTS = 10000 };  // limit so a damaged file is not trusted blindly

// Saves n products to path: a uint32_t header with the count, then the records.
// Returns true if everything was written and the file closed without errors.
bool save_products(const char *path, const Product *products, size_t n) {
    if (n > MAX_PRODUCTS) {
        return false;
    }
    FILE *file = fopen(path, "wb");
    if (file == NULL) {
        perror(path);
        return false;
    }

    uint32_t count = (uint32_t)n;
    bool ok = fwrite(&count, sizeof count, 1, file) == 1
              && fwrite(products, sizeof products[0], n, file) == n;

    if (fclose(file) == EOF) {
        ok = false;
    }
    if (!ok) {
        fprintf(stderr, "%s: could not save\n", path);
    }
    return ok;
}

// Loads the products from path.
// If it returns true, *out points to a new array of *count elements:
// the caller owns it and must release it with free (it may be NULL if there are no products).
bool load_products(const char *path, Product **out, size_t *count) {
    bool ok = false;
    Product *products = NULL;
    uint32_t n = 0;

    FILE *file = fopen(path, "rb");
    if (file == NULL) {
        perror(path);
        return false;
    }

    if (fread(&n, sizeof n, 1, file) != 1 || n > MAX_PRODUCTS) {
        goto cleanup;
    }
    if (n > 0) {
        products = malloc(n * sizeof *products);
        if (products == NULL) {
            goto cleanup;
        }
        if (fread(products, sizeof *products, n, file) != n) {
            goto cleanup;
        }
    }

    *out = products;       // ownership goes to the caller
    *count = n;
    products = NULL;       // so the cleanup does not free it
    ok = true;

cleanup:
    if (!ok) {
        fprintf(stderr, "%s: incomplete or damaged file, or out of memory\n", path);
    }
    free(products);
    fclose(file);          // read-only file: no pending data
    return ok;
}

int main(void) {
    const char *path = "products.dat";
    Product initial[] = {
        {1, "Tea", 3500.0},
        {2, "Sugar", 1200.5},
        {3, "Coffee", 8900.0},
    };
    size_t n_initial = sizeof initial / sizeof initial[0];

    if (!save_products(path, initial, n_initial)) {
        return EXIT_FAILURE;
    }

    Product *loaded = NULL;
    size_t n = 0;
    if (!load_products(path, &loaded, &n)) {
        return EXIT_FAILURE;
    }

    for (size_t i = 0; i < n; i++) {
        printf("%d  %-10s %10.2f\n", loaded[i].code, loaded[i].name, loaded[i].price);
    }

    free(loaded);
    return EXIT_SUCCESS;
}
```

Notice how everything from this module comes together:

- every `fwrite` and `fread` compares its result with the count it asked for;
- `fclose` is checked when **saving**, because that is where the write error may appear;
- loading has two resources (the file and the memory), so it uses a single exit with `goto cleanup`;
- the header uses `uint32_t` from `<stdint.h>` instead of `size_t`, whose size changes between 32-bit and 64-bit platforms;
- the value read from the header is **validated** before allocating memory: a damaged file must not be able to request gigabytes.

### Portability of binary files

A binary file written with `fwrite` of a `struct` stores the bytes **exactly as they are in that machine's memory**. That makes it fragile anywhere else:

- **Byte order** (*endianness*): the 32-bit integer `1` is stored as `01 00 00 00` on a *little endian* machine (x86, most ARM) and as `00 00 00 01` on a *big endian* one. Another machine may read `16777216`.
- **Padding** (lesson 22): the compiler may add padding bytes between fields. On a typical 64-bit platform, `Product` takes 40 bytes (4 + 24 + 4 of padding + 8), but another compiler may choose a different layout. Also, those padding bytes have unspecified values and end up in the file too.
- **Type sizes**: `int`, `long` or `size_t` do not have the same size on every platform.

> **Portability:** a binary file made with `fwrite` of structs is only safe to read **with the same program on the same kind of machine** (a cache, a temporary file, a local save). To share data between systems you have two paths: a **text** format (lines, CSV, JSON), or a binary format defined byte by byte, writing each field separately with fixed-width types (`int32_t`, `uint16_t`) and a chosen byte order.

## Moving inside the file: `fseek` and `ftell`

Every stream has a **current position**. It normally advances by itself with each read or write, but you can move it:

- `fseek(file, offset, origin)` moves the position. `origin` is `SEEK_SET` (from the start), `SEEK_CUR` (from the current position) or `SEEK_END` (from the end). It returns `0` on success.
- `ftell(file)` returns the current position as a `long`, or `-1L` on failure.
- `rewind(file)` goes back to the start.

In a binary file of same-size records, this allows direct access: record `i` starts at byte `i * sizeof(Record)`.

```c
// Read the third product (index 2) directly from a file without a header
if (fseek(file, 2 * (long)sizeof(Product), SEEK_SET) == 0
    && fread(&product, sizeof product, 1, file) == 1) {
    printf("%s\n", product.name);
}

// File size in bytes
if (fseek(file, 0, SEEK_END) == 0) {
    long bytes = ftell(file);
    rewind(file);
}
```

> **Portability:** in **text** files, the value of `ftell` need not be a byte count (on Windows, the `\r\n` translation prevents it); it is only good for returning to that position with `fseek`. And the standard does not require `SEEK_END` to work on binary files, although it works with regular files on Linux, macOS and Windows.

## Common mistakes

### 1. Not checking whether `fopen` returned `NULL`

The program may try to use a file that was never actually opened, and crash.

### 2. Forgetting `fclose`, especially on error paths

Each open file takes a system resource, and there is a limit. And data left in the buffer of a write file that is never closed may be lost.

### 3. Confusing the modes

Opening with `"r"` is not the same as opening with `"w"`, and `"w"` **erases** the previous content without asking. To add data, use `"a"`.

### 4. Using `feof` as the loop condition

`while (!feof(file))` runs one time too many, because `feof` only becomes true after a failed read. The correct loop uses the result of the read: `while (fgets(...) != NULL)`, `while (fscanf(...) == 2)`, `while ((c = fgetc(file)) != EOF)`.

### 5. Ignoring what `fread`, `fwrite` and `fscanf` return

If you read fewer records than you asked for, the missing ones hold garbage. Always compare with the expected count.

### 6. Opening a binary file without `b`

It works on Linux and macOS, but on Windows the `\n` bytes get transformed and the file is damaged.

## Summary

- a file lets you store information permanently
- in C it is handled through a `FILE *`, returned by `fopen` according to a mode (`"r"`, `"w"`, `"a"`, with `+`, and with `b` for binary)
- if `fopen` returns `NULL`, report it with `perror` and do not use the pointer
- `fclose` closes the file on every path; when writing, its result is checked too
- `fprintf`, `fputs`, `fgets`, `fgetc` and `fscanf` work on text; each read is used as the loop condition
- when a read fails, `ferror` signals an error and `feof` signals the end
- `fwrite` and `fread` transfer binary blocks and return how many elements they completed
- binary files of structs are not portable between machines (byte order, padding, sizes)
- `fseek` and `ftell` move and query the position inside the file

## Final thought

Files make a program stop being something purely momentary.

Thanks to them, data can survive beyond execution and software starts behaving in a much more realistic way. In exchange, the program now depends on the outside world, which can fail at any moment: that is why every open, read, write and close is checked.

## Practice exercises

### Exercise 1: count lines and characters

Write a program that creates `poem.txt` with three or four lines and then reads it with `fgetc` to count how many characters and how many lines it has. At the end, report whether reading stopped because of the end of the file or because of an error.

<details><summary>Show solution</summary>

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    const char *path = "poem.txt";

    FILE *out = fopen(path, "w");
    if (out == NULL) {
        perror(path);
        return EXIT_FAILURE;
    }
    fputs("Two roads diverged in a yellow wood,\nAnd sorry I could not travel both\n", out);
    if (fclose(out) == EOF) {
        perror(path);
        return EXIT_FAILURE;
    }

    FILE *in = fopen(path, "r");
    if (in == NULL) {
        perror(path);
        return EXIT_FAILURE;
    }

    int c;                 // int, so it can receive EOF
    long characters = 0;
    long lines = 0;
    while ((c = fgetc(in)) != EOF) {
        characters++;
        if (c == '\n') {
            lines++;
        }
    }

    int status = EXIT_SUCCESS;
    if (ferror(in)) {
        perror(path);
        status = EXIT_FAILURE;
    } else {
        printf("%ld characters, %ld lines\n", characters, lines);
    }
    fclose(in);
    return status;
}
```

`characters` counts bytes: in UTF-8, each accented letter takes two.

</details>

### Exercise 2: save and average temperatures

Write a program that saves the temperatures of a week (an array of 7 `double`) to `temperatures.txt`, one per line, with `fprintf`. Then it must reopen the file, read them with `fscanf` checking the result, and show the average. If a line is not a number, it must report it.

<details><summary>Show solution</summary>

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    const char *path = "temperatures.txt";
    double week[7] = {21.5, 23.0, 19.8, 18.2, 22.4, 25.1, 24.0};

    FILE *out = fopen(path, "w");
    if (out == NULL) {
        perror(path);
        return EXIT_FAILURE;
    }
    int ok = 1;
    for (size_t i = 0; i < 7; i++) {
        if (fprintf(out, "%.1f\n", week[i]) < 0) {
            ok = 0;
        }
    }
    if (fclose(out) == EOF || !ok) {
        fprintf(stderr, "%s: write error\n", path);
        return EXIT_FAILURE;
    }

    FILE *in = fopen(path, "r");
    if (in == NULL) {
        perror(path);
        return EXIT_FAILURE;
    }
    double value;
    double sum = 0.0;
    int count = 0;
    while (fscanf(in, "%lf", &value) == 1) {
        sum += value;
        count++;
    }

    int status = EXIT_SUCCESS;
    if (ferror(in)) {
        perror(path);
        status = EXIT_FAILURE;
    } else if (!feof(in)) {
        fprintf(stderr, "%s: invalid value after %d values\n", path, count);
        status = EXIT_FAILURE;
    } else if (count > 0) {
        printf("Average of %d days: %.2f\n", count, sum / count);
    }
    fclose(in);
    return status;
}
```

</details>

### Exercise 3: find the errors

This function should print a file line by line and return `false` if it cannot. It has three errors. What are they?

```c
bool show(const char *path) {
    char line[80];
    FILE *file = fopen(path, "r");
    while (!feof(file)) {
        fgets(line, sizeof line, file);
        printf("%s", line);
    }
    return true;
}
```

<details><summary>Show solution</summary>

1. It does not check whether `fopen` returned `NULL`: with a missing file, `feof(NULL)` is undefined behavior.
2. It uses `feof` as the loop condition and does not check the result of `fgets`. After the last line, `feof` is still false, `fgets` fails and `line` keeps its previous content: the last line is printed **twice** (and if the file is empty, uninitialized garbage is printed).
3. It never calls `fclose`.

```c
bool show(const char *path) {
    char line[80];
    FILE *file = fopen(path, "r");
    if (file == NULL) {
        perror(path);
        return false;
    }
    while (fgets(line, sizeof line, file) != NULL) {
        printf("%s", line);
    }
    bool ok = !ferror(file);
    fclose(file);
    return ok;
}
```

</details>

### Exercise 4: direct access in a binary file

Write a program that saves the integers `10, 20, 30, 40, 50` to `numbers.dat` with a single `fwrite`. Then reopen the file in binary read mode, use `fseek` and `ftell` to compute how many integers it holds, and read **only** the third one with `fseek` and `fread`.

<details><summary>Show solution</summary>

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    const char *path = "numbers.dat";
    int numbers[] = {10, 20, 30, 40, 50};
    size_t n = sizeof numbers / sizeof numbers[0];

    FILE *file = fopen(path, "wb");
    if (file == NULL) {
        perror(path);
        return EXIT_FAILURE;
    }
    size_t written = fwrite(numbers, sizeof numbers[0], n, file);
    if (fclose(file) == EOF || written != n) {
        fprintf(stderr, "%s: write error\n", path);
        return EXIT_FAILURE;
    }

    file = fopen(path, "rb");
    if (file == NULL) {
        perror(path);
        return EXIT_FAILURE;
    }

    int status = EXIT_FAILURE;
    long bytes;            // declared before the first goto
    int third;
    if (fseek(file, 0, SEEK_END) != 0) {
        goto cleanup;
    }
    bytes = ftell(file);
    if (bytes < 0) {
        goto cleanup;
    }
    printf("The file holds %ld integers\n", bytes / (long)sizeof(int));

    if (fseek(file, 2 * (long)sizeof(int), SEEK_SET) != 0
        || fread(&third, sizeof third, 1, file) != 1) {
        goto cleanup;
    }
    printf("The third one is %d\n", third);
    status = EXIT_SUCCESS;

cleanup:
    if (status != EXIT_SUCCESS) {
        fprintf(stderr, "%s: read error\n", path);
    }
    fclose(file);
    return status;
}
```

</details>

### Exercise 5: text or binary?

For each case, choose a text format or a binary `fwrite` format and justify it:

1. A desktop application saves its settings, which the user sometimes edits by hand.
2. A game saves a 50 MB cache of preprocessed data to start faster on the same computer.
3. A program on a Linux computer sends sales records to another program running on a server with a different architecture.

<details><summary>Show solution</summary>

1. **Text**: the user must be able to read it and change it with an editor.
2. **Binary**: it is large, it is read and written on the same machine by the same program, and speed matters. If the cache gets damaged or changes version, it can be rebuilt.
3. **Text** (or a binary format defined field by field with fixed-width types and an agreed byte order). An `fwrite` of the `struct` as is depends on each machine's byte order, padding and type sizes.

</details>
