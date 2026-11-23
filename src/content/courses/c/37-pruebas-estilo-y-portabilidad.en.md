---
title: 'Testing, style and portability'
course: 'c'
slug: 'pruebas-estilo-y-portabilidad'
description: 'Verify your modules with assert-based unit tests, document preconditions and invariants in headers and write portable, maintainable C code.'
order: 37
lang: 'en'
published: true
---

A program that "worked once" is not the same as a program you can trust. In `depuracion-y-sanitizers` you learned to find bugs; in this lesson you learn to **keep them from coming back**: with automated tests, with a style that makes the code easy to read, with code that compiles the same way on other machines, and with an organized project anyone can build and test with a single command.

## Objectives

- Write a **unit test** with `assert(` and understand why `NDEBUG` turns it off.
- Build a small test runner with a counter macro and an exit code.
- Write integration tests that run the program with input files and compare the output with `diff`.
- Choose boundary cases.
- Apply style conventions: names, one responsibility per function, `const`, comments that document interfaces, and automatic formatting.
- Write portable code: standard C versus extensions, fixed-width integers, `size_t`, byte order, the signedness of `char`, and implementation-defined behavior.
- Organize a repository with `src/`, `include/`, `tests/` and a `Makefile`, use version control, and measure performance before optimizing.

**Prerequisites:** `modularizacion-subprogramas-y-funciones` (the `calculator` module, `.h` and `.c`), `tipos-de-datos` (`size_t`, conversions), `archivos` (binary files) and `depuracion-y-sanitizers` (`assert`, sanitizers, regression checks).

## Unit tests with `assert`

A **unit test** checks a small unit of the program (usually a function) in isolation: it gives it known inputs and verifies that the result is the expected one. You write it once and run it every time you change the code.

We are going to test the `calculator` module from `modularizacion-subprogramas-y-funciones`. The tests go in a separate file, `test_calculator.c`, with its own `main`: that way the real program does not change.

```c
#include <assert.h>
#include <stdio.h>
#include "calculator.h"

int main(void) {
    assert(add(2, 3) == 5);
    assert(subtract(2, 3) == -1);
    assert(multiply(-4, 5) == -20);
    assert(divide(7, 2) == 3);
    assert(can_divide(0) == false);
    assert(sum_of_squares(3, 4) == 25);
    printf("All tests passed.\n");
    return 0;
}
```

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -g calculator.c test_calculator.c -o test_calculator
./test_calculator
```

If every condition is true, the program prints the final message. If one fails, `assert` stops the program and says which one (as you saw in `depuracion-y-sanitizers`):

```
Assertion failed: (divide(7, 2) == 3), function main, file test_calculator.c, line 9.
```

### Why `NDEBUG` turns `assert` off

`assert` is a macro from `<assert.h>`, and the standard says that, if the name `NDEBUG` is defined before including `<assert.h>`, every `assert(...)` is replaced by nothing. It is defined from the command line:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -DNDEBUG calculator.c test_calculator.c -o test_calculator
```

The idea is that in the version you ship, internal checks cost no time. That has two important consequences:

1. **Tests are never compiled with `-DNDEBUG`.** With that option, the program above prints "All tests passed." **without checking anything**.
2. **Never put a side effect inside an `assert`.** With `assert(fgets(line, sizeof line, file) != NULL);` the read disappears when compiling with `NDEBUG`, and the program stops reading. Do the operation first and keep its result; then check the result.

For that reason, and because `assert` stops at the **first** failure without telling you how many more there are, tests are better served by a mechanism of your own.

## A minimal test runner

A **test runner** counts how many checks were made and how many failed, reports each failure without stopping, and ends with an exit code other programs (such as `make`) can read: `0` if everything passed, non-zero if something failed.

We build it with a macro:

```c
#include <stdio.h>
#include <stdlib.h>
#include "calculator.h"

static int tests_run = 0;
static int tests_failed = 0;

#define CHECK(condition)                                            \
    do {                                                            \
        tests_run++;                                                \
        if (!(condition)) {                                         \
            tests_failed++;                                         \
            fprintf(stderr, "%s:%d: failed: %s\n",                  \
                    __FILE__, __LINE__, #condition);                \
        }                                                           \
    } while (0)

static void test_add_and_subtract(void) {
    CHECK(add(2, 3) == 5);
    CHECK(add(-2, 2) == 0);
    CHECK(subtract(2, 3) == -1);
}

static void test_divide(void) {
    CHECK(divide(7, 2) == 3);
    CHECK(divide(-7, 2) == -3);          // C truncates toward zero
    CHECK(divide(0, 5) == 0);
    CHECK(can_divide(0) == false);
    CHECK(can_divide(-1) == true);
}

static void test_sum_of_squares(void) {
    CHECK(sum_of_squares(3, 4) == 25);
    CHECK(sum_of_squares(0, 0) == 0);
    CHECK(sum_of_squares(-3, 4) == 25);
}

int main(void) {
    test_add_and_subtract();
    test_divide();
    test_sum_of_squares();

    printf("%d tests, %d failed\n", tests_run, tests_failed);
    return tests_failed == 0 ? EXIT_SUCCESS : EXIT_FAILURE;
}
```

```
11 tests, 0 failed
```

How the macro works:

- The backslashes `\` at the end of each line continue the definition on the next line.
- `#condition` turns the **text** of the argument into a string: if the check `divide(7, 2) == 4` fails, the message shows exactly that expression: `test_calculator.c:25: failed: divide(7, 2) == 4`.
- `__FILE__` and `__LINE__` are predefined macros holding the file and line of each use.
- `do { ... } while (0)` wraps everything into a single statement, so that `CHECK(...);` behaves well even inside an `if` without braces. You will see these techniques in detail in `preprocesador-y-programacion-generica`.
- `EXIT_SUCCESS` and `EXIT_FAILURE`, from `<stdlib.h>`, are the standard success and failure exit codes.

Each `test_...` function groups the tests of one part of the module. The counter variables are `static` globals: they exist only inside this test file.

> **Portability:** this runner uses only standard C, so it works with any compiler. Larger projects use testing libraries (Unity, cmocka, Check, among others) that add comparisons with more detailed messages; the idea is the same.

### Boundary cases

A test with `2 + 3` finds few bugs. Bugs live at the **edges**. When choosing cases, think about:

- **Zero and empty:** `0`, a string `""`, an array or a list with no elements.
- **A single element**, and the first and last element of a collection (that is where off-by-one errors show up).
- **Negatives** and mixed signs: `divide(-7, 2)` is `-3`, because C truncates integer division toward zero.
- **The limits of the type:** `INT_MAX`, `INT_MIN`, `SIZE_MAX`; adding or multiplying near them overflows.
- **Invalid inputs:** what the user can type wrong, a file that does not exist, an allocation that fails.

Every bug you fix deserves a test with the input that triggered it: that is the **regression check** of the method from `depuracion-y-sanitizers`.

Run the tests with the sanitizers (`-fsanitize=address,undefined`): a test that passes "by accident" while reading outside an array then stops passing.

### Testing a dynamic structure

The same works for modules with dynamic memory, such as the list from `estructuras-dinamicas-listas`. A test builds a list, checks its state and destroys it; with `-fsanitize=address` it also verifies there are no leaks or invalid accesses:

```c
static void test_insert_into_empty_list(void) {
    Node *head = NULL;                         // boundary case: empty list
    CHECK(length(head) == 0);
    CHECK(insert_back(&head, 7));
    CHECK(length(head) == 1);
    CHECK(head->value == 7);
    destroy_list(&head);
    CHECK(head == NULL);
}
```

(The functions are the ones from `estructuras-dinamicas-listas`: `insert_back`, `length` and `destroy_list`, which leaves the head set to `NULL`. What matters is checking the state before and after each operation, starting with the boundary cases.)

## Integration tests

A unit test checks a function. An **integration test** checks the **whole** program, the way a person would use it: it gives it an input and compares its output with the expected one.

With this `main.c` for the calculator:

```c
#include <stdio.h>
#include "calculator.h"

int main(void) {
    int a = 0;
    int b = 0;
    if (scanf("%d %d", &a, &b) != 2) {
        printf("Invalid input.\n");
        return 1;
    }
    printf("%d + %d = %d\n", a, b, add(a, b));
    if (can_divide(b)) {
        printf("%d / %d = %d\n", a, b, divide(a, b));
    } else {
        printf("Cannot divide by zero.\n");
    }
    return 0;
}
```

each case is a pair of files: the input and the expected output.

```
tests/cases/division.input       7 2
tests/cases/division.expected    7 + 2 = 9
                                 7 / 2 = 3
tests/cases/zero.input           5 0
tests/cases/zero.expected        5 + 0 = 5
                                 Cannot divide by zero.
tests/cases/invalid.input        hello
tests/cases/invalid.expected     Invalid input.
```

The terminal does the rest: `<` redirects the file into the program's standard input, and `diff` compares two texts. `diff` prints nothing and ends with exit code `0` if they are equal; if they differ, it shows the different lines and ends with `1`.

```bash
./calculator < tests/cases/division.input > output.txt
diff -u tests/cases/division.expected output.txt
```

To avoid repeating that by hand, a small script walks through every case (`tests/integration.sh`):

```sh
#!/bin/sh
# Runs ./calculator with each input file and compares its output
# with the expected one. Exits with code 1 at the first difference.
for input in tests/cases/*.input; do
    expected="${input%.input}.expected"
    if ./calculator < "$input" | diff -u "$expected" -; then
        echo "ok      $input"
    else
        echo "FAILED  $input"
        exit 1
    fi
done
```

`${input%.input}` removes the `.input` extension from the name, and the final `-` given to `diff` means "read the second text from standard input", that is, the program's output. If you change the program and the division starts printing something else, the script shows it:

```
ok      tests/cases/zero.input
--- tests/cases/division.expected
+++ -
@@ -1,2 +1,2 @@
 7 + 2 = 9
-7 / 2 = 3.5
+7 / 2 = 3
FAILED  tests/cases/division.input
```

Lines with `-` are the expected ones and lines with `+` are the ones the program produced.

> **Portability:** `diff` and `sh` scripts exist on Linux and macOS. On Windows they are available through Git Bash or WSL; PowerShell has `Compare-Object`, with a different format.

## Style and conventions

The compiler accepts almost any way of writing; the people who read your code do not. A **convention** is a team agreement about how to write; what matters is choosing one and applying it **always**. This course's conventions:

| Element | Convention | Examples |
| --- | --- | --- |
| Variables and functions | lowercase with underscores (`snake_case`), verbs for functions | `count`, `sum_of_squares`, `insert_back` |
| Types (`typedef`) | capitalized | `Person`, `Node`, `Contacts` |
| Constants and macros | uppercase | `CONTACTS_CAPACITY`, `CHECK` |
| Functions of a module | common prefix | `list_create`, `list_insert`, `list_destroy` |
| Booleans | read as a question | `can_divide`, `is_empty` |

Beyond names:

- **One responsibility per function.** If describing a function takes the word "and" ("reads the data **and** computes the average **and** prints it"), split it. Small functions can be tested separately.
- **No magic numbers.** `if (age >= AGE_OF_MAJORITY)` says more than `if (age >= 18)`.
- **`const` where nothing is modified.** A parameter `const int grades[]` or `const char *text` promises the function only reads; the compiler enforces it and the caller knows it without reading the code. That is "`const`-correctness": everything that is not modified is marked `const`.
- **Comments that explain the why and the interface,** not ones that repeat the code. `i++; // increments i` adds nothing.

### Documenting the interface

The comment of each function in the `.h` is a **contract**: what the function requires, what it returns, how it reports errors and, if it handles memory, who the owner is (`propiedad-y-errores-de-memoria`):

```c
// Computes the average of the first count grades.
// Requires: count > 0.
// Returns: the average as a double.
double average(const int grades[], size_t count);

// Reads a product file in the format of inventory.txt.
// Returns: true if it could read everything; false if it could not open
//          or read the file, or if a line has an invalid format (in that
//          case *count is left at 0 and no memory is allocated).
// Ownership: if it returns true, *products points to a new block; the
//            caller owns it and must free it with free.
bool read_products(const char *path, Product **products, size_t *count);
```

With the contract, whoever uses the function does not need to read its implementation; and the unit tests check exactly what the contract promises.

### Automatic formatting

Arguing about where the brace goes or how many spaces to use is a waste of time: a tool formats the code and everyone uses the same result. The most common one for C is **clang-format**, which reads its rules from a `.clang-format` file at the root of the project:

```yaml
BasedOnStyle: LLVM
IndentWidth: 4
ColumnLimit: 100
```

```bash
clang-format -i src/*.c include/*.h tests/*.c
```

`-i` rewrites the files in place. Use it before every commit. (clang-format is installed along with Clang or from the package manager; it is not part of the compiler or of the standard.)

## Portability

A program is **portable** when it compiles and behaves the same with other compilers, operating systems and processors. **Portability** is not automatic in C: the standard leaves several things up to each implementation.

### Standard C versus extensions

GCC and Clang accept **extensions**: things that are not standard C, such as `__attribute__((...))`, statement expressions `({ ... })` or `#pragma once`. They work on those compilers, but not on others. `-Wpedantic` warns when you use one. Course rule: standard C by default; if you need an extension, mark it with a comment and, if you can, isolate it in a single file.

> **Modern C (C23):** several popular extensions became standard in C23 (for example `typeof` and the `[[...]]` attributes). If you compile with an earlier standard (`-std=c17`), they are still extensions. You will see them in `c23-moderno`.

### Fixed-width integers: `<stdint.h>`

The standard only guarantees **minimum** sizes: `int` has at least 16 bits, `long` at least 32. On most current computers `int` has 32 bits, but `long` has 64 on Linux and macOS and 32 on Windows. When the exact size matters (file formats, protocols, bit operations), use the types from `<stdint.h>`:

```c
#include <inttypes.h>
#include <stdint.h>
#include <stdio.h>

int main(void) {
    int32_t balance = -1500;        // exactly 32 bits, signed
    uint8_t brightness = 255;       // exactly 8 bits, unsigned
    uint64_t visits = 4000000000;   // exactly 64 bits, unsigned

    printf("balance: %" PRId32 "\n", balance);
    printf("brightness: %" PRIu8 "\n", brightness);
    printf("visits: %" PRIu64 "\n", visits);
    printf("sizes: %zu %zu %zu\n", sizeof balance, sizeof brightness, sizeof visits);
    return 0;
}
```

- `int8_t`, `int16_t`, `int32_t`, `int64_t` (signed) and their `uint..._t` versions (unsigned) have exactly that number of bits.
- To print them portably, `<inttypes.h>` defines macros such as `PRId32` or `PRIu64`, which are glued to the rest of the format: `"%" PRId32`.
- For object sizes and indices, keep using `size_t` (with `%zu`), as in `tipos-de-datos`: it is the type `sizeof` returns and its width adapts to each platform.

### Byte order and binary files

A multi-byte integer is stored in memory in some **order**. In *little-endian* order (x86, ARM on almost every system) the least significant byte comes first; in *big-endian*, the most significant one.

```c
#include <stdint.h>
#include <stdio.h>

int main(void) {
    uint32_t value = 0x01020304;
    const unsigned char *bytes = (const unsigned char *)&value;
    for (size_t i = 0; i < sizeof value; i++) {
        printf("%02x ", bytes[i]);
    }
    printf("\n");
    return 0;
}
```

On a *little-endian* machine it prints `04 03 02 01`; on a *big-endian* one, `01 02 03 04`.

This matters for the binary files from `archivos`: if you do `fwrite(&value, sizeof value, 1, file)`, the file stores the bytes **in your machine's order**, and another machine may read a different number. The portable solution is to fix the format's order and write byte by byte:

```c
#include <stdint.h>
#include <stdio.h>

// Writes value to the file in little-endian order (least significant
// byte first). Returns true if it could write the 4 bytes.
bool write_u32_le(FILE *file, uint32_t value) {
    unsigned char bytes[4] = {
        (unsigned char)(value & 0xFF),
        (unsigned char)((value >> 8) & 0xFF),
        (unsigned char)((value >> 16) & 0xFF),
        (unsigned char)((value >> 24) & 0xFF),
    };
    return fwrite(bytes, 1, sizeof bytes, file) == sizeof bytes;
}

// Reads a uint32_t stored in little-endian order. Returns true if it could read it.
bool read_u32_le(FILE *file, uint32_t *value) {
    unsigned char bytes[4];
    if (fread(bytes, 1, sizeof bytes, file) != sizeof bytes) {
        return false;
    }
    *value = (uint32_t)bytes[0]
           | ((uint32_t)bytes[1] << 8)
           | ((uint32_t)bytes[2] << 16)
           | ((uint32_t)bytes[3] << 24);
    return true;
}

int main(void) {
    FILE *file = fopen("number.bin", "wb");
    if (file == NULL || !write_u32_le(file, 0x01020304)) {
        fprintf(stderr, "Could not write number.bin\n");
        return 1;
    }
    fclose(file);

    file = fopen("number.bin", "rb");
    uint32_t read_value = 0;
    if (file == NULL || !read_u32_le(file, &read_value)) {
        fprintf(stderr, "Could not read number.bin\n");
        return 1;
    }
    fclose(file);
    printf("Read: 0x%08x\n", (unsigned int)read_value);
    return 0;
}
```

Shifts (`>>`, `<<`) work on the **value**, not on memory, so the result is the same on any machine. For the same reason, do not write a whole `struct` with `fwrite` if another machine is going to read it: the padding between fields (`concepto-de-estructuras`) also changes between compilers.

### The signedness of `char`

The standard does not say whether `char` (without `signed` or `unsigned`) is signed: each implementation decides.

```c
#include <stdio.h>

int main(void) {
    char c = (char)200;
    printf("%d\n", c);
    return 0;
}
```

On x86 and on macOS with Apple processors it prints `-56` (`char` is signed); on Linux on ARM it prints `200` (`char` is unsigned). If you store bytes or small numbers, use `unsigned char`, `uint8_t` or `int8_t`; keep `char` for text. That is why the `<ctype.h>` functions are called with `(unsigned char)c`, as you saw in `biblioteca-estandar-y-errores`.

### Implementation-defined behavior

In `operadores` you told apart **undefined** behavior (forbidden: the program makes no sense) from **unspecified** behavior. There is a third category: **implementation-defined** behavior, which is valid but each compiler chooses it and documents it. Examples:

- the size of `int`, `long` and pointers;
- whether `char` is signed;
- the result of shifting a negative number right (`-8 >> 1`);
- the value of converting a number that does not fit into a signed type.

A portable program depends on none of them: it uses fixed-width types when size matters, `unsigned` for bit operations, and checks ranges before converting.

> **Portability:** the simplest portability test is to compile with **two compilers**: `gcc` and `clang` with the same options. Each one detects different warnings, and a difference in behavior between the two almost always points to undefined or implementation-defined behavior. (On macOS, `gcc` is Clang; to get real GCC you have to install it, for example with Homebrew as `gcc-14`.)

## Repository organization

When a project has more than one file, a fixed structure helps you find things:

```
calculator/
├── include/
│   └── calculator.h         public interface
├── src/
│   ├── calculator.c         implementation
│   └── main.c               program
├── tests/
│   ├── test_calculator.c    unit tests
│   ├── integration.sh       integration tests
│   └── cases/               inputs and expected outputs
├── .gitignore
├── .clang-format
├── Makefile
└── README.md                what it does, how to build and test it
```

### A simple `Makefile`

`make` reads a file called `Makefile` with **rules**: which file is produced, what it depends on and with which command. It only rebuilds what changed.

```makefile
CC = gcc
CFLAGS = -std=c23 -Wall -Wextra -Wpedantic -g -Iinclude
SANITIZERS = -fsanitize=address,undefined

.PHONY: all test clean

all: calculator

calculator: src/main.c src/calculator.c include/calculator.h
	$(CC) $(CFLAGS) src/main.c src/calculator.c -o calculator

test_calculator: tests/test_calculator.c src/calculator.c include/calculator.h
	$(CC) $(CFLAGS) $(SANITIZERS) tests/test_calculator.c src/calculator.c -o test_calculator

test: calculator test_calculator
	./test_calculator
	./tests/integration.sh

clean:
	rm -f calculator test_calculator
```

- `CFLAGS` holds the course options; `-Iinclude` tells the compiler to also look for `#include "..."` files in `include/`.
- Each rule is `target: dependencies` and, below it, the command. **The command line starts with a tab**, not with spaces: it is the most common mistake when writing a `Makefile`.
- The tests are compiled with the sanitizers.
- `.PHONY` marks the targets that are not files.

```bash
make          # builds the program
make test     # builds and runs all the tests
make clean    # deletes what was generated
```

```
./test_calculator
11 tests, 0 failed
./tests/integration.sh
ok      tests/cases/division.input
ok      tests/cases/invalid.input
ok      tests/cases/zero.input
```

If a test fails, the command ends with a non-zero exit code and `make` stops with an error: that is why the runner returns `EXIT_FAILURE`.

### Version control

A version control system, such as Git, keeps the project's history and lets you go back. Two basic rules:

- **Commit the source code**, not what is generated from it: `.c`, `.h`, tests, cases, `Makefile`, `README.md`.
- **Ignore the binaries** (executables, `.o`), because `make` regenerates them and they depend on each machine. They are listed in `.gitignore`:

```
*.o
calculator
test_calculator
*.dSYM/
```

```bash
git init
git add include src tests Makefile README.md .gitignore .clang-format
git commit -m "Calculator with unit and integration tests"
```

Before every commit: `make test` passing. A commit with failing tests breaks the regression check for everyone.

## Measuring performance

"This code is slow" is a hypothesis, and as in debugging, you check it before changing anything. **Measure before optimizing**: the time is almost always spent somewhere other than where you imagined.

The simplest way is to measure the whole program with the terminal's `time` command:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -O2 program.c -o program
time ./program
```

```
real    0m0.412s
user    0m0.405s
sys     0m0.004s
```

`real` is wall-clock time; `user`, the processor time used by your program; `sys`, the time used by the operating system on its behalf.

To measure one part, `clock()` from `<time.h>` returns the processor time consumed; the difference between two calls, divided by `CLOCKS_PER_SEC`, gives seconds:

```c
#include <stdio.h>
#include <time.h>

long long sum_to(long long n) {
    long long sum = 0;
    for (long long i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

int main(void) {
    clock_t start = clock();
    long long result = sum_to(200000000);
    clock_t end = clock();

    double seconds = (double)(end - start) / CLOCKS_PER_SEC;
    printf("Result: %lld\n", result);
    printf("Time: %.3f s\n", seconds);
    return 0;
}
```

Rules for a useful measurement:

- **Measure with optimizations** (`-O2`) and **without sanitizers**: with `-O0` or with ASan you would be measuring a different program.
- **Use the result** (here it is printed): if it is not used, the compiler may remove the whole computation and you would measure zero.
- **Repeat** the measurement several times and with realistic data sizes; a single run can vary.
- **Compare algorithms before details:** going from linear to binary search (`busqueda-en-arreglos`) gains more than any low-level trick.

> **Portability:** `clock()` is standard C, but it measures **processor** time, not wall-clock time; in a program that waits for input or disk, the two differ. `time` is a terminal command (Linux and macOS), not part of C.

## Summary

- A **unit test** checks a function with known inputs; `assert(` is enough to start, but `NDEBUG` turns it off: tests are never compiled with `-DNDEBUG` and no side effect ever goes inside an `assert`.
- A minimal runner with a counter macro reports every failure and returns an exit code.
- Integration tests run the program with input files and compare the output with `diff`.
- Bugs live in boundary cases: empty, one, limits, negatives, invalid inputs.
- A consistent **convention**, one responsibility per function, `const` and contracts in the comments make code readable; clang-format settles the formatting.
- **Portability:** standard C before extensions, `<stdint.h>` and `size_t`, a fixed byte order in binary files, `unsigned char` for bytes, nothing that depends on the implementation, and two compilers.
- A repository with `src/`, `include/`, `tests/` and a `Makefile` with a `test` target; Git stores the code, not the binaries.
- Measure before optimizing, with `-O2` and without sanitizers.

## Practice exercises

### Exercise 1: tests for `is_leap_year`

A year is a leap year if it is divisible by 4, except those divisible by 100, which are leap years only if they are also divisible by 400. Write `is_leap_year(int year)` and a test runner with the `CHECK` macro that covers the boundary cases of the rule. The program must end with `EXIT_FAILURE` if any test fails.

<details><summary>Show solution</summary>

The boundary cases are one per branch of the rule: divisible by 4 (2024), not divisible by 4 (2023), divisible by 100 but not by 400 (1900) and divisible by 400 (2000).

```c
#include <stdio.h>
#include <stdlib.h>

static int tests_run = 0;
static int tests_failed = 0;

#define CHECK(condition)                                            \
    do {                                                            \
        tests_run++;                                                \
        if (!(condition)) {                                         \
            tests_failed++;                                         \
            fprintf(stderr, "%s:%d: failed: %s\n",                  \
                    __FILE__, __LINE__, #condition);                \
        }                                                           \
    } while (0)

bool is_leap_year(int year) {
    return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

static void test_is_leap_year(void) {
    CHECK(is_leap_year(2024));        // divisible by 4
    CHECK(!is_leap_year(2023));       // not divisible by 4
    CHECK(!is_leap_year(1900));       // divisible by 100, not by 400
    CHECK(is_leap_year(2000));        // divisible by 400
}

int main(void) {
    test_is_leap_year();
    printf("%d tests, %d failed\n", tests_run, tests_failed);
    return tests_failed == 0 ? EXIT_SUCCESS : EXIT_FAILURE;
}
```

</details>

### Exercise 2: the test that tests nothing

A team compiles its tests with the same command as the release version: `gcc -std=c23 -O2 -DNDEBUG ...`. The tests use `assert` and always pass, even after introducing an obvious bug. Also, the program contains this line:

```c
assert(fscanf(file, "%d", &count) == 1);
```

Explain both problems and how to fix them.

<details><summary>Show solution</summary>

1. With `-DNDEBUG`, every `assert` disappears: the tests check nothing, which is why they "pass". Tests are compiled without `NDEBUG` (or with a runner of your own such as `CHECK`, which does not depend on `NDEBUG`), ideally with `-g -fsanitize=address,undefined`.
2. The read is **inside** the `assert`: with `NDEBUG` the `fscanf` does not run and `count` is never read. Besides, a file with an invalid format is an input error, not a program error, so it calls for a check, not an `assert`:

```c
if (fscanf(file, "%d", &count) != 1) {
    fprintf(stderr, "Invalid format\n");
    return false;
}
```

</details>

### Exercise 3: make it portable

This program saves a temperature reading in a binary file that is later read on another computer. Point out the portability problems and fix them.

```c
#include <stdio.h>

int main(void) {
    long reading = -1250;             // hundredths of a degree
    FILE *file = fopen("temp.bin", "wb");
    if (file == NULL) {
        return 1;
    }
    fwrite(&reading, sizeof reading, 1, file);
    fclose(file);
    return 0;
}
```

<details><summary>Show solution</summary>

- `long` has 64 bits on Linux and macOS and 32 on Windows: the file has a different size depending on where it was produced. Use a fixed-width type: `int32_t`.
- `fwrite(&reading, ...)` writes the bytes in the machine's order: a computer with the other order reads a different number. Fix the order and write byte by byte.
- The result of `fwrite` is not checked.

```c
#include <stdint.h>
#include <stdio.h>

// Writes value in little-endian order. Returns true if it wrote 4 bytes.
bool write_u32_le(FILE *file, uint32_t value) {
    unsigned char bytes[4] = {
        (unsigned char)(value & 0xFF),
        (unsigned char)((value >> 8) & 0xFF),
        (unsigned char)((value >> 16) & 0xFF),
        (unsigned char)((value >> 24) & 0xFF),
    };
    return fwrite(bytes, 1, sizeof bytes, file) == sizeof bytes;
}

int main(void) {
    int32_t reading = -1250;          // hundredths of a degree
    FILE *file = fopen("temp.bin", "wb");
    if (file == NULL) {
        return 1;
    }
    // Converting int32_t to uint32_t is defined (modulo 2^32);
    // when reading, convert it back after checking the range.
    bool ok = write_u32_le(file, (uint32_t)reading);
    if (fclose(file) != 0 || !ok) {
        fprintf(stderr, "Could not write temp.bin\n");
        return 1;
    }
    return 0;
}
```

</details>

### Exercise 4: a new integration case

While fixing a bug, you found that the calculator failed with the input `-7 2` (it showed `-4` as the quotient). You already fixed it. Add the regression check as an integration test and write the command that runs all the tests.

<details><summary>Show solution</summary>

Two new files in `tests/cases/`:

```
tests/cases/negative.input       -7 2
tests/cases/negative.expected    -7 + 2 = -5
                                 -7 / 2 = -3
```

The `integration.sh` script walks through every `*.input`, so it does not need to change:

```bash
make test
```

It is also worth adding the unit test `CHECK(divide(-7, 2) == -3);`: the integration test says the program fails, and the unit test says which function.

</details>

### Exercise 5: improve the style

Rewrite this function following the conventions of the lesson: names, one responsibility, `const`, no magic numbers and a documented contract.

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

<details><summary>Show solution</summary>

The function did two things (count and print), did not modify the array but did not promise it with `const`, and had a magic number (`6`). Split up:

```c
#include <stdio.h>

#define PASSING_GRADE 6

// Counts how many of the first count grades are passing.
// Returns: a number between 0 and count. Accepts count == 0.
size_t count_passing(const int grades[], size_t count) {
    size_t passing = 0;
    for (size_t i = 0; i < count; i++) {
        if (grades[i] >= PASSING_GRADE) {
            passing++;
        }
    }
    return passing;
}

int main(void) {
    int grades[] = {4, 6, 9, 5};
    size_t count = sizeof grades / sizeof grades[0];
    printf("Passing: %zu\n", count_passing(grades, count));
    return 0;
}
```

Printing stays in `main`, and `count_passing` can be tested with `CHECK(count_passing(grades, 0) == 0)` and other boundary cases without looking at the screen.

</details>
