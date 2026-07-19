---
title: 'While Loop'
course: 'c'
slug: 'sentencia-while'
order: 10
lang: 'en'
published: true
---

So far you've seen how a program can execute actions in sequence and how it can choose between different paths.

Now another fundamental problem appears: **repeating actions**.

That's where iteration statements come in. The first one you'll study is `while`.

In this lesson you'll learn:

- what iteration means
- how `while` works
- how to think of a loop with initial state, condition, and update
- what an infinite loop is
- how to use `break` and `continue` inside a loop

## What is iteration?

An **iteration** is each repetition of a set of instructions.

If a loop prints five numbers, then there were five iterations.

## What does `while` do?

The `while` statement repeats a block of code **while a condition is true**.

### Syntax

```c
while (condition) {
    instructions;
}
```

## Correct mental model for reading a `while`

A `while` loop has three fundamental elements:

1. **initial state**
2. **continuation condition**
3. **state update**

If you forget one of these three, the loop is usually poorly designed.

## Basic example

```c
#include <stdio.h>

int main() {
    int i = 1;

    while (i <= 5) {
        printf("%d\n", i);
        i = i + 1;
    }

    return 0;
}
```

## Step-by-step breakdown

- initial state: `i = 1`
- condition: `i <= 5`
- update: `i = i + 1`

As long as the condition is true, the block keeps executing.

## What happens in each iteration?

### Iteration 1

- `i` is `1`
- prints `1`
- `i` becomes `2`

### Iteration 2

- `i` is `2`
- prints `2`
- `i` becomes `3`

And so on until `i` no longer satisfies the condition.

## Infinite loop

An **infinite loop** occurs when the condition never becomes false.

### Incorrect example

```c
while (i <= 5) {
    printf("%d\n", i);
}
```

If `i` doesn't change, the loop could repeat forever.

That's why you should always think:

> what action inside the loop brings the program closer to finishing the loop?

## Using `break` in a `while`

`break` allows you to immediately exit the loop.

```c
while (i <= 10) {
    if (i == 5) {
        break;
    }
    printf("%d\n", i);
    i = i + 1;
}
```

When `i` is `5`, the loop is cut off.

## Using `continue` in a `while`

`continue` makes the loop jump directly to the next iteration.

```c
while (i <= 5) {
    i = i + 1;

    if (i == 3) {
        continue;
    }

    printf("%d\n", i);
}
```

No need to master it in detail yet, but understand its general idea: it alters the normal flow of the loop.

## When should you use `while`?

`while` is very useful when repetition depends on a condition and you don't want to think about an exact number of repetitions first.

## Summary

- `while` repeats a block while a condition is true
- to design a `while` well, you need to think about initial state, condition, and update
- if the condition never becomes false, an infinite loop occurs
- `break` cuts the loop
- `continue` jumps to the next iteration

## Final thought

`while` teaches you one of the deepest ideas in programming: repeating isn't about copying code many times, but about controlling how a state evolves while a condition keeps being true.
