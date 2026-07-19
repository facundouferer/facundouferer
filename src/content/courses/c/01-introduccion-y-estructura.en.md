---
title: 'Introduction to C'
course: 'c'
slug: 'introduccion-y-estructura'
order: 1
lang: 'en'
published: true
---

Before learning to write instructions in C, you need to understand a much more important idea: **what a program is and what we're really doing when we program**.

Programming isn't just typing code for the sake of it. Programming is **describing a solution step by step** so a computer can execute it.

In this first lesson you'll learn:

- what a program is
- what a programming language is
- what programming paradigms are
- what the most well-known paradigms are
- basic good practices when starting to program
- what the general structure of a C program looks like

> Key idea: before building a house, you first understand the blueprints, the materials, and the logic of the structure. In programming, it's EXACTLY the same.

## What is a program?

A **program** is a set of instructions written in an orderly fashion so a computer can perform a task.

For example, a program can be used to:

- display a message on the screen
- perform calculations
- save information
- control a device
- solve a problem step by step

The important thing isn't just that it "does something," but that it does so following a precise sequence of instructions.

If someone tells you:

> "make some mate"

you can mentally fill in the missing steps.

But a computer doesn't work like that. The computer needs clear, concrete, and orderly instructions.

That's why a program must be written with precision.

## What does programming mean?

**Programming** is designing and writing those instructions to solve a problem.

That involves:

1. understanding the problem
2. thinking of a solution
3. translating that solution into a programming language

Here's one of the first important truths of the course: **logic comes first, then code**.

Many beginners want to skip this part and start writing things without understanding what they're solving. That's a mistake.

First you think.
Then you organize.
Only at the end do you write code.

## What is a programming language?

A **programming language** is a formal language that allows writing instructions using precise rules of syntax and meaning.

Put more simply: it's how we communicate with the computer to tell it what we want it to do.

Just as humans use languages like Spanish or English, in computing we use languages like C, Java, Python, or JavaScript to express solutions.

Each language has:

- its own syntax
- its own rules
- its own way of organizing programs

## Why do we use programming languages?

Because the computer, at its most basic level, doesn't understand human phrases like:

> "add these two numbers and show them on the screen"

The computer works with very precise instructions.

Programming languages exist to allow us to write those instructions in a way that:

- we can understand and maintain them
- a tool can translate them for the machine to execute

In C's case, the source code we write is compiled to become an executable program.

## What is C and why learn it?

The **C** language is one of the most important languages in the history of programming.

It was designed to create efficient software, close to how the machine actually works, with great control over resources.

Learning C is valuable because:

- it helps you better understand how a computer thinks
- it forces you to be precise with data and instructions
- it gives you a very solid foundation for learning other languages later

C doesn't "hide" as much from you as other more modern languages do. And that, when learning, is fantastic.

Yes, at first it may seem more demanding. But precisely because of that, it teaches real fundamentals.

## What is a programming paradigm?

Here comes a word that sounds complicated at first, but the idea really isn't.

A **programming paradigm** is a way of thinking about and organizing the solution to a problem when programming.

In other words: it's not just about the language, but about the **mental approach** you use to build the program.

Two people can solve a similar problem using very different programming styles.

That has to do with paradigms.

Think of it like construction styles:

- a house can be built using different methods
- they all aim to solve the need for shelter
- but the way of organizing materials, tasks, and structure can change

The same goes for programming.

## Types of programming paradigms

Several paradigms exist. At this stage you don't need to master them in depth, but you should understand they exist.

### 1. Imperative paradigm

In the **imperative** paradigm, the program is built by indicating **step by step** what the computer should do.

The central idea is:

- store data
- modify data
- execute instructions in a certain order

C primarily works with this paradigm.

That's why C is excellent for starting to understand how a program executes.

### 2. Procedural paradigm

The **procedural** paradigm is a way of organizing imperative programs into parts or blocks of tasks.

Instead of putting everything together without structure, the program is divided into sections that fulfill concrete functions.

C is also strongly associated with this paradigm.

Later in the course you'll notice this better when you start dividing programs into more organized parts.

### 3. Object-oriented paradigm

In this paradigm, programs are organized around **objects** that combine data and behavior.

Languages like Java or C# are well known for using this approach.

In this course we won't start there, because you first need a more fundamental foundation.

### 4. Functional paradigm

In the functional paradigm, the goal is to solve problems by focusing heavily on the use of functions and transforming data in a controlled way.

It's another important approach, but it's not the starting point in beginner C.

## So, what paradigm does C use?

C is mainly taught as a language of style:

- **imperative**
- **procedural**

And that makes a lot of sense for beginners, because it forces you to understand:

- the order of execution
- the structure of the program
- how data is represented
- how to express a solution step by step

In other words: C is ideal for building foundations.

## Good programming practices from day one

Here's something important I want to tell you: good practices aren't added at the end. **They're learned from the beginning**.

If from the first lesson you get used to programming messy, fixing that later costs a LOT.

### 1. Write clear code

Your code has to be understandable.

It's not enough that it "works." It also has to be readable.

### 2. Use descriptive names

Even though you'll see more examples later, from now on you need to internalize this idea:

- bad names confuse
- good names explain intent

For example, this is poor:

```c
int x;
```

This communicates better:

```c
int edad;
```

### 3. Keep your code organized

Visual order matters.

- use consistent indentation
- respect spaces
- don't cram everything together without structure

Organized code = easier to understand code.

### 4. Comment with judgment

Comments serve to explain, but not to replace clear code.

A useful comment clarifies intent.

A useless comment repeats the obvious.

### 5. Don't write things you don't understand yet

This practice will save you a LOT of problems.

If you copy structures without understanding them, you're not learning to program: you're imitating symbols.

First understand the concept.
Then write the code.

### 6. Respect the syntax

In C, details matter a lot.

- parentheses matter
- braces matter
- the semicolon matters
- uppercase and lowercase matter

It's not "almost the same." In programming, almost the same usually means incorrect.

## Structure of a C program

Now let's see how a basic C program is organized.

```c
#include <stdio.h>

int main() {
    printf("Hola, mundo\n");
    return 0;
}
```

Even if you don't understand every detail yet, let's break it down piece by piece.

## Part 1: preprocessor directive

```c
#include <stdio.h>
```

This line begins with `#`, which indicates it's a **preprocessor directive**.

In this case, `#include` tells the program to incorporate what's needed to use certain input and output tools.

`stdio.h` is a standard library widely used in C.

At this stage, the important thing is to recognize this line as a common part of simple programs that display information on the screen.

## Part 2: the `main` function

```c
int main() {
```

The `main` function is the program's entry point.

That means when the program starts executing, it begins there.

You don't need to deeply understand what a function is yet. For now, this idea is enough:

> `main` is the main place where program execution begins.

### What does `int` before `main` mean?

It means `main` returns an integer value when it finishes.

No need to go too deep yet. The important thing is to recognize that this form:

```c
int main()
```

is the usual structure of the main program in C.

## Part 3: braces `{}`

```c
{
    printf("Hola, mundo\n");
    return 0;
}
```

Braces indicate the block of instructions that belongs to `main`.

Everything inside those braces is part of the main program.

## Part 4: statements

Inside `main` appear these lines:

```c
printf("Hola, mundo\n");
return 0;
```

Each one is a **statement**, that is, an instruction that forms part of the program.

In C, statements normally end with `;`.

That semicolon isn't decorative. It's part of the syntax.

## Part 5: screen output with `printf`

```c
printf("Hola, mundo\n");
```

This instruction displays text on the screen.

For now you don't need to study `printf` in depth, since that belongs better in the input and output lesson.

In this first lesson we're only interested in recognizing that:

- it's an instruction written inside `main`
- it serves to display a message
- it ends with `;`

## Part 6: program termination with `return 0`

```c
return 0;
```

This line indicates that the main program finished and returned the value `0`.

In basic C programs, it's used to signal that execution completed successfully.

No need to go further for now. The important thing is to recognize that it usually appears at the end of `main`.

## Comments in C

Comments are text we write to explain code that the computer doesn't execute.

There are two basic forms:

### Single-line comment

```c
// This is a single-line comment
```

### Multi-line comment

```c
/*
   This is a multi-line
   comment
*/
```

Comments are useful for documenting important ideas or clarifying parts of the code.

But careful: if the code needs comments to explain EVERYTHING, often the problem isn't a lack of comments, but that the code is poorly named or poorly organized.

## Complete example with labeled parts

```c
#include <stdio.h>

int main() {
    // Shows a message on screen
    printf("Hola, mundo\n");

    // Ends the program
    return 0;
}
```

In this example you can recognize:

- a preprocessor directive
- the main `main` function
- a block delimited by braces
- statements ending in `;`
- comments

## What you should take away from this first lesson

If this lesson is clear, you already understand several big ideas:

- a program is a set of instructions
- a programming language is the tool we use to write those instructions
- a paradigm is a way of thinking about the solution
- C is mainly worked from an imperative and procedural approach
- programming well isn't just writing code that compiles, but writing clear and organized code
- a C program has a recognizable basic structure

## Summary

- a **program** is a sequence of instructions to solve a task
- **programming** is thinking of a solution and expressing it in a formal language
- a **programming language** allows writing instructions for the computer
- a **paradigm** is a way of organizing and thinking about the solution
- C is mainly used from the **imperative** and **procedural** paradigms
- good practices start from day one
- a basic C program usually includes `#include`, `main`, statements, braces, and `return 0`

## Final thought

Don't underestimate this lesson just because it's the first.

Here you're not learning "just the initial greeting" of the language. You're learning **how to think a program**.

And that, friend, is worth more than memorizing twenty lines of code without understanding anything.
