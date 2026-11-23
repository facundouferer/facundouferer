---
title: 'Ternary Operator'
course: 'c'
slug: 'operador-ternario'
description: 'Use the ?: conditional operator to choose between two values inside an expression and learn when it improves readability over if-else.'
order: 9
lang: 'en'
published: true
---

With `if-else` you choose which **statements** to run. Sometimes all you need is to choose a **value** out of two. For that C has the **conditional operator** `? :`, known as the **ternary** operator because it is the only C operator with three operands.

## Objectives

By the end of this lesson you will be able to:

- write and read the conditional operator `condition ? a : b`
- explain why the ternary is an **expression** that produces a value and not a statement
- translate between a ternary and an equivalent `if-else`
- predict the type of the result when the two branches have different types
- recognize precedence problems and nested-ternary pitfalls
- decide when the ternary clarifies the code and when it makes it worse

**Prerequisites:** lessons 1 to 8, especially *Operators* (precedence, arithmetic conversions) and *If-Else*.

> Key idea: the ternary chooses between **two values** based on a condition. `if-else` chooses between **two blocks of statements**.

## Syntax

```c
condition ? value_if_true : value_if_false
```

Read it as: "if the condition is true, the result is the first value; otherwise, the second". The condition follows the same rule as in `if`: 0 is false and any other value is true.

```c
int age = 20;
int isAdult = age >= 18 ? 1 : 0;
```

1. `age >= 18` is evaluated
2. since it is true, the result of the whole expression is `1`
3. that value is stored in `isAdult`

All three parts are mandatory. Unlike `if`, which can go without `else`, the ternary always needs the value for the false case: `age >= 18 ? 1;` does not compile.

## An expression, not a statement

This is the fundamental difference. `if-else` is a control **statement**: it decides what runs, but it produces no value. The ternary is an **operator**, and the whole construct forms an **expression** that produces a value. That is why it can appear wherever a value is expected: on the right of an assignment, as an argument to `printf`, inside another expression or in a `return`.

```c
#include <stdio.h>

int main(void) {
    int a = 12;
    int b = 5;
    int smaller = a < b ? a : b;

    printf("The smaller is: %d\n", smaller);
    printf("The larger is: %d\n", a > b ? a : b);

    return 0;
}
```

Also, **only one of the two branches is evaluated**. In `x != 0 ? 100 / x : 0` the division never runs when `x` is 0, just like with the short circuit of `&&`.

## Equivalence with `if-else`

This ternary:

```c
int sign = number >= 0 ? 1 : -1;
```

expresses the same as this `if-else`:

```c
int sign;

if (number >= 0) {
    sign = 1;
} else {
    sign = -1;
}
```

The ternary version has one concrete advantage: `sign` is declared and initialized on the same line, never left without a value. Since the result is a value, you can even declare the variable `const`:

```c
const int sign = number >= 0 ? 1 : -1;
```

## Choosing a text to print

A very common use is choosing between two texts inside a `printf`. In the input and output lesson you saw that `%s` prints a string literal; the ternary chooses which one:

```c
#include <stdio.h>

int main(void) {
    int grade = 7;
    int quantity = 1;

    printf("%s\n", grade >= 6 ? "Pass" : "Fail");
    printf("%d %s\n", quantity, quantity == 1 ? "item" : "items");

    return 0;
}
```

For now strings only appear as literals passed directly to `printf`. Storing a text in a variable needs arrays or pointers, which you will see later in the course.

## The type of the result

The result of a ternary has **one single type**, even if the branches have different types. If both branches are arithmetic, C applies the **usual arithmetic conversions** you saw in *Data types*, as if you were going to add them:

```c
#include <stdio.h>

int main(void) {
    bool discounted = true;
    double price = discounted ? 90 : 99.5;

    printf("%.1f\n", price);
    printf("%.1f\n", discounted ? 1 : 2.5);   // the result is double, even though 1 is chosen

    return 0;
}
```

In the second line, even though `1` is chosen, the result is `1.0` of type `double`, because the other branch is `double`. If you wrote `printf("%d\n", discounted ? 1 : 2.5);`, the specifier would not match the type and the result would be undefined behavior (with `-Wall` the compiler warns).

The same happens with `int` and `unsigned int`: mixing `-1` with an `unsigned` in the two branches turns the `-1` into a huge number. Keep both branches of the same type whenever you can.

> **Modern C (C23):** with `auto` (type inference, new in C23) or `typeof`, the variable's type comes from the type of the ternary. That makes knowing which type it produces even more important: `auto x = c ? 1 : 2.5;` declares `x` as `double`.

## Precedence: add parentheses

The ternary has very low precedence: only assignment and the comma are below it. That is why, inside a larger expression, you almost always need parentheses:

<!-- c-check: skip -->
```c
int total = base + withShipping ? 500 : 0;   // read as (base + withShipping) ? 500 : 0
```

The intent was to add shipping to the base, but `+` applies before `?:`. The correct version:

```c
int total = base + (withShipping ? 500 : 0);
```

Rule of thumb: if the ternary is not alone on the right of an `=` or a whole function argument, wrap it in parentheses.

## Nested ternaries

The ternary groups right to left, so `a ? b : c ? d : e` means `a ? b : (c ? d : e)`. It works, but it quickly becomes hard to read:

```c
#include <stdio.h>

int main(void) {
    int number = -4;

    printf("%s\n", number > 0 ? "positive" : number < 0 ? "negative" : "zero");

    return 0;
}
```

One level of chained nesting, like this one, can still be followed if you format it over several lines. A ternary inside the **true** branch of another, or three levels, is already a puzzle. At that point an `else if` chain is clearer.

## When it helps and when it hurts

Use the ternary when:

- you choose between **two simple values**
- you want to initialize a variable (even a `const` one) with one value or another
- the whole line can be understood at a glance

Prefer `if-else` when:

- each path has **several statements** or effects (printing, modifying variables)
- the condition is long or there are more than two cases
- you would need to nest ternaries or fill them with parentheses

Do not use the ternary just to call functions for their effects, like `x > 0 ? printf("a") : printf("b");`. It compiles, but it hides a control decision behind an expression. That is the job of `if-else`.

## Common mistakes

1. **Forgetting the false branch.** The ternary always has three parts.
2. **Mixing up the order.** First the condition, then the value if true, last the value if false.
3. **Forgetting parentheses** inside larger expressions.
4. **Mixing types** in the branches and being surprised by the type of the result.
5. **Trying to be too clever.** If the ternary makes the code harder to read, you lost its benefit.

## Summary

- `condition ? a : b` is an expression that is `a` if the condition is true and `b` if it is false
- only the chosen branch is evaluated
- it is an operator that produces a value; `if-else` is a statement that chooses statements
- the result has one type, obtained with the usual arithmetic conversions between the two branches
- its precedence is very low: use parentheses inside larger expressions
- it groups right to left; avoid nesting more than once
- use it to choose simple values; for several steps, `if-else`

## Practice exercises

### Exercise 1: absolute value

Read an integer with `scanf` (check the read) and store its absolute value in a `const int absolute` variable using a ternary. Print it.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int main(void) {
    int number;

    printf("Number: ");
    if (scanf("%d", &number) != 1) {
        printf("Invalid input\n");
        return 1;
    }

    const int absolute = number < 0 ? -number : number;
    printf("Absolute value: %d\n", absolute);

    return 0;
}
```

</details>

### Exercise 2: predict the output

<!-- c-check: skip -->
```c
#include <stdio.h>

int main(void) {
    int base = 1000;
    int withShipping = 1;
    int total1 = base + (withShipping ? 500 : 0);
    int total2 = base + withShipping ? 500 : 0;

    printf("%d %d\n", total1, total2);
    return 0;
}
```

<details><summary>Show solution</summary>

It prints `1500 500`. `total1` adds shipping as expected. In `total2`, `+` has higher precedence than `?:`, so the expression is `(base + withShipping) ? 500 : 0`: `1001` is nonzero, and the result is `500`. With `-Wall`, Clang even warns that `?:` has lower precedence than `+`.

</details>

### Exercise 3: even or odd

Write a program that reads an integer and prints "even" or "odd" with a single `printf` that uses a ternary to choose the text.

<details><summary>Show solution</summary>

```c
#include <stdio.h>

int main(void) {
    int number;

    printf("Number: ");
    if (scanf("%d", &number) != 1) {
        printf("Invalid input\n");
        return 1;
    }

    printf("%d is %s\n", number, number % 2 == 0 ? "even" : "odd");
    return 0;
}
```

It also works with negatives: in C, `-3 % 2` is `-1`, which is not 0.

</details>

### Exercise 4: from nested ternary to `else if`

Rewrite this line with an `else if` chain and explain which version you find clearer.

<!-- c-check: skip -->
```c
int category = age < 13 ? 1 : age < 18 ? 2 : age < 65 ? 3 : 4;
```

<details><summary>Show solution</summary>

```c
int category;

if (age < 13) {
    category = 1;
} else if (age < 18) {
    category = 2;
} else if (age < 65) {
    category = 3;
} else {
    category = 4;
}
```

Both are equivalent because the ternary groups right to left. With four cases, the `else if` chain reads better and is easier to change; the only advantage of the ternary is that it lets you declare `category` as `const`.

</details>
