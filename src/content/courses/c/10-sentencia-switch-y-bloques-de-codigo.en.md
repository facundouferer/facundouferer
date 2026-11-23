---
title: 'Switch Statement and Code Blocks'
course: 'c'
slug: 'sentencia-switch-y-bloques-de-codigo'
order: 10
lang: 'en'
published: true
---

An `else if` chain works for any decision, but when you compare **one integer expression** against several concrete values, C offers a more direct tool: `switch`. This lesson is also the moment to look closely at **code blocks** `{}` and one important consequence: the **scope** of variables.

## Objectives

By the end of this lesson you will be able to:

- write a `switch` on an integer or a `char`, with `case`, `break` and `default`
- explain which values a `case` accepts and which it does not
- predict what happens when `break` is missing (falling through to the next case) and mark a deliberate fall-through with `[[fallthrough]]` in C23
- group several values in the same case
- declare variables inside a `case` using a block
- explain what a block is, what the scope of a variable is and what shadowing is
- describe when a variable declared in a block is born and when it dies

**Prerequisites:** lessons 1 to 9, especially *Variables and constants* (`const`, `#define`) and *If-Else* (`else if` chains and the rule for choosing between `else if` and `switch`).

## The `switch` statement

```c
switch (expression) {
    case CONSTANT_1:
        statements;
        break;
    case CONSTANT_2:
        statements;
        break;
    default:
        statements;
        break;
}
```

It works like this:

1. the expression in parentheses is evaluated **once**
2. the program **jumps** to the `case` label whose value matches
3. it runs the statements from there until it finds a `break` (or the end of the `switch`)
4. if no `case` matches, it jumps to `default`; if there is no `default`, it runs nothing and continues after the `switch`

```c
#include <stdio.h>

int main(void) {
    int day = 3;

    switch (day) {
        case 1:
            printf("Monday\n");
            break;
        case 2:
            printf("Tuesday\n");
            break;
        case 3:
            printf("Wednesday\n");
            break;
        default:
            printf("Invalid value\n");
            break;
    }

    return 0;
}
```

## What can go in a `switch` and in a `case`

- The `switch` expression must have an **integer type**: `int`, `long`, `unsigned`, `bool` or `char`. You cannot `switch` on a `double` or on a string.
- Each `case` needs an **integer constant expression**: a literal (`3`, `'q'`), a `#define` constant or an expression made of them (`2 * 4`). Its value must be known at compile time.
- Two `case` labels cannot have the same value.
- A `case` compares for **equality** with one value. It does not accept ranges like `grade >= 6`; for that use an `else if` chain.

Since `char` is an integer type, a letter menu is a classic use:

```c
#include <stdio.h>

int main(void) {
    char option;

    printf("(a)dd, (d)elete, (q)uit: ");
    if (scanf(" %c", &option) != 1) {
        printf("Invalid input\n");
        return 1;
    }

    switch (option) {
        case 'a':
        case 'A':
            printf("Adding...\n");
            break;
        case 'd':
        case 'D':
            printf("Deleting...\n");
            break;
        case 'q':
        case 'Q':
            printf("Goodbye\n");
            break;
        default:
            printf("Unknown option: %c\n", option);
            break;
    }

    return 0;
}
```

Notice `case 'a': case 'A':`. Two labels in a row, with no statements between them, share the same code. That is how you group several values.

### Names for the values

Writing `case 1:` and `case 2:` forces you to remember what each number means. It is better to name them with `#define`:

```c
#include <stdio.h>

#define OPTION_ADD 1
#define OPTION_REMOVE 2
#define OPTION_QUIT 3

int main(void) {
    int option = OPTION_REMOVE;

    switch (option) {
        case OPTION_ADD:
            printf("Add\n");
            break;
        case OPTION_REMOVE:
            printf("Remove\n");
            break;
        case OPTION_QUIT:
            printf("Quit\n");
            break;
        default:
            printf("Unknown option\n");
            break;
    }

    return 0;
}
```

> **Basic C:** a `const int` variable is **not** a constant expression in C (unlike C++), so `case LIMIT:` with `const int LIMIT = 3;` is not standard C. Use `#define`. In the structures lesson you will see `enum`, the tool designed to name a set of integer values.
>
> **Modern C (C23):** a constant declared with `constexpr int` is a constant expression and can be used in a `case`.
>
> **Portability:** GCC and Clang accept ranges like `case 1 ... 5:`, but that is an **extension**, not standard C23; with `-Wpedantic` the compiler warns.

## `break` and falling through to the next case

`break` ends the `switch` and the program continues after its closing brace. If it is missing, execution **falls through** into the code of the next `case`, even if its value does not match, because `case` labels are only entry points:

<!-- c-check: skip -->
```c
switch (level) {
    case 1:
        printf("Level 1\n");
    case 2:
        printf("Level 2\n");
        break;
    default:
        printf("Other level\n");
        break;
}
```

With `level = 1` both "Level 1" and "Level 2" are printed. This is the most common `switch` bug. GCC catches it with `-Wextra` (`-Wimplicit-fallthrough`).

Rule of thumb: end every `case` with `break`, including the last one, even when it is not needed: that way nobody forgets it when adding a new case.

### Deliberate fall-through with `[[fallthrough]]`

Sometimes falling through is exactly what you want, for example when each case does a bit more than the next. To say so explicitly (to the compiler and to the reader), C23 has the `[[fallthrough]]` **attribute**:

```c
#include <stdio.h>

int main(void) {
    int plan = 2;   // 1 = full, 2 = standard, 3 = basic

    printf("Your plan includes:\n");

    switch (plan) {
        case 1:
            printf("- priority support\n");
            [[fallthrough]];
        case 2:
            printf("- backups\n");
            [[fallthrough]];
        case 3:
            printf("- email\n");
            break;
        default:
            printf("- nothing: unknown plan\n");
            break;
    }

    return 0;
}
```

With `plan = 2` it prints "backups" and "email". `[[fallthrough]];` goes right before the next label and silences the fall-through warning.

> **Basic C:** before C23 there was no standard way to mark a fall-through; people used a comment such as `/* fall through */`, which GCC recognizes, or the GCC and Clang extension `__attribute__((fallthrough));`.
>
> **Modern C (C23):** `[[fallthrough]];` is a standard attribute. Use it every time the fall-through is intentional.
>
> **Portability:** the `[[...]]` attribute syntax needs `-std=c23` (or `-std=c2x` in GCC 10+ and Clang 9+). If your code must compile with `-std=c17`, use the comment or the extension, keeping in mind that the latter is not standard C.

### `default`

`default` covers every value that does not match any `case`. It is optional and can go anywhere, but it usually goes last. Include it almost always, even if only to report an unexpected value.

### Other ways out of a `case`

- `return` inside a `case` ends **the whole function**, not just the `switch`. In `main`, it ends the program.
- `continue` does **not** move to the next `case`: it belongs to loops, which you will see in the next lessons.

## Code blocks

A **block** (or compound statement) is a group of statements and declarations enclosed in braces `{}`. You have already used them in `main`, in `if` and in `else`; the body of a `switch` is a block too. Wherever C expects a statement, you can put a block.

### Scope: where a variable is visible

The **scope** of a variable is the part of the program where its name can be used. A variable declared inside a block has **block scope**: it exists from its declaration to the brace that closes that block, and it is invisible outside it.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int total = 100;

    if (total > 50) {
        int discount = 10;   // exists only inside this block
        printf("%d\n", total - discount);
    }

    printf("%d\n", discount);   // error: 'discount' is not declared here
    return 0;
}
```

Variables of the outer block (`total`) are visible from inner blocks. Declaring variables in the smallest block where they are used is good practice: the reader knows they do not affect the rest of the program.

### Shadowing

If an inner block declares a variable with the **same name** as an outer one, the inner one **shadows** the outer one for as long as the block lasts:

```c
#include <stdio.h>

int main(void) {
    int x = 1;

    {
        int x = 2;   // a different variable that hides the outer one
        printf("inside: %d\n", x);
    }

    printf("outside: %d\n", x);
    return 0;
}
```

It prints `inside: 2` and `outside: 1`. It is valid, but confusing: it looks like `x` was modified and it was not. Avoid it; the compiler option `-Wshadow` detects it.

### Lifetime of a block variable

A local variable of a block is **born** when execution enters the block and reaches its declaration, and it **dies** when execution leaves the block. If the block runs again, the variable is created anew and its previous value is lost. If you do not initialize it, its initial value is indeterminate: always initialize it. In lesson 16 you will see function scope and `static` variables, and in lesson 27 lifetime (storage duration) in detail.

## Declaring variables inside a `case`

`case` labels do not create a block: the whole body of the `switch` is **one single** block. If you declare a variable in a `case`, its scope extends into the following cases, where it would exist without having been initialized. That is why, when a `case` needs its own variables, you wrap its code in a block:

```c
#include <stdio.h>

int main(void) {
    int operation = 2;
    int a = 17;
    int b = 5;

    switch (operation) {
        case 1: {
            int sum = a + b;
            printf("Sum: %d\n", sum);
            break;
        }
        case 2: {
            int quotient = a / b;
            int remainder = a % b;
            printf("Quotient: %d, remainder: %d\n", quotient, remainder);
            break;
        }
        default:
            printf("Unknown operation\n");
            break;
    }

    return 0;
}
```

> **Basic C:** in C17 and earlier, a label must be followed by a **statement**, and a declaration is not one: `case 1: int sum = a + b;` is a compile error.
>
> **Modern C (C23):** C23 allows a declaration right after a label, but the scope of that variable still reaches the following cases. A block is still the correct way to give each case its own variables.

## Common mistakes

1. **Forgetting `break`** and falling through to the next case by accident.
2. **Using `switch` with ranges or with `double`.** That is what `else if` is for.
3. **Using a variable as a `case` value.** It must be a constant known at compile time.
4. **Declaring variables in a `case` without a block.**
5. **Using a variable outside the block where it was declared**, or reusing its name in an inner block.

## Summary

- `switch` evaluates an integer expression once and jumps to the matching `case`; `default` covers the rest
- each `case` needs an integer constant; several labels in a row share code
- `break` ends the `switch`; without it, execution falls through to the next case
- an intentional fall-through is marked with `[[fallthrough]];` in C23
- a block `{}` groups statements; a variable declared in it is visible only inside (block scope) and dies on exit
- an inner variable with the same name shadows the outer one: avoid it
- a `case`'s own variables go inside a block

## Practice exercises

### Exercise 1: four-operation calculator

Read two integers and an operation character (`+`, `-`, `*`, `/`) and print the result with a `switch`. If the operation is `/` and the divisor is 0, print an error message; do the same if the character is not a known operation.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int main(void) {
    int a;
    int b;
    char operation;

    printf("Enter a, operation and b (for example 7 * 3): ");
    if (scanf("%d %c %d", &a, &operation, &b) != 3) {
        printf("Invalid input\n");
        return 1;
    }

    switch (operation) {
        case '+':
            printf("%d\n", a + b);
            break;
        case '-':
            printf("%d\n", a - b);
            break;
        case '*':
            printf("%d\n", a * b);
            break;
        case '/':
            if (b == 0) {
                printf("Cannot divide by zero\n");
            } else {
                printf("%d\n", a / b);
            }
            break;
        default:
            printf("Unknown operation: %c\n", operation);
            break;
    }

    return 0;
}
```

</details>

### Exercise 2: days in a month

Read a month number (1 to 12) and print how many days it has (assume February has 28). Group the months that share the number of days with consecutive labels.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int main(void) {
    int month;

    printf("Month: ");
    if (scanf("%d", &month) != 1) {
        printf("Invalid input\n");
        return 1;
    }

    switch (month) {
        case 1: case 3: case 5: case 7: case 8: case 10: case 12:
            printf("31 days\n");
            break;
        case 4: case 6: case 9: case 11:
            printf("30 days\n");
            break;
        case 2:
            printf("28 days\n");
            break;
        default:
            printf("Invalid month\n");
            break;
    }

    return 0;
}
```

</details>

### Exercise 3: predict the output

```c
#include <stdio.h>

int main(void) {
    int x = 5;

    {
        int x = 10;
        x = x + 1;
        printf("%d\n", x);
    }

    printf("%d\n", x);

    switch (x) {
        case 5:
            printf("five\n");
            [[fallthrough]];
        case 6:
            printf("six\n");
            break;
        default:
            printf("other\n");
            break;
    }

    return 0;
}
```

<details><summary>Show solution</summary>

```text
11
5
five
six
```

The `x` in the inner block is a different variable that shadows the outer one; when the block closes it disappears and the outer one is still 5. In the `switch`, `case 5` deliberately falls through into `case 6`, and the `break` stops execution before `default`.

</details>

### Exercise 4: find the bug

This code does not compile with `-std=c17`. Explain why and fix it so that it works in both C17 and C23.

<!-- c-check: skip -->
```c
switch (option) {
    case 1:
        int twice = value * 2;
        printf("%d\n", twice);
        break;
    default:
        printf("nothing\n");
        break;
}
```

<details><summary>Show solution</summary>

In C17 a label must be followed by a statement, and `int twice = ...;` is a declaration. Besides, even though C23 accepts it, the scope of `twice` would extend down to `default`. The fix is to wrap the case in a block:

```c
switch (option) {
    case 1: {
        int twice = value * 2;
        printf("%d\n", twice);
        break;
    }
    default:
        printf("nothing\n");
        break;
}
```

</details>
