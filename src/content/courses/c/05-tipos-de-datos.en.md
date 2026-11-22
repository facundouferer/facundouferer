---
title: 'Data Types'
course: 'c'
slug: 'tipos-de-datos'
order: 5
lang: 'en'
published: true
---

In the previous lesson you stored values in variables. Now a fundamental question appears:

> What kind of data am I really storing, and what can happen to it?

In C it is not enough to say "I want to store a number". You have to say **what kind of number**, because the type decides which values fit, how much memory is used and what result operations produce.

## Objectives

By the end of this lesson you will be able to:

- tell apart signed and `unsigned` integer types
- distinguish the minimum ranges the standard guarantees from the actual sizes on your machine
- look up limits with `<limits.h>` (`INT_MAX`) and sizes with `sizeof`, whose result is a `size_t` printed with `%zu`
- choose between `float` and `double` knowing they are approximate
- use `bool` both in basic C and in C23
- predict an **implicit conversion** and write an **explicit conversion** with a cast such as `(double)`
- recognize overflow of signed and unsigned integers

**Prerequisites:** lessons 1 to 4, especially *Variables and constants* (literals and their suffixes).

## What is a data type?

A **data type** tells the compiler:

- which values a variable can hold (its **domain** or **range**)
- how much memory it takes
- how its bits are interpreted
- which operations make sense and what result they produce

C's basic types are the **integer** types (`char`, `short`, `int`, `long`, `long long`), the **floating** types (`float`, `double`, `long double`) and the **boolean** type (`bool`).

## Integer types

Integers hold numbers without a fractional part. C offers several sizes:

```c
short       steps = 1200;
int         age = 18;
long        population = 46000000L;
long long   diskBytes = 512000000000LL;
```

### Signed and unsigned

Every integer type comes in two versions:

- **signed** (the default): holds negatives, zero and positives
- **`unsigned`**: holds only zero and positives, but reaches twice as high

```c
int temperature = -5;         // can be negative
unsigned int visits = 3000u;  // never negative
```

`unsigned` is meant for quantities that are never negative and for working with bits. For ordinary arithmetic, `int` is the natural choice: mixing signed and unsigned brings surprises, as you will see below.

### Guaranteed ranges and actual sizes

The C standard **does not fix** the exact size of each type: it fixes a **guaranteed minimum** and an order (`short` ≤ `int` ≤ `long` ≤ `long long`). Each compiler and platform picks the actual size.

| Type | Guaranteed minimum | Typical size on 64-bit Linux/macOS |
| --- | --- | --- |
| `char` | 8 bits | 8 bits |
| `short` | 16 bits | 16 bits |
| `int` | 16 bits | 32 bits |
| `long` | 32 bits | 64 bits (32 bits on Windows) |
| `long long` | 64 bits | 64 bits |

Practical consequence: a program that needs to store 3,000,000,000 should not rely on `int` or `long`, because on some platforms they are too small. `long long` is guaranteed to fit it.

> **Modern C (C23):** C23 requires signed integers to use **two's complement**, which every current machine already did. So a 32-bit `int` goes from −2,147,483,648 to 2,147,483,647 on every C23 compiler.

### `<limits.h>`: your machine's limits

Instead of memorizing numbers, look them up. The `<limits.h>` header defines constants with the actual limits:

```c
#include <stdio.h>
#include <limits.h>

int main(void) {
    printf("int:          from %d to %d\n", INT_MIN, INT_MAX);
    printf("unsigned int: from 0 to %u\n", UINT_MAX);
    printf("long long:    up to %lld\n", LLONG_MAX);
    printf("bits per char: %d\n", CHAR_BIT);
    return 0;
}
```

On a typical 64-bit machine it prints:

```text
int:          from -2147483648 to 2147483647
unsigned int: from 0 to 4294967295
long long:    up to 9223372036854775807
bits per char: 8
```

Notice the specifiers: `%d` for `int`, `%u` for `unsigned int`, `%lld` for `long long`. Each type has its own; lesson 6 gathers them in a table.

## `sizeof` and `size_t`

The **`sizeof`** operator returns how many bytes a type or a variable takes. It is computed at compile time, not at run time.

```c
#include <stdio.h>

int main(void) {
    double height = 1.75;

    printf("char:      %zu byte\n", sizeof(char));
    printf("int:       %zu bytes\n", sizeof(int));
    printf("long long: %zu bytes\n", sizeof(long long));
    printf("height:    %zu bytes\n", sizeof height);
    return 0;
}
```

Important details:

- `sizeof(char)` is **always 1**, by definition. Every other size is measured in "number of `char`s".
- With a type you need parentheses: `sizeof(int)`. With a variable they are optional: `sizeof height`.
- The result has type **`size_t`**: an unsigned integer meant for sizes and counts. It is printed with **`%zu`**. Using `%d` is a format error, and `-Wall` warns you.

```c
size_t bytes = sizeof(int);
```

You will see `size_t` everywhere: in array sizes, string lengths and dynamic memory.

## Floating types

`float`, `double` and `long double` hold numbers with a fractional part, **approximately**.

| Type | Typical precision | Literal |
| --- | --- | --- |
| `float` | about 6-7 decimal digits | `1.5f` |
| `double` | about 15-16 decimal digits | `1.5` |
| `long double` | same as or more than `double` | `1.5L` |

Use `double` unless you have a reason to save memory: it is the type of decimal literals and the one math functions use.

Being approximate has consequences. `0.1` has no exact binary representation:

```c
#include <stdio.h>

int main(void) {
    double sum = 0.1 + 0.2;
    printf("%.17f\n", sum);
    return 0;
}
```

It prints `0.30000000000000004`. That is why you should **not compare floating numbers with `==`**: check whether their difference is very small. And never use `float` or `double` for exact money: work in cents with integers.

## `char`: a small integer

A `char` holds a character, but it is really a **small integer**: the character's numeric code. In ASCII, `'A'` is 65.

```c
#include <stdio.h>

int main(void) {
    char letter = 'A';
    char next = letter + 1;

    printf("%c is %d\n", letter, letter);
    printf("The next one is %c\n", next);
    return 0;
}
```

It prints `A is 65` and `The next one is B`. With `%c` you see the character; with `%d`, its number.

> **Portability:** whether plain `char` is signed or not depends on the compiler. When you use it as a small number, write `signed char` or `unsigned char` explicitly.

## `bool`: true or false

A boolean holds only two values: true or false. In C, `false` is `0` and `true` is `1`. Any nonzero value converted to `bool` becomes `true`.

> **Basic C:** C89 had no boolean type; people used `int` with 0 and 1. C99 added the `_Bool` type and the `<stdbool.h>` header, which defines the names `bool`, `true` and `false`. In C99 and C17 you must include it:
>
> ```c
> #include <stdbool.h>
>
> bool passed = true;
> ```
>
> **Modern C (C23):** `bool`, `true` and `false` are **keywords** of the language. They work without including anything, and `true` and `false` have type `bool`.
>
> **Portability:** if your code must also compile with `-std=c17` or earlier, include `<stdbool.h>`. In C23 including it is harmless.

```c
#include <stdio.h>

int main(void) {
    bool passed = true;
    bool inDebt = 0;
    bool something = 25;   // any nonzero value becomes true

    printf("%d %d %d\n", passed, inDebt, something);
    return 0;
}
```

It prints `1 0 1`.

## Conversions between types

When an expression mixes different types, C converts the values to a common type. There are two kinds of conversion.

### Implicit conversion

An **implicit conversion** is done by the compiler without you writing it. It happens in three main situations.

**1. On assignment.** The value is converted to the type of the variable that receives it. From `double` to `int` the **fractional part is discarded** (truncated toward zero, not rounded):

```c
double price = 9.99;
int whole = price;    // whole is 9
double real = 7;      // real is 7.0
```

If you write the literal directly (`int whole = 9.99;`), Clang warns that the value changes: a hint that you probably did not want to lose the decimals.

**2. Integer promotions.** Before operating, types smaller than `int` (`char`, `short`, `bool`) are converted to `int`. That is why `'A' + 1` gives an `int` (66).

**3. Usual arithmetic conversions.** If the two operands have different types, the one with the lower rank is converted to the higher one:

- `int` with `double` → computed in `double`: `5 + 2.5` is `7.5`
- `int` with `long` → computed in `long`
- `int` with `unsigned int` → **computed in `unsigned int`**

That last rule is the classic trap.

### The trap of mixing signed and unsigned

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int minusOne = -1;
    unsigned int one = 1u;

    printf("%d\n", minusOne < one);   // prints 0: "false"
    return 0;
}
```

Mathematically −1 is less than 1, but the program says it is not. To compare, `minusOne` is converted to `unsigned int`, and −1 becomes the largest unsigned value (`UINT_MAX`, 4,294,967,295). With `-Wextra` the compiler warns: `comparison of integers of different signs`. Take it seriously: **do not mix signed and unsigned integers in a comparison**.

### Explicit conversion (cast)

An **explicit conversion** is one you request by writing the type in parentheses before the value. It is called a **cast**:

```c
(double)sum
(int)3.75     // is 3
```

Its most frequent use is avoiding **integer division**. When both operands are integers, `/` discards the decimals:

```c
#include <stdio.h>

int main(void) {
    int sum = 17;
    int count = 4;

    double wrong = sum / count;             // 17 / 4 is 4 (integer), then 4.0
    double right = (double)sum / count;     // 17.0 / 4 is 4.25
    double late = (double)(sum / count);    // the cast comes too late: 4.0

    printf("%f %f %f\n", wrong, right, late);
    return 0;
}
```

It prints `4.000000 4.250000 4.000000`. The cast must act **before** dividing: `(double)sum / count` converts `sum`, and then the usual arithmetic conversion converts `count` too.

## Overflow: when the value does not fit

Every integer type has a range. What happens if a computation goes outside it?

- **Unsigned integers:** the result **wraps around** (arithmetic modulo 2ⁿ). This is defined by the standard: `UINT_MAX + 1u` is `0`.
- **Signed integers:** overflow is **undefined behavior**. The standard does not say what happens: the program may print a negative number, carry on with an absurd value, or behave differently when optimized. It is a bug.

```c
#include <stdio.h>
#include <limits.h>

int main(void) {
    unsigned int counter = UINT_MAX;
    counter = counter + 1u;
    printf("%u\n", counter);   // 0: unsigned values wrap around
    return 0;
}
```

For an `int`, the fix is choosing a type with enough range (`long long`) or checking before operating. In lesson 7 you will see exactly what "undefined behavior" means.

## Beyond the basic types

These types are used to build **derived types**: arrays (lesson 19), strings (lesson 21) and structures (lesson 22), which group several values. All of them rely on what you saw here: each element has a type, a size and a range.

## Common mistakes

1. **Assuming `int` is 32 bits everywhere.** The standard guarantees 16. Check `<limits.h>`.
2. **Printing `sizeof` with `%d`.** The result is a `size_t`: use `%zu`.
3. **Dividing integers and expecting decimals.** `7 / 2` is `3`. Use `(double)7 / 2`.
4. **Comparing signed and unsigned.** `-1 < 1u` is false.
5. **Comparing `double` values with `==`.** `0.1 + 0.2 == 0.3` is false.
6. **Overflowing an `int`.** It is undefined behavior, it does not "wrap around".

## Summary

- integers can be signed or `unsigned`; the standard guarantees minimum ranges, not exact sizes
- `<limits.h>` reports the actual limits (`INT_MAX`, `UINT_MAX`)
- `sizeof` gives the size in bytes as a `size_t`, printed with `%zu`
- `float` and `double` are approximate; prefer `double`
- `char` is a small integer
- `bool` comes from `<stdbool.h>` in C99/C17 and is a keyword in C23
- an **implicit conversion** happens on assignment, in integer promotions and in the usual arithmetic conversions
- an **explicit conversion** is written with a cast, such as `(double)`
- unsigned overflow wraps around; signed overflow is undefined behavior

## Practice exercises

### Exercise 1: predict the output

```c
#include <stdio.h>

int main(void) {
    int a = 7;
    int b = 2;

    double x = a / b;
    double y = (double)a / b;
    double grade = 9.9;
    int z = grade;

    printf("%f %f %d\n", x, y, z);
    return 0;
}
```

<details><summary>Show solution</summary>

It prints `3.000000 3.500000 9`.

- `a / b` is an integer division: `3`, which is then converted to `3.0`.
- `(double)a / b` converts `a` before dividing: `3.5`.
- Assigning `grade` (9.9) to an `int` discards the fractional part: `9`.

</details>

### Exercise 2: find the bug

This program computes the average of three grades, but with 7, 8 and 8 it prints `7.000000` instead of `7.666667`. The compiler also gives a warning. Fix both problems.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int g1 = 7, g2 = 8, g3 = 8;
    double average = (g1 + g2 + g3) / 3;
    printf("Average: %f\n", average);
    printf("Size of int: %d bytes\n", sizeof(int));
    return 0;
}
```

<details><summary>Show solution</summary>

1. `(g1 + g2 + g3) / 3` is an integer division (`23 / 3` is `7`). You must convert before dividing.
2. `sizeof` returns a `size_t`, printed with `%zu`, not `%d`.

```c
#include <stdio.h>

int main(void) {
    int g1 = 7, g2 = 8, g3 = 8;
    double average = (double)(g1 + g2 + g3) / 3;
    printf("Average: %f\n", average);
    printf("Size of int: %zu bytes\n", sizeof(int));
    return 0;
}
```

</details>

### Exercise 3: predict the comparison

What does each line print? Explain why.

```c
printf("%d\n", -1 < 1);
printf("%d\n", -1 < 1u);
printf("%d\n", (bool)-3);
```

<details><summary>Show solution</summary>

- `-1 < 1` prints `1`: both are `int`, the comparison is the expected one.
- `-1 < 1u` prints `0`: through the usual arithmetic conversion, `-1` is converted to `unsigned int` and becomes `UINT_MAX`, which is not less than 1.
- `(bool)-3` prints `1`: any nonzero value converts to `true`.

</details>

### Exercise 4: the right type

Choose the most suitable type for each piece of data and justify it: (a) the number of people on the planet (more than 8 billion); (b) whether a user is online; (c) the price of a product with cents, to display it; (d) the number of bytes a variable takes.

<details><summary>Show solution</summary>

- (a) `long long`: 8 billion does not fit in a 32-bit `int`, and `long` can be 32 bits on Windows.
- (b) `bool`.
- (c) `double` to display it; for exact money arithmetic, store the cents in an integer (`long long`).
- (d) `size_t`, the type `sizeof` returns.

</details>
