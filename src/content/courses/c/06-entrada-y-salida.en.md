---
title: 'Input and Output'
course: 'c'
slug: 'entrada-y-salida'
description: 'Display data with printf and its format specifiers, read input with scanf while checking its return value and clear the buffer on errors.'
order: 6
lang: 'en'
published: true
---

A program becomes useful when it can **display information** and **receive data**.

- **Output:** the program sends information outward, for example to the screen.
- **Input:** the program receives information from outside, for example from the keyboard.

In C, the two basic tools are `printf` (output) and `scanf` (input), both from `<stdio.h>`.

## Objectives

By the end of this lesson you will be able to:

- display text and values with `printf` using the right specifier for each type, including `%zu`
- control the field width and the precision of the output
- read data with `scanf` and explain informally why it needs `&`
- use the value `scanf` returns to **validate** input (`if (scanf("%d", &age) != 1)`)
- discard invalid input left pending with a `getchar` loop

**Prerequisites:** lessons 1 to 5, especially *Data types* (`int`, `double`, `char`, `size_t`, `unsigned`).

## Output with `printf`

```c
#include <stdio.h>

int main(void) {
    printf("Hello, world\n");
    return 0;
}
```

The text between double quotes is a string literal. `\n` is an **escape sequence** that represents a line break. Other useful ones:

| Escape | Meaning |
| --- | --- |
| `\n` | line break |
| `\t` | tab |
| `\"` | double quote |
| `\\` | backslash |

`printf` does not add a line break by itself: if you do not write `\n`, the next output continues on the same line.

## Displaying values: format specifiers

To display the value of a variable, you leave a **format specifier** in the text, starting with `%`, and pass the value after the string:

```c
int age = 18;
printf("The age is %d\n", age);
```

`%d` reserves the place of an `int`; `printf` replaces it with the value of `age` and prints `The age is 18`.

You can use several specifiers; the values are used in the same order:

```c
printf("%d students, average %f\n", count, average);
```

### Specifier table

| Type | Specifier in `printf` |
| --- | --- |
| `int` | `%d` |
| `unsigned int` | `%u` |
| `long` | `%ld` |
| `long long` | `%lld` |
| `size_t` (result of `sizeof`) | `%zu` |
| `double` and `float` | `%f` (or `%e` for scientific notation) |
| `char` | `%c` |
| string literal | `%s` |
| integer in hexadecimal | `%x` |
| the `%` character | `%%` |

**The specifier must match the type.** If it does not, the result is unpredictable: `printf` reads the bits of the value as if they belonged to another type. With `-Wall` the compiler checks the format string and warns (`format specifies type 'double' but the argument has type 'int'`).

### Field width and precision

Between the `%` and the letter you can say how the value looks:

- **width**: minimum number of characters; padded with spaces on the left. `%5d`
- **`-`**: left-aligns. `%-5d`
- **`0`**: pads with zeros. `%05d`
- **precision** (after a dot): number of decimals. `%.2f`
- width and precision together: `%8.2f`

```c
#include <stdio.h>

int main(void) {
    printf("[%5d]\n", 42);
    printf("[%-5d]\n", 42);
    printf("[%05d]\n", 42);
    printf("[%.2f]\n", 3.14159);
    printf("[%8.2f]\n", 3.14159);
    printf("[%zu]\n", sizeof(double));
    return 0;
}
```

Output:

```text
[   42]
[42   ]
[00042]
[3.14]
[    3.14]
[8]
```

Width is handy for aligned tables:

```c
#include <stdio.h>

int main(void) {
    printf("%-10s %6s\n", "Product", "Price");
    printf("%-10s %6.2f\n", "Bread", 1.5);
    printf("%-10s %6.2f\n", "Milk", 0.99);
    printf("%-10s %6.2f\n", "Cheese", 12.75);
    return 0;
}
```

```text
Product     Price
Bread        1.50
Milk         0.99
Cheese      12.75
```

## Input with `scanf`

`scanf` reads what the user types and stores it in variables:

```c
#include <stdio.h>

int main(void) {
    int age = 0;

    printf("Enter your age: ");
    scanf("%d", &age);
    printf("You are %d years old\n", age);

    return 0;
}
```

The general form is `scanf("specifiers", &variable1, &variable2, ...)`.

### Why `&`?

`printf` only needs **the value** of `age` to display it. `scanf`, on the other hand, has to **write** into `age`, and for that it needs to know where it is stored. `&age` means **"the address of the variable `age`"**: the place in memory where it lives. With that address, `scanf` can put the number it read there.

For now this informal idea is enough. In lesson 25 (*Pointers and addresses*) you will see exactly what an address is and how to work with it.

Forgetting the `&` is a serious bug: `scanf` would receive the variable's value instead of its address. `-Wall` catches it.

### `scanf` specifiers

They are almost the same as in `printf`, with one important difference:

| Type | `scanf` | `printf` |
| --- | --- | --- |
| `int` | `%d` | `%d` |
| `float` | `%f` | `%f` |
| `double` | **`%lf`** | `%f` |
| `char` | `" %c"` | `%c` |

To read a `double` you use `%lf`. With `%f`, `scanf` would write a `float` where a `double` lives.

## Validating input: the return value of `scanf`

What happens if the program asks for an age and the user types `hello`? `scanf` cannot convert `hello` into an integer, so it **does not modify the variable**. If the program carries on as if nothing happened, it works with data that was never read.

To notice, use what `scanf` **returns**: the number of variables it managed to fill.

- `scanf("%d", &age)` returns `1` if it read an integer
- it returns `0` if what was there was not an integer
- it returns `EOF` (a negative value) if the input ended

This is how you **validate** the read:

```c
#include <stdio.h>

int main(void) {
    int age = 0;

    printf("Enter your age: ");
    if (scanf("%d", &age) != 1) {
        printf("Error: an integer was expected.\n");
        return 1;
    }

    printf("You are %d years old\n", age);
    return 0;
}
```

`if` runs the block between braces only when the condition is true; you will study it in lesson 8. Here the condition is "`scanf` did not return 1". In that case the program reports the problem and ends with `return 1`, which tells the system there was an error (`return 0` means success).

The professional rule is simple: **every time you call `scanf`, compare its result with the number of values you asked for**. If you read two numbers, compare with 2:

```c
if (scanf("%d %d", &width, &height) != 2)
```

Validating the form is not the same as validating the content: `-5` is a valid integer for `scanf`, but not a valid age. You will do that second validation with `if` and operators (lessons 7 and 8).

## Invalid input stays in the buffer

What you type on the keyboard does not go straight to `scanf`: it is stored in an **input buffer**, a queue of characters that `scanf` consumes. When you press Enter, a `'\n'` is added at the end too.

When `scanf("%d", ...)` finds `hello`, it fails **without consuming those characters**. They stay in the buffer, and the next `scanf("%d", ...)` finds them again and fails again. If the program asked again and again, it would fail forever.

The fix is to **discard the rest of the line** before reading again, one character at a time, with `getchar`:

```c
int c;
while ((c = getchar()) != '\n' && c != EOF) {
    // discard
}
```

`getchar()` reads a single character from the buffer and returns it as an `int` (so it can also return `EOF`). The `while` loop repeats the read while the character is neither the line break nor the end of input. You will study `while` in lesson 11; for now use it as a recipe.

Complete program: if the first read fails, it discards the line and gives a second chance.

```c
#include <stdio.h>

int main(void) {
    int quantity = 0;
    int c;

    printf("Quantity: ");
    if (scanf("%d", &quantity) != 1) {
        while ((c = getchar()) != '\n' && c != EOF) {
            // discard the rest of the invalid line
        }
        printf("Not a number. Try again: ");
        if (scanf("%d", &quantity) != 1) {
            printf("Invalid input.\n");
            return 1;
        }
    }

    printf("Quantity: %d\n", quantity);
    return 0;
}
```

Asking again until the data is valid needs a loop; you will do it in the control flow module.

A subtle case: if the user types `12abc`, `scanf("%d", ...)` reads `12`, returns `1` and leaves `abc` in the buffer. The read succeeded, but the rest of the line is still pending.

## Reading a character: the space before `%c`

`%d` and `%lf` skip leading spaces and line breaks automatically. `%c` does **not**: it reads the next character, whatever it is. That is why this program seems to skip the second question:

```c
#include <stdio.h>

int main(void) {
    int wheels = 0;
    char initial = ' ';

    printf("Number of wheels: ");
    if (scanf("%d", &wheels) != 1) {
        return 1;
    }

    printf("Brand initial: ");
    if (scanf("%c", &initial) != 1) {   // reads the '\n' left by Enter
        return 1;
    }

    printf("Wheels: %d, initial: %c\n", wheels, initial);
    return 0;
}
```

After typing `4` and Enter, the buffer holds `4\n`. `%d` consumes the `4`, and `%c` takes the `'\n'` without waiting. The fix is a space before `%c`, which tells `scanf` to discard all preceding whitespace:

```c
scanf(" %c", &initial);
```

## Complete example

```c
#include <stdio.h>

int main(void) {
    int age = 0;
    double height = 0.0;
    char initial = ' ';

    printf("Age: ");
    if (scanf("%d", &age) != 1) {
        printf("Invalid age.\n");
        return 1;
    }

    printf("Height in meters: ");
    if (scanf("%lf", &height) != 1) {
        printf("Invalid height.\n");
        return 1;
    }

    printf("First initial: ");
    if (scanf(" %c", &initial) != 1) {
        printf("Could not read the initial.\n");
        return 1;
    }

    printf("%-8s %d\n", "Age:", age);
    printf("%-8s %.2f m\n", "Height:", height);
    printf("%-8s %c\n", "Initial:", initial);
    return 0;
}
```

## Common mistakes

1. **A specifier that does not match the type.** `printf("%d", 3.5)` or `printf("%d", sizeof(int))`. Use `%f` and `%zu`.
2. **Reading a `double` with `%f`.** In `scanf`, `double` goes with `%lf`.
3. **Forgetting `&` in `scanf`.** `scanf("%d", age)` is a serious bug.
4. **Not checking what `scanf` returns.** The program continues with data that was never read.
5. **Not discarding invalid input.** It stays in the buffer and makes the next read fail.
6. **`%c` without a leading space** after reading a number.

## Summary

- `printf` displays text and values; each type has its specifier (`%d`, `%u`, `%zu`, `%f`, `%c`, `%s`)
- width (`%5d`), alignment (`%-5d`) and precision (`%.2f`) control how the output looks
- `scanf` needs `&variable`, the address of the variable, to be able to write into it
- `scanf` returns how many values it read: always compare it to **validate** the input
- invalid input stays in the buffer; discard it with a `getchar` loop
- `" %c"` avoids reading the pending line break

## Practice exercises

### Exercise 1: predict the output

```c
#include <stdio.h>

int main(void) {
    int points = 7;
    double average = 8.456;

    printf("[%4d][%-4d][%03d]\n", points, points, points);
    printf("[%.1f][%7.2f]\n", average, average);
    printf("100%%\n");
    return 0;
}
```

<details><summary>Show solution</summary>

```text
[   7][7   ][007]
[8.5][   8.46]
100%
```

`%.1f` rounds to one decimal (8.456 → 8.5). `%7.2f` takes 7 characters in total, counting the dot. `%%` prints a `%`.

</details>

### Exercise 2: find the bugs

This program compiles with warnings and does not work. Find the three bugs.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    double price = 0.0;
    int units = 0;

    printf("Price: ");
    scanf("%f", &price);
    printf("Units: ");
    scanf("%d", units);

    printf("Total: %d\n", price * units);
    return 0;
}
```

<details><summary>Show solution</summary>

1. `price` is a `double`: `scanf` reads it with `%lf`.
2. The `&` is missing in `scanf("%d", units)`.
3. `price * units` is a `double`: it is printed with `%f`, not `%d`.

You should also validate every read:

```c
#include <stdio.h>

int main(void) {
    double price = 0.0;
    int units = 0;

    printf("Price: ");
    if (scanf("%lf", &price) != 1) {
        return 1;
    }
    printf("Units: ");
    if (scanf("%d", &units) != 1) {
        return 1;
    }

    printf("Total: %.2f\n", price * units);
    return 0;
}
```

</details>

### Exercise 3: validated sum

Write a program that asks for two integers in a single read, checks that both were read and prints their sum. If the input is not valid, it must print `Invalid input.` and end with `return 1`.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int main(void) {
    int a = 0;
    int b = 0;

    printf("Enter two integers: ");
    if (scanf("%d %d", &a, &b) != 2) {
        printf("Invalid input.\n");
        return 1;
    }

    printf("%d + %d = %d\n", a, b, a + b);
    return 0;
}
```

It compares with `2` because two values were requested. If the user types `5 x`, `scanf` returns `1` and the program detects it.

</details>

### Exercise 4: what does `scanf` return?

For `scanf("%d", &n)`, with `n` initialized to `0`, state what it returns, the value of `n` and what stays in the buffer for each input: (a) `25` and Enter; (b) `abc` and Enter; (c) `8kg` and Enter.

<details><summary>Show solution</summary>

- (a) It returns `1`, `n` is `25`, and `\n` stays in the buffer.
- (b) It returns `0`, `n` is still `0`, and `abc\n` stays in the buffer: discard it with the `getchar` loop.
- (c) It returns `1`, `n` is `8`, and `kg\n` stays in the buffer.

</details>
