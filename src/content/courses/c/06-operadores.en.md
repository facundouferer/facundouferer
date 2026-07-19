---
title: 'Operators'
course: 'c'
slug: 'operadores'
order: 6
lang: 'en'
published: true
---

Once you understand what data types exist, the next natural step is to learn **what you can do with that data**.

That's where **operators** come in.

An operator is a symbol that tells the program what action to perform with one or more values.

In this lesson you'll learn:

- what an operator is
- mathematical operators
- relational operators
- logical operators
- assignment operators
- operator precedence

> Key idea: operators are part of the language you use to build expressions. If you don't understand what each one does and in what order they act, code becomes confusing very quickly.

## What is an operator?

An **operator** is a symbol that represents an operation.

For example, in math you already know symbols like:

- `+`
- `-`
- `*`
- `/`

In programming, something similar happens, but there are also operators for:

- comparing values
- combining logical conditions
- assigning values to variables

## What is an expression?

Before continuing, you need this idea.

An **expression** is a combination of values, variables, and operators that produces a result.

For example:

```c
5 + 3
```

That's an expression.

Also:

```c
edad + 1
```

And also:

```c
nota >= 6
```

Operators are part of those expressions.

## Mathematical operators

Mathematical operators allow performing numeric calculations.

The most important ones to start with are:

- `+` addition
- `-` subtraction
- `*` multiplication
- `/` division
- `%` remainder of integer division

## Addition `+`

```c
int a = 10;
int b = 5;
int resultado = a + b;
```

Here, `resultado` is `15`.

## Subtraction `-`

```c
int a = 10;
int b = 5;
int resultado = a - b;
```

Here, `resultado` is `5`.

## Multiplication `*`

```c
int a = 4;
int b = 3;
int resultado = a * b;
```

Here, `resultado` is `12`.

## Division `/`

```c
int a = 10;
int b = 2;
int resultado = a / b;
```

Here, `resultado` is `5`.

### Watch out for integer division

Look at this example:

```c
int resultado = 5 / 2;
```

If you work with integers, the result doesn't keep the decimal part.

So in this context, the result will be `2`.

This surprises a lot of people at first, but you need to understand it well: **the data type influences the result of the operation**.

## Remainder `%`

The `%` operator returns the remainder of an integer division.

```c
int resto = 10 % 3;
```

Here, `resto` is `1`, because:

- `10 / 3` gives `3`
- remainder is `1`

This operator only makes sense with integer values at the level we're working.

## Assignment operators

Assignment operators are used to store a value in a variable.

The most important and fundamental one is:

- `=` simple assignment

## Simple assignment `=`

```c
int edad;
edad = 18;
```

Here, the `=` operator takes the value `18` and stores it in the variable `edad`.

This is VERY IMPORTANT: in programming, `=` doesn't mean the same thing as in school math.

In C:

```c
edad = 18;
```

doesn't mean "age equals 18" as an abstract statement, but rather:

> store 18 inside the variable `edad`

## Assignment using the variable's previous value

```c
int edad = 18;
edad = edad + 1;
```

This can be read as:

1. take the current value of `edad`
2. add `1` to it
3. store the result back in `edad`

At the end, `edad` is `19`.

## Combined assignment operators

In addition to `=`, there are widely used shorthand forms:

- `+=`
- `-=`
- `*=`
- `/=`
- `%=`

### `+=`

```c
int puntos = 10;
puntos += 5;
```

Equivalent to:

```c
puntos = puntos + 5;
```

### `-=`

```c
int stock = 20;
stock -= 3;
```

Equivalent to:

```c
stock = stock - 3;
```

### `*=`

```c
int valor = 4;
valor *= 2;
```

Equivalent to:

```c
valor = valor * 2;
```

### `/=`

```c
int numero = 20;
numero /= 4;
```

Equivalent to:

```c
numero = numero / 4;
```

### `%=`

```c
int resto = 10;
resto %= 3;
```

Equivalent to:

```c
resto = resto % 3;
```

## What are relational operators?

Relational operators are used to **compare values**.

They're used to answer questions like:

- is it equal?
- is it different?
- is it greater?
- is it less?

The main ones are:

- `==` equal to
- `!=` not equal to
- `>` greater than
- `<` less than
- `>=` greater than or equal to
- `<=` less than or equal to

## Examples of relational operators

```c
edad == 18
edad != 18
nota > 6
precio < 1000
cantidad >= 10
cantidad <= 20
```

Although you'll use them later in structures like decisions, for now the important thing is to understand the meaning of each comparison.

## Difference between `=` and `==`

This is one of the most common mistakes when starting.

- `=` assigns a value
- `==` compares two values

Look at the difference:

```c
edad = 18;
```

That assigns.

```c
edad == 18
```

That compares.

Don't confuse these two things because they completely change the meaning of the code.

## What are logical operators?

Logical operators allow combining or modifying relational expressions.

The most important ones are:

- `&&` means "and"
- `||` means "or"
- `!` means "not" or negation

## Logical operator `&&`

Used when you want two expressions to be true at the same time.

```c
edad >= 18 && edad <= 65
```

The conceptual idea is:

- the first comparison must hold
- and the second one too

## Logical operator `||`

Used when at least one of the expressions needs to be true.

```c
letra == 'a' || letra == 'A'
```

## Logical operator `!`

Used to negate an expression.

```c
!(edad == 18)
```

This expresses the negation of that comparison.

## Important: for now understand the meaning, don't get ahead

Relational and logical operators are heavily used together with decision statements.

But there's NO need to get ahead of that lesson.

At this stage, the important thing is that you understand what each operator means and what kind of conceptual result a comparison or logical combination produces.

## Operator precedence

When an expression has several operators, it's not always evaluated strictly left to right.

There's a **precedence order**, that is, a priority order.

Think of it like the rules of a math problem.

For example, in math you know multiplication has priority over addition.

In C, something similar happens.

## Simplified general rule for beginners

Without getting into all the advanced rules yet, you can start with this general order:

1. parentheses `()`
2. arithmetic operators like `*`, `/`, `%`
3. arithmetic operators like `+`, `-`
4. relational operators like `>`, `<`, `>=`, `<=`
5. equality operators like `==`, `!=`
6. logical operator `&&`
7. logical operator `||`
8. assignment `=` and combined assignment operators

This simplified version works very well for starting to read expressions.

## Precedence example

```c
int resultado = 2 + 3 * 4;
```

First it resolves:

```c
3 * 4
```

Then:

```c
2 + 12
```

Therefore, `resultado` is `14`.

## Using parentheses for clarity

If you want to make an expression clearer, use parentheses.

```c
int resultado = (2 + 3) * 4;
```

Now it resolves:

```c
2 + 3
```

And then multiplies by `4`.

The result will be `20`.

Parentheses aren't just for changing the order. They also help make the code clearer to read.

## Common mistakes when starting

### 1. Confusing `=` with `==`

It's the classic beginner error.

- `=` assigns
- `==` compares

### 2. Forgetting precedence

```c
int resultado = 2 + 3 * 4;
```

If you assume this gives `20`, you're wrong.

### 3. Believing division always keeps decimals

```c
int resultado = 5 / 2;
```

With integers, that result doesn't keep the decimal part.

### 4. Using operators without thinking about the data type

The data type influences the operation and the result.

### 5. Writing overly confusing expressions

When an expression starts looking tangled, parentheses help a lot to make the intent explicit.

## Summary

- an **operator** is a symbol that represents an action on values
- mathematical operators allow calculations
- relational operators allow comparing values
- logical operators allow combining or negating comparisons
- assignment operators allow storing results in variables
- `=` and `==` don't mean the same thing
- **precedence** defines the order in which operators are evaluated
- parentheses help control and clarify that order

## Final thought

Operators are the internal language you use to start building more powerful expressions.

But careful: it's not just about memorizing symbols.

It's about understanding:

- what each operator does
- which data types it makes sense to use it with
- what result it produces
- in what order it acts within an expression

If that's clear, then the more complex structures become MUCH easier to understand.
