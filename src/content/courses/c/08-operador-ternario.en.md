---
title: 'Ternary Operator'
course: 'c'
slug: 'operador-ternario'
order: 8
lang: 'en'
published: true
---

After learning `if-else`, a very useful tool appears for solving **simple decisions** in a shorter way: the **ternary operator**.

It's called "ternary" because it works with **three parts**.

In this lesson you'll learn:

- what the ternary operator is
- what its syntax is
- how it relates to `if-else`
- when to use it
- common mistakes when starting

> Key idea: the ternary operator lets you choose between two values based on a condition. It's useful when the decision is simple, but it doesn't replace `if-else` in every case.

## What problem does it solve?

Sometimes you want to store a different value depending on a condition.

For example:

- if the grade is 6 or more, store "passed"
- if a number is even, store "even"
- if age is 18 or more, store `1`, otherwise store `0`

That can be done with `if-else`, of course.

But when you only need to **choose one value between two options**, the ternary operator can write that idea more directly.

## General syntax

The general form is this:

```c
condition ? value_if_true : value_if_false
```

Read it like this:

> if the condition is true, use this value; if it's false, use this other one

## Simple example

```c
int edad = 20;
int esMayor = edad >= 18 ? 1 : 0;
```

### What's happening here?

1. the condition `edad >= 18` is evaluated
2. since it's true, the value `1` is used
3. that value is stored in `esMayor`

If `edad` were less than `18`, then `0` would be stored.

## Equivalence with `if-else`

This code with ternary:

```c
int numero = 8;
char* tipo = numero % 2 == 0 ? "even" : "odd";
```

expresses the same idea as this code with `if-else`:

```c
int numero = 8;
char* tipo;

if (numero % 2 == 0) {
    tipo = "even";
} else {
    tipo = "odd";
}
```

The difference isn't in **what it solves**, but in **how it's written**.

## Complete example in C

```c
#include <stdio.h>

int main() {
    int nota = 7;
    char* resultado = nota >= 6 ? "Passed" : "Failed";

    printf("%s\n", resultado);

    return 0;
}
```

If `nota` is `7`, it shows `Passed`.
If `nota` were `4`, it would show `Failed`.

## Why is it called an operator?

Here's a FUNDAMENTAL difference that many beginners don't understand at first.

`if-else` is a **control structure**.

The ternary, on the other hand, is an **operator** that forms an **expression**.

That means the ternary **produces a value**.

That's why you can use it, for example, when assigning a variable:

```c
int menor = a < b ? a : b;
```

Here the result of the entire ternary expression is a value: `a` or `b`.

## Another useful example: choosing the smaller of two numbers

```c
#include <stdio.h>

int main() {
    int a = 12;
    int b = 5;
    int menor = a < b ? a : b;

    printf("The smaller is: %d\n", menor);

    return 0;
}
```

If `a` is less than `b`, `menor` stores `a`.
If not, it stores `b`.

## When should you use it?

You should use the ternary operator when:

- the condition is clear
- there are only two possible results
- you want to obtain a value
- the expression remains easy to read

## When should you NOT use it?

You shouldn't use it when the logic starts getting tangled.

For example, if the condition is very long or if you want to nest a ternary inside another, the code becomes harder to read.

And if the code becomes hard to read, you've already lost the benefit.

Look at this idea:

```c
int resultado = edad >= 18 ? 1 : 0;
```

That's fine.

But if you start writing things that are too complex in a single line, it's better to go back to `if-else`.

## Common mistakes when starting

### 1. Believing it always replaces `if-else`

No. It's useful for simple decisions that return a value.

If you have several steps inside each path, `if-else` is usually the better option.

### 2. Not understanding which part corresponds to which case

Remember the order:

```c
condition ? true_value : false_value
```

First goes the condition, then the value if true, and finally the value if false.

### 3. Trying to be too "clever"

The goal of code isn't to look sophisticated. The goal is to be understandable.

If the ternary complicates reading, don't use it.

## Summary

- the ternary operator allows choosing between two values
- its general form is `condition ? value_if_true : value_if_false`
- it resembles `if-else`, but produces a value
- it's good for simple, clear decisions
- if the expression becomes confusing, it's better to use `if-else`

## Final thought

The ternary operator is a small tool, but very useful.

Used well, it lets you write simple decisions in a compact and clear way.

Used poorly, it turns a simple idea into a line that's hard to understand.

And in programming, friend, **clarity always beats cleverness**.
