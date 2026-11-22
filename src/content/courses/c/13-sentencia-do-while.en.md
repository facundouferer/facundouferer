---
title: 'Do-While Loop'
course: 'c'
slug: 'sentencia-do-while'
order: 13
lang: 'en'
published: true
---

The `do-while` statement also repeats instructions, but it has a very important difference from `while`: it asks **at the end**.

## Objectives

By the end of this lesson you will be able to:

- explain why the body of a `do-while` runs **at least once**
- choose between `while` and `do-while` depending on when the condition should be checked
- validate input and build repeating menus with `do-while`
- use `break` and `continue` in all three loops, knowing exactly what they skip
- decide when `break` and `continue` make code clearer and when they obscure it

**Prerequisites:** lessons 11 (*While Loop*) and 12 (*For Loop*), lesson 10 (*Switch and Code Blocks*: `break` in `switch`, block scope) and lesson 6 (*Input and Output*: discarding invalid input with `getchar`).

## Syntax

```c
do {
    statements;
} while (condition);
```

The final `;` is part of the syntax: without it, the program does not compile.

## The fundamental difference

- In `while`, the condition is checked **before** entering the body: there may be zero passes.
- In `do-while`, the body runs and **then** the condition is checked: it runs **at least once**.

```c
#include <stdio.h>

int main(void) {
    int number = 10;

    do {
        printf("The number is %d\n", number);
    } while (number < 5);

    return 0;
}
```

Even though `number < 5` is false from the start, `The number is 10` is printed once. With a `while` and the same condition, nothing would be printed.

| | `while` | `do-while` |
| --- | --- | --- |
| Condition is checked | before the body | after the body |
| Minimum passes | 0 | 1 |
| Typical use | sentinel, end of input | validating input, menus |

## Validating input

Asking for a value **always** happens at least once, and is repeated **while** the value is invalid. That is exactly the shape of `do-while`:

```c
#include <stdio.h>

int main(void) {
    int age = 0;
    int items_read;

    do {
        printf("Age (0 to 120): ");
        items_read = scanf("%d", &age);

        if (items_read == EOF) {
            printf("\nNo more input\n");
            return 1;
        }
        if (items_read != 1) {
            int c;
            while ((c = getchar()) != '\n' && c != EOF) {
                // discard the rest of the invalid line
            }
            printf("That is not a number\n");
        } else if (age < 0 || age > 120) {
            printf("Out of range\n");
        }
    } while (items_read != 1 || age < 0 || age > 120);

    printf("Age recorded: %d\n", age);
    return 0;
}
```

Notice three details:

- `items_read` and `age` are declared **outside** the `do`, because the `while (...)` condition comes after the closing brace of the block and cannot see variables declared inside it (lesson 10)
- the condition says "repeat **while** it is invalid"; writing it backwards is a frequent mistake
- if the input is a letter, the line is discarded with `getchar`; otherwise `scanf` would fail on the same letter forever

## Repeating menus

A menu is shown at least once and repeated until the user chooses to quit. `do-while` and `switch` combine naturally:

```c
#include <stdio.h>

int main(void) {
    int option = 0;
    int counter = 0;

    do {
        printf("[1] Add  [2] Subtract  [3] Show  [0] Quit\nOption: ");
        if (scanf("%d", &option) != 1) {
            printf("Invalid input\n");
            return 1;
        }

        switch (option) {
            case 1:
                counter++;
                break;
            case 2:
                counter--;
                break;
            case 3:
                printf("Counter: %d\n", counter);
                break;
            case 0:
                printf("Goodbye\n");
                break;
            default:
                printf("Invalid option\n");
                break;
        }
    } while (option != 0);

    return 0;
}
```

The `break` statements in this program end the `switch`, **not** the loop. What ends the menu is the condition `option != 0`. This point comes back below.

> **Modern C (C23):** `bool`, `true` and `false` are keywords, handy for named loop conditions (`bool finished = false;` and `} while (!finished);`). **Basic C:** in C99 and C17 you must include `<stdbool.h>` to use them.

## `break` and `continue` in all three loops

You already met them briefly in `switch` (lesson 10) and in `while` (lesson 11). Now precisely.

### `break`: leaving the loop

`break` **immediately ends the innermost loop (or `switch`)** that contains it. Execution continues at the first statement after that loop. It works the same in `while`, `for` and `do-while`.

```c
#include <stdio.h>

int main(void) {
    int n = 91;
    int divisor = 0;

    for (int d = 2; d < n; d++) {
        if (n % d == 0) {
            divisor = d;
            break;            // we found the first one: no point in going on
        }
    }

    if (divisor != 0) {
        printf("%d is not prime: it is divisible by %d\n", n, divisor);
    } else {
        printf("%d is prime\n", n);
    }
    return 0;
}
```

### `continue`: skipping to the next pass

`continue` abandons **the rest of the body** in the current pass. Where it jumps depends on the loop:

| Loop | After `continue`, what runs is |
| --- | --- |
| `while` | the evaluation of the condition |
| `do-while` | the evaluation of the condition (at the end) |
| `for` | the **update** and then the condition |

```c
#include <stdio.h>

int main(void) {
    int sum = 0;

    for (int i = 1; i <= 10; i++) {
        if (i % 3 == 0) {
            continue;         // skips multiples of 3; i++ still runs
        }
        sum += i;
    }

    printf("Sum from 1 to 10 without multiples of 3: %d\n", sum);
    return 0;
}
```

It prints `37` (55 minus 3, 6 and 9). In a `for`, `continue` is safe because the update lives in the header. In `while` and `do-while`, if the update is in the body **after** the `continue`, it is skipped and the loop may become infinite.

### `break` inside a `switch` inside a loop

`break` leaves the innermost structure. If the innermost one is a `switch`, it leaves the `switch` and the loop **continues**. That is why the menu above cannot quit with `case 0: break;`: it needs the loop condition (or a variable that controls it). `continue`, on the other hand, means nothing for `switch`: inside a `switch` that sits in a loop, `continue` applies to the loop.

### Clarity criteria

`break` and `continue` are legitimate tools, but each one adds an exit that the loop condition does not show.

Use them when they make things clearer:

- `break` to end a **search** as soon as the target is found
- `continue` at the **start** of the body, as a filter ("if this value is useless, move to the next one"), instead of wrapping the whole body in an `if`

Avoid them when they obscure:

- several `break` and `continue` scattered across a long body: the reader can no longer tell when the loop ends
- a `while (true)` with a hidden `break` when a named condition would say it better
- a `continue` in a `while` that skips the update

If you can express the exit in the condition without making it complicated, prefer the condition.

## Common mistakes

### 1. Forgetting the final `;`

```c
do {
    x++;
} while (x < 10)    // missing ;
```

It is a compilation error.

### 2. Declaring inside the block what the condition uses

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    do {
        int value = 0;
        if (scanf("%d", &value) != 1) {
            return 1;
        }
    } while (value < 0);   // error: 'value' is not declared in this scope
    return 0;
}
```

The condition is **outside** the block. Declare `value` before the `do`.

### 3. Reversing the condition

In validation, the condition describes when to **repeat**, that is, when the value is **invalid**: `while (grade < 0 || grade > 10)`. Writing `while (grade >= 0 && grade <= 10)` repeats exactly when the value is correct.

### 4. Using `do-while` when there may be zero passes

If the data may be empty (a sentinel that arrives first), `do-while` would process something it should not. In that case the right shape is `while`.

### 5. Expecting `break` inside a `switch` to end the loop

It only ends the `switch`.

## Summary

- `do-while` checks the condition at the end: the body runs **at least once**
- it is the natural shape for validating input and for menus
- the variables of the condition are declared before the `do`
- `break` leaves the innermost loop or `switch`; `continue` skips the rest of the pass (in `for`, it runs the update)
- use `break` to end searches and `continue` as a filter at the start; if a condition says it better, prefer the condition

## Practice exercises

### Exercise 1: predict the output

```c
#include <stdio.h>

int main(void) {
    int i = 0;

    do {
        i++;
        if (i == 2) {
            continue;
        }
        if (i == 5) {
            break;
        }
        printf("%d ", i);
    } while (i < 8);

    printf("| i = %d\n", i);
    return 0;
}
```

<details><summary>Show solution</summary>

```text
1 3 4 | i = 5
```

When `i` is `2`, `continue` skips the `printf` and goes to the condition (`2 < 8`, keep going). When it is `5`, `break` ends the loop before printing it. Since `i++` is at the start of the body, the `continue` does not cause an infinite loop.

</details>

### Exercise 2: validate a grade

Write a program that asks for an integer grade between 1 and 10 with `do-while` until it is valid. If `scanf` does not read a number, print `Invalid input` and end with `return 1;`. If it is out of range, print `Must be between 1 and 10` and ask again. At the end, print `Passed` (6 or more) or `Failed`.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int main(void) {
    int grade = 0;

    do {
        printf("Grade (1 to 10): ");
        if (scanf("%d", &grade) != 1) {
            printf("Invalid input\n");
            return 1;
        }
        if (grade < 1 || grade > 10) {
            printf("Must be between 1 and 10\n");
        }
    } while (grade < 1 || grade > 10);

    printf("%s\n", grade >= 6 ? "Passed" : "Failed");
    return 0;
}
```

</details>

### Exercise 3: remove the `break`

This program adds integers until a negative one arrives. Rewrite it **without** `while (true)` or `break`, so that the loop condition says when it ends.

```c
#include <stdio.h>

int main(void) {
    int value;
    int sum = 0;

    while (true) {
        if (scanf("%d", &value) != 1 || value < 0) {
            break;
        }
        sum += value;
    }

    printf("Sum: %d\n", sum);
    return 0;
}
```

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int main(void) {
    int value;
    int sum = 0;

    while (scanf("%d", &value) == 1 && value >= 0) {
        sum += value;
    }

    printf("Sum: %d\n", sum);
    return 0;
}
```

Thanks to the short-circuit of `&&` (lesson 7), `value >= 0` is only evaluated if `scanf` read a number. Now the condition fully describes how the loop ends.

</details>

### Exercise 4: where does `continue` jump?

This loop should print the odd numbers from 1 to 9, but it never ends. Explain why and fix it in two ways: by moving the update and by using a `for`.

```c
#include <stdio.h>

int main(void) {
    int i = 1;

    while (i <= 9) {
        if (i % 2 == 0) {
            continue;
        }
        printf("%d ", i);
        i++;
    }
    printf("\n");
    return 0;
}
```

<details><summary>Show solution</summary>

When `i` is `2`, `continue` goes back to the condition **without** running `i++`: `i` stays at `2` forever. In a `while`, `continue` runs no update.

```c
#include <stdio.h>

int main(void) {
    int i = 0;
    while (i < 9) {
        i++;                 // the update comes first
        if (i % 2 == 0) {
            continue;
        }
        printf("%d ", i);
    }
    printf("\n");

    for (int j = 1; j <= 9; j++) {   // in a for, continue runs j++
        if (j % 2 == 0) {
            continue;
        }
        printf("%d ", j);
    }
    printf("\n");
    return 0;
}
```

Both print `1 3 5 7 9`.

</details>
