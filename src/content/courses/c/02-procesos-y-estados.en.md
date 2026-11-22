---
title: 'Sequence of Actions'
course: 'c'
slug: 'procesos-y-estados'
order: 2
lang: 'en'
published: true
---

Before a program makes decisions or repeats actions, there is an even more basic idea you need to master: **the sequential composition of actions**.

Programming does not start with `if` or `while`. It starts by understanding that a program is a **process** that moves forward step by step, and that each step can change the program's **state**.

**Objectives**

- Define what an algorithm is and recognize its properties.
- Tell input, processing and output apart in a problem.
- Explain what a process, an action and a state are.
- Follow how a program's state evolves with a trace table.
- Distinguish the initial state, intermediate states and the final state.
- Design a solution with stepwise refinement before writing code.

**Prerequisites:** [Introduction to C](/en/courses/c/introduccion-y-estructura).

> Key idea: before controlling the flow of a program, you first need to understand how its state evolves step by step.

This lesson uses very little C: a few integer variables (`int`), assignments with `=` and `printf`. The details of each one come in the next lessons; here what matters is the way of thinking.

## What is an algorithm?

An **algorithm** is a finite, ordered sequence of precise actions that solves a problem.

A cooking recipe is an everyday example of an algorithm:

1. heat the water
2. add the rice
3. wait 18 minutes
4. drain

For a computer to run it, an algorithm has to meet a few properties:

- **precise**: each action says exactly what to do, without ambiguity ("add a little salt" is not precise; "add 5 grams of salt" is)
- **ordered**: the actions have an order, and the order matters
- **finite**: it ends after a finite number of steps
- **well defined**: with the same input data, it always produces the same result

A **program** is an algorithm written in a programming language. First you think of the algorithm; then you translate it into C.

## Input, processing and output

Almost every algorithm can be described in three parts:

- **input**: the data it receives (for example, what the user types)
- **processing**: the actions that transform that data
- **output**: the result it delivers (for example, what it shows on the screen)

For example, to compute the total price of a purchase:

| Part | Content |
| --- | --- |
| Input | unit price and quantity |
| Processing | multiply price by quantity |
| Output | show the total |

Identifying these three parts is the first step to understanding any problem: what I have, what I need to do and what I need to obtain.

## What is a process?

A **process** is the execution of an algorithm: an ordered sequence of actions that happens over time, aimed at achieving a goal.

In programming, a process describes what happens to the program from the moment it starts until it ends.

Every process has, at least:

- an **initial state**
- one or more **actions**
- a **final state**

## What is an action?

An **action** is a concrete operation the program performs.

For example:

- reading a value
- showing a message
- computing a result
- assigning a value to a variable

Each action can change the program's situation.

## What is a state?

A **state** is the program's situation at a given moment.

As a first approximation, the state is given by the values its variables hold at that instant. A **variable** is a named space where the program stores a value; you will see it in detail in the [variables and constants](/en/courses/c/variables-y-constantes) lesson.

For example:

```c
int age = 18;
int points = 120;
```

At that moment, the state can be described like this:

```text
age = 18
points = 120
```

## Sequential composition of actions

**Sequential composition of actions** means that instructions run one after another, in the order they appear.

It is the most basic flow of a program.

For example:

```c
int number;
int square;

number = 4;
square = number * number;
```

What happens, in sequence?

1. `number` is declared
2. `square` is declared
3. `4` is assigned to `number`
4. `number * number` is computed
5. the result is stored in `square`

No decisions, no repetition. Just an ordered sequence.

## Why is this idea so important?

Because even when you later use `if`, `switch`, `while` or `for`, inside each block there is still a sequence.

In other words: control flow is built on a sequential foundation.

First you understand the sequence.
Then you understand how to branch it or repeat it.

## Initial, intermediate and final states

### Initial state

It is the program's situation before the main actions run.

```c
int number;
int twice;
```

The variables exist, but they have not received a value from our logic yet. In C, a variable declared inside `main` without an initial value has an **indeterminate value**: it may contain anything. Using it before assigning a value is a mistake, and the compiler with `-Wall` usually warns about it.

### Intermediate state

It is any state that appears during execution, after some actions but before the process is complete.

```c
number = 6;
```

Now there is an intermediate state:

```text
number = 6
twice = ?
```

We have not reached the end of the process yet, but the state has already changed.

### Final state

It is the program's situation after the actions of the process are complete.

```c
twice = number * 2;
```

Now the final state is:

```text
number = 6
twice = 12
```

## Trace tables: following the state step by step

Describing the state after each action, as we did above, works. But when there are several variables and several steps, a more orderly tool helps: the **trace table**.

A trace table has one column per variable and one row per action. In each row you write the value of each variable **after** running that action. `?` marks an indeterminate value or a variable that has not been declared yet.

Take this sequence:

```c
int x;

x = 2;
x = x + 5;
x = x * 3;
```

| Step | Action | `x` |
| --- | --- | --- |
| 0 | `int x;` | ? |
| 1 | `x = 2;` | 2 |
| 2 | `x = x + 5;` | 7 |
| 3 | `x = x * 3;` | 21 |

Look at step 2: `x = x + 5;` uses the value `x` has **at that moment** (2), computes 7 and stores 7 in `x`. The previous value is lost. An assignment first computes the right-hand side and then stores the result in the variable on the left.

### An assignment stores a value, not a formula

```c
int n = 7;
int twice = n * 2;
n = n + 1;
```

| Step | Action | `n` | `twice` |
| --- | --- | --- | --- |
| 1 | `int n = 7;` | 7 | ? |
| 2 | `int twice = n * 2;` | 7 | 14 |
| 3 | `n = n + 1;` | 8 | 14 |

`twice` was computed when `n` was 7. Changing `n` afterwards does **not** recompute `twice`: the assignment copied the value 14, not the formula `n * 2`. If you want `twice` to reflect the change, you have to assign it again.

### Example: swapping two values

A classic problem: swap the values of `x` and `y`. The first attempt is usually this:

```c
int x = 3;
int y = 8;

x = y;
y = x;
```

| Step | Action | `x` | `y` |
| --- | --- | --- | --- |
| 1 | `int x = 3;` | 3 | ? |
| 2 | `int y = 8;` | 3 | 8 |
| 3 | `x = y;` | 8 | 8 |
| 4 | `y = x;` | 8 | 8 |

The trace shows the problem: after step 3, the 3 is no longer in any variable. The fix is to save it first in a **temporary** variable:

```c
int x = 3;
int y = 8;
int temp;

temp = x;
x = y;
y = temp;
```

| Step | Action | `x` | `y` | `temp` |
| --- | --- | --- | --- | --- |
| 1 | `int x = 3;` | 3 | ? | ? |
| 2 | `int y = 8;` | 3 | 8 | ? |
| 3 | `int temp;` | 3 | 8 | ? |
| 4 | `temp = x;` | 3 | 8 | 3 |
| 5 | `x = y;` | 8 | 8 | 3 |
| 6 | `y = temp;` | 8 | 3 | 3 |

Now it works: `x = 8` and `y = 3`. Without the table, this mistake is very easy to miss.

## Complete step-by-step example

```c
#include <stdio.h>

int main(void) {
    int number;
    int result;

    number = 5;
    result = number + 3;

    printf("Result: %d\n", result);

    return 0;
}
```

`%d` inside the `printf` text marks where the value of an `int` is written; you will see it in detail in the input and output lesson.

| Step | Action | `number` | `result` | Screen |
| --- | --- | --- | --- | --- |
| 0 | declarations | ? | ? | |
| 1 | `number = 5;` | 5 | ? | |
| 2 | `result = number + 3;` | 5 | 8 | |
| 3 | `printf(...)` | 5 | 8 | `Result: 8` |

The screen output is the **observable** part of the final state:

```text
Result: 8
```

### Order matters

If we swap two actions, the result changes:

```c
result = number + 3;
number = 5;
```

Now `result` is computed while `number` still holds an indeterminate value. The result is unpredictable, and the compiler with `-Wall` warns that `number` is used uninitialized. In a sequence, each action depends on the previous ones.

## Stepwise refinement

**Stepwise refinement** is a technique for designing algorithms gradually.

Instead of trying to write the whole program at once, you break the problem down into increasingly precise steps, from the general to the specific.

### First level of refinement

Suppose you want to write a program that computes the average of two numbers.

First you think of it like this, in terms of input, processing and output:

1. read two numbers
2. compute the average
3. show the result

That is still very general, but it already organizes the solution.

### Second level of refinement

Now you add detail:

1. declare variables
2. read the first number
3. read the second number
4. add them
5. divide the result by 2
6. show the average

### Third level of refinement

Only then do you turn it into code.

```c
#include <stdio.h>

int main(void) {
    float number1;
    float number2;
    float average;

    printf("Enter the first number: ");
    scanf("%f", &number1);

    printf("Enter the second number: ");
    scanf("%f", &number2);

    average = (number1 + number2) / 2;

    printf("The average is %f\n", average);

    return 0;
}
```

Two new things appear here that you only need to recognize: `float` is a type for numbers with decimals, and `scanf("%f", &number1)` reads a number typed by the user and stores it in `number1` (the `&` gives the address of the variable, that is, where to store it). You will see them in detail in the [data types](/en/courses/c/tipos-de-datos) and [input and output](/en/courses/c/entrada-y-salida) lessons, where you will also learn to check that the read worked.

## Why refine step by step?

Because it forces you to think before writing code. And that saves you mistakes.

A beginner in a hurry usually does this:

- opens the editor
- starts typing things at random
- gets lost
- does not understand why the program fails

The right way is:

- understand the problem (input, processing, output)
- break it down
- refine the solution
- only then write the code
- check with a trace table that each step leaves the expected state

## Common mistakes when starting

### 1. Wanting to jump straight to more complex structures

If you do not understand sequence and state, `if` and `while` later feel like magic.

### 2. Thinking of the program as text instead of as a process

A program is not just "written code". It is a sequence of actions that changes states.

### 3. Believing a variable remembers a formula

An assignment stores the value of that moment. If a variable it depended on changes later, the result does not update by itself.

### 4. Using a variable before giving it a value

The order of actions matters: first you assign, then you use.

### 5. Writing code without refining the solution

First you think of the algorithm. Then you write the implementation.

## Summary

- an **algorithm** is a finite, ordered and precise sequence of actions that solves a problem
- almost every algorithm is described as **input**, **processing** and **output**
- a **process** is the execution of an algorithm; it is made of **actions**
- actions change the program's **state**: the values of its variables at each step
- the most basic way to organize a program is the **sequential composition of actions**
- a process can be analyzed as an **initial state**, **intermediate states** and a **final state**
- a **trace table** records the value of each variable after each action
- an assignment stores a value, not a formula; swapping two values needs a temporary variable
- **stepwise refinement** helps you go from a general idea to a concrete solution

## Final thought

Controlling the flow of a program does not mean starting with `if` or `for`.

It means first understanding how a sequence of actions transforms an initial state into a final state.

That is the foundation. If it is solid, control structures will truly make sense later.

## Practice exercises

### Exercise 1: complete the trace table

Complete the trace table for this sequence and say what the final `printf` shows.

```c
int a = 4;
int b = a + 1;
a = b * 2;
b = a - b;
printf("a = %d, b = %d\n", a, b);
```

<details><summary>Show solution</summary>

| Step | Action | `a` | `b` |
| --- | --- | --- | --- |
| 1 | `int a = 4;` | 4 | ? |
| 2 | `int b = a + 1;` | 4 | 5 |
| 3 | `a = b * 2;` | 10 | 5 |
| 4 | `b = a - b;` | 10 | 5 |

It shows `a = 10, b = 5`. In step 4, `a - b` is `10 - 5 = 5`: each assignment uses the values of that moment, not the initial ones.

</details>

### Exercise 2: input, processing and output

We want a program that computes the perimeter and the area of a rectangle from its width and height (whole numbers).

1. Identify the input, the processing and the output.
2. Write two levels of refinement.
3. Write the program in C.

<details><summary>Show solution</summary>

1. **Input:** width and height. **Processing:** perimeter = 2 × width + 2 × height; area = width × height. **Output:** show the perimeter and the area.
2. Level 1: read the measurements, compute, show. Level 2: declare variables; read the width; read the height; compute the perimeter; compute the area; show both results.
3. Program:

```c
#include <stdio.h>

int main(void) {
    int width;
    int height;
    int perimeter;
    int area;

    printf("Width: ");
    scanf("%d", &width);
    printf("Height: ");
    scanf("%d", &height);

    perimeter = 2 * width + 2 * height;
    area = width * height;

    printf("Perimeter: %d\n", perimeter);
    printf("Area: %d\n", area);

    return 0;
}
```

With width 5 and height 3, it shows `Perimeter: 16` and `Area: 15`.

</details>

### Exercise 3: rotate three values

The variables `first = 1`, `second = 2` and `third = 3` must end up as `first = 2`, `second = 3` and `third = 1`. Write the sequence of assignments and check it with a trace table.

<details><summary>Show solution</summary>

A single temporary variable is enough to avoid losing the value of `first`:

```c
int first = 1;
int second = 2;
int third = 3;
int temp;

temp = first;
first = second;
second = third;
third = temp;
```

| Step | Action | `first` | `second` | `third` | `temp` |
| --- | --- | --- | --- | --- | --- |
| 1 | `temp = first;` | 1 | 2 | 3 | 1 |
| 2 | `first = second;` | 2 | 2 | 3 | 1 |
| 3 | `second = third;` | 2 | 3 | 3 | 1 |
| 4 | `third = temp;` | 2 | 3 | 1 | 1 |

</details>

### Exercise 4: fix the order

This fragment is meant to show `Total: 30`, but the result is unpredictable. Explain why and fix it.

```c
int price;
int quantity;
int total;

total = price * quantity;
price = 10;
quantity = 3;
printf("Total: %d\n", total);
```

<details><summary>Show solution</summary>

`total` is computed while `price` and `quantity` still hold indeterminate values. The actions are in the wrong order: first assign the data, then compute.

```c
price = 10;
quantity = 3;
total = price * quantity;
printf("Total: %d\n", total);
```

</details>
