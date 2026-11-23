---
title: 'The standard library and error handling'
course: 'c'
slug: 'biblioteca-estandar-y-errores'
description: 'Explore the C standard library, classify characters with <ctype.h>, convert text to numbers with strtol and strtod, and report errors with return codes and errno.'
order: 34
lang: 'en'
published: true
---

C is a small language: almost everything useful a real program does (reading text, converting numbers, sorting, measuring time, reporting errors) comes from its **standard library**. In this lesson you walk through the map of that library, learn to classify characters, to read and write one character at a time, to convert text into numbers without accepting garbage and, above all, to **handle errors** in an orderly way: detect every failure, report it and release what you already acquired.

## Objectives

- Know what each main header of the standard library offers and when to include it.
- Classify and convert characters with `<ctype.h>` without falling into undefined behavior.
- Read and write one character at a time with `getchar` and `putchar`, and understand why `EOF` requires an `int`.
- Convert text into numbers with `strtol` and `strtod`, rejecting empty input, trailing garbage and out-of-range values, instead of using `atoi`.
- Choose an error handling style: return code, `bool` with an output parameter, `errno` with `perror` and `strerror`.
- End the program with `EXIT_SUCCESS` or `EXIT_FAILURE` and clean up resources on every error path, including the `goto cleanup` idiom.
- Sort and search with `qsort` and `bsearch` using comparison functions.

**Prerequisites:** `entrada-y-salida` (lesson 6), `cadenas-de-caracteres-y-operaciones` (21), `concepto-de-estructuras` (22), `punteros-arreglos-y-estructuras` (26, function pointers and `qsort`) and `memoria-dinamica` (28).

## The map of the standard library

The library is divided into **headers**. Each one declares a group of functions, types and macros; you include only the ones you use. These are the ones you will need most often:

| Header | What it is for | Examples |
| --- | --- | --- |
| `<stdio.h>` | Input and output: console and files | `printf`, `scanf`, `fgets`, `getchar`, `putchar`, `perror`, `fopen` |
| `<stdlib.h>` | General utilities: memory, conversions, sorting, ending the program | `malloc`, `free`, `strtol`, `strtod`, `qsort`, `bsearch`, `exit`, `EXIT_SUCCESS` |
| `<string.h>` | Strings and memory blocks | `strlen`, `strcmp`, `strncpy`, `memcpy`, `memset`, `strerror` |
| `<ctype.h>` | Classifying and converting characters | `isdigit`, `isalpha`, `isspace`, `toupper`, `tolower` |
| `<math.h>` | Mathematical functions | `sqrt`, `pow`, `fabs`, `floor` |
| `<limits.h>` | Limits of the integer types | `INT_MAX`, `INT_MIN`, `LONG_MAX`, `CHAR_BIT` |
| `<stdint.h>` | Exact-width integers | `int32_t`, `uint8_t`, `int64_t`, `SIZE_MAX` |
| `<stdbool.h>` | The `bool` type (before C23) | `bool`, `true`, `false` |
| `<errno.h>` | The `errno` error indicator and its codes | `errno`, `ERANGE`, `EDOM` |
| `<assert.h>` | Checking assumptions during development | `assert` |
| `<time.h>` | Date, time and processor time | `time`, `clock`, `CLOCKS_PER_SEC` |

A few details worth knowing from the start:

- `<math.h>` declares the functions, but on Linux their code lives in a separate library, `libm`, that you must **link** with `-lm` (remember the link stage from lesson 3):

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic root.c -o root -lm
```

> **Portability:** with glibc (Linux), forgetting `-lm` produces a link error such as `undefined reference to 'sqrt'`. On macOS and with MSVC the math library is already included and `-lm` is not needed, although it does no harm. Always put it in your build command if you use `<math.h>`.

- `<stdint.h>` is the tool for when size matters (binary files, protocols, hardware): `int32_t` is exactly 32 bits on every platform that offers it, while `int` only guarantees at least 16.

> **Modern C (C23):** `bool`, `true` and `false` are **keywords** of the language, so you do not need to include `<stdbool.h>`; the header is kept only for compatibility. The same goes for `static_assert`, which no longer requires `<assert.h>`. C23 also added `strdup` and `strndup` to `<string.h>` (they used to be POSIX) and the `<stdckdint.h>` header, with arithmetic operations that detect overflow.

> **Basic C:** with a compiler in C17 mode (`-std=c17`) you must write `#include <stdbool.h>` to use `bool`. If your code must compile under both standards, including it does no harm.

- `assert(condition)` stops the program with a message if the condition is false. It is meant for **programming errors** (something that should never happen), not for user or environment errors: if you compile with `-DNDEBUG`, every `assert` disappears.

```c
#include <assert.h>
#include <stdio.h>
#include <time.h>

int main(void) {
    time_t now = time(NULL);
    clock_t start = clock();

    long sum = 0;
    for (long i = 0; i < 1000000; i++) {
        sum += i % 7;
    }

    clock_t end = clock();
    assert(end >= start);  // an assumption, not input validation

    printf("Seconds since 1970: %lld\n", (long long)now);
    printf("Sum: %ld\n", sum);
    printf("CPU time: %.3f s\n", (double)(end - start) / CLOCKS_PER_SEC);
    return 0;
}
```

## Classifying and converting characters with `<ctype.h>`

`<ctype.h>` answers questions about a character: is it a letter? a digit? a space? And it converts between uppercase and lowercase.

| Function | Returns nonzero if the character is... |
| --- | --- |
| `isalpha(c)` | a letter |
| `isdigit(c)` | a decimal digit `0`-`9` |
| `isalnum(c)` | a letter or a digit |
| `isspace(c)` | space, tab, newline or another blank |
| `isupper(c)` / `islower(c)` | uppercase / lowercase |
| `ispunct(c)` | a punctuation character |

`toupper(c)` and `tolower(c)` return the converted character, or the same one if it has no uppercase or lowercase version. All of them take and return `int`.

There is an important trap: these functions only accept a value representable as `unsigned char`, or `EOF`. On many platforms `char` is signed, and text bytes that are not ASCII (for example the bytes of `ñ` or `é` in UTF-8) become **negative**. Passing a negative `char` to `isalpha` is **undefined behavior**. The rule is to convert to `unsigned char` first:

```c
#include <ctype.h>
#include <stdio.h>

int main(void) {
    const char text[] = "Hello, World 2026!";
    int letters = 0;
    int digits = 0;
    int blanks = 0;
    int others = 0;

    for (size_t i = 0; text[i] != '\0'; i++) {
        unsigned char c = (unsigned char)text[i];  // always before <ctype.h>
        if (isalpha(c)) {
            letters++;
        } else if (isdigit(c)) {
            digits++;
        } else if (isspace(c)) {
            blanks++;
        } else {
            others++;
        }
    }

    printf("Letters: %d, digits: %d, blanks: %d, others: %d\n",
           letters, digits, blanks, others);
    return 0;
}
```

> **Portability:** the result of `<ctype.h>` depends on the **locale**. With the `"C"` locale, which every program has when it starts, only ASCII letters count as letters: `ñ` is not `isalpha`. Real UTF-8 text needs other tools (`<wctype.h>` or external libraries).

## Character input and output

In lesson 6 you used `getchar` as a recipe to discard invalid input. Now you study it properly, together with its partner `putchar`:

- `int getchar(void)` reads the next character from standard input and returns it as an `unsigned char` value converted to `int`. When there is no more data (or an error happened), it returns **`EOF`**.
- `int putchar(int c)` writes one character to standard output.

`EOF` is a `<stdio.h>` macro with a **negative** value (almost always `-1`). That is why **the result of `getchar` is stored in an `int`, never in a `char`**: `getchar` can return 257 different values (the 256 possible bytes plus `EOF`), and a `char` only has room for 256.

- If `char` is signed, the byte `0xFF` is mistaken for `EOF` and the program stops too early.
- If `char` is unsigned, `EOF` becomes 255, the comparison with `EOF` is never true and the loop never ends.

This program is a **filter**: it copies its input to its output turning letters into uppercase, until it finds `EOF`:

```c
#include <ctype.h>
#include <stdio.h>

int main(void) {
    int c;  // int, not char: it must be able to hold EOF

    while ((c = getchar()) != EOF) {
        putchar(toupper(c));  // c is already an unsigned char value or EOF: no cast needed
    }
    return 0;
}
```

To try it, type some text and mark the end of input with `Ctrl+D` (Linux and macOS) or `Ctrl+Z` and Enter (Windows). You can also redirect a file: `./uppercase < notes.txt`.

## Converting text into numbers: from `atoi` to `strtol`

`atoi` (from `<stdlib.h>`) looks convenient, but it is not fit for real data:

- `atoi("abc")` returns `0`, just like `atoi("0")`: you cannot tell an error from a zero.
- `atoi("12abc")` returns `12` and silently drops the garbage.
- If the number does not fit in an `int`, the behavior is undefined.

The robust alternative is `strtol` ("*string to long*"):

```c
long strtol(const char *text, char **end, int base);
```

- `text` is the string to convert. Leading spaces are skipped and a sign is accepted.
- `end` is an **output parameter**: `strtol` stores in `*end` the address of the first character it did **not** use. If `*end == text`, there was no number.
- `base` is the numeric base: `10` for decimal, `16` for hexadecimal, `2` for binary. With `0` the base is deduced from the prefix (`0x1F` is hexadecimal, `017` is octal).
- If the value does not fit in a `long`, it returns `LONG_MAX` or `LONG_MIN` and sets `errno` to `ERANGE`.

With those three signals (end pointer, the rest of the string and `errno`) you can build a conversion that rejects anything doubtful:

```c
#include <ctype.h>
#include <errno.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

// Converts the whole text to int.
// Returns true and stores the value in *result if the text is a valid integer;
// returns false (leaving *result untouched) if it is empty, has garbage or does not fit in an int.
bool read_int(const char *text, int *result) {
    char *end;
    errno = 0;                          // strtol only changes it on error
    long value = strtol(text, &end, 10);

    if (end == text) {
        return false;                   // there was no digit at all
    }
    while (isspace((unsigned char)*end)) {
        end++;                          // trailing blanks, such as '\n', are tolerated
    }
    if (*end != '\0') {
        return false;                   // trailing garbage: "12abc"
    }
    if (errno == ERANGE || value < INT_MIN || value > INT_MAX) {
        return false;                   // does not fit in a long, or not in an int
    }
    *result = (int)value;
    return true;
}

int main(void) {
    const char *tests[] = {"42", "  -17 ", "12abc", "", "abc", "99999999999999999999"};
    size_t n = sizeof tests / sizeof tests[0];

    for (size_t i = 0; i < n; i++) {
        int value;
        if (read_int(tests[i], &value)) {
            printf("\"%s\" -> %d\n", tests[i], value);
        } else {
            printf("\"%s\" -> not a valid integer\n", tests[i]);
        }
    }
    return 0;
}
```

The output is:

```text
"42" -> 42
"  -17 " -> -17
"12abc" -> not a valid integer
"" -> not a valid integer
"abc" -> not a valid integer
"99999999999999999999" -> not a valid integer
```

Combined with `fgets` (lesson 21), `read_int` replaces `scanf("%d", ...)` when you need to validate **the whole line**: you read the line with `fgets` and convert it with `strtol`.

For numbers with decimals there is `strtod` ("*string to double*"), with the same idea but no base:

```c
char *end;
errno = 0;
double x = strtod("3.75kg", &end);
// x is 3.75 and end points to "kg": there is trailing garbage
```

If the value is too large, `strtod` returns `HUGE_VAL` (from `<math.h>`) and sets `errno` to `ERANGE`. There are also `strtoul` and `strtoll` for `unsigned long` and `long long`.

## Error handling in C

C has no exceptions. When a function can fail, it has to **tell the caller** through some channel, and the caller has to **check** it. You have already seen several in the library: `scanf` returns how many values it read, `malloc` returns `NULL`, `getchar` returns `EOF`. There are four common styles.

### 1. Return code

The function returns a number that says how it ended: a **return code**. A frequent convention is `0` for success and a different value (often negative) for each error. With an `enum` (lesson 22) the codes have names and the compiler can warn you if a `switch` forgets one:

```c
typedef enum {
    CONVERSION_OK,
    CONVERSION_NO_DIGITS,
    CONVERSION_GARBAGE,
    CONVERSION_OUT_OF_RANGE
} ConversionStatus;

ConversionStatus convert_int(const char *text, int *result);
```

The advantage over a plain `bool` is that the caller knows **what** failed and can show a precise message.

### 2. `bool` and an output parameter

When all that matters is whether it worked, the function returns `bool` and delivers the result through an **output parameter**: a pointer, passed by value, to the caller's variable (lesson 25). That is what `read_int` does. The rule worth documenting: if it returns `false`, the output parameter is not modified.

### 3. A special value

Some functions return a value that cannot be a valid result: `NULL` from `malloc` or `strchr`, `EOF` from `getchar`, `-1` as a search index. It is convenient, but it only works if such an impossible value exists.

### 4. `errno`, `perror` and `strerror`

`errno` (from `<errno.h>`) is a global indicator where some library functions store a **code** describing the last error, such as `ERANGE` (result out of range) or `EDOM` (argument outside the domain, for example `sqrt(-1.0)` on many implementations). The rules for using it well:

- Set it to `0` **before** the call: no library function ever resets it to `0` by itself.
- Check it **only** if the function reported a failure (or, as with `strtol`, when the documentation says it is the way to detect the error). A successful call may leave any value in `errno`.
- Read it right away: the next library call may change it.

There are two functions to show the error:

- `perror("context")` (from `<stdio.h>`) writes to the error output `stderr` the text you pass, a colon and the description of the current value of `errno`.
- `strerror(code)` (from `<string.h>`) returns the description as a string, so you can build your own message.

```c
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char *end;
    errno = 0;
    long value = strtol("99999999999999999999", &end, 10);

    if (errno == ERANGE) {
        int code = errno;   // saved before calling other functions
        perror("strtol");   // for example: "strtol: Result too large"
        fprintf(stderr, "Value clamped to %ld (%s)\n", value, strerror(code));
        return EXIT_FAILURE;
    }

    printf("Value: %ld\n", value);
    return EXIT_SUCCESS;
}
```

Error messages go to `stderr`, not to `stdout`: that way they do not mix with the data when you redirect the output to a file (`./program > result.txt` still shows the errors on screen).

> **Portability:** the text of `perror` and `strerror` depends on the system and its configured language; never compare those strings in your program. Also, ISO C only requires a few functions to use `errno` (conversions such as `strtol` and the math functions); that `fopen` or `fclose` update it is guaranteed by POSIX (Linux, macOS), not by the standard.

### The program's exit status: `EXIT_SUCCESS` and `EXIT_FAILURE`

The value `main` returns is the program's **exit status**, the return code received by the operating system or the script that ran it. `<stdlib.h>` defines two portable names:

- `EXIT_SUCCESS` (same as `return 0;`): it ended well.
- `EXIT_FAILURE`: something failed.

In the terminal you can check it right after running the program with `echo $?` (Linux and macOS). The function `exit(code)` ends the program from any function with that same status, after flushing and closing the `<stdio.h>` streams; even so, in reusable functions it is better to return an error and let the caller decide.

## Cleaning up on every error path

Errors rarely come alone: a function allocates memory, then allocates more, then does its work, and **any of those steps** can fail. If a step fails, everything the previous steps already acquired must be released. With several resources, repeating the cleanup inside every `if` produces long code that is easy to break:

```c
// Fragile: each exit repeats a different cleanup
int *data = malloc(n * sizeof *data);
if (data == NULL) {
    return -1;
}
char *text = malloc(n + 1);
if (text == NULL) {
    free(data);     // add a third resource tomorrow and every if must change
    return -1;
}
```

The most common C idiom for this is the **single exit with `goto cleanup`**: every resource variable starts as `NULL` at the top, each error jumps to a label at the end of the function, and there everything is released in reverse order. It works because `free(NULL)` does nothing.

```c
#include <stdio.h>
#include <stdlib.h>

// Builds a text and an array of n elements and prints them.
// Return code: 0 if everything went well, -1 if an allocation failed.
int process(size_t n) {
    int status = -1;     // assume failure until we reach the end
    int *data = NULL;
    char *text = NULL;

    if (n == 0) {
        goto cleanup;
    }
    data = malloc(n * sizeof *data);
    if (data == NULL) {
        goto cleanup;
    }
    text = malloc(n + 1);
    if (text == NULL) {
        goto cleanup;
    }

    for (size_t i = 0; i < n; i++) {
        data[i] = (int)(i * i);
        text[i] = (char)('a' + i % 26);
    }
    text[n] = '\0';
    printf("%s, last item: %d\n", text, data[n - 1]);
    status = 0;          // only here do we know everything worked

cleanup:
    free(text);          // reverse order of acquisition; free(NULL) is safe
    free(data);
    return status;
}

int main(void) {
    if (process(5) != 0) {
        fprintf(stderr, "Could not process\n");
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}
```

`goto label;` jumps to the line marked `label:` inside the **same function**. Used without discipline it makes code impossible to follow, which is why this idiom sticks to clear rules:

- it only jumps **forward**, and only to the cleanup label;
- the cleanup is unique and sits at the end;
- every resource is declared at the top and starts as `NULL` (so the jump never skips an initialization).

If a function has one or two resources, nested `if` statements or a helper function are usually just as clear; use `goto cleanup` when the number of resources justifies it. In the next lesson you will use the same pattern with files, which also have to be closed on every path.

## Sorting and searching: `qsort` and `bsearch`

In lesson 26 you used `qsort` to sort integers by passing it a **comparison function** through a pointer. Its partner is `bsearch`, which performs a **binary search** (lesson 23) on an **already sorted** array with the same comparison function:

```c
void *bsearch(const void *key, const void *base, size_t count,
              size_t size, int (*compare)(const void *, const void *));
```

It returns a pointer to the element found, or `NULL` if it is not there. The key is a pointer to an object of the same type as the elements (or to something the comparison function knows how to compare with them).

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int code;
    char name[20];
} Product;

// Orders by ascending code. Returns negative, zero or positive.
int compare_code(const void *a, const void *b) {
    const Product *x = a;
    const Product *y = b;
    return (x->code > y->code) - (x->code < y->code);
}

int main(void) {
    Product products[] = {
        {30, "Tea"},
        {10, "Sugar"},
        {20, "Coffee"},
        {40, "Flour"},
    };
    size_t n = sizeof products / sizeof products[0];

    qsort(products, n, sizeof products[0], compare_code);

    Product key = {20, ""};
    Product *found = bsearch(&key, products, n, sizeof products[0], compare_code);
    if (found != NULL) {
        printf("Code %d: %s\n", found->code, found->name);
    } else {
        printf("Code %d: not found\n", key.code);
    }
    return 0;
}
```

Two details of the comparison function:

- `(x > y) - (x < y)` gives `-1`, `0` or `1`. The short form `x->code - y->code` can **overflow** with large values of opposite sign, and signed integer overflow is undefined behavior (lesson 7).
- `bsearch` only works if the array is sorted **with the same criterion** the search's comparison function uses. Sorting by name and searching by code gives meaningless results.

## Summary

- The standard library is organized in headers: `<stdio.h>` for I/O, `<stdlib.h>` for memory, conversions and `qsort`, `<string.h>`, `<ctype.h>`, `<math.h>` (linking with `-lm`), `<limits.h>`, `<stdint.h>`, `<errno.h>`, `<assert.h>` and `<time.h>`. In C23 `bool` is a keyword and `<stdbool.h>` is no longer needed.
- Before passing a `char` to `<ctype.h>`, convert it to `unsigned char`.
- `getchar` returns `int` because besides any byte it can return `EOF`.
- Use `strtol` and `strtod` instead of `atoi`: check the end pointer, trailing garbage and `errno == ERANGE`.
- A function that can fail says so with a return code, a `bool` with an output parameter, a special value or `errno`; the caller always checks it.
- `perror` and `strerror` describe the value of `errno`; error messages go to `stderr`.
- `main` returns `EXIT_SUCCESS` or `EXIT_FAILURE`.
- Every error path releases what was already acquired; with several resources, the single exit with `goto cleanup` does it in one place.
- `qsort` sorts and `bsearch` searches a sorted array, both with the same comparison function.

## Practice exercises

### Exercise 1: count vowels and consonants

Write a program that reads standard input with `getchar` until `EOF` and counts how many vowels and how many consonants (letters that are not vowels) it contains, ignoring case. Use `<ctype.h>`.

<details><summary>Show solution</summary>

```c
#include <ctype.h>
#include <stdio.h>

int main(void) {
    int c;
    int vowels = 0;
    int consonants = 0;

    while ((c = getchar()) != EOF) {
        if (!isalpha(c)) {
            continue;
        }
        int lower = tolower(c);
        if (lower == 'a' || lower == 'e' || lower == 'i' ||
            lower == 'o' || lower == 'u') {
            vowels++;
        } else {
            consonants++;
        }
    }

    printf("Vowels: %d\nConsonants: %d\n", vowels, consonants);
    return 0;
}
```

`c` is an `int` so it can receive `EOF`, and since it comes from `getchar` it is already a valid value for `<ctype.h>` without a cast.

</details>

### Exercise 2: `read_double` with `strtod`

Write `bool read_double(const char *text, double *result)`, with the same rules as `read_int`: it rejects empty text, trailing garbage and overflow. Test it with `"3.5"`, `" -0.25\n"`, `"2,5"` and `"1e999"`.

<details><summary>Show solution</summary>

```c
#include <ctype.h>
#include <errno.h>
#include <stdio.h>
#include <stdlib.h>

bool read_double(const char *text, double *result) {
    char *end;
    errno = 0;
    double value = strtod(text, &end);

    if (end == text) {
        return false;
    }
    while (isspace((unsigned char)*end)) {
        end++;
    }
    if (*end != '\0' || errno == ERANGE) {
        return false;
    }
    *result = value;
    return true;
}

int main(void) {
    const char *tests[] = {"3.5", " -0.25\n", "2,5", "1e999"};
    size_t n = sizeof tests / sizeof tests[0];

    for (size_t i = 0; i < n; i++) {
        double value;
        if (read_double(tests[i], &value)) {
            printf("Test %zu: %g\n", i + 1, value);
        } else {
            printf("Test %zu: invalid\n", i + 1);
        }
    }
    return 0;
}
```

`"2,5"` is invalid because, in the `"C"` locale, the decimal separator is the dot: `strtod` stops at the comma and garbage is left. `"1e999"` does not fit in a `double`, so `errno` is `ERANGE`.

</details>

### Exercise 3: find the errors

This fragment wants to turn every line the user types into uppercase. It has two errors related to what you saw in this lesson. What are they and how do you fix them?

```c
char c;
while ((c = getchar()) != EOF) {
    putchar(toupper(c));
}
```

<details><summary>Show solution</summary>

1. `c` is a `char`, but `getchar` returns `int`. If `char` is signed, a `0xFF` byte is mistaken for `EOF` and the loop ends early; if it is unsigned, the comparison with `EOF` is never true and the loop never ends. Declare `int c;`.
2. If `char` is signed, bytes that are not ASCII (for example those of `é` in UTF-8) become negative, and passing them to `toupper` is undefined behavior. With `int c` the problem disappears, because `getchar` already returns an `unsigned char` value or `EOF`.

```c
int c;
while ((c = getchar()) != EOF) {
    putchar(toupper(c));
}
```

</details>

### Exercise 4: named return codes

Implement the `convert_int` function of the lesson's `ConversionStatus` enum: it must return `CONVERSION_NO_DIGITS`, `CONVERSION_GARBAGE` or `CONVERSION_OUT_OF_RANGE` as appropriate, or `CONVERSION_OK` and the value in `*result`. Add `const char *describe(ConversionStatus status)` with a `switch` and use them to report each test case; if any test fails, the program ends with `EXIT_FAILURE`.

<details><summary>Show solution</summary>

```c
#include <ctype.h>
#include <errno.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

typedef enum {
    CONVERSION_OK,
    CONVERSION_NO_DIGITS,
    CONVERSION_GARBAGE,
    CONVERSION_OUT_OF_RANGE
} ConversionStatus;

ConversionStatus convert_int(const char *text, int *result) {
    char *end;
    errno = 0;
    long value = strtol(text, &end, 10);

    if (end == text) {
        return CONVERSION_NO_DIGITS;
    }
    while (isspace((unsigned char)*end)) {
        end++;
    }
    if (*end != '\0') {
        return CONVERSION_GARBAGE;
    }
    if (errno == ERANGE || value < INT_MIN || value > INT_MAX) {
        return CONVERSION_OUT_OF_RANGE;
    }
    *result = (int)value;
    return CONVERSION_OK;
}

const char *describe(ConversionStatus status) {
    switch (status) {
        case CONVERSION_OK:
            return "ok";
        case CONVERSION_NO_DIGITS:
            return "there is no number";
        case CONVERSION_GARBAGE:
            return "there are extra characters at the end";
        case CONVERSION_OUT_OF_RANGE:
            return "the number does not fit in an int";
    }
    return "unknown status";
}

int main(void) {
    const char *tests[] = {"128", "x9", "7 days", "3000000000"};
    size_t n = sizeof tests / sizeof tests[0];
    int exit_status = EXIT_SUCCESS;

    for (size_t i = 0; i < n; i++) {
        int value = 0;
        ConversionStatus status = convert_int(tests[i], &value);
        if (status == CONVERSION_OK) {
            printf("\"%s\": %d\n", tests[i], value);
        } else {
            fprintf(stderr, "\"%s\": %s\n", tests[i], describe(status));
            exit_status = EXIT_FAILURE;
        }
    }
    return exit_status;
}
```

Because the `switch` covers every value of the `enum` without a `default`, `-Wall` warns you if you add a new code tomorrow and forget to describe it.

</details>

### Exercise 5: find a word with `bsearch`

You have an array of words `const char *words[]`. Sort it alphabetically with `qsort` and `strcmp`, then use `bsearch` to find out whether `"pear"` and `"kiwi"` are in the list. Hint: the array's elements are `const char *`, so the comparison function receives **pointers to pointers**.

<details><summary>Show solution</summary>

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// a and b point to array elements, which are const char *.
int compare_words(const void *a, const void *b) {
    const char *const *x = a;
    const char *const *y = b;
    return strcmp(*x, *y);
}

int main(void) {
    const char *words[] = {"apple", "pear", "banana", "grape", "peach"};
    size_t n = sizeof words / sizeof words[0];

    qsort(words, n, sizeof words[0], compare_words);

    const char *wanted[] = {"pear", "kiwi"};
    for (size_t i = 0; i < 2; i++) {
        const char *key = wanted[i];
        const char **found = bsearch(&key, words, n, sizeof words[0], compare_words);
        printf("%s: %s\n", key, found != NULL ? "found" : "not found");
    }
    return 0;
}
```

The key is passed as `&key` (a `const char **`), just like the elements the comparison function receives. Passing `key` directly would make the comparison function treat the word's characters as if they were a pointer.

</details>
