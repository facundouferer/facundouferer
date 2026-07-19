---
title: 'Processes and States'
course: 'c'
slug: 'procesos-y-estados'
order: 2
lang: 'en'
published: true
---

Before a program makes decisions or repeats actions, there's an even more basic idea you need to master: **the sequential composition of actions**.

Programming doesn't start with `if` or `while`. It starts by understanding that a program is a **process** that moves forward step by step, and each step can change the **state** of the system.

In this lesson you'll learn:

- what a process is in programming
- what an action is
- what a state is
- what sequential composition of actions means
- what initial, intermediate, and final states are
- what successive refinement means

> Key idea: before controlling the flow of a program, you first need to understand how its state evolves step by step.

## What is a process?

A **process** is an ordered sequence of actions aimed at achieving a goal.

In programming, a process describes what happens to the program from start to finish.

Every process has at least:

- an **initial state**
- one or more **actions**
- a **final state**

## What is an action?

An **action** is a concrete operation that the program performs.

For example:

- reading a value
- displaying a message
- calculating a result
- assigning a value to a variable

Each action can modify the program's situation.

## What is a state?

A **state** is the situation of the program at a given moment.

In a first approximation, the state is mainly given by the values that the variables have at that instant.

For example:

```c
int edad = 18;
float altura = 1.72;
```

At that moment, the state can be described like this:

```text
edad = 18
altura = 1.72
```

## Sequential composition of actions

**Sequential composition of actions** means that instructions are executed one after another, in the order they appear.

That's the most basic flow of a program.

For example:

```c
int numero;
int cuadrado;

numero = 4;
cuadrado = numero * numero;
```

What happens sequentially?

1. `numero` is declared
2. `cuadrado` is declared
3. `4` is assigned to `numero`
4. `numero * numero` is calculated
5. the result is stored in `cuadrado`

No decisions, no repetitions. Just an ordered sequence.

## Why is this idea so important?

Because even when you later use `if`, `switch`, `while`, or `for`, inside each block there's still a sequence.

In other words: flow control is built on a sequential foundation.

First you understand the sequence.
Then you understand how to divert or repeat it.

## Initial, intermediate, and final states

### Initial state

It's the situation of the program before executing the main actions.

For example:

```c
int numero;
int doble;
```

There's no useful value assigned by our logic yet. The program is just starting to prepare.

### Intermediate state

It's any state that appears during execution, after some actions but before the final result.

```c
numero = 6;
```

Now there's an intermediate state:

```text
numero = 6
doble = ?
```

We haven't reached the end of the process yet, but the state has already changed.

### Final state

It's the situation of the program after completing the main actions of the process.

```c
doble = numero * 2;
```

Now the final state could be described like this:

```text
numero = 6
doble = 12
```

## Complete step-by-step example

```c
#include <stdio.h>

int main() {
    int numero;
    int resultado;

    numero = 5;
    resultado = numero + 3;

    printf("Resultado: %d\n", resultado);

    return 0;
}
```

### Initial state

```text
numero = no value assigned by our logic
resultado = no value assigned by our logic
```

### After `numero = 5;`

```text
numero = 5
resultado = no value assigned by our logic
```

### After `resultado = numero + 3;`

```text
numero = 5
resultado = 8
```

### Observable final state

The program displays:

```text
Resultado: 8
```

## Successive refinement

**Successive refinement** is a technique for thinking through solutions gradually.

Instead of trying to write the entire program at once, you break the problem down into increasingly precise steps.

### First level of refinement

Suppose you want to make a program that calculates the average of two numbers.

You first think of it like this:

1. read two numbers
2. calculate the average
3. display the result

That's still very general, but it already organizes the solution.

### Second level of refinement

Now you detail it better:

1. declare variables
2. read the first number
3. read the second number
4. add them
5. divide the result by 2
6. display the average

### Third level of refinement

Only then do you turn it into code.

```c
#include <stdio.h>

int main() {
    float numero1;
    float numero2;
    float promedio;

    printf("Enter the first number: ");
    scanf("%f", &numero1);

    printf("Enter the second number: ");
    scanf("%f", &numero2);

    promedio = (numero1 + numero2) / 2;

    printf("The average is %f\n", promedio);

    return 0;
}
```

## Why refine successively?

Because it forces you to think before writing code.

And that saves you from errors.

A rushed beginner often does this:

- opens the editor
- starts typing random things
- gets lost
- doesn't understand why the program fails

The correct way is:

- understand the problem
- break it down
- refine the solution
- only then codify

## Sequence and state change

Every time you execute an action, the state can change.

Look at this example:

```c
int x;

x = 2;
x = x + 5;
x = x * 3;
```

### State evolution

After `x = 2;`

```text
x = 2
```

After `x = x + 5;`

```text
x = 7
```

After `x = x * 3;`

```text
x = 21
```

This is pure sequential programming: one action leads to another, and each transforms the state.

## Common mistakes when starting

### 1. Wanting to jump directly to more complex structures

If you don't understand sequence and state, `if` and `while` become black magic.

### 2. Thinking of the program as text instead of as a process

The program isn't just "written code." It's a sequence of actions that changes states.

### 3. Not distinguishing between initial, intermediate, and final state

If you don't know what state your program is in, you don't really know what's happening.

### 4. Writing code without refining the solution

First you think through the problem. Then you write the implementation.

## Summary

- a program can be understood as a **process**
- a process is made up of **actions**
- actions modify the **state** of the program
- the most basic way to organize a program is **sequential composition of actions**
- a process can be analyzed in **initial state**, **intermediate states**, and **final state**
- **successive refinement** helps go from a general idea to a concrete solution

## Final thought

Controlling the flow of a program doesn't mean starting with `if` or `for`.

It means first understanding how a sequence of actions transforms an initial state into a final state.

That's the foundation. If this is solid, then control structures will start making real sense.
