---
title: 'If-Else Statement'
course: 'c'
slug: 'sentencia-if-else'
order: 8
lang: 'en'
published: true
---

So far your programs have been **sequential**: instructions run one after another, always in the same order. But a useful program needs to **choose** what to do based on its data. The first tool for that is the `if` statement and its companion `else`.

## Objectives

By the end of this lesson you will be able to:

- run a block only when a **condition** is true, with `if`
- choose between two paths with `if-else` and among several with `else if` chains
- nest decisions when one depends on another, without losing readability
- explain how C evaluates a condition: zero is false, any other value is true
- recognize the classic mistakes: `=` instead of `==`, a stray `;` after the `if`, the dangling else, and comparing floating-point values with `==`
- guard a dangerous operation with the short circuit of `&&`
- decide when an `else if` chain fits better than a `switch`

**Prerequisites:** lessons 1 to 7, especially *Data types* (`bool`, `double`) and *Operators* (relational, logical and short-circuit evaluation).

> Key idea: `if-else` breaks the linear sequence. The program evaluates a condition and runs **only one** of the possible paths.

## What is a condition?

A **condition** is an expression whose result is interpreted as true or false. You usually write it with the relational and logical operators from the previous lesson:

```c
age >= 18
number == 0
grade >= 6 && grade <= 10
```

### How C decides what is true

C does not require the condition to have type `bool`. The rule is numeric:

- if the condition is **0**, it is **false**
- if it is **any other value**, it is **true**

Relational and logical operators produce an `int` that is `0` or `1`. That is why you can use a number, a `bool` variable or a comparison as a condition:

```c
#include <stdio.h>

int main(void) {
    int quantity = 3;
    bool inStock = quantity > 0;

    if (quantity) {
        printf("quantity is not zero\n");
    }

    if (inStock) {
        printf("In stock\n");
    }

    return 0;
}
```

> **Basic C:** before C99 there was no `bool`; conditions were stored in an `int` holding `0` or `1`. In C99 and C17 `bool` exists, but you must include `<stdbool.h>`.
>
> **Modern C (C23):** `bool`, `true` and `false` are keywords. Storing a condition in a `bool` variable with a clear name (`inStock`, `isValid`) makes the `if` read almost like a sentence.
>
> **Portability:** if your code must also compile with `-std=c17`, add `#include <stdbool.h>`; in C23 it is harmless.

Writing `if (quantity)` is valid, but `if (quantity != 0)` is usually clearer when the variable is a number and not a boolean.

## The `if` statement

The `if` statement runs a block only if the condition is true. If it is false, the block is skipped and the program continues after the closing brace.

```c
if (condition) {
    statements;
}
```

```c
#include <stdio.h>

int main(void) {
    int age = 20;

    if (age >= 18) {
        printf("Adult\n");
    }

    printf("End of program\n");
    return 0;
}
```

## The `if-else` statement

With `else` you add the alternative path: one block for when the condition is true and another for when it is false. Exactly one of the two always runs.

```c
#include <stdio.h>

int main(void) {
    int number = 5;

    if (number % 2 == 0) {
        printf("The number is even\n");
    } else {
        printf("The number is odd\n");
    }

    return 0;
}
```

### What the braces do

Braces `{}` delimit the **block** that belongs to the `if` or the `else`. If you omit them, the `if` controls **a single** statement, the next one:

<!-- c-check: skip -->
```c
if (age >= 18)
    printf("Adult\n");
    printf("May continue\n");   // ALWAYS runs: it does not belong to the if
```

The indentation fools the reader, but the compiler ignores it. That is why this course always uses braces, even for one-line blocks.

## `else if` chains

When there are more than two cases, you chain conditions with `else if`. C evaluates them **in order**, top to bottom, and runs the block of the **first** one that is true; the rest are not evaluated. The final `else`, which is optional, covers everything that did not match.

```c
#include <stdio.h>

int main(void) {
    int grade = 8;

    if (grade < 0 || grade > 10) {
        printf("Invalid grade\n");
    } else if (grade >= 9) {
        printf("Outstanding\n");
    } else if (grade >= 6) {
        printf("Pass\n");
    } else {
        printf("Fail\n");
    }

    return 0;
}
```

Because evaluation stops at the first true condition, **order matters**. If you put `grade >= 6` before `grade >= 9`, a 10 would print "Pass" and never reach "Outstanding". Order the ranges so that each condition can assume the previous ones were false.

`else if` is not a new keyword: it is an `else` whose body is another `if`. Writing it on one line is just a formatting convention that avoids a staircase of indentation.

## Nested statements

A **nested** statement is a control statement inside another, for example an `if` inside another `if`. It fits when the second decision only makes sense if the first one already held:

```c
#include <stdio.h>

int main(void) {
    int number = 0;

    if (number >= 0) {
        if (number == 0) {
            printf("The number is zero\n");
        } else {
            printf("The number is positive\n");
        }
    } else {
        printf("The number is negative\n");
    }

    return 0;
}
```

Each nesting level forces the reader to keep more conditions in mind at once. Beyond two or three levels, try an `else if` chain or conditions combined with `&&`. This example, for instance, can be written as `if (number < 0) ... else if (number == 0) ... else ...`.

## Guarding an operation with short-circuit evaluation

In the operators lesson you saw that `&&` does not evaluate its right side if the left side is already false. That lets you **guard** a dangerous operation inside the same condition:

```c
#include <stdio.h>

int main(void) {
    int total = 120;
    int people = 0;

    if (people != 0 && total / people > 50) {
        printf("Each person pays more than 50\n");
    } else {
        printf("No people, or each pays 50 or less\n");
    }

    return 0;
}
```

If `people` is `0`, the division never runs, so there is no division by zero (which would be undefined behavior). The order is essential: the guard goes **on the left**.

## Common mistakes

### 1. `=` instead of `==`

<!-- c-check: skip -->
```c
if (age = 18) {
    printf("Is 18\n");
}
```

`age = 18` is an **assignment**: it stores 18 in `age` and the expression is 18, which is nonzero, so the condition is always true. It compiles, but `-Wall` warns you ("using the result of an assignment as a condition"). To compare, use `==`. This is why always compiling with warnings enabled matters so much.

### 2. A stray `;` after the `if`

<!-- c-check: skip -->
```c
if (balance < 0);
{
    printf("Negative balance\n");
}
```

The `;` ends the `if` with an **empty statement**. The block below no longer belongs to the `if` and always runs. Clang warns with `-Wempty-body`; with GCC, `-Wextra` also catches it.

### 3. The dangling else

An `else` belongs to the **nearest** `if` that does not have an `else` yet, whatever the indentation says:

<!-- c-check: skip -->
```c
if (a > 0)
    if (b > 0)
        printf("both positive\n");
else
    printf("a is not positive\n");   // actually belongs to if (b > 0)
```

With `a = 5` and `b = -1` it prints "a is not positive", which is false. Braces remove the ambiguity:

```c
#include <stdio.h>

int main(void) {
    int a = 5;
    int b = -1;

    if (a > 0) {
        if (b > 0) {
            printf("both positive\n");
        }
    } else {
        printf("a is not positive\n");
    }

    return 0;
}
```

### 4. Comparing floating-point values with `==`

A `double` stores a binary approximation, so two computations that are mathematically equal can differ in the last bit:

```c
#include <stdio.h>

int main(void) {
    double sum = 0.1 + 0.2;

    if (sum == 0.3) {
        printf("equal\n");
    } else {
        printf("different\n");   // this is what is printed
    }

    return 0;
}
```

Instead of `==`, check whether the difference is smaller than a **tolerance** suited to your problem:

```c
#include <stdio.h>

int main(void) {
    double sum = 0.1 + 0.2;
    double difference = sum - 0.3;
    const double tolerance = 1e-9;

    if (difference < 0) {
        difference = -difference;
    }

    if (difference < tolerance) {
        printf("practically equal\n");
    } else {
        printf("different\n");
    }

    return 0;
}
```

### 5. Ranges written as in math

`if (1 <= n <= 10)` compiles but does not do what it seems: it first computes `1 <= n` (0 or 1) and compares **that** result with 10, which is always true. Write it with `&&`: `if (n >= 1 && n <= 10)`.

## `else if` or `switch`?

In lesson 10 you will see `switch`, which chooses among several cases based on the value of an integer expression. A practical rule:

| Situation | Tool |
| --- | --- |
| Ranges (`grade >= 6`), several variables, conditions combined with `&&` or `\|\|` | `else if` chain |
| Floating-point values or comparisons with a tolerance | `else if` chain |
| One integer expression (or a `char`) compared with several concrete constant values | `switch` |
| Several values that share the same code (a menu, a command code) | `switch` |

## Summary

- `if` runs a block only if the condition is true; `else` covers the opposite case
- in C, a condition is false if it is 0 and true for any other value; `bool` makes the intent explicit
- an `else if` chain evaluates in order and runs only the first true condition, so order matters
- nest only when one decision depends on another, and always use braces
- short-circuit `&&` guards dangerous operations if the guard is on the left
- watch out for `=` vs `==`, the `;` after `if`, the dangling else and `==` on `double`
- ranges and combined conditions: `else if`; one integer value against constants: `switch`

## Practice exercises

### Exercise 1: classify a temperature

Write a program that reads an integer temperature with `scanf` (check that the read succeeds) and prints "Cold" if it is below 15, "Mild" if it is between 15 and 25 inclusive, and "Hot" if it is above 25.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int main(void) {
    int temperature;

    printf("Temperature: ");
    if (scanf("%d", &temperature) != 1) {
        printf("Invalid input\n");
        return 1;
    }

    if (temperature < 15) {
        printf("Cold\n");
    } else if (temperature <= 25) {
        printf("Mild\n");
    } else {
        printf("Hot\n");
    }

    return 0;
}
```

The second condition does not need `temperature >= 15`: if we get there, the first one was already false.

</details>

### Exercise 2: find the bugs

This program should print "May vote" only for ages 16 and up, but it misbehaves. Find the two bugs.

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int age = 12;

    if (age = 16);
    {
        printf("May vote\n");
    }

    return 0;
}
```

<details><summary>Show solution</summary>

1. `age = 16` assigns instead of comparing; besides, the correct condition is `age >= 16`.
2. The `;` after the `if` ends it with an empty statement, so the block always runs.

```c
#include <stdio.h>

int main(void) {
    int age = 12;

    if (age >= 16) {
        printf("May vote\n");
    }

    return 0;
}
```

</details>

### Exercise 3: safe division

Read two integers `a` and `b`. If `b` is not zero and the quotient `a / b` is greater than 10, print "Large quotient"; otherwise print "Small quotient or impossible division". Use a single condition with short-circuit evaluation.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int main(void) {
    int a;
    int b;

    printf("Enter a and b: ");
    if (scanf("%d %d", &a, &b) != 2) {
        printf("Invalid input\n");
        return 1;
    }

    if (b != 0 && a / b > 10) {
        printf("Large quotient\n");
    } else {
        printf("Small quotient or impossible division\n");
    }

    return 0;
}
```

If `b` is 0, `b != 0` is false and `&&` does not evaluate `a / b`.

</details>

### Exercise 4: what does it print?

Predict the output with `x = 7` and explain which `if` the `else` belongs to.

<!-- c-check: skip -->
```c
if (x > 5)
    if (x > 10)
        printf("A\n");
else
    printf("B\n");
```

<details><summary>Show solution</summary>

It prints `B`. The `else` belongs to the nearest `if` without an `else`, which is `if (x > 10)`. With `x = 7`, `x > 5` is true, `x > 10` is false, and its `else` runs. The indentation suggests otherwise; that is why braces should always be used.

</details>
