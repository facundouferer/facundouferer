---
title: 'Introduction to C'
course: 'c'
slug: 'introduccion-y-estructura'
order: 1
lang: 'en'
published: true
---

Before learning to write instructions in C, you need to understand a much more important idea: **what a program is and what we are really doing when we program**.

Programming is not typing code for the sake of it. Programming is **describing a solution step by step** so a computer can execute it.

**Objectives**

- Explain what a program, a programming language and a paradigm are.
- Recognize what C is used for today and why it is worth learning.
- Know how the course is organized: the standard we use, the compile command and its three levels.
- Identify the parts of a C program: `#include <stdio.h>`, `int main(void)`, the block between braces, statements, comments and `return 0;`.
- Write, compile and run your first program.

**Prerequisites:** none. This is the first lesson of the course.

> Key idea: before building a house, you first understand the blueprints, the materials and the logic of the structure. Programming works exactly the same way.

## What is a program?

A **program** is a set of instructions written in order so a computer can perform a task.

For example, a program can be used to:

- show a message on the screen
- perform calculations
- store information
- control a device
- solve a problem step by step

What matters is not only that it "does something", but that it does it by following a precise sequence of instructions.

If someone tells you:

> "make breakfast"

you can fill in the missing steps in your head.

A computer does not work like that. It needs clear, concrete and ordered instructions.

That is why a program must be written precisely.

## What does programming mean?

**Programming** is designing and writing those instructions to solve a problem.

That involves:

1. understanding the problem
2. thinking of a solution
3. translating that solution into a programming language

Here is one of the first important truths of the course: **logic comes first, code comes after**.

Many beginners want to skip this part and start writing things without understanding what they are solving. That is a mistake.

First you think.
Then you organize.
Only at the end do you write code.

## What is a programming language?

A **programming language** is a formal language that lets you write instructions using precise rules of syntax and meaning.

Put more simply: it is how we communicate with the computer to tell it what we want it to do.

Just as people use languages like Spanish or English, in computing we use languages like C, Java, Python or JavaScript to express solutions.

Each language has:

- its own syntax
- its own rules
- its own way of organizing programs

## Why do we use programming languages?

Because the computer, at its most basic level, does not understand human sentences like:

> "add these two numbers and show them on the screen"

The computer works with very precise instructions.

Programming languages exist so we can write those instructions in a way that:

- we can understand and maintain them
- a tool can translate them so the machine can run them

In C, that tool is the **compiler**: it turns the source code we write into an **executable** program.

## What is C and why learn it?

**C** is one of the most important languages in the history of programming. It was created in the early 1970s to write the Unix operating system, and it has been in use ever since.

It was designed to build efficient software, close to how the machine really works and with a lot of control over resources.

Learning C is valuable because:

- it helps you understand how a computer works
- it forces you to be precise with data and instructions
- it gives you a very solid foundation for learning other languages later

C does not "hide" what happens as much as more modern languages do. When you are learning, that is a big advantage.

Yes, at first it can feel more demanding. But that is exactly why it teaches real fundamentals.

### What is C used for today?

C is not a museum piece. Today it is used for:

- **operating systems**: the Linux kernel is written in C, and so is a large part of the Windows and macOS kernels
- **embedded systems**: microcontrollers in cars, home appliances, medical equipment and IoT devices
- **interpreters and languages**: the main Python interpreter (CPython) and the Lua interpreter are written in C
- **databases and tools**: SQLite, PostgreSQL, Redis and Git
- **high-performance libraries**: compression, cryptography, graphics and networking that other languages then use

When a language like Python or JavaScript needs speed or needs to talk directly to the system, it very often ends up calling code written in C.

## What is a programming paradigm?

Here comes a word that sounds complicated at first, but the idea is not.

A **programming paradigm** is a way of thinking about and organizing the solution to a problem when programming.

In other words: it is not only about the language, but about the **mental approach** you use to build the program.

Two people can solve a similar problem using very different programming styles. That is what paradigms are about.

Think of them as building styles:

- a house can be built with different methods
- all of them aim to provide a place to live
- but the way materials, tasks and structure are organized can change

Programming works the same way.

## Types of programming paradigms

There are several paradigms. At this stage you do not need to master them, but you should know they exist.

### 1. Imperative paradigm

In the **imperative** paradigm, a program is built by telling the computer **step by step** what to do.

The central idea is:

- store data
- modify data
- execute instructions in a certain order

C works mainly with this paradigm. That is why C is excellent for understanding how a program runs.

### 2. Procedural paradigm

The **procedural** paradigm is a way of organizing imperative programs into parts or blocks of tasks.

Instead of putting everything together without structure, the program is divided into sections that each do a specific job.

C is also strongly associated with this paradigm. You will notice it when you start splitting programs into functions.

### 3. Object-oriented paradigm

In this paradigm, programs are organized around **objects** that combine data and behavior.

Languages like Java or C# are well known for this approach. C is **not** an object-oriented language; in the complementary module of the course you will see how some of those design ideas can be applied in C, and what their limits are.

### 4. Functional paradigm

In the functional paradigm, problems are solved with a strong focus on functions and on transforming data in a controlled way.

It is another important approach, but it is not the starting point in C.

## So, which paradigm does C use?

C is used mainly in a style that is:

- **imperative**
- **procedural**

And that makes a lot of sense for beginners, because it forces you to understand:

- the order of execution
- the structure of the program
- how data is represented
- how a solution is expressed step by step

In other words: C is ideal for building fundamentals.

## How this course works

Before writing code, it helps to know the rules we will work with.

### The course standard: C23

C does not belong to a company. It is defined by an international **standard** (ISO/IEC 9899) that is updated every few years: C89, C99, C11, C17 and, the most recent, **C23**.

This course uses **ISO C23** and always compiles with this command:

```bash
gcc -std=c23 -Wall -Wextra -Wpedantic program.c -o program
```

- `-std=c23` asks for the C23 standard.
- `-Wall -Wextra -Wpedantic` turn on warnings: the compiler tells you about likely mistakes and about code that departs from the standard.

You need **GCC 14 or later**, or **Clang 18 or later** (with Clang the command is the same, replacing `gcc` with `clang`). The course rule is that every program **compiles without warnings**.

> **Portability:** if your compiler is older and does not recognize `-std=c23`, use `-std=c2x`. When a topic changed between C17 and C23, the lesson marks it in a box like this one.

In lesson 3, [Compilation, linking and warnings](/en/courses/c/compilacion-y-enlazado), you will see in detail what each part of that command does, which stages the code goes through and how to read compiler messages.

### The three levels of the course

The course moves through three levels:

1. **Learning to program** (modules 1 and 2): logic, algorithms, data and control flow.
2. **Mastering C** (modules 3 to 8): functions, derived types, pointers, memory, the standard library and modular organization.
3. **Professional practice** (modules 9 to 11): debugging, testing, portability, tools and modern C.

The last two modules, **Modern C and C23** and **Software design in C**, are **optional**: they go deeper for those who want to, but they are not required to complete the course.

Each lesson starts with its objectives and prerequisites and ends with practice exercises with solutions. Each lesson also has a self-assessment and a project to practice.

## Good programming practices from day one

Good practices are not added at the end. **They are learned from the start**.

If you get used to programming messily from the first lesson, fixing it later costs a lot.

### 1. Write clear code

Your code has to be understandable. It is not enough that it "works": it also has to be readable.

### 2. Use descriptive names

Take this idea on board right now:

- bad names confuse
- good names explain the intent

For example, this is poor:

```c
int x;
```

This communicates better:

```c
int age;
```

### 3. Keep your code organized

Visual order matters.

- use consistent indentation
- respect spacing
- do not cram everything together

Organized code = code that is easier to understand.

### 4. Comment with judgment

Comments are for explaining, not for replacing clear code.

A useful comment clarifies an intention. A useless comment repeats the obvious.

### 5. Do not write things you do not understand yet

If you copy structures without understanding them, you are not learning to program: you are imitating symbols.

First understand the concept. Then write the code.

### 6. Respect the syntax

In C, details matter a lot.

- parentheses matter
- braces matter
- the semicolon matters
- uppercase and lowercase matter: `int` is a word of the language, `Int` is not

"Almost the same" is not good enough. In programming, almost the same usually means wrong.

## Structure of a C program

Now let's see how a basic C program is organized.

```c
#include <stdio.h>

int main(void) {
    printf("Hello, world\n");
    return 0;
}
```

Even if you do not understand every detail yet, let's take it apart piece by piece.

### Part 1: preprocessor directive

The first line is `#include <stdio.h>`.

It starts with `#`, which means it is a **preprocessor directive**: an instruction that is handled before compiling.

`#include` brings the declarations of a header file into the program. `stdio.h` is the **standard input/output** header, and it is what lets us use `printf`.

### Part 2: the `main` function

The line `int main(void) {` opens the `main` function.

`main` is the program's **entry point**: when the program starts running, it begins with the first statement of `main`.

You do not need to understand functions in depth yet. For now, this idea is enough:

> `main` is where the program's execution begins.

Each part of `int main(void)` means something:

- `int`: `main` returns an integer when it finishes.
- `main`: the required name of the main function.
- `(void)`: `main` receives no data.

The form `void main` shows up in old books and some tutorials, but it is **not standard C**: `main` always returns `int`. We never use it in this course.

> **Basic C:** in C17 and earlier, `int main()` with empty parentheses means "without saying which parameters it takes", not "no parameters". That is why we write `int main(void)`.
>
> **Modern C (C23):** in C23, `int main()` and `int main(void)` mean the same thing. We still write `(void)`: it makes the intent explicit and works with every version of the standard.

### Part 3: braces `{}`

The braces `{` and `}` delimit the **block** of instructions that belongs to `main`.

Everything inside those braces is part of the main program.

### Part 4: statements

Inside `main` we have `printf("Hello, world\n");` and `return 0;`.

Each one is a **statement**, that is, an instruction that is part of the program. They run one after another, in the order they appear.

In C, statements end with `;`. That semicolon is not decorative: it is part of the syntax. If it is missing, the program does not compile.

### Part 5: screen output with `printf`

`printf("Hello, world\n");` shows text on the screen.

`printf` writes exactly the text it receives between quotes. The sequence `\n` means **newline**: whatever is written next appears on the following line. If a `printf` does not end with `\n`, the next text continues on the same line.

`printf` has many more possibilities that you will see in the [input and output](/en/courses/c/entrada-y-salida) lesson.

### Part 6: ending the program with `return 0`

`return 0;` means that `main` finished and returned the value `0`.

That value is handed to the operating system, and `0` is the convention for "everything went fine". `return` does not show anything on the screen. That is why `main` ends with `return 0;`.

## Comments in C

Comments are text we write to explain the code; the compiler ignores them.

There are two forms:

### Single-line comment

```c
// This is a single-line comment
```

### Multi-line comment

```c
/*
   This is a comment
   spanning several lines
*/
```

A useful trick: if you put `//` in front of a statement, that statement no longer runs, because it becomes a comment.

But be careful: if the code needs comments to explain everything, the problem is often not a lack of comments, but that the code is badly named or badly organized.

## Complete example with labeled parts

```c
#include <stdio.h>

/*
   Shows a welcome greeting for the course.
*/
int main(void) {
    // Show the message on two lines
    printf("Hello, world\n");
    printf("Welcome to the C course\n");

    // End the program, reporting that everything went fine
    return 0;
}
```

In this example you can recognize:

- a preprocessor directive
- the main function `main`
- a block delimited by braces
- statements ending in `;`
- single-line and multi-line comments

## Your first program: compile and run

1. Save the previous example in a file named `hello.c`.
2. Compile it with the course command:

   ```bash
   gcc -std=c23 -Wall -Wextra -Wpedantic hello.c -o hello
   ```

3. If the compiler prints nothing, the executable `hello` was created. Run it:

   ```bash
   ./hello
   ```

The output is:

```text
Hello, world
Welcome to the C course
```

If the compiler prints an error or a warning, read it calmly: it tells you the file, the line and what it expected to find. In lesson 3 you will learn to interpret those messages.

## Summary

- a **program** is a sequence of instructions that solves a task
- **programming** is thinking of a solution and expressing it in a formal language
- a **programming language** lets you write instructions for the computer; in C, the compiler turns them into an executable
- a **paradigm** is a way of organizing and thinking about the solution; C is used mainly with the **imperative** and **procedural** paradigms
- C is used today in operating systems, embedded systems, interpreters, databases and high-performance libraries
- the course uses the **C23** standard and compiles with `gcc -std=c23 -Wall -Wextra -Wpedantic`, without warnings
- a basic C program has `#include <stdio.h>`, `int main(void)`, a block between braces, statements ending in `;` and `return 0;`
- good practices start on day one

## Final thought

Do not underestimate this lesson because it is the first one.

You are not learning "just the opening greeting" of the language. You are learning **how to think about a program**.

And that is worth more than memorizing twenty lines of code without understanding anything.

## Practice exercises

### Exercise 1: find the errors

This program has three errors. Find them and write the corrected version.

<!-- c-check: skip -->
```c
#include <stdio.h>

Int main(void) {
    printf("My first program\n")
    printf("It works\n");
}
```

<details><summary>Show solution</summary>

1. `Int` must be written `int`: C is case-sensitive.
2. The `;` is missing at the end of the first `printf`.
3. `return 0;` is missing at the end of `main`.

```c
#include <stdio.h>

int main(void) {
    printf("My first program\n");
    printf("It works\n");
    return 0;
}
```

</details>

### Exercise 2: predict the output

What does this program show? Write the exact output, line by line, before running it.

```c
#include <stdio.h>

int main(void) {
    printf("One, ");
    printf("two\n");
    // printf("three\n");
    printf("four\n");
    return 0;
}
```

<details><summary>Show solution</summary>

```text
One, two
four
```

The first `printf` does not end with `\n`, so `two` continues on the same line. The `three` line is a comment and does not run.

</details>

### Exercise 3: your business card

Write a complete program that shows three lines: your name, the name of the course and a personal goal. Include a multi-line comment that explains what the program does, and compile it with the course command without warnings.

<details><summary>Show solution</summary>

One possible solution:

```c
#include <stdio.h>

/*
   Shows a three-line business card:
   name, course and personal goal.
*/
int main(void) {
    printf("Name: Ana Torres\n");
    printf("Course: C from Zero to Professional\n");
    printf("Goal: write clear code\n");
    return 0;
}
```

Compile it with `gcc -std=c23 -Wall -Wextra -Wpedantic card.c -o card` and run it with `./card`.

</details>

### Exercise 4: language, paradigm and standard

Answer in your own words:

1. What is the difference between a programming language and a paradigm?
2. What does the `-std=c23` option of the compile command mean?
3. Why does this course never write `void main`?

<details><summary>Show solution</summary>

1. A language is the formal tool we write instructions with (C, Java, Python). A paradigm is a way of thinking about and organizing the solution (imperative, procedural, object-oriented, functional). C is used mainly with the imperative and procedural paradigms.
2. It asks the compiler to use the ISO C23 standard, which is the one the course follows. With older compilers, use `-std=c2x`.
3. Because the C standard states that `main` returns an `int`. The correct form is `int main(void)` with `return 0;` at the end.

</details>
