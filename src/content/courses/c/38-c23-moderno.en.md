---
title: 'Modern C: what is new in C23'
course: 'c'
slug: 'c23-moderno'
order: 38
lang: 'en'
published: true
---

> **Optional deepening path.** This lesson opens the advanced module *Modern C and C23*. It is not a requirement for the rest of the course: everything before it works without it. Take it once you feel comfortable with pointers, memory and the standard library, or when you need to read modern C code.

Throughout the course you saw **Modern C (C23)** boxes inside each topic. Here we gather them, fill in what was missing and, above all, you learn to answer a practical question: **is this standard C, an extension of my compiler, or an optional part?** That distinction decides whether your program will compile on another machine.

## Objectives

- Place C23 in the evolution of the language: C89, C99, C11, C17 and C23.
- Tell apart a **standard** feature, a compiler **extension** and an **optional** feature of the implementation.
- Use the most useful C23 additions: `bool` as a keyword, `nullptr`, `constexpr`, `typeof`, `auto`, attributes, `#embed`, `_BitInt(N)`, enums with an underlying type, `= {}`, `unreachable()` and `<stdckdint.h>`.
- Check in code which standard is active with `__STDC_VERSION__`.

**Prerequisites:** `compilacion-y-enlazado`, `tipos-de-datos`, `variables-y-constantes`, `punteros-y-direcciones`, `memoria-dinamica` and `biblioteca-estandar-y-errores`.

## How C evolved

C is standardized by ISO. Each version adds features and almost never breaks earlier code:

| Version | Year | Most important additions |
| --- | --- | --- |
| C89/C90 | 1989/1990 | The first standard: function prototypes, `const`, `void *`, the standard library |
| C99 | 1999 | `//` comments, declarations anywhere in a block and in `for`, `long long`, `_Bool` and `<stdbool.h>`, `<stdint.h>`, `inline`, designated initializers |
| C11 | 2011 | `_Generic`, `_Static_assert`, `_Alignas`, `_Noreturn`, threads (`<threads.h>`) and atomics (`<stdatomic.h>`) as optional parts; removes `gets` |
| C17 | 2018 | Only defect fixes to C11, no new features |
| C23 | 2024 | ISO/IEC 9899:2024: what you see in this lesson |

Each standard defines the value of the `__STDC_VERSION__` macro, so a program can tell which version it is being compiled with:

| Standard | `__STDC_VERSION__` |
| --- | --- |
| C99 | `199901L` |
| C11 | `201112L` |
| C17 | `201710L` |
| C23 | `202311L` |

```c
#include <stdio.h>

int main(void) {
#if __STDC_VERSION__ >= 202311L
    puts("Compiled as C23");
#elif __STDC_VERSION__ >= 201710L
    puts("Compiled as C17");
#else
    puts("Compiled with a standard older than C17");
#endif
    return 0;
}
```

With `-std=c23` it prints `Compiled as C23`. With `-std=c2x` (the provisional name used by GCC 13 or Clang 17 and earlier) the value may be an intermediate one, such as `202000L`, because the standard was not finished yet.

## Standard, extension or optional

Before using something "modern", ask which of these three categories it belongs to:

- **Standard:** ISO C23 requires it. Any compiler that claims full C23 support accepts it. Example: `nullptr`.
- **Extension:** a compiler adds it on its own, outside the standard. It works in that compiler (and sometimes in others that imitate it), but it is not C. Examples: GCC and Clang's `__attribute__((packed))`, GCC's nested functions, `__builtin_expect`. With `-Wpedantic` the compiler warns you when you use one.
- **Optional:** it is in the standard, but the standard allows an implementation not to provide it, as long as it announces that with a macro. Examples: `<threads.h>` (if missing, `__STDC_NO_THREADS__` is defined), `<stdatomic.h>` (`__STDC_NO_ATOMICS__`), complex numbers (`__STDC_NO_COMPLEX__`) and variable length arrays (`__STDC_NO_VLA__`).

There is a fourth frequent situation: something that **was an extension and C23 made standard**. Binary literals `0b1010`, `typeof` and the empty initializer `= {}` existed for years in GCC and Clang, but they are standard C only since C23. With `-std=c17 -Wpedantic`, the compiler flags them as an extension.

> **Portability:** a compiler can accept `-std=c23` and still not implement all of C23, and your system's standard library may lag behind the compiler. GCC 14 and Clang 18 implement most of C23, but not all of it: for example, `constexpr` reached Clang in version 19 and `#embed` reached GCC in version 15. If you use another compiler (for example MSVC), check its documentation. Every example in this lesson that compiles was tested with Clang 21 and `-std=c23 -Wall -Wextra -Wpedantic`.

## Types and constants

### `bool`, `true` and `false` are keywords

You saw it in `tipos-de-datos`: in C99 and C17, `bool` comes from `<stdbool.h>`; in C23 they are **keywords** and `true` and `false` have type `bool`. **Standard** C23.

### `nullptr` and `nullptr_t`

Up to C17, the null pointer was written `NULL`, a macro that may be `0` or `((void *)0)` depending on the implementation. That causes subtle problems: if `NULL` is `0`, it is an `int`, and passing it to a function with variable arguments (such as `printf`) or to a `_Generic` selection does not behave like a pointer.

C23 adds the constant **`nullptr`**, which is always a null pointer, and its type `nullptr_t` (declared in `<stddef.h>`). It converts to any pointer type, and never to an integer. **Standard** C23 (GCC 13, Clang 16).

```c
#include <stdio.h>

int main(void) {
    int *p = nullptr;
    if (p == nullptr) {
        puts("p points to nothing");
    }
    return 0;
}
```

> **Basic C:** `NULL` is still valid and you will see it in almost all existing code. In C23 you can use either; `nullptr` states the intent more clearly.

### `constexpr`: compile-time constants

A `constexpr` object is a constant whose value the compiler **knows and checks** at compile time. Unlike `#define`, it has a type and respects scope; unlike `const`, it can be used where the language requires a constant expression, for example as the size of an array with static storage duration or as a `case` label. **Standard** C23 (GCC 13, Clang 19).

```c
#include <stdio.h>

constexpr int CAPACITY = 8;
constexpr double PI = 3.14159;

static int buffer[CAPACITY];

int main(void) {
    buffer[0] = CAPACITY;
    printf("%zu elements, the first is %d, pi = %.2f\n", sizeof buffer / sizeof buffer[0], buffer[0], PI);
    return 0;
}
```

The compiler rejects a `constexpr` whose value it cannot compute, or that does not fit exactly in its type:

<!-- c-check: skip -->
```c
#include <stdlib.h>

int main(void) {
    constexpr int random_value = rand(); // error: not a constant expression
    constexpr unsigned char small = 300; // error: 300 does not fit in unsigned char
    return random_value + small;
}
```

> **Portability:** in C23, `constexpr` applies **only to objects**, not to functions (unlike C++). A `constexpr` pointer can only be null.

### `typeof` and `typeof_unqual`

`typeof(expression)` is the type of an expression, and it can be used in a declaration. `typeof_unqual` does the same but drops qualifiers such as `const` and `volatile`. **Standard** C23 (GCC 13, Clang 16). Before C23, `typeof` and `__typeof__` were a GCC and Clang **extension**.

```c
#include <stdio.h>

int main(void) {
    const int limit = 10;
    typeof(limit) copy = 20;          // const int
    typeof_unqual(limit) counter = 0; // int, without const: can be modified
    counter++;
    printf("%d %d\n", copy, counter);
    return 0;
}
```

Its most important use is in generic macros, which you will see in the next lesson.

### `auto`: type inference

In C23, if you declare an object with `auto` and initialize it, the compiler deduces the type from the initializer. **Standard** C23.

```c
#include <stdio.h>

int main(void) {
    auto total = 2.5; // double
    auto count = 3;   // int
    printf("%.1f\n", total * count);
    return 0;
}
```

> **Basic C:** from C89 to C17, `auto` existed with another meaning: it marked the automatic storage duration of a local variable, which is already the default, so almost nobody wrote it. Use it sparingly: an explicit type usually reads better in C.

### Enums with an underlying type

In C17, the integer type an `enum` uses is chosen by the compiler. C23 lets you fix it, which matters when the `enum` is stored in a file or a protocol and its size must be known. **Standard** C23.

```c
#include <stdio.h>

enum Color : unsigned char { RED, GREEN, BLUE };

int main(void) {
    enum Color c = GREEN;
    printf("sizeof = %zu, value = %d\n", sizeof c, c);
    return 0;
}
```

It prints `sizeof = 1, value = 1`. If an enumerator does not fit in the underlying type (for example, `256` with `unsigned char`), it is a compile error.

### `_BitInt(N)`: exact-width integers

`_BitInt(N)` is a signed integer of exactly `N` bits, and `unsigned _BitInt(N)` an unsigned one. They are useful for hardware, cryptography or formats with unusual field widths. **Standard** C23, but the maximum width depends on the implementation: the `BITINT_MAXWIDTH` macro in `<limits.h>` gives it, and it is at least the width of `unsigned long long`.

```c
#include <stdio.h>
#include <limits.h>

int main(void) {
    unsigned _BitInt(4) nibble = 15;
    nibble = nibble + 1; // 4 bits: wraps to 0
    printf("nibble = %d\n", (int)nibble);
    printf("BITINT_MAXWIDTH = %d\n", (int)BITINT_MAXWIDTH);
    return 0;
}
```

Notice two details: `_BitInt` values are **not** promoted to `int` in operations (that is why `nibble + 1` is computed in 4 bits), and `printf` has no conversion specifier for them, so they are converted before printing.

> **Portability:** GCC 14 supports `_BitInt` only on some architectures (for example, x86-64). Check `BITINT_MAXWIDTH` before using large widths.

## Literals, initialization and assertions

### Digit separators and binary literals

You saw them in `variables-y-constantes`: `1'000'000` and `0b1010`. Both are **standard** in C23; before, binary literals were a GCC and Clang **extension**, and separators did not exist.

C23 also adds the `%b` conversion to `printf` to show a number in binary.

> **Portability:** `%b` depends on the **library**, not on the compiler. glibc 2.35 or later implements it; the macOS library, at the time of writing, does not (it prints a literal `b`). If you need portability, write your own function that prints the bits.

### The empty initializer `= {}`

In C17, to zero an array or a structure you wrote `= {0}`. C23 accepts `= {}`, which initializes **everything** to zero (pointers to null). **Standard** C23; before, it was a GCC **extension**.

```c
#include <stdio.h>

struct Point {
    int x;
    int y;
};

int main(void) {
    struct Point p = {};
    int counts[5] = {};
    printf("%d %d %d\n", p.x, p.y, counts[4]);
    return 0;
}
```

### `static_assert` without a message

`static_assert` checks a condition **at compile time**: if it is false, compilation fails. In C11 you wrote `_Static_assert(condition, "message")` (or `static_assert` after including `<assert.h>`). In C23, `static_assert` is a keyword and the message is optional. **Standard** C23.

```c
#include <stdio.h>

static_assert(sizeof(int) >= 4);
static_assert(sizeof(long long) == 8, "this program assumes a 64-bit long long");

int main(void) {
    puts("The assumptions about sizes hold");
    return 0;
}
```

## Attributes

An **attribute** is an annotation between `[[` and `]]` that gives the compiler extra information. It does not change the meaning of a correct program, but it enables better warnings. C23 standardizes the syntax and these attributes (**standard** C23):

| Attribute | Meaning |
| --- | --- |
| `[[nodiscard]]` | Ignoring the return value is probably a bug |
| `[[maybe_unused]]` | Do not warn if this variable or parameter is unused |
| `[[deprecated]]` | Warn whoever uses this function: it is obsolete |
| `[[fallthrough]]` | In a `switch`, falling into the next `case` is intentional |
| `[[noreturn]]` | The function never returns (replaces C11's `_Noreturn`) |

```c
#include <stdio.h>
#include <stdlib.h>

[[nodiscard]] int open_resource(void) {
    return 0; // 0: success
}

[[noreturn]] void fail(const char *reason) {
    fprintf(stderr, "Fatal error: %s\n", reason);
    exit(EXIT_FAILURE);
}

int points_for_level(int level) {
    int points = 0;
    switch (level) {
    case 2:
        points += 20;
        [[fallthrough]];
    case 1:
        points += 10;
        break;
    default:
        break;
    }
    return points;
}

int main(void) {
    [[maybe_unused]] int debugging = 1;
    if (open_resource() != 0) {
        fail("could not open the resource");
    }
    printf("%d\n", points_for_level(2));
    return 0;
}
```

If you call `open_resource();` without using the result, the compiler warns. And if someone calls a function marked `[[deprecated("use the new version")]]`, they see that message in the warning.

> **Portability:** prefixed attributes such as `[[gnu::packed]]` or `[[clang::...]]` are compiler **extensions**. You can ask whether an attribute exists with `__has_c_attribute(nodiscard)` in an `#if`.

## `#embed`: including a binary file

To put a file (an image, an icon, a table) inside the program, you used to convert it to an array with an external tool. C23 adds the **`#embed`** directive, which the preprocessor replaces with the list of the file's bytes, separated by commas. **Standard** C23 (Clang 19, GCC 15).

<!-- c-check: skip -->
```c
#include <stdio.h>

static const unsigned char icon[] = {
#embed "icon.png"
};

int main(void) {
    printf("The icon takes %zu bytes\n", sizeof icon);
    return 0;
}
```

That example needs an `icon.png` file next to the source code. The next one compiles anywhere, because it embeds **itself** (`__FILE__` is the name of the source file) and counts its lines:

```c
#include <stdio.h>

int main(void) {
    static const char source[] = {
#embed __FILE__
    };
    size_t lines = 0;
    for (size_t i = 0; i < sizeof source; i++) {
        if (source[i] == '\n') {
            lines++;
        }
    }
    printf("%zu bytes, %zu lines\n", sizeof source, lines);
    return 0;
}
```

`#embed` accepts parameters, such as `limit(n)` to include at most `n` bytes, and `__has_embed(...)` lets you ask in an `#if` whether the file exists.

> **Portability:** if your compiler is older than GCC 15 or Clang 19, `#embed` does not exist; the classic alternative is to generate the array with a tool such as `xxd -i file`.

## The standard library in C23

### `unreachable()`

The `unreachable()` macro from `<stddef.h>` tells the compiler that a point of the program is **never reached**. The compiler may optimize assuming so. If it is actually reached, the behavior is **undefined**, so use it only when you can prove it. **Standard** C23.

```c
#include <stdio.h>
#include <stddef.h>

// Precondition: day is between 0 and 2.
const char *shift(int day) {
    switch (day) {
    case 0:
        return "morning";
    case 1:
        return "afternoon";
    case 2:
        return "night";
    default:
        unreachable();
    }
}

int main(void) {
    printf("%s\n", shift(1));
    return 0;
}
```

### `strdup`, `strndup` and `memccpy`

These functions existed in POSIX for decades, but not in standard C. C23 adds them to `<string.h>`:

- `strdup(s)` returns a new copy of the string in dynamic memory (the caller owns it and must release it with `free`), or `NULL` if there is no memory.
- `strndup(s, n)` copies at most `n` characters.
- `memccpy(dest, src, c, n)` copies bytes until it finds the byte `c` or completes `n`; it returns a pointer to the byte after the copied `c`, or `NULL` if it did not find it.

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    char *copy = strdup("hello, world");
    if (copy == NULL) {
        return 1;
    }
    char first[20];
    char *end = memccpy(first, copy, ',', sizeof first);
    if (end != NULL) {
        end[-1] = '\0'; // replace the comma with the string terminator
    }
    printf("[%s] [%s]\n", copy, first);
    free(copy);
    return 0;
}
```

> **Portability:** POSIX libraries (glibc, macOS's) already had these functions; on Windows with MSVC, `strdup` is called `_strdup`.

### Checked integer arithmetic: `<stdckdint.h>`

Signed integer overflow is undefined behavior, and detecting it **after** it happened is too late. C23 adds `<stdckdint.h>` with `ckd_add`, `ckd_sub` and `ckd_mul`: they compute the operation, store the result through the pointer you pass and return `true` if the result **did not fit** in that type. **Standard** C23.

```c
#include <stdio.h>
#include <limits.h>
#include <stdckdint.h>

int main(void) {
    int result;
    if (ckd_add(&result, INT_MAX, 1)) {
        puts("INT_MAX + 1 overflows an int");
    }

    long long product;
    if (!ckd_mul(&product, 3LL, 1'000'000'000LL)) {
        printf("3 * 10^9 = %lld\n", product);
    }
    return 0;
}
```

There is no undefined behavior here: `ckd_add` reports the overflow instead of causing it.

## Summary: what is what

| Feature | Status in C23 | Before C23 |
| --- | --- | --- |
| `bool`, `true`, `false` as keywords | standard | `<stdbool.h>` (C99) |
| `nullptr`, `nullptr_t` | standard | did not exist |
| `constexpr` (objects only) | standard | did not exist |
| `typeof`, `typeof_unqual` | standard | `typeof` was a GCC/Clang extension |
| `auto` with inference | standard | `auto` meant something else |
| `[[nodiscard]]` and the other attributes | standard | `__attribute__` (extension) |
| `static_assert` without a message | standard | `_Static_assert` with a message (C11) |
| `0b1010`, `1'000` | standard | binary: extension; separators: no |
| `#embed` | standard | did not exist |
| `_BitInt(N)` | standard, maximum width per implementation | did not exist |
| `enum E : type` | standard | did not exist |
| `= {}` | standard | GCC extension |
| `unreachable()` | standard | `__builtin_unreachable` (extension) |
| `strdup`, `memccpy` | standard | POSIX |
| `<stdckdint.h>` | standard | `__builtin_add_overflow` (extension) |
| `<threads.h>`, `<stdatomic.h>` | **optional** since C11 | — |
| `%b` in `printf` | standard, depending on the library | did not exist |

## Common mistakes

- Believing `-std=c23` guarantees all of C23: the compiler or the library may lack some part.
- Using `__attribute__`, `__builtin_...` or `typeof` in C17 code believing they are standard: they are **extensions**.
- Using `unreachable()` as "this should not happen": if it can happen, it is undefined behavior. For that, use a check and an error message.
- Writing `constexpr` on a function: in C23 it only applies to objects.
- Overusing `auto`: in C, an explicit type usually communicates better.

## Summary

- C evolved through C89, C99, C11, C17 and C23; `__STDC_VERSION__` is `202311L` in C23.
- Every feature is **standard**, a compiler **extension** or **optional**; `-Wpedantic` warns about extensions.
- C23 adds `nullptr`, `constexpr`, `typeof`, `auto`, standard attributes, `#embed`, `_BitInt(N)`, enums with an underlying type, `= {}`, `unreachable()`, `strdup`/`memccpy` and `<stdckdint.h>`.
- Support depends on the compiler and library versions: check before you rely on a feature.

## Practice exercises

### Exercise 1: classify

For each item, say whether it is **standard** C23, a compiler **extension** or **optional**: `__attribute__((packed))`, `<threads.h>`, `typeof`, `[[gnu::always_inline]]`, `nullptr`, `__builtin_expect`.

<details><summary>Show solution</summary>

- `__attribute__((packed))`: GCC and Clang extension.
- `<threads.h>`: optional (since C11); if missing, the implementation defines `__STDC_NO_THREADS__`.
- `typeof`: standard in C23 (an extension before).
- `[[gnu::always_inline]]`: the `[[...]]` syntax is standard, but the `gnu::` prefixed attribute is an extension.
- `nullptr`: standard C23.
- `__builtin_expect`: GCC and Clang extension.

</details>

### Exercise 2: from `#define` to `constexpr`

Rewrite this fragment with `constexpr` and explain what you gain:

```c
#define ROWS 3
#define COLUMNS 4
#define TOTAL ROWS * COLUMNS
```

<details><summary>Show solution</summary>

```c
constexpr int ROWS = 3;
constexpr int COLUMNS = 4;
constexpr int TOTAL = ROWS * COLUMNS;
```

You gain a type (`int`), scope like any variable and a compile-time check. A classic bug of the `#define` version also disappears: `TOTAL` has no parentheses, so `100 / TOTAL` expands to `100 / 3 * 4`, which is `132`, not `8`. With `constexpr`, `100 / TOTAL` is `8`.

</details>

### Exercise 3: addition without overflow

Write a function `bool add_checked(int a, int b, int *result)` that returns `false` if the sum overflows, using `<stdckdint.h>`. Test it with `INT_MAX` and `1`, and with `2` and `3`.

<details><summary>Show solution</summary>

```c
#include <stdio.h>
#include <limits.h>
#include <stdckdint.h>

bool add_checked(int a, int b, int *result) {
    return !ckd_add(result, a, b);
}

int main(void) {
    int r;
    if (!add_checked(INT_MAX, 1, &r)) {
        puts("INT_MAX + 1: overflows");
    }
    if (add_checked(2, 3, &r)) {
        printf("2 + 3 = %d\n", r);
    }
    return 0;
}
```

</details>

### Exercise 4: detect the standard

Write a program that prints `C23`, `C17`, `C11`, `C99` or `older than C99` depending on `__STDC_VERSION__`. What does it print when compiled with `-std=c17`? And with `-std=c23`?

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int main(void) {
#if __STDC_VERSION__ >= 202311L
    puts("C23");
#elif __STDC_VERSION__ >= 201710L
    puts("C17");
#elif __STDC_VERSION__ >= 201112L
    puts("C11");
#elif __STDC_VERSION__ >= 199901L
    puts("C99");
#else
    puts("older than C99");
#endif
    return 0;
}
```

With `-std=c17` it prints `C17`; with `-std=c23`, `C23`. In C89 the macro does not exist and, in an `#if`, an undefined identifier is `0`, so it prints `older than C99`.

</details>

### Exercise 5: attributes that warn

Mark this function so the compiler warns if someone ignores its result, and also warns that it is obsolete and `read_int_checked` should be used instead:

```c
int read_int(void);
```

<details><summary>Show solution</summary>

```c
[[nodiscard]] [[deprecated("use read_int_checked")]] int read_int(void);
```

You can also write both attributes in a single list: `[[nodiscard, deprecated("use read_int_checked")]]`.

</details>
