---
title: 'Input and Output'
course: 'c'
slug: 'entrada-y-salida'
order: 4
lang: 'en'
published: true
---

So far you've seen that a program can store information in variables. But a program really starts to become useful when it can **display information** and also **receive data**.

That's what we call **output** and **input**.

- **Output**: when the program displays information outward, for example on the screen.
- **Input**: when the program receives information from outside, for example when a person types with the keyboard.

In this lesson you'll learn:

- what input and output mean in a program
- how to display messages and values with `printf`
- what format specifiers are
- how to read simple data with `scanf`
- why the `&` symbol sometimes appears
- common mistakes when starting with input and output

> Key idea: a program without input or output is like a person who thinks but doesn't speak or listen. It can have data inside, but it doesn't interact with anyone.

## What is data output?

**Data output** occurs when the program sends information to the outside.

In initial C programs, the most common output is displaying text or values on the screen.

For example, a program can show:

- a welcome message
- the value of a variable
- the result of a calculation

In C, the most used function for this is `printf`.

## `printf`: displaying information on screen

The `printf()` function is used to print text on the screen.

Example:

```c
#include <stdio.h>

int main() {
    printf("Hola, mundo\n");
    return 0;
}
```

That program displays the message `Hola, mundo`.

### What does `\n` mean?

Inside the text, this appears:

```c
\n
```

That represents a **newline**.

That means after displaying the text, the cursor moves to the next line.

For example:

```c
printf("First line\n");
printf("Second line\n");
```

The output would be:

```text
First line
Second line
```

## `printf` displaying text only

At first, `printf` can be used simply to display messages.

```c
printf("Welcome to the program\n");
printf("C is a powerful language\n");
```

Notice the text goes in **double quotes**.

That indicates we're writing a literal message to display on the screen.

## Displaying the value of a variable

`printf` isn't just for displaying fixed text. It can also show the value stored in a variable.

Look at this example:

```c
#include <stdio.h>

int main() {
    int edad = 18;
    printf("The age is %d\n", edad);
    return 0;
}
```

Here something new appears:

```c
%d
```

That's called a **format specifier**.

## What is a format specifier?

A format specifier tells `printf` what type of data to display in that part of the text.

Think of it like this: inside the message we leave a reserved spot for the value of a variable to appear later.

In this example:

```c
printf("The age is %d\n", edad);
```

- the text is `The age is `
- `%d` tells `printf` that an integer goes there
- `edad` is the variable whose value will be displayed

If `edad` is `18`, the output will be:

```text
The age is 18
```

## Most common specifiers when starting

For now, the most important ones are these:

### `%d`

Used to display `int` values.

```c
int cantidad = 25;
printf("Quantity: %d\n", cantidad);
```

### `%f`

Used to display `float` values.

```c
float altura = 1.75;
printf("Height: %f\n", altura);
```

### `%c`

Used to display `char` values.

```c
char inicial = 'F';
printf("Initial: %c\n", inicial);
```

## Examples separated by data type

### Displaying an integer

```c
#include <stdio.h>

int main() {
    int edad = 20;
    printf("Age: %d\n", edad);
    return 0;
}
```

### Displaying a decimal

```c
#include <stdio.h>

int main() {
    float precio = 1499.50;
    printf("Price: %f\n", precio);
    return 0;
}
```

### Displaying a character

```c
#include <stdio.h>

int main() {
    char letra = 'A';
    printf("Letter: %c\n", letra);
    return 0;
}
```

## Mixing text and values

One of the most useful things about `printf` is that it allows combining text with values.

```c
#include <stdio.h>

int main() {
    int edad = 18;
    float altura = 1.72;
    char inicial = 'F';

    printf("Age: %d\n", edad);
    printf("Height: %f\n", altura);
    printf("Initial: %c\n", inicial);

    return 0;
}
```

This makes the program's information clear for whoever uses it.

## What is data input?

**Data input** occurs when the program receives information from the outside.

In basic C programs, this usually happens when the user types data with the keyboard.

For example, the program can ask for:

- an age
- a number
- a letter
- a price

In C, one of the best-known functions for reading basic data is `scanf()`.

## `scanf`: reading data entered by the user

The `scanf()` function allows reading data that the user types.

Example:

```c
#include <stdio.h>

int main() {
    int edad;

    printf("Enter your age: ");
    scanf("%d", &edad);

    printf("You are %d years old\n", edad);

    return 0;
}
```

## What does this program do?

Step by step:

1. declares a variable called `edad`
2. shows the message `Enter your age:`
3. waits for the user to type a number
4. stores that number in the variable `edad`
5. displays the stored value

This already allows real interaction between the user and the program.

## The basic structure of `scanf`

The general form is:

```c
scanf("specifier", &variable);
```

For example:

```c
scanf("%d", &edad);
```

Here:

- `%d` indicates an integer is expected
- `&edad` indicates where the read value will be stored

## Why does `&` appear in `scanf`?

Excellent question. And yes, this part tends to confuse at first.

When you use `scanf`, the program needs to know **where to store** the data the user typed.

That's why the `&` symbol appears before the variable name.

At this stage, this idea is enough:

> `&variable` allows `scanf` to work directly with that variable to store the read data there.

No need to get into more advanced explanations yet.

For now, stick with this practical rule:

- with `scanf`, to read `int`, `float`, and `char`, you'll normally use `&` before the variable

## Reading an integer with `scanf`

```c
#include <stdio.h>

int main() {
    int numero;

    printf("Enter an integer: ");
    scanf("%d", &numero);

    printf("The number entered is %d\n", numero);

    return 0;
}
```

## Reading a decimal with `scanf`

```c
#include <stdio.h>

int main() {
    float precio;

    printf("Enter a price: ");
    scanf("%f", &precio);

    printf("The price entered is %f\n", precio);

    return 0;
}
```

## Reading a character with `scanf`

```c
#include <stdio.h>

int main() {
    char inicial;

    printf("Enter a letter: ");
    scanf(" %c", &inicial);

    printf("The letter entered is %c\n", inicial);

    return 0;
}
```

Notice this detail:

```c
" %c"
```

There's a space before `%c`.

And it's not there for no reason.

## A very common problem with `scanf` and `%c`

When we first read a number and then a character, this often happens:

- the program asks for a number
- we type the number and press Enter
- then the program asks for a letter
- but it seems to "skip" reading the character

Look at this example:

```c
#include <stdio.h>

int main() {
    int ruedas;
    char inicialMarca;

    printf("Enter the number of wheels: ");
    scanf("%d", &ruedas);

    printf("Enter the initial of the brand: ");
    scanf("%c", &inicialMarca);

    printf("Wheels: %d\n", ruedas);
    printf("Initial: %c\n", inicialMarca);

    return 0;
}
```

At first glance it looks correct. But it can fail.

## What's really happening?

When you type a number like `4` and then press Enter, you're not just entering `4`.

The newline produced by the Enter key is also registered.

So, after this:

```c
scanf("%d", &ruedas);
```

the number is stored in `ruedas`, but the `\n` from Enter can remain in the input buffer.

Then, when you do this:

```c
scanf("%c", &inicialMarca);
```

`scanf` takes the next available character.

And that next character can be precisely the pending newline `\n`.

That's why the program seems to "skip" the prompt, when in reality it did read something: it read the previous Enter as a valid character.

## Simple solution

The most common practical solution when starting is to write a space before `%c`.

Like this:

```c
scanf(" %c", &inicialMarca);
```

That space tells `scanf` to ignore any whitespace before reading the actual character.

### What does whitespace mean?

It means blank characters, for example:

- spaces
- tabs
- newlines

So, if a `\n` from the previous Enter remains, that space makes `scanf` discard it and keep waiting for a real letter.

## Fixed example

```c
#include <stdio.h>

int main() {
    int ruedas;
    char inicialMarca;

    printf("Enter the number of wheels: ");
    scanf("%d", &ruedas);

    printf("Enter the initial of the brand: ");
    scanf(" %c", &inicialMarca);

    printf("Wheels: %d\n", ruedas);
    printf("Initial: %c\n", inicialMarca);

    return 0;
}
```

## Practical tip for beginners

When you use `scanf` to read a `char`, this is a very good habit:

```c
scanf(" %c", &variableChar);
```

Not because there's always a problem, but because it avoids one of the most common mistakes when starting.

## Relationship between types and specifiers

There's a direct relationship between the data type and the specifier you use.

### For displaying with `printf`

- `int` → `%d`
- `float` → `%f`
- `char` → `%c`

### For reading with `scanf`

- `int` → `%d`
- `float` → `%f`
- `char` → `%c`

You need to learn this well, because if you mix types and specifiers, the program stops behaving as you expect.

## A complete input and output example

```c
#include <stdio.h>

int main() {
    int edad;
    float altura;
    char inicial;

    printf("Enter your age: ");
    scanf("%d", &edad);

    printf("Enter your height: ");
    scanf("%f", &altura);

    printf("Enter the initial of your name: ");
    scanf(" %c", &inicial);

    printf("Age: %d\n", edad);
    printf("Height: %f\n", altura);
    printf("Initial: %c\n", inicial);

    return 0;
}
```

This program:

- receives data from the user
- stores it in variables
- then displays it on the screen

Here you can clearly see how the lessons connect:

- first you learned variables
- now you see how to load them and how to display their content

## Common mistakes when starting

### 1. Forgetting to include `stdio.h`

If you use `printf` or `scanf`, you need:

```c
#include <stdio.h>
```

### 2. Forgetting the semicolon

```c
printf("Hello")
```

That's wrong. In C, the statement must end with `;`.

Correct:

```c
printf("Hello");
```

### 3. Using the wrong format specifier

This is wrong:

```c
int edad = 18;
printf("%f\n", edad);
```

Why? Because `edad` is `int`, and `%f` is used for `float`.

Correct would be:

```c
printf("%d\n", edad);
```

### 4. Forgetting `&` in `scanf`

This is wrong:

```c
scanf("%d", edad);
```

Correct is:

```c
scanf("%d", &edad);
```

### 5. Wanting to read full text too early

Many beginners want to move quickly to full names or phrases.

But that's better to see calmly later, when the lesson on character strings appears.

At this stage, the important thing is to master input and output of:

- integers
- decimals
- characters

## Summary

- **output** allows the program to display information
- **input** allows the program to receive information
- `printf()` is used to display text and values on the screen
- `scanf()` is used to read simple data entered by the user
- `%d`, `%f`, and `%c` are fundamental specifiers when starting
- in `scanf()`, `&` normally appears before the variable
- input and output connect the program with its user

## Final thought

When a program can display and receive data, it stops being a closed sequence of instructions and starts becoming an interactive tool.

And that's a huge step.

Because programming isn't just about storing things in memory: it's also about being able to communicate with the user clearly.
