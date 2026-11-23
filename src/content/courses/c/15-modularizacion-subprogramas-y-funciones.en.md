---
title: 'Modularization and Functions'
course: 'c'
slug: 'modularizacion-subprogramas-y-funciones'
description: 'Split a program into functions with clear prototypes, separate interface (.h) and implementation (.c) with include guards and build multi-file projects.'
order: 15
lang: 'en'
published: true
---

When a program starts to grow, writing everything inside `main` stops being a good idea. It works for tiny examples, but as soon as the problem grows you need to split the program into smaller, understandable and reusable parts.

That is called **modularization**.

## Objectives

- Explain why it pays to split a program into subprograms.
- Tell apart the **declaration**, the **definition** and the **call** of a function.
- Write prototypes, parameters, return values and `void` functions.
- Organize a program in several files: a `.h` with the interface and a `.c` with the implementation.
- Protect a header with include guards.
- Compile each file separately and link them into one executable.
- Hide helper functions with `static`.

**Prerequisites:** `compilacion-y-enlazado` (preprocessor, `-c`, `.o` files, linker), `entrada-y-salida` and the control flow module (`sentencia-if-else` to `programacion-esquematica-y-sentencias-anidadas`).

> Key idea: modularizing means splitting a big problem into small parts, each with one clear responsibility, so you can think about it, test it and maintain it better.

## Why modularize?

Picture a program that reads data, validates it, computes results and prints them, all mixed in a single block inside `main`. Every change forces you to reread everything, and a bug in the computation hides among reads and `printf` calls.

Splitting it into parts improves several things at once:

- each part has **one** responsibility and can be understood on its own;
- repeated logic is written once and reused;
- each part can be tested separately;
- the program grows in order: adding something new does not force you to touch everything before it.

In the lesson on schematic programming you split problems into steps (stepwise refinement). Functions are how those steps become code.

## Subprograms: functions and procedures

A **subprogram** is a named block of code that performs one specific task. The program invokes it every time it needs that task.

Many textbooks distinguish two kinds:

- a **function** computes and **returns** a result (for example, the sum of two numbers);
- a **procedure** performs an **action** and returns nothing useful (for example, printing a message).

In C the difference is only conceptual: the language has a single mechanism, the function. What other languages call a procedure is, in C, a function whose return type is `void`.

## Anatomy of a function

```c
return_type name(parameters) {
    statements;
}
```

- **return type**: the type of the value it returns (`int`, `double`, `bool`, `char`) or `void` if it returns nothing;
- **name**: how you invoke it;
- **parameters**: the data it receives, each with its type;
- **body**: the statements between braces.

### Returning a value with `return`

```c
int add(int a, int b) {
    return a + b;
}
```

`return` ends the function right there and hands the value back to the caller. A non-`void` function must execute a `return` with a value on every path: if an `if` returns something and the `else` does not, the function can end without a value, and using that result is undefined behavior. With `-Wall` the compiler warns you.

### `void` functions

```c
void print_line(void) {
    printf("--------------------\n");
}
```

A `void` function returns no value. It may use `return;` (with no value) to finish early, but it does not have to: it ends when it reaches the closing brace.

Notice the `(void)` parameter list: it means "this function takes no parameters".

> **Basic C:** always write `(void)` when a function takes no parameters, as in `int main(void)`.
>
> **Modern C (C23):** since C23, `int f()` also means "no parameters", exactly like `int f(void)`.
>
> **Portability:** in C17 and earlier, `int f()` meant "unspecified parameters": the compiler did not check the arguments of the calls. If your code must compile with older standards, `(void)` is the spelling that means the same in all of them.

## Parameters and arguments

**Parameters** are the variables listed in the function definition. **Arguments** are the concrete values passed in each call (some textbooks call them formal and actual parameters).

```c
int rectangle_area(int width, int height) {   // width and height: parameters
    return width * height;
}

int result = rectangle_area(4, 7);            // 4 and 7: arguments
```

Each argument is evaluated and its value is copied into the matching parameter, in order. The type must be compatible: if you pass an `int` to a `double` parameter, it is converted automatically, just like an assignment. How that copy behaves is studied in depth in the next lesson, `variables-parametros-y-pasaje`.

## A first program with functions

```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

void show_result(int result) {
    printf("The result is %d\n", result);
}

int main(void) {
    int total = add(5, 3);
    show_result(total);
    return 0;
}
```

The logic is now separated: one function computes, another prints, and `main` coordinates. Separating **computing** from **printing** also makes `add` useful in any other context, not only for printing.

## Declaration, definition and prototypes

The compiler reads the file from top to bottom. To compile a call it needs to know, **before** that line, the function's name, the types of its parameters and its return type.

In the example above that holds because the functions are defined before `main`. But if `main` comes first:

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    printf("%d\n", add(5, 3));   // error: add has not been declared yet
    return 0;
}

int add(int a, int b) {
    return a + b;
}
```

Since C99, calling an undeclared function is an error (old C assumed it returned `int`; that is no longer valid).

The solution is to separate two ideas:

- **Definition**: the complete function, with its body. There is exactly one per function in the whole program.
- **Declaration**: announces that the function exists and how to use it, without the body. It can be repeated.

A function declaration that states the types of its parameters is called a **prototype**:

```c
int add(int a, int b);   // prototype: ends with a semicolon, has no body
```

With prototypes, the order of the definitions no longer matters:

```c
#include <stdio.h>

// Prototypes: the file's "table of contents"
int add(int a, int b);
void show_result(int result);

int main(void) {
    show_result(add(5, 3));
    return 0;
}

// Definitions
int add(int a, int b) {
    return a + b;
}

void show_result(int result) {
    printf("The result is %d\n", result);
}
```

Besides allowing any order, the prototype lets the compiler **check** every call: if you pass three arguments to `add`, or an argument of an incompatible type, it catches it at compile time.

Parameter names are optional in a prototype (`int add(int, int);` is valid), but it is worth writing them: they document what each one means.

## Functions calling functions

A function can call other functions. That is how big solutions are built from small pieces:

```c
#include <stdio.h>

bool is_even(int n);
int max(int a, int b);
int max_of_three(int a, int b, int c);

int main(void) {
    int x = 0;
    int y = 0;
    int z = 0;

    printf("Enter three integers: ");
    if (scanf("%d %d %d", &x, &y, &z) != 3) {
        printf("Invalid input.\n");
        return 1;
    }

    int m = max_of_three(x, y, z);
    printf("The largest is %d and it %s\n", m, is_even(m) ? "is even" : "is odd");
    return 0;
}

bool is_even(int n) {
    return n % 2 == 0;
}

int max(int a, int b) {
    return a > b ? a : b;
}

int max_of_three(int a, int b, int c) {
    return max(max(a, b), c);
}
```

`max_of_three` does not repeat the comparison: it reuses `max`. If the way of comparing ever changes, it is fixed in one place.

When a function finishes, execution goes back **exactly** to the point it was called from. Each call has its own parameters and local variables; in the `recursividad` lesson you will see how those calls are organized on the call stack.

## Programs in several files

When the program grows, it also pays to spread it across files. The C convention is:

- a **`.h`** file (header) with the **interface**: the prototypes of what the module offers;
- a **`.c`** file with the **implementation**: the definitions of those functions;
- a `main.c` that **uses** the module by including its header.

Let's build a `calculator` module.

### The header: `calculator.h`

```c
#ifndef CALCULATOR_H
#define CALCULATOR_H

// Interface of the calculator module.

int add(int a, int b);
int subtract(int a, int b);
int multiply(int a, int b);

// Returns true if it is possible to divide by divisor.
bool can_divide(int divisor);

// Requires divisor != 0 (check it first with can_divide).
int divide(int dividend, int divisor);

// Returns a*a + b*b.
int sum_of_squares(int a, int b);

#endif
```

The three preprocessor lines are the **include guards**:

- `#ifndef CALCULATOR_H`: "if the name `CALCULATOR_H` is not defined yet...";
- `#define CALCULATOR_H`: "...define it now...";
- `#endif`: "...and end of the conditional part".

The first time the preprocessor includes the file, the name does not exist and the content is copied. If the same header reaches the same translation unit again (for example, because another header includes it too), the name is already defined and the content is skipped.

Repeating a prototype is legal, so in this header the guards do not yet prevent an error. But headers will soon hold type definitions (you will see `struct` and `typedef` in `concepto-de-estructuras`), and those **cannot** be repeated. That is why every header gets guards from day one. The name is usually the file name in uppercase, ending in `_H`.

### The implementation: `calculator.c`

```c
#include "calculator.h"

// Helper function: it exists only inside this file.
static int square(int x) {
    return x * x;
}

int add(int a, int b) {
    return a + b;
}

int subtract(int a, int b) {
    return a - b;
}

int multiply(int a, int b) {
    return a * b;
}

bool can_divide(int divisor) {
    return divisor != 0;
}

int divide(int dividend, int divisor) {
    return dividend / divisor;
}

int sum_of_squares(int a, int b) {
    return square(a) + square(b);
}
```

The implementation includes its own header: that way the compiler checks that every definition matches its prototype.

Notice the quotes: `#include "calculator.h"` looks for the file in the project folder first; `#include <stdio.h>` looks in the system folders.

### The program: `main.c`

```c
#include <stdio.h>
#include "calculator.h"

int main(void) {
    int a = 0;
    int b = 0;

    printf("Enter two integers: ");
    if (scanf("%d %d", &a, &b) != 2) {
        printf("Invalid input.\n");
        return 1;
    }

    printf("%d + %d = %d\n", a, b, add(a, b));
    printf("%d - %d = %d\n", a, b, subtract(a, b));
    printf("%d * %d = %d\n", a, b, multiply(a, b));

    if (can_divide(b)) {
        printf("%d / %d = %d\n", a, b, divide(a, b));
    } else {
        printf("Cannot divide by zero.\n");
    }

    printf("%d^2 + %d^2 = %d\n", a, b, sum_of_squares(a, b));
    return 0;
}
```

`main.c` does not know **how** the calculator is built: it only knows its prototypes. That is all the compiler needs to compile it.

### Compiling separately and linking

In `compilacion-y-enlazado` you saw that `-c` compiles a file to object code (`.o`) without linking. In a multi-file project you do that with every `.c`:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -c calculator.c    # produces calculator.o
gcc -std=c23 -Wall -Wextra -Wpedantic -c main.c          # produces main.o
gcc calculator.o main.o -o calculator                    # links the executable
./calculator
```

Each `.c` is an independent **translation unit**: the compiler translates `main.c` without looking at `calculator.c`. The call to `add` stays in `main.o` as a pending reference; the **linker** resolves it when it links, by finding the definition of `add` in `calculator.o`.

For small projects, a single command does everything (compiles each `.c` and links):

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic main.c calculator.c -o calculator
```

`.h` files are **not** compiled nor passed to the compiler: they enter each `.c` through `#include`.

Why compile separately? Because if you only change `main.c`, it is enough to recompile `main.c` and link again. In projects with hundreds of files that saves a lot of time (and it is what tools like `make` automate).

### Typical link errors

If you forget a file when linking:

```bash
gcc main.o -o calculator
```

the compiler does not complain (`main.o` compiled fine), but the linker does: it reports something like `undefined reference to 'add'` (in Clang, `Undefined symbols ... _add`). There is a reference with no definition.

The opposite error appears if you **define** a function in the `.h` instead of declaring it. If two `.c` files include that header, the function is defined twice and the linker reports `multiple definition of 'add'`. Rule of thumb: declarations go in the `.h`, definitions go in the `.c`.

## Interface and implementation

This separation is the most important idea of the lesson:

- the **interface** (`calculator.h`) is a contract: which functions exist, what they take, what they return and which conditions they require (like `divisor != 0`);
- the **implementation** (`calculator.c`) is how that contract is fulfilled.

Whoever uses the module reads the interface, not the implementation. If tomorrow you change how something is computed inside `calculator.c` without touching the prototypes, `main.c` does not change: only `calculator.c` is recompiled and everything is linked again.

That is why the `.h` should document what users need to know, as we did with the precondition of `divide`.

## Hiding helpers with `static`

In `calculator.c`, `square` is marked `static`. Applied to a function, `static` means its name is visible **only inside that file**: the linker does not offer it to other translation units.

That is useful for two things:

- **hiding details**: `square` is an internal helper, not part of the interface, so it does not appear in the `.h`;
- **avoiding name clashes**: another file can have its own `square` function without the linker seeing two definitions.

If `main.c` tried to call `square`, it would not compile (there is no prototype) and, even if you added one by hand, the linker would not find it.

Rule of thumb: every function that is not listed in the `.h` should be `static`.

(The keyword `static` is also used with variables, with a different meaning; you will see it in the next lesson.)

## When should you write a function?

- when a task makes sense on its own and can be named with a clear verb (`compute_average`, `show_menu`);
- when some logic repeats;
- when a block in `main` has grown too big to read in one go;
- when you want to test a part separately.

## Common mistakes

1. **Putting everything in `main`.** The code becomes hard to read, test and change.
2. **Functions without a clear responsibility.** If the name needs an "and" (`read_and_compute_and_print`), they are probably several functions.
3. **Mixing computation with input and output.** A function that computes and also prints cannot be reused where you do not want to print.
4. **Forgetting the prototype** of a function defined further down, or declaring one that does not match the definition.
5. **Forgetting a `return`** on some path of a non-`void` function.
6. **Defining functions in a `.h`**, or passing `.h` files to the compiler as if they were `.c` files.

## Summary

- Modularizing means splitting a program into parts with clear responsibilities.
- In C, every subprogram is a function; "procedures" are `void` functions.
- The **definition** holds the body and is unique; the **declaration** (prototype) announces name, parameters and return type.
- A modular project separates the **interface** (`.h`, with `#ifndef`/`#define`/`#endif` guards) from the **implementation** (`.c`).
- Each `.c` is compiled with `-c` into a `.o`, and the linker joins the `.o` files into an executable.
- `static` on a function hides it inside its file.

## Practice exercises

### Exercise 1: ordering with prototypes

This program does not compile because `main` calls functions defined further down. Fix it **without moving** any function.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    show_title();
    printf("Twice 21 is %d\n", twice(21));
    return 0;
}

void show_title(void) {
    printf("== Doubles ==\n");
}

int twice(int n) {
    return 2 * n;
}
```

<details><summary>Show solution</summary>

Adding the prototypes before `main` is enough:

```c
#include <stdio.h>

void show_title(void);
int twice(int n);

int main(void) {
    show_title();
    printf("Twice 21 is %d\n", twice(21));
    return 0;
}

void show_title(void) {
    printf("== Doubles ==\n");
}

int twice(int n) {
    return 2 * n;
}
```

</details>

### Exercise 2: functions that build on others

Write `bool is_divisible(int a, int b)` (returns whether `a` is divisible by `b`, with `b` non-zero) and, using it, `bool is_leap(int year)`: a year is a leap year if it is divisible by 4, unless it is divisible by 100 and not by 400. Read a year in `main` and print whether it is a leap year.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

bool is_divisible(int a, int b);
bool is_leap(int year);

int main(void) {
    int year = 0;

    printf("Year: ");
    if (scanf("%d", &year) != 1) {
        printf("Invalid input.\n");
        return 1;
    }

    printf("%d %s a leap year\n", year, is_leap(year) ? "is" : "is not");
    return 0;
}

bool is_divisible(int a, int b) {
    return a % b == 0;
}

bool is_leap(int year) {
    if (is_divisible(year, 400)) {
        return true;
    }
    if (is_divisible(year, 100)) {
        return false;
    }
    return is_divisible(year, 4);
}
```

`is_leap` returns a value on every path, and the divisibility rule is written only once.

</details>

### Exercise 3: a temperature module

Create a `temperature` module with two public functions, `double celsius_to_fahrenheit(double c)` and `double fahrenheit_to_celsius(double f)`, and a `main.c` that reads a temperature in degrees Celsius and prints its Fahrenheit equivalent. Write the three files and the commands to compile each one separately and link them.

<details><summary>Show solution</summary>

`temperature.h`:

```c
#ifndef TEMPERATURE_H
#define TEMPERATURE_H

double celsius_to_fahrenheit(double c);
double fahrenheit_to_celsius(double f);

#endif
```

`temperature.c`:

```c
#include "temperature.h"

double celsius_to_fahrenheit(double c) {
    return c * 9.0 / 5.0 + 32.0;
}

double fahrenheit_to_celsius(double f) {
    return (f - 32.0) * 5.0 / 9.0;
}
```

`main.c`:

```c
#include <stdio.h>
#include "temperature.h"

int main(void) {
    double c = 0.0;

    printf("Degrees Celsius: ");
    if (scanf("%lf", &c) != 1) {
        printf("Invalid input.\n");
        return 1;
    }

    printf("%.1f °C = %.1f °F\n", c, celsius_to_fahrenheit(c));
    return 0;
}
```

Compiling and linking:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic -c temperature.c
gcc -std=c23 -Wall -Wextra -Wpedantic -c main.c
gcc temperature.o main.o -o temperature
```

</details>

### Exercise 4: diagnosing the link step

A classmate builds like this and gets `undefined reference to 'celsius_to_fahrenheit'`:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic main.c -o temperature
```

At which stage does it fail, why, and how is it fixed? Which error would they get if, instead, they had written the **body** of the functions inside `temperature.h` and included it from two `.c` files?

<details><summary>Show solution</summary>

It fails at **link** time, not at compile time: `main.c` compiles fine because the prototype in `temperature.h` is enough to check the call, but nobody gives the linker the **definition** of `celsius_to_fahrenheit`, which lives in `temperature.c`. It is fixed by adding that file (or its `.o`) to the command:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic main.c temperature.c -o temperature
```

If the definitions were in the `.h` and two `.c` files included it, each `.o` would have its own copy of the function and the linker would report `multiple definition`. Declarations go in the `.h`; definitions go in the `.c`.

</details>
