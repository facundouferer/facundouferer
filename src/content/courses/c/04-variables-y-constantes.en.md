---
title: 'Variables and Constants'
course: 'c'
slug: 'variables-y-constantes'
order: 4
lang: 'en'
published: true
---

**Variables** and **constants** are the foundation of almost every program. Before asking the user for data, before making decisions and before repeating tasks, a program needs to **store information** and give it a name.

## Objectives

By the end of this lesson you will be able to:

- explain what a variable is and what declaring, initializing and assigning it mean
- recognize why reading an uninitialized variable is a bug
- choose valid and clear names for your variables
- write integer, floating, character and string literals, with the `u`, `l` and `f` suffixes
- declare constants with `const` and with `#define`, and decide when each one fits

**Prerequisites:** lessons 1 (*Introduction and structure*), 2 (*Processes and states*) and 3 (*Compilation and linking*). Every program is compiled with the course command:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic program.c -o program
```

## What is a variable?

A **variable** is a piece of memory that has:

1. a **data type**, which says what kind of value it holds
2. a **name**, which the program uses to find it
3. a **value**, which can change while the program runs

Think of a labeled box: the label is the name, the content is the value, and the type says what fits in the box.

```c
int age = 18;
```

- `int` says the variable holds an integer
- `age` is the name
- `18` is the initial value

A useful mental model to start with:

```text
age       → 18
price     → 1499.50
initial   → F
```

Real memory does not look like this, but the idea is right: **each variable reserves a place for a piece of data, and its name lets the program find it**.

## Declaring, initializing and assigning

These three ideas look alike, but they are not the same.

**Declaring** tells the compiler that the variable exists and what type it has:

```c
int age;
```

**Initializing** gives it a value at the moment it is declared:

```c
int age = 18;
```

**Assigning** stores a value in a variable that already exists, with the `=` operator:

```c
int age;
age = 18;
age = 19;
```

After those lines, `age` is `19`. The variable is the same; its content changed. That is why it is called a *variable*.

You can declare several variables of the same type on one line, although one per line usually reads better:

```c
int width = 3, height = 4;
```

## Uninitialized variables: a real bug

This is one of the most important rules of the lesson.

A local variable declared without an initializer has an **indeterminate value**. It is not zero or any "default" value: it holds whatever was left in that piece of memory. **Reading that value before assigning one is a bug in the program**, even if it compiles and sometimes seems to work.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int total;           // declared, but never initialized
    total = total + 10;  // BUG: reads an indeterminate value
    printf("%d\n", total);
    return 0;
}
```

With `-Wall` the compiler usually warns you (`variable 'total' is uninitialized when used here`). That warning is a logic error: fix it, do not ignore it.

The fix is simple: **initialize every variable with a value that makes sense** for your program.

```c
int total = 0;
double price = 0.0;
char initial = ' ';
```

The initial value will not always be zero, but the program must always know which value it starts with.

## Rules for naming variables

A name (in C it is called an **identifier**):

- may use letters, digits and the underscore `_`
- must start with a letter or `_`
- cannot start with a digit
- cannot contain spaces or hyphens
- cannot be a reserved word (`int`, `float`, `return`, `const`...)
- is case-sensitive: `age` and `Age` are different names

Valid:

```text
age
studentAge
number1
final_price
```

Invalid:

```text
1age           (starts with a digit)
my age         (contains a space)
float          (reserved word)
final-price    (the hyphen is the minus operator)
```

> **Portability:** names that start with an underscore followed by an uppercase letter (`_Total`) or with two underscores (`__total`) are reserved for the compiler and the standard library. Avoid starting your names with `_`.

### Good names

A valid name is not necessarily a clear one. Compare:

```c
int x;
float a;
```

with:

```c
int studentCount;
float productPrice;
```

A good name describes the data and saves the reader from guessing. Pick one style (`studentCount` or `student_count`) and keep it across the whole program.

## Literals

A **literal** is a value written directly in the code, such as `18`, `3.5` or `'A'`. Every literal has a type, and knowing it avoids surprises.

### Integer literals

```c
int decimal = 255;
int hexadecimal = 0xFF;  // 255 in base 16
int octal = 0377;        // 255 in base 8: the leading 0 changes the base!
```

A leading `0` makes the number octal: `010` is `8`, not `10`. Do not add leading zeros "to line things up".

**Suffixes** change the type of the literal:

| Literal | Type |
| --- | --- |
| `100` | `int` |
| `100u` | `unsigned int` |
| `100l` | `long` |
| `100ul` | `unsigned long` |
| `100ll` | `long long` |

They can be written in uppercase (`100L`); in fact `L` is recommended because `l` looks like `1`. The `unsigned` and `long` types are covered in lesson 5.

### Floating literals

```c
double pi = 3.14159;     // no suffix: it is a double
float gravity = 9.81f;   // f suffix: it is a float
double big = 1.5e6;      // scientific notation: 1,500,000
```

A literal with a decimal point and no suffix is a `double`. If you store it in a `float`, write the `f` suffix so the type of the literal matches the type of the variable.

### Character literals

A character goes between **single quotes**:

```c
char letter = 'A';
char newline = '\n';    // escape sequence: line break
char quote = '\'';      // a single quote
char backslash = '\\';  // a backslash
```

`'7'` is not the same as `7`: the first is the character seven, the second is the number seven.

### String literals

A string goes between **double quotes**: `"Hello, world\n"`. You already used one with `printf`. For now we only use strings to display text; how they are stored and manipulated comes in lesson 21.

> **Modern C (C23):** you can separate the digits of a long number with apostrophes to read it better: `1'000'000` is the same as `1000000`. C23 also adds binary literals to the standard: `0b1010` is `10`.
>
> **Portability:** before C23, binary literals were a GCC and Clang extension, not standard C, and digit separators did not exist. Do not use them with `-std=c17`.

## Constants

A **constant** is a piece of data that must not change while the program runs: the days of the week, the months of the year, a fixed tax rate. Giving it a name instead of writing a bare number (a "magic number") makes the code clearer and easier to change.

C offers two tools: `const` and `#define`.

### Constants with `const`

```c
const int DAYS_PER_WEEK = 7;
const double TAX_RATE = 0.21;
```

`const` creates a typed object that **cannot be modified**. If you try to assign to it, the program does not compile:

<!-- c-check: skip -->
```c
int main(void) {
    const int DAYS_PER_WEEK = 7;
    DAYS_PER_WEEK = 8;   // error: cannot assign to variable with const-qualified type
    return 0;
}
```

That error helps you: the compiler protects a value you decided is fixed.

### Constants with `#define`

```c
#define MONTHS_PER_YEAR 12
#define PI 3.14159
```

`#define` is a **preprocessor** directive (you saw it in lesson 3). Before compiling, the preprocessor replaces every occurrence of `MONTHS_PER_YEAR` with the text `12`. It creates no variable: it is a text substitution. That is why it has no `=` and no `;`.

Because it is just text, a macro without parentheses can give unexpected results:

```c
#define SIDE 2 + 3
int area = SIDE * SIDE;   // becomes 2 + 3 * 2 + 3, which is 11, not 25
```

The rule: if a macro's value is an expression, wrap it in parentheses: `#define SIDE (2 + 3)`.

### When to use each one

| | `const` | `#define` |
| --- | --- | --- |
| What it is | a typed object | text replaced before compiling |
| Type | yes, checked by the compiler | no type of its own |
| Scope | follows the braces `{}` where it is declared | valid from the `#define` line to the end of the file |
| Visible in the debugger | yes | no |

Rule of thumb:

- prefer **`const`** for typed values your program uses (`const double TAX_RATE = 0.21;`)
- use **`#define`** when you need a constant the preprocessor or the compiler must know before the program runs, such as the size of an array (lesson 19), or to configure the build

By convention, constants are written in UPPERCASE with underscores, especially macros, so they stand out from variables at a glance.

> **Modern C (C23):** C23 adds `constexpr`, which declares typed constants the compiler knows at compile time and replaces many uses of `#define`. It is covered in the advanced module (*Modern C and C23*); this basic course uses `const` and `#define`.

## Complete example

```c
#include <stdio.h>

#define MONTHS_PER_YEAR 12

int main(void) {
    const double TAX_RATE = 0.21;
    int age = 18;
    double price = 1500.0;
    char initial = 'F';

    age = age + 1;   // assignment: now it is 19

    printf("Age: %d\n", age);
    printf("Initial: %c\n", initial);
    printf("Price with tax: %f\n", price + price * TAX_RATE);
    printf("Months per year: %d\n", MONTHS_PER_YEAR);

    return 0;
}
```

`%d`, `%c` and `%f` tell `printf` how to display an integer, a character and a number with decimals. You will study them in depth in lesson 6.

## Common mistakes

1. **Reading an uninitialized variable.** Its value is indeterminate. Always initialize.
2. **Confusing declaring with initializing.** `int age;` only declares; `int age = 18;` declares and initializes.
3. **Writing leading zeros.** `010` is octal and equals `8`.
4. **Storing a `double` literal in a `float` without a suffix.** Write `9.81f`.
5. **Macros without parentheses.** `#define SIDE 2 + 3` breaks the math.
6. **Magic numbers.** If a fixed value has a meaning, give it a name with `const` or `#define`.

## Summary

- a **variable** has a type, a name and a value that can change
- **declaring** creates the variable; **initializing** gives it a value when it is created; **assigning** gives it a value later
- an uninitialized local variable has an **indeterminate** value: reading it is a bug
- identifiers follow fixed rules and are case-sensitive
- every **literal** has a type; the `u`, `l`, `ll` and `f` suffixes change it
- `const` creates a typed constant; `#define` performs a text substitution
- C23 adds digit separators, standard binary literals and `constexpr`

## Practice exercises

### Exercise 1: predict the output

Without running it, what does this program print?

```c
#include <stdio.h>

#define BASE 4 + 1

int main(void) {
    int result = BASE * 2;
    printf("%d\n", result);
    return 0;
}
```

<details><summary>Show solution</summary>

It prints `6`, not `10`. The preprocessor replaces the text and the expression becomes `4 + 1 * 2`, where the multiplication goes first: `4 + 2 = 6`. Fix: `#define BASE (4 + 1)`, and then the result is `10`.

</details>

### Exercise 2: find the bug

This program should add three prices, but sometimes it prints an absurd number. Why?

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    double total;
    total = total + 120.5;
    total = total + 80.0;
    total = total + 49.5;
    printf("Total: %f\n", total);
    return 0;
}
```

<details><summary>Show solution</summary>

`total` is not initialized: its value is indeterminate and the first addition reads it. It is a bug even though it compiles. Fix:

```c
#include <stdio.h>

int main(void) {
    double total = 0.0;
    total = total + 120.5;
    total = total + 80.0;
    total = total + 49.5;
    printf("Total: %f\n", total);
    return 0;
}
```

Now it prints `Total: 250.000000`.

</details>

### Exercise 3: choose literals and constants

Rewrite these lines so the type of each literal matches the type of the variable and the fixed numbers have names:

```c
float temperature = 36.5;
double finalPrice = 2000.0 + 2000.0 * 0.21;
int days = 7 * 4;
```

<details><summary>Show solution</summary>

```c
#include <stdio.h>

#define DAYS_PER_WEEK 7

int main(void) {
    const double TAX_RATE = 0.21;
    const double BASE_PRICE = 2000.0;

    float temperature = 36.5f;
    double finalPrice = BASE_PRICE + BASE_PRICE * TAX_RATE;
    int days = DAYS_PER_WEEK * 4;

    printf("%f %f %d\n", temperature, finalPrice, days);
    return 0;
}
```

The `f` suffix makes `36.5f` a `float`. `TAX_RATE` and `BASE_PRICE` are typed values, so they use `const`; `DAYS_PER_WEEK` could be either one.

</details>

### Exercise 4: valid names

Which of these identifiers are valid in C? `total2`, `2total`, `final_price`, `final-price`, `return`, `Return`.

<details><summary>Show solution</summary>

Valid: `total2`, `final_price` and `Return` (C is case-sensitive, so `Return` is not the reserved word `return`, although using it would be confusing). Invalid: `2total` (starts with a digit), `final-price` (the hyphen is the minus operator) and `return` (reserved word).

</details>
