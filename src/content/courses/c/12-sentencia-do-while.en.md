---
title: 'Do-While Loop'
course: 'c'
slug: 'sentencia-do-while'
order: 12
lang: 'en'
published: true
---

The `do-while` statement also repeats instructions, but it has a very important difference compared to `while`.

In this lesson you'll learn:

- how `do-while` works
- how it differs from `while`
- why it executes at least once
- when to use it

## Syntax

```c
do {
    instructions;
} while (condition);
```

## Fundamental difference from `while`

In `while`, the condition is evaluated before entering the block.

In `do-while`, the condition is evaluated after executing the block.

That means the block executes **at least once**.

## Example

```c
#include <stdio.h>

int main() {
    int i = 1;

    do {
        printf("%d\n", i);
        i = i + 1;
    } while (i <= 5);

    return 0;
}
```

## Example where the difference matters

```c
#include <stdio.h>

int main() {
    int numero = 10;

    do {
        printf("The number is %d\n", numero);
    } while (numero < 5);

    return 0;
}
```

Even though `numero < 5` is false, the block executes once.

## When should you use `do-while`?

Use it when you want the block to execute at least once before checking whether to repeat.

## Common mistakes

### 1. Believing `while` and `do-while` are the same

They're not. The difference is in when the condition is evaluated.

### 2. Forgetting the final `;`

```c
} while (condition);
```

That semicolon is part of the syntax.

## Summary

- `do-while` evaluates the condition at the end
- the block executes at least once
- it's useful when you need to guarantee a first execution

## Final thought

`do-while` shows that in programming, not only does the condition matter, but also **when** it's evaluated.
