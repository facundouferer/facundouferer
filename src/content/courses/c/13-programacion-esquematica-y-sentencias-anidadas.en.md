---
title: 'Schematic Programming and Nested Statements'
course: 'c'
slug: 'programacion-esquematica-y-sentencias-anidadas'
order: 13
lang: 'en'
published: true
---

You've already seen sequence, decision, and iteration. Now comes a bigger idea: **how to think about complete programs combining these structures without losing clarity**.

That connects with **schematic programming** and the controlled use of **nested statements**.

In this lesson you'll learn:

- what schematic programming is
- how to use successive refinement to design programs
- how to combine sequence, decision, and iteration
- what nested statements are
- when nesting is appropriate and when it starts getting messy

## What is schematic programming?

**Schematic programming** is a way of designing programs based on well-known control schemas.

Instead of improvising, you think about the problem using base structures like:

- sequence
- selection
- iteration

In other words: you don't invent the logic from scratch every time. You recognize construction patterns.

## The three basic schemas

### 1. Sequence

One action after another.

### 2. Selection

Choosing between possible paths.

### 3. Iteration

Repeating actions while a condition indicates so.

A huge number of programs can be thought of by combining these three schemas.

## Example of schematic thinking

Suppose you want a program that:

1. reads numbers
2. sums only the positive ones
3. ends when the user enters 0
4. displays the final sum

If you think schematically, you can see:

- there is **iteration**: reading several times
- there is **selection**: summing only if the number is positive
- there is **sequence**: initializing, reading, processing, displaying

That organizes the mind before writing code.

## Successive refinement applied to flow control

### General schema

1. initialize data
2. repeat reading and processing
3. decide what to do with each piece of data
4. finish and display result

### More detailed refinement

1. declare `numero` and `suma`
2. initialize `suma` to 0
3. read a number
4. while the number is not 0:
   - if it's positive, accumulate it
   - read another number
5. display the sum

Only then would you write the code.

## Nested statements

A **nested statement** is a control structure placed inside another.

It can be:

- an `if` inside another `if`
- an `if` inside a `while`
- a `while` inside another `while`
- a `switch` inside an `if`

## Example: `if` inside `while`

```c
#include <stdio.h>

int main() {
    int numero;
    int suma = 0;

    printf("Enter a number (0 to exit): ");
    scanf("%d", &numero);

    while (numero != 0) {
        if (numero > 0) {
            suma = suma + numero;
        }

        printf("Enter a number (0 to exit): ");
        scanf("%d", &numero);
    }

    printf("The sum is %d\n", suma);

    return 0;
}
```

## Why is this example important?

Because it shows how schemas are combined:

- sequence to initialize and display
- iteration to repeat reading
- selection to decide whether to sum or not

That's schematic programming in action.

## When is nesting reasonable?

It's reasonable when it truly expresses clear logical dependencies.

For example:

- repeating an action several times
- and within each repetition deciding something

That makes sense.

## When does nesting become a problem?

When you accumulate too many levels and you can no longer understand what controls what.

If reading the code you get lost between braces, levels, and paths, the design probably needs simplification.

## Good practices

- indent correctly
- always use braces
- keep each block with a clear intent
- think of the schema before the code
- refine the solution from general to specific

## Summary

- schematic programming organizes solutions using sequence, selection, and iteration
- successive refinement helps move from problem to code
- nested statements allow combining control structures
- nesting is good when it improves logic, but used poorly it makes code confusing

## Final thought

Programming well isn't about chaining structures randomly.

It's about recognizing schemas, combining them with judgment, and refining the solution until the code clearly expresses the logic of the problem.

That's where you stop "trying things out" and start really designing programs.
